import {
  Center,
  Image,
  VStack,
  Text,
  FormControl,
  Button,
  ButtonText,
  HStack,
  ScrollView,
  SafeAreaView,
} from '@gluestack-ui/themed'

import BackgroundImg from '@assets/bg.png'
import Logo from '@assets/Logo.svg'
import SignUpImg from '@assets/signUp.svg'

import React from 'react'

import { z } from 'zod'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { createUser } from '@services/api/users-services'
import { useNavigation } from '@react-navigation/native'
import type { AuthNavigatorRoutesProps } from '@routes/auth.routes'
import { GradientButton } from '@components/GradientButton'
import { FormInput } from '@components/FormInput'

const signUpSchema = z.object({
  name: z.string({ required_error: 'Campo obrigatório' }),
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
  role: z.enum(['customer', 'provider']),
})

export type SignUpData = z.infer<typeof signUpSchema>

export function SignUp() {
  const navigator = useNavigation<AuthNavigatorRoutesProps>()

  function handleSignIn() {
    navigator.navigate('SignIn')
  }

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignUpData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      role: 'customer',
    },
  })

  const [isLoading, setIsLoading] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(true)
  const handleState = () => {
    setShowPassword((showState) => {
      return !showState
    })
  }

  const handleOnSubmit = async (data: SignUpData) => {
    setIsLoading(true)
    try {
      await createUser(data)
      reset()
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SafeAreaView className="flex-1">
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
            <Center className=" flex w-full h-3/6 items-end justify-end -mb-48 z-10">
              <SignUpImg />
            </Center>
            <Center className=" bg-white flex flex-col flex-1 rounded-tr-3xl rounded-tl-3xl pt-12 items-center ">
              <Logo />
              <FormControl className=" w-full h-fit flex mt-8">
                <FormInput
                  control={control}
                  name="name"
                  label="Nome Completo"
                  error={errors.name?.message}
                />
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
                  error={errors.password?.message}
                />

                <GradientButton
                  onPress={handleSubmit(handleOnSubmit)}
                  isLoading={isLoading}
                  text="Cadastre-se"
                />
              </FormControl>

              <Center className=" flex  items-center ">
                <Text className=" text-gray-300 "> ou </Text>
                <HStack className=" justify-center items-center flex flex-row ">
                  <Text className=" text-gray-400 text-lg">
                    Já tem uma conta?
                  </Text>
                  <Button className=" px-1" onPress={handleSignIn}>
                    <ButtonText className="text-purple-300 font-bold text-lg">
                      Login
                    </ButtonText>
                  </Button>
                </HStack>
              </Center>
            </Center>
          </VStack>
        </VStack>
      </ScrollView>
    </SafeAreaView>
  )
}
