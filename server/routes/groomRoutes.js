const { Router } = require('express');
const { User, Dog } = require('../db');

const router = Router();

// Get user's Groomed dogs
router.get('/:userId', (req, res) => {
  Dog.find({ isGroomed: true })
    .then((groom) => {
      if (groom) {
        res.status(200).send(groom);
      } else {
        console.log('Could not find Groomed Dogs');
        res.sendStatus(404);
      }
    })
    .catch((err) => {
      console.error('failed to GET dog by userId', err);
      res.sendStatus(500);
    });
});

// buy dog  from shop with subscription
router.post('/member', (req, res) => {
  const { name, img, userId, owner } = req.body;
  const status = new Date('3000-12-31T23:59:00Z');

  Dog.create({
    name,
    img,
    owner,
    feedDeadline: status,
    walkDeadline: status,
    isGroomed: true,
  })
    .then(() => {
      User.findByIdAndUpdate(
        userId,
        { $inc: { coinCount: -185, dogCount: -1 }, $pull: { breeds: img } },
        { new: true }
      ).catch((err) => {
        console.error('Failed to UPDATE user', err);
        res.sendStatus(500);
      });
    })
    .then((updatedUser) => {
      res.status(201).send(updatedUser);
    })
    .catch((err) => {
      console.error('Failed to CREATE dog', err);
      res.sendStatus(500);
    });
});

// change to isGroomed to create subscription
router.patch('/:dogId', (req, res) => {
  const { owner } = req.body;
  const { dogId } = req.params;
  const status = new Date('3000-12-31T23:59:00Z');

  Dog.findByIdAndUpdate(dogId, {
    $set: { isGroomed: true, feedDeadline: status, walkDeadline: status },
  })
    .then(() => {
      User.findByIdAndUpdate(
        owner,
        { $inc: { coinCount: -200 } },
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

router.delete('/unsubscribe', (req, res) => {
  const { _id } = req.params;

  Dog.findByIdAndRemove(_id)
    .then((deletedSub) => res.status(200).send(deletedSub))
    .catch((err) => {
      console.error('delete user ERROR server', err);
      res.sendStatus(500);
    });
});

module.exports = router;
