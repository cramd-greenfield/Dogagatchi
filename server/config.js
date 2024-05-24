require('dotenv').config();

const { RANDOM_WORD_KEY } = process.env;

const { ATLAS_URI } = process.env;

const { GOOGLE_CLIENT_ID } = process.env

const { GOOGLE_CLIENT_SECRET } = process.env

module.exports = {
  RANDOM_WORD_KEY,
  ATLAS_URI,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET
};
