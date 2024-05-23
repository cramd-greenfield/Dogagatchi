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
  const [index, setIndex] = useState(0);

  const getSignedInUserData = (userId) => {
    axios
      .get(`/user/${userId}`)
      .then(({ data }) => {
        setUser(data[0]);
        setCoins(data[0].coinCount);
      })
      .catch((err) => console.error('get signed in user ERROR', err));
  };

  const getDogs = () => {
    axios
      .get(`/groom/${userId}`)
      .then(({ data }) => setList(data.breeds))
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    getSignedInUserData(signedInUser._id);
  }, []);
  // Slice feature
  const dogSelect = (selectedIndex) => {
    setIndex(selectedIndex);
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
        <Form>
          <Form.Group>
            {/* <Image
              src={dogView}
              alt=''
              rounded
              style={{ width: 400, height: 300 }}
            /> */}
            {breeds.map((dog, index) => {
              return (
                <Groom key={`${dog}-${index}`} dog={dog} /> >
                <img src={dog} style={{ width: '500px' }} />
              );
            })}
          </Form.Group>

          <Button
            variant='primary'
            type='submit'
            onClick={() => handleSubscribe()}
          >
            200 Coins!
          </Button>
        </Form>
      </div>
    </div>
  );
}
export default GroomShop;
