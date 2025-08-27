type OpenGraph = {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  type?: "website" | "article";
  siteName?: string;
};

type Props = {
  title: string;
  description?: string;
  canonical?: string;
  noindex?: boolean;
  og?: OpenGraph;
  twitterImage?: string;
  jsonLd?: Record<string, unknown>;
};

export default function SEO({
  title,
  description,
  canonical,
  noindex,
  og = {},
  twitterImage,
  jsonLd,
}: Props) {
  return (
    <>
      {/* Basic */}
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      {canonical && <link rel="canonical" href={canonical} />}
      {noindex && <meta name="robots" content="noindex,follow" />}

      {/* Open Graph */}
      {og.title && <meta property="og:title" content={og.title} />}
      {og.description && <meta property="og:description" content={og.description} />}
      {og.url && <meta property="og:url" content={og.url} />}
      {og.image && <meta property="og:image" content={og.image} />}
      <meta property="og:type" content={og.type || "website"} />
      {og.siteName && <meta property="og:site_name" content={og.siteName} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      {twitterImage && <meta name="twitter:image" content={twitterImage} />}
      <meta name="twitter:title" content={og.title || title} />
      {description && <meta name="twitter:description" content={description} />}

      {/* Structured data */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
    </>
  );
}
