const express = require('express');
const router = express.Router();
const { Dog, User } = require('../db/index');

// **************** GET ROUTES ********************

//GET DOG BY USER ID

router.get('/users/:userId', (req, res) => {
  const { userId } = req.params;
  Dog.find()
    .where({ owner: userId })
    .then((dogsArr) => {
      User.findById(userId)
        .then(({ breeds }) => {
          res.status(200).send({ dogsArr, breeds });
        })
        .catch((err) => {
          console.error(
            'SERVER ERROR: failed to GET user breeds list by id',
            err
          );
          res.sendStatus(500);
        });
    })
    .catch((err) => {
      console.error('SERVER ERROR: failed to GET dog by userId', err);
      res.sendStatus(500);
    });
});

//GET DOG BY DOG ID

router.get('/id/:dogId', (req, res) => {
  const { dogId } = req.params;

  Dog.findById(dogId)
    .then((dog) => {
      res.status(200).send(dog);
    })
    .catch((err) => {
      console.error('SERVER ERROR: failed to GET dog by id', err);
      res.sendStatus(500);
    });
});

// **************** POST ROUTES ********************

//POST DOG

router.post('/', (req, res) => {
  const { name, img, owner } = req.body;
  const status = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

  Dog.create({
    name,
    img,
    owner,
    feedDeadline: status,
    walkDeadline: status,

    medicineDeadline: status,

    isGroomed: false,

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

// **************** PUT ROUTES ********************

//PUT BY DOG ID

router.put('/:dogId', (req, res) => {
  const { dogId } = req.params;
  const { status, cost } = req.body;

  Dog.findByIdAndUpdate(dogId, status, { returnDocument: 'after' })
    .then((updatedDog) => {
      if (updatedDog && cost === -3) {
        User.findByIdAndUpdate(
          updatedDog.owner,
          { $inc: { coinCount: cost } },
          { new: true }
        )
          .then((updatedUser) => {
            res.status(200).send(updatedUser);
          })
          .catch((err) => {
            console.error(
              'SERVER ERROR: failed to UPDATE user coins by id',
              err
            );
            res.sendStatus(500);
          });
      } else if (updatedDog) {
        User.findById(updatedDog.owner)
          .then((updatedUser) => {
            res.status(200).send(updatedUser);
          })
          .catch((err) => {
            console.error(
              'SERVER ERROR: failed to UPDATE user coins by id',
              err
            );
            res.sendStatus(500);
          });
      } else {
        res.sendStatus(404);
      }
    })
    .catch((err) => {
      console.error('SERVER ERROR: failed to UPDATE dog status by id', err);
      res.sendStatus(500);
    });
});

/*********************** PUT REQUEST FOR TRADE *************************************/
router.put('/trade', (req, res) => {
  const { userId, ownedDogId, non_ownedDog } = req.body;

  // Find the user who owns the dog being traded
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      // Convert user.ownedDogs to a JavaScript array
      const ownedDogsArray = Array.from(user.ownedDogs);

      // Find the index of the owned dog being traded
      const index = ownedDogsArray.indexOf(ownedDogId);
      if (index === -1) {
        return res.status(404).send({ message: "Owned dog not found" });
      }

      // Remove the owned dog from the array
      ownedDogsArray.splice(index, 1);

      // Find the dog object based on its image URL from the database
      Dog.findOne({ img: non_ownedDog })
        .then((foundDog) => {
          if (!foundDog) {
            return res.status(404).send({ message: "Non-owned dog not found" });
          }

          // Add the found dog to the user's owned dogs array
          ownedDogsArray.push(foundDog._id);

          // Update the user's ownedDogs field with the modified array
          user.ownedDogs = ownedDogsArray;

          // Save the updated user
          user.save()
            .then(() => {
              // Delete the traded dog from the database
              Dog.findByIdAndDelete(ownedDogId)
                .then(() => {
                  // Respond with success message
                  res.status(200).send({ message: "Dog traded successfully" });
                })
                .catch((error) => {
                  console.error("Error deleting traded dog:", error);
                  res.status(500).send({ message: "Error trading dog" });
                });
            })
            .catch((error) => {
              console.error("Error saving updated user:", error);
              res.status(500).send({ message: "Error trading dog" });
            });
        })
        .catch((error) => {
          console.error("Error finding non-owned dog:", error);
          res.status(500).send({ message: "Error trading dog" });
        });
    })
    .catch((error) => {
      console.error("Error finding user:", error);
      res.status(500).send({ message: "Error trading dog" });
    });
});

// **************** DELETE ROUTES ********************

// DELETE ALL DOGS BY USER ID
router.delete('/all/:ownerId', (req, res) => {
  const { ownerId } = req.params;

  Dog.deleteMany({ owner: ownerId })
    .then((deleted) => {
      console.log(deleted);
      res.sendStatus(200);
    })
    .catch((err) => {
      console.error('deleted all dogs by user ERROR', err);
    });
});

//DELETE BY DOG ID
router.delete('/:dogId', (req, res) => {
  const { dogId } = req.params;

  Dog.findByIdAndDelete(dogId)
    .then((deletedDog) => {
      if (deletedDog) {
        return res.status(200).send(deletedDog);
      } else {
        res.sendStatus(404);
      }
    })
    .catch((err) => {
      console.error('SERVER ERROR: failed to DELETE dog by id', err);
      res.sendStatus(500);
    });
});

module.exports = router;
