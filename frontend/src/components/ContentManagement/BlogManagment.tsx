import React from "react";
import styled from "styled-components";

import { Blog } from "../../types/Content";
import { ShortTextInput } from "./InputElements";
import { ReducerAction, SetReducer, UpdateReducer } from "../../types/ManageContent";
import InputArea from "./InputArea";

/* -------------------------------------------------------------------------- */

const BlogManagmentArea = styled.div``;

/* -------------------------------------------------------------------------- */

interface blogManagmentProps {
  blogData: Blog,
  setBlogData: React.Dispatch<
    SetReducer<Blog> | UpdateReducer<Blog, keyof Blog>
  >,
  // Possiable errors in an input with key being feild and value being error message
  validationErrors: Record<string, string>
}

// Form part for inputing data about the blog specific parts of content
const BlogManagment = ({blogData, setBlogData, validationErrors}: blogManagmentProps) => {
  
  return (
    <BlogManagmentArea>
      <InputArea
        lableText={"Blog Tags (separate with '/')"}
        error={validationErrors["tags"]}
        InputElement={
          <ShortTextInput
            type="text"
            value={blogData.tags?.join("/") || ''}
            onChange={
              e => setBlogData({
                action: ReducerAction.Update,
                field: "tags",
                value: e.target.value.length !== 0 ? e.target.value.split("/") : undefined
            })
            }
          >
          </ShortTextInput>
        }
      />
    </BlogManagmentArea>
  )
}

export default BlogManagment;