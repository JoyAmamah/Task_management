import type { SEOProps } from "../Types/types";
import { Helmet } from "react-helmet-async";
import screenshot from "../assets/Screenshot 1.png";


const DEFAULTS = {
  title: "Tasks Tracker App",
  description: "View and manage all your tasks in one place",
  image: screenshot, 
  url: "https://tasks-trackerapp.netlify.app/",
};

const SEO = ({ title, description, image, url }: SEOProps) => {
  const metaTitle = title || DEFAULTS.title;
  const metaDescription = description || DEFAULTS.description;
  const metaImage = image || DEFAULTS.image;
  const metaUrl = url || DEFAULTS.url;

  return (
    <Helmet>
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />

      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:url" content={metaUrl} />
      <meta property="og:type" content="website" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />
    </Helmet>
  );
};

export default SEO;
