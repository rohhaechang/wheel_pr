import React from 'react';
import styled from 'styled-components';
import {AiOutlineSearch} from 'react-icons/ai';
import { darken } from 'polished';

interface Props {
  readonly backgroundColor?: string,
  readonly onClick?: () => void,
}

interface ContainerProps {
  readonly backgroundColor: string,
}

const Container = styled.div<ContainerProps>`
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  display: inline-block;
  width: 40px;
  padding: 16px 8px;
  margin-left: 2.5px;
  margin-right: 2.5px;
  box-sizing: border-box;
  text-align: center;
  background-color: ${(props) => props.backgroundColor};
  cursor: pointer;
  &:hover {
    background-color: ${(darken(0.1, 'beige'))};
  }
  &:active {
    box-shadow: inset 5px 5px 10px rgba(0, 0, 0, 0.2);
  }
`;

export const Button = ({backgroundColor = 'beige', onClick}: Props) => {
  return (
    <Container backgroundColor={backgroundColor} onClick={onClick}>
      <AiOutlineSearch size='20' color='green' style={{marginBottom: '-5px'}}></AiOutlineSearch>
    </Container>
  )
};