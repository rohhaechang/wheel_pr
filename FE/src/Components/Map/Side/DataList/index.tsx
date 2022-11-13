import React from 'react';
import styled from 'styled-components';

interface Props {
  label: string | number | undefined;
}

const DataList = ({label}: Props) => {
  return (
    <Container>
      <Label>{label}</Label>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  border-bottom: 1px solid #BDBDBD;
  align-items: center;
  margin: 10px;
  padding: 10px;
`;

const Label = styled.div`
  flex: 1;
  font-size: 16px;
  margin-right: 10px;
`;

export default DataList;