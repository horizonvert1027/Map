/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { createUseStyles } from 'react-jss';
import WorldPng from 'assets/images/internet.png';
import PlusPng from 'assets/images/plus-big.png';
import AvatarPng from 'assets/images/avatar.png';

import { Button, Col, Input, message, Row, Typography } from 'antd';
import Link from 'components/controls/common/Link';
import ProjectItem from 'components/data/ProjectItem';
import NewsItem from 'components/data/NewsItem';
import NewProjectModal from 'components/modals/NewProjectModal';
import FirebaseAPI from 'api/FirebaseAPI';
import useAuth from 'hooks/auth';
import { useDispatch } from 'react-redux';
import { setLoading } from 'redux/actions/layout';

const { TextArea } = Input;

const useStyles = createUseStyles(({
  root: {
    position: 'relative'
  },
  avatar: {
    maxWidth: 120,
    maxHeight: 120,
    width: '100%',
    borderRadius: '50%'
  },
  profileSection: {
    display: 'flex',
    padding: 16
  },
  visitPaper: {
    background: '#EDF8FE',
    padding: 20,
    display: 'flex',
    alignItems: 'center',
    borderRadius: 5
  },
  newProjectBtn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EDF8FE',
    borderRadius: 5,
    height: '100%',
    paddingTop: 50,
    paddingBottom: 50,
    '& button': {
      width: 90,
      height: 90,
    }
  },
}));

export default function Dashboard(props) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { user } = useAuth();

  const [projects, setProjects] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const news = [
    { id: 1, title: 'Lorem ipsum dolor', content: 'Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua', image: 'images/camera-2456434_1920.png' },
    { id: 2, title: 'Lorem ipsum dolor', content: 'Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua', image: 'images/monitoring-1305045_1920.png' }
  ];
  const instagramImages = [
    { id: 1, image: 'images/camera-2322167_1920.png' },
    { id: 2, image: 'images/monitoring-401776_1920.png' },
    { id: 3, image: 'images/security-5462044_1920.png' },
    { id: 4, image: 'images/monitoring-401776_1920.png' }
  ];

  const getProjects = () => {
    if (user) {
      dispatch(setLoading(true));
      FirebaseAPI.project.getMyProjects(user.uid).then(res => {
        setProjects(res.slice(0, 5));
        dispatch(setLoading(false));
      }).catch(e => {
        console.log(e);
        message.error('An error is occurred while loading data.');
        dispatch(setLoading(false));
      });
    }
  }

  useEffect(() => {
    getProjects();
  }, [user]);

  return (
    <Row className={classes.root}>
      <Col span={14} style={{ background: 'white' }}>
        <div className={classes.profileSection}>
          <img className={classes.avatar} src={user?.avatar ? user.avatar : AvatarPng} alt="profile avatar" />
          <div style={{ paddingLeft: 16, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexGrow: 1 }}>
            <div>
              <Typography.Title level={4}>Witaj, {user.name}!</Typography.Title>
              <Link to="/profile">ustawienia profilu</Link>
            </div>
            <div>
              <Typography style={{ display: 'inline', paddingRight: 20, borderRight: '1px solid #707070' }}>
                <span style={{ fontWeight: 'bold' }}>{projects.length}</span> projektów
              </Typography>
              <Typography style={{ display: 'inline', paddingLeft: 20, paddingRight: 20, borderRight: '1px solid #707070' }}><span style={{ fontWeight: 'bold' }}>15</span> eksportów</Typography>
              <Typography style={{ display: 'inline', paddingLeft: 20 }}>Pakiet <span style={{ fontWeight: 'bold' }}>Premium</span></Typography>
            </div>
          </div>
        </div>

        <div style={{ padding: 16 }}>
          <div className={classes.visitPaper} mt={2}>
            <img style={{ marginRight: 20 }} src={WorldPng} alt="world icon" />
            <Typography>Zapraszamy na naszą oficjalną <Link to="">Stronę internetową!</Link></Typography>
          </div>
        </div>

        <div style={{ padding: 16 }}>
          <Typography.Title level={5}>Ostatnie projekty</Typography.Title>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <div className={classes.newProjectBtn}>
                <Button onClick={() => setModalOpen(true)} shape="circle" type='primary' icon={<img src={PlusPng} alt="" />} />
                <Typography style={{ marginTop: 20 }}>Stwórz nowy projekt</Typography>
              </div>
            </Col>
            {/* {projects.map((project, index) => {
              return <Col span={8} key={index}>
                <ProjectItem data={project} key={index}></ProjectItem>
              </Col>
            })} */}
            {projects.map((project, index) => {
              return <Col span={8} key={index}>
                <ProjectItem data={project} afterDeletedItem={getProjects} />
              </Col>
            })}
          </Row>
        </div>
      </Col>

      <Col span={10}>
        <div style={{ padding: 16 }}>
          <div>
            <Typography.Title level={5}>Ostatnie aktualności</Typography.Title>
            <Row gutter={16}>
              {news.map((item, index) => {
                return <Col span={12} key={index}>
                  <NewsItem data={item} />
                </Col>
              })}
            </Row>
          </div>

          <div>
            <Typography>Obserwuj nas na Instagramie</Typography>
            <Row>
              {instagramImages.map((img, index) => {
                return <Col span={6} key={index} style={{ textAlign: 'center' }}>
                  <img src={img.image} alt="instagram" />
                </Col>
              })}
            </Row>
          </div>

          <div style={{ marginTop: 16 }}>
            <Typography.Title level={5}>Videoporadnik</Typography.Title>
            <TextArea rows={15} />
          </div>
        </div>
      </Col>

      <NewProjectModal open={modalOpen} setOpen={setModalOpen} />
    </Row>
  );
};