import React, { useState } from 'react';
import { Breadcrumb, Button, Divider, Space } from 'antd';
import Exporter from 'components/panels/Exporter';
import { createUseStyles } from 'react-jss';

import PenPng from 'assets/images/pen.png';
import ArrowPng from 'assets/images/right-arrow.png';
import TrashPng from 'assets/images/trash-blue.png';
import Link from 'components/controls/common/Link';
import { useNavigate } from 'react-router-dom';
import Table from 'components/controls/common/Table';

const useStyles = createUseStyles((theme) => ({
  root: {
    padding: 15
  },
}));

export default function HelpReport() {
  const classes = useStyles();
  const navigate = useNavigate();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const columns = [
    { title: 'Nazwa błędu', dataIndex: 'id', sorter: 'text', filter: 'text' },
    { title: 'Zgłoszone przez', dataIndex: 'name', sorter: 'text', filter: 'text' },
    { title: 'Data zgłoszenia', dataIndex: 'type', sorter: 'date', filter: 'date' },
    { title: 'Status', dataIndex: 'typed', sorter: 'text', filter: 'select' },
    { title: 'Akcje', dataIndex: 'action', },
  ];

  const data = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map((v, i) => ({
    key: i + 1,
    id: i + 1,
    name: 'Nazwa' + i,
    exposure: Math.round(Math.random(i) * 100000),
    action: <Space>
      <Button type='ghost' icon={<img src={PenPng} alt="" />} />
      <Button type='ghost' icon={<img src={ArrowPng} alt="" />} />
      <Button type='ghost' icon={<img src={TrashPng} alt="" />} />
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
        <Button type='primary' onClick={() => { navigate('/admin/help-report/add') }}>Zgłoś błąd</Button>
        <Exporter />
      </div>

      <Divider className='mt-15 mb-15' />

      <Breadcrumb>
        <Breadcrumb.Item><Link to=''>Pomoc techniczna</Link></Breadcrumb.Item>
        <Breadcrumb.Item>Raporty pomocy</Breadcrumb.Item>
      </Breadcrumb>

      <div className='mt-15 p-15 shadow-light'>
        <Table rowSelection={rowSelection} columns={columns} dataSource={data} size='small' pagination={{ position: ['topRight', 'bottomRight'] }} />
      </div>
    </div>
  );
};