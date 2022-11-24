/* eslint-disable react-hooks/exhaustive-deps */
import { Polyline } from "@react-google-maps/api";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFitShapeId, setShapeProps, addSnapshot, setShapeActive } from 'redux/actions/drawing';
import { setDrawingSidebar } from 'redux/actions/layout';
import { hideContextMenu, showContextMenu } from "redux/actions/map";

export default function ShapePolyline({ map, shape, readonly }) {
  const dispatch = useDispatch();
  const { fitShapeId } = useSelector(state => state.drawing);

  const [polyline, setPolyline] = useState(null);
  const [icons, setIcons] = useState();

  useEffect(() => {
    let temp = [];
    if (shape.lineType === 'dotted') {
      temp = [{
        icon: { path: 'M 0,0 0,0.1', strokeOpacity: 1, scale: 3 },
        offset: '0',
        repeat: '6px'
      }];
    } else if (shape.lineType === 'dashed') {
      temp = [{
        icon: { path: 'M 0,-1 0,1', strokeOpacity: 1, scale: 3 },
        offset: '10px',
        repeat: '12px'
      }];
    } else if (shape.lineType === 'longdash') {
      temp = [{
        icon: { path: 'M 0,-2 0,2', strokeOpacity: 1, scale: 3 },
        offset: '10px',
        repeat: '18px'
      }];
    }

    if (shape.arrowType === 'start' || shape.arrowType === 'both') {
      temp.push({
        icon: {
          path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          fillColor: shape.color,
          fillOpacity: 1,
          strokeOpacity: 1,
        },
        offset: '100%',
      });
    }
    if (shape.arrowType === 'end' || shape.arrowType === 'both') {
      temp.push({
        icon: {
          path: window.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
          fillColor: shape.color,
          fillOpacity: 1,
          strokeOpacity: 1,
        },
        offset: '0%',
      });
    }

    setIcons(temp);
  }, [shape.lineType, shape.arrowType, shape.color]);

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
        strokeOpacity: shape.lineType !== 'normal' ? 0 : 1,
        icons: icons,
      }}
      onLoad={polyline => setPolyline(polyline)}
      onUnmount={() => setPolyline(null)}
      onMouseUp={() => {
        let path = [];
        polyline.getPath().forEach(p => {
          path[path.length] = { lat: p.lat(), lng: p.lng() };
        });
        dispatch(setShapeActive(shape.id));
        dispatch(setShapeProps({ id: shape.id, path: path }));
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