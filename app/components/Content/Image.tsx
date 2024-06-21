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
		<div className="animate-grad overflow-hidden rounded-lg bg-gradient-to-tr from-warm via-mid to-cold bg-2x p-4 shadow-md sm:mx-2 sm:my-12 lg:p-4">
			<img
				alt={blok.Alt}
				title={blok.Title}
				height="296"
				src={`${blok.Image.filename}/m/394x296${format}`}
				sizes={`(min-width: 1360px) 547px, (min-width: 780px) calc(38.93vw + 25px), (min-width: 640px) calc(75vw - 36px), (min-width: 480px) calc(83.57vw - 41px), calc(91.88vw - 45px)`}
				srcSet={`${blok.Image.filename}/m/547x411${format} 547w, ${blok.Image.filename}/m/539x405${format} 539w, ${blok.Image.filename}/m/493x370${format} 493w, ${blok.Image.filename}/m/394x296${format} 394w`}
				width="394"
				className="w-full rounded-sm shadow"
			/>
		</div>
	)
}
