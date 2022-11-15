import React, {useContext} from 'react';
import styled from 'styled-components';

import { IconButton } from './IconButton';
import DataList from './DataList';
import { SideContext } from '../../../Contexts/Side';
import { PublicDataContext } from '../../../Contexts/publicData';

const Side = () => {
  const {select, changeSelect} = useContext(SideContext);
  const {markerD1, markerD2, markerD3} = useContext(PublicDataContext);
  if(select == 1)
  return (
    <Container>
      <IconContainer>
        <IconButton backgroundColor='beige' 
          label='장애인 관광편의시설'
          onClick={() => {
            changeSelect(1)
          }}/>
        <IconButton backgroundColor='beige' 
          label='장애인 관광숙박'
          onClick={() => {
            changeSelect(2)
          }} />
        <IconButton backgroundColor='beige' 
          label='장애인 관광음식점'
          onClick={() => {
            changeSelect(3)
          }}/>
      </IconContainer>
      <ListContainer>
        <DataList label={markerD1}></DataList>
      </ListContainer>
    </Container>
  )
  if(select === 2) 
  return (
    <Container>
      <IconContainer>
        <IconButton backgroundColor='beige' 
          label='장애인 관광편의시설'
          onClick={() => {
            changeSelect(1)
          }}/>
        <IconButton backgroundColor='beige' 
          label='장애인 관광숙박'
          onClick={() => {
            changeSelect(2)
          }} />
        <IconButton backgroundColor='beige' 
          label='장애인 관광음식점'
          onClick={() => {
            changeSelect(3)
          }}/>
      </IconContainer>
      <ListContainer>
        <DataList label={markerD2}></DataList>
      </ListContainer>
    </Container>
  )
  if(select === 3)
  return (
    <Container>
      <IconContainer>
        <IconButton backgroundColor='beige' 
          label='장애인 관광편의시설'
          onClick={() => {
            changeSelect(1)
          }}/>
        <IconButton backgroundColor='beige' 
          label='장애인 관광숙박'
          onClick={() => {
            changeSelect(2)
          }} />
        <IconButton backgroundColor='beige' 
          label='장애인 관광음식점'
          onClick={() => {
            changeSelect(3)
          }}/>
      </IconContainer>
      <ListContainer>
        <DataList label={markerD3}></DataList>
      </ListContainer>
    </Container>
  )
  
  return (
    <Container>
      <IconContainer>
        <IconButton backgroundColor='beige' 
          label='장애인 관광편의시설'
          onClick={() => {
            changeSelect(1)
          }}/>
        <IconButton backgroundColor='beige' 
          label='장애인 관광숙박'
          onClick={() => {
            changeSelect(2)
          }} />
        <IconButton backgroundColor='beige' 
          label='장애인 관광음식점'
          onClick={() => {
            changeSelect(3)
          }}/>
      </IconContainer>
      <ListContainer>
        <DataList></DataList>
      </ListContainer>
    </Container>
  )
}

const Container = styled.div`
  flex: 1;
  box-sizing: border-box;
  border: 1px solid black;
  height: 600px;
  display: flex;
  flex-direction: column;
`;

const IconContainer = styled.div`
  flex: 1;
  box-sizing: border-box;
  border: 1px solid black;
  display: flex;
`;

const ListContainer = styled.div`
  flex: 5;
  box-sizing: border-box;
  border: 1px solid black;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
`;

export default Side;