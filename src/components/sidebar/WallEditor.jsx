import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setShapeProps } from 'redux/actions/drawing';
import { getDistance } from 'utils/cameras';
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

export default function WallEditor() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const shape = useSelector(state => state.drawing.shapes).find(v => v.active === true);

  const [name, setName] = useState('');
  const [distance, setDistance] = useState(0);

  const handleSetName = e => {
    setName(e.target.value);
    dispatch(setShapeProps({ id: shape.id, name: e.target.value }));
  }

  useEffect(() => {
    if (shape) {
      setName(shape.name);
      let d = 0;
      for (let i = 1; i < shape.path.length; i++) {
        d += getDistance(shape.path[i - 1], shape.path[i]);
      }
      setDistance(formatDec(d));
    }
  }, [shape]);

  return (
    <div className={classes.root}>
      <Form labelCol={{ span: 24 }} autoComplete="off">
        <div className={classes.nameRow}>
          <Form.Item label="Nazwa ściany">
            <Input name='name' value={name} onChange={handleSetName} />
            <Fitter />
            <Locker />
          </Form.Item>
        </div>

        <Form.Item label="Kolor ściany" name="color">
          <ColorsBox />
        </Form.Item>

        <Form.Item label="Długość">
          <InputNumber name='paths' value={formatDec(distance)} type='number' addonAfter="m" className='w-full' />
        </Form.Item>

        <Button className='mt-20' type='primary' block>Zapisz zmiany</Button>
      </Form>
    </div>
  );
}