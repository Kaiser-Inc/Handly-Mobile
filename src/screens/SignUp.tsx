import {
  Center,
  Image,
  VStack,
  Text,
  Link,
  LinkText,
  FormControl,
  Input,
  InputField,
  InputSlot,
  InputIcon,
  EyeIcon,
  EyeOffIcon,
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

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { createUser } from '@services/api/users-services'
import { useNavigation } from '@react-navigation/native'
import type { AuthNavigatorRoutesProps } from '@routes/auth.routes'
import { GradientButton } from '@components/GradientButton'

const signUpSchema = z.object({
  name: z.string({ required_error: 'Campo Obrigatório' }),
  email: z
    .string({ required_error: 'Campo Obrigatório' })
    .email('Email invalido'),
  password: z
    .string({ required_error: 'Campo Obrigatório' })
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
              <FormControl className=" w-full h-fit flex">
                <VStack className=" w-full px-8 mt-12">
                  <Text className="text-xl font-bold mb-2">
                    {' '}
                    Nome Completo{' '}
                  </Text>
                  <Controller
                    control={control}
                    name="name"
                    render={({ field: { onChange, value } }) => (
                      <Input className="">
                        <InputField
                          value={value}
                          onChangeText={onChange}
                          className={`text-base border ${errors.name ? 'border-danger-300' : 'border-purple-300'} rounded-lg h-16 mb-3`}
                        />
                      </Input>
                    )}
                  />
                  {errors.name && (
                    <Text className="text-danger-300">
                      {errors.name.message}{' '}
                    </Text>
                  )}
                </VStack>
                <VStack className=" w-full px-8 mt-4">
                  <Text className="text-xl font-bold mb-2"> Email </Text>
                  <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, value } }) => (
                      <Input className="">
                        <InputField
                          autoCapitalize="none"
                          value={value}
                          onChangeText={onChange}
                          className={`text-base border ${errors.email ? 'border-danger-300' : 'border-purple-300'} rounded-lg h-16 mb-3`}
                        />
                      </Input>
                    )}
                  />
                  {errors.email && (
                    <Text className="text-danger-300">
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
                          autoCapitalize="none"
                          value={value}
                          onChangeText={onChange}
                          type={showPassword ? 'password' : 'text'}
                          className={`text-base border ${errors.password ? 'border-danger-300' : 'border-purple-300'} rounded-lg h-16`}
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
                      {errors.password.message}{' '}
                    </Text>
                  )}
                </VStack>

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
