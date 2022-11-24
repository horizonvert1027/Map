import React from 'react';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles((theme) => ({
  root: {
    paddingLeft: 15,
    paddingRight: 15
  },
}));

export default function PointEditor() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div>Access point options will be placed here.</div>
    </div>
  );
}