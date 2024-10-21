import { type ISbStoryData } from '@storyblok/react'
import {
	richTextResolver,
	type StoryblokRichTextNode,
} from '@storyblok/richtext'
import dayjs from 'dayjs'
import striptags from 'striptags'

import config from '../config'

const { sd } = config

function generateWebsite(collection: { stories: ISbStoryData[] }) {
	const { stories } = collection
	return {
		'@context': 'https://schema.org/',
		'@type': 'WebSite',
		'@id': `${ENV.BASE_URL}#website`,
		name: sd.name,
		description: sd.description,
		publisher: {
			'@id': `${ENV.BASE_URL}#organization`,
			name: 'Presentes e Prendas',
		},
		potentialAction: [
			{
				'@type': 'SearchAction',
				target: {
					'@type': 'EntryPoint',
					urlTemplate: `${ENV.BASE_URL}/pesquisa?pesquisa={search_term_string}`,
				},
				'query-input': 'required name=search_term_string',
			},
		],
		url: ENV.BASE_URL,
		inLanguage: 'pt-PT',
		mainEntity: {
			'@context': 'https://schema.org',
			'@type': 'ItemList',
			itemListElement: stories.map((story) => {
				return {
					'@type': 'ListItem',
					position: 1,
					name: `${story?.content?.Title}`,
					url: `${ENV.BASE_URL}/${story?.full_slug.replace('pages/', '')}`,
					image: {
						'@type': 'ImageObject',
						url: `${story?.content?.Image?.filename}/m/1000x1000`,
						width: 1000,
						height: 1000,
					},
				}
			}),
			numberOfItems: 50,
		},
	}
}

function generateOrganization() {
	return {
		'@type': 'Organization',
		'@id': `${ENV.BASE_URL}#organization`,
		name: sd.name,
		description: sd.description,
		url: ENV.BASE_URL,
		sameAs: sd.sameAs,
		logo: {
			'@type': 'ImageObject',
			inLanguage: 'pt-PT',
			'@id': `${ENV.BASE_URL}#/schema/logo/image/`,
			url: `${sd.logoPath}`,
			contentUrl: `${sd.logoPath}`,
			width: 350,
			height: 350,
			caption: sd.name,
		},
		image: {
			'@id': `${ENV.BASE_URL}#/schema/logo/image/`,
		},
	}
}

function generateBreadcrumbs(
	breadcrumbs: { name: string; item: string }[] | undefined,
) {
	if (!breadcrumbs) {
		return null
	}

	return {
		'@type': 'BreadcrumbList',
		itemListElement: [
			...breadcrumbs.map(({ name, item }, index) => ({
				'@type': 'ListItem',
				position: index + 1,
				name,
				item: `${ENV.BASE_URL}/${item}`,
			})),
		],
	}
}

function generateCollection(
	url: string,
	collection:
		| {
				url: string
				name: string
				description: string
				stories: ISbStoryData[]
		  }
		| undefined,
) {
	if (!collection) {
		return null
	}

	const { name, description, stories } = collection

	return {
		'@type': 'CollectionPage',
		url,
		name,
		description,
		inLanguage: 'pt-PT',
		mainEntity: {
			'@type': 'ItemList',
			itemListOrder: 'descending',
			itemListElement: stories.map((story) => {
				return {
					'@type': 'ListItem',
					position: 1,
					name: `${story?.content?.Title}`,
					url: `${ENV.BASE_URL}/${story?.full_slug.replace('pages/', '')}`,
					image: {
						'@type': 'ImageObject',
						url: `${story?.content?.Image?.filename}/m/1000x1000`,
						width: 1000,
						height: 1000,
					},
				}
			}),
		},
	}
}

function generatePresentList(
	presentList:
		| {
				ProductName: string
				Images: { filename: string }[]
		  }[]
		| undefined,
	url: string,
) {
	if (!presentList) {
		return null
	}
	return {
		'@type': 'ItemList',
		itemListElement: presentList.map(
			(
				{
					ProductName,
					Images,
				}: {
					ProductName: string
					Images: { filename: string }[]
				},
				index: number,
			) => {
				return {
					'@type': 'ListItem',
					position: index,
					name: ProductName,
					image: {
						'@type': 'ImageObject',
						url: `${Images[0]?.filename}/m/288x216/smart/filters:format(webp)`,
						width: 288,
						height: 216,
					},
					url: `${url}#presente-${index}`,
				}
			},
		),
	}
}

function generateFaq(
	faqList:
		| {
				Title: string
				Copy: StoryblokRichTextNode<string>
		  }[]
		| undefined,
) {
	if (!faqList || faqList.length < 1) {
		return null
	}

	return {
		'@type': 'FAQPage',
		mainEntity: faqList.map(
			({
				Title,
				Copy,
			}: {
				Title: string
				Copy: StoryblokRichTextNode<string>
			}) => {
				const answer = striptags(richTextResolver<string>().render(Copy))

				return {
					'@type': 'Question',
					name: Title,
					acceptedAnswer: {
						'@type': 'Answer',
						text: answer,
					},
				}
			},
		),
	}
}

