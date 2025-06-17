import { Image } from '@gluestack-ui/themed'
import type { ComponentProps } from 'react'

type UserPhotoProps = ComponentProps<typeof Image>

export function UserPhoto({ ...rest }: UserPhotoProps) {
  return <Image {...rest} />
}
