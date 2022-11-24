/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

import { setShapeActive } from 'redux/actions/drawing';
import { setDrawingSidebar } from 'redux/actions/layout';
import { createUseStyles } from 'react-jss';
import { Checkbox, Input, Menu, Slider, Typography, Button } from 'antd';
import {addSnapshot, deleteShape, setFitShapeId, setShapeProps } from 'redux/actions/drawing';
import CaretUp from 'assets/images/caret-up.png';
import CaretDown from 'assets/images/caret-down.png';
import CameraPng from 'assets/images/camera.png';
import PolygonPng from 'assets/images/polygon.png';
import PolylinePng from 'assets/images/line.png';
import CirclePng from 'assets/images/circle.png';
import RectanglePng from 'assets/images/rectangle.png';
import BlueprintPng from 'assets/images/blueprint.png';
import IconPng from 'assets/images/access-point.png';
import LabelPng from 'assets/images/laser.png';
import WallPng from 'assets/images/wall.png';
import OptionPng from 'assets/images/gear.png';

import {CaretRightOutlined} from '@ant-design/icons';  
import Right from 'assets/images/right.png';
import DianaSvg from 'assets/images/diana.svg';
import LockSvg from 'assets/images/lock.svg';
import UnlockSvg from 'assets/images/unlock.svg';
import TrashSvg from 'assets/images/trash.svg';

import { setSetting } from 'redux/actions/setting';


const useStyles = createUseStyles((theme) => ({
  root: {
    '& .ant-menu-root': {
      overflow: 'auto',
      overflowX: 'hidden',
    },
    '& .ant-menu': {
      border: 'none',
      backgroundColor: '#edf8fe',
    }
  },
  optionMenu: {
    borderTop: '1px solid #47AAEE',
    '& .ant-checkbox-wrapper': {
      marginLeft: 15,
      '& span': {
        lineHeight: 'normal'
      }
    },
  },
  optionMenuItem: {
    paddingLeft: '15px !important',
    height: 'auto !important',
    '& .ant-menu-title-content': {
      display: 'flex',
      flexDirection: 'column',
      marginTop: -10,
      paddingBottom: 20,
      '& label': {
        height: 32
      }
    }
  },
  menuItem: {
    borderTop: '1px solid #47AAEE',
    '& .ant-menu': {
      backgroundColor: '#edf8fe'
    }
  },
  actionItem: {
    display: 'inline-block',
    position: 'absolute',
    right: 18,
    '& .action': {
      width: 37,
      height: 38
    },
    '& img': {
      width: 13,
      marginRight: 10
    }
  },
  menuCaret: {
    position: 'absolute',
    top: 16,
    backgroundColor: '#edf8fe',
    right: 16,
  }
}));

