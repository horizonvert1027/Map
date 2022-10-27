import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { addNewIcon, setShapeProps } from 'redux/actions/drawing';
import { createUseStyles } from 'react-jss';
import { Button, Form, Input, Upload, Slider } from 'antd';
import Fitter from 'components/controls/editor/Fitter';
import Locker from 'components/controls/editor/Locker';
import { PlusOutlined } from '@ant-design/icons';
import { getBase64 } from 'utils/common';
import FirebaseAPI from 'api/FirebaseAPI';
import { point2LatLng } from 'utils/map';
import ColorsBox from 'components/controls/editor/ColorsBox';

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
  iconItem: {
    width: 50,
    height: 50,
    background: '#47aaee',
    marginLeft: 4,
    marginRight: 3,
    marginBottom: 8,
    borderRadius: 4,
    padding: 2,
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '100%',
    border: '1px solid white',
    '&:hover': {
      border: '1px solid #47aaee'
    },
    '& img': {
      cursor: 'pointer',
      width: 30,
      filter: 'brightness(0) invert(1)',
      height: 30,      
    }
  },
  uploader: {
    '& .ant-upload': {
      width: '100%'
    }
  },
  droppable: {
    background: '#00000000',
    position: 'fixed',
    width: '100%',
    height: '100vh',
    top: 0,
    left: 320
  }
}));

export default function IconEditor() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { map } = useSelector(state => state.map);
  const shape = useSelector(state => state.drawing.shapes).find(v => v.active === true);

  const [name, setName] = useState('');
  const [icons, setIcons] = useState([]);
  const [icon, setIcon] = useState();
  const [size, setSize] = useState(1);

  const handleChangeName = e => {
    setName(e.target.value);
    dispatch(setShapeProps({ id: shape.id, name: e.target.value }));
  }

  const handleDrop = e => {
    const latLng = point2LatLng({ x: e.clientX, y: e.clientY - 120 }, map);
    dispatch(addNewIcon({
      src: icon.src,
      lat: latLng.lat(),
      lng: latLng.lng(),
    }));
    setIcon();
  }
  const handleDragOver = e => {
    e.stopPropagation();
    e.preventDefault();
  }
  const handleUpload = async file => {
    const base64 = await getBase64(file);
    if (!icons.find(v => v.src === base64)) {
      FirebaseAPI.icon.add({
        uid: file.uid,
        name: file.name,
        size: file.size,
        type: file.type,
        src: base64
      });
    }
    return false;
  }

  const getIcons = () => {
    FirebaseAPI.icon.get().then(res => {
      setIcons(res);
    })
  }

  useEffect(() => {
    if (shape) {
      setName(shape.name);
      setSize(shape.size);
    }
  }, [shape]);

  useEffect(() => {
    getIcons();
  });

  return (
    <div className={classes.root}>
      <Form labelCol={{ span: 24 }} autoComplete="off">
        <div className={classes.nameRow}>
          <Form.Item label="Nazwa ikony">
            <Input name='name' value={name} onChange={handleChangeName} />
            <Fitter />
            <Locker />
          </Form.Item>
        </div>
        <Form.Item label="kolor tła" name="backgroundColor">
          <ColorsBox name='backgroundColor' type={0} />
        </Form.Item>
        <Form.Item label="rozmiar ikony">
          <div className='d-flex'>
            <Slider className='d-grow'
              tooltipPlacement='bottom'
              defaultValue={100}
              min={50} max={150} step={25}
              onChange={v => dispatch(setShapeProps({ id: shape.id, size: v / 100 }))}
              value={size * 100}
            />
            <Input className='w-65 ml-10' readOnly suffix="%" value={size * 100} />
          </div>
        </Form.Item>    

        <Form.Item label="umieść ikone na projekcie">
          <div className='d-flex d-wrap no-select'>
            {
              icons.map((icon, index) =>
                <div className={classes.iconItem} key={index} onDragStart={() => setIcon(icon)}>
                  <img src={icon.src} alt="icon" />
                </div>
              )
            }
          </div>
        </Form.Item>
      </Form>

      <Upload multiple beforeUpload={handleUpload} showUploadList={false} accept={['.png', '.jpg']} className={classes.uploader}>
        <Button type='primary' className='mt-10 mb-20' icon={<PlusOutlined />} block>Wstaw ikonę z dysku</Button>
      </Upload>

      {icon && <div className={classes.droppable} onDrop={handleDrop} onDragOver={handleDragOver} />}

    </div>
  );
}