import { setup, handlers, LevelName, getLogger, Logger } from './deps.ts'

const loggerName = '@openneuro/cli'

/**
 * Setup a console logger used with the --debug flag
 */
export function setupLogging(level: LevelName) {
  setup({
    handlers: {
      console: new handlers.ConsoleHandler(level),
    },

    loggers: {
      '@openneuro/cli': {
        level,
        handlers: ['console'],
      },
    },
  })
}

export function parseStack(stack: string) {
  const lines = stack.split('\n')
  const caller = lines[2].trim()
  const token = caller.split('at ')
  return token[1]
}

const loggerProxyHandler = {
  // deno-lint-ignore no-explicit-any
  get: function (_: any, prop: keyof Logger) {
    const logger = getLogger(loggerName)
    const stack = new Error().stack
    if (stack) {
      const callerLocation = parseStack(stack)
      logger.debug(`Logger invoked at "${callerLocation}"`)
    }
    const logFunc = logger[prop] as typeof logger.warning
    return logFunc.bind(logger)
  },
}

const logger = new Proxy(getLogger(loggerName), loggerProxyHandler)

export { logger }
