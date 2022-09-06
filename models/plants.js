const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PlantSchema = new Schema(
  {
    name: {type: String, required: true, maxLength: 100},
    description: {type: String, required: true, maxLength: 300},
    category: {type: String},
    price: {type: Number, required: true},
    stock: {type: Number}
  }
);

// Virtual for plant's URL
PlantSchema
  .virtual('url')
  .get(function() { // We don't use an arrow function as we'll need the this object
    return `/catalog/plant/${this._id}`;
  });

//Export model
module.exports = mongoose.model('Plant', PlantSchema);
