import { Center, Image, KeyboardAvoidingView, ScrollView, Text, VStack } from "@gluestack-ui/themed"
import { Platform } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import BackgroundImg from '@assets/bg.png'

export function Feed() {
    return(
    <KeyboardAvoidingView
      className=" flex-1 "
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      enabled
    >
      <SafeAreaView className="flex-1 bg-white">
        <ScrollView
          className=" flex flex-1 flex-grow bg-white"
          showsVerticalScrollIndicator={false}
        >
          <VStack className=" flex flex-1 justify-center items-center">
            <Image
              source={BackgroundImg}
              alt="gradiente de indigo a lavanda"
              defaultSource={BackgroundImg}
              className="w-full h-full absolute"
            />
            <VStack className="flex flex-1 w-full">
            <Text className="text-white text-2xl font-bold my-24 ml-6">Feed</Text>
              <Center className=" bg-white flex flex-col flex-1 rounded-tr-3xl rounded-tl-3xl pt-12 items-center pb-72">
              </Center>
            </VStack>
          </VStack>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
    )
}