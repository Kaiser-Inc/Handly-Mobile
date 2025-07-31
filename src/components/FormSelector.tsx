import {
  Badge,
  HStack,
  Input,
  InputField,
  Pressable,
  Text,
  VStack,
  View,
} from '@gluestack-ui/themed'
import { X } from 'lucide-react-native'
import { useState } from 'react'
import {
  type Control,
  Controller,
  type FieldValues,
  type Path,
} from 'react-hook-form'
import { categories } from '../@types/categories'

interface FormSelectorProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  label: string
  error?: string
  testID?: string
}

export function FormSelector<T extends FieldValues>({
  control,
  label,
  name,
  error,
  testID,
}: FormSelectorProps<T>) {
  const [input, setInput] = useState('')

  return (
    <VStack className="w-full px-8 mt-2">
      <Text className="text-xl font-bold mb-2">{label}</Text>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value = [] } }) => {
          const selected: string[] = Array.isArray(value) ? value : []
          const isDisabled = selected.length >= 5
          const filteredOptions = categories
            .filter(
              (opt) =>
                opt.toLowerCase().includes(input.toLowerCase()) &&
                !selected.includes(opt),
            )
            .slice(0, 5)

          const addCategory = (category: string) => {
            if (selected.length >= 5) return
            onChange([...selected, category])
            setInput('')
          }

          const removeCategory = (category: string) => {
            onChange(selected.filter((item) => item !== category))
          }

          return (
            <View>
              <HStack className="flex flex-row flex-wrap gap-2 mb-2">
                {selected.map((category) => (
                  <Badge
                    key={category}
                    className="flex flex-row w-fit justify-center py-1 px-2 rounded-full items-center gap-1 bg-purple-300"
                  >
                    <Text>{category}</Text>
                    <Pressable onPress={() => removeCategory(category)}>
                      <X width={16} height={16} />
                    </Pressable>
                  </Badge>
                ))}
              </HStack>

              <Input>
                <InputField
                  testID={testID}
                  className={`text-base   h-16 rounded-lg mb-3 ${
                    isDisabled
                      ? ' border-b border-gray-400'
                      : ' border border-purple-300'
                  }`}
                  placeholder="Digite para buscar categorias"
                  value={input}
                  onChangeText={setInput}
                  editable={!isDisabled}
                />
              </Input>

              {input.length > 0 && filteredOptions.length > 0 && (
                <VStack className="bg-white border rounded mt-1 z-10">
                  {filteredOptions.map((option) => (
                    <Pressable
                      key={option}
                      onPress={() => addCategory(option)}
                      className="px-3 py-2"
                    >
                      <Text>{option}</Text>
                    </Pressable>
                  ))}
                </VStack>
              )}
            </View>
          )
        }}
      />
      {error && <Text className="text-danger-300">{error}</Text>}
    </VStack>
  )
}
