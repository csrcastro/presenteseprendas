import { Link } from '@remix-run/react'
import { type ISbStoryData } from '@storyblok/react'
import config from '../../config'
import RichTitle from '../Helpers/RichTitle'

const {
	img: { format },
} = config

export default function IdeiasCarouselLarge({
	ideias,
	containerClasses,
	heading,
}: {
	ideias: ISbStoryData[]
	heading: string
	containerClasses: string
	headingClasses: string
}) {
	if (ideias.length <= 0) {
		return null
	}

	return (
		<section className={`${containerClasses} mx-auto max-w-7xl`}>
			<h3 className="sr-only">{heading}</h3>
			<ul className="g-c">
				{ideias.map(ideia => {
					const fl = ideia?.content?.Image?.filename
					return (
						<li className="g-c-div" key={`f-c-s-${ideia.uuid}`}>
							<Link
								className="g-c-div-lk"
								to={`${ENV.BASE_URL}/${ideia.full_slug.replace(/\/$/, '')}`}
							>
								<img
									alt={ideia.content.Title}
									className="g-c-div-img"
									height="145"
									sizes="(min-width: 1360px) 341px, (min-width: 1040px) calc(24.33vw + 15px), (min-width: 780px) calc(25vw - 15px), (min-width: 640px) calc(26.67vw - 15px), (min-width: 480px) calc(66.43vw - 36px), calc(58.75vw - 36px)"
									src={`${fl}/m/161x120${format}`}
									srcSet={`${fl}/m/341x260${format} 341w, ${fl}/m/389x292${format} 389w, ${fl}/m/332x249${format} 332w, ${fl}/m/244x183${format} 244w, ${fl}/m/268x201${format} 268w, ${fl}/m/193x145${format} 193w`}
									width="193"
									loading="eager"
								/>
								<div className="g-c-div-div">
									<div>
										<strong className="font-heading g-c-div-div-h3">
											<RichTitle document={ideia.content.Title} />
										</strong>

										<span className="g-c-div-div-p">
											{ideia.content?.ShortDescription}
										</span>
									</div>
								</div>
							</Link>
						</li>
					)
				})}
			</ul>
		</section>
	)
}
