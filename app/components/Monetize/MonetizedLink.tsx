import { Link } from '@remix-run/react'
import { type ISbStoryData } from '@storyblok/react'

const linkProps = {
	rel: 'nofollow sponsored',
	target: '_blank',
}

export default function MonetizedLink({
	loja,
	...rest
}: {
	to: string
	children: any
	loja: ISbStoryData
	className?: string
}) {
	if (!loja) {
		return <Link {...rest} to={rest.to} {...linkProps} />
	}
	switch (loja.name) {
		case 'Amazon':
			return <AmazonLink {...rest} loja={loja} />
		case 'Atida':
		case 'Auchan':
		case 'Decathlon':
		case 'Esdemarca':
		case 'Pandora':
		case 'PcComponentes':
		case 'Primor':
			return <AwinLink {...rest} loja={loja} />
		default:
			return <Link {...rest} to={rest.to} {...linkProps} />
	}
}

function AmazonLink({
	loja,
	children,
	...rest
}: {
	to: string
	loja: any
	children: any
	className?: string
}) {
	const monetizedTo: string = loja?.content?.UrlTag
		? `${rest.to}${rest.to.includes('?') ? '&' : '?'}${loja.content.UrlTag}`
		: rest.to
	return (
		<Link {...rest} to={monetizedTo} {...linkProps}>
			{children}
		</Link>
	)
}

function AwinLink({
	loja,
	children,
	...rest
}: {
	to: string
	loja: any
	children: any
	className?: string
}) {
	const monetizedTo: string = `${loja?.content?.UrlTag}${encodeURIComponent(
		rest.to,
	)}`
	return (
		<Link {...rest} to={monetizedTo} {...linkProps}>
			{children}
		</Link>
	)
}
