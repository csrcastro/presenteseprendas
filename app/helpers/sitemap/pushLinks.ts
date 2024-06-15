import dayjs from "dayjs";

import  { type Links, type Link } from "./types";

export default function pushLinks(
  container: Link[],
  links: Links<Link>,
  priority: number,
  frequency: string,
) {
  Object.keys(links).forEach((key: string) => {
    const payload: Link = {
      id: links[key]?.id,
      slug: links[key]?.full_slug?.replace(/\/$/, ""),
      priority,
      frequency,
    };

    if (links[key]?.published_at) {
      payload.published_at = dayjs(links[key]?.published_at).format(
        "YYYY-MM-DD",
      );
    }

    container.push(payload);
  });
}
