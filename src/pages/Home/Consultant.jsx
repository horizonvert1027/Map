import React, { useState } from 'react';
import { Breadcrumb, Button, Col, Divider, Input, Row, Select, Space, Table, Typography } from 'antd';
import { createUseStyles } from 'react-jss';
import TextArea from 'antd/lib/input/TextArea';

import CallPng from 'assets/images/phone-call.png';
import AttachPng from 'assets/images/attach.png';
import SendPng from 'assets/images/send.png';
import HappyPng from 'assets/images/happy.png';
import SadPng from 'assets/images/sad.png';
import IndifferentPng from 'assets/images/indifferent.png';
import ViewPng from 'assets/images/view.png';
import TrashPng from 'assets/images/trash-blue.png';

const useStyles = createUseStyles((theme) => ({
  root: {
    // padding: 15,
  },
  chatContent: {
    marginTop: 20,
    marginBottom: 20,
    borderTop: '1px solid #f0f0f0',
    borderBottom: '1px solid #f0f0f0',
    height: 400
  },
  enjoyBtnGroup: {
    width: 300,
    display: 'flex',
    justifyContent: 'space-between',
    '& button': {
      width: 70,
      height: 70,
    }
  }
}));

export default function Consultant() {
  const classes = useStyles();

  const enjoyButtons = [
    { id: 'happy', icon: HappyPng },
    { id: 'sad', icon: SadPng },
    { id: 'indifferent', icon: IndifferentPng },
  ];
  const [enjoy, setEnjoy] = useState('happy');


  const columns = [
    {
      title: 'Temat',
      dataIndex: 'topic',
      // filters: [{ text: 'Joe', value: 'Joe', }, { text: 'Jim', value: 'Jim', }],
      // onFilter: (value, record) => record.name.indexOf(value) === 0,
      sorter: (a, b) => a.topic - b.topic,
    },
    {
      title: 'Data',
      dataIndex: 'data',
      sorter: (a, b) => a.data - b.data,
    },
    {
      title: 'Akcje',
      dataIndex: 'action',
    },
  ];


  const data = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map((v, i) => ({
    key: i + 1,
    topic: Math.round(Math.random(i) * 1000),
    data: Math.round(Math.random(i) * 100000),
    action: <Space>
      <Button type='ghost' icon={<img src={ViewPng} alt="" />} />
      <Button type='ghost' icon={<img src={TrashPng} alt="" />} />
    </Space>
  }));

  return (
    <Row className={classes.root}>
      <Col span={14} className='p-15'>
        <div className='d-flex d-between'>
          <Breadcrumb>
            <Breadcrumb.Item>Pomoc</Breadcrumb.Item>
            <Breadcrumb.Item>Chat z konsultantem</Breadcrumb.Item>
          </Breadcrumb>
          <img src={CallPng} alt="call" />
        </div>

        <Divider />

        <Space>
          <Typography>Wybierz temat rozmowy:</Typography>
          <Select defaultValue='1' style={{ width: 400 }}>
            <Select.Option value='1'>Temat 123</Select.Option>
            <Select.Option value='2'>Temat 345</Select.Option>
            <Select.Option value='3'>Temat 567</Select.Option>
          </Select>
        </Space>

        <div className={classes.chatContent}>
          Chat content will be placed here....
        </div>

        <Input.Group className='d-flex'>
          <Input style={{ width: 'calc(100% - 40px)' }}
            placeholder="Napisz coś..."
            suffix={<img className='cursor-pointer' src={AttachPng} alt="" />}
          />
          <Button type="primary" icon={<img src={SendPng} alt="send" />} className='d-auto w-40' />
        </Input.Group>

        <Divider />

        <Typography.Title level={4}>Oceń chat</Typography.Title>
        <div className='d-flex d-middle'>
          <div className={classes.enjoyBtnGroup}>
            {enjoyButtons.map(btn =>
              <Button
                key={btn.id}
                shape='circle'
                type={enjoy === btn.id ? 'primary' : 'default'}
                icon={<img src={btn.icon} alt="" style={{ filter: enjoy === btn.id ? 'brightness(0) invert()' : 'none' }} />}
                onClick={() => setEnjoy(btn.id)}
              />
            )}
          </div>
          <div className='d-grow ml-20'>
            <Typography>Napisz swoją opinię</Typography>
            <TextArea placeholder='Jan Kowalski' className='resize-none'></TextArea>
          </div>
        </div>

        <div className='d-flex d-end mt-20'>
          <Button type='primary'>Zakończ chat</Button>
        </div>
      </Col>

      <Col span={10} className='p-15' style={{ backgroundColor: '#FCFCFC' }}>
        <Typography.Title level={5} className='text-primary'>Historia chatów</Typography.Title>
        <Table columns={columns} dataSource={data} />
      </Col>
    </Row>
  );
};