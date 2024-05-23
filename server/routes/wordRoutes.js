const express = require('express');
const router = express.Router();
const axios = require('axios');
const { Dog } = require('../db/index');
const { RANDOM_WORD_KEY } = require('../config');

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

router.post('/:dogId', (req, res) => {
  const { dogId } = req.params;

  // get word from random word api
  axios
    .get(`https://api.api-ninjas.com/v1/randomword`, {
      headers: {
        'X-Api-Key': RANDOM_WORD_KEY,
      }
    })
    .then(({ data }) => {
      const { word } = data;

      axios
        .get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
        .then(({ data }) => {

          const defs = data[0].meanings.map((meaning, i) => {

            // construct meaning object
            const dbMeaning = {
              partOfSpeech: meaning.partOfSpeech,
              definitions: []
            };

            // then insert definitions to it
            meaning.definitions.forEach((def) => {
              dbMeaning.definitions.push(def.definition);
            })

            return dbMeaning;

          })

          const wordObj = {
            word,
            meanings: defs,
            favorite: false,
            used: false,
          }

          // add word to dog
          Dog.findByIdAndUpdate(dogId, {
            $push: { words: wordObj },
          }, { returnDocument: 'after' })
            .then((dog) => {
              res.sendStatus(201);
            })
            .catch((err) => {
              console.error('Failed to find dog', err);
              res.sendStatus(500);
            })

        })
        .catch((err) => {
          console.error('Failed to get definition', err);
          res.sendStatus(500);
        })
    })
    .catch((err) => {
      console.error('Failed to get random word', err);
      res.sendStatus(500);
    })

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