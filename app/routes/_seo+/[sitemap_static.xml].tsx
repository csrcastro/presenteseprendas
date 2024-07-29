import { getStoryblokApi, type ISbStoriesParams } from '@storyblok/react'
import dayjs from 'dayjs'
import config from '#app/helpers/sitemap/config'
import printLinks from '#app/helpers/sitemap/printLinks'
import { type Link, type Links } from '#app/helpers/sitemap/types'

const { responseParams, storyblokRequestParams } = config

function pushLinks(
	container: Link[],
	links: Links<Link>,
	priority: number,
	frequency: string,
) {
	Object.keys(links).forEach((key: string) => {
		const link: Link = links[key] || {}
		container.push({
			id: link.id,
			slug: link.full_slug?.replace('home', '').replace(/\/$/, ''),
			published_at: dayjs(link.published_at).format('YYYY-MM-DD'),
			priority,
			frequency,
		})
	})
}

export const loader = async () => {
	const all_links: Link[] = [
		{
			id: 0,
			slug: 'pesquisa',
			frequency: 'yearly',
			published_at: '2023-06-14',
			priority: 0.1,
		},
	]

	const params: ISbStoriesParams = {
		...storyblokRequestParams,
		excluding_slugs:
			'pages,pages/*,layout,layout/*,guias-de-presentes,guias-de-presentes/*,promocoes,promocoes/*,categorias,categorias/*,lojas,lojas/*,autores,autores/*',
	}

	const { total, data } = await getStoryblokApi().get(`cdn/stories`, params)

	pushLinks(all_links, data.stories, 1, 'daily')

	const maxPage = Math.ceil(total / config.storyblokRequestParams.per_page)

	if (maxPage <= 1) {
		return new Response(printLinks(all_links), responseParams)
	}

	const contentRequests = []

	for (let page = 2; page <= maxPage; page++) {
		contentRequests.push(
			getStoryblokApi().get(`cdn/stories`, { ...params, page }),
		)
	}

	await Promise.all(contentRequests).then(responses => {
		responses.forEach(resp => {
			pushLinks(all_links, resp.data.stories, 1, 'daily')
		})
	})

	return new Response(printLinks(all_links), responseParams)
}
