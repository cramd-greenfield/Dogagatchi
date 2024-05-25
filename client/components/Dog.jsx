import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  ProgressBar,
  Card,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import barkSound from "../../server/barking-123909.mp3";

const bark = new Audio(barkSound);

function Dog(props) {
  const { dogObj, setCoins, coins } = props;
  const [dog, setDog] = useState(dogObj);
  const [hungry, setHunger] = useState(true);
  const [happy, setHappy] = useState(false);
  const [health, setHealth] = useState(true);
  const [feedStatus, setFeedStatus] = useState("");
  const [walkStatus, setWalkStatus] = useState("");
  const [healthStatus, setHealthStatus] = useState("");
  const [feedTimer, setFeedTimer] = useState(0);
  const [walkTimer, setWalkTimer] = useState(0);
  const [medicineTimer, setMedicineTimer] = useState(0);
  const [meals, setMeals] = useState([]);
  const [medicines, setMedicines] = useState([]); //useState hook that updates the medicines array
  const user = JSON.parse(sessionStorage.getItem("user"));

  const hungryRef = useRef(null);
  const happyRef = useRef(null);
  const medicineRef = useRef(null);

  useEffect(() => {
    getSignedInUserMeals(user._id);
  }, []);

  useEffect(() => {
    getSignedInUserMedicines(user._id);
  }, []);

  const getDog = () => {
    axios
      .get(`/dog/id/${dog._id}`)
      .then(({ data }) => setDog(data))
      .catch((err) => {
        console.error(err);
      });
  };

  const getSignedInUserMeals = (userIdParam) => {
    axios
      .get(`/user/meals/${userIdParam}`)
      .then(({ data }) => {
        const sortedMeals = data.meals.sort((a, b) =>
          a.name > b.name ? 1 : b.name > a.name ? -1 : 0
        );
        //console.log('meals', sortedMeals)
        setMeals(sortedMeals);
      })
      .catch((err) => console.error("get signed in user ERROR", err));
  };

  const getSignedInUserMedicines = (userIdParam) => {
    axios
      .get(`/user/medicines/${userIdParam}`)
      .then(({ data }) => {
        const sortedMedicines = data.medicines.sort((a, b) =>
          a.name > b.name ? 1 : b.name > a.name ? -1 : 0
        );
        //console.log('meals', sortedMeals)
        setMedicines(sortedMedicines);
      })
      .catch((err) => console.error("get signed in user ERROR", err));
  };

  const feedDog = (dogToFeedObj, mealToFeedObj) => {
    const status = {
      feedDeadline: new Date(
        new Date(dogToFeedObj.feedDeadline).getTime() + 24 * 60 * 60 * 1000
      ),
      walkDeadline: new Date(
        new Date(dogToFeedObj.walkDeadline).getTime() + 12 * 60 * 60 * 1000
      ),
    };

    axios
      .put(`dog/${dogToFeedObj._id}`, { status })
      .then(getDog())
      .then(() => {
        axios
          .put(`user/meals/${user._id}`, {
            update: {
              type: "deleteMeal",
            },
            mealToDelete: mealToFeedObj,
          })
          .then(() => getSignedInUserMeals(user._id));
      })
      .catch((err) => console.error("feed dog meal ERROR:", err));
  };
                          // (dogToFeedObj, mealToFeedObj) 
  const giveMedicine = (dogToGiveMeds, medsToGiveObj) => {
    const status = {
      feedDeadline: new Date(
        new Date(dogToGiveMeds.medicineDeadline).getTime() + 24 * 60 * 60 * 1000
      ),

    };

    axios
      .put(`dog/${dogToGiveMeds._id}`, { status })
      .then(getDog())
      .then(() => {
        axios
          .put(`user/medicines/${user._id}`, {
            update: {
              type: "deleteMedicine",
            },
            medicineToDelete: medsToGiveObj,
          })
          .then(() => getSignedInUserMedicines(user._id));
      })
      .catch((err) => console.error("feed dog meal ERROR:", err));
  };

  const handleClick = (e) => {
    const status = {};

    if (e === "walk") {
      setHappy(true);
      happyRef.current = happy;
      const walkDeadline = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
      status.walkDeadline = walkDeadline;
      setWalkTimer(walkDeadline);
      axios
        .put(`/dog/${dog._id}`, { status })
        .then(() => getDog())
        .catch((err) => {
          console.error(err);
        });
    } else if (e === "feed" && coins < 3) {
      alert("Not enough coins!");
    } else if (e === "feed" && coins >= 3) {
      setHunger(false);
      hungryRef.current = hungry;
      const feedDeadline = Date.parse(dog.feedDeadline) + 12 * 60 * 60 * 1000;
      status.feedDeadline = feedDeadline;
      setFeedTimer(feedDeadline);
      axios
        .put(`/dog/${dog._id}`, { status, cost: -3 })
        .then(({ data }) => {
          setCoins(data.coinCount);
        })
        .then(() => getDog())
        .catch((err) => {
          console.error(err);
        });
      } else if (e === "medicine" && coins < 1) {
        alert("Not enough coins!");
      } else if (e === "medicine" && coins >= 1) {
        setHealth(false);
        medicineRef.current = sick;
        const medicineDeadline = Date.parse(dog.medicineDeadline) + 12 * 60 * 60 * 1000;
        status.medicineDeadline = medicineDeadline;
        setMedicineTimer(medicineDeadline);
        axios
          .put(`/dog/${dog._id}`, { status, cost: -3 })
          .then(({ data }) => {
            setCoins(data.coinCount);
          })
          .then(() => getDog())
          .catch((err) => {
            console.error(err);
          });
    } else {
      bark.play();
    }
  };

  useEffect(() => {
    getDog();
  }, [happy, hungry, health]);

  useEffect(() => {
    const x = setInterval(() => {
      const now = new Date().getTime();

      const feedTimer = ((Date.parse(dog.feedDeadline) - now) / 86400000) * 100;
      const walkTimer = ((Date.parse(dog.walkDeadline) - now) / 86400000) * 100;
      const medicineTimer = ((Date.parse(dog.medicineDeadline) - now) / 86400000) * 100;

      setFeedTimer(feedTimer);
      setWalkTimer(walkTimer);
      setMedicineTimer(medicineTimer);


      if (feedTimer < 25) {
        setFeedStatus("danger");
        if (hungryRef.current !== true) {
          setHunger(true);
          hungryRef.current = hungry;
        }
      } else if (feedTimer < 50) {
        setFeedStatus("warning");
        if (hungryRef.current !== true) {
          setHunger(true);
          hungryRef.current = hungry;
        }
      } else {
        setFeedStatus("success");
        if (hungryRef.current !== false) {
          setHunger(false);
          hungryRef.current = hungry;
        }
      }

      if (walkTimer < 25) {
        setWalkStatus("danger");
        if (happyRef.current !== false) {
          setHappy(false);
          happyRef.current = happy;
        }
      } else if (walkTimer < 50) {
        setWalkStatus("warning");
        if (happyRef.current !== false) {
          setHappy(false);
          happyRef.current = happy;
        }
      } else {
        setWalkStatus("success");
        if (happyRef.current !== true) {
          setHappy(true);
          happyRef.current = happy;
        }
      }

      if (medicineTimer < 25) {
        setHealthStatus("danger");
        if (medicineRef.current !== true) {
          setHealth(true);
          medicineRef.current = health;
        }
      } else if (medicineTimer < 50) {
        setHealthStatus("warning");
        if (medicineRef.current !== true) {
          setHealth(true);
          medicineRef.current = health;
        }
      } else {
        setHealthStatus("success");
        if (medicineRef.current !== false) {
          setHealth(false);
          medicineRef.current = health;
        }
      }
    }, 1000);
    return () => clearInterval(x);
  }, [happy, hungry, health, dog]);

  return (
    <Card className="d-flex flex-row m-4">
      <div
        className="d-flex flex-column justify-content-center align-items-center align-self-center"
        style={{ width: "250px", height: "250px" }}
      >
        <Card.Img
          src={dog.img}
          alt="Sorry, your dog is in another kennel."
          className="p-4"
        />
      </div>
      <div className="d-flex flex-column justify-content-center align-items-center w-100">
        <Card.Title className="pt-2">{dog.name}</Card.Title>
        <Card.Body className="w-100">
          <div className="dog-status">
            <ProgressBar
              animated={true}
              striped
              variant={feedStatus}
              now={feedTimer}
              label="HUNGER"
              style={{ height: "35px" }}
            />
            {hungry ? (
              <Button
                className="w-100 mx-0"
                variant="info"
                onClick={() => handleClick("feed")}
                title={"pay 3 coins"}
              >
                🍖
              </Button>
            ) : (
              <Button
                className="w-100 mx-0"
                variant="info"
                onClick={() => handleClick("bark")}
              >
                🦴
              </Button>
            )}
            <ProgressBar
              animated={true}
              striped
              variant={walkStatus}
              now={walkTimer}
              label="HAPPINESS"
              style={{ height: "35px" }}
            />

            {happy ? (
              <Button
                className="w-100 mx-0"
                variant="info"
                onClick={() => handleClick("bark")}
              >
                🐶
              </Button>
            ) : (
              <Button
                className="w-100 mx-0"
                variant="info"
                onClick={() => handleClick("walk")}
              >
                🐕‍🦺
              </Button>
            )}
            <ProgressBar
              animated={true}
              striped
              variant={healthStatus}
              now={medicineTimer}
              label="HEALTH"
              style={{ height: "35px" }}
            />
            {meals ? (
              <DropdownButton title="Feed from Pantry!">
                {meals.map((meal) => (
                  <Dropdown.Item
                    key={meal._id}
                    onClick={() => {
                      feedDog(dog, meal);
                    }}
                  >
                    {meal.name}
                  </Dropdown.Item>
                ))}
              </DropdownButton>
            ) : (
              <DropdownButton title="Feed from Pantry!">
                <Dropdown.Item>
                  Visit Bone Appétit Café to buy your first meal!
                </Dropdown.Item>
              </DropdownButton>
            )}
            {medicines ? (
              <DropdownButton title="Cure with Meds!">
                {medicines.map((medicine) => (
                  <Dropdown.Item
                    key={medicine._id}
                    onClick={() => {
                      giveMedicine(dog, medicine);
                    }}
                  >
                    {medicine.name}
                  </Dropdown.Item>
                ))}
              </DropdownButton>
            ) : (
              <DropdownButton title="Feed from Pantry!">
                <Dropdown.Item>
                  Go to the Get Well Center before ya dog die and become a PACK🚬!
                </Dropdown.Item>
              </DropdownButton>
            )}
            
          </div>
        </Card.Body>
      </div>
    </Card>
  );
}

export default Dog;
