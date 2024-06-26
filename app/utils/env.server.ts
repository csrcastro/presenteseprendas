import { z } from 'zod'

const schema = z.object({
	BASE_URL: z.string(),
	NODE_ENV: z.enum(['production', 'development', 'test'] as const),
	DATABASE_URL: z.string(),
	SESSION_SECRET: z.string(),
	INTERNAL_COMMAND_TOKEN: z.string(),
	HONEYPOT_SECRET: z.string(),
	// If you plan on using Sentry, uncomment this line
	// SENTRY_DSN: z.string(),
	// If you plan to use Resend, uncomment this line
	// RESEND_API_KEY: z.string(),
	// If you plan to use GitHub auth, remove the default:
	GITHUB_CLIENT_ID: z.string().default('MOCK_GITHUB_CLIENT_ID'),
	GITHUB_CLIENT_SECRET: z.string().default('MOCK_GITHUB_CLIENT_SECRET'),
	GITHUB_TOKEN: z.string().default('MOCK_GITHUB_TOKEN'),
	ALLOW_INDEXING: z.enum(['true', 'false']).optional(),
	STORYBLOK_ACCESS_TOKEN: z.string(),
	STORYBLOK_EXPLORE: z.enum(['published', 'draft']).optional(),
	CV: z.number().optional(),
})

declare global {
	namespace NodeJS {
		interface ProcessEnv extends z.infer<typeof schema> {}
	}
}

export function init() {
	const parsed = schema.safeParse(process.env)

	if (parsed.success === false) {
		console.error(
			'❌ Invalid environment variables:',
			parsed.error.flatten().fieldErrors,
		)

		throw new Error('Invalid environment variables')
	}
}

/**
 * This is used in both `entry.server.ts` and `root.tsx` to ensure that
 * the environment variables are set and globally available before the app is
 * started.
 *
 * NOTE: Do *not* add any environment variables in here that you do not wish to
 * be included in the client.
 * @returns all public ENV variables
 */
export function getEnv() {
	return {
		MODE: process.env.NODE_ENV,
		SENTRY_DSN: process.env.SENTRY_DSN,
		ALLOW_INDEXING: process.env.ALLOW_INDEXING,
		STORYBLOK_ACCESS_TOKEN: process.env.STORYBLOK_ACCESS_TOKEN,
		STORYBLOK_EXPLORE: process.env.STORYBLOK_EXPLORE,
		BASE_URL: process.env.BASE_URL,
		CV: 0,
	}
}

type ENV = ReturnType<typeof getEnv>

declare global {
	var ENV: ENV
	interface Window {
		ENV: ENV
	}
}
