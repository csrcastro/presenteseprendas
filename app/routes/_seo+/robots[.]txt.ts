export const loader = () => {
	const robotText = `User-agent: Googlebot
Disallow: /nogooglebot/

User-agent: *
Allow: /
Disallow: /cdn-cgi
Disallow: /pesquisa
Allow: /pesquisa$
Disallow: /admin
Disallow: /sugestao
Disallow: /users
Disallow: /settings
Disallow: /login
Disallow: /logout
Disallow: /forgot-password
Disallow: /reset-password
Disallow: /signup
Disallow: /onboarding
Disallow: /verify
Disallow: /resources

Sitemap: https://presenteseprendas.pt/sitemap.xml`
	return new Response(robotText, {
		status: 200,
		headers: {
			'Content-Type': 'text/plain',
		},
	})
}
