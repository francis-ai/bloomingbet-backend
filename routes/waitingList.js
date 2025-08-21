import express from "express";
import { addToWaitingList, getWaitingList } from "../controllers/waitingList.js";

const router = express.Router();

// POST - Add to waiting list
router.post("/", addToWaitingList);

// GET - Fetch all waiting list entries
router.get("/", getWaitingList);

export default router;
