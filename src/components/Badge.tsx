import { Pressable, Text } from '@gluestack-ui/themed'

interface BadgeProps {
  value: string
  selected?: boolean
  onPress?: () => void
}

export function Badge({ value, selected, onPress }: BadgeProps) {
  return (
    <Pressable onPress={onPress}>
      <Text
        className={` border  w-fit justify-center items-center flex flex-col px-4 py-2 mx-2 mb-4 rounded-full ${selected ? 'border-purple-500 bg-purple-500 text-white font-bold' : 'border-gray-100 bg-white'}`}
      >
        {value}
      </Text>
    </Pressable>
  )
}
