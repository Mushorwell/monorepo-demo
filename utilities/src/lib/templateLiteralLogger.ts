import { flattenObjectWithArrays } from './flattenObject';

const ConsoleLogFunctions = [
  'debug',
  'info',
  'warn',
  'error',
  'table',
  'group',
  'groupCollapsed',
  'groupEnd',
  'time',
  'timeEnd',
  'timeLog',
  'count',
  'countReset',
  'timeStamp',
  'trace',
  'log',
] as const;

const AliasToMethodMap = {
  i: 'info',
  t: 'time',
  err: 'error',
  dbg: 'debug',
  tab: 'table',
} as const;

type ConsoleMethod = (typeof ConsoleLogFunctions)[number];
type Alias = keyof typeof AliasToMethodMap;
type LogLevel = ConsoleMethod | Alias;

const consoleMethods: Record<LogLevel, (...args: any[]) => void> =
  Object.fromEntries(
    ConsoleLogFunctions.map((method) => [
      method,
      console[method as keyof Console],
    ])
  ) as Record<LogLevel, (...args: any[]) => void>;

// Then add all aliases pointing to their corresponding methods
Object.entries(AliasToMethodMap).forEach(([alias, method]) => {
  consoleMethods[alias as Alias] = console[
    method as keyof Console
  ] as unknown as (...args: any[]) => void;
});

// Build level order with the same approach
const baseLevelOrder = {
  debug: 0,
  info: 1,
  table: 1,
  time: 1,
  timeEnd: 1,
  timeLog: 1,
  count: 1,
  countReset: 1,
  timeStamp: 1,
  group: 1,
  groupCollapsed: 1,
  groupEnd: 1,
  warn: 2,
  trace: 2,
  error: 3,
  log: 1,
};

const levelOrder: Record<LogLevel, number> = { ...baseLevelOrder } as Record<
  LogLevel,
  number
>;

Object.entries(AliasToMethodMap).forEach(([alias, method]) => {
  levelOrder[alias as Alias] =
    baseLevelOrder[method as keyof typeof baseLevelOrder];
});

type LogType = 'client' | 'server';
type PrimitiveType =
  | 'bigint'
  | 'boolean'
  | 'number'
  | 'string'
  | 'function'
  | 'object'
  | 'symbol'
  | 'undefined'
  | 'nullish';

interface GroupedOptions {
  collapsed?: boolean;
  customStructure?: Record<string, any[]>;
}

interface AdditionalOptions {
  //TODO:  multiLine?: GroupedOptions; // if object is excluded then no grouping
  type?: LogType; // TODO: unify logging utility for both client and server
  style?: Record<string, string>;
  primitivesAllowedInTemplateString?: readonly PrimitiveType[];
  skipPrimitivesIncludedInMessage?: boolean;
  excludeOutputObject?: boolean;
  tableIndexPrefix?: string;
  tableIndexDelimeter?: string;
}

interface LoggerConfig {
  enabled: boolean;
  prefix?: string;
  minLevel?: LogLevel;
  options?: AdditionalOptions;
}

const DEFAULT_PRIMITIVES_ALLOWED: PrimitiveType[] = [
  'bigint',
  'boolean',
  'number',
  'string',
];

const defaultConfig: LoggerConfig = {
  enabled: true,
  prefix: '',
  minLevel: 'debug',
  options: {
    type: 'client',
    primitivesAllowedInTemplateString: DEFAULT_PRIMITIVES_ALLOWED,
    style: {},
    tableIndexPrefix: '',
    tableIndexDelimeter: '.',
  },
};

type INSPECT_KEYS = keyof typeof defaultConfig;

interface TabulatedOutputObjectOptions {
  tableIndexPrefix?: string;
  tableIndexDelimeter?: string;
}

type TTemplateLiteralLogger = {
  [K in LogLevel]: (message: TemplateStringsArray, ...args: any[]) => void;
};

