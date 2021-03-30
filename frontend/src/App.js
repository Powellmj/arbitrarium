import './main.scss';
import Container from 'react-bootstrap/Container'
import HomePage from './components/HomePage';
import React from 'react';

function App() {
  return (
    <div className="App">
      <Container fluid>
        <HomePage/>
      </Container>
    </div>
  );
}

export default App;
