import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Folder } from "../models/folder.model.js";
import { File } from "../models/file.model.js";

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

    // const folders = await 

    // const files = await 

    return res.status(200).json(
        new ApiResponse(200, { folders, files }, "Folder Contents Fetched sucessfully.")
    )

})