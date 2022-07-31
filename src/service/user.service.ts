import { DocumentDefinition } from 'mongoose';
import UserModel, { UserDocument } from '../models/user.model';

export async function createUser(input: DocumentDefinition<Omit<UserDocument, 'crypto' | 'fiat' | 'createdAt' | 'updatedAt' | 'comparePassword'>>) {
    try {
        return await UserModel.create(input);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
        throw new Error(e);
    }
}