export class TemplateLiteralLogger implements TTemplateLiteralLogger {
  private config: LoggerConfig;
  private allLevels: LogLevel[] = [
    ...ConsoleLogFunctions,
    ...(Object.keys(AliasToMethodMap) as Alias[]),
  ] satisfies LogLevel[];
  public debug!: (message: TemplateStringsArray, ...args: any[]) => void;
  public info!: (message: TemplateStringsArray, ...args: any[]) => void;
  public warn!: (message: TemplateStringsArray, ...args: any[]) => void;
  public error!: (message: TemplateStringsArray, ...args: any[]) => void;
  public table!: (message: TemplateStringsArray, ...args: any[]) => void;
  public group!: (message: TemplateStringsArray, ...args: any[]) => void;
  public groupCollapsed!: (
    message: TemplateStringsArray,
    ...args: any[]
  ) => void;
  public groupEnd!: (message: TemplateStringsArray, ...args: any[]) => void;
  public time!: (message: TemplateStringsArray, ...args: any[]) => void;
  public timeEnd!: (message: TemplateStringsArray, ...args: any[]) => void;
  public timeLog!: (message: TemplateStringsArray, ...args: any[]) => void;
  public count!: (message: TemplateStringsArray, ...args: any[]) => void;
  public countReset!: (message: TemplateStringsArray, ...args: any[]) => void;
  public timeStamp!: (message: TemplateStringsArray, ...args: any[]) => void;
  public trace!: (message: TemplateStringsArray, ...args: any[]) => void;
  public log!: (message: TemplateStringsArray, ...args: any[]) => void;
  public i!: (message: TemplateStringsArray, ...args: any[]) => void;
  public t!: (message: TemplateStringsArray, ...args: any[]) => void;
  public err!: (message: TemplateStringsArray, ...args: any[]) => void;
  public dbg!: (message: TemplateStringsArray, ...args: any[]) => void;
  public tab!: (message: TemplateStringsArray, ...args: any[]) => void;

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = {
      ...defaultConfig,
      ...config,
      options: { ...defaultConfig.options, ...config.options },
    };

    this.allLevels.forEach((level) => {
      if (level in AliasToMethodMap) {
        this[level] = (message: TemplateStringsArray, ...args: any[]) => {
          this.setLogMethod(AliasToMethodMap[level as Alias], message, ...args);
        };
      } else {
        this[level] = (message: TemplateStringsArray, ...args: any[]) => {
          this.setLogMethod(level, message, ...args);
        };
      }
    });

