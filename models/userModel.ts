import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';
import { generateRefreshToken } from '../services/tokenGeneration';

export interface UserInterface extends Document {
    email: string;
    firstName: string;
    lastName :string;
    role:string;
    password: string;
    token?: string;
    refreshToken: string;
    createdAt: Date;
    updatedAt: Date;
    passwordCheck(password: string): Promise<boolean>;
}

const UserSchema: Schema<UserInterface> = new mongoose.Schema({
    role:{
        type:String,
        required:false,

    },
     firstName: {
        type: String,
        required: false,
    },
    lastName: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },

   

    password: {
        type: String,
        required: true
    },

    refreshToken: {
        type: String,
        unique: true
    },
  

}, {
    timestamps: true
});

UserSchema.pre<UserInterface>('save', async function (next) {
    const user = this;
    if (!user.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(user.password, salt);

        user.password = hash;
        user.refreshToken = generateRefreshToken();

        return next();
    } catch (error) {
        return next();
    }
});

UserSchema.methods.passwordCheck = async function (password: string) {
    try {
        const user = this;
        return await bcrypt.compare(password, user.password);
    } catch (error) {
        throw new Error();
    }
};

const UserModel = mongoose.model<UserInterface>('User', UserSchema);

export default UserModel;
