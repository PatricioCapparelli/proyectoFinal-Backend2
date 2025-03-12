import UserDAO from '../DAO/classes/users.dao.js';
import UserDTO from '../DAO/DTOs/users.dto.js';

export default class UsersRepository {
  constructor() {
    this.userDAO = new UserDAO();
  }

  async getUsers() {
    const users = await this.userDAO.getUsers();
    return users.map(user => new UserDTO(user));
  }

  async getUserById(id) {
    const user = await this.userDAO.getUserById(id);
    return user ? new UserDTO(user) : null;
  }

  async createUser(userData) {
    try {
        const newUser = new UserDTO(userData);
        return await this.userDAO.createUser(newUser);
    } catch (error) {
        console.error('Error al crear el usuario:', error);
        throw error;
    }
}

  async getByEmail({email}) {
    const user = await this.userDAO.getByEmail({email});
    return user ? new UserDTO(user) : null;
  }
}