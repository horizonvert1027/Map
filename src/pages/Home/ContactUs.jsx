import React, { } from 'react';
import { Button, Col, Form, Input, Row, Typography } from 'antd';
import { createUseStyles } from 'react-jss';
import TextArea from 'antd/lib/input/TextArea';

const useStyles = createUseStyles((theme) => ({
  root: {
    padding: 15,
    '& .ant-form-item-label': {
      padding: 0
    },
    '& .ant-form-item': {
      margin: 0
    }
  },
}));

export default function ContactUs() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography.Title level={4}>Kontakt</Typography.Title>
      <Row>
        <Col span={15} offset={1}>
          <Typography>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Typography>

          <Form labelCol={{ span: 24 }} className='mt-20'>
            <Form.Item label="Adres e-mail" name="aad" >
              <Input type='email' />
            </Form.Item>

            <Form.Item label="Opis" name="few" >
              <TextArea rows={10} />
            </Form.Item>

            <div className='d-flex d-between mt-15'>
              <Button type='default'>Wróć</Button>
              <Button type='primary'>Wyślij</Button>
            </div>
          </Form>
        </Col>
      </Row>
    </div>

    // <Box className={classes.root} p={2} >
    //   <Typography variant="h5">Kontakt</Typography>
    //   <Grid container justifyContent="center">
    //     <Grid item md={7} style={{ paddingTop: 50 }}>
    //       <Typography>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Typography>
    //       <TextField label='Adres e-mail' name='address' onChange={handleChange} value={data['address']} variant='outlined' margin='normal' size='small' fullWidth />
    //       <TextField label='Opis' name='description' onChange={handleChange} value={data['description']} variant='outlined' margin='normal' size='small' fullWidth multiline rows={10} />
    //       <Box mt={2} display="flex" justifyContent="space-between">
    //         <Button variant="contained" >Wróć</Button>
    //         <Button variant="contained" color="primary">Wyślij</Button>
    //       </Box>
    //     </Grid>
    //   </Grid>
    // </Box>
  );
};