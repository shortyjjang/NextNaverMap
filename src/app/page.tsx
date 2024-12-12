"use client";
import Button from "@/entities/form/Button";
import IconMyLocation from "@/entities/icons/IconMyLocation";
import IconPanorama from "@/entities/icons/IconPanorama";
import IconRoadMap from "@/entities/icons/IconRoadMap";
import IconSync from "@/entities/icons/IconSync";
import IconTraffic from "@/entities/icons/IconTraffic";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";

interface Naver {
  maps: NaverMap;
}

interface NaverMap {
  Map: any;
  LatLng: any;
  setOptions: any;
  TrafficLayer: any;
  StreetLayer: any;
  setCenter: any;
  Marker: any;
  MapTypeId: {
    NORMAL: string;
    SATELLITE: string;
    TRAFFIC: string;
  };
  Position: {
    TOP_RIGHT: string;
    RIGHT_CENTER: string;
    TOP_LEFT: string;
    BOTTOM_LEFT: string;
    LEFT_TOP: string;
  };
  MapTypeControlStyle: {
    BUTTON: string;
    DROPDOWN: string;
  };
  Panorama: any;
  onJSContentLoaded: any;
  Event: any;
  getSize: any;
  getCenter: any;
  setPosition: any;
  setSize: any;
}
interface TrafficLayer {
  interval: number;
  getMap: () => any;
  setMap: (map: any) => void;
  startAutoRefresh: () => void;
  endAutoRefresh: () => void;
}
interface StreetLayer {
  getMap: () => any;
  setMap: (map: any) => void;
}
interface Panorama {
  getMap: () => any;
  setMap: (map: any) => void;
  setPosition: (position: any) => void;
  setSize: (size: any) => void;
  getPosition: () => any;
}

declare global {
  interface Window {
    naver: Naver;
  }
}

