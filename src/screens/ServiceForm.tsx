import { FormInput } from '@components/FormInput'
import { FormSelector } from '@components/FormSelector'
import { GradientButton } from '@components/GradientButton'
import { ImagePickerInput } from '@components/ImagePickerInput'
import { ToastMessage } from '@components/ToastMessage'
import {
  Center,
  FormControl,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  Text,
  VStack,
} from '@gluestack-ui/themed'
import { zodResolver } from '@hookform/resolvers/zod'
import { createService } from '@services/services-services'
import { AppError } from '@utils/AppError'
import React from 'react'
import { useForm } from 'react-hook-form'
import { Platform } from 'react-native'
import { type serviceData, serviceSchema } from '../@types/serviceSchema'

export function ServiceForm() {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<serviceData>({
    resolver: zodResolver(serviceSchema),
  })

  const [isLoading, setIsLoading] = React.useState(false)
  const [toastVisible, setToastVisible] = React.useState(false)
  const [toastMessage, setToastMessage] = React.useState('')
  const [toastType, setToastType] = React.useState<
    'success' | 'error' | 'info'
  >('error')

  const handleOnSubmit = async (serviceData: serviceData) => {
    setIsLoading(true)
    try {
      await createService(serviceData)
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
          <VStack className=" flex flex-1 justify-center items-center bg ">
            <VStack className="flex flex-1 w-full">
              <Center className=" bg-white flex flex-col flex-1 rounded-tr-3xl rounded-tl-3xl pt-12 items-center">
                <Text className="text-xl font-bold">Cadastrar Serviço!</Text>
                <FormControl className=" w-full h-fit flex mt-8">
                  <FormInput
                    control={control}
                    name="name"
                    label="Nome"
                    placeholder="Insira o nome do serviço"
                    error={errors.name?.message}
                  />
                  <FormInput
                    control={control}
                    name="description"
                    label="Descrição"
                    keyboardType="default"
                    isTextarea
                    placeholder="Adicione uma descrição do serviço"
                    error={errors.description?.message}
                  />

                  <FormSelector
                    control={control}
                    label="Categorias"
                    name="categories"
                    error={errors.categories?.message}
                  />

                  <ImagePickerInput
                    control={control}
                    label="Imagem"
                    name="image"
                    error={errors.image?.message}
                  />

                  {Object.keys(errors).length > 0 && (
                    <Text style={{ color: 'red' }}>
                      {JSON.stringify(errors)}
                    </Text>
                  )}

                  <GradientButton
                    onPress={handleSubmit(handleOnSubmit)}
                    isLoading={isLoading}
                    text="Cadastrar serviço"
                  />
                </FormControl>
              </Center>
            </VStack>
          </VStack>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  )
}
