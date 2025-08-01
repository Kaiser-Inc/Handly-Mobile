import { FormInput } from '@components/FormInput'
import { FormSelector } from '@components/FormSelector'
import { GradientButton } from '@components/GradientButton'
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
import { useNavigation, useRoute } from '@react-navigation/native'
import type { AppNavigatorRoutesProps } from '@routes/app.routes'
import {
  createService,
  getService,
  updateService,
} from '@services/services-services'
import { AppError } from '@utils/AppError'
import React from 'react'
import { useForm } from 'react-hook-form'
import { Platform } from 'react-native'
import { type serviceData, serviceSchema } from '../@types/serviceSchema'

type RouteParams = {
  serviceId?: string
}

export function ServiceForm() {
  const route = useRoute()
  const navigation = useNavigation<AppNavigatorRoutesProps>()
  const { serviceId } = (route.params as RouteParams) || {}
  const [isEditing, setIsEditing] = React.useState(false)

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<serviceData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: '',
      description: '',
      categories: [],
      image: null,
    },
  })

  const [isLoading, setIsLoading] = React.useState(false)
  const [toastVisible, setToastVisible] = React.useState(false)
  const [toastMessage, setToastMessage] = React.useState('')
  const [toastType, setToastType] = React.useState<
    'success' | 'error' | 'info'
  >('error')

  React.useEffect(() => {
    if (serviceId) {
      loadServiceData()
    }
  }, [serviceId])

  async function loadServiceData() {
    if (!serviceId) return

    try {
      setIsLoading(true)
      const serviceData = await getService(serviceId)
      setIsEditing(true)

      setValue('name', serviceData.name)
      setValue('description', serviceData.description)
      setValue('categories', serviceData.categories)
      if (serviceData.image) {
        setValue('image', serviceData.image)
      }
    } catch (error) {
      const isAppError = error instanceof AppError
      const message = isAppError
        ? error.message
        : 'Erro ao carregar dados do serviço'

      setToastMessage(message)
      setToastType('error')
      setToastVisible(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOnSubmit = async (formData: serviceData) => {
    setIsLoading(true)
    try {
      if (isEditing && serviceId) {
        await updateService(serviceId, formData)
        setToastMessage('Serviço atualizado com sucesso.')
      } else {
        await createService(formData)
        setToastMessage('Cadastro feito com sucesso.')
      }

      reset()
      setIsEditing(false)
      setToastType('success')
      setToastVisible(true)

      setTimeout(() => {
        navigation.goBack()
      }, 1500)
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
                <Text className="text-xl font-bold">
                  {isEditing ? 'Editar Serviço!' : 'Cadastrar Serviço!'}
                </Text>
                <FormControl className=" w-full h-fit flex mt-8">
                  <FormInput
                    control={control}
                    name="name"
                    label="Nome"
                    testID="serviceNameInput"
                    placeholder="Insira o nome do serviço"
                    error={errors.name?.message}
                  />
                  <FormInput
                    control={control}
                    name="description"
                    label="Descrição"
                    testID="serviceDescriptionInput"
                    keyboardType="default"
                    isTextarea
                    placeholder="Adicione uma descrição do serviço"
                    error={errors.description?.message}
                  />

                  <FormSelector
                    control={control}
                    label="Categorias"
                    testID="serviceCategoriesInput"
                    name="categories"
                    error={errors.categories?.message}
                  />

                  <GradientButton
                    onPress={handleSubmit(handleOnSubmit)}
                    testID="serviceSubmitButton"
                    isLoading={isLoading}
                    text={isEditing ? 'Atualizar serviço' : 'Cadastrar serviço'}
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
