import './styles/main.scss';
import Container from 'react-bootstrap/Container'
import HomePage from './components/HomePage';

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
