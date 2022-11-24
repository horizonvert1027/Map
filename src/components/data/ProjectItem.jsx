import React from 'react';

import { createUseStyles } from 'react-jss';
import { Button, Dropdown, Menu, Typography } from 'antd';
import CameraPng from 'assets/images/video-camera.png';
import EditPng from 'assets/images/edit.png';
import SharePng from 'assets/images/share_white.png';
import TrashPng from 'assets/images/trash.png';
import noMapPng from 'assets/images/noMapPng.png';
import LinkPng from 'assets/images/link-gray.png';
import PicturePng from 'assets/images/picture-small.png';
import DownloadPng from 'assets/images/download-gray.png';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import FirebaseAPI from 'api/FirebaseAPI';
import Link from 'components/controls/common/Link';

const useStyles = createUseStyles(({
  root: {
    width: '100%',
    '& .footer': {
      background: '#EDF8FE',
      borderBottomLeftRadius: 5,
      borderBottomRightRadius: 5,
      padding: 8
    }
  },
  projectName: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  videoCnt: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
}));

export default function ProjectItem({ data, afterDeletedItem }) {
  const classes = useStyles();
  const navigate = useNavigate();

  const shareItems = [
    {
      key: 'link',
      label: <Link to={`/share/${data.id}`} target="_blank">Udostępnij jako link</Link>,
      icon: <img src={LinkPng} alt="menu" />
    },
    {
      key: 'picture',
      label: <Link to={`/share/${data.id}`} target="_blank">Udostępnij jako obraz</Link>,
      icon: <img src={PicturePng} alt="menu" />
    },
    {
      key: 'download',
      label: <Link to="/guide">Pobierz PDF</Link>,
      icon: <img src={DownloadPng} alt="menu" />
    },
  ];
  let image = '';
  if (data.imageSrc !== null) {
    image = data.imageSrc;
  } else if (data.kind === 1) {
    image = `https://maps.googleapis.com/maps/api/staticmap?maptype=satellite`;
    image += `&center=${data.center?.lat},${data.center?.lng}`;
    image += `&zoom=${data.zoom}`;
    image += `&size=640x480`;
    image += `&key=${process.env.REACT_APP_GOOGLE_MAP_API_KEY}`;
  } else {
    image= noMapPng;
  }

  const handleEdit = () => {
    navigate(`/project/${data.id}`);
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure want to delete this project?')) {
      FirebaseAPI.project.delete(data.id).then(res => {
        if (afterDeletedItem) {
          afterDeletedItem();
        }
      });
    }
  }

  return (
    <div className={classes.root}>
      <img style={{ width: '100%', aspectRatio: '4/3' }} src={image} alt="" />
      <div className='footer'>
        <Typography.Title level={5} className={classes.projectName}>{data.name}</Typography.Title>
        <div className={classes.videoCnt}>
          <Typography>{moment.unix(data.updatedAt).format('MM.DD.YYYY HH:mm:ss')}</Typography>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src={CameraPng} alt="" className='mr-5' />
            <Typography>{data.shapes.filter(s => s.type === 'camera').length}</Typography>
          </div>
        </div>
      </div>

      <Dropdown overlay={<Menu items={shareItems} />} placement="bottomRight" trigger={['click']}>
        <Button type='primary'
          className='d-auto'
          shape='circle'
          icon={<img src={SharePng} alt="" />}
          style={{ position: 'absolute', paddingLeft: 2, top: 10, right: 20 }}
        />
      </Dropdown>

      <Button type='primary'
        className='d-auto'
        shape='circle'
        icon={<img src={EditPng} alt="" />}
        style={{ position: 'absolute', paddingLeft: 2, bottom: 55, right: 60 }}
        onClick={handleEdit}
      />
      <Button type='primary'
        className='d-auto'
        shape='circle'
        icon={<img src={TrashPng} alt="" />}
        style={{ position: 'absolute', bottom: 55, right: 20 }}
        onClick={handleDelete}
      />
    </div>
  );
};