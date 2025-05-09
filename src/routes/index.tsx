import { NavigationContainer } from '@react-navigation/native'
import { AuthRoutes } from './auth.routes'
import { Box } from '@gluestack-ui/themed'

export function Routes() {
  return (
    <Box className=" flex-1 flex-grow bg-white h-full">
      <NavigationContainer>
        <AuthRoutes />
      </NavigationContainer>
    </Box>
  )
}
