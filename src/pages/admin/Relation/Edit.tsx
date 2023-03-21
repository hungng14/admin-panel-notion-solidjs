import AdminLayout from "@/components/layout";
import {
  getPropertiesConfigOfRelation,
  updateRecordOfRelation,
  getRecordOfRelation,
  deleteRecordOfRelation,
} from "@/services/relation";
import { useParams, useNavigate } from "@solidjs/router";
import {
  Component,
  createEffect,
  createResource,
  createSignal,
  Index,
} from "solid-js";

const EditRecordOfRelation: Component<{}> = (props) => {
  const params = useParams();
  const navigate = useNavigate();
  const [properties] = createResource(() =>
    getPropertiesConfigOfRelation(params.relationId, "editProperties")
  );
  const [detail] = createResource(() => getRecordOfRelation(params.recordId));

  const [values, setValues] = createSignal<Record<string, string>>({});
  const [loading, setLoading] = createSignal(false);
  const [deleteLoading, setDeleteLoading] = createSignal(false);
  createEffect(() => {
    if (detail.loading || properties.loading) return;
    const newValue = (properties() || []).reduce(
      (obj: Record<string, any>, prop: Record<string, any>) => {
        obj[prop.prop] =
          detail().properties?.[prop.prop]?.[prop.type]?.[0]?.plain_text;
        return obj;
      },
      {}
    );
    setValues(newValue);
  });
  const onSave = async (e: any) => {
    try {
      e.preventDefault();
      if (loading() || deleteLoading()) return;
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
      console.log("dataSaved", dataSaved);
      const result = await updateRecordOfRelation(params.recordId, dataSaved);
      console.log("values", result);
      alert("Updated successfully");
      setLoading(false);
    } catch (error: any) {
      console.log("error", error);
      alert("Update failed: " + error.message);
      setLoading(false);
    }
  };

  const onDelete = async (e: any) => {
    try {
      e.preventDefault();
      setDeleteLoading(true);

      const result = await deleteRecordOfRelation(params.recordId);
      console.log("values", result);
      alert("Deleted successfully");
      navigate(`/admin/relation/${params.relationId}`);
      setDeleteLoading(false);
    } catch (error: any) {
      console.log("error", error);
      alert("Delete failed: " + error.message);
      setDeleteLoading(false);
    }
  };

  return (
    <AdminLayout>
      <h1 class="text-2xl font-bold">Edit record</h1>
      <div class="w-full h-[1px] bg-gray-400 my-4"></div>
      <div>
        {properties.loading || detail.loading ? (
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
              disabled={loading() || deleteLoading()}
              class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mr-4"
            >
              {loading() ? "Updating..." : "Update"}
            </button>
            <button
              type="button"
              disabled={loading() || deleteLoading()}
              onClick={onDelete}
              class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
            >
              {deleteLoading() ? "Deleting..." : "Delete"}
            </button>
          </form>
        ) : (
          <></>
        )}
      </div>
    </AdminLayout>
  );
};

export default EditRecordOfRelation;
