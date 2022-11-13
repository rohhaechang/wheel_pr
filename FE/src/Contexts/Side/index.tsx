import React, {useState, createContext} from 'react';

interface Context {
  readonly select: number | undefined;
  readonly changeSelect: (index: number) => void;
}

const SideContext = createContext<Context>({
  select: 1,
  changeSelect: () :void => {},
})

interface Props {
  children: JSX.Element | JSX.Element[];
}

const SideProvider = ({children}: Props) => {
  const [select, setSelect] = useState<number>();

  const changeSelect = (index: number): void => {
    setSelect(index);
  }

  return (
    <SideContext.Provider
      value={{
        select,
        changeSelect
      }}>
      {children}
    </SideContext.Provider>
  )
}

export {SideContext, SideProvider}