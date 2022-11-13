import React from 'react';
import styled from 'styled-components';

import Map from './Components/Map';
import { SideProvider } from './Contexts/Side';

const Container = styled.div`
  display: flex;
`;

function App() {

  return (
    <div className="App">
      <SideProvider>
        <Container>
          <Map />
        </Container>
      </SideProvider>
    </div>
  );
}

export default App;
