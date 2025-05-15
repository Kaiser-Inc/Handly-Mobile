import {
  Input,
  InputField,
  InputSlot,
  InputIcon,
  Text,
  VStack,
} from '@gluestack-ui/themed'
import {
  type Control,
  Controller,
  type FieldValues,
  type Path,
} from 'react-hook-form'
import { EyeIcon, EyeOffIcon } from '@gluestack-ui/themed'

interface FormInputProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  label: string
  error?: string
  isPassword?: boolean
  showPassword?: boolean
  onTogglePassword?: () => void
}

export function FormInput<T extends FieldValues>({
  control,
  name,
  label,
  error,
  isPassword,
  showPassword,
  onTogglePassword,
}: FormInputProps<T>) {
  return (
    <VStack className=" w-full px-8 mt-2">
      <Text className="text-xl font-bold mb-2"> {label} </Text>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <Input>
            <InputField
              autoCapitalize="none"
              value={value}
              onChangeText={onChange}
              type={isPassword && showPassword ? 'password' : 'text'}
              className={`text-base border ${error ? 'border-danger-300' : 'border-purple-300'} rounded-lg h-16 mb-3`}
            />
            {isPassword && (
              <InputSlot
                className="ml-auto -mt-12 mr-4 h-16"
                onPress={onTogglePassword}
              >
                <InputIcon
                  as={showPassword ? EyeOffIcon : EyeIcon}
                  width={28}
                  height={30}
                  color="#CEBDF2"
                />
              </InputSlot>
            )}
          </Input>
        )}
      />
      {error && <Text className="text-danger-300">{error} </Text>}
    </VStack>
  )
}
