import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Col,
  Row,
  Container,
  Button,
  Form,
  Carousel,
  Image,
} from 'react-bootstrap/';
import Groom from './Groom.jsx';
import Dog from './Dog.jsx';

function GroomShop(props) {
  const { dog } = props;
  const [user, setUser] = useState({});
  const [coins, setCoins] = useState(0);
  const signedInUser = JSON.parse(sessionStorage.user);
  const [groomShop, setShop] = useState(false);
  const [breeds, setList] = useState([]);
  const [dogView, setDogView] = useState('');
  const [dogName, setDogName] = useState('');
  const [userId, setUserId] = useState(user._id);
  const [subscribe, setSubscribe] = useState(false);

  const getSignedInUserData = (userId) => {
    axios
      .get(`/user/${userId}`)
      .then(({ data }) => {
        setUser(data[0]);
        setCoins(data[0].coinCount);
      })
      .catch((err) => console.error('get signed in user ERROR', err));
  };
  useEffect(() => {
    getSignedInUserData(signedInUser._id);
    //use storage to get user from db the set user state as db user obj
  }, []);

  const getDogs = () => {
    axios
      .get(`/groom/${userId}`)
      .then(({ data }) => setList(data.breeds))
      .catch((err) => {
        console.error(err);
      });
  };

  const handleSelect = (img) => {
    console.log('hit', img);
    setDogView(img);
  };

  const handleSubscribe = () => {
    if (coins >= 200) {
      axios
        .post('/groom', {
          name: dogName,
          img: dogView,
          owner: userId,
          groom: true,
        })
        .then(({ data }) => {
          setCoins(data.coinCount);
        });
      getDogs();
      setDogs([]);
      setList([]);
    } else {
      alert('Not enough coins!');
    }
    setShop(false);
  };

  return (
    <div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'auto auto',
        }}
      >
        <Image src={dogView} alt='' rounded style={{ width: 200 }} />

        <Carousel>
          <Carousel.Item
            style={{ width: '300px' }}
            onSelect={() => {
              handleSelect(dog);
            }}
            variant='success'
            id='dropdown-basic'
          >
            Select Dog
          </Carousel.Item>

          {breeds.map((dog, index) => {
            (
              <div>
                key={`${dog}-${index}`}
                onClick={() => setDogView(dog)}
                onChange=
                {(e) => {
                  setSubscribe(e.target.value);
                }}
              </div>
            ) > <img src={dog} style={{ width: '250px' }} />;
          })}
        </Carousel>
        <Form.Label>200 coins:</Form.Label>
        <Button
          variant='primary'
          type='submit'
          onClick={() => handleSubscribe()}
        >
          Buy Groom
        </Button>
      </div>
    </div>
  );
}
export default GroomShop;
