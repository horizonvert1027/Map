import React from 'react';
import { createUseStyles } from 'react-jss';

import { Breadcrumb, Col, Row, Typography } from 'antd';

const useStyles = createUseStyles((theme) => ({
  root: {
    padding: 15
  }
}));

export default function Payments() {
  const classes = useStyles();

  return (
    <div className={classes.root} >
      <Breadcrumb className='mb-20'>
        <Breadcrumb.Item>Pomoc</Breadcrumb.Item>
        <Breadcrumb.Item>Przewodnik po aplikacji</Breadcrumb.Item>
      </Breadcrumb>

      <Row gutter={15}>
        <Col span={14}>
          <Typography className='text-justify'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Typography>
          <Typography className='text-justify'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Typography>
          <Typography className='text-justify'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Typography>
          <Typography className='text-justify'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Typography>
        </Col>
        <Col span={10}>
          <img className='w-full' src='images/guide1.png' alt="" />
        </Col>
      </Row>

      <Row className='mt-20'>
        <Col offset={2}>
          <Typography className='mt-20 text-primary'>Jak korzystać?</Typography>
        </Col>
      </Row>

      <Row className='mt-20'>
        <Col offset={4} span={16}>
          {[1, 2, 3, 4, 5, 6, 7].map(v =>
            <Row className='mb-20' gutter={[25]} key={v}>
              <Col span={10}>
                <img className='w-full' src='images/guide2.png' alt="" />
              </Col>
              <Col span={14}>
                <Typography className='text-primary'>Krok {v} <span className='ml-20'>Załóż konto</span></Typography>
                <Typography className='text-justify'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Typography>
                <Typography className='text-justify'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</Typography>
              </Col>
            </Row>
          )}
        </Col>
      </Row>

      <Row className='mt-20'>
        <Col>
          <Typography>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Typography>
        </Col>
      </Row>
    </div>
  );
};