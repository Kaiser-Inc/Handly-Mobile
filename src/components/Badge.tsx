import { Text } from '@gluestack-ui/themed'

interface BadgeProps {
  content: string
}

export function Badge({ content }: BadgeProps) {
  return (
    <Text className=" bg-white border border-gray-100 w-fit justify-center items-center flex flex-col px-4 py-2 mx-2 mb-4 rounded-full">
      {content}
    </Text>
  )
}
