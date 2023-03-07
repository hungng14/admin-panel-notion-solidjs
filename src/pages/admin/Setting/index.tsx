import AdminLayout from "../../../components/layout";
import { Component, createEffect, createSignal } from "solid-js";
import SelectTable from "./SelectTable";
import Accordion from "./Accordion";

const Setting: Component<{}> = (props) => {
  const [currentDatabase, setCurrentDatabase] = createSignal<Record<string, any>>();
  createEffect(() => {
    console.log("currentDatabase", currentDatabase());
  });

  return (
    <AdminLayout>
      <SelectTable onSelectTable={setCurrentDatabase} />
      <div class="w-full h-[1px] bg-slate-600 mb-8 mt-8"></div>
      {currentDatabase() && <Accordion currentDatabase={currentDatabase()} />}
    </AdminLayout>
  );
};

export default Setting;
