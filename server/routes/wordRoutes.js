const express = require('express');
const router = express.Router();
const axios = require('axios');
const { Dog, Word } = require('../db/index');
const { RANDOM_WORD_KEY } = require('../config');

// **************** GET ROUTES ********************

// GET WORDS BY DOG ID

router.get('/:dogId', (req, res) => {
  const { dogId } = req.params;

  // get all words from a specific dog
  Dog.findById(dogId)
    .then((dog) => {
      res.status(200).send(dog.words)
    })
    .catch((err) => {
      console.error('Failed to get dog from db', err);
      res.sendStatus(500);
    })

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
            phonetic: data[0].phonetic,
            meanings: defs,
            dogtionary: false,
            favorite: false,
            used: false,
            dog: dogId
          }

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

// **************** PUT/PATCH ROUTES ********************

// UPDATE WORD BY DOG ID

router.patch('/:dogId/:updateWord', (req, res) => {
  const { dogId, updateWord } = req.params;
  console.log('wordId', updateWord);
  const { update } = req.body;

  // update favorite
  if (update.type === 'favorite') {

    Dog.findById(dogId)
      .then((dog) => {

        for (let i = 0; i < dog.words.length; i++) {
          if (dog.words[i].word === updateWord) {
            dog.words[i].favorite = true;
            return dog.words[i];
          }
        }

      })
      .then((wordObj) => {
        console.log('passed word obj', wordObj);
        Dog.findByIdAndUpdate(dogId, {
          $push: { words: wordObj },
        }, { returnDocument: 'after' })
          .then(() => {
            res.sendStatus(202);
          })
          .catch((err) => {
            console.error('Failed to find dog', err);
            res.sendStatus(500);
          })
      })
      .catch((err) => {
        console.error('Failed to update word to favorite', err);
        res.sendStatus(500);
      })
  } else if (update.type === 'used') { // update used

  }

})

// **************** DELETE ROUTES ********************

// DELETE WORD BY DOG ID

router.delete('/:dogId', (req, res) => {
  const { dogId } = req.params;
  const { wordObj } = req.body;
  console.log('wordObj', wordObj)

  // delete word from dog
  Dog.findByIdAndUpdate(dogId, {
    $pull: { words: wordObj }
  }, { returnDocument: 'after' })
    .then((dog) => {
      res.sendStatus(202);
    })
    .catch((err) => {
      console.error('Failed to delete word', err);
      res.sendStatus(500);
    })

})


module.exports = router;