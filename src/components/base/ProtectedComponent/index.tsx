import { Component, createEffect } from "solid-js";
import { useNavigate, Outlet } from "@solidjs/router";
import { getValue } from "@/services/storage";

const ProtectedComponent: Component<{}> = (props) => {
  const navigate = useNavigate();
  createEffect(() => {
    const unauthorized = !getValue('user');
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
