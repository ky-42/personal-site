import React from "react";
import { FullContent } from "../types/Content";

interface ContentItemProps {
  content: FullContent
}

const ContentItem = ({content}: ContentItemProps) => {
  
  const content_type = content.base_content.content_type;

  return (
    <></>
  )
}

export default ContentItem;
