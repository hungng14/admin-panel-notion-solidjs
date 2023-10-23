import AdminLayout from "@/components/layout";
import { createRelation, getDetailRelation } from "@/services/relation";
import { A, useParams } from "@solidjs/router";
import {
  Component,
  createEffect,
  createMemo,
  createResource,
  Index,
} from "solid-js";

const ViewRelation: Component<{}> = (props) => {
  const params = useParams();
  const [data] = createResource(() => getDetailRelation(params.relationId));
  const properties = createMemo(() => {
    if (data.loading) return [];
    if (data()) {
      return Object.keys(data().properties).map((prop) => ({
        name: prop,
      }));
    }
    return [];
  });

  return (
    <AdminLayout>
      <div class="flex justify-between gap-4">
        <h1 class="text-2xl font-bold">Detail of relation</h1>
      </div>
      <div class="w-full h-[1px] bg-gray-400 my-4"></div>
      {data.loading ? (
        <h3 class="p-2 text-gray-200 dark:text-whit dark:hover:bg-gray-700">
          Loading...
        </h3>
      ) : (
        <div>
          <form>
            <div class="relative z-0 w-full mb-6 group">
              <label
                for={"relation_name"}
                class="block mb-2 text-sm font-medium text-gray-900"
              >
                Relation Name
              </label>
              <input
                type="text"
                name={"relation_name"}
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                placeholder=""
                required
                value={data().name}
                readOnly
              />
            </div>
            <div class="relative z-0 w-full mb-6 group">
              <label
                for={"relation_name"}
                class="block mb-2 text-sm font-medium text-gray-900"
              >
                Created At
              </label>
              <input
                type="text"
                name={"created_time"}
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                placeholder=""
                required
                value={new Date(data().created_time).toLocaleString()}
                readOnly
              />
            </div>
            <div class="relative z-0 w-full mb-6 group">
              <label
                for={"relation_name"}
                class="block mb-2 text-sm font-medium text-gray-900"
              >
                Last Updated At
              </label>
              <input
                type="text"
                name={"last_edited_time"}
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                placeholder=""
                required
                value={new Date(data().last_edited_time).toLocaleString()}
                readOnly
              />
            </div>
            <div class="flex justify-between gap-4 items-center">
              <h1 class="text-xl font-bold">List Properties</h1>
            </div>
            <Index each={properties()}>
              {(prop, index) => (
                <div
                  class="grid gap-4"
                  style={{ "grid-template-columns": "1fr 50px" }}
                >
                  <div class="relative z-0 w-full mb-6 group">
                    <label
                      for={prop().name}
                      class="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Property Name
                    </label>
                    <input
                      type="text"
                      name={prop().name}
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                      placeholder=" "
                      required
                      value={prop().name}
                      readOnly
                    />
                  </div>
                </div>
              )}
            </Index>
            <div class="w-full h-[1px] bg-gray-400 my-4"></div>
            <A
              href="/admin/config-relation"
              class=" text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Back To List
            </A>
          </form>
        </div>
      )}
    </AdminLayout>
  );
};

export default ViewRelation;
