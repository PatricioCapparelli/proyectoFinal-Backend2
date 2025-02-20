import usersModel from "../models/users.model.js";

export default class Users{
  getUsers = async () => {
    try {
      const users = await usersModel.find();
      return users;
    } catch (error) {
      console.log(error);
      return null;
    }
  };
  getUserByMail = async (username) => {
    try {
        const user = await usersModel.findOne({
            $or: [
                { email: username },
                { username: username },
            ],
        });
        return user;
    } catch (error) {
        console.log("Error en getUserByMail:", error);
        return null;
    }
};
  getUserByGoogle = async (profile) => {
    try {
      const user = await usersModel.findOne({ email: profile.emails[0]?.value });
      return user;
    } catch (error) {
      console.log(error);
      return null;
    }
  };
  getUserById = async (id) => {
    try {
      const user = await usersModel.findOne({ _id: id });
      return user;
    } catch (error) {
      console.log(error);
      return null;
    }
  };
  createUser = async (user) => {
    try {
      const result = await usersModel.create(user);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  };
  updateUser = async (id, user) => {
    try {
      const result = await usersModel.updateOne({ _id: id }, { $set: user });
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  };
}
