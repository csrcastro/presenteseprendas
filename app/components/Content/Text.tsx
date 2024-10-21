import { Link } from '@remix-run/react'
import { type SbBlokData } from '@storyblok/react'
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

export interface IBlok extends SbBlokData {
	Copy: StoryblokRichtext
}

function RichText({ document }: { document: StoryblokRichtext }) {
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
				let hClass = 'text-xl mb-2 mt-2'

				switch (level) {
					case 1:
						hClass = 'text-2xl sm:text-3xl mb-12 mt-12'
						break
					case 2:
						hClass = 'text-3xl sm:text-4xl text-center mb-12'
						break
					case 3:
						hClass = 'text-lg sm:text-xl mb-8 mt-8'
						break
					case 4:
						hClass = 'sm:text-lg mb-4 mt-4'
						break
					default:
						break
				}

				return createElement(
					`h${level}`,
					{
						className: `font-serif ${hClass} `,
					},
					children,
				)
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

export default function Text({ content }: { content: StoryblokRichtext }) {
	return <RichText document={content} />
}
