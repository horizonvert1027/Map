import React from 'react';
import { Breadcrumb, Button, Divider, Space } from 'antd';
import Table from 'components/controls/common/Table';
import { createUseStyles } from 'react-jss';

import PreviewPng from 'assets/images/preview.png';
import DownloadPng from 'assets/images/download.png';

const useStyles = createUseStyles((theme) => ({
  root: {
    padding: 15
  }
}));

export default function Payments() {
  const classes = useStyles();

  const columns = [
    { title: 'ID', dataIndex: 'id', sorter: 'number', filter: 'text', width: 100 },
    { title: 'Nr faktury', dataIndex: 'invoice_number', sorter: 'text', filter: 'text', width: 200 },
    { title: 'Typ', dataIndex: 'type', sorter: 'text', filter: 'select', width: 200 },
    { title: 'Data sprzedaży', dataIndex: 'sale_date', sorter: 'date', filter: 'date' },
    { title: 'Data wystawienia', dataIndex: 'exposure', sorter: 'date', filter: 'date' },
    { title: 'Termin', dataIndex: 'deadline', sorter: 'date', filter: 'date' },
    { title: 'Opłacona', dataIndex: 'paid', sorter: 'date', filter: 'date' },
    { title: 'Netto', dataIndex: 'net', sorter: 'number', filter: 'text', width: 100 },
    { title: 'Brutto', dataIndex: 'gross', sorter: 'number', filter: 'text', width: 100 },
    { title: 'Akcje', dataIndex: 'action' },
  ];

  const makeId = (length) => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  const data = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, ].map((v, i) => ({
    key: i + 1,
    id: Math.round(Math.random(i) * 1000),
    invoice_number: makeId(6),
    type: 'Type' + Math.round(Math.random(i) * 1000),
    sale_date: '21/03/2022',
    exposure: '21/03/2022',
    deadline: '21/03/2022',
    paid: '21/03/2022',
    net: Math.round(Math.random(i) * 1000),
    gross: Math.round(Math.random(i) * 1000),
    action: <Space>
      <Button type='ghost' icon={<img src={PreviewPng} alt="" />} />
      <Button type='ghost' icon={<img src={DownloadPng} alt="" />} />
    </Space>
  }));

  return (
    <div className={classes.root} >
      <Breadcrumb className='mb-20'>
        <Breadcrumb.Item>Twoje konto</Breadcrumb.Item>
        <Breadcrumb.Item>Płatności i faktury</Breadcrumb.Item>
      </Breadcrumb>

      <div className='d-flex d-end'>
        <Button type='ghost' danger>Eksport listy do XLS</Button>
        <Button type='ghost' danger style={{ marginLeft: 10 }}>Eksport listy do CSV</Button>
      </div>
      <Divider />
      <div className='p-15 shadow-light'>
        <Table columns={columns} dataSource={data} size='small' pagination={{ position: ['topRight', 'bottomRight'] }} />
      </div>
    </div>
  );
};