/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setShapeActive, setShapeProps, addSnapshot, setFitShapeId } from 'redux/actions/drawing';
import { OverlayView, Rectangle } from "@react-google-maps/api";
import { setDrawingSidebar } from "redux/actions/layout";
import { hideContextMenu, showContextMenu } from "redux/actions/map";
import { Marker } from "@react-google-maps/api";
import { bounds2Json } from "utils/map";

export default function ShapeIcon({ map, shape, readonly }) {
  const dispatch = useDispatch();
  const { setting } = useSelector(state => state.setting);
  const [rectangle, setRectangle] = useState(null);
  const [offset, setOffset] = useState({x: 0, y: 0});
  const { fitShapeId } = useSelector(state => state.drawing);
  const { zoom } = useSelector(state => state.map);
  useEffect(() => {
    if (fitShapeId && fitShapeId === shape.id) {
      map.fitBounds(rectangle.getBounds());
      dispatch(setFitShapeId(0));
    }
  }, [fitShapeId]);
  useEffect(() => {
    setOffset({
      x: 50/ Math.pow(2, zoom),
      y: 50/ Math.pow(2, zoom),
    });
  }, [zoom, shape]);

  return (
    <div>
      <Rectangle
        bounds={{
          north: shape.lat,
          south: shape.lat - offset.y,
          east: shape.lng + offset.x,
          west: shape.lng ,
        }}
        options={{
          strokeColor: "#fff",
          strokeWeight: 0,
          fillColor: "#000",
          fillOpacity: 0,
          draggable: !shape.locked && !readonly,
          clickable: !readonly
        }}
        opacity={1 - shape.opacity}
        onLoad={rectangle => setRectangle(rectangle)}
        onUnmount={() => setRectangle(null)}
        onBoundsChanged={() => {
          if (rectangle) {
            let bounds = bounds2Json(rectangle.getBounds());
            let pos = { lat: (bounds.ne.lat + bounds.sw.lat + offset.y) / 2, lng: (bounds.ne.lng + bounds.sw.lng -offset.x) / 2 };
            if (shape.lat !== pos.lat || shape.lng !== pos.lng) {
              dispatch(setShapeProps({ id: shape.id, lat: pos.lat, lng: pos.lng }));
            }
          }
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
      <OverlayView
        position={{ lat: shape.lat, lng: shape.lng }}
        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
      >    
        <div style={{
            width: shape.size*50,
            position: 'relative',
            height: shape.size*50,
            backgroundColor: shape.backgroundColor,
            borderRadius: '100%',   
          }}     
        >
          <img src={shape.src} alt='icon-maker' style={{
            width: shape.size*30, 
            height: shape.size*30, 
            filter: 'brightness(0) invert(1)',
            marginTop: shape.size*10,
            marginLeft: shape.size*10,
            opacity:1- shape.opacity,
          }} />
        </div>
      </OverlayView>
    </div>
  );
}
      // draggable={!shape.locked && !readonly}
      // clickable={!readonly}
      // options={{ 
      //   fillColor: shape.color,
      //   strokeColor: '#000000',
      //   scale: setting.cameraFontSize * shape.size,
      //   raiseOnDrag: false
      // }}