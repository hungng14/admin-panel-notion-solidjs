import AdminLayout from "@/components/layout";
import { Component, createResource, For } from "solid-js";
import { A } from "@solidjs/router";
import { getListRelationsOfUser } from "@/services/relation";

const ListRelations: Component<{}> = (props) => {
  const [data, { refetch }] = createResource(getListRelationsOfUser);
  return (
    <AdminLayout>
      <div class="flex justify-between gap-4">
        <h1 class="text-2xl font-bold">List</h1>
        {!data.loading && (
          <A
            href={`/admin/config-relation/add`}
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
                <th class="px-6 py-3 w-52">Relation Name</th>
                <th class="px-6 py-3 w-52">Action</th>
              </tr>
            </thead>
            <tbody>
              {data().length ? (
                <For each={data()}>
                  {(item) => (
                    <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <td class="px-6 py-4 font-medium text-gray-900 dark:text-white w-52">
                        <A
                          href={`/admin/relation/${item.relationId}`}
                          class="hover:underline"
                        >
                          {item.name}
                        </A>
                      </td>
                      <td></td>
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

export default ListRelations;
