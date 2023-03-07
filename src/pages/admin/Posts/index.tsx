import AdminLayout from "../../../components/layout";
import { Component } from "solid-js";

const Posts: Component<{}> = (props) => {
  const tags: any[] = [];

  return (
    <AdminLayout>
      <h1 class="text-2xl font-bold">Posts List</h1>
      <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" class="px-6 py-3 w-52">
                Name
              </th>

              <th scope="col" class="px-6 py-3 w-52">
                Created At
              </th>

              <th scope="col" class="px-6 py-3">
                <span class="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {tags.map((tag, idx) => (
              <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th
                  scope="row"
                  class="px-6 py-4 font-medium text-gray-900 dark:text-white w-52"
                >
                  {tag.properties.Name.title}
                </th>

                <td class="px-6 py-4 w-52">{new Date().toDateString()}</td>

                <td class="px-6 py-4 text-right"></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default Posts;
