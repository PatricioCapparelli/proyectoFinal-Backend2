import UserModel from '../models/users.model.js';

export default class UserDAO {

  async getUsers() {
    try {
      const users = await UserModel.find();
      return users;
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
      throw error;
    }
  }

  async getUserById(id) {
    try {
      const user = await UserModel.findById(id);
      return user;
    } catch (error) {
      console.error('Error al obtener el usuario por ID:', error);
      throw error;
    }
  }

  async createUser(userData) {
    try {
      const newUser = await UserModel.create(userData);
      return newUser;
    } catch (error) {
      console.error('Error al crear el usuariop:', error);
      throw error;
    }
  }

  async getByEmail(email) {
    try {
      const user = await UserModel.findOne({ email });
      return user;
    } catch (error) {
      console.error('Error al obtener el usuario por correo:', error);
      throw error;
    }
  }

  async updateUser(id, userData) {
    try {
      const updatedUser = await UserModel.findByIdAndUpdate(id, userData, { new: true });
      return updatedUser;
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
      throw error;
    }
  }

  async deleteUser(id) {
    try {
      const deletedUser = await UserModel.findByIdAndDelete(id);
      return deletedUser;
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
      throw error;
    }
  }
}