import type { StoryblokRichtext } from 'storyblok-rich-text-react-renderer';

import type { StoryblokImage } from './storyblok';

export type SuggestionImage = {
  url: string;
};

export type Suggestion = {
  Headline: StoryblokRichtext;
  Images: StoryblokImage[];
  HelpfulReview: StoryblokRichtext;
  _uid: string;
};
