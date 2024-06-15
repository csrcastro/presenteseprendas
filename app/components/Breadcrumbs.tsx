import { ChevronRightIcon, HomeIcon } from '@heroicons/react/20/solid'
import { Link } from '@remix-run/react'
import {
	type ISbStoryData,
} from '@storyblok/react'
import { memo } from 'react'

const Breadcrumbs = memo(function Breadcrumbs({
	category,
}: {
	category: ISbStoryData
}) {
	return (
		<nav
			aria-label="Navegação em categorias"
			className="flex text-xs text-text-light"
		>
			<ol className="p-y-3 flex space-x-1 lg:space-x-2">
				<li className="flex">
					<div className="flex items-center">
						<Link className="hover:text-text" to={`${ENV.BASE_URL}`}>
							<HomeIcon aria-hidden="true" className="h-3 w-3 flex-shrink-0" />
							<span className="sr-only">Início</span>
						</Link>
					</div>
				</li>
				{category.content.Parents.sort(
					(a: ISbStoryData, b: ISbStoryData) =>
						a.full_slug.length - b.full_slug.length,
				).map((story: ISbStoryData) => (
					<li key={story.uuid} className="flex">
						<div className="flex items-center">
							<ChevronRightIcon
								aria-hidden="true"
								className="mt-[1px] h-4 w-4 flex-shrink-0"
							/>
							<Link
								aria-current={false ? 'page' : undefined}
								className="font-bold uppercase hover:text-text"
								to={`/${story.full_slug.replace(/\/$/, '')}`}
							>
								{story.content.Title}
							</Link>
						</div>
					</li>
				))}

				<li key={category.uuid} className="flex">
					<div className="flex items-center">
						<ChevronRightIcon
							aria-hidden="true"
							className="mt-[1px] h-4 w-4 flex-shrink-0"
						/>
						<Link
							aria-current={false ? 'page' : undefined}
							className="ml-1 font-bold uppercase hover:text-text"
							to={`/${category.full_slug.replace(/\/$/, '')}`}
						>
							{category.content.Title}
						</Link>
					</div>
				</li>
			</ol>
		</nav>
	)
})

export default Breadcrumbs
