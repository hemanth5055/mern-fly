import { connect } from "mongoose";
import { config } from "dotenv";
config();

export const connectDB = async () => {
  try {
    const result = await connect(process.env.DB_URI);
    console.log("Connected to DB ✅");
  } catch (error) {
    console.log("Error connecting to DB : ", error.message);
  }
};
