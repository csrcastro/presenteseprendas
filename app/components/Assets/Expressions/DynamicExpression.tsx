import {
	type JSXElementConstructor,
	type ReactElement,
	type SVGProps,
} from 'react'
import Omg from '../../Assets/Expressions/Omg'
import Top from '../../Assets/Expressions/Top'
import Uau from '../../Assets/Expressions/Uau'

const components: Array<
	({ className }: SVGProps<SVGSVGElement>) => ReactElement
> = [Uau, Top, Omg]

function getRandomInt(min: number, max: number) {
	min = Math.ceil(min)
	max = Math.floor(max)
	return Math.floor(Math.random() * (max - min + 1)) + min
}

export default function DynamicExpression({
	className,
}: {
	className: string
}): ReactElement | null {
	const random: number = getRandomInt(0, 2)

	const Comp:
		| (({
				className,
		  }: SVGProps<SVGSVGElement>) => ReactElement<
				any,
				string | JSXElementConstructor<any>
		  >)
		| undefined = components[random]

	if (!Comp) {
		return null
	}

	return <Comp className={className} />
}
