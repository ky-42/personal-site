import React from "react";
import styled from "styled-components";

import { Blog } from "../../types/Content";
import { ShortTextInput } from "./InputElements";
import { ReducerAction, SetReducer, UpdateReducer } from "../../types/ManageContent";
import InputArea from "./InputArea";

const BlogManagmentArea = styled.div``;

interface blogManagmentProps {
  blogData: Blog,
  setBlogData: React.Dispatch<
    SetReducer<Blog> | UpdateReducer<Blog, keyof Blog>
  >
}

const BlogManagment = ({blogData, setBlogData}: blogManagmentProps) => {
  
  return (
    <BlogManagmentArea>
      <InputArea
        lableText={"Blog Tags (separate with '/')"}
        InputElement={
          <ShortTextInput
            type="text"
            value={blogData.tags?.join("/")}
            onChange={
              e => setBlogData({
                action: ReducerAction.Update,
                field: "tags",
                value: e.target.value.split("/")
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