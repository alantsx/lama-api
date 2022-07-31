import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import config from 'config';

export interface UserDocument extends mongoose.Document {
    email: string;
    username: string;
    password: string;
    phone: string;
    crypto: number;
    fiat: number;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    crypto: { type: Number, required: true, default: 0 },
    fiat: { type: Number, required: true, default: 0 }
}, {
    timestamps: true
});

userSchema.pre('save', async function (next) {
    const user = this as UserDocument;

    user.crypto = 0;
    user.fiat = 0;

    if (!user.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(config.get<number>('saltWorkFactor'));

    const hash = await bcrypt.hashSync(user.password, salt);

    user.password = hash;

    return next();
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    const user = this as UserDocument;

    return bcrypt.compare(candidatePassword, user.password).catch(e => false);
};

const UserModel = mongoose.model('User', userSchema);

export default UserModel;