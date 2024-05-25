import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Button, Modal, ProgressBar, Card } from "react-bootstrap";

function Activity() {
  // have state for showing the modals
  const [show, setShow] = useState(false);
  const [newActivity, setNewActivity] = useState('');
  // const [dogHobbies, setDogHobbies] = useState([]);
  const [user, setUser] = useState({});
  const [coins, setCoins] = useState(0);
  const [activities, setActivities] = useState([]);
  const [progress, setProgress] = useState(0);

  const userObj = JSON.parse(sessionStorage.getItem("user"));

  const handleNewActivityClick = () => {
    // make req '/api/activities'
    axios
      .get('/api/activities')
      .then(({data}) => {
        // access activity from data.hobby
        // console.log(data.hobby);
        setNewActivity(data.hobby);
        setShow(true);
      })
      .catch((err) => console.error(err));
    // change show to true
  };

  const handleClose = () => {
    // for close button
    //set show to false
    setShow(false);
  };

  const handleSave = () => {
    axios.put(`/user/activities/${userObj._id}`, {
      activityUpdate: 'addActivity',
      newActivity: newActivity,
    })
      .then(setShow(false))
      .catch(err => console.error(err));
  };

  const handleRemove = (activity) => {
    axios.put(`/user/activities/${userObj._id}`, {
      activityUpdate: 'deleteActivity',
      newActivity: activity,
    })
      .then(setShow(false))
      .catch(err => console.error(err));
  }

  // put in useEffect
  const loadPage = () => {
    axios.get(`/user/${userObj._id}`)
      .then(({data}) => {
        // console.log(data[0])
        setUser(data[0])
        setActivities(data[0].activities);
        setCoins(data[0].coinCount);
      })
      .catch(err => console.error(err))
  }

  useEffect(() => {
    loadPage()
  }, [coins, activities])
  return (
    <Container>
      <Row>
        <Col
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h1>Activities</h1>
          <div
            // style={{
              //   display: "flex",
            //   justifyContent: "center",
            //   alignItems: "center",
            // }}
          >
            <ProgressBar animated now={100} />
            <Button onClick={handleNewActivityClick}>New Activity!</Button>

            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>Pawsome!</Modal.Header>
              <Modal.Body>{newActivity}</Modal.Body>
              <Modal.Footer>
                <Button onClick={handleSave}>Save Activity</Button>
              </Modal.Footer>
            </Modal>
          </div>
          { activities.length 
            ? activities.map((activity, index) => {
              return (
                <Card key={index}>
                  <Card.Body>{activity}</Card.Body>
                  <Button>Click Me</Button>
                  <Button variant="danger" onClick={() => handleRemove(activity)}>Remove</Button>
                </Card>
              )
            })
            : ''
          }
        </Col>
      </Row>
    </Container>
  );
};

export default Activity;
