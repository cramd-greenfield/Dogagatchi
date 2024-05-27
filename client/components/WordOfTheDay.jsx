import React from 'react';
import {
  Button,
  Modal
} from 'react-bootstrap';

const WordOfTheDay = (props) => {
  // destructure props
  const {
    dog,
    showWord,
    handleCloseWord,
    word,
    added,
    addWordToDogtionary
  } = props;

  // render modal
  return (
    <Modal
      show={showWord}
      onHide={handleCloseWord}
      scrollable={true}
      >
      <Modal.Header closeButton>
        <Modal.Title>{`${dog.name} says...`}</Modal.Title>
      </Modal.Header>

      {showWord ? (
        <Modal.Body>
          <h2>{word.word}</h2>
          <p>{word.phonetic}</p>
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
        </Modal.Body>
      ) : ('') }
      <Modal.Footer>
        <Button variant='secondary' onClick={handleCloseWord}>
          Close
        </Button>
        { added ? (
          <Button variant='outline-primary'>
            Added!
          </Button>
        ) : (
          <Button variant='primary' onClick={addWordToDogtionary}>
            Add to Dogtionary
          </Button>)
        }
      </Modal.Footer>
    </Modal>
  )
};

export default WordOfTheDay;