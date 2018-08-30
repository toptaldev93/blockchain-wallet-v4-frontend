import { path } from 'ramda'

// New Device Setup
export const getNewDeviceSetupStep = path([
  'components',
  'lockbox',
  'newDeviceSetup',
  'currentStep'
])
export const getNewDeviceInfo = path([
  'components',
  'lockbox',
  'newDeviceSetup',
  'device'
])

// Device Connections
export const getConnectionStatus = path(['components', 'lockbox', 'connection'])
