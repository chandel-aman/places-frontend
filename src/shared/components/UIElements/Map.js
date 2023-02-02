import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax

import classes from "./Map.module.css";

mapboxgl.accessToken=process.env.REACT_APP_MAPBOX_API_ACCESS_TOKEN;

const Map = (props) => {
  // eslint-disable-next-line
  const { center, zoom } = props;

  const mapContainer = useRef(null);
  const map = useRef(null);

  // eslint-disable-next-line
  const [coordinates, setCoordinates] = useState(center);
  
  // eslint-disable-next-line
  const [zoomVal, setZoomVal] = useState(12);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: coordinates,
      zoom: zoomVal,
    });

    // Creating default markers
    new mapboxgl.Marker({ color: "Red" })
      .setLngLat(coordinates)
      .addTo(map.current);

    // Adding navigation control (the +/- zoom buttons)
    map.current.addControl(new mapboxgl.NavigationControl(), "top-left");

    //Adding fullscreen controls
    map.current.addControl(new mapboxgl.FullscreenControl(), "top-right");

    //Adding directions control
    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
        showUserHeading: true,
      })
    );

    // Clean up on unmount
    return () => map.current.remove();
  });

  return <div ref={mapContainer} className={classes.map} />;
};

export default Map;
