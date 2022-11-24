/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setShapeProps } from 'redux/actions/drawing';
import { createUseStyles } from 'react-jss';
import TextArea from 'antd/lib/input/TextArea';
import { Button, Form, Input, Slider, Checkbox } from 'antd';
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


export default function LabelEditor() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const shape = useSelector(state => state.drawing.shapes).find(v => v.active === true);

  const [info, setInfo] = useState({ name: '', text: '' });

  const handleSave = () => {
    dispatch(setShapeProps({
      id: shape.id,
      name: info.name,
      text: info.text
    }));
  };

  useEffect(() => {
    if (shape) {
      setInfo({ ...info, name: shape.name, text: shape.text });
    }
  }, [shape]);

  return (
    <div className={classes.root}>
      <Form labelCol={{ span: 24 }} autoComplete="off">
        <div className={classes.nameRow}>
          <Form.Item label="Nazwa etykiety">
            <TextArea value={info.name} onChange={e => setInfo({ ...info, name: e.target.value })} rows={2} />
            <Fitter />
            <Locker />
          </Form.Item>
        </div>

        <Form.Item label="Kolor etykiety" name="color">
          <ColorsBox />
        </Form.Item>

        <Form.Item label="Kolor ramki" name="borderColor">
          <ColorsBox name="borderColor" />
        </Form.Item>

        <Form.Item name='Kolor tła'>
          <Checkbox className='mt-10' checked={shape&&shape.backgroundColor==='none'?false:true} 
          onChange={e => dispatch(setShapeProps({ id: shape.id, backgroundColor: (e.target.checked?"#FFFFFF":'none')}))}>Kolor tła</Checkbox>
        </Form.Item>
        <Form.Item name="backgroundColor">
          <ColorsBox name="backgroundColor" disable={shape&&shape.backgroundColor==='none'?true:false}/>
        </Form.Item>

        <Form.Item label="Treść">
          <TextArea value={info.text} onChange={e => setInfo({ ...info, text: e.target.value })} rows={7} />
        </Form.Item>

        <Form.Item label="Wielkość etykietę">
          <div className='d-flex'>
            <Slider className='d-grow'
              tooltipPlacement='bottom'
              defaultValue={100}
              min={50} max={150} step={25}
              onChange={v => dispatch(setShapeProps({ id: shape.id, fontSize: v / 100 }))}
              value={shape?.fontSize * 100}
            />
            <Input className='w-65 ml-10' readOnly suffix="%" value={shape?.fontSize * 100} />
          </div>
        </Form.Item>

        <Button className='mt-20 mb-20' onClick={handleSave} type='primary' block>Zapisz zmiany</Button>
      </Form>

    </div>
  );
}