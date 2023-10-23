import { getListRelationsOfUser } from "@/services/relation";
import {
  Component,
  createEffect,
  createResource,
  createSignal,
  Index,
} from "solid-js";

type Props = {
  onSelectTable: (data: any) => any;
};

const SelectTable: Component<Props> = (props) => {
  const [currentIdx, setCurrentIdx] = createSignal(-1);
  const [data, { refetch, mutate }] = createResource(getListRelationsOfUser);

  return (
    <div>
      <h2 class="text-2xl text-gray-800 font-bold mb-4">List Database Table</h2>

      <div class="">
        {data.loading ? (
          <h3 class="p-2 text-gray-400 text-2xl dark:text-gray-800">
            Loading...
          </h3>
        ) : (
          <div class="flex flex-wrap gap-6">
            <Index each={data()}>
              {(item, idx) => (
                <div
                  onClick={() => {
                    props.onSelectTable(item());
                    setCurrentIdx(idx);
                  }}
                  class="grid place-content-center w-40 h-40 text-white font-semibold text-2xl rounded-md cursor-pointer border-2 transition-all"
                  style={{
                    background:
                      "linear-gradient(0deg, rgba(34,193,195,1) 0%, rgba(45,142,253,1) 46%, rgba(88,45,253,1) 83%)",
                  }}
                  classList={{
                    ["border-4  border-[#e1e994] scale-105"]: currentIdx() === idx,
                  }}
                >
                  {item().name}
                </div>
              )}
            </Index>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectTable;
