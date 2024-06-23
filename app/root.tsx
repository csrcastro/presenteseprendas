import {
	json,
	type LoaderFunctionArgs,
	type HeadersFunction,
	type LinksFunction,
	type MetaFunction,
} from '@remix-run/node'
import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useLoaderData,
	useLocation,
} from '@remix-run/react'
import { withSentry } from '@sentry/remix'
import { getStoryblokApi } from '@storyblok/react'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { Suspense, lazy } from 'react'
import { HoneypotProvider } from 'remix-utils/honeypot/react'
import { GeneralErrorBoundary } from './components/error-boundary.tsx'
import { useToast } from './components/toaster.tsx'
import montserrat from './fonts/montserrat.woff2'
import { useIsBot } from './is-bot.context'
import { Layout } from './layout'
import { getCv } from './models/contentCacheVersion.server.ts'
import sprite from './sprites/sprite.svg?url'
import tailwindStyleSheetUrl from './styles/tailwind.css?url'
import { getUserId, logout } from './utils/auth.server.ts'
import { ClientHintCheck, getHints } from './utils/client-hints.tsx'
import { prisma } from './utils/db.server.ts'
import { getEnv } from './utils/env.server.ts'
import { honeypot } from './utils/honeypot.server.ts'
import { combineHeaders, getDomainUrl } from './utils/misc.tsx'
import { useNonce } from './utils/nonce-provider.ts'
import { type Theme, getTheme } from './utils/theme.server.ts'
import { makeTimings, time } from './utils/timing.server.ts'
import { getToast } from './utils/toast.server.ts'
import 'dayjs/locale/pt'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.locale('pt')

const UnexpectedError = lazy(
	() => import('#app/components/Errors/Unexpected.tsx'),
)

export const links: LinksFunction = () => {
	return [
		{
			rel: 'preload',
			href: montserrat,
			as: 'font',
			type: 'font/woff2',
			crossOrigin: 'anonymous',
			fetchpriority: 'high',
		} as const,
		{
			rel: 'preload',
			href: tailwindStyleSheetUrl,
			as: 'style',
			fetchpriority: 'high',
		},
		{
			rel: 'preload',
			href: sprite,
			as: 'image',
			type: 'image/svg+xml',
			fetchpriority: 'high',
		},
		{ rel: 'stylesheet', href: tailwindStyleSheetUrl },
		{
			rel: 'preconnect',
			href: '//a.storyblok.com',
		},
		{
			rel: 'dns-prefetch',
			href: '//a.storyblok.com',
		},
		{
			rel: 'icon',
			href: '/favicon-32x32.png',
			type: 'image/png',
			fetchpriority: 'low',
		},
		{
			rel: 'icon',
			href: '/favicon-16x16.png',
			type: 'image/png',
			fetchpriority: 'low',
		},
		{
			rel: 'icon',
			href: '/favicon.png',
			type: 'image/png',
			fetchpriority: 'low',
		},
		{
			rel: 'apple-touch-icon',
			href: '/apple-touch-icon.png',
			sizes: '180x180',
			type: 'image/png',
		},
		{
			rel: 'manifest',
			href: '/site.webmanifest',
			fetchpriority: 'low',
			crossOrigin: 'use-credentials',
		} as const,
		{
			rel: 'mask-icon',
			href: '/safari-pinned-tab.svg',
			color: '#ff5c35',
			type: 'image/svg+xml',
		},
		{
			rel: 'shortcut icon',
			href: '/favicon.svg',
			type: 'image/svg+xml',
			fetchpriority: 'low',
		},
	].filter(Boolean)
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	return [
		{ title: data ? 'Presentes e Prendas' : 'Erro Pensentes e Prendas' },
		{ name: 'description', content: `Descrição por defeito` },
	]
}

export async function loader({ request }: LoaderFunctionArgs) {
	const timings = makeTimings('root loader')
	const userId = await time(() => getUserId(request), {
		timings,
		type: 'getUserId',
		desc: 'getUserId in root',
	})

	const user = userId
		? await time(
				() =>
					prisma.user.findUniqueOrThrow({
						select: {
							id: true,
							name: true,
							username: true,
							image: { select: { id: true } },
							roles: {
								select: {
									name: true,
									permissions: {
										select: { entity: true, action: true, access: true },
									},
								},
							},
						},
						where: { id: userId },
					}),
				{ timings, type: 'find user', desc: 'find user in root' },
			)
		: null
	if (userId && !user) {
		console.info('something weird happened')
		// something weird happened... The user is authenticated but we can't find
		// them in the database. Maybe they were deleted? Let's log them out.
		await logout({ request, redirectTo: '/' })
	}
	const { toast, headers: toastHeaders } = await getToast(request)
	const honeyProps = honeypot.getInputProps()

	const ENV = getEnv()

	ENV.CV = await getCv()

	const { data } = await getStoryblokApi().get(
		`cdn/stories/layout/header-navigation`,
		{
			version: ENV.STORYBLOK_EXPLORE,
		},
	)

	return json(
		{
			user,
			requestInfo: {
				hints: getHints(request),
				origin: getDomainUrl(request),
				path: new URL(request.url).pathname,
				userPrefs: {
					theme: getTheme(request),
				},
			},
			ENV,
			toast,
			honeyProps,
			headerNavigation: data?.story,
		},
		{
			headers: combineHeaders(
				{ 'Server-Timing': timings.toString() },
				toastHeaders,
			),
		},
	)
}

export const headers: HeadersFunction = ({ loaderHeaders }) => {
	const headers = {
		'Server-Timing': loaderHeaders.get('Server-Timing') ?? '',
	}
	return headers
}

function Document({
	children,
	nonce,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	theme = 'light',
	env = {},
	allowIndexing = true,
}: {
	children: React.ReactNode
	nonce: string
	theme?: Theme
	env?: Record<string, string | number>
	allowIndexing?: boolean
}) {
	let isBot = useIsBot()

	return (
		<html lang="pt">
			<head>
				<meta charSet="utf-8" />
				<ClientHintCheck nonce={nonce} />
				<Meta />
				<meta name="viewport" content="width=device-width,initial-scale=1" />
				<meta content="#fcf7f4" name="theme-color" />
				{allowIndexing ? null : (
					<meta name="robots" content="noindex, nofollow" />
				)}
				<Links />
				<style
					dangerouslySetInnerHTML={{
						__html: `@font-face{font-display:block;font-family:Montserrat;font-style:normal;font-weight:900;src:url('${montserrat}') format("woff2")}`,
					}}
				/>
			</head>
			<body className="bg-background">
				{children}
				<script
					nonce={nonce}
					dangerouslySetInnerHTML={{
						__html: `window.ENV = ${JSON.stringify(env)}`,
					}}
				/>
				{isBot ? null : (
					<>
						<ScrollRestoration nonce={nonce} />
						<Scripts nonce={nonce} />
						<script
							nonce={nonce}
							dangerouslySetInnerHTML={{
								__html: `window.onload = function (){
								if(window.location.hostname === "presenteseprendas.pt" ){
									setTimeout(function(){
									var z=document.createElement('script');
									z.type='text/javascript';
									z.src='/cdn-cgi/zaraz/i.js';
									document.getElementsByTagName('head')[0].appendChild(z)
									},500);
								}
								}`,
							}}
						/>
					</>
				)}
			</body>
		</html>
	)
}

function App() {
	const data = useLoaderData<typeof loader>()
	const nonce = useNonce()
	const theme = 'light'
	const allowIndexing = data.ENV.ALLOW_INDEXING !== 'false'
	useToast(data.toast)

	return (
		<Document
			nonce={nonce}
			theme={theme}
			allowIndexing={allowIndexing}
			env={data.ENV}
		>
			<Layout>
				<Outlet />
			</Layout>
		</Document>
	)
}

function AppWithProviders() {
	const data = useLoaderData<typeof loader>()
	return (
		<HoneypotProvider {...data.honeyProps}>
			<App />
		</HoneypotProvider>
	)
}

export default withSentry(AppWithProviders)

export function ErrorBoundary() {
	// the nonce doesn't rely on the loader so we can access that
	const nonce = useNonce()
	const location = useLocation()

	// NOTE: you cannot use useLoaderData in an ErrorBoundary because the loader
	// likely failed to run so we have to do the best we can.
	// We could probably do better than this (it's possible the loader did run).
	// This would require a change in Remix.

	// Just make sure your root route never errors out and you'll always be able
	// to give the user a better UX.

	return (
		<Document nonce={nonce}>
			<GeneralErrorBoundary
				unexpectedErrorHandler={_ => (
					<Suspense fallback={<p className="pb-20 text-center">Erro</p>}>
						<UnexpectedError location={location.pathname} />
					</Suspense>
				)}
			/>
		</Document>
	)
}
