import { Link } from '@remix-run/react'
import { type ISbStoryData } from '@storyblok/react'

export default function IdeiasCarousel({
	ideias,
	containerClasses,
	heading,
}: {
	ideias: ISbStoryData[]
	containerClasses: string
	heading: string
}) {
	if (ideias.length <= 0) {
		return null
	}

	return (
		<section>
			<div className={containerClasses}>
				<h3 className="sr-only">{heading}</h3>
				<div className="mx-auto max-w-7xl">
					<ul className="scroll-hidden hide-sb flex snap-x snap-mandatory gap-x-6 overflow-x-auto pb-2">
						{ideias.map((ideia: ISbStoryData) => (
							<li
								className="w-full flex-shrink-0 snap-center"
								key={`featured-category-slider-${ideia.uuid}`}
							>
								<Link
									aria-label={ideia.name}
									className="flex h-full flex-col overflow-hidden rounded-lg bg-white shadow-lg sm:flex-row"
									to={`${ENV.BASE_URL}/${ideia.full_slug.replace(/\/$/, '')}`}
								>
									<img
										alt={ideia.content.Title}
										className="aspect-[4/3] sm:h-auto sm:w-2/5 md:w-1/3"
										loading="lazy"
										src={ideia?.content?.Image?.filename}
									/>

									<div className="flex items-center px-4 py-2 sm:w-3/5 md:w-2/3 lg:p-8">
										<strong className="text-lg font-bold leading-tight text-colder md:text-xl lg:text-4xl">
											{ideia.content.Title}
										</strong>

										<span className="mt-1 leading-snug lg:mt-4 lg:text-xl">
											{ideia.content?.ShortDescription}
										</span>
									</div>
								</Link>
							</li>
						))}
					</ul>
				</div>
			</div>
		</section>
	)
}
