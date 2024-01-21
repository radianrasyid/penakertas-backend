import mongoose from "mongoose";

const mongoURI =
  "mongodb://radianrasyid:200875@ac-r1sl4kb-shard-00-00.5dev2vt.mongodb.net:27017,ac-r1sl4kb-shard-00-01.5dev2vt.mongodb.net:27017,ac-r1sl4kb-shard-00-02.5dev2vt.mongodb.net:27017/?replicaSet=atlas-dfndoh-shard-0&ssl=true&authSource=admin";
mongoose.connect(mongoURI);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongodb connection error"));
