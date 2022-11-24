/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { Breadcrumb, Button, Col, Input, message, Row, Select, Space, Typography } from 'antd';
import ProjectItem from 'components/data/ProjectItem';
import NewProjectModal from 'components/modals/NewProjectModal';
import React from 'react';
import { createUseStyles } from 'react-jss';
import FirebaseAPI from 'api/FirebaseAPI';
import useAuth from 'hooks/auth';
import { useDispatch } from 'react-redux';
import { setLoading } from 'redux/actions/layout';

const useStyles = createUseStyles((theme) => ({
  root: {
    padding: 15,
    position: 'relative'
  },
}));

export default function Projects() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { user } = useAuth();

  const [modalOpen, setModalOpen] = useState(false);
  const [data, setData] = useState([]);
  const [projects, setProjects] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [sort, setSort] = useState('createdAt_desc');

  const getProjects = () => {
    if (user) {
      dispatch(setLoading(true));
      FirebaseAPI.project.getMyProjects(user.uid).then(res => {
      console.log(res)
        setData(res);
        dispatch(setLoading(false));
      }).catch(e => {
        console.log(e);
        message.error('An error is occurred while loading project.');
        dispatch(setLoading(false));
      });
    }
  }

  const filterAndSortProjects = () => {
    const [sortName, sortDirection] = sort.split('_');
    setProjects(data.filter(i => i.name.indexOf(keyword) >= 0).sort((a, b) => {
      if (sortName === 'name') {
        return sortDirection === 'asc' ? a[sortName].localeCompare(b[sortName]) : b[sortName].localeCompare(a[sortName]);
      } else {
        return sortDirection === 'asc' ? a[sortName] - b[sortName] : b[sortName] - a[sortName];
      }
    }));
  }

  useEffect(() => {
    filterAndSortProjects();
  }, [data, keyword]);

  useEffect(() => {
    getProjects();
  }, [user]);

  useEffect(() => {
    filterAndSortProjects();
  }, [sort]);

  return (
    <div className={classes.root}>
      <Breadcrumb className='mb-20'>
        <Breadcrumb.Item>Historia projektów</Breadcrumb.Item>
      </Breadcrumb>

      <div className='d-flex d-between mb-20'>
        <Space>
          <Typography>10 Projektów</Typography>
          <Button type='primary' onClick={() => setModalOpen(true)}>Nowy projekt</Button>
          <Input
            placeholder='Szukaj...'
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            allowClear />
        </Space>
        <Space>
          <Typography>Sortuj według:</Typography>
          <Select style={{ width: 250 }} defaultValue={sort} onChange={v => setSort(v)}>
            <Select.Option value='createdAt_asc'>Data powstania - najstarsze</Select.Option>
            <Select.Option value='createdAt_desc'>Data powstania - najnowsze</Select.Option>
            <Select.Option value='updatedAt_asc'>Data aktualizacji - najstarsze</Select.Option>
            <Select.Option value='updatedAt_desc'>Data aktualizacji - najnowsze</Select.Option>
            <Select.Option value='name_asc'>Nazwa A-Z</Select.Option>
            <Select.Option value='name_desc'>Nazwa Z-A</Select.Option>
          </Select>
          {/* <Button type='primary' onClick={handleSort}>Sortuj</Button> */}
        </Space>
      </div>

      <Row gutter={[16, 16]}>
        {projects.map((project, index) => {
          return <Col span={4} key={index}>
            <ProjectItem data={project} afterDeletedItem={getProjects} />
          </Col>
        })}
      </Row>

      <NewProjectModal open={modalOpen} setOpen={setModalOpen} />
    </div>
  );
};