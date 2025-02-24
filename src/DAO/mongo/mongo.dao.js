import UserModel from "../models/users.model.js";

export default class UsersMongo {
  async get() {
    return await UserModel.find();
  }

  async post(user) {
    return await UserModel.create(user);
  }
}