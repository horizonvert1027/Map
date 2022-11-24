import React from 'react';
import { Breadcrumb, Button, Col, Divider, Form, Input, Row, Select, Typography } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { createUseStyles } from 'react-jss';

import Link from 'components/controls/common/Link';
import { useNavigate } from 'react-router-dom';

import ArrowPng from 'assets/images/right-arrow-big.png';
import PreviewPng from 'assets/images/preview-white.png';
import TrashPng from 'assets/images/trash-big.png';

const useStyles = createUseStyles((theme) => ({
  root: {
    padding: 15,
    backgroundColor: '#FCFCFC'
  },
  buttonBadge: {
    background: '#47aaee',
    fontSize: 10,
    borderRadius: 2,
    color: 'white',
    textAlign: 'center',
    display: 'inline',
    padding: '2px 5px',
    position: 'absolute',
    top: 0,
    right: 0,
  }
}));

export default function HelpReportEdit() {
  const classes = useStyles();
  const navigate = useNavigate();

  return (
    <div className={classes.root}>
      <div className='d-flex d-between'>
        <Breadcrumb>
          <Breadcrumb.Item><Link to=''>Pomoc techniczna</Link></Breadcrumb.Item>
          <Breadcrumb.Item><Link to=''>Raporty pomocy</Link></Breadcrumb.Item>
          <Breadcrumb.Item>Zgłaszanie błędu</Breadcrumb.Item>
        </Breadcrumb>

        <Button onClick={() => navigate('/admin/help-report')} type='ghost' danger>Powrót do listy użytkowników</Button>
      </div>
      <Divider className='mt-15 mb-15' />

      <Row gutter={15}>
        <Col span={16}>
          <Row className='bg-white p-15 shadow-light'>
            <Col span={5}>
              <Typography.Title level={5}>Dane użytkownika</Typography.Title>
            </Col>
            <Col span={19}>
              <Form labelCol={{ span: 24 }}>
                <Row gutter={[15, 15]}>
                  <Col span={24}>
                    <Form.Item label="Nazwa błędu" name='error_name' required>
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col span={16}>
                    <Form.Item label="Użytkownik zgłaszajacy" name='group'>
                      <Select>
                        <Select.Option value="1">Group 1</Select.Option>
                        <Select.Option value="2">Group 2</Select.Option>
                        <Select.Option value="3">Group 3</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col span={8}>
                    <Form.Item label="Data zgłoszenia" name='name3'>
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col span={24}>
                    <Form.Item label="Opis błędu" name='name4'>
                      <TextArea rows={5}></TextArea>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
        </Col>
        <Col span={8}>
          <Row gutter={[0, 15]}>
            <Col span={24} className='bg-white p-15 shadow-light'>
              <Row gutter={[15, 15]}>
                <Col span={8}>
                  <div className={classes.buttonBadge}>Przekaż do supportu</div>
                  <Button size='large' type='primary' className='secondary mt-22' block icon={<img src={ArrowPng} alt="" />} />
                </Col>
                <Col span={8}>
                  <div className={classes.buttonBadge}>Podgląd</div>
                  <Button size='large' type='primary' className='secondary mt-22' block icon={<img src={PreviewPng} alt="" />} />
                </Col>
                <Col span={8}>
                  <div className={classes.buttonBadge}>Usuń</div>
                  <Button size='large' type='primary' className='secondary mt-22' block icon={<img src={TrashPng} alt="" />} />
                </Col>
                <Col span={24}>
                  <Button type='primary' block>Zapisz</Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};