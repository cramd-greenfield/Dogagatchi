import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Col, Row, Container } from 'react-bootstrap/';
import Medicines from '../../server/Medicine.js';
import Medicine from './Medicine.jsx';

function GetWellCenter() {
  const [user, setUser] = useState({});
  const [coins, setCoins] = useState(0);
  const signedInUser = JSON.parse(sessionStorage.user)

  const getSignedInUserData = (userId) => {
    axios.get(`/user/${userId}`)
      .then(({ data }) => {
        setUser(data[0])
        setCoins(data[0].coinCount)
      })
      .catch((err) => console.error('get signed in user ERROR', err))
  }
  useEffect(() => {
    getSignedInUserData(signedInUser._id)
    //use storage to get user from db the set user state as db user obj
  }, [])

  return (
    <Container>
      <Row>
        <Col xs={1}>
          </Col>
          <Col xs={10} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <h1>Get Well Center</h1>
          <p style={{
            color: '#0D6EfD',
            fontWeight: 'bold'
          }}>
          {`You've got ${coins} coins to spend!`}
          </p>
          </Col>   
          <Col xs={1}>
        </Col>      
      </Row>
      <Row>
      <Col xs={1}>
        </Col>
        <Col xs={10} style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div className="medicines-container">
            {Medicines.map((medicine) => (
              <Medicine
                key={medicine.idMedicine}
                medicine={medicine}
                user={user}
                setUser={getSignedInUserData}
                setCoins={setCoins}
              />
            ))}
          </div>
        </Col>
        <Col xs={1}>
        </Col>
      </Row>
    </Container>
  )
}

export default GetWellCenter