import { Link } from '@remix-run/react'

import { type SVGProps } from 'react'
import sprite from '../sprites/sprite.svg'

const navigation = {
	main: [
		{ name: 'Guias', to: 'guias-de-presentes' },
		{ name: 'Promoções', to: 'promocoes' },
		{ name: 'Categorias', to: 'categorias' },
		{ name: 'Autores', to: 'autores' },
		{ name: 'Lojas', to: 'lojas' },
		{ name: 'Pesquisa', to: 'pesquisa' },
	],
	pages: [
		{ name: 'Sobre nós', to: 'sobre-nos' },
		{ name: 'Perguntas frequentes', to: 'perguntas-frequentes' },
		{ name: 'Política de Cookies', to: 'politica-de-cookies' },
	],
	social: [
		{
			name: 'Facebook',
			href: 'https://facebook.com/presenteprendas',
			icon: (props: SVGProps<SVGSVGElement>) => (
				<svg
					fill="currentColor"
					viewBox="0 0 24 24"
					{...props}
					xmlnsXlink="http://www.w3.org/1999/xlink"
				>
					<use xlinkHref={`${sprite}#facebook`}></use>
				</svg>
			),
		},
		{
			name: 'Instagram',
			href: 'https://www.instagram.com/presenteseprendas',
			icon: (props: SVGProps<SVGSVGElement>) => (
				<svg
					fill="currentColor"
					viewBox="0 0 24 24"
					{...props}
					xmlnsXlink="http://www.w3.org/1999/xlink"
				>
					<use xlinkHref={`${sprite}#instagram`}></use>
				</svg>
			),
		},
		{
			name: 'X',
			href: 'https://twitter.com/presenteprendas',
			icon: (props: SVGProps<SVGSVGElement>) => (
				<svg
					fill="currentColor"
					viewBox="0 0 24 24"
					{...props}
					xmlnsXlink="http://www.w3.org/1999/xlink"
				>
					<use xlinkHref={`${sprite}#x-twitter`}></use>
				</svg>
			),
		},
		{
			name: 'Youtube',
			href: 'https://www.youtube.com/@presenteseprendas',
			icon: (props: SVGProps<SVGSVGElement>) => (
				<svg
					fill="currentColor"
					viewBox="0 0 24 24"
					{...props}
					xmlnsXlink="http://www.w3.org/1999/xlink"
				>
					<use xlinkHref={`${sprite}#youtube`}></use>
				</svg>
			),
		},
		{
			name: 'Pinterest',
			href: 'https://www.pinterest.pt/presenteseprendas',
			icon: (props: SVGProps<SVGSVGElement>) => (
				<svg
					fill="currentColor"
					viewBox="0 0 24 24"
					{...props}
					xmlnsXlink="http://www.w3.org/1999/xlink"
				>
					<use xlinkHref={`${sprite}#pinterest`}></use>
				</svg>
			),
		},
	],
}

export default function Footer() {
	return (
		<footer className="border-t-8 border-cold bg-colder text-white">
			<nav
				aria-label="Footer"
				className="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8"
			>
				<div className="columns-2 sm:flex sm:justify-center sm:space-x-12">
					{navigation.main.map(item => (
						<div key={item.name} className="pb-6">
							<Link
								className="text-sm leading-6"
								to={`${ENV.BASE_URL}/${item.to.replace(/\/$/, '')}`}
							>
								{item.name}
							</Link>
						</div>
					))}
				</div>
				<div className="columns-2 sm:flex sm:justify-center sm:space-x-12">
					{navigation.pages.map(item => (
						<div key={item.name} className="pb-6">
							<Link
								className="text-sm leading-6"
								to={`${ENV.BASE_URL}/${item.to.replace(/\/$/, '')}`}
							>
								{item.name}
							</Link>
						</div>
					))}
				</div>
				<div className="mt-10 flex justify-center space-x-10">
					{navigation.social.map(item => (
						<a key={item.name} className="" href={item.href}>
							<span className="sr-only">{item.name}</span>
							<item.icon aria-hidden="true" className="h-6 w-6" />
						</a>
					))}
				</div>
				<p className="mt-10 text-center text-xs leading-5">
					presenteseprendas.pt
				</p>
			</nav>
		</footer>
	)
}
