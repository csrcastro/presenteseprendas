import { type ISbStoryData } from '@storyblok/react'
import {
	richTextResolver,
	type StoryblokRichTextNode,
} from '@storyblok/richtext'
import dayjs from 'dayjs'
import striptags from 'striptags'

import config from '../config'

import monetizeLink from './monitizeLink'

function generateAbout(topics: string[], keywords: string[]) {
	if (topics.length < 1) {
		return []
	}
	let topicsKeywords = topics.map((i: string) => i.split(',')[0])

	const keywordTopics = keywords.reduce((acc: string[], current: string) => {
		if (!topicsKeywords.includes(current)) {
			acc.push(current)
		}
		return acc
	}, [])
	return [
		...generateThings(topics),
		...keywordTopics.map((keyword: string) => {
			return {
				'@type': 'Thing',
				name: keyword,
			}
		}),
	]
}

function generateKeywords(keywords: string) {
	return keywords
		? keywords.split(',')
		: [
				'presentes',
				'prendas',
				'guias de presentes',
				'guias de prendas',
				'presentes e prendas',
			]
}

function generateThings(things: string[]) {
	return things.map((mention: string) => {
		const [name, sameAs] = mention.split(',')
		return {
			'@type': 'Thing',
			name,
			sameAs,
		}
	})
}

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
				ProductPrice: string
				ProductName: string
				ProductBrand: string
				Images: { filename: string }[]
				Link: {
					cached_url: string
				}
				Loja: any
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
					ProductPrice,
					ProductBrand,
					ProductName,
					Images,
					Link,
					Loja,
				}: {
					ProductPrice: string
					ProductBrand: string
					ProductName: string
					Images: { filename: string }[]
					Link: {
						cached_url: string
					}
					Loja: any
				},
				index: number,
			) => {
				return {
					'@type': 'ListItem',
					position: index,
					item: {
						'@type': 'Product',
						url: `${url}#presente-${index}`,
						name: ProductName,
						brand: ProductBrand,
						image: {
							'@type': 'ImageObject',
							url: `${Images[0]?.filename}/m/288x216/smart/filters:format(webp)`,
							width: 288,
							height: 216,
						},
						offers: {
							'@type': 'Offer',
							price: ProductPrice,
							priceCurrency: 'EUR',
							availability: 'https://schema.org/InStock',
							url: monetizeLink({ loja: Loja, to: Link.cached_url }),
							seller: {
								'@type': 'Organization',
								name: Loja.name,
								url: Loja.content.Link.cached_url,
							},
						},
					},
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
	story?: ISbStoryData | undefined,
) {
	if (!faqList || faqList.length < 1) {
		return null
	}

	const faq: any = {
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

	if (story) {
		const about = story.content.Topics

		if (about && about.length > 0) {
			const keywords = generateKeywords(story.content.Keywords)
			faq.about = generateAbout(about, keywords)
		}
		const mentions = story.content.Mentions

		if (mentions && mentions.length > 0) {
			faq.mentions = generateThings(mentions)
		}
	}

	return faq
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

	const about = story.content.Topics || []
	const mentions = story.content.Mentions || []

	const keywords = generateKeywords(story.content.Keywords)

	return {
		'@type': 'Article',
		isAccessibleForFree: true,
		inLanguage: 'pt-PT',
		mainEntityOfPage: url,
		description: story.content.ShortDescription,
		headline: story.content.Title,
		datePublished: story.first_published_at,
		dateModified: story.published_at,
		isPartOf: {
			'@type': 'WebSite',
			name: sd.name,
			url: ENV.BASE_URL,
		},
		author: [
			{
				'@type': 'Person',
				name: story.content.Autor.content.Nome,
				url: `${ENV.BASE_URL}/${story.content.Autor.full_slug.replace('pages/', '')}`,
				jobTitle: 'Autor no Presentes e Prendas',
			},
		],
		articleSection: story.content.Categoria.content.Title,
		keywords,
		publisher: generateOrganization(),
		image: {
			'@type': 'ImageObject',
			url: `${story.content.Image?.filename}/m/1280x960/smart`,
			width: 1280,
			height: 960,
			representativeOfPage: true,
		},
		about: generateAbout(about, keywords),
		mentions: generateThings(mentions),
	}
}

function generatePost(url: string, story: ISbStoryData | undefined) {
	if (!story) {
		return null
	}

	const about = story.content.Topics || []
	const mentions = story.content.Mentions || []

	const keywords = generateKeywords(story.content.Keywords)

	return {
		'@type': 'Article',
		isAccessibleForFree: true,
		inLanguage: 'pt-PT',
		mainEntityOfPage: url,
		description: story.content.META_description,
		headline: story.content.Title,
		datePublished: story.first_published_at,
		dateModified: story.published_at,
		isPartOf: {
			'@type': 'WebSite',
			name: sd.name,
			url: ENV.BASE_URL,
		},
		author: [
			{
				'@type': 'Person',
				name: story.content.Autor.content.Nome,
				url: `${ENV.BASE_URL}/${story.content.Autor.full_slug.replace('pages/', '')}`,
				jobTitle: 'Autor no Presentes e Prendas',
			},
		],

		keywords,
		publisher: generateOrganization(),
		image: {
			'@type': 'ImageObject',
			url: `${story.content.Image?.filename}/m/1280x960/smart`,
			width: 1280,
			height: 960,
			representativeOfPage: true,
		},
		about: generateAbout(about, keywords),
		mentions: generateThings(mentions),
	}
}

function generateWebPage(url: string, story: ISbStoryData | undefined) {
	if (!story) {
		return null
	}

	const about = story.content.Topics || []
	const mentions = story.content.Mentions || []

	const keywords = generateKeywords(story.content.Keywords)

	return {
		'@type': 'WebPage',
		inLanguage: 'pt-PT',
		isAccessibleForFree: true,
		url: url,
		mainEntityOfPage: url,
		headline: story.content.SeoTitle,
		description: story.content.SeoDescription,
		name: story.content.Title,
		datePublished: story.first_published_at,
		dateModified: story.published_at,
		isPartOf: {
			'@type': 'WebSite',
			name: sd.name,
			url: ENV.BASE_URL,
		},

		keywords,
		publisher: generateOrganization(),
		primaryImageOfPage: {
			'@type': 'ImageObject',
			url: `${story.content.Image?.filename}/m/1280x960/smart`,
			width: 1280,
			height: 960,
			representativeOfPage: true,
		},
		about: generateAbout(about, keywords),
		mentions: generateThings(mentions),
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
		webpage,
	}: {
		breadcrumbs?: { name: string; item: string }[]
		collection?: {
			url: string
			name: string
			description: string
			stories: ISbStoryData[]
		}
		article?: ISbStoryData
		webpage?: ISbStoryData
		post?: ISbStoryData
		presentList?: {
			ProductPrice: string
			ProductName: string
			ProductBrand: string
			Images: { filename: string }[]
			Link: {
				cached_url: string
			}
			Loja: any
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
	if (webpage) {
		result.push(generateWebPage(url, webpage))
	}
	if (presentList && url) {
		result.push(generatePresentList(presentList, url))
	}
	if (faq) {
		result.push(generateFaq(faq, article || post))
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
