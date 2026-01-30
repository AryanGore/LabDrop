import mongoose from 'mongoose';

const metadataSchema = new mongoose.Schema({
    fileId: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true 
    },
    originalFilename: { 
        type:String
    },

    size: {
        type:Number
    },
    mimeType: {
        type: String
    }
}, 
{
    timestamps: true
});

export const FileMetadata = mongoose.model('FileMetadata', metadataSchema);