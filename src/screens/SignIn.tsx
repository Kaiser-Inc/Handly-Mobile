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
import SignInFooterImg from '@assets/signIn2.svg'

import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'

import { useNavigation } from '@react-navigation/native'
import type { AuthNavigatorRoutesProps } from '@routes/auth.routes'

import { FormInput } from '@components/FormInput'
import { GradientButton } from '@components/GradientButton'
import { ToastMessage } from '@components/ToastMessage'

import { Platform } from 'react-native'

import { type SignInData, signInSchema } from '../@types/signInSchema'

import { useAuth } from '@hooks/useAuth'
import { AppError } from '@utils/AppError'

export function SignIn() {
  const { authenticate, token } = useAuth()
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
  const [toastVisible, setToastVisible] = React.useState(false)
  const [toastMessage, setToastMessage] = React.useState('')
  const [toastType, setToastType] = React.useState<
    'success' | 'error' | 'info'
  >('error')

  const handleOnSubmit = async (signInData: SignInData) => {
    setIsLoading(true)
    try {
      await authenticate(signInData)
      reset()
    } catch (error) {
      const isAppError = error instanceof AppError
      const message = isAppError
        ? error.message
        : 'Algo deu errado, por favor tente novamente'

      setToastMessage(message)
      setToastType('error')
      setToastVisible(true)
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
      <ToastMessage
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
        onHide={() => setToastVisible(false)}
      />
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
              <Center className=" flex h-fit py-8 items-center">
                <SignInImg />
              </Center>

              <Center className=" bg-white flex flex-col flex-1 rounded-tr-3xl rounded-tl-3xl pt-12 items-center pb-72">
                <Logo />

                <FormControl className=" w-full h-fit flex">
                  <FormInput
                    control={control}
                    name="email"
                    label="Email"
                    testID="emailInput"
                    error={errors.email?.message}
                  />
                  <FormInput
                    control={control}
                    name="password"
                    label="Senha"
                    testID="passwordInput"
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
                    testID="login-Button"
                  />
                </FormControl>
                <Center className=" flex items-center ">
                  <Text className=" text-gray-300 "> ou </Text>
                  <HStack className=" justify-center items-center flex flex-row ">
                    <Text className=" text-gray-400 text-lg">
                      Ainda não tem uma conta?
                    </Text>
                    <Button
                      className=" px-1"
                      onPress={handleSignUp}
                      testID="signUp-Redirect-Button"
                    >
                      <ButtonText className="text-purple-300 font-bold text-lg">
                        Cadastre-se
                      </ButtonText>
                    </Button>
                  </HStack>
                </Center>
                <Center className=" absolute bottom-0 ">
                  <SignInFooterImg />
                </Center>
              </Center>
            </VStack>
          </VStack>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  )
}
