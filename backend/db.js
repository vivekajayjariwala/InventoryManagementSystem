const mongoose = require ('mongoose'); // Import the Mongoose library

// Connect to the mongo database using the URL and password
mongoose.connect("mongodb+srv://vivekajayjariwala:NyUEOCuzdNQYuuQt@inventorymanagementsyst.jdftvvr.mongodb.net/?retryWrites=true&w=majority").then( () => {
  console.log("connected to database!") // Print a message to the console saying if the database successfully connected
})
  .catch( () => {
    console.log('connection failed!') // Print a message to the console saying that the connection failed
});

module.exports = mongoose; // Export the mongoose database for use in other files
