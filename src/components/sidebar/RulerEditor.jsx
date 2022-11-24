/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPathDistance } from 'utils/cameras';
import { formatDec } from 'utils/common';
import { createUseStyles } from 'react-jss';
import { Button, Form, InputNumber } from 'antd';
import { setDeletedId } from 'redux/actions/drawing';

const useStyles = createUseStyles((theme) => ({
  root: {
    paddingLeft: 15,
    paddingRight: 15
  },
  nameRow: {
    marginBottom: 10,
    '& .ant-form-item-control-input-content': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }
}));

export default function RulerEditor() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [distance, setDistance] = useState(0);

  const data = useSelector(state => state.drawing.shapes).find(v => v.type === 'ruler');
  const { measurement } = useSelector(state => state.map);

  const handleCancel = () => {
    dispatch(setDeletedId(data?.id));
  }

  useEffect(() => {
    setDistance(measurement > 0 ? measurement : getPathDistance(data?.path));
  }, [data, measurement]);

  return (
    <div className={classes.root}>
      <Form labelCol={{ span: 24 }} autoComplete="off">
        {/* <div className={classes.nameRow}>
          <Form.Item label="Nazwa linijka">
            <Input name='name' readOnly />
            <Fitter />
            <Locker />
          </Form.Item>
        </div> */}

        <Form.Item label="dystans">
          <InputNumber name='paths' readOnly type='number' value={formatDec(distance)} addonAfter="m" className='w-full' />
        </Form.Item>

        <Button className='mt-20' type='primary' block danger disabled={!distance} onClick={handleCancel}>Cancel</Button>
      </Form>
    </div>
  );
}