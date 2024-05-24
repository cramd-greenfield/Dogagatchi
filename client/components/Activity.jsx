import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Button, Modal } from "react-bootstrap";

function Activity(props) {
  // have state for showing the modals
  const [show, setShow] = useState(false);
  const handleNewActivityClick = () => {
    // make req '/api/activities'
    axios
      .get('/api/activities')
      .then(({data}) => {
        // access activity from data.hobby
        // pass
      })
      .catch((err) => console.error(err));
    // change show to true
  };

  const handleClose = () => {
    // for close button
    //set show to false
  };

  const handleSave = () => {
    // for save button
    // set show to false
  };

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
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button onClick={handleNewActivityClick}>New Activity!</Button>

            <Modal onShow={show}>
              <Modal.Header closeButton>New Activity:</Modal.Header>
              <Modal.Body>Hello</Modal.Body>
              <Modal.Footer>
                <Button>Save Activity</Button>
              </Modal.Footer>
            </Modal>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Activity;
