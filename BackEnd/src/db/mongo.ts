import mongoose from "mongoose";

export const connectDB = async () => {
  const remoteUri = process.env.DB_URL || process.env.MONGO_URI;

  if (!remoteUri) {
    throw new Error("No MongoDB Atlas URI found in env (DB_URL / MONGO_URI). Refusing to start.");
  }

  const tryConnect = async (uri: string): Promise<boolean> => {
    try {
      await mongoose.connect(uri);
      console.log("Connected to MongoDB Atlas");
      return true;
    } catch (error) {
      console.error("Failed to connect to MongoDB Atlas:", (error as Error).message || error);
      return false;
    }
  };

  let attempt = 0;
  const retryDelayMs = 5000;
  const maxAttempts = 5;

  // Atlas only — never fall back to a local MongoDB instance.
  while (attempt < maxAttempts) {
    attempt += 1;

    const ok = await tryConnect(remoteUri);
    if (ok) return;

    console.error(`Attempt ${attempt}: Could not connect to MongoDB Atlas. Retrying in ${retryDelayMs / 1000}s...`);
    await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
  }

  throw new Error(`Could not connect to MongoDB Atlas after ${maxAttempts} attempts`);
};