export default function ShapeList() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { shapes, kind } = useSelector(state => state.drawing);
  const shape = useSelector(state => state.drawing.shapes).find(v => v.active === true);
  const { setting } = useSelector(state => state.setting);

  const [fontSize, setFontSize] = useState(100);

  const menus = [
    { id: 'camera', label: 'Lista kamer', icon: CameraPng },
    { id: 'polyline', label: 'Dodane linie', icon: PolylinePng },
    { id: 'polygon', label: 'Dodane wielokąty', icon: PolygonPng },
    { id: 'circle', label: 'Okręgi', icon: CirclePng },
    { id: 'rectangle', label: 'Prostokąty', icon: RectanglePng },
    { id: 'blueprint', label: 'Dodane rzuty', icon: BlueprintPng },
    { id: 'icon', label: 'Dodane ikony', icon: IconPng },
    { id: 'label', label: 'Dodane etykiety', icon: LabelPng },
    { id: 'wall', label: 'Dodane ściany', icon: WallPng },
  ];

  const handleEditShape = (item) => {
    dispatch(setShapeActive(item.id));
    dispatch(setDrawingSidebar(item.type));
  }
  const handleAction = (key, targetId, locked) => {
    if (key === 'fit') {
      dispatch(setFitShapeId(targetId));
    } else if (key === 'lock') {
      dispatch(setShapeProps({id: targetId, locked: !locked}));
    } else {
      dispatch(deleteShape(targetId));
      dispatch(addSnapshot());
    }
  }
  const menuItems = menus.map(menu => ({
    key: menu.id,
    label: menu.label,
    className: classes.menuItem,
    icon: <img src={menu.icon} className='w-20' alt="shape" />,
    expandIcon: ({ isOpen }) => <img className={classes.menuCaret} src={isOpen ? CaretUp : CaretDown} alt="" />,
    children: shapes.filter(v => v.type === menu.id).map(item => ({
      key: item.id,
      icon: <img src={Right} alt='right' style={{minWidth: 6, marginLeft: -25}} />,
      label: <div style={{marginLeft: 15}}>
          <div style={{width: '75%', display: 'inline-block'}} onClick={() => handleEditShape(item)}>{item.name}</div>
          <div className={classes.actionItem}>
            <img src={DianaSvg} alt='DianaSvg'  onClick= {(e) => handleAction('fit', item.id, e)}  style={{width: 17}} />
            <img src={item.locked?LockSvg:UnlockSvg} alt='LockSvg' onClick= {(e) => handleAction('lock', item.id, item.locked)} style={!item.locked?{width: 17}:{}} />
            <img src={TrashSvg} alt='TrashSvg' onClick= {() => handleAction('delete', item.id)}  />
          </div>
        </div>
    }))
  }));

  menuItems.push({
    key: 'option',
    label: 'Opcje widoku kamer',
    className: classes.optionMenu,
    icon: <img src={OptionPng} alt="option" />,
    expandIcon: ({ isOpen }) => <img className={classes.menuCaret} src={isOpen ? CaretUp : CaretDown} alt="" />,
    children: [{
      key: 'asdf',
      className: classes.optionMenuItem,
      label: <>
        <Checkbox
          name='rangeVisible'
          checked={setting.rangeVisible}
          onChange={e => dispatch(setSetting({ rangeVisible: e.target.checked }))}
        >Pokaż zasięg kamer</Checkbox>

        <Checkbox
          name='blindVisible'
          checked={setting.blindVisible}
          onChange={e => dispatch(setSetting({ blindVisible: e.target.checked }))}
        >Pokaż martwy zasięg przy kamerach</Checkbox>

        <Checkbox
          name='irVisible'
          checked={setting.irVisible}
          onChange={e => dispatch(setSetting({ irVisible: e.target.checked }))}
        >Pokaż zasięg IR</Checkbox>

        <Checkbox
          name='manVisible'
          checked={setting.manVisible}
          onChange={e => dispatch(setSetting({ manVisible: e.target.checked }))}
        >Pokaż ikonę człowieka na końcu zasięgu</Checkbox>

        <Checkbox
          name='nameVisible'
          checked={setting.nameVisible}
          onChange={e => dispatch(setSetting({ nameVisible: e.target.checked }))}
        >Pokaż nazwy kamer</Checkbox>

        <Checkbox
          name='gridVisible'
          checked={setting.gridVisible}
          disabled={kind === 1}
          onChange={e => dispatch(setSetting({ gridVisible: e.target.checked }))}
        >Pokaż siatkę pomocniczą</Checkbox>

        <div className='mt-5 pl-15 pr-10'>
          <Typography style={{ marginBottom: -10 }}>Wielkość ikony kamery</Typography>
          <div className='d-flex'>
            <Slider className='d-grow'
              tooltipPlacement='bottom'
              defaultValue={100}
              value={fontSize}
              min={50} max={150} step={25}
              onChange={v => setFontSize(v)}
            />
            <Input className='w-65 ml-10' readOnly suffix="%" value={fontSize} />
          </div>
        </div>
      </>
    }]
  });

  useEffect(() => {
    dispatch(setSetting({ cameraFontSize: fontSize / 100 }));
  }, [fontSize]);

  return (
    <div className={classes.root}>
      <Menu items={menuItems} mode="inline" defaultOpenKeys={['option']} />
    </div>
  );
}