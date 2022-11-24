/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setShapeActive, setShapeProps, setFitShapeId, addSnapshot } from 'redux/actions/drawing';
import { setDrawingSidebar } from "redux/actions/layout";
import { getDistance, getPositiveAngle, getTargetPoint, bearing } from "utils/cameras";
import { latLng2Point, point2LatLng, json2Bounds } from "utils/map";
import { hideContextMenu, showContextMenu } from "redux/actions/map";
import { Marker, Polygon } from "@react-google-maps/api";

export default function ShapeRectangle({ map, shape, readonly }) {
  const dispatch = useDispatch();
  const { editMode, fitShapeId } = useSelector(state => state.drawing);

  const [marker1, setMarker1] = useState(null);
  const [marker2, setMarker2] = useState(null);
  const [marker3, setMarker3] = useState(null);
  const [marker4, setMarker4] = useState(null);
  const [marker5, setMarker5] = useState(null);
  const [marker6, setMarker6] = useState(null);
  const [polygon, setPolygon] = useState(null);
  const [dragging, setDragging] = useState(['rotate']);

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

  const getPath = (a, b) => {
    return { lat: (shape['path'][a]['lat'] + shape['path'][b]['lat']) / 2, lng: (shape['path'][a]['lng'] + shape['path'][b]['lng']) / 2 };
  }
  const getRotatePath = () => {
  	return shape.path.sw;
  }
  const setPath = (e, a, b) => {
    const basePos = latLng2Point({ lat: (shape['path'][a]['lat'] + shape['path'][b]['lat']) / 2, lng: (shape['path'][a]['lng'] + shape['path'][b]['lng']) / 2 }, map);
    const dragPos = latLng2Point({ lat: e.latLng.lat(), lng: e.latLng.lng() }, map);
    const conerPos = latLng2Point({ lat: shape['path'][b]['lat'], lng: shape['path'][b]['lng']}, map);
    const coner1Pos = latLng2Point({ lat: shape['path'][a]['lat'], lng: shape['path'][a]['lng']}, map);
    if (basePos.y - conerPos.y === 0) { //right and left side
	    const changeA =  point2LatLng({x: coner1Pos.x, y: dragPos.y}, map);
	    const changeB =  point2LatLng({x: conerPos.x, y: dragPos.y}, map);

	    dispatch(setShapeProps({
	      id: shape.id,
	      path: {...shape.path,[a]: {lat: changeA.lat(), lng: changeA.lng()}, [b]: {lat: changeB.lat(), lng: changeB.lng()}}
	    }))
    } else if (basePos.x - conerPos.x === 0) { //bottom
	    const changeA =  point2LatLng({x: dragPos.x, y: coner1Pos.y}, map);
	    const changeB =  point2LatLng({x: dragPos.x, y: conerPos.y}, map);

	    dispatch(setShapeProps({
	      id: shape.id,
	      path: {...shape.path,[a]: {lat: changeA.lat(), lng: changeA.lng()}, [b]: {lat: changeB.lat(), lng: changeB.lng()}}
	    }))

    } else {
	    const slope = (basePos.y - conerPos.y) / (basePos.x - conerPos.x)
	    const x = slope*(basePos.x/slope + basePos.y + slope * dragPos.x - dragPos.y)/(slope*slope+1);
	    const y = slope*(x - dragPos.x) + dragPos.y;

	    const calcPos = {x: x, y: y};

	    const latDiff = basePos.x - calcPos.x;
	    const lngDiff = basePos.y - calcPos.y;

	    const changeA =  point2LatLng({x: coner1Pos.x - latDiff, y: coner1Pos.y -lngDiff}, map);
	    const changeB =  point2LatLng({x: conerPos.x - latDiff, y: conerPos.y -lngDiff}, map);

	    dispatch(setShapeProps({
	      id: shape.id,
	      path: {...shape.path,[a]: {lat: changeA.lat(), lng: changeA.lng()}, [b]: {lat: changeB.lat(), lng: changeB.lng()}}
	    }))

    }
  }

  const setRotation = e => {
    let centerPos = { lat: (shape.path.nw.lat + shape.path.se.lat) / 2, lng: (shape.path.nw.lng + shape.path.se.lng) / 2 };
    let rotation = getPositiveAngle(centerPos, { lat: e.latLng.lat(), lng: e.latLng.lng() }) - getPositiveAngle(centerPos, shape.path.ne);
    let distance = getDistance(centerPos, shape.path.ne);
    dispatch(setShapeProps({
      id: shape.id,
      path: {
	      nw: getTargetPoint(centerPos, bearing(centerPos, shape.path.nw) + rotation, distance),
	      sw: getTargetPoint(centerPos, bearing(centerPos, shape.path.sw) + rotation, distance),
	      se: getTargetPoint(centerPos, bearing(centerPos, shape.path.se) + rotation, distance),
	      ne: getTargetPoint(centerPos, bearing(centerPos, shape.path.ne) + rotation, distance),
      }
    }));
  }

  const setPosition = e => {
    const pos = polygon.getPath().getArray();
    dispatch(setShapeProps({
      id: shape.id,
      path: {
	      nw: { lat: pos[0].lat(), lng: pos[0].lng() },
	      ne: { lat: pos[1].lat(), lng: pos[1].lng() },
	      se: { lat: pos[2].lat(), lng: pos[2].lng() },
	      sw: { lat: pos[3].lat(), lng: pos[3].lng() },
      }
    }));
  };


  useEffect(() => {
    if (fitShapeId && fitShapeId === shape.id) {
      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend(shape.path.nw);
      bounds.extend(shape.path.sw);
      bounds.extend(shape.path.se);
      bounds.extend(shape.path.ne);
      map.fitBounds(bounds);
      dispatch(setFitShapeId(0));
    }
  }, [fitShapeId]);

  // useEffect(() => {
    // if (!shape.path) { // ShapeRectangle updated ~ 
    //   const bounds = json2Bounds(shape.bounds);
    //   var coords = {
    //     nw: { lat: bounds.getNorthEast().lat(), lng: bounds.getNorthEast().lng() },
    //     ne: { lat: bounds.getNorthEast().lat(), lng: bounds.getSouthWest().lng() },
    //     se: { lat: bounds.getSouthWest().lat(), lng: bounds.getSouthWest().lng() },
    //     sw: { lat: bounds.getSouthWest().lat(), lng: bounds.getNorthEast().lng() }
    //   };
    //   dispatch(setShapeProps({
    //     id: shape.id,
    //     path: coords
    //   }));      
    // }
  // }, [])

  return (
    <>
      <Marker
        position={getPath('nw', 'ne')}
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
          setDragging(['nw', 'ne']);
        }}
        onDrag={e => setPath(e, 'nw', 'ne')}
        onDragEnd={e => {
          setPath(e, 'nw', 'ne');
          dispatch(addSnapshot());
          marker1.setOptions({ opacity: 1 });
          marker5.setOptions({ visible: false });
          setDragging(['rotate']);
        }}
      />
      <Marker
        position={getPath('ne', 'se')}
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
          setDragging(['ne', 'se']);
        }}
        onDrag={e => setPath(e, 'ne', 'se')}
        onDragEnd={e => {
          setPath(e, 'ne', 'se');
          dispatch(addSnapshot());
          marker2.setOptions({ opacity: 1 });
          marker5.setOptions({ visible: false });
          setDragging(['rotate']);
        }}
      />
      <Marker
        position={getPath('sw', 'se')}
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
          setDragging(['sw', 'se']);
        }}
        onDrag={e => setPath(e, 'sw', 'se')}
        onDragEnd={e => {
          setPath(e, 'sw', 'se');
          dispatch(addSnapshot());
          marker3.setOptions({ opacity: 1 });
          marker5.setOptions({ visible: false });
          setDragging(['rotate']);
        }}
      />

      <Marker
        position={getPath('nw', 'sw')}
        icon={dotIcon}
        raiseOnDrag={false}
        visible={shape.active}
        draggable={!shape.locked && shape.active && !readonly}
        clickable={!readonly}
        onLoad={marker => setMarker4(marker)}
        onUnmount={() => setMarker4(null)}
        onDragStart={e => {
          marker4.setOptions({ opacity: 0 });
          marker5.setOptions({ visible: true });
          setDragging(['nw', 'sw']);
        }}
        onDrag={e => setPath(e, 'nw', 'sw')}
        onDragEnd={e => {
          setPath(e, 'nw', 'sw');
          dispatch(addSnapshot());
          marker4.setOptions({ opacity: 1 });
          marker5.setOptions({ visible: false });
          setDragging(['rotate']);
        }}
      />
      <Marker
        position={dragging[0] ==='rotate'?getRotatePath():getPath(dragging[0], dragging[1])}
        icon={ dragging[0] !== 'rotate'? dotIcon: { ...rotateIcon, rotation: bearing(shape.path.sw, shape.path.nw) }}
        options={{
	    	visible: false
	    }}
        onLoad={marker => setMarker5(marker)}
        onUnmount={() => setMarker5(null)}
        raiseOnDrag={false}
        draggable={false}
      />
      <Marker
        position={shape.path.ne}
        icon={{ ...rotateIcon, rotation: bearing(shape.path.sw, shape.path.nw) }}
        raiseOnDrag={false}
        visible={shape.active}
        draggable={shape.active && !readonly}
        clickable={!readonly}
        onLoad={marker => setMarker6(marker)}
        onUnmount={() => setMarker6(null)}
        onDragStart={e => {
          marker6.setOptions({ opacity: 0 });
          marker5.setOptions({ visible: true });
          setDragging(['rotate'])
        }}
        onDrag={e => setRotation(e)}
        onDragEnd={e => {
          setRotation(e);
          dispatch(addSnapshot());
          marker6.setOptions({ opacity: 1 });
          marker5.setOptions({ visible: false });
          setDragging(['rotate']);
        }}
      />

      <Polygon
        path={[shape.path.nw, shape.path.ne, shape.path.se, shape.path.sw]}
        options={{
          strokeColor: shape.color, fillColor: shape.color,
          strokeOpacity: 0,
          strokeWeight: 0,
          fillOpacity: 1,
          draggable: !shape.locked && shape.active && !readonly,
          clickable: (editMode === 'normal' || editMode === 'scaler-start' || editMode === 'scaler-end') && !readonly
        }}
        onLoad={polygon => setPolygon(polygon)}
        onUnmount={() => setPolygon(null)}
        onDragStart={e => {
          dispatch(hideContextMenu());
        }}
        onDrag={e => setPosition(e)}
        onDragEnd={e => {
          setPosition(e);
          dispatch(addSnapshot());
        }}
        onClick={e => {
          dispatch(setShapeActive(shape.id));
          dispatch(setDrawingSidebar('rectangle'));
          dispatch(hideContextMenu());
        }}
        onRightClick={e => {
          dispatch(setShapeActive(shape.id));
          dispatch(showContextMenu({ x: e.domEvent.clientX, y: e.domEvent.clientY, list: ['new-camera', 'lock-shape', 'fit-bounds', 'delete-shape'] }));
        }}
      />
    </>
  );
}
