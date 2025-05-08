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
  HStack,
} from '@gluestack-ui/themed'

import BackgroundImg from '@assets/bg.png'
import Logo from '@assets/Logo.svg'
import SignInImg from '@assets/signIn.svg'

import React from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, Controller } from 'react-hook-form'
import { createUser, signIn } from '@services/api/users-services'

const signInSchema = z.object({
  email: z.string().email('Email invalido'),
  password: z
    .string()
    .min(8, 'A senha deve conter pelo menos 8 caracteres')
    .refine((val) => /[a-zA-Z]/.test(val), {
      message: 'A senha deve conter pelo menos uma letra',
    })
    .refine((val) => !/^\d+$/.test(val), {
      message: 'A senha não pode conter apenas números',
    }),
})

export type SignInData = z.infer<typeof signInSchema>

export function SignIn() {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignInData>({
    resolver: zodResolver(signInSchema),
  })

  const [isLoading, setIsLoading] = React.useState(false)

  const [showPassword, setShowPassword] = React.useState(true)
  const handleState = () => {
    setShowPassword((showState) => {
      return !showState
    })
  }

  const handleOnSubmit = async (data: SignInData) => {
    setIsLoading(true)
    try {
      await signIn(data)
      reset()
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
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
        <Center className=" flex  w-full h-3/6 items-end justify-end -mb-48 z-10 ml-24 mt-20">
          <SignInImg width={525} height={525} />
        </Center>

        <Center className=" bg-white flex flex-col flex-1 rounded-tr-3xl rounded-tl-3xl pt-12 items-center ">
          <Logo />

          <FormControl className=" w-full h-fit flex">
            <VStack className=" w-full px-8 mt-4">
              <Text className="text-xl font-bold mb-2"> Email </Text>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <Input className="">
                    <InputField
                      value={value}
                      onChangeText={onChange}
                      className=" border border-purple-300 rounded-lg h-16"
                    />
                  </Input>
                )}
              />
              {errors.email && (
                <Text className="text-danger-300">
                  {' '}
                  {errors.email.message}{' '}
                </Text>
              )}
            </VStack>
            <VStack className=" w-full px-8 mt-4">
              <Text className="text-xl font-bold mb-2"> Senha </Text>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <Input className="">
                    <InputField
                      value={value}
                      onChangeText={onChange}
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
                )}
              />
              {errors.password && (
                <Text className="text-danger-300">
                  {' '}
                  {errors.password.message}{' '}
                </Text>
              )}
            </VStack>
            <Button
              onPress={handleSubmit(handleOnSubmit)}
              isDisabled={isLoading}
              className=" w-10/12 h-16 rounded-full flex justify-center items-center my-4 mx-auto"
            >
              <Image
                source={BackgroundImg}
                alt="gradiente de indigo a lavanda"
                defaultSource={BackgroundImg}
                className="w-full h-full absolute rounded-full"
              />
              <ButtonText className=" text-white font-bold">
                {isLoading ? 'Carregando...' : 'Entrar'}
              </ButtonText>
            </Button>
          </FormControl>
          <Center className=" flex items-center ">
            <Text className=" text-gray-300 "> ou </Text>
            <HStack className=" justify-center items-center flex flex-row ">
              <Text className=" text-gray-400 text-lg">
                Ainda não tem uma conta?
              </Text>
              <Link>
                <LinkText className=" text-purple-300 ml-1 font-bold text-lg">
                  Cadastre-se
                </LinkText>
              </Link>
            </HStack>
          </Center>
        </Center>
      </VStack>
    </VStack>
  )
}
