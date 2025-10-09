import mongoose from "mongoose";

export async function connect() {
  try {
    mongoose.connect(process.env.MONGO_URI!);
    const connectionInstance = mongoose.connection;

    connectionInstance.on("connected", () => {
      console.log("MONGODB CONNECTED !!!");
    });

    connectionInstance.on("error", (err) => {
      console.log("MONGODB CONNECTION FAILED: " + err);
      process.exit();
    });
  } catch (error) {
    console.log("Something goes wrong!");
    console.log(error);
  }
}
