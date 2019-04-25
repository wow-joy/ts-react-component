
const warned: Record<string, boolean> = {}

export default function warning(valid: boolean, component: string, message: string): void {
  if(!valid && !warned[message]) {
    console.warn(`[wjc: ${component}] ${message}`)
  }
}
