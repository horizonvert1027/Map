import { Button } from 'antd';
import React from 'react';
import DianaPng from 'assets/images/diana.png';
import { useDispatch, useSelector } from 'react-redux';
import { setFitShapeId } from 'redux/actions/drawing';

export default function Fitter() {
  const dispatch = useDispatch();

  const shape = useSelector(state => state.drawing.shapes).find(v => v.active === true);

  const handleClick = e => {
    dispatch(setFitShapeId(shape.id));
  }

  return (
    <Button type='link' icon={<img src={DianaPng} alt="fit" onClick={handleClick} />} className='d-auto ml-5' />
  );
};