import { getClientAccountName } from "../../../services/clientName";
import { Component, createEffect } from "solid-js";
import { useNavigate, Outlet } from "@solidjs/router";

const ProtectedComponent: Component<{}> = (props) => {
  const navigate = useNavigate();
  createEffect(() => {
    const unauthorized = !getClientAccountName();
    if (unauthorized) {
      return navigate("/", { replace: true });
    }
  });

  return (
    <>
      <Outlet />
    </>
  );
};

export default ProtectedComponent;
