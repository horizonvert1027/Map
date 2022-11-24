import React from 'react';
import Link from 'components/controls/common/Link';
import { createUseStyles } from 'react-jss';
import { Typography } from 'antd';

const useStyles = createUseStyles(({
  root: {

  },
  media: {
    width: '100%'
  }
}));

export default function NewsItem({ data }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <img className={classes.media} src={data.image} alt="" />
      <div>
        <Typography.Title level={5}>{data.title}</Typography.Title>
        <Typography>{data.content}</Typography>
        <div style={{ textAlign: 'right', fontSize: 14, marginTop: 10 }}>
          <Link to="">Czytaj dalej</Link>
        </div>
      </div>
    </div>
  );
}