// 0. Index is the Entry point
// require mongoose after running npm install mongodb
const mongoose = require('mongoose');
const { MongoClient, ServerApiVersion } = require('mongodb');

const { ATLAS_URI } = require('../config');

mongoose
  .connect(`mongodb://127.0.0.1:27017/${ATLAS_URI}`)
  .then(() => console.log('Database connected!'))
  .catch((err) => console.log(err));

// setup schema(s)
const userSchema = new mongoose.Schema({
  username: String,
  password: String, // may be changed with passport implementation
  coinCount: Number, // increments with correct question and decrements to feed play with dog
  questionCount: Number, // increments with correct answer and stays
  dogCount: Number, // increments when dogogatchi is creates and decrements if dogogatchi is deleted
  breeds: [String], // array of image strings that are correctly answered
  achievements: [{ name: String, image: String, description: String }],
  meals: [
    {
      name: String,
      image: String,
      idMeal: Number,
      cost: Number,
      fullTime: String,
    },
  ],
  img: String,
  groomed: [String], // Array of dogs that are subscribed to grooms
});
// creates user docs in the db
const User = mongoose.model('User', userSchema);
// schema for Dogs
const dogSchema = new mongoose.Schema({
  name: String,
  img: String, // breed
  feedDeadline: Date, // timers
  walkDeadline: Date, // timers
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  words: [
    {
      word: String,
      definition: String,
      favorite: Boolean,
      used: Boolean,
    },
  ],
  groom: Boolean,
});

const Dog = mongoose.model('Dog', dogSchema);

// const groomSchema = new mongoose.Schema({
//   isSubscribed: Boolean,
//   cost: Number,
//   dog: { type: mongoose.Schema.Types.ObjectId, ref: 'Dog' },
// });

// const Groom = mongoose.model('Groom', groomSchema);

module.exports = {
  // Groom,
  User,
  Dog,
};
