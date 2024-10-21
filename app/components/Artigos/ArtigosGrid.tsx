import { Link } from '@remix-run/react'
import { type ISbStoryData } from '@storyblok/react'
import config from '../../config'
import RichContent from '../Helpers/RichContent'

const {
	img: { format },
} = config

const ArtigosGrid = ({
	artigos,
	alt = false,
}: {
	artigos: ISbStoryData[]
	alt?: boolean
}) => {
	return (
		<div className="a-grid">
			{artigos.map((artigo) => (
				<article
					key={artigo.uuid}
					className={`group relative bg-${artigo.content.Title_Background}`}
				>
					<h3>
						<Link
							className={`a-grid-h text-${artigo.content.Title_Color}`}
							aria-label={artigo.content.Title}
							title={`Ler: ${artigo.content.Title}`}
							to={`${ENV.BASE_URL}/${artigo.full_slug.replace(/\/$/, '').replace('pages/', '')}`}
						>
							<span aria-hidden="true" className="absi-0 z-10" />
							{!alt ? (
								<RichContent document={artigo.content.Title} />
							) : (
								<span className="a-grid-s">
									{artigo.content?.ShortDescription || ''}
								</span>
							)}
						</Link>
					</h3>
					<div className="a-grid-a">
						<img
							alt={artigo.content.SeoTitle}
							className="a-grid-a-img"
							height="116"
							loading="lazy"
							sizes={`(min-width: 1360px) 292px, (min-width: 1040px) calc(20vw + 24px), (min-width: 780px) calc(33.33vw - 32px), calc(50vw - 40px)`}
							src={`${artigo?.content?.Image?.filename}/m/155x116${format}`}
							srcSet={`${artigo?.content?.Image?.filename}/m/155x116${format} 155w, ${artigo?.content?.Image?.filename}/m/344x257${format} 344w, ${artigo?.content?.Image?.filename}/m/292x218${format} 292w`}
							width="155"
						/>
					</div>
				</article>
			))}
		</div>
	)
}

export default ArtigosGrid
