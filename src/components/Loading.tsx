import { Center, Spinner } from '@gluestack-ui/themed'

export function Loading() {
  return (
    <Center className=" bg-stone-900 flex flex-1 justify-center items-center">
      <Spinner className=" text-stone-700" size="large" />
    </Center>
  )
}
