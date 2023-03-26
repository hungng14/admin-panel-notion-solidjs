import AdminLayout from "@/components/layout";
import { createRelation } from "@/services/relation";
import { Component, createSignal, Index } from "solid-js";

const AddRelation: Component<{}> = (props) => {
  const [relationName, setRelationName] = createSignal("");
  const [properties, setProperties] = createSignal<
    { name: string; type: string }[]
  >([]);

  const [loading, setLoading] = createSignal(false);
  const onSave = async (e: any) => {
    try {
      e.preventDefault();
      if (loading()) return;
      setLoading(true);

      const result = await createRelation({
        name: relationName(),
        properties: properties(),
      });
      alert("Added successfully");
      setProperties([]);
      setRelationName("");
      setLoading(false);
    } catch (error: any) {
      console.log("error", error);
      alert("Add failed: " + error.message);
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div class="flex justify-between gap-4">
        <h1 class="text-2xl font-bold">Add new relation</h1>
      </div>
      <div class="w-full h-[1px] bg-gray-400 my-4"></div>
      <div>
        <form onSubmit={onSave}>
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
              value={relationName()}
              onChange={(e) => {
                setRelationName(e.currentTarget.value);
              }}
            />
          </div>
          <div class="flex justify-between gap-4 items-center">
            <h1 class="text-xl font-bold">List Properties</h1>
            <button
              type="button"
              disabled={loading()}
              onClick={() =>
                setProperties((prevValues) => [
                  ...prevValues,
                  {
                    name: "",
                    type: prevValues.length === 0 ? "title" : "rich_text",
                  },
                ])
              }
              class="text-white bg-blue-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            >
              Add More Property
            </button>
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
                    onChange={(e) => {
                      setProperties((prevValues) =>
                        prevValues.map((item, idx) => {
                          if (idx === index) {
                            item.name = e.currentTarget.value;
                          }
                          return item;
                        })
                      );
                    }}
                  />
                </div>
                <span
                  class="mt-8 cursor-pointer"
                  onClick={() => {
                    setProperties((prevValues) =>
                      prevValues.filter((prop, idx) => idx !== index)
                    );
                  }}
                >
                  <svg
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    class="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-red-400 group-hover:text-red-900 dark:group-hover:text-white"
                  >
                    <path
                      clip-rule="evenodd"
                      fill-rule="evenodd"
                      d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
                    ></path>
                  </svg>
                </span>
              </div>
            )}
          </Index>
          <div class="w-full h-[1px] bg-gray-400 my-4"></div>
          <button
            type="submit"
            disabled={loading()}
            class=" text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            {loading() ? "Adding..." : "Submit"}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AddRelation;
