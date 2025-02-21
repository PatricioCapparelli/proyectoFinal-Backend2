import passport from "passport";
import { authToken } from "../utils/jwt.js";
import User from "../dao/classes/users.dao.js";
import { generateToken } from "../utils/jwt.js";
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
  passport.authenticate('register', async (err, user, info) => {

    if (err) {
      return res.status(500).json({ message: 'Error al registrarse', error: err });
    }
    if (!user) {
      return res.status(400).json({ message: info.message || 'No se proporcionó un usuario' });
    }

    const token = generateToken(user);
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 360000
    });
    return res.status(200).json({ message: 'Usuario creado exitosamente', token });
  })(req, res);
};

export const getCurrentUser =  async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "No se pudo encontrar el usuario autenticado" });
      }
      res.status(200).json({ status: "success", payload: req.user });
    } catch (error) {
      return res.status(500).json({ status: "Error", message: error.message });
    }
  };

export const loginUser = async (req, res, next) => {
    passport.authenticate('login', (err, user, info) => {
      const token = generateToken(user);
      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 36000
      });
      if (err) {
        return res.status(500).json({ message: 'Error al iniciar sesión', error: err });
      }
      if (!user) {
        return res.status(400).json({ message: info.message || 'Error desconocido' });
      }
      return res.status(200).json({ message: 'Usuario logueado exitosamente', token });
    })(req, res, next);
};
