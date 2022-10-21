import React, { useState } from "react";
import styled from "styled-components";
import { GetContentPiece } from "../../adapters/content";
import { ContentType, FullContent, NewBlog, NewContent, NewFullContent, NewProject } from "../../types/Content";
import { FullToNewFull } from "../../types/HelperFuncs";
import { NewContentFeilds } from "../../types/ManageContent";
import ContentForm from "./ContentForm";

interface UpdateFormProps {
  contentData: NewFullContent,
  setContentData: React.Dispatch<NewFullContent | {
    key: keyof NewContentFeilds;
    value: NewContentFeilds[keyof NewContentFeilds];
    extra?: ContentType | undefined;
}> 
  setUpdateOriginal: React.Dispatch<React.SetStateAction<FullContent | undefined>>
};

const UpdateFormArea = styled.form`
  
`;

const SlugSubmit = styled.input`
  
`;

const EditDiv = styled.div`
  
`;

const EditTitle = styled.h4`
  
`;

const UpdateForm = ({contentData, setContentData, setUpdateOriginal}: UpdateFormProps) => {
  
  const [updateSlug, setUpdateSlug] = useState("");
  const [gotOgContent, setGotOgContent] = useState(false);
  
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    GetContentPiece({
      slug: updateSlug,
      method: "GET"
    }).then((value) => {
      if (value) {
        setGotOgContent(true);
        setUpdateOriginal(value);
        setContentData(FullToNewFull(value));
      }
    });
  };
  
  if (gotOgContent) {
    return (
      <EditDiv>
        <EditTitle>
          {`Updating ${updateSlug}`}
        </EditTitle>
        <ContentForm contentData={contentData} setContentData={setContentData} />
      </EditDiv>
    );
  };

  return (
    <UpdateFormArea onSubmit={onSubmit}>
      <label>
        Content to update slug:
        <input type="text" value={updateSlug} onChange={(e) => setUpdateSlug(e.target.value)}/>
      </label>
      <SlugSubmit type="submit" value="Submit" />
    </UpdateFormArea>
  );
};

export default UpdateForm;