import { getStoryblokApi } from '@storyblok/react'
import { prisma } from '#app/utils/db.server.ts'
// import algoliasearch from 'algoliasearch';

export const action = async () => {
	//const payload = await request.json();

	async function main() {
		const {
			data: {
				space: { version },
			},
		} = await getStoryblokApi().get(`cdn/spaces/me`, {
			version: ENV.STORYBLOK_EXPLORE,
		})

		await prisma.contentCacheVersion.upsert({
			where: {
				name: 'storyblok',
			},
			update: {
				timestamp: `${version}`,
			},
			create: {
				name: 'storyblok',
				timestamp: `${version}`,
			},
		})
	}
	main()
		.then(async () => {
			await prisma.$disconnect()
		})
		.catch(async (e) => {
			console.error(e)
			await prisma.$disconnect()
			process.exit(1)
		})

	return null
}
