import React from 'react';
import '../styles/globals.css'
import { Auth0Provider } from '@auth0/auth0-react';

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
