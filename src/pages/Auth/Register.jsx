import { useState } from 'react';
import { Button, Col, Image, Form, Input, Select, Row, Checkbox, message, Radio } from 'antd';
import { createUseStyles } from 'react-jss'
import Link from 'components/controls/common/Link';
import LogoPng from 'assets/images/logo.png';
import PrivacyPolicy from 'layouts/partial/PrivacyPolicy';
import NodeAPI from 'api/NodeAPI';
import FirebaseAPI from 'api/FirebaseAPI';
import { useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword, } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { setLoading } from 'redux/actions/layout';
import { Countries } from 'constants/Constants';

const auth = getAuth();

const useStyles = createUseStyles({
  root: {
    paddingTop: 100,
    display: 'flex',
    flexDirection: 'column'
  },
  policy: {
    position: 'absolute',
    width: '100%',
    padding: '1em',
    bottom: 0,
    background: '#edf8fe'
  }
});

export default function Register(props) {
  const classes = useStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('romandevshev@gmail.com');
  const [profileEdit, setProfileEdit] = useState(false);
  const [codeSent, setCodeSent] = useState(false);

  const handleSendCode = email => {
    dispatch(setLoading(true));
    FirebaseAPI.auth.checkUserRegistered(email).then(res => {
      if (res) {
        message.error('The email is already exists.');
      } else {
        NodeAPI.sendVerificationCode({ to: email });
        setCodeSent(true);
        setEmail(email);
      }
      dispatch(setLoading(false));
    }).catch(e => {
      console.log(e);
      dispatch(setLoading(false));
    })
  }

  const handleConfirmCode = code => {
    dispatch(setLoading(true));
    FirebaseAPI.auth.checkVerificationCode(email, code).then(res => {
      if (res) {
        setProfileEdit(true);
      } else {
        message.error('The code is invalid.');
      }
      dispatch(setLoading(false));
    }).catch(e => {
      console.log(e);
      dispatch(setLoading(false));
    });
  }

  const handleRegister = v => {
    if (v.password !== v.password1) {
      message.error('The passwords are not match!');
      return;
    }
    if (!v.accept) {
      message.error('Please accept terms and condition!');
      return;
    }

    dispatch(setLoading(true));
    createUserWithEmailAndPassword(auth, email, v.password).then(res => {
      FirebaseAPI.auth.register(res.user.uid, { ...v, email }).then(r => {
        message.success('The user has been registered successfully!');
        dispatch(setLoading(false));
        navigate(`/login`);
      });
    }).catch(e => {
      switch (e.code) {
        case 'auth/email-already-in-use':
          message.error(`Email address already in use.`);
          break;
        case 'auth/invalid-email':
          message.error(`Email address is invalid.`);
          break;
        case 'auth/operation-not-allowed':
          message.error(`Error during sign up.`);
          break;
        case 'auth/weak-password':
          message.error('Password is not strong enough. Add additional characters including special characters and numbers.');
          break;
        default:
          message.error(e.message);
          break;
      }
      dispatch(setLoading(false));
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
          <p>Zarejestruj się</p>
          <h2>Podaj swoje dane i twórz własne projekty!</h2>
        </Col>
      </Row>

      <Row align='center'>
        {!profileEdit &&
          <Col span={12}>
            <Form
              labelCol={{ span: 24 }}
              initialValues={{}}
              onFinish={v => handleSendCode(v.email)}
              autoComplete="off" >

              <Form.Item label="E-mail" name="email" rules={[{ required: true, message: 'Please input email!' }]}>
                <Input type="email" />
              </Form.Item>

              {!codeSent &&
                <div className='d-auto d-column mt-15'>
                  <Button type="primary" htmlType="submit">Wyślij kod weryfikacyjny</Button>
                </div>
              }
            </Form>

            {codeSent &&
              <Form
                labelCol={{ span: 24 }}
                initialValues={{}}
                onFinish={v => handleConfirmCode(v.code)}
                autoComplete="off" >

                <Form.Item label="Kod weryfikacyjny" name="code" rules={[{ required: true, message: 'Please input code!' }]}>
                  <Input />
                </Form.Item>

                {codeSent &&
                  <div className='d-auto d-column mt-15'>
                    <Button type="primary" htmlType="submit">Zweryfikuj kod</Button>
                  </div>
                }
              </Form>
            }
          </Col>
        }

        {profileEdit &&
          <Col span={22}>
            <Form
              labelCol={{ span: 24 }}
              initialValues={{
                password: '',
                password1: '',
                username: '',
                name: '',
                country: 'PL',
                inform: false,
                accept: true,
              }}
              onFinish={handleRegister}
              autoComplete="off">

              <Form.Item label="Hasło" name="password" rules={[{ required: true, message: 'Please input password.' }]}>
                <Input.Password autoComplete="" />
              </Form.Item>

              <Form.Item label="Potwierdź hasło" name="password1" rules={[{ required: true, message: 'Please input password again.' }]}>
                <Input.Password autoComplete="" />
              </Form.Item>

              <Form.Item label="Imię" name="username" rules={[{ required: true, message: 'Please input username.' }]}>
                <Input />
              </Form.Item>

              <Form.Item label="Nazwisko" name="name" rules={[{ required: true, message: 'Please input your name.' }]}>
                <Input />
              </Form.Item>

              <Form.Item label="Kraj/Region" name="country" rules={[{ required: true, message: 'Please select the country.' }]}>
                <Select placeholder="Choose your country." showSearch >
                  {Countries.map(country =>
                    <Select.Option value={country.countryShortCode} key={country.countryShortCode}>{country.countryName}</Select.Option>
                  )}
                </Select>
              </Form.Item>

              <h4>Preferencje komunikacji marketingowej</h4>
              <p className='mb-0'>Od czasu do czasu możemy skontaktować się z Tobą w sprawie naszych produktów i usług,
                a także innych treści, które mogą Cię zainteresować</p>

              <Form.Item name="inform">
                <Radio.Group optionType="button" className='mb-5'>
                  <Radio value={true}>TAK</Radio>
                  <Radio value={false}>NIE</Radio>
                </Radio.Group>
              </Form.Item>

              <PrivacyPolicy />

              <Form.Item name="accept" valuePropName="checked">
                <Checkbox>Zaakceptuj <Link to="#">Regulamin</Link></Checkbox>
              </Form.Item>

              <div className='d-flex d-between pt-10 pb-20'>
                <Button type="default" onClick={() => { setProfileEdit(false); setCodeSent(false) }}>Wstecz</Button>
                <Button type="primary" htmlType="submit">Utwórz konto</Button>
              </div>
            </Form>
          </Col>
        }
      </Row>

      {!profileEdit && <div className={classes.policy}>
        <PrivacyPolicy />
      </div>}
    </div>
  );
};