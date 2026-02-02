import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  folderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Folder",
    default: null
  },

  storageKey: {
    type: String,
    required: true
  },

  name: {
    type: String,
    required: true
  },

  size: {
    type: Number
  },

  mimeType: {
    type: String
  },

  status: {
    type: String,
    enum: ["ACTIVE", "DELETED"],
    default: "ACTIVE"
  }
},
  {
    timestamps: true
  });

export const File = mongoose.model("File", fileSchema);
