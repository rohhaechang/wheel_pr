import React, { useContext } from 'react';
import styled from 'styled-components';
import { SideContext } from '../../../../Contexts/Side';
import { PublicDataContext } from '../../../../Contexts/publicData';

interface Props {
  label?: Array<any>
}

const DataList = ({label}: Props) => {
  const {select} = useContext(SideContext);
  const {data1, data2, data3} = useContext(PublicDataContext);

  // 해냈다 
  const moveMarker = (e: any) => {
    if(select === 1) {
      data1
        ?.find((i) => i.seq === e.seq)
        ?.marker?.trigger('click')
    }
    if(select === 2) {
      data2
        ?.find((i) => i.seq === e.seq)
        ?.marker?.trigger('click')
    }
    if(select === 3) {
      data3
        ?.find((i) => i.seq === e.seq)
        ?.marker?.trigger('click')
    }
  }

  if(select !== undefined) 
  return (
    <Container>
      {label?.map((e) => <Label onClick={() => moveMarker(e)} key={e.seq}>{e.sisulname}</Label>)}
    </Container>
  )
  
  return (
    <Container>
      <Label>로딩</Label>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  border-bottom: 1px solid #BDBDBD;
  flex-direction: column;
`;

const Label = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  flex-basis: 80px;
  font-size: 16px;
  border-bottom: 1px solid black;
`;

export default DataList;