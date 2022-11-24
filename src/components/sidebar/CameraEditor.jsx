/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setShapeProps } from 'redux/actions/drawing';
import ColorsBox from 'components/controls/editor/ColorsBox';
import { createUseStyles } from 'react-jss';
import { Button, Checkbox, Form, Input, Radio, Select, Typography } from 'antd';
import Fitter from 'components/controls/editor/Fitter';
import Locker from 'components/controls/editor/Locker';
import ArrowRight from 'assets/images/caret-right-blue.png';
import ArrowBottom from 'assets/images/caret-bottom-blue.png';
import DeadZoneControl from 'components/controls/DeadZoneControl';

const useStyles = createUseStyles((theme) => ({
  root: {
    padding: 15,
    paddingTop: 0,
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

export default function CameraEditor(props) {
  const classes = useStyles();

  const shape = useSelector(state => state.drawing.shapes).find(v => v.active === true);
  const [info, setInfo] = useState({
    name: '',
    dzHeight: 0,
    irLength: 0
  });


  const [deadZoneVisible, setDeadZoneVisible] = useState(true);
  const cameraModels = [
    { name: 'Model1' },
    { name: 'Model2' },
    { name: 'Model3' },
    { name: 'Model4' },
  ];

  const handleFormChange = (v, val) => {
    dispatch(setShapeProps({
      id: shape.id,
      irVisible: val.irVisible,
      irLength: val.irLength,
    }));
  }

  const dispatch = useDispatch();

  const handleNameChange = (e) => {
    let name = e.target.value;
    if (name.length > 11) {
      name = name.splice(0,10);
    }
    setInfo({...info, name: name});
  }

  const handleSave = () => {
    dispatch(setShapeProps({ id: shape.id, name: info.name }));
  }

  useEffect(() => {
    if (shape) {
      setInfo({ ...info, name: shape.name, dzHeight: shape.dzHeight });
    }
  }, [shape]);

  return (
    <div className={classes.root}>
      <Form
        labelCol={{ span: 24 }}
        autoComplete="off"
        initialValues={{
          radio1: 'a',
          radio2: 'b',
          irVisible: shape?.irVisible,
          irLength: shape?.irLength
        }}
        onValuesChange={handleFormChange}
      >
        <div className={classes.nameRow}>
          <Form.Item label="Nazwa kamery">
            <Input value={info.name} onChange={handleNameChange} />
            <Fitter />
            <Locker />
          </Form.Item>
        </div>
        <Form.Item label="Kolor kamery" name="color">
          <ColorsBox />
        </Form.Item>

        <Button className='mt-10 mb-10' onClick={handleSave} type='primary' block>Zapisz zmiany</Button>

        <Form.Item label="Dane kamery" name="radio1">
          <Radio.Group buttonStyle='solid'>
            <Radio.Button value="a">Zdefiniowane</Radio.Button>
            <Radio.Button value="b">Własne</Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="Model kamery" name="select22">
          <Select>
            {cameraModels.map((model, index) =>
              <Select.Option value={index} key={index}>{model.name}</Select.Option>
            )}
          </Select>
        </Form.Item>

        <div className='d-flex'>
          <Form.Item label="Rodzielczość" name="resolution" className='d-grow w-half mr-10' >
            <Input type='number' suffix="mpx" />
          </Form.Item>
          <Form.Item label="Ogniskowa" name="focusLength" className='d-grow w-half'>
            <Input type='number' suffix="mm" />
          </Form.Item>
        </div>

        <div className='d-flex'>
          <Form.Item label="Matryca" name="matrix" className='d-grow w-half mr-10'>
            <Select>
              <Select.Option key={1}>First</Select.Option>
              <Select.Option key={2}>Second</Select.Option>
              <Select.Option key={3}>Third</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Dystans" name="distance" className='d-grow w-half'>
            <Input type='number' suffix="m" />
          </Form.Item>
        </div>

        <div className='d-flex'>
          <Form.Item label="Kąt widzenia" name="angle" className='d-grow w-half mr-10' >
            <Input type='number' suffix="°" />
          </Form.Item>
          <Form.Item label="PPM (px/m)" name="ppm" className='d-grow w-half'>
            <Input type='number' suffix="m" />
          </Form.Item>
        </div>

        <div className='d-flex'>
          <Form.Item label="Szerokość widzenia" name="viewWidth" className='d-grow w-half mr-10' >
            <Input type='number' suffix="m" />
          </Form.Item>
          <Form.Item label="Zasięg IR" name="irLength" className='d-grow w-half'>
            <Input type='number' suffix="m" min={0} />
          </Form.Item>
        </div>

        <Form.Item label="Jednostki" name="radio2">
          <Radio.Group buttonStyle='solid'>
            <Radio.Button value="a">Metryczne</Radio.Button>
            <Radio.Button value="b">Imperialne</Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item name='irVisible'>
          <Checkbox className='mt-20' checked={shape?.irVisible} onChange={e => dispatch(setShapeProps({ id: shape.id, irVisible: e.target.checked }))}>Pokaż zasięg IR</Checkbox>
        </Form.Item>

        <Form.Item name='ppmVisible'>
          <Checkbox className='mt-10' checked={shape?.ppmVisible} onChange={e => dispatch(setShapeProps({ id: shape.id, ppmVisible: e.target.checked }))}>Pokaż strefy PPM</Checkbox>
        </Form.Item>
      </Form>

      <div className='d-flex d-middle mt-15 cursor-pointer' onClick={() => setDeadZoneVisible(!deadZoneVisible)}>
        <img src={deadZoneVisible ? ArrowBottom : ArrowRight} alt="" className='mr-10' />
        <Typography>Strefa martwa</Typography>
      </div>
      {deadZoneVisible &&
        <>
          <Checkbox className='mt-10' checked={shape?.blindVisible} onChange={e => dispatch(setShapeProps({ id: shape.id, blindVisible: e.target.checked }))}>Pokaż strefę martwą kamery</Checkbox>
          <br />
          <Typography className='mt-10'>Dystans strefy martwej</Typography>
          <DeadZoneControl distance={393} height={info.dzHeight} />
          <Typography>Wysokość montażu kamery</Typography>
          <Input value={info.dzHeight} onChange={e => dispatch(setShapeProps({ id: shape.id, dzHeight: e.target.value }))} type='number' suffix='m' min={0} />
        </>
      }

    </div>
  );
}