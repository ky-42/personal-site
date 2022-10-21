import { FullContent, NewFullContent } from "./Content";

type PropType<TObj, TProp extends keyof TObj> = TObj[TProp];

export const FullToNewFull = (conversionData: FullContent): NewFullContent => {
  let unpackedExtra;
  let { id: r1, created_at: r2, updated_at: r3, ...baseRemoved } = conversionData.base_content;
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
