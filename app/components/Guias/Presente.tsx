import { GiftIcon } from '@heroicons/react/24/solid'
import {
	type SbBlokData,
	storyblokEditable,
	type ISbStoryData,
} from '@storyblok/react'
import { type StoryblokRichtext } from 'storyblok-rich-text-react-renderer'
import RichContent from '../Helpers/RichContent'
import RichLinksOnly from '../Helpers/RichLinksOnly'
import MonetizedLink from '../Monetize/MonetizedLink'
import PresenteImages from './PresenteImages'

export default function Presente({
	blok,
	index,
}: {
	blok: SbBlokData & {
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
	}
	index: number
}) {
	return (
		<li
			className="mb-12"
			{...storyblokEditable(blok)}
			key={blok._uid}
			id={`presente-${index}`}
		>
			{index > 1 && (
				<span className="p-separator mb-12">
					<span className="p-separator-break" />
				</span>
			)}

			<figure>
				<figcaption className="presentes-list__caption mb-3 font-serif text-xl lg:mb-7 xl:text-2xl">
					<span className="presentes-list__caption__first">{index}.</span>{' '}
					<h3>
						<RichContent document={blok.Headline} />
					</h3>
				</figcaption>
				<PresenteImages
					images={blok?.Images}
					url={blok?.Link?.url}
					alt={blok?.ProductName}
					loja={blok?.Loja}
				/>
				<div className="mb-6 mt-2 text-sm font-light lowercase italic text-text-light">
					<RichLinksOnly
						className="hover:text-contrast hover:underline"
						document={blok?.ImagesSource}
					/>
				</div>
				<div className="tracking-snug">
					{blok?.ReviewLink && blok?.ReviewName ? (
						<span className="font-black text-colder">
							<MonetizedLink
								className="hover:text-contrast"
								to={blok?.ReviewLink}
								loja={blok?.Loja}
							>
								{blok?.ReviewName}
							</MonetizedLink>
							{' diz: '}
						</span>
					) : null}
					<RichContent document={blok?.Review} />
				</div>
			</figure>
			<div className="mt-12 text-center">
				<MonetizedLink
					className="inline-flex w-auto rounded-custom bg-warm px-6 py-3 duration-300 hover:bg-warmer xs:px-8 md:px-12"
					to={blok?.Link?.url}
					loja={blok?.Loja}
				>
					<span className="inline-flex items-start text-white">
						<span className="text-xl font-black">{'OFERECER'}</span>
						<GiftIcon className="ml-1 h-6 w-6" aria-hidden="true" />
					</span>
				</MonetizedLink>
			</div>
		</li>
	)
}
