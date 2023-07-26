// Import required modules
const express = require('express');  // Import the Express framework
const router = express.Router();    // Create an instance of the Express router
const ObjectId = require('mongoose').Types.ObjectId;  // Import the ObjectId class from the Mongoose library
const { Inventory } = require('../models/inventory');  // Import the Inventory model from the '../models/inventory' file

// Define a route for retrieving all inventory items
router.get('/', async (req, res) => {
  try {
    const docs = await Inventory.find();  // Find all inventory items in the database
    res.send(docs);  // Send the retrieved items as a response
  } catch (err) {
    console.log('error in retrieving inventory items: ' + err);  // Log any errors that occur during the retrieval process
  }
});

// Define a route for retrieving a specific inventory item by ID
router.get('/:id', async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {  // Check if the provided ID is a valid ObjectId
    return res.status(400).send(`No record with given id : ${req.params.id}`);  // If not, send a 400 error response
  }

  try {
    const doc = await Inventory.findById(req.params.id);  // Find the inventory item with the specified ID
    res.send(doc);  // Send the retrieved item as a response
  } catch (err) {
    console.log('Error in retrieving item: ' + err);  // Log any errors that occur during the retrieval process
  }
});

// Define a route for updating an inventory item by ID
router.put('/:id', async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {  // Check if the provided ID is a valid ObjectId
    return res.status(400).send(`No record with given id : ${req.params.id}`);  // If not, send a 400 error response
  }

  const item = {
    itemId: req.body.id,
    itemName: req.body.itemName,
    upcCode: req.body.upcCode,
    description: req.body.description,
    onHand: req.body.onHand,
    costPrice: req.body.costPrice,
    sellingPrice: req.body.sellingPrice,
  };  // Create an object containing the updated item data

  try {
    const doc = await Inventory.findByIdAndUpdate(
      req.params.id,
      { $set: item }, // update operation that sets the fields of the document to the values specified in the item object.
      { new: true } // tells mongoose to return the updated document as the result
    );  // Find the inventory item with the specified ID and update its data with the provided values
    res.send(doc);  // Send the updated item as a response
  } catch (err) {
    console.log('Error in item update: ' + err);  // Log any errors that occur during the update process
  }
});

// Define a route for deleting an inventory item by ID
router.delete('/:id', async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {  // Check if the provided ID is a valid ObjectId
    return res.status(400).send(`No record with given id : ${req.params.id}`);  // If not, send a 400 error response
  }

  try {
    const doc = await Inventory.findByIdAndRemove(req.params.id);  // Find the inventory item with the specified ID and remove it from the database
    res.send(doc);  // Send the deleted item as a response
  } catch (err) {
    console.log('Error in item delete: ' + err); // Log any errors that occur during the deletion process
  }
});

// Define a route for creating a new inventory item
router.post('/', async (req, res) => {
  const item = new Inventory({
    itemId: req.body.id,
    itemName: req.body.itemName,
    upcCode: req.body.upcCode,
    description: req.body.description,
    onHand: req.body.onHand,
    costPrice: req.body.costPrice,
    sellingPrice: req.body.sellingPrice,
  });  // Create a new instance of the Inventory model using the provided data

  try {
    const doc = await item.save();  // Save the new inventory item to the database
    res.send(doc);  // Send the saved item as a response
  } catch (err) {
    console.log('Error in item save: ' + err);  // Log any errors that occur during the saving process
  }
});

module.exports = router;  // Export the router module for use in other files
