export const loader = () => {
  const robotText = `
        User-agent: Googlebot
        Disallow: /nogooglebot/
        
        User-agent: *
        Allow: /
        Disallow: /pesquisa
    
        Sitemap: https://presenteseprendas.pt/sitemap.xml
        Sitemap: https://www.presenteseprendas.pt/sitemap.xml
        `;
  return new Response(robotText, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
    },
  });
};
