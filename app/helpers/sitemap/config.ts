const config: {
  responseParams: {
    status: number;
    headers: {
      "Content-Type": string;
      "xml-version": string;
      encoding: string;
    };
  };
  storyblokRequestParams: {
    page: number;
    per_page: number;
    version: "draft" | "published" | undefined;
    sort_by: string;
    excluding_fields: string;
  };
} = {
  responseParams: {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
      "xml-version": "1.0",
      encoding: "UTF-8",
    },
  },
  storyblokRequestParams: {
    page: 1,
    per_page: 5,
    version: "published",
    sort_by: "first_published_at:desc",
    excluding_fields: "*",
    
  },
};

export default config;
