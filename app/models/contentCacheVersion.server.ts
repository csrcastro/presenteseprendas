import { prisma } from '#app/utils/db.server.ts'

export async function getCv(): Promise<number> {
	const cacheRecord = await prisma.contentCacheVersion.findUnique({
		where: {
			name: 'storyblok',
		},
	})

	return Number(cacheRecord?.timestamp) || 0
}
