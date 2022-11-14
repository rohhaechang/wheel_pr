import React, {useState, createContext} from 'react';

interface Context {
  readonly data1: Array<any>,
  readonly data2: Array<any>,
  readonly data3: Array<any>,
  readonly changeData1: (array: Array<any>) => void;
  readonly changeData2: (array: Array<any>) => void;
  readonly changeData3: (array: Array<any>) => void;
}

const PublicDataContext = createContext<Context>({
  data1: [],
  data2: [],
  data3: [],
  changeData1: () :void => {},
  changeData2: () :void => {},
  changeData3: () :void => {},
})

interface Props {
  children: JSX.Element | JSX.Element[];
}

const PublicDataProvider = ({children}: Props) => {
  const [data1, setData1] = useState<any>([]);
  const [data2, setData2] = useState<any>([]);
  const [data3, setData3] = useState<any>([]);

  const changeData1 = (array: Array<any>) => {
    setData1(array);
  }
  const changeData2 = (array: Array<any>) => {
    setData2(array);
  }
  const changeData3 = (array: Array<any>) => {
    setData3(array);
  }

  return (
    <PublicDataContext.Provider
      value={{
        data1,
        data2,
        data3,
        changeData1,
        changeData2,
        changeData3,
      }}>
        {children}
    </PublicDataContext.Provider>
  )
}

export {PublicDataContext, PublicDataProvider};