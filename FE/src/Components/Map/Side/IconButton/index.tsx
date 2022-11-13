import React from 'react';
import styled from 'styled-components';
import {darken} from 'polished';

interface Props {
  readonly label?: string,
  readonly backgroundColor: string,
  readonly onClick?: () => void,
}

interface IconProps {
  readonly backgroundColor: string,
}

const Icon = styled.div<IconProps>`
  flex: 1;
  display: inline-block;
  border: 1px solid black;
  padding-top: 40px;
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

export const IconButton = ({label, backgroundColor, onClick}: Props) => {
  return (
    <Icon backgroundColor={backgroundColor} onClick={onClick} >{label}</Icon>
  )
};