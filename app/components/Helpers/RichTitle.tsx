import {Link} from '@remix-run/react'
import type { StoryblokRichtext } from "storyblok-rich-text-react-renderer";
import {
  MARK_LINK,
  MARK_TEXT_STYLE,
  NODE_PARAGRAPH,
  render,
} from "storyblok-rich-text-react-renderer";
export default function RichTitle({
  document,
}: {
  document: StoryblokRichtext;
}) {
  return render(document, {
    markResolvers: {
      [MARK_LINK]: (children, props) => {
        const { linktype, href, target } = props;
        if (linktype === "email") {
          // Email links: add `mailto:` scheme and map to <a>
          return <a href={`mailto:${href}`}>{children}</a>;
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
          );
        }
        // Internal links: map to <Link>
        return <a href={href}>{children}</a>;
      },
      [MARK_TEXT_STYLE]:(children, props) =>{
        return <>{children}</>
      }
    },
    nodeResolvers: {
      [NODE_PARAGRAPH]: (children) => <>{children}</>,
    },
  })
}
 
