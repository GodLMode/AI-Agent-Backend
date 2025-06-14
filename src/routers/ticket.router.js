import { Router } from "express";
import { verifyJWt } from "../middlewares/auth.middleware.js";
import { createTicket, getTicket, getTickets } from "../controllers/ticket.controller.js";

const router = Router();

router.get("/get-tickets",verifyJWt,getTickets);
router.get("/get-ticket/:id",verifyJWt,getTicket);
router.post("/create-ticket",verifyJWt,createTicket);

export default router;