import type { StoryblokRichtext } from "storyblok-rich-text-react-renderer";

import type { StoryblokImage } from "./storyblok";

export type SuggestionImage = {
  url: string;
};

export type PromocaoContent = {
  title: string;
  blurb: string;
  copy: StoryblokRichtext;
  _uid: string;
};

export type Promocao = {
  content: PromocaoContent;
  uuid: string;
};

export type Loja = {
  Name: string;
  Link: string;
  Avatar: StoryblokImage;
  ShippingInfo: StoryblokRichtext;
  _uid: string;
};

export type Autor = {
  Name: string;
  Link: string;
  Avatar: StoryblokImage;
  ShippingInfo: StoryblokRichtext;
  _uid: string;
};
