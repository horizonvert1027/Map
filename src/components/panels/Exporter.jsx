import React from 'react';
import { createUseStyles } from 'react-jss';
import { Button, Space } from 'antd';

const useStyles = createUseStyles((theme) => ({
  root: {

  },
}));

export default function Exporter() {
  const classes = useStyles();

  return (
    <Space className={classes.root}>
      <Button type='ghost' danger>Eksport listy do XLS</Button>
      <Button type='ghost' danger>Eksport listy do CSV</Button>
    </Space>
  );
};
