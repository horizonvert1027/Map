// import { Link } from 'react-router-dom';
import { Button, Col, Image, Form, Input, Checkbox, Row, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';

import { createUseStyles } from 'react-jss'

import Link from 'components/controls/common/Link';
import LogoPng from 'assets/images/logo.png';
import { useNavigate } from 'react-router-dom';

const useStyles = createUseStyles({
  root: {
    paddingTop: 100,
    display: 'flex',
    flexDirection: 'column'
  },
  loginBtn: {
    paddingTop: 0,
    color: "red"
  },
  formItem: {
    margin: 0,
    '& .ant-form-item-label': {
      padding: 0
    }
  },
  formButtons: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    '& button': {
      marginTop: 10,
      marginBottom: 10
    }
  },
  socialBtn: {
    width: '100%',
    marginTop: 10,
    '& img': {
      marginRight: 10
    },
    '&.google': {
      background: '#ECECEC'
    },
    '&.apple': {
      background: '#FFFFFF'
    },
    '&.facebook': {
      background: '#4267B2'
    }
  },
  policy: {
    position: 'absolute',
    width: '100%',
    padding: '1em',
    bottom: 0,
    background: '#edf8fe'
  }
});


const onFinish = () => {

}
const onFinishFailed = () => {

}

export default function AdminLogin(props) {
  const classes = useStyles();
  const navigate = useNavigate();

  return (
    <div className={classes.root}>
      <Row align='center'>
        <Col>
          <Link to='/'>
            <Image src={LogoPng} preview={false} />
          </Link>
        </Col>
      </Row>

      <Row>
        <Col offset={1}>
          <Typography.Title level={4} className='text-primary'>Zaloguj się do panelu administracyjnego</Typography.Title>
          <Typography.Title level={4} className='text-primary mt-5'>aplikacji NAZWA APLIKACJI</Typography.Title>
        </Col>
      </Row>

      <Row align='center'>
        <Col span={12}>
          <Form
            labelCol={{ span: 24 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off" >

            <Form.Item label="E-mail/Login" name="email" className={classes.formItem}>
              <Input type={"email"} suffix={<UserOutlined style={{ color: '#9a9a9a' }} />} />
            </Form.Item>

            <Form.Item label="Hasło" name="password" className={classes.formItem}>
              <Input.Password />
            </Form.Item>

            <Form.Item className={classes.formItem}>
              <Link to='/forgot-password'>Zapomniałem hasła</Link>
            </Form.Item>

            <Form.Item name="remember" valuePropName="checked" className={classes.formItem}>
              <Checkbox>Zapamiętaj mnie</Checkbox>
            </Form.Item>

            <div className={classes.formButtons}>
              <Button type="primary" onClick={() => navigate('/admin/home')}>Zaloguj się</Button>
              <Link to='/register' className='mt-10'>Nie masz konta? Zarejestruj się!</Link>
            </div>
          </Form>
        </Col>
      </Row>
    </div>
  );
};