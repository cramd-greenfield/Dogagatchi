const express = require('express');
const router = express.Router();
const { Dog } = require('../db/index');

// **************** GET ROUTES ********************

// GET WORDS BY DOG ID

router.get('/', (req, res) => {
  
  // this route should get the all words from a specific dog
  // the data sent in response will be used to populate the dogtionary
  //


  res.sendStatus(200);
})

// **************** POST ROUTES ********************

// POST WORD BY DOG ID

router.post('/', (req, res) => {

  // this route should handle adding a word to a specific dog's
  //    word key

})

// **************** PUT/PATCH ROUTES ********************

// UPDATE WORD BY DOG ID

router.put('/', (req, res) => {

  // this route should handle flipping the used boolean to true
  // also handle marking word as a favorite

})

// **************** DELETE ROUTES ********************

// DELETE WORD BY DOG ID

router.delete('/', (req, res) => {

  // this route should handle deleting a word from a specific
  //    dog's dogtionary

})


module.exports = router;