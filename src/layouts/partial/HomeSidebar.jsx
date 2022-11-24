import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { createUseStyles } from 'react-jss';
import Link from 'components/controls/common/Link';
import CaretUp from 'assets/images/caret-up.png';
import CaretDown from 'assets/images/caret-down.png';
import DashboardPng from 'assets/images/dashboard.png';
import MagicPng from 'assets/images/magic.png';
import HistoryPng from 'assets/images/history.png';
import AccountPng from 'assets/images/user.png';
import HelpPng from 'assets/images/help.png';
import NewProjectModal from 'components/modals/NewProjectModal';

const { Sider } = Layout;

const useStyles = createUseStyles(({
  root: {
    background: '#edf8fe',
    height: '100%',
    overflow: 'auto',
    overflowX: 'hidden',
    '& .ant-menu': {
      backgroundColor: '#edf8fe',
      border: 'none',
      '& .ant-menu-item-selected': {
        backgroundColor: '#ceeeff'
      }
    }
  },
  menuCaret: {
    position: 'absolute',
    top: 16,
    right: 16,
  }
}));

export default function HomeSidebar(props) {
  const classes = useStyles();
  const [modalOpen, setModalOpen] = useState(false);

  const menuItems = [
    {
      key: 'dashboard',
      label: <Link to="/dashboard">Dashboard</Link>,
      icon: <img src={DashboardPng} alt="dashboard" />,
    },
    {
      key: 'new-project',
      label: <div onClick={() => setModalOpen(true)}>Nowy projekt</div>, //<Link to="/project/add">Nowy projekt</Link>,
      icon: <img src={MagicPng} alt="new project" />
    },
    {
      key: 'projects',
      label: <Link to="/projects">Historia projektów</Link>,
      icon: <img src={HistoryPng} alt="projects" />
    },
    {
      key: 'account',
      label: 'Twoje konto',
      icon: <img src={AccountPng} alt="payment" />,
      expandIcon: ({ isOpen }) => <img className={classes.menuCaret} src={isOpen ? CaretUp : CaretDown} alt="" />,
      children: [
        { key: 'profile', label: <Link to="/profile">Edycja profilu</Link> },
        { key: 'payment', label: <Link to="/payments">Płatności i faktury</Link> }
      ]
    },
    {
      key: 'support',
      label: 'Pomoc',
      icon: <img src={HelpPng} alt="guide" />,
      expandIcon: ({ isOpen }) => <img className={classes.menuCaret} src={isOpen ? CaretUp : CaretDown} alt="" />,
      children: [
        { key: 'guide', label: <Link to="/guide">Przewodnik</Link> },
        { key: 'chat', label: <Link to="/consultant">Chat z konsultantem</Link> }
      ]
    }
  ];

  return (
    <Sider width={320} theme="light" className={classes.root}>
      <Menu mode="inline"
        items={menuItems}
        defaultSelectedKeys={['dashboard']}
        defaultOpenKeys={['account', 'support']}
      />

      <NewProjectModal open={modalOpen} setOpen={setModalOpen} />
    </Sider>
  );
};