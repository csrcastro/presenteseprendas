import { Link } from "@remix-run/react";
import  { type StoryblokRichtext ,
  MARK_LINK,
  NODE_PARAGRAPH,
  render,
} from "storyblok-rich-text-react-renderer";
export default function RichContent({
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
          return <Link to={`mailto:${href}`}>{children}</Link>;
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
          );
        }
        // Internal links: map to <Link>
        return (
          <Link
            className="text-highlight hover:text-warmer hover:transition-colors"
            to={(href || ENV.BASE_URL).replace(/\/$/, "")}
          >
            {children}
          </Link>
        );
      },
    },
    nodeResolvers: {
      [NODE_PARAGRAPH]: (children) => <>{children}</>,
    },
  });
}
