const { Router } = require('express');
const { User, Dog } = require('../db');

const router = Router();

// Get user's owned dogs and available for purchase
router.get('/:userId', (req, res) => {
  const { userId } = req.params;
  Dog.find({ owner: userId })
    .then((owned) => {
      User.findById(userId)
        .then(({ breeds }) => {
          res.status(200).send({ owned, breeds });
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

//get all groomed dogs
router.get('/member/:userId', (req, res) => {
  const { dogId, userId } = req.params;
  console.log(dogId);
  Dog.find({ id: dogId })
    .then(() => {
      User.findById(userId)
        .then(({ groomed }) => {
          res.status(200).send({ groomed });
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

// change to isGroomed to create subscription
router.patch('/:dogId', (req, res) => {
  const { img, owner, url } = req.body;
  const { dogId } = req.params;
  const status = new Date('3000-12-31T23:59:00Z');

  console.log(status);
  Dog.findByIdAndUpdate(dogId, {
    $set: { isGroomed: true, feedDeadline: status, walkDeadline: status },
  })
    .then(() => {
      return User.findByIdAndUpdate(
        owner,
        {
          $inc: { coinCount: -200 },
          $push: { groomed: url },
        },
        { new: true }
      ).catch((err) => {
        console.error('Failed to UPDATE user', err);
        res.sendStatus(500);
      });
    })
    .then((updated) => {
      res.status(201).send(updated);
    })
    .catch((err) => {
      console.error('Failed to CREATE dog', err);
      res.sendStatus(500);
    });
});

router.delete('/groomed/:dogId', (req, res) => {
  //
});

module.exports = router;
