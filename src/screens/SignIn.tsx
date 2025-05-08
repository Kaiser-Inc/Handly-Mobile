import {
  Center,
  Image,
  VStack,
  Text,
  Link,
  LinkText,
  FormControl,
  Divider,
  Input,
  InputField,
  InputSlot,
  InputIcon,
  EyeIcon,
  EyeOffIcon,
  Button,
  ButtonText,
} from '@gluestack-ui/themed'

import BackgroundImg from '@assets/bg.png'
import Logo from '@assets/Logo.svg'
import SignInImg from '@assets/signIn.svg'

import React from 'react'

export function SignIn() {
  const [showPassword, setShowPassword] = React.useState(false)
  const handleState = () => {
    setShowPassword((showState) => {
      return !showState
    })
  }
  return (
    <VStack className=" flex flex-1 justify-center items-center">
      <Image
        source={BackgroundImg}
        alt="gradiente de indigo a lavanda"
        defaultSource={BackgroundImg}
        className="w-full h-full absolute"
      />
      <VStack className="flex flex-1 w-full">
        <Center className=" flex  w-full h-3/6 items-end justify-end -mb-48 z-10 ml-24">
          <SignInImg width={600} height={600} />
        </Center>
        <Center className=" bg-white flex flex-col flex-1 rounded-tr-3xl rounded-tl-3xl pt-12 items-center ">
          <Logo />
          <FormControl className=" w-full h-fit flex">
            <VStack className=" w-full px-8 mt-4">
              <Text className="text-xl font-bold mb-2"> Email </Text>
              <Input className="">
                <InputField
                  type="text"
                  className=" border border-purple-300 rounded-lg h-16  "
                />
              </Input>
            </VStack>
            <VStack className=" w-full px-8 mt-4">
              <Text className="text-xl font-bold mb-2"> Senha </Text>
              <Input className="">
                <InputField
                  type={showPassword ? 'password' : 'text'}
                  className="text-base border border-purple-300 rounded-lg h-16"
                />
                <InputSlot
                  className="ml-auto -mt-12 mr-4 h-16"
                  onPress={handleState}
                >
                  <InputIcon
                    as={showPassword ? EyeOffIcon : EyeIcon}
                    width={28}
                    height={30}
                    color="#CEBDF2"
                  />
                </InputSlot>
              </Input>
            </VStack>
            <Button className=" w-10/12 h-16 rounded-full flex justify-center items-center my-4 mx-auto">
              <Image
                source={BackgroundImg}
                alt="gradiente de indigo a lavanda"
                defaultSource={BackgroundImg}
                className="w-full h-full absolute rounded-full"
              />
              <ButtonText className=" text-white"> Login </ButtonText>
            </Button>
          </FormControl>
          <Center className=" flex justify-center items-center">
            <Text className=" text-gray-300 "> ou </Text>
            <Text className=" text-gray-400 text-lg">
              Ainda não tem conta?
              <Link className="">
                <LinkText className=" text-purple-300 ml-1 mt-0.5 font-bold text-lg">
                  {' '}
                  Cadastre-se{' '}
                </LinkText>
              </Link>
            </Text>
          </Center>
        </Center>
      </VStack>
    </VStack>
  )
}
