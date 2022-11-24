import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import ScalerPng from 'assets/images/scaler.png';
import { setEditMode, setShapeProps } from 'redux/actions/drawing';
import { createUseStyles } from 'react-jss';
import { Button, Form, Input, Slider } from 'antd';
import Fitter from 'components/controls/editor/Fitter';
import Locker from 'components/controls/editor/Locker';
// import { formatDec } from 'utils/common';

const useStyles = createUseStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: 'calc(100vh - 215px)',
    paddingLeft: 15,
    paddingRight: 15
  },
  nameRow: {
    marginBottom: 10,
    '& .ant-form-item-control-input-content': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  },
}));

export default function BlueprintEditor() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const shape = useSelector(state => state.drawing.shapes).find(v => v.active === true);
  const { editMode } = useSelector(state => state.drawing);

  const [name, setName] = useState('');
  const [lock, setLock] = useState(false);

  const handleChangeName = e => {
    setName(e.target.value);
    dispatch(setShapeProps({ id: shape.id, name: e.target.value }));
  }
  const handleChangeOpacity = (v) => {
    dispatch(setShapeProps({ id: shape.id, opacity: v / 100 }));
  }
  const handleScalerStart = () => {
    dispatch(setEditMode('scaler-start'));
  }

  useEffect(() => {
    if (shape) {
      setName(shape.name);
    }
  }, [shape]);

  return (
    <div className={classes.root}>
      <Form labelCol={{ span: 24 }} autoComplete="off">
        <div className={classes.nameRow}>
          <Form.Item label="Nazwa rzutu">
            <Input name='name' value={name} onChange={handleChangeName} />
            <Fitter />
            <Locker />
          </Form.Item>
        </div>

        <Form.Item label="Plik">
          <Input name='filename' />
        </Form.Item>

        <Form.Item label="Skala">
          <div className='d-flex mb-15'>
            <Button type='primary' onClick={handleScalerStart} className='d-grow' icon={<img src={ScalerPng} alt='' className='mr-10' />}>{editMode.split('-')[0] === 'scaler' ? 'Click Point' : 'Setup Scale'}</Button>
            {/* <Button type='primary' className='d-grow w-half'>Reset Scale</Button> */}
          </div>
        </Form.Item>

        <Form.Item label="Przezroczystość rzutu">
          <div className='d-flex'>
            <Slider
              className='d-grow'
              min={0}
              max={100}
              tooltipPlacement='bottom'
              onChange={handleChangeOpacity}
              value={Math.round(shape?.opacity * 100)}
            />
            <Input
              className='w-65'
              min={0}
              max={100}
              value={Math.round(shape?.opacity * 100)}
              suffix="%"
              readOnly
              onChange={handleChangeOpacity}
            />
          </div>
        </Form.Item>

        <Button className='mt-20' type='primary' block>Zapisz zmiany</Button>
      </Form>
      <Button className={`mt-20${lock ? ' secondary' : ''}`} onClick={() => setLock(!lock)} type='primary' block>{lock ? 'Zablokuj' : 'Odblokuj'} rzut</Button>
    </div>
  );
}