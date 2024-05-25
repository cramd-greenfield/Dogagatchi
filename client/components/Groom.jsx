import React, { useState, useEffect, useRef } from 'react';
import { Button, ProgressBar, Card, Form } from 'react-bootstrap';
import axios from 'axios';
import barkSound from '../../server/barking-123909.mp3';

const Groom = () => {
  const [dog, setDog] = useState([]);
  const [hungry, setHunger] = useState(false);
  const [happy, setHappy] = useState(true);
  const [groomed, setGroomed] = useState([]);
  const [feedStatus, setFeedStatus] = useState('');
  const [walkStatus, setWalkStatus] = useState('');
  const [feedTimer, setFeedTimer] = useState(0);
  const [walkTimer, setWalkTimer] = useState(0);
  const [groom, setGroom] = useState(false);

  const user = JSON.parse(sessionStorage.getItem('user'));

  const hungryRef = useRef(null);
  const happyRef = useRef(null);

  const getDog = () => {
    axios
      .get(`/groom/${dog._id}`)
      .then(({ data }) => setDog(data))
      .catch((err) => {
        console.error(err);
      });
  };

  const upgradeDog = () => {
    axios
      .put(`dog/${dog._id}`, { status })
      .then(getDog())
      .then(() => {
        axios.put(`user/meals/${user._id}`, {}).then(() => getGroomedDogs());
      })
      .catch((err) => console.error('feed dog meal ERROR:', err));
  };

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
    <Card
      variant='warning'
      className='d-flex flex-row m-4 card text-white bg-warning mb-3'
    >
      <div
        className='d-flex flex-column justify-content-center align-items-center align-self-center'
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
      <div className='d-flex flex-column justify-content-center align-items-center w-100'>
        <Card.Title className='pt-2'>{dog.name}</Card.Title>
        <Card.Body className='w-100'>
          <div className='dog-status'>
            <ProgressBar
              animated={true}
              striped
              variant='warning'
              now={feedTimer}
              label='FAVORITE'
              style={{ height: '35px' }}
            />
            {hungry ? (
              <Button
                className='w-100 mx-0'
                variant='info'
                onClick={() => handleClick('feed')}
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
              variant='warning'
              now={walkTimer}
              label='FAVORITE'
              style={{ height: '35px' }}
            />

            {groom ? (
              <DropdownButton title='Feed from Pantry!'>
                {groom.map((dog) => (
                  <Dropdown.Item
                    key={dog._id}
                    onClick={(e) => {
                      setGroom(e.target.value);
                    }}
                  >
                    {meal.name}
                  </Dropdown.Item>
                ))}
              </DropdownButton>
            ) : (
              <Form.Label>
                Visit Bone Appétit Café to buy your first meal!
              </Form.Label>
            )}
          </div>
        </Card.Body>
      </div>
    </Card>
  );
};

export default Groom;
