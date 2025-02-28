export default class UsersDTO {
  constructor(user) {
      this.name = user.nombre;
      this.last_name = user.apellido;
      this.email = user.email;
      this.age = user.edad;
      this.password = user.clave;
      this.role = user.rol;
  }
}