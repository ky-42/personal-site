import React, { useReducer, useState } from "react";
import styled from "styled-components";
import PasswordSubmit from "./PasswordSubmit";
import { Blog, Content, NewBlog, NewContent, NewFullContent, FullContent, NewProject, Project } from "../types/Content";
import { actionTypes } from "../types/ManageContent";
import { ContentAdd, GetContentPeice } from "../adapters/content";

// // TODO add validation and set content_desc to undefined if its equal to ""
// // 

// // Reducers for all types of content
// const baseContentReducer = (state: NewContent | Content, action:{name: keyof Content, value: string}) => {
//   const newState = {...state, [action.name]: action.value};
//   if (action.name == "title" && "slug" in newState) {
//     newState.slug = action.value.replaceAll(" ", "-");
//   }
//   return newState;
// }

// const projectReducer = (state: NewProject | Project, action:{name: keyof Project, value: string}) => {
//   const newState = {...state, [action.name]: action.value};
//   return newState;
// }

// const blogReducer = (state: NewBlog | Blog, action:{name: keyof Blog, value: string | string[]}) => {
//   console.log(action)
//   const newState = {...state, [action.name]: action.value};
//   return newState;
// }

// // Objects used to initalize useReducer
// const baseContentInit: NewContent = {
//   content_type: "",
//   title: "",
//   slug: "",
//   body: ""
// }

// const projectInit: NewProject = {
//   current_status: ""
// }

// const checkUpdate = (baseContent: NewContent | Content, extraContent: BlogWrapper<NewBlog> | ProjectWrapper<NewProject> | BlogWrapper<Blog> | ProjectWrapper<Project>): {baseContent: Content, extraContent: Project | Blog} | undefined => {
//   if ("id" in baseContent && "id" in extraContent) {
//     return {baseContent, extraContent};
//   }
// }

const ContentForm = ({action}: {action: actionTypes}) => {
  
  return(
    <h1>a</h1>
  )
 
  // const [baseContent, setBaseContent] = useReducer(baseContentReducer, baseContentInit);
  // const [blogContent, setBlogContent] = useReducer(blogReducer, {});
  // const [projectContent, setProjectContent] = useReducer(projectReducer, projectInit);
  // const [password, setPassword] = useState("");
 
  // const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   if (action === actionTypes.Create) {
  //     let newExtraContent;
  //     switch (baseContent.content_type) {
  //       case "blog":
  //         newExtraContent = {"Blog": blogContent};
  //         break;
  //       case "project":
  //         newExtraContent = {"Project": projectContent};
  //         break;
  //       default:
  //         newExtraContent = {"Project": projectContent};
  //         break;
  //     }
  //     const addContent: NewFullContent ={
  //       new_base_content: baseContent,
  //       new_extra_content: newExtraContent
  //     } 
  //     ContentAdd({addContent, password}).then((success) => {
  //       window.alert(`Success is equal to ${success}`)
  //     }).catch(() => {
  //       window.alert("Failed")
  //     })
  //   } else if (action === actionTypes.Update) {
  //     let extraContent;
  //     switch (baseContent.content_type) {
  //       case "blog":
  //         extraContent = {"Blog": blogContent};
  //         break;
  //       case "project":
  //         extraContent = {"Project": projectContent};
  //         break;
  //       default:
  //         extraContent = {"Project": projectContent};
  //         break;
  //     }
  //     const checkedUpdate = checkUpdate(baseContent, extraContent);
  //     if (checkedUpdate){
  //       const updateContent: FullContent ={
  //         base_content: checkedUpdate.baseContent,
  //         extra_content: checkedUpdate.extraContent
  //       } 
  //       GetContentPeice({slug: updateContent.base_content.slug, method: "PUT", password, updated_content: updateContent}).then((success) => {
  //         window.alert(`Success is equal to ${success}`)
  //       }).catch(() => {
  //         window.alert("Failed")
  //       })
  //     }
  //   }
  // } 

  // // Adds feilds based on if a project or blog is being entered
  // let ExtraFeilds;
  // if (baseContent.content_type === "Project") {
  //   ExtraFeilds = (
  //     <label>
  //       Project Status:
  //       <select name="current_status" value={projectContent.current_status} onChange={(event) => setProjectContent({name:"current_status", value: event.target.value})}>
  //         <option value=""></option>
  //         <option value="Finished">Finished</option>
  //         <option value="Started">Started</option>
  //       </select>
  //     </label>
  //   );
  // } else if (baseContent.content_type === "Blog") {
  //   ExtraFeilds = (
  //     <label>
  //       Blog Tags:
  //       <input type="text" value={ blogContent.tags === undefined ? "" : blogContent.tags.join("/")} onChange={(event) => setBlogContent({name:"tags", value: event.target.value.split("/")})}/>
  //     </label>
  //   );
  // }

  // return (
  //   <form onSubmit={onSubmit}>
  //     <fieldset name="new_base_content">
  //       <label>
  //         Title:
  //         <input type="text" value={baseContent.title} onChange={(event) => setBaseContent({name: "title", value: event.target.value})}/>
  //       </label>
  //       <label>
  //         Slug:
  //         <input type="text" value={baseContent.slug} onChange={(event) => setBaseContent({name: "slug", value: event.target.value})}/>
  //       </label>
  //       <label>
  //         Description:
  //         <input type="text" value={ baseContent.content_desc === undefined ? "" : baseContent.content_desc} onChange={(event) => setBaseContent({name: "content_desc", value: event.target.value})}/>
  //       </label>
  //       <label>
  //         Body:
  //         <textarea value={baseContent.body} onChange={(event) => setBaseContent({name: "body", value: event.target.value})}/>
  //       </label>
  //       <label>
  //         Content Type:
  //         <select value={baseContent.content_type} onChange={(event) => setBaseContent({name: "content_type", value: event.target.value})}>
  //           <option value=""></option>
  //           <option value="Blog">Blog</option>
  //           <option value="Project">Project</option>
  //         </select>
  //       </label>
  //     </fieldset>
  //     <fieldset name="new_extra_content">
  //       {ExtraFeilds}
  //     </fieldset>
  //     <PasswordSubmit password={password} setPassword={setPassword} />
  //   </form>
  // )
}

export default ContentForm;