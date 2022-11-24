/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Breadcrumb, Button, Checkbox, Col, Divider, Form, Input, message, Row, Select, Typography, Upload } from 'antd';
import MaskedInput from "antd-mask-input";
import { createUseStyles } from 'react-jss';
import CameraPng from 'assets/images/camera-icon.png';
import MembershipPanel from 'components/panels/MembershipPanel';
import { Countries, Languages } from 'constants/Constants';
import FirebaseAPI from 'api/FirebaseAPI';
import useAuth from 'hooks/auth';
import { useDispatch } from 'react-redux';
import { setLoading } from 'redux/actions/layout';
import { getBase64 } from 'utils/common';
import { setUser } from 'redux/actions/user';
import { usePrompt } from 'hooks/prompt';

const useStyles = createUseStyles((theme) => ({
  root: {
    '& .ant-form-item-label': {
      padding: 0
    },
    '& .ant-form-item': {
      margin: 0
    }
  },
  uploader: {
    '& .ant-upload-select-picture-card': {
      borderRadius: '50%',
      marginLeft: 15,
      marginBottom: 0,
      maxWidth: '100px',
      maxHeight: '100px',
      overflow: 'hidden',
    }
  }
}));

export default function Profile() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { user, signOut } = useAuth();
  const [form] = Form.useForm();

  const [panelVisible, setPanelVisible] = useState(false);
  const [country, setCountry] = useState('PL');
  const [avatar, setAvatar] = useState();
  const [saved, setSaved] = useState(true);

  usePrompt("Czy na pewno chcesz opuścić stronę bez zapisywania?", !saved);

  const handleSave = v => {
    dispatch(setLoading(true));
    FirebaseAPI.user.update(user.uid, { ...v, avatar }).then(res => {
      dispatch(setUser({ ...user, avatar }));
      message.success('Zmiany zostały zapisane.');
      setSaved(true);
      dispatch(setLoading(false));
    }).catch(e => {
      message.error('An error is occurred while updating your profile.');
      console.log(e);
      dispatch(setLoading(false));
    });
  }

  const handleDeleteUser = () => {
    if (window.confirm('Are you sure want to delete your account?')) {
      dispatch(setLoading(true));
      FirebaseAPI.user.delete(user.uid).then(res => {
        message.success('Your account has been removed from this website.');
        dispatch(setLoading(false));
        signOut();
      }).catch(e => {
        console.log(e);
        message.error('An error has been occurred while deleting account.');
        dispatch(setLoading(false));
      })
    }
  }

  useEffect(() => {
    dispatch(setLoading(true));
    FirebaseAPI.user.get(user.uid).then(res => {
      setCountry(res.country);
      setAvatar(res.avatar);
      form.setFieldsValue(res);
      setSaved(true);
      dispatch(setLoading(false));
    }).catch(e => {
      dispatch(setLoading(false));
      message.error('An error has been occurred while loading user information.');
    });
  }, []);

  return (
    <Row className={classes.root}>
      <Col span={14} style={{ backgroundColor: 'white' }}>
        <div className="p-15">
          <Breadcrumb className='mb-20'>
            <Breadcrumb.Item>Twoje konto</Breadcrumb.Item>
          </Breadcrumb>

          <Form form={form}
            labelCol={{ span: 24 }}
            initialValues={{
              name: "",
              email: "",
              username: "",
              country: "",
              language: "",
              account_type: "",
              business_phone: "",
              city: "",
              company_logo: "",
              company_email: "",
              company_name: "",
              password1: "",
              password2: "",
              password3: "",
              personal_phone: "",
              state: "",
              tax_number: "",
              zip_code: "",
            }}
            onValuesChange={() => { setSaved(false) }}
            onInput={v => console.log(v)}
            onFinish={handleSave}
          >
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <div style={{ flexGrow: 1 }}>
                <Form.Item label="Imię" name="name" rules={[{ required: true, message: 'Please input name!' }]}>
                  <Input placeholder="Jan" />
                </Form.Item>
                <Form.Item label="Nazwisko" name="username" rules={[{ required: true, message: 'Please input username!' }]}>
                  <Input placeholder="Kowalski" />
                </Form.Item>
              </div>
              <div className={classes.uploader}>
                <Upload
                  name="avatar"
                  listType="picture-card"
                  showUploadList={false}
                  action={false}
                  beforeUpload={async file => {
                    const src = await getBase64(file);
                    setAvatar(src);
                    return false;
                  }}
                >
                  {avatar
                    ? <img src={avatar} className='w-full h-full border-rounded' alt="" />
                    : <img src={CameraPng} alt="" />
                  }
                </Upload>
              </div>
            </div>

            {/* <Form.Item label="Zdjęcie/Logo Firmy" name="company_logo">
              <Input.Group compact>
                <Input style={{ width: 'calc(100% - 150px)' }} placeholder="Wybierz plik z dysku" />
                <Button type="primary" style={{ width: 150 }}>Wybierz plik</Button>
              </Input.Group>
            </Form.Item> */}

            <Divider />

            <Form.Item label="Państwo" name="country" rules={[{ required: true, message: 'Please input country!' }]}>
              <Select showSearch
                placeholder="Choose your country."
                filterOption={(a, b) => b.children.toLowerCase().includes(a.toLowerCase())}
                onChange={v => setCountry(v)}
              >
                {Countries.map(country =>
                  <Select.Option value={country.countryShortCode} key={country.countryShortCode}>{country.countryName}</Select.Option>
                )}
              </Select>
            </Form.Item>

            <Form.Item label="Język" name="language" rules={[{ required: true, message: 'Please input language!' }]}>
              <Select placeholder="Choose language." >
                {Languages.map(lang =>
                  <Select.Option value={lang.code} key={lang.code}>{lang.name}</Select.Option>
                )}
              </Select>
            </Form.Item>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item label="Województwo" name="state">
                  <Select showSearch filterOption={(a, b) => b.children.toLowerCase().includes(a.toLowerCase())}>
                    {
                      Countries.find(c => c.countryShortCode === country).regions.map(region =>
                        <Select.Option value={region.shortCode} key={region.shortCode}>{region.name}</Select.Option>
                      )
                    }
                  </Select>
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item label="Miasto" name="city" >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Kod pocztowy" name="zip_code" >
                  <MaskedInput mask={country === 'PL' ? '00-000' : String} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Telefon kontaktowy" name="personal_phone" >
                  <MaskedInput mask={country === 'PL' ? '{+48}-000-000-000' : Number} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Telefon służbowy" name="business_phone" >
                  <MaskedInput mask={country === 'PL' ? '{+48}-000-000-000' : Number} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Typ konta" name="account_type" >
                  <Select>
                    <Select.Option value="1">konto firmowe</Select.Option>
                    <Select.Option value="2">konto osobiste</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Nazwa firmy" name="company_name" >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="NIP Firmy" name="tax_number" >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Adres e-mail firmy" name="company_email" >
                  <Input type="email" />
                </Form.Item>
              </Col>
            </Row>

            <Divider />

            <Form.Item label="Adres e-mail" name="email" >
              <Input type="email" />
            </Form.Item>

            <Form.Item label="Zmiana hasła - podaj obecne hasło" name="password1" >
              <Input.Password autoComplete='off' />
            </Form.Item>

            <Form.Item label="Podaj nowe hasło" name="password2" >
              <Input.Password autoComplete='off' />
            </Form.Item>

            <Form.Item label="Powtórz nowe hasło" name="password3" >
              <Input.Password autoComplete='off' />
            </Form.Item>

            <Divider />

            <Form.Item label="Preferencje eksportowanych projektów">
              <Checkbox className='ml-20'>Pokaż nazwę firmy</Checkbox><br />
              <Checkbox className='ml-20'>Pokaż logo firmy</Checkbox><br />
              <Checkbox className='ml-20'>Pokaż imię i nazwisko</Checkbox><br />
              <Checkbox className='ml-20'>Pokaż numer telefonu</Checkbox>
            </Form.Item>

            <div className='d-flex d-between mt-15'>
              <Button type='default' onClick={handleDeleteUser}>Usuń konto</Button>
              <Button type='primary' htmlType="submit" disabled={saved}>Zaktualizuj informacje</Button>
            </div>
          </Form>
        </div>
      </Col>
      <Col span={10}>
        <div className="p-15">
          {!panelVisible &&
            <>
              <Typography.Title level={5}>Płatności</Typography.Title>
              <Typography className='text-primary text-center font-18 mt-20'>Twój abonament jest ważny jeszcze przez</Typography>
              <Typography.Title className='m-0 text-primary text-center mt-20' level={2}>112 dni</Typography.Title>
              <Typography style={{ marginTop: 50 }}>Twój wybór</Typography>
              <Typography className='text-primary mt-20'>Pakiet Premium</Typography>
              <Typography.Title level={5}>Lorem ipsum dolor sit amet</Typography.Title>
              <Typography>Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</Typography>
              <Typography>Lorem ipsum dolor sit amet consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</Typography>
              <div className='d-auto mt-20'>
                <Button type="link" onClick={() => setPanelVisible(true)}>Zobacz inne pakiety</Button>
              </div>
            </>
          }
          {panelVisible &&
            <>
              <Typography.Title level={5}>Pakiety</Typography.Title>
              <Typography className='text-primary text-center font-18'>Aktualnie korzystasz z <span className='font-bold'>bezpłatnej wersji testowej</span></Typography>
              <Typography className='text-primary text-center font-18'>Z obecnej wersji możesz korzystać jeszcze przez</Typography>
              <Typography.Title className='m-0 text-primary text-center' level={2}>7 dni</Typography.Title>

              <Typography>Zapoznaj się z naszymi pakietami</Typography>
              <MembershipPanel />
            </>
          }
        </div>
      </Col>
    </Row>
  );
};