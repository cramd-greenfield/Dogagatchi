import React from 'react';
import {
  Button,
  Modal
} from 'react-bootstrap';

const Dogtionary = (props) => {
  // destructure props
  const {
    showDogtionary,
    handleCloseDogtionary,
    dog,
    dogtionary,
    removeWordFromDogtionary,
    addFavoriteWord
  } = props;

  // render modal
  return (
    <Modal
      show={showDogtionary}
      onHide={handleCloseDogtionary}
      scrollable={true}
    >
      <Modal.Header closeButton>
        <Modal.Title>{`${dog.name}'s Dogtionary`}</Modal.Title>
      </Modal.Header>
        <Modal.Body>
          { dogtionary.map((word, i) => {
            return (
              <Modal.Dialog key={`${i}`}>
                <h2>{ word.word }</h2>
                <p>{ word.phonetic }</p>
                { word.favorite ? (
                  <Button
                  variant="warning"
                  size='sm'
                  value={word.word}
                  onClick={addFavoriteWord}
                >
                  ⭐️
                </Button>
              ) :(
                <Button
                  variant="secondary"
                  size='sm'
                  value={word.word}
                  onClick={addFavoriteWord}
                >
                  ⭐️
                </Button>
              )}
                {word.meanings.map((meaning, i) => {
                  return (
                    <div key={i}>
                      <em>{ meaning.partOfSpeech }</em>
                      <ol>
                        {meaning.definitions.map((def, i) => {
                          return <li key={i}>{ `${def}` }</li>;
                        })}
                      </ol>
                    </div>
                  )
                })}
                <Button
                  variant='secondary'
                  size='sm'
                  value={word.word}
                  onClick={removeWordFromDogtionary}
                >
                  Remove
                </Button>
              </Modal.Dialog>
            )
          })
          }
        </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={handleCloseDogtionary}>Close</Button>
      </Modal.Footer>
    </Modal>
  )
};

export default Dogtionary;