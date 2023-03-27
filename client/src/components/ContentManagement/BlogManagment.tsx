import React, { useEffect } from "react";
import styled from "styled-components";

import { Blog } from "../../types/Content";
import { EnterButton, InputButtonHolder, ShortTextInput } from "./InputElements";
import { ReducerAction, SetReducer, UpdateReducer } from "../../types/ManageContent";
import InputArea from "./InputArea";
import { AiOutlineRight } from "react-icons/ai";
import Tag from "./Tag";

/* ---------------------------- Styled Components --------------------------- */

const BlogManagmentArea = styled.div``;

const IdHolder = styled.p`
  text-align: center;
`;

const TextButton = styled(EnterButton)`
  width: auto;
  padding: 1rem;
  margin: 0;
  margin-left: 1rem;
`;

const TagsList = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  row-gap: 1rem;
  column-gap: 1rem;
  max-width: 80rem;
`;

/* -------------------------------------------------------------------------- */

interface blogManagmentProps {
  blogData: Blog,
  setBlogData: React.Dispatch<
    SetReducer<Blog> | UpdateReducer<Blog, keyof Blog>
  >,
  // Possible errors in an input with key being feild and value being error message
  validationErrors: Record<string, string>
}

// Form part for inputing data about the blog specific parts of content
const BlogManagment = ({blogData, setBlogData, validationErrors}: blogManagmentProps) => {
  
  // Needs to be moves to parent
  const [tags, setTags] = React.useState<Set<string>>(new Set());
  
  const [currentTag, setCurrentTag] = React.useState<string>("");
  
  const removeTag = (tag: string) => {
    setTags(current => {current.delete(tag); return new Set(current);});
  }
  
  return (
    <BlogManagmentArea>
      <InputArea
        lableText={"Tags"}
        InputElement={
          <div>
            <InputButtonHolder>
              <ShortTextInput
                type="text"
                value={currentTag}
                onChange={e => setCurrentTag(e.target.value)}
              />
              <TextButton 
                onClick={e => {
                  setTags(current => {current.add(currentTag); return new Set(current)});
                  setCurrentTag("");
                }}
              >
                Add
              </TextButton>
            </InputButtonHolder>
            <br />
            <TagsList>
              {Array.from(tags).map(tag => {
                return <Tag tagString={tag} removeTag={removeTag} />
              })}
            </TagsList>
          </div>
        }
      />

      <InputArea
        lableText={"Slug of Related Project"}
        error={validationErrors["realated_project_id"]}
        InputElement={
          <div>
            <InputButtonHolder>
              <ShortTextInput
                type="text"
                // value={}
                // onChange={}
              />
              <EnterButton 
                // onClick={}
              >
                <AiOutlineRight />
              </EnterButton>
            </InputButtonHolder>
            <InputButtonHolder>
              <IdHolder>{`Id of Related Project: ${1}`}</IdHolder>
              <TextButton 
                // onClick={}
              >
                Clear
              </TextButton>
            </InputButtonHolder>
          </div>
        }
      />

      <InputArea
        lableText={"Title of Devblog"}
        error={validationErrors["devblog_id"]}
        InputElement={
          <div>
            <InputButtonHolder>
              <ShortTextInput
                type="text"
                // value={}
                // onChange={}
              />
              <EnterButton 
                // onClick={}
              >
                <AiOutlineRight />
              </EnterButton>
            </InputButtonHolder>
            <InputButtonHolder>
              <IdHolder>{`Id of Devblog: ${1}`}</IdHolder>
              <TextButton 
                // onClick={}
              >
                Clear
              </TextButton>
            </InputButtonHolder>
          </div>
        }
      />
    </BlogManagmentArea>
  )
}

export default BlogManagment;