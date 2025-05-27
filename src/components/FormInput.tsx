import {
  Input,
  InputField,
  InputIcon,
  InputSlot,
  Text,
  VStack,
} from '@gluestack-ui/themed'
import { EyeIcon, EyeOffIcon } from 'lucide-react-native'
import {
  type Control,
  Controller,
  type FieldValues,
  type Path,
} from 'react-hook-form'

interface FormInputProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  label: string
  error?: string
  isPassword?: boolean
  showPassword?: boolean
  onTogglePassword?: () => void
  keyboardType?: 'default' | 'numeric' | 'email-address'
  onChangeText?: (text: string) => void
  maxLength?: number
}

export function FormInput<T extends FieldValues>({
  control,
  name,
  label,
  error,
  isPassword,
  showPassword,
  onTogglePassword,
  keyboardType,
  maxLength,
  onChangeText,
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
              onChangeText={onChangeText || onChange}
              type={isPassword && showPassword ? 'password' : 'text'}
              keyboardType={keyboardType}
              maxLength={maxLength}
              className={`text-base border ${error ? 'border-danger-300' : 'border-purple-300'} rounded-lg h-16 mb-3`}
            />
            {isPassword && (
              <InputSlot
                className=" absolute right-4 top-1/4 h-16"
                onPress={onTogglePassword}
              >
                <InputIcon
                  as={showPassword ? EyeOffIcon : EyeIcon}
                  color="#CD8EFA"
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
