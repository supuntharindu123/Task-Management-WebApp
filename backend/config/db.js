import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Remove deprecated options
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Modern options if needed
      autoIndex: true, // Replace useCreateIndex
      // Don't include useFindAndModify as it's no longer needed
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
