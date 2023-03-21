import { Component } from "solid-js";
import { Routes, Route } from "@solidjs/router";
import Dashboard from "./pages/admin/Dashboard";
import Relation from "./pages/admin/Relation";
import Setting from "./pages/admin/Setting";
import Start from "./pages/start";
import ProtectedComponent from "./components/base/ProtectedComponent";
import AddRecordRelation from "./pages/admin/Relation/Add";
import EditRecordRelation from "./pages/admin/Relation/Edit";
const App: Component = () => {
  return (
    <>
      <Routes>
        <Route path={"/"} component={Start} />
        <Route path={'/'} component={ProtectedComponent}>
          <Route path={"/admin"} component={Dashboard} />
          <Route path={"/admin/relation/:relationId"} component={Relation} />
          <Route path={"/admin/relation/:relationId/add"} component={AddRecordRelation} />
          <Route path={"/admin/relation/:relationId/edit/:recordId"} component={EditRecordRelation} />
          <Route path={"/admin/setting"} component={Setting} />
        </Route>
        <Route path="*" element={()=> <div>Page Not found!!!</div>} />
      </Routes>
    </>
  );
};

export default App;
