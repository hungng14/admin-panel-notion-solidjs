import { API_BASE_URL } from "@/constants";
import { setValue } from "./storage";

export type SignInResult = {
  accessToken: string;
};
export const signIn = async (data: {
  email: string;
  password: string;
}): Promise<SignInResult> => {
  try {
    const result = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `mutation signInV2($signInUserInput: SignInUserV2Input!) { 
          signInV2(signInUserInput: $signInUserInput) {
                        id
                        accessToken
                      }
                    }
                  `,
        variables: {
          signInUserInput: {
            email: data.email,
            password: data.password,
          },
        },
      }),
    }).then((res) => res.json());
    if (result.data?.signInV2) {
      setValue('user', result.data?.signInV2);
      return result.data.signInV2;
    }
    throw new Error(result.errors?.[0]?.message || "Email or password invalid");
  } catch (error: any) {
    throw new Error(error.message || "Sign in failed");
  }
};

export const verifyUser = async (data: {
  email: string;
  code: string;
}): Promise<SignInResult> => {
  try {
    const result = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `mutation verifyUser($verifyUser: VerifyUserV2Input!) { 
                      verifyUser(verifyUser: $verifyUser) {
                        id
                      }
                    }
                  `,
        variables: {
          verifyUser: {
            email: data.email,
            code: data.code,
          },
        },
      }),
    }).then((res) => res.json());
    if (result.data?.verifyUser) {
      setValue('userId', result.data.verifyUser.id);
      return result.data.signIn;
    }
    throw new Error(result.errors?.[0]?.message || "Account Name not found");
  } catch (error: any) {
    throw new Error(error.message || "Sign in failed");
  }
};

export const signUp = async (data: {
  email: string;
  password: string;
}): Promise<SignInResult> => {
  try {
    const result = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `mutation signUpV2($signUpUserInput: SignUpUserV2Input!) { 
                      signUpV2(signUpUserInput: $signUpUserInput) {
                        success
                      }
                    }
                `,
        variables: {
          signUpUserInput: {
            email: data.email,
            password: data.password,
          },
        },
      }),
    }).then((res) => res.json());
    if (result.data?.signUpV2) {
      return result.data.signUpV2;
    }
    throw new Error(result.errors?.[0]?.message || "Sign up failed");
  } catch (error: any) {
    throw new Error(error.message || "Sign up failed");
  }
};

