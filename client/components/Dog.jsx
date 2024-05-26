import React, { useState, useEffect, useRef } from 'react';
import {
  Button,
  ProgressBar,
  Card,
  Dropdown,
  DropdownButton,
  ButtonGroup,
  ToggleButton,
  Modal,
  Form,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import barkSound from '../../server/barking-123909.mp3';
import Grooms from './Grooms.jsx';

const bark = new Audio(barkSound);

function Dog(props) {
  const { dogObj, setCoins, coins } = props;
  const [dog, setDog] = useState(dogObj);
  const [hungry, setHunger] = useState(true);
  const [happy, setHappy] = useState(false);
  const [feedStatus, setFeedStatus] = useState('');
  const [walkStatus, setWalkStatus] = useState('');
  const [feedTimer, setFeedTimer] = useState(0);
  const [walkTimer, setWalkTimer] = useState(0);
  const [meals, setMeals] = useState([]);
  const [word, setWord] = useState({});
  const [showWord, setShowWord] = useState(false);
  const [dogtionary, setDogtionary] = useState([]);
  const [showDogtionary, setShowDogtionary] = useState(false);
  const [added, setAdded] = useState(false);
  const [groomed, setGroomed] = useState(false);
  const user = JSON.parse(sessionStorage.getItem('user'));

  const hungryRef = useRef(null);
  const happyRef = useRef(null);

  useEffect(() => {
    getSignedInUserMeals(user._id);
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

        setMeals(sortedMeals);
      })
      .catch((err) => console.error('get signed in user ERROR', err));
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
              type: 'deleteMeal',
            },
            mealToDelete: mealToFeedObj,
          })
          .then(() => getSignedInUserMeals(user._id));
      })
      .catch((err) => console.error('feed dog meal ERROR:', err));
  };

  /************ Subscribe for Groom **********/
  const subscribe = () => {
    if (coins >= 200) {
      axios
        .patch(`/groom/${dog._id}`, {
          isGroomed: groomed,
        })
        .then(({ data }) => {
          setCoins(data.coinCount);
        });
      getDog();
      setDog([]);
      setGroomed(true);
    } else {
      alert('Not enough coins!');
    }
    setShop(false);
  };
  /************ Subscribe for Groom **********/

  const handleClick = (e) => {
    const status = {};

    if (e === 'walk') {
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
    } else if (e === 'feed' && coins < 3) {
      alert('Not enough coins!');
    } else if (e === 'feed' && coins >= 3) {
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
    } else {
      bark.play();
    }
  };

  const fetchAndShowWord = () => {
    // request to /words/:dogId
    axios
      .get(`/words/randomWord`)
      .then(({ data }) => {
        // add dog id to word object
        data.dog = dog._id;
        setWord(data);
        setShowWord(true);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const addWordToDogtionary = () => {
    // send POST request with word object
    axios
      .post('/words/dogtionary', {
        wordObj: word,
      })
      .then(() => setAdded(true))
      .catch((err) => { console.error('Failed to add word to dogtionary', err) });
  };

  const removeWordFromDogtionary = (e) => {
    const word = e.target.value;
    // delete request to /:word
    axios
      .delete(`/words/${word}`)
      .then(() => { openDogtionary() })
      .catch((err) => { console.error('Failed to delete word', err) })
  }

  const addFavoriteWord = (e) => {
    // update word.favorite in db
    const word = e.target.value;
    axios
      .patch(`/words/${word}`, {
        update: {
            type: 'favorite'
        },
        favUpdate: {
            favorite: true
        }
    })
    .then() // rerender to show updated favorites
    .catch((err) => { console.error('Failed to update favorite word', err)})
  }

  const openDogtionary = () => {
    // get wordObjs from db in an array
    axios
      .get(`/words/dog/${dog._id}`)
      .then(({ data }) => {
        setDogtionary(data);
        setShowDogtionary(true);
      })
      .catch((err) => {
        console.error('Failed to get dogtionary words', err)
      });
  }

  const handleCloseWord = () => setShowWord(false);
  const handleCloseDogtionary = () => setShowDogtionary(false);

  useEffect(() => {
    getDog();
  }, [happy, hungry]);

  useEffect(() => {
    const x = setInterval(() => {
      const now = new Date().getTime();

      const feedTimer = ((Date.parse(dog.feedDeadline) - now) / 86400000) * 100;
      const walkTimer = ((Date.parse(dog.walkDeadline) - now) / 86400000) * 100;

      setFeedTimer(feedTimer);
      setWalkTimer(walkTimer);

      if (feedTimer < 25) {
        setFeedStatus('danger');
        if (hungryRef.current !== true) {
          setHunger(true);
          hungryRef.current = hungry;
        }
      } else if (feedTimer < 50) {
        setFeedStatus('warning');
        if (hungryRef.current !== true) {
          setHunger(true);
          hungryRef.current = hungry;
        }
      } else {
        setFeedStatus('success');
        if (hungryRef.current !== false) {
          setHunger(false);
          hungryRef.current = hungry;
        }
      }

      if (walkTimer < 25) {
        setWalkStatus('danger');
        if (happyRef.current !== false) {
          setHappy(false);
          happyRef.current = happy;
        }
      } else if (walkTimer < 50) {
        setWalkStatus('warning');
        if (happyRef.current !== false) {
          setHappy(false);
          happyRef.current = happy;
        }
      } else {
        setWalkStatus('success');
        if (happyRef.current !== true) {
          setHappy(true);
          happyRef.current = happy;
        }
      }
    }, 1000);
    return () => clearInterval(x);
  }, [happy, hungry, dog]);

  return (
    <Card className='d-flex flex-row m-4'>
      <div
        className='d-flex flex-column justify-content-center align-items-center align-self-center '
        style={{ width: '250px', height: '250px' }}
      >
        <Card.Img
          src={dog.img}
          alt='Sorry, your dog is in another kennel.'
          className='p-4'
        />

        <Button variant='warning' onClick={() => subscribe}>
          💎 Groom 💎
        </Button>
        <Form.Label>200 Coins!</Form.Label>
      </div>
      <div className='d-flex flex-column justify-content-center align-items-center w-100 '>
        <Card.Title className='pt-2'>{dog.name}</Card.Title>
        <Card.Body className='w-100'>
          <div className='dog-status'>
            <ProgressBar
              animated={true}
              striped
              variant={feedStatus}
              now={feedTimer}
              label='HUNGER'
              style={{ height: '35px' }}
            />
            {hungry ? (
              <Button
                className='w-100 mx-0'
                variant='info'
                onClick={() => handleClick('feed')}
                title={'pay 3 coins'}
              >
                🍖
              </Button>
            ) : (
              <Button
                className='w-100 mx-0'
                variant='info'
                onClick={() => handleClick('bark')}
              >
                🦴
              </Button>
            )}
            <ProgressBar
              animated={true}
              striped
              variant={walkStatus}
              now={walkTimer}
              label='HAPPINESS'
              style={{ height: '35px' }}
            />

            {happy ? (
              <Button
                className='w-100 mx-0'
                variant='info'
                onClick={() => handleClick('bark')}
              >
                🐶
              </Button>
            ) : (
              <Button
                className='w-100 mx-0'
                variant='info'
                onClick={() => handleClick('walk')}
              >
                🐕‍🦺
              </Button>
            )}
            {meals ? (
              <DropdownButton title='Feed from Pantry!'>
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
              <DropdownButton title='Feed from Pantry!'>
                <Dropdown.Item>
                  Visit Bone Appétit Café to buy your first meal!
                </Dropdown.Item>
              </DropdownButton>
            )}

            <Button onClick={fetchAndShowWord}>Word of the Day!</Button>
            <Modal
              show={showWord}
              onHide={handleCloseWord}
              scrollable={true}
            >
              <Modal.Header closeButton>
                <Modal.Title>Word Of The Day</Modal.Title>
              </Modal.Header>
                { showWord ? (
                  <Modal.Body>
                    <h2>{ word.word }</h2>
                    <p>{ word.phonetic }</p>
                    {word.meanings.map((meaning, i) => {
                      return (
                        <div key={i}>
                          <em>{ meaning.partOfSpeech }</em>
                          <ol>
                            {meaning.definitions.map((def, i) => {
                              return <li key={i}>{ `${def}` }</li>;
                            })}
                          </ol>
                        </div>
                      )
                    })}
                  </Modal.Body>
                  ) : (
                    <h2>placeholder</h2>
                  )}
              <Modal.Footer>
                <Button variant='secondary' onClick={handleCloseWord}>Close</Button>
                { added ? (
                  <Button variant='outline-primary'>
                    Added!
                  </Button>
                ) : (
                  <Button variant='primary' onClick={addWordToDogtionary}>
                    Add to Dogtionary
                  </Button>)
                }
              </Modal.Footer>
            </Modal>

            <Button variant='primary' onClick={openDogtionary}>
              {`${dog.name}'s Dogtionary`}
            </Button>
            <Modal
              show={showDogtionary}
              onHide={handleCloseDogtionary}
              scrollable={true}
            >
              <Modal.Header closeButton>
                <Modal.Title>{`${dog.name}'s Dogtionary`}</Modal.Title>
              </Modal.Header>
                <Modal.Body>
                  { dogtionary.map((word, i) => {
                    return (
                      <Modal.Dialog key={`${i}`}>
                        <h2>{ word.word }</h2>
                        <p>{ word.phonetic }</p>
                        <ButtonGroup>
                          <ToggleButton
                            id="toggle-check"
                            type="checkbox"
                            variant="secondary"
                            // checked={checked}
                            value={word.word}
                            onChange={addFavoriteWord}
                          >
                            ⭐️
                          </ToggleButton>
                        </ButtonGroup>
                        {word.meanings.map((meaning, i) => {
                          return (
                            <div key={i}>
                              <em>{ meaning.partOfSpeech }</em>
                              <ol>
                                {meaning.definitions.map((def, i) => {
                                  return <li key={i}>{ `${def}` }</li>;
                                })}
                              </ol>
                            </div>
                          )
                        })}
                        <Button
                          variant='secondary'
                          value={word.word}
                          onClick={removeWordFromDogtionary}
                        >
                          Remove
                        </Button>
                      </Modal.Dialog>
                    )
                  })
                  }

                </Modal.Body>
              <Modal.Footer>
                <Button variant='secondary' onClick={handleCloseDogtionary}>Close</Button>
              </Modal.Footer>
            </Modal>
          </div>
        </Card.Body>
      </div>
    </Card>
  );
}

export default Dog;
