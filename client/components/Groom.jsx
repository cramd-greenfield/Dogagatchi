import axios from 'axios';
import Button from 'react-bootstrap/Button';
import React, { useState, useEffect } from 'react';
import { Card, Image } from 'react-bootstrap';
import Dog from './Dog.jsx';

function Groom(props) {
  const user = JSON.parse(sessionStorage.getItem('user'));

  const { dog, setCoins, coins } = props;

  const getDogs = () => {
    axios
      .get(`/groom/${userId}`)
      .then(({ data }) => setList(data.breeds))
      .catch((err) => {
        console.error(err);
      });
  };

  return <>{breeds.map()}</>;
}

export default Groom;
