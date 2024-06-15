import { json, type ActionFunctionArgs } from '@remix-run/node' // or cloudflare/deno
import StoryblokClient, { type ISbResult } from 'storyblok-js-client'

const Storyblok = new StoryblokClient({
	oauthToken: process.env.STORYBLOK_MANAGEMENT_ACCESS_TOKEN,
})

function generatePromises(
	links: { Link: { url: string } }[],
): [Array<Promise<unknown>>, number] {
	let count = 0
	const map = links.map((element: { Link: { url: string } }) => {
		if (!element.Link.url.startsWith('https://amzn.eu'))
			return new Promise(resolve => resolve(element))

		count++

		return (async function () {
			const response = await fetch(element.Link.url)

			return {
				...element,
				Link: {
					...element.Link,
					url: response.url.replace(/\?.*$/, '/'),
					cached_url: response.url.replace(/\?.*$/, '/'),
				},
			}
		})()
	})

	return [map, count]
}

async function updateStory(storyId: string, story: ISbResult['data']) {
	return Storyblok.put(`/spaces/205641/stories/${storyId}`, {
		story,
		force_update: 1,
		publish: 1,
	})
}

function processPromocao(storyId: string, story: ISbResult['data']) {
	if (!story.content.Link.url.startsWith('https://amzn.eu')) {
		return json({ success: true }, 200)
	}

	fetch(story.content.Link.url).then(function (response) {
		story.content.Link = {
			...story.content.Link,
			url: response.url.replace(/\?.*$/, '/'),
			cached_url: response.url.replace(/\?.*$/, '/'),
		}

		updateStory(storyId, story)
			.then(response => {
				console.log(response)
			})
			.catch(error => {
				console.log(error)
				process.exit(1)
			})
	})

	return json({ success: true }, 200)
}

function processGuia(storyId: string, story: ISbResult['data']) {
	const [promises, count] = generatePromises(story.content.Presentes)

	if (count === 0) {
		return json({ success: true }, 200)
	}

	Promise.all(promises).then(function (values) {
		story.content.Presentes = values

		updateStory(storyId, story)
			.then(response => {
				console.log(response)
			})
			.catch(error => {
				console.log(error)
				process.exit(1)
			})
	})

	return json({ success: true }, 200)
}

export const action = async ({ request }: ActionFunctionArgs) => {
	switch (request.method) {
		case 'POST': {
			const payload = (await request.json()) as {
				full_slug: string
				story_id: string
			}

			if (!/(guias-de-presentes|promocoes)\/.{1,}/.exec(payload.full_slug)) {
				return json({ success: true }, 200)
			}

			const {
				data: { story },
			} = await Storyblok.get(`/spaces/205641/stories/${payload.story_id}`)

			if (/(promocoes)\/.{1,}/.exec(payload.full_slug)) {
				return processPromocao(payload.story_id, story)
			} else if (/(guias-de-presentes)\/.{1,}/.exec(payload.full_slug)) {
				return processGuia(payload.story_id, story)
			} else {
				return json({ success: true }, 200)
			}
		}
		case 'PUT':
		case 'PATCH':
		case 'DELETE':
		default: {
			return json({ success: true }, 200)
		}
	}
}
