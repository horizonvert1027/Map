/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { Dropdown, Layout, Menu } from 'antd';
import { createUseStyles } from 'react-jss';
import CoinsPng from 'assets/images/coins.png';
import QuestionPng from 'assets/images/question.png';
import ContactPng from 'assets/images/contact.png';
import AvatarPng from 'assets/images/avatar.png';
import UserPng from 'assets/images/user.png';
import LogoutPng from 'assets/images/logout.png';
import LogoPng from 'assets/images/logo.png';
import RepairPng from 'assets/images/repair.png';

import Link from 'components/controls/common/Link';
import { Languages } from 'constants/Constants';
import useAuth from 'hooks/auth';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import FirebaseAPI from 'api/FirebaseAPI';
import { setProjectInfo } from 'redux/actions/drawing';

const { Header } = Layout;

const useStyles = createUseStyles(({
  root: {
    background: '#47AAEE',
    height: 80,
    lineHeight: '80px',
    padding: 0,
    display: 'flex',
    '& .logo': {
      width: 320,
      cursor: 'pointer',
      borderBottom: '1px solid #ccebff',
      background: '#edf8fe',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    '& .ant-menu-root': {
      background: '#47AAEE',
      justifyContent: 'flex-end',
      flexGrow: 1
    },
    '& .ant-menu-item': {
      height: 80,
      color: 'white',
      '&.ant-menu-item-active': {
        // borderBottom: '2px solid white',
        background: '#1983CB!important'
      },
      '& span a': {
        color: 'white'
      }
    }
  },
  lang: {
    width: 30,
    textAlign: 'center'
  },
  avatar: {
    height: '100%',
    '& img': { width: 50, height: 50 }
  },
  userinfo: {
    pointerEvents: 'none'
  }
}));

export default function Topbar({ showLogo }) {
  const classes = useStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, signOut } = useAuth();

  const langMenuItems = Languages.map(i => ({ key: i.code, label: i.code }));
  const [language, setLanguage] = useState(Languages[0].code);
  const [isSharePage, setIsSharePage] = useState(false);
  const location = useLocation();

  const { projectInfo } = useSelector(state => state.drawing);

  const handleLogout = () => {
    signOut().then(() => {
      navigate('/login');
    });
  }

  const avatarMenuItems = [
    {
      key: 'admin',
      label: <Link to="/admin/login">Admin</Link>,
      icon: <img src={RepairPng} alt="menu" />
    },
    {
      key: 'profile',
      label: <Link to="/profile">Twój profil</Link>,
      icon: <img src={UserPng} alt="menu" />
    },
    {
      key: 'logout',
      label: <div style={{ paddingLeft: 2 }} onClick={handleLogout}>Wyloguj</div>,
      icon: <img src={LogoutPng} alt="menu" />
    },
  ];

  const mainMenuItems = [
    {
      key: 'subscription',
      label: <Link to="/guide">Abonamenty</Link>,
      icon: <img src={CoinsPng} alt="menu" />
    },
    {
      key: 'how-to-work',
      label: <Link to="/guide">Jak to działa?</Link>,
      icon: <img src={QuestionPng} alt="menu" />
    },
    {
      key: 'contact-us',
      label: <Link to="/contact-us">Kontakt</Link>,
      icon: <img src={ContactPng} alt="menu" />
    },
    {
      key: 'lang',
      label: <Dropdown overlay={<Menu items={langMenuItems} onClick={v => setLanguage(v.key)} />} placement="bottom" trigger="click">
        <div className='text-center w-40'>{language}</div>
      </Dropdown>
    },
    {
      key: 'userinfo',
      label: isSharePage ? `Udostępnione przez: ${projectInfo.creatorName ? projectInfo.creatorName : ''}` : (user ? `Zalogowany jako: ${user.name}` : ''),
      className: classes.userinfo,
    },
    {
      key: 'avatar',
      label: <Dropdown overlay={<Menu items={avatarMenuItems} />} placement="bottom" trigger="click">
        <div className={classes.avatar}>
          <img src={user?.avatar ? user.avatar : AvatarPng} style={{ width: '100%', borderRadius: '50%' }} alt="avatar" />
        </div>
      </Dropdown>
    }
  ];

  useEffect(() => {
    setIsSharePage(location.pathname.indexOf('/share/') === 0);
  }, [location.pathname]);

  useEffect(() => {
    if (projectInfo.creator) {
      FirebaseAPI.user.get(projectInfo.creator).then(res => {
        dispatch(setProjectInfo({ ...projectInfo, creatorName: res.name }));
      })
    }
  }, [projectInfo.creator]);

  return (
    <Header className={classes.root} id="header_menu">
      {showLogo &&
        <div className="logo" >
          <Link to="/login">
            <img src={LogoPng} alt="logo" />
          </Link>
        </div>
      }

      {isSharePage && <div className='text-white pl-10'>Nazwa Projektu: {projectInfo.name}</div>}

      <Menu theme="dark" mode="horizontal" items={mainMenuItems} />
    </Header>
  );
};