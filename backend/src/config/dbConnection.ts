import mongoose from "mongoose";

const connectionToDB = async () => {
  try {
    // connection to the mongodb
    const { connection } = await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:12707"
    );
    if (connection) {
      console.log(`Connected to DB: ${connection.host}`);
    }
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectionToDB;
