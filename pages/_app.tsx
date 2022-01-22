import React from 'react'

import { AppProps } from 'next/app'

import '../public/css/styles.css'

export default function App({ Component, pageProps }: AppProps) {
	return <Component {...pageProps} />
}
