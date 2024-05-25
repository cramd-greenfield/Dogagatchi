import React, { useState, useEffect, useRef } from 'react';
import { Button, ProgressBar, Card, Form } from 'react-bootstrap';
import axios from 'axios';
import barkSound from '../../server/barking-123909.mp3';

const Groom = () => {
  const [dog, setDog] = useState([]);
  const [hungry, setHunger] = useState(false);
  const [happy, setHappy] = useState(true);
  const [groomed, setGroomed] = useState([]);

  const user = JSON.parse(sessionStorage.getItem('user'));

  const hungryRef = useRef(null);
  const happyRef = useRef(null);

  const getGroomedDogs = () => {
    axios
      .get(`/groom/member/${dog._id}`)
      .then(({ data }) => {
        setGroomed(data);
        console.log(data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    getGroomedDogs();
  }, [dog]);

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
            <Button onClick={fetchAndShowWord}>Word of the Day!</Button>
            <Modal show={showWord} onHide={handleCloseWord}>
              <Modal.Header closeButton>
                <Modal.Title>Word Of The Day</Modal.Title>
              </Modal.Header>
              {showWord ? (
                <Modal.Body>
                  <h2>{word.word}</h2>
                  <p>{word.phonetic}</p>
                  {word.meanings.map((meaning) => {
                    return (
                      <>
                        <em>{meaning.partOfSpeech}</em>
                        {meaning.definitions.map((def, i) => {
                          return <p>{`${i + 1}: ${def}`}</p>;
                        })}
                      </>
                    );
                  })}
                </Modal.Body>
              ) : (
                <h2>placeholder</h2>
              )}
              {showWord ? (
                <Modal.Body>
                  <h2>{word.word}</h2>
                  <p>{word.phonetic}</p>
                  {word.meanings.map((meaning, i) => {
                    return (
                      <div key={i}>
                        <em>{meaning.partOfSpeech}</em>
                        {meaning.definitions.map((def, i) => {
                          return <p key={i}>{`${i + 1}: ${def}`}</p>;
                        })}
                      </div>
                    );
                  })}
                </Modal.Body>
              ) : (
                <h2>placeholder</h2>
              )}
              <Modal.Footer>
                <Button variant='secondary' onClick={handleCloseWord}>
                  Close
                </Button>
                <Button variant='primary'>Add to Dogtionary!</Button>
              </Modal.Footer>
            </Modal>
          </div>
        </Card.Body>
      </div>
    </Card>
  );
};

export default Groom;
