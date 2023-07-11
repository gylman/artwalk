import './App.css';
import Challenge from './components/Challenge';
import styled from '@emotion/styled';

const Container = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 40px;
`;

function App() {
  return (
    <Container>
      <Challenge />
    </Container>
  );
}

export default App;
