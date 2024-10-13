import { Link } from '@remix-run/react'
import { type ISbStoryData } from '@storyblok/react'
import config from '../../config'
import RichTitle from '../Helpers/RichTitle'

const {
	img: { format },
} = config

function HomeGuiasDestaquesTop({ ideia }: { ideia?: ISbStoryData }) {
	if (!ideia) {
		return null
	}
	const fl = ideia?.content?.Image?.filename
	return (
		<div className="group relative overflow-hidden rounded-t-custom border-background bg-gradient-to-tr from-[#FFD3BA] via-[#FFF1C3] to-[#FFCBAB] xs:flex md:border-b-2">
			<img
				alt={ideia.content.Title}
				className="w-full opacity-80 duration-300 group-hover:opacity-100 xs:w-1/2 md:w-4/12"
				height="249"
				sizes="(min-width: 1360px) 384px, (min-width: 1040px) calc(26.67vw + 27px), (min-width: 780px) 33.33vw, (min-width: 480px) calc(50vw - 16px), calc(100vw - 32px)"
				src={`${fl}/m/249x187${format}`}
				srcSet={`${fl}/m/446x335${format} 446w, ${fl}/m/249x187${format} 249w, ${fl}/m/303x228${format} 303w, ${fl}/m/384x288${format} 384w`}
				width="187"
				loading="eager"
			/>
			<div className="flex flex-col justify-center bg-warm p-8 text-background duration-300 group-hover:bg-warmer xs:w-1/2 md:w-8/12">
				<Link
					className="font-serif text-xl group-hover:underline md:text-3xl lg:text-4xl"
					to={`${ENV.BASE_URL}/${ideia.full_slug.replace(/\/$/, '')}`}
				>
					<span aria-hidden="true" className="absi-0 z-10" />
					<RichTitle document={ideia.content.Title} />
				</Link>

				<span className="mt-4 hidden text-sm md:inline lg:text-lg">
					{ideia.content?.ShortDescription}
				</span>
			</div>
		</div>
	)
}

export default function HomeGuiasDestaques({
	ideias,
	containerClasses,
	heading,
	headingClasses = 'sr-only',
}: {
	ideias: ISbStoryData[]
	heading: string
	containerClasses: string
	headingClasses?: string
}) {
	if (ideias.length <= 0) {
		return null
	}

	return (
		<section className={`${containerClasses} mx-auto max-w-7xl`}>
			<h3 className={headingClasses}>{heading}</h3>
			<HomeGuiasDestaquesTop ideia={ideias[0]} />
			<div className="flex flex-wrap">
				{ideias.map((ideia: ISbStoryData, index: number) => {
					const fl = ideia?.content?.Image?.filename

					if (index === 0) {
						return null
					}
					return (
						<div className="group w-1/2 md:w-3/12" key={`f-c-s-${ideia.uuid}`}>
							<Link
								className=""
								to={`${ENV.BASE_URL}/${ideia.full_slug.replace(/\/$/, '')}`}
							>
								<div
									className={`overflow-hidden bg-gradient-to-tr from-[#FFD3BA] via-[#FFF1C3] to-[#FFCBAB] ${
										index === 1 ? 'md:rounded-bl-custom' : ''
									} ${index === 4 ? 'md:rounded-br-custom' : ''}`}
								>
									<img
										alt={ideia.content.Title}
										className="w-full opacity-80 duration-300 group-hover:opacity-100"
										height="140"
										sizes="(min-width: 1360px) 288px, (min-width: 1040px) calc(20vw + 20px), (min-width: 780px) 25vw, calc(50vw - 16px)"
										src={`${fl}/m/187x140${format}`}
										srcSet={`${fl}/m/187x140${format} 187w, ${fl}/m/228x171${format} 228w, ${fl}/m/288x216${format} 288w, ${fl}/m/253x190${format} 253w`}
										width="187"
										loading="lazy"
									/>
								</div>
								<strong className="text-md block p-2 font-serif leading-5 group-hover:underline">
									<RichTitle document={ideia.content.Title} />
								</strong>
							</Link>
						</div>
					)
				})}
			</div>
		</section>
	)
}
