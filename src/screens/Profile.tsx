import {  Center, Image, Text } from "@gluestack-ui/themed";
import { SafeAreaView } from "react-native-safe-area-context";

import BackgroundImg from '@assets/bg.png'
import { GradientButton } from "@components/GradientButton";
import { UserPhoto } from "@components/UserPhoto";
import { useAuth } from "@hooks/useAuth";


export function Profile(){
    const { signOut } = useAuth()

    return(
        <SafeAreaView className="flex-1 bg-white">
            <Center className=" w-full h-full items-center">
                <Text className=" font-bold text-xl my-12"> Perfil! </Text>
                <Center className=" w-10/12 h-32 shadow-2xl rounded-3xl overflow-hidden bg-white">
                <Image
                    source={BackgroundImg}
                    alt="gradiente de indigo a lavanda"
                    defaultSource={BackgroundImg}
                    className="w-full h-full"
                />
                </Center>
                <UserPhoto className=" w-32 h-32 rounded-full -mt-20 border-4 border-white bg-gray-400 " source={{uri: "https://github.com/pHenrymelo.png"}} alt="Foto de perfil de usuário"/>
                <Text className=" font-bold text-2xl mt-8"> Zé do Picadinho </Text>
                <Text className=" text-gray-400 mt-4"> picadinho@gmail.com </Text>
                <Center className="mt-auto">
                    <GradientButton text="Sair" onPress={signOut} />
                </Center>

            </Center>   
        </SafeAreaView>
    )
}