import BackgroundImage from '@assets/bg.png'
import { Button, ButtonText, Image } from '@gluestack-ui/themed'

interface GradientButtonProps {
  onPress: () => void
  isLoading?: boolean
  text: string
  testID?: string
}

export function GradientButton({
  onPress,
  text,
  isLoading,
  testID,
}: GradientButtonProps) {
  return (
    <Button
      testID={testID}
      onPress={onPress}
      isDisabled={isLoading}
      className="w-10/12 h-16 rounded-full flex justify-center items-center my-4 mx-auto"
    >
      <Image
        source={BackgroundImage}
        alt="gradiente de indigo a lavanda"
        defaultSource={BackgroundImage}
        className="w-full h-full absolute rounded-full"
      />

      <ButtonText className=" text-white font-bold">
        {isLoading ? 'Carregando...' : text}
      </ButtonText>
    </Button>
  )
}
