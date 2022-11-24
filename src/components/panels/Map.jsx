/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { GoogleMap } from '@react-google-maps/api';
import MeasureTool from 'measuretool-googlemaps-v3';
import { createUseStyles } from 'react-jss';
import { useDispatch, useSelector } from 'react-redux';
import { addNewBlueprint, addNewCamera, addNewCircle, addNewLabel, addNewPolygon, addNewPolyline, addNewRectangle, addNewWall, addSnapshot, setBlueprintLoaded, setDeactivateAll, setEditMode } from 'redux/actions/drawing';
import { setDrawingSidebar } from 'redux/actions/layout';
import { showContextMenu, setOptions, setMap, hideContextMenu, setZoom, setMeasurement, setCenter, setCenterMarker, hideScalerModal } from 'redux/actions/map';
import { bearing, getDistance, getPathDistance } from 'utils/cameras';

import ShapeCamera from 'components/shapes/ShapeCamera';
import ShapePolygon from 'components/shapes/ShapePolygon';
import ShapePolyline from 'components/shapes/ShapePolyline';
import ShapeCircle from 'components/shapes/ShapeCircle';
import ShapeRectangle from 'components/shapes/ShapeRectangle';
import ShapeWall from 'components/shapes/ShapeWall';
import ShapeBlueprint from 'components/shapes/ShapeBlueprint';
import ShapeIcon from 'components/shapes/ShapeIcon';
import ShapeLabel from 'components/shapes/ShapeLabel';

import NewBlueprintModal from 'components/modals/NewBlueprintModal';
import { latLng2Point, point2LatLng } from 'utils/map';
import BlueprintScalerModal from 'components/modals/BlueprintScalerModal';
import CoordMapType from 'components/controls/overlays/CoordMapType';
import { getBase64 } from 'utils/common';

const useStyles = createUseStyles((theme) => ({
  root: {
    width: '100%',
    height: 'calc(100vh - 80px)'
  }
}));

let tempShape, tempPath = [];
let tempMarker1, tempMarker2;
let measureTool = null;

