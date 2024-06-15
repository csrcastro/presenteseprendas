import { lazy, type PropsWithChildren, Suspense } from 'react'

const Footer = lazy(() => import('./Footer'))
const Header = lazy(() => import('./Header'))

export function Layout({ children }: PropsWithChildren) {
	return (
		<>
			<Suspense fallback={null}>
				<Header />
			</Suspense>
			{children}
			<Suspense fallback={null}>
				<Footer />
			</Suspense>
		</>
	)
}
