import * as bcrypt from 'bcrypt';

export default async (password: string, hash: string): Promise<boolean> => {
    const validation = await bcrypt.compare(password, hash);
    return validation;
}