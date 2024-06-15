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
						to={(href || ENV.BASE_URL).replace(/\/$/, '')}
					>
						{children}
					</Link>
				)
			},
		},
		nodeResolvers: {
			[NODE_PARAGRAPH]: children =>
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
						textSize =
							'2xl mb-8 mt-8 text-transparent bg-bottom bg-2x bg-gradient-to-r from-warm to-cold bg-clip-text'
						break
					case 3:
						textSize = 'xl mb-8 mt-8'
						break
					case 4:
						textSize = 'lg mb-4 mt-4'
						break
					default:
						break
				}

				return createElement(
					`h${level}`,
					{
						className: `text-${textSize} font-heading`,
					},
					children,
				)
			},
			[NODE_OL]: children =>
				createElement(
					`ol`,
					{
						className: 'list-disc list-inside rich-list text-sm mb-12',
					},
					children,
				),
			[NODE_UL]: children =>
				createElement(
					`ul`,
					{
						className: 'list-disc list-inside rich-list text-sm mb-12',
					},
					children,
				),
			[NODE_LI]: children =>
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

export default function Text({ blok }: { blok: IBlok }) {
	return <RichText document={blok.Copy} />
}
