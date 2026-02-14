/** Simple logger with category filtering for development */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LOG_COLORS: Record<LogLevel, string> = {
  debug: '#888',
  info: '#00f0ff',
  warn: '#ffe600',
  error: '#ff4444',
};

const isDebug = typeof window !== 'undefined' &&
  process.env.NEXT_PUBLIC_DEBUG === 'true';

function formatMessage(level: LogLevel, category: string, message: string): string[] {
  return [
    `%c[${level.toUpperCase()}] [${category}]%c ${message}`,
    `color: ${LOG_COLORS[level]}; font-weight: bold`,
    'color: inherit',
  ];
}

export const logger = {
  debug(category: string, message: string, ...args: unknown[]) {
    if (isDebug) {
      console.debug(...formatMessage('debug', category, message), ...args);
    }
  },

  info(category: string, message: string, ...args: unknown[]) {
    console.info(...formatMessage('info', category, message), ...args);
  },

  warn(category: string, message: string, ...args: unknown[]) {
    console.warn(...formatMessage('warn', category, message), ...args);
  },

  error(category: string, message: string, ...args: unknown[]) {
    console.error(...formatMessage('error', category, message), ...args);
  },
};
