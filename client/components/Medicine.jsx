import axios from 'axios';
import Button from 'react-bootstrap/Button';
import React, { useState, useEffect } from 'react';
import { Card, Image } from 'react-bootstrap'

function Medicine(props) {
  const { user, medicine, setUser, setCoins } = props
  const [purchaseText, setPurchaseText] = useState('')
  
  
  const buyMedicine = () => {
    const newCoinCount = user.coinCount - medicine.cost
    if (newCoinCount < 0) {
      setPurchaseText('Sorry! You do not have enough tokens. Head over to Pooch Picker to get more chedda!')
    } else {
      axios.put(`/user/medicines/${props.user._id}`, {
        update: {
          type: 'buyMedicine'
        },
        medicines: {
          medicine: props.medicine
        },
        coinCount: {
          newCount: newCoinCount
        }
      })
        .then(({ data }) => {
          setUser(data._id)
          setPurchaseText(`TY Come again!❤️`)
          setCoins(data.coinCount)
        })
        .then(() => {
          console.log('next')
          setTimeout(() => setPurchaseText(''), 3000)})
        .catch((err) => console.log('buyMedicine client ERROR:', err))

    }
  }

  return (
    <Card className="medicine-container my-2 p-2">
      <div className='d-flex flex-row w-75'>
        <Image id="medicine-item" className="medicine-image p-2" src={`${props.medicine.image}`} roundedCircle />
        <Card.Body className='d-flex flex-column'>
          <Card.Title id="medicine-item">{props.medicine.name}</Card.Title>
          <Card.Text id="medicine-item">{`${props.medicine.cost} coins`}</Card.Text>
          <Card.Text id="medicine-item">{purchaseText}</Card.Text>
        </Card.Body>
      </div>
      <div className='d-flex align-items-center justify-content-middle mx-4'>
        <Button
          variant="primary"
          onClick={() => buyMedicine()}
        >Add to Dispensary!</Button>
      </div>
    </Card>
  )
}

export default Medicine