// import { Link } from 'react-router-dom';
import { Button, Col, Image, Form, Input, Checkbox, Row, Typography, } from 'antd';
import { UserOutlined } from '@ant-design/icons';

import { getAuth, signInWithPopup, signInWithRedirect, GoogleAuthProvider } from 'firebase/auth';

import { createUseStyles } from 'react-jss'

import Link from 'components/controls/common/Link';
import LogoPng from 'assets/images/logo.png';
import ApplePng from 'assets/images/social-apple.png';
import GooglePng from 'assets/images/social-google.png';
import FacebookPng from 'assets/images/social-facebook.png';
import PrivacyPolicy from 'layouts/partial/PrivacyPolicy';
import { useNavigate } from 'react-router-dom';
import useAuth from 'hooks/auth';
import { useDispatch } from 'react-redux';
import { setLoading } from 'redux/actions/layout';

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

export default function Login(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const onFinish = data => {
    dispatch(setLoading(true));
    signIn(data).then(res => {
      dispatch(setLoading(false));
      navigate('/dashboard');
    });
  };

  const onFinishFailed = (errorInfo) => {
    // console.log('Failed:', errorInfo);
  };

  const onGoogleLogin = () => {
    // const auth = getAuth();
    // const provider = new auth.GoogleAuthProvider();
    // return auth().signInWithPopup(provider);
    const auth = getAuth();
    const googleProvider = new GoogleAuthProvider();
    // googleProvider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    console.log('onGoogleLogin')
    signInWithRedirect(auth, googleProvider)
      .then((result) => {
        console.log(result)
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        console.log(token, user);
        // ...
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  }

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
          <Typography className='text-primary'>Witaj w Aplikacji!</Typography>
          <Typography.Title level={4} className='text-primary'>Zaloguj się i twórz własne projekty</Typography.Title>
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

            <Form.Item label="E-mail/Login" name="email" rules={[{ required: true, message: 'Please input email!' }]}>
              <Input type={"email"} suffix={<UserOutlined style={{ color: '#9a9a9a' }} />} autoComplete='username' />
            </Form.Item>

            <Form.Item label="Hasło" name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
              <Input.Password autoComplete='current-password' />
            </Form.Item>

            <Form.Item>
              <Link to='/forgot-password'>Zapomniałem hasła</Link>
            </Form.Item>

            <Form.Item name="remember" valuePropName="checked">
              <Checkbox>Zapamiętaj mnie</Checkbox>
            </Form.Item>

            <div className='d-auto d-column p-15'>
              <Button type="primary" htmlType="submit">Zaloguj się</Button>
              <Link to='/register' className='mt-10'>Nie masz konta? Zarejestruj się!</Link>
            </div>
          </Form>
        </Col>
      </Row>

      <Row align='center' style={{ marginTop: 20 }}>
        <Col span={12}>
          <Typography>Zaloguj się za pomocą:</Typography>
        </Col>
      </Row>

      <Row align='center'>
        <Col span={8}>
            <Button className={`${classes.socialBtn} facebook`} onClick={onGoogleLogin} icon={<img src={FacebookPng} alt="social" />}>Facebook</Button>
            <Button className={`${classes.socialBtn} google`} icon={<img src={GooglePng} alt="social" />}>Google</Button>
            <Button className={`${classes.socialBtn} apple`} icon={<img src={ApplePng} alt="social" />}>Apple</Button>
        </Col>
      </Row>

      <div className={classes.policy}>
        <PrivacyPolicy />
      </div>
    </div>
  );
};
          // <LoginSocialFacebook
          //   appId={process.env.REACT_APP_APP_ID || ""}
          //   onResolve={({ provider, data }) => {
          //     console.log("data", data);
          //   }}
          //   onReject={(err) => {
          //     console.log(err);
          //   }}
          // >
          // </LoginSocialFacebook>        
          // <AppleSignin
          //   authOptions={{
          //     clientId: process.env.REACT_APP_CLIENT_ID || "",
          //     scope: "email name",
          //     redirectURI: "https://plancam.nfinity.pl",
          //     state: "",
          //     usePopup: true
          //   }}
          //   onSuccess={(res) => console.log(res)}
          //   onError={(error) => console.log(error)}
          // >
          // </AppleSignin>          