    if (this.config?.options?.primitivesAllowedInTemplateString) {
      const uniqueTypes = [
        ...new Set(this.config?.options?.primitivesAllowedInTemplateString),
      ];
      this.config.options.primitivesAllowedInTemplateString =
        uniqueTypes as readonly PrimitiveType[];
    }
  }

  private shouldLog(level: LogLevel): boolean {
    if (!this.config.enabled) return false;
    const minLevel = this.config.minLevel ?? 'warn';
    return levelOrder[level] >= levelOrder[minLevel];
  }

  private prefixMessage(prefix: string, message: string) {
    return prefix ? `${prefix} ${message}` : message;
  }

  private createLogOutputObject(
    args?: any[],
    templateAllowedPrimitives?: any[]
  ) {
    return args?.reduce((acc, currentArg, index) => {
      const isNonNullNonArrayNonFunctionObj =
        currentArg !== null &&
        typeof currentArg === 'object' &&
        typeof currentArg !== 'function' &&
        !Array.isArray(currentArg);
      if (
        this.config.options?.skipPrimitivesIncludedInMessage &&
        templateAllowedPrimitives?.includes(currentArg)
      ) {
        return acc;
      }
      if (typeof currentArg === 'string') {
        return { ...acc, [currentArg]: currentArg };
      }
      if (isNonNullNonArrayNonFunctionObj) {
        return { ...acc, ...currentArg };
      }
      return { ...acc, [`arg${index}`]: currentArg };
    }, {});
  }

  private structureMessage(
    message: string,
    templateAllowedPrimitives: any[],
    level: LogLevel,
    options: TabulatedOutputObjectOptions = {
      tableIndexDelimeter: this.config.options?.tableIndexDelimeter,
      tableIndexPrefix: this.config.options?.tableIndexPrefix,
    },
    ...args: any[]
  ) {
    const messagePart = this.prefixMessage(
      this.config.prefix || '',
      message || ''
    );
    const resultObj = this.createLogOutputObject(
      args,
      templateAllowedPrimitives
    );
    let outputObj;
    if (this.config.options?.excludeOutputObject) {
      outputObj = undefined;
      return { messagePart, outputObj };
    }
    outputObj = {};
    if (level === 'table') {
      outputObj = flattenObjectWithArrays(resultObj, {
        prefix: options.tableIndexPrefix,
        delimiter: options.tableIndexDelimeter,
      });
    } else {
      outputObj = resultObj;
    }
    return { messagePart, outputObj };
  }

  private camelToKebab(camelCaseString: string) {
    return camelCaseString.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  }

  private setLogMethod(
    level: LogLevel = 'log',
    message?: TemplateStringsArray,
    ...args: any[]
  ): void {
    if (!this.shouldLog(level)) return;

    const primitives: any[] = [];

    args.forEach((arg) => {
      const nullish =
        arg === null ||
        (Array.isArray(arg) && arg.length === 0) ||
        (typeof arg === 'object' && Object.keys(arg).length === 0)
          ? 'nullish'
          : undefined;
      const type = typeof arg;
      if (
        (nullish &&
          this.config?.options?.primitivesAllowedInTemplateString?.includes(
            nullish
          )) ||
        this.config.options?.primitivesAllowedInTemplateString?.includes(type)
      ) {
        primitives.push(arg);
      }
    });

    const formattedMessage = this.formatMessage(message, ...primitives);
    const tabulatedOutputObjectOptions = {
      tableIndexDelimeter: '.',
      tableIndexPrefix: '',
    };
    const { messagePart, outputObj } = this.structureMessage(
      formattedMessage,
      primitives,
      level,
      tabulatedOutputObjectOptions,
      ...args
    );
    let prefixedMessage = '';
    let styles = '';
    if (this.config?.options?.style) {
      prefixedMessage = '%c' + messagePart;
      styles = this.camelToKebab(
        JSON.stringify(this.config.options.style)
          .replace(/[{"}]/g, '')
          .replace(/[,]/g, ';')
      );
    }

    switch (level) {
      case 'table':
        consoleMethods[level](outputObj);
        break;
      case 'groupEnd':
        consoleMethods[level]();
        break;
      case 'time':
      case 'timeEnd':
      case 'timeStamp':
      case 'group':
      case 'groupCollapsed':
      case 'count':
      case 'countReset':
        consoleMethods[level](prefixedMessage);
        break;
      default:
        consoleMethods[level](prefixedMessage, styles, outputObj);
        break;
    }

    if (level === 'table' || level === 'tab') {
      consoleMethods[level](outputObj);
    } else if (level === 'groupEnd') {
      consoleMethods[level]();
    } else {
      consoleMethods[level](prefixedMessage, styles, outputObj);
    }
  }

  private formatMessage(
    strings?: TemplateStringsArray,
    ...args: any[]
  ): string {
    if (!strings || strings.length === 0) {
      return args?.join('') || '';
    }
    if (!args || args.length === 0) {
      return strings.join('');
    }
    let result = '';
    const maxLength = Math.min(strings.length, args.length);

    for (let index = 0; index < maxLength; index++) {
      result += strings[index];
      if (index < args.length) result += String(args[index]);
    }
    return result;
  }

  defaultBehaviour(message: TemplateStringsArray, ...args: any[]): void {
    this.setLogMethod('log', message, ...args);
  }

  configure(config: Partial<LoggerConfig>): void {
    this.config = {
      ...this.config,
      ...config,
      options: { ...this.config.options, ...config.options },
    };
  }

  inspectLoggerConfig(
    key?: INSPECT_KEYS
  ): LoggerConfig | LoggerConfig[INSPECT_KEYS] {
    return key ? this.config[key] : this.config;
  }

  public static isPropertyOfDebugLogger(
    prop: string | symbol
  ): prop is keyof TemplateLiteralLogger {
    return prop in TemplateLiteralLogger.prototype;
  }
}

function isPropertyOfDebugLogger(
  prop: string | symbol
): prop is keyof TemplateLiteralLogger {
  return prop in TemplateLiteralLogger.prototype;
}

export function setDefault(obj: TemplateLiteralLogger): TemplateLiteralLogger {
  return new Proxy(obj, {
    get: function (
      target: TemplateLiteralLogger,
      prop: string | symbol,
      receiver: any
    ) {
      if (!isPropertyOfDebugLogger(prop)) return target.inspectLoggerConfig();
      return Reflect.get(target, prop, receiver);
    },
  }) as TemplateLiteralLogger;
}

export function setDefaultCall(
  obj: TemplateLiteralLogger,
  callHandler: (
    target: TemplateLiteralLogger,
    message: TemplateStringsArray,
    ...args: any[]
  ) => void
): TemplateLiteralLogger &
  ((message: TemplateStringsArray, ...args: any[]) => void) {
  const proxy = new Proxy(obj, {
    // get: function (target: DebugLogger, prop: string | symbol, receiver: any) {
    //   if (!isPropertyOfDebugLogger(prop)) return target.inspectLoggerConfig();
    //   return Reflect.get(target, prop, receiver);
    // },
    apply: function (
      target: TemplateLiteralLogger,
      thisArg: any,
      args: any[]
    ): void {
      return callHandler(target, ...(args as [TemplateStringsArray, ...any[]]));
    },
  });
  return proxy as TemplateLiteralLogger &
    ((message: TemplateStringsArray, ...args: any[]) => void);
}

export function setDefaultCall2(
  obj: TemplateLiteralLogger,
  callHandler: (
    target: TemplateLiteralLogger,
    message: TemplateStringsArray,
    ...args: any[]
  ) => void
): TemplateLiteralLogger &
  ((message: TemplateStringsArray, ...args: any[]) => void) {
  const proxy = new Proxy(obj, {
    apply: function (
      target: TemplateLiteralLogger,
      thisArg: any,
      args: any[]
    ): void {
      console.log('Proxy apply trap triggered!', { target, args }); // Diagnostic log
      return callHandler(target, ...(args as [TemplateStringsArray, ...any[]]));
    },
  });
  return proxy as TemplateLiteralLogger &
    ((message: TemplateStringsArray, ...args: any[]) => void);
}

// Singleton instance (optional, for convenience)
export const logger = (prefix: string) => new TemplateLiteralLogger({ prefix });
export const useLog = (config: LoggerConfig, type: LogLevel = 'log') => {
  const logger = new TemplateLiteralLogger(config);
  return logger[type].bind(logger);
};

export function TestStuff() {
  const datetime = new Date(Date.now());
  const dateString = datetime.toUTCString();
  const logdbg = new TemplateLiteralLogger({
    enabled: true,
    minLevel: 'debug',
    prefix: `[What the hail!!! ${dateString}]`,
    options: {
      style: { color: 'yellow', backgroundColor: 'black' },
      skipPrimitivesIncludedInMessage: true,
    },
  });
  const log = logdbg.defaultBehaviour.bind(logdbg);
  const loggy = setDefaultCall2(logdbg, (target, message, ...args) => {
    console.log('Intercepted call:', message, ...args);
    target.log(message, ...args);
  });

  const foo = {
    bar: 'foo',
    baz: {
      fizz: 'buzz',
      a: {
        b: 100,
        c: false,
      },
    },
  };

  const adam = ['man', ['woman', 'child']];

  const simple = { a: 1, b: 2, c: 4 };

  const simpleArr = [1234, 5678, 9876];

  log`Test ${123}`;
  log`${123} ${123} ${123} ${123}`;
  log`is burning fire: ${'cow'} ${'chicken'} ${'milk'} ${'egg'} ${'bee'} ${'honey'}`;
  log`for the lolz ${{ adam, foo, simpleArr }}`;
  log`for the vibes ${simple}`;
  logdbg.error`logdbg Test ${123}`;
  logdbg.warn`logdbg is burning fire: ${'cow'} ${'chicken'} ${'milk'} ${'egg'} ${'bee'} ${'honey'}`;
  // logdbg.table`logdbg for the lolz ${{ adam, foo, simpleArr }}`;
  // logdbg.table`logdbg for the lolz ${adam}`;
  // logdbg.table`logdbg for the lolz ${[foo]}`;
  logdbg.configure({
    options: {
      style: { color: 'green', backgroundColor: 'black' },
      skipPrimitivesIncludedInMessage: false,
    },
  });
  logdbg.table`${foo}`;
  logdbg.table`${adam}`;
  logdbg.table`${simpleArr}`;
  logdbg.log`logdbg Test ${foo}`;
  logdbg.info`logdbg for the vibes ${{ simple, meme: 'yolo' }}`;
  loggy.log`loggy Test`;
  loggy.log`loggy Test ${123}`;
  // loggy`loggy is burning fire 1: ${'cow'} ${'chicken'} ${'milk'} ${'egg'} ${'bee'} ${'honey'}`;
  // loggy`loggy for the lolz ${{ adam, foo, simpleArr }}`;
  // loggy`loggy for the vibes ${simple}`;
}
// TestStuff();
