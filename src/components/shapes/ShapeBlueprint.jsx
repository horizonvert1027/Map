/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setShapeActive, setShapeProps, setFitShapeId, setEditMode, setBlueprintLoaded, addSnapshot } from 'redux/actions/drawing';
import { setDrawingSidebar } from "redux/actions/layout";
import ImageOverlay from "components/controls/overlays/ImageOverlay";
import { getDistance, getPositiveAngle, getTargetPoint, bearing } from "utils/cameras";
import { hideContextMenu, hideScalerModal, setNewScalerDistance, showContextMenu, showScalerModal } from "redux/actions/map";
import MarkerPng from 'assets/images/marker.png';
import { lineLength, polygonScale } from 'geometric';
import { latLng2Point, point2LatLng } from "utils/map";
import { Marker, Polygon } from "@react-google-maps/api";

let tempEditMode = '';
let scalerMarker1 = null;
let scalerMarker2 = null;
let scalerLine = null;

let overlays = {};

export default function Blueprint({ map, shape, readonly }) {
  const dispatch = useDispatch();
  const { editMode, fitShapeId, blueprintLoaded } = useSelector(state => state.drawing);
  const { scaler } = useSelector(state => state.map);

  const [marker1, setMarker1] = useState(null);
  const [marker2, setMarker2] = useState(null);
  const [marker3, setMarker3] = useState(null);
  const [marker4, setMarker4] = useState(null);
  const [marker5, setMarker5] = useState(null);
  const [polygon, setPolygon] = useState(null);
  const [dragging, setDragging] = useState(null);


  const dotIcon = {
    path: window.google.maps.SymbolPath.CIRCLE,
    scale: 5,
    fillColor: "#ff5700",
    fillOpacity: 1,
    strokeColor: "#fff",
    strokeWeight: 2
  }

  const rotateIcon = {
    path: "M 5 0 C 5 -3 3 -5 0 -5 C -3 -5 -5 -3 -5 0 C -5 3 -3 5 0 5 C 3 5 5 3 5 0 M 10 -1 L 12 -3 L 14 -1 Q 14 -14 1 -14 L 3 -12 L 1 -10 L -5 -16 L 1 -22 L 3 -20 L 1 -18 Q 18 -18 18 -1 L 20 -3 L 22 -1 L 16 5 L 10 -1",
    scale: 1,
    fillColor: '#ff5700',
    fillOpacity: 1,
    strokeColor: "#fff",
    strokeWeight: 2,
  };

  const scalerMarkerIcon = {
    icon: MarkerPng,
    draggable: true,
    // scaledSize: new window.google.maps.Size(50, 50)
    // raiseOnDrag: false
  }

  const scalerLineOption = {
    strokeColor: '#FF5700',
    strokeOpacity: 0,
    draggable: false,
    editable: false,
    clickable: false,
    icons: [{
      icon: {
        path: "M 0,-1 0,1",
        strokeOpacity: 1,
        scale: 2,
      }, offset: "0", repeat: "10px",
    }],
  }

  const setScale = (e, a, c) => {
    const basePos = latLng2Point(shape[a], map);
    const dragPos = latLng2Point({ lat: e.latLng.lat(), lng: e.latLng.lng() }, map);
    const centerPos = latLng2Point(shape[c], map);
    const center = [centerPos.x, centerPos.y];
    const d1 = lineLength([center, [basePos.x, basePos.y]]);
    const d2 = lineLength([center, [dragPos.x, dragPos.y]]);
    setScaledSize(d2 / d1, center);
  }

  const setRotation = e => {
    let centerPos = { lat: (shape.nw.lat + shape.se.lat) / 2, lng: (shape.nw.lng + shape.se.lng) / 2 };
    let rotation = getPositiveAngle(centerPos, { lat: e.latLng.lat(), lng: e.latLng.lng() }) - getPositiveAngle(centerPos, shape.ne);
    let distance = getDistance(centerPos, shape.ne);
    dispatch(setShapeProps({
      id: shape.id,
      nw: getTargetPoint(centerPos, bearing(centerPos, shape.nw) + rotation, distance),
      sw: getTargetPoint(centerPos, bearing(centerPos, shape.sw) + rotation, distance),
      se: getTargetPoint(centerPos, bearing(centerPos, shape.se) + rotation, distance),
      ne: getTargetPoint(centerPos, bearing(centerPos, shape.ne) + rotation, distance),
    }));
  }

  const setPosition = e => {
    const pos = polygon.getPath().getArray();
    dispatch(setShapeProps({
      id: shape.id,
      nw: { lat: pos[0].lat(), lng: pos[0].lng() },
      sw: { lat: pos[1].lat(), lng: pos[1].lng() },
      se: { lat: pos[2].lat(), lng: pos[2].lng() },
      ne: { lat: pos[3].lat(), lng: pos[3].lng() },
    }));
  };

  const setScaledSize = (scale, center) => {
    const id = shape.id;
    let nw = latLng2Point(shape.nw, map);
    let sw = latLng2Point(shape.sw, map);
    let se = latLng2Point(shape.se, map);
    let ne = latLng2Point(shape.ne, map);
    const poly = [[nw.x, nw.y], [sw.x, sw.y], [se.x, se.y], [ne.x, ne.y]];
    const scaled = polygonScale(poly, scale, center);
    nw = point2LatLng({ x: scaled[0][0], y: scaled[0][1] }, map);
    sw = point2LatLng({ x: scaled[1][0], y: scaled[1][1] }, map);
    se = point2LatLng({ x: scaled[2][0], y: scaled[2][1] }, map);
    ne = point2LatLng({ x: scaled[3][0], y: scaled[3][1] }, map);
    dispatch(setShapeProps({
      id, scale,
      nw: { lat: nw.lat(), lng: nw.lng() },
      sw: { lat: sw.lat(), lng: sw.lng() },
      se: { lat: se.lat(), lng: se.lng() },
      ne: { lat: ne.lat(), lng: ne.lng() },
    }));
    resetScaler();
  }

  const drawScalerLine = pos => {
    const path = [scalerMarker1.getPosition(), pos ? pos : scalerMarker2.getPosition()];
    scalerLine.setPath(path);
  }

  const resetScaler = () => {
    if (scalerMarker1) scalerMarker1.setMap(null);
    if (scalerMarker2) scalerMarker2.setMap(null);
    if (scalerLine) scalerLine.setMap(null);
    dispatch(setNewScalerDistance(0));
    dispatch(hideScalerModal());
  }

  const handleScalerModalOpen = markerNum => {
    const pos1 = scalerMarker1.getPosition();
    const pos2 = scalerMarker2.getPosition();
    const modalPos = latLng2Point(markerNum === 1 ? pos1 : pos2, map);
    const distance = getDistance({ lat: pos1.lat(), lng: pos1.lng() }, { lat: pos2.lat(), lng: pos2.lng() });
    dispatch(showScalerModal({ ...modalPos, distance }));
  }

  const handleScalerAction = e => {
    if (tempEditMode === 'scaler-start') {
      resetScaler();
      addScalerMarker1(e.latLng);
      dispatch(setEditMode('scaler-end'));
    } else if (tempEditMode === 'scaler-end') {
      addScalerMarker2(e.latLng);
      handleScalerModalOpen(2);
      drawScalerLine();
      dispatch(setEditMode('normal'));
    }
  }

  const onBlueprintLoad = () => {
    resetScaler();
    addScalerMarker1(shape.nw);
    addScalerMarker2(shape.ne);
    drawScalerLine();
    handleScalerModalOpen(2);
  }

  const addScalerMarker1 = pos => {
    scalerMarker1 = new window.google.maps.Marker({ map, position: pos, ...scalerMarkerIcon });
    window.google.maps.event.addListener(scalerMarker1, 'drag', e => {
      drawScalerLine();
    });
    window.google.maps.event.addListener(scalerMarker1, 'click', e => {
      handleScalerModalOpen(1);
    });
    window.google.maps.event.addListener(scalerMarker1, 'dragend', e => {
      handleScalerModalOpen(1);
    });
    scalerLine = new window.google.maps.Polyline({ map, path: [pos], ...scalerLineOption });
  }

  const addScalerMarker2 = pos => {
    scalerMarker2 = new window.google.maps.Marker({ map, position: pos, ...scalerMarkerIcon });
    window.google.maps.event.addListener(scalerMarker2, 'drag', e => {
      drawScalerLine();
    });
    window.google.maps.event.addListener(scalerMarker2, 'click', e => {
      handleScalerModalOpen(2);
    });
    window.google.maps.event.addListener(scalerMarker2, 'dragend', e => {
      handleScalerModalOpen(2);
    });
  }

  useEffect(() => {
    if (fitShapeId && fitShapeId === shape.id) {
      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend(shape.nw);
      bounds.extend(shape.sw);
      bounds.extend(shape.se);
      bounds.extend(shape.ne);
      map.fitBounds(bounds);
      dispatch(setFitShapeId(0));
    }
  }, [fitShapeId]);

  useEffect(() => {
    tempEditMode = editMode;
  }, [editMode]);

  useEffect(() => {
    if (blueprintLoaded) {
      onBlueprintLoad();
      dispatch(setBlueprintLoaded(false));
    }
  }, [blueprintLoaded]);

  useEffect(() => {
    if (shape.active && scaler && scaler.distance && scaler.newDistance) {
      let center = latLng2Point({ lat: (shape.nw.lat + shape.se.lat) / 2, lng: (shape.nw.lng + shape.se.lng) / 2 }, map);
      setScaledSize(scaler.newDistance / scaler.distance, [center.x, center.y]);
    }
  }, [scaler]);

  useEffect(() => {
    if (overlays[shape.id]) {
      overlays[shape.id].setPoints(shape);
      overlays[shape.id].setOpacity(1 - shape.opacity);
      overlays[shape.id].map_changed();
    }
  }, [shape]);

  useEffect(() => {
    overlays[shape.id] = new ImageOverlay(shape, shape.src, 1 - shape.opacity);
    overlays[shape.id].setMap(map);

    return () => {
      overlays[shape.id].setMap(null);
      delete overlays[shape.id];
      resetScaler();
    }
  }, []);

  return (
    <>
      <Marker
        position={shape.nw}
        icon={dotIcon}
        raiseOnDrag={false}
        visible={shape.active}
        draggable={!shape.locked && shape.active && !readonly}
        clickable={!readonly}
        onLoad={marker => setMarker1(marker)}
        onUnmount={() => setMarker1(null)}
        onDragStart={e => {
          marker1.setOptions({ opacity: 0 });
          marker5.setOptions({ visible: true });
          setDragging('nw');
          resetScaler();
        }}
        onDrag={e => setScale(e, 'nw', 'se')}
        onDragEnd={e => {
          setScale(e, 'nw', 'se');
          dispatch(addSnapshot());
          marker1.setOptions({ opacity: 1 });
          marker5.setOptions({ visible: false });
          setDragging(null);
        }}
      />

      <Marker
        position={shape.sw}
        icon={dotIcon}
        raiseOnDrag={false}
        visible={shape.active}
        draggable={!shape.locked && shape.active && !readonly}
        clickable={!readonly}
        onLoad={marker => setMarker2(marker)}
        onUnmount={() => setMarker2(null)}
        onDragStart={e => {
          marker2.setOptions({ opacity: 0 });
          marker5.setOptions({ visible: true });
          setDragging('sw');
          resetScaler();
        }}
        onDrag={e => setScale(e, 'sw', 'ne')}
        onDragEnd={e => {
          setScale(e, 'sw', 'ne');
          dispatch(addSnapshot());
          marker2.setOptions({ opacity: 1 });
          marker5.setOptions({ visible: false });
          setDragging(null);
        }}
      />

      <Marker
        position={shape.se}
        icon={dotIcon}
        raiseOnDrag={false}
        visible={shape.active}
        draggable={!shape.locked && shape.active && !readonly}
        clickable={!readonly}
        onLoad={marker => setMarker3(marker)}
        onUnmount={() => setMarker3(null)}
        onDragStart={e => {
          marker3.setOptions({ opacity: 0 });
          marker5.setOptions({ visible: true });
          setDragging('se');
          resetScaler();
        }}
        onDrag={e => setScale(e, 'se', 'nw')}
        onDragEnd={e => {
          setScale(e, 'se', 'nw');
          dispatch(addSnapshot());
          marker3.setOptions({ opacity: 1 });
          marker5.setOptions({ visible: false });
          setDragging(null);
        }}
      />

      <Marker
        position={shape.ne}
        icon={{ ...rotateIcon, rotation: bearing(shape.sw, shape.nw) }}
        raiseOnDrag={false}
        visible={shape.active}
        draggable={shape.active && !readonly}
        clickable={!readonly}
        onLoad={marker => setMarker4(marker)}
        onUnmount={() => setMarker4(null)}
        onDragStart={e => {
          marker4.setOptions({ opacity: 0 });
          marker5.setOptions({ visible: true });
          setDragging('ne');
        }}
        onDrag={e => setRotation(e)}
        onDragEnd={e => {
          setRotation(e);
          dispatch(addSnapshot());
          marker4.setOptions({ opacity: 1 });
          marker5.setOptions({ visible: false });
          setDragging(null);
        }}
      />

      <Marker
        position={shape[dragging]}
        icon={dragging !== 'ne' ? dotIcon : { ...rotateIcon, rotation: bearing(shape.sw, shape.nw) }}
        onLoad={marker => setMarker5(marker)}
        onUnmount={() => setMarker5(null)}
        raiseOnDrag={false}
        draggable={false}
      />

      <Polygon
        path={[shape.nw, shape.sw, shape.se, shape.ne]}
        options={{
          strokeOpacity: 0,
          strokeWeight: 0,
          fillOpacity: 0,
          draggable: !shape.locked && shape.active && !readonly,
          clickable: (editMode === 'normal' || editMode === 'scaler-start' || editMode === 'scaler-end') && !readonly
        }}
        onLoad={polygon => setPolygon(polygon)}
        onUnmount={() => setPolygon(null)}
        onDragStart={e => {
          dispatch(hideContextMenu());
          resetScaler();
        }}
        onDrag={e => setPosition(e)}
        onDragEnd={e => {
          setPosition(e);
          dispatch(addSnapshot());
        }}
        onMouseMove={e => {
          if (tempEditMode === 'scaler-start') {
            map.getDiv().firstChild.firstChild.childNodes[1].style.cursor = 'copy';
          }
          if (tempEditMode === 'scaler-end') {
            drawScalerLine(e.latLng);
          }
        }}
        onClick={e => {
          dispatch(setShapeActive(shape.id));
          dispatch(setDrawingSidebar('blueprint'));
          dispatch(hideContextMenu());
          handleScalerAction(e);
        }}
        onRightClick={e => {
          dispatch(setShapeActive(shape.id));
          dispatch(showContextMenu({ x: e.domEvent.clientX, y: e.domEvent.clientY, list: ['new-camera', 'lock-shape', 'fit-bounds', 'delete-shape'] }));
          resetScaler();
        }}
      />
    </>
  );
}
