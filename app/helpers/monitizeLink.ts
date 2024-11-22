import { type ISbStoryData } from '@storyblok/react'

export default function monetizeLink({
	loja,
	to,
}: {
	to: string
	loja: ISbStoryData
}) {
	if (!loja) {
		return to
	}
	switch (loja.name) {
		case 'Amazon':
			return amazonLink({
				loja,
				to,
			})
		case 'Atida':
		case 'Auchan':
		case 'Decathlon':
		case 'Esdemarca':
		case 'Pandora':
		case 'PcComponentes':
		case 'Primor':
			return awinLink({ loja, to })
		default:
			return to
	}
}

function amazonLink({ loja, to }: { to: string; loja: any }) {
	const monetizedTo: string = loja?.content?.UrlTag
		? `${to}${to.includes('?') ? '&' : '?'}${loja.content.UrlTag}`
		: to
	return monetizedTo
}

function awinLink({ loja, to }: { to: string; loja: any }) {
	const monetizedTo: string = `${loja?.content?.UrlTag}${encodeURIComponent(
		to,
	)}`
	return monetizedTo
}
