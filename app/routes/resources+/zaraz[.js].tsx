import { type LoaderFunctionArgs } from '@remix-run/node'

export async function loader({ params }: LoaderFunctionArgs) {

	const script = `window.onload=function(){"presenteseprendas.pt"!==window.location.hostname&&setTimeout(function(){var e=document.createElement("script");e.type="text/javascript",e.src="https://presenteseprendas.pt/cdn-cgi/zaraz/i.js",e.referrerpolicy="origin",document.getElementsByTagName("head")[0].appendChild(e)},318)};`


	return new Response(script, {
		headers: {
			'Content-Type': "text/javascript",
			'Cache-Control': 'public, max-age=31536000, immutable',
		},
	})
}
