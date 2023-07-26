const mongoose = require('mongoose');  // Import the Mongoose library

// Create a Mongoose model named "Inventory" with the specified schema
const Inventory = mongoose.model('Inventory', {
  itemId: { type: String },         // Define the "itemId" field as a string type
  itemName: { type: String },       // Define the "itemName" field as a string type
  upcCode: { type: String },        // Define the "upcCode" field as a string type
  description: { type: String },    // Define the "description" field as a string type
  onHand: { type: String },         // Define the "onHand" field as a string type
  costPrice: { type: String },      // Define the "costPrice" field as a string type
  sellingPrice: { type: String }    // Define the "sellingPrice" field as a string type
});

module.exports = { Inventory };  // Export the "Inventory" model for use in other files
