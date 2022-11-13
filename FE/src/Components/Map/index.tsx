import React, {useEffect, useReducer, useRef, useState, useContext, useCallback} from 'react';
import styled from 'styled-components';
import axios from 'axios';

import { Button } from './Button';
import { Input } from './Input';
import Side from './Side';
import { SideContext } from '../../Contexts/Side';

/** 공공데이터 reducer 타입 */
type Action = 
  | { type: 'LOADING';}
  | { type: 'SUCCESS'; data: JSON;}
  | { type: 'ERROR' ; error: string | unknown}

/** 공공데이터 state 타입 */
type State = 
  {loading: any; data: any; error: any}
; 

/** 공공데이터를 가져올 때 사용할 reducer */
const reducer = (state: any, action: Action) => {
  switch (action.type) {
    case 'LOADING':
      return {
        loading: true,
        data: null,
        error: null,
      };
    case 'SUCCESS':
      return {
        loading: false,
        data: action.data,
        error: null,
      }
    case 'ERROR':
      return {
        loading: false,
        data: null,
        error: action.error,
      }
    default: 
      throw new Error(`unhandled error`);
  }
}

const Map = () => {

  const fetchData = async () => {
    try {
      const res = await axios.get('/');
      console.log(res);
    } catch (e) {
      console.log(e);
    }
    finally {console.log('실행')}
  }

  useEffect(() => {
    fetchData();
  }, []);

  /** 내가 있는 현재 위치 */
  const [myLocation, setMyLocation] = useState<{latitude: number; longitude: number} | string>(``);
  /** 검색 주소 */
  const [search, setSearch] = useState(``);
  /** 검색 좌표 */
  const [searchCoord, setSearchCoord] = useState<{x: number; y: number} | string>(``);

  /* 공공데이터 상태 */
  const [state1, dispatch1] = useReducer(reducer, {
    loading: false,
    data: null,
    error: null,
  })

  const [state2, dispatch2] = useReducer(reducer, {
    loading: false,
    data: null,
    error: null,
  })

  const [state3, dispatch3] = useReducer(reducer, {
    loading: false,
    data: null,
    error: null,
  })

  const {select} = useContext(SideContext);

  let dataArray1: any = [];
  let dataArray2: any = [];
  let dataArray3: any = [];

  /** 지도를 담은 ref 객체 */
  const mapElement = useRef<HTMLElement | null | any>(null);

  /** 지도의 마커를 담은 ref 객체 */
  const markerRef = useRef<any | null>(null);

  /** 주소 검색 */
  const searchAddress = async () => {
    naver.maps.Service.geocode({
      query: search
    }, async function(status, response) {
      if(status === naver.maps.Service.Status.ERROR) {
        console.log('오류');
      }
      // 지도 위치 검색 좌표로 이동
      mapElement.current.panTo(new naver.maps.LatLng(Number(response.v2.addresses[0].y), Number(response.v2.addresses[0].x)));
      setSearchCoord({x: Number(response.v2.addresses[0].y), y: Number(response.v2.addresses[0].x)});
    })
  }

  /** 현재 위치추적에 성공했을 때 위치값을 넣는다 */
  const success = (position: any) => {
    setMyLocation({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    })
  }

  /** 현재 위치추적에 실패했을 때 초기값을 넣는다 */
  const fail = () => {
    setMyLocation({
      latitude: 37.4979517,
      longitude: 127.0276188,
    })
  }

  /** 선택한 공공데이터에 따른 데이터 배열 생성 */
  const createArray = useCallback((state: State, a: number) => {
    if(a === 1) {
      for(let i=0; i<10; i++) {
        naver.maps.Service.geocode({
          query: state.data.viewAmenitiesInfo.row[i].ADDR
        }, function (status, response) {
          if(status === naver.maps.Service.Status.ERROR) {
            console.log('오류');
          }
          dataArray1[i] = response.v2.addresses[0];
        })
      }
      console.log(dataArray1);
    }
    if(a === 2) {
      for(let i=0; i<10; i++) {
        naver.maps.Service.geocode({
          query: state.data.stayLodgeInfo.row[i].ADDR
        }, function (status, response) {
          if(status === naver.maps.Service.Status.ERROR) {
            console.log('오류');
          }
          dataArray2[i] = response.v2.addresses[0];
        })
      }
    }
    if(a === 3) {
      for(let i=0; i<10; i++) {
        naver.maps.Service.geocode({
          query: state.data.touristFoodInfo.row[i].ADDR
        }, function (status, response) {
          if(status === naver.maps.Service.Status.ERROR) {
            console.log('오류');
          }
          dataArray3[i] = response.v2.addresses[0];
        })
      }
    }
  }, []);

  /** 현재 위치를 추적 */
  useEffect(() => {
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, fail);
    }
  }, []);
  
  /* 지도 생성 */
  useEffect(() => {
    const {naver} = window;
    if(typeof myLocation !== 'string') 
      mapElement.current = new naver.maps.Map('map', {
        center: new naver.maps.LatLng(myLocation.latitude, myLocation.longitude),
        zoomControl: true,
        zoom: 14,
        zoomControlOptions: {
          position: naver.maps.Position.TOP_RIGHT,
        }
      });
      console.log('지도 호출');
  }, [mapElement, myLocation]);

  /* 마커 생성 */
  useEffect(() => {
    if(typeof myLocation !== 'string'){
      markerRef.current = new naver.maps.Marker({
        position: new naver.maps.LatLng(myLocation.latitude, myLocation.longitude),
        map: mapElement.current,
      })
      /* 마커 클릭 시 지도 이동 */
      naver.maps.Event.addListener(markerRef.current, 'click', () => {
        const mapLatLng = new naver.maps.LatLng(myLocation.latitude, myLocation.longitude);
        mapElement.current.panTo(mapLatLng, {duration: 400});
      })
    }
  }, [myLocation]);

  /* 공공데이터 가져오기 */
  useEffect(() => {
    const fetchUsers1 = async () => {
      dispatch1({ type: 'LOADING' });
      try {
        const response = await axios.get(
          `http://openapi.seoul.go.kr:8088/486857594b726863383574794f4669/json/viewAmenitiesInfo/1/900/`
        );
        dispatch1({ type: 'SUCCESS', data: response.data });
      } catch (e) {
        dispatch1({ type: 'ERROR', error: e});
      }
    }
    const fetchUsers2 = async () => {
      dispatch2({ type: 'LOADING' });
      try {
        const response = await axios.get(
          `http://openapi.seoul.go.kr:8088/486857594b726863383574794f4669/json/stayLodgeInfo/1/280/`
        );
        dispatch2({ type: 'SUCCESS', data: response.data });
      } catch (e) {
        dispatch2({ type: 'ERROR', error: e});
      }
    }
    const fetchUsers3 = async () => {
      dispatch3({ type: 'LOADING' });
      try {
        const response = await axios.get(
          `http://openapi.seoul.go.kr:8088/486857594b726863383574794f4669/json/touristFoodInfo/1/150/`
        );
        dispatch3({ type: 'SUCCESS', data: response.data });
      } catch (e) {
        dispatch3({ type: 'ERROR', error: e});
      }
    }
    fetchUsers1();
    fetchUsers2();
    fetchUsers3();
  }, []);

  /** select에 따른 데이터 배열 생성 */
  useEffect(() => {
    if(select === 1) {
      createArray(state1, 1);
    }
    if(select === 2) {
      createArray(state2, 2);
    }
    if(select === 3) {
      createArray(state3, 3);
    }
  }, [select, state1, state2, state3, createArray])

  /** 지도 로딩 시(현재 위치 찾는 중)에 화면 렌더링 */
  if(typeof myLocation === 'string') 
  return (
    <MapContents>
      <MapContainer>
        <div style={{textAlign: 'center', fontSize: '30px', lineHeight: '600px'}}>Loading...</div>
      </MapContainer>
    </MapContents>
  )

  return (
    <>
    <MapContents>
      <SearchContainer>
        <Input placeholder='검색' onChange={(text) => setSearch(text)}/>
        <Button backgroundColor='beige' onClick={() => {
          searchAddress()
          }} />
      </SearchContainer>
      <MapContainer>
        <div id="map" style={{minHeight: '600px',}}></div>
      </MapContainer>
    </MapContents>
    <SideContents>
      <Side />
    </SideContents>
    </>
  )
};

const MapContents = styled.div`
  position: relative;
  box-sizing: border-box;
  flex: 2;
  height: 600px;
`;

const SearchContainer = styled.div`
  position: relative;
  top: 1rem;
  width: 305px;
  height: 40px;
  z-index: 2;
  margin: 0 auto;
`;

const MapContainer = styled.div`
  position: relative;
  z-index: 1;
  top: -40px;
`;

const SideContents = styled.div`
  flex: 1;
`;

export default Map;