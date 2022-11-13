import React from 'react';
import styled from 'styled-components';

interface Props {
  readonly placeholder?: string,
  readonly onChange?: (text: string) => void;
}

const InputBox = styled.input`
  font-size: 16px;
  width: 260px;
  padding: 15px 10px;
  opacity: 0.8;
  box-sizing: border-box;
  border-radius: 8px;
  border: 0.5px solid black;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

export const Input = ({placeholder, onChange}: Props) => {
  return (
    <InputBox 
      placeholder={placeholder}
      onChange={(e) => {
        if(typeof onChange === 'function') {
          onChange(e.target.value);
        }
      }}
      />
  )
}