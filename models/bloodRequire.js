const mongoose = require('mongoose')

const bloodRequireScheme = new mongoose.Schema({
  name: String,
  email: String,
  group: String,
  gender: String,
  phone: String,
  age: Number,
})

// removing _v from mongoose schema and making _id to id (transforming mongoose)
bloodRequireScheme.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('BloodRequire', bloodRequireScheme)
