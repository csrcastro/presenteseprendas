import { Link } from '@remix-run/react'
import {
	type StoryblokRichtext,
	render,
	MARK_LINK,
} from 'storyblok-rich-text-react-renderer'
export default function RichContent({
	document,
}: {
	document: StoryblokRichtext
}) {
	return (
		<div className="rich-text">
			{render(document, {
				markResolvers: {
					[MARK_LINK]: (
						children,
						props: { linktype?: string; href?: string; target?: string },
					) => {
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
								to={(href || ENV.BASE_URL)
									.replace(/\/$/, '')
									.replace('pages/', '')}
							>
								{children}
							</Link>
						)
					},
				},
			})}
		</div>
	)
}
