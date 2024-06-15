import { Link } from '@remix-run/react'
import { storyblokEditable ,
	type ISbStoryData,
} from '@storyblok/react'
import config from '../config'

const {
	img: { format },
} = config

const Autor = ({ blok }: { blok: ISbStoryData }) => {
	return (
		<div {...storyblokEditable(blok?.content)} key={blok?.content?._uid}>
			<Link className="group block flex-shrink-0" to={`/${blok?.full_slug}`}>
				<div className="flex items-center">
					<div>
						<img
							alt={blok?.content?.Nome}
							className="inline-block h-16 w-16 rounded-full"
							height="63"
							sizes={`63px`}
							src={`${blok?.content?.Foto?.filename}/m/63x62${format}`}
							srcSet={`${blok?.content?.Foto?.filename}/m/63x63${format} 63w`}
							width="63"
						/>
					</div>
					<div className="ml-3">
						<p className="text-gray-700 group-hover:text-gray-900 text-sm">
							por <span className="font-bold">{blok?.content?.Nome}</span>
						</p>
						<p className="text-gray-500 group-hover:text-gray-700 text-xs font-medium">
							Ver perfil
						</p>
					</div>
				</div>
			</Link>
		</div>
	)
}

export default Autor
