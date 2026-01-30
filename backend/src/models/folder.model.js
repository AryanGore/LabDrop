import mongoose from 'mongoose';

const folderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    parentFolder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Folder",
        default: null
    },

    files: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "File",
    }],

    path: {
        type: String,
        default: "/",
        trim: true
    },

    isDeleted: {
        type: Boolean,
        default: false
    }
},

{
    timestamps: true
})

export const Folder = mongoose.model("Folder", folderSchema);