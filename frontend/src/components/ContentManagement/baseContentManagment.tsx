
import React from "react";
import styled from "styled-components";

import { Content } from "../../types/Content";
import { InputGroup, LongTextInput, ShortTextInput } from "./InputElements";
import InputArea from "./InputArea";
import { ReducerAction, SetReducer, UpdateReducer } from "../../types/ManageContent";

/* -------------------------------------------------------------------------- */

const BaseContentManagmentArea = styled.div``;

/* -------------------------------------------------------------------------- */

interface baseContentManagmentProps {
  baseContentData: Content,
  setBaseContentData: React.Dispatch<
    SetReducer<Content> | UpdateReducer<Content, keyof Content>
  >
}

// Form part for inputing the data about the base content
const BaseContentManagment = ({baseContentData, setBaseContentData}: baseContentManagmentProps) => {
  
  return (
    <BaseContentManagmentArea>
      <InputGroup>
        <InputArea
          lableText={"Title"}
          InputElement={
            <ShortTextInput
              type="text"
              value={baseContentData.title}
              onChange={
                e => setBaseContentData({
                  action: ReducerAction.Update,
                  field: "title",
                  value: e.target.value
                })
              }
            />
          }
        />
          
        <InputArea
          lableText={"Slug"}
          InputElement={
            <ShortTextInput
              type="text"
              value={baseContentData.slug}
              onChange={
                e => setBaseContentData({
                  action: ReducerAction.Update,
                  field: "slug",
                  value: e.target.value
                })
              }
            />
          }
        />

        <InputArea
          lableText={"Description"}
          InputElement={
            <ShortTextInput
              type="text"
              value={baseContentData.content_desc}
              onChange={
                e => setBaseContentData({
                  action: ReducerAction.Update,
                  field: "content_desc",
                  value: e.target.value
                })
              }
            />
          }
        />
      </InputGroup>

    <InputArea
      lableText={"Content Body (Markdown)"}
      InputElement={
        <LongTextInput
          value={baseContentData.body}
          onChange={
            e => setBaseContentData({
              action: ReducerAction.Update,
              field: "body",
              value: e.target.value
            })
          }
        />
      }
    />
    </BaseContentManagmentArea>
  )
}

export default BaseContentManagment;