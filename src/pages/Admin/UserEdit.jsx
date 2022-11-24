import { Breadcrumb, Button, Col, Divider, Form, Input, Row, Select, Typography } from 'antd';
import React from 'react';
import { createUseStyles } from 'react-jss';

import Link from 'components/controls/common/Link';
import { useNavigate } from 'react-router-dom';

import CameraPng from 'assets/images/camera-icon.png';
import PdfPng from 'assets/images/pdf.png';
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
  },
  uploader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: 15,
    '& button': {
      width: 120,
      height: 120,
      borderStyle: 'dashed'
    }
  }
}));

export default function UserEdit() {
  const classes = useStyles();
  const navigate = useNavigate();

  return (
    <div className={classes.root}>
      <div className='d-flex d-between'>
        <Breadcrumb>
          <Breadcrumb.Item><Link to=''>Użytkownicy</Link></Breadcrumb.Item>
          <Breadcrumb.Item>Dodaj użytkowników</Breadcrumb.Item>
        </Breadcrumb>

        <Button onClick={() => navigate('/admin/users')} type='ghost' danger>Powrót do listy użytkowników</Button>
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
                  <Col span={10}>
                    <Form.Item label="Adres e-mail" name='email' required>
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={14}>
                    <Form.Item label="Nazwa wyświetlana" name='name'>
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col span={10}>
                    <Form.Item label="Nazwa użytkownika" name='name1'>
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={14}>
                    <Form.Item label="Należy do grupy" name='group'>
                      <Select>
                        <Select.Option value="1">Group 1</Select.Option>
                        <Select.Option value="2">Group 2</Select.Option>
                        <Select.Option value="3">Group 3</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col span={10}>
                    <Form.Item label="Imię" name='name3'>
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={14}>
                    <Form.Item label="Nazwisko" name='name4'>
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col span={10}>
                    <Form.Item label="Kraj/Region" name='region'>
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={14}>
                    <Form.Item label="Język" name='lang'>
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col span={10}>
                    <Form.Item label="Województwo" name='region'>
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="Miasto" name='lang'>
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="Kod pocztowy" name='lang'>
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col span={10}>
                    <Form.Item label="Telefon kontaktowy" name='region'>
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={14}>
                    <Form.Item label="Telefon służbowy" name='lang'>
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col span={10}>
                    <Form.Item label="Typ konta" name='region'>
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={14}>
                    <Form.Item label="Nazwa firmy" name='lang'>
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col span={10}>
                    <Form.Item label="Stanowisko" name='region'>
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={14}>
                    <Form.Item label="Strona internetowa firmy" name='lang'>
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col span={10}>
                    <Form.Item label="NIP Firmy" name='region'>
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={14}>
                    <Form.Item label="Adres e-mail firmy" name='lang'>
                      <Input />
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
            </Col>
            <Col span={24} className='bg-white p-15 shadow-light'>
              <Typography>Zdjęcie/Logo Firmy</Typography>
              <div className={classes.uploader}>
                <Button shape="circle" type='default' icon={<img src={CameraPng} alt="" />} />
              </div>
              <Input.Group compact>
                <Input style={{ width: 'calc(100% - 150px)' }} placeholder="Wybierz plik z dysku" />
                <Button type="primary" style={{ width: 150 }}>Wybierz plik</Button>
              </Input.Group>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};