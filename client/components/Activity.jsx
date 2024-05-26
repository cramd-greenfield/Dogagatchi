import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Button,
  Modal,
  ProgressBar,
  Card,
  Toast,
} from "react-bootstrap";

function Activity() {
  const [show, setShow] = useState(false);
  const [newActivity, setNewActivity] = useState("");
  const [user, setUser] = useState({});
  const [coins, setCoins] = useState(0);
  const [activities, setActivities] = useState([]);
  const [progress, setProgress] = useState(0);
  const [toastShow, setToastShow] = useState(false);

  const userObj = JSON.parse(sessionStorage.getItem("user"));

  const handleNewActivityClick = () => {
    axios
      .get("/api/activities")
      .then(({ data }) => {
        setNewActivity(data.hobby);
        setShow(true);
      })
      .catch((err) => console.error(err));
  };

  const handleClose = () => {
    setShow(false);
  };

  const handleSave = () => {
    axios
      .put(`/user/activities/${userObj._id}`, {
        activityUpdate: "addActivity",
        newActivity: newActivity,
      })
      .then(setShow(false))
      .catch((err) => console.error(err));
  };

  const handleRemove = (activity) => {
    axios
      .put(`/user/activities/${userObj._id}`, {
        activityUpdate: "deleteActivity",
        newActivity: activity,
      })
      .then(setShow(false))
      .catch((err) => console.error(err));
  };

  // put in useEffect
  const loadPage = () => {
    axios
      .get(`/user/${userObj._id}`)
      .then(({ data }) => {
        // console.log(data[0])
        setUser(data[0]);
        setActivities(data[0].activities);
        setCoins(data[0].coinCount);
      })
      .catch((err) => console.error(err));
  };

  const handleProgress = () => {
    switch(progress) {
      case 0:
        setProgress(25);
        break;
      case 25:
        setProgress(50);
        break;
      case 50:
        setProgress(75);
        break;
      case 75:
        setProgress(100);
        axios.put(`/user/coins/${userObj._id}`)
          .then(({data}) => {
            setCoins(data.coinCount);
            setToastShow(true);
          })
          .catch(err => console.error(err));
        break;
      case 100:
        setProgress(0);
        break;
    }
  };

  useEffect(() => {
    loadPage();
  }, [coins, activities]);

  return (
    <Container>
          <Toast show={toastShow} delay={3000} autohide>
            <Toast.Body>{`You now have ${coins} coins!`}</Toast.Body>
          </Toast>
      <Row>
        <Col
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <h1>Activities</h1>
          <Button onClick={handleNewActivityClick}>New Activity!</Button>
        </Col>
        <ProgressBar
          animated
          now={progress}
          style={{
            display: "flex",
            alignItems: "stretch",
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            alignContent: "space-around",
            gap: "30px",
          }}
        >
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>Pawsome!</Modal.Header>
            <Modal.Body>{newActivity}</Modal.Body>
            <Modal.Footer>
              <Button onClick={handleSave}>Save Activity</Button>
            </Modal.Footer>
          </Modal>
          {activities.length
            ? activities.map((activity, index) => {
                return (
                  <Card key={index}>
                    <Card.Body>{activity}</Card.Body>
                    <Button onClick={handleProgress}>Click Me</Button>
                    <Button
                      variant="danger"
                      onClick={() => handleRemove(activity)}
                    >
                      Remove
                    </Button>
                  </Card>
                );
              })
            : ""}
        </div>
      </Row>
    </Container>
  );
}

export default Activity;
