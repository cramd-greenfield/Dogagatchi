const { Router } = require('express');
const { User, Dog, Groom } = require('../db');

const router = Router();

// Get user's dogs
router.get('/:userId', (req, res) => {
  const { userId } = req.params;
  Dog.find({ owner: userId })
    .then((groomed) => {
      User.findById(userId)
        .then(({ breeds }) => {
          res.status(200).send({ groomed, breeds });
        })
        .catch((err) => {
          console.error('Owner does not have any dogs:', err);
        });
    })
    .catch((err) => {
      console.error('failed to GET dog by userId', err);
      res.sendStatus(500);
    });
});

// Get all dogs with a valid GroomId set to true
router.get('/', (req, res) => {
  const { groomId } = req.params;
  Dog.find({ groom: groomId })
    .then((groomData) => {
      if (groomId) {
        res.status(200).send(groomData);
      } else {
        console.log('Dog does not have Groom subscription');
        res.sendStatus(404);
      }
    })
    .catch((err) => console.error('failed to get Groomed dogs:', err));
});

// Subscribing from the shop
router.post('/groomer', (req, res) => {
  const { name, img, owner } = req.body;

  Dog.create({
    name,
    img,
    owner,
    feedDeadline: { $limit: 0 },
    walkDeadline: { $limit: 0 },
  })
    .then(() => {
      return User.findByIdAndUpdate(
        owner,
        { $inc: { coinCount: -200, dogCount: -1 }, $pull: { breeds: img } },
        { new: true }
      )
        .then((updatedUser) => {
          res.status(201).send(updatedUser);
        })
        .catch((err) => {
          console.error('Failed to update user:', err);
          res.sendStatus(500);
        });
    })
    .catch((err) => {
      console.error('Failed to CREATE dog Groom', err);
      res.sendStatus(500);
    });
});

router.patch('/grooms', (req, res) => {
  //
});

router.delete('/grooms', (req, res) => {
  //
});

module.exports = router;
