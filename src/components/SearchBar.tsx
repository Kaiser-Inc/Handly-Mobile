import { HStack, Input, InputField, Text } from '@gluestack-ui/themed'
import { Search } from 'lucide-react-native'
import { useForm } from 'react-hook-form'
import { FormInput } from './FormInput'

interface SearchFormData {
  query: string
}

export function SearchBar() {
  const { control } = useForm<SearchFormData>({
    defaultValues: {
      query: '',
    },
  })

  return (
    <HStack className=" mx-auto rounded-2xl w-11/12 flex flex-row px-4 py-4 my-4 bg-white items-center">
      <Search size={30} stroke="#9356FC" />
      <Input className=" flex-1 ">
        <InputField className=" w-full mx-2" placeholder="Pesquisar..." />
      </Input>
    </HStack>
  )
}
