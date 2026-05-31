// backend/routes/event.routes.ts
import { Router } from "express";
import { createEvent, getEvents, registerEvent } from "../controllers/event.controller";

const router = Router();

// GET all events
router.get("/", getEvents);

// POST new event
router.post("/", createEvent);

// POST register for event
router.post("/register", registerEvent);

export default router;
