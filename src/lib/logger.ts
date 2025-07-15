export interface LogLevel {
  DEBUG: 0;
  INFO: 1;
  WARN: 2;
  ERROR: 3;
}

export const LOG_LEVELS: LogLevel = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

class Logger {
  private static instance: Logger;
  private currentLevel: number = LOG_LEVELS.INFO;
  private isDevelopment: boolean = import.meta.env.DEV;

  private constructor() {
    // Set log level based on environment
    this.currentLevel = this.isDevelopment ? LOG_LEVELS.DEBUG : LOG_LEVELS.ERROR;
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  public setLevel(level: number): void {
    this.currentLevel = level;
  }

  public debug(message: string, ...args: any[]): void {
    if (this.currentLevel <= LOG_LEVELS.DEBUG) {
      console.log(`[DEBUG] ${message}`, ...args);
    }
  }

  public info(message: string, ...args: any[]): void {
    if (this.currentLevel <= LOG_LEVELS.INFO) {
      console.info(`[INFO] ${message}`, ...args);
    }
  }

  public warn(message: string, ...args: any[]): void {
    if (this.currentLevel <= LOG_LEVELS.WARN) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  }

  public error(message: string, ...args: any[]): void {
    if (this.currentLevel <= LOG_LEVELS.ERROR) {
      console.error(`[ERROR] ${message}`, ...args);
    }
  }

  public performance(label: string, fn: () => void): void {
    if (this.currentLevel <= LOG_LEVELS.DEBUG) {
      console.time(label);
      fn();
      console.timeEnd(label);
    } else {
      fn();
    }
  }
}

export const logger = Logger.getInstance();