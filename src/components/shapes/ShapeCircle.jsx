/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Circle } from '@react-google-maps/api';
import { useDispatch, useSelector } from "react-redux";
import { setFitShapeId, setShapeProps, addSnapshot, setShapeActive } from 'redux/actions/drawing';
import { setDrawingSidebar } from "redux/actions/layout";
import { hideContextMenu, showContextMenu } from "redux/actions/map";

export default function ShapeCircle({ map, shape, readonly }) {
  const dispatch = useDispatch();

  const { editMode, fitShapeId } = useSelector(state => state.drawing);
  const [circle, setCircle] = useState(null);
  const [diff, setDiff] = useState({ lat: 0, lng: 0 });
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    if (fitShapeId && fitShapeId === shape.id) {
      map.fitBounds(circle.getBounds());
      dispatch(setFitShapeId(0));
    }
  }, [fitShapeId]);

  return (
    <Circle
      center={{ lat: shape.lat, lng: shape.lng }}
      radius={shape.radius}
      options={{
        strokeColor: shape.color,
        fillColor: shape.color,
        strokeOpacity: 1,
        strokeWeight: 3,
        fillOpacity: 0.3,
        draggable: !shape.locked && shape.active && !readonly,
        editable: !shape.locked && shape.active && !readonly,
        clickable: editMode === 'normal' && !readonly,
      }}
      onLoad={circle => setCircle(circle)}
      onUnmount={() => setCircle(null)}
      onClick={e => {
        dispatch(hideContextMenu());
        dispatch(setShapeActive(shape.id));
        dispatch(setDrawingSidebar('circle'));
      }}
      onDragStart={e => {
        dispatch(hideContextMenu());
        setDiff({ lat: shape.lat - e.latLng.lat(), lng: shape.lng - e.latLng.lng() });
        setDragging(true);
      }}
      onDragEnd={e => {
        dispatch(setShapeProps({ id: shape.id, lat: e.latLng.lat() + diff.lat, lng: e.latLng.lng() + diff.lng }));
        dispatch(addSnapshot());
        setDragging(false);
      }}
      onCenterChanged={() => {
        if (circle && !dragging) {
          let pos = circle.getCenter();
          if (pos.lat() !== shape.lat || pos.lng() !== shape.lng) {
            dispatch(hideContextMenu());
            dispatch(setShapeProps({ id: shape.id, lat: pos.lat(), lng: pos.lng() }));
            dispatch(addSnapshot());
          }
        }
      }}
      onRadiusChanged={() => {
        if (circle) {
          let radius = circle.getRadius();
          if (radius !== shape.radius) {
            dispatch(hideContextMenu());
            dispatch(setShapeProps({ id: shape.id, radius }));
            dispatch(addSnapshot());
          }
        }
      }}
      onRightClick={e => {
        dispatch(setShapeActive(shape.id));
        dispatch(showContextMenu({ x: e.domEvent.clientX, y: e.domEvent.clientY, list: ['lock-shape', 'fit-bounds', 'delete-shape'] }));
      }}
    />
  );
}
