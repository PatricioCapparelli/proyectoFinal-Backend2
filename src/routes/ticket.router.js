import { Router } from "express";
import ticketsController from "../controllers/ticket.controller.js";
import handlePolice from "../middlewares/handle-policies.js";

const router = Router();

router.get("/", handlePolice(["admin"]), async (req, res) => {
  try {
    const allTickets = await ticketsController.findAll();

    res.status(200).json({ status: "success", payload: allTickets });
  } catch (e) {
    res.status(500).json({ status: "error", code: 500, message: e.message });
  }
});

router.get("/:id", handlePolice(["admin"]), async (req, res) => {
  const id = req.params.id;

  try {
    const product = await ticketsController.findOneById(id);

    res.status(200).json({ status: "success", payload: product });
  } catch (e) {
    res.status(500).json({ status: "error", code: 500, message: e.message });
  }
});


router.post("/:id", handlePolice(["admin"]), async (req, res) => {
  const id = req.params.id;
  const newData = req.body;
  try {
    const product = await ticketsController.updateOneById(id, newData);

    res.status(200).json({ status: "success", payload: product });
  } catch (e) {
    res.status(500).json({ status: "error", code: 500, message: e.message });
  }
});


router.delete("/:id", handlePolice(["admin"]), async (req, res) => {
  const id = req.params.id;
  try {
    const result = await ticketsController.deleteOneById(id);

    res.status(200).json({ status: "success", payload: result });
  } catch (e) {
    res.status(500).json({ status: "error", code: 500, message: e.message });
  }
});

export default router;
