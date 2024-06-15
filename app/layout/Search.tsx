import {
	Dialog,
	DialogPanel,
	Transition,
	TransitionChild,
} from '@headlessui/react'
import { type Dispatch, Fragment, type SetStateAction, useState } from 'react'

import SearchBox from './SearchBox'

export default function Search({
	open,
	setOpen,
}: {
	open: boolean
	setOpen: Dispatch<SetStateAction<boolean>>
}) {
	const [query, setQuery] = useState('')

	return (
		<Transition
			appear
			afterLeave={() => setQuery('')}
			as={Fragment}
			show={open}
		>
			<Dialog as="div" className="relative z-10" onClose={setOpen}>
				<TransitionChild
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-colder/50 backdrop-blur transition-opacity" />
				</TransitionChild>

				<div className="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20">
					<TransitionChild
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0 scale-95"
						enterTo="opacity-100 scale-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100 scale-100"
						leaveTo="opacity-0 scale-95"
					>
						<DialogPanel className="divide-colder-500 mx-auto max-w-2xl transform divide-y divide-opacity-10 overflow-hidden rounded-xl bg-white bg-opacity-80 shadow-2xl ring-1 ring-black ring-opacity-5 backdrop-blur backdrop-filter transition-all">
							<SearchBox query={query} setQuery={setQuery} />
						</DialogPanel>
					</TransitionChild>
				</div>
			</Dialog>
		</Transition>
	)
}
