declare module '*.svg' {
  import type React from 'react'
  import type { SVGProps } from 'react-native-svg'
  const content: React.FC<SVGProps>
  export default content
}
