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
import SignUpImg from '@assets/signUp.svg'

import React from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { FormInput } from '@components/FormInput'
import { GradientButton } from '@components/GradientButton'
import { RoleSelector } from '@components/RoleSelector'
import { ToastMessage } from '@components/ToastMessage'
import { useNavigation } from '@react-navigation/native'
import type { AuthNavigatorRoutesProps } from '@routes/auth.routes'
import { createUser } from '@services/users-services'
import { Platform } from 'react-native'

import { AppError } from '@utils/AppError'
import {
  type SignUpData,
  fortmatDocument,
  signUpSchema,
} from '../@types/singUpSchema'

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
    setValue,
  } = useForm<SignUpData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      role: 'customer',
    },
  })

  const [isLoading, setIsLoading] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(true)
  const [toastVisible, setToastVisible] = React.useState(false)
  const [toastMessage, setToastMessage] = React.useState('')
  const [toastType, setToastType] = React.useState<
    'success' | 'error' | 'info'
  >('error')

  const handleDocumentChange = (text: string) => {
    const formatted = fortmatDocument(text)
    setValue('cpf_cnpj', formatted, {
      shouldValidate: true,
    })
  }

  const handleOnSubmit = async (signUpData: SignUpData) => {
    setIsLoading(true)
    try {
      const dataToSend = {
        ...signUpData,
        cpf_cnpj: signUpData.cpf_cnpj.replace(/\D/g, ''),
      }
      await createUser(dataToSend)

      setToastMessage('Cadastro feito com sucesso!')
      setToastType('success')
      setToastVisible(true)

      reset()
      setTimeout(() => {
        handleSignIn()
      }, 1000)
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
          <Image
            source={BackgroundImg}
            alt="gradiente de indigo a lavanda"
            defaultSource={BackgroundImg}
            className="w-full h-full absolute"
          />
          <VStack className=" flex flex-1 justify-center items-center bg ">
            <VStack className="flex flex-1 w-full">
              <Center className=" flex h-fit py-8 items-center">
                <SignUpImg />
              </Center>
              <Center className=" bg-white flex flex-col flex-1 rounded-tr-3xl rounded-tl-3xl pt-12 items-center pb-96">
                <Logo />
                <FormControl className=" w-full h-fit flex mt-8">
                  <RoleSelector
                    control={control}
                    name="role"
                    error={errors.role?.message}
                  />

                  <FormInput
                    control={control}
                    name="name"
                    label="Nome Completo"
                    testID="nameInput"
                    error={errors.name?.message}
                  />
                  <FormInput
                    control={control}
                    name="email"
                    label="Email"
                    testID="emailInput"
                    keyboardType="email-address"
                    error={errors.email?.message}
                  />

                  <FormInput
                    control={control}
                    name="cpf_cnpj"
                    label="CPF/CNPJ"
                    testID="cpf_cnpjInput"
                    error={errors.cpf_cnpj?.message}
                    keyboardType="numeric"
                    onChangeText={handleDocumentChange}
                    maxLength={18}
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
                    testID="signup-Button"
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
    </KeyboardAvoidingView>
  )
}
