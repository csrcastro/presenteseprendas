import { type ISbStoryData } from '@storyblok/react'
import config from '../../config'

const {
	img: { format },
} = config

import MonetizedLink from '../Monetize/MonetizedLink'

export default function PresenteImages({
	images,
	url,
	alt,
	loja,
}: {
	images: { id: string; filename: string }[]
	url: string
	alt: string
	loja: ISbStoryData
}) {
	return (
		<div className="flex flex-wrap justify-between gap-4 xs:w-8/12 md:w-10/12">
			{images.map((image, index) => {
				if (index == 0 && images.length !== 2) {
					return (
						<MonetizedLink
							key={image.id}
							className="w-full"
							loja={loja}
							to={url}
						>
							<img
								alt={alt}
								className={`aspect-[4/3] h-auto w-full rounded-custom object-cover shadow shadow-background-darker`}
								height="116"
								loading="lazy"
								sizes={`(min-width: 1360px) 608px, (min-width: 780px) calc(43.21vw + 29px), (min-width: 480px) calc(66.79vw - 33px), calc(100vw - 48px)`}
								src={`${image.filename}/m/288x216${format}`}
								srcSet={`${image.filename}/m/288x216${format} 288w, ${image.filename}/m/430x323${format} 430w, ${image.filename}/m/488x366${format} 488w, ${image.filename}/m/609x457${format} 609w`}
								width="155"
							/>
						</MonetizedLink>
					)
				}

				return (
					<MonetizedLink
						key={image.id}
						className="w-[calc(50%_-_.5rem)]"
						loja={loja}
						to={url}
					>
						<img
							alt={alt}
							className={`aspect-[4/3] h-auto w-full rounded-custom object-cover shadow shadow-background-darker`}
							height="116"
							loading="lazy"
							sizes={`(min-width: 1360px) 296px, (min-width: 780px) 21.61vw, (min-width: 480px) calc(33.21vw - 23px), calc(50vw - 32px)`}
							src={`${image.filename}/m/207x155${format}`}
							srcSet={`${image.filename}/m/296x222${format} 296w, ${image.filename}/m/232x174${format} 232w, ${image.filename}/m/207x155${format} 207w`}
							width="155"
						/>
					</MonetizedLink>
				)
			})}
		</div>
	)
}
