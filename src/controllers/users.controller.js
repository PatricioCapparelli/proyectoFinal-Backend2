import passport from "passport";
import User from "../DAO/classes/users.dao.js";
import { generateToken } from "../utils/jwt.js";
import { usersService } from "../repositories/index.js";
import { createHash } from "../utils/bcrypt.js";

const userService = new User();

export const getUsers = async (req, res) => {
  try {
    const users = await userService.getUsers();
    res.status(200).json({ status: "success", payload: users });
  } catch (error) {
    return res.status(500).json({ status: "Error", error: error.message });
  }
};

export const getUserById = async (req, res) => {
  const { uid } = req.params;
  try {
    const user = await userService.getUserById(uid);
    res.status(200).json({ status: "success", payload: user });
  } catch (error) {
    return res.status(500).json({ status: "Error", error: error.message });
  }
};

export const createUser = async (req, res) => {
  const { email, contraseña, nombre, apellido, rol, edad } = req.body;

  let clave = createHash(contraseña);

  try {
      const userFound = await usersService.getByEmail(email);
      if (userFound) {
          return res.status(400).json({ message: "El usuario ya existe" });
      }

      const newUser = await usersService.createUser({ nombre, apellido, email, edad, clave, rol});
      const token = generateToken(newUser);

      res.cookie("token", token, {
          httpOnly: true,
          maxAge: 3600000,
      });

      return res.status(201).json({
          message: "Usuario creado exitosamente",
          token,
      })
  } catch (error) {
      console.error("Error al registrar el usuario:", error);
      return res.status(500).json({
          message: "Error al procesar la creación del usuario",
          error: error.message,
      });
  }
};


export const getCurrentUser = (req, res) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      console.log("Error de autenticación:", err);
      return res.status(500).json({ message: 'Error de autenticación', error: err });
    }

    if (!user) {
      console.log("Token no válido o vencido");
      return res.status(401).json({ message: 'Token no válido o vencido' });
    }

    console.log("Usuario autenticado:", user);
    return res.status(200).json({ message: 'Usuario autenticado', user });
  })(req, res);
};


export const loginUser = async (req, res, next) => {
  passport.authenticate('login', (err, user, info) => {
    try {
      if (err) {
        return res.status(500).json({ message: 'Error al iniciar sesión', error: err });
      }

      if (!user) {
        return res.status(400).json({ message: info.message || 'Error desconocido' });
      }

      const token = generateToken(user);

      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 36000,
        Credentials: true,
      });

      return res.redirect('/api/views/current');
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  })(req, res, next);
};


export const renderGoogle = (req, res, next) => {
  return passport.authenticate("google", {
    scope: ["profile", "email"],
  })(req, res, next)
}


export const callbackGoogle = (req, res, next) => {
  passport.authenticate("google", { failureRedirect: "/login" }, (err, user, info) => {
    if (err) {
      return next(err)
    };

    if (!user) {
      return res.redirect("/login")
    };

    const token = generateToken(user);

      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 36000,
        Credentials: true,
      });

    return res.redirect('/api/views/current');

  })(req, res, next)
}



export const recoverPass = async (req, res) => {
  const { email } = req.body;
  try {
    const result = await transport.sendMail({
      from: recoverEmail,
      to: email,
      subject: "Recuperar contraseña",
      html: ` <div>
                <h1>Recuperar contraseña</h1>
                <p>HOLA!!, ${email}, INGRESE al link para recuperar su contraseña:</p>
                <a href="www.google.com">Recuperar password</a>
              </div>
              `
    });

    res.status(201).json({ status: "success", payload: result });
  } catch (e) {
    res.status(500).json({ status: "error", message: e.message });
  }
};

export const renderLogin = async (req, res) => {
  res.render("login", { title: "Login" });
};

export const error404 = async (req, res) => {
  res.status(404).render("404error", { title: "error 404" });
};

export const renderHome = async (req, res) => {
  res.render("home", { title: "HOME" });
};

export const renderRegister = async (req, res) => {
  res.render("register", { title: "REGISTER" });
};

export const renderCurrent = async (req, res) => {
  res.render("current", { title: "CURRENT", user: req.user });
};
