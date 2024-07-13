// Exact class names are provided by typescript-plugin-css-modules
declare module "*.css";

declare module "*.svg" {
    const content: string;
    export default content;
}

declare module "scratch-l10n/locales/paint-editor-msgs" {
    const messages: {
        [locale: string]: {
            [id: string]: string;
        };
    };
    export default messages;
}