import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { setShapeProps } from 'redux/actions/drawing'

import { formatDec } from 'utils/common';
import { createUseStyles } from 'react-jss';
import { Button, Form, Input, InputNumber } from 'antd';
import Fitter from 'components/controls/editor/Fitter';
import Locker from 'components/controls/editor/Locker';
import ColorsBox from 'components/controls/editor/ColorsBox';

const useStyles = createUseStyles((theme) => ({
  root: {
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
  }
}));

export default function CircleEditor() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const shape = useSelector(state => state.drawing.shapes).find(v => v.active === true);

  const [name, setName] = useState('');
  const [radius, setRadius] = useState(0);


  const handleSetName = e => {
    setName(e.target.value);
    dispatch(setShapeProps({ id: shape.id, name: e.target.value }));
  }
  const handleSetRadius = v => {
    setRadius(v);
    dispatch(setShapeProps({ id: shape.id, radius: +v }));
  }

  useEffect(() => {
    if (shape) {
      setName(shape.name);
      setRadius(shape.radius);
    }
  }, [shape]);

  return (
    <div className={classes.root}>
      <Form labelCol={{ span: 24 }} autoComplete="off">
        <div className={classes.nameRow}>
          <Form.Item label="Nazwa kręgu">
            <Input name='name' value={name} onChange={handleSetName} />
            <Fitter />
            <Locker />
          </Form.Item>
        </div>

        <Form.Item label="Kolor kręgu" name="color">
          <ColorsBox />
        </Form.Item>

        <Form.Item label="promień">
          <InputNumber name='paths' value={formatDec(radius)} type='number' onChange={handleSetRadius} addonAfter="m" className='w-full' />
        </Form.Item>

        <Button className='mt-20' type='primary' block>Zapisz zmiany</Button>
      </Form>
    </div>
  );
}