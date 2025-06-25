import { Image, Pressable, Text, VStack } from '@gluestack-ui/themed'
import * as ImagePicker from 'expo-image-picker'
import { CloudUpload } from 'lucide-react-native'
import React, { useState } from 'react'
import {
  type Control,
  Controller,
  type FieldValues,
  type Path,
} from 'react-hook-form'

interface ImagePickerInputProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  label: string
  error?: string
}

export function ImagePickerInput<T extends FieldValues>({
  control,
  label,
  name,
  error,
}: ImagePickerInputProps<T>) {
  return (
    <VStack className="w-full px-8 mt-2">
      <Text className="text-xl font-bold mb-2"> Imagem </Text>

      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => {
          async function pickImage() {
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: 'images',
              allowsEditing: true,
              quality: 1,
            })

            if (!result.canceled) {
              onChange(result.assets[0].uri)
            }
          }

          return (
            <Pressable
              onPress={pickImage}
              className=" flex flex-col border-2 border-gray-400 h-48 border-dashed rounded-lg items-center justify-center w-full mx-auto my-4"
            >
              {value ? (
                <Image
                  source={{ uri: value }}
                  alt="image preview"
                  height={150}
                  width={350}
                  borderRadius={8}
                />
              ) : (
                <VStack className=" flex flex-col justify-center items-center">
                  <CloudUpload size={30} />
                  <Text className="text-gray-500">
                    Nenhum arquivo selecionado
                  </Text>
                </VStack>
              )}
            </Pressable>
          )
        }}
      />
      {error && <Text className="text-danger-300">{error}</Text>}
    </VStack>
  )
}
