import { Text, VStack, View } from '@gluestack-ui/themed'
import { ChevronLeft, Flag } from 'lucide-react-native'
import React, { useEffect, useState } from 'react'
import {
  Animated,
  Dimensions,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native'

import { reportService } from '@services/services-services'
import { reportUser } from '@services/users-services'
import { AppError } from '@utils/AppError'
import { ReportReason } from '../@types/reportReasons'
import { GradientButton } from './GradientButton'
import { ToastMessage } from './ToastMessage'

interface ReportModalProps {
  visible: boolean
  type: 'service' | 'provider' | null
  targetId: string
  onClose: () => void
}

export function ReportModal({
  visible,
  type,
  targetId,
  onClose,
}: ReportModalProps) {
  const slideAnim = React.useRef(
    new Animated.Value(Dimensions.get('window').height),
  ).current
  const [selectedReason, setSelectedReason] = useState<ReportReason | null>(
    null,
  )
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>(
    'error',
  )

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: Dimensions.get('window').height * 0.1,
        duration: 300,
        useNativeDriver: true,
      }).start()
    } else {
      Animated.timing(slideAnim, {
        toValue: Dimensions.get('window').height,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setSelectedReason(null)
        setDescription('')
      })
    }
  }, [visible, slideAnim])

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToastMessage(message)
    setToastType(type)
    setToastVisible(true)
  }

  const handleOnSubmit = async () => {
    console.log(targetId, selectedReason, description)
    if (!selectedReason) {
      showToast('Por favor, selecione um motivo para a denúncia.', 'error')
      return
    }

    if (description.trim().length < 10) {
      showToast(
        'Por favor, forneça uma descrição detalhada (mínimo 10 caracteres). ',
        'error',
      )
      return
    }

    setIsSubmitting(true)
    try {
      if (type === 'service') {
        await reportService(targetId, selectedReason, description)
      } else {
        await reportUser(targetId, selectedReason, description)
      }
      showToast('Denúncia enviada com sucesso!', 'success')
      setTimeout(() => onClose(), 1500)
    } catch (error) {
      const isAppError = error instanceof AppError
      const errorMessage = isAppError
        ? error.message
        : 'Não foi possível enviar a denúncia. Tente novamente mais tarde.'
      showToast(errorMessage, 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!visible || !type) {
    return null
  }

  return (
    <View className="absolute inset-0 z-50 flex items-center justify-end bg-black/50">
      <ToastMessage
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
        onHide={() => setToastVisible(false)}
      />
      <Animated.View
        style={{ transform: [{ translateY: slideAnim }] }}
        className="bg-white w-full rounded-t-3xl p-6 shadow-lg h-[95%]"
      >
        <View className=" flex flex-row items-center">
          <TouchableOpacity
            onPress={onClose}
            className=" flex flex-row bg-steam-100 p-2 rounded-full mx-4"
          >
            <ChevronLeft size={28} color="#6F7D90" />
          </TouchableOpacity>
          <Text className=" text-xl">
            Denunciar {type === 'service' ? 'Serviço' : 'Prestador'}
          </Text>
        </View>

        <ScrollView
          className=" mt-8"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80, alignItems: 'center' }}
        >
          <View className=" mx-auto bg-danger-100 p-3 rounded-full mb-4">
            <Flag width={40} height={40} color="#F05D6C" />
          </View>
          <Text className="text-2xl font-bold text-gray-800 mb-4">
            {type === 'service'
              ? 'Denunciar este serviço'
              : 'Denunciar este prestador'}
          </Text>
          <Text className="text-xl text-gray-800 mb-4 w-11/12">
            Selecione o motivo da denúncia:
          </Text>

          <View className="flex flex-col gap-2 mt-2 mb-8 w-11/12">
            {Object.values(ReportReason).map((reason) => (
              <TouchableOpacity
                key={reason}
                onPress={() => setSelectedReason(reason)}
                className={`p-3 rounded-lg border ${selectedReason === reason ? 'border-purple-500 bg-purple-100' : 'border-gray-300 bg-white'}`}
              >
                <Text
                  className={`text-lg ${selectedReason === reason ? 'text-purple-700 font-bold' : 'text-gray-700'}`}
                >
                  {reason.replace(/_/g, ' ').toLowerCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text className="text-xl text-gray-800 mb-4 w-11/12">
            Descreva o motivo da denúncia (obrigatório):
          </Text>

          <TextInput
            className="w-11/12 h-28 bg-steam-100 rounded-lg p-4 mb-8"
            placeholder="Descreva aqui..."
            value={description}
            onChangeText={setDescription}
            multiline
            textAlignVertical="top"
          />

          <GradientButton
            onPress={handleOnSubmit}
            text="Enviar denúncia"
            isLoading={isSubmitting}
          />
        </ScrollView>
      </Animated.View>
    </View>
  )
}
