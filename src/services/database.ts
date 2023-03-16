import { API_BASE_URL, NOTION_CLIENT_NAME } from "../constants";
import { getClientAccountName } from "./clientName";

export type ListDatabases = Record<string, any>[]
export const getListDatabases = async (): Promise<ListDatabases> => {
  try {
    const result = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        NotionClientName: getClientAccountName(),
      },
      body: JSON.stringify({
        query: `{
              databases {
                object
                results {
                    id
                    title {
                        plain_text
                    }
                    description {
                        plain_text
                    }
                    object
                    properties
                }
            }
          }`,
      }),
    }).then((res) => res.json());
    return result.data.databases.results;
  } catch (error) {
    return [];
  }
};


export const getAddPropertiesOfDatabase = async (databaseId: string): Promise<Record<string, any>> => {
  try {
    const result = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        NotionClientName: getClientAccountName(),
      },
      body: JSON.stringify({
        query: `{
          getAddProperties(databaseId: "${databaseId}") {
              id
              object
              properties
              title {
                  plain_text
              }
              description {
                  plain_text
              }
            }
          }`,
      }),
    }).then((res) => res.json());
    console.log('result.data.getAddProperties', result.data.getAddProperties);
    return result.data.getAddProperties;
  } catch (error) {
    return [];
  }
};
