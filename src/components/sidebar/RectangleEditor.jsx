import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { setShapeProps } from 'redux/actions/drawing'

import { createUseStyles } from 'react-jss';
import { Button, Form, Input } from 'antd';
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

export default function RectangleEditor() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const shape = useSelector(state => state.drawing.shapes).find(v => v.active === true);

  const [name, setName] = useState('');

  const handleSetName = e => {
    setName(e.target.value);
    dispatch(setShapeProps({ id: shape.id, name: e.target.value }));
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
          <Form.Item label="Nazwa Prostokąt">
            <Input name='name' value={name} onChange={handleSetName} />
            <Fitter />
            <Locker />
          </Form.Item>
        </div>

        <Form.Item label="Kolor Prostokąt" name="color">
          <ColorsBox />
        </Form.Item>

        <Button className='mt-20' type='primary' block>Zapisz zmiany</Button>
      </Form>
    </div>
  );
}