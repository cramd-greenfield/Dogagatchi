import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Groom from './Groom.jsx';

const Grooms = () => {
  const [dogShop, setShop] = useState(false);
  const [breeds, setBreeds] = useState([]);
  const [dogView, setDogView] = useState('');
  const [dogName, setDogName] = useState('');
  const user = JSON.parse(sessionStorage.getItem('user'));
  const [userId, setUserId] = useState(user._id);

  const getDogs = () => {
    axios
      .get(`/groom/${userId}`)
      .then(({ data }) => {
        console.log(data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleSelect = (img) => {
    console.log('hit', img);
    setDogView(img);
  };

  const subscribe = () => {
    if (dogView === '' || dogName === '') {
      alert('Fill all fields');
    } else if (coins >= 15) {
      axios
        .post(`/groom/${dog._id}`, {
          name: dogName,
          img: dogView,
          owner: userId,
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
      {/* {dogs.map((dog) => (
        <Groom dog={dog} key={dog._id} />
       ))} */}
    </div>
  );
};

export default Grooms;
