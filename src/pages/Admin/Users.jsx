import { Breadcrumb, Button, Divider, Space, message } from 'antd';
import Exporter from 'components/panels/Exporter';
import React, {useState, useEffect} from 'react';
import { createUseStyles } from 'react-jss';

import BlockPng from 'assets/images/block.png';
import PenPng from 'assets/images/pen.png';
import TrashPng from 'assets/images/trash-blue.png';
import Link from 'components/controls/common/Link';
import { useNavigate } from 'react-router-dom';
import Table from 'components/controls/common/Table';
import AdminApi from './api/AdminApi';
import { useDispatch } from 'react-redux';
import { setLoading } from 'redux/actions/layout';


const useStyles = createUseStyles((theme) => ({
  root: {
    padding: 15
  },
}));

export default function Users() {
  const classes = useStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userData, setUserData] = useState([]);
  const columns = [
    { title: 'ID', dataIndex: 'id', sorter: 'number', filter: 'text' },
    { title: 'Nazwa wyświetlana', dataIndex: 'name', sorter: 'text', filter: 'text' },
    { title: 'Nazwa użytkownika', dataIndex: 'type', sorter: 'text', filter: 'text' },
    { title: 'Data rejestracji', dataIndex: 'sale_date', sorter: 'date', filter: 'date' },
    { title: 'Ostatnia aktywność', dataIndex: 'exposure', sorter: 'date', filter: 'date' },
    { title: 'Abonament', dataIndex: 'deadline', sorter: 'text', filter: 'select' },
    { title: 'IP', dataIndex: 'paid', sorter: 'text', filter: 'text' },
    { title: 'Akcje', dataIndex: 'action' },
  ];

  const data = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map((v, i) => ({
    key: i + 1,
    id: i + 1,
    name: 'Nazwa' + i,
    exposure: Math.round(Math.random(i) * 100000),
    action: <Space>
      <Button className='d-auto' type='ghost' onClick={() => navigate(`/admin/user/edit/${i + 1}`)} icon={<img src={PenPng} alt="" />} />
      <Button className='d-auto' type='ghost' icon={<img src={BlockPng} alt="" />} />
      <Button className='d-auto' type='ghost' icon={<img src={TrashPng} alt="" />} />
    </Space>
  }));

  const getUsers = () => {
    dispatch(setLoading(true));
    AdminApi.users.getUsers().then(res => {
      console.log(res);
      setUserData(res);
      dispatch(setLoading(false));
    }).catch(e => {
      console.log(e);
      message.error('An error is occurred while loading users.');
      dispatch(setLoading(false));
    })
  }

  useEffect(() => {
    getUsers();
  }, [])
  return (
    <div className={classes.root}>
      <div className='d-flex d-between'>
        <Button type='primary' onClick={() => { navigate('/admin/user/add') }}>Dodaj użytkownika</Button>
        <Exporter />
      </div>

      <Divider className='mt-15 mb-15' />

      <Breadcrumb>
        <Breadcrumb.Item><Link to=''>Użytkownicy</Link></Breadcrumb.Item>
        <Breadcrumb.Item>Lista użytkowników</Breadcrumb.Item>
      </Breadcrumb>

      <div className='mt-15 p-15 shadow-light'>
        <Table columns={columns} dataSource={userData} size='small' pagination={{ position: ['topRight', 'bottomRight'] }} />
      </div>
    </div>
  );
};