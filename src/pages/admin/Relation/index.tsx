import AdminLayout from "@/components/layout";
import { Component, createResource, For, Index } from "solid-js";
import { A, useParams } from "@solidjs/router";
import { API_BASE_URL } from "@/constants";
import { notionRenderValue } from "@/utils/notionRenderValue";

type ListDatabase = {
  keys: string[];
  list: Record<string, any>[];
};

const getListDataOfRelation = async (
  relationId: string
): Promise<ListDatabase> => {
  try {
    const result = await (
      await fetch(API_BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `{
            getListRecordsOfRelation(relationId: "${relationId}") {
            object
            has_more
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
    const list = result.data?.getListRecordsOfRelation?.results || [];
    const keys: string[] = Object.keys(list[0]?.properties || {});
    console.log(keys);
    return {
      list,
      keys,
    };
  } catch (error) {
    console.log("error", error);
    return {
      list: [],
      keys: [],
    };
  }
};

const Relation: Component<{}> = (props) => {
  const params = useParams();
  const [data, { refetch }] = createResource(
    () => params.relationId,
    getListDataOfRelation
  );

  return (
    <AdminLayout>
      <div class="flex justify-between gap-4">
        <h1 class="text-2xl font-bold">List</h1>
        {!data.loading && (
          <A
            href={`/admin/relation/${params.relationId}/add`}
            class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          >
            Add
          </A>
        )}
      </div>

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
                <th class="px-6 py-3 w-52">Action</th>
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
                      <th>
                        <A
                          href={`/admin/relation/${params.relationId}/edit/${item.id}`}
                        >
                          Edit
                        </A>
                      </th>
                    </tr>
                  )}
                </For>
              ) : (
                <tr>
                  <td>
                    <h2 class="text-2xl py-4 px-2">
                      There no data is displayed
                    </h2>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
};

export default Relation;
