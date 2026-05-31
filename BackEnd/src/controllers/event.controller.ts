// backend/controllers/EventController.ts
import { Request, Response, NextFunction } from "express";
import { EventModel } from "../models/EventModel";
import { EventRegistrationModel } from "../models/EventRegistrationModel";

// Get all events
export const getEvents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const events = await EventModel.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    next(err);
  }
};

// Create a new event
export const createEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      title,
      titleSi,
      date,
      time,
      location,
      categoryKey,
      image,
      description,
      descriptionSi,
      price,
      capacity,
      statusKey,
    } = req.body;

    // Validate required fields
    if (!title || !date || !time || !location || !categoryKey) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newEvent = await EventModel.create({
      title,
      titleSi,
      date,
      time,
      location,
      categoryKey,
      image,
      description,
      descriptionSi,
      price,
      capacity,
      statusKey,
    });

    res.status(201).json({ message: "Event created successfully", event: newEvent });
  } catch (err) {
    next(err);
  }
};

// Register for an event
export const registerEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { eventId, fullName, email, phone, numberOfTickets, dietaryPreferences, specialRequirements } = req.body;

    if (!eventId || !fullName || !email || !phone) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    const event = await EventModel.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const registration = await EventRegistrationModel.create({
      eventId,
      fullName,
      email,
      phone,
      numberOfTickets: Number(numberOfTickets),
      dietaryPreferences,
      specialRequirements,
    });

    res.status(201).json({ message: "Registration successful", registration });
  } catch (err) {
    next(err);
  }
};
