import React from 'react';
import styled from 'styled-components';

import Map from './Components/Map';
import { SideProvider } from './Contexts/Side';
import { PublicDataProvider } from './Contexts/publicData';

const Container = styled.div`
  display: flex;
`;

function App() {

  return (
    <div className="App">
      <SideProvider>
        <PublicDataProvider>
          <Container>
            <Map />
          </Container>
        </PublicDataProvider>
      </SideProvider>
    </div>
  );
}

export default App;
