import React, { useState, useEffect } from 'react';
import { Button, Form, Image, Dropdown, DropdownButton } from 'react-bootstrap';
import axios from 'axios';

function DogShop(props) {
  const { coins, setCoins } = props;

  const [selectDogTrade, setDogTrade] = useState(false);
  const [ownedDogs, setOwnedDogs] = useState([]); // State to store the list of owned dogs

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

// Placing trading functionality here
const handleTrade = () => {
  // If dog hasn't been selected
   // Check if a dog has been selected for trading
   if (dogView === "") {
    alert("Select a dog to trade");
  } else {
    // Use axios.post() to trade the dog
    axios
      .post("/dog", {
        name: dogName,
        img: dogView,
        owner: userId,
      })
      .then(({ data }) => {
        // Update user's data after successful trade
        //setCoins(data.coinCount);
        // Clear input fields
        setDogName("");
        setDogView("");
        // Fetch updated list of dogs
        getDogs();
        // Optional: Provide feedback to the user
        alert("Dog traded successfully!");
      })
      .catch((error) => {
        console.error("Error trading dog:", error);
        alert("Error trading dog. Please try again later.");
      });
  }
};


  return (    

    <div>
      {selectDogTrade ? "" : <Button onClick={() => setDogTrade(true)}>Trade a Dog!</Button>}
        {selectDogTrade ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: "auto auto",
          }}>
            <Image 
            src={dogView}
            alt=""
            rounded
            style={{ width: 200 }}
            />
            <Form>
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control 
                 placeholder="Dog name"
                 onChange={(e) => setDogName(e.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Dropdown>
                  <Dropdown.Toggle
                   style={{ width: "300px" }}
                   onSelect={() => {
                     handleSelect(dog);
                   }}
                   variant="success"
                   id="dropdown-basic"
                   >
                    Select Dog
                  </Dropdown.Toggle>
                  <Dropdown.Menu
                    style={{ maxHeight: "300px", overflowY: "auto" }}>
                     {ownedDogs.map((dog, index) => ( // Render the owned dogs as options for trading
                     <Dropdown.Item
                      onClick={() => setDogView(dog)} // Set the dog view to the selected dog's image
                      eventKey={dog} // You might need to adjust this based on your dog object structure
                      key={index}
                      >
                       <img src={dog} style={{ width: "250px" }}/>
                       </Dropdown.Item>
                       ))}
                  </Dropdown.Menu>
                </Dropdown>
              </Form.Group>
              <Form.Group>
                <Form.Label>Trade a dog you own:</Form.Label>
                <Button variant="primary" type="submit" onClick={handleTrade}>
                  Trade Dog
                </Button>
              </Form.Group>
            </Form>
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
