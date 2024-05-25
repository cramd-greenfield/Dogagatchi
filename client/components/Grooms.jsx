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
                axios
                  .get(`/groom/member/${user._id}`)
                  .then(() => alert(`${dog.name} now has a personal groomer!`))
                  .catch((err) => {
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

// const [dogShop, setShop] = useState(false);
// const [breeds, setBreeds] = useState([]);
// const [groom, setGroom] = useState([]);
// const [dogView, setDogView] = useState('');
// const [dogName, setDogName] = useState('');
// const user = JSON.parse(sessionStorage.getItem('user'));
// const [userId, setUserId] = useState(user._id);

// const getDogs = () => {
//   axios
//     .get(`/groomed/${user._d}`)
//     .then(({ data }) => {
//       console.log(data);
//     })
//     .catch((err) => {
//       console.error(err);
//     });
// };

// const handleSelect = (img) => {
//   console.log('hit', img);
//   setDogView(img);
// };

// const subscribe = () => {
//   if (coins >= 200) {
//     axios
//       .post(`/groom/${dog._id}`, {
//         name: dogName,
//         img: dogView,
//         owner: userId,
//         isGroomed: groom,
//       })
//       .then(({ data }) => {
//         setCoins(data.coinCount);
//       });
//     getDogs();
//     setDogs([]);
//     setGroom([]);
//   } else {
//     alert('Not enough coins!');
//   }
//   setShop(false);
// };
// return (
//   <div>
//     <Groom getDogs={getDogs} />
//     <Image src={dogView} alt='' rounded style={{ width: 200 }} />
//     <Form>
//       <Form.Group>
//         <Form.Label>Name</Form.Label>
//         <Form.Control
//           placeholder='Dog name'
//           onChange={(e) => setDogName(e.target.value)}
//         />
//       </Form.Group>
//       <Form.Group>
//         {/*  <Dropdown>
//               <Dropdown.Toggle
//                 style={{ width: '300px' }}
//                 onSelect={() => {
//                   handleSelect(dog);
//                 }}
//                 variant='success'
//                 id='dropdown-basic'
//               >
//                 Select Dog
//               </Dropdown.Toggle>
//               <Dropdown.Menu
//                 style={{ maxHeight: '300px', overflowY: 'auto' }}
//               >
//                 {breeds.map((dog, index) => (
//                   <Dropdown.Item
//                     onClick={() => setDogView(dog)}
//                     eventKey={dog}
//                     key={index}
//                   >
//                     <img src={dog} style={{ width: '250px' }} />
//                   </Dropdown.Item>
//                 ))}
//               </Dropdown.Menu>
//             </Dropdown> */}
//       </Form.Group>
//     </Form>
//   </div>
// );
// };

// export default Grooms;
