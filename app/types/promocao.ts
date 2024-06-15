import  { type StoryblokRichtext } from "storyblok-rich-text-react-renderer";
import  { type StoryblokImage } from "./storyblok";

export interface SuggestionImage {
  url: string;
}

export interface PromocaoContent {
  title: string;
  blurb: string;
  copy: StoryblokRichtext;
  _uid: string;
}

export interface Promocao {
  content: PromocaoContent;
  uuid: string;
}

export interface Loja {
  Name: string;
  Link: string;
  Avatar: StoryblokImage;
  ShippingInfo: StoryblokRichtext;
  _uid: string;
}

export interface Autor {
  Name: string;
  Link: string;
  Avatar: StoryblokImage;
  ShippingInfo: StoryblokRichtext;
  _uid: string;
}