export default function Map(props) {
  const classes = useStyles();

  const dispatch = useDispatch();
  const { readonly } = props;
  const markerIcon = {
    path: "M0 0 0-10M-5-10 5-10M0 0 0 10M-5 10 5 10",
    strokeWeight: 2,
    strokeColor: "#fff",
    scale: 1,
    fillOpacity: 1,
    strokeOpacity: 1,
  };

  const { map, zoom, center, options, centerMarker } = useSelector(state => state.map);
  const { shapes, editMode, kind } = useSelector(state => state.drawing);
  const { setting } = useSelector(state => state.setting);

  const handleLoad = map => {
    dispatch(setMap(map));
  }

  const handleClick = e => {
    let pos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    if (editMode === 'camera-add') {
      dispatch(addNewCamera(pos));
      dispatch(addSnapshot());
      dispatch(setEditMode('normal'));
      dispatch(setDrawingSidebar('camera'));
    } else if (editMode === 'polygon-add') {
      addPolygon(pos);
      dispatch(setEditMode('polygon-edit'));
      dispatch(setDrawingSidebar('polygon'));
    } else if (editMode === 'polyline-add') {
      addPolyline(pos);
      dispatch(setEditMode('polyline-edit'));
      dispatch(setDrawingSidebar('polyline'));
    } else if (editMode === 'wall-add') {
      addWall(pos);
      dispatch(setEditMode('wall-edit'));
      dispatch(setDrawingSidebar('wall'));
    } else if (editMode === 'circle-add') {
      addCircle(pos);
      dispatch(setEditMode('circle-edit'));
      dispatch(setDrawingSidebar('circle'));
    } else if (editMode === 'rectangle-add') {
      addRectangle(pos);
      dispatch(setEditMode('rectangle-edit'));
      dispatch(setDrawingSidebar('rectangle'));
    } else if (editMode === 'label-add') {
      addLabel(pos);
      dispatch(setEditMode('normal'));
      dispatch(setDrawingSidebar('label'));
    } else if (editMode === 'ruler-add') {
      // 
    } else {
      dispatch(setEditMode('normal'));
      dispatch(setDrawingSidebar(null));
    }
    dispatch(setDeactivateAll());
    dispatch(hideContextMenu());
  }

  const handleRightClick = e => {
    dispatch(setDeactivateAll());
    if (measureTool) {
      dispatch(setEditMode('normal'));
    } else {
      dispatch(showContextMenu({ x: e.pixel.x, y: e.pixel.y + 80, list: ['new-camera', 'new-label', 'all-cameras'] }));
    }
  }

  const handleDragStart = e => {
    dispatch(hideContextMenu());
    dispatch(hideScalerModal());
  }

  const handleDragEnd = e => {
    const pos = map.getCenter();
    dispatch(setCenter({ lat: pos.lat(), lng: pos.lng() }));
    if (centerMarker) {
      centerMarker.setMap(null);
      dispatch(setCenterMarker(null));
    }
  }

  const handleZoomChanged = () => {
    if (map) {
      dispatch(setZoom(map.getZoom()));
    }
  }

  const handleUpload = file => {
    addImageOnMap(file).then(() => {
      dispatch(setBlueprintLoaded(true));
    });
    return false;
  }

  const handleMouseMove = e => {
    let pos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    if (editMode === 'polygon-edit' || editMode === 'polyline-edit' || editMode === 'wall-edit' || editMode === 'ruler-edit') {
      if (tempShape) {
        tempShape.setPath([...tempPath, pos]);
      }
      if (editMode === 'ruler-edit') {
        tempMarker1.setIcon({ ...{ ...markerIcon }, rotation: bearing(tempPath[0], tempPath.length > 1 ? tempPath[1] : pos) - 90 });
        tempMarker2.setIcon({ ...{ ...markerIcon }, rotation: bearing(tempPath[tempPath.length - 1], pos) - 90 });
        tempMarker2.setPosition(pos);
        dispatch(setMeasurement(getPathDistance([...tempPath, pos])));
      }
    } else if (editMode === 'circle-edit') {
      if (tempShape) {
        tempShape.setRadius(getDistance(tempPath, pos));
      }
    } else if (editMode === 'rectangle-edit') {
      if (tempShape) {
        const repos = tempPath['nw'];
        tempPath = {
          nw: {lat: repos.lat, lng: repos.lng},
          ne: {lat: repos.lat, lng: pos.lng},
          se: {lat: pos.lat, lng: pos.lng},
          sw: {lat: pos.lat, lng: repos.lng},
        }
        tempShape.setPath([tempPath.nw, tempPath.ne, tempPath.se, tempPath.sw]);

        // tempShape.setBounds({
        //   north: Math.min(tempPath.lat, pos.lat),
        //   west: Math.min(tempPath.lng, pos.lng),
        //   south: Math.max(tempPath.lat, pos.lat),
        //   east: Math.max(tempPath.lng, pos.lng),
        // });
      }
    }
  }

  const addPolygon = pos => {
    tempPath[0] = pos;
    tempShape = new window.google.maps.Polyline({ map: map, path: tempPath, strokeOpacity: 0.7, editable: false, strokeWeight: 3, strokeColor: '#FF5700', cursor: 'crosshair' });
    window.google.maps.event.addListener(tempShape, 'click', e => {
      tempPath[tempPath.length] = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    });
    window.google.maps.event.addListener(tempShape, 'dblclick', e => {
      dispatch(addNewPolygon(tempPath));
      dispatch(addSnapshot());
      dispatch(setEditMode('normal'));
      tempShape.setMap(null);
      tempPath = [];
    });
    window.google.maps.event.addListener(tempShape, 'rightclick', e => {
      dispatch(addNewPolygon(tempPath));
      dispatch(addSnapshot());
      dispatch(setEditMode('normal'));
      tempShape.setMap(null);
      tempPath = [];
    });
  }

  const addPolyline = pos => {
    tempPath[0] = pos;
    tempShape = new window.google.maps.Polyline({ map: map, path: tempPath, strokeOpacity: 0.7, editable: false, strokeWeight: 3, strokeColor: '#FF5700', cursor: 'crosshair' });
    window.google.maps.event.addListener(tempShape, 'click', e => {
      tempPath[tempPath.length] = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    });
    window.google.maps.event.addListener(tempShape, 'dblclick', e => {
      dispatch(addNewPolyline(tempPath));
      dispatch(addSnapshot());
      dispatch(setEditMode('normal'));
      tempShape.setMap(null);
      tempPath = [];
    });
    window.google.maps.event.addListener(tempShape, 'rightclick', e => {
      dispatch(addNewPolyline(tempPath));
      dispatch(addSnapshot());
      dispatch(setEditMode('normal'));
      tempShape.setMap(null);
      tempPath = [];
    });
  }

  const addWall = pos => {
    tempPath[0] = pos;
    tempShape = new window.google.maps.Polyline({ map: map, path: tempPath, strokeOpacity: 0.5, editable: false, strokeColor: '#FF5700', strokeWeight: 5, cursor: 'crosshair' });
    window.google.maps.event.addListener(tempShape, 'click', e => {
      tempPath[tempPath.length] = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    });
    window.google.maps.event.addListener(tempShape, 'dblclick', e => {
      dispatch(addNewWall(tempPath));
      dispatch(setEditMode('normal'));
      tempShape.setMap(null);
      tempPath = [];
    });
    window.google.maps.event.addListener(tempShape, 'rightclick', e => {
      dispatch(addNewWall(tempPath));
      dispatch(setEditMode('normal'));
      tempShape.setMap(null);
      tempPath = [];
    });
  }

  const addCircle = pos => {
    tempPath = pos;
    tempShape = new window.google.maps.Circle({ map: map, strokeWeight: 3, fillOpacity: 0.3, center: pos, radius: 0, strokeColor: '#FF5700', fillColor: '#FF5700' });
    window.google.maps.event.addListener(tempShape, 'click', e => {
      dispatch(addNewCircle({ ...pos, radius: getDistance(tempPath, { lat: e.latLng.lat(), lng: e.latLng.lng() }) }));
      dispatch(addSnapshot());
      dispatch(setEditMode('normal'));
      tempShape.setMap(null);
      tempPath = [];
    });
    window.google.maps.event.addListener(tempShape, 'mousemove', e => {
      if (editMode === 'circle-add') {
        tempShape.setRadius(getDistance(tempPath, { lat: e.latLng.lat(), lng: e.latLng.lng() }));
      }
    });
  }
  const addRectangle = pos => {
    tempPath = {ne: pos, nw: pos, sw: pos, se: pos};
    tempShape = new window.google.maps.Polygon({ map: map, path: [tempPath.nw, tempPath.ne, tempPath.se, tempPath.sw], strokeOpacity: 0.7, editable: false, strokeWeight: 3, strokeColor: '#FF5700', cursor: 'crosshair' })
    window.google.maps.event.addListener(tempShape, 'click', e => {
      dispatch(addNewRectangle(tempPath));
      dispatch(addSnapshot());
      dispatch(setEditMode('normal'));
      tempShape.setMap(null);
      tempPath = [];        
    })
  }

  const addLabel = pos => {
    dispatch(addNewLabel(pos));
    dispatch(addSnapshot());
  }

  const addImageOnMap = async file => {
    if (file) {
      const pos = map.getCenter();
      const cen = latLng2Point(pos, map);
      const lat = pos.lat();
      const lng = pos.lng();
      const src = await getBase64(file);

      if (editMode === 'blueprint') {
        if (file.type.split('/')[0] === 'image') {
          const img = new Image();
          img.src = src;
          img.onload = function () {
            const latlng = point2LatLng({ x: cen.x + this.width / 2, y: cen.y + this.height / 2 }, map);
            const latDiff = Math.abs(latlng.lat() - lat);
            const lngDiff = Math.abs(latlng.lng() - lng);
            dispatch(addNewBlueprint({ src: src, north: lat + latDiff, south: lat - latDiff, west: lng - lngDiff, east: lng + lngDiff }));
            dispatch(addSnapshot());
            dispatch(setEditMode('normal'));
          }
        }
      }
    }
  }

  const measureStart = () => {
    window.setTimeout(() => {
      measureTool = new MeasureTool(map, {
        // showSegmentLength: false,
        unit: 'metric',
        contextMenu: false,
        tooltip: false,
        invertColor: false
      });
      measureTool.start();
    }, 100);
  }
  const measureEnd = () => {
    if (measureTool) {
      measureTool?.end();
      measureTool = null;

    }
  }

  useEffect(() => {
    let cursor = 'crosshair';
    switch (editMode) {
      case 'normal':
      case 'icon':
      case 'undo':
        cursor = 'grab';
        break;
      case 'ruler-edit':
        cursor = 'none';
        break;
      default:
    }
    dispatch(setOptions({ ...options, draggableCursor: cursor }));

    if (editMode === 'ruler-add') {
      measureStart();
    } else {
      measureEnd();
    }
  }, [editMode]);

  useEffect(() => {
    if (map) {
      if (setting.gridVisible) {
        map.overlayMapTypes.setAt(0, new CoordMapType(1));
      } else {
        if (kind === 1) {
          map.overlayMapTypes.removeAt(0);
        } else {
          map.overlayMapTypes.setAt(0, new CoordMapType(2));
        }
      }
    }
  }, [map, kind, setting.gridVisible]);

  return (
    <div className={`${classes.root} kind-${kind} ${setting.gridVisible ? "grid-mode" : ""}`} id="map_container">
      <GoogleMap
        center={center}
        zoom={zoom}
        options={options}
        mapContainerStyle={{ width: "100%", height: "100%" }}
        id='map_id'
        mapContainerClassName = 'object_container'
        onLoad={handleLoad}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onRightClick={handleRightClick}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onZoomChanged={handleZoomChanged}
      // onDblClick={(e) => handleDblClick(e)}
      // onDrag={handleDrag}
      >
        {shapes.map(shape => {
          switch (shape.type) {
            case 'camera':
              return <ShapeCamera map={map} shape={shape} key={shape.id} readonly={readonly} />
            case 'polygon':
              return <ShapePolygon map={map} shape={shape} key={shape.id} readonly={readonly} />
            case 'polyline':
              return <ShapePolyline map={map} shape={shape} key={shape.id} readonly={readonly} />
            case 'circle':
              return <ShapeCircle map={map} shape={shape} key={shape.id} readonly={readonly} />
            case 'rectangle':
              return <ShapeRectangle map={map} shape={shape} key={shape.id} readonly={readonly} />
            case 'wall':
              return <ShapeWall map={map} shape={shape} key={shape.id} readonly={readonly} />
            case 'blueprint':
              return <ShapeBlueprint map={map} shape={shape} key={shape.id} readonly={readonly} />
            case 'icon':
              return <ShapeIcon map={map} shape={shape} key={shape.id} readonly={readonly} />
            case 'label':
              return <ShapeLabel map={map} shape={shape} key={shape.id} readonly={readonly} />
            default:
              return null;
          }
        })}
      </GoogleMap>

      <NewBlueprintModal handleUpload={handleUpload} />
      <BlueprintScalerModal />
    </div>
  );
};