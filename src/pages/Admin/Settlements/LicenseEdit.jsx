import { Breadcrumb, Button, Checkbox, Col, Divider, Form, Input, Row, Typography } from 'antd';
import React from 'react';
import { createUseStyles } from 'react-jss';

import Link from 'components/controls/common/Link';

import PdfPng from 'assets/images/pdf.png';
import PreviewPng from 'assets/images/preview-white.png';
import TrashPng from 'assets/images/trash-big.png';
import Exporter from 'components/panels/Exporter';

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

export default function LicenseEdit() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className='d-flex d-between'>
        <Breadcrumb>
          <Breadcrumb.Item><Link to=''>Rozliczenia</Link></Breadcrumb.Item>
          <Breadcrumb.Item>Dodaj licencję</Breadcrumb.Item>
        </Breadcrumb>

        <Exporter />
      </div>
      <Divider className='mt-15 mb-15' />

      <Row gutter={15}>
        <Col span={16}>
          <Row className='bg-white p-15 shadow-light'>
            <Col span={5}>
              <Typography.Title level={5}>Dane licencji</Typography.Title>
            </Col>
            <Col span={19}>
              <Form labelCol={{ span: 24 }}>
                <Row gutter={[15, 15]}>
                  <Col span={13}>
                    <Form.Item label="Nazwa licencji" name='email' required>
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={13}>
                    <Form.Item label="Cena za tydzień" name='name'>
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col span={13}>
                    <Form.Item label="Cena za miesiac" name='name1'>
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={13}>
                    <Form.Item label="Cena za rok" name='name1'>
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={13}>
                    <Typography.Title level={5}>Licencja obejmuje</Typography.Title>
                  </Col>
                  <Col span={13}>
                    <Row>
                      {[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map((item, i) =>
                        <Col span={12} key={i} className='mt-10'><Checkbox>Lorem ipsum</Checkbox></Col>)
                      }
                    </Row>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
        </Col>
        <Col span={8}>
          <div className='bg-white p-15 shadow-light'>
            <Row gutter={[15, 15]}>
              <Col span={8}>
                <div className={classes.buttonBadge}>Generuj plik PDF</div>
                <Button size='large' type='primary' className='secondary mt-22' block icon={<img src={PdfPng} alt="" />} />
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
          </div>
        </Col>
      </Row>
    </div>
  );
};