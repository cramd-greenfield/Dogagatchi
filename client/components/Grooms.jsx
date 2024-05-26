import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Groom from './Groom.jsx';

const Grooms = ({ dogs, setCoins, coins }) => {
  const user = JSON.parse(sessionStorage.getItem('user'));

  return (
    <div
      style={{
        height: 800,
        overflow: 'auto-hidden',
      }}
    >
      {Array.isArray(dogs) && dogs.length > 0
        ? dogs
            .filter((dog) => {
              if (dog.isGroomed === true) {
                axios.get(`/groom/member`).catch((err) => {
                  console.error(err);
                });
                return false;
              } else {
                return true;
              }
            })
            .map((dog) => {
              return (
                <div className='item' key={dog._id}>
                  <Groom
                    coins={coins}
                    setCoins={setCoins}
                    dogObj={dog}
                    dogs={dogs}
                    // setDogs={setDogs}
                  />
                </div>
              );
            })
        : ''}
    </div>
  );
};
export default Grooms;
