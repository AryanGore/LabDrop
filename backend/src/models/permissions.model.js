import mongoose from 'mongoose';

const permissionSchema = new mongoose.Schema({
  fileId: { type: mongoose.Schema.Types.ObjectId, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  accessLevel: { type: String, enum: ["OWNER", "READ"], required: true }
});

export const Permission = mongoose.model("Permission", permissionSchema);
