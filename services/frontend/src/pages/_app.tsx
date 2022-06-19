import { Auth0Provider } from '@auth0/auth0-react';
import '../styles/globals.css';
import App from 'next/app';

class MyApp extends App {
  render () {
    const { Component, pageProps } = this.props;
    return (
      <Auth0Provider
        domain='dev-7c2520d3.us.auth0.com'
        clientId='sPhRhOKQW2cAkfimnKphjXAYSm18eOFa'
        audience="https://PingTocAuth.com"
        scope='openid profile email'
        redirectUri='https://localhost/postLogin'
      >
        <Component {...pageProps} />
      </Auth0Provider>
    );
  }
}

export default MyApp;

/*
export default function App({ Component, pageProps }) {
  return (
    <Auth0Provider
      domain="dev-7c2520d3.us.auth0.com"
      clientId="sPhRhOKQW2cAkfimnKphjXAYSm18eOFa"
      redirectUri="https://localhost/postLogin"
    >
      <Component {...pageProps} />
    </Auth0Provider>
  );
}
*/