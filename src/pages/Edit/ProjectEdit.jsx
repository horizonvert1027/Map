/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';

import { createUseStyles } from 'react-jss';
import Map from 'components/panels/Map';
import ProjectTopbar from 'components/controls/ProjectTopbar';
import MiniToolbar from 'components/sidebar/MiniToolbar';
import MapPopupMenu from 'components/controls/MapPopupMenu';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addSnapshot, setEditMode, setDeactivateAll, setKind, setProjectInfo, setShapes } from 'redux/actions/drawing';
import { setCenter, setCenterMarker, setZoom } from 'redux/actions/map';
import { setSetting } from 'redux/actions/setting';
import { setLoading } from 'redux/actions/layout';
import FirebaseAPI from 'api/FirebaseAPI';

const useStyles = createUseStyles((theme) => ({
  root: {
  },
}));

export default function ProjectEdit() {
  const classes = useStyles();
  const params = useParams();
  const dispatch = useDispatch();

  const { map } = useSelector(state => state.map);

  useEffect(() => {
    dispatch(setLoading(true));
    if (map && params.id) {
      FirebaseAPI.project
        .get(params.id)
        .then(res => {
          if (res) {
            dispatch(setProjectInfo({
              id: params.id,
              name: res.name,
              address: res.address,
              createdAt: res.createdAt,
              creator: res.creator,
            }));
            dispatch(setShapes(res.shapes));
            dispatch(addSnapshot());
            dispatch(setKind(res.kind));
            dispatch(setZoom(res.zoom));
            dispatch(setCenter(res.center));
            dispatch(setSetting(res.setting));
            if (res.kind === 1) {
              dispatch(setEditMode('normal'));
              dispatch(setCenterMarker(new window.google.maps.Marker({ map, position: res.center })));
            }
          }
          dispatch(setLoading(false));
        })
        .catch(e => {
          console.log(e)
          dispatch(setLoading(false));
        })
    }
  }, [map, params.id]);

  return (
    <div className={classes.root}>
      <ProjectTopbar id={params.id} />
      <MiniToolbar />
      <Map />
      <MapPopupMenu />
    </div>
  );
};