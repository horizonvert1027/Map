/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setShapeActive, setShapeProps, addSnapshot } from 'redux/actions/drawing';
import { setDrawingSidebar } from "redux/actions/layout";
import LabelOverlay from "components/controls/overlays/LabelOverlay";
import { showContextMenu } from "redux/actions/map";
import { Rectangle } from "@react-google-maps/api";
import { bounds2Json } from "utils/map";

// let label = {}, background = {}, foreground = {};

export default function ShapeLabel({ map, shape, readonly }) {
  const dispatch = useDispatch();

  const { editMode } = useSelector(state => state.drawing);
  const { zoom } = useSelector(state => state.map);

  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [rectangle, setRectangle] = useState(null);

  const handleClick = () => {
    if (!readonly) {
      dispatch(setShapeActive(shape.id));
      dispatch(setDrawingSidebar('label'));
    }
  };
  const calcOffsetX = () => {
    const nameArr = shape.name.split('\n');
    let len = 0;
    for (var i = 0; i < nameArr.length; i++) {
      len = nameArr[i].length > len?nameArr[i].length:len;
    }
    return (shape.fontSize * 5 * len + 15) / Math.pow(2, zoom)
  }
  useEffect(() => {
    setOffset({
      x: calcOffsetX(),
      y: (shape.fontSize * 8 * shape.name.split('\n').length + 5) / Math.pow(2, zoom),
    });
  }, [zoom, shape]);

  return (
    <div onClick={handleClick}>
      <LabelOverlay
        position={{ lat: shape.lat, lng: shape.lng }}
        readonly={readonly}
        label={shape.name}
        color={shape.color}
        fontSize={shape.fontSize}
        borderColor={shape.borderColor}
        backgroundColor={shape.backgroundColor}
        onChange={v => {
          dispatch(setShapeProps({ id: shape.id, name: v }));
          dispatch(addSnapshot());
        }}
      />
      {shape.active && <Rectangle
        bounds={{
          north: shape.lat - offset.y,
          south: shape.lat + offset.y,
          east: shape.lng + offset.x,
          west: shape.lng - offset.x,
        }}
        options={{
          strokeColor: "#fff",
          strokeWeight: 0,
          fillColor: "#000",
          fillOpacity: 0,
          draggable: !shape.locked && shape.active && !readonly,
          editable: !shape.locked && shape.active && !readonly,
          clickable: editMode === 'normal' && !readonly
        }}
        onLoad={rectangle => setRectangle(rectangle)}
        onUnmount={() => setRectangle(null)}
        onBoundsChanged={() => {
          if (rectangle) {
            let bounds = bounds2Json(rectangle.getBounds());
            let pos = { lat: (bounds.ne.lat + bounds.sw.lat) / 2, lng: (bounds.ne.lng + bounds.sw.lng) / 2 };
            if (shape.lat !== pos.lat || shape.lng !== pos.lng) {
              dispatch(setShapeProps({ id: shape.id, lat: pos.lat, lng: pos.lng }));
            }
          }
        }}
        onRightClick={e => {
          dispatch(setShapeActive(shape.id));
          dispatch(showContextMenu({ x: e.domEvent.clientX, y: e.domEvent.clientY, list: ['lock-shape', 'delete-shape'] }));
        }}
      />}
    </div>
  );
}