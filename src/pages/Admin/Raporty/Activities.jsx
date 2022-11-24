import React, { useState } from 'react';
import { Breadcrumb, Button, Col, Divider, Row, Space } from 'antd';
import Exporter from 'components/panels/Exporter';
import { createUseStyles } from 'react-jss';

import PenPng from 'assets/images/pen.png';
import TrashPng from 'assets/images/trash-blue.png';
import Link from 'components/controls/common/Link';
import { useNavigate } from 'react-router-dom';
import Table from 'components/controls/common/Table';

const useStyles = createUseStyles((theme) => ({
  root: {
    padding: 15
  },
}));

export default function Activities() {
  const classes = useStyles();
  const navigate = useNavigate();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const columns = [
    { title: 'Nazwa planu', dataIndex: 'id', sorter: 'text' },
    { title: 'Użytkownicy aktywni', dataIndex: 'name', sorter: 'text' },
    { title: 'Użytkownicy nieaktywni', dataIndex: 'type', sorter: 'text' },
    { title: 'Dołączyło w danym okresie', dataIndex: 'sale_date', sorter: 'text' },
    { title: 'Liczba wszystkich użytkowników', dataIndex: 'sale_dated', sorter: 'text' },
  ];

  const data = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map((v, i) => ({
    key: i + 1,
    id: i + 1,
    name: 'Nazwa' + i,
    exposure: Math.round(Math.random(i) * 100000),
    action: <Space>
      <Button type='ghost' onClick={() => navigate(`/admin/license/edit/${i + 1}`)} icon={<img src={PenPng} alt="" />} />
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
        <div />
        <Exporter />
      </div>

      <Divider className='mt-15 mb-15' />

      <Breadcrumb>
        <Breadcrumb.Item><Link to=''>Raporty</Link></Breadcrumb.Item>
        <Breadcrumb.Item>Raport aktywnych użytkowników</Breadcrumb.Item>
      </Breadcrumb>

      <div className='p-15 mt-15 bg-white shadow-light'>
        <Row gutter={15}>
          <Col span={4} offset={4}>
            <Button type='primary' block>7 dni</Button>
          </Col>
          <Col span={4}>
            <Button type='ghost' block>30 dni</Button>
          </Col>
          <Col span={4}>
            <Button type='ghost' block>90 dni</Button>
          </Col>
          <Col span={4}>
            <Button type='ghost' block>18 dni</Button>
          </Col>
        </Row>

        <Divider className='m-0 mt-15' />

        <Table rowSelection={rowSelection} columns={columns} dataSource={data} size='small' />
      </div>
    </div>
  );
};