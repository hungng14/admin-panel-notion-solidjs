import { Component } from "solid-js";
import { Routes, Route } from "@solidjs/router";
import Dashboard from "./pages/admin/Dashboard";
import Relation from "./pages/admin/Relation";
import Setting from "./pages/admin/Setting";
import Start from "./pages/start";
import ProtectedComponent from "./components/base/ProtectedComponent";
import AddRecordRelation from "./pages/admin/Relation/Add";
import EditRecordRelation from "./pages/admin/Relation/Edit";
import ListRelations from "./pages/admin/ConfigRelation";
import AddRelation from "./pages/admin/ConfigRelation/Add";
import ViewRelation from "./pages/admin/ConfigRelation/View";
import PageNotFound from "./pages/404";
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
          <Route path={"/admin/config-relation"} component={ListRelations} />
          <Route path={"/admin/config-relation/add"} component={AddRelation} />
          <Route path={"/admin/config-relation/:relationId/view"} component={ViewRelation} />
        </Route>
        <Route path="*" component={PageNotFound} />
      </Routes>
    </>
  );
};

export default App;
