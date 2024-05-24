import axios from 'axios';
import Button from 'react-bootstrap/Button';
import React, { useState, useEffect } from 'react';
import { Card, Image, Form, Dropdown, Carousel } from 'react-bootstrap';
import Dog from './Dog.jsx';

function Groom(props) {
  const [groomShop, setShop] = useState(false);
  const [dogView, setDogView] = useState('');
  const [breeds, setList] = useState([]);
  const user = JSON.parse(sessionStorage.getItem('user'));
  const [userId, setUserId] = useState(user._id);
  /***************Test******************/
  const { groom, setUser, setCoins } = props;
  const [purchaseText, setPurchaseText] = useState('');
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  //put request to add meal to user's meal array and subtract coins from user's coinCount
  const subscribe = () => {
    const newCoinCount = user.coinCount - groom.cost;
    if (newCoinCount < 0) {
      setPurchaseText(
        'Sorry! You do not have enough tokens. Head over to Pooch Picker to get more!'
      );
    } else {
      axios
        .put(`/user/meals/${props.user._id}`, {
          update: {
            type: 'subscribe',
          },
          meals: {
            meal: props.meal,
          },
          coinCount: {
            newCount: newCoinCount,
          },
        })
        .then(({ data }) => {
          setUser(data._id);
          setPurchaseText(
            `Awesome! You bought your pup some delicious ${meal.name} and now have ${data.coinCount} tokens!`
          );
          setCoins(data.coinCount);
        })
        .then(() => {
          console.log('next');
          setTimeout(() => setPurchaseText(''), 3000);
        })
        .catch((err) => console.log('buyMeal client ERROR:', err));
    }
  };

  const getDogs = () => {
    axios
      .get(`/groom/${userId}`)
      .then(({ data }) => {
        setList(data.breeds);
        console.log(data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    getDogs();
  }, []);

  return (
    <div>
      <div
        style={{
          display: 'grid',
          // gridTemplateColumns: 'auto auto',
        }}
      >
        <Form>
          <Form.Group>
            <Form.Label></Form.Label>
          </Form.Group>
          <Form.Group>
            <Carousel slide={false} activeIndex={index} onSelect={handleSelect}>
              <Carousel.Item
                style={{ width: '300px' }}
                variant='success'
                id='dropdown-basic'
              >
                <Image src={dogView} alt='' rounded style={{ width: 200 }} />
              </Carousel.Item>

              {breeds.map((dog, idx) => (
                <Carousel.Item
                  onChange={() => setDogView(dog)}
                  dog={dog}
                  key={`${dog}-${idx}`}
                >
                  <img src={dog} style={{ width: '250px' }} />
                </Carousel.Item>
              ))}
            </Carousel>
          </Form.Group>
          <Form.Group>
            <Form.Label></Form.Label>
            <Button
              variant='primary'
              type='submit'
              onClick={() => handleSubmit()}
            >
              200 Coins
            </Button>
          </Form.Group>
        </Form>
      </div>
    </div>
  );
}

export default Groom;
