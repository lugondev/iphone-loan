import type {Metadata} from 'next'
import {Geist, Geist_Mono} from 'next/font/google'
import './globals.css'

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
})

export const metadata: Metadata = {
	title: 'iPhone Price Valuation',
	description: 'Calculate iPhone value and payment schedules for device financing',
	keywords: 'iPhone, price valuation, device financing, payment calculator',
	viewport: 'width=device-width, initial-scale=1',
	robots: 'index, follow',
	openGraph: {
		title: 'iPhone Price Valuation',
		description: 'Calculate iPhone value and payment schedules for device financing',
		type: 'website',
	},
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en'>
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
		</html>
	)
}
