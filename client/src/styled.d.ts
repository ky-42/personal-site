// Type definitions for styled-components so that you get
// type checking and autocompletion of the theme in styled components.

// client/src/styled.d.ts
import "styled-components";
import type { Theme } from "./config/AppConfig"; // your theme type

declare module "styled-components" {
  export interface DefaultTheme extends Theme {}
}
