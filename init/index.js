const mongoose = require("mongoose");
const initData = require("./data.js");
const listing = require("../models/listing.js");

const Mongo_url = "mongodb://127.0.0.1:27017/wanderlast";

main()
  .then((res) => {
    console.log("Connected to DB:");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(Mongo_url);
}

const initDb = async () => {
  await listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "677bffa1321487c952175814",
  }));
  await listing.insertMany(initData.data);
  console.log("data was saved");
};
initDb();
