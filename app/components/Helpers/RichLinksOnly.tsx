import { Link } from "@remix-run/react";
import  { type StoryblokRichtext ,
  MARK_LINK,
  MARK_TEXT_STYLE,
  NODE_BR,
  NODE_CODEBLOCK,
  NODE_EMOJI,
  NODE_HEADING,
  NODE_HR,
  NODE_IMAGE,
  NODE_LI,
  NODE_OL,
  NODE_PARAGRAPH,
  NODE_QUOTE,
  NODE_UL,
  render,
} from "storyblok-rich-text-react-renderer";
export default function RichLinksOnly({
  document,
  className,
}: {
  document: StoryblokRichtext;
  className: string;
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
            <Link className={className} target={target} to={href}>
              {children}
            </Link>
          );
        }
        // Internal links: map to <Link>
        return (
          <Link
            className={className}
            to={(href || ENV.BASE_URL).replace(/\/$/, "")}
          >
            {children}
          </Link>
        );
      },
      [MARK_TEXT_STYLE]: (children) => {
        return <>{children}</>;
      },
    },
    nodeResolvers: {
      [NODE_PARAGRAPH]: (children) => <>{children}</>,
      [NODE_CODEBLOCK]: (children) => <>{children}</>,
      [NODE_HEADING]: (children) => <>{children}</>,
      [NODE_IMAGE]: (children) => <>{children}</>,
      [NODE_EMOJI]: (children) => <>{children}</>,
      [NODE_QUOTE]: (children) => <>{children}</>,
      [NODE_OL]: (children) => <>{children}</>,
      [NODE_UL]: (children) => <>{children}</>,
      [NODE_LI]: (children) => <>{children}</>,
      [NODE_HR]: () => null,
      [NODE_BR]: () => null,
    },
  });
}
