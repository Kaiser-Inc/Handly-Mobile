import { useFocusEffect } from '@react-navigation/native'
import { useCallback } from 'react'

export function useScreenRefresh(refreshFunction: () => void | Promise<void>) {
  useFocusEffect(
    useCallback(() => {
      refreshFunction()
    }, [refreshFunction]),
  )
}
