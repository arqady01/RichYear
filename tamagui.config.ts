import { defaultConfig } from '@tamagui/config/v4'
import { createTamagui } from 'tamagui'

const config = createTamagui(defaultConfig)

export type AppConfig = typeof config

declare module 'tamagui' {
  // overrides TamaguiCustomConfig so your custom types
  // work everywhere you import `tamagui`
  interface TamaguiCustomConfig extends AppConfig {}
}

export default config
