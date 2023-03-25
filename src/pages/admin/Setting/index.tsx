import AdminLayout from "../../../components/layout";
import { Component, createEffect, createSignal } from "solid-js";
import SelectTable from "./SelectTable";
import Accordion from "./Accordion";
import TabPanel from "./TabPanel";

const Setting: Component<{}> = (props) => {
  const [currentRelation, setCurrentRelation] = createSignal<Record<string, any>>();
  createEffect(() => {
    console.log("currentRelation", currentRelation());
  });

  return (
    <AdminLayout>
      <SelectTable onSelectTable={setCurrentRelation} />
      <div class="w-full h-[1px] bg-slate-600 mb-8 mt-8"></div>
      {currentRelation() && <TabPanel currentRelation={currentRelation()} />}
    </AdminLayout>
  );
};

export default Setting;
