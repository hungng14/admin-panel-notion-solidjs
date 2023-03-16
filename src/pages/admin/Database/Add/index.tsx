import AdminLayout from "../../../../components/layout";
import { useParams } from "@solidjs/router";
import { Component, createResource, For } from "solid-js";
import { getAddPropertiesOfDatabase } from "../../../../services/database";

const AddRecordDatabase: Component<{}> = (props) => {
  const params = useParams();

  const [data] = createResource(() =>
    getAddPropertiesOfDatabase(params.databaseId)
  );

  return (
    <AdminLayout>
      <div class="mb-10">
        Adding Page To Database: <strong>{params.databaseId}</strong>
      </div>
      {data.loading ? (
        <h3 class="p-2 text-gray-200 dark:text-whit dark:hover:bg-gray-700">
          Loading...
        </h3>
      ) : (
        <div class="border border-gray-400 rounded py-4 px-2">
          <form>
            <For each={Object.keys((data() as any).properties)}>
              {(propName) => {
                const item = (data() as any).properties[propName];
                if(item.type === 'title') {

                }
                if(item.type === 'multi_select') {

                }
                if(item.type === 'rich_text') {

                }
                if(item.type === 'number') {

                }
                if(item.type === 'status') {

                }
                if(item.type === 'url') {
                    
                }
                return (
                    <div class="mb-4">
                      <label
                        for={propName}
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-900"
                      >
                        {propName}
                      </label>
                      <input
                        type="text"
                        id={propName}
                        name={propName}
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="..."
                      />
                    </div>
                  )
              }}
            </For>
          </form>
        </div>
      )}
    </AdminLayout>
  );
};

export default AddRecordDatabase;
