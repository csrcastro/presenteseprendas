import { Link } from "@remix-run/react";
import  { type ISbStoryData } from "@storyblok/react";
import config from "../../config";
import RichContent from "../Helpers/RichContent";

const {
  img: { format },
} = config;

export default function PresentesGridAlt({
  ideias,
}: {
  ideias: ISbStoryData[];
}) {
  return (
    <div className="g-grid">
      {ideias.map((ideia) => (
        <div key={ideia.uuid} className="group relative">
          <figure>
            <div className="g-grid-a">
              <img
                alt={ideia.content.SeoTitle}
                className="g-grid-a-img"
                height="116"
                loading="lazy"
                sizes={`(min-width: 1360px) 292px, (min-width: 1040px) calc(20vw + 24px), (min-width: 780px) calc(33.33vw - 32px), calc(50vw - 40px)`}
                src={`${ideia?.content?.Image?.filename}/m/155x116${format}`}
                srcSet={`${ideia?.content?.Image?.filename}/m/155x116${format} 155w, ${ideia?.content?.Image?.filename}/m/344x257${format} 344w, ${ideia?.content?.Image?.filename}/m/292x218${format} 292w`}
                width="155"
              />
            </div>
            <figcaption className="g-grid-h">
              <Link
                aria-label={ideia.content.Title}
                title={`Ler: ${ideia.content.Title} `}
                to={`${ENV.BASE_URL}/${ideia.full_slug.replace(/\/$/, "")}`}
              >
                <span aria-hidden="true" className="absi-0" />
                <RichContent document={ideia.content.Title} />
              </Link>
            </figcaption>
          </figure>
        </div>
      ))}
    </div>
  );
}
