/************** Cody D. Legacy **********/
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Col, Row, Container } from 'react-bootstrap/';

function Groom() {
  const [user, setUser] = useState({});
  const [coins, setCoins] = useState(0);
  const [userId, setUserId] = useState(user._id);
  // const signedInUser = JSON.parse(sessionStorage.user);

  // const getSignedInUserData = (userId) => {
  //   axios
  //     .get(`/user/${userId}`)
  //     .then(({ data }) => {
  //       setUser(data[0]);
  //       setCoins(data[0].coinCount);
  //     })
  //     .catch((err) => console.error('get signed in user ERROR', err));
  // };
  // useEffect(() => {
  //   getSignedInUserData(signedInUser._id);
  //   //use storage to get user from db the set user state as db user obj
  // }, []);
  useEffect(() => {
    setUserId(user._id);
    getDogs();
    axios.get(`/user/${user._id}`).then((userData) => {
      setCoins(userData.data[0].coinCount);
    });
  }, []);

  const handleSubscribe = () => {
    if (dogView === '' || dogName === '') {
      alert('Fill all fields');
    } else if (coins >= 200) {
      axios
        .post('/dog', {
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
    <Container>
      <Row>
        <Col xs={1}></Col>
        <Col
          xs={10}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <h1>Groom Shop</h1>
          <p
            style={{
              color: '#0D6EfD',
              fontWeight: 'bold',
            }}
          >
            {`You've got ${coins} coins to spend!`}
          </p>
        </Col>
        <Col xs={1}></Col>
      </Row>
      <Row>
        <Col xs={1}></Col>
        <Col
          xs={10}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div className='grooms-container'></div>
        </Col>
        <Col xs={1}></Col>
      </Row>
      <div>
        <Form.Group>
          <Form.Label>15 coins:</Form.Label>
          <Button
            variant='primary'
            type='submit'
            onClick={() => handleSubmit()}
          >
            Buy Dog
          </Button>
          <Form.Label>200 coins:</Form.Label>
          <Button
            variant='primary'
            type='submit'
            onClick={() => handleSubscribe()}
          >
            Subscribe to Groomer!
          </Button>
        </Form.Group>
      </div>
    </Container>
  );
}
export default Groom;
