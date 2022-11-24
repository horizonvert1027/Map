/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { createUseStyles } from 'react-jss';
import { setShapeProps } from 'redux/actions/drawing';
import ColorsBox from 'components/controls/editor/ColorsBox';
import { Button, Form, Input } from 'antd';
import Fitter from 'components/controls/editor/Fitter';
import Locker from 'components/controls/editor/Locker';
import { formatDec } from 'utils/common';
import { getPathDistance } from 'utils/cameras';

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

export default function PolygonEditor() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const shape = useSelector(state => state.drawing.shapes).find(v => v.active === true);

  const [form] = Form.useForm();

  const handleValuesChange = (v) => {
    dispatch(setShapeProps({ id: shape.id, ...v }));
  }

  useEffect(() => {
    if (shape) {
      form.setFieldsValue({
        name: shape?.name,
        distance: formatDec(getPathDistance(shape?.path))
      });
    }
  }, [shape]);

  return (
    <div className={classes.root}>
      <Form
        form={form}
        labelCol={{ span: 24 }}
        autoComplete="off"
        initialValues={{
          name: shape?.name,
          distance: 0
        }}
        onValuesChange={handleValuesChange}
      >

        <div className='d-flex d-bottom'>
          <Form.Item label="Nazwa obszaru" name='name'>
            <Input />
          </Form.Item>
          <Fitter />
          <Locker />
        </div>

        <Form.Item label="Kolor obszaru" name="color">
          <ColorsBox />
        </Form.Item>

        <Form.Item label="Obwód" name='distance'>
          <Input className='w-full' readOnly addonAfter="m" />
        </Form.Item>

        <Button className='mt-20' type='primary' block>Zapisz zmiany</Button>
      </Form>
    </div>
  );
}