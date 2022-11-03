import { FullContent, NewFullContent } from "./Content";

// Converts a full content object to a new full content object
// Basically it will remove all data thats added by the backend
export const FullToNewFull = (conversionData: FullContent): NewFullContent => {
  let unpackedExtra;
  // Removes unneeded properties from the base content
  let { id: r1, created_at: r2, updated_at: r3, ...baseRemoved } = conversionData.base_content;
  
  // Unpacks the extra content then removes the unneeded properties based
  // on type of content is in the extra content
  if ("project" in conversionData.extra_content) {
    let extra_content = conversionData.extra_content.project;
    let {id: r1, content_id: r2, ...extraRemoved} = extra_content;
    unpackedExtra = {"project": extraRemoved};
  } else {
    let extra_content = conversionData.extra_content.blog;
    let {id: r1, content_id: r2, ...extraRemoved} = extra_content;
    unpackedExtra = {"blog": extraRemoved};
  }

  return {
    new_base_content: baseRemoved,
    new_extra_content: unpackedExtra
  };
}
