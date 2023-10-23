import AdminLayout from "@/components/layout";
import {
  getPropertiesConfigOfRelation,
  addRecordOfRelation,
} from "@/services/relation";
import { useParams } from "@solidjs/router";
import { Component, createResource, createSignal, Index } from "solid-js";

const AddRecordOfRelation: Component<{}> = (props) => {
  const params = useParams();
  const [properties] = createResource(() =>
    getPropertiesConfigOfRelation(params.relationId, "addProperties")
  );

  const [values, setValues] = createSignal<Record<string, string>>({});
  const [loading, setLoading] = createSignal(false);
  const onSave = async (e: any) => {
    try {
      e.preventDefault();
      if(loading()) return;
      setLoading(true);
      const dataSaved = properties().reduce((data: any, prop: any) => {
        const valueOfProp: any = {
          type: prop.type,
        };
        if (prop.type === "title") {
          valueOfProp.title = [
            {
              text: {
                content: values()[prop.prop],
              },
            },
          ];
        } else {
          valueOfProp.rich_text = [
            {
              text: {
                content: values()[prop.prop],
              },
            },
          ];
        }
        data[prop.prop] = valueOfProp;
        return data;
      }, {});
      const result = await addRecordOfRelation(params.relationId, dataSaved);
      alert("Added successfully");
      setValues({});
      setLoading(false);
    } catch (error: any) {
      console.log("error", error);
      alert("Add failed: " + error.message);
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <h1 class="text-2xl font-bold">Add new record</h1>
      <div class="w-full h-[1px] bg-gray-400 my-4"></div>
      <div>
        {properties.loading ? (
          <h3 class="p-2 text-gray-200 dark:text-whit dark:hover:bg-gray-700">
            Loading...
          </h3>
        ) : properties().length ? (
          <form onSubmit={onSave}>
            <Index each={properties()}>
              {(prop) => (
                <div class="relative z-0 w-full mb-6 group">
                  <label
                    for={prop().prop}
                    class="block mb-2 text-sm font-medium text-gray-900"
                  >
                    {prop().prop}
                  </label>
                  <input
                    type="text"
                    name={prop().prop}
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                    placeholder=" "
                    required
                    value={values()[prop().prop] || ""}
                    onChange={(e) => {
                      setValues((prevValues) => ({
                        ...prevValues,
                        [prop().prop]: e.currentTarget.value,
                      }));
                    }}
                  />
                </div>
              )}
            </Index>

            <button
              type="submit"
              disabled={loading()}
              class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              {loading() ? "Adding..." : "Submit"}
            </button>
          </form>
        ) : (
          <></>
        )}
      </div>
    </AdminLayout>
  );
};

export default AddRecordOfRelation;