export default function Home() {
  const [naver, setNaver] = useState<Naver | null>(null);
  const nMap = useRef<NaverMap | null>(null);
  const MapRef = useRef<HTMLDivElement | null>(null);
  const trafficLayerRef = useRef<TrafficLayer | null>(null);
  const streetLayerRef = useRef<StreetLayer | null>(null);
  const panorama = useRef<Panorama | null>(null);
  const panoramaRef = useRef<HTMLDivElement | null>(null);
  const [defaultSize, setDefaultSize] = useState(15);
  const [trafficMode, setTrafficMode] = useState(false);
  const [streetMode, setStreetMode] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [panoramaMode, setPanoramaMode] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const initMap = async () => {
    if (!naver) return;
    const mapCenter = new naver.maps.LatLng(37.4950926, 126.8622169);
    nMap.current = new naver.maps.Map(MapRef.current, {
      zoom: defaultSize,
      mapTypeId: naver.maps.MapTypeId.NORMAL,
      center: mapCenter,
      mapTypeControl: true,
      mapTypeControlOptions: {
        style: naver.maps.MapTypeControlStyle.DROPDOWN,
        position: naver.maps.Position.TOP_RIGHT,
      },
      scaleControl: true,
      scaleControlOptions: {
        position: naver.maps.Position.RIGHT_CENTER,
      },
      logoControl: true,
      logoControlOptions: {
        position: naver.maps.Position.TOP_LEFT,
      },
      mapDataControl: true,
      mapDataControlOptions: {
        position: naver.maps.Position.BOTTOM_LEFT,
      },
      zoomControl: true, //줌 컨트롤의 표시 여부
      zoomControlOptions: {
        //줌 컨트롤의 옵션
        position: naver.maps.Position.LEFT_TOP,
      },
    });
    if (!nMap.current) return;
    //setOptions 메서드를 이용해 옵션을 조정할 수도 있습니다.
    nMap.current.setOptions("mapTypeControl", true); //지도 유형 컨트롤의 표시 여부
    await new Promise((resolve) => setTimeout(resolve, 1000));
    //트래픽 레이어 추가
    trafficLayerRef.current = new naver.maps.TrafficLayer({
      interval: 300000, //300초마다 레이어 업데이트
    });
    streetLayerRef.current = new naver.maps.StreetLayer();

    // 아이디 혹은 지도 좌표로 파노라마를 표시할 수 있습니다.
    panorama.current = new naver.maps.Panorama(panoramaRef.current, {
      position: mapCenter,
      pov: {
        pan: -133,
        tilt: 0,
        fov: 100,
      },
    });
    setPanoramaMode(false);
  };

  const handleStreetMode = () => {
    if (!streetLayerRef.current) return;
    if (streetLayerRef.current?.getMap()) {
      streetLayerRef.current?.setMap(null);
      setStreetMode(false);
    } else {
      streetLayerRef.current?.setMap(nMap.current);
      setStreetMode(true);
    }
  };

  const handleTrafficMode = () => {
    if (!trafficLayerRef.current) return;
    if (trafficLayerRef.current?.getMap()) {
      trafficLayerRef.current?.setMap(null);
      setTrafficMode(false);
    } else {
      trafficLayerRef.current?.setMap(nMap.current);
      trafficLayerRef.current?.startAutoRefresh();
      setTrafficMode(true);
      setAutoRefresh(true);
    }
  };

  const handleAutoRefresh = () => {
    if (autoRefresh) {
      trafficLayerRef.current?.endAutoRefresh();
      setAutoRefresh(false);
    } else {
      trafficLayerRef.current?.startAutoRefresh();
      setAutoRefresh(true);
    }
  };

  const handlePanorama = () => {};

  const handleMyLocation = (pos: any = currentPosition) => {
    if (!naver) return;
    if (!nMap.current) return;
    if (!pos) return getMyLocation();
    new naver.maps.Marker({
      map: nMap.current,
      position: new naver.maps.LatLng(pos.lat, pos.lng),
      icon: {
        content: `<div class="marker" style="background-position: -235px -90px;"></div>`,
      },
    });
    //현재위치로 이동
    const mapCenter = new naver.maps.LatLng(pos.lat, pos.lng);
    nMap.current.setCenter(mapCenter);
  };

  const getMyLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (geo) => {
        const pos = {
          lat: geo.coords.latitude,
          lng: geo.coords.longitude,
        };
        setCurrentPosition(pos);
        handleMyLocation(pos);
      },
      (error) => {
        alert("현재 위치를 찾을 수 없습니다.");
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  };

  useEffect(() => {
    if (!naver) return;
    if (!panorama.current) return;
    if (!nMap.current) return;
    // 파노라마 위치가 갱신되었을 때 발생하는 이벤트를 받아 지도의 중심 위치를 갱신합니다.
    naver.maps.Event.addListener(
      panorama.current,
      "pano_changed",
      function () {
        if (!panorama.current) return;
        if (!nMap.current) return;
        const latlng = panorama.current.getPosition();

        if (!latlng.equals(nMap.current.getCenter())) {
          nMap.current.setCenter(latlng);
        }
      }
    );

  // 지도를 클릭했을 때 발생하는 이벤트를 받아 파노라마 위치를 갱신합니다. 이때 거리뷰 레이어가 있을 때만 갱신하도록 합니다.
  naver.maps.Event.addListener(nMap.current, "click", function (e: any) {
    if (streetMode) {
      if (!panorama.current) return;
      if (!panoramaRef.current) return;
      const latlng = e.coord;

      // 파노라마의 setPosition()은 해당 위치에서 가장 가까운 파노라마(검색 반경 300미터)를 자동으로 설정합니다.
        panorama.current.setPosition(latlng);
        setPanoramaMode(true);
      }
    });
  }, [naver, panorama.current, nMap.current, streetMode]);

  useEffect(() => {
    if (!naver) return;
    if (!MapRef.current) return;
    initMap();
  }, [naver, MapRef.current]);
  return (
    <div className="h-screen w-screen relative">
      <Script
        strategy="lazyOnload"
        src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_CLIENT_ID}&amp;submodules=panorama`}
        onLoad={() => {
          const naver = window.naver as Naver;
          setNaver(naver);
        }}
      ></Script>
      <div id="map" ref={MapRef} className="w-full h-screen relative z-0"></div>
      <div className={`fixed top-3 left-12 z-0 ${panoramaMode ? "z-[10]" : "z-0"}`}>
      <div
        id="panorama"
        ref={panoramaRef}
        className={`w-[320px] h-[160px] ${panoramaMode ? "block" : "hidden"}`}
      ></div></div>
      <div className="fixed bottom-4 right-4 z-[+10] flex flex-col gap-2 items-end">
        <Button
          title="현재위치표시"
          className="px-1 py-1"
          onClick={() => handleMyLocation()}
        >
          <IconMyLocation />
        </Button>
        <Button
          title="거리뷰"
          className={`px-1 py-1 ${
            streetMode
              ? "text-blue-500 border-y-blue-500 border-x-blue-500"
              : "text-gray-500"
          }`}
          onClick={handleStreetMode}
        >
          <IconRoadMap className={streetMode ? "text-blue-500" : "text-gray-500"} />
        </Button>
        <div className="flex gap-1">
          {trafficMode ? (
            <Button
              title="자동타이머"
              className={`px-1 py-1 ${
                autoRefresh
                  ? "text-blue-500 border-y-blue-500 border-x-blue-500"
                  : "text-gray-500"
              }`}
              onClick={handleAutoRefresh}
            >
              <IconSync className={autoRefresh ? "text-blue-500" : "text-gray-500"} />
            </Button>
          ) : null}
          <Button
            title="교통상황표시"
            className={`px-1 py-1 ${
              trafficMode
                ? "text-blue-500 border-y-blue-500 border-x-blue-500"
                : "text-gray-500"
            }`}
            onClick={handleTrafficMode}
          >
            <IconTraffic className={trafficMode ? "text-blue-500" : "text-gray-500"} />
          </Button>
        </div>
        {/* {streetMode && (
          <Button title="사진뷰" className="px-1 py-1">
            <IconPanorama />
          </Button>
        )} */}
      </div>
    </div>
  );
}
