import { Component, createSignal } from "solid-js";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import VerifyCode from "./Verify-Code";

const StartPage: Component<{}> = (props) => {
  const [currentScreen, setCurrentScreen] = createSignal<
    "sign-in" | "sign-up" | "verify-user"
  >("sign-in");
  return (
    <section class="bg-gray-50 dark:bg-gray-900">
      <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a
          href="#"
          class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <img
            class="w-8 h-8 mr-2"
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
            alt="logo"
          />
          Welcome to Notion Admin
        </a>
        {currentScreen() === "sign-in" ? (
          <SignIn screenName="sign-in" onSetScreen={setCurrentScreen} />
        ) : currentScreen() === "verify-user" ? (
          <VerifyCode screenName="verify-code" onSetScreen={setCurrentScreen} />
        ) : (
          <SignUp screenName="sign-up" onSetScreen={setCurrentScreen} />
        )}
      </div>
    </section>
  );
};

export default StartPage;
