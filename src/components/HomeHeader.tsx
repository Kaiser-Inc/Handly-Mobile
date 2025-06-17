import { HStack, Text } from "@gluestack-ui/themed";
import { Bell, House, ShoppingBag } from "lucide-react-native";

export function HomeHeader(){
    return (
        <HStack className=" mx-auto rounded-2xl w-11/12 flex flex-row px-4 py-8 bg-white justify-between">
            <HStack className=" flex flex-row items-center ">
                <House size={30} stroke="#9356FC" />
                <Text className=" mx-4 text-2xl font-bold">Home</Text>
            </HStack>
            <HStack className=" flex flex-row items-center gap-4">
                <Bell size={30}/>
            </HStack>
        </HStack>
    )
}