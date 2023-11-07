import { Combobox, Dialog, Transition } from '@headlessui/react';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { DocumentPlusIcon, FolderIcon, FolderPlusIcon, HashtagIcon, TagIcon } from '@heroicons/react/24/outline';
import { Fragment, useState } from 'react';

const people = [
  { id: 1, name: 'Leslie Alexander', url: '#' },
  // More people...
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Search({ open, setOpen }) {
  const [query, setQuery] = useState('');

  const filteredPeople =
    query === ''
      ? []
      : people.filter((person) => {
        return person.name.toLowerCase().includes(query.toLowerCase());
      });

  return (
    <Transition.Root appear afterLeave={() => setQuery('')} as={Fragment} show={open}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-colder/50 backdrop-blur transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="divide-colder-500 mx-auto max-w-2xl transform divide-y divide-opacity-10 overflow-hidden rounded-xl bg-white bg-opacity-80 shadow-2xl ring-1 ring-black ring-opacity-5 backdrop-blur backdrop-filter transition-all">
              <Combobox onChange={(person) => (window.location = person.url)}>
                <div className="relative">
                  <MagnifyingGlassIcon
                    aria-hidden="true"
                    className="text-gray-400 pointer-events-none absolute left-4 top-3.5 h-5 w-5"
                  />
                  <Combobox.Input
                    className="text-gray-900 placeholder:text-gray-400 h-12 w-full border-0 bg-transparent pl-11 pr-4 focus:ring-0 sm:text-sm"
                    placeholder="Search..."
                    onChange={(event) => setQuery(event.target.value)}
                  />
                </div>

                {filteredPeople.length > 0 && (
                  <Combobox.Options static className="text-gray-800 max-h-72 scroll-py-2 overflow-y-auto py-2 text-sm">
                    {filteredPeople.map((person) => (
                      <Combobox.Option
                        key={person.id}
                        className={({ active }) =>
                          classNames('cursor-default select-none px-4 py-2', active && 'bg-indigo-600 text-white')
                        }
                        value={person}
                      >
                        {person.name}
                      </Combobox.Option>
                    ))}
                  </Combobox.Options>
                )}

                {query !== '' && filteredPeople.length === 0 && (
                  <p className="text-gray-500 p-4 text-sm">No people found.</p>
                )}
              </Combobox>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
