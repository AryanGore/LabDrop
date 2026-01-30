import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  ownerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true 
},
  storageKey: { 
    type: String, 
    required: true 
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

module.exports = mongoose.model("File", fileSchema);
