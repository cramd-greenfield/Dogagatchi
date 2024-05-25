const express = require('express');
const router = express.Router();
const axios = require('axios');
const { Dog, Word } = require('../db/index');
const { RANDOM_WORD_KEY } = require('../config');

// **************** GET ROUTES ********************

// GET WORDS BY DOG ID

router.get('/dog/:dogId', (req, res) => {
  const { dogId } = req.params;

  // get all words associated with specific dog
  Word.find({ dog: dogId })
    .then((words) => {
      res.status(200).send(words);
    })
    .catch((err) => {
      console.error('Failed to get word from db', err);
      res.sendStatus(500);
    })

})

// GET RANDOM WORD WITH DEFINITION

router.get('/randomWord', (req, res) => {

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
            phonetic: data[0].phonetic,
            meanings: defs,
            dogtionary: false,
            favorite: false,
            used: false,
            // dog: dogId
          }

          res.status(200).send(wordObj);
        })
        .catch(() => {
          console.error('Failed to get definition');
          res.sendStatus(500);
        })
    })
    .catch(() => {
      console.error('Failed to get random word');
      res.sendStatus(500);
    })

})


// **************** POST ROUTES ********************

// POST WORD BY DOG ID

router.post('/dogtionary', (req, res) => {
  const { wordObj } = req.body;

  // add word to collection
  Word.create(wordObj)
    .then((wordObj) => {
      res.status(201).send(wordObj);
    })
    .catch((err) => {
      console.error('Failed to add word to db', err);
      res.sendStatus(500);
    })

})

// **************** PUT/PATCH ROUTES ********************

// UPDATE WORD BY DOG ID

router.patch('/:wordId', (req, res) => {
  const { wordId } = req.params;
  console.log('wordId', wordId);
  const { update, favUpdate, dogtionaryUpdate, usedUpdate } = req.body;

  // update favorite
  if (update.type === 'favorite') {

    Word.findByIdAndUpdate(wordId, favUpdate)
      .then(() => { res.sendStatus(202) })
      .catch(() => { res.sendStatus(500)})

  } else if (update.type === 'dogtionary') { // update dogtionary status

    Word.findByIdAndUpdate(wordId, dogtionaryUpdate)
      .then(() => { res.sendStatus(202) })
      .catch(() => { res.sendStatus(500)})

  } else if (update.type === 'used') [ // update used status

    Word.findByIdAndUpdate(wordId, usedUpdate)
      .then(() => { res.sendStatus(202) })
      .catch(() => { res.sendStatus(500)})
  ]

})

// **************** DELETE ROUTES ********************

// DELETE WORD BY DOG ID

router.delete('/:word', (req, res) => {
  const { word } = req.params;

  Word.findOneAndDelete({ word })
    .then(() => { res.sendStatus(202) })
    .catch(() => {
      console.error('Failed to delete word from db')
      res.sendStatus(500);
    });

})


module.exports = router;