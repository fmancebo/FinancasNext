import mongoose from "mongoose";
import config from "../config/database";

class Database {
  constructor() {
    this.connect();
  }

  connect() {
    mongoose
      .connect(config.url)
      .then(() => {
        console.log("Database connected successfully");
      })
      .catch((err) => {
        console.error("Database connection error:", err);
      });
  }
}

const databaseInstance = new Database();
export default databaseInstance;
