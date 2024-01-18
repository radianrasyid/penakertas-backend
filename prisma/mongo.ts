import mongoose from "mongoose";

const mongoURI = "mongodb://localhost:27017";
mongoose.connect(mongoURI);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongodb connection error"));
