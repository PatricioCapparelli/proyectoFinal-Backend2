import { hashSync, compareSync, genSaltSync } from "bcrypt";

export const createHash = (password) => hashSync(password, genSaltSync(10));

export const isValidPassword = (password, hash) => compareSync(password, hash);