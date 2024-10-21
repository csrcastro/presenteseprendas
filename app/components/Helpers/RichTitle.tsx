import { Link } from '@remix-run/react'
import {
	type StoryblokRichtext,
	MARK_LINK,
	MARK_TEXT_STYLE,
	NODE_PARAGRAPH,
	render,
} from 'storyblok-rich-text-react-renderer'
export default function RichTitle({
	document,
}: {
	document: StoryblokRichtext
}) {
	return render(document, {
		markResolvers: {
			[MARK_LINK]: (children, props) => {
				const { linktype, href, target } = props
				if (linktype === 'email') {
					// Email links: add `mailto:` scheme and map to <a>
					return <Link to={`mailto:${href}`}>{children}</Link>
				}
				if (href && href.match(/^(https?:)?\/\//)) {
					// External links: map to <a>
					return (
						<Link
							to={href}
							target={target}
							className="text-highlight hover:text-highlight-cold hover:transition-colors"
						>
							{children}
						</Link>
					)
				}
				// Internal links: map to <Link>
				return (
					<Link
						className="text-highlight hover:text-highlight-cold hover:transition-colors"
						to={(href || ENV.BASE_URL).replace(/\/$/, '').replace('pages/', '')}
					>
						{children}
					</Link>
				)
			},
			[MARK_TEXT_STYLE]: (children) => {
				return <>{children}</>
			},
		},
		nodeResolvers: {
			[NODE_PARAGRAPH]: (children) => <>{children}</>,
		},
	})
}
