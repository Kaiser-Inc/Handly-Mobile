import { HStack, Text } from "@gluestack-ui/themed";
import { AlignJustify, Bell, ShoppingBag } from "lucide-react-native";

export function HomeHeader(){
    return (
        <HStack className=" mx-auto rounded-2xl w-11/12 flex flex-row px-4 py-8 bg-white justify-between">
            <HStack className=" flex flex-row items-center ">
                <AlignJustify />
                <Text className=" mx-4 text-2xl font-bold">Home</Text>
            </HStack>
            <HStack className=" flex flex-row items-center gap-4">
                <Bell/>
                <ShoppingBag/>
            </HStack>
        </HStack>
    )
}