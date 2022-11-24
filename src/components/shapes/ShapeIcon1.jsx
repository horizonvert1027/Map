/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setShapeActive, setShapeProps, addSnapshot, setFitShapeId } from 'redux/actions/drawing';
import { setDrawingSidebar } from "redux/actions/layout";
import { hideContextMenu, showContextMenu } from "redux/actions/map";
import { Marker } from "@react-google-maps/api";
import TrashSvg from 'assets/images/trash.svg';
  const camIcon = {
    // path: "M0 0 0-2C0-5 0-6-4-4L-7-2-7-2C-7-4-8-5-10-5L-21-5C-23-5-24-4-24-2L-24 2C-24 4-23 5-21 5L-10 5C-8 5-7 4-7 2L-7 2-7 2-4 4C0 6 0 5 0 2L0 0M-7-2-7 2",
    //path: "M7 0 7-2C7-5 7-6 3-4L0-2 0-2C0-4-1-5-3-5L-14-5C-16-5-17-4-17-2L-17 2C-17 4-16 5-14 5L-3 5C-1 5 0 4 0 2L0 2 0 2 3 4C7 6 7 5 7 2L7 0M0-2 0 2",
    strokeWeight: 2,
    strokeColor: "#fff",
    draggable: true,
    scale: 1.4,
    fillOpacity: 1,
    strokeOpacity: 1,
  };
export default function ShapeIcon({ map, shape, readonly }) {
  const dispatch = useDispatch();
  const [iconMaker, setIconMaker] = useState(null);
  const { setting } = useSelector(state => state.setting);
  const { fitShapeId } = useSelector(state => state.drawing);
  // console.log(shape.color);
  // useEffect(() => {
  //   if (fitShapeId && fitShapeId === shape.id) {
  //     const bounds = new window.google.maps.LatLngBounds();
  //     map.setCenter({ lat: shape.lat, lng: shape.lng });
  //     map.fitBounds(bounds);
  //     dispatch(setFitShapeId(0));
  //   }
  // }, [fitShapeId]);

  useEffect(() => {
    if (fitShapeId && fitShapeId === shape.id) {
      map.fitBounds(iconMaker.getBounds());
      dispatch(setFitShapeId(0));
    }
  }, [fitShapeId]);


        // icon={{ ...{ ...camIcon, url: shape.src, fillColor: shape.color }, scale: setting.cameraFontSize * shape.size }}
        // icon={{
        //   url: shape.src,
        //   fillColor: shape.color,
        //   color: 'green',
        //   size: new window.google.maps.Size(50*shape.size, 50*shape.size),
        //   origin: new window.google.maps.Point(0, 0),
        //   anchor: new window.google.maps.Point(17, 34),
        //   scaledSize: new window.google.maps.Size(50*shape.size, 50*shape.size)
        // }}
  return (
    <>
      <Marker
        icon={{
          url: shape.src,
          fillColor: shape.color,
          color: 'green',
          size: new window.google.maps.Size(50*shape.size, 50*shape.size),
          origin: new window.google.maps.Point(0, 0),
          anchor: new window.google.maps.Point(17, 34),
          className: 'icon-green',
          scaledSize: new window.google.maps.Size(50*shape.size, 50*shape.size)
        }}    
        position={{ lat: shape.lat, lng: shape.lng }}
        draggable={!shape.locked && !readonly}
        clickable={!readonly}
        options={{ 
          fillColor: shape.color,
          filter: 'invert(48%) sepia(79%) saturate(2476%) hue-rotate(86deg) brightness(118%) contrast(119%)',          
          strokeColor: '#000000',
          scale: setting.cameraFontSize * shape.size,
          raiseOnDrag: false
        }}
        opacity={1 - shape.opacity}
        onLoad={(icon) => setIconMaker(icon)}
        onDragStart={e => {
          dispatch(hideContextMenu());
        }}

        onDragEnd={e => {
          dispatch(setShapeProps({ id: shape.id, lat: e.latLng.lat(), lng: e.latLng.lng() }));
          dispatch(addSnapshot());
        }}
        onClick={() => {
          dispatch(setShapeActive(shape.id));
          dispatch(setDrawingSidebar('icon'));
          dispatch(hideContextMenu());
        }}
        onRightClick={e => {
          dispatch(setShapeActive(shape.id));
          dispatch(showContextMenu({ x: e.domEvent.clientX, y: e.domEvent.clientY, list: ['new-camera', 'lock-shape', 'delete-shape'] }));
        }}
      />
    </>
  );
}
