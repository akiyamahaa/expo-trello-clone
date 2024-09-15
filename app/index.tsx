import {
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import * as WebBrowser from "expo-web-browser";
import { useCallback, useMemo, useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { ModalType } from "@/types/enums";
import { Colors } from "@/constants/Colors";
import AuthModal from "@/components/AuthModal";

export default function Index() {
  const { top } = useSafeAreaInsets();
  const { showActionSheetWithOptions } = useActionSheet();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ["33%"], []);
  const [authType, setAuthType] = useState<ModalType | null>(null);

  const openLink = async () => {
    WebBrowser.openBrowserAsync("https://galaxies.dev");
  };

  const openActionSheet = async () => {
    const options = ["View support docs", "Contact us", "Cancel"];
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        title: `Can't log in or sign up?`,
      },
      (selectedIndex: any) => {
        switch (selectedIndex) {
          case 0:
            // Support
            console.log("Support");
            break;
          case 1:
            // Contact
            console.log("Contact");
            break;
          case cancelButtonIndex:
            // Canceled
            console.log("Canceled");
            break;
        }
      }
    );
  };

  const showModal = async (type: ModalType) => {
    setAuthType(type);
    bottomSheetModalRef.current?.present();
  };

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        opacity={0.2}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        {...props}
        onPress={() => bottomSheetModalRef.current?.close()}
      />
    ),
    []
  );

  return (
    <BottomSheetModalProvider>
      <View className="flex-1 bg-primary items-center">
        <SafeAreaView style={{ paddingTop: StatusBar.currentHeight }}>
          <View className="px-10">
            <Image
              source={require("../assets/images/login/trello.png")}
              className="h-[450px]"
              resizeMode="contain"
            />
          </View>
        </SafeAreaView>
        <Text className="font-semibold text-white text-lg mb-4">
          Move teamwork forward - Even on the go
        </Text>
        <View className="w-full px-10 gap-4 ">
          <TouchableOpacity onPress={() => showModal(ModalType.Login)}>
            <View className="p-2.5 rounded-lg items-center bg-white">
              <Text className="text-lg text-primary">Log in</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => showModal(ModalType.SignUp)}>
            <View className="p-2.5 rounded-lg items-center border-white border">
              <Text style={[styles.btnText, { color: "#fff" }]}>Sign Up</Text>
            </View>
          </TouchableOpacity>

          <Text className="text-xs text-center text-white mx-15">
            By signing up, you agree to the{" "}
            <Text
              className="text-white text-sm text-center underline"
              onPress={openLink}
            >
              User Notice
            </Text>{" "}
            and{" "}
            <Text
              className="text-white text-sm text-center underline"
              onPress={openLink}
            >
              Privacy Policy
            </Text>{" "}
            .
          </Text>

          <Text
            className="text-white text-sm text-center underline"
            onPress={openActionSheet}
          >
            Can't log in our sign up?
          </Text>
        </View>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={0}
          snapPoints={snapPoints}
          handleComponent={null}
          backdropComponent={renderBackdrop}
          enableOverDrag={false}
          enablePanDownToClose
        >
          <AuthModal authType={authType} />
        </BottomSheetModal>
      </View>
    </BottomSheetModalProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    alignItems: "center",
  },
  image: {
    height: 450,
    paddingHorizontal: 40,
    resizeMode: "contain",
  },
  introText: {
    fontWeight: "600",
    color: "white",
    fontSize: 17,
    padding: 30,
  },
  bottomContainer: {
    width: "100%",
    paddingHorizontal: 40,
    gap: 10,
  },
  btn: {
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    borderColor: "#fff",
    borderWidth: 1,
  },
  btnText: {
    fontSize: 18,
  },
  description: {
    fontSize: 12,
    textAlign: "center",
    color: "#fff",
    marginHorizontal: 60,
  },
  link: {
    color: "#fff",
    fontSize: 12,
    textAlign: "center",
    textDecorationLine: "underline",
  },
});
