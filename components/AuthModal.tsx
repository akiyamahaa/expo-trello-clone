import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { AuthStrategy, ModalType } from "@/types/enums";
import { useOAuth, useSignIn, useSignUp } from "@clerk/clerk-expo";
import { useWarmUpBrowser } from "@/hooks/useWarmUpBrowser";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";

const LOGIN_OPTIONS = [
  {
    text: "Continue with Google",
    icon: require("@/assets/images/login/google.png"),
    strategy: AuthStrategy.Google,
  },
  {
    text: "Continue with Microsoft",
    icon: require("@/assets/images/login/microsoft.png"),
    strategy: AuthStrategy.Microsoft,
  },
  {
    text: "Continue with Apple",
    icon: require("@/assets/images/login/apple.png"),
    strategy: AuthStrategy.Apple,
  },
  {
    text: "Continue with Slack",
    icon: require("@/assets/images/login/slack.png"),
    strategy: AuthStrategy.Slack,
  },
];

interface AuthModalProps {
  authType: ModalType | null;
}

const AuthModal = ({ authType }: AuthModalProps) => {
  useWarmUpBrowser();
  const { signUp, setActive } = useSignUp();
  const { signIn } = useSignIn();

  const { startOAuthFlow: googleAuth } = useOAuth({
    strategy: AuthStrategy.Google,
  });
  const { startOAuthFlow: microsoftAuth } = useOAuth({
    strategy: AuthStrategy.Microsoft,
  });
  const { startOAuthFlow: slackAuth } = useOAuth({
    strategy: AuthStrategy.Slack,
  });
  const { startOAuthFlow: appleAuth } = useOAuth({
    strategy: AuthStrategy.Apple,
  });

  const onSelectAuth = async (strategy: AuthStrategy) => {
    if (!signIn || !signUp) return null;

    const selectedAuth = {
      [AuthStrategy.Google]: googleAuth,
      [AuthStrategy.Microsoft]: microsoftAuth,
      [AuthStrategy.Slack]: slackAuth,
      [AuthStrategy.Apple]: appleAuth,
    }[strategy];

    // https://clerk.com/docs/custom-flows/oauth-connections#o-auth-account-transfer-flows
    // If the user has an account in your application, but does not yet
    // have an OAuth account connected to it, you can transfer the OAuth
    // account to the existing user account.
    const userExistsButNeedsToSignIn =
      signUp.verifications.externalAccount.status === "transferable" &&
      signUp.verifications.externalAccount.error?.code ===
        "external_account_exists";

    if (userExistsButNeedsToSignIn) {
      const res = await signIn.create({ transfer: true });

      if (res.status === "complete") {
        setActive({
          session: res.createdSessionId,
        });
      }
    }

    const userNeedsToBeCreated =
      signIn.firstFactorVerification.status === "transferable";

    if (userNeedsToBeCreated) {
      const res = await signUp.create({
        transfer: true,
      });

      if (res.status === "complete") {
        setActive({
          session: res.createdSessionId,
        });
      }
    } else {
      // If the user has an account in your application
      // and has an OAuth account connected to it, you can sign them in.
      try {
        const { createdSessionId, setActive } = await selectedAuth();

        if (createdSessionId) {
          setActive!({ session: createdSessionId });
          console.log("OAuth success standard");
        }
      } catch (err) {
        console.error("OAuth error", err);
      }
    }
  };

  return (
    <BottomSheetView className="flex-1 items-start p-5 gap-5">
      <TouchableOpacity>
        <View className="flex-row items-center gap-4 border-white border">
          <Ionicons name="mail-outline" size={20} />
          <Text className="text-lg">
            {authType === ModalType.Login ? "Log in" : "Sign up"} with Email
          </Text>
        </View>
      </TouchableOpacity>
      {LOGIN_OPTIONS.map((option, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => onSelectAuth(option.strategy!)}
        >
          <View className="flex-row items-center gap-4 border-white border">
            <Image
              source={option.icon}
              className="w-5 h-5"
              resizeMode="contain"
            />
            <Text className="text-lg">{option.text}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </BottomSheetView>
  );
};

export default AuthModal;

const styles = StyleSheet.create({});
