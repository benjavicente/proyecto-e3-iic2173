import '../styles/globals.css'
import type { AppProps } from 'next/app'
import SuperTokensReact from 'supertokens-auth-react'
import { authFrontendConfig } from '../config/authFront'

if (typeof window !== 'undefined') {
  // we only want to call this init function on the frontend, so we check typeof window !== 'undefined'
  SuperTokensReact.init(authFrontendConfig())
}

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
