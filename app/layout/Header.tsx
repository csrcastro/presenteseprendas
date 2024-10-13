import { Link, useRouteLoaderData } from '@remix-run/react'
import { type ISbStoryData, type SbBlokData } from '@storyblok/react'
import { useState, lazy, Suspense } from 'react'

import Logo from '../components/Assets/Logo'

import config from '../config'
const {
	svg: { defaults },
} = config

import sprite from '../sprites/sprite.svg'

const Search = lazy(() => import('./Search'))
export default function Header() {
	const { headerNavigation } = useRouteLoaderData('root') as {
		headerNavigation: ISbStoryData
	}

	const [open, setOpen] = useState(false)

	return (
		<header className="border-b-2 border-warm bg-background">
			<nav aria-label="Navegação Principal" className="nv">
				<div className="nv-d">
					<Link
						aria-label="Página inicial da Presentes e Prendas"
						className="mx-auto block w-[52px]"
						to={ENV.BASE_URL}
						title='Presentes e Prendas'
					>
						<span className="sr-only">Presentes e Prendas</span>
						<Logo className="h-6 w-auto fill-warm" />
					</Link>
				</div>
				<div className="relative mt-2 pr-[48px] lg:mt-0 lg:grow lg:pl-[68px]">
					<div className="scroll-hidden flex overflow-y-auto whitespace-nowrap">
						{headerNavigation.content.Sections.map(
							(
								section: SbBlokData & {
									text: string
									Link: { target: string; cached_url: string }
								},
								i: number,
							) => {
								return (
									<Link
										key={section._uid}
										className={`${i > 0 ? 'ml-4' + ' ' : ''}nv-l`}
										target={section.Link.target}
										to={`${ENV.BASE_URL}/${section.Link.cached_url.replace(
											/\/$/,
											'',
										)}`}
									>
										{section.text}
									</Link>
								)
							},
						)}
					</div>
					<button
						className="absolute bottom-0 right-0 top-0 m-auto h-[24px] w-[24px] hover:text-warmer active:outline-none"
						type="button"
						onClick={() => {
							setOpen(true)
						}}
					>
						<span className="sr-only">Mostar painel de pesquisa</span>
						<svg
							{...defaults}
							viewBox="0 0 20 20"
							fill="currentColor"
							aria-hidden="true"
							className="h-6 w-6 fill-black"
							xmlnsXlink="http://www.w3.org/1999/xlink"
						>
							<use xlinkHref={`${sprite}#magnifier`} />
						</svg>
					</button>
				</div>
			</nav>
			{open ? (
				<Suspense fallback={null}>
					<Search open={open} setOpen={setOpen} />
				</Suspense>
			) : null}
		</header>
	)
}
