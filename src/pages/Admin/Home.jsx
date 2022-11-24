import { Button, Card, Col, Form, Input, Row, Select, Typography } from 'antd';
import React from 'react';
import { createUseStyles } from 'react-jss';

import SmilePng from 'assets/images/smile.png';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const useStyles = createUseStyles((theme) => ({
  root: {
    padding: 15
  },
  formItem: {
    margin: 0,
    '& .ant-form-item-label': {
      padding: 0
    }
  },
}));

export default function Home() {
  const classes = useStyles();

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        display: false
      },
      // title: {
      //   display: true,
      //   text: 'Chart.js Line Chart',
      // },
    },
  };

  const labels = [13, 14, 15, 16, 17, 18, 19];

  const data = {
    labels,
    datasets: [
      {
        label: 'Dataset 1',
        data: [3, 6, 2, 7, 3, 7, 9],
        borderColor: '#47AAEE',
        backgroundColor: '#47AAEE',
        borderDash: [5],
        borderWidth: 2
      },
      {
        label: 'Dataset 2',
        data: [1, 7, 6, 2, 4, 9, 5],
        borderColor: '#47AAEE',
        backgroundColor: '#47AAEE',
        borderWidth: 2
      },
    ],
  };

  return (
    <div className={classes.root}>
      <Row gutter={[15, 15]}>
        <Col span={7}>
          <Card size="small" title="Stan witryny" headStyle={{ background: '#47aaee', color: '#fff' }} bodyStyle={{ backgroundColor: '#fff' }}>
            <Typography.Title level={5}>Stan witryny jest w porządku</Typography.Title>
            <Typography>W witrynie nie występują krytyczne problemy.</Typography>
            <Typography>Witryna jest wydajna i bezpieczna.</Typography>
            <div className='d-auto'>
              <img src={SmilePng} alt="" />
            </div>
          </Card>
        </Col>

        <Col span={7}>
          <Card size="small" title="W skrócie" headStyle={{ background: '#47aaee', color: '#fff' }} bodyStyle={{ backgroundColor: '#fff' }}>
            <Typography>54 użytkowników wersji Premium</Typography>
            <Typography>15 użytkowników wersji Basic</Typography>
            <Typography>68 użytkowników wersji Standard</Typography>
            <Typography>13 nowych użytkowników w ciągu ostatnich 30 dni</Typography>
            <Typography>13 nowych użytkowników w ciągu ostatnich 30 dni</Typography>
            <Typography>13 nowych użytkowników w ciągu ostatnich 30 dni</Typography>
          </Card>
        </Col>

        <Col span={10}>
          <Card size="small" title="Aktywność" headStyle={{ background: '#47aaee', color: '#fff' }} bodyStyle={{ backgroundColor: '#fff' }}>
            <div className='d-flex d-around'>
              <Typography>15.03.2021, 15:55</Typography>
              <Typography>Użytkownik jankowalski27 utworzył nowy projekt</Typography>
            </div>
            <div className='d-flex d-around'>
              <Typography>15.03.2021, 15:55</Typography>
              <Typography>Użytkownik jankowalski27 utworzył nowy projekt</Typography>
            </div>
            <div className='d-flex d-around'>
              <Typography>15.03.2021, 15:55</Typography>
              <Typography>Użytkownik jankowalski27 utworzył nowy projekt</Typography>
            </div>
            <div className='d-flex d-around'>
              <Typography>15.03.2021, 15:55</Typography>
              <Typography>Użytkownik jankowalski27 utworzył nowy projekt</Typography>
            </div>
            <div className='d-flex d-around'>
              <Typography>15.03.2021, 15:55</Typography>
              <Typography>Użytkownik jankowalski27 utworzył nowy projekt</Typography>
            </div>
            <div className='d-flex d-around'>
              <Typography>15.03.2021, 15:55</Typography>
              <Typography>Użytkownik jankowalski27 utworzył nowy projekt</Typography>
            </div>
          </Card>
        </Col>

        <Col span={7}>
          <Card size="small" title="Zgłoś błąd" headStyle={{ background: '#47aaee', color: '#fff' }} bodyStyle={{ backgroundColor: '#fff' }}>
            <Form labelCol={{ span: 24 }} autoComplete="off" >
              <Form.Item label="Nazwa błędu" name="error_name" className={classes.formItem}>
                <Input />
              </Form.Item>

              <Form.Item label="Użytkownik zgłaszajacy" name="reporter" className={classes.formItem}>
                <Select>
                  <Select.Option value="1">Group 1</Select.Option>
                  <Select.Option value="2">Group 2</Select.Option>
                  <Select.Option value="3">Group 3</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item label="Data zgłoszenia" name="filing_date" className={classes.formItem}>
                <Input />
              </Form.Item>

              <div className='mt-20'>
                <Button type='primary' block>Dalej</Button>
              </div>

            </Form>
          </Card>
        </Col>

        <Col span={17}>
          <Card size="small" title="Statystyki" headStyle={{ background: '#47aaee', color: '#fff' }} bodyStyle={{ backgroundColor: '#fff' }}>
            <Row>
              <Col span={14}>
                <Line options={options} data={data} />
              </Col>
              <Col span={10}>

              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};