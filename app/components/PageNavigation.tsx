import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import { Link } from '@remix-run/react'

function Ellipsis({ borderColor }: { borderColor: string }) {
	return (
		<span className={`pn-l text-${borderColor} ring-${borderColor} `}>...</span>
	)
}

export default function PageNavigation({
	borderColor,
	containerClasses,
	current,
	hash,
	searchParam,
	textColor,
	total,
	url,
}: {
	borderColor: string
	containerClasses: string
	current: number
	hash?: string
	searchParam: string
	textColor: string
	total: number
	url: URL
}) {
	const prevUrl = new URL(url)
	const nextUrl = new URL(url)

	if (hash) {
		prevUrl.hash = hash
		nextUrl.hash = hash
	}

	if (current > 2) {
		prevUrl.searchParams.set(searchParam, (current - 1).toString())
	} else {
		prevUrl.searchParams.delete(searchParam)
	}

	if (current < total) {
		nextUrl.searchParams.set(searchParam, (current + 1).toString())
	} else {
		nextUrl.searchParams.delete(searchParam)
	}

	return (
		<div className={`${containerClasses} flex items-center justify-between`}>
			<div className="flex flex-1 justify-between sm:hidden">
				<Link
					prefetch="intent"
					to={prevUrl.href}
					className={`pn-l-m text-${textColor} ${
						current === 1
							? `pointer-events-none opacity-50 text-${borderColor}`
							: ` hover:bg-${borderColor}`
					}`}
				>
					<ChevronLeftIcon className="-mt-[2px] h-4 w-4" aria-hidden="true" />{' '}
					Anterior
				</Link>
				<Link
					prefetch="intent"
					to={nextUrl.href}
					className={`pn-l-m text-${textColor} ${
						current === total
							? `pointer-events-none opacity-50 text-${borderColor}`
							: ` hover:bg-${borderColor}`
					}`}
				>
					{'Próximo'}{' '}
					<ChevronRightIcon className="-mt-[2px] h-4 w-4" aria-hidden="true" />
				</Link>
			</div>
			<div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-center">
				<nav
					className="isolate inline-flex -space-x-px rounded-md shadow"
					aria-label="Pagination"
				>
					{current === 1 ? (
						<span
							className={`pn-l rounded-l-md text-${textColor} ring-${borderColor} pointer-events-none opacity-50 text-${borderColor}`}
						>
							<span className="sr-only">Anterior</span>
							<ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
						</span>
					) : (
						<Link
							prefetch="intent"
							to={prevUrl.href}
							className={`pn-l rounded-l-md text-${textColor} ring-${borderColor} hover:bg-${borderColor}`}
						>
							<span className="sr-only">Anterior</span>
							<ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
						</Link>
					)}
					{current > 3 && <Ellipsis borderColor={borderColor} />}
					{[...Array(total).keys()].map(index => {
						const page = new URL(url)

						if (hash) {
							page.hash = hash
						}

						if (!index) {
							page.searchParams.delete(searchParam)
						} else {
							page.searchParams.set(searchParam, (index + 1).toString())
						}

						if (index + 1 < current - 2 || index + 1 > current + 2) {
							return null
						}

						if (index + 1 === current) {
							return (
								<span
									key={index}
									className={`pn-s text-${textColor} ring-${borderColor} bg-${borderColor}`}
								>
									{index + 1}
								</span>
							)
						}

						return (
							<Link
								key={index}
								prefetch="intent"
								to={page.href}
								className={`pn-l text-${textColor} ring-${borderColor} hover:bg-${borderColor}`}
							>
								{index + 1}
							</Link>
						)
					})}

					{current < total - 2 && <Ellipsis borderColor={borderColor} />}

					{current < total ? (
						<Link
							prefetch="intent"
							to={nextUrl.href}
							className={`pn-l rounded-r-md text-${textColor} ring-${borderColor} hover:bg-${borderColor}`}
						>
							<span className="sr-only">{'Próximo'}</span>
							<ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
						</Link>
					) : (
						<span
							className={`pn-l rounded-r-md text-${textColor} ring-${borderColor} pointer-events-none opacity-50 text-${borderColor}`}
						>
							<span className="sr-only">{'Próximo'}</span>
							<ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
						</span>
					)}
				</nav>
			</div>
		</div>
	)
}
