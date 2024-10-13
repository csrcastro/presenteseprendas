import { type ISbStoryData, type SbBlokData } from '@storyblok/react'
import { type StoryblokRichtext } from 'storyblok-rich-text-react-renderer'
import Presente from './Presente'
export default function Presentes({
	presentes,
}: {
	presentes: SbBlokData &
		{
			Headline: StoryblokRichtext
			Images: { id: string; filename: string }[]
			ImagesSource: StoryblokRichtext
			Loja: ISbStoryData
			Link: {
				url: string
			}
			Review: StoryblokRichtext
			ReviewLink: string
			ProductName: string
		}[]
}) {
	return (
		<div className="mt-8">
			<h2 className="font-serif mb-8  text-3xl xl:text-4xl text-colder">As nossas sugestões:</h2>
			<ol className="present-list">
				{presentes.map(
					(
						nestedBlok: SbBlokData & {
							Headline: StoryblokRichtext
							Images: { id: string; filename: string }[]
							ImagesSource: StoryblokRichtext
							Loja: ISbStoryData
							Link: {
								url: string
							}
							Review: StoryblokRichtext
							ReviewLink: string
							ProductName: string
						},
						index: number,
					) => (
						<Presente
							key={nestedBlok._uid}
							blok={nestedBlok}
							index={index + 1}
						/>
					),
				)}
			</ol>
		</div>
	)
}
