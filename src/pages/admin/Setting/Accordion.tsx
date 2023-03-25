import { getClientAccountName } from "../../../services/clientName";
import {
  Component,
  createEffect,
  createMemo,
  createResource,
  createSignal,
  For,
  Show,
} from "solid-js";
import { API_BASE_URL, PUBLIC_API_BASE_URL } from "@/constants";
import { notionRenderValue } from "@/utils/notionRenderValue";
import { getValue } from "@/services/storage";

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

const Accordion: Component<{ currentRelation?: Record<string, any> }> = (
  props
) => {
  const currentRelationId = createMemo(() => {
    return props.currentRelation?.relationId;
  });
  const currentRelationName = createMemo(() => {
    return props.currentRelation?.name;
  });
  const initValueProperties = {};
  const [configListProperties, setConfigListProperties] =
    createSignal<Record<string, { hidden: boolean }>>(initValueProperties);
  const [configAddProperties, setConfigAddProperties] =
    createSignal<Record<string, { hidden: boolean }>>(initValueProperties);
  const [configEditProperties, setConfigEditProperties] =
    createSignal<Record<string, { hidden: boolean }>>(initValueProperties);
  const [configPublicApi, setConfigPublicApi] = createSignal({
    publicApiListRecordActiveOfRelation: false,
    publicApiDetailRecordActiveOfRelation: false,
  });
  const [configurationId, setConfigurationId] = createSignal();

  const getConfiguration = async (relationId: string) => {
    try {
      const result = await fetch(API_BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          userId: getValue("user")?.id,
        },
        body: JSON.stringify({
          query: `{
            getPropertiesConfigOfRelation(relationId:"${relationId}") {
                        property_names
                        configuration {
                          id
                          properties
                          object
                          parent
                        }
                    }
                  }`,
        }),
      }).then((res) => res.json());
      return result.data?.getPropertiesConfigOfRelation;
    } catch (error) {
      console.log("error", error);
      return null;
    }
  };

  const [configuration] = createResource(currentRelationId, () =>
    getConfiguration(currentRelationId())
  );

  createEffect(() => {
    if (configuration.loading) {
      // console.log("loading");
    } else {
      const detail = configuration();
      // console.log('detail', detail);
      if (detail) {
        setConfigurationId(detail.configuration.id);
        let dataConfig = notionRenderValue(
          detail.configuration?.properties?.configuration
        );
        try {
          dataConfig = JSON.parse(dataConfig);
        } catch (error) {
          dataConfig = {};
        }
        // console.log('dataConfig', dataConfig);
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
        setConfigPublicApi(dataConfig.publicApi || {});
      }
    }
  });

  const [isSaving, setIsSaving] = createSignal(false);
  const onSave = async () => {
    try {
      setIsSaving(true);
      const configuration = {
        listProperties: configListProperties(),
        addProperties: configAddProperties(),
        editProperties: configEditProperties(),
        publicApi: configPublicApi(),
      };
      const result = await fetch(API_BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          userId: getValue("user")?.id,
        },
        body: JSON.stringify({
          query: `mutation configPropertiesRelation($configPropertiesRelationInput: ConfigPropertiesRelationInput!) { 
            configPropertiesRelation(configPropertiesRelationInput: $configPropertiesRelationInput) {
                id 
                object
              }
            }
          `,
          variables: {
            configPropertiesRelationInput: {
              relationName: currentRelationName(),
              relationId: currentRelationId(),
              configuration,
            },
          },
        }),
      }).then((res) => res.json());
      console.log("result", result);
      if (result.data) {
        setConfigurationId(result.data.configPropertiesRelation.id);
        alert("Save successfully");
      } else {
        throw new Error(result.errors?.[0]?.message || "Save failed");
      }
    } catch (error) {
      console.log("error", error);
      alert("Save failed: " + JSON.stringify(error));
    } finally {
      setIsSaving(false);
    }
  };

  const onCopy = (value: any) => {
    navigator.clipboard.writeText(value).then(() => alert("Copy successfully"));
  };

  return (
    <div>
      {configuration.loading ? (
        <div class="flex items-center justify-between w-full p-5 font-medium text-left text-gray-900 bg-gray-100 border border-gray-200 rounded-t-xl dark:focus:ring-gray-800 dark:border-gray-700 dark:text-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800">
          <span>LOADING...</span>
        </div>
      ) : (
        <div id="accordion-arrow-icon" data-accordion="open">
          <div class="border border-gray-700 p-4 rounded-xl mb-6">
            <h1 class="dark:text-white mb-2 font-bold text-xl">
              Config Properties
            </h1>
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
                <For each={configuration().property_names}>
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
                <For each={configuration().property_names}>
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
              <div class="p-5 font-light border rounded-b-xl border-gray-200 dark:border-gray-700 dark:bg-gray-900">
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
                <For each={configuration().property_names}>
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
              </div>
            </div>
          </div>

          <div class="border border-gray-700 p-4 rounded-xl">
            <h1 class="dark:text-white mb-2 font-bold text-xl mt-6">
              Config Public API
            </h1>
            <div class="w-full p-5 text-left text-gray-900 bg-gray-100 border border-gray-200 rounded-xl font-light dark:border-gray-700 dark:bg-gray-900">
              <div
                class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white mb-4"
                role="tabpanel"
              >
                <h1 class="text-xl mb-2">Public Records Active Of Relation</h1>
                <div
                  class="grid"
                  style={{ "grid-template-columns": "100px 1fr" }}
                >
                  <label
                    for="checked-checkbox"
                    class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Is Public
                  </label>
                  <div class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                    URL
                  </div>
                </div>
                <div class="w-full h-[1px] bg-gray-400 my-4"></div>
                <div
                  class="grid mb-4 mx-2"
                  style={{ "grid-template-columns": "100px 1fr" }}
                >
                  <div class="">
                    <input
                      checked={
                        configPublicApi().publicApiListRecordActiveOfRelation
                      }
                      onClick={() =>
                        setConfigPublicApi((prevValue) => ({
                          ...prevValue,
                          publicApiListRecordActiveOfRelation:
                            !prevValue.publicApiListRecordActiveOfRelation,
                        }))
                      }
                      type="checkbox"
                      value=""
                      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                  <Show when={!!configurationId()}>
                    <div
                      class="grid gap-2"
                      style={{ "grid-template-columns": "1fr 30px" }}
                    >
                      <div class="text-xs">
                        <span class="bg-blue-100 text-white text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 ">
                          {`${PUBLIC_API_BASE_URL}/public/${configurationId()}/${currentRelationId()}`}
                        </span>
                      </div>
                      <span
                        class="cursor-pointer"
                        onClick={() =>
                          onCopy(
                            `${PUBLIC_API_BASE_URL}/public/${configurationId()}/${currentRelationId()}`
                          )
                        }
                      >
                        Copy
                      </span>
                    </div>
                  </Show>
                </div>
              </div>
              <div
                class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white"
                role="tabpanel"
              >
                <h1 class="text-xl mb-2">
                  Public Detail Record Active Of Relation
                </h1>
                <div
                  class="grid"
                  style={{ "grid-template-columns": "100px 1fr" }}
                >
                  <label
                    for="checked-checkbox"
                    class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Is Public
                  </label>
                  <div class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                    URL
                  </div>
                </div>
                <div class="w-full h-[1px] bg-gray-400 my-4"></div>
                <div
                  class="grid mb-4 mx-2"
                  style={{ "grid-template-columns": "100px 1fr" }}
                >
                  <div class="">
                    <input
                      checked={
                        configPublicApi().publicApiDetailRecordActiveOfRelation
                      }
                      onClick={() =>
                        setConfigPublicApi((prevValue) => ({
                          ...prevValue,
                          publicApiDetailRecordActiveOfRelation:
                            !prevValue.publicApiDetailRecordActiveOfRelation,
                        }))
                      }
                      type="checkbox"
                      value=""
                      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                  <Show when={!!configurationId()}>
                    <div
                      class="grid gap-2"
                      style={{ "grid-template-columns": "1fr 30px" }}
                    >
                      <div class="text-xs">
                        <span class="bg-blue-100 text-white text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 ">
                          {`${PUBLIC_API_BASE_URL}/public/${configurationId()}/${currentRelationId()}/:recordId`}
                        </span>
                      </div>
                      <span
                        class="cursor-pointer"
                        onClick={() =>
                          onCopy(
                            `${PUBLIC_API_BASE_URL}/public/${configurationId()}/${currentRelationId()}/:recordId`
                          )
                        }
                      >
                        Copy
                      </span>
                    </div>
                  </Show>
                </div>
              </div>
            </div>
          </div>

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
      )}
    </div>
  );
};

export default Accordion;
