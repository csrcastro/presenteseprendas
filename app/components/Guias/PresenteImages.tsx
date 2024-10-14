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
								height="216"
								loading="lazy"
								sizes={`(min-width: 800px) 560px, (min-width: 760px) calc(560vw - 3808px), (min-width: 480px) 61.54vw, calc(100vw - 48px)`}
								src={`${image.filename}/m/288x216${format}`}
								srcSet={`${image.filename}/m/560x420${format} 560w, ${image.filename}/m/488x366${format} 488w, ${image.filename}/m/288x216${format} 288w, ${image.filename}/m/342x257${format} 342w`}
								width="288"
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
							height="102"
							loading="lazy"
							sizes={`(min-width: 800px) 272px, (min-width: 760px) calc(280vw - 1912px), (min-width: 480px) calc(30.77vw - 12px), calc(50vw - 32px)`}
							src={`${image.filename}/m/132x102${format}`}
							srcSet={`${image.filename}/m/272x204${format} 272w, ${image.filename}/m/216x162${format} 216w, ${image.filename}/m/136x102${format} 136w, ${image.filename}/m/163x122${format} 163w`}
							width="132"
						/>
					</MonetizedLink>
				)
			})}
		</div>
	)
}
