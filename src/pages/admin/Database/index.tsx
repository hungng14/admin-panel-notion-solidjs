import AdminLayout from "../../../components/layout";
import { Component, createResource, For, Index } from "solid-js";
import { useParams } from "@solidjs/router";
import { API_BASE_URL, NOTION_CLIENT_NAME } from "../../../constants";
import { notionRenderValue } from "../../../utils/notionRenderValue";
import { getClientAccountName } from "../../../services/clientName";

type ListDatabase = {
  keys: string[];
  list: Record<string, any>[];
};

const getListDataOfDatabase = async (
  databaseId: string
): Promise<ListDatabase> => {
  try {
    const result = await (
      await fetch(API_BASE_URL, {
        method: "POST",
        headers: {
          NotionClientName: getClientAccountName(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `{
          one_database(id: "${databaseId}") {
            object
            results {
                id
                cover
                created_by
                created_time
                icon
                last_edited_by
                object
                last_edited_time
                parent
                properties
                url
            }
          }
        }
        `,
        }),
      })
    ).json();
    const list = result.data?.one_database?.results || [];
    const keys: string[] = Object.keys(list[0]?.properties || {});
    console.log(keys);
    return {
      list,
      keys,
    };
  } catch (error) {
    console.log('error', error);
    return {
      list: [],
      keys: [],
    };
  }
};

const Database: Component<{}> = (props) => {
  const params = useParams();
  const [data, { refetch }] = createResource(
    () => params.databaseId,
    getListDataOfDatabase
  );

  return (
    <AdminLayout>
      <h1 class="text-2xl font-bold">List</h1>
      <div class="w-full h-[1px] bg-gray-400 my-4"></div>
      <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
        {data.loading ? (
          <h3 class="p-2 text-gray-200 dark:text-whit dark:hover:bg-gray-700">
            Loading...
          </h3>
        ) : (
          <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <Index each={(data() as ListDatabase).keys}>
                  {(key) => (
                    <th scope="col" class="px-6 py-3 w-52">
                      {key()}
                    </th>
                  )}
                </Index>
              </tr>
            </thead>
            <tbody>
              {(data() as ListDatabase).keys.length ? (
                <For each={(data() as ListDatabase).list}>
                  {(item, idx) => (
                    <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <Index each={(data() as ListDatabase).keys}>
                        {(key) => (
                          <th
                            scope="row"
                            class="px-6 py-4 font-medium text-gray-900 dark:text-white w-52"
                          >
                            {notionRenderValue(item.properties[key()])}
                          </th>
                        )}
                      </Index>
                    </tr>
                  )}
                </For>
              ) : (
                <tr>
                  <td><h2 class="text-2xl py-4 px-2">There no data is displayed</h2></td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
};

export default Database;
