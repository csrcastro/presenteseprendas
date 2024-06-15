import {
	getStoryblokApi,
	type ISbStoriesParams,
	type ISbStoryData,
} from '@storyblok/react'
import dayjs from 'dayjs'
import config from '#app/helpers/sitemap/config'
import printLinks from '#app/helpers/sitemap/printLinks'
import { type Link, type Links } from '#app/helpers/sitemap/types'
const { responseParams, storyblokRequestParams } = config

function getRelated(stories: ISbStoryData[]) {
	const perPage = 12
	return stories.map(story => {
		return (async function () {
			const params: ISbStoriesParams = {
				page: 1,
				per_page: 1,
				version: 'published',
				filter_query: {
					V2_Categories: { any_in_array: story.uuid },
				},
			}

			const { total: totalGuias } = await getStoryblokApi().get(`cdn/stories`, {
				...params,
				starts_with: 'guias-de-presentes',
			})

			const { total: totalPromocoes } = await getStoryblokApi().get(
				`cdn/stories`,
				{ ...params, starts_with: 'promocoes' },
			)

			return [...Array(Math.ceil(totalGuias / perPage) || 1).keys()]
				.map(guia => {
					return [...Array(Math.ceil(totalPromocoes / perPage) || 1).keys()]
						.map(promocao => {
							const searchParams = new URLSearchParams('')

							if (guia < 2 && promocao < 2) {
								return
							}

							if (guia > 1) {
								searchParams.append('pagina-de-guias', `${guia}`)
							}

							if (promocao > 1) {
								searchParams.append('pagina-de-promocoes', `${promocao}`)
							}

							return {
								id: 0,
								slug: `${story.full_slug.replace(/\/$/, '')}?${searchParams.toString()}`,
								frequency: 'weekly',
								priority: 0.9,
							}
						})
						.filter(x => !!x)
				})
				.filter(x => x.length > 0)
		})()
	})
}

function pushLinks(
	container: Link[],
	links: Links<Link>,
	priority: number,
	frequency: string,
) {
	Object.keys(links).forEach(async (key: string) => {
		const link: Link = links[key] || {}
		container.push({
			id: link.id,
			slug: link.full_slug?.replace('pages/', '').replace(/\/$/, ''),
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
			slug: 'categorias',
			frequency: 'monthly',
			priority: 0.7,
		},
	]

	const params: ISbStoriesParams = {
		...storyblokRequestParams,
		starts_with: 'categorias',
	}

	const { total, data } = await getStoryblokApi().get(`cdn/stories`, params)

	const relatedPromises = await Promise.all(getRelated(data.stories))

	await Promise.all(relatedPromises).then(responses => {
		responses.forEach(responsesLevel1 => {
			responsesLevel1.forEach(responsesLevel2 => {
				responsesLevel2.forEach((value: Link | undefined) => {
					if (value) {
						all_links.push(value)
					}
				})
			})
		})
	})
	pushLinks(all_links, data.stories, 0.8, 'weekly')

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
			pushLinks(all_links, resp.data.stories, 0.8, 'weekly')
		})
	})

	return new Response(printLinks(all_links), responseParams)
}
