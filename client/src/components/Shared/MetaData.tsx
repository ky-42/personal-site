import React from "react";
import { Helmet } from "react-helmet-async";

import jsonConfig from "@config/config.json";
import { useLocation } from "react-router-dom";

interface MetaDataProps {
  title: string,
  description: string,
  type: string,
}

const MetaData = ({title, description, type}: MetaDataProps) => {
  
  const location = useLocation();
  
  return (
    <Helmet>
      {/* TODO Add more open graph meta tags */}

      {/* ------------------------- Standard metadata tags ------------------------- */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="author" content={jsonConfig.name} />
      <link rel="canonical" href={`https://${jsonConfig.productionClientUrl}${location.pathname.replace(/\/$/, '')}`} />

      {/* ------------------------ Open graph metadata tags ------------------------ */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:locale" content="en_US" />

      {/* ------------------------------ Twitter tags ------------------------------ */}
      <meta name="twitter:creator" content={jsonConfig.name} />
      <meta name="twitter:card" content={type} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  )
}

export default MetaData;