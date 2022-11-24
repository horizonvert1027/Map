/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from 'react'
import { Button, Input, message } from 'antd'
import { createUseStyles } from 'react-jss'
import CameraAddPng from 'assets/images/camera-add.png'
import { setEditMode, setProjectInfo } from 'redux/actions/drawing'
import { useDispatch, useSelector } from 'react-redux'
import { Autocomplete } from '@react-google-maps/api'
import FirebaseAPI from 'api/FirebaseAPI'
import { setCenter, setCenterMarker } from 'redux/actions/map'
import moment from 'moment'
import { setLoading } from 'redux/actions/layout'
import useInterval from 'use-interval'
import domtoimage from 'dom-to-image'
import useAuth from 'hooks/auth'
// import html2canvas from 'html2canvas'
// import * as htmlToImage from 'html-to-image';
// import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';

const useStyles = createUseStyles(theme => ({
  root: {
    width: '100%',
    position: 'absolute',
    zIndex: 10,
    paddingLeft: 15,
    paddingRight: 15,
    marginTop: 15,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  cameraAddBtn: {
    flexShrink: 0,
    width: 290
  },
  addressInp: {
    border: '1px solid #d9d9d9',
    color: 'rgba(0, 0, 0, 0.85)',
    flexGrow: 1,
    padding: '4px 11px',
    borderRadius: 2,
    width: '100%',
    '&:hover': {
      borderColor: '#73c8fa'
    },
    '&:active': {
      borderColor: '#73c8fa'
    },
    '&:focus-visible': {
      outline: 0
    }
  },
  projectNameInp: {
    width: 400,
    marginLeft: 20
  }
}))

export default function ProjectTopbar(props) {
  const classes = useStyles()
  const dispatch = useDispatch()
  const { shapes, kind, projectInfo } = useSelector(state => state.drawing);
  const { map, center, zoom } = useSelector(state => state.map);
  const { drawingSidebar } = useSelector(state => state.layout);
  const { setting } = useSelector(state => state.setting);

  const { user } = useAuth();

  const [geocoder, setGeocoder] = useState();

  const handleCameraAdd = () => {
    dispatch(setEditMode('camera-add'))
  }
  const handleLoad = autocomplete => {
    setGeocoder(autocomplete)
  }

  const handleChangePlace = () => {
    let place = geocoder.getPlace();
    dispatch(setProjectInfo({ ...projectInfo, address: place.formatted_address }));
    if (map) {
      const center = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      }
      dispatch(setCenter(center))
      if (kind === 1) {
        dispatch(
          setCenterMarker(
            new window.google.maps.Marker({ map, position: center })
          )
        )
      }
    }
  }
  const captureScreen = () => {
    return new Promise((resolve, reject) => {
      const scale = 0.5; 
      const domNode =  document.querySelectorAll('[aria-label="Map"]')[0];
      domtoimage.toJpeg(domNode, {
       width: 640,
       height: 480,
       quality: 0.95,
       style: {
        transform: 'scale('+scale+')',
        transformOrigin: 'top left'
      }})
      .then(function(src) {
        // console.log(src)
        resolve(src);
      }).catch(err => {
        reject(err);
      })
    })

  }
  const handleSave = async autoSave => {
    dispatch(setLoading(true && !autoSave));
    let imageSrc = '';
    if (!autoSave) {
      imageSrc = await captureScreen();
    } 
      const items = {
          name: projectInfo.name,
          address: projectInfo.address,
          createdAt: projectInfo.createdAt,
          updatedAt: moment().unix(),
          creator: user.uid,
          shapes,
          center,
          zoom,
          setting
      }
      if (imageSrc !== '') {
        items.imageSrc = imageSrc;
      }
      FirebaseAPI.project
        .save(props.id, items)
        .then(res => {
          if (!autoSave) {
            message.success('Zmiany zostały zapisane.')
          }
          dispatch(setLoading(false))
        })
        .catch(e => {
          console.log(e)
          message.error('An error is occurred while saving data.')
          dispatch(setLoading(false))
        })

  }

  const handleExport = () => {
    domtoimage.toPng(document.querySelectorAll('[aria-label="Map"]')[0])
      .then(function (blob) {
        let link = document.createElement('a');
        link.download = 'download.png';
        link.href = blob;
        link.click();
    });

    // domtoimage.toBlob(document.querySelector("#map_container"))
    //   .then(function (blob) {
    //     const link = window.URL.createObjectURL(blob);
    //     window.location = link
    // });
    // html2canvas(document.querySelector("#map_container")).then(canvas => {
    //   document.body.appendChild(canvas)
    // });


    // html2canvas(document.getElementById('map_container'), {
    //   useCORS: true,
    //   onrendered: function (canvas) {
    //     var img = canvas.toDataURL('image/png')
    //     img = img.replace('data:image/png;base64,', '')
    //     var finalImageSrc = 'data:image/png;base64,' + img
    //     console.log('src', finalImageSrc)
    //     // $('#googlemapbinary').attr('src', finalImageSrc);
    //   }
    // })

    // htmlToImage.toPng(document.getElementById('map_container'))
    //   .then(function (dataUrl) {
    //     console.log(dataUrl);
    //     // download(dataUrl, 'my-node.png');
    //   });
  }

  useInterval(() => {
    handleSave(true)
  }, 30000);

  return (
    <div
      className={classes.root}
      style={{
        backgroundImage: drawingSidebar
          ? 'linear-gradient(90deg, #edf8fe 315px, transparent 315px)'
          : '',
        display: props.display
      }}
    >
      <Button
        className={classes.cameraAddBtn}
        onClick={handleCameraAdd}
        type='primary'
        icon={<img className='mr-10' src={CameraAddPng} alt='' />}
      >
        Dodaj nową kamerę
      </Button>
      <Autocomplete
        onLoad={handleLoad}
        onPlaceChanged={handleChangePlace}
        className='w-full pl-30'
      >
        <Input
          className={classes.addressInp}
          placeholder='Adres'
          value={projectInfo?.address}
          onChange={e => dispatch(setProjectInfo({ ...projectInfo, address: e.target.value }))}
          allowClear
        />
      </Autocomplete>

      <Input
        className={classes.projectNameInp}
        placeholder='Nazwa projektu'
        value={projectInfo?.name}
        onChange={e => dispatch(setProjectInfo({ ...projectInfo, name: e.target.value }))}
      />

      <Button
        className='ml-20'
        type='primary'
        onClick={() => handleSave(false)}
      >
        Zapisz zmiany
      </Button>
      <Button className='ml-20' type='default' onClick={() => handleExport()}>
        Eksportuj
      </Button>
    </div>
  )
}
