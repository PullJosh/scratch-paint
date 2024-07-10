/*
  Exact class names are provided by typescript-plugin-css-modules
*/
declare module "*.css";

declare module "*.svg" {
  const content: string;
  export default content;
}