import { useNavigate } from "@solidjs/router";
import { Component, createEffect, createSignal } from "solid-js";

import { signIn } from "../../services/auth";
type Props = {
  onSetScreen: (screen: string) => any;
  screenName: string;
};

const SignIn: Component<Props> = (props) => {
  const [userName, setUserName] = createSignal("");
  const navigate = useNavigate();
  let refUserName;
  const [isLogging, setIsLogging] = createSignal(false);
  const onSignIn = async (e: any) => {
    try {
      e.preventDefault();
      if(isLogging()) return;
      setIsLogging(true);
      await signIn({ userName: userName() });
      alert("Sign in successfully");
      navigate("/admin", { replace: true });
    } catch (error: any) {
      console.log("error", error);
      alert(error?.message || "Account name invalid");
      setIsLogging(false);
    }
  };

  return (
    <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
      <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
        <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
          Sign in
        </h1>
        <form class="space-y-4 md:space-y-6" onSubmit={!isLogging() ? onSignIn : undefined}>
          <div>
            <label
              for="account-name"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Your Account Name
            </label>
            <input
              name="email"
              id="account-name"
              class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Your Account Name"
              ref={refUserName}
              value={userName()}
              onChange={(e) => {
                setUserName(e.currentTarget.value);
              }}
            />
          </div>

          <button
            type="submit"
            class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            {isLogging() ? "Loading..." : "Sign in"}
          </button>
          <p class="text-sm font-light text-gray-500 dark:text-gray-400">
            Don’t have an account yet?{" "}
            <span
              class="font-medium text-primary-600 hover:underline dark:text-primary-500 cursor-pointer"
              onClick={() => props.onSetScreen("sign-up")}
            >
              Sign up
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
