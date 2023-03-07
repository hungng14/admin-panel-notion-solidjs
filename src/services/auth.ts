import { API_BASE_URL } from "../constants";
import { setClientAccountName } from "./clientName";

export type SignInResult = {
  accessToken: string;
};
export const signIn = async (data: {
  userName: string;
}): Promise<SignInResult> => {
  try {
    const result = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `mutation signIn($signInUserInput: SignInUserInput!) { 
                    signIn(signInUserInput: $signInUserInput) {
                        accessToken
                      }
                    }
                  `,
        variables: {
          signInUserInput: {
            userName: data.userName,
          },
        },
      }),
    }).then((res) => res.json());
    if (result.data?.signIn) {
      setClientAccountName(data.userName);
      return result.data.signIn;
    }
    throw new Error(result.errors?.[0]?.message || "Account Name not found");
  } catch (error: any) {
    throw new Error(error.message || "Sign in failed");
  }
};

export const signUp = async (data: {
  userName: string;
  secretKey: string;
}): Promise<SignInResult> => {
  try {
    const result = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `mutation signUp($signUpUserInput: SignUpUserInput!) { 
                    signUp(signUpUserInput: $signUpUserInput) {
                        accessToken
                        id
                        object
                        }
                    }
                `,
        variables: {
          signUpUserInput: {
            userName: data.userName,
            secretKey: data.secretKey,
          },
        },
      }),
    }).then((res) => res.json());
    if (result.data?.signUp) {
      setClientAccountName(data.userName);
      return result.data.signUp;
    }
    throw new Error(result.errors?.[0]?.message || "Sign up failed");
  } catch (error: any) {
    throw new Error(error.message || "Sign up failed");
  }
};
