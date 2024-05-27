import React, { useState, useEffect } from 'react';
import { Button, Form, Image, Dropdown, DropdownButton } from 'react-bootstrap';
import axios from 'axios';
import TradeDogList from './TradeDogList.jsx';
function DogShop(props) {
  const { coins, setCoins } = props;

  const [selectDogTrade, setDogTrade] = useState(false);
  const [ownedDogs, setOwnedDogs] = useState([]); // State to store the list of owned dogs
  // Define separate state variables for selected dogs from each list
const [selectedOwnedDog, setSelectedOwnedDog] = useState("");
const [selectedAvailableDog, setSelectedAvailableDog] = useState("");

  const [dogShop, setShop] = useState(false);
  const [breeds, setList] = useState([]);
  const [dogView, setDogView] = useState('');
  const [dogName, setDogName] = useState('');
  const [groom, setGroom] = useState(false);
  const user = JSON.parse(sessionStorage.getItem('user'));
  const [userId, setUserId] = useState(user._id);
 
  useEffect(() => {
    setUserId(user._id);
    getDogs();
    fetchOwnedDogs(); // Trigger the function to fetch owned dogs when component mounts

    axios.get(`/user/${user._id}`).then((userData) => {
      setCoins(userData.data[0].coinCount);
    });
  }, []);


  const getDogs = () => {
    axios
      .get(`/dog/users/${userId}`)
      .then(({ data }) => setList(data.breeds))
      .catch((err) => {
        console.error(err);
      });
  };

  const handleSelect = (img) => {
    console.log('hit', img)
    setDogView(img)
    selectDogTrade(true); // Change added here 
  }

  const handleSubmit = () => {
    if (dogView === '' || dogName === '') {
      alert('Fill all fields');
    } else if (coins >= 15) {
      axios
        .post('/dog', {
          name: dogName,
          img: dogView,
          owner: userId,
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
  /************ Subscribe for Groom **********/
  const subscribe = () => {
    if (dogView === '' || dogName === '') {
      alert('Fill all fields');
    } else if (coins >= 185) {
      axios
        .post('/groom/member', {
          name: dogName,
          img: dogView,
          owner: userId,
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
  /************ Subscribe for Groom **********/

 /******************** Trade Feature ***********************/

 // Function to fetch the list of user's owned dogs
 const fetchOwnedDogs = () => {
  axios.get(`/dog/users/${userId}`)
    .then(({ data }) => {
      setOwnedDogs(data.dogsArr); // Update the state with the fetched list of owned dogs
    })
    .catch((err) => {
      console.error('Error fetching owned dogs:', err);
    });
};


// Placing trading functionality here
const handleTrade = () => {
   if (!selectedOwnedDog || !selectedAvailableDog) {
    alert("Select both your dog and a dog for trade.");
    return;
  }

  const ownedDogId = ownedDogs.find(dog => dog.img === selectedOwnedDog)._id;

  const tradeData = {
    userId: userId,
    ownedDogId: ownedDogId,
    non_ownedDog: selectedAvailableDog
  };
  console.log("Trade data:", tradeData);

  axios.put('/trade', tradeData)
    .then((response) => {
      console.log('Trade was successful', response.data);
      // Optionally, provide feedback to the user
      alert("Trade was successful!");
      // Clear selected dogs
      setSelectedOwnedDog("");
      setSelectedAvailableDog("");
      // Fetch updated list of dogs
      getDogs();
    })
    .catch((error) => {
      console.error('Error confirming trade', error)
      alert('Error: Try again later.')
    });
};

// Function to handle trade confirmation
const handleTradeConfirmation = () => {
if (dogView === "") {
  alert("Select a dog to trade");
}

// Find the ID of the selected dog from the ownedDogs array
// Use find method
const selectedDog = ownedDogs.find(dog => dog.img === dogView);
if (!selectedDog) {
  alert("Error: Selected dog not found");
  return; // Exit function if selected dog is not found
}

// IDs of dogs being traded and user IDs
const tradeData = {
  userId: userId,
  ownedDogId: selectedDog._id,
  non_ownedDog: breeds[0],
};

// Send the trade data to the server
// Using axios.put() method
axios.put('/trade', tradeData)
  .then((response) => {
   console.log('Trade was successful', response.data);
  })
  .catch((error) => {
   console.error('Error confirming trade', error)
   alert('Error: Try again later.')
  });
};

// Function to handle selection of owned dog
const handleSelectOwnedDog = (img) => {
  setSelectedOwnedDog(img);
};

// Function to handle selection of available dog for trading
const handleSelectAvailableDog = (img) => {
  setSelectedAvailableDog(img);
};
 /******************** Trade Feature ***********************/


  return (    

    <div>
      {selectDogTrade ? "" : <Button onClick={() => setDogTrade(true)}>Trade a Dog!</Button>}
        {selectDogTrade ? (
             <div>
             <div>
               <h4>Your Dogs:</h4>
               <div style={{ display: "flex", alignItems: "center" }}>
                 {/* Display selected dog's image for owned dogs */}
                 {selectedOwnedDog && (
                   <Image
                     src={selectedOwnedDog}
                     alt=""
                     rounded
                     style={{ width: 200, marginRight: 20 }}
                   />
                 )}
                 <Dropdown>
                   <Dropdown.Toggle
                     style={{ width: "300px" }}
                     variant="success"
                     id="dropdown-owned-dogs"
                   >
                     Select Dog
                   </Dropdown.Toggle>
                   <Dropdown.Menu style={{ maxHeight: "300px", overflowY: "auto" }}>
                     {/* Render the user's owned dogs as options for trading */}
                     {console.log(ownedDogs)}
                     {ownedDogs.map((dog, index) => (
                       <Dropdown.Item
                         onClick={() => handleSelectOwnedDog(dog.img)} // Call handleSelectOwnedDog instead of setDogView
                         eventKey={dog.img}
                         key={index}
                       >
                         <img src={dog.img} style={{ width: "250px" }} />
                       </Dropdown.Item>
                     ))}
                   </Dropdown.Menu>
                 </Dropdown>
               </div>
             </div>
             <div>
               <h4>Dogs Available for Trading:</h4>
               <div style={{ display: "flex", alignItems: "center" }}>
                 {/* Display selected dog's image for available dogs */}
                 {selectedAvailableDog && (
                   <Image
                     src={selectedAvailableDog}
                     alt=""
                     rounded
                     style={{ width: 200, marginLeft: 20 }}
                   />
                 )}
                 <Dropdown>
                   <Dropdown.Toggle
                     style={{ width: "300px" }}
                     variant="success"
                     id="dropdown-available-dogs"
                   >
                     Select Dog
                   </Dropdown.Toggle>
                   <Dropdown.Menu style={{ maxHeight: "300px", overflowY: "auto" }}>
                     {/* Render additional dogs available for trading (from the breeds list) */}
                     {console.log(breeds)}
                     {breeds.map((dog, index) => (
                       <Dropdown.Item
                         onClick={() => handleSelectAvailableDog(dog)} // Call handleSelectAvailableDog instead of setDogView
                         eventKey={dog}
                         key={index}
                       >
                         <img src={dog} style={{ width: "250px" }} />
                       </Dropdown.Item>
                     ))}
                   </Dropdown.Menu>
                 </Dropdown>
               </div>
             </div>
             <Button variant="primary" type="submit" onClick={handleTrade}>
               Trade Dog
             </Button>
           </div>
        ) : (
          ""
        )}


 

      {dogShop ? (
        ''
      ) : (
        <Button onClick={() => setShop(true)}>Purchase a Dog!</Button>
      )}
      {dogShop ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'auto auto',
          }}
        >
          <Image src={dogView} alt='' rounded style={{ width: 200 }} />
          <Form>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                placeholder='Dog name'
                onChange={(e) => setDogName(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Dropdown>
                <Dropdown.Toggle
                  style={{ width: '300px' }}
                  onSelect={() => {
                    handleSelect(dog);
                  }}
                  variant='succes'
                  id='dropdown-basic'
                >
                  Select Dog
                </Dropdown.Toggle>
                <Dropdown.Menu
                  style={{ maxHeight: '300px', overflowY: 'auto' }}
                >
                  {console.log(breeds)}
                  {breeds.map((dog, index) => (
                    <Dropdown.Item
                      onClick={() => setDogView(dog)}
                      eventKey={dog}
                      key={index}
                    >
                      <img src={dog} style={{ width: '250px' }} />
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
              {/* <Form.Select onChange={(e) => setDogView(e.target.value)}>
 
                  <option>Choose Dog</option>
                  {breeds.map((dog, index) => {
                    return (
                      <option
                        key={index}
                        value={dog}
                      >
                        {dog}
                      </option>
                    );
                  })}
                </Form.Select> */}
            </Form.Group>
            <Form.Group>
              <Form.Label>15 coins:</Form.Label>
              <Button
                variant='primary'
                type='submit'
                onClick={() => handleSubmit()}
              >
                Buy Dog
              </Button>
              <Button
                type='submit'
                variant='warning'
                onClick={() => subscribe()}
              >
                💎 Groom 💎
              </Button>
            </Form.Group>
          </Form>
        </div>
      ) : (
        ''
      )}
    </div>
  );
}

export default DogShop;
