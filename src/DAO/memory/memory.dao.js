export default class UsersMemory {
  constructor() {
    this.users = [];
  }

  async get() {
    return this.users; // Obtener todos los usuarios
  }

  async post(user) {
    this.users.push(user); // Crear un usuario
    return user;
  }
}