function generateVideo(
	video: {
		id?: string
		date?: string
	},
	metadata: any,
) {
	return {
		'@type': 'VideoObject',
		name: metadata.title,
		description: metadata.description,
		thumbnailUrl: [`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`],
		embedUrl: `https://www.youtube-nocookie.com/embed/${video.id}`,
		uploadDate: dayjs(video.date).toISOString(),
	}
}

function generateArticle(url: string, story: ISbStoryData | undefined) {
	if (!story) {
		return null
	}
	return {
		'@type': 'Article',
		isAccessibleForFree: true,
		inLanguage: 'pt-PT',
		mainEntityOfPage: url,
		description: story.content.ShortDescription,
		headline: story.content.Title,
		datePublished: story.first_published_at,
		dateModified: story.published_at,
		author: [
			{
				'@type': 'Person',
				name: story.content.Autor.content.Nome,
				url: `${ENV.BASE_URL}/${story.content.Autor.full_slug.replace('pages/', '')}`,
				jobTitle: 'Autor no Presentes e Prendas',
			},
		],
		articleSection: story.content.Categoria.content.Title,
		keywords: [
			'presentes',
			'prendas',
			'guias de presentes',
			'guias de prendas',
			'presentes e prendas',
		],
		publisher: generateOrganization(),
		image: {
			'@type': 'ImageObject',
			url: `${story.content.Image?.filename}/m/1280x960/smart`,
			width: 1280,
			height: 960,
			representativeOfPage: true,
		},
	}
}

function generatePost(url: string, story: ISbStoryData | undefined) {
	if (!story) {
		return null
	}
	return {
		'@type': 'Article',
		isAccessibleForFree: true,
		inLanguage: 'pt-PT',
		mainEntityOfPage: url,
		description: story.content.META_description,
		headline: story.content.Title,
		datePublished: story.first_published_at,
		dateModified: story.published_at,
		author: [
			{
				'@type': 'Person',
				name: story.content.Autor.content.Nome,
				url: `${ENV.BASE_URL}/${story.content.Autor.full_slug.replace('pages/', '')}`,
				jobTitle: 'Autor no Presentes e Prendas',
			},
		],

		keywords: [
			'presentes',
			'prendas',
			'guias de presentes',
			'guias de prendas',
			'presentes e prendas',
		],
		publisher: generateOrganization(),
		image: {
			'@type': 'ImageObject',
			url: `${story.content.Image?.filename}/m/1280x960/smart`,
			width: 1280,
			height: 960,
			representativeOfPage: true,
		},
	}
}

export default function generatesd(
	{
		breadcrumbs,
		collection,
		article,
		presentList,
		faq,
		video = {},
		post,
	}: {
		breadcrumbs?: { name: string; item: string }[]
		collection?: {
			url: string
			name: string
			description: string
			stories: ISbStoryData[]
		}
		article?: ISbStoryData
		post?: ISbStoryData
		presentList?: {
			ProductName: string
			Images: { filename: string }[]
		}[]
		faq?: {
			Title: string
			Copy: StoryblokRichTextNode<string>
		}[]
		video?: {
			id?: string
			date?: string
		}
	},
	dirtyUrl: string,
	metadata: any,
	isHome?: boolean,
) {
	const url = `${ENV.BASE_URL}${
		dirtyUrl ? '/' + dirtyUrl.replace(/\/$/, '') : ''
	}`

	const result = []

	if (isHome) {
		if (collection) {
			result.push(generateWebsite(collection))
		}
		return {
			'script:ld+json': {
				'@context': 'http://schema.org',
				'@graph': [...result],
			},
		}
	}

	if (breadcrumbs) {
		result.push(generateBreadcrumbs(breadcrumbs))
	}

	if (collection) {
		result.push(generateCollection(url, collection))
	}
	if (article) {
		result.push(generateArticle(url, article))
	}
	if (post) {
		result.push(generatePost(url, post))
	}
	if (presentList && url) {
		result.push(generatePresentList(presentList, url))
	}
	if (faq) {
		result.push(generateFaq(faq))
	}
	if (video.id && video.date) {
		result.push(generateVideo(video, metadata))
	}

	result.push(generateOrganization())

	const time = !!article
		? {
				datePublished: article.first_published_at,
				dateModified: article.published_at,
			}
		: {}

	return {
		'script:ld+json': {
			'@context': 'http://schema.org',
			'@graph': [
				{
					'@type': 'WebPage',
					'@id': url,
					url: url,
					name: metadata.title,
					isPartOf: { '@id': `${ENV.BASE_URL}#website` },
					primaryImageOfPage: { '@id': `${url}#primaryimage` },
					image: { '@id': `${url}#primaryimage` },
					thumbnailUrl: metadata.image
						? `${metadata.image}/m/320x240/smart`
						: sd.logoPath,
					description: metadata.description,
					breadcrumb: { '@id': `${url}#breadcrumb` },
					inLanguage: 'pt-PT',
					...time,
				},
				{
					'@type': 'ImageObject',
					inLanguage: 'pt-PT',
					'@id': `${url}#primaryimage`,
					url: metadata.image
						? `${metadata.image}/m/1280x960/smart`
						: 'https://presenteseprendas.pt/fb-fallback.png',
					contentUrl: metadata.image
						? `${metadata.image}/m/1280x960/smart`
						: 'https://presenteseprendas.pt/fb-fallback.png',
					width: 1280,
					height: 960,
				},
				...result,
			],
		},
	}
}
