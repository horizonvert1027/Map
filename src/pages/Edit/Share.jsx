/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { createUseStyles } from 'react-jss';
import Map from 'components/panels/Map';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { setLoading } from 'redux/actions/layout';
import { setEditMode, setKind, setProjectInfo, setShapes } from 'redux/actions/drawing';
import { setCenter, setZoom } from 'redux/actions/map';
import { setSetting } from 'redux/actions/setting';
import FirebaseAPI from 'api/FirebaseAPI';

const useStyles = createUseStyles((theme) => ({
  root: {
  },
}));

export default function Share() {
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
            dispatch(setKind(res.kind));
            dispatch(setZoom(res.zoom));
            dispatch(setCenter(res.center));
            dispatch(setSetting(res.setting));
            dispatch(setEditMode('normal'));
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
      <Map readonly={true} />
    </div>
  );
};