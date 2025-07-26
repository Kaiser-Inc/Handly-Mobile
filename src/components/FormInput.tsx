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
  isTextarea?: boolean
  showPassword?: boolean
  onTogglePassword?: () => void
  keyboardType?: 'default' | 'numeric' | 'email-address'
  onChangeText?: (text: string) => void
  maxLength?: number
  placeholder?: string
  testID?: string
}

export function FormInput<T extends FieldValues>({
  control,
  name,
  label,
  error,
  isPassword,
  isTextarea,
  showPassword,
  onTogglePassword,
  keyboardType,
  maxLength,
  onChangeText,
  placeholder,
  testID,
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
              testID={testID}
              multiline={isTextarea ? isTextarea : false}
              autoCapitalize="none"
              value={value}
              onChangeText={onChangeText || onChange}
              type={isPassword && showPassword ? 'password' : 'text'}
              keyboardType={keyboardType}
              maxLength={maxLength}
              placeholder={placeholder}
              className={`text-base border ${error ? 'border-danger-300' : 'border-purple-300'} ${isTextarea ? 'h-32' : 'h-16'} rounded-lg mb-3`}
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
