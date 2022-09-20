import React, { useReducer } from "react";
import styled from "styled-components";
import { NewContent, NewContentFeilds } from "../types/Content";
import { actionTypes } from "../types/ManageContent";

interface ContentFormProps {
  action: actionTypes
};

interface reducerAction {
  name: NewContentFeilds,
  value: string
};

// TODO add validation and set content_desc to undefined if its equal to ""

const baseContentReducer = (state: NewContent, action: reducerAction) => {
  const newState = {...state, [action.name]: action.value};
  switch (action.name) {
    case NewContentFeilds.title:
      newState.slug = action.value.replaceAll(" ", "-");
  }
  return newState;
}

const baseContentInit: NewContent = {
  content_type: "",
  title: "",
  slug: "",
  body: ""
}

const ContentForm = ({ action }: ContentFormProps) => {
 
  const [baseContent, setBaseContent] = useReducer(baseContentReducer, baseContentInit);
  // const [extraContent, setExtraContent] = useReducer();

  return (
    <form>
      <fieldset name="new_base_content">
        <label>
          Title:
          <input type="text" name="title" value={baseContent.title} onChange={(event) => setBaseContent({name: NewContentFeilds.title, value: event.target.value})}/>
        </label>
        <label>
          Slug:
          <input type="text" name="slug" value={baseContent.slug} onChange={(event) => setBaseContent({name: NewContentFeilds.slug, value: event.target.value})}/>
        </label>
        <label>
          Description:
          <input type="text" name="content_desc" value={ baseContent.content_desc == undefined ? "" : baseContent.content_desc} onChange={(event) => setBaseContent({name: NewContentFeilds.content_desc, value: event.target.value})}/>
        </label>
        <label>
          Body:
          <textarea name="body" value={baseContent.body} onChange={(event) => setBaseContent({name: NewContentFeilds.body, value: event.target.value})}/>
        </label>
        <label>
          Content Type:
          <select name="content_type" value={baseContent.content_type} onChange={(event) => setBaseContent({name: NewContentFeilds.content_type, value: event.target.value})}>
            <option value="Blog">Blog</option>
            <option value="Project">Project</option>
          </select>
        </label>
      </fieldset>
      <fieldset name="new_extra_content">
        <label>
          Project Status:
          <select name="current_status">
            <option value="Finished">Finished</option>
            <option value="Started">Started</option>
          </select>
        </label>
        <label>
          Blog Tags:
          <input type="text" name="tags" />
        </label>
      </fieldset>

    </form>

  )
}

export default ContentForm;