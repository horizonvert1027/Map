import { Breadcrumb, Button, Checkbox, Col, Divider, Form, Input, Row, Typography } from 'antd';
import React from 'react';
import { createUseStyles } from 'react-jss';

import Link from 'components/controls/common/Link';
import { useNavigate } from 'react-router-dom';

import TrashPng from 'assets/images/trash-big.png';
import Table from 'components/controls/common/Table';

const useStyles = createUseStyles((theme) => ({
  root: {
    padding: 15,
    backgroundColor: '#FCFCFC'
  },
}));

export default function GroupEdit() {
  const classes = useStyles();
  const navigate = useNavigate();

  const columns = [
    { title: 'ID', dataIndex: 'id', sorter: 'text', filter: 'text' },
    { title: 'Nazwa wyświetlana', dataIndex: 'name', sorter: 'text', filter: 'text' },
    { title: 'Nazwa użytkownika', dataIndex: 'name1', sorter: 'text', filter: 'text' },
    { title: 'Abonament', dataIndex: 'type', sorter: 'text', filter: 'select' },
    { title: 'IP', dataIndex: 'type', sorter: 'text', filter: 'text' },
    { title: 'Akcje', dataIndex: 'action' },
  ];

  const data = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map((v, i) => ({
    key: i + 1,
    id: i + 1,
    name: 'Nazwa' + i,
    exposure: Math.round(Math.random(i) * 100000),
    action: <Checkbox />
  }));

  return (
    <div className={classes.root}>
      <div className='d-flex d-between'>
        <Breadcrumb>
          <Breadcrumb.Item><Link to=''>Grupy</Link></Breadcrumb.Item>
          <Breadcrumb.Item><Link to=''>Lista grup</Link></Breadcrumb.Item>
          <Breadcrumb.Item>Dodaj grupę</Breadcrumb.Item>
        </Breadcrumb>

        <Button onClick={() => navigate('/admin/groups')} type='ghost' danger>Powrót do listy użytkowników</Button>
      </div>
      <Divider className='mt-15 mb-15' />

      <Row gutter={[15, 15]}>
        <Col span={18}>
          <Row className='bg-white p-15 shadow-light'>
            <Col span={5}>
              <Typography.Title level={5}>Dane grupy</Typography.Title>
            </Col>
            <Col span={10}>
              <Form labelCol={{ span: 24 }}>
                <Form.Item label="Nazwa grupy" name='group_name' required>
                  <Input />
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </Col>
        <Col span={6}>
          <div className='bg-white p-15 shadow-light'>
            <Row gutter={15}>
              <Col span={12}>
                <Button type='primary' size='large' block>Zapisz</Button>
              </Col>
              <Col span={12}>
                <Button className='d-auto' type='primary' size='large' block danger icon={<img src={TrashPng} alt="" />} />
              </Col>
            </Row>
          </div>
        </Col>
        <Col span={24} className='mt-15'>
          <Typography.Title level={5} className='m-0'>Członkowie</Typography.Title>
        </Col>
        <Col span={18}>
          <div className='bg-white p-15 shadow-light'>
            <Table columns={columns} dataSource={data} size='small' />
          </div>
        </Col>
      </Row>
    </div>
  );
};