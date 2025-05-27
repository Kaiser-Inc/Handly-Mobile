import { HStack, Pressable, Text, VStack } from "@gluestack-ui/themed";
import clsx from "clsx"
import { type Control, Controller, type FieldValues, type Path } from "react-hook-form";

interface RoleSelectorProps<T extends FieldValues>{
    control: Control<T>
    name: Path<T>
    label: string
    error?: string
}

export function RoleSelector<T extends FieldValues>({ control, label, name, error }: RoleSelectorProps<T>) {
    const roles = [
        {label: "Sou cliente", value: 'customer'},
        {label: "Sou prestador", value: 'provider'}
    ]
    
    return (
        <VStack className=" w-full px-8 mt-2">
            <Text className=" text-xl font-bold mb-2">
                {label}
            </Text>
            <Controller
                control={control}
                name={name}
                render={({field: {onChange, value}}) => (
                    <HStack className=" bg-purple-100 p-1 rounded-full">
                        { roles.map((role) => (
                            <Pressable
                                key={role.value}
                                onPress={() => onChange(role.value)}
                                className={clsx('font-medium',
                                    value === role.value ? 'text-gray-900' : 'text-gray-500'
                                )}
                            >
                                <Text>
                                    {role.label}
                                </Text>
                                
                            </Pressable>
                        ))}
                    </HStack>
                )}
            />
            {error && <Text className=" text-danger-300 mt-1">{error}</Text>}
        </VStack>
    )
}