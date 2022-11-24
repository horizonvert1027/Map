import React from 'react';
import { createUseStyles } from 'react-jss';
import ClockLoader from "react-spinners/ClockLoader";

const useStyles = createUseStyles((theme) => ({
  root: {
    background: '#ffffff77',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    position: 'absolute',
    zIndex: 9999,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

export default function Loader({ loading, scrollOffset }) {
  const classes = useStyles();

  return (
    <>
      {loading &&
        <div className={classes.root} >
          <ClockLoader color="#47AAEE" size={50} />
        </div>
      }
    </>
  );
};