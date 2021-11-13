import mongoose from "mongoose";

const connectDB = async (MONGO_URI) => {
  try {
    await mongoose.connect(MONGO_URI, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });

    console.log("MongoDB Connected");
  } catch (err) {
    console.log(`Error: ${err.message}`);
  }
};

export default connectDB;
