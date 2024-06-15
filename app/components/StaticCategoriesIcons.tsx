import { Link } from '@remix-run/react'
import { type ISbStoryData } from '@storyblok/react'
import { type JSXElementConstructor, type ReactElement, type SVGProps } from 'react'
import Casa from './Assets/Material/Casa'
import Desporto from './Assets/Material/Desporto'
import Familia from './Assets/Material/Familia'
import Moda from './Assets/Material/Moda'
import Saude from './Assets/Material/Saude'
import Tecnologia from './Assets/Material/Tecnologia'

const icons: Record<
	string,
	({ className }: SVGProps<SVGSVGElement>) => ReactElement
> = {
	Casa,
	Desporto,
	Tecnologia,
	Saúde: Saude,
	Moda,
	Família: Familia,
}

export default function StaticCategoriesIcons({
	categorias,
}: {
	categorias: ISbStoryData[]
}) {
	return (
		<div className="sm:hidden">
			<section className="mx-auto max-w-xl pb-16 pt-16">
				<h2 className="sr-only">Categorias</h2>
				<ul className="cl-grid">
					{categorias.map((categoria: ISbStoryData) => {
						const Icon:
							| (({
									className,
							  }: SVGProps<SVGSVGElement>) => ReactElement<
									any,
									string | JSXElementConstructor<any>
							  >)
							| undefined = icons[categoria.name]
						return (
							<li key={categoria.name} className="cl-grid-li group">
								<div className="mb-4 h-12 w-12 overflow-hidden">
									{Icon ? <Icon className="cl-grid-li-i" /> : null}
								</div>

								<h3 className="cl-grid-li-h">
									<Link
										to={`${ENV.BASE_URL}/${categoria.full_slug.replace(
											/\/$/,
											'',
										)}`}
									>
										<span aria-hidden="true" className="absi-0 z-10" />
										{categoria.name}
									</Link>
								</h3>
							</li>
						)
					})}
				</ul>
			</section>
		</div>
	)
}
