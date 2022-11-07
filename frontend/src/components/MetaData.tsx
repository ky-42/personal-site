import React from "react";
import { Helmet } from "react-helmet-async";

interface MetaDataProps {
  title: string,
  description: string,
  type: string,
}

const MetaData = ({title, description, type}: MetaDataProps) => {
  return (
    <Helmet>
      {/* TODO Add more open graph meta tags */}

      {/* ------------------------- Standard metadata tags ------------------------- */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="author" content={process.env.REACT_APP_AUTHOR_NAME} />

      {/* ------------------------ Open graph metadata tags ------------------------ */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:locale" content="en_US" />

      {/* ------------------------------ Twitter tags ------------------------------ */}
      <meta name="twitter:creator" content={process.env.REACT_APP_AUTHOR_NAME} />
      <meta name="twitter:card" content={type} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  )
}