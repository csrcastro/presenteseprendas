import { getStoryblokApi, type ISbStoriesParams } from '@storyblok/react'
import config from '#app/helpers/sitemap/config'
import printLinks from '#app/helpers/sitemap/printLinks'
import pushLinks from '#app/helpers/sitemap/pushLinks'
import { type Link } from '#app/helpers/sitemap/types'

const { responseParams, storyblokRequestParams } = config

export const loader = async () => {
	const all_links: Link[] = [
		{
			id: 0,
			slug: 'autores',
			frequency: 'monthly',
			priority: 0.1,
		},
	]

	const params: ISbStoriesParams = {
		...storyblokRequestParams,
		per_page: 100,
		starts_with: 'autores',
	}

	const { total, data } = await getStoryblokApi().get(`cdn/stories`, params)

	console.log(data.stories)
	pushLinks(all_links, data.stories, 0.2, 'monthly')

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
			pushLinks(all_links, resp.data.stories, 0.2, 'monthly')
		})
	})

	return new Response(printLinks(all_links), responseParams)
}
