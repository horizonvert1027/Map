import React, { useState } from 'react';
import { Breadcrumb, Button, Divider, Space } from 'antd';
import Exporter from 'components/panels/Exporter';
import { createUseStyles } from 'react-jss';

import ReplyPng from 'assets/images/reply.png';
import TrashPng from 'assets/images/trash-blue.png';
import Link from 'components/controls/common/Link';
import Table from 'components/controls/common/Table';

const useStyles = createUseStyles((theme) => ({
  root: {
    padding: 15
  },
}));

export default function Messages() {
  const classes = useStyles();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const columns = [
    { title: 'Nadawca', dataIndex: 'id', sorter: 'text', filter: 'text' },
    { title: 'Temat', dataIndex: 'name', sorter: 'text', filter: 'text' },
    { title: 'Data odebrania', dataIndex: 'type', sorter: 'date', filter: 'date' },
    { title: 'Akcje', dataIndex: 'action', },
  ];

  const data = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map((v, i) => ({
    key: i + 1,
    id: i + 1,
    name: 'Nazwa' + i,
    exposure: Math.round(Math.random(i) * 100000),
    action: <Space>
      <Button className='d-auto' type='ghost' icon={<img src={ReplyPng} alt="" />} />
      <Button className='d-auto' type='ghost' icon={<img src={TrashPng} alt="" />} />
    </Space>
  }));

  const rowSelection = {
    selectedRowKeys,
    onChange: selectedRowKeys => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  return (
    <div className={classes.root}>
      <div className='d-flex d-between'>
        <div />
        <Exporter />
      </div>

      <Divider className='mt-15 mb-15' />

      <Breadcrumb>
        <Breadcrumb.Item><Link to=''>Pomoc techniczna</Link></Breadcrumb.Item>
        <Breadcrumb.Item>Wiadomości</Breadcrumb.Item>
      </Breadcrumb>

      <div className='mt-15 p-15 shadow-light'>
        <Table rowSelection={rowSelection} columns={columns} dataSource={data} size='small' pagination={{ position: ['topRight', 'bottomRight'] }} />
      </div>
    </div>
  );
};