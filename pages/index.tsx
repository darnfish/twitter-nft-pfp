import Head from 'next/head'
import Script from 'next/script'

import App from '../components/App'

const TITLE = 'NFT PFP Minter'
const DESCRIPTION = 'Mint your very own NFT PFPs for 0 gwei for use on bird-related platforms'

export default function() {
	return (
		<>
			<Head>
				{/* Meta */}
				<meta charSet='UTF-8' />
				<meta name='description' content={DESCRIPTION} />
				<meta name='keywords' content='nft,pfp,ethereum,twitter nft,nft profile picture,twitter blue' />
				<meta name='viewport' content='width=device-width, initial-scale=1.0' />

				{/* Title */}
				<title>{TITLE}</title>

				{/* Favicons */}
				<link rel='apple-touch-icon' sizes='180x180' href='/apple-touch-icon.png' />
				<link rel='icon' type='image/png' sizes='32x32' href='/favicon-32x32.png' />
				<link rel='icon' type='image/png' sizes='16x16' href='/favicon-16x16.png' />
				<link rel='manifest' href='/site.webmanifest'></link>

				{/* Tracking */}
				<Script
					src="https://www.googletagmanager.com/gtag/js?id=G-SDCV5ZL7WP"
					strategy="afterInteractive"
				/>
				<Script id="google-analytics" strategy="afterInteractive">
					{`
						window.dataLayer = window.dataLayer || [];
						function gtag(){window.dataLayer.push(arguments);}
						gtag('js', new Date());

						gtag('config', 'G-SDCV5ZL7WP');
					`}
				</Script>
			</Head>
			<div className='absolute w-full h-full flex place-content-center'>
				<App />
			</div>
		</>
	)
}
