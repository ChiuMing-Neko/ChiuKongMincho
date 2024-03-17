declare global {
  namespace NodeJS {
    interface ProcessEnv {
      FONT_NAME?: string;
      FONT_VERSION?: string;
      FONT_VARAINTS?: string;
      SOURCE_DIR_NAME?: string;
      FONT_DATA_NAME?: string;
      REF_SOURCE_DIR_NAME?: string;
    }
  }
}

export {};
