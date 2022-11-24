/* eslint-disable react-hooks/exhaustive-deps */
import { Polyline } from "@react-google-maps/api";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFitShapeId, setShapeProps, addSnapshot, setShapeActive } from 'redux/actions/drawing';
import { setDrawingSidebar } from 'redux/actions/layout';
import { hideContextMenu, showContextMenu } from "redux/actions/map";

export default function ShapeWall({ map, shape, readonly }) {
  const dispatch = useDispatch();
  const { fitShapeId } = useSelector(state => state.drawing);

  const [polyline, setPolyline] = useState(null);

  useEffect(() => {
    if (fitShapeId && fitShapeId === shape.id) {
      const bounds = new window.google.maps.LatLngBounds();
      for (let p of shape.path) bounds.extend(p);
      map.fitBounds(bounds);
      dispatch(setFitShapeId(0));
    }
  }, [fitShapeId]);

  return (
    <Polyline
      path={shape.path}
      options={{
        strokeColor: shape.color,
        draggable: !shape.locked && shape.active && !readonly,
        editable: !shape.locked && shape.active && !readonly,
        clickable: !readonly,
        strokeOpacity: 1,
        strokeWeight: 5,
        zIndex: 10
      }}
      onLoad={polyline => setPolyline(polyline)}
      onUnmount={() => setPolyline(null)}
      onMouseUp={() => {
        let path = [];
        polyline.getPath().forEach(p => {
          path[path.length] = { lat: p.lat(), lng: p.lng() };
        });
        dispatch(setShapeProps({ id: shape.id, path: path }));
        dispatch(setShapeActive(shape.id));
        dispatch(setDrawingSidebar('polyline'));
        dispatch(addSnapshot());
      }}
      onMouseDown={() => {
        dispatch(hideContextMenu());
      }}
      onRightClick={e => {
        dispatch(setShapeActive(shape.id));
        dispatch(showContextMenu({ x: e.domEvent.clientX, y: e.domEvent.clientY, list: ['lock-shape', 'fit-bounds', 'delete-shape'] }));
      }}
    />
  );
}