import User from "../DAO/classes/users.dao.js";
import UsersRepository from "./users.repository.js";

export const usersService = new UsersRepository(new User());