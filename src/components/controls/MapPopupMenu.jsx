import { Menu } from 'antd';
import React from 'react';
import { createUseStyles } from 'react-jss';
import { useDispatch, useSelector } from 'react-redux';

import PlusPng from 'assets/images/plus.png';
import TrashPng from 'assets/images/trash-gray.png';
import EyePng from 'assets/images/eye.png';
import DianaPng from 'assets/images/diana.png';
import LockPng from 'assets/images/locked.png';
import UnlockPng from 'assets/images/unlocked.png';
import { hideContextMenu } from 'redux/actions/map';
import { addNewCamera, addNewLabel, addSnapshot, deleteShape, setDeactivateAll, setFitShapeId, setShapeProps } from 'redux/actions/drawing';
import { point2LatLng } from 'utils/map';
import { setDrawingSidebar } from 'redux/actions/layout';

const useStyles = createUseStyles((theme) => ({
  root: {
    position: 'absolute',
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 5,
    zIndex: 100,
    '& .ant-menu-item': {
      height: 30,
      lineHeight: 2,
      margin: '0!important',
      '& img': {
        objectFit: 'scale-down'
      }
    },
    '& .ant-menu-item-active': {
      background: '#efefef'
    }
  },
}));

export default function MapPopupMenu() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const shape = useSelector(state => state.drawing.shapes).find(v => v.active === true);
  const { map, contextMenu } = useSelector(state => state.map);

  const menuItems = [
    { key: 'new-camera', label: 'Dodaj kamerę', icon: <img src={PlusPng} alt='menu' /> },
    { key: 'new-label', label: 'Dodaj etykietę', icon: <img src={PlusPng} alt='menu' /> },
    { key: 'fit-bounds', label: 'Wyśrodkuj mapę', icon: <img src={DianaPng} alt='menu' /> },
    { key: 'all-cameras', label: 'Zobacz wszystkie kamery', icon: <img src={EyePng} alt='menu' /> },
    { key: 'lock-shape', label: 'Zablokuj okrąg', icon: <img src={shape?.locked ? UnlockPng : LockPng} alt='menu' /> },
    { key: 'delete-shape', label: 'Usuń wybrane', icon: <img src={TrashPng} alt='menu' /> },
  ];

  const handleMenuItemClick = (key) => {
    const latLng = point2LatLng({ x: contextMenu.x, y: contextMenu.y - 80 }, map);
    const position = { lat: latLng.lat(), lng: latLng.lng() };

    if (key === 'new-camera') {
      dispatch(setDeactivateAll());
      dispatch(addNewCamera(position));
      dispatch(setDrawingSidebar('camera'));
    } else if (key === 'new-label') {
      dispatch(setDeactivateAll());
      dispatch(addNewLabel(position));
      dispatch(setDrawingSidebar('label'));
    } else if (key === 'lock-shape') {
      dispatch(setShapeProps({ id: shape.id, locked: !shape.locked }));
    } else if (key === 'fit-bounds') {
      dispatch(setFitShapeId(shape.id));
    } else if (key === 'delete-shape') {
      dispatch(deleteShape(shape.id));
      dispatch(addSnapshot());
    }
    dispatch(hideContextMenu());
  }

  return (
    <Menu
      className={classes.root}
      onClick={v => handleMenuItemClick(v.key)}
      style={{ top: contextMenu.y - 80, left: contextMenu.x }}
      items={contextMenu.list.map(key => menuItems.find(i => i.key === key))}
    />
  );
};