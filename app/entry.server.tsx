import { PassThrough } from 'stream'
import {
	createReadableStreamFromReadable,
	type LoaderFunctionArgs,
	type ActionFunctionArgs,
	type HandleDocumentRequestFunction,
} from '@remix-run/node'
import { RemixServer } from '@remix-run/react'
import * as Sentry from '@sentry/remix'
import { apiPlugin, storyblokInit } from '@storyblok/react'
import chalk from 'chalk'
import { list, createIsbotFromList } from 'isbot'
import { renderToPipeableStream } from 'react-dom/server'
import latoItalic from './fonts/lato900italic.woff2'
import { IsBotProvider } from './is-bot.context'
import { getCv } from './models/contentCacheVersion.server.ts'
import tailwindStyleSheetUrl from './styles/tailwind.css?url'
import { getEnv, init } from './utils/env.server.ts'
import { NonceProvider } from './utils/nonce-provider.ts'
import { makeTimings } from './utils/timing.server.ts'
const ABORT_DELAY = 5000

init()
global.ENV = getEnv()

storyblokInit({
	accessToken: process.env.STORYBLOK_ACCESS_TOKEN,
	use: [apiPlugin],
	apiOptions: {
		cache: {
			type: 'memory',
			clear: 'auto',
		},
	},
})

if (ENV.MODE === 'production' && ENV.SENTRY_DSN) {
	import('./utils/monitoring.server.ts').then(({ init }) => init())
}

type DocRequestArgs = Parameters<HandleDocumentRequestFunction>

export default async function handleRequest(...args: DocRequestArgs) {
	const [
		request,
		responseStatusCode,
		responseHeaders,
		remixContext,
		loadContext,
	] = args
	responseHeaders.set('fly-region', process.env.FLY_REGION ?? 'unknown')
	responseHeaders.set('fly-app', process.env.FLY_APP_NAME ?? 'unknown')
	responseHeaders.append(
		'Link',
		`<${tailwindStyleSheetUrl}>; rel="preload"; as="style"`,
	)
	responseHeaders.append(
		'Link',
		`<${latoItalic}>; rel="preload"; as="font"; type="font/woff2"; crossorigin="anonymous"`,
	)
	responseHeaders.append('Link', '<https://a.storyblok.com>; rel="preconnect"')

	global.ENV.CV = await getCv()

	const isBotChecker = createIsbotFromList(list.concat('Labrika'))

	const isBot = isBotChecker(request.headers.get('user-agent') ?? '')

	const callbackName = isBot ? 'onAllReady' : 'onShellReady'

	const nonce = loadContext.cspNonce?.toString() ?? ''
	return new Promise(async (resolve, reject) => {
		let didError = false
		// NOTE: this timing will only include things that are rendered in the shell
		// and will not include suspended components and deferred loaders
		const timings = makeTimings('render', 'renderToPipeableStream')

		const { pipe, abort } = renderToPipeableStream(
			<NonceProvider value={nonce}>
				<IsBotProvider isBot={isBot}>
					<RemixServer context={remixContext} url={request.url} />
				</IsBotProvider>
			</NonceProvider>,
			{
				[callbackName]: () => {
					const body = new PassThrough()
					responseHeaders.set('Content-Type', 'text/html')
					responseHeaders.append('Server-Timing', timings.toString())
					resolve(
						new Response(createReadableStreamFromReadable(body), {
							headers: responseHeaders,
							status: didError ? 500 : responseStatusCode,
						}),
					)
					pipe(body)
				},
				onShellError: (err: unknown) => {
					reject(err)
				},
				onError: () => {
					didError = true
				},
				nonce,
			},
		)

		setTimeout(abort, ABORT_DELAY)
	})
}

export async function handleDataRequest(response: Response) {
	response.headers.set('fly-region', process.env.FLY_REGION ?? 'unknown')
	response.headers.set('fly-app', process.env.FLY_APP_NAME ?? 'unknown')

	return response
}

export function handleError(
	error: unknown,
	{ request }: LoaderFunctionArgs | ActionFunctionArgs,
): void {
	// Skip capturing if the request is aborted as Remix docs suggest
	// Ref: https://remix.run/docs/en/main/file-conventions/entry.server#handleerror
	if (request.signal.aborted) {
		return
	}
	if (error instanceof Error) {
		console.error(chalk.red(error.stack))
		Sentry.captureRemixServerException(error, 'remix.server', request)
	} else {
		console.error(chalk.red(error))
		Sentry.captureException(error)
	}
}
