import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },

    passwordHash: {
        type: String,
        required: true,
    },

    refreshToken: {
        type: String,
    }
},
    {
        timestamps: true
    })

userSchema.pre('save', async function () {
    if (!this.isModified('passwordHash')) return;
    if (!this.passwordHash) return;

    this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
})

userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.passwordHash);
}

export const User = mongoose.model("User", userSchema);