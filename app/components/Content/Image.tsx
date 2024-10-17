import { type SbBlokData } from '@storyblok/react'
import config from '../../config'

export interface IBlok extends SbBlokData {
	Title: string
	Alt: string
	Image: { filename: string }
}

const {
	img: { format },
} = config

export default function Image({ blok }: { blok: IBlok }) {
	return (
		<div className="from-chila via-inhame to-couve my-12 animate-grad overflow-hidden rounded-lg bg-gradient-to-tr bg-2x p-4 shadow-md sm:mx-2 lg:p-4">
			<img
				alt={blok.Alt}
				title={blok.Title}
				height="207"
				src={`${blok.Image.filename}/m/310x207${format}`}
				sizes={`(min-width: 700px) 581px, calc(93.68vw - 61px)`}
				srcSet={`${blok.Image.filename}/m/581x387${format} 581w, ${blok.Image.filename}/m/310x207${format} 310w`}
				width="310"
				className="w-full rounded-sm shadow"
			/>
		</div>
	)
}
