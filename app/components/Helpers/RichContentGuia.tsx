import { createElement } from "react";
import type { StoryblokRichtext } from "storyblok-rich-text-react-renderer";
import {
  MARK_LINK,
  NODE_PARAGRAPH,
  NODE_HEADING,
  render,
} from "storyblok-rich-text-react-renderer";
export default function RichContentGuia({
  document,
}: {
  document: StoryblokRichtext;
}) {
  return render(document, {
    markResolvers: {
      [MARK_LINK]: (children, props) => {
        const {
          linktype,
          href,
          target,
        }: { linktype?: string; href?: string; target?: string } = props;
        if (linktype === "email") {
          // Email links: add `mailto:` scheme and map to <a>
          return <a href={`mailto:${href}`}>{children}</a>;
        }
        if (href && href.match(/^(https?:)?\/\//)) {
          // External links: map to <a>
          return (
            <a
              className="text-highlight hover:text-warmer hover:transition-colors"
              href={href}
              target={target}
            >
              {children}
            </a>
          );
        }
        // Internal links: map to <Link>
        return <a href={href}>{children}</a>;
      },
    },
    nodeResolvers: {
      [NODE_PARAGRAPH]: (children) =>
        createElement(
          `p`,
          {
            className: "mb-6",
          },
          children,
        ),
      [NODE_HEADING]: (children, { level }) =>
        createElement(
          `h${level}`,
          {
            className: "text-xl font-serif mb-2",
          },
          children,
        ),
    },
  });
}
