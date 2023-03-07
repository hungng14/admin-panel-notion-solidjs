import { getClientAccountName } from "../../../services/clientName";
import {
  Component,
  createEffect,
  createMemo,
  createResource,
  createSignal,
  For,
} from "solid-js";
import { API_BASE_URL } from "../../../constants";
import { notionRenderValue } from "../../../utils/notionRenderValue";

const ArrowIcon = () => (
  <svg
    data-accordion-icon
    class="w-6 h-6 shrink-0"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z"
    ></path>
  </svg>
);

const Accordion: Component<{ currentDatabase?: Record<string, any> }> = (
  props
) => {
  const properties = createMemo(() => {
    if (props.currentDatabase) {
      return Object.keys(props.currentDatabase.properties);
    }
    return [];
  });
  const currentDatabaseId = createMemo(() => {
    return props.currentDatabase?.id;
  });
  const initValueProperties = properties().reduce(
    (obj: Record<string, { hidden: boolean }>, key: string) => (
      (obj[key] = { hidden: false }), obj
    ),
    {}
  );
  const [configListProperties, setConfigListProperties] =
    createSignal<Record<string, { hidden: boolean }>>(initValueProperties);
  const [configAddProperties, setConfigAddProperties] =
    createSignal<Record<string, { hidden: boolean }>>(initValueProperties);
  const [configEditProperties, setConfigEditProperties] =
    createSignal<Record<string, { hidden: boolean }>>(initValueProperties);

  const getConfiguration = async (databaseId: string) => {
    try {
      const result = await fetch(API_BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          NotionClientName: getClientAccountName(),
        },
        body: JSON.stringify({
          query: `{
                    getPropertiesConfiguration(databaseId:"${databaseId}") {
                        id
                        properties
                        object
                        parent
                    }
                  }`,
        }),
      }).then((res) => res.json());
      return result.data?.getPropertiesConfiguration;
    } catch (error) {
      console.log("error", error);
      return null;
    }
  };

  const [configuration] = createResource(currentDatabaseId, () =>
    getConfiguration(currentDatabaseId())
  );

  createEffect(() => {
    if (configuration.loading) {
      console.log("loading");
    } else {
      const detail = configuration();
      if (detail) {
        let dataConfig = notionRenderValue(detail.properties?.Configuration);
        try {
          dataConfig = JSON.parse(dataConfig);
        } catch (error) {
          dataConfig = {};
        }
        setConfigListProperties((prevValue) => ({
          ...prevValue,
          ...(dataConfig.listProperties || {}),
        }));
        setConfigAddProperties((prevValue) => ({
          ...prevValue,
          ...(dataConfig.addProperties || {}),
        }));
        setConfigEditProperties((prevValue) => ({
          ...prevValue,
          ...(dataConfig.editProperties || {}),
        }));
      }
    }
  });

  const [isSaving, setIsSaving] = createSignal(false);
  const onSave = async () => {
    try {
      setIsSaving(true);
      const configToString = JSON.stringify({
        listProperties: configListProperties(),
        addProperties: configAddProperties(),
        editProperties: configEditProperties(),
      });
      const result = await fetch(API_BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          NotionClientName: getClientAccountName(),
        },
        body: JSON.stringify({
          query: `mutation configProperties($configPropertiesInput: ConfigPropertiesInput!) { 
            configProperties(configPropertiesInput: $configPropertiesInput) {
                id 
                object
              }
            }
          `,
          variables: {
            configPropertiesInput: {
              databaseId: currentDatabaseId(),
              configuration: configToString,
            },
          },
        }),
      }).then((res) => res.json());
      console.log("result", result);
      if (result.data) {
        alert("Save successfully");
      } else {
        throw new Error(result.errors?.[0]?.message || 'Save failed');
      }
    } catch (error) {
      console.log("error", error);
      alert("Save failed: " + JSON.stringify(error));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      {configuration.loading ? (
        <div class="flex items-center justify-between w-full p-5 font-medium text-left text-gray-900 bg-gray-100 border border-gray-200 rounded-t-xl dark:focus:ring-gray-800 dark:border-gray-700 dark:text-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800">
          <span>LOADING...</span>
        </div>
      ) : (
        <div id="accordion-arrow-icon" data-accordion="open">
          <h2>
            <button
              type="button"
              class="flex items-center justify-between w-full p-5 font-medium text-left text-gray-900 bg-gray-100 border border-b-0 border-gray-200 rounded-t-xl dark:focus:ring-gray-800 dark:border-gray-700 dark:text-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800"
              data-accordion-target="#accordion-arrow-icon-body-1"
              aria-expanded="true"
              aria-controls="accordion-arrow-icon-body-1"
            >
              <span>List Properties</span>
              <ArrowIcon />
            </button>
          </h2>
          <div>
            <div class="p-5 font-light border border-b-0 border-gray-200 dark:border-gray-700 dark:bg-gray-900">
              <div
                class="grid"
                style={{ "grid-template-columns": "100px 1fr" }}
              >
                <label
                  for="checked-checkbox"
                  class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  Properties
                </label>
                <div class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                  Hidden
                </div>
              </div>
              <div class="w-full h-[1px] bg-gray-400 my-4"></div>
              <For each={properties()}>
                {(key) => (
                  <div
                    class="grid mb-4"
                    style={{ "grid-template-columns": "100px 1fr" }}
                  >
                    <label
                      for="checked-checkbox"
                      class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      {key}
                    </label>
                    <div class="pl-5">
                      <input
                        checked={!!configListProperties()[key]?.hidden}
                        onClick={() =>
                          setConfigListProperties((prevValue) => ({
                            ...prevValue,
                            [key]: { hidden: !prevValue[key]?.hidden },
                          }))
                        }
                        type="checkbox"
                        value=""
                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>
                  </div>
                )}
              </For>
            </div>
          </div>
          <h2>
            <button
              type="button"
              class="flex items-center justify-between w-full p-5 font-medium text-left text-gray-500 dark:text-white border border-b-0 dark:border-gray-700 dark:text-gray-40 bg-gray-800"
              aria-expanded="false"
              aria-controls="accordion-arrow-icon-body-2"
            >
              <span>Add Properties</span>
              <ArrowIcon />
            </button>
          </h2>
          <div>
            <div class="p-5 font-light border border-b-0 border-gray-200 dark:border-gray-700 dark:bg-gray-900">
              <div
                class="grid"
                style={{ "grid-template-columns": "100px 1fr" }}
              >
                <label
                  for="checked-checkbox"
                  class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  Properties
                </label>
                <div class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                  Hidden
                </div>
              </div>
              <div class="w-full h-[1px] bg-gray-400 my-4"></div>
              <For each={properties()}>
                {(key) => (
                  <div
                    class="grid mb-4"
                    style={{ "grid-template-columns": "100px 1fr" }}
                  >
                    <label
                      for="checked-checkbox"
                      class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      {key}
                    </label>
                    <div class="pl-5">
                      <input
                        checked={!!configAddProperties()[key]?.hidden}
                        onClick={() =>
                          setConfigAddProperties((prevValue) => ({
                            ...prevValue,
                            [key]: { hidden: !prevValue[key]?.hidden },
                          }))
                        }
                        type="checkbox"
                        value=""
                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>
                  </div>
                )}
              </For>
            </div>
          </div>
          <h2 id="accordion-arrow-icon-heading-3">
            <button
              type="button"
              class="flex items-center justify-between w-full p-5 font-medium text-left text-gray-500 border dark:text-white dark:border-gray-700 dark:text-gray-400 bg-gray-800"
              data-accordion-target="#accordion-arrow-icon-body-3"
              aria-expanded="false"
              aria-controls="accordion-arrow-icon-body-3"
            >
              <span>Edit Properties</span>
              <ArrowIcon />
            </button>
          </h2>
          <div>
            <div class="p-5 font-light border border-b-0 border-gray-200 dark:border-gray-700 dark:bg-gray-900">
              <div
                class="grid"
                style={{ "grid-template-columns": "100px 1fr" }}
              >
                <label
                  for="checked-checkbox"
                  class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  Properties
                </label>
                <div class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                  Hidden
                </div>
              </div>
              <div class="w-full h-[1px] bg-gray-400 my-4"></div>
              <For each={properties()}>
                {(key) => (
                  <div
                    class="grid mb-4"
                    style={{ "grid-template-columns": "100px 1fr" }}
                  >
                    <label
                      for="checked-checkbox"
                      class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      {key}
                    </label>
                    <div class="pl-5">
                      <input
                        checked={!!configEditProperties()[key]?.hidden}
                        onClick={() =>
                          setConfigEditProperties((prevValue) => ({
                            ...prevValue,
                            [key]: { hidden: !prevValue[key]?.hidden },
                          }))
                        }
                        type="checkbox"
                        value=""
                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>
                  </div>
                )}
              </For>
              <div class="w-full h-[1px] bg-gray-400 my-4"></div>
              <div>
                <button
                  onClick={!isSaving() ? onSave : undefined}
                  type="button"
                  class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                  {isSaving() ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accordion;
