import React, {useEffect, useRef, useState, useContext} from 'react';
import styled from 'styled-components';
import axios from 'axios';
import {MdRefresh} from 'react-icons/md';

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
  const {data1, data2, data3, changeData1, changeData2, changeData3, changeMarkerD1, changeMarkerD2, changeMarkerD3} = useContext(PublicDataContext);
  /** 지도를 담은 ref 객체 */
  const mapElement = useRef<HTMLElement | null | any>(null);
  /** 지도의 처음, 검색 시 마커를 담은 ref 객체 */
  const markerRef = useRef<any | null>(null);
  /** 데이터의 마커를 담은 ref 객체 */
  const dataMarkerRef = useRef<any | null>(null);

  /** 사이드에 뜨는 마커를 담은 배열 */
  let array1: any[] = [];
  let array2: any[] = [];
  let array3: any[] = [];

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
  
  /** select(전역 변수) 변화 시 마커 생성 */
  const selectMarker = (a: number | undefined) => {
    if(a !== undefined) {
      let mapBounds = mapElement.current.getBounds();
      if(a === 1) {
        if(!data1[0].marker){
          data1.map((element: any) => {
            if(element.y !== null && element.x !== null) {
              dataMarkerRef.current = new naver.maps.Marker({
                position: new naver.maps.LatLng(Number(element.y), Number(element.x)),
                map: mapElement.current,
              })
              let contentString = [
                `<div style="padding: 0 20px">`,
                `<h2 style="text-align: center">${element.sisulname}</h2>`,
                `<pre>${element.addr}<br>`,
                `tel: ${element.tel}</pre>`,
                `</div>`
              ].join(``);
              let infowindow = new naver.maps.InfoWindow({
                content: contentString,
                backgroundColor: "#eee",
                borderColor: "#000000",
                borderWidth: 2,
                anchorColor: "#eee"
              })
              naver.maps.Event.addListener(dataMarkerRef.current, 'click', () => {
                const mapLatLng = new naver.maps.LatLng(Number(element.y), Number(element.x));
                mapElement.current.panTo(mapLatLng, {duration: 400});
              })
              element.marker = dataMarkerRef.current;
              // 현재 마커를 클릭 시 infowindow가 나오게 한다. 마커를 dataMarkerRef.current로 할 시에 가장 최근의 ref를 기점으로 하여 선택되므로, 이 함수가 나오기 이전에 element에 마커를 집어넣어 element.marker로 해당하는 마커를 찾도록 하였다.
              naver.maps.Event.addListener(dataMarkerRef.current, 'click', () => {
                if(infowindow.getMap())  {
                  infowindow.close();
                } else {
                  infowindow.open(mapElement.current, element.marker)
                }
              })
              let position = dataMarkerRef.current.getPosition();
              if(!mapBounds.hasLatLng(position)) {
                dataMarkerRef.current.setMap(null);
              } else {
                array1.push(element);
              }
            }
            else {
              console.log('데이터 없음')
            }
          })
          removeMarker(1);
          changeMarkerD1(array1);
        }
        else {
          data1.forEach((e) => {
            if(e.y !== null) {
              let position = e.marker.getPosition();
              if(mapBounds.hasLatLng(position)) {
                e.marker.setMap(mapElement.current);
                array1.push(e);
              }
            }
          })
          removeMarker(1);
          changeMarkerD1(array1);
        }
      }
      if(a === 2) {
        if(!data2[0].marker) {
          data2.map((element: any) => {
            if(element.y !== null && element.x !== null) {
              dataMarkerRef.current = new naver.maps.Marker({
                position: new naver.maps.LatLng(Number(element.y), Number(element.x)),
                map: mapElement.current,
              })
              let contentString = [
                `<div style="padding: 5px">`,
                `<h2 style="text-align: center">${element.sisulname}</h2>`,
                `<pre>${element.addr}<br>`,
                `tel: ${element.tel}</pre>`,
                `</div>`
              ].join(``);
              let infowindow = new naver.maps.InfoWindow({
                content: contentString,
                backgroundColor: "#eee",
                borderColor: "#000000",
                borderWidth: 2,
                anchorColor: "#eee"
              })
              naver.maps.Event.addListener(dataMarkerRef.current, 'click', () => {
                const mapLatLng = new naver.maps.LatLng(Number(element.y), Number(element.x));
                mapElement.current.panTo(mapLatLng, {duration: 400});
              })
              element.marker = dataMarkerRef.current;
              naver.maps.Event.addListener(dataMarkerRef.current, 'click', () => {
                if(infowindow.getMap())  {
                  infowindow.close();
                } else {
                  infowindow.open(mapElement.current, element.marker);
                }
              })
              let position = dataMarkerRef.current.getPosition();
              if(!mapBounds.hasLatLng(position)) {
                dataMarkerRef.current.setMap(null);
              } else {
                array2.push(element);
              }
            }
            else {
              console.log('데이터 없음')
            }
          })
          removeMarker(2);
          changeMarkerD2(array2);
        }
        else {
          data2.forEach((e) => {
            if(e.y !== null) {
              let position = e.marker.getPosition();
              if(mapBounds.hasLatLng(position)) {
                e.marker.setMap(mapElement.current);
                array2.push(e)
              }
            }
          })
          removeMarker(2);
          changeMarkerD2(array2);
        }
      }
      if(a === 3) {
        if(!data3[0].marker) {
          data3.map((element: any) => {
            if(element.y !== null && element.x !== null){
              dataMarkerRef.current = new naver.maps.Marker({
                position: new naver.maps.LatLng(Number(element.y), Number(element.x)),
                map: mapElement.current,
              })
              let contentString = [
                `<div style="padding: 5px">`,
                `<h2 style="text-align: center">${element.sisulname}</h2>`,
                `<pre>${element.addr}<br>`,
                `tel: ${element.tel}</pre>`,
                `</div>`
              ].join(``);
              let infowindow = new naver.maps.InfoWindow({
                content: contentString,
                backgroundColor: "#eee",
                borderColor: "#000000",
                borderWidth: 2,
                anchorColor: "#eee"
              })
              naver.maps.Event.addListener(dataMarkerRef.current, 'click', () => {
                const mapLatLng = new naver.maps.LatLng(Number(element.y), Number(element.x));
                mapElement.current.panTo(mapLatLng, {duration: 400});
              })
              element.marker = dataMarkerRef.current;
              naver.maps.Event.addListener(dataMarkerRef.current, 'click', () => {
                if(infowindow.getMap())  {
                  infowindow.close();
                } else {
                  infowindow.open(mapElement.current, element.marker)
                }
              })
              let position = dataMarkerRef.current.getPosition();
              if(!mapBounds.hasLatLng(position)) {
                dataMarkerRef.current.setMap(null);
              } else {
                array3.push(element);
              }
            }
            else {
              console.log('데이터 없음')
            }
          })
          removeMarker(3);
          changeMarkerD3(array3);
        }
        else {
          data3.forEach((e) => {
            if(e.y !== null) {
              let position = e.marker.getPosition();
              if(mapBounds.hasLatLng(position)) {
                e.marker.setMap(mapElement.current);
                array3.push(e);
              }
            }
          })
          removeMarker(3);
          changeMarkerD3(array3);
        }
      }    
    }
    else console.log('오류');
  };

  /** select에 따른 마커 제거 */
  const removeMarker = (a: number) => {
    if(a === 1) {
      if(data2[0].marker) {
        data2.forEach((e) => {
          if(e.y !== null) {
            e.marker.setMap(null);
          }
        })
      }
      if(data3[0].marker) {
        data3.forEach((e) => {
          if(e.y !== null) {
            e.marker.setMap(null);
          }
        })
      }
      changeMarkerD2([]);
      changeMarkerD3([]);
    }
    if(a === 2) {
      if(data1[0].marker) {
        data1.forEach((e) => {
          if(e.y !== null) {
            e.marker.setMap(null);
          }
        })
      }
      if(data3[0].marker) {
        data3.forEach((e) => {
          if(e.y !== null) {
            e.marker.setMap(null);
          }
        })
      }
      changeMarkerD1([]);
      changeMarkerD3([]);
    }
    if(a === 3) {
      if(data1[0].marker) {
        data1.forEach((e) => {
          if(e.y !== null) {
            e.marker.setMap(null);
          }
        })
      }
      if(data2[0].marker) {
        data2.forEach((e) => {
          if(e.y !== null) {
            e.marker.setMap(null);
          }
        })
      }
      changeMarkerD1([]);
      changeMarkerD2([]);
    }
  }

  /** 현재 지도에서 다시 검색하기
   * 왜 잘 작동하는지 모르겠다...
   */
  const remarking = (a: number | undefined) => {
    selectMarker(a);
  }

  /** 서버에서 공공데이터 받아오기 */
  const getData = async (a?: string) => {
    try {
      const res = await axios.get(`api${a}`);
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
  };
  // ex) res.data[].x

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
    }
  }, [myLocation]);

  /** select에 따른 마커 생성 */
  useEffect(() => {
    selectMarker(select);
  }, [select]);

  /** 서버에서 공공데이터 받아오는 useEffect */
  useEffect(() => {
    getData('1');
    getData('2');
    getData('3');
  }, []);

  /** 엔터 누를 시 검색과 같은 효과 */
  const KeyDownHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if(event.code === "Enter") {
      searchAddress();
    }
  }

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
        <Input onKeyDown={KeyDownHandler} placeholder='검색' onChange={(text) => setSearch(text)}/>
        <Button backgroundColor='beige' onClick={() => {
          searchAddress()
          }} />
        <ReButton onClick={() => remarking(select)}><MdRefresh size='18' style={{marginRight: '5px', marginLeft: '-4px', marginBottom: '-4px' }}/>현 지도에서 검색</ReButton>
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

const ReButton = styled.button`
  width: 150px;
  height: 40px;
  z-index: 3;
  margin-top: 1rem;
  border-radius: 15px;
  margin-left: 20%;
  border: none;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  background-color: white;
  color: #0066ff;
  cursor: pointer;
`;

export default Map;