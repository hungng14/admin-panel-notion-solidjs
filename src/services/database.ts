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
