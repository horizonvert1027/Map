/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Marker, Polygon, Polyline } from '@react-google-maps/api';
import { getTargetPoint, bearing, getArcPoints, getDistance, getEyesightPoints, getSegments, getZoneByDistance, getPolygonDifference, toRad } from "utils/cameras";
import { setFitShapeId, setShapeProps, addSnapshot, setShapeActive } from 'redux/actions/drawing';
import { setDrawingSidebar } from "redux/actions/layout";
import { hideContextMenu, showContextMenu } from "redux/actions/map";
import LabelOverlay from "components/controls/overlays/LabelOverlay";

let centerPos = {}, rotation = {}, distance = {};

export default function ShapeCamera({ map, shape, readonly }) {
  const dispatch = useDispatch();

  const walls = useSelector(state => state.drawing.shapes).filter(v => v.type === 'wall');
  const { setting } = useSelector(state => state.setting);
  const { editMode, fitShapeId } = useSelector(state => state.drawing);

  const [linePath, setLinePath] = useState([]);
  const [dragging, setDragging] = useState(false);

  const [polygon, setPolygon] = useState(null);

  const [polygonPath, setPolygonPath] = useState([]);
  const [eyesightPath, setEyesightPath] = useState([]);
  const [detectionPath, setDetectionPath] = useState([]);
  const [observationPath, setObservationPath] = useState([]);
  const [recognitionPath, setRecognitionPath] = useState([]);
  const [identificationPath, setIdentificationPath] = useState([]);
  const [pulling, setPulling] = useState(false);
  const camIcon = {
    // path: "M0 0 0-2C0-5 0-6-4-4L-7-2-7-2C-7-4-8-5-10-5L-21-5C-23-5-24-4-24-2L-24 2C-24 4-23 5-21 5L-10 5C-8 5-7 4-7 2L-7 2-7 2-4 4C0 6 0 5 0 2L0 0M-7-2-7 2",
    path: "M7 0 7-2C7-5 7-6 3-4L0-2 0-2C0-4-1-5-3-5L-14-5C-16-5-17-4-17-2L-17 2C-17 4-16 5-14 5L-3 5C-1 5 0 4 0 2L0 2 0 2 3 4C7 6 7 5 7 2L7 0M0-2 0 2",
    strokeWeight: 2,
    strokeColor: "#fff",
    draggable: true,
    scale: 1.4,
    fillOpacity: 1,
    strokeOpacity: 1,
  };
  const handleDot = {
    path: window.google.maps.SymbolPath.CIRCLE,
    scale: 5,
    fillColor: "#ff5700",
    fillOpacity: 1,
    strokeColor: "#fff",
    strokeWeight: 2
  }
  const manIcon = {
    path: "M0-28C-2-28-4-26-4-24-4-22-2-20 0-20 2-20 4-22 4-24 4-26 2-28 0-28M0 0 2 0C3 0 4-1 4-2L4-9C5-9 6-10 6-11L6-19C6-20 5-21 4-21L3-21C2-21 1-20 0-20-1-20-2-21-3-21L-4-21C-5-21-6-20-6-19L-6-11C-6-10-5-9-4-9L-4-2C-4-1-3 0-2 0L0 0",
    strokeWeight: 2,
    strokeColor: "#fff",
    draggable: true,
    scale: 1,
    fillOpacity: 1,
    strokeOpacity: 1,
  };

  const setPosition = (e, deepChange = false) => {
    dispatch(setShapeProps({ id: shape.id, lat: e.latLng.lat(), lng: e.latLng.lng(), deepChange }));
    if (deepChange) {
      dispatch(addSnapshot());
    }
  }

  const setAngle = (e, deepChange = false) => {
    let id = shape.id;
    let b1 = bearing(centerPos[id], getTargetPoint(centerPos[id], rotation[id], distance[id]));
    let b2 = bearing(centerPos[id], { lat: e.latLng.lat(), lng: e.latLng.lng() });
    let angle = Math.abs(b1 - b2) * 2;
    // dispatch(setShapeProps({ id: shape.id, angle: (angle > 180 ? 360 - angle : angle), deepChange }));
    dispatch(setShapeProps({ id: shape.id, angle: (angle > 360 ? 720 - angle : angle), deepChange }));
    if (deepChange) {
      dispatch(addSnapshot());
    }
  }

  const setDistanceAndRotation = (e, deepChange = false) => {
    let id = shape.id;
    dispatch(setShapeProps({ id: shape.id, distance: getDistance(centerPos[id], { lat: e.latLng.lat(), lng: e.latLng.lng() }), deepChange }));
    dispatch(setShapeProps({ id: shape.id, rotation: bearing(centerPos[id], { lat: e.latLng.lat(), lng: e.latLng.lng() }), deepChange }));
    if (deepChange) {
      setPulling(false);
      dispatch(addSnapshot());
    } else {
      setPulling(true);
    }
  }
  const getLabelXY = (rotate) => {
    let y = - Math.cos(toRad(rotate)) * (shape.name.length * 6 + (20-shape.name.length));
    let x = Math.sin(toRad(rotate)) * (shape.name.length * 6 + (20-shape.name.length ));
    return [x, y]
  }

  const draw = (deepChange) => {
    let id = shape.id;
    if (centerPos[id]) {

      let pos2 = getTargetPoint(centerPos[id], rotation[id] - shape.angle / 2, distance[id]);
      let pos3 = getTargetPoint(centerPos[id], rotation[id] + shape.angle / 2, distance[id]);
      let pos5 = getTargetPoint(centerPos[id], rotation[id], shape.irLength);

      let cameraPath = getArcPoints(centerPos[id], bearing(centerPos[id], pos2), bearing(centerPos[id], pos3), distance[id]);

      setPolygonPath(cameraPath);
      setDragging(true);

      if (deepChange) {
        setDragging(false);
        setLinePath([centerPos[id], pos5]);

        let segments = getSegments([...cameraPath, cameraPath[0]]);
        for (let wall of walls) {
          segments = [...segments, ...getSegments(wall.path)];
        }

        let eyePoint = getTargetPoint(centerPos[id], rotation[id], 0.1);
        const eyesightPoints = getEyesightPoints(eyePoint, segments);

        if (shape.ppmVisible) {
          if (shape.blindVisible && setting.blindVisible && shape.dzHeight > 0) {
            setDetectionPath(getZoneByDistance(shape, shape.zones.dead.distance, shape.zones.detection.distance, eyesightPoints));
            setObservationPath(getZoneByDistance(shape, shape.zones.dead.distance, shape.zones.observation.distance, eyesightPoints));
            setRecognitionPath(getZoneByDistance(shape, shape.zones.dead.distance, shape.zones.recognition.distance, eyesightPoints));
            setIdentificationPath(getZoneByDistance(shape, shape.zones.dead.distance, shape.distance, eyesightPoints));
          
          } else {
            setDetectionPath(getZoneByDistance(shape, 0, shape.zones.detection.distance, eyesightPoints));
            setObservationPath(getZoneByDistance(shape, 0, shape.zones.observation.distance, eyesightPoints));
            setRecognitionPath(getZoneByDistance(shape, 0, shape.zones.recognition.distance, eyesightPoints));
            setIdentificationPath(getZoneByDistance(shape, 0, shape.distance, eyesightPoints));
          }
          // setObservationPath(getZoneByDistance(shape, shape.zones.detection.distance, shape.zones.observation.distance, eyesightPoints));
          // setRecognitionPath(getZoneByDistance(shape, shape.zones.observation.distance, shape.zones.recognition.distance, eyesightPoints));
          // setIdentificationPath(getZoneByDistance(shape, shape.zones.recognition.distance, shape.distance, eyesightPoints));
        } else {
          if (shape.blindVisible && setting.blindVisible && shape.dzHeight > 0) {
            const deadZone = getArcPoints(centerPos[id], bearing(centerPos[id], pos2), bearing(centerPos[id], pos3), shape.zones.dead.distance);
            setEyesightPath(getPolygonDifference(eyesightPoints, deadZone)[0]);
          } else {
            setEyesightPath(eyesightPoints);
          }
        }
      }
    }
  }


  useEffect(() => {
    if (map && shape) {
      draw(true);
    }
  }, [map]);

  useEffect(() => {
    if (shape) {
      centerPos[shape.id] = { lat: shape.lat, lng: shape.lng };
      rotation[shape.id] = shape.rotation;
      distance[shape.id] = shape.distance;
      draw(shape.deepChange);
    }
  }, [shape, editMode, walls]);

  useEffect(() => {
    if (fitShapeId && fitShapeId === shape.id) {
      const bounds = new window.google.maps.LatLngBounds();
      polygon.getPath().forEach(p => {
        bounds.extend(p);
      })
      map.fitBounds(bounds);
      dispatch(setFitShapeId(0));
    }
  }, [fitShapeId]);

  return (
    <>
      <Marker
        position={{ lat: shape.lat, lng: shape.lng }}
        draggable={!shape.locked && !readonly}
        clickable={!readonly}
        icon={{ ...{ ...camIcon, fillColor: shape.color }, rotation: rotation[shape.id] - 90, scale: setting.cameraFontSize * 1.4 }}
        onDragStart={e => {
          dispatch(setShapeActive(shape.id));
          dispatch(hideContextMenu());
        }}
        onDrag={e => setPosition(e)}
        onDragEnd={e => setPosition(e, true)}
        onClick={e => {
          dispatch(setShapeActive(shape.id));
          dispatch(setDrawingSidebar('camera'));
          dispatch(hideContextMenu());
        }}
        onRightClick={e => {
          dispatch(setShapeActive(shape.id));
          dispatch(showContextMenu({ x: e.domEvent.clientX, y: e.domEvent.clientY, list: ['all-cameras', 'lock-shape', 'fit-bounds', 'delete-shape'] }));
        }}
      />

      <Marker
        position={getTargetPoint({ lat: shape.lat, lng: shape.lng }, rotation[shape.id] - shape.angle / 2, distance[shape.id])}
        draggable={!readonly}
        clickable={!readonly}
        icon={{ ...{ ...handleDot, fillColor: shape.color } }}
        raiseOnDrag={false}
        visible={shape.active}
        options={{ visible: shape.active && setting.rangeVisible }}
        onDrag={e => setAngle(e)}
        onDragEnd={e => setAngle(e, true)}
      />

      <Marker
        position={getTargetPoint({ lat: shape.lat, lng: shape.lng }, rotation[shape.id] + shape.angle / 2, distance[shape.id])}
        draggable={!readonly}
        clickable={!readonly}
        icon={{ ...{ ...handleDot, fillColor: shape.color } }}
        raiseOnDrag={false}
        visible={shape.active}
        options={{ visible: shape.active && setting.rangeVisible }}
        onDrag={e => setAngle(e)}
        onDragEnd={e => setAngle(e, true)}
      />

      <Marker
        position={getTargetPoint({ lat: shape.lat, lng: shape.lng }, rotation[shape.id], distance[shape.id])}
        draggable={!readonly}
        clickable={!readonly}
        icon={{ ...{ ...manIcon, fillColor: shape.color, labelOrigin: new window.google.maps.Point(30,-10) }, scale: setting.cameraFontSize }}
//        label={pulling?shape.distance:'dddd'}
        options={{ visible: setting.manVisible && setting.rangeVisible }}
        onDrag={e => setDistanceAndRotation(e)}
        onDragEnd={e => setDistanceAndRotation(e, true)}
      />

      <Polyline
        path={linePath}
        options={{
          zIndex: 4,
          geodesic: true,
          strokeColor: "red",
          strokeOpacity: 1.0,
          strokeWeight: 3,
          visible: !dragging && shape.irVisible && setting.irVisible && setting.rangeVisible
        }}
      />

      <Polygon
        path={polygonPath}
        options={{
          clickable: editMode === 'normal' && !readonly,
          strokeColor: shape.color,
          strokeOpacity: 1,
          strokeWeight: 2,
          title: shape.name,
          fillOpacity: 0,
          zIndex: 2,
          geodesic: true
        }}
        onLoad={polygon => setPolygon(polygon)}
        onUnmount={() => setPolygon(null)}
        onClick={e => {
          dispatch(setShapeActive(shape.id));
          dispatch(setDrawingSidebar('camera'));
        }}
        onRightClick={e => {
          dispatch(setShapeActive(shape.id));
          dispatch(showContextMenu({ x: e.domEvent.clientX, y: e.domEvent.clientY, list: ['new-camera', 'lock-shape', 'fit-bounds', 'delete-shape'] }));
        }}
      />

      <Polygon
        path={eyesightPath}
        options={{
          strokeWeight: 1,
          strokeColor: shape.color,
          fillColor: shape.color,
          fillOpacity: shape.zones.recognition.opacity,
          strokeOpacity: shape.zones.detection.opacity / 2,
          clickable: false,
          visible: !dragging && setting.rangeVisible && !shape.ppmVisible
        }}
      />

      <Polygon
        paths={detectionPath}
        options={{
          strokeWeight: 1,
          strokeColor: shape.color,
          fillColor: shape.color,
          fillOpacity: shape.zones.detection.opacity,
          strokeOpacity: shape.zones.detection.opacity / 2,
          clickable: false,
          visible: !dragging && setting.rangeVisible && shape.ppmVisible,
          geodesic: true,
        }}
      />

      <Polygon
        paths={observationPath}
        options={{
          strokeWeight: 1,
          strokeColor: shape.color,
          fillColor: shape.color,
          fillOpacity: shape.zones.observation.opacity,
          strokeOpacity: shape.zones.observation.opacity / 2,
          clickable: false,
          visible: !dragging && setting.rangeVisible && shape.ppmVisible,
          geodesic: true,
        }}
      />

      <Polygon
        paths={recognitionPath}
        options={{
          strokeWeight: 1,
          strokeColor: shape.color,
          fillColor: shape.color,
          fillOpacity: shape.zones.recognition.opacity,
          strokeOpacity: shape.zones.recognition.opacity / 2,
          clickable: false,
          visible: !dragging && setting.rangeVisible && shape.ppmVisible,
          geodesic: true,
        }}
      />

      <Polygon
        paths={identificationPath}
        options={{
          strokeWeight: 1,
          strokeColor: shape.color,
          fillColor: shape.color,
          fillOpacity: shape.zones.identification.opacity,
          strokeOpacity: shape.zones.identification.opacity / 2,
          clickable: false,
          visible: !dragging && setting.rangeVisible && shape.ppmVisible,
          geodesic: true,
        }}
      />

      {setting.nameVisible &&
        <LabelOverlay
          position={{ lat: shape.lat, lng: shape.lng }}
          readonly={readonly}
          label={shape.name}
          offset={getLabelXY(rotation[shape.id])}
          onChange={v => dispatch(setShapeProps({ id: shape.id, name: v }))}
          color='white'
          borderColor='black'
          fontSize={setting.cameraFontSize}
        />
      }
      {pulling &&
        <LabelOverlay
          position={getTargetPoint({ lat: shape.lat, lng: shape.lng }, rotation[shape.id], distance[shape.id])}
          readonly={readonly}
          label={(shape.distance * 1).toFixed(2) + 'm'}
          offset={[35,-10]}
          onChange={v => {}}
          color='white'
          borderColor='black'
          fontSize={setting.cameraFontSize}
        />
      }
    </>
  );
}
