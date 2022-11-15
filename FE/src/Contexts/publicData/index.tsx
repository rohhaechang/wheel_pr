import React, {useState, createContext} from 'react';

interface Context {
  readonly data1: Array<any>,
  readonly data2: Array<any>,
  readonly data3: Array<any>,
  readonly markerD1: Array<any>,
  readonly markerD2: Array<any>,
  readonly markerD3: Array<any>,
  readonly changeData1: (array: Array<any>) => void;
  readonly changeData2: (array: Array<any>) => void;
  readonly changeData3: (array: Array<any>) => void;
  readonly changeMarkerD1: (array: Array<any>) => void;
  readonly changeMarkerD2: (array: Array<any>) => void;
  readonly changeMarkerD3: (array: Array<any>) => void;
}

const PublicDataContext = createContext<Context>({
  data1: [],
  data2: [],
  data3: [],
  markerD1: [],
  markerD2: [],
  markerD3: [],
  changeData1: () :void => {},
  changeData2: () :void => {},
  changeData3: () :void => {},
  changeMarkerD1: () :void => {},
  changeMarkerD2: () :void => {},
  changeMarkerD3: () :void => {},
})

interface Props {
  children: JSX.Element | JSX.Element[];
}

const PublicDataProvider = ({children}: Props) => {
  const [data1, setData1] = useState<any>([]);
  const [data2, setData2] = useState<any>([]);
  const [data3, setData3] = useState<any>([]);
  const [markerD1, setMarkerD1] = useState<any>([]);
  const [markerD2, setMarkerD2] = useState<any>([]);
  const [markerD3, setMarkerD3] = useState<any>([]);

  const changeData1 = (array: Array<any>) => {
    setData1(array);
  }
  const changeData2 = (array: Array<any>) => {
    setData2(array);
  }
  const changeData3 = (array: Array<any>) => {
    setData3(array);
  }
  const changeMarkerD1 = (array: Array<any>) => {
    setMarkerD1(array);
  }
  const changeMarkerD2 = (array: Array<any>) => {
    setMarkerD2(array);
  }
  const changeMarkerD3 = (array: Array<any>) => {
    setMarkerD3(array);
  }

  return (
    <PublicDataContext.Provider
      value={{
        data1,
        data2,
        data3,
        markerD1,
        markerD2,
        markerD3,
        changeData1,
        changeData2,
        changeData3,
        changeMarkerD1,
        changeMarkerD2,
        changeMarkerD3,
      }}>
        {children}
    </PublicDataContext.Provider>
  )
}

export {PublicDataContext, PublicDataProvider};