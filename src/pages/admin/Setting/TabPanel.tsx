import { Component, createEffect, createSignal, Show } from "solid-js";
import Accordion from "./Accordion";

const TabPanel: Component<any> = (props) => {
  const [currentTab, setCurrentTab] = createSignal(1);
  console.log("props", props);

  createEffect(() => {
    console.log("currentTab", currentTab());
  });

  return (
    <>
      <div class="mb-4 border-b border-gray-200 dark:border-gray-700">
        <ul
          class="flex flex-wrap -mb-px text-sm font-medium text-center"
          id="myTab"
          data-tabs-toggle="#myTabContent"
          role="tablist"
        >
          <li class="mr-2" role="presentation">
            <button
              class="inline-block p-4 rounded-t-lg"
              classList={{
                "active text-blue-600 border-blue-600 border-b-2":
                  currentTab() === 1,
                "text-gray-700": currentTab() !== 1,
              }}
              type="button"
              role="tab"
              aria-selected="false"
              onClick={() => setCurrentTab(1)}
            >
              Configuration
            </button>
          </li>
        </ul>
      </div>
      <div>
        <Show when={currentTab() === 1}>
          <div
            class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800"
            role="tabpanel"
          >
            <Accordion currentRelation={props.currentRelation} />
          </div>
        </Show>
      </div>
    </>
  );
};

export default TabPanel;
