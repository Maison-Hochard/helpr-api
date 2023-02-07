export type createItemInDatabaseInput = {
  databaseId: string;
  title: string;
  description: string;
};

export type createDatabaseInput = {
  pageId: string;
  title: string;
  description: string;
};

export type createComment = {
  pageId: string;
  text: string;
};
