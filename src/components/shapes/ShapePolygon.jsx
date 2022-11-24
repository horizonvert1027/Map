/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Polygon } from '@react-google-maps/api';
import { setShapeActive, setFitShapeId, setShapeProps, addSnapshot } from 'redux/actions/drawing';
import { setDrawingSidebar } from 'redux/actions/layout';
import { hideContextMenu, showContextMenu } from "redux/actions/map";

export default function ShapePolygon({ map, shape, readonly }) {
  const dispatch = useDispatch();

  const { editMode, fitShapeId } = useSelector(state => state.drawing);

  const [polygon, setPolygon] = useState(null);

  useEffect(() => {
    if (fitShapeId && fitShapeId === shape.id) {
      const bounds = new window.google.maps.LatLngBounds();
      for (let p of shape.path) bounds.extend(p);
      map.fitBounds(bounds);
      dispatch(setFitShapeId(0));
    }
  }, [fitShapeId]);

  return (
    <Polygon
      path={shape.path}
      options={{
        strokeColor: shape.color, fillColor: shape.color,
        draggable: !shape.locked && shape.active && !readonly,
        editable: !shape.locked && shape.active && !readonly,
        clickable: editMode === 'normal' && !readonly
      }}
      onLoad={polygon => setPolygon(polygon)}
      onUnmount={() => setPolygon(null)}
      onMouseDown={() => {
        dispatch(hideContextMenu());
      }}
      onMouseUp={() => {
        let path = [];
        polygon.getPath().forEach(p => {
          path[path.length] = { lat: p.lat(), lng: p.lng() };
        });
        dispatch(setShapeProps({ id: shape.id, path: path }));
        dispatch(setShapeActive(shape.id));
        dispatch(setDrawingSidebar('polygon'));
        dispatch(addSnapshot());
      }}
      onRightClick={e => {
        dispatch(setShapeActive(shape.id));
        dispatch(showContextMenu({ x: e.domEvent.clientX, y: e.domEvent.clientY, list: ['lock-shape', 'fit-bounds', 'delete-shape'] }));
      }}
    />
  );
}