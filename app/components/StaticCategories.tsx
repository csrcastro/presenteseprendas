import { Link } from '@remix-run/react'
import { type ISbStoryData } from '@storyblok/react'
import config from '../config'

const {
	img: { format },
} = config

export default function StaticCategories({
	categorias,
}: {
	categorias: ISbStoryData[]
}) {
	return (
		<div className="bg-cold">
			<section className="mx-auto max-w-7xl">
				<h2 className="heading-large pb-8 text-white">
					Inspira-te
					<span className="sr-only">
						{' '}
						com as nossas categorias de guias de presentes
					</span>
				</h2>
				<p className="mb-16 px-10 text-center text-xs text-white">
					Escolher presentes originais pode ser um desafio, mas com um pouco de
					inspiração e conhecimento sobre as diferentes categorias de presentes,
					a tarefa pode tornar-se muito mais fácil. Lembra-te, o mais importante
					ao escolher um presente é pensar na pessoa que o vai receber.
					<br />
					Considera os seus gostos, interesses e personalidade e de certeza de
					que vais encontrar o presente perfeito.
				</p>
				<ul className="s-c-grid">
					{categorias.map(categoria => {
						return (
							<li key={categoria.content.Title} className="s-c-grid-li group">
								<div className="s-c-grid-li-div">
									<img
										alt={`${
											categoria.content.ImageAlt ||
											`Presentes e prendas: ${categoria.content.Title}`
										}`}
										title={`${
											categoria.content.ImageTitle ||
											`Presentes e prendas - Categoria ${categoria.content.Title}`
										}`}
										className="s-c-grid-li-div-img"
										height="117"
										loading="lazy"
										sizes="(min-width: 1320px) 352px, (min-width: 780px) calc(30vw - 38px), calc(50vw - 64px)"
										src={`${categoria.content.Image?.filename}/m/117x117${format}`}
										srcSet={`${categoria.content.Image?.filename}/m/192x192${format} 192w, ${categoria.content.Image?.filename}/m/277x277${format} 277w, ${categoria.content.Image?.filename}/m/350x350${format} 350w, ${categoria.content.Image?.filename}/m/117x117${format} 117w`}
										width="117"
									/>
									<div className="absi-0 blur-[52px]">
										<div
											className="absi-0 z-10 bg-colder"
											style={{
												clipPath: `polygon(0% 0%, 0% 100%, 5% 100%, 5% 5%, 95% 5%, 95% 95%, 5% 95%, 5% 100%, 100% 100%, 100% 0%)`,
											}}
										/>
									</div>
								</div>

								<div className="s-c-grid-li-div2 group">
									<Link
										to={`${ENV.BASE_URL}/${categoria.full_slug.replace(
											/\/$/,
											'',
										)}`}
										title={categoria.content.ImageTitle}
										className="s-c-grid-li-div2-h3"
									>
										<span aria-hidden="true" className="absi-0 z-10" />
										{categoria.content.Title}
									</Link>
								</div>
							</li>
						)
					})}
				</ul>
			</section>
		</div>
	)
}
