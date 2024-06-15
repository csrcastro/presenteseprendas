import { Combobox, ComboboxInput } from '@headlessui/react'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/20/solid'
import { Link, useFetcher } from '@remix-run/react'

import { type ISbStories } from '@storyblok/react'
import debounce from 'lodash.debounce'
import { type SetStateAction, type Dispatch } from 'react'

export default function SearchBox({
	query,
	setQuery,
}: {
	query: string
	setQuery: Dispatch<SetStateAction<string>>
}) {
	const fetcher = useFetcher<{
		guias: ISbStories['data']
		promocoes: ISbStories['data']
	}>()

	const reset = () => {
		fetcher.load(`/pesquisa-reset`)
	}

	const search = debounce((query = '') => {
		setQuery(query)
		if (query.trim() !== '' && query.length < 3) {
			fetcher.load(`/pesquisa-reset`)
		} else {
			fetcher.load(`/pesquisa?pesquisa=${query}`)
		}
	}, 500)

	return (
		<>
			<Combobox>
				<div className="relative">
					<MagnifyingGlassIcon
						aria-hidden="true"
						className="text-gray-400 pointer-events-none absolute left-4 top-3.5 h-5 w-5"
					/>
					<ComboboxInput
						className="text-gray-900 placeholder:text-gray-400 h-12 w-full border-0 bg-transparent pl-11 pr-11 focus:ring-0 sm:text-sm"
						placeholder="Pesquisa aqui..."
						onChange={event => search(event.target.value)}
					/>
					{query.length > 2 && (
						<XMarkIcon
							aria-hidden="true"
							className="text-gray-400 absolute right-4 top-3.5 h-5 w-5 hover:cursor-pointer"
							onClick={() => reset()}
						/>
					)}
				</div>
				{query.trim() !== '' &&
				query.length > 2 &&
				fetcher.data &&
				fetcher.data.guias.stories.length < 1 &&
				fetcher.data.promocoes.stories.length < 1 ? (
					<p className="text-gray-500 p-4 text-sm">
						Nenhum resultado encontrado
					</p>
				) : null}
			</Combobox>

			{query.length > 2 && fetcher.data ? (
				<div className="overflow-hidden">
					<ul role="list" className="divide-gray-300 divide-y">
						{[
							...(fetcher.data.guias.stories || []),
							...(fetcher.data.promocoes.stories || []),
						].map(story => (
							<li
								key={story.id}
								className="group flex items-center px-6 py-4 group-hover:bg-white"
							>
								<img
									className="mr-4 h-12 w-12 grow-0 rounded-[7px] object-fill"
									src={story.content.Image.filename}
									alt={story.content.Title}
								/>
								<Link
									to={`${ENV.BASE_URL}/${story.full_slug.replace(/\/$/, '')}`}
									className="grow-1 font-bold hover:text-contrast"
									reloadDocument
								>
									{story.content.Title}
								</Link>
							</li>
						))}
					</ul>
				</div>
			) : null}
		</>
	)
}
