import { init as initApm } from '@elastic/apm-rum'

export let apm

export function setupApm(apmOptions) {
  apm = initApm(apmOptions)
}
