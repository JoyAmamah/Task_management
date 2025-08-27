import { useEffect } from "react";
import screenshot from "../assets/Screenshot 1.png";
import type { SEOProps } from "../Types/types";

const DEFAULTS = {
  title: "Tasks Tracker App",
  description: "View and manage all your tasks in one place",
  image: screenshot,
  url: "https://tasks-trackerapp.netlify.app/",
};

const SEO = ({ title, description, image, url }: SEOProps) => {
  useEffect(() => {
    const metaTitle = title || DEFAULTS.title;
    const metaDescription = description || DEFAULTS.description;
    const metaImage = image || DEFAULTS.image;
    const metaUrl = url || DEFAULTS.url;

    // Title
    document.title = metaTitle;

    // Description
    let descTag = document.querySelector("meta[name='description']");
    if (!descTag) {
      descTag = document.createElement("meta");
      descTag.setAttribute("name", "description");
      document.head.appendChild(descTag);
    }
    descTag.setAttribute("content", metaDescription);

    // Open Graph
    const setOG = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property='${property}']`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("property", property);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    setOG("og:title", metaTitle);
    setOG("og:description", metaDescription);
    setOG("og:image", metaImage);
    setOG("og:url", metaUrl);
    setOG("og:type", "website");

    // Twitter
    const setTwitter = (name: string, content: string) => {
      let tag = document.querySelector(`meta[name='${name}']`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", name);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    setTwitter("twitter:card", "summary_large_image");
    setTwitter("twitter:title", metaTitle);
    setTwitter("twitter:description", metaDescription);
    setTwitter("twitter:image", metaImage);
  }, [title, description, image, url]);

  return null; // nothing to render
};

export default SEO;
