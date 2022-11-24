import React from 'react';
import Link from 'components/controls/common/Link';
import { Typography } from 'antd';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles(theme => ({
  root: {
    padding: 15
  }
}));

export default function NotFound() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography.Title level={3}>
        404: The page you are looking for isn’t here
      </Typography.Title>
      <Typography>
        You either tried some shady route or you came here by mistake.
        Whichever it is, try using the navigation
      </Typography>
      <Link to="/login">Login</Link>
    </div>
  );
};