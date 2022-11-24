/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setShapeProps } from 'redux/actions/drawing';
import { createUseStyles } from 'react-jss';
import { Button, Form, Input, Select } from 'antd';
import Fitter from 'components/controls/editor/Fitter';
import Locker from 'components/controls/editor/Locker';
import ColorsBox from 'components/controls/editor/ColorsBox';
import { getPathDistance } from 'utils/cameras';
import { formatDec } from 'utils/common';

import LineNormalPng from 'assets/images/line-normal.png';
import LineDottedPng from 'assets/images/line-dotted.png';
import LineDashedPng from 'assets/images/line-dashed.png';
import LineLongdashPng from 'assets/images/line-longdash.png';
import ArrowStartPng from 'assets/images/arrow-start.png';
import ArrowEndPng from 'assets/images/arrow-end.png';
import ArrowBothPng from 'assets/images/arrow-both.png';

const useStyles = createUseStyles((theme) => ({
  root: {
    paddingLeft: 15,
    paddingRight: 15
  },
  centerImg: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
}));

export default function PolylineEditor() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const shape = useSelector(state => state.drawing.shapes).find(v => v.active === true);

  const lineTypes = [
    { name: 'normal', icon: LineNormalPng },
    { name: 'dotted', icon: LineDottedPng },
    { name: 'dashed', icon: LineDashedPng },
    { name: 'longdash', icon: LineLongdashPng },
  ];

  const arrowTypes = [
    { name: 'none', icon: LineNormalPng },
    { name: 'start', icon: ArrowStartPng },
    { name: 'end', icon: ArrowEndPng },
    { name: 'both', icon: ArrowBothPng },
  ];

  const handleValuesChange = (v) => {
    dispatch(setShapeProps({ id: shape.id, ...v }));
  }

  useEffect(() => {
    form.setFieldsValue({
      name: shape?.name,
      lineType: shape?.lineType,
      arrowType: shape?.arrowType,
      distance: formatDec(getPathDistance(shape?.path))
    });
  }, [shape]);

  return (
    <div className={classes.root}>
      <Form
        form={form}
        labelCol={{ span: 24 }}
        autoComplete="off"
        initialValues={{
          name: shape?.name,
          lineType: shape?.lineType,
          arrowType: shape?.arrowType,
          distance: 0
        }}
        onValuesChange={handleValuesChange}
      >
        <div className='d-flex d-bottom'>
          <Form.Item label="Nazwa punktu" name='name'>
            <Input />
          </Form.Item>
          <Fitter />
          <Locker />
        </div>

        <Form.Item label="Kolor punktu">
          <ColorsBox />
        </Form.Item>

        <Form.Item label="Rodzaj linii" name='lineType'>
          <Select>
            {lineTypes.map(v =>
              <Select.Option value={v.name} key={v.name}>
                <div className={classes.centerImg}>
                  <img src={v.icon} alt="" />
                </div>
              </Select.Option>)
            }
          </Select>
        </Form.Item>

        <Form.Item label="Typ strzałki" name='arrowType'>
          <Select>
            {arrowTypes.map(v =>
              <Select.Option value={v.name} key={v.name}>
                <div className={classes.centerImg}>
                  <img src={v.icon} alt="" />
                </div>
              </Select.Option>)
            }
          </Select>
        </Form.Item>

        <Form.Item label="Długość" name="distance">
          <Input className='w-full' readOnly addonAfter="m" />
        </Form.Item>

        <Button className='mt-20' type='primary' block>Zapisz zmiany</Button>
      </Form>
    </div>
  );
}