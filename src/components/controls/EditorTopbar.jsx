import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Divider } from 'antd';
import { setDrawingSidebar } from 'redux/actions/layout';
import { addSnapshot, deleteShape } from 'redux/actions/drawing';
import { createUseStyles } from 'react-jss';

import TrashPng from 'assets/images/trash.png';
import BackPng from 'assets/images/caret-left-blue.png';

const useStyles = createUseStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 15
  },
  backBtn: {
    cursor: 'pointer',
    flexGrow: 1,
    padding: 8,
    borderRadius: 8,
    '&:hover': {
      background: '#ddf3ff',
    },
    '&:active': {
      background: '#dfedf5',
    },
    '& img': {
      paddingLeft: 10,
      paddingRight: 10
    }
  }
}));

export default function EditorTopbar() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const shape = useSelector(state => state.drawing.shapes).find(v => v.active === true);

  const handleGoToList = () => {
    dispatch(setDrawingSidebar('index'));
  }

  const deleteActiveShape = () => {
    if (shape) {
      dispatch(deleteShape(shape.id));
      dispatch(addSnapshot());
    }
  }

  return (
    <div className={classes.root}>
      <div className={classes.backBtn} onClick={() => handleGoToList()}>
        <img src={BackPng} alt="" />
        Powrót do listy
      </div>

      <Divider type='vertical' />
      {( shape && shape.type !== "icon") && 
        <Button className='d-auto'
          type='primary'
          icon={<img src={TrashPng} alt="remove" />}
          onClick={deleteActiveShape} />

      }
    </div>
  );
}