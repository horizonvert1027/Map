import React from 'react';

import LockPng from 'assets/images/locked.png';
import UnlockPng from 'assets/images/unlocked.png';
import { Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { setShapeProps } from 'redux/actions/drawing';

export default function Locker() {
  const dispatch = useDispatch();

  const shape = useSelector(state => state.drawing.shapes).find(v => v.active === true);

  const handleClick = () => {
    dispatch(setShapeProps({ id: shape.id, locked: !shape.locked }));
  }

  return (
    <Button
      type='link'
      icon={<img src={shape?.locked ? LockPng : UnlockPng} alt="fit" onClick={handleClick} />}
      className='d-auto ml-5' />
  );
};