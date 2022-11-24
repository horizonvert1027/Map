import React from 'react';
import { Layout, Menu } from 'antd';
import { createUseStyles } from 'react-jss';
import Link from 'components/controls/common/Link';
import CaretUp from 'assets/images/caret-up.png';
import CaretDown from 'assets/images/caret-down.png';
import TimerPng from 'assets/images/timer.png';
import UserPng from 'assets/images/user-gray.png';
import CollaborationPng from 'assets/images/collaboration.png';
import MoneyPng from 'assets/images/money-bag.png';
import MaintainPng from 'assets/images/technical-support.png';
import ReportPng from 'assets/images/bar-chart.png';

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
    },
  },
  menuCaret: {
    position: 'absolute',
    top: 16,
    right: 16,
  }
}));

export default function AdminSidebar(props) {
  const classes = useStyles();

  const menuItems = [
    {
      key: 'home',
      label: <Link to="/admin/home">Strona główna</Link>,
      icon: <img src={TimerPng} alt="admin-home" />
    },
    {
      key: 'users',
      label: <Link to="/admin/users">Użytkownicy</Link>,
      icon: <img src={UserPng} alt="users" />
    },
    {
      key: 'groups',
      label: <Link to="/admin/groups">Grupy</Link>,
      icon: <img src={CollaborationPng} alt="groups" />
    },
    {
      key: 'account',
      label: 'Rozliczenia',
      icon: <img src={MoneyPng} alt="payment" />,
      expandIcon: ({ isOpen }) => <img className={classes.menuCaret} src={isOpen ? CaretUp : CaretDown} alt="" />,
      children: [
        { key: 'subscriptions', label: <Link to="/admin/subscriptions">Subskrypcje</Link> },
        { key: 'bills', label: <Link to="/admin/bills">Rachunki</Link> },
        { key: 'licenses', label: <Link to="/admin/licenses">Licencje</Link> },
        { key: 'notifications', label: 'Powiadomienia' },
      ]
    },
    {
      key: 'support',
      label: 'Pomoc techniczna',
      icon: <img src={MaintainPng} alt="guide" />,
      expandIcon: ({ isOpen }) => <img className={classes.menuCaret} src={isOpen ? CaretUp : CaretDown} alt="" />,
      children: [
        { key: 'messages', label: <Link to="/admin/messages">Wiadomości</Link> },
        { key: 'help-report', label: <Link to="/admin/help-report">Raport pomocy</Link> },
      ]
    },
    {
      key: 'reports',
      label: 'Raporty',
      icon: <img src={ReportPng} alt="guide" />,
      expandIcon: ({ isOpen }) => <img className={classes.menuCaret} src={isOpen ? CaretUp : CaretDown} alt="" />,
      children: [
        { key: 'entrances', label: <Link to="/admin/entrances">Wejścia uczestników</Link> },
        { key: 'activities', label: <Link to="/admin/activities">Aktywność użytkowników</Link> },
        { key: 'usage', label: <Link to="/admin/usage">Użycie</Link> },
      ]
    },
  ]

  return (
    <Layout.Sider width={320} theme="light" className={classes.root}>
      <Menu mode="inline"
        items={menuItems}
        defaultSelectedKeys={['dashboard']}
        defaultOpenKeys={['account', 'support', 'reports']}
      />
    </Layout.Sider>
  );
};