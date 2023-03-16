import { Component } from "solid-js";
import { Routes, Route } from "@solidjs/router";
import Dashboard from "./pages/admin/Dashboard";
import Database from "./pages/admin/Database";
import Setting from "./pages/admin/Setting";
import Start from "./pages/start";
import ProtectedComponent from "./components/base/ProtectedComponent";
import AddRecordDatabase from "./pages/admin/Database/Add";
const App: Component = () => {
  return (
    <>
      <Routes>
        <Route path={"/"} component={Start} />
        <Route path={'/'} component={ProtectedComponent}>
          <Route path={"/admin"} component={Dashboard} />
          <Route path={"/admin/database/:databaseId"} component={Database} />
          <Route path={"/admin/database/:databaseId/add"} component={AddRecordDatabase} />
          <Route path={"/admin/setting"} component={Setting} />
        </Route>
        <Route path="*" element={()=> <div>Page Not found!!!</div>} />
      </Routes>
    </>
  );
};

export default App;
