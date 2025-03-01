import { Router } from "express";
import passport from "passport";
import handlePolice from "../middlewares/handle-policies.js";
import cartsController from "../controllers/cart.controller.js";
import ticketsController from "../controllers/ticket.controller.js";

const router = Router();


router.get(
  "/profile",
  handlePolice(["admin", "user"]),
  passport.authenticate("current", { session: false }),

  (req, res) => {
    try {
      const { user } = req.user;
      res.status(200).json({ status: "success", payload: user });
    } catch (e) {
      res.status(500).json({ status: "error", message: e.message });
    }
  }
);


router.get(
  "/mycart",
  handlePolice(["admin", "user"]),
  passport.authenticate("current", { session: false }),
  async (req, res) => {
    try {
      const { user } = req.user;

      const userCart = await cartsController.findOneByIdPopulate(user.cart);

      res.status(200).json({ status: "success", payload: userCart });
    } catch (e) {
      res.status(500).json({ status: "error", message: e.message });
    }
  }
);

router.post(
  "/mycart/add/:id",
  handlePolice(["admin", "user"]),
  passport.authenticate("current", { session: false }),
  async (req, res) => {
    const productId = req.params.id;
    try {
      const { user } = req.user;

      const updatedCart = await cartsController.addOneProductToCartById(
        user.cart,
        productId
      );

      res.status(200).json({ status: "success", payload: updatedCart });
    } catch (e) {
      res.status(500).json({ status: "error", message: e.message });
    }
  }
);

router.delete(
  "/mycart/delete",
  handlePolice(["admin", "user"]),
  passport.authenticate("current", { session: false }),
  async (req, res) => {
    try {
      const { user } = req.user;

      const updatedCart = await cartsController.deleteAllProductsOnCart(
        user.cart
      );

      res.status(200).json({ status: "success", payload: updatedCart });
    } catch (e) {
      res.status(500).json({ status: "error", message: e.message });
    }
  }
);

router.delete(
  "/mycart/delete/:id",
  handlePolice(["admin", "user"]),
  passport.authenticate("current", { session: false }),
  async (req, res) => {
    const productId = req.params.id;
    try {
      const { user } = req.user;

      const updatedCart = await cartsController.deleteOneProductOnCartById(
        user.cart,
        productId
      );

      res.status(200).json({ status: "success", payload: updatedCart });
    } catch (e) {
      res.status(500).json({ status: "error", message: e.message });
    }
  }
);

router.post(
  "/purchase",
  handlePolice(["admin", "user"]),
  passport.authenticate("current", { session: false }),
  async (req, res) => {
    try {
      const { user } = req.user;

      const newTicket = await ticketsController.createOne(user.cart);

      res.status(200).json({ status: "success", payload: newTicket });
    } catch (e) {
      res.status(500).json({ status: "error", message: e.message });
    }
  }
);

router.post(
  "/logout",
  handlePolice(["admin", "user"]),
  passport.authenticate("current", { session: false }),
  (req, res) => {
    try {
      res.clearCookie("authCookie");

      res.status(200).json({ status: "success" });
    } catch (e) {
      res.status(500).json({ status: "error", message: e.message });
    }
  }
);

export default router;
