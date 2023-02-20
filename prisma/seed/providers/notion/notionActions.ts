import { prisma } from "../../../seed";

export async function createItemInDatabaseAction(providerId: number) {
  return await prisma.action.create({
    data: {
      title: "Create Item in Database",
      description: "Create an item in a Notion database",
      endpoint: "notion",
      name: "create-item",
      providerId: providerId,
      variables: {
        create: [
          {
            title: "Create Item Database ID",
            name: "notion_item_databaseId",
            value: "{notion_item_databaseId}",
          },
          {
            title: "Create Item Title",
            name: "notion_item_title",
            value: "{notion_item_title}",
          },
          {
            title: "Create Item Description",
            name: "notion_item_description",
            value: "{notion_item_description}",
          },
        ],
      },
    },
  });
}

export async function createDatabaseAction(providerId: number) {
  return await prisma.action.create({
    data: {
      title: "Create Database",
      description: "Create a Notion database",
      endpoint: "notion",
      name: "create-database",
      providerId: providerId,
      variables: {
        create: [
          {
            title: "Create Database Page ID",
            name: "notion_database_pageId",
            value: "{notion_database_pageId}",
          },
          {
            title: "Create Database Title",
            name: "notion_database_title",
            value: "{notion_database_title}",
          },
          {
            title: "Create Database Description",
            name: "notion_database_description",
            value: "{notion_database_description}",
          },
        ],
      },
    },
  });
}

export async function createCommentAction(providerId: number) {
  return await prisma.action.create({
    data: {
      title: "Create Comment",
      description: "Create a comment on a Notion page",
      endpoint: "notion",
      name: "create-comment",
      providerId: providerId,
      variables: {
        create: [
          {
            title: "Create Comment Page ID",
            name: "notion_comment_pageId",
            value: "{notion_comment_pageId}",
          },
          {
            title: "Create Comment Text",
            name: "notion_comment_text",
            value: "{notion_comment_text}",
          },
        ],
      },
    },
  });
}
