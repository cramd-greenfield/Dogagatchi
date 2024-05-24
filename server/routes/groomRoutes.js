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

//get all groomed // Broken at the moment...
router.get('/groomed/:userId', (req, res) => {
  const { userId } = req.params;
  Dog.find({ owner: userId })
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
  const { img, owner } = req.body;
  const { dogId } = req.params;
  // console.log(req.params);
  const status = new Date(new Date().getTime() + 100000000 * 100000);

  Dog.findByIdAndUpdate(dogId, {
    $set: { isGroomed: true, feedDeadline: status, walkDeadline: status },
  })
    .then(() => {
      return User.findByIdAndUpdate(
        owner,
        {
          $inc: { coinCount: -200 },
          $push: { groomed: img },
        },
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

// router.post('/groomer/:id', (req, res) => {
//   const { name, img, owner } = req.body;
//   const status = new Date(new Date().getTime() + 100000000 * 100000);

//   Dog.create({
//     name,
//     img,
//     owner,
//     feedDeadline: status,
//     walkDeadline: status,
//     isGroomed: false,
//   })
//     .then(() => {
//       return User.findByIdAndUpdate(
//         owner,
//         {
//           $inc: { coinCount: -200, dogCount: -1 },
//           $pull: { breeds: img },
//           $push: { groomed: img },
//         },
//         { new: true }
//       ).catch((err) => {
//         console.error('Failed to UPDATE user', err);
//         res.sendStatus(500);
//       });
//     })
//     .then((updatedUser) => {
//       res.status(201).send(updatedUser);
//     })
//     .catch((err) => {
//       console.error('Failed to CREATE dog', err);
//       res.sendStatus(500);
//     });
// });

router.put('/grooms/:userId', (req, res) => {
  const { userId } = req.params;
  const { coinCount, groomed, img, update } = req.body;

  if (update.type === 'subscribe') {
    User.findByIdAndUpdate(
      userId,
      {
        $set: { coinCount: coinCount.newCount },
        $pull: { owned: img },
        $push: { groomed: img },
      },
      { returnDocument: 'after' }
    )
      .then((updatedUser) => {
        updatedUser ? res.status(200).send(updatedUser) : res.sendStatus(404);
      })
      .catch((err) => console.error('Groom failed to update:', err));
  } else if (update.type === 'deleteSub') {
    User.findByIdAndUpdate(userId, {
      $pull: { groomed: img },
    })
      .then((updatedDoc) => res.status(200).send(updatedDoc))
      .catch((err) => console.error('could not delete Groom', err));
  }
});

router.delete('/grooms', (req, res) => {
  //
});

module.exports = router;
