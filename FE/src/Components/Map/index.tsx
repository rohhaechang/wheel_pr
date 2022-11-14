import React, {useEffect, useRef, useState, useContext} from 'react';
import styled from 'styled-components';
import axios from 'axios';

import { Button } from './Button';
import { Input } from './Input';
import Side from './Side';
import { SideContext } from '../../Contexts/Side';
import { PublicDataContext } from '../../Contexts/publicData';

const Map = () => {

  /** 내가 있는 현재 위치 */
  const [myLocation, setMyLocation] = useState<{latitude: number; longitude: number} | string>(``);
  /** 검색 주소 */
  const [search, setSearch] = useState(``);
  /** 검색 좌표 */
  const [searchCoord, setSearchCoord] = useState<{x: number; y: number} | string>(``);
  /** side에서 시작하는 전역 상태 */
  const {select} = useContext(SideContext);
  /** 공공데이터를 담은 전역 상태 */
  const {data1, data2, data3, changeData1, changeData2, changeData3} = useContext(PublicDataContext);
  /** 지도를 담은 ref 객체 */
  const mapElement = useRef<HTMLElement | null | any>(null);
  /** 지도의 처음, 검색 시 마커를 담은 ref 객체 */
  const markerRef = useRef<any | null>(null);
  /** 데이터의 마커를 담은 ref 객체 */
  const dataMarkerRef = useRef<any | null>(null);
  /** 선택된 마커를 담은 ref 객체 */
  const selectedMarker = useRef<any | null>(null);

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
      // 검색 위치 마커 생성
      // 이전의 마커를 안 보이게
      markerRef.current.setMap(null);
      markerRef.current = new naver.maps.Marker({
        position: new naver.maps.LatLng(Number(response.v2.addresses[0].y), Number(response.v2.addresses[0].x)),
        map: mapElement.current,
      })
      naver.maps.Event.addListener(markerRef.current, 'click', () => {
        const mapLatLng = new naver.maps.LatLng(Number(response.v2.addresses[0].y), Number(response.v2.addresses[0].x));
        mapElement.current.panTo(mapLatLng, {duration: 400});
      })
      setSelectedMarker(markerRef.current);
      let infowindow = new naver.maps.InfoWindow({
        content: search,
        disableAnchor: true,
      })
      infowindow.open(mapElement.current, markerRef.current);
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

  /* 최초 위치 마커 생성 */
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
      setSelectedMarker(markerRef.current);
    }
  }, [myLocation]);

  /** 선택된 마커에 하이라이트를 주는 함수 - 실행 안 됨*/
  function setSelectedMarker(marker: any) {
  naver.maps.Event.addListener(marker, 'click', (e: any) => {
    if(!selectedMarker.current ||(selectedMarker.current !== marker)) {
      if(!!selectedMarker.current) {
        selectedMarker.current.setIcon({
        url: '../../asset/markericon.png',
        size: new naver.maps.Size(50, 58),
        origin: new naver.maps.Point(0, 0),
        anchor: new naver.maps.Point(25, 58),
        })
      }
      marker.setIcon({
        url: '../../asset/markericon.png',
        size: new naver.maps.Size(50, 58),
        origin: new naver.maps.Point(0, 0),
        anchor: new naver.maps.Point(25, 58),
      })
      selectedMarker.current = marker
    }
  })
  }

  /** select(전역 변수) 변화 시 마커 생성 */
  const selectMarker = (a: number | undefined) => {
    if(a !== undefined) {
      if(a === 1) {
        data1.map((element: any) => {
          if(element.y !== null && element.x !== null) {
            dataMarkerRef.current = new naver.maps.Marker({
              position: new naver.maps.LatLng(Number(element.y), Number(element.x)),
              map: mapElement.current,
            })
            naver.maps.Event.addListener(dataMarkerRef.current, 'click', () => {
              const mapLatLng = new naver.maps.LatLng(Number(element.y), Number(element.x));
              mapElement.current.panTo(mapLatLng, {duration: 400});
            })
            setSelectedMarker(dataMarkerRef.current);
            element.marker = dataMarkerRef.current;
          }
          else {
            console.log('데이터 없음')
          }
        })
      }
      if(a === 2) {
        data2.map((element: any) => {
          if(element.y !== null && element.x !== null) {
            dataMarkerRef.current = new naver.maps.Marker({
              position: new naver.maps.LatLng(Number(element.y), Number(element.x)),
              map: mapElement.current,
            })
            naver.maps.Event.addListener(dataMarkerRef.current, 'click', () => {
              const mapLatLng = new naver.maps.LatLng(Number(element.y), Number(element.x));
              mapElement.current.panTo(mapLatLng, {duration: 400});
            })
            setSelectedMarker(dataMarkerRef.current);
            element.marker = dataMarkerRef.current;
          }
          else {
            console.log('데이터 없음')
          }
        })
      }
      if(a === 3) {
        data3.map((element: any) => {
          if(element.y !== null && element.x !== null){
            dataMarkerRef.current = new naver.maps.Marker({
              position: new naver.maps.LatLng(Number(element.y), Number(element.x)),
              map: mapElement.current,
            })
            naver.maps.Event.addListener(dataMarkerRef.current, 'click', () => {
              const mapLatLng = new naver.maps.LatLng(Number(element.y), Number(element.x));
              mapElement.current.panTo(mapLatLng, {duration: 400});
            })
            setSelectedMarker(dataMarkerRef.current);
            element.marker = dataMarkerRef.current;
          }
          else {
            console.log('데이터 없음')
          }
        })
      }    
    }
    else console.log('오류');
  }

  useEffect(() => {
    selectMarker(select);
  }, [select]);

  // const postData = () => {
  //   for(let i=0; i<array12.length; i++) {
  //     naver.maps.Service.geocode({
  //       query: array12[i].addr
  //     }, function(status, response) {
  //       if(status === naver.maps.Service.Status.ERROR) {
  //         console.log('오류');
  //       }
  //       array23[i] = response.v2.addresses[0];
  //     })
  //   }
  // }

  /** 서버에서 공공데이터 받아오기 */

  const getData = async (a?: string) => {
    try {
      const res = await axios.get(`/api${a}`);
      if(a === '1') {
        changeData1(res.data);
      }
      if(a === '2') {
        changeData2(res.data);
      }
      if(a === '3') {
        changeData3(res.data);
      }
    } catch (e) {
      console.log(e);
    }
  }
  // ex) res.data[].x

  useEffect(() => {
    getData('1');
    getData('2');
    getData('3');
  }, []);

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