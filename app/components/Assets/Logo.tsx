import { type SVGProps } from 'react'
import config from '../../config'
import sprite from '../../sprites/sprite.svg'

const {
	svg: { defaults },
} = config

function Logo(props: SVGProps<SVGSVGElement>) {
	return (
		<svg {...defaults} {...props} xmlnsXlink="http://www.w3.org/1999/xlink">
			<use xlinkHref={`${sprite}#logo-full`} />
		</svg>
	)
}

export default Logo
