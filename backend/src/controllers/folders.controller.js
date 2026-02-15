import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Folder } from "../models/folder.model.js";
import { File } from "../models/file.model.js";
import mongoose from "mongoose";

export const createFolder = asyncHandler(async (req, res) => {
    const { name, parentFolder } = req.body;

    if (!name || name.trim() === "") {
        throw new ApiError(400, "Folder Name is required.");
    }

    const existingFolder = await Folder.findOne({
        name,
        owner: req.user?._id,
        parentFolder: parentFolder || null
    })

    if (existingFolder) {
        throw new ApiError(409, "Folder with Same Name Already exists on this Path.");
    }

    let path = "/";

    if (parentFolder) {
        const parentFolderdoc = await Folder.findById(parentFolder);
        if (!parentFolderdoc) {
            throw new ApiError(404, "Folder Not Found.");
        }

        path = parentFolderdoc.path + parentFolderdoc.name + "/"
    }

    const createdFolder = await Folder.create({
        name,
        owner: req.user?._id,
        parentFolder: parentFolder || null,
        path
    });

    return res.status(201).json(
        new ApiResponse(201, createdFolder, "Successfully Created Folder.")
    )
})

export const getFolderContents = asyncHandler(async (req, res) => {
    const { folderId } = req.params;
    const userId = req.user?._id;

    const [folders, files] = await Promise.all([
        Folder.find({
            owner: userId,
            parentFolder: folderId || null,
            isDeleted: false
        }),

        File.find({
            ownerId: userId,
            folderId: folderId || null,
            status: "ACTIVE"
        })
    ])


    return res.status(200).json(
        new ApiResponse(200, { folders, files }, "Folder Contents Fetched sucessfully.")
    )

})

export const renameFolder = asyncHandler(async (req, res) => {
    const { folderId } = req.params;
    const { newname } = req.body;
    const userId = req.user?._id;

    if (!newname || newname.trim() === "") {
        throw new ApiError(400, "New folder name is required.");
    }

    if (!mongoose.Types.ObjectId.isValid(folderId)) {
        throw new ApiError(400, "Invalid Folder Id");
    }

    // Security: Ensure owner matches and folder exists
    const foundFolder = await Folder.findOne({ _id: folderId, owner: userId });

    if (!foundFolder) throw new ApiError(404, "Folder does not exist or access denied.");

    // Bug Fix: Use findOne. find() returns an array, which is always truthy.
    const nameConflict = await Folder.findOne({
        name: newname,
        parentFolder: foundFolder.parentFolder,
        owner: userId,
        _id: { $ne: folderId } // Ignore self
    });

    if (nameConflict) throw new ApiError(409, "A folder with this name already exists in this location.");

    const oldFolderName = foundFolder.name;
    const parentPath = foundFolder.path; // e.g., "/Projects/"

    // 1. Rename the folder itself
    foundFolder.name = newname;
    await foundFolder.save();

    // 2.Update the path for all child folders
    // If we rename "Work" to "Archive", then "/Work/Project1/" must become "/Archive/Project1/"
    const oldSubPathPrefix = `${parentPath}${oldFolderName}/`;
    const newSubPathPrefix = `${parentPath}${newname}/`;

    // Fetch all folders that are children of this one (any depth)
    const childFolders = await Folder.find({
        owner: userId,
        path: { $regex: `^${oldSubPathPrefix}` }
    });

    if (childFolders.length > 0) {
        const bulkOps = childFolders.map(folder => ({
            updateOne: {
                filter: { _id: folder._id },
                update: {
                    $set: { path: folder.path.replace(oldSubPathPrefix, newSubPathPrefix) }
                }
            }
        }));
        await Folder.bulkWrite(bulkOps);
    }

    return res.status(200).json(
        new ApiResponse(200, foundFolder, "Folder renamed and child paths updated successfully.")
    );
});

export const deleteFolder = asyncHandler(async (req, res) => {
    const { folderId } = req.params;
    const userId = req.user?._id;

    if (!mongoose.Types.ObjectId.isValid(folderId)) {
        throw new ApiError(400, "Invalid Folder Id");
    }

    // 1. Find the target folder
    const targetFolder = await Folder.findOne({ _id: folderId, owner: userId });
    if (!targetFolder) {
        throw new ApiError(404, "Folder not found or access denied.");
    }

    // 2. Define the path prefix for all sub-contents
    // e.g., if we delete "Work", prefix is "/Documents/Work/"
    const folderPathPrefix = `${targetFolder.path}${targetFolder.name}/`;

    // 3. Find IDs of all subfolders (for file deletion later)
    const subFolders = await Folder.find({
        owner: userId,
        path: { $regex: `^${folderPathPrefix}` }
    }).select("_id");

    const folderIdsToDelete = [targetFolder._id, ...subFolders.map(f => f._id)];

    // 4. SOFT DELETE: Update folders
    await Folder.updateMany(
        { _id: { $in: folderIdsToDelete } },
        { $set: { isDeleted: true } }
    );

    // 5. SOFT DELETE: Update files inside all these folders
    await File.updateMany(
        { folderId: { $in: folderIdsToDelete }, ownerId: userId },
        { $set: { status: "DELETED" } }
    );

    return res.status(200).json(
        new ApiResponse(200, null, "Folder and all its contents deleted successfully.")
    );
});


