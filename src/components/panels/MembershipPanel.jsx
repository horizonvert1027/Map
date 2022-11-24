import React from 'react';
import { createUseStyles } from 'react-jss';
import { Button, Col, Row, Typography } from 'antd';

import YesIcon from 'assets/images/yes.svg';
import NoIcon from 'assets/images/no.svg';

const useStyles = createUseStyles((theme) => ({
  root: {

  },
  plan: {
    border: '1px solid #767676',
    height: '100%',
    position: 'relative',
    paddingTop: 20,
    paddingBottom: 70,
    borderRadius: 5
  },
  planHeader: {
    width: '70%',
    padding: 10,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5
  },
  headerTxt: {
    color: 'red',
    textAlign: 'center',
    marginTop: 15
  },
  buyBtn: {
    color: 'white',
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    padding: 10,
    position: 'absolute',
    right: 0,
    bottom: 20,
    border: 'none',
    height: 50,
    '&:hover,&:focus,&:active': {
      color: 'white'
    }
  },
}));

export default function MembershipPanel() {
  const classes = useStyles();
  const plans = [
    {
      name: 'STANDARD', price: 5, color: '#11ADD6', items: [
        { feature: 'Do 30 projektów', useable: true },
        { feature: 'Archiwizacja do 6 miesięcy', useable: true },
        { feature: 'Płatne Maps Google', useable: true },
        { feature: 'Pamięć na pliki do 50MB', useable: true },
        { feature: 'Brak płatnych Maps Google 3D', useable: false },
        { feature: 'Dokumenty bez Twojego LOGO', useable: false },
        { feature: 'Brak możliwości udostępniania projektu w formie linku do platformy', useable: false },
        { feature: 'Brak dedykowanego opiekuna', useable: false },
        { feature: 'Brak pomocy LIVE', useable: false },
        { feature: 'Brak szkoleń', useable: false }
      ]
    }, {
      name: 'PREMIUM', price: 7, color: '#D262D0', items: [
        { feature: 'Nielimitowana liczba projektów', useable: true },
        { feature: 'Archiwizacja do 24 miesięcy', useable: true },
        { feature: 'Płatne Maps Google', useable: true },
        { feature: 'Płatne Maps Google 3D', useable: true },
        { feature: 'Pamięć na pliki – 1GB ', useable: true },
        { feature: 'Personalizowane dokumenty z Twoim LOGO', useable: true },
        { feature: 'Możliwość udostępniania projektu w formie linku do platformy', useable: true },
        { feature: 'Brak dedykowanego opiekuna', useable: false },
        { feature: 'Brak pomocy LIVE', useable: false },
        { feature: 'Brak szkoleń', useable: false },
      ]
    }, {
      name: 'BUSINESS', price: 80, color: '#FFA415', items: [
        { feature: 'Od 10 użytkowników', useable: true },
        { feature: 'Nielimitowana liczba projektów', useable: true },
        { feature: 'Archiwizacja bez limitu', useable: true },
        { feature: 'Płatne Maps Google', useable: true },
        { feature: 'Płatne Maps Google 3D', useable: true },
        { feature: 'Pamięć na pliki - Bez limitu ', useable: true },
        { feature: 'Personalizowane dokumenty z firmowym LOGO', useable: true },
        { feature: 'Dedykowany opiekun', useable: true },
        { feature: 'Pomoc LIVE', useable: true },
        { feature: 'Cała personalizowana platforma z logiem firmy', useable: true },
        { feature: 'Bezpłatne szkolenie online', useable: true },
      ]
    }
  ];

  return (
    <div className={classes.root}>
      <Row gutter={8}>
        {plans.map((plan, index) => {
          return <Col span={8} key={index}>
            <div className={classes.plan}>
              <div className={classes.planHeader} style={{ background: plan.color }}>
                <Typography className='text-white'>{plan.name}</Typography>
                <Typography className='text-white'>{plan.price} EURO/miesiąc</Typography>
              </div>
              <div>
                {plan.items.map((item, ind) => {
                  return <div className='d-flex d-top p-5' key={ind}>
                    <img src={item.useable ? YesIcon : NoIcon} alt="" style={{ width: 10, height: 10, marginTop: 5, marginRight: 5 }} />
                    <Typography>{item.feature}</Typography>
                  </div>
                })}
              </div>
              <Button className={classes.buyBtn} style={{ background: plan.color }}>SPRAWDŹ</Button>
            </div>
          </Col>
        })}
      </Row>
    </div>
  );
};