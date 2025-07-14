import { HStack, Input, InputField } from '@gluestack-ui/themed'

interface SearchBarProps {
  onChange: (value: string) => void
}

export function SearchBar({ onChange }: SearchBarProps) {
  return (
    <HStack className="mx-auto rounded-2xl w-11/12 flex flex-row px-4 my-6 bg-white items-center border border-purple-900">
      <Input className="flex-1">
        <InputField
          className="w-full mx-2"
          placeholder="Pesquisar..."
          onChangeText={onChange}
        />
      </Input>
    </HStack>
  )
}
