import { Link } from '@remix-run/react'
import { type ISbStories } from '@storyblok/react'
import { createElement } from 'react'
import {
	type StoryblokRichtext,
	MARK_LINK,
	NODE_PARAGRAPH,
	NODE_HEADING,
	render,
	NODE_OL,
	NODE_UL,
	NODE_LI,
} from 'storyblok-rich-text-react-renderer'
import { I } from 'vitest/dist/chunks/reporters.DAfKSDh5.js'

export default function RichContentGuia({
	document,
	ads,
}: {
	document: StoryblokRichtext
	ads?: ISbStories | null
}) {
	let h3Counter = 0
	let addCounter = 0

	return render(document, {
		markResolvers: {
			[MARK_LINK]: (children, props) => {
				const {
					linktype,
					href,
					target,
				}: { linktype?: string; href?: string; target?: string } = props
				if (linktype === 'email') {
					// Email links: add `mailto:` scheme and map to <a>
					return <Link to={`mailto:${href}`}>{children}</Link>
				}
				if (href && href.match(/^(https?:)?\/\//)) {
					// External links: map to <a>
					return (
						<Link
							className="text-highlight hover:text-warmer hover:transition-colors"
							to={href}
							target={target}
						>
							{children}
						</Link>
					)
				}
				// Internal links: map to <Link>
				return (
					<Link
						className="text-highlight hover:text-warmer hover:transition-colors"
						to={(href || ENV.BASE_URL).replace(/\/$/, '').replace('pages/', '')}
					>
						{children}
					</Link>
				)
			},
		},
		nodeResolvers: {
			[NODE_PARAGRAPH]: (children) =>
				createElement(
					`p`,
					{
						className: 'mb-6',
					},
					children,
				),
			[NODE_HEADING]: (children, { level }) => {
				let textSize = 'xl mb-2 mt-2'

				switch (level) {
					case 1:
						textSize = '3xl mb-12 mt-12'
						break
					case 2:
						textSize = '3xl mb-12 mt-12'
						break
					case 3:
						textSize = '2xl mb-8 mt-8'
						break
					case 4:
						textSize = 'xl mb-4 mt-4'
						break
					default:
						break
				}

				let el = null

				if (ads && level === 3 && ads.data.stories[addCounter]) {
					h3Counter++
					if (h3Counter === 1) {
						return createElement(
							`h${level}`,
							{
								className: `text-${textSize} font-serif`,
							},
							children,
						)
					} else {
						addCounter++
						const pos = addCounter - 1
						return (
							<>
								<a
									key={`guia-ad-${pos}`}
									href={ads?.data?.stories[pos]?.content.Link}
									target="_blank"
									className="mb-20 mt-16 block cursor-pointer"
									title={ads?.data?.stories[pos]?.content.alt}
									rel="sponsored"
								>
									<img
										loading="lazy"
										className="w-full"
										src={`${ads?.data?.stories[pos]?.content.image.filename}/m/smart/filters:format(webp)`}
										alt={ads?.data?.stories[pos]?.content.alt}
									/>
								</a>
								<h3 className="mb-8 mt-8 font-serif text-2xl">{children}</h3>
							</>
						)
					}
				} else {
					el = createElement(
						`h${level}`,
						{
							className: `text-${textSize} font-serif`,
						},
						children,
					)
				}

				return el
			},
			[NODE_OL]: (children) =>
				createElement(
					`ol`,
					{
						className: 'list-disc list-inside rich-list text-sm mb-12',
					},
					children,
				),
			[NODE_UL]: (children) =>
				createElement(
					`ul`,
					{
						className: 'list-disc list-inside rich-list text-sm mb-12',
					},
					children,
				),
			[NODE_LI]: (children) =>
				createElement(
					`li`,
					{
						className: 'mb-6',
					},
					children,
				),
		},
	})
}
