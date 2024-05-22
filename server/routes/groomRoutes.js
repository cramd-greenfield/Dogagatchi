const { Router } = require('express');
const { User, Dog, Groom } = require('../db');

const router = Router();

// Get user's dogs
router.get('/:userId', (req, res) => {
  const { userId } = req.params;
  Dog.find({ owner: userId })
    // .where()
    .then((dogsArray) => {
      User.findById(userId).then(() => {
        res.status(200).send({ dogsArray });
      });
    })
    .catch((err) => {
      console.error('SERVER ERROR: failed to GET dog by userId', err);
      res.sendStatus(500);
    });
});

router.get('/', (req, res) => {
  const { groomId } = req.params;
  Groom.find({ groom: groomId }).then((groomData) => {
    res.status(200).send(groomData);
  });
});

router.post('/', (req, res) => {
  const { isSubscribed } = req.body;
  const status = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

  Groom.create({
    isSubscribed,
    feedDeadline: status,
    walkDeadline: status,
  })
    .then(() => {
      return User.findByIdAndUpdate(
        owner,
        { $inc: { coinCount: -15, dogCount: -1 }, $pull: { breeds: img } },
        { new: true }
      ).catch((err) => {
        console.error('SERVER ERROR: failed to UPDATE user', err);
        res.sendStatus(500);
      });
    })
    .then((updatedUser) => {
      res.status(201).send(updatedUser);
    })
    .catch((err) => {
      console.error('SERVER ERROR: failed to CREATE dog', err);
      res.sendStatus(500);
    });
});

router.post('/', (req, res) => {
  const { groom } = req.body;
  const { subscribe, description, cost } = req.params;
  console.log(req.body);
  Groom.findOne({ id: groom.id })
    .then((data) => {
      if (!data) {
        Groom.create({
          subscribe: subscribe,
          description: description,
          cost: cost,
        }).then(() => res.sendStatus(201));
      } else {
        res.sendStatus(404);
      }
    })
    .catch((err) => {
      console.error('Failed:', err);
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
