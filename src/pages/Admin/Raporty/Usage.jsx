import React, { useState } from 'react';
import { Breadcrumb, Button, Col, Divider, Row } from 'antd';
import Exporter from 'components/panels/Exporter';
import { createUseStyles } from 'react-jss';

import Link from 'components/controls/common/Link';
import Table from 'components/controls/common/Table';

const useStyles = createUseStyles((theme) => ({
  root: {
    padding: 15
  },
}));

export default function Usage() {
  const classes = useStyles();

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const columns = [
    { title: 'Nazwa użytkownika', dataIndex: 'id', sorter: 'text' },
    { title: 'Plan', dataIndex: 'name', sorter: 'text' },
    { title: 'Liczba dni', dataIndex: 'type', sorter: 'text' },
    { title: 'Liczba projektów', dataIndex: 'sale_date1', sorter: 'text' },
    { title: 'Liczba wysłanych maili', dataIndex: 'sale_date2', sorter: 'text' },
    { title: 'Wykorzystane miejsce w chmurze (w MB)', dataIndex: 'sale_date3', sorter: 'text' },
  ];

  const data = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map((v, i) => ({
    key: i + 1,
    id: i + 1,
    name: 'Nazwa' + i,
    exposure: Math.round(Math.random(i) * 100000),
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
        <Breadcrumb.Item>Raport użycia</Breadcrumb.Item>
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