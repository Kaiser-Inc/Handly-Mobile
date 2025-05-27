import {
  Button,
  ButtonText,
  Center,
  FormControl,
  HStack,
  Image,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  Text,
  VStack,
} from '@gluestack-ui/themed'

import Logo from '@assets/Logo.svg'
import BackgroundImg from '@assets/bg.png'
import SignInImg from '@assets/signIn.svg'

import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from '@services/users-services'
import React from 'react'
import { useForm } from 'react-hook-form'

import { useNavigation } from '@react-navigation/native'
import type { AuthNavigatorRoutesProps } from '@routes/auth.routes'

import { FormInput } from '@components/FormInput'
import { GradientButton } from '@components/GradientButton'
import { Platform } from 'react-native'

import { z } from 'zod'

const signInSchema = z.object({
  email: z
    .string({ required_error: 'Campo obrigatório' })
    .email('Email invalido'),
  password: z
    .string({ required_error: 'Campo obrigatório' })
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
  const navigator = useNavigation<AuthNavigatorRoutesProps>()

  function handleSignUp() {
    navigator.navigate('SignUp')
  }

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
    <KeyboardAvoidingView
      className=" flex-1 "
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      enabled
    >
      <SafeAreaView className="flex-1 bg-white">
        <ScrollView
          className=" flex flex-1 flex-grow bg-white"
          showsVerticalScrollIndicator={false}
        >
          <VStack className=" flex flex-1 justify-center items-center">
            <Image
              source={BackgroundImg}
              alt="gradiente de indigo a lavanda"
              defaultSource={BackgroundImg}
              className="w-full h-full absolute"
            />
            <VStack className="flex flex-1 w-full">
              <Center className=" flex w-full h-1/2 items-end justify-end ml-10 mt-10 -mb-20 z-10">
                <SignInImg height={400} width={480} />
              </Center>

              <Center className=" bg-white flex flex-col flex-1 rounded-tr-3xl rounded-tl-3xl pt-12 items-center pb-72">
                <Logo />

                <FormControl className=" w-full h-fit flex">
                  <FormInput
                    control={control}
                    name="email"
                    label="Email"
                    error={errors.email?.message}
                  />
                  <FormInput
                    control={control}
                    name="password"
                    label="Senha"
                    isPassword
                    showPassword={showPassword}
                    onTogglePassword={() => {
                      setShowPassword(!showPassword)
                    }}
                    error={errors.password?.message}
                  />
                  <GradientButton
                    onPress={handleSubmit(handleOnSubmit)}
                    isLoading={isLoading}
                    text="Entrar"
                  />
                </FormControl>
                <Center className=" flex items-center ">
                  <Text className=" text-gray-300 "> ou </Text>
                  <HStack className=" justify-center items-center flex flex-row ">
                    <Text className=" text-gray-400 text-lg">
                      Ainda não tem uma conta?
                    </Text>
                    <Button className=" px-1" onPress={handleSignUp}>
                      <ButtonText className="text-purple-300 font-bold text-lg">
                        Cadastre-se
                      </ButtonText>
                    </Button>
                  </HStack>
                </Center>
              </Center>
            </VStack>
          </VStack>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  )
}
