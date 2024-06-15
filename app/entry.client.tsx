import { RemixBrowser } from '@remix-run/react'
import { apiPlugin, storyblokInit } from '@storyblok/react'
import { startTransition } from 'react'
import { hydrateRoot } from 'react-dom/client'

if (ENV.MODE === 'production' && ENV.SENTRY_DSN) {
	import('./utils/monitoring.client.tsx').then(({ init }) => init())
}

storyblokInit({
	accessToken: ENV.STORYBLOK_ACCESS_TOKEN,
	use: [apiPlugin],
	apiOptions: {
		cache: {
			type: 'memory',
			clear: 'auto',
		},
	},
})

startTransition(() => {
	hydrateRoot(document, <RemixBrowser />)
})
