import {
	type LoaderFunctionArgs,
	redirectDocument,
	redirect,
} from '@remix-run/node'

export const loader = async ({
	request,
	params: { loja },
}: LoaderFunctionArgs) => {
	const url = new URL(request.url)
	const search = new URLSearchParams(url.search)

	const destination = search.get('destino')

	if (destination) {
		return redirectDocument(destination, 307)
	}

	if (loja) {
		return redirect('/lojas/' + loja)
	}

	return redirect('/')
}
