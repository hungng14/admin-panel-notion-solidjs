import { signUp } from "../../services/auth";
import { useNavigate } from "@solidjs/router";
import { Component, createSignal } from "solid-js";

type Props = {
  onSetScreen: (screen: string) => any;
  screenName: string;
};

const SignUp: Component<Props> = (props) => {
  const [userName, setUserName] = createSignal("");
  const [secretKey, setSecretKey] = createSignal("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = createSignal(false);
  const onSignUp = async (e: any) => {
    try {
      e.preventDefault();
      if(isLoading()) return;
      setIsLoading(true);
      await signUp({ userName: userName(), secretKey: secretKey() });
      alert("Sign up successfully");
      navigate("/admin", { replace: true });
    } catch (error: any) {
      console.log("error", error);
      setIsLoading(false);
      alert(error?.message || "Sign up failed");
    }
  };
  return (
    <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
      <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
        <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
          Sign Up
        </h1>
        <form
          class="space-y-4 md:space-y-6"
          onSubmit={!isLoading() ? onSignUp : undefined}
        >
          <div>
            <label
              for="email"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Your Account Name
            </label>
            <input
              name="email"
              id="email"
              class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Your Account Name"
              value={userName()}
              onChange={(e) => {
                setUserName(e.currentTarget.value);
              }}
            />
          </div>
          <div>
            <label
              for="password"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Your Secret Key
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="••••••••"
              class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={secretKey()}
              onChange={(e) => {
                setSecretKey(e.currentTarget.value);
              }}
            />
          </div>
          <button
            type="submit"
            class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            {isLoading() ? "Loading..." : "Sign Up"}
          </button>
          <p class="text-sm font-light text-gray-500 dark:text-gray-400">
            Have an account?{" "}
            <span
              onClick={() => props.onSetScreen("sign-in")}
              class="font-medium text-primary-600 hover:underline dark:text-primary-500 cursor-pointer"
            >
              Sign In
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
