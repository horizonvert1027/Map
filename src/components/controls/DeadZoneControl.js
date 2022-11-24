import React from 'react';
// import { Button, Input } from 'antd';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles(theme => ({
  root: {
    height: 200,
  },
  yAxis: {
    height: 180,
    width: 40,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  xAxis: {
    width: 247,
    marginLeft: 40,
    display: 'flex',
    justifyContent: 'center'
  },
  content: {
    width: 247,
    borderBottom: '1px solid #707070',
    '& svg': {
      width: '100%',
      height: '100%',
      '& .camera': {
        transform: 'translate(25px, 30px) rotate(50deg)'
      },
      '& .man': {
        transform: 'translate(239px, 178px)'
      }
    }
  }
}));


export default function DeadZoneControl(props) {
  const { distance, height } = props;
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className='d-flex'>
        <div className={classes.yAxis}><span>{height}m</span></div>
        <div className={classes.content}>
          <svg>
            <path className='camera' d="M0 0 0-2C0-5 0-6-4-4L-7-2-7-2C-7-4-8-5-10-5L-21-5C-23-5-24-4-24-2L-24 2C-24 4-23 5-21 5L-10 5C-8 5-7 4-7 2L-7 2-7 2-4 4C0 6 0 5 0 2L0 0M-7-2-7 2" fill="transparent" stroke="#47AAEE" />
            <path className='man' d="M0-28C-2-28-4-26-4-24-4-22-2-20 0-20 2-20 4-22 4-24 4-26 2-28 0-28M0 0 2 0C3 0 4-1 4-2L4-9C5-9 6-10 6-11L6-19C6-20 5-21 4-21L3-21C2-21 1-20 0-20-1-20-2-21-3-21L-4-21C-5-21-6-20-6-19L-6-11C-6-10-5-9-4-9L-4-2C-4-1-3 0-2 0L0 0" fill="transparent" stroke="#47AAEE" />
            <line x1="25" y1="30" x2="247" y2="150" stroke="#47AAEE" />
            <line x1="25" y1="30" x2="70" y2="180" stroke="#47AAEE" />
          </svg>
        </div>
      </div>
      <div className={classes.xAxis}><span>{distance}m</span></div>
    </div>
  );
};