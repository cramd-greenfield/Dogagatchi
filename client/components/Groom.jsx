import React, { useState, useEffect, useRef } from 'react';
import { Button, ProgressBar, Card, Form } from 'react-bootstrap';
import axios from 'axios';
import barkSound from '../../server/barking-123909.mp3';

const Groom = () => {
  const [dog, setDog] = useState([]);
  const [groomed, setGroomed] = useState([]);

  const user = JSON.parse(sessionStorage.getItem('user'));

  const getGroomed = () => {
    axios.get('/groom/member').then(({ data }) => {
      setGroomed(data);
      setDog(data);
      console.log(data);
    });
  };
  useEffect(() => {
    getGroomed();
  }, []);

  const hungryRef = useRef(null);
  const happyRef = useRef(null);

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
          alt='Sorry, your dog does not want to be seen with you...'
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
              now={100}
              variant='warning'
              label='FAVORITE'
              style={{ height: '35px' }}
            />
          </div>
        </Card.Body>
      </div>
    </Card>
  );
};

export default Groom;
