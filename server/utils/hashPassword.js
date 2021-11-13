import bcrypt from "bcryptjs";
import User from "../models/User";

export const { matchPasswords, hashPassword } = {
  matchPasswords: async (password, user) => {
    return await bcrypt.compare(password, user.password);
  },
  hashPassword: async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  },
};
