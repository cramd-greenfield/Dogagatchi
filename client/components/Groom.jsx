import React, { useState, useEffect, useRef } from 'react';
import {
  Button,
  ProgressBar,
  Card,
  Dropdown,
  DropdownButton,
  Modal,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import barkSound from '../../server/barking-123909.mp3';

const Groom = (props) => {
  const { dogObj, setCoins, coins } = props;
  const [dog, setDog] = useState(dogObj);
  const [hungry, setHunger] = useState(true);
  const [happy, setHappy] = useState(false);
  const [feedStatus, setFeedStatus] = useState('');
  const [walkStatus, setWalkStatus] = useState('');
  const [feedTimer, setFeedTimer] = useState(0);
  const [walkTimer, setWalkTimer] = useState(0);
  const [groom, setGroom] = useState([]);

  const user = JSON.parse(sessionStorage.getItem('user'));

  const hungryRef = useRef(null);
  const happyRef = useRef(null);

  useEffect(() => {
    getGroomedDogs(user._id);
  }, []);

  const getDog = () => {
    axios
      .get(`/groom/${dog._id}`)
      .then(({ data }) => setDog(data))
      .catch((err) => {
        console.error(err);
      });
  };

  const getGroomedDogs = () => {
    axios
      .get(`/groom/groomed/${user._id}`)
      .then(({ data }) => {
        console.log(data);
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
      .post(`/words/${dog._id}`)
      .then(({ data }) => {
        console.log('data recd from axios post');
        console.log('keys', Object.keys(data));
        console.log('data', data.meanings);
        setWord(data);
        setShowWord(true);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const handleCloseWord = () => setShowWord(false);

  useEffect(() => {
    getDog();
  }, [happy, hungry]);

  useEffect(() => {
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
  }, [happy, hungry, dog]);

  return (
    <Card className='d-flex flex-row m-4'>
      <div
        className='d-flex flex-column justify-content-center align-items-center align-self-center'
        style={{ width: '250px', height: '250px' }}
      >
        <Card.Img
          src={dog.img}
          alt='Sorry, your dog is in another kennel.'
          className='p-4'
        />
      </div>
      <div className='d-flex flex-column justify-content-center align-items-center w-100'>
        <Card.Title className='pt-2'>{dog.name}</Card.Title>
        <Card.Body className='w-100'>
          <div className='dog-status'>
            <ProgressBar
              animated={true}
              striped
              variant='warning'
              label='FAVORITE'
              style={{ height: '35px' }}
            />

            <Button
              className='w-100 mx-0'
              variant='info'
              onClick={() => handleClick('bark')}
            >
              🦴
            </Button>
            <ProgressBar
              animated={true}
              striped
              variant='warning'
              label='FAVORITE'
              style={{ height: '35px' }}
            />
            {/* Will be back for this please don't remove - Cody */}
            {/* <Button type='submit' variant='warning' onClick={subscribe}>
                💎Groom Subscription💎
              </Button> */}
          </div>
        </Card.Body>
      </div>
    </Card>
  );
};

export default Groom;
