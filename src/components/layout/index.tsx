import { children } from "solid-js";
import ProtectedComponent from "../base/ProtectedComponent";
import Header from "./Header";
import Sidebar from "./Sidebar";

type Props = {
  [k: string]: any;
};
const AdminLayout = (props: Props) => {
  const child = children(() => props.children);
  return (
    <div>
      <Header />
      <Sidebar />

      <div class="p-4 sm:ml-64 h-[calc(100vh)] bg-[#e4e4e7]">
        <div class="p-4 border-2 bg-white rounded-lg mt-14">{child()}</div>
      </div>
    </div>
  );
};

export default AdminLayout;
