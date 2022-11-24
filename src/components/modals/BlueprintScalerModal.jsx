import React, { useState, useEffect } from 'react';
import { Button, Input, Typography } from 'antd';
import { createUseStyles } from 'react-jss';
import { useDispatch, useSelector } from 'react-redux';
import { hideScalerModal, setNewScalerDistance } from 'redux/actions/map';
import { formatDec } from 'utils/common';

const useStyles = createUseStyles(({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    position: 'fixed',
    background: 'white',
    zIndex: 15,
    border: '1px solid lightgrey',
    boxShadow: '0 0 10px 0 #00000055',
  },
}));

export default function BlueprintScalerModal() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [position, setPosition] = useState({ x: -1000, y: -1000 });
  const [distance, setDistance] = useState(0);
  const { scaler } = useSelector(state => state.map);

  const handleOK = () => {
    dispatch(setNewScalerDistance(distance));
    dispatch(hideScalerModal());
  }
  const handleKeyDownDistance = e => {
    if (e.key === 'Enter') {
      handleOK();
    }
  }
  const handleChangeDistance = e => {
    setDistance(e.target.value);
  }

  useEffect(() => {
    if (scaler) {
      setPosition({
        x: scaler.x < window.screen.width - 250 ? scaler.x - 120 : window.screen.width - 250,
        y: scaler.y > 270 ? scaler.y - 130 : 140
      });
      setDistance(scaler.distance);
    }
  }, [scaler]);

  return (
    <div className={classes.root} style={{ left: position.x, top: position.y }}>
      <Typography.Title level={5}>Ustaw skalę</Typography.Title>
      <Typography >Określ długość rzeczywistą</Typography>
      <Input value={formatDec(distance)} onChange={handleChangeDistance} onKeyDown={handleKeyDownDistance} type='number' className='mt-10' suffix='m' />
      <div className='d-auto mt-10'>
        <Button type='primary' onClick={handleOK} style={{ width: 100 }}>OK</Button>
      </div>
    </div>
  );
};