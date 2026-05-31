import mongoose from "mongoose";

export const connectDB = async () => {
  const remoteUri = process.env.DB_URL || process.env.MONGO_URI;
  const localUri = "mongodb://127.0.0.1:27017/mayans_ecom";

  const tryConnect = async (uri: string, label = ""): Promise<boolean> => {
    try {
      await mongoose.connect(uri);
      console.log(`Connected to MongoDB${label ? ` (${label})` : ""}`);
      return true;
    } catch (error) {
      console.error(`Failed to connect to MongoDB${label ? ` (${label})` : ""}:`, (error as Error).message || error);
      return false;
    }
  };

  let attempt = 0;
  const retryDelayMs = 5000;
  const maxAttempts = 5;

  // Try multiple times, then give up and throw so the caller can decide what to do.
  while (attempt < maxAttempts) {
    attempt += 1;

    if (remoteUri) {
      const ok = await tryConnect(remoteUri, "remote");
      if (ok) return;
      console.warn("Remote MongoDB connection failed. Will try local MongoDB fallback.");
    } else {
      console.warn("No remote MongoDB URI found in env (DB_URL / MONGO_URI). Trying local MongoDB...");
    }

    const okLocal = await tryConnect(localUri, "local");
    if (okLocal) return;

    console.error(`Attempt ${attempt}: Could not connect to any MongoDB instance. Retrying in ${retryDelayMs/1000}s...`);
    await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
  }

  throw new Error(`Could not connect to MongoDB after ${maxAttempts} attempts`);
};
