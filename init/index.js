const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/HospitalManagementSystem";

// DB connection
main().then(() => {
    console.log("Connected to DB");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    // Clear any existing data in the Listing collection
    await Listing.deleteMany({});

    
      
    
    // Insert the new data
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
}

// Run the function
initDB();
