// frontend/EventServices.ts
import axios from "axios";

const BASE_URL = "http://localhost:5000/api/events"; // <-- your backend API route

export const getEvents = async () => {
  try {
    const response = await axios.get(BASE_URL); // fetch from backend
    return response.data; // this will be the events array from MongoDB
  } catch (error) {
    console.error("Error fetching events:", error);
    return []; // return empty array on error
  }
};
