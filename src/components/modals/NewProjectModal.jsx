import React, { useState, useEffect } from 'react';
import { Input, Modal, Typography } from 'antd';
import { createUseStyles } from 'react-jss';
import MapIcon from "./../../assets/images/map-project.png";
import BlueprintIcon from "./../../assets/images/blueprint-project.png";
import { useNavigate } from 'react-router-dom';
import FirebaseAPI from 'api/FirebaseAPI';
import { setEditMode } from 'redux/actions/drawing';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { setSetting } from 'redux/actions/setting';
import Loader from 'components/controls/common/Loader';
import useAuth from 'hooks/auth';

const useStyles = createUseStyles(({
  root: {

  },
  projectCate: {
    border: '1px solid #47AAEE',
    borderRadius: 10,
    padding: 20,
    marginTop: 20,
    marginBottom: 20,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    '& img': {
      width: 50,
      marginBottom: 20
    },
    '&:hover': {
      background: '#f7f7f7'
    },
    '&:active': {
      background: '#efefef'
    }
  }
}));

export default function NewProjectModal({ open, setOpen }) {
  const classes = useStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [style, setStyle] = useState({});
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();

  const handleAddProject = v => {
    setLoading(true);
    dispatch(setSetting({ gridVisible: false }));
    FirebaseAPI.project.add({
      name,
      address: '',
      center: { lat: 51.0877813, lng: 17.0118349 },
      zoom: 19,
      kind: v,
      shapes: [],
      imageSrc: null,
      creator: user.uid,
      createdAt: moment().unix(),
      updatedAt: moment().unix()
    }).then(res => {
      setLoading(false);
      if (v !== 1) {
        dispatch(setEditMode('blueprint'))
      }
      navigate(`/project/${res.id}`, { replace: true });
    });
  }

  useEffect(() => {
    setStyle(name === '' ? {
      pointerEvents: 'none',
      opacity: 0.5
    } : {});
  }, [name]);

  return (
    <Modal title="Stwórz nowy projekt" centered visible={open} onCancel={() => setOpen(false)} footer={null}>
      <Typography>Nazwa projektu</Typography>
      <Input value={name} onChange={e => setName(e.target.value)} />
      <div onClick={() => handleAddProject(1)} className={classes.projectCate} style={style}>
        <img src={MapIcon} alt="map project" />
        <span>Otwórz mapę i wybierz lokalizację</span>
      </div>
      <div onClick={() => handleAddProject(2)} className={classes.projectCate} style={style}>
        <img src={BlueprintIcon} alt="map project" />
        <span>Wgraj rzut budynku</span>
      </div>
      <Loader loading={loading} />
    </Modal>
  );
};