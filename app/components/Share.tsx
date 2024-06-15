import * as pkg from 'react-share'
const {
	FacebookShareButton,
	PinterestShareButton,
	TwitterShareButton,
	WhatsappShareButton,
} = pkg

import { useHydrated } from '../hooks/useHydrated'

import Facebook from './Assets/Social/Facebook'
import Pinterest from './Assets/Social/Pinterest'
import Twitter from './Assets/Social/Twitter'
import Whatsapp from './Assets/Social/Whatsapp'

export default function Share({ image }: { image: string }) {
	return !useHydrated() ? null : (
		<div className="shadow-xs grid h-12 grid-cols-4 gap-0">
			<FacebookShareButton
				className="flex items-center justify-center rounded-l-custom bg-[#1877F2]"
				resetButtonStyle={false}
				url={window.location.href}
			>
				<Facebook aria-hidden="true" className="h-10 w-auto fill-white" />
			</FacebookShareButton>
			<TwitterShareButton
				className="-ml-px flex items-center justify-center bg-[#1DA1F2]"
				resetButtonStyle={false}
				url={window.location.href}
			>
				<Twitter aria-hidden="true" className="h-10 w-auto fill-white" />
			</TwitterShareButton>
			<PinterestShareButton
				className="-ml-px flex items-center justify-center bg-[#BD081C]"
				media={`${image}/m/580x580/smart/filters:format(webp)`}
				resetButtonStyle={false}
				url={window.location.href}
			>
				<Pinterest aria-hidden="true" className="h-10 w-auto fill-white" />
			</PinterestShareButton>
			<WhatsappShareButton
				className="-ml-px flex items-center justify-center rounded-r-custom bg-[#25D366]"
				resetButtonStyle={false}
				url={window.location.href}
			>
				<Whatsapp aria-hidden="true" className="h-10 w-auto fill-white" />
			</WhatsappShareButton>
		</div>
	)
}
