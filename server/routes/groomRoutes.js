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

// router.post('/', (req, res) => {
//   const { isSubscribed } = req.body;

//   Groom.create({
//     isSubscribed,
//     feedDeadline: { $limit: 0 },
//     walkDeadline: { $limit: 0 },
//   })
//     .then(() => {
//       return User.findByIdAndUpdate(
//         owner,
//         { $inc: { coinCount: -200 }, $pull: { groomed: img } },
//         { new: true }
//       ).catch((err) => {
//         console.error('SERVER ERROR: failed to UPDATE user', err);
//         res.sendStatus(500);
//       });
//     })
//     .then((updatedUser) => {
//       res.status(201).send(updatedUser);
//     })
//     .catch((err) => {
//       console.error('SERVER ERROR: failed to CREATE dog', err);
//       res.sendStatus(500);
//     });
// });

router.post('/:groomId', (req, res) => {
  const { groomId } = req.body;
  // const { groom } = req.body;
  const { isSubscribed, cost } = req.params;
  // console.log(req.body);
  Dog.findOne({ groom: groomId })
    .then((subscribed) => {
      if (!subscribed) {
        Groom.create({
          isSubscribed,
          cost,
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
