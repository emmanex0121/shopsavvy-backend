import mongoose from "mongoose";
import config from "../config.js";

export default () => {
  mongoose
    .connect(config.connectionstring)
    .then(() => {
      console.log("Database Connection Established");
    })
    .catch((error) => {
      console.log("Database Connection Failed: ", error);
    });
};
