import React from "react";
import { NewFullContent, ContentType } from "../../types/Content";
import { NewContentFeilds } from "../../types/ManageContent";

interface ContentFormProps {
  contentData: NewFullContent,
  setContentData: React.Dispatch<NewFullContent | {
    key: keyof NewContentFeilds;
    value: NewContentFeilds[keyof NewContentFeilds];
    extra?: ContentType | undefined;
  }>,
}

const ContentForm = ({contentData, setContentData}: ContentFormProps) => {

  // --------------------------------------------------------------------------------------------------
  // --------------------------------------------------------------------------------------------------

  let ExtraFeilds;
  
  let {new_base_content, new_extra_content} = contentData;

  if ("project" in new_extra_content) {
    ExtraFeilds = (
      <label>
        Project Status:
        <select name="current_status" value={new_extra_content.project.current_status} onChange={(event) => setContentData({key: "current_status", value: event.target.value, extra: ContentType.Project})}>
          <option value="finished">Finished</option>
          <option value="under_development">Under Dervelopment</option>
        </select>
      </label>
    );
  } else if ("blog" in new_extra_content) {
    ExtraFeilds = (
      <label>
        Blog Tags (Separate with /):
        <input type="text" value={new_extra_content.blog.tags === undefined ? "" : new_extra_content.blog.tags.join("/")} onChange={(event) => setContentData({key:"tags", value: event.target.value === "" ? undefined : event.target.value.split("/"), extra: ContentType.Blog })}/>
      </label>
    );
  }

  // --------------------------------------------------------------------------------------------------
  // --------------------------------------------------------------------------------------------------

  return (
    <form>
      <fieldset name="new_base_content">
        <label>
          Title:
          <input type="text" value={new_base_content.title} onChange={(event) => setContentData({key: "title", value: event.target.value})}/>
        </label>
        <label>
          Slug:
          <input type="text" value={new_base_content.slug} onChange={(event) => setContentData({key: "slug", value: event.target.value})}/>
        </label>
        <label>
          Description:
          <input type="text" value={new_base_content.content_desc === undefined ? "" : new_base_content.content_desc} onChange={(event) => setContentData({key: "content_desc", value: event.target.value === "" ? undefined : event.target.value})}/>
        </label>
        <label>
          Body:
          <textarea value={new_base_content.body} onChange={(event) => setContentData({key: "body", value: event.target.value})}/>
        </label>
        <label>
          Content Type:
          <select value={new_base_content.content_type} onChange={(event) => setContentData({key: "content_type", value: event.target.value})}>
            <option value="blog">Blog</option>
            <option value="project">Project</option>
          </select>
        </label>
      </fieldset>
      <fieldset name="new_extra_content">
        {ExtraFeilds}
      </fieldset>
    </form>
  )
}

export default ContentForm;