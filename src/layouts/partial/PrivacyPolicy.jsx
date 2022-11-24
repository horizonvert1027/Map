import React from 'react';
import Link from '../../components/controls/common/Link';


export default function PrivacyPolicy(props) {
  return (
    <>
      <p>
        Przesyłając niniejszy formularz zgadzasz się na
        <Link to="privacy-policy"> Warunki korzystania z usługi</Link>.
        Aby uzyskać więcej informacji o polityce prywatności dotyczącej przetwarzania danych osobowych, kliknij tutaj:
        <Link to="privacy-policy"> Polityka cookies </Link>
        i
        <Link to="privacy-policy"> Polityka prywatności </Link>
        lub skontaktuj się z nami na
        <Link to="privacy-policy"> mail@mail.pl</Link>.
      </p>
    </>
  );
};