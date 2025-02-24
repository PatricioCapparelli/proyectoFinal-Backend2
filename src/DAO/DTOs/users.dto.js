export default class UsersDTO {
  constructor(user) {
    this.name = user.nombre;
    this.last_name = user.apellido;
    this.age = user.edad;
    this.email = user.correo;
    this.role = user.rol;
  }
}
