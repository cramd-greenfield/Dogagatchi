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

function GroomShop() {
  /********************Test ***********/
  const [user, setUser] = useState({});
  const [coins, setCoins] = useState(0);
  const signedInUser = JSON.parse(sessionStorage.user);

  const getSignedInUserData = (userId) => {
    axios
      .get(`/user/${userId}`)
      .then(({ data }) => {
        // console.log(data);
        setUser(data[0]);
        setCoins(data[0].coinCount);
      })
      .catch((err) => console.error('get signed in user ERROR', err));
  };
  useEffect(() => {
    getSignedInUserData(signedInUser._id);
  }, []);

  // WILL BE USED FOR UPDATE
  //
  // const handleSubscribe = () => {
  //   if (coins >= 200) {
  //     axios
  //       .post('/groom', {
  //         name: dogName,
  //         img: dogView,
  //         owner: userId,
  //         groom: true,
  //       })
  //       .then(({ data }) => {
  //         setCoins(data.coinCount);
  //       });
  //     getDogs();
  //     setDogs([]);
  //     setList([]);
  //   } else {
  //     alert('Not enough coins!');
  //   }
  //   setShop(false);
  // };

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
          <h1>Welcome to the Groomer!</h1>
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
          <div className='dogs-container'>
            <Groom />
          </div>
        </Col>
        <Col xs={1}></Col>
      </Row>
    </Container>
  );
}
export default GroomShop;
