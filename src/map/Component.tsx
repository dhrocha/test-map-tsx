import {
  DirectionsRenderer,
  GoogleMap,
  useJsApiLoader,
} from "@react-google-maps/api";
import React, { useEffect, useState } from "react";
import { center, containerStyle } from "./config";

const loadDirections = (
  origin: any,
  destination: any,
  route: any,
  array: any,
  map: any
) => {
  const directionsService = new google.maps.DirectionsService();
  const waypoints = route.map((item: any) => {
    const { lat, long } = item!;
    return { location: new google.maps.LatLng(lat, long) };
  });

  directionsService.route(
    {
      origin: origin,
      destination: destination,
      travelMode: google.maps.TravelMode.DRIVING,
      waypoints: waypoints,
    },
    (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        array.push({ directions: result });
      } else {
        console.error(`error fetching directions ${result}`);
      }
    }
  );
};

function MyComponent() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY!,
  });

  const [map, setMap] = useState(null);
  const [directions, setDirections] = useState<any>([]);
  const [origin] = useState({ lat: 6.5244, lng: 3.3792 });
  const [destination] = useState({ lat: 6.4667, lng: 3.45 });
  const [routes] = useState([
    [{ lat: 6.4698, long: 3.5852 }],
    [{ lat: 6.6018, long: 3.3515 }],
  ]);

  const onLoad = React.useCallback(function callback(map: any) {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map: any) {
    setMap(null);
  }, []);

  useEffect(() => {
    if (map) {
      const array: any = [];
      routes.forEach(async (route: any) => {
        loadDirections(origin, destination, route, array, map);
      });
      setTimeout(() => {
        setDirections(array);
      }, 3000);
    }
  }, [map]);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={13}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      {directions &&
        directions?.map((item: any) => {
          return <DirectionsRenderer options={item} key={Math.random()} />;
        })}

      {/* Child components, such as markers, info windows, etc. */}
      <></>
    </GoogleMap>
  ) : (
    <></>
  );
}

export default React.memo(MyComponent);
