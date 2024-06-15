import { type StoryblokRichtext } from 'storyblok-rich-text-react-renderer'
import { type StoryblokImage } from './storyblok'

export interface SuggestionImage {
	url: string
}

export interface Suggestion {
	Headline: StoryblokRichtext
	Images: StoryblokImage[]
	HelpfulReview: StoryblokRichtext
	_uid: string
}
