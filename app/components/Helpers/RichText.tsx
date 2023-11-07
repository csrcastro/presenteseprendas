import type { StoryblokRichtext } from "storyblok-rich-text-react-renderer";
import {
  render,
  MARK_LINK,
  NODE_PARAGRAPH,
  NODE_HEADING,
} from "storyblok-rich-text-react-renderer";
export default function RichContent({
  document,
}: {
  document: StoryblokRichtext;
}) {
  return (
    <div className="rich-text">
      {render(document, {
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
                <a
                  href={href}
                  target={target}
                  className="text-highlight hover:text-highlight-cold hover:transition-colors"
                >
                  {children}
                </a>
              );
            }
            // Internal links: map to <Link>
            return <a href={href}>{children}</a>;
          },
        },
      })}
    </div>
  );
}
