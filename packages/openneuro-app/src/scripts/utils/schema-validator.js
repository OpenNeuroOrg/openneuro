// @ts-nocheck
var __defProp = Object.defineProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw new Error('Dynamic require of "' + x + '" is not supported');
});
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// http-url:https://deno.land/std@0.177.0/log/levels.ts
var LogLevels = /* @__PURE__ */ ((LogLevels2) => {
  LogLevels2[LogLevels2["NOTSET"] = 0] = "NOTSET";
  LogLevels2[LogLevels2["DEBUG"] = 10] = "DEBUG";
  LogLevels2[LogLevels2["INFO"] = 20] = "INFO";
  LogLevels2[LogLevels2["WARNING"] = 30] = "WARNING";
  LogLevels2[LogLevels2["ERROR"] = 40] = "ERROR";
  LogLevels2[LogLevels2["CRITICAL"] = 50] = "CRITICAL";
  return LogLevels2;
})(LogLevels || {});
var LogLevelNames = Object.keys(LogLevels).filter(
  (key) => isNaN(Number(key))
);
var byLevel = {
  [String(0 /* NOTSET */)]: "NOTSET",
  [String(10 /* DEBUG */)]: "DEBUG",
  [String(20 /* INFO */)]: "INFO",
  [String(30 /* WARNING */)]: "WARNING",
  [String(40 /* ERROR */)]: "ERROR",
  [String(50 /* CRITICAL */)]: "CRITICAL"
};
function getLevelByName(name) {
  switch (name) {
    case "NOTSET":
      return 0 /* NOTSET */;
    case "DEBUG":
      return 10 /* DEBUG */;
    case "INFO":
      return 20 /* INFO */;
    case "WARNING":
      return 30 /* WARNING */;
    case "ERROR":
      return 40 /* ERROR */;
    case "CRITICAL":
      return 50 /* CRITICAL */;
    default:
      throw new Error(`no log level found for "${name}"`);
  }
}
function getLevelName(level) {
  const levelName = byLevel[level];
  if (levelName) {
    return levelName;
  }
  throw new Error(`no level name found for level: ${level}`);
}

// http-url:https://deno.land/std@0.177.0/log/logger.ts
var LogRecord = class {
  #args;
  #datetime;
  constructor(options) {
    this.msg = options.msg;
    this.#args = [...options.args];
    this.level = options.level;
    this.loggerName = options.loggerName;
    this.#datetime = /* @__PURE__ */ new Date();
    this.levelName = getLevelName(options.level);
  }
  get args() {
    return [...this.#args];
  }
  get datetime() {
    return new Date(this.#datetime.getTime());
  }
};
var Logger = class {
  #level;
  #handlers;
  #loggerName;
  constructor(loggerName, levelName, options = {}) {
    this.#loggerName = loggerName;
    this.#level = getLevelByName(levelName);
    this.#handlers = options.handlers || [];
  }
  get level() {
    return this.#level;
  }
  set level(level) {
    this.#level = level;
  }
  get levelName() {
    return getLevelName(this.#level);
  }
  set levelName(levelName) {
    this.#level = getLevelByName(levelName);
  }
  get loggerName() {
    return this.#loggerName;
  }
  set handlers(hndls) {
    this.#handlers = hndls;
  }
  get handlers() {
    return this.#handlers;
  }
  /** If the level of the logger is greater than the level to log, then nothing
   * is logged, otherwise a log record is passed to each log handler.  `msg` data
   * passed in is returned.  If a function is passed in, it is only evaluated
   * if the msg will be logged and the return value will be the result of the
   * function, not the function itself, unless the function isn't called, in which
   * case undefined is returned.  All types are coerced to strings for logging.
   */
  #_log(level, msg, ...args) {
    if (this.level > level) {
      return msg instanceof Function ? void 0 : msg;
    }
    let fnResult;
    let logMessage;
    if (msg instanceof Function) {
      fnResult = msg();
      logMessage = this.asString(fnResult);
    } else {
      logMessage = this.asString(msg);
    }
    const record = new LogRecord({
      msg: logMessage,
      args,
      level,
      loggerName: this.loggerName
    });
    this.#handlers.forEach((handler) => {
      handler.handle(record);
    });
    return msg instanceof Function ? fnResult : msg;
  }
  asString(data) {
    if (typeof data === "string") {
      return data;
    } else if (data === null || typeof data === "number" || typeof data === "bigint" || typeof data === "boolean" || typeof data === "undefined" || typeof data === "symbol") {
      return String(data);
    } else if (data instanceof Error) {
      return data.stack;
    } else if (typeof data === "object") {
      return JSON.stringify(data);
    }
    return "undefined";
  }
  debug(msg, ...args) {
    return this.#_log(10 /* DEBUG */, msg, ...args);
  }
  info(msg, ...args) {
    return this.#_log(20 /* INFO */, msg, ...args);
  }
  warning(msg, ...args) {
    return this.#_log(30 /* WARNING */, msg, ...args);
  }
  error(msg, ...args) {
    return this.#_log(40 /* ERROR */, msg, ...args);
  }
  critical(msg, ...args) {
    return this.#_log(50 /* CRITICAL */, msg, ...args);
  }
};

// http-url:https://deno.land/std@0.177.0/fmt/colors.ts
var colors_exports = {};
__export(colors_exports, {
  bgBlack: () => bgBlack,
  bgBlue: () => bgBlue,
  bgBrightBlack: () => bgBrightBlack,
  bgBrightBlue: () => bgBrightBlue,
  bgBrightCyan: () => bgBrightCyan,
  bgBrightGreen: () => bgBrightGreen,
  bgBrightMagenta: () => bgBrightMagenta,
  bgBrightRed: () => bgBrightRed,
  bgBrightWhite: () => bgBrightWhite,
  bgBrightYellow: () => bgBrightYellow,
  bgCyan: () => bgCyan,
  bgGreen: () => bgGreen,
  bgMagenta: () => bgMagenta,
  bgRed: () => bgRed,
  bgRgb24: () => bgRgb24,
  bgRgb8: () => bgRgb8,
  bgWhite: () => bgWhite,
  bgYellow: () => bgYellow,
  black: () => black,
  blue: () => blue,
  bold: () => bold,
  brightBlack: () => brightBlack,
  brightBlue: () => brightBlue,
  brightCyan: () => brightCyan,
  brightGreen: () => brightGreen,
  brightMagenta: () => brightMagenta,
  brightRed: () => brightRed,
  brightWhite: () => brightWhite,
  brightYellow: () => brightYellow,
  cyan: () => cyan,
  dim: () => dim,
  getColorEnabled: () => getColorEnabled,
  gray: () => gray,
  green: () => green,
  hidden: () => hidden,
  inverse: () => inverse,
  italic: () => italic,
  magenta: () => magenta,
  red: () => red,
  reset: () => reset,
  rgb24: () => rgb24,
  rgb8: () => rgb8,
  setColorEnabled: () => setColorEnabled,
  strikethrough: () => strikethrough,
  stripColor: () => stripColor,
  underline: () => underline,
  white: () => white,
  yellow: () => yellow
});
var { Deno: Deno2 } = globalThis;
var noColor = typeof Deno2?.noColor === "boolean" ? Deno2.noColor : true;
var enabled = !noColor;
function setColorEnabled(value) {
  if (noColor) {
    return;
  }
  enabled = value;
}
function getColorEnabled() {
  return enabled;
}
function code(open, close) {
  return {
    open: `\x1B[${open.join(";")}m`,
    close: `\x1B[${close}m`,
    regexp: new RegExp(`\\x1b\\[${close}m`, "g")
  };
}
function run(str, code3) {
  return enabled ? `${code3.open}${str.replace(code3.regexp, code3.open)}${code3.close}` : str;
}
function reset(str) {
  return run(str, code([0], 0));
}
function bold(str) {
  return run(str, code([1], 22));
}
function dim(str) {
  return run(str, code([2], 22));
}
function italic(str) {
  return run(str, code([3], 23));
}
function underline(str) {
  return run(str, code([4], 24));
}
function inverse(str) {
  return run(str, code([7], 27));
}
function hidden(str) {
  return run(str, code([8], 28));
}
function strikethrough(str) {
  return run(str, code([9], 29));
}
function black(str) {
  return run(str, code([30], 39));
}
function red(str) {
  return run(str, code([31], 39));
}
function green(str) {
  return run(str, code([32], 39));
}
function yellow(str) {
  return run(str, code([33], 39));
}
function blue(str) {
  return run(str, code([34], 39));
}
function magenta(str) {
  return run(str, code([35], 39));
}
function cyan(str) {
  return run(str, code([36], 39));
}
function white(str) {
  return run(str, code([37], 39));
}
function gray(str) {
  return brightBlack(str);
}
function brightBlack(str) {
  return run(str, code([90], 39));
}
function brightRed(str) {
  return run(str, code([91], 39));
}
function brightGreen(str) {
  return run(str, code([92], 39));
}
function brightYellow(str) {
  return run(str, code([93], 39));
}
function brightBlue(str) {
  return run(str, code([94], 39));
}
function brightMagenta(str) {
  return run(str, code([95], 39));
}
function brightCyan(str) {
  return run(str, code([96], 39));
}
function brightWhite(str) {
  return run(str, code([97], 39));
}
function bgBlack(str) {
  return run(str, code([40], 49));
}
function bgRed(str) {
  return run(str, code([41], 49));
}
function bgGreen(str) {
  return run(str, code([42], 49));
}
function bgYellow(str) {
  return run(str, code([43], 49));
}
function bgBlue(str) {
  return run(str, code([44], 49));
}
function bgMagenta(str) {
  return run(str, code([45], 49));
}
function bgCyan(str) {
  return run(str, code([46], 49));
}
function bgWhite(str) {
  return run(str, code([47], 49));
}
function bgBrightBlack(str) {
  return run(str, code([100], 49));
}
function bgBrightRed(str) {
  return run(str, code([101], 49));
}
function bgBrightGreen(str) {
  return run(str, code([102], 49));
}
function bgBrightYellow(str) {
  return run(str, code([103], 49));
}
function bgBrightBlue(str) {
  return run(str, code([104], 49));
}
function bgBrightMagenta(str) {
  return run(str, code([105], 49));
}
function bgBrightCyan(str) {
  return run(str, code([106], 49));
}
function bgBrightWhite(str) {
  return run(str, code([107], 49));
}
function clampAndTruncate(n, max = 255, min = 0) {
  return Math.trunc(Math.max(Math.min(n, max), min));
}
function rgb8(str, color) {
  return run(str, code([38, 5, clampAndTruncate(color)], 39));
}
function bgRgb8(str, color) {
  return run(str, code([48, 5, clampAndTruncate(color)], 49));
}
function rgb24(str, color) {
  if (typeof color === "number") {
    return run(
      str,
      code(
        [38, 2, color >> 16 & 255, color >> 8 & 255, color & 255],
        39
      )
    );
  }
  return run(
    str,
    code(
      [
        38,
        2,
        clampAndTruncate(color.r),
        clampAndTruncate(color.g),
        clampAndTruncate(color.b)
      ],
      39
    )
  );
}
function bgRgb24(str, color) {
  if (typeof color === "number") {
    return run(
      str,
      code(
        [48, 2, color >> 16 & 255, color >> 8 & 255, color & 255],
        49
      )
    );
  }
  return run(
    str,
    code(
      [
        48,
        2,
        clampAndTruncate(color.r),
        clampAndTruncate(color.g),
        clampAndTruncate(color.b)
      ],
      49
    )
  );
}
var ANSI_PATTERN = new RegExp(
  [
    "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
    "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))"
  ].join("|"),
  "g"
);
function stripColor(string2) {
  return string2.replace(ANSI_PATTERN, "");
}

// http-url:https://deno.land/std@0.177.0/fs/exists.ts
async function exists(filePath) {
  try {
    await Deno.lstat(filePath);
    return true;
  } catch (error2) {
    if (error2 instanceof Deno.errors.NotFound) {
      return false;
    }
    throw error2;
  }
}
function existsSync(filePath) {
  try {
    Deno.lstatSync(filePath);
    return true;
  } catch (error2) {
    if (error2 instanceof Deno.errors.NotFound) {
      return false;
    }
    throw error2;
  }
}

// http-url:https://deno.land/std@0.177.0/bytes/copy.ts
function copy(src, dst, off = 0) {
  off = Math.max(0, Math.min(off, dst.byteLength));
  const dstBytesAvailable = dst.byteLength - off;
  if (src.byteLength > dstBytesAvailable) {
    src = src.subarray(0, dstBytesAvailable);
  }
  dst.set(src, off);
  return src.byteLength;
}

// http-url:https://deno.land/std@0.177.0/io/buf_writer.ts
var DEFAULT_BUF_SIZE = 4096;
var AbstractBufBase = class {
  constructor(buf) {
    this.usedBufferBytes = 0;
    this.err = null;
    this.buf = buf;
  }
  /** Size returns the size of the underlying buffer in bytes. */
  size() {
    return this.buf.byteLength;
  }
  /** Returns how many bytes are unused in the buffer. */
  available() {
    return this.buf.byteLength - this.usedBufferBytes;
  }
  /** buffered returns the number of bytes that have been written into the
   * current buffer.
   */
  buffered() {
    return this.usedBufferBytes;
  }
};
var BufWriterSync = class extends AbstractBufBase {
  #writer;
  /** return new BufWriterSync unless writer is BufWriterSync */
  static create(writer, size = DEFAULT_BUF_SIZE) {
    return writer instanceof BufWriterSync ? writer : new BufWriterSync(writer, size);
  }
  constructor(writer, size = DEFAULT_BUF_SIZE) {
    super(new Uint8Array(size <= 0 ? DEFAULT_BUF_SIZE : size));
    this.#writer = writer;
  }
  /** Discards any unflushed buffered data, clears any error, and
   * resets buffer to write its output to w.
   */
  reset(w) {
    this.err = null;
    this.usedBufferBytes = 0;
    this.#writer = w;
  }
  /** Flush writes any buffered data to the underlying io.WriterSync. */
  flush() {
    if (this.err !== null)
      throw this.err;
    if (this.usedBufferBytes === 0)
      return;
    try {
      const p = this.buf.subarray(0, this.usedBufferBytes);
      let nwritten = 0;
      while (nwritten < p.length) {
        nwritten += this.#writer.writeSync(p.subarray(nwritten));
      }
    } catch (e) {
      if (e instanceof Error) {
        this.err = e;
      }
      throw e;
    }
    this.buf = new Uint8Array(this.buf.length);
    this.usedBufferBytes = 0;
  }
  /** Writes the contents of `data` into the buffer.  If the contents won't fully
   * fit into the buffer, those bytes that can are copied into the buffer, the
   * buffer is the flushed to the writer and the remaining bytes are copied into
   * the now empty buffer.
   *
   * @return the number of bytes written to the buffer.
   */
  writeSync(data) {
    if (this.err !== null)
      throw this.err;
    if (data.length === 0)
      return 0;
    let totalBytesWritten = 0;
    let numBytesWritten = 0;
    while (data.byteLength > this.available()) {
      if (this.buffered() === 0) {
        try {
          numBytesWritten = this.#writer.writeSync(data);
        } catch (e) {
          if (e instanceof Error) {
            this.err = e;
          }
          throw e;
        }
      } else {
        numBytesWritten = copy(data, this.buf, this.usedBufferBytes);
        this.usedBufferBytes += numBytesWritten;
        this.flush();
      }
      totalBytesWritten += numBytesWritten;
      data = data.subarray(numBytesWritten);
    }
    numBytesWritten = copy(data, this.buf, this.usedBufferBytes);
    this.usedBufferBytes += numBytesWritten;
    totalBytesWritten += numBytesWritten;
    return totalBytesWritten;
  }
};

// http-url:https://deno.land/std@0.177.0/log/handlers.ts
var DEFAULT_FORMATTER = "{levelName} {msg}";
var BaseHandler = class {
  constructor(levelName, options = {}) {
    this.level = getLevelByName(levelName);
    this.levelName = levelName;
    this.formatter = options.formatter || DEFAULT_FORMATTER;
  }
  handle(logRecord) {
    if (this.level > logRecord.level)
      return;
    const msg = this.format(logRecord);
    return this.log(msg);
  }
  format(logRecord) {
    if (this.formatter instanceof Function) {
      return this.formatter(logRecord);
    }
    return this.formatter.replace(/{([^\s}]+)}/g, (match, p1) => {
      const value = logRecord[p1];
      if (value == null) {
        return match;
      }
      return String(value);
    });
  }
  log(_msg) {
  }
  setup() {
  }
  destroy() {
  }
};
var ConsoleHandler = class extends BaseHandler {
  format(logRecord) {
    let msg = super.format(logRecord);
    switch (logRecord.level) {
      case 20 /* INFO */:
        msg = blue(msg);
        break;
      case 30 /* WARNING */:
        msg = yellow(msg);
        break;
      case 40 /* ERROR */:
        msg = red(msg);
        break;
      case 50 /* CRITICAL */:
        msg = bold(red(msg));
        break;
      default:
        break;
    }
    return msg;
  }
  log(msg) {
    console.log(msg);
  }
};
var WriterHandler = class extends BaseHandler {
  constructor() {
    super(...arguments);
    this.#encoder = new TextEncoder();
  }
  #encoder;
};
var FileHandler = class extends WriterHandler {
  constructor(levelName, options) {
    super(levelName, options);
    this._encoder = new TextEncoder();
    this.#unloadCallback = (() => {
      this.destroy();
    }).bind(this);
    this._filename = options.filename;
    this._mode = options.mode ? options.mode : "a";
    this._openOptions = {
      createNew: this._mode === "x",
      create: this._mode !== "x",
      append: this._mode === "a",
      truncate: this._mode !== "a",
      write: true
    };
  }
  #unloadCallback;
  setup() {
    this._file = Deno.openSync(this._filename, this._openOptions);
    this._writer = this._file;
    this._buf = new BufWriterSync(this._file);
    addEventListener("unload", this.#unloadCallback);
  }
  handle(logRecord) {
    super.handle(logRecord);
    if (logRecord.level > 40 /* ERROR */) {
      this.flush();
    }
  }
  log(msg) {
    if (this._encoder.encode(msg).byteLength + 1 > this._buf.available()) {
      this.flush();
    }
    this._buf.writeSync(this._encoder.encode(msg + "\n"));
  }
  flush() {
    if (this._buf?.buffered() > 0) {
      this._buf.flush();
    }
  }
  destroy() {
    this.flush();
    this._file?.close();
    this._file = void 0;
    removeEventListener("unload", this.#unloadCallback);
  }
};
var RotatingFileHandler = class extends FileHandler {
  #maxBytes;
  #maxBackupCount;
  #currentFileSize = 0;
  constructor(levelName, options) {
    super(levelName, options);
    this.#maxBytes = options.maxBytes;
    this.#maxBackupCount = options.maxBackupCount;
  }
  async setup() {
    if (this.#maxBytes < 1) {
      this.destroy();
      throw new Error("maxBytes cannot be less than 1");
    }
    if (this.#maxBackupCount < 1) {
      this.destroy();
      throw new Error("maxBackupCount cannot be less than 1");
    }
    await super.setup();
    if (this._mode === "w") {
      for (let i = 1; i <= this.#maxBackupCount; i++) {
        try {
          await Deno.remove(this._filename + "." + i);
        } catch (error2) {
          if (!(error2 instanceof Deno.errors.NotFound)) {
            throw error2;
          }
        }
      }
    } else if (this._mode === "x") {
      for (let i = 1; i <= this.#maxBackupCount; i++) {
        if (await exists(this._filename + "." + i)) {
          this.destroy();
          throw new Deno.errors.AlreadyExists(
            "Backup log file " + this._filename + "." + i + " already exists"
          );
        }
      }
    } else {
      this.#currentFileSize = (await Deno.stat(this._filename)).size;
    }
  }
  log(msg) {
    const msgByteLength = this._encoder.encode(msg).byteLength + 1;
    if (this.#currentFileSize + msgByteLength > this.#maxBytes) {
      this.rotateLogFiles();
      this.#currentFileSize = 0;
    }
    super.log(msg);
    this.#currentFileSize += msgByteLength;
  }
  rotateLogFiles() {
    this._buf.flush();
    this._file.close();
    for (let i = this.#maxBackupCount - 1; i >= 0; i--) {
      const source = this._filename + (i === 0 ? "" : "." + i);
      const dest = this._filename + "." + (i + 1);
      if (existsSync(source)) {
        Deno.renameSync(source, dest);
      }
    }
    this._file = Deno.openSync(this._filename, this._openOptions);
    this._writer = this._file;
    this._buf = new BufWriterSync(this._file);
  }
};

// http-url:https://deno.land/std@0.177.0/_util/asserts.ts
var DenoStdInternalError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "DenoStdInternalError";
  }
};
function assert(expr, msg = "") {
  if (!expr) {
    throw new DenoStdInternalError(msg);
  }
}

// http-url:https://deno.land/std@0.177.0/log/mod.ts
var DEFAULT_LEVEL = "INFO";
var DEFAULT_CONFIG = {
  handlers: {
    default: new ConsoleHandler(DEFAULT_LEVEL)
  },
  loggers: {
    default: {
      level: DEFAULT_LEVEL,
      handlers: ["default"]
    }
  }
};
var state = {
  handlers: /* @__PURE__ */ new Map(),
  loggers: /* @__PURE__ */ new Map(),
  config: DEFAULT_CONFIG
};
var handlers = {
  BaseHandler,
  ConsoleHandler,
  WriterHandler,
  FileHandler,
  RotatingFileHandler
};
function getLogger(name) {
  if (!name) {
    const d = state.loggers.get("default");
    assert(
      d != null,
      `"default" logger must be set for getting logger without name`
    );
    return d;
  }
  const result = state.loggers.get(name);
  if (!result) {
    const logger2 = new Logger(name, "NOTSET", { handlers: [] });
    state.loggers.set(name, logger2);
    return logger2;
  }
  return result;
}
function setup(config) {
  state.config = {
    handlers: { ...DEFAULT_CONFIG.handlers, ...config.handlers },
    loggers: { ...DEFAULT_CONFIG.loggers, ...config.loggers }
  };
  state.handlers.forEach((handler) => {
    handler.destroy();
  });
  state.handlers.clear();
  const handlers2 = state.config.handlers || {};
  for (const handlerName in handlers2) {
    const handler = handlers2[handlerName];
    handler.setup();
    state.handlers.set(handlerName, handler);
  }
  state.loggers.clear();
  const loggers = state.config.loggers || {};
  for (const loggerName in loggers) {
    const loggerConfig = loggers[loggerName];
    const handlerNames = loggerConfig.handlers || [];
    const handlers3 = [];
    handlerNames.forEach((handlerName) => {
      const handler = state.handlers.get(handlerName);
      if (handler) {
        handlers3.push(handler);
      }
    });
    const levelName = loggerConfig.level || DEFAULT_LEVEL;
    const logger2 = new Logger(loggerName, levelName, { handlers: handlers3 });
    state.loggers.set(loggerName, logger2);
  }
}
setup(DEFAULT_CONFIG);

// http-url:https://deno.land/x/cliffy@v0.25.7/table/cell.ts
var Cell = class {
  /**
   * Cell constructor.
   * @param value Cell value.
   */
  constructor(value) {
    this.value = value;
    this.options = {};
  }
  /** Get cell length. */
  get length() {
    return this.toString().length;
  }
  /**
   * Create a new cell. If value is a cell, the value and all options of the cell
   * will be copied to the new cell.
   * @param value Cell or cell value.
   */
  static from(value) {
    const cell = new this(value);
    if (value instanceof Cell) {
      cell.options = { ...value.options };
    }
    return cell;
  }
  /** Get cell value. */
  toString() {
    return this.value.toString();
  }
  /**
   * Set cell value.
   * @param value Cell or cell value.
   */
  setValue(value) {
    this.value = value;
    return this;
  }
  /**
   * Clone cell with all options.
   * @param value Cell or cell value.
   */
  clone(value) {
    const cell = new Cell(value ?? this);
    cell.options = { ...this.options };
    return cell;
  }
  /**
   * Setter:
   */
  /**
   * Enable/disable cell border.
   * @param enable    Enable/disable cell border.
   * @param override  Override existing value.
   */
  border(enable, override = true) {
    if (override || typeof this.options.border === "undefined") {
      this.options.border = enable;
    }
    return this;
  }
  /**
   * Set col span.
   * @param span      Number of cols to span.
   * @param override  Override existing value.
   */
  colSpan(span, override = true) {
    if (override || typeof this.options.colSpan === "undefined") {
      this.options.colSpan = span;
    }
    return this;
  }
  /**
   * Set row span.
   * @param span      Number of rows to span.
   * @param override  Override existing value.
   */
  rowSpan(span, override = true) {
    if (override || typeof this.options.rowSpan === "undefined") {
      this.options.rowSpan = span;
    }
    return this;
  }
  /**
   * Align cell content.
   * @param direction Align direction.
   * @param override  Override existing value.
   */
  align(direction, override = true) {
    if (override || typeof this.options.align === "undefined") {
      this.options.align = direction;
    }
    return this;
  }
  /**
   * Getter:
   */
  /** Check if cell has border. */
  getBorder() {
    return this.options.border === true;
  }
  /** Get col span. */
  getColSpan() {
    return typeof this.options.colSpan === "number" && this.options.colSpan > 0 ? this.options.colSpan : 1;
  }
  /** Get row span. */
  getRowSpan() {
    return typeof this.options.rowSpan === "number" && this.options.rowSpan > 0 ? this.options.rowSpan : 1;
  }
  /** Get row span. */
  getAlign() {
    return this.options.align ?? "left";
  }
};

// http-url:https://deno.land/x/cliffy@v0.25.7/table/row.ts
var Row = class extends Array {
  constructor() {
    super(...arguments);
    this.options = {};
  }
  /**
   * Create a new row. If cells is a row, all cells and options of the row will
   * be copied to the new row.
   * @param cells Cells or row.
   */
  static from(cells) {
    const row = new this(...cells);
    if (cells instanceof Row) {
      row.options = { ...cells.options };
    }
    return row;
  }
  /** Clone row recursively with all options. */
  clone() {
    const row = new Row(
      ...this.map((cell) => cell instanceof Cell ? cell.clone() : cell)
    );
    row.options = { ...this.options };
    return row;
  }
  /**
   * Setter:
   */
  /**
   * Enable/disable cell border.
   * @param enable    Enable/disable cell border.
   * @param override  Override existing value.
   */
  border(enable, override = true) {
    if (override || typeof this.options.border === "undefined") {
      this.options.border = enable;
    }
    return this;
  }
  /**
   * Align row content.
   * @param direction Align direction.
   * @param override  Override existing value.
   */
  align(direction, override = true) {
    if (override || typeof this.options.align === "undefined") {
      this.options.align = direction;
    }
    return this;
  }
  /**
   * Getter:
   */
  /** Check if row has border. */
  getBorder() {
    return this.options.border === true;
  }
  /** Check if row or any child cell has border. */
  hasBorder() {
    return this.getBorder() || this.some((cell) => cell instanceof Cell && cell.getBorder());
  }
  /** Get row alignment. */
  getAlign() {
    return this.options.align ?? "left";
  }
};

// http-url:https://deno.land/x/cliffy@v0.25.7/table/border.ts
var border = {
  top: "\u2500",
  topMid: "\u252C",
  topLeft: "\u250C",
  topRight: "\u2510",
  bottom: "\u2500",
  bottomMid: "\u2534",
  bottomLeft: "\u2514",
  bottomRight: "\u2518",
  left: "\u2502",
  leftMid: "\u251C",
  mid: "\u2500",
  midMid: "\u253C",
  right: "\u2502",
  rightMid: "\u2524",
  middle: "\u2502"
};

// http-url:https://deno.land/std@0.170.0/fmt/colors.ts
var { Deno: Deno3 } = globalThis;
var noColor2 = typeof Deno3?.noColor === "boolean" ? Deno3.noColor : true;
var enabled2 = !noColor2;
function setColorEnabled2(value) {
  if (noColor2) {
    return;
  }
  enabled2 = value;
}
function getColorEnabled2() {
  return enabled2;
}
function code2(open, close) {
  return {
    open: `\x1B[${open.join(";")}m`,
    close: `\x1B[${close}m`,
    regexp: new RegExp(`\\x1b\\[${close}m`, "g")
  };
}
function run2(str, code3) {
  return enabled2 ? `${code3.open}${str.replace(code3.regexp, code3.open)}${code3.close}` : str;
}
function bold2(str) {
  return run2(str, code2([1], 22));
}
function dim2(str) {
  return run2(str, code2([2], 22));
}
function italic2(str) {
  return run2(str, code2([3], 23));
}
function red2(str) {
  return run2(str, code2([31], 39));
}
function green2(str) {
  return run2(str, code2([32], 39));
}
function yellow2(str) {
  return run2(str, code2([33], 39));
}
function brightBlue2(str) {
  return run2(str, code2([94], 39));
}
function brightMagenta2(str) {
  return run2(str, code2([95], 39));
}
var ANSI_PATTERN2 = new RegExp(
  [
    "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
    "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))"
  ].join("|"),
  "g"
);
function stripColor2(string2) {
  return string2.replace(ANSI_PATTERN2, "");
}

// http-url:https://deno.land/x/cliffy@v0.25.7/table/utils.ts
function consumeWords(length, content) {
  let consumed = "";
  const words = content.split("\n")[0]?.split(/ /g);
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    if (consumed) {
      const nextLength = strLength(word);
      const consumedLength = strLength(consumed);
      if (consumedLength + nextLength >= length) {
        break;
      }
    }
    consumed += (i > 0 ? " " : "") + word;
  }
  return consumed;
}
function longest(index, rows, maxWidth) {
  const cellLengths = rows.map((row) => {
    const cell = row[index];
    const cellValue = cell instanceof Cell && cell.getColSpan() > 1 ? "" : cell?.toString() || "";
    return cellValue.split("\n").map((line) => {
      const str = typeof maxWidth === "undefined" ? line : consumeWords(maxWidth, line);
      return strLength(str) || 0;
    });
  }).flat();
  return Math.max(...cellLengths);
}
var strLength = (str) => {
  str = stripColor2(str);
  let length = 0;
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i);
    if (charCode >= 19968 && charCode <= 40869) {
      length += 2;
    } else {
      length += 1;
    }
  }
  return length;
};

// http-url:https://deno.land/x/cliffy@v0.25.7/table/layout.ts
var TableLayout = class {
  /**
   * Table layout constructor.
   * @param table   Table instance.
   * @param options Render options.
   */
  constructor(table, options) {
    this.table = table;
    this.options = options;
  }
  /** Generate table string. */
  toString() {
    const opts = this.createLayout();
    return opts.rows.length ? this.renderRows(opts) : "";
  }
  /**
   * Generates table layout including row and col span, converts all none
   * Cell/Row values to Cells and Rows and returns the layout rendering
   * settings.
   */
  createLayout() {
    Object.keys(this.options.chars).forEach((key) => {
      if (typeof this.options.chars[key] !== "string") {
        this.options.chars[key] = "";
      }
    });
    const hasBodyBorder = this.table.getBorder() || this.table.hasBodyBorder();
    const hasHeaderBorder = this.table.hasHeaderBorder();
    const hasBorder = hasHeaderBorder || hasBodyBorder;
    const rows = this.#getRows();
    const columns = Math.max(...rows.map((row) => row.length));
    for (const row of rows) {
      const length = row.length;
      if (length < columns) {
        const diff = columns - length;
        for (let i = 0; i < diff; i++) {
          row.push(this.createCell(null, row));
        }
      }
    }
    const padding = [];
    const width = [];
    for (let colIndex = 0; colIndex < columns; colIndex++) {
      const minColWidth = Array.isArray(this.options.minColWidth) ? this.options.minColWidth[colIndex] : this.options.minColWidth;
      const maxColWidth = Array.isArray(this.options.maxColWidth) ? this.options.maxColWidth[colIndex] : this.options.maxColWidth;
      const colWidth = longest(colIndex, rows, maxColWidth);
      width[colIndex] = Math.min(maxColWidth, Math.max(minColWidth, colWidth));
      padding[colIndex] = Array.isArray(this.options.padding) ? this.options.padding[colIndex] : this.options.padding;
    }
    return {
      padding,
      width,
      rows,
      columns,
      hasBorder,
      hasBodyBorder,
      hasHeaderBorder
    };
  }
  #getRows() {
    const header = this.table.getHeader();
    const rows = header ? [header, ...this.table] : this.table.slice();
    const hasSpan = rows.some(
      (row) => row.some(
        (cell) => cell instanceof Cell && (cell.getColSpan() > 1 || cell.getRowSpan() > 1)
      )
    );
    if (hasSpan) {
      return this.spanRows(rows);
    }
    return rows.map((row) => {
      const newRow = this.createRow(row);
      for (let i = 0; i < row.length; i++) {
        newRow[i] = this.createCell(row[i], newRow);
      }
      return newRow;
    });
  }
  /**
   * Fills rows and cols by specified row/col span with a reference of the
   * original cell.
   */
  spanRows(rows) {
    const rowSpan = [];
    let colSpan = 1;
    let rowIndex = -1;
    while (true) {
      rowIndex++;
      if (rowIndex === rows.length && rowSpan.every((span) => span === 1)) {
        break;
      }
      const row = rows[rowIndex] = this.createRow(rows[rowIndex] || []);
      let colIndex = -1;
      while (true) {
        colIndex++;
        if (colIndex === row.length && colIndex === rowSpan.length && colSpan === 1) {
          break;
        }
        if (colSpan > 1) {
          colSpan--;
          rowSpan[colIndex] = rowSpan[colIndex - 1];
          row.splice(
            colIndex,
            this.getDeleteCount(rows, rowIndex, colIndex),
            row[colIndex - 1]
          );
          continue;
        }
        if (rowSpan[colIndex] > 1) {
          rowSpan[colIndex]--;
          rows[rowIndex].splice(
            colIndex,
            this.getDeleteCount(rows, rowIndex, colIndex),
            rows[rowIndex - 1][colIndex]
          );
          continue;
        }
        const cell = row[colIndex] = this.createCell(
          row[colIndex] || null,
          row
        );
        colSpan = cell.getColSpan();
        rowSpan[colIndex] = cell.getRowSpan();
      }
    }
    return rows;
  }
  getDeleteCount(rows, rowIndex, colIndex) {
    return colIndex <= rows[rowIndex].length - 1 && typeof rows[rowIndex][colIndex] === "undefined" ? 1 : 0;
  }
  /**
   * Create a new row from existing row or cell array.
   * @param row Original row.
   */
  createRow(row) {
    return Row.from(row).border(this.table.getBorder(), false).align(this.table.getAlign(), false);
  }
  /**
   * Create a new cell from existing cell or cell value.
   * @param cell  Original cell.
   * @param row   Parent row.
   */
  createCell(cell, row) {
    return Cell.from(cell ?? "").border(row.getBorder(), false).align(row.getAlign(), false);
  }
  /**
   * Render table layout.
   * @param opts Render options.
   */
  renderRows(opts) {
    let result = "";
    const rowSpan = new Array(opts.columns).fill(1);
    for (let rowIndex = 0; rowIndex < opts.rows.length; rowIndex++) {
      result += this.renderRow(rowSpan, rowIndex, opts);
    }
    return result.slice(0, -1);
  }
  /**
   * Render row.
   * @param rowSpan     Current row span.
   * @param rowIndex    Current row index.
   * @param opts        Render options.
   * @param isMultiline Is multiline row.
   */
  renderRow(rowSpan, rowIndex, opts, isMultiline) {
    const row = opts.rows[rowIndex];
    const prevRow = opts.rows[rowIndex - 1];
    const nextRow = opts.rows[rowIndex + 1];
    let result = "";
    let colSpan = 1;
    if (!isMultiline && rowIndex === 0 && row.hasBorder()) {
      result += this.renderBorderRow(void 0, row, rowSpan, opts);
    }
    let isMultilineRow = false;
    result += " ".repeat(this.options.indent || 0);
    for (let colIndex = 0; colIndex < opts.columns; colIndex++) {
      if (colSpan > 1) {
        colSpan--;
        rowSpan[colIndex] = rowSpan[colIndex - 1];
        continue;
      }
      result += this.renderCell(colIndex, row, opts);
      if (rowSpan[colIndex] > 1) {
        if (!isMultiline) {
          rowSpan[colIndex]--;
        }
      } else if (!prevRow || prevRow[colIndex] !== row[colIndex]) {
        rowSpan[colIndex] = row[colIndex].getRowSpan();
      }
      colSpan = row[colIndex].getColSpan();
      if (rowSpan[colIndex] === 1 && row[colIndex].length) {
        isMultilineRow = true;
      }
    }
    if (opts.columns > 0) {
      if (row[opts.columns - 1].getBorder()) {
        result += this.options.chars.right;
      } else if (opts.hasBorder) {
        result += " ";
      }
    }
    result += "\n";
    if (isMultilineRow) {
      return result + this.renderRow(rowSpan, rowIndex, opts, isMultilineRow);
    }
    if (rowIndex === 0 && opts.hasHeaderBorder || rowIndex < opts.rows.length - 1 && opts.hasBodyBorder) {
      result += this.renderBorderRow(row, nextRow, rowSpan, opts);
    }
    if (rowIndex === opts.rows.length - 1 && row.hasBorder()) {
      result += this.renderBorderRow(row, void 0, rowSpan, opts);
    }
    return result;
  }
  /**
   * Render cell.
   * @param colIndex  Current col index.
   * @param row       Current row.
   * @param opts      Render options.
   * @param noBorder  Disable border.
   */
  renderCell(colIndex, row, opts, noBorder) {
    let result = "";
    const prevCell = row[colIndex - 1];
    const cell = row[colIndex];
    if (!noBorder) {
      if (colIndex === 0) {
        if (cell.getBorder()) {
          result += this.options.chars.left;
        } else if (opts.hasBorder) {
          result += " ";
        }
      } else {
        if (cell.getBorder() || prevCell?.getBorder()) {
          result += this.options.chars.middle;
        } else if (opts.hasBorder) {
          result += " ";
        }
      }
    }
    let maxLength = opts.width[colIndex];
    const colSpan = cell.getColSpan();
    if (colSpan > 1) {
      for (let o = 1; o < colSpan; o++) {
        maxLength += opts.width[colIndex + o] + opts.padding[colIndex + o];
        if (opts.hasBorder) {
          maxLength += opts.padding[colIndex + o] + 1;
        }
      }
    }
    const { current, next } = this.renderCellValue(cell, maxLength);
    row[colIndex].setValue(next);
    if (opts.hasBorder) {
      result += " ".repeat(opts.padding[colIndex]);
    }
    result += current;
    if (opts.hasBorder || colIndex < opts.columns - 1) {
      result += " ".repeat(opts.padding[colIndex]);
    }
    return result;
  }
  /**
   * Render specified length of cell. Returns the rendered value and a new cell
   * with the rest value.
   * @param cell      Cell to render.
   * @param maxLength Max length of content to render.
   */
  renderCellValue(cell, maxLength) {
    const length = Math.min(
      maxLength,
      strLength(cell.toString())
    );
    let words = consumeWords(length, cell.toString());
    const breakWord = strLength(words) > length;
    if (breakWord) {
      words = words.slice(0, length);
    }
    const next = cell.toString().slice(words.length + (breakWord ? 0 : 1));
    const fillLength = maxLength - strLength(words);
    const align = cell.getAlign();
    let current;
    if (fillLength === 0) {
      current = words;
    } else if (align === "left") {
      current = words + " ".repeat(fillLength);
    } else if (align === "center") {
      current = " ".repeat(Math.floor(fillLength / 2)) + words + " ".repeat(Math.ceil(fillLength / 2));
    } else if (align === "right") {
      current = " ".repeat(fillLength) + words;
    } else {
      throw new Error("Unknown direction: " + align);
    }
    return {
      current,
      next: cell.clone(next)
    };
  }
  /**
   * Render border row.
   * @param prevRow Previous row.
   * @param nextRow Next row.
   * @param rowSpan Current row span.
   * @param opts    Render options.
   */
  renderBorderRow(prevRow, nextRow, rowSpan, opts) {
    let result = "";
    let colSpan = 1;
    for (let colIndex = 0; colIndex < opts.columns; colIndex++) {
      if (rowSpan[colIndex] > 1) {
        if (!nextRow) {
          throw new Error("invalid layout");
        }
        if (colSpan > 1) {
          colSpan--;
          continue;
        }
      }
      result += this.renderBorderCell(
        colIndex,
        prevRow,
        nextRow,
        rowSpan,
        opts
      );
      colSpan = nextRow?.[colIndex].getColSpan() ?? 1;
    }
    return result.length ? " ".repeat(this.options.indent) + result + "\n" : "";
  }
  /**
   * Render border cell.
   * @param colIndex  Current index.
   * @param prevRow   Previous row.
   * @param nextRow   Next row.
   * @param rowSpan   Current row span.
   * @param opts      Render options.
   */
  renderBorderCell(colIndex, prevRow, nextRow, rowSpan, opts) {
    const a1 = prevRow?.[colIndex - 1];
    const a2 = nextRow?.[colIndex - 1];
    const b1 = prevRow?.[colIndex];
    const b2 = nextRow?.[colIndex];
    const a1Border = !!a1?.getBorder();
    const a2Border = !!a2?.getBorder();
    const b1Border = !!b1?.getBorder();
    const b2Border = !!b2?.getBorder();
    const hasColSpan = (cell) => (cell?.getColSpan() ?? 1) > 1;
    const hasRowSpan = (cell) => (cell?.getRowSpan() ?? 1) > 1;
    let result = "";
    if (colIndex === 0) {
      if (rowSpan[colIndex] > 1) {
        if (b1Border) {
          result += this.options.chars.left;
        } else {
          result += " ";
        }
      } else if (b1Border && b2Border) {
        result += this.options.chars.leftMid;
      } else if (b1Border) {
        result += this.options.chars.bottomLeft;
      } else if (b2Border) {
        result += this.options.chars.topLeft;
      } else {
        result += " ";
      }
    } else if (colIndex < opts.columns) {
      if (a1Border && b2Border || b1Border && a2Border) {
        const a1ColSpan = hasColSpan(a1);
        const a2ColSpan = hasColSpan(a2);
        const b1ColSpan = hasColSpan(b1);
        const b2ColSpan = hasColSpan(b2);
        const a1RowSpan = hasRowSpan(a1);
        const a2RowSpan = hasRowSpan(a2);
        const b1RowSpan = hasRowSpan(b1);
        const b2RowSpan = hasRowSpan(b2);
        const hasAllBorder = a1Border && b2Border && b1Border && a2Border;
        const hasAllRowSpan = a1RowSpan && b1RowSpan && a2RowSpan && b2RowSpan;
        const hasAllColSpan = a1ColSpan && b1ColSpan && a2ColSpan && b2ColSpan;
        if (hasAllRowSpan && hasAllBorder) {
          result += this.options.chars.middle;
        } else if (hasAllColSpan && hasAllBorder && a1 === b1 && a2 === b2) {
          result += this.options.chars.mid;
        } else if (a1ColSpan && b1ColSpan && a1 === b1) {
          result += this.options.chars.topMid;
        } else if (a2ColSpan && b2ColSpan && a2 === b2) {
          result += this.options.chars.bottomMid;
        } else if (a1RowSpan && a2RowSpan && a1 === a2) {
          result += this.options.chars.leftMid;
        } else if (b1RowSpan && b2RowSpan && b1 === b2) {
          result += this.options.chars.rightMid;
        } else {
          result += this.options.chars.midMid;
        }
      } else if (a1Border && b1Border) {
        if (hasColSpan(a1) && hasColSpan(b1) && a1 === b1) {
          result += this.options.chars.bottom;
        } else {
          result += this.options.chars.bottomMid;
        }
      } else if (b1Border && b2Border) {
        if (rowSpan[colIndex] > 1) {
          result += this.options.chars.left;
        } else {
          result += this.options.chars.leftMid;
        }
      } else if (b2Border && a2Border) {
        if (hasColSpan(a2) && hasColSpan(b2) && a2 === b2) {
          result += this.options.chars.top;
        } else {
          result += this.options.chars.topMid;
        }
      } else if (a1Border && a2Border) {
        if (hasRowSpan(a1) && a1 === a2) {
          result += this.options.chars.right;
        } else {
          result += this.options.chars.rightMid;
        }
      } else if (a1Border) {
        result += this.options.chars.bottomRight;
      } else if (b1Border) {
        result += this.options.chars.bottomLeft;
      } else if (a2Border) {
        result += this.options.chars.topRight;
      } else if (b2Border) {
        result += this.options.chars.topLeft;
      } else {
        result += " ";
      }
    }
    const length = opts.padding[colIndex] + opts.width[colIndex] + opts.padding[colIndex];
    if (rowSpan[colIndex] > 1 && nextRow) {
      result += this.renderCell(
        colIndex,
        nextRow,
        opts,
        true
      );
      if (nextRow[colIndex] === nextRow[nextRow.length - 1]) {
        if (b1Border) {
          result += this.options.chars.right;
        } else {
          result += " ";
        }
        return result;
      }
    } else if (b1Border && b2Border) {
      result += this.options.chars.mid.repeat(length);
    } else if (b1Border) {
      result += this.options.chars.bottom.repeat(length);
    } else if (b2Border) {
      result += this.options.chars.top.repeat(length);
    } else {
      result += " ".repeat(length);
    }
    if (colIndex === opts.columns - 1) {
      if (b1Border && b2Border) {
        result += this.options.chars.rightMid;
      } else if (b1Border) {
        result += this.options.chars.bottomRight;
      } else if (b2Border) {
        result += this.options.chars.topRight;
      } else {
        result += " ";
      }
    }
    return result;
  }
};

// http-url:https://deno.land/x/cliffy@v0.25.7/table/table.ts
var _Table = class extends Array {
  constructor() {
    super(...arguments);
    this.options = {
      indent: 0,
      border: false,
      maxColWidth: Infinity,
      minColWidth: 0,
      padding: 1,
      chars: { ..._Table._chars }
    };
  }
  /**
   * Create a new table. If rows is a table, all rows and options of the table
   * will be copied to the new table.
   * @param rows
   */
  static from(rows) {
    const table = new this(...rows);
    if (rows instanceof _Table) {
      table.options = { ...rows.options };
      table.headerRow = rows.headerRow ? Row.from(rows.headerRow) : void 0;
    }
    return table;
  }
  /**
   * Create a new table from an array of json objects. An object represents a
   * row and each property a column.
   * @param rows Array of objects.
   */
  static fromJson(rows) {
    return new this().fromJson(rows);
  }
  /**
   * Set global default border characters.
   * @param chars Border options.
   */
  static chars(chars) {
    Object.assign(this._chars, chars);
    return this;
  }
  /**
   * Write table or rows to stdout.
   * @param rows Table or rows.
   */
  static render(rows) {
    _Table.from(rows).render();
  }
  /**
   * Read data from an array of json objects. An object represents a
   * row and each property a column.
   * @param rows Array of objects.
   */
  fromJson(rows) {
    this.header(Object.keys(rows[0]));
    this.body(rows.map((row) => Object.values(row)));
    return this;
  }
  /**
   * Set table header.
   * @param header Header row or cells.
   */
  header(header) {
    this.headerRow = header instanceof Row ? header : Row.from(header);
    return this;
  }
  /**
   * Set table body.
   * @param rows Table rows.
   */
  body(rows) {
    this.length = 0;
    this.push(...rows);
    return this;
  }
  /** Clone table recursively with header and options. */
  clone() {
    const table = new _Table(
      ...this.map(
        (row) => row instanceof Row ? row.clone() : Row.from(row).clone()
      )
    );
    table.options = { ...this.options };
    table.headerRow = this.headerRow?.clone();
    return table;
  }
  /** Generate table string. */
  toString() {
    return new TableLayout(this, this.options).toString();
  }
  /** Write table to stdout. */
  render() {
    console.log(this.toString());
    return this;
  }
  /**
   * Set max col with.
   * @param width     Max col width.
   * @param override  Override existing value.
   */
  maxColWidth(width, override = true) {
    if (override || typeof this.options.maxColWidth === "undefined") {
      this.options.maxColWidth = width;
    }
    return this;
  }
  /**
   * Set min col width.
   * @param width     Min col width.
   * @param override  Override existing value.
   */
  minColWidth(width, override = true) {
    if (override || typeof this.options.minColWidth === "undefined") {
      this.options.minColWidth = width;
    }
    return this;
  }
  /**
   * Set table indentation.
   * @param width     Indent width.
   * @param override  Override existing value.
   */
  indent(width, override = true) {
    if (override || typeof this.options.indent === "undefined") {
      this.options.indent = width;
    }
    return this;
  }
  /**
   * Set cell padding.
   * @param padding   Cell padding.
   * @param override  Override existing value.
   */
  padding(padding, override = true) {
    if (override || typeof this.options.padding === "undefined") {
      this.options.padding = padding;
    }
    return this;
  }
  /**
   * Enable/disable cell border.
   * @param enable    Enable/disable cell border.
   * @param override  Override existing value.
   */
  border(enable, override = true) {
    if (override || typeof this.options.border === "undefined") {
      this.options.border = enable;
    }
    return this;
  }
  /**
   * Align table content.
   * @param direction Align direction.
   * @param override  Override existing value.
   */
  align(direction, override = true) {
    if (override || typeof this.options.align === "undefined") {
      this.options.align = direction;
    }
    return this;
  }
  /**
   * Set border characters.
   * @param chars Border options.
   */
  chars(chars) {
    Object.assign(this.options.chars, chars);
    return this;
  }
  /** Get table header. */
  getHeader() {
    return this.headerRow;
  }
  /** Get table body. */
  getBody() {
    return [...this];
  }
  /** Get mac col widrth. */
  getMaxColWidth() {
    return this.options.maxColWidth;
  }
  /** Get min col width. */
  getMinColWidth() {
    return this.options.minColWidth;
  }
  /** Get table indentation. */
  getIndent() {
    return this.options.indent;
  }
  /** Get cell padding. */
  getPadding() {
    return this.options.padding;
  }
  /** Check if table has border. */
  getBorder() {
    return this.options.border === true;
  }
  /** Check if header row has border. */
  hasHeaderBorder() {
    const hasBorder = this.headerRow?.hasBorder();
    return hasBorder === true || this.getBorder() && hasBorder !== false;
  }
  /** Check if table bordy has border. */
  hasBodyBorder() {
    return this.getBorder() || this.some(
      (row) => row instanceof Row ? row.hasBorder() : row.some((cell) => cell instanceof Cell ? cell.getBorder : false)
    );
  }
  /** Check if table header or body has border. */
  hasBorder() {
    return this.hasHeaderBorder() || this.hasBodyBorder();
  }
  /** Get table alignment. */
  getAlign() {
    return this.options.align ?? "left";
  }
};
var Table = _Table;
Table._chars = { ...border };

// http-url:https://deno.land/x/cliffy@v0.25.7/_utils/distance.ts
function distance(a, b) {
  if (a.length == 0) {
    return b.length;
  }
  if (b.length == 0) {
    return a.length;
  }
  const matrix = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) == a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

// http-url:https://deno.land/x/cliffy@v0.25.7/flags/_utils.ts
function paramCaseToCamelCase(str) {
  return str.replace(
    /-([a-z])/g,
    (g) => g[1].toUpperCase()
  );
}
function underscoreToCamelCase(str) {
  return str.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase().replace(
    /_([a-z])/g,
    (g) => g[1].toUpperCase()
  );
}
function getOption(flags, name) {
  while (name[0] === "-") {
    name = name.slice(1);
  }
  for (const flag of flags) {
    if (isOption(flag, name)) {
      return flag;
    }
  }
  return;
}
function didYouMeanOption(option, options) {
  const optionNames = options.map((option2) => [option2.name, ...option2.aliases ?? []]).flat().map((option2) => getFlag(option2));
  return didYouMean(" Did you mean option", getFlag(option), optionNames);
}
function didYouMeanType(type, types) {
  return didYouMean(" Did you mean type", type, types);
}
function didYouMean(message, type, types) {
  const match = closest(type, types);
  return match ? `${message} "${match}"?` : "";
}
function getFlag(name) {
  if (name.startsWith("-")) {
    return name;
  }
  if (name.length > 1) {
    return `--${name}`;
  }
  return `-${name}`;
}
function isOption(option, name) {
  return option.name === name || option.aliases && option.aliases.indexOf(name) !== -1;
}
function matchWildCardOptions(name, flags) {
  for (const option of flags) {
    if (option.name.indexOf("*") === -1) {
      continue;
    }
    let matched = matchWildCardOption(name, option);
    if (matched) {
      matched = { ...matched, name };
      flags.push(matched);
      return matched;
    }
  }
}
function matchWildCardOption(name, option) {
  const parts = option.name.split(".");
  const parts2 = name.split(".");
  if (parts.length !== parts2.length) {
    return false;
  }
  const count = Math.max(parts.length, parts2.length);
  for (let i = 0; i < count; i++) {
    if (parts[i] !== parts2[i] && parts[i] !== "*") {
      return false;
    }
  }
  return option;
}
function closest(str, arr) {
  let minDistance = Infinity;
  let minIndex = 0;
  for (let i = 0; i < arr.length; i++) {
    const dist = distance(str, arr[i]);
    if (dist < minDistance) {
      minDistance = dist;
      minIndex = i;
    }
  }
  return arr[minIndex];
}
function getDefaultValue(option) {
  return typeof option.default === "function" ? option.default() : option.default;
}

// http-url:https://deno.land/x/cliffy@v0.25.7/flags/_errors.ts
var FlagsError = class extends Error {
  constructor(message) {
    super(message);
    Object.setPrototypeOf(this, FlagsError.prototype);
  }
};
var UnknownRequiredOptionError = class extends FlagsError {
  constructor(option, options) {
    super(
      `Unknown required option "${getFlag(option)}".${didYouMeanOption(option, options)}`
    );
    Object.setPrototypeOf(this, UnknownRequiredOptionError.prototype);
  }
};
var UnknownConflictingOptionError = class extends FlagsError {
  constructor(option, options) {
    super(
      `Unknown conflicting option "${getFlag(option)}".${didYouMeanOption(option, options)}`
    );
    Object.setPrototypeOf(this, UnknownConflictingOptionError.prototype);
  }
};
var UnknownTypeError = class extends FlagsError {
  constructor(type, types) {
    super(`Unknown type "${type}".${didYouMeanType(type, types)}`);
    Object.setPrototypeOf(this, UnknownTypeError.prototype);
  }
};
var ValidationError = class extends FlagsError {
  constructor(message) {
    super(message);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
};
var DuplicateOptionError = class extends ValidationError {
  constructor(name) {
    super(
      `Option "${getFlag(name).replace(/^--no-/, "--")}" can only occur once, but was found several times.`
    );
    Object.setPrototypeOf(this, DuplicateOptionError.prototype);
  }
};
var InvalidOptionError = class extends ValidationError {
  constructor(option, options) {
    super(
      `Invalid option "${getFlag(option)}".${didYouMeanOption(option, options)}`
    );
    Object.setPrototypeOf(this, InvalidOptionError.prototype);
  }
};
var UnknownOptionError = class extends ValidationError {
  constructor(option, options) {
    super(
      `Unknown option "${getFlag(option)}".${didYouMeanOption(option, options)}`
    );
    Object.setPrototypeOf(this, UnknownOptionError.prototype);
  }
};
var MissingOptionValueError = class extends ValidationError {
  constructor(option) {
    super(`Missing value for option "${getFlag(option)}".`);
    Object.setPrototypeOf(this, MissingOptionValueError.prototype);
  }
};
var InvalidOptionValueError = class extends ValidationError {
  constructor(option, expected, value) {
    super(
      `Option "${getFlag(option)}" must be of type "${expected}", but got "${value}".`
    );
    Object.setPrototypeOf(this, InvalidOptionValueError.prototype);
  }
};
var UnexpectedOptionValueError = class extends ValidationError {
  constructor(option, value) {
    super(
      `Option "${getFlag(option)}" doesn't take a value, but got "${value}".`
    );
    Object.setPrototypeOf(this, InvalidOptionValueError.prototype);
  }
};
var OptionNotCombinableError = class extends ValidationError {
  constructor(option) {
    super(`Option "${getFlag(option)}" cannot be combined with other options.`);
    Object.setPrototypeOf(this, OptionNotCombinableError.prototype);
  }
};
var ConflictingOptionError = class extends ValidationError {
  constructor(option, conflictingOption) {
    super(
      `Option "${getFlag(option)}" conflicts with option "${getFlag(conflictingOption)}".`
    );
    Object.setPrototypeOf(this, ConflictingOptionError.prototype);
  }
};
var DependingOptionError = class extends ValidationError {
  constructor(option, dependingOption) {
    super(
      `Option "${getFlag(option)}" depends on option "${getFlag(dependingOption)}".`
    );
    Object.setPrototypeOf(this, DependingOptionError.prototype);
  }
};
var MissingRequiredOptionError = class extends ValidationError {
  constructor(option) {
    super(`Missing required option "${getFlag(option)}".`);
    Object.setPrototypeOf(this, MissingRequiredOptionError.prototype);
  }
};
var UnexpectedRequiredArgumentError = class extends ValidationError {
  constructor(arg) {
    super(
      `An required argument cannot follow an optional argument, but "${arg}"  is defined as required.`
    );
    Object.setPrototypeOf(
      this,
      UnexpectedRequiredArgumentError.prototype
    );
  }
};
var UnexpectedArgumentAfterVariadicArgumentError = class extends ValidationError {
  constructor(arg) {
    super(`An argument cannot follow an variadic argument, but got "${arg}".`);
    Object.setPrototypeOf(
      this,
      UnexpectedArgumentAfterVariadicArgumentError.prototype
    );
  }
};
var InvalidTypeError = class extends ValidationError {
  constructor({ label, name, value, type }, expected) {
    super(
      `${label} "${name}" must be of type "${type}", but got "${value}".` + (expected ? ` Expected values: ${expected.map((value2) => `"${value2}"`).join(", ")}` : "")
    );
    Object.setPrototypeOf(this, MissingOptionValueError.prototype);
  }
};

// http-url:https://deno.land/x/cliffy@v0.25.7/command/_utils.ts
function didYouMeanCommand(command, commands, excludes = []) {
  const commandNames = commands.map((command2) => command2.getName()).filter((command2) => !excludes.includes(command2));
  return didYouMean(" Did you mean command", command, commandNames);
}
var ARGUMENT_REGEX = /^[<\[].+[\]>]$/;
var ARGUMENT_DETAILS_REGEX = /[<\[:>\]]/;
function splitArguments(args) {
  const parts = args.trim().split(/[, =] */g);
  const typeParts = [];
  while (parts[parts.length - 1] && ARGUMENT_REGEX.test(parts[parts.length - 1])) {
    typeParts.unshift(parts.pop());
  }
  const typeDefinition = typeParts.join(" ");
  return { flags: parts, typeDefinition, equalsSign: args.includes("=") };
}
function parseArgumentsDefinition(argsDefinition, validate2 = true, all) {
  const argumentDetails = [];
  let hasOptional = false;
  let hasVariadic = false;
  const parts = argsDefinition.split(/ +/);
  for (const arg of parts) {
    if (validate2 && hasVariadic) {
      throw new UnexpectedArgumentAfterVariadicArgumentError(arg);
    }
    const parts2 = arg.split(ARGUMENT_DETAILS_REGEX);
    if (!parts2[1]) {
      if (all) {
        argumentDetails.push(parts2[0]);
      }
      continue;
    }
    const type = parts2[2] || "string" /* STRING */;
    const details = {
      optionalValue: arg[0] === "[",
      requiredValue: arg[0] === "<",
      name: parts2[1],
      action: parts2[3] || type,
      variadic: false,
      list: type ? arg.indexOf(type + "[]") !== -1 : false,
      type
    };
    if (validate2 && !details.optionalValue && hasOptional) {
      throw new UnexpectedRequiredArgumentError(details.name);
    }
    if (arg[0] === "[") {
      hasOptional = true;
    }
    if (details.name.length > 3) {
      const istVariadicLeft = details.name.slice(0, 3) === "...";
      const istVariadicRight = details.name.slice(-3) === "...";
      hasVariadic = details.variadic = istVariadicLeft || istVariadicRight;
      if (istVariadicLeft) {
        details.name = details.name.slice(3);
      } else if (istVariadicRight) {
        details.name = details.name.slice(0, -3);
      }
    }
    argumentDetails.push(details);
  }
  return argumentDetails;
}
function dedent(str) {
  const lines = str.split(/\r?\n|\r/g);
  let text = "";
  let indent = 0;
  for (const line of lines) {
    if (text || line.trim()) {
      if (!text) {
        text = line.trimStart();
        indent = line.length - text.length;
      } else {
        text += line.slice(indent);
      }
      text += "\n";
    }
  }
  return text.trimEnd();
}
function getDescription(description, short) {
  return short ? description.trim().split("\n", 1)[0].trim() : dedent(description);
}

// http-url:https://deno.land/x/cliffy@v0.25.7/command/_errors.ts
var CommandError = class extends Error {
  constructor(message) {
    super(message);
    Object.setPrototypeOf(this, CommandError.prototype);
  }
};
var ValidationError2 = class extends CommandError {
  constructor(message, { exitCode } = {}) {
    super(message);
    Object.setPrototypeOf(this, ValidationError2.prototype);
    this.exitCode = exitCode ?? 1;
  }
};
var DuplicateOptionNameError = class extends CommandError {
  constructor(name) {
    super(`Option with name "${getFlag(name)}" already exists.`);
    Object.setPrototypeOf(this, DuplicateOptionNameError.prototype);
  }
};
var MissingCommandNameError = class extends CommandError {
  constructor() {
    super("Missing command name.");
    Object.setPrototypeOf(this, MissingCommandNameError.prototype);
  }
};
var DuplicateCommandNameError = class extends CommandError {
  constructor(name) {
    super(`Duplicate command name "${name}".`);
    Object.setPrototypeOf(this, DuplicateCommandNameError.prototype);
  }
};
var DuplicateCommandAliasError = class extends CommandError {
  constructor(alias) {
    super(`Duplicate command alias "${alias}".`);
    Object.setPrototypeOf(this, DuplicateCommandAliasError.prototype);
  }
};
var CommandNotFoundError = class extends CommandError {
  constructor(name, commands, excluded) {
    super(
      `Unknown command "${name}".${didYouMeanCommand(name, commands, excluded)}`
    );
    Object.setPrototypeOf(this, CommandNotFoundError.prototype);
  }
};
var DuplicateTypeError = class extends CommandError {
  constructor(name) {
    super(`Type with name "${name}" already exists.`);
    Object.setPrototypeOf(this, DuplicateTypeError.prototype);
  }
};
var DuplicateCompletionError = class extends CommandError {
  constructor(name) {
    super(`Completion with name "${name}" already exists.`);
    Object.setPrototypeOf(this, DuplicateCompletionError.prototype);
  }
};
var DuplicateExampleError = class extends CommandError {
  constructor(name) {
    super(`Example with name "${name}" already exists.`);
    Object.setPrototypeOf(this, DuplicateExampleError.prototype);
  }
};
var DuplicateEnvVarError = class extends CommandError {
  constructor(name) {
    super(`Environment variable with name "${name}" already exists.`);
    Object.setPrototypeOf(this, DuplicateEnvVarError.prototype);
  }
};
var MissingRequiredEnvVarError = class extends ValidationError2 {
  constructor(envVar) {
    super(`Missing required environment variable "${envVar.names[0]}".`);
    Object.setPrototypeOf(this, MissingRequiredEnvVarError.prototype);
  }
};
var TooManyEnvVarValuesError = class extends CommandError {
  constructor(name) {
    super(
      `An environment variable can only have one value, but "${name}" has more than one.`
    );
    Object.setPrototypeOf(this, TooManyEnvVarValuesError.prototype);
  }
};
var UnexpectedOptionalEnvVarValueError = class extends CommandError {
  constructor(name) {
    super(
      `An environment variable cannot have an optional value, but "${name}" is defined as optional.`
    );
    Object.setPrototypeOf(this, UnexpectedOptionalEnvVarValueError.prototype);
  }
};
var UnexpectedVariadicEnvVarValueError = class extends CommandError {
  constructor(name) {
    super(
      `An environment variable cannot have an variadic value, but "${name}" is defined as variadic.`
    );
    Object.setPrototypeOf(this, UnexpectedVariadicEnvVarValueError.prototype);
  }
};
var DefaultCommandNotFoundError = class extends CommandError {
  constructor(name, commands) {
    super(
      `Default command "${name}" not found.${didYouMeanCommand(name, commands)}`
    );
    Object.setPrototypeOf(this, DefaultCommandNotFoundError.prototype);
  }
};
var CommandExecutableNotFoundError = class extends CommandError {
  constructor(name) {
    super(
      `Command executable not found: ${name}`
    );
    Object.setPrototypeOf(this, CommandExecutableNotFoundError.prototype);
  }
};
var UnknownCommandError = class extends ValidationError2 {
  constructor(name, commands, excluded) {
    super(
      `Unknown command "${name}".${didYouMeanCommand(name, commands, excluded)}`
    );
    Object.setPrototypeOf(this, UnknownCommandError.prototype);
  }
};
var NoArgumentsAllowedError = class extends ValidationError2 {
  constructor(name) {
    super(`No arguments allowed for command "${name}".`);
    Object.setPrototypeOf(this, NoArgumentsAllowedError.prototype);
  }
};
var MissingArgumentsError = class extends ValidationError2 {
  constructor(names) {
    super(`Missing argument(s): ${names.join(", ")}`);
    Object.setPrototypeOf(this, MissingArgumentsError.prototype);
  }
};
var MissingArgumentError = class extends ValidationError2 {
  constructor(name) {
    super(`Missing argument: ${name}`);
    Object.setPrototypeOf(this, MissingArgumentError.prototype);
  }
};
var TooManyArgumentsError = class extends ValidationError2 {
  constructor(args) {
    super(`Too many arguments: ${args.join(" ")}`);
    Object.setPrototypeOf(this, TooManyArgumentsError.prototype);
  }
};

// http-url:https://deno.land/x/cliffy@v0.25.7/flags/types/boolean.ts
var boolean = (type) => {
  if (~["1", "true"].indexOf(type.value)) {
    return true;
  }
  if (~["0", "false"].indexOf(type.value)) {
    return false;
  }
  throw new InvalidTypeError(type, ["true", "false", "1", "0"]);
};

// http-url:https://deno.land/x/cliffy@v0.25.7/flags/types/number.ts
var number = (type) => {
  const value = Number(type.value);
  if (Number.isFinite(value)) {
    return value;
  }
  throw new InvalidTypeError(type);
};

// http-url:https://deno.land/x/cliffy@v0.25.7/flags/types/string.ts
var string = ({ value }) => {
  return value;
};

// http-url:https://deno.land/x/cliffy@v0.25.7/flags/_validate_flags.ts
function validateFlags(ctx, opts, options = /* @__PURE__ */ new Map()) {
  if (!opts.flags) {
    return;
  }
  const defaultValues = setDefaultValues(ctx, opts);
  const optionNames = Object.keys(ctx.flags);
  if (!optionNames.length && opts.allowEmpty) {
    return;
  }
  if (ctx.standalone) {
    validateStandaloneOption(
      ctx,
      options,
      optionNames,
      defaultValues
    );
    return;
  }
  for (const [name, option] of options) {
    validateUnknownOption(option, opts);
    validateConflictingOptions(ctx, option);
    validateDependingOptions(ctx, option, defaultValues);
    validateRequiredValues(ctx, option, name);
  }
  validateRequiredOptions(ctx, options, opts);
}
function validateUnknownOption(option, opts) {
  if (!getOption(opts.flags ?? [], option.name)) {
    throw new UnknownOptionError(option.name, opts.flags ?? []);
  }
}
function setDefaultValues(ctx, opts) {
  const defaultValues = {};
  if (!opts.flags?.length) {
    return defaultValues;
  }
  for (const option of opts.flags) {
    let name;
    let defaultValue = void 0;
    if (option.name.startsWith("no-")) {
      const propName = option.name.replace(/^no-/, "");
      if (typeof ctx.flags[propName] !== "undefined") {
        continue;
      }
      const positiveOption = getOption(opts.flags, propName);
      if (positiveOption) {
        continue;
      }
      name = paramCaseToCamelCase(propName);
      defaultValue = true;
    }
    if (!name) {
      name = paramCaseToCamelCase(option.name);
    }
    const hasDefaultValue = (!opts.ignoreDefaults || typeof opts.ignoreDefaults[name] === "undefined") && typeof ctx.flags[name] === "undefined" && (typeof option.default !== "undefined" || typeof defaultValue !== "undefined");
    if (hasDefaultValue) {
      ctx.flags[name] = getDefaultValue(option) ?? defaultValue;
      defaultValues[option.name] = true;
      if (typeof option.value === "function") {
        ctx.flags[name] = option.value(ctx.flags[name]);
      }
    }
  }
  return defaultValues;
}
function validateStandaloneOption(ctx, options, optionNames, defaultValues) {
  if (!ctx.standalone || optionNames.length === 1) {
    return;
  }
  for (const [_, opt] of options) {
    if (!defaultValues[opt.name] && opt !== ctx.standalone) {
      throw new OptionNotCombinableError(ctx.standalone.name);
    }
  }
}
function validateConflictingOptions(ctx, option) {
  if (!option.conflicts?.length) {
    return;
  }
  for (const flag of option.conflicts) {
    if (isset(flag, ctx.flags)) {
      throw new ConflictingOptionError(option.name, flag);
    }
  }
}
function validateDependingOptions(ctx, option, defaultValues) {
  if (!option.depends) {
    return;
  }
  for (const flag of option.depends) {
    if (!isset(flag, ctx.flags) && !defaultValues[option.name]) {
      throw new DependingOptionError(option.name, flag);
    }
  }
}
function validateRequiredValues(ctx, option, name) {
  if (!option.args) {
    return;
  }
  const isArray = option.args.length > 1;
  for (let i = 0; i < option.args.length; i++) {
    const arg = option.args[i];
    if (!arg.requiredValue) {
      continue;
    }
    const hasValue = isArray ? typeof ctx.flags[name][i] !== "undefined" : typeof ctx.flags[name] !== "undefined";
    if (!hasValue) {
      throw new MissingOptionValueError(option.name);
    }
  }
}
function validateRequiredOptions(ctx, options, opts) {
  if (!opts.flags?.length) {
    return;
  }
  const optionsValues = [...options.values()];
  for (const option of opts.flags) {
    if (!option.required || paramCaseToCamelCase(option.name) in ctx.flags) {
      continue;
    }
    const conflicts = option.conflicts ?? [];
    const hasConflict = conflicts.find((flag) => !!ctx.flags[flag]);
    const hasConflicts = hasConflict || optionsValues.find(
      (opt) => opt.conflicts?.find((flag) => flag === option.name)
    );
    if (hasConflicts) {
      continue;
    }
    throw new MissingRequiredOptionError(option.name);
  }
}
function isset(flagName, flags) {
  const name = paramCaseToCamelCase(flagName);
  return typeof flags[name] !== "undefined";
}

// http-url:https://deno.land/x/cliffy@v0.25.7/flags/types/integer.ts
var integer = (type) => {
  const value = Number(type.value);
  if (Number.isInteger(value)) {
    return value;
  }
  throw new InvalidTypeError(type);
};

// http-url:https://deno.land/x/cliffy@v0.25.7/flags/flags.ts
var DefaultTypes = {
  string,
  number,
  integer,
  boolean
};
function parseFlags(argsOrCtx, opts = {}) {
  let args;
  let ctx;
  if (Array.isArray(argsOrCtx)) {
    ctx = {};
    args = argsOrCtx;
  } else {
    ctx = argsOrCtx;
    args = argsOrCtx.unknown;
    argsOrCtx.unknown = [];
  }
  args = args.slice();
  ctx.flags ??= {};
  ctx.literal ??= [];
  ctx.unknown ??= [];
  ctx.stopEarly = false;
  ctx.stopOnUnknown = false;
  opts.dotted ??= true;
  validateOptions(opts);
  const options = parseArgs(ctx, args, opts);
  validateFlags(ctx, opts, options);
  if (opts.dotted) {
    parseDottedOptions(ctx);
  }
  return ctx;
}
function validateOptions(opts) {
  opts.flags?.forEach((opt) => {
    opt.depends?.forEach((flag) => {
      if (!opts.flags || !getOption(opts.flags, flag)) {
        throw new UnknownRequiredOptionError(flag, opts.flags ?? []);
      }
    });
    opt.conflicts?.forEach((flag) => {
      if (!opts.flags || !getOption(opts.flags, flag)) {
        throw new UnknownConflictingOptionError(flag, opts.flags ?? []);
      }
    });
  });
}
function parseArgs(ctx, args, opts) {
  const optionsMap = /* @__PURE__ */ new Map();
  let inLiteral = false;
  for (let argsIndex = 0; argsIndex < args.length; argsIndex++) {
    let parseNext = function(option2) {
      if (negate) {
        ctx.flags[propName] = false;
        return;
      } else if (!option2.args?.length) {
        ctx.flags[propName] = void 0;
        return;
      }
      const arg = option2.args[optionArgsIndex];
      if (!arg) {
        const flag = next();
        throw new UnknownOptionError(flag, opts.flags ?? []);
      }
      if (!arg.type) {
        arg.type = "boolean" /* BOOLEAN */;
      }
      if (option2.args?.length && !option2.type) {
        if ((typeof arg.optionalValue === "undefined" || arg.optionalValue === false) && typeof arg.requiredValue === "undefined") {
          arg.requiredValue = true;
        }
      } else {
        if (arg.type !== "boolean" /* BOOLEAN */ && (typeof arg.optionalValue === "undefined" || arg.optionalValue === false) && typeof arg.requiredValue === "undefined") {
          arg.requiredValue = true;
        }
      }
      if (!arg.requiredValue) {
        inOptionalArg = true;
      } else if (inOptionalArg) {
        throw new UnexpectedRequiredArgumentError(option2.name);
      }
      let result;
      let increase = false;
      if (arg.list && hasNext(arg)) {
        const parsed = next().split(arg.separator || ",").map((nextValue) => {
          const value = parseValue(option2, arg, nextValue);
          if (typeof value === "undefined") {
            throw new InvalidOptionValueError(
              option2.name,
              arg.type ?? "?",
              nextValue
            );
          }
          return value;
        });
        if (parsed?.length) {
          result = parsed;
        }
      } else {
        if (hasNext(arg)) {
          result = parseValue(option2, arg, next());
        } else if (arg.optionalValue && arg.type === "boolean" /* BOOLEAN */) {
          result = true;
        }
      }
      if (increase && typeof currentValue === "undefined") {
        argsIndex++;
        if (!arg.variadic) {
          optionArgsIndex++;
        } else if (option2.args[optionArgsIndex + 1]) {
          throw new UnexpectedArgumentAfterVariadicArgumentError(next());
        }
      }
      if (typeof result !== "undefined" && (option2.args.length > 1 || arg.variadic)) {
        if (!ctx.flags[propName]) {
          ctx.flags[propName] = [];
        }
        ctx.flags[propName].push(result);
        if (hasNext(arg)) {
          parseNext(option2);
        }
      } else {
        ctx.flags[propName] = result;
      }
      function hasNext(arg2) {
        if (!option2.args?.length) {
          return false;
        }
        const nextValue = currentValue ?? args[argsIndex + 1];
        if (!nextValue) {
          return false;
        }
        if (option2.args.length > 1 && optionArgsIndex >= option2.args.length) {
          return false;
        }
        if (arg2.requiredValue) {
          return true;
        }
        if (option2.equalsSign && arg2.optionalValue && !arg2.variadic && typeof currentValue === "undefined") {
          return false;
        }
        if (arg2.optionalValue || arg2.variadic) {
          return nextValue[0] !== "-" || typeof currentValue !== "undefined" || arg2.type === "number" /* NUMBER */ && !isNaN(Number(nextValue));
        }
        return false;
      }
      function parseValue(option3, arg2, value) {
        const result2 = opts.parse ? opts.parse({
          label: "Option",
          type: arg2.type || "string" /* STRING */,
          name: `--${option3.name}`,
          value
        }) : parseDefaultType(option3, arg2, value);
        if (typeof result2 !== "undefined") {
          increase = true;
        }
        return result2;
      }
    };
    let option;
    let current = args[argsIndex];
    let currentValue;
    let negate = false;
    if (inLiteral) {
      ctx.literal.push(current);
      continue;
    } else if (current === "--") {
      inLiteral = true;
      continue;
    } else if (ctx.stopEarly || ctx.stopOnUnknown) {
      ctx.unknown.push(current);
      continue;
    }
    const isFlag = current.length > 1 && current[0] === "-";
    if (!isFlag) {
      if (opts.stopEarly) {
        ctx.stopEarly = true;
      }
      ctx.unknown.push(current);
      continue;
    }
    const isShort = current[1] !== "-";
    const isLong = isShort ? false : current.length > 3 && current[2] !== "-";
    if (!isShort && !isLong) {
      throw new InvalidOptionError(current, opts.flags ?? []);
    }
    if (isShort && current.length > 2 && current[2] !== ".") {
      args.splice(argsIndex, 1, ...splitFlags(current));
      current = args[argsIndex];
    } else if (isLong && current.startsWith("--no-")) {
      negate = true;
    }
    const equalSignIndex = current.indexOf("=");
    if (equalSignIndex !== -1) {
      currentValue = current.slice(equalSignIndex + 1) || void 0;
      current = current.slice(0, equalSignIndex);
    }
    if (opts.flags) {
      option = getOption(opts.flags, current);
      if (!option) {
        const name = current.replace(/^-+/, "");
        option = matchWildCardOptions(name, opts.flags);
        if (!option) {
          if (opts.stopOnUnknown) {
            ctx.stopOnUnknown = true;
            ctx.unknown.push(args[argsIndex]);
            continue;
          }
          throw new UnknownOptionError(current, opts.flags);
        }
      }
    } else {
      option = {
        name: current.replace(/^-+/, ""),
        optionalValue: true,
        type: "string" /* STRING */
      };
    }
    if (option.standalone) {
      ctx.standalone = option;
    }
    const positiveName = negate ? option.name.replace(/^no-?/, "") : option.name;
    const propName = paramCaseToCamelCase(positiveName);
    if (typeof ctx.flags[propName] !== "undefined") {
      if (!opts.flags?.length) {
        option.collect = true;
      } else if (!option.collect) {
        throw new DuplicateOptionError(current);
      }
    }
    if (option.type && !option.args?.length) {
      option.args = [{
        type: option.type,
        requiredValue: option.requiredValue,
        optionalValue: option.optionalValue,
        variadic: option.variadic,
        list: option.list,
        separator: option.separator
      }];
    }
    if (opts.flags?.length && !option.args?.length && typeof currentValue !== "undefined") {
      throw new UnexpectedOptionValueError(option.name, currentValue);
    }
    let optionArgsIndex = 0;
    let inOptionalArg = false;
    const next = () => currentValue ?? args[argsIndex + 1];
    const previous = ctx.flags[propName];
    parseNext(option);
    if (typeof ctx.flags[propName] === "undefined") {
      if (option.args?.[optionArgsIndex]?.requiredValue) {
        throw new MissingOptionValueError(option.name);
      } else if (typeof option.default !== "undefined") {
        ctx.flags[propName] = getDefaultValue(option);
      } else {
        ctx.flags[propName] = true;
      }
    }
    if (option.value) {
      ctx.flags[propName] = option.value(ctx.flags[propName], previous);
    } else if (option.collect) {
      const value = typeof previous !== "undefined" ? Array.isArray(previous) ? previous : [previous] : [];
      value.push(ctx.flags[propName]);
      ctx.flags[propName] = value;
    }
    optionsMap.set(propName, option);
    opts.option?.(option, ctx.flags[propName]);
  }
  return optionsMap;
}
function parseDottedOptions(ctx) {
  ctx.flags = Object.keys(ctx.flags).reduce(
    (result, key) => {
      if (~key.indexOf(".")) {
        key.split(".").reduce(
          (result2, subKey, index, parts) => {
            if (index === parts.length - 1) {
              result2[subKey] = ctx.flags[key];
            } else {
              result2[subKey] = result2[subKey] ?? {};
            }
            return result2[subKey];
          },
          result
        );
      } else {
        result[key] = ctx.flags[key];
      }
      return result;
    },
    {}
  );
}
function splitFlags(flag) {
  flag = flag.slice(1);
  const normalized = [];
  const index = flag.indexOf("=");
  const flags = (index !== -1 ? flag.slice(0, index) : flag).split("");
  if (isNaN(Number(flag[flag.length - 1]))) {
    flags.forEach((val) => normalized.push(`-${val}`));
  } else {
    normalized.push(`-${flags.shift()}`);
    if (flags.length) {
      normalized.push(flags.join(""));
    }
  }
  if (index !== -1) {
    normalized[normalized.length - 1] += flag.slice(index);
  }
  return normalized;
}
function parseDefaultType(option, arg, value) {
  const type = arg.type || "string" /* STRING */;
  const parseType = DefaultTypes[type];
  if (!parseType) {
    throw new UnknownTypeError(type, Object.keys(DefaultTypes));
  }
  return parseType({
    label: "Option",
    type,
    name: `--${option.name}`,
    value
  });
}

// http-url:https://deno.land/x/cliffy@v0.25.7/command/type.ts
var Type = class {
};

// http-url:https://deno.land/x/cliffy@v0.25.7/command/types/boolean.ts
var BooleanType = class extends Type {
  /** Parse boolean type. */
  parse(type) {
    return boolean(type);
  }
  /** Complete boolean type. */
  complete() {
    return ["true", "false"];
  }
};

// http-url:https://deno.land/x/cliffy@v0.25.7/command/types/string.ts
var StringType = class extends Type {
  /** Complete string type. */
  parse(type) {
    return string(type);
  }
};

// http-url:https://deno.land/x/cliffy@v0.25.7/command/types/file.ts
var FileType = class extends StringType {
  constructor() {
    super();
  }
  // getOptions(): FileTypeOptions {
  //   return this.opts;
  // }
};

// http-url:https://deno.land/x/cliffy@v0.25.7/command/types/number.ts
var NumberType = class extends Type {
  /** Parse number type. */
  parse(type) {
    return number(type);
  }
};

// http-url:https://deno.land/x/cliffy@v0.25.7/command/help/_help_generator.ts
var HelpGenerator = class {
  constructor(cmd, options = {}) {
    this.cmd = cmd;
    this.indent = 2;
    this.options = {
      types: false,
      hints: true,
      colors: true,
      long: false,
      ...options
    };
  }
  /** Generate help text for given command. */
  static generate(cmd, options) {
    return new HelpGenerator(cmd, options).generate();
  }
  generate() {
    const areColorsEnabled = getColorEnabled2();
    setColorEnabled2(this.options.colors);
    const result = this.generateHeader() + this.generateMeta() + this.generateDescription() + this.generateOptions() + this.generateCommands() + this.generateEnvironmentVariables() + this.generateExamples();
    setColorEnabled2(areColorsEnabled);
    return result;
  }
  generateHeader() {
    const usage = this.cmd.getUsage();
    const rows = [
      [
        bold2("Usage:"),
        brightMagenta2(
          this.cmd.getPath() + (usage ? " " + highlightArguments(usage, this.options.types) : "")
        )
      ]
    ];
    const version = this.cmd.getVersion();
    if (version) {
      rows.push([bold2("Version:"), yellow2(`${this.cmd.getVersion()}`)]);
    }
    return "\n" + Table.from(rows).indent(this.indent).padding(1).toString() + "\n";
  }
  generateMeta() {
    const meta = Object.entries(this.cmd.getMeta());
    if (!meta.length) {
      return "";
    }
    const rows = [];
    for (const [name, value] of meta) {
      rows.push([bold2(`${name}: `) + value]);
    }
    return "\n" + Table.from(rows).indent(this.indent).padding(1).toString() + "\n";
  }
  generateDescription() {
    if (!this.cmd.getDescription()) {
      return "";
    }
    return this.label("Description") + Table.from([
      [dedent(this.cmd.getDescription())]
    ]).indent(this.indent * 2).maxColWidth(140).padding(1).toString() + "\n";
  }
  generateOptions() {
    const options = this.cmd.getOptions(false);
    if (!options.length) {
      return "";
    }
    let groups = [];
    const hasGroups = options.some((option) => option.groupName);
    if (hasGroups) {
      for (const option of options) {
        let group = groups.find((group2) => group2.name === option.groupName);
        if (!group) {
          group = {
            name: option.groupName,
            options: []
          };
          groups.push(group);
        }
        group.options.push(option);
      }
    } else {
      groups = [{
        name: "Options",
        options
      }];
    }
    let result = "";
    for (const group of groups) {
      result += this.generateOptionGroup(group);
    }
    return result;
  }
  generateOptionGroup(group) {
    if (!group.options.length) {
      return "";
    }
    const hasTypeDefinitions = !!group.options.find(
      (option) => !!option.typeDefinition
    );
    if (hasTypeDefinitions) {
      return this.label(group.name ?? "Options") + Table.from([
        ...group.options.map((option) => [
          option.flags.map((flag) => brightBlue2(flag)).join(", "),
          highlightArguments(
            option.typeDefinition || "",
            this.options.types
          ),
          red2(bold2("-")),
          getDescription(option.description, !this.options.long),
          this.generateHints(option)
        ])
      ]).padding([2, 2, 1, 2]).indent(this.indent * 2).maxColWidth([60, 60, 1, 80, 60]).toString() + "\n";
    }
    return this.label(group.name ?? "Options") + Table.from([
      ...group.options.map((option) => [
        option.flags.map((flag) => brightBlue2(flag)).join(", "),
        red2(bold2("-")),
        getDescription(option.description, !this.options.long),
        this.generateHints(option)
      ])
    ]).indent(this.indent * 2).maxColWidth([60, 1, 80, 60]).padding([2, 1, 2]).toString() + "\n";
  }
  generateCommands() {
    const commands = this.cmd.getCommands(false);
    if (!commands.length) {
      return "";
    }
    const hasTypeDefinitions = !!commands.find(
      (command) => !!command.getArgsDefinition()
    );
    if (hasTypeDefinitions) {
      return this.label("Commands") + Table.from([
        ...commands.map((command) => [
          [command.getName(), ...command.getAliases()].map(
            (name) => brightBlue2(name)
          ).join(", "),
          highlightArguments(
            command.getArgsDefinition() || "",
            this.options.types
          ),
          red2(bold2("-")),
          command.getShortDescription()
        ])
      ]).indent(this.indent * 2).maxColWidth([60, 60, 1, 80]).padding([2, 2, 1, 2]).toString() + "\n";
    }
    return this.label("Commands") + Table.from([
      ...commands.map((command) => [
        [command.getName(), ...command.getAliases()].map(
          (name) => brightBlue2(name)
        ).join(", "),
        red2(bold2("-")),
        command.getShortDescription()
      ])
    ]).maxColWidth([60, 1, 80]).padding([2, 1, 2]).indent(this.indent * 2).toString() + "\n";
  }
  generateEnvironmentVariables() {
    const envVars = this.cmd.getEnvVars(false);
    if (!envVars.length) {
      return "";
    }
    return this.label("Environment variables") + Table.from([
      ...envVars.map((envVar) => [
        envVar.names.map((name) => brightBlue2(name)).join(", "),
        highlightArgumentDetails(
          envVar.details,
          this.options.types
        ),
        red2(bold2("-")),
        this.options.long ? dedent(envVar.description) : envVar.description.trim().split("\n", 1)[0],
        envVar.required ? `(${yellow2(`required`)})` : ""
      ])
    ]).padding([2, 2, 1, 2]).indent(this.indent * 2).maxColWidth([60, 60, 1, 80, 10]).toString() + "\n";
  }
  generateExamples() {
    const examples = this.cmd.getExamples();
    if (!examples.length) {
      return "";
    }
    return this.label("Examples") + Table.from(examples.map((example) => [
      dim2(bold2(`${capitalize(example.name)}:`)),
      dedent(example.description)
    ])).padding(1).indent(this.indent * 2).maxColWidth(150).toString() + "\n";
  }
  generateHints(option) {
    if (!this.options.hints) {
      return "";
    }
    const hints = [];
    option.required && hints.push(yellow2(`required`));
    typeof option.default !== "undefined" && hints.push(
      bold2(`Default: `) + inspect(option.default, this.options.colors)
    );
    option.depends?.length && hints.push(
      yellow2(bold2(`Depends: `)) + italic2(option.depends.map(getFlag).join(", "))
    );
    option.conflicts?.length && hints.push(
      red2(bold2(`Conflicts: `)) + italic2(option.conflicts.map(getFlag).join(", "))
    );
    const type = this.cmd.getType(option.args[0]?.type)?.handler;
    if (type instanceof Type) {
      const possibleValues = type.values?.(this.cmd, this.cmd.getParent());
      if (possibleValues?.length) {
        hints.push(
          bold2(`Values: `) + possibleValues.map(
            (value) => inspect(value, this.options.colors)
          ).join(", ")
        );
      }
    }
    if (hints.length) {
      return `(${hints.join(", ")})`;
    }
    return "";
  }
  label(label) {
    return "\n" + " ".repeat(this.indent) + bold2(`${label}:`) + "\n\n";
  }
};
function capitalize(string2) {
  return string2?.charAt(0).toUpperCase() + string2.slice(1);
}
function inspect(value, colors) {
  return Deno.inspect(
    value,
    // deno < 1.4.3 doesn't support the colors property.
    { depth: 1, colors, trailingComma: false }
  );
}
function highlightArguments(argsDefinition, types = true) {
  if (!argsDefinition) {
    return "";
  }
  return parseArgumentsDefinition(argsDefinition, false, true).map(
    (arg) => typeof arg === "string" ? arg : highlightArgumentDetails(arg, types)
  ).join(" ");
}
function highlightArgumentDetails(arg, types = true) {
  let str = "";
  str += yellow2(arg.optionalValue ? "[" : "<");
  let name = "";
  name += arg.name;
  if (arg.variadic) {
    name += "...";
  }
  name = brightMagenta2(name);
  str += name;
  if (types) {
    str += yellow2(":");
    str += red2(arg.type);
    if (arg.list) {
      str += green2("[]");
    }
  }
  str += yellow2(arg.optionalValue ? "]" : ">");
  return str;
}

// http-url:https://deno.land/x/cliffy@v0.25.7/command/types/integer.ts
var IntegerType = class extends Type {
  /** Parse integer type. */
  parse(type) {
    return integer(type);
  }
};

// http-url:https://deno.land/x/cliffy@v0.25.7/command/command.ts
var Command = class {
  constructor() {
    this.types = /* @__PURE__ */ new Map();
    this.rawArgs = [];
    this.literalArgs = [];
    // @TODO: get script name: https://github.com/denoland/deno/pull/5034
    // private name: string = location.pathname.split( '/' ).pop() as string;
    this._name = "COMMAND";
    this.desc = "";
    this.options = [];
    this.commands = /* @__PURE__ */ new Map();
    this.examples = [];
    this.envVars = [];
    this.aliases = [];
    this.completions = /* @__PURE__ */ new Map();
    this.cmd = this;
    this.isExecutable = false;
    this.throwOnError = false;
    this._allowEmpty = false;
    this._stopEarly = false;
    this._useRawArgs = false;
    this.args = [];
    this.isHidden = false;
    this.isGlobal = false;
    this.hasDefaults = false;
    this._meta = {};
    this._noGlobals = false;
  }
  versionOption(flags, desc, opts) {
    this._versionOptions = flags === false ? flags : {
      flags,
      desc,
      opts: typeof opts === "function" ? { action: opts } : opts
    };
    return this;
  }
  helpOption(flags, desc, opts) {
    this._helpOptions = flags === false ? flags : {
      flags,
      desc,
      opts: typeof opts === "function" ? { action: opts } : opts
    };
    return this;
  }
  /**
   * Add new sub-command.
   * @param nameAndArguments  Command definition. E.g: `my-command <input-file:string> <output-file:string>`
   * @param cmdOrDescription  The description of the new child command.
   * @param override          Override existing child command.
   */
  command(nameAndArguments, cmdOrDescription, override) {
    this.reset();
    const result = splitArguments(nameAndArguments);
    const name = result.flags.shift();
    const aliases = result.flags;
    if (!name) {
      throw new MissingCommandNameError();
    }
    if (this.getBaseCommand(name, true)) {
      if (!override) {
        throw new DuplicateCommandNameError(name);
      }
      this.removeCommand(name);
    }
    let description;
    let cmd;
    if (typeof cmdOrDescription === "string") {
      description = cmdOrDescription;
    }
    if (cmdOrDescription instanceof Command) {
      cmd = cmdOrDescription.reset();
    } else {
      cmd = new Command();
    }
    cmd._name = name;
    cmd._parent = this;
    if (description) {
      cmd.description(description);
    }
    if (result.typeDefinition) {
      cmd.arguments(result.typeDefinition);
    }
    aliases.forEach((alias) => cmd.alias(alias));
    this.commands.set(name, cmd);
    this.select(name);
    return this;
  }
  /**
   * Add new command alias.
   * @param alias Tha name of the alias.
   */
  alias(alias) {
    if (this.cmd._name === alias || this.cmd.aliases.includes(alias)) {
      throw new DuplicateCommandAliasError(alias);
    }
    this.cmd.aliases.push(alias);
    return this;
  }
  /** Reset internal command reference to main command. */
  reset() {
    this._groupName = void 0;
    this.cmd = this;
    return this;
  }
  /**
   * Set internal command pointer to child command with given name.
   * @param name The name of the command to select.
   */
  select(name) {
    const cmd = this.getBaseCommand(name, true);
    if (!cmd) {
      throw new CommandNotFoundError(name, this.getBaseCommands(true));
    }
    this.cmd = cmd;
    return this;
  }
  /*****************************************************************************
   **** SUB HANDLER ************************************************************
   *****************************************************************************/
  /** Set command name. */
  name(name) {
    this.cmd._name = name;
    return this;
  }
  /**
   * Set command version.
   * @param version Semantic version string string or method that returns the version string.
   */
  version(version) {
    if (typeof version === "string") {
      this.cmd.ver = () => version;
    } else if (typeof version === "function") {
      this.cmd.ver = version;
    }
    return this;
  }
  meta(name, value) {
    this.cmd._meta[name] = value;
    return this;
  }
  getMeta(name) {
    return typeof name === "undefined" ? this._meta : this._meta[name];
  }
  /**
   * Set command help.
   * @param help Help string, method, or config for generator that returns the help string.
   */
  help(help) {
    if (typeof help === "string") {
      this.cmd._help = () => help;
    } else if (typeof help === "function") {
      this.cmd._help = help;
    } else {
      this.cmd._help = (cmd, options) => HelpGenerator.generate(cmd, { ...help, ...options });
    }
    return this;
  }
  /**
   * Set the long command description.
   * @param description The command description.
   */
  description(description) {
    this.cmd.desc = description;
    return this;
  }
  /**
   * Set the command usage. Defaults to arguments.
   * @param usage The command usage.
   */
  usage(usage) {
    this.cmd._usage = usage;
    return this;
  }
  /**
   * Hide command from help, completions, etc.
   */
  hidden() {
    this.cmd.isHidden = true;
    return this;
  }
  /** Make command globally available. */
  global() {
    this.cmd.isGlobal = true;
    return this;
  }
  /** Make command executable. */
  executable() {
    this.cmd.isExecutable = true;
    return this;
  }
  /**
   * Set command arguments:
   *
   *   <requiredArg:string> [optionalArg: number] [...restArgs:string]
   */
  arguments(args) {
    this.cmd.argsDefinition = args;
    return this;
  }
  /**
   * Set command callback method.
   * @param fn Command action handler.
   */
  action(fn) {
    this.cmd.fn = fn;
    return this;
  }
  /**
   * Don't throw an error if the command was called without arguments.
   * @param allowEmpty Enable/disable allow empty.
   */
  // public allowEmpty<TAllowEmpty extends boolean | undefined = undefined>(
  //   allowEmpty?: TAllowEmpty,
  // ): false extends TAllowEmpty ? this
  //   : Command<
  //     Partial<TParentCommandGlobals>,
  //     TParentCommandTypes,
  //     Partial<TCommandOptions>,
  //     TCommandArguments,
  //     TCommandGlobals,
  //     TCommandTypes,
  //     TCommandGlobalTypes,
  //     TParentCommand
  //   > {
  //   this.cmd._allowEmpty = allowEmpty !== false;
  //   return this;
  // }
  allowEmpty(allowEmpty) {
    this.cmd._allowEmpty = allowEmpty !== false;
    return this;
  }
  /**
   * Enable stop early. If enabled, all arguments starting from the first non
   * option argument will be passed as arguments with type string to the command
   * action handler.
   *
   * For example:
   *     `command --debug-level warning server --port 80`
   *
   * Will result in:
   *     - options: `{debugLevel: 'warning'}`
   *     - args: `['server', '--port', '80']`
   *
   * @param stopEarly Enable/disable stop early.
   */
  stopEarly(stopEarly = true) {
    this.cmd._stopEarly = stopEarly;
    return this;
  }
  /**
   * Disable parsing arguments. If enabled the raw arguments will be passed to
   * the action handler. This has no effect for parent or child commands. Only
   * for the command on which this method was called.
   * @param useRawArgs Enable/disable raw arguments.
   */
  useRawArgs(useRawArgs = true) {
    this.cmd._useRawArgs = useRawArgs;
    return this;
  }
  /**
   * Set default command. The default command is executed when the program
   * was called without any argument and if no action handler is registered.
   * @param name Name of the default command.
   */
  default(name) {
    this.cmd.defaultCommand = name;
    return this;
  }
  globalType(name, handler, options) {
    return this.type(name, handler, { ...options, global: true });
  }
  /**
   * Register custom type.
   * @param name    The name of the type.
   * @param handler The callback method to parse the type.
   * @param options Type options.
   */
  type(name, handler, options) {
    if (this.cmd.types.get(name) && !options?.override) {
      throw new DuplicateTypeError(name);
    }
    this.cmd.types.set(name, {
      ...options,
      name,
      handler
    });
    if (handler instanceof Type && (typeof handler.complete !== "undefined" || typeof handler.values !== "undefined")) {
      const completeHandler = (cmd, parent) => handler.complete?.(cmd, parent) || [];
      this.complete(name, completeHandler, options);
    }
    return this;
  }
  globalComplete(name, complete, options) {
    return this.complete(name, complete, { ...options, global: true });
  }
  complete(name, complete, options) {
    if (this.cmd.completions.has(name) && !options?.override) {
      throw new DuplicateCompletionError(name);
    }
    this.cmd.completions.set(name, {
      name,
      complete,
      ...options
    });
    return this;
  }
  /**
   * Throw validation errors instead of calling `Deno.exit()` to handle
   * validation errors manually.
   *
   * A validation error is thrown when the command is wrongly used by the user.
   * For example: If the user passes some invalid options or arguments to the
   * command.
   *
   * This has no effect for parent commands. Only for the command on which this
   * method was called and all child commands.
   *
   * **Example:**
   *
   * ```
   * try {
   *   cmd.parse();
   * } catch(error) {
   *   if (error instanceof ValidationError) {
   *     cmd.showHelp();
   *     Deno.exit(1);
   *   }
   *   throw error;
   * }
   * ```
   *
   * @see ValidationError
   */
  throwErrors() {
    this.cmd.throwOnError = true;
    return this;
  }
  error(handler) {
    this.cmd.errorHandler = handler;
    return this;
  }
  getErrorHandler() {
    return this.errorHandler ?? this._parent?.errorHandler;
  }
  /**
   * Same as `.throwErrors()` but also prevents calling `Deno.exit` after
   * printing help or version with the --help and --version option.
   */
  noExit() {
    this.cmd._shouldExit = false;
    this.throwErrors();
    return this;
  }
  /**
   * Disable inheriting global commands, options and environment variables from
   * parent commands.
   */
  noGlobals() {
    this.cmd._noGlobals = true;
    return this;
  }
  /** Check whether the command should throw errors or exit. */
  shouldThrowErrors() {
    return this.throwOnError || !!this._parent?.shouldThrowErrors();
  }
  /** Check whether the command should exit after printing help or version. */
  shouldExit() {
    return this._shouldExit ?? this._parent?.shouldExit() ?? true;
  }
  globalOption(flags, desc, opts) {
    if (typeof opts === "function") {
      return this.option(
        flags,
        desc,
        { value: opts, global: true }
      );
    }
    return this.option(
      flags,
      desc,
      { ...opts, global: true }
    );
  }
  /**
   * Enable grouping of options and set the name of the group.
   * All option which are added after calling the `.group()` method will be
   * grouped in the help output. If the `.group()` method can be use multiple
   * times to create more groups.
   *
   * @param name The name of the option group.
   */
  group(name) {
    this.cmd._groupName = name;
    return this;
  }
  option(flags, desc, opts) {
    if (typeof opts === "function") {
      return this.option(flags, desc, { value: opts });
    }
    const result = splitArguments(flags);
    const args = result.typeDefinition ? parseArgumentsDefinition(result.typeDefinition) : [];
    const option = {
      ...opts,
      name: "",
      description: desc,
      args,
      flags: result.flags,
      equalsSign: result.equalsSign,
      typeDefinition: result.typeDefinition,
      groupName: this._groupName
    };
    if (option.separator) {
      for (const arg of args) {
        if (arg.list) {
          arg.separator = option.separator;
        }
      }
    }
    for (const part of option.flags) {
      const arg = part.trim();
      const isLong = /^--/.test(arg);
      const name = isLong ? arg.slice(2) : arg.slice(1);
      if (this.cmd.getBaseOption(name, true)) {
        if (opts?.override) {
          this.removeOption(name);
        } else {
          throw new DuplicateOptionNameError(name);
        }
      }
      if (!option.name && isLong) {
        option.name = name;
      } else if (!option.aliases) {
        option.aliases = [name];
      } else {
        option.aliases.push(name);
      }
    }
    if (option.prepend) {
      this.cmd.options.unshift(option);
    } else {
      this.cmd.options.push(option);
    }
    return this;
  }
  /**
   * Add new command example.
   * @param name          Name of the example.
   * @param description   The content of the example.
   */
  example(name, description) {
    if (this.cmd.hasExample(name)) {
      throw new DuplicateExampleError(name);
    }
    this.cmd.examples.push({ name, description });
    return this;
  }
  globalEnv(name, description, options) {
    return this.env(
      name,
      description,
      { ...options, global: true }
    );
  }
  env(name, description, options) {
    const result = splitArguments(name);
    if (!result.typeDefinition) {
      result.typeDefinition = "<value:boolean>";
    }
    if (result.flags.some((envName) => this.cmd.getBaseEnvVar(envName, true))) {
      throw new DuplicateEnvVarError(name);
    }
    const details = parseArgumentsDefinition(
      result.typeDefinition
    );
    if (details.length > 1) {
      throw new TooManyEnvVarValuesError(name);
    } else if (details.length && details[0].optionalValue) {
      throw new UnexpectedOptionalEnvVarValueError(name);
    } else if (details.length && details[0].variadic) {
      throw new UnexpectedVariadicEnvVarValueError(name);
    }
    this.cmd.envVars.push({
      name: result.flags[0],
      names: result.flags,
      description,
      type: details[0].type,
      details: details.shift(),
      ...options
    });
    return this;
  }
  /*****************************************************************************
   **** MAIN HANDLER ***********************************************************
   *****************************************************************************/
  /**
   * Parse command line arguments and execute matched command.
   * @param args Command line args to parse. Ex: `cmd.parse( Deno.args )`
   */
  parse(args = Deno.args) {
    const ctx = {
      unknown: args.slice(),
      flags: {},
      env: {},
      literal: [],
      stopEarly: false,
      stopOnUnknown: false
    };
    return this.parseCommand(ctx);
  }
  async parseCommand(ctx) {
    try {
      this.reset();
      this.registerDefaults();
      this.rawArgs = ctx.unknown.slice();
      if (this.isExecutable) {
        await this.executeExecutable(ctx.unknown);
        return { options: {}, args: [], cmd: this, literal: [] };
      } else if (this._useRawArgs) {
        await this.parseEnvVars(ctx, this.envVars);
        return this.execute(ctx.env, ...ctx.unknown);
      }
      let preParseGlobals = false;
      let subCommand;
      if (ctx.unknown.length > 0) {
        subCommand = this.getSubCommand(ctx);
        if (!subCommand) {
          const optionName = ctx.unknown[0].replace(/^-+/, "");
          const option = this.getOption(optionName, true);
          if (option?.global) {
            preParseGlobals = true;
            await this.parseGlobalOptionsAndEnvVars(ctx);
          }
        }
      }
      if (subCommand || ctx.unknown.length > 0) {
        subCommand ??= this.getSubCommand(ctx);
        if (subCommand) {
          subCommand._globalParent = this;
          return subCommand.parseCommand(ctx);
        }
      }
      await this.parseOptionsAndEnvVars(ctx, preParseGlobals);
      const options = { ...ctx.env, ...ctx.flags };
      const args = this.parseArguments(ctx, options);
      this.literalArgs = ctx.literal;
      if (ctx.action) {
        await ctx.action.action.call(this, options, ...args);
        if (ctx.action.standalone) {
          return {
            options,
            args,
            cmd: this,
            literal: this.literalArgs
          };
        }
      }
      return await this.execute(options, ...args);
    } catch (error2) {
      this.handleError(error2);
    }
  }
  getSubCommand(ctx) {
    const subCommand = this.getCommand(ctx.unknown[0], true);
    if (subCommand) {
      ctx.unknown.shift();
    }
    return subCommand;
  }
  async parseGlobalOptionsAndEnvVars(ctx) {
    const isHelpOption = this.getHelpOption()?.flags.includes(ctx.unknown[0]);
    const envVars = [
      ...this.envVars.filter((envVar) => envVar.global),
      ...this.getGlobalEnvVars(true)
    ];
    await this.parseEnvVars(ctx, envVars, !isHelpOption);
    const options = [
      ...this.options.filter((option) => option.global),
      ...this.getGlobalOptions(true)
    ];
    this.parseOptions(ctx, options, {
      stopEarly: true,
      stopOnUnknown: true,
      dotted: false
    });
  }
  async parseOptionsAndEnvVars(ctx, preParseGlobals) {
    const helpOption = this.getHelpOption();
    const isVersionOption = this._versionOption?.flags.includes(ctx.unknown[0]);
    const isHelpOption = helpOption && ctx.flags?.[helpOption.name] === true;
    const envVars = preParseGlobals ? this.envVars.filter((envVar) => !envVar.global) : this.getEnvVars(true);
    await this.parseEnvVars(
      ctx,
      envVars,
      !isHelpOption && !isVersionOption
    );
    const options = this.getOptions(true);
    this.parseOptions(ctx, options);
  }
  /** Register default options like `--version` and `--help`. */
  registerDefaults() {
    if (this.hasDefaults || this.getParent()) {
      return this;
    }
    this.hasDefaults = true;
    this.reset();
    !this.types.has("string") && this.type("string", new StringType(), { global: true });
    !this.types.has("number") && this.type("number", new NumberType(), { global: true });
    !this.types.has("integer") && this.type("integer", new IntegerType(), { global: true });
    !this.types.has("boolean") && this.type("boolean", new BooleanType(), { global: true });
    !this.types.has("file") && this.type("file", new FileType(), { global: true });
    if (!this._help) {
      this.help({
        hints: true,
        types: false
      });
    }
    if (this._versionOptions !== false && (this._versionOptions || this.ver)) {
      this.option(
        this._versionOptions?.flags || "-V, --version",
        this._versionOptions?.desc || "Show the version number for this program.",
        {
          standalone: true,
          prepend: true,
          action: async function() {
            const long = this.getRawArgs().includes(
              `--${this._versionOption?.name}`
            );
            if (long) {
              await this.checkVersion();
              this.showLongVersion();
            } else {
              this.showVersion();
            }
            this.exit();
          },
          ...this._versionOptions?.opts ?? {}
        }
      );
      this._versionOption = this.options[0];
    }
    if (this._helpOptions !== false) {
      this.option(
        this._helpOptions?.flags || "-h, --help",
        this._helpOptions?.desc || "Show this help.",
        {
          standalone: true,
          global: true,
          prepend: true,
          action: async function() {
            const long = this.getRawArgs().includes(
              `--${this.getHelpOption()?.name}`
            );
            await this.checkVersion();
            this.showHelp({ long });
            this.exit();
          },
          ...this._helpOptions?.opts ?? {}
        }
      );
      this._helpOption = this.options[0];
    }
    return this;
  }
  /**
   * Execute command.
   * @param options A map of options.
   * @param args Command arguments.
   */
  async execute(options, ...args) {
    if (this.fn) {
      await this.fn(options, ...args);
    } else if (this.defaultCommand) {
      const cmd = this.getCommand(this.defaultCommand, true);
      if (!cmd) {
        throw new DefaultCommandNotFoundError(
          this.defaultCommand,
          this.getCommands()
        );
      }
      cmd._globalParent = this;
      return cmd.execute(options, ...args);
    }
    return {
      options,
      args,
      cmd: this,
      literal: this.literalArgs
    };
  }
  /**
   * Execute external sub-command.
   * @param args Raw command line arguments.
   */
  async executeExecutable(args) {
    const command = this.getPath().replace(/\s+/g, "-");
    await Deno.permissions.request({ name: "run", command });
    try {
      const process = Deno.run({
        cmd: [command, ...args]
      });
      const status = await process.status();
      if (!status.success) {
        Deno.exit(status.code);
      }
    } catch (error2) {
      if (error2 instanceof Deno.errors.NotFound) {
        throw new CommandExecutableNotFoundError(command);
      }
      throw error2;
    }
  }
  /** Parse raw command line arguments. */
  parseOptions(ctx, options, {
    stopEarly = this._stopEarly,
    stopOnUnknown = false,
    dotted = true
  } = {}) {
    parseFlags(ctx, {
      stopEarly,
      stopOnUnknown,
      dotted,
      allowEmpty: this._allowEmpty,
      flags: options,
      ignoreDefaults: ctx.env,
      parse: (type) => this.parseType(type),
      option: (option) => {
        if (!ctx.action && option.action) {
          ctx.action = option;
        }
      }
    });
  }
  /** Parse argument type. */
  parseType(type) {
    const typeSettings = this.getType(type.type);
    if (!typeSettings) {
      throw new UnknownTypeError(
        type.type,
        this.getTypes().map((type2) => type2.name)
      );
    }
    return typeSettings.handler instanceof Type ? typeSettings.handler.parse(type) : typeSettings.handler(type);
  }
  /**
   * Read and validate environment variables.
   * @param ctx Parse context.
   * @param envVars env vars defined by the command.
   * @param validate when true, throws an error if a required env var is missing.
   */
  async parseEnvVars(ctx, envVars, validate2 = true) {
    for (const envVar of envVars) {
      const env = await this.findEnvVar(envVar.names);
      if (env) {
        const parseType = (value) => {
          return this.parseType({
            label: "Environment variable",
            type: envVar.type,
            name: env.name,
            value
          });
        };
        const propertyName = underscoreToCamelCase(
          envVar.prefix ? envVar.names[0].replace(new RegExp(`^${envVar.prefix}`), "") : envVar.names[0]
        );
        if (envVar.details.list) {
          ctx.env[propertyName] = env.value.split(envVar.details.separator ?? ",").map(parseType);
        } else {
          ctx.env[propertyName] = parseType(env.value);
        }
        if (envVar.value && typeof ctx.env[propertyName] !== "undefined") {
          ctx.env[propertyName] = envVar.value(ctx.env[propertyName]);
        }
      } else if (envVar.required && validate2) {
        throw new MissingRequiredEnvVarError(envVar);
      }
    }
  }
  async findEnvVar(names) {
    for (const name of names) {
      const status = await Deno.permissions.query({
        name: "env",
        variable: name
      });
      if (status.state === "granted") {
        const value = Deno.env.get(name);
        if (value) {
          return { name, value };
        }
      }
    }
    return void 0;
  }
  /**
   * Parse command-line arguments.
   * @param ctx     Parse context.
   * @param options Parsed command line options.
   */
  parseArguments(ctx, options) {
    const params = [];
    const args = ctx.unknown.slice();
    if (!this.hasArguments()) {
      if (args.length) {
        if (this.hasCommands(true)) {
          if (this.hasCommand(args[0], true)) {
            throw new TooManyArgumentsError(args);
          } else {
            throw new UnknownCommandError(args[0], this.getCommands());
          }
        } else {
          throw new NoArgumentsAllowedError(this.getPath());
        }
      }
    } else {
      if (!args.length) {
        const required = this.getArguments().filter((expectedArg) => !expectedArg.optionalValue).map((expectedArg) => expectedArg.name);
        if (required.length) {
          const optionNames = Object.keys(options);
          const hasStandaloneOption = !!optionNames.find(
            (name) => this.getOption(name, true)?.standalone
          );
          if (!hasStandaloneOption) {
            throw new MissingArgumentsError(required);
          }
        }
      } else {
        for (const expectedArg of this.getArguments()) {
          if (!args.length) {
            if (expectedArg.optionalValue) {
              break;
            }
            throw new MissingArgumentError(expectedArg.name);
          }
          let arg;
          const parseArgValue = (value) => {
            return expectedArg.list ? value.split(",").map((value2) => parseArgType(value2)) : parseArgType(value);
          };
          const parseArgType = (value) => {
            return this.parseType({
              label: "Argument",
              type: expectedArg.type,
              name: expectedArg.name,
              value
            });
          };
          if (expectedArg.variadic) {
            arg = args.splice(0, args.length).map(
              (value) => parseArgValue(value)
            );
          } else {
            arg = parseArgValue(args.shift());
          }
          if (expectedArg.variadic && Array.isArray(arg)) {
            params.push(...arg);
          } else if (typeof arg !== "undefined") {
            params.push(arg);
          }
        }
        if (args.length) {
          throw new TooManyArgumentsError(args);
        }
      }
    }
    return params;
  }
  handleError(error2) {
    this.throw(
      error2 instanceof ValidationError ? new ValidationError2(error2.message) : error2 instanceof Error ? error2 : new Error(`[non-error-thrown] ${error2}`)
    );
  }
  /**
   * Handle error. If `throwErrors` is enabled the error will be thrown,
   * otherwise a formatted error message will be printed and `Deno.exit(1)`
   * will be called. This will also trigger registered error handlers.
   *
   * @param error The error to handle.
   */
  throw(error2) {
    if (error2 instanceof ValidationError2) {
      error2.cmd = this;
    }
    this.getErrorHandler()?.(error2, this);
    if (this.shouldThrowErrors() || !(error2 instanceof ValidationError2)) {
      throw error2;
    }
    this.showHelp();
    console.error(red2(`  ${bold2("error")}: ${error2.message}
`));
    Deno.exit(error2 instanceof ValidationError2 ? error2.exitCode : 1);
  }
  /*****************************************************************************
   **** GETTER *****************************************************************
   *****************************************************************************/
  /** Get command name. */
  getName() {
    return this._name;
  }
  /** Get parent command. */
  getParent() {
    return this._parent;
  }
  /**
   * Get parent command from global executed command.
   * Be sure, to call this method only inside an action handler. Unless this or any child command was executed,
   * this method returns always undefined.
   */
  getGlobalParent() {
    return this._globalParent;
  }
  /** Get main command. */
  getMainCommand() {
    return this._parent?.getMainCommand() ?? this;
  }
  /** Get command name aliases. */
  getAliases() {
    return this.aliases;
  }
  /** Get full command path. */
  getPath() {
    return this._parent ? this._parent.getPath() + " " + this._name : this._name;
  }
  /** Get arguments definition. E.g: <input-file:string> <output-file:string> */
  getArgsDefinition() {
    return this.argsDefinition;
  }
  /**
   * Get argument by name.
   * @param name Name of the argument.
   */
  getArgument(name) {
    return this.getArguments().find((arg) => arg.name === name);
  }
  /** Get arguments. */
  getArguments() {
    if (!this.args.length && this.argsDefinition) {
      this.args = parseArgumentsDefinition(this.argsDefinition);
    }
    return this.args;
  }
  /** Check if command has arguments. */
  hasArguments() {
    return !!this.argsDefinition;
  }
  /** Get command version. */
  getVersion() {
    return this.getVersionHandler()?.call(this, this);
  }
  /** Get help handler method. */
  getVersionHandler() {
    return this.ver ?? this._parent?.getVersionHandler();
  }
  /** Get command description. */
  getDescription() {
    return typeof this.desc === "function" ? this.desc = this.desc() : this.desc;
  }
  getUsage() {
    return this._usage ?? this.getArgsDefinition();
  }
  /** Get short command description. This is the first line of the description. */
  getShortDescription() {
    return getDescription(this.getDescription(), true);
  }
  /** Get original command-line arguments. */
  getRawArgs() {
    return this.rawArgs;
  }
  /** Get all arguments defined after the double dash. */
  getLiteralArgs() {
    return this.literalArgs;
  }
  /** Output generated help without exiting. */
  showVersion() {
    console.log(this.getVersion());
  }
  /** Returns command name, version and meta data. */
  getLongVersion() {
    return `${bold2(this.getMainCommand().getName())} ${brightBlue2(this.getVersion() ?? "")}` + Object.entries(this.getMeta()).map(
      ([k, v]) => `
${bold2(k)} ${brightBlue2(v)}`
    ).join("");
  }
  /** Outputs command name, version and meta data. */
  showLongVersion() {
    console.log(this.getLongVersion());
  }
  /** Output generated help without exiting. */
  showHelp(options) {
    console.log(this.getHelp(options));
  }
  /** Get generated help. */
  getHelp(options) {
    this.registerDefaults();
    return this.getHelpHandler().call(this, this, options ?? {});
  }
  /** Get help handler method. */
  getHelpHandler() {
    return this._help ?? this._parent?.getHelpHandler();
  }
  exit(code3 = 0) {
    if (this.shouldExit()) {
      Deno.exit(code3);
    }
  }
  /** Check if new version is available and add hint to version. */
  async checkVersion() {
    const mainCommand = this.getMainCommand();
    const upgradeCommand = mainCommand.getCommand("upgrade");
    if (!isUpgradeCommand(upgradeCommand)) {
      return;
    }
    const latestVersion = await upgradeCommand.getLatestVersion();
    const currentVersion = mainCommand.getVersion();
    if (currentVersion === latestVersion) {
      return;
    }
    const versionHelpText = `(New version available: ${latestVersion}. Run '${mainCommand.getName()} upgrade' to upgrade to the latest version!)`;
    mainCommand.version(`${currentVersion}  ${bold2(yellow2(versionHelpText))}`);
  }
  /*****************************************************************************
   **** Options GETTER *********************************************************
   *****************************************************************************/
  /**
   * Checks whether the command has options or not.
   * @param hidden Include hidden options.
   */
  hasOptions(hidden2) {
    return this.getOptions(hidden2).length > 0;
  }
  /**
   * Get options.
   * @param hidden Include hidden options.
   */
  getOptions(hidden2) {
    return this.getGlobalOptions(hidden2).concat(this.getBaseOptions(hidden2));
  }
  /**
   * Get base options.
   * @param hidden Include hidden options.
   */
  getBaseOptions(hidden2) {
    if (!this.options.length) {
      return [];
    }
    return hidden2 ? this.options.slice(0) : this.options.filter((opt) => !opt.hidden);
  }
  /**
   * Get global options.
   * @param hidden Include hidden options.
   */
  getGlobalOptions(hidden2) {
    const helpOption = this.getHelpOption();
    const getGlobals = (cmd, noGlobals, options = [], names = []) => {
      if (cmd.options.length) {
        for (const option of cmd.options) {
          if (option.global && !this.options.find((opt) => opt.name === option.name) && names.indexOf(option.name) === -1 && (hidden2 || !option.hidden)) {
            if (noGlobals && option !== helpOption) {
              continue;
            }
            names.push(option.name);
            options.push(option);
          }
        }
      }
      return cmd._parent ? getGlobals(
        cmd._parent,
        noGlobals || cmd._noGlobals,
        options,
        names
      ) : options;
    };
    return this._parent ? getGlobals(this._parent, this._noGlobals) : [];
  }
  /**
   * Checks whether the command has an option with given name or not.
   * @param name Name of the option. Must be in param-case.
   * @param hidden Include hidden options.
   */
  hasOption(name, hidden2) {
    return !!this.getOption(name, hidden2);
  }
  /**
   * Get option by name.
   * @param name Name of the option. Must be in param-case.
   * @param hidden Include hidden options.
   */
  getOption(name, hidden2) {
    return this.getBaseOption(name, hidden2) ?? this.getGlobalOption(name, hidden2);
  }
  /**
   * Get base option by name.
   * @param name Name of the option. Must be in param-case.
   * @param hidden Include hidden options.
   */
  getBaseOption(name, hidden2) {
    const option = this.options.find(
      (option2) => option2.name === name || option2.aliases?.includes(name)
    );
    return option && (hidden2 || !option.hidden) ? option : void 0;
  }
  /**
   * Get global option from parent commands by name.
   * @param name Name of the option. Must be in param-case.
   * @param hidden Include hidden options.
   */
  getGlobalOption(name, hidden2) {
    const helpOption = this.getHelpOption();
    const getGlobalOption = (parent, noGlobals) => {
      const option = parent.getBaseOption(
        name,
        hidden2
      );
      if (!option?.global) {
        return parent._parent && getGlobalOption(
          parent._parent,
          noGlobals || parent._noGlobals
        );
      }
      if (noGlobals && option !== helpOption) {
        return;
      }
      return option;
    };
    return this._parent && getGlobalOption(
      this._parent,
      this._noGlobals
    );
  }
  /**
   * Remove option by name.
   * @param name Name of the option. Must be in param-case.
   */
  removeOption(name) {
    const index = this.options.findIndex((option) => option.name === name);
    if (index === -1) {
      return;
    }
    return this.options.splice(index, 1)[0];
  }
  /**
   * Checks whether the command has sub-commands or not.
   * @param hidden Include hidden commands.
   */
  hasCommands(hidden2) {
    return this.getCommands(hidden2).length > 0;
  }
  /**
   * Get commands.
   * @param hidden Include hidden commands.
   */
  getCommands(hidden2) {
    return this.getGlobalCommands(hidden2).concat(this.getBaseCommands(hidden2));
  }
  /**
   * Get base commands.
   * @param hidden Include hidden commands.
   */
  getBaseCommands(hidden2) {
    const commands = Array.from(this.commands.values());
    return hidden2 ? commands : commands.filter((cmd) => !cmd.isHidden);
  }
  /**
   * Get global commands.
   * @param hidden Include hidden commands.
   */
  getGlobalCommands(hidden2) {
    const getCommands = (command, noGlobals, commands = [], names = []) => {
      if (command.commands.size) {
        for (const [_, cmd] of command.commands) {
          if (cmd.isGlobal && this !== cmd && !this.commands.has(cmd._name) && names.indexOf(cmd._name) === -1 && (hidden2 || !cmd.isHidden)) {
            if (noGlobals && cmd?.getName() !== "help") {
              continue;
            }
            names.push(cmd._name);
            commands.push(cmd);
          }
        }
      }
      return command._parent ? getCommands(
        command._parent,
        noGlobals || command._noGlobals,
        commands,
        names
      ) : commands;
    };
    return this._parent ? getCommands(this._parent, this._noGlobals) : [];
  }
  /**
   * Checks whether a child command exists by given name or alias.
   * @param name Name or alias of the command.
   * @param hidden Include hidden commands.
   */
  hasCommand(name, hidden2) {
    return !!this.getCommand(name, hidden2);
  }
  /**
   * Get command by name or alias.
   * @param name Name or alias of the command.
   * @param hidden Include hidden commands.
   */
  getCommand(name, hidden2) {
    return this.getBaseCommand(name, hidden2) ?? this.getGlobalCommand(name, hidden2);
  }
  /**
   * Get base command by name or alias.
   * @param name Name or alias of the command.
   * @param hidden Include hidden commands.
   */
  getBaseCommand(name, hidden2) {
    for (const cmd of this.commands.values()) {
      if (cmd._name === name || cmd.aliases.includes(name)) {
        return cmd && (hidden2 || !cmd.isHidden) ? cmd : void 0;
      }
    }
  }
  /**
   * Get global command by name or alias.
   * @param name Name or alias of the command.
   * @param hidden Include hidden commands.
   */
  getGlobalCommand(name, hidden2) {
    const getGlobalCommand = (parent, noGlobals) => {
      const cmd = parent.getBaseCommand(name, hidden2);
      if (!cmd?.isGlobal) {
        return parent._parent && getGlobalCommand(parent._parent, noGlobals || parent._noGlobals);
      }
      if (noGlobals && cmd.getName() !== "help") {
        return;
      }
      return cmd;
    };
    return this._parent && getGlobalCommand(this._parent, this._noGlobals);
  }
  /**
   * Remove sub-command by name or alias.
   * @param name Name or alias of the command.
   */
  removeCommand(name) {
    const command = this.getBaseCommand(name, true);
    if (command) {
      this.commands.delete(command._name);
    }
    return command;
  }
  /** Get types. */
  getTypes() {
    return this.getGlobalTypes().concat(this.getBaseTypes());
  }
  /** Get base types. */
  getBaseTypes() {
    return Array.from(this.types.values());
  }
  /** Get global types. */
  getGlobalTypes() {
    const getTypes = (cmd, types = [], names = []) => {
      if (cmd) {
        if (cmd.types.size) {
          cmd.types.forEach((type) => {
            if (type.global && !this.types.has(type.name) && names.indexOf(type.name) === -1) {
              names.push(type.name);
              types.push(type);
            }
          });
        }
        return getTypes(cmd._parent, types, names);
      }
      return types;
    };
    return getTypes(this._parent);
  }
  /**
   * Get type by name.
   * @param name Name of the type.
   */
  getType(name) {
    return this.getBaseType(name) ?? this.getGlobalType(name);
  }
  /**
   * Get base type by name.
   * @param name Name of the type.
   */
  getBaseType(name) {
    return this.types.get(name);
  }
  /**
   * Get global type by name.
   * @param name Name of the type.
   */
  getGlobalType(name) {
    if (!this._parent) {
      return;
    }
    const cmd = this._parent.getBaseType(name);
    if (!cmd?.global) {
      return this._parent.getGlobalType(name);
    }
    return cmd;
  }
  /** Get completions. */
  getCompletions() {
    return this.getGlobalCompletions().concat(this.getBaseCompletions());
  }
  /** Get base completions. */
  getBaseCompletions() {
    return Array.from(this.completions.values());
  }
  /** Get global completions. */
  getGlobalCompletions() {
    const getCompletions = (cmd, completions = [], names = []) => {
      if (cmd) {
        if (cmd.completions.size) {
          cmd.completions.forEach((completion) => {
            if (completion.global && !this.completions.has(completion.name) && names.indexOf(completion.name) === -1) {
              names.push(completion.name);
              completions.push(completion);
            }
          });
        }
        return getCompletions(cmd._parent, completions, names);
      }
      return completions;
    };
    return getCompletions(this._parent);
  }
  /**
   * Get completion by name.
   * @param name Name of the completion.
   */
  getCompletion(name) {
    return this.getBaseCompletion(name) ?? this.getGlobalCompletion(name);
  }
  /**
   * Get base completion by name.
   * @param name Name of the completion.
   */
  getBaseCompletion(name) {
    return this.completions.get(name);
  }
  /**
   * Get global completions by name.
   * @param name Name of the completion.
   */
  getGlobalCompletion(name) {
    if (!this._parent) {
      return;
    }
    const completion = this._parent.getBaseCompletion(
      name
    );
    if (!completion?.global) {
      return this._parent.getGlobalCompletion(name);
    }
    return completion;
  }
  /**
   * Checks whether the command has environment variables or not.
   * @param hidden Include hidden environment variable.
   */
  hasEnvVars(hidden2) {
    return this.getEnvVars(hidden2).length > 0;
  }
  /**
   * Get environment variables.
   * @param hidden Include hidden environment variable.
   */
  getEnvVars(hidden2) {
    return this.getGlobalEnvVars(hidden2).concat(this.getBaseEnvVars(hidden2));
  }
  /**
   * Get base environment variables.
   * @param hidden Include hidden environment variable.
   */
  getBaseEnvVars(hidden2) {
    if (!this.envVars.length) {
      return [];
    }
    return hidden2 ? this.envVars.slice(0) : this.envVars.filter((env) => !env.hidden);
  }
  /**
   * Get global environment variables.
   * @param hidden Include hidden environment variable.
   */
  getGlobalEnvVars(hidden2) {
    if (this._noGlobals) {
      return [];
    }
    const getEnvVars = (cmd, envVars = [], names = []) => {
      if (cmd) {
        if (cmd.envVars.length) {
          cmd.envVars.forEach((envVar) => {
            if (envVar.global && !this.envVars.find((env) => env.names[0] === envVar.names[0]) && names.indexOf(envVar.names[0]) === -1 && (hidden2 || !envVar.hidden)) {
              names.push(envVar.names[0]);
              envVars.push(envVar);
            }
          });
        }
        return getEnvVars(cmd._parent, envVars, names);
      }
      return envVars;
    };
    return getEnvVars(this._parent);
  }
  /**
   * Checks whether the command has an environment variable with given name or not.
   * @param name Name of the environment variable.
   * @param hidden Include hidden environment variable.
   */
  hasEnvVar(name, hidden2) {
    return !!this.getEnvVar(name, hidden2);
  }
  /**
   * Get environment variable by name.
   * @param name Name of the environment variable.
   * @param hidden Include hidden environment variable.
   */
  getEnvVar(name, hidden2) {
    return this.getBaseEnvVar(name, hidden2) ?? this.getGlobalEnvVar(name, hidden2);
  }
  /**
   * Get base environment variable by name.
   * @param name Name of the environment variable.
   * @param hidden Include hidden environment variable.
   */
  getBaseEnvVar(name, hidden2) {
    const envVar = this.envVars.find(
      (env) => env.names.indexOf(name) !== -1
    );
    return envVar && (hidden2 || !envVar.hidden) ? envVar : void 0;
  }
  /**
   * Get global environment variable by name.
   * @param name Name of the environment variable.
   * @param hidden Include hidden environment variable.
   */
  getGlobalEnvVar(name, hidden2) {
    if (!this._parent || this._noGlobals) {
      return;
    }
    const envVar = this._parent.getBaseEnvVar(
      name,
      hidden2
    );
    if (!envVar?.global) {
      return this._parent.getGlobalEnvVar(name, hidden2);
    }
    return envVar;
  }
  /** Checks whether the command has examples or not. */
  hasExamples() {
    return this.examples.length > 0;
  }
  /** Get all examples. */
  getExamples() {
    return this.examples;
  }
  /** Checks whether the command has an example with given name or not. */
  hasExample(name) {
    return !!this.getExample(name);
  }
  /** Get example with given name. */
  getExample(name) {
    return this.examples.find((example) => example.name === name);
  }
  getHelpOption() {
    return this._helpOption ?? this._parent?.getHelpOption();
  }
};
function isUpgradeCommand(command) {
  return command instanceof Command && "getLatestVersion" in command;
}

// http-url:https://deno.land/x/cliffy@v0.25.7/command/types/enum.ts
var EnumType = class extends Type {
  constructor(values) {
    super();
    this.allowedValues = Array.isArray(values) ? values : Object.values(values);
  }
  parse(type) {
    for (const value of this.allowedValues) {
      if (value.toString() === type.value) {
        return value;
      }
    }
    throw new InvalidTypeError(type, this.allowedValues.slice());
  }
  values() {
    return this.allowedValues.slice();
  }
  complete() {
    return this.values();
  }
};

// src/setup/options.ts
async function parseOptions(argumentOverride = Deno.args) {
  const { args, options } = await new Command().name("bids-validator").type("debugLevel", new EnumType(LogLevelNames)).description(
    "This tool checks if a dataset in a given directory is compatible with the Brain Imaging Data Structure specification. To learn more about Brain Imaging Data Structure visit http://bids.neuroimaging.io"
  ).arguments("<dataset_directory>").version("alpha").option("--json", "Output machine readable JSON").option(
    "-s, --schema <type:string>",
    "Specify a schema version to use for validation",
    {
      default: "latest"
    }
  ).option("-v, --verbose", "Log more extensive information about issues").option(
    "--ignoreNiftiHeaders",
    "Disregard NIfTI header content during validation"
  ).option("--debug <type:debugLevel>", "Enable debug output", {
    default: "ERROR"
  }).option(
    "--filenameMode",
    "Enable filename checks for newline separated filenames read from stdin"
  ).parse(argumentOverride);
  return {
    datasetPath: args[0],
    ...options,
    debug: options.debug
  };
}

// http-url:https://deno.land/std@0.177.0/_util/os.ts
var osType = (() => {
  const { Deno: Deno4 } = globalThis;
  if (typeof Deno4?.build?.os === "string") {
    return Deno4.build.os;
  }
  const { navigator } = globalThis;
  if (navigator?.appVersion?.includes?.("Win")) {
    return "windows";
  }
  return "linux";
})();
var isWindows = osType === "windows";

// http-url:https://deno.land/std@0.177.0/path/win32.ts
var win32_exports = {};
__export(win32_exports, {
  basename: () => basename,
  delimiter: () => delimiter,
  dirname: () => dirname,
  extname: () => extname,
  format: () => format,
  fromFileUrl: () => fromFileUrl,
  isAbsolute: () => isAbsolute,
  join: () => join,
  normalize: () => normalize,
  parse: () => parse,
  relative: () => relative,
  resolve: () => resolve,
  sep: () => sep,
  toFileUrl: () => toFileUrl,
  toNamespacedPath: () => toNamespacedPath
});

// http-url:https://deno.land/std@0.177.0/path/_constants.ts
var CHAR_UPPERCASE_A = 65;
var CHAR_LOWERCASE_A = 97;
var CHAR_UPPERCASE_Z = 90;
var CHAR_LOWERCASE_Z = 122;
var CHAR_DOT = 46;
var CHAR_FORWARD_SLASH = 47;
var CHAR_BACKWARD_SLASH = 92;
var CHAR_COLON = 58;
var CHAR_QUESTION_MARK = 63;

// http-url:https://deno.land/std@0.177.0/path/_util.ts
function assertPath(path3) {
  if (typeof path3 !== "string") {
    throw new TypeError(
      `Path must be a string. Received ${JSON.stringify(path3)}`
    );
  }
}
function isPosixPathSeparator(code3) {
  return code3 === CHAR_FORWARD_SLASH;
}
function isPathSeparator(code3) {
  return isPosixPathSeparator(code3) || code3 === CHAR_BACKWARD_SLASH;
}
function isWindowsDeviceRoot(code3) {
  return code3 >= CHAR_LOWERCASE_A && code3 <= CHAR_LOWERCASE_Z || code3 >= CHAR_UPPERCASE_A && code3 <= CHAR_UPPERCASE_Z;
}
function normalizeString(path3, allowAboveRoot, separator, isPathSeparator2) {
  let res = "";
  let lastSegmentLength = 0;
  let lastSlash = -1;
  let dots = 0;
  let code3;
  for (let i = 0, len = path3.length; i <= len; ++i) {
    if (i < len)
      code3 = path3.charCodeAt(i);
    else if (isPathSeparator2(code3))
      break;
    else
      code3 = CHAR_FORWARD_SLASH;
    if (isPathSeparator2(code3)) {
      if (lastSlash === i - 1 || dots === 1) {
      } else if (lastSlash !== i - 1 && dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== CHAR_DOT || res.charCodeAt(res.length - 2) !== CHAR_DOT) {
          if (res.length > 2) {
            const lastSlashIndex = res.lastIndexOf(separator);
            if (lastSlashIndex === -1) {
              res = "";
              lastSegmentLength = 0;
            } else {
              res = res.slice(0, lastSlashIndex);
              lastSegmentLength = res.length - 1 - res.lastIndexOf(separator);
            }
            lastSlash = i;
            dots = 0;
            continue;
          } else if (res.length === 2 || res.length === 1) {
            res = "";
            lastSegmentLength = 0;
            lastSlash = i;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          if (res.length > 0)
            res += `${separator}..`;
          else
            res = "..";
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0)
          res += separator + path3.slice(lastSlash + 1, i);
        else
          res = path3.slice(lastSlash + 1, i);
        lastSegmentLength = i - lastSlash - 1;
      }
      lastSlash = i;
      dots = 0;
    } else if (code3 === CHAR_DOT && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}
function _format(sep4, pathObject) {
  const dir = pathObject.dir || pathObject.root;
  const base = pathObject.base || (pathObject.name || "") + (pathObject.ext || "");
  if (!dir)
    return base;
  if (base === sep4)
    return dir;
  if (dir === pathObject.root)
    return dir + base;
  return dir + sep4 + base;
}
var WHITESPACE_ENCODINGS = {
  "	": "%09",
  "\n": "%0A",
  "\v": "%0B",
  "\f": "%0C",
  "\r": "%0D",
  " ": "%20"
};
function encodeWhitespace(string2) {
  return string2.replaceAll(/[\s]/g, (c) => {
    return WHITESPACE_ENCODINGS[c] ?? c;
  });
}
function lastPathSegment(path3, isSep, start = 0) {
  let matchedNonSeparator = false;
  let end = path3.length;
  for (let i = path3.length - 1; i >= start; --i) {
    if (isSep(path3.charCodeAt(i))) {
      if (matchedNonSeparator) {
        start = i + 1;
        break;
      }
    } else if (!matchedNonSeparator) {
      matchedNonSeparator = true;
      end = i + 1;
    }
  }
  return path3.slice(start, end);
}
function stripTrailingSeparators(segment, isSep) {
  if (segment.length <= 1) {
    return segment;
  }
  let end = segment.length;
  for (let i = segment.length - 1; i > 0; i--) {
    if (isSep(segment.charCodeAt(i))) {
      end = i;
    } else {
      break;
    }
  }
  return segment.slice(0, end);
}
function stripSuffix(name, suffix) {
  if (suffix.length >= name.length) {
    return name;
  }
  const lenDiff = name.length - suffix.length;
  for (let i = suffix.length - 1; i >= 0; --i) {
    if (name.charCodeAt(lenDiff + i) !== suffix.charCodeAt(i)) {
      return name;
    }
  }
  return name.slice(0, -suffix.length);
}

// http-url:https://deno.land/std@0.177.0/path/win32.ts
var sep = "\\";
var delimiter = ";";
function resolve(...pathSegments) {
  let resolvedDevice = "";
  let resolvedTail = "";
  let resolvedAbsolute = false;
  for (let i = pathSegments.length - 1; i >= -1; i--) {
    let path3;
    const { Deno: Deno4 } = globalThis;
    if (i >= 0) {
      path3 = pathSegments[i];
    } else if (!resolvedDevice) {
      if (typeof Deno4?.cwd !== "function") {
        throw new TypeError("Resolved a drive-letter-less path without a CWD.");
      }
      path3 = Deno4.cwd();
    } else {
      if (typeof Deno4?.env?.get !== "function" || typeof Deno4?.cwd !== "function") {
        throw new TypeError("Resolved a relative path without a CWD.");
      }
      path3 = Deno4.cwd();
      if (path3 === void 0 || path3.slice(0, 3).toLowerCase() !== `${resolvedDevice.toLowerCase()}\\`) {
        path3 = `${resolvedDevice}\\`;
      }
    }
    assertPath(path3);
    const len = path3.length;
    if (len === 0)
      continue;
    let rootEnd = 0;
    let device = "";
    let isAbsolute4 = false;
    const code3 = path3.charCodeAt(0);
    if (len > 1) {
      if (isPathSeparator(code3)) {
        isAbsolute4 = true;
        if (isPathSeparator(path3.charCodeAt(1))) {
          let j = 2;
          let last = j;
          for (; j < len; ++j) {
            if (isPathSeparator(path3.charCodeAt(j)))
              break;
          }
          if (j < len && j !== last) {
            const firstPart = path3.slice(last, j);
            last = j;
            for (; j < len; ++j) {
              if (!isPathSeparator(path3.charCodeAt(j)))
                break;
            }
            if (j < len && j !== last) {
              last = j;
              for (; j < len; ++j) {
                if (isPathSeparator(path3.charCodeAt(j)))
                  break;
              }
              if (j === len) {
                device = `\\\\${firstPart}\\${path3.slice(last)}`;
                rootEnd = j;
              } else if (j !== last) {
                device = `\\\\${firstPart}\\${path3.slice(last, j)}`;
                rootEnd = j;
              }
            }
          }
        } else {
          rootEnd = 1;
        }
      } else if (isWindowsDeviceRoot(code3)) {
        if (path3.charCodeAt(1) === CHAR_COLON) {
          device = path3.slice(0, 2);
          rootEnd = 2;
          if (len > 2) {
            if (isPathSeparator(path3.charCodeAt(2))) {
              isAbsolute4 = true;
              rootEnd = 3;
            }
          }
        }
      }
    } else if (isPathSeparator(code3)) {
      rootEnd = 1;
      isAbsolute4 = true;
    }
    if (device.length > 0 && resolvedDevice.length > 0 && device.toLowerCase() !== resolvedDevice.toLowerCase()) {
      continue;
    }
    if (resolvedDevice.length === 0 && device.length > 0) {
      resolvedDevice = device;
    }
    if (!resolvedAbsolute) {
      resolvedTail = `${path3.slice(rootEnd)}\\${resolvedTail}`;
      resolvedAbsolute = isAbsolute4;
    }
    if (resolvedAbsolute && resolvedDevice.length > 0)
      break;
  }
  resolvedTail = normalizeString(
    resolvedTail,
    !resolvedAbsolute,
    "\\",
    isPathSeparator
  );
  return resolvedDevice + (resolvedAbsolute ? "\\" : "") + resolvedTail || ".";
}
function normalize(path3) {
  assertPath(path3);
  const len = path3.length;
  if (len === 0)
    return ".";
  let rootEnd = 0;
  let device;
  let isAbsolute4 = false;
  const code3 = path3.charCodeAt(0);
  if (len > 1) {
    if (isPathSeparator(code3)) {
      isAbsolute4 = true;
      if (isPathSeparator(path3.charCodeAt(1))) {
        let j = 2;
        let last = j;
        for (; j < len; ++j) {
          if (isPathSeparator(path3.charCodeAt(j)))
            break;
        }
        if (j < len && j !== last) {
          const firstPart = path3.slice(last, j);
          last = j;
          for (; j < len; ++j) {
            if (!isPathSeparator(path3.charCodeAt(j)))
              break;
          }
          if (j < len && j !== last) {
            last = j;
            for (; j < len; ++j) {
              if (isPathSeparator(path3.charCodeAt(j)))
                break;
            }
            if (j === len) {
              return `\\\\${firstPart}\\${path3.slice(last)}\\`;
            } else if (j !== last) {
              device = `\\\\${firstPart}\\${path3.slice(last, j)}`;
              rootEnd = j;
            }
          }
        }
      } else {
        rootEnd = 1;
      }
    } else if (isWindowsDeviceRoot(code3)) {
      if (path3.charCodeAt(1) === CHAR_COLON) {
        device = path3.slice(0, 2);
        rootEnd = 2;
        if (len > 2) {
          if (isPathSeparator(path3.charCodeAt(2))) {
            isAbsolute4 = true;
            rootEnd = 3;
          }
        }
      }
    }
  } else if (isPathSeparator(code3)) {
    return "\\";
  }
  let tail;
  if (rootEnd < len) {
    tail = normalizeString(
      path3.slice(rootEnd),
      !isAbsolute4,
      "\\",
      isPathSeparator
    );
  } else {
    tail = "";
  }
  if (tail.length === 0 && !isAbsolute4)
    tail = ".";
  if (tail.length > 0 && isPathSeparator(path3.charCodeAt(len - 1))) {
    tail += "\\";
  }
  if (device === void 0) {
    if (isAbsolute4) {
      if (tail.length > 0)
        return `\\${tail}`;
      else
        return "\\";
    } else if (tail.length > 0) {
      return tail;
    } else {
      return "";
    }
  } else if (isAbsolute4) {
    if (tail.length > 0)
      return `${device}\\${tail}`;
    else
      return `${device}\\`;
  } else if (tail.length > 0) {
    return device + tail;
  } else {
    return device;
  }
}
function isAbsolute(path3) {
  assertPath(path3);
  const len = path3.length;
  if (len === 0)
    return false;
  const code3 = path3.charCodeAt(0);
  if (isPathSeparator(code3)) {
    return true;
  } else if (isWindowsDeviceRoot(code3)) {
    if (len > 2 && path3.charCodeAt(1) === CHAR_COLON) {
      if (isPathSeparator(path3.charCodeAt(2)))
        return true;
    }
  }
  return false;
}
function join(...paths) {
  const pathsCount = paths.length;
  if (pathsCount === 0)
    return ".";
  let joined;
  let firstPart = null;
  for (let i = 0; i < pathsCount; ++i) {
    const path3 = paths[i];
    assertPath(path3);
    if (path3.length > 0) {
      if (joined === void 0)
        joined = firstPart = path3;
      else
        joined += `\\${path3}`;
    }
  }
  if (joined === void 0)
    return ".";
  let needsReplace = true;
  let slashCount = 0;
  assert(firstPart != null);
  if (isPathSeparator(firstPart.charCodeAt(0))) {
    ++slashCount;
    const firstLen = firstPart.length;
    if (firstLen > 1) {
      if (isPathSeparator(firstPart.charCodeAt(1))) {
        ++slashCount;
        if (firstLen > 2) {
          if (isPathSeparator(firstPart.charCodeAt(2)))
            ++slashCount;
          else {
            needsReplace = false;
          }
        }
      }
    }
  }
  if (needsReplace) {
    for (; slashCount < joined.length; ++slashCount) {
      if (!isPathSeparator(joined.charCodeAt(slashCount)))
        break;
    }
    if (slashCount >= 2)
      joined = `\\${joined.slice(slashCount)}`;
  }
  return normalize(joined);
}
function relative(from, to) {
  assertPath(from);
  assertPath(to);
  if (from === to)
    return "";
  const fromOrig = resolve(from);
  const toOrig = resolve(to);
  if (fromOrig === toOrig)
    return "";
  from = fromOrig.toLowerCase();
  to = toOrig.toLowerCase();
  if (from === to)
    return "";
  let fromStart = 0;
  let fromEnd = from.length;
  for (; fromStart < fromEnd; ++fromStart) {
    if (from.charCodeAt(fromStart) !== CHAR_BACKWARD_SLASH)
      break;
  }
  for (; fromEnd - 1 > fromStart; --fromEnd) {
    if (from.charCodeAt(fromEnd - 1) !== CHAR_BACKWARD_SLASH)
      break;
  }
  const fromLen = fromEnd - fromStart;
  let toStart = 0;
  let toEnd = to.length;
  for (; toStart < toEnd; ++toStart) {
    if (to.charCodeAt(toStart) !== CHAR_BACKWARD_SLASH)
      break;
  }
  for (; toEnd - 1 > toStart; --toEnd) {
    if (to.charCodeAt(toEnd - 1) !== CHAR_BACKWARD_SLASH)
      break;
  }
  const toLen = toEnd - toStart;
  const length = fromLen < toLen ? fromLen : toLen;
  let lastCommonSep = -1;
  let i = 0;
  for (; i <= length; ++i) {
    if (i === length) {
      if (toLen > length) {
        if (to.charCodeAt(toStart + i) === CHAR_BACKWARD_SLASH) {
          return toOrig.slice(toStart + i + 1);
        } else if (i === 2) {
          return toOrig.slice(toStart + i);
        }
      }
      if (fromLen > length) {
        if (from.charCodeAt(fromStart + i) === CHAR_BACKWARD_SLASH) {
          lastCommonSep = i;
        } else if (i === 2) {
          lastCommonSep = 3;
        }
      }
      break;
    }
    const fromCode = from.charCodeAt(fromStart + i);
    const toCode = to.charCodeAt(toStart + i);
    if (fromCode !== toCode)
      break;
    else if (fromCode === CHAR_BACKWARD_SLASH)
      lastCommonSep = i;
  }
  if (i !== length && lastCommonSep === -1) {
    return toOrig;
  }
  let out = "";
  if (lastCommonSep === -1)
    lastCommonSep = 0;
  for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
    if (i === fromEnd || from.charCodeAt(i) === CHAR_BACKWARD_SLASH) {
      if (out.length === 0)
        out += "..";
      else
        out += "\\..";
    }
  }
  if (out.length > 0) {
    return out + toOrig.slice(toStart + lastCommonSep, toEnd);
  } else {
    toStart += lastCommonSep;
    if (toOrig.charCodeAt(toStart) === CHAR_BACKWARD_SLASH)
      ++toStart;
    return toOrig.slice(toStart, toEnd);
  }
}
function toNamespacedPath(path3) {
  if (typeof path3 !== "string")
    return path3;
  if (path3.length === 0)
    return "";
  const resolvedPath = resolve(path3);
  if (resolvedPath.length >= 3) {
    if (resolvedPath.charCodeAt(0) === CHAR_BACKWARD_SLASH) {
      if (resolvedPath.charCodeAt(1) === CHAR_BACKWARD_SLASH) {
        const code3 = resolvedPath.charCodeAt(2);
        if (code3 !== CHAR_QUESTION_MARK && code3 !== CHAR_DOT) {
          return `\\\\?\\UNC\\${resolvedPath.slice(2)}`;
        }
      }
    } else if (isWindowsDeviceRoot(resolvedPath.charCodeAt(0))) {
      if (resolvedPath.charCodeAt(1) === CHAR_COLON && resolvedPath.charCodeAt(2) === CHAR_BACKWARD_SLASH) {
        return `\\\\?\\${resolvedPath}`;
      }
    }
  }
  return path3;
}
function dirname(path3) {
  assertPath(path3);
  const len = path3.length;
  if (len === 0)
    return ".";
  let rootEnd = -1;
  let end = -1;
  let matchedSlash = true;
  let offset = 0;
  const code3 = path3.charCodeAt(0);
  if (len > 1) {
    if (isPathSeparator(code3)) {
      rootEnd = offset = 1;
      if (isPathSeparator(path3.charCodeAt(1))) {
        let j = 2;
        let last = j;
        for (; j < len; ++j) {
          if (isPathSeparator(path3.charCodeAt(j)))
            break;
        }
        if (j < len && j !== last) {
          last = j;
          for (; j < len; ++j) {
            if (!isPathSeparator(path3.charCodeAt(j)))
              break;
          }
          if (j < len && j !== last) {
            last = j;
            for (; j < len; ++j) {
              if (isPathSeparator(path3.charCodeAt(j)))
                break;
            }
            if (j === len) {
              return path3;
            }
            if (j !== last) {
              rootEnd = offset = j + 1;
            }
          }
        }
      }
    } else if (isWindowsDeviceRoot(code3)) {
      if (path3.charCodeAt(1) === CHAR_COLON) {
        rootEnd = offset = 2;
        if (len > 2) {
          if (isPathSeparator(path3.charCodeAt(2)))
            rootEnd = offset = 3;
        }
      }
    }
  } else if (isPathSeparator(code3)) {
    return path3;
  }
  for (let i = len - 1; i >= offset; --i) {
    if (isPathSeparator(path3.charCodeAt(i))) {
      if (!matchedSlash) {
        end = i;
        break;
      }
    } else {
      matchedSlash = false;
    }
  }
  if (end === -1) {
    if (rootEnd === -1)
      return ".";
    else
      end = rootEnd;
  }
  return stripTrailingSeparators(path3.slice(0, end), isPosixPathSeparator);
}
function basename(path3, suffix = "") {
  assertPath(path3);
  if (path3.length === 0)
    return path3;
  if (typeof suffix !== "string") {
    throw new TypeError(
      `Suffix must be a string. Received ${JSON.stringify(suffix)}`
    );
  }
  let start = 0;
  if (path3.length >= 2) {
    const drive = path3.charCodeAt(0);
    if (isWindowsDeviceRoot(drive)) {
      if (path3.charCodeAt(1) === CHAR_COLON)
        start = 2;
    }
  }
  const lastSegment = lastPathSegment(path3, isPathSeparator, start);
  const strippedSegment = stripTrailingSeparators(lastSegment, isPathSeparator);
  return suffix ? stripSuffix(strippedSegment, suffix) : strippedSegment;
}
function extname(path3) {
  assertPath(path3);
  let start = 0;
  let startDot = -1;
  let startPart = 0;
  let end = -1;
  let matchedSlash = true;
  let preDotState = 0;
  if (path3.length >= 2 && path3.charCodeAt(1) === CHAR_COLON && isWindowsDeviceRoot(path3.charCodeAt(0))) {
    start = startPart = 2;
  }
  for (let i = path3.length - 1; i >= start; --i) {
    const code3 = path3.charCodeAt(i);
    if (isPathSeparator(code3)) {
      if (!matchedSlash) {
        startPart = i + 1;
        break;
      }
      continue;
    }
    if (end === -1) {
      matchedSlash = false;
      end = i + 1;
    }
    if (code3 === CHAR_DOT) {
      if (startDot === -1)
        startDot = i;
      else if (preDotState !== 1)
        preDotState = 1;
    } else if (startDot !== -1) {
      preDotState = -1;
    }
  }
  if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
  preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
  preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    return "";
  }
  return path3.slice(startDot, end);
}
function format(pathObject) {
  if (pathObject === null || typeof pathObject !== "object") {
    throw new TypeError(
      `The "pathObject" argument must be of type Object. Received type ${typeof pathObject}`
    );
  }
  return _format("\\", pathObject);
}
function parse(path3) {
  assertPath(path3);
  const ret = { root: "", dir: "", base: "", ext: "", name: "" };
  const len = path3.length;
  if (len === 0)
    return ret;
  let rootEnd = 0;
  let code3 = path3.charCodeAt(0);
  if (len > 1) {
    if (isPathSeparator(code3)) {
      rootEnd = 1;
      if (isPathSeparator(path3.charCodeAt(1))) {
        let j = 2;
        let last = j;
        for (; j < len; ++j) {
          if (isPathSeparator(path3.charCodeAt(j)))
            break;
        }
        if (j < len && j !== last) {
          last = j;
          for (; j < len; ++j) {
            if (!isPathSeparator(path3.charCodeAt(j)))
              break;
          }
          if (j < len && j !== last) {
            last = j;
            for (; j < len; ++j) {
              if (isPathSeparator(path3.charCodeAt(j)))
                break;
            }
            if (j === len) {
              rootEnd = j;
            } else if (j !== last) {
              rootEnd = j + 1;
            }
          }
        }
      }
    } else if (isWindowsDeviceRoot(code3)) {
      if (path3.charCodeAt(1) === CHAR_COLON) {
        rootEnd = 2;
        if (len > 2) {
          if (isPathSeparator(path3.charCodeAt(2))) {
            if (len === 3) {
              ret.root = ret.dir = path3;
              ret.base = "\\";
              return ret;
            }
            rootEnd = 3;
          }
        } else {
          ret.root = ret.dir = path3;
          return ret;
        }
      }
    }
  } else if (isPathSeparator(code3)) {
    ret.root = ret.dir = path3;
    ret.base = "\\";
    return ret;
  }
  if (rootEnd > 0)
    ret.root = path3.slice(0, rootEnd);
  let startDot = -1;
  let startPart = rootEnd;
  let end = -1;
  let matchedSlash = true;
  let i = path3.length - 1;
  let preDotState = 0;
  for (; i >= rootEnd; --i) {
    code3 = path3.charCodeAt(i);
    if (isPathSeparator(code3)) {
      if (!matchedSlash) {
        startPart = i + 1;
        break;
      }
      continue;
    }
    if (end === -1) {
      matchedSlash = false;
      end = i + 1;
    }
    if (code3 === CHAR_DOT) {
      if (startDot === -1)
        startDot = i;
      else if (preDotState !== 1)
        preDotState = 1;
    } else if (startDot !== -1) {
      preDotState = -1;
    }
  }
  if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
  preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
  preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    if (end !== -1) {
      ret.base = ret.name = path3.slice(startPart, end);
    }
  } else {
    ret.name = path3.slice(startPart, startDot);
    ret.base = path3.slice(startPart, end);
    ret.ext = path3.slice(startDot, end);
  }
  ret.base = ret.base || "\\";
  if (startPart > 0 && startPart !== rootEnd) {
    ret.dir = path3.slice(0, startPart - 1);
  } else
    ret.dir = ret.root;
  return ret;
}
function fromFileUrl(url) {
  url = url instanceof URL ? url : new URL(url);
  if (url.protocol != "file:") {
    throw new TypeError("Must be a file URL.");
  }
  let path3 = decodeURIComponent(
    url.pathname.replace(/\//g, "\\").replace(/%(?![0-9A-Fa-f]{2})/g, "%25")
  ).replace(/^\\*([A-Za-z]:)(\\|$)/, "$1\\");
  if (url.hostname != "") {
    path3 = `\\\\${url.hostname}${path3}`;
  }
  return path3;
}
function toFileUrl(path3) {
  if (!isAbsolute(path3)) {
    throw new TypeError("Must be an absolute path.");
  }
  const [, hostname, pathname] = path3.match(
    /^(?:[/\\]{2}([^/\\]+)(?=[/\\](?:[^/\\]|$)))?(.*)/
  );
  const url = new URL("file:///");
  url.pathname = encodeWhitespace(pathname.replace(/%/g, "%25"));
  if (hostname != null && hostname != "localhost") {
    url.hostname = hostname;
    if (!url.hostname) {
      throw new TypeError("Invalid hostname.");
    }
  }
  return url;
}

// http-url:https://deno.land/std@0.177.0/path/posix.ts
var posix_exports = {};
__export(posix_exports, {
  basename: () => basename2,
  delimiter: () => delimiter2,
  dirname: () => dirname2,
  extname: () => extname2,
  format: () => format2,
  fromFileUrl: () => fromFileUrl2,
  isAbsolute: () => isAbsolute2,
  join: () => join2,
  normalize: () => normalize2,
  parse: () => parse2,
  relative: () => relative2,
  resolve: () => resolve2,
  sep: () => sep2,
  toFileUrl: () => toFileUrl2,
  toNamespacedPath: () => toNamespacedPath2
});
var sep2 = "/";
var delimiter2 = ":";
function resolve2(...pathSegments) {
  let resolvedPath = "";
  let resolvedAbsolute = false;
  for (let i = pathSegments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    let path3;
    if (i >= 0)
      path3 = pathSegments[i];
    else {
      const { Deno: Deno4 } = globalThis;
      if (typeof Deno4?.cwd !== "function") {
        throw new TypeError("Resolved a relative path without a CWD.");
      }
      path3 = Deno4.cwd();
    }
    assertPath(path3);
    if (path3.length === 0) {
      continue;
    }
    resolvedPath = `${path3}/${resolvedPath}`;
    resolvedAbsolute = isPosixPathSeparator(path3.charCodeAt(0));
  }
  resolvedPath = normalizeString(
    resolvedPath,
    !resolvedAbsolute,
    "/",
    isPosixPathSeparator
  );
  if (resolvedAbsolute) {
    if (resolvedPath.length > 0)
      return `/${resolvedPath}`;
    else
      return "/";
  } else if (resolvedPath.length > 0)
    return resolvedPath;
  else
    return ".";
}
function normalize2(path3) {
  assertPath(path3);
  if (path3.length === 0)
    return ".";
  const isAbsolute4 = isPosixPathSeparator(path3.charCodeAt(0));
  const trailingSeparator = isPosixPathSeparator(
    path3.charCodeAt(path3.length - 1)
  );
  path3 = normalizeString(path3, !isAbsolute4, "/", isPosixPathSeparator);
  if (path3.length === 0 && !isAbsolute4)
    path3 = ".";
  if (path3.length > 0 && trailingSeparator)
    path3 += "/";
  if (isAbsolute4)
    return `/${path3}`;
  return path3;
}
function isAbsolute2(path3) {
  assertPath(path3);
  return path3.length > 0 && isPosixPathSeparator(path3.charCodeAt(0));
}
function join2(...paths) {
  if (paths.length === 0)
    return ".";
  let joined;
  for (let i = 0, len = paths.length; i < len; ++i) {
    const path3 = paths[i];
    assertPath(path3);
    if (path3.length > 0) {
      if (!joined)
        joined = path3;
      else
        joined += `/${path3}`;
    }
  }
  if (!joined)
    return ".";
  return normalize2(joined);
}
function relative2(from, to) {
  assertPath(from);
  assertPath(to);
  if (from === to)
    return "";
  from = resolve2(from);
  to = resolve2(to);
  if (from === to)
    return "";
  let fromStart = 1;
  const fromEnd = from.length;
  for (; fromStart < fromEnd; ++fromStart) {
    if (!isPosixPathSeparator(from.charCodeAt(fromStart)))
      break;
  }
  const fromLen = fromEnd - fromStart;
  let toStart = 1;
  const toEnd = to.length;
  for (; toStart < toEnd; ++toStart) {
    if (!isPosixPathSeparator(to.charCodeAt(toStart)))
      break;
  }
  const toLen = toEnd - toStart;
  const length = fromLen < toLen ? fromLen : toLen;
  let lastCommonSep = -1;
  let i = 0;
  for (; i <= length; ++i) {
    if (i === length) {
      if (toLen > length) {
        if (isPosixPathSeparator(to.charCodeAt(toStart + i))) {
          return to.slice(toStart + i + 1);
        } else if (i === 0) {
          return to.slice(toStart + i);
        }
      } else if (fromLen > length) {
        if (isPosixPathSeparator(from.charCodeAt(fromStart + i))) {
          lastCommonSep = i;
        } else if (i === 0) {
          lastCommonSep = 0;
        }
      }
      break;
    }
    const fromCode = from.charCodeAt(fromStart + i);
    const toCode = to.charCodeAt(toStart + i);
    if (fromCode !== toCode)
      break;
    else if (isPosixPathSeparator(fromCode))
      lastCommonSep = i;
  }
  let out = "";
  for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
    if (i === fromEnd || isPosixPathSeparator(from.charCodeAt(i))) {
      if (out.length === 0)
        out += "..";
      else
        out += "/..";
    }
  }
  if (out.length > 0)
    return out + to.slice(toStart + lastCommonSep);
  else {
    toStart += lastCommonSep;
    if (isPosixPathSeparator(to.charCodeAt(toStart)))
      ++toStart;
    return to.slice(toStart);
  }
}
function toNamespacedPath2(path3) {
  return path3;
}
function dirname2(path3) {
  if (path3.length === 0)
    return ".";
  let end = -1;
  let matchedNonSeparator = false;
  for (let i = path3.length - 1; i >= 1; --i) {
    if (isPosixPathSeparator(path3.charCodeAt(i))) {
      if (matchedNonSeparator) {
        end = i;
        break;
      }
    } else {
      matchedNonSeparator = true;
    }
  }
  if (end === -1) {
    return isPosixPathSeparator(path3.charCodeAt(0)) ? "/" : ".";
  }
  return stripTrailingSeparators(
    path3.slice(0, end),
    isPosixPathSeparator
  );
}
function basename2(path3, suffix = "") {
  assertPath(path3);
  if (path3.length === 0)
    return path3;
  if (typeof suffix !== "string") {
    throw new TypeError(
      `Suffix must be a string. Received ${JSON.stringify(suffix)}`
    );
  }
  const lastSegment = lastPathSegment(path3, isPosixPathSeparator);
  const strippedSegment = stripTrailingSeparators(
    lastSegment,
    isPosixPathSeparator
  );
  return suffix ? stripSuffix(strippedSegment, suffix) : strippedSegment;
}
function extname2(path3) {
  assertPath(path3);
  let startDot = -1;
  let startPart = 0;
  let end = -1;
  let matchedSlash = true;
  let preDotState = 0;
  for (let i = path3.length - 1; i >= 0; --i) {
    const code3 = path3.charCodeAt(i);
    if (isPosixPathSeparator(code3)) {
      if (!matchedSlash) {
        startPart = i + 1;
        break;
      }
      continue;
    }
    if (end === -1) {
      matchedSlash = false;
      end = i + 1;
    }
    if (code3 === CHAR_DOT) {
      if (startDot === -1)
        startDot = i;
      else if (preDotState !== 1)
        preDotState = 1;
    } else if (startDot !== -1) {
      preDotState = -1;
    }
  }
  if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
  preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
  preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    return "";
  }
  return path3.slice(startDot, end);
}
function format2(pathObject) {
  if (pathObject === null || typeof pathObject !== "object") {
    throw new TypeError(
      `The "pathObject" argument must be of type Object. Received type ${typeof pathObject}`
    );
  }
  return _format("/", pathObject);
}
function parse2(path3) {
  assertPath(path3);
  const ret = { root: "", dir: "", base: "", ext: "", name: "" };
  if (path3.length === 0)
    return ret;
  const isAbsolute4 = isPosixPathSeparator(path3.charCodeAt(0));
  let start;
  if (isAbsolute4) {
    ret.root = "/";
    start = 1;
  } else {
    start = 0;
  }
  let startDot = -1;
  let startPart = 0;
  let end = -1;
  let matchedSlash = true;
  let i = path3.length - 1;
  let preDotState = 0;
  for (; i >= start; --i) {
    const code3 = path3.charCodeAt(i);
    if (isPosixPathSeparator(code3)) {
      if (!matchedSlash) {
        startPart = i + 1;
        break;
      }
      continue;
    }
    if (end === -1) {
      matchedSlash = false;
      end = i + 1;
    }
    if (code3 === CHAR_DOT) {
      if (startDot === -1)
        startDot = i;
      else if (preDotState !== 1)
        preDotState = 1;
    } else if (startDot !== -1) {
      preDotState = -1;
    }
  }
  if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
  preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
  preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    if (end !== -1) {
      if (startPart === 0 && isAbsolute4) {
        ret.base = ret.name = path3.slice(1, end);
      } else {
        ret.base = ret.name = path3.slice(startPart, end);
      }
    }
    ret.base = ret.base || "/";
  } else {
    if (startPart === 0 && isAbsolute4) {
      ret.name = path3.slice(1, startDot);
      ret.base = path3.slice(1, end);
    } else {
      ret.name = path3.slice(startPart, startDot);
      ret.base = path3.slice(startPart, end);
    }
    ret.ext = path3.slice(startDot, end);
  }
  if (startPart > 0) {
    ret.dir = stripTrailingSeparators(
      path3.slice(0, startPart - 1),
      isPosixPathSeparator
    );
  } else if (isAbsolute4)
    ret.dir = "/";
  return ret;
}
function fromFileUrl2(url) {
  url = url instanceof URL ? url : new URL(url);
  if (url.protocol != "file:") {
    throw new TypeError("Must be a file URL.");
  }
  return decodeURIComponent(
    url.pathname.replace(/%(?![0-9A-Fa-f]{2})/g, "%25")
  );
}
function toFileUrl2(path3) {
  if (!isAbsolute2(path3)) {
    throw new TypeError("Must be an absolute path.");
  }
  const url = new URL("file:///");
  url.pathname = encodeWhitespace(
    path3.replace(/%/g, "%25").replace(/\\/g, "%5C")
  );
  return url;
}

// http-url:https://deno.land/std@0.177.0/path/separator.ts
var SEP = isWindows ? "\\" : "/";

// http-url:https://deno.land/std@0.177.0/path/glob.ts
var path = isWindows ? win32_exports : posix_exports;
var { join: join3, normalize: normalize3 } = path;

// http-url:https://deno.land/std@0.177.0/path/mod.ts
var path2 = isWindows ? win32_exports : posix_exports;
var {
  basename: basename3,
  delimiter: delimiter3,
  dirname: dirname3,
  extname: extname3,
  format: format3,
  fromFileUrl: fromFileUrl3,
  isAbsolute: isAbsolute3,
  join: join4,
  normalize: normalize4,
  parse: parse3,
  relative: relative3,
  resolve: resolve3,
  sep: sep3,
  toFileUrl: toFileUrl3,
  toNamespacedPath: toNamespacedPath3
} = path2;

// src/types/filetree.ts
var FileTree = class {
  constructor(path3, name, parent) {
    this.path = path3;
    this.files = [];
    this.directories = [];
    this.name = name;
    this.parent = parent;
  }
  contains(parts) {
    if (parts.length === 0) {
      return false;
    } else if (parts.length === 1) {
      return this.files.some((x) => x.name === parts[0]);
    } else if (parts.length > 1) {
      const nextDir = this.directories.find((x) => x.name === parts[0]);
      if (nextDir) {
        return nextDir.contains(parts.slice(1, parts.length));
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
};

// src/setup/requestPermissions.ts
var globalRead = { name: "read" };
async function requestPermission(permission) {
  const status = await Deno.permissions.request(permission);
  if (status.state === "granted") {
    return true;
  } else {
    return false;
  }
}
var requestReadPermission = () => requestPermission(globalRead);

// src/deps/ignore.ts
function makeArray(subject) {
  return Array.isArray(subject) ? subject : [subject];
}
var EMPTY = "";
var SPACE = " ";
var ESCAPE = "\\";
var REGEX_TEST_BLANK_LINE = /^\s+$/;
var REGEX_INVALID_TRAILING_BACKSLASH = /(?:[^\\]|^)\\$/;
var REGEX_REPLACE_LEADING_EXCAPED_EXCLAMATION = /^\\!/;
var REGEX_REPLACE_LEADING_EXCAPED_HASH = /^\\#/;
var REGEX_SPLITALL_CRLF = /\r?\n/g;
var REGEX_TEST_INVALID_PATH = /^\.*\/|^\.+$/;
var SLASH = "/";
var TMP_KEY_IGNORE = "node-ignore";
if (typeof Symbol !== "undefined") {
  TMP_KEY_IGNORE = Symbol.for("node-ignore");
}
var KEY_IGNORE = TMP_KEY_IGNORE;
var define = (object, key, value) => Object.defineProperty(object, key, { value });
var REGEX_REGEXP_RANGE = /([0-z])-([0-z])/g;
var RETURN_FALSE = () => false;
var sanitizeRange = (range) => range.replace(
  REGEX_REGEXP_RANGE,
  (match, from, to) => from.charCodeAt(0) <= to.charCodeAt(0) ? match : (
    // Invalid range (out of order) which is ok for gitignore rules but
    //   fatal for JavaScript regular expression, so eliminate it.
    EMPTY
  )
);
var cleanRangeBackSlash = (slashes) => {
  const { length } = slashes;
  return slashes.slice(0, length - length % 2);
};
var REPLACERS = [
  // > Trailing spaces are ignored unless they are quoted with backslash ("\")
  [
    // (a\ ) -> (a )
    // (a  ) -> (a)
    // (a \ ) -> (a  )
    /\\?\s+$/,
    (match) => match.indexOf("\\") === 0 ? SPACE : EMPTY
  ],
  // replace (\ ) with ' '
  [/\\\s/g, () => SPACE],
  // Escape metacharacters
  // which is written down by users but means special for regular expressions.
  // > There are 12 characters with special meanings:
  // > - the backslash \,
  // > - the caret ^,
  // > - the dollar sign $,
  // > - the period or dot .,
  // > - the vertical bar or pipe symbol |,
  // > - the question mark ?,
  // > - the asterisk or star *,
  // > - the plus sign +,
  // > - the opening parenthesis (,
  // > - the closing parenthesis ),
  // > - and the opening square bracket [,
  // > - the opening curly brace {,
  // > These special characters are often called "metacharacters".
  [/[\\$.|*+(){^]/g, (match) => `\\${match}`],
  [
    // > a question mark (?) matches a single character
    /(?!\\)\?/g,
    () => "[^/]"
  ],
  // leading slash
  [
    // > A leading slash matches the beginning of the pathname.
    // > For example, "/*.c" matches "cat-file.c" but not "mozilla-sha1/sha1.c".
    // A leading slash matches the beginning of the pathname
    /^\//,
    () => "^"
  ],
  // replace special metacharacter slash after the leading slash
  [/\//g, () => "\\/"],
  [
    // > A leading "**" followed by a slash means match in all directories.
    // > For example, "**/foo" matches file or directory "foo" anywhere,
    // > the same as pattern "foo".
    // > "**/foo/bar" matches file or directory "bar" anywhere that is directly
    // >   under directory "foo".
    // Notice that the '*'s have been replaced as '\\*'
    /^\^*\\\*\\\*\\\//,
    // '**/foo' <-> 'foo'
    () => "^(?:.*\\/)?"
  ],
  // starting
  [
    // there will be no leading '/'
    //   (which has been replaced by section "leading slash")
    // If starts with '**', adding a '^' to the regular expression also works
    /^(?=[^^])/,
    function startingReplacer() {
      return !/\/(?!$)/.test(this) ? (
        // > Prior to 2.22.1
        // > If the pattern does not contain a slash /,
        // >   Git treats it as a shell glob pattern
        // Actually, if there is only a trailing slash,
        //   git also treats it as a shell glob pattern
        // After 2.22.1 (compatible but clearer)
        // > If there is a separator at the beginning or middle (or both)
        // > of the pattern, then the pattern is relative to the directory
        // > level of the particular .gitignore file itself.
        // > Otherwise the pattern may also match at any level below
        // > the .gitignore level.
        "(?:^|\\/)"
      ) : (
        // > Otherwise, Git treats the pattern as a shell glob suitable for
        // >   consumption by fnmatch(3)
        "^"
      );
    }
  ],
  // two globstars
  [
    // Use lookahead assertions so that we could match more than one `'/**'`
    /\\\/\\\*\\\*(?=\\\/|$)/g,
    // Zero, one or several directories
    // should not use '*', or it will be replaced by the next replacer
    // Check if it is not the last `'/**'`
    (_, index, str) => index + 6 < str.length ? (
      // case: /**/
      // > A slash followed by two consecutive asterisks then a slash matches
      // >   zero or more directories.
      // > For example, "a/**/b" matches "a/b", "a/x/b", "a/x/y/b" and so on.
      // '/**/'
      "(?:\\/[^\\/]+)*"
    ) : (
      // case: /**
      // > A trailing `"/**"` matches everything inside.
      // #21: everything inside but it should not include the current folder
      "\\/.+"
    )
  ],
  // normal intermediate wildcards
  [
    // Never replace escaped '*'
    // ignore rule '\*' will match the path '*'
    // 'abc.*/' -> go
    // 'abc.*'  -> skip this rule,
    //    coz trailing single wildcard will be handed by [trailing wildcard]
    /(^|[^\\]+)(\\\*)+(?=.+)/g,
    // '*.js' matches '.js'
    // '*.js' doesn't match 'abc'
    (_, p1, p2) => {
      const unescaped = p2.replace(/\\\*/g, "[^\\/]*");
      return p1 + unescaped;
    }
  ],
  [
    // unescape, revert step 3 except for back slash
    // For example, if a user escape a '\\*',
    // after step 3, the result will be '\\\\\\*'
    /\\\\\\(?=[$.|*+(){^])/g,
    () => ESCAPE
  ],
  [
    // '\\\\' -> '\\'
    /\\\\/g,
    () => ESCAPE
  ],
  [
    // > The range notation, e.g. [a-zA-Z],
    // > can be used to match one of the characters in a range.
    // `\` is escaped by step 3
    /(\\)?\[([^\]/]*?)(\\*)($|\])/g,
    (match, leadEscape, range, endEscape, close) => leadEscape === ESCAPE ? (
      // '\\[bar]' -> '\\\\[bar\\]'
      `\\[${range}${cleanRangeBackSlash(endEscape)}${close}`
    ) : close === "]" ? endEscape.length % 2 === 0 ? (
      // A normal case, and it is a range notation
      // '[bar]'
      // '[bar\\\\]'
      `[${sanitizeRange(range)}${endEscape}]`
    ) : (
      // Invalid range notaton
      // '[bar\\]' -> '[bar\\\\]'
      "[]"
    ) : "[]"
  ],
  // ending
  [
    // 'js' will not match 'js.'
    // 'ab' will not match 'abc'
    /(?:[^*])$/,
    // WTF!
    // https://git-scm.com/docs/gitignore
    // changes in [2.22.1](https://git-scm.com/docs/gitignore/2.22.1)
    // which re-fixes #24, #38
    // > If there is a separator at the end of the pattern then the pattern
    // > will only match directories, otherwise the pattern can match both
    // > files and directories.
    // 'js*' will not match 'a.js'
    // 'js/' will not match 'a.js'
    // 'js' will match 'a.js' and 'a.js/'
    (match) => /\/$/.test(match) ? (
      // foo/ will not match 'foo'
      `${match}$`
    ) : (
      // foo matches 'foo' and 'foo/'
      `${match}(?=$|\\/$)`
    )
  ],
  // trailing wildcard
  [
    /(\^|\\\/)?\\\*$/,
    (_, p1) => {
      const prefix = p1 ? (
        // '\^':
        // '/*' does not match EMPTY
        // '/*' does not match everything
        // '\\\/':
        // 'abc/*' does not match 'abc/'
        `${p1}[^/]+`
      ) : (
        // 'a*' matches 'a'
        // 'a*' matches 'aa'
        "[^/]*"
      );
      return `${prefix}(?=$|\\/$)`;
    }
  ]
];
var regexCache = /* @__PURE__ */ Object.create(null);
var makeRegex = (pattern, ignoreCase) => {
  let source = regexCache[pattern];
  if (!source) {
    source = REPLACERS.reduce(
      (prev, current) => prev.replace(current[0], current[1].bind(pattern)),
      pattern
    );
    regexCache[pattern] = source;
  }
  return ignoreCase ? new RegExp(source, "i") : new RegExp(source);
};
var isString = (subject) => typeof subject === "string";
var checkPattern = (pattern) => pattern && isString(pattern) && !REGEX_TEST_BLANK_LINE.test(pattern) && !REGEX_INVALID_TRAILING_BACKSLASH.test(pattern) && // > A line starting with # serves as a comment.
pattern.indexOf("#") !== 0;
var splitPattern = (pattern) => pattern.split(REGEX_SPLITALL_CRLF);
var IgnoreRule = class {
  constructor(origin, pattern, negative, regex) {
    this.origin = origin;
    this.pattern = pattern;
    this.negative = negative;
    this.regex = regex;
  }
};
var createRule = (pattern, ignoreCase) => {
  const origin = pattern;
  let negative = false;
  if (pattern.indexOf("!") === 0) {
    negative = true;
    pattern = pattern.substr(1);
  }
  pattern = pattern.replace(REGEX_REPLACE_LEADING_EXCAPED_EXCLAMATION, "!").replace(REGEX_REPLACE_LEADING_EXCAPED_HASH, "#");
  const regex = makeRegex(pattern, ignoreCase);
  return new IgnoreRule(origin, pattern, negative, regex);
};
var throwError = (message, Ctor) => {
  throw new Ctor(message);
};
var checkPath = (path3, originalPath, doThrow) => {
  if (!isString(path3)) {
    return doThrow(
      `path must be a string, but got \`${originalPath}\``,
      TypeError
    );
  }
  if (!path3) {
    return doThrow(`path must not be empty`, TypeError);
  }
  if (checkPath.isNotRelative(path3)) {
    const r = "`path.relative()`d";
    return doThrow(
      `path should be a ${r} string, but got "${originalPath}"`,
      RangeError
    );
  }
  return true;
};
var isNotRelative = (path3) => REGEX_TEST_INVALID_PATH.test(path3);
checkPath.isNotRelative = isNotRelative;
checkPath.convert = (p) => p;
var Ignore = class {
  constructor({
    ignorecase = true,
    ignoreCase = ignorecase,
    allowRelativePaths = false
  } = {}) {
    define(this, KEY_IGNORE, true);
    this._rules = [];
    this._ignoreCase = ignoreCase;
    this._allowRelativePaths = allowRelativePaths;
    this._initCache();
  }
  _initCache() {
    this._ignoreCache = /* @__PURE__ */ Object.create(null);
    this._testCache = /* @__PURE__ */ Object.create(null);
  }
  _addPattern(pattern) {
    if (pattern && pattern[KEY_IGNORE]) {
      this._rules = this._rules.concat(pattern._rules);
      this._added = true;
      return;
    }
    if (checkPattern(pattern)) {
      const rule = createRule(pattern, this._ignoreCase);
      this._added = true;
      this._rules.push(rule);
    }
  }
  // @param {Array<string> | string | Ignore} pattern
  add(pattern) {
    this._added = false;
    makeArray(isString(pattern) ? splitPattern(pattern) : pattern).forEach(
      this._addPattern,
      this
    );
    if (this._added) {
      this._initCache();
    }
    return this;
  }
  // legacy
  addPattern(pattern) {
    return this.add(pattern);
  }
  //          |           ignored : unignored
  // negative |   0:0   |   0:1   |   1:0   |   1:1
  // -------- | ------- | ------- | ------- | --------
  //     0    |  TEST   |  TEST   |  SKIP   |    X
  //     1    |  TESTIF |  SKIP   |  TEST   |    X
  // - SKIP: always skip
  // - TEST: always test
  // - TESTIF: only test if checkUnignored
  // - X: that never happen
  // @param {boolean} whether should check if the path is unignored,
  //   setting `checkUnignored` to `false` could reduce additional
  //   path matching.
  // @returns {TestResult} true if a file is ignored
  _testOne(path3, checkUnignored) {
    let ignored = false;
    let unignored = false;
    this._rules.forEach((rule) => {
      const { negative } = rule;
      if (unignored === negative && ignored !== unignored || negative && !ignored && !unignored && !checkUnignored) {
        return;
      }
      const matched = rule.regex.test(path3);
      if (matched) {
        ignored = !negative;
        unignored = negative;
      }
    });
    return {
      ignored,
      unignored
    };
  }
  // @returns {TestResult}
  _test(originalPath, cache, checkUnignored, slices) {
    const path3 = originalPath && // Supports nullable path
    checkPath.convert(originalPath);
    checkPath(
      path3,
      originalPath,
      this._allowRelativePaths ? RETURN_FALSE : throwError
    );
    return this._t(path3, cache, checkUnignored, slices);
  }
  _t(path3, cache, checkUnignored, slices) {
    if (path3 in cache) {
      return cache[path3];
    }
    if (!slices) {
      slices = path3.split(SLASH);
    }
    slices.pop();
    if (!slices.length) {
      return cache[path3] = this._testOne(path3, checkUnignored);
    }
    const parent = this._t(
      slices.join(SLASH) + SLASH,
      cache,
      checkUnignored,
      slices
    );
    return cache[path3] = parent.ignored ? (
      // > It is not possible to re-include a file if a parent directory of
      // >   that file is excluded.
      parent
    ) : this._testOne(path3, checkUnignored);
  }
  ignores(path3) {
    return this._test(path3, this._ignoreCache, false).ignored;
  }
  createFilter() {
    return (path3) => !this.ignores(path3);
  }
  filter(paths) {
    return makeArray(paths).filter(this.createFilter());
  }
  // @returns {TestResult}
  test(path3) {
    return this._test(path3, this._testCache, true);
  }
};
var ignore = (options) => new Ignore(options);
var isPathValid = (path3) => checkPath(path3 && checkPath.convert(path3), path3, RETURN_FALSE);
ignore.isPathValid = isPathValid;

// src/files/ignore.ts
async function readBidsIgnore(file) {
  const value = await file.text();
  if (value) {
    const lines = value.split("\n");
    return lines;
  } else {
    return [];
  }
}
var defaultIgnores = [
  ".git**",
  ".datalad/",
  ".reproman/",
  "sourcedata/",
  "code/",
  "stimuli/",
  "log/",
  "**/meg/*.ds/**",
  "**/micr/*.zarr/**"
];
var FileIgnoreRules = class {
  #ignore;
  constructor(config) {
    this.#ignore = ignore({ allowRelativePaths: true });
    this.#ignore.add(defaultIgnores);
    this.#ignore.add(config);
  }
  add(config) {
    this.#ignore.add(config);
  }
  /** Test if a dataset relative path should be ignored given configured rules */
  test(path3) {
    return this.#ignore.ignores(path3);
  }
};

// src/files/deno.ts
var UnicodeDecodeError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "UnicodeDecode";
  }
};
var BIDSFileDeno = class {
  #ignore;
  #fileInfo;
  #datasetAbsPath;
  constructor(datasetPath, path3, ignore2) {
    this.#datasetAbsPath = datasetPath;
    this.path = path3;
    this.name = basename3(path3);
    this.#ignore = ignore2;
    try {
      this.#fileInfo = Deno.statSync(this._getPath());
    } catch (error2) {
      if (error2.code === "ENOENT") {
        this.#fileInfo = Deno.lstatSync(this._getPath());
      }
    }
  }
  _getPath() {
    return join4(this.#datasetAbsPath, this.path);
  }
  get size() {
    return this.#fileInfo ? this.#fileInfo.size : -1;
  }
  get stream() {
    const handle = this.#openHandle();
    return handle.readable;
  }
  get ignored() {
    return this.#ignore.test(this.path);
  }
  /**
   * Read the entire file and decode as utf-8 text
   */
  async text() {
    const streamReader = this.stream.pipeThrough(new TextDecoderStream("utf-8")).getReader();
    let data = "";
    try {
      const { done, value } = await streamReader.read();
      if (value && value.startsWith("\uFFFD")) {
        throw new UnicodeDecodeError("This file appears to be UTF-16");
      }
      if (done)
        return data;
      data += value;
      while (true) {
        const { done: done2, value: value2 } = await streamReader.read();
        if (done2)
          return data;
        data += value2;
      }
    } finally {
      streamReader.releaseLock();
    }
  }
  /**
   * Read bytes in a range efficiently from a given file
   */
  async readBytes(size, offset = 0) {
    const handle = this.#openHandle();
    const buf = new Uint8Array(size);
    await handle.seek(offset, Deno.SeekMode.Start);
    await handle.read(buf);
    Deno.close(handle.rid);
    return buf;
  }
  /**
   * Return a Deno file handle
   */
  #openHandle() {
    const openOptions = { read: true, write: false };
    return Deno.openSync(this._getPath(), openOptions);
  }
};
async function _readFileTree(rootPath, relativePath, ignore2, parent) {
  await requestReadPermission();
  const name = basename3(relativePath);
  const tree = new FileTree(relativePath, name, parent);
  for await (const dirEntry of Deno.readDir(join4(rootPath, relativePath))) {
    if (dirEntry.isFile || dirEntry.isSymlink) {
      const file = new BIDSFileDeno(
        rootPath,
        join4(relativePath, dirEntry.name),
        ignore2
      );
      if (dirEntry.name === ".bidsignore") {
        ignore2.add(await readBidsIgnore(file));
      }
      tree.files.push(file);
    }
    if (dirEntry.isDirectory) {
      const dirTree = await _readFileTree(
        rootPath,
        join4(relativePath, dirEntry.name),
        ignore2,
        tree
      );
      tree.directories.push(dirTree);
    }
  }
  return tree;
}
function readFileTree(rootPath) {
  const ignore2 = new FileIgnoreRules([]);
  return _readFileTree(rootPath, "/", ignore2);
}

// src/files/browser.ts
var BIDSFileBrowser = class {
  #ignore;
  #file;
  constructor(file, ignore2) {
    this.#file = file;
    this.#ignore = ignore2;
  }
  get name() {
    return this.#file.name;
  }
  get path() {
    const relativePath = this.#file.webkitRelativePath;
    const prefixLength = relativePath.indexOf("/");
    return relativePath.substring(prefixLength);
  }
  get size() {
    return this.#file.size;
  }
  get stream() {
    return this.#file.stream();
  }
  get ignored() {
    return this.#ignore.test(this.path);
  }
  text() {
    return this.#file.text();
  }
  async readBytes(size, offset = 0) {
    return new Uint8Array(await this.#file.slice(offset, size).arrayBuffer());
  }
};
function fileListToTree(files) {
  const ignore2 = new FileIgnoreRules([]);
  const tree = new FileTree("", "/", void 0);
  for (const f of files) {
    const file = new BIDSFileBrowser(f, ignore2);
    const fPath = parse3(file.path);
    if (fPath.dir === "/") {
      tree.files.push(file);
    } else {
      const levels = fPath.dir.split(SEP).slice(1);
      let currentLevelTree = tree;
      for (const level of levels) {
        const exists3 = currentLevelTree.directories.find(
          (d) => d.name === level
        );
        if (exists3) {
          currentLevelTree = exists3;
        } else {
          const newTree = new FileTree(
            join4(currentLevelTree.path, level),
            level,
            currentLevelTree
          );
          currentLevelTree.directories.push(newTree);
          currentLevelTree = newTree;
        }
      }
      currentLevelTree.files.push(file);
    }
  }
  return Promise.resolve(tree);
}

// src/schema/expressionLanguage.ts
function exists2(list, rule = "dataset") {
  const prefix = [];
  if (rule == "stimuli") {
    prefix.push("stimuli");
  } else if (rule == "subject") {
    prefix.push("sub-" + this.entities.subject);
  }
  if (!Array.isArray(list)) {
    list = [list];
  }
  if (rule == "bids-uri") {
    return list.length;
  } else {
    return list.filter((x) => {
      const parts = prefix.concat(x.split("/"));
      return this.fileTree.contains(parts);
    }).length;
  }
}
var expressionFunctions = {
  index: (list, item) => {
    const index = list.indexOf(item);
    return index != -1 ? index : null;
  },
  intersects: (a, b) => {
    if (!Array.isArray(a)) {
      a = [a];
    }
    if (!Array.isArray(b)) {
      b = [b];
    }
    return a.some((x) => b.includes(x));
  },
  match: (target, regex) => {
    let re = RegExp(regex);
    return target.match(re) !== null;
  },
  type: (operand) => {
    if (Array.isArray(operand)) {
      return "array";
    }
    if (typeof operand === "undefined") {
      return "null";
    }
    return typeof operand;
  },
  min: (list) => {
    return Math.min(...list);
  },
  max: (list) => {
    return Math.max(...list);
  },
  length: (list) => {
    if (Array.isArray(list) || typeof list == "string") {
      return list.length;
    }
    return null;
  },
  count: (list, val) => {
    return list.filter((x) => x === val).length;
  },
  exists: exists2,
  substr: (arg, start, end) => {
    return arg.substr(start, end - start);
  },
  sorted: (list) => {
    list.sort();
    return list;
  }
};

// src/utils/logger.ts
function setupLogging(level) {
  setup({
    handlers: {
      console: new handlers.ConsoleHandler(level)
    },
    loggers: {
      "@bids/validator": {
        level,
        handlers: ["console"]
      }
    }
  });
}
function parseStack(stack) {
  const lines = stack.split("\n");
  const caller = lines[2].trim();
  const token = caller.split("at ");
  return token[1];
}
var loggerProxyHandler = {
  // deno-lint-ignore no-explicit-any
  get: function(_, prop) {
    const logger2 = getLogger("@bids/validator");
    const stack = new Error().stack;
    if (stack) {
      const callerLocation = parseStack(stack);
      logger2.debug(`Logger invoked at "${callerLocation}"`);
    }
    const logFunc = logger2[prop];
    return logFunc.bind(logger2);
  }
};
var logger = new Proxy(getLogger("@bids/validator"), loggerProxyHandler);

// src/utils/memoize.ts
var memoize = (fn) => {
  const cache = /* @__PURE__ */ new Map();
  const cached = function(val) {
    return cache.has(val) ? cache.get(val) : cache.set(val, fn.call(this, val)) && cache.get(val);
  };
  cached.cache = cache;
  return cached;
};

// src/schema/applyRules.ts
function applyRules(schema, context, rootSchema, schemaPath) {
  if (!rootSchema) {
    rootSchema = schema;
  }
  if (!schemaPath) {
    schemaPath = "schema";
  }
  Object.assign(context, expressionFunctions);
  context.exists.bind(context);
  for (const key in schema) {
    if (!(schema[key].constructor === Object)) {
      continue;
    }
    if ("selectors" in schema[key]) {
      evalRule(
        schema[key],
        context,
        rootSchema,
        `${schemaPath}.${key}`
      );
    } else if (schema[key].constructor === Object) {
      applyRules(
        schema[key],
        context,
        rootSchema,
        `${schemaPath}.${key}`
      );
    }
  }
  return Promise.resolve();
}
var evalConstructor = (src) => new Function("context", `with (context) { return ${src} }`);
var safeHas = () => true;
var safeGet = (target, prop) => prop === Symbol.unscopables ? void 0 : target[prop];
var memoizedEvalConstructor = memoize(evalConstructor);
function evalCheck(src, context) {
  const test = memoizedEvalConstructor(src);
  const safeContext = new Proxy(context, { has: safeHas, get: safeGet });
  try {
    return test(safeContext);
  } catch (error2) {
    logger.debug(error2);
    return false;
  }
}
var evalMap = {
  checks: evalRuleChecks,
  columns: evalColumns,
  additional_columns: evalAdditionalColumns,
  initial_columns: evalInitialColumns,
  index_columns: evalIndexColumns,
  fields: evalJsonCheck
};
function evalRule(rule, context, schema, schemaPath) {
  if (rule.selectors && !mapEvalCheck(rule.selectors, context)) {
    return;
  }
  Object.keys(rule).filter((key) => key in evalMap).map((key) => {
    evalMap[key](rule, context, schema, schemaPath);
  });
}
function mapEvalCheck(statements, context) {
  return statements.every((x) => evalCheck(x, context));
}
function evalRuleChecks(rule, context, schema, schemaPath) {
  if (rule.checks && !mapEvalCheck(rule.checks, context)) {
    if (rule.issue?.code && rule.issue?.message) {
      context.issues.add({
        key: rule.issue.code,
        reason: rule.issue.message,
        files: [{ ...context.file, evidence: schemaPath }],
        severity: rule.issue.level
      });
    } else {
      context.issues.addNonSchemaIssue("CHECK_ERROR", [
        { ...context.file, evidence: schemaPath }
      ]);
    }
  }
  return true;
}
function schemaObjectTypeCheck(schemaObject, value, schema) {
  if (value === "n/a") {
    return true;
  }
  if ("anyOf" in schemaObject) {
    return schemaObject.anyOf.some(
      (x) => schemaObjectTypeCheck(x, value, schema)
    );
  }
  if ("enum" in schemaObject && schemaObject.enum) {
    return schemaObject.enum.some((x) => x === value);
  }
  const format4 = schema.objects.formats[schemaObject.type];
  const re = new RegExp(`^${format4.pattern}$`);
  return re.test(value);
}
function evalColumns(rule, context, schema, schemaPath) {
  if (!rule.columns || context.extension !== ".tsv")
    return;
  const headers = [...Object.keys(context.columns)];
  for (const [ruleHeader, requirement] of Object.entries(rule.columns)) {
    const columnObject = schema.objects.columns[ruleHeader];
    const name = columnObject.name;
    if (!headers.includes(name) && requirement === "required") {
      context.issues.addNonSchemaIssue("TSV_COLUMN_MISSING", [
        {
          ...context.file,
          evidence: `Column with header ${name} listed as required. ${schemaPath}`
        }
      ]);
    }
    if (headers.includes(name)) {
      for (const value of context.columns[name]) {
        if (!schemaObjectTypeCheck(columnObject, value, schema)) {
          context.issues.addNonSchemaIssue("TSV_VALUE_INCORRECT_TYPE", [
            {
              ...context.file,
              evidence: `'${value}' ${JSON.stringify(columnObject)}`
            }
          ]);
          break;
        }
      }
    }
  }
}
function evalInitialColumns(rule, context, schema, schemaPath) {
  if (!rule?.columns || !rule?.initial_columns || context.extension !== ".tsv")
    return;
  const headers = [...Object.keys(context.columns)];
  rule.initial_columns.map((ruleHeader, ruleIndex) => {
    const ruleHeaderName = schema.objects.columns[ruleHeader].name;
    const contextIndex = headers.findIndex((x) => x === ruleHeaderName);
    if (contextIndex === -1) {
      const evidence = `Column with header ${ruleHeaderName} not found, indexed from 0 it should appear in column ${ruleIndex}. ${schemaPath}`;
      context.issues.addNonSchemaIssue("TSV_COLUMN_MISSING", [
        { ...context.file, evidence }
      ]);
    } else if (ruleIndex !== contextIndex) {
      const evidence = `Column with header ${ruleHeaderName} found at index ${contextIndex} while rule specifies, indexed from 0, it should be in column ${ruleIndex}. ${schemaPath}`;
      context.issues.addNonSchemaIssue("TSV_COLUMN_ORDER_INCORRECT", [
        { ...context.file, evidence }
      ]);
    }
  });
}
function evalAdditionalColumns(rule, context, schema, schemaPath) {
  if (context.extension !== ".tsv")
    return;
  const headers = Object.keys(context?.columns);
  if (!(rule.additional_columns === "allowed") && rule.columns) {
    const ruleHeadersNames = Object.keys(rule.columns).map(
      // @ts-expect-error
      (x) => schema.objects.columns[x].name
    );
    let extraCols = headers.filter(
      (header) => !ruleHeadersNames.includes(header)
    );
    if (rule.additional_columns === "allowed_if_defined") {
      extraCols = extraCols.filter((header) => !(header in context.sidecar));
    }
    if (extraCols.length) {
      context.issues.addNonSchemaIssue("TSV_ADDITIONAL_COLUMNS_NOT_ALLOWED", [
        { ...context.file, evidence: `Disallowed columns found ${extraCols}` }
      ]);
    }
  }
}
function evalIndexColumns(rule, context, schema, schemaPath) {
  if (!rule?.columns || !rule?.index_columns || !rule?.index_columns.length || context.extension !== ".tsv")
    return;
  const headers = Object.keys(context?.columns);
  const uniqueIndexValues = /* @__PURE__ */ new Set();
  const index_columns = rule.index_columns.map((col) => {
    return schema.objects.columns[col].name;
  });
  const missing = index_columns.filter((col) => !headers.includes(col));
  if (missing.length) {
    context.issues.addNonSchemaIssue("TSV_COLUMN_MISSING", [
      {
        ...context.file,
        evidence: `Columns cited as index columns not in file: ${missing}. ${schemaPath}`
      }
    ]);
    return;
  }
  const rowCount = context.columns[index_columns[0]]?.length || 0;
  for (let i = 0; i < rowCount; i++) {
    let indexValue = "";
    index_columns.map((col) => {
      indexValue = indexValue.concat(
        context.columns[col]?.[i] || ""
      );
    });
    if (uniqueIndexValues.has(indexValue)) {
      context.issues.addNonSchemaIssue("TSV_INDEX_VALUE_NOT_UNIQUE", [
        { ...context.file, evidence: `Row: ${i + 2}, Value: ${indexValue}` }
      ]);
    } else {
      uniqueIndexValues.add(indexValue);
    }
  }
}
function evalJsonCheck(rule, context, schema, schemaPath) {
  for (const [key, requirement] of Object.entries(rule.fields)) {
    const severity = getFieldSeverity(requirement, context);
    const keyName = schema.objects.metadata[key].name;
    if (severity && severity !== "ignore" && !(keyName in context.sidecar)) {
      if (requirement.issue?.code && requirement.issue?.message) {
        context.issues.add({
          key: requirement.issue.code,
          reason: requirement.issue.message,
          severity,
          files: [{ ...context.file }]
        });
      } else {
        context.issues.addNonSchemaIssue("JSON_KEY_REQUIRED", [
          {
            ...context.file,
            evidence: `missing ${keyName} as per ${schemaPath}`
          }
        ]);
      }
    }
  }
}
function getFieldSeverity(requirement, context) {
  const levelToSeverity = {
    recommended: "ignore",
    required: "error",
    optional: "ignore",
    prohibited: "ignore"
  };
  let severity = "ignore";
  if (typeof requirement === "string" && requirement in levelToSeverity) {
    severity = levelToSeverity[requirement];
  } else if (typeof requirement === "object" && requirement.level) {
    severity = levelToSeverity[requirement.level];
    const addendumRegex = /(required|recommended) if \`(\w+)\` is \`(\w+)\`/;
    if (requirement.level_addendum) {
      const match = addendumRegex.exec(requirement.level_addendum);
      if (match && match.length === 4) {
        const [_, addendumLevel, key, value] = match;
        if (key in context.sidecar && context.sidecar[key] === value) {
          severity = levelToSeverity[addendumLevel];
        }
      }
    }
  }
  return severity;
}

// src/types/columns.ts
var ColumnsMap = class extends Map {
  constructor() {
    super();
    const columns = /* @__PURE__ */ new Map();
    return new Proxy(columns, columnMapAccessorProxy);
  }
};
var columnMapAccessorProxy = {
  get: function(target, prop, receiver) {
    const value = Reflect.get(target, prop, receiver);
    if (typeof value === "function")
      return value.bind(target);
    if (prop === Symbol.iterator)
      return target[Symbol.iterator].bind(target);
    if (value === void 0)
      return target.get(prop);
    return value;
  },
  set: function(target, prop, value) {
    target.set(prop, value);
    return true;
  },
  has: function(target, prop) {
    return Reflect.has(target, prop);
  },
  ownKeys: function(target) {
    return Array.from(target.keys());
  },
  getOwnPropertyDescriptor: function(target, prop) {
    return { enumerable: true, configurable: true, value: target.get(prop) };
  }
};

// src/schema/entities.ts
function _readEntities(filename) {
  let suffix = "";
  let extension = "";
  const entities = {};
  const parts = filename.split("_");
  for (let i = 0; i < parts.length - 1; i++) {
    const [entity, label] = parts[i].split("-");
    entities[entity] = label || "NOENTITY";
  }
  const lastPart = parts[parts.length - 1];
  const extStart = lastPart.indexOf(".");
  if (extStart === -1) {
    suffix = lastPart;
  } else {
    suffix = lastPart.slice(0, extStart);
    extension = lastPart.slice(extStart);
  }
  return { suffix, extension, entities };
}
var readEntities = memoize(_readEntities);

// src/files/tsv.ts
var normalizeEOL = (str) => str.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
var isContentfulRow = (row) => !!(row && !/^\s*$/.test(row));
function parseTSV(contents) {
  const columns = new ColumnsMap();
  const rows = normalizeEOL(contents).split("\n").filter(isContentfulRow).map((str) => str.split("	"));
  const headers = rows.length ? rows[0] : [];
  headers.map((x) => {
    columns[x] = [];
  });
  for (let i = 1; i < rows.length; i++) {
    for (let j = 0; j < headers.length; j++) {
      const col = columns[headers[j]];
      col.push(rows[i][j]);
    }
  }
  return columns;
}

// http-url:https://raw.githubusercontent.com/rii-mango/NIFTI-Reader-JS/v0.6.4/release/current/nifti-reader-min.js
(() => {
  var H = ((i) => typeof __require < "u" ? __require : typeof Proxy < "u" ? new Proxy(i, { get: (t, e) => (typeof __require < "u" ? __require : t)[e] }) : i)(function(i) {
    if (typeof __require < "u")
      return __require.apply(this, arguments);
    throw new Error('Dynamic require of "' + i + '" is not supported');
  });
  var vt = (i, t) => () => (t || i((t = { exports: {} }).exports, t), t.exports);
  var Tt = vt((He, bt) => {
    "use strict";
    var zt = zt || {};
    zt.NIFTIEXTENSION = zt.NIFTIEXTENSION || function(i, t, e, n) {
      if (i % 16 != 0)
        throw new Error("This does not appear to be a NIFTI extension");
      this.esize = i, this.ecode = t, this.edata = e, this.littleEndian = n;
    };
    zt.NIFTIEXTENSION.prototype.toArrayBuffer = function() {
      let i = new Uint8Array(this.esize);
      i.set(this.data.buffer, 8);
      let t = new DataView(i.buffer);
      return t.setInt32(0, this.esize, this.littleEndian), t.setInt32(4, this.ecode, this.littleEndian), i.buffer;
    };
    var _e = typeof bt;
    _e !== "undefined" && bt.exports && (bt.exports = zt.NIFTIEXTENSION);
  });
  var kt = vt((Qe, Zt) => {
    "use strict";
    var P = P || {};
    P.Utils = P.Utils || {};
    P.NIFTIEXTENSION = P.NIFTIEXTENSION || (typeof H < "u" ? Tt() : null);
    P.Utils.crcTable = null;
    P.Utils.GUNZIP_MAGIC_COOKIE1 = 31;
    P.Utils.GUNZIP_MAGIC_COOKIE2 = 139;
    P.Utils.getStringAt = function(i, t, e) {
      var n = "", r, s;
      for (r = t; r < e; r += 1)
        s = i.getUint8(r), s !== 0 && (n += String.fromCharCode(s));
      return n;
    };
    P.Utils.getByteAt = function(i, t) {
      return i.getInt8(t);
    };
    P.Utils.getShortAt = function(i, t, e) {
      return i.getInt16(t, e);
    };
    P.Utils.getIntAt = function(i, t, e) {
      return i.getInt32(t, e);
    };
    P.Utils.getFloatAt = function(i, t, e) {
      return i.getFloat32(t, e);
    };
    P.Utils.getDoubleAt = function(i, t, e) {
      return i.getFloat64(t, e);
    };
    P.Utils.getLongAt = function(i, t, e) {
      var n, r = [], s = 0;
      for (n = 0; n < 8; n += 1)
        r[n] = P.Utils.getByteAt(i, t + n, e);
      for (n = r.length - 1; n >= 0; n--)
        s = s * 256 + r[n];
      return s;
    };
    P.Utils.getExtensionsAt = function(i, t, e, n) {
      let r = [], s = t;
      for (; s < n; ) {
        let l = e, a = P.Utils.getIntAt(i, s, e);
        if (!a)
          break;
        if (a + s > n && (l = !l, a = P.Utils.getIntAt(i, s, l), a + s > n))
          throw new Error("This does not appear to be a valid NIFTI extension");
        if (a % 16 != 0)
          throw new Error("This does not appear to be a NIFTI extension");
        let h = P.Utils.getIntAt(i, s + 4, l), f = i.buffer.slice(s + 8, s + a);
        console.log("extensionByteIndex: " + (s + 8) + " esize: " + a), console.log(f);
        let o = new P.NIFTIEXTENSION(a, h, f, l);
        r.push(o), s += a;
      }
      return r;
    };
    P.Utils.toArrayBuffer = function(i) {
      var t, e, n;
      for (t = new ArrayBuffer(i.length), e = new Uint8Array(t), n = 0; n < i.length; n += 1)
        e[n] = i[n];
      return t;
    };
    P.Utils.isString = function(i) {
      return typeof i == "string" || i instanceof String;
    };
    P.Utils.formatNumber = function(i, t) {
      var e = 0;
      return P.Utils.isString(i) ? e = Number(i) : e = i, t ? e = e.toPrecision(5) : e = e.toPrecision(7), parseFloat(e);
    };
    P.Utils.makeCRCTable = function() {
      for (var i, t = [], e = 0; e < 256; e++) {
        i = e;
        for (var n = 0; n < 8; n++)
          i = i & 1 ? 3988292384 ^ i >>> 1 : i >>> 1;
        t[e] = i;
      }
      return t;
    };
    P.Utils.crc32 = function(i) {
      for (var t = P.Utils.crcTable || (P.Utils.crcTable = P.Utils.makeCRCTable()), e = -1, n = 0; n < i.byteLength; n++)
        e = e >>> 8 ^ t[(e ^ i.getUint8(n)) & 255];
      return (e ^ -1) >>> 0;
    };
    var Fe = typeof Zt;
    Fe !== "undefined" && Zt.exports && (Zt.exports = P.Utils);
  });
  var li = vt((We, Yt) => {
    "use strict";
    var $e = Tt(), u = u || {};
    u.Utils = u.Utils || (typeof H < "u" ? kt() : null);
    u.NIFTIEXTENSION = u.NIFTIEXTENSION || (typeof H < "u" ? Tt() : null);
    u.NIFTI1 = u.NIFTI1 || function() {
      this.littleEndian = false, this.dim_info = 0, this.dims = [], this.intent_p1 = 0, this.intent_p2 = 0, this.intent_p3 = 0, this.intent_code = 0, this.datatypeCode = 0, this.numBitsPerVoxel = 0, this.slice_start = 0, this.slice_end = 0, this.slice_code = 0, this.pixDims = [], this.vox_offset = 0, this.scl_slope = 1, this.scl_inter = 0, this.xyzt_units = 0, this.cal_max = 0, this.cal_min = 0, this.slice_duration = 0, this.toffset = 0, this.description = "", this.aux_file = "", this.intent_name = "", this.qform_code = 0, this.sform_code = 0, this.quatern_b = 0, this.quatern_c = 0, this.quatern_d = 0, this.qoffset_x = 0, this.qoffset_y = 0, this.qoffset_z = 0, this.affine = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]], this.magic = 0, this.isHDR = false, this.extensionFlag = [0, 0, 0, 0], this.extensionSize = 0, this.extensionCode = 0, this.extensions = [];
    };
    u.NIFTI1.TYPE_NONE = 0;
    u.NIFTI1.TYPE_BINARY = 1;
    u.NIFTI1.TYPE_UINT8 = 2;
    u.NIFTI1.TYPE_INT16 = 4;
    u.NIFTI1.TYPE_INT32 = 8;
    u.NIFTI1.TYPE_FLOAT32 = 16;
    u.NIFTI1.TYPE_COMPLEX64 = 32;
    u.NIFTI1.TYPE_FLOAT64 = 64;
    u.NIFTI1.TYPE_RGB24 = 128;
    u.NIFTI1.TYPE_INT8 = 256;
    u.NIFTI1.TYPE_UINT16 = 512;
    u.NIFTI1.TYPE_UINT32 = 768;
    u.NIFTI1.TYPE_INT64 = 1024;
    u.NIFTI1.TYPE_UINT64 = 1280;
    u.NIFTI1.TYPE_FLOAT128 = 1536;
    u.NIFTI1.TYPE_COMPLEX128 = 1792;
    u.NIFTI1.TYPE_COMPLEX256 = 2048;
    u.NIFTI1.XFORM_UNKNOWN = 0;
    u.NIFTI1.XFORM_SCANNER_ANAT = 1;
    u.NIFTI1.XFORM_ALIGNED_ANAT = 2;
    u.NIFTI1.XFORM_TALAIRACH = 3;
    u.NIFTI1.XFORM_MNI_152 = 4;
    u.NIFTI1.SPATIAL_UNITS_MASK = 7;
    u.NIFTI1.TEMPORAL_UNITS_MASK = 56;
    u.NIFTI1.UNITS_UNKNOWN = 0;
    u.NIFTI1.UNITS_METER = 1;
    u.NIFTI1.UNITS_MM = 2;
    u.NIFTI1.UNITS_MICRON = 3;
    u.NIFTI1.UNITS_SEC = 8;
    u.NIFTI1.UNITS_MSEC = 16;
    u.NIFTI1.UNITS_USEC = 24;
    u.NIFTI1.UNITS_HZ = 32;
    u.NIFTI1.UNITS_PPM = 40;
    u.NIFTI1.UNITS_RADS = 48;
    u.NIFTI1.MAGIC_COOKIE = 348;
    u.NIFTI1.STANDARD_HEADER_SIZE = 348;
    u.NIFTI1.MAGIC_NUMBER_LOCATION = 344;
    u.NIFTI1.MAGIC_NUMBER = [110, 43, 49];
    u.NIFTI1.MAGIC_NUMBER2 = [110, 105, 49];
    u.NIFTI1.EXTENSION_HEADER_SIZE = 8;
    u.NIFTI1.prototype.readHeader = function(i) {
      var t = new DataView(i), e = u.Utils.getIntAt(t, 0, this.littleEndian), n, r, s, l;
      if (e !== u.NIFTI1.MAGIC_COOKIE && (this.littleEndian = true, e = u.Utils.getIntAt(t, 0, this.littleEndian)), e !== u.NIFTI1.MAGIC_COOKIE)
        throw new Error("This does not appear to be a NIFTI file!");
      for (this.dim_info = u.Utils.getByteAt(t, 39), n = 0; n < 8; n += 1)
        l = 40 + n * 2, this.dims[n] = u.Utils.getShortAt(t, l, this.littleEndian);
      for (this.intent_p1 = u.Utils.getFloatAt(t, 56, this.littleEndian), this.intent_p2 = u.Utils.getFloatAt(t, 60, this.littleEndian), this.intent_p3 = u.Utils.getFloatAt(t, 64, this.littleEndian), this.intent_code = u.Utils.getShortAt(t, 68, this.littleEndian), this.datatypeCode = u.Utils.getShortAt(t, 70, this.littleEndian), this.numBitsPerVoxel = u.Utils.getShortAt(t, 72, this.littleEndian), this.slice_start = u.Utils.getShortAt(t, 74, this.littleEndian), n = 0; n < 8; n += 1)
        l = 76 + n * 4, this.pixDims[n] = u.Utils.getFloatAt(t, l, this.littleEndian);
      if (this.vox_offset = u.Utils.getFloatAt(t, 108, this.littleEndian), this.scl_slope = u.Utils.getFloatAt(t, 112, this.littleEndian), this.scl_inter = u.Utils.getFloatAt(t, 116, this.littleEndian), this.slice_end = u.Utils.getShortAt(t, 120, this.littleEndian), this.slice_code = u.Utils.getByteAt(t, 122), this.xyzt_units = u.Utils.getByteAt(t, 123), this.cal_max = u.Utils.getFloatAt(t, 124, this.littleEndian), this.cal_min = u.Utils.getFloatAt(t, 128, this.littleEndian), this.slice_duration = u.Utils.getFloatAt(t, 132, this.littleEndian), this.toffset = u.Utils.getFloatAt(t, 136, this.littleEndian), this.description = u.Utils.getStringAt(t, 148, 228), this.aux_file = u.Utils.getStringAt(t, 228, 252), this.qform_code = u.Utils.getShortAt(t, 252, this.littleEndian), this.sform_code = u.Utils.getShortAt(t, 254, this.littleEndian), this.quatern_b = u.Utils.getFloatAt(t, 256, this.littleEndian), this.quatern_c = u.Utils.getFloatAt(t, 260, this.littleEndian), this.quatern_d = u.Utils.getFloatAt(t, 264, this.littleEndian), this.quatern_a = Math.sqrt(1 - (Math.pow(this.quatern_b, 2) + Math.pow(this.quatern_c, 2) + Math.pow(this.quatern_d, 2))), this.qoffset_x = u.Utils.getFloatAt(t, 268, this.littleEndian), this.qoffset_y = u.Utils.getFloatAt(t, 272, this.littleEndian), this.qoffset_z = u.Utils.getFloatAt(t, 276, this.littleEndian), this.qform_code < 1 && this.sform_code < 1 && (this.affine[0][0] = this.pixDims[1], this.affine[1][1] = this.pixDims[2], this.affine[2][2] = this.pixDims[3]), this.qform_code > 0 && this.sform_code < this.qform_code) {
        let a = this.quatern_a, h = this.quatern_b, f = this.quatern_c, o = this.quatern_d;
        for (this.qfac = this.pixDims[0] === 0 ? 1 : this.pixDims[0], this.quatern_R = [[a * a + h * h - f * f - o * o, 2 * h * f - 2 * a * o, 2 * h * o + 2 * a * f], [2 * h * f + 2 * a * o, a * a + f * f - h * h - o * o, 2 * f * o - 2 * a * h], [2 * h * o - 2 * a * f, 2 * f * o + 2 * a * h, a * a + o * o - f * f - h * h]], r = 0; r < 3; r += 1)
          for (s = 0; s < 3; s += 1)
            this.affine[r][s] = this.quatern_R[r][s] * this.pixDims[s + 1], s === 2 && (this.affine[r][s] *= this.qfac);
        this.affine[0][3] = this.qoffset_x, this.affine[1][3] = this.qoffset_y, this.affine[2][3] = this.qoffset_z;
      } else if (this.sform_code > 0)
        for (r = 0; r < 3; r += 1)
          for (s = 0; s < 4; s += 1)
            l = 280 + (r * 4 + s) * 4, this.affine[r][s] = u.Utils.getFloatAt(t, l, this.littleEndian);
      this.affine[3][0] = 0, this.affine[3][1] = 0, this.affine[3][2] = 0, this.affine[3][3] = 1, this.intent_name = u.Utils.getStringAt(t, 328, 344), this.magic = u.Utils.getStringAt(t, 344, 348), this.isHDR = this.magic === u.NIFTI1.MAGIC_NUMBER2, t.byteLength > u.NIFTI1.MAGIC_COOKIE && (this.extensionFlag[0] = u.Utils.getByteAt(t, 348), this.extensionFlag[1] = u.Utils.getByteAt(t, 348 + 1), this.extensionFlag[2] = u.Utils.getByteAt(t, 348 + 2), this.extensionFlag[3] = u.Utils.getByteAt(t, 348 + 3), this.extensionFlag[0] && (this.extensions = u.Utils.getExtensionsAt(t, this.getExtensionLocation(), this.littleEndian, this.vox_offset), this.extensionSize = this.extensions[0].esize, this.extensionCode = this.extensions[0].ecode));
    };
    u.NIFTI1.prototype.toFormattedString = function() {
      var i = u.Utils.formatNumber, t = "";
      return t += "Dim Info = " + this.dim_info + `
`, t += "Image Dimensions (1-8): " + this.dims[0] + ", " + this.dims[1] + ", " + this.dims[2] + ", " + this.dims[3] + ", " + this.dims[4] + ", " + this.dims[5] + ", " + this.dims[6] + ", " + this.dims[7] + `
`, t += "Intent Parameters (1-3): " + this.intent_p1 + ", " + this.intent_p2 + ", " + this.intent_p3 + `
`, t += "Intent Code = " + this.intent_code + `
`, t += "Datatype = " + this.datatypeCode + " (" + this.getDatatypeCodeString(this.datatypeCode) + `)
`, t += "Bits Per Voxel = " + this.numBitsPerVoxel + `
`, t += "Slice Start = " + this.slice_start + `
`, t += "Voxel Dimensions (1-8): " + i(this.pixDims[0]) + ", " + i(this.pixDims[1]) + ", " + i(this.pixDims[2]) + ", " + i(this.pixDims[3]) + ", " + i(this.pixDims[4]) + ", " + i(this.pixDims[5]) + ", " + i(this.pixDims[6]) + ", " + i(this.pixDims[7]) + `
`, t += "Image Offset = " + this.vox_offset + `
`, t += "Data Scale:  Slope = " + i(this.scl_slope) + "  Intercept = " + i(this.scl_inter) + `
`, t += "Slice End = " + this.slice_end + `
`, t += "Slice Code = " + this.slice_code + `
`, t += "Units Code = " + this.xyzt_units + " (" + this.getUnitsCodeString(u.NIFTI1.SPATIAL_UNITS_MASK & this.xyzt_units) + ", " + this.getUnitsCodeString(u.NIFTI1.TEMPORAL_UNITS_MASK & this.xyzt_units) + `)
`, t += "Display Range:  Max = " + i(this.cal_max) + "  Min = " + i(this.cal_min) + `
`, t += "Slice Duration = " + this.slice_duration + `
`, t += "Time Axis Shift = " + this.toffset + `
`, t += 'Description: "' + this.description + `"
`, t += 'Auxiliary File: "' + this.aux_file + `"
`, t += "Q-Form Code = " + this.qform_code + " (" + this.getTransformCodeString(this.qform_code) + `)
`, t += "S-Form Code = " + this.sform_code + " (" + this.getTransformCodeString(this.sform_code) + `)
`, t += "Quaternion Parameters:  b = " + i(this.quatern_b) + "  c = " + i(this.quatern_c) + "  d = " + i(this.quatern_d) + `
`, t += "Quaternion Offsets:  x = " + this.qoffset_x + "  y = " + this.qoffset_y + "  z = " + this.qoffset_z + `
`, t += "S-Form Parameters X: " + i(this.affine[0][0]) + ", " + i(this.affine[0][1]) + ", " + i(this.affine[0][2]) + ", " + i(this.affine[0][3]) + `
`, t += "S-Form Parameters Y: " + i(this.affine[1][0]) + ", " + i(this.affine[1][1]) + ", " + i(this.affine[1][2]) + ", " + i(this.affine[1][3]) + `
`, t += "S-Form Parameters Z: " + i(this.affine[2][0]) + ", " + i(this.affine[2][1]) + ", " + i(this.affine[2][2]) + ", " + i(this.affine[2][3]) + `
`, t += 'Intent Name: "' + this.intent_name + `"
`, this.extensionFlag[0] && (t += "Extension: Size = " + this.extensionSize + "  Code = " + this.extensionCode + `
`), t;
    };
    u.NIFTI1.prototype.getDatatypeCodeString = function(i) {
      return i === u.NIFTI1.TYPE_UINT8 ? "1-Byte Unsigned Integer" : i === u.NIFTI1.TYPE_INT16 ? "2-Byte Signed Integer" : i === u.NIFTI1.TYPE_INT32 ? "4-Byte Signed Integer" : i === u.NIFTI1.TYPE_FLOAT32 ? "4-Byte Float" : i === u.NIFTI1.TYPE_FLOAT64 ? "8-Byte Float" : i === u.NIFTI1.TYPE_RGB24 ? "RGB" : i === u.NIFTI1.TYPE_INT8 ? "1-Byte Signed Integer" : i === u.NIFTI1.TYPE_UINT16 ? "2-Byte Unsigned Integer" : i === u.NIFTI1.TYPE_UINT32 ? "4-Byte Unsigned Integer" : i === u.NIFTI1.TYPE_INT64 ? "8-Byte Signed Integer" : i === u.NIFTI1.TYPE_UINT64 ? "8-Byte Unsigned Integer" : "Unknown";
    };
    u.NIFTI1.prototype.getTransformCodeString = function(i) {
      return i === u.NIFTI1.XFORM_SCANNER_ANAT ? "Scanner" : i === u.NIFTI1.XFORM_ALIGNED_ANAT ? "Aligned" : i === u.NIFTI1.XFORM_TALAIRACH ? "Talairach" : i === u.NIFTI1.XFORM_MNI_152 ? "MNI" : "Unknown";
    };
    u.NIFTI1.prototype.getUnitsCodeString = function(i) {
      return i === u.NIFTI1.UNITS_METER ? "Meters" : i === u.NIFTI1.UNITS_MM ? "Millimeters" : i === u.NIFTI1.UNITS_MICRON ? "Microns" : i === u.NIFTI1.UNITS_SEC ? "Seconds" : i === u.NIFTI1.UNITS_MSEC ? "Milliseconds" : i === u.NIFTI1.UNITS_USEC ? "Microseconds" : i === u.NIFTI1.UNITS_HZ ? "Hz" : i === u.NIFTI1.UNITS_PPM ? "PPM" : i === u.NIFTI1.UNITS_RADS ? "Rads" : "Unknown";
    };
    u.NIFTI1.prototype.getQformMat = function() {
      return this.convertNiftiQFormToNiftiSForm(this.quatern_b, this.quatern_c, this.quatern_d, this.qoffset_x, this.qoffset_y, this.qoffset_z, this.pixDims[1], this.pixDims[2], this.pixDims[3], this.pixDims[0]);
    };
    u.NIFTI1.prototype.convertNiftiQFormToNiftiSForm = function(i, t, e, n, r, s, l, a, h, f) {
      var o = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]], c, p = i, m = t, g = e, d, v, E;
      return o[3][0] = o[3][1] = o[3][2] = 0, o[3][3] = 1, c = 1 - (p * p + m * m + g * g), c < 1e-7 ? (c = 1 / Math.sqrt(p * p + m * m + g * g), p *= c, m *= c, g *= c, c = 0) : c = Math.sqrt(c), d = l > 0 ? l : 1, v = a > 0 ? a : 1, E = h > 0 ? h : 1, f < 0 && (E = -E), o[0][0] = (c * c + p * p - m * m - g * g) * d, o[0][1] = 2 * (p * m - c * g) * v, o[0][2] = 2 * (p * g + c * m) * E, o[1][0] = 2 * (p * m + c * g) * d, o[1][1] = (c * c + m * m - p * p - g * g) * v, o[1][2] = 2 * (m * g - c * p) * E, o[2][0] = 2 * (p * g - c * m) * d, o[2][1] = 2 * (m * g + c * p) * v, o[2][2] = (c * c + g * g - m * m - p * p) * E, o[0][3] = n, o[1][3] = r, o[2][3] = s, o;
    };
    u.NIFTI1.prototype.convertNiftiSFormToNEMA = function(i) {
      var t, e, n, r, s, l, a, h, f, o, c, p, m, g, d, v, E, A, x, y, L, z, U, T, Z, C, b, S, q, w, O, D, B, k;
      if (d = 0, b = [[0, 0, 0], [0, 0, 0], [0, 0, 0]], S = [[0, 0, 0], [0, 0, 0], [0, 0, 0]], t = i[0][0], e = i[0][1], n = i[0][2], r = i[1][0], s = i[1][1], l = i[1][2], a = i[2][0], h = i[2][1], f = i[2][2], o = Math.sqrt(t * t + r * r + a * a), o === 0 || (t /= o, r /= o, a /= o, o = Math.sqrt(e * e + s * s + h * h), o === 0))
        return null;
      if (e /= o, s /= o, h /= o, o = t * e + r * s + a * h, Math.abs(o) > 1e-4) {
        if (e -= o * t, s -= o * r, h -= o * a, o = Math.sqrt(e * e + s * s + h * h), o === 0)
          return null;
        e /= o, s /= o, h /= o;
      }
      if (o = Math.sqrt(n * n + l * l + f * f), o === 0 ? (n = r * h - a * s, l = a * e - h * t, f = t * s - r * e) : (n /= o, l /= o, f /= o), o = t * n + r * l + a * f, Math.abs(o) > 1e-4) {
        if (n -= o * t, l -= o * r, f -= o * a, o = Math.sqrt(n * n + l * l + f * f), o === 0)
          return null;
        n /= o, l /= o, f /= o;
      }
      if (o = e * n + s * l + h * f, Math.abs(o) > 1e-4) {
        if (n -= o * e, l -= o * s, f -= o * h, o = Math.sqrt(n * n + l * l + f * f), o === 0)
          return null;
        n /= o, l /= o, f /= o;
      }
      if (b[0][0] = t, b[0][1] = e, b[0][2] = n, b[1][0] = r, b[1][1] = s, b[1][2] = l, b[2][0] = a, b[2][1] = h, b[2][2] = f, c = this.nifti_mat33_determ(b), c === 0)
        return null;
      for (C = -666, x = z = U = T = 1, y = 2, L = 3, m = 1; m <= 3; m += 1)
        for (g = 1; g <= 3; g += 1)
          if (m !== g) {
            for (d = 1; d <= 3; d += 1)
              if (!(m === d || g === d))
                for (S[0][0] = S[0][1] = S[0][2] = S[1][0] = S[1][1] = S[1][2] = S[2][0] = S[2][1] = S[2][2] = 0, v = -1; v <= 1; v += 2)
                  for (E = -1; E <= 1; E += 2)
                    for (A = -1; A <= 1; A += 2)
                      S[0][m - 1] = v, S[1][g - 1] = E, S[2][d - 1] = A, p = this.nifti_mat33_determ(S), p * c > 0 && (Z = this.nifti_mat33_mul(S, b), o = Z[0][0] + Z[1][1] + Z[2][2], o > C && (C = o, x = m, y = g, L = d, z = v, U = E, T = A));
          }
      switch (q = w = O = D = B = k = 0, x * z) {
        case 1:
          q = "X", D = "+";
          break;
        case -1:
          q = "X", D = "-";
          break;
        case 2:
          q = "Y", D = "+";
          break;
        case -2:
          q = "Y", D = "-";
          break;
        case 3:
          q = "Z", D = "+";
          break;
        case -3:
          q = "Z", D = "-";
          break;
      }
      switch (y * U) {
        case 1:
          w = "X", B = "+";
          break;
        case -1:
          w = "X", B = "-";
          break;
        case 2:
          w = "Y", B = "+";
          break;
        case -2:
          w = "Y", B = "-";
          break;
        case 3:
          w = "Z", B = "+";
          break;
        case -3:
          w = "Z", B = "-";
          break;
      }
      switch (L * T) {
        case 1:
          O = "X", k = "+";
          break;
        case -1:
          O = "X", k = "-";
          break;
        case 2:
          O = "Y", k = "+";
          break;
        case -2:
          O = "Y", k = "-";
          break;
        case 3:
          O = "Z", k = "+";
          break;
        case -3:
          O = "Z", k = "-";
          break;
      }
      return q + w + O + D + B + k;
    };
    u.NIFTI1.prototype.nifti_mat33_mul = function(i, t) {
      var e = [[0, 0, 0], [0, 0, 0], [0, 0, 0]], n, r;
      for (n = 0; n < 3; n += 1)
        for (r = 0; r < 3; r += 1)
          e[n][r] = i[n][0] * t[0][r] + i[n][1] * t[1][r] + i[n][2] * t[2][r];
      return e;
    };
    u.NIFTI1.prototype.nifti_mat33_determ = function(i) {
      var t, e, n, r, s, l, a, h, f;
      return t = i[0][0], e = i[0][1], n = i[0][2], r = i[1][0], s = i[1][1], l = i[1][2], a = i[2][0], h = i[2][1], f = i[2][2], t * s * f - t * h * l - r * e * f + r * h * n + a * e * l - a * s * n;
    };
    u.NIFTI1.prototype.getExtensionLocation = function() {
      return u.NIFTI1.MAGIC_COOKIE + 4;
    };
    u.NIFTI1.prototype.getExtensionSize = function(i) {
      return u.Utils.getIntAt(i, this.getExtensionLocation(), this.littleEndian);
    };
    u.NIFTI1.prototype.getExtensionCode = function(i) {
      return u.Utils.getIntAt(i, this.getExtensionLocation() + 4, this.littleEndian);
    };
    u.NIFTI1.prototype.addExtension = function(i, t = -1) {
      t == -1 ? this.extensions.push(i) : this.extensions.splice(t, 0, i), this.vox_offset += i.esize;
    };
    u.NIFTI1.prototype.removeExtension = function(i) {
      let t = this.extensions[i];
      t && (this.vox_offset -= t.esize), this.extensions.splice(i, 1);
    };
    u.NIFTI1.prototype.toArrayBuffer = function(i = false) {
      let n = 352;
      if (i)
        for (let a of this.extensions)
          n += a.esize;
      let r = new Uint8Array(n), s = new DataView(r.buffer);
      s.setInt32(0, 348, this.littleEndian), s.setUint8(39, this.dim_info);
      for (let a = 0; a < 8; a++)
        s.setUint16(40 + 2 * a, this.dims[a], this.littleEndian);
      s.setFloat32(56, this.intent_p1, this.littleEndian), s.setFloat32(60, this.intent_p2, this.littleEndian), s.setFloat32(64, this.intent_p3, this.littleEndian), s.setInt16(68, this.intent_code, this.littleEndian), s.setInt16(70, this.datatypeCode, this.littleEndian), s.setInt16(72, this.numBitsPerVoxel, this.littleEndian), s.setInt16(74, this.slice_start, this.littleEndian);
      for (let a = 0; a < 8; a++)
        s.setFloat32(76 + 4 * a, this.pixDims[a], this.littleEndian);
      s.setFloat32(108, this.vox_offset, this.littleEndian), s.setFloat32(112, this.scl_slope, this.littleEndian), s.setFloat32(116, this.scl_inter, this.littleEndian), s.setInt16(120, this.slice_end, this.littleEndian), s.setUint8(122, this.slice_code), s.setUint8(123, this.xyzt_units), s.setFloat32(124, this.cal_max, this.littleEndian), s.setFloat32(128, this.cal_min, this.littleEndian), s.setFloat32(132, this.slice_duration, this.littleEndian), s.setFloat32(136, this.toffset, this.littleEndian), r.set(Buffer.from(this.description), 148), r.set(Buffer.from(this.aux_file), 228), s.setInt16(252, this.qform_code, this.littleEndian), s.setInt16(254, this.sform_code, this.littleEndian), s.setFloat32(256, this.quatern_b, this.littleEndian), s.setFloat32(260, this.quatern_c, this.littleEndian), s.setFloat32(264, this.quatern_d, this.littleEndian), s.setFloat32(268, this.qoffset_x, this.littleEndian), s.setFloat32(272, this.qoffset_y, this.littleEndian), s.setFloat32(276, this.qoffset_z, this.littleEndian);
      let l = this.affine.flat();
      for (let a = 0; a < 12; a++)
        s.setFloat32(280 + 4 * a, l[a], this.littleEndian);
      if (r.set(Buffer.from(this.intent_name), 328), r.set(Buffer.from(this.magic), 344), i) {
        r.set(Uint8Array.from([1, 0, 0, 0]), 348);
        let a = this.getExtensionLocation();
        for (let h of this.extensions)
          s.setInt32(a, h.esize, h.littleEndian), s.setInt32(a + 4, h.ecode, h.littleEndian), r.set(new Uint8Array(h.edata), a + 8), a += h.esize;
      } else
        r.set(new Uint8Array(4).fill(0), 348);
      return r.buffer;
    };
    var ye = typeof Yt;
    ye !== "undefined" && Yt.exports && (Yt.exports = u.NIFTI1);
  });
  var zi = vt((tn, Xt) => {
    "use strict";
    var I = I || {};
    I.Utils = I.Utils || (typeof H < "u" ? kt() : null);
    I.NIFTI1 = I.NIFTI1 || (typeof H < "u" ? li() : null);
    I.NIFTIEXTENSION = I.NIFTIEXTENSION || (typeof H < "u" ? Tt() : null);
    I.NIFTI2 = I.NIFTI2 || function() {
      this.littleEndian = false, this.dim_info = 0, this.dims = [], this.intent_p1 = 0, this.intent_p2 = 0, this.intent_p3 = 0, this.intent_code = 0, this.datatypeCode = 0, this.numBitsPerVoxel = 0, this.slice_start = 0, this.slice_end = 0, this.slice_code = 0, this.pixDims = [], this.vox_offset = 0, this.scl_slope = 1, this.scl_inter = 0, this.xyzt_units = 0, this.cal_max = 0, this.cal_min = 0, this.slice_duration = 0, this.toffset = 0, this.description = "", this.aux_file = "", this.intent_name = "", this.qform_code = 0, this.sform_code = 0, this.quatern_b = 0, this.quatern_c = 0, this.quatern_d = 0, this.qoffset_x = 0, this.qoffset_y = 0, this.qoffset_z = 0, this.affine = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]], this.magic = 0, this.extensionFlag = [0, 0, 0, 0], this.extensions = [];
    };
    I.NIFTI2.MAGIC_COOKIE = 540;
    I.NIFTI2.MAGIC_NUMBER_LOCATION = 4;
    I.NIFTI2.MAGIC_NUMBER = [110, 43, 50, 0, 13, 10, 26, 10];
    I.NIFTI2.MAGIC_NUMBER2 = [110, 105, 50, 0, 13, 10, 26, 10];
    I.NIFTI2.prototype.readHeader = function(i) {
      var t = new DataView(i), e = I.Utils.getIntAt(t, 0, this.littleEndian), n, r, s, l, a;
      if (e !== I.NIFTI2.MAGIC_COOKIE && (this.littleEndian = true, e = I.Utils.getIntAt(t, 0, this.littleEndian)), e !== I.NIFTI2.MAGIC_COOKIE)
        throw new Error("This does not appear to be a NIFTI file!");
      for (this.magic = I.Utils.getStringAt(t, 4, 12), this.datatypeCode = I.Utils.getShortAt(t, 12, this.littleEndian), this.numBitsPerVoxel = I.Utils.getShortAt(t, 14, this.littleEndian), n = 0; n < 8; n += 1)
        l = 16 + n * 8, this.dims[n] = I.Utils.getLongAt(t, l, this.littleEndian);
      for (this.intent_p1 = I.Utils.getDoubleAt(t, 80, this.littleEndian), this.intent_p2 = I.Utils.getDoubleAt(t, 88, this.littleEndian), this.intent_p3 = I.Utils.getDoubleAt(t, 96, this.littleEndian), n = 0; n < 8; n += 1)
        l = 104 + n * 8, this.pixDims[n] = I.Utils.getDoubleAt(t, l, this.littleEndian);
      for (this.vox_offset = I.Utils.getLongAt(t, 168, this.littleEndian), this.scl_slope = I.Utils.getDoubleAt(t, 176, this.littleEndian), this.scl_inter = I.Utils.getDoubleAt(t, 184, this.littleEndian), this.cal_max = I.Utils.getDoubleAt(t, 192, this.littleEndian), this.cal_min = I.Utils.getDoubleAt(t, 200, this.littleEndian), this.slice_duration = I.Utils.getDoubleAt(t, 208, this.littleEndian), this.toffset = I.Utils.getDoubleAt(t, 216, this.littleEndian), this.slice_start = I.Utils.getLongAt(t, 224, this.littleEndian), this.slice_end = I.Utils.getLongAt(t, 232, this.littleEndian), this.description = I.Utils.getStringAt(t, 240, 240 + 80), this.aux_file = I.Utils.getStringAt(t, 320, 320 + 24), this.qform_code = I.Utils.getIntAt(t, 344, this.littleEndian), this.sform_code = I.Utils.getIntAt(t, 348, this.littleEndian), this.quatern_b = I.Utils.getDoubleAt(t, 352, this.littleEndian), this.quatern_c = I.Utils.getDoubleAt(t, 360, this.littleEndian), this.quatern_d = I.Utils.getDoubleAt(t, 368, this.littleEndian), this.qoffset_x = I.Utils.getDoubleAt(t, 376, this.littleEndian), this.qoffset_y = I.Utils.getDoubleAt(t, 384, this.littleEndian), this.qoffset_z = I.Utils.getDoubleAt(t, 392, this.littleEndian), r = 0; r < 3; r += 1)
        for (s = 0; s < 4; s += 1)
          l = 400 + (r * 4 + s) * 8, this.affine[r][s] = I.Utils.getDoubleAt(t, l, this.littleEndian);
      this.affine[3][0] = 0, this.affine[3][1] = 0, this.affine[3][2] = 0, this.affine[3][3] = 1, this.slice_code = I.Utils.getIntAt(t, 496, this.littleEndian), this.xyzt_units = I.Utils.getIntAt(t, 500, this.littleEndian), this.intent_code = I.Utils.getIntAt(t, 504, this.littleEndian), this.intent_name = I.Utils.getStringAt(t, 508, 508 + 16), this.dim_info = I.Utils.getByteAt(t, 524), t.byteLength > I.NIFTI2.MAGIC_COOKIE && (this.extensionFlag[0] = I.Utils.getByteAt(t, 540), this.extensionFlag[1] = I.Utils.getByteAt(t, 540 + 1), this.extensionFlag[2] = I.Utils.getByteAt(t, 540 + 2), this.extensionFlag[3] = I.Utils.getByteAt(t, 540 + 3), this.extensionFlag[0] && (this.extensions = I.Utils.getExtensionsAt(t, this.getExtensionLocation(), this.littleEndian, this.vox_offset), this.extensionSize = this.extensions[0].esize, this.extensionCode = this.extensions[0].ecode));
    };
    I.NIFTI2.prototype.toFormattedString = function() {
      var i = I.Utils.formatNumber, t = "";
      return t += "Datatype = " + +this.datatypeCode + " (" + this.getDatatypeCodeString(this.datatypeCode) + `)
`, t += "Bits Per Voxel =  = " + this.numBitsPerVoxel + `
`, t += "Image Dimensions (1-8): " + this.dims[0] + ", " + this.dims[1] + ", " + this.dims[2] + ", " + this.dims[3] + ", " + this.dims[4] + ", " + this.dims[5] + ", " + this.dims[6] + ", " + this.dims[7] + `
`, t += "Intent Parameters (1-3): " + this.intent_p1 + ", " + this.intent_p2 + ", " + this.intent_p3 + `
`, t += "Voxel Dimensions (1-8): " + i(this.pixDims[0]) + ", " + i(this.pixDims[1]) + ", " + i(this.pixDims[2]) + ", " + i(this.pixDims[3]) + ", " + i(this.pixDims[4]) + ", " + i(this.pixDims[5]) + ", " + i(this.pixDims[6]) + ", " + i(this.pixDims[7]) + `
`, t += "Image Offset = " + this.vox_offset + `
`, t += "Data Scale:  Slope = " + i(this.scl_slope) + "  Intercept = " + i(this.scl_inter) + `
`, t += "Display Range:  Max = " + i(this.cal_max) + "  Min = " + i(this.cal_min) + `
`, t += "Slice Duration = " + this.slice_duration + `
`, t += "Time Axis Shift = " + this.toffset + `
`, t += "Slice Start = " + this.slice_start + `
`, t += "Slice End = " + this.slice_end + `
`, t += 'Description: "' + this.description + `"
`, t += 'Auxiliary File: "' + this.aux_file + `"
`, t += "Q-Form Code = " + this.qform_code + " (" + this.getTransformCodeString(this.qform_code) + `)
`, t += "S-Form Code = " + this.sform_code + " (" + this.getTransformCodeString(this.sform_code) + `)
`, t += "Quaternion Parameters:  b = " + i(this.quatern_b) + "  c = " + i(this.quatern_c) + "  d = " + i(this.quatern_d) + `
`, t += "Quaternion Offsets:  x = " + this.qoffset_x + "  y = " + this.qoffset_y + "  z = " + this.qoffset_z + `
`, t += "S-Form Parameters X: " + i(this.affine[0][0]) + ", " + i(this.affine[0][1]) + ", " + i(this.affine[0][2]) + ", " + i(this.affine[0][3]) + `
`, t += "S-Form Parameters Y: " + i(this.affine[1][0]) + ", " + i(this.affine[1][1]) + ", " + i(this.affine[1][2]) + ", " + i(this.affine[1][3]) + `
`, t += "S-Form Parameters Z: " + i(this.affine[2][0]) + ", " + i(this.affine[2][1]) + ", " + i(this.affine[2][2]) + ", " + i(this.affine[2][3]) + `
`, t += "Slice Code = " + this.slice_code + `
`, t += "Units Code = " + this.xyzt_units + " (" + this.getUnitsCodeString(I.NIFTI1.SPATIAL_UNITS_MASK & this.xyzt_units) + ", " + this.getUnitsCodeString(I.NIFTI1.TEMPORAL_UNITS_MASK & this.xyzt_units) + `)
`, t += "Intent Code = " + this.intent_code + `
`, t += 'Intent Name: "' + this.intent_name + `"
`, t += "Dim Info = " + this.dim_info + `
`, t;
    };
    I.NIFTI2.prototype.getExtensionLocation = function() {
      return I.NIFTI2.MAGIC_COOKIE + 4;
    };
    I.NIFTI2.prototype.getExtensionSize = I.NIFTI1.prototype.getExtensionSize;
    I.NIFTI2.prototype.getExtensionCode = I.NIFTI1.prototype.getExtensionCode;
    I.NIFTI2.prototype.addExtension = I.NIFTI1.prototype.addExtension;
    I.NIFTI2.prototype.removeExtension = I.NIFTI1.prototype.removeExtension;
    I.NIFTI2.prototype.getDatatypeCodeString = I.NIFTI1.prototype.getDatatypeCodeString;
    I.NIFTI2.prototype.getTransformCodeString = I.NIFTI1.prototype.getTransformCodeString;
    I.NIFTI2.prototype.getUnitsCodeString = I.NIFTI1.prototype.getUnitsCodeString;
    I.NIFTI2.prototype.getQformMat = I.NIFTI1.prototype.getQformMat;
    I.NIFTI2.prototype.convertNiftiQFormToNiftiSForm = I.NIFTI1.prototype.convertNiftiQFormToNiftiSForm;
    I.NIFTI2.prototype.convertNiftiSFormToNEMA = I.NIFTI1.prototype.convertNiftiSFormToNEMA;
    I.NIFTI2.prototype.nifti_mat33_mul = I.NIFTI1.prototype.nifti_mat33_mul;
    I.NIFTI2.prototype.nifti_mat33_determ = I.NIFTI1.prototype.nifti_mat33_determ;
    I.NIFTI2.prototype.toArrayBuffer = function(i = false) {
      let n = 544;
      if (i)
        for (let a of this.extensions)
          n += a.esize;
      let r = new Uint8Array(n), s = new DataView(r.buffer);
      s.setInt32(0, 540, this.littleEndian), r.set(Buffer.from(this.magic), 4), s.setInt16(12, this.datatypeCode, this.littleEndian), s.setInt16(14, this.numBitsPerVoxel, this.littleEndian);
      for (let a = 0; a < 8; a++)
        s.setBigInt64(16 + 8 * a, BigInt(this.dims[a]), this.littleEndian);
      s.setFloat64(80, this.intent_p1, this.littleEndian), s.setFloat64(88, this.intent_p2, this.littleEndian), s.setFloat64(96, this.intent_p3, this.littleEndian);
      for (let a = 0; a < 8; a++)
        s.setFloat64(104 + 8 * a, this.pixDims[a], this.littleEndian);
      s.setBigInt64(168, BigInt(this.vox_offset), this.littleEndian), s.setFloat64(176, this.scl_slope, this.littleEndian), s.setFloat64(184, this.scl_inter, this.littleEndian), s.setFloat64(192, this.cal_max, this.littleEndian), s.setFloat64(200, this.cal_min, this.littleEndian), s.setFloat64(208, this.slice_duration, this.littleEndian), s.setFloat64(216, this.toffset, this.littleEndian), s.setBigInt64(224, BigInt(this.slice_start), this.littleEndian), s.setBigInt64(232, BigInt(this.slice_end), this.littleEndian), r.set(Buffer.from(this.description), 240), r.set(Buffer.from(this.aux_file), 320), s.setInt32(344, this.qform_code, this.littleEndian), s.setInt32(348, this.sform_code, this.littleEndian), s.setFloat64(352, this.quatern_b, this.littleEndian), s.setFloat64(360, this.quatern_c, this.littleEndian), s.setFloat64(368, this.quatern_d, this.littleEndian), s.setFloat64(376, this.qoffset_x, this.littleEndian), s.setFloat64(384, this.qoffset_y, this.littleEndian), s.setFloat64(392, this.qoffset_z, this.littleEndian);
      let l = this.affine.flat();
      for (let a = 0; a < 12; a++)
        s.setFloat64(400 + 8 * a, l[a], this.littleEndian);
      if (s.setInt32(496, this.slice_code, this.littleEndian), s.setInt32(500, this.xyzt_units, this.littleEndian), s.setInt32(504, this.intent_code, this.littleEndian), r.set(Buffer.from(this.intent_name), 508), s.setUint8(524, this.dim_info), i) {
        r.set(Uint8Array.from([1, 0, 0, 0]), 540);
        let a = this.getExtensionLocation();
        for (let h of this.extensions)
          s.setInt32(a, h.esize, h.littleEndian), s.setInt32(a + 4, h.ecode, h.littleEndian), r.set(new Uint8Array(h.edata), a + 8), a += h.esize;
      } else
        r.set(new Uint8Array(4).fill(0), 540);
      return r.buffer;
    };
    var Ae = typeof Xt;
    Ae !== "undefined" && Xt.exports && (Xt.exports = I.NIFTI2);
  });
  var Bi = vt((qi) => {
    "use strict";
    var Di = {};
    qi.default = function(i, t, e, n, r) {
      var s = new Worker(Di[t] || (Di[t] = URL.createObjectURL(new Blob([i + ';addEventListener("error",function(e){e=e.error;postMessage({$e$:[e.message,e.code,e.stack]})})'], { type: "text/javascript" }))));
      return s.onmessage = function(l) {
        var a = l.data, h = a.$e$;
        if (h) {
          var f = new Error(h[0]);
          f.code = h[1], f.stack = h[2], r(f, null);
        } else
          r(null, a);
      }, s.postMessage(e, n), s;
    };
  });
  var de = vt((_) => {
    "use strict";
    var Ue = Bi(), M = Uint8Array, V = Uint16Array, _t = Uint32Array, Ft = new M([0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, 0, 0, 0]), yt = new M([0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 0, 0]), Dt = new M([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]), Gi = function(i, t) {
      for (var e = new V(31), n = 0; n < 31; ++n)
        e[n] = t += 1 << i[n - 1];
      for (var r = new _t(e[30]), n = 1; n < 30; ++n)
        for (var s = e[n]; s < e[n + 1]; ++s)
          r[s] = s - e[n] << 5 | n;
      return [e, r];
    }, Li = Gi(Ft, 2), gi = Li[0], jt = Li[1];
    gi[28] = 258, jt[258] = 28;
    var Ri = Gi(yt, 0), bi = Ri[0], hi = Ri[1], qt = new V(32768);
    for (G = 0; G < 32768; ++G)
      lt = (G & 43690) >>> 1 | (G & 21845) << 1, lt = (lt & 52428) >>> 2 | (lt & 13107) << 2, lt = (lt & 61680) >>> 4 | (lt & 3855) << 4, qt[G] = ((lt & 65280) >>> 8 | (lt & 255) << 8) >>> 1;
    var lt, G, it = function(i, t, e) {
      for (var n = i.length, r = 0, s = new V(t); r < n; ++r)
        i[r] && ++s[i[r] - 1];
      var l = new V(t);
      for (r = 0; r < t; ++r)
        l[r] = l[r - 1] + s[r - 1] << 1;
      var a;
      if (e) {
        a = new V(1 << t);
        var h = 15 - t;
        for (r = 0; r < n; ++r)
          if (i[r])
            for (var f = r << 4 | i[r], o = t - i[r], c = l[i[r] - 1]++ << o, p = c | (1 << o) - 1; c <= p; ++c)
              a[qt[c] >>> h] = f;
      } else
        for (a = new V(n), r = 0; r < n; ++r)
          i[r] && (a[r] = qt[l[i[r] - 1]++] >>> 15 - i[r]);
      return a;
    }, ht = new M(288);
    for (G = 0; G < 144; ++G)
      ht[G] = 8;
    var G;
    for (G = 144; G < 256; ++G)
      ht[G] = 9;
    var G;
    for (G = 256; G < 280; ++G)
      ht[G] = 7;
    var G;
    for (G = 280; G < 288; ++G)
      ht[G] = 8;
    var G, Nt = new M(32);
    for (G = 0; G < 32; ++G)
      Nt[G] = 5;
    var G, Zi = it(ht, 9, 0), ki = it(ht, 9, 1), Yi = it(Nt, 5, 0), Xi = it(Nt, 5, 1), Kt = function(i) {
      for (var t = i[0], e = 1; e < i.length; ++e)
        i[e] > t && (t = i[e]);
      return t;
    }, tt = function(i, t, e) {
      var n = t / 8 | 0;
      return (i[n] | i[n + 1] << 8) >> (t & 7) & e;
    }, Ht = function(i, t) {
      var e = t / 8 | 0;
      return (i[e] | i[e + 1] << 8 | i[e + 2] << 16) >> (t & 7);
    }, Ot = function(i) {
      return (i + 7) / 8 | 0;
    }, et = function(i, t, e) {
      (t == null || t < 0) && (t = 0), (e == null || e > i.length) && (e = i.length);
      var n = new (i.BYTES_PER_ELEMENT == 2 ? V : i.BYTES_PER_ELEMENT == 4 ? _t : M)(e - t);
      return n.set(i.subarray(t, e)), n;
    };
    _.FlateErrorCode = { UnexpectedEOF: 0, InvalidBlockType: 1, InvalidLengthLiteral: 2, InvalidDistance: 3, StreamFinished: 4, NoStreamHandler: 5, InvalidHeader: 6, NoCallback: 7, InvalidUTF8: 8, ExtraFieldTooLong: 9, InvalidDate: 10, FilenameTooLong: 11, StreamFinishing: 12, InvalidZipData: 13, UnknownCompressionMethod: 14 };
    var Vi = ["unexpected EOF", "invalid block type", "invalid length/literal", "invalid distance", "stream finished", "no stream handler", , "no callback", "invalid UTF-8 data", "extra field too long", "date not in range 1980-2099", "filename too long", "stream finishing", "invalid zip data"], N = function(i, t, e) {
      var n = new Error(t || Vi[i]);
      if (n.code = i, Error.captureStackTrace && Error.captureStackTrace(n, N), !e)
        throw n;
      return n;
    }, Pt = function(i, t, e) {
      var n = i.length;
      if (!n || e && e.f && !e.l)
        return t || new M(0);
      var r = !t || e, s = !e || e.i;
      e || (e = {}), t || (t = new M(n * 3));
      var l = function(Rt) {
        var Mt = t.length;
        if (Rt > Mt) {
          var gt = new M(Math.max(Mt * 2, Rt));
          gt.set(t), t = gt;
        }
      }, a = e.f || 0, h = e.p || 0, f = e.b || 0, o = e.l, c = e.d, p = e.m, m = e.n, g = n * 8;
      do {
        if (!o) {
          a = tt(i, h, 1);
          var d = tt(i, h + 1, 3);
          if (h += 3, d)
            if (d == 1)
              o = ki, c = Xi, p = 9, m = 5;
            else if (d == 2) {
              var x = tt(i, h, 31) + 257, y = tt(i, h + 10, 15) + 4, L = x + tt(i, h + 5, 31) + 1;
              h += 14;
              for (var z = new M(L), U = new M(19), T = 0; T < y; ++T)
                U[Dt[T]] = tt(i, h + T * 3, 7);
              h += y * 3;
              for (var Z = Kt(U), C = (1 << Z) - 1, b = it(U, Z, 1), T = 0; T < L; ) {
                var S = b[tt(i, h, C)];
                h += S & 15;
                var v = S >>> 4;
                if (v < 16)
                  z[T++] = v;
                else {
                  var q = 0, w = 0;
                  for (v == 16 ? (w = 3 + tt(i, h, 3), h += 2, q = z[T - 1]) : v == 17 ? (w = 3 + tt(i, h, 7), h += 3) : v == 18 && (w = 11 + tt(i, h, 127), h += 7); w--; )
                    z[T++] = q;
                }
              }
              var O = z.subarray(0, x), D = z.subarray(x);
              p = Kt(O), m = Kt(D), o = it(O, p, 1), c = it(D, m, 1);
            } else
              N(1);
          else {
            var v = Ot(h) + 4, E = i[v - 4] | i[v - 3] << 8, A = v + E;
            if (A > n) {
              s && N(0);
              break;
            }
            r && l(f + E), t.set(i.subarray(v, A), f), e.b = f += E, e.p = h = A * 8, e.f = a;
            continue;
          }
          if (h > g) {
            s && N(0);
            break;
          }
        }
        r && l(f + 131072);
        for (var B = (1 << p) - 1, k = (1 << m) - 1, j = h; ; j = h) {
          var q = o[Ht(i, h) & B], J = q >>> 4;
          if (h += q & 15, h > g) {
            s && N(0);
            break;
          }
          if (q || N(2), J < 256)
            t[f++] = J;
          else if (J == 256) {
            j = h, o = null;
            break;
          } else {
            var K = J - 254;
            if (J > 264) {
              var T = J - 257, st = Ft[T];
              K = tt(i, h, (1 << st) - 1) + gi[T], h += st;
            }
            var rt = c[Ht(i, h) & k], $ = rt >>> 4;
            rt || N(3), h += rt & 15;
            var D = bi[$];
            if ($ > 3) {
              var st = yt[$];
              D += Ht(i, h) & (1 << st) - 1, h += st;
            }
            if (h > g) {
              s && N(0);
              break;
            }
            r && l(f + 131072);
            for (var X = f + K; f < X; f += 4)
              t[f] = t[f - D], t[f + 1] = t[f + 1 - D], t[f + 2] = t[f + 2 - D], t[f + 3] = t[f + 3 - D];
            f = X;
          }
        }
        e.l = o, e.p = j, e.b = f, e.f = a, o && (a = 1, e.m = p, e.d = c, e.n = m);
      } while (!a);
      return f == t.length ? t : et(t, 0, f);
    }, at = function(i, t, e) {
      e <<= t & 7;
      var n = t / 8 | 0;
      i[n] |= e, i[n + 1] |= e >>> 8;
    }, mt = function(i, t, e) {
      e <<= t & 7;
      var n = t / 8 | 0;
      i[n] |= e, i[n + 1] |= e >>> 8, i[n + 2] |= e >>> 16;
    }, Qt = function(i, t) {
      for (var e = [], n = 0; n < i.length; ++n)
        i[n] && e.push({ s: n, f: i[n] });
      var r = e.length, s = e.slice();
      if (!r)
        return [ft, 0];
      if (r == 1) {
        var l = new M(e[0].s + 1);
        return l[e[0].s] = 1, [l, 1];
      }
      e.sort(function(L, z) {
        return L.f - z.f;
      }), e.push({ s: -1, f: 25001 });
      var a = e[0], h = e[1], f = 0, o = 1, c = 2;
      for (e[0] = { s: -1, f: a.f + h.f, l: a, r: h }; o != r - 1; )
        a = e[e[f].f < e[c].f ? f++ : c++], h = e[f != o && e[f].f < e[c].f ? f++ : c++], e[o++] = { s: -1, f: a.f + h.f, l: a, r: h };
      for (var p = s[0].s, n = 1; n < r; ++n)
        s[n].s > p && (p = s[n].s);
      var m = new V(p + 1), g = $t(e[o - 1], m, 0);
      if (g > t) {
        var n = 0, d = 0, v = g - t, E = 1 << v;
        for (s.sort(function(z, U) {
          return m[U.s] - m[z.s] || z.f - U.f;
        }); n < r; ++n) {
          var A = s[n].s;
          if (m[A] > t)
            d += E - (1 << g - m[A]), m[A] = t;
          else
            break;
        }
        for (d >>>= v; d > 0; ) {
          var x = s[n].s;
          m[x] < t ? d -= 1 << t - m[x]++ - 1 : ++n;
        }
        for (; n >= 0 && d; --n) {
          var y = s[n].s;
          m[y] == t && (--m[y], ++d);
        }
        g = t;
      }
      return [new M(m), g];
    }, $t = function(i, t, e) {
      return i.s == -1 ? Math.max($t(i.l, t, e + 1), $t(i.r, t, e + 1)) : t[i.s] = e;
    }, ui = function(i) {
      for (var t = i.length; t && !i[--t]; )
        ;
      for (var e = new V(++t), n = 0, r = i[0], s = 1, l = function(h) {
        e[n++] = h;
      }, a = 1; a <= t; ++a)
        if (i[a] == r && a != t)
          ++s;
        else {
          if (!r && s > 2) {
            for (; s > 138; s -= 138)
              l(32754);
            s > 2 && (l(s > 10 ? s - 11 << 5 | 28690 : s - 3 << 5 | 12305), s = 0);
          } else if (s > 3) {
            for (l(r), --s; s > 6; s -= 6)
              l(8304);
            s > 2 && (l(s - 3 << 5 | 8208), s = 0);
          }
          for (; s--; )
            l(r);
          s = 1, r = i[a];
        }
      return [e.subarray(0, n), t];
    }, dt = function(i, t) {
      for (var e = 0, n = 0; n < t.length; ++n)
        e += i[n] * t[n];
      return e;
    }, Wt = function(i, t, e) {
      var n = e.length, r = Ot(t + 2);
      i[r] = n & 255, i[r + 1] = n >>> 8, i[r + 2] = i[r] ^ 255, i[r + 3] = i[r + 1] ^ 255;
      for (var s = 0; s < n; ++s)
        i[r + s + 4] = e[s];
      return (r + 4 + n) * 8;
    }, ci = function(i, t, e, n, r, s, l, a, h, f, o) {
      at(t, o++, e), ++r[256];
      for (var c = Qt(r, 15), p = c[0], m = c[1], g = Qt(s, 15), d = g[0], v = g[1], E = ui(p), A = E[0], x = E[1], y = ui(d), L = y[0], z = y[1], U = new V(19), T = 0; T < A.length; ++T)
        U[A[T] & 31]++;
      for (var T = 0; T < L.length; ++T)
        U[L[T] & 31]++;
      for (var Z = Qt(U, 7), C = Z[0], b = Z[1], S = 19; S > 4 && !C[Dt[S - 1]]; --S)
        ;
      var q = f + 5 << 3, w = dt(r, ht) + dt(s, Nt) + l, O = dt(r, p) + dt(s, d) + l + 14 + 3 * S + dt(U, C) + (2 * U[16] + 3 * U[17] + 7 * U[18]);
      if (q <= w && q <= O)
        return Wt(t, o, i.subarray(h, h + f));
      var D, B, k, j;
      if (at(t, o, 1 + (O < w)), o += 2, O < w) {
        D = it(p, m, 0), B = p, k = it(d, v, 0), j = d;
        var J = it(C, b, 0);
        at(t, o, x - 257), at(t, o + 5, z - 1), at(t, o + 10, S - 4), o += 14;
        for (var T = 0; T < S; ++T)
          at(t, o + 3 * T, C[Dt[T]]);
        o += 3 * S;
        for (var K = [A, L], st = 0; st < 2; ++st)
          for (var rt = K[st], T = 0; T < rt.length; ++T) {
            var $ = rt[T] & 31;
            at(t, o, J[$]), o += C[$], $ > 15 && (at(t, o, rt[T] >>> 5 & 127), o += rt[T] >>> 12);
          }
      } else
        D = Zi, B = ht, k = Yi, j = Nt;
      for (var T = 0; T < a; ++T)
        if (n[T] > 255) {
          var $ = n[T] >>> 18 & 31;
          mt(t, o, D[$ + 257]), o += B[$ + 257], $ > 7 && (at(t, o, n[T] >>> 23 & 31), o += Ft[$]);
          var X = n[T] & 31;
          mt(t, o, k[X]), o += j[X], X > 3 && (mt(t, o, n[T] >>> 5 & 8191), o += yt[X]);
        } else
          mt(t, o, D[n[T]]), o += B[n[T]];
      return mt(t, o, D[256]), o + B[256];
    }, Ki = new _t([65540, 131080, 131088, 131104, 262176, 1048704, 1048832, 2114560, 2117632]), ft = new M(0), Hi = function(i, t, e, n, r, s) {
      var l = i.length, a = new M(n + l + 5 * (1 + Math.ceil(l / 7e3)) + r), h = a.subarray(n, a.length - r), f = 0;
      if (!t || l < 8)
        for (var o = 0; o <= l; o += 65535) {
          var c = o + 65535;
          c >= l && (h[f >> 3] = s), f = Wt(h, f + 1, i.subarray(o, c));
        }
      else {
        for (var p = Ki[t - 1], m = p >>> 13, g = p & 8191, d = (1 << e) - 1, v = new V(32768), E = new V(d + 1), A = Math.ceil(e / 3), x = 2 * A, y = function(oi) {
          return (i[oi] ^ i[oi + 1] << A ^ i[oi + 2] << x) & d;
        }, L = new _t(25e3), z = new V(288), U = new V(32), T = 0, Z = 0, o = 0, C = 0, b = 0, S = 0; o < l; ++o) {
          var q = y(o), w = o & 32767, O = E[q];
          if (v[w] = O, E[q] = w, b <= o) {
            var D = l - o;
            if ((T > 7e3 || C > 24576) && D > 423) {
              f = ci(i, h, 0, L, z, U, Z, C, S, o - S, f), C = T = Z = 0, S = o;
              for (var B = 0; B < 286; ++B)
                z[B] = 0;
              for (var B = 0; B < 30; ++B)
                U[B] = 0;
            }
            var k = 2, j = 0, J = g, K = w - O & 32767;
            if (D > 2 && q == y(o - K))
              for (var st = Math.min(m, D) - 1, rt = Math.min(32767, o), $ = Math.min(258, D); K <= rt && --J && w != O; ) {
                if (i[o + k] == i[o + k - K]) {
                  for (var X = 0; X < $ && i[o + X] == i[o + X - K]; ++X)
                    ;
                  if (X > k) {
                    if (k = X, j = K, X > st)
                      break;
                    for (var Rt = Math.min(K, X - 2), Mt = 0, B = 0; B < Rt; ++B) {
                      var gt = o - K + B + 32768 & 32767, Ee = v[gt], wi = gt - Ee + 32768 & 32767;
                      wi > Mt && (Mt = wi, O = gt);
                    }
                  }
                }
                w = O, O = v[w], K += w - O + 32768 & 32767;
              }
            if (j) {
              L[C++] = 268435456 | jt[k] << 18 | hi[j];
              var Ci = jt[k] & 31, Mi = hi[j] & 31;
              Z += Ft[Ci] + yt[Mi], ++z[257 + Ci], ++U[Mi], b = o + k, ++T;
            } else
              L[C++] = i[o], ++z[i[o]];
          }
        }
        f = ci(i, h, s, L, z, U, Z, C, S, o - S, f), !s && f & 7 && (f = Wt(h, f + 1, ft));
      }
      return et(a, 0, n + Ot(f) + r);
    }, Qi = function() {
      for (var i = new Int32Array(256), t = 0; t < 256; ++t) {
        for (var e = t, n = 9; --n; )
          e = (e & 1 && -306674912) ^ e >>> 1;
        i[t] = e;
      }
      return i;
    }(), At = function() {
      var i = -1;
      return { p: function(t) {
        for (var e = i, n = 0; n < t.length; ++n)
          e = Qi[e & 255 ^ t[n]] ^ e >>> 8;
        i = e;
      }, d: function() {
        return ~i;
      } };
    }, Ti = function() {
      var i = 1, t = 0;
      return { p: function(e) {
        for (var n = i, r = t, s = e.length | 0, l = 0; l != s; ) {
          for (var a = Math.min(l + 2655, s); l < a; ++l)
            r += n += e[l];
          n = (n & 65535) + 15 * (n >> 16), r = (r & 65535) + 15 * (r >> 16);
        }
        i = n, t = r;
      }, d: function() {
        return i %= 65521, t %= 65521, (i & 255) << 24 | i >>> 8 << 16 | (t & 255) << 8 | t >>> 8;
      } };
    }, pt = function(i, t, e, n, r) {
      return Hi(i, t.level == null ? 6 : t.level, t.mem == null ? Math.ceil(Math.max(8, Math.min(13, Math.log(i.length))) * 1.5) : 12 + t.mem, e, n, !r);
    }, Gt = function(i, t) {
      var e = {};
      for (var n in i)
        e[n] = i[n];
      for (var n in t)
        e[n] = t[n];
      return e;
    }, Oi = function(i, t, e) {
      for (var n = i(), r = i.toString(), s = r.slice(r.indexOf("[") + 1, r.lastIndexOf("]")).replace(/\s+/g, "").split(","), l = 0; l < n.length; ++l) {
        var a = n[l], h = s[l];
        if (typeof a == "function") {
          t += ";" + h + "=";
          var f = a.toString();
          if (a.prototype)
            if (f.indexOf("[native code]") != -1) {
              var o = f.indexOf(" ", 8) + 1;
              t += f.slice(o, f.indexOf("(", o));
            } else {
              t += f;
              for (var c in a.prototype)
                t += ";" + h + ".prototype." + c + "=" + a.prototype[c].toString();
            }
          else
            t += f;
        } else
          e[h] = a;
      }
      return [t, e];
    }, Vt = [], xe = function(i) {
      var t = [];
      for (var e in i)
        i[e].buffer && t.push((i[e] = new i[e].constructor(i[e])).buffer);
      return t;
    }, ji = function(i, t, e, n) {
      var r;
      if (!Vt[e]) {
        for (var s = "", l = {}, a = i.length - 1, h = 0; h < a; ++h)
          r = Oi(i[h], s, l), s = r[0], l = r[1];
        Vt[e] = Oi(i[a], s, l);
      }
      var f = Gt({}, Vt[e][1]);
      return Ue.default(Vt[e][0] + ";onmessage=function(e){for(var k in e.data)self[k]=e.data[k];onmessage=" + t.toString() + "}", e, f, xe(f), n);
    }, Ut = function() {
      return [M, V, _t, Ft, yt, Dt, gi, bi, ki, Xi, qt, Vi, it, Kt, tt, Ht, Ot, et, N, Pt, Ct, It, mi];
    }, xt = function() {
      return [M, V, _t, Ft, yt, Dt, jt, hi, Zi, ht, Yi, Nt, qt, Ki, ft, it, at, mt, Qt, $t, ui, dt, Wt, ci, Ot, et, Hi, pt, Lt, It];
    }, $i = function() {
      return [di, Ei, R, At, Qi];
    }, Wi = function() {
      return [Ni, ie];
    }, Ji = function() {
      return [_i, R, Ti];
    }, te = function() {
      return [ee];
    }, It = function(i) {
      return postMessage(i, [i.buffer]);
    }, mi = function(i) {
      return i && i.size && new M(i.size);
    }, St = function(i, t, e, n, r, s) {
      var l = ji(e, n, r, function(a, h) {
        l.terminate(), s(a, h);
      });
      return l.postMessage([i, t], t.consume ? [i.buffer] : []), function() {
        l.terminate();
      };
    }, nt = function(i) {
      return i.ondata = function(t, e) {
        return postMessage([t, e], [t.buffer]);
      }, function(t) {
        return i.push(t.data[0], t.data[1]);
      };
    }, wt = function(i, t, e, n, r) {
      var s, l = ji(i, n, r, function(a, h) {
        a ? (l.terminate(), t.ondata.call(t, a)) : (h[1] && l.terminate(), t.ondata.call(t, a, h[0], h[1]));
      });
      l.postMessage(e), t.push = function(a, h) {
        t.ondata || N(5), s && t.ondata(N(4, 0, 1), null, !!h), l.postMessage([a, s = h], [a.buffer]);
      }, t.terminate = function() {
        l.terminate();
      };
    }, Q = function(i, t) {
      return i[t] | i[t + 1] << 8;
    }, Y = function(i, t) {
      return (i[t] | i[t + 1] << 8 | i[t + 2] << 16 | i[t + 3] << 24) >>> 0;
    }, fi = function(i, t) {
      return Y(i, t) + Y(i, t + 4) * 4294967296;
    }, R = function(i, t, e) {
      for (; e; ++t)
        i[t] = e, e >>>= 8;
    }, di = function(i, t) {
      var e = t.filename;
      if (i[0] = 31, i[1] = 139, i[2] = 8, i[8] = t.level < 2 ? 4 : t.level == 9 ? 2 : 0, i[9] = 3, t.mtime != 0 && R(i, 4, Math.floor(new Date(t.mtime || Date.now()) / 1e3)), e) {
        i[3] = 8;
        for (var n = 0; n <= e.length; ++n)
          i[n + 10] = e.charCodeAt(n);
      }
    }, Ni = function(i) {
      (i[0] != 31 || i[1] != 139 || i[2] != 8) && N(6, "invalid gzip data");
      var t = i[3], e = 10;
      t & 4 && (e += i[10] | (i[11] << 8) + 2);
      for (var n = (t >> 3 & 1) + (t >> 4 & 1); n > 0; n -= !i[e++])
        ;
      return e + (t & 2);
    }, ie = function(i) {
      var t = i.length;
      return (i[t - 4] | i[t - 3] << 8 | i[t - 2] << 16 | i[t - 1] << 24) >>> 0;
    }, Ei = function(i) {
      return 10 + (i.filename && i.filename.length + 1 || 0);
    }, _i = function(i, t) {
      var e = t.level, n = e == 0 ? 0 : e < 6 ? 1 : e == 9 ? 3 : 2;
      i[0] = 120, i[1] = n << 6 | (n ? 32 - 2 * n : 1);
    }, ee = function(i) {
      ((i[0] & 15) != 8 || i[0] >>> 4 > 7 || (i[0] << 8 | i[1]) % 31) && N(6, "invalid zlib data"), i[1] & 32 && N(6, "invalid zlib data: preset dictionaries not supported");
    };
    function Fi(i, t) {
      return !t && typeof i == "function" && (t = i, i = {}), this.ondata = t, i;
    }
    var ot = function() {
      function i(t, e) {
        !e && typeof t == "function" && (e = t, t = {}), this.ondata = e, this.o = t || {};
      }
      return i.prototype.p = function(t, e) {
        this.ondata(pt(t, this.o, 0, 0, !e), e);
      }, i.prototype.push = function(t, e) {
        this.ondata || N(5), this.d && N(4), this.d = e, this.p(t, e || false);
      }, i;
    }();
    _.Deflate = ot;
    var ne = function() {
      function i(t, e) {
        wt([xt, function() {
          return [nt, ot];
        }], this, Fi.call(this, t, e), function(n) {
          var r = new ot(n.data);
          onmessage = nt(r);
        }, 6);
      }
      return i;
    }();
    _.AsyncDeflate = ne;
    function se(i, t, e) {
      return e || (e = t, t = {}), typeof e != "function" && N(7), St(i, t, [xt], function(n) {
        return It(Lt(n.data[0], n.data[1]));
      }, 0, e);
    }
    _.deflate = se;
    function Lt(i, t) {
      return pt(i, t || {}, 0, 0);
    }
    _.deflateSync = Lt;
    var W = function() {
      function i(t) {
        this.s = {}, this.p = new M(0), this.ondata = t;
      }
      return i.prototype.e = function(t) {
        this.ondata || N(5), this.d && N(4);
        var e = this.p.length, n = new M(e + t.length);
        n.set(this.p), n.set(t, e), this.p = n;
      }, i.prototype.c = function(t) {
        this.d = this.s.i = t || false;
        var e = this.s.b, n = Pt(this.p, this.o, this.s);
        this.ondata(et(n, e, this.s.b), this.d), this.o = et(n, this.s.b - 32768), this.s.b = this.o.length, this.p = et(this.p, this.s.p / 8 | 0), this.s.p &= 7;
      }, i.prototype.push = function(t, e) {
        this.e(t), this.c(e);
      }, i;
    }();
    _.Inflate = W;
    var yi = function() {
      function i(t) {
        this.ondata = t, wt([Ut, function() {
          return [nt, W];
        }], this, 0, function() {
          var e = new W();
          onmessage = nt(e);
        }, 7);
      }
      return i;
    }();
    _.AsyncInflate = yi;
    function Ai(i, t, e) {
      return e || (e = t, t = {}), typeof e != "function" && N(7), St(i, t, [Ut], function(n) {
        return It(Ct(n.data[0], mi(n.data[1])));
      }, 1, e);
    }
    _.inflate = Ai;
    function Ct(i, t) {
      return Pt(i, t);
    }
    _.inflateSync = Ct;
    var Jt = function() {
      function i(t, e) {
        this.c = At(), this.l = 0, this.v = 1, ot.call(this, t, e);
      }
      return i.prototype.push = function(t, e) {
        ot.prototype.push.call(this, t, e);
      }, i.prototype.p = function(t, e) {
        this.c.p(t), this.l += t.length;
        var n = pt(t, this.o, this.v && Ei(this.o), e && 8, !e);
        this.v && (di(n, this.o), this.v = 0), e && (R(n, n.length - 8, this.c.d()), R(n, n.length - 4, this.l)), this.ondata(n, e);
      }, i;
    }();
    _.Gzip = Jt;
    _.Compress = Jt;
    var re = function() {
      function i(t, e) {
        wt([xt, $i, function() {
          return [nt, ot, Jt];
        }], this, Fi.call(this, t, e), function(n) {
          var r = new Jt(n.data);
          onmessage = nt(r);
        }, 8);
      }
      return i;
    }();
    _.AsyncGzip = re;
    _.AsyncCompress = re;
    function ae(i, t, e) {
      return e || (e = t, t = {}), typeof e != "function" && N(7), St(i, t, [xt, $i, function() {
        return [ti];
      }], function(n) {
        return It(ti(n.data[0], n.data[1]));
      }, 2, e);
    }
    _.gzip = ae;
    _.compress = ae;
    function ti(i, t) {
      t || (t = {});
      var e = At(), n = i.length;
      e.p(i);
      var r = pt(i, t, Ei(t), 8), s = r.length;
      return di(r, t), R(r, s - 8, e.d()), R(r, s - 4, n), r;
    }
    _.gzipSync = ti;
    _.compressSync = ti;
    var ii = function() {
      function i(t) {
        this.v = 1, W.call(this, t);
      }
      return i.prototype.push = function(t, e) {
        if (W.prototype.e.call(this, t), this.v) {
          var n = this.p.length > 3 ? Ni(this.p) : 4;
          if (n >= this.p.length && !e)
            return;
          this.p = this.p.subarray(n), this.v = 0;
        }
        e && (this.p.length < 8 && N(6, "invalid gzip data"), this.p = this.p.subarray(0, -8)), W.prototype.c.call(this, e);
      }, i;
    }();
    _.Gunzip = ii;
    var oe = function() {
      function i(t) {
        this.ondata = t, wt([Ut, Wi, function() {
          return [nt, W, ii];
        }], this, 0, function() {
          var e = new ii();
          onmessage = nt(e);
        }, 9);
      }
      return i;
    }();
    _.AsyncGunzip = oe;
    function le(i, t, e) {
      return e || (e = t, t = {}), typeof e != "function" && N(7), St(i, t, [Ut, Wi, function() {
        return [ei];
      }], function(n) {
        return It(ei(n.data[0]));
      }, 3, e);
    }
    _.gunzip = le;
    function ei(i, t) {
      return Pt(i.subarray(Ni(i), -8), t || new M(ie(i)));
    }
    _.gunzipSync = ei;
    var Ii = function() {
      function i(t, e) {
        this.c = Ti(), this.v = 1, ot.call(this, t, e);
      }
      return i.prototype.push = function(t, e) {
        ot.prototype.push.call(this, t, e);
      }, i.prototype.p = function(t, e) {
        this.c.p(t);
        var n = pt(t, this.o, this.v && 2, e && 4, !e);
        this.v && (_i(n, this.o), this.v = 0), e && R(n, n.length - 4, this.c.d()), this.ondata(n, e);
      }, i;
    }();
    _.Zlib = Ii;
    var Se = function() {
      function i(t, e) {
        wt([xt, Ji, function() {
          return [nt, ot, Ii];
        }], this, Fi.call(this, t, e), function(n) {
          var r = new Ii(n.data);
          onmessage = nt(r);
        }, 10);
      }
      return i;
    }();
    _.AsyncZlib = Se;
    function we(i, t, e) {
      return e || (e = t, t = {}), typeof e != "function" && N(7), St(i, t, [xt, Ji, function() {
        return [vi];
      }], function(n) {
        return It(vi(n.data[0], n.data[1]));
      }, 4, e);
    }
    _.zlib = we;
    function vi(i, t) {
      t || (t = {});
      var e = Ti();
      e.p(i);
      var n = pt(i, t, 2, 4);
      return _i(n, t), R(n, n.length - 4, e.d()), n;
    }
    _.zlibSync = vi;
    var ni = function() {
      function i(t) {
        this.v = 1, W.call(this, t);
      }
      return i.prototype.push = function(t, e) {
        if (W.prototype.e.call(this, t), this.v) {
          if (this.p.length < 2 && !e)
            return;
          this.p = this.p.subarray(2), this.v = 0;
        }
        e && (this.p.length < 4 && N(6, "invalid zlib data"), this.p = this.p.subarray(0, -4)), W.prototype.c.call(this, e);
      }, i;
    }();
    _.Unzlib = ni;
    var fe = function() {
      function i(t) {
        this.ondata = t, wt([Ut, te, function() {
          return [nt, W, ni];
        }], this, 0, function() {
          var e = new ni();
          onmessage = nt(e);
        }, 11);
      }
      return i;
    }();
    _.AsyncUnzlib = fe;
    function he(i, t, e) {
      return e || (e = t, t = {}), typeof e != "function" && N(7), St(i, t, [Ut, te, function() {
        return [si];
      }], function(n) {
        return It(si(n.data[0], mi(n.data[1])));
      }, 5, e);
    }
    _.unzlib = he;
    function si(i, t) {
      return Pt((ee(i), i.subarray(2, -4)), t);
    }
    _.unzlibSync = si;
    var ue = function() {
      function i(t) {
        this.G = ii, this.I = W, this.Z = ni, this.ondata = t;
      }
      return i.prototype.push = function(t, e) {
        if (this.ondata || N(5), this.s)
          this.s.push(t, e);
        else {
          if (this.p && this.p.length) {
            var n = new M(this.p.length + t.length);
            n.set(this.p), n.set(t, this.p.length);
          } else
            this.p = t;
          if (this.p.length > 2) {
            var r = this, s = function() {
              r.ondata.apply(r, arguments);
            };
            this.s = this.p[0] == 31 && this.p[1] == 139 && this.p[2] == 8 ? new this.G(s) : (this.p[0] & 15) != 8 || this.p[0] >> 4 > 7 || (this.p[0] << 8 | this.p[1]) % 31 ? new this.I(s) : new this.Z(s), this.s.push(this.p, e), this.p = null;
          }
        }
      }, i;
    }();
    _.Decompress = ue;
    var Ce = function() {
      function i(t) {
        this.G = oe, this.I = yi, this.Z = fe, this.ondata = t;
      }
      return i.prototype.push = function(t, e) {
        ue.prototype.push.call(this, t, e);
      }, i;
    }();
    _.AsyncDecompress = Ce;
    function Me(i, t, e) {
      return e || (e = t, t = {}), typeof e != "function" && N(7), i[0] == 31 && i[1] == 139 && i[2] == 8 ? le(i, t, e) : (i[0] & 15) != 8 || i[0] >> 4 > 7 || (i[0] << 8 | i[1]) % 31 ? Ai(i, t, e) : he(i, t, e);
    }
    _.decompress = Me;
    function ze(i, t) {
      return i[0] == 31 && i[1] == 139 && i[2] == 8 ? ei(i, t) : (i[0] & 15) != 8 || i[0] >> 4 > 7 || (i[0] << 8 | i[1]) % 31 ? Ct(i, t) : si(i, t);
    }
    _.decompressSync = ze;
    var Ui = function(i, t, e, n) {
      for (var r in i) {
        var s = i[r], l = t + r, a = n;
        Array.isArray(s) && (a = Gt(n, s[1]), s = s[0]), s instanceof M ? e[l] = [s, a] : (e[l += "/"] = [new M(0), a], Ui(s, l, e, n));
      }
    }, Pi = typeof TextEncoder < "u" && new TextEncoder(), pi = typeof TextDecoder < "u" && new TextDecoder(), ce = 0;
    try {
      pi.decode(ft, { stream: true }), ce = 1;
    } catch {
    }
    var Ie = function(i) {
      for (var t = "", e = 0; ; ) {
        var n = i[e++], r = (n > 127) + (n > 223) + (n > 239);
        if (e + r > i.length)
          return [t, et(i, e - 1)];
        r ? r == 3 ? (n = ((n & 15) << 18 | (i[e++] & 63) << 12 | (i[e++] & 63) << 6 | i[e++] & 63) - 65536, t += String.fromCharCode(55296 | n >> 10, 56320 | n & 1023)) : r & 1 ? t += String.fromCharCode((n & 31) << 6 | i[e++] & 63) : t += String.fromCharCode((n & 15) << 12 | (i[e++] & 63) << 6 | i[e++] & 63) : t += String.fromCharCode(n);
      }
    }, De = function() {
      function i(t) {
        this.ondata = t, ce ? this.t = new TextDecoder() : this.p = ft;
      }
      return i.prototype.push = function(t, e) {
        if (this.ondata || N(5), e = !!e, this.t) {
          this.ondata(this.t.decode(t, { stream: true }), e), e && (this.t.decode().length && N(8), this.t = null);
          return;
        }
        this.p || N(4);
        var n = new M(this.p.length + t.length);
        n.set(this.p), n.set(t, this.p.length);
        var r = Ie(n), s = r[0], l = r[1];
        e ? (l.length && N(8), this.p = null) : this.p = l, this.ondata(s, e);
      }, i;
    }();
    _.DecodeUTF8 = De;
    var qe = function() {
      function i(t) {
        this.ondata = t;
      }
      return i.prototype.push = function(t, e) {
        this.ondata || N(5), this.d && N(4), this.ondata(ct(t), this.d = e || false);
      }, i;
    }();
    _.EncodeUTF8 = qe;
    function ct(i, t) {
      if (t) {
        for (var e = new M(i.length), n = 0; n < i.length; ++n)
          e[n] = i.charCodeAt(n);
        return e;
      }
      if (Pi)
        return Pi.encode(i);
      for (var r = i.length, s = new M(i.length + (i.length >> 1)), l = 0, a = function(o) {
        s[l++] = o;
      }, n = 0; n < r; ++n) {
        if (l + 5 > s.length) {
          var h = new M(l + 8 + (r - n << 1));
          h.set(s), s = h;
        }
        var f = i.charCodeAt(n);
        f < 128 || t ? a(f) : f < 2048 ? (a(192 | f >> 6), a(128 | f & 63)) : f > 55295 && f < 57344 ? (f = 65536 + (f & 1023 << 10) | i.charCodeAt(++n) & 1023, a(240 | f >> 18), a(128 | f >> 12 & 63), a(128 | f >> 6 & 63), a(128 | f & 63)) : (a(224 | f >> 12), a(128 | f >> 6 & 63), a(128 | f & 63));
      }
      return et(s, 0, l);
    }
    _.strToU8 = ct;
    function xi(i, t) {
      if (t) {
        for (var e = "", n = 0; n < i.length; n += 16384)
          e += String.fromCharCode.apply(null, i.subarray(n, n + 16384));
        return e;
      } else {
        if (pi)
          return pi.decode(i);
        var r = Ie(i), s = r[0], l = r[1];
        return l.length && N(8), s;
      }
    }
    _.strFromU8 = xi;
    var ve = function(i) {
      return i == 1 ? 3 : i < 6 ? 2 : i == 9 ? 1 : 0;
    }, pe = function(i, t) {
      return t + 30 + Q(i, t + 26) + Q(i, t + 28);
    }, ge = function(i, t, e) {
      var n = Q(i, t + 28), r = xi(i.subarray(t + 46, t + 46 + n), !(Q(i, t + 8) & 2048)), s = t + 46 + n, l = Y(i, t + 20), a = e && l == 4294967295 ? Te(i, s) : [l, Y(i, t + 24), Y(i, t + 42)], h = a[0], f = a[1], o = a[2];
      return [Q(i, t + 10), h, f, r, s + Q(i, t + 30) + Q(i, t + 32), o];
    }, Te = function(i, t) {
      for (; Q(i, t) != 1; t += 4 + Q(i, t + 2))
        ;
      return [fi(i, t + 12), fi(i, t + 4), fi(i, t + 20)];
    }, ut = function(i) {
      var t = 0;
      if (i)
        for (var e in i) {
          var n = i[e].length;
          n > 65535 && N(9), t += n + 4;
        }
      return t;
    }, Et = function(i, t, e, n, r, s, l, a) {
      var h = n.length, f = e.extra, o = a && a.length, c = ut(f);
      R(i, t, l != null ? 33639248 : 67324752), t += 4, l != null && (i[t++] = 20, i[t++] = e.os), i[t] = 20, t += 2, i[t++] = e.flag << 1 | (s == null && 8), i[t++] = r && 8, i[t++] = e.compression & 255, i[t++] = e.compression >> 8;
      var p = new Date(e.mtime == null ? Date.now() : e.mtime), m = p.getFullYear() - 1980;
      if ((m < 0 || m > 119) && N(10), R(i, t, m << 25 | p.getMonth() + 1 << 21 | p.getDate() << 16 | p.getHours() << 11 | p.getMinutes() << 5 | p.getSeconds() >>> 1), t += 4, s != null && (R(i, t, e.crc), R(i, t + 4, s), R(i, t + 8, e.size)), R(i, t + 12, h), R(i, t + 14, c), t += 16, l != null && (R(i, t, o), R(i, t + 6, e.attrs), R(i, t + 10, l), t += 14), i.set(n, t), t += h, c)
        for (var g in f) {
          var d = f[g], v = d.length;
          R(i, t, +g), R(i, t + 2, v), i.set(d, t + 4), t += 4 + v;
        }
      return o && (i.set(a, t), t += o), t;
    }, Si = function(i, t, e, n, r) {
      R(i, t, 101010256), R(i, t + 8, e), R(i, t + 10, e), R(i, t + 12, n), R(i, t + 16, r);
    }, Bt = function() {
      function i(t) {
        this.filename = t, this.c = At(), this.size = 0, this.compression = 0;
      }
      return i.prototype.process = function(t, e) {
        this.ondata(null, t, e);
      }, i.prototype.push = function(t, e) {
        this.ondata || N(5), this.c.p(t), this.size += t.length, e && (this.crc = this.c.d()), this.process(t, e || false);
      }, i;
    }();
    _.ZipPassThrough = Bt;
    var Be = function() {
      function i(t, e) {
        var n = this;
        e || (e = {}), Bt.call(this, t), this.d = new ot(e, function(r, s) {
          n.ondata(null, r, s);
        }), this.compression = 8, this.flag = ve(e.level);
      }
      return i.prototype.process = function(t, e) {
        try {
          this.d.push(t, e);
        } catch (n) {
          this.ondata(n, null, e);
        }
      }, i.prototype.push = function(t, e) {
        Bt.prototype.push.call(this, t, e);
      }, i;
    }();
    _.ZipDeflate = Be;
    var Oe = function() {
      function i(t, e) {
        var n = this;
        e || (e = {}), Bt.call(this, t), this.d = new ne(e, function(r, s, l) {
          n.ondata(r, s, l);
        }), this.compression = 8, this.flag = ve(e.level), this.terminate = this.d.terminate;
      }
      return i.prototype.process = function(t, e) {
        this.d.push(t, e);
      }, i.prototype.push = function(t, e) {
        Bt.prototype.push.call(this, t, e);
      }, i;
    }();
    _.AsyncZipDeflate = Oe;
    var Pe = function() {
      function i(t) {
        this.ondata = t, this.u = [], this.d = 1;
      }
      return i.prototype.add = function(t) {
        var e = this;
        if (this.ondata || N(5), this.d & 2)
          this.ondata(N(4 + (this.d & 1) * 8, 0, 1), null, false);
        else {
          var n = ct(t.filename), r = n.length, s = t.comment, l = s && ct(s), a = r != t.filename.length || l && s.length != l.length, h = r + ut(t.extra) + 30;
          r > 65535 && this.ondata(N(11, 0, 1), null, false);
          var f = new M(h);
          Et(f, 0, t, n, a);
          var o = [f], c = function() {
            for (var v = 0, E = o; v < E.length; v++) {
              var A = E[v];
              e.ondata(null, A, false);
            }
            o = [];
          }, p = this.d;
          this.d = 0;
          var m = this.u.length, g = Gt(t, { f: n, u: a, o: l, t: function() {
            t.terminate && t.terminate();
          }, r: function() {
            if (c(), p) {
              var v = e.u[m + 1];
              v ? v.r() : e.d = 1;
            }
            p = 1;
          } }), d = 0;
          t.ondata = function(v, E, A) {
            if (v)
              e.ondata(v, E, A), e.terminate();
            else if (d += E.length, o.push(E), A) {
              var x = new M(16);
              R(x, 0, 134695760), R(x, 4, t.crc), R(x, 8, d), R(x, 12, t.size), o.push(x), g.c = d, g.b = h + d + 16, g.crc = t.crc, g.size = t.size, p && g.r(), p = 1;
            } else
              p && c();
          }, this.u.push(g);
        }
      }, i.prototype.end = function() {
        var t = this;
        if (this.d & 2) {
          this.ondata(N(4 + (this.d & 1) * 8, 0, 1), null, true);
          return;
        }
        this.d ? this.e() : this.u.push({ r: function() {
          t.d & 1 && (t.u.splice(-1, 1), t.e());
        }, t: function() {
        } }), this.d = 3;
      }, i.prototype.e = function() {
        for (var t = 0, e = 0, n = 0, r = 0, s = this.u; r < s.length; r++) {
          var l = s[r];
          n += 46 + l.f.length + ut(l.extra) + (l.o ? l.o.length : 0);
        }
        for (var a = new M(n + 22), h = 0, f = this.u; h < f.length; h++) {
          var l = f[h];
          Et(a, t, l, l.f, l.u, l.c, e, l.o), t += 46 + l.f.length + ut(l.extra) + (l.o ? l.o.length : 0), e += l.b;
        }
        Si(a, t, this.u.length, n, e), this.ondata(null, a, true), this.d = 2;
      }, i.prototype.terminate = function() {
        for (var t = 0, e = this.u; t < e.length; t++) {
          var n = e[t];
          n.t();
        }
        this.d = 2;
      }, i;
    }();
    _.Zip = Pe;
    function Ge(i, t, e) {
      e || (e = t, t = {}), typeof e != "function" && N(7);
      var n = {};
      Ui(i, "", n, t);
      var r = Object.keys(n), s = r.length, l = 0, a = 0, h = s, f = new Array(s), o = [], c = function() {
        for (var v = 0; v < o.length; ++v)
          o[v]();
      }, p = function(v, E) {
        ri(function() {
          e(v, E);
        });
      };
      ri(function() {
        p = e;
      });
      var m = function() {
        var v = new M(a + 22), E = l, A = a - l;
        a = 0;
        for (var x = 0; x < h; ++x) {
          var y = f[x];
          try {
            var L = y.c.length;
            Et(v, a, y, y.f, y.u, L);
            var z = 30 + y.f.length + ut(y.extra), U = a + z;
            v.set(y.c, U), Et(v, l, y, y.f, y.u, L, a, y.m), l += 16 + z + (y.m ? y.m.length : 0), a = U + L;
          } catch (T) {
            return p(T, null);
          }
        }
        Si(v, l, f.length, A, E), p(null, v);
      };
      s || m();
      for (var g = function(v) {
        var E = r[v], A = n[E], x = A[0], y = A[1], L = At(), z = x.length;
        L.p(x);
        var U = ct(E), T = U.length, Z = y.comment, C = Z && ct(Z), b = C && C.length, S = ut(y.extra), q = y.level == 0 ? 0 : 8, w = function(O, D) {
          if (O)
            c(), p(O, null);
          else {
            var B = D.length;
            f[v] = Gt(y, { size: z, crc: L.d(), c: D, f: U, m: C, u: T != E.length || C && Z.length != b, compression: q }), l += 30 + T + S + B, a += 76 + 2 * (T + S) + (b || 0) + B, --s || m();
          }
        };
        if (T > 65535 && w(N(11, 0, 1), null), !q)
          w(null, x);
        else if (z < 16e4)
          try {
            w(null, Lt(x, y));
          } catch (O) {
            w(O, null);
          }
        else
          o.push(se(x, y, w));
      }, d = 0; d < h; ++d)
        g(d);
      return c;
    }
    _.zip = Ge;
    function Le(i, t) {
      t || (t = {});
      var e = {}, n = [];
      Ui(i, "", e, t);
      var r = 0, s = 0;
      for (var l in e) {
        var a = e[l], h = a[0], f = a[1], o = f.level == 0 ? 0 : 8, c = ct(l), p = c.length, m = f.comment, g = m && ct(m), d = g && g.length, v = ut(f.extra);
        p > 65535 && N(11);
        var E = o ? Lt(h, f) : h, A = E.length, x = At();
        x.p(h), n.push(Gt(f, { size: h.length, crc: x.d(), c: E, f: c, m: g, u: p != l.length || g && m.length != d, o: r, compression: o })), r += 30 + p + v + A, s += 76 + 2 * (p + v) + (d || 0) + A;
      }
      for (var y = new M(s + 22), L = r, z = s - r, U = 0; U < n.length; ++U) {
        var c = n[U];
        Et(y, c.o, c, c.f, c.u, c.c.length);
        var T = 30 + c.f.length + ut(c.extra);
        y.set(c.c, c.o + T), Et(y, r, c, c.f, c.u, c.c.length, c.o, c.m), r += 16 + T + (c.m ? c.m.length : 0);
      }
      return Si(y, r, n.length, z, L), y;
    }
    _.zipSync = Le;
    var me = function() {
      function i() {
      }
      return i.prototype.push = function(t, e) {
        this.ondata(null, t, e);
      }, i.compression = 0, i;
    }();
    _.UnzipPassThrough = me;
    var Re = function() {
      function i() {
        var t = this;
        this.i = new W(function(e, n) {
          t.ondata(null, e, n);
        });
      }
      return i.prototype.push = function(t, e) {
        try {
          this.i.push(t, e);
        } catch (n) {
          this.ondata(n, null, e);
        }
      }, i.compression = 8, i;
    }();
    _.UnzipInflate = Re;
    var be = function() {
      function i(t, e) {
        var n = this;
        e < 32e4 ? this.i = new W(function(r, s) {
          n.ondata(null, r, s);
        }) : (this.i = new yi(function(r, s, l) {
          n.ondata(r, s, l);
        }), this.terminate = this.i.terminate);
      }
      return i.prototype.push = function(t, e) {
        this.i.terminate && (t = et(t, 0)), this.i.push(t, e);
      }, i.compression = 8, i;
    }();
    _.AsyncUnzipInflate = be;
    var Ze = function() {
      function i(t) {
        this.onfile = t, this.k = [], this.o = { 0: me }, this.p = ft;
      }
      return i.prototype.push = function(t, e) {
        var n = this;
        if (this.onfile || N(5), this.p || N(4), this.c > 0) {
          var r = Math.min(this.c, t.length), s = t.subarray(0, r);
          if (this.c -= r, this.d ? this.d.push(s, !this.c) : this.k[0].push(s), t = t.subarray(r), t.length)
            return this.push(t, e);
        } else {
          var l = 0, a = 0, h = void 0, f = void 0;
          this.p.length ? t.length ? (f = new M(this.p.length + t.length), f.set(this.p), f.set(t, this.p.length)) : f = this.p : f = t;
          for (var o = f.length, c = this.c, p = c && this.d, m = function() {
            var E, A = Y(f, a);
            if (A == 67324752) {
              l = 1, h = a, g.d = null, g.c = 0;
              var x = Q(f, a + 6), y = Q(f, a + 8), L = x & 2048, z = x & 8, U = Q(f, a + 26), T = Q(f, a + 28);
              if (o > a + 30 + U + T) {
                var Z = [];
                g.k.unshift(Z), l = 2;
                var C = Y(f, a + 18), b = Y(f, a + 22), S = xi(f.subarray(a + 30, a += 30 + U), !L);
                C == 4294967295 ? (E = z ? [-2] : Te(f, a), C = E[0], b = E[1]) : z && (C = -1), a += T, g.c = C;
                var q, w = { name: S, compression: y, start: function() {
                  if (w.ondata || N(5), !C)
                    w.ondata(null, ft, true);
                  else {
                    var O = n.o[y];
                    O || w.ondata(N(14, "unknown compression type " + y, 1), null, false), q = C < 0 ? new O(S) : new O(S, C, b), q.ondata = function(j, J, K) {
                      w.ondata(j, J, K);
                    };
                    for (var D = 0, B = Z; D < B.length; D++) {
                      var k = B[D];
                      q.push(k, false);
                    }
                    n.k[0] == Z && n.c ? n.d = q : q.push(ft, true);
                  }
                }, terminate: function() {
                  q && q.terminate && q.terminate();
                } };
                C >= 0 && (w.size = C, w.originalSize = b), g.onfile(w);
              }
              return "break";
            } else if (c) {
              if (A == 134695760)
                return h = a += 12 + (c == -2 && 8), l = 3, g.c = 0, "break";
              if (A == 33639248)
                return h = a -= 4, l = 3, g.c = 0, "break";
            }
          }, g = this; a < o - 4; ++a) {
            var d = m();
            if (d === "break")
              break;
          }
          if (this.p = ft, c < 0) {
            var v = l ? f.subarray(0, h - 12 - (c == -2 && 8) - (Y(f, h - 16) == 134695760 && 4)) : f.subarray(0, a);
            p ? p.push(v, !!l) : this.k[+(l == 2)].push(v);
          }
          if (l & 2)
            return this.push(f.subarray(a), e);
          this.p = f.subarray(a);
        }
        e && (this.c && N(13), this.p = null);
      }, i.prototype.register = function(t) {
        this.o[t.compression] = t;
      }, i;
    }();
    _.Unzip = Ze;
    var ri = typeof queueMicrotask == "function" ? queueMicrotask : typeof setTimeout == "function" ? setTimeout : function(i) {
      i();
    };
    function ke(i, t, e) {
      e || (e = t, t = {}), typeof e != "function" && N(7);
      var n = [], r = function() {
        for (var d = 0; d < n.length; ++d)
          n[d]();
      }, s = {}, l = function(d, v) {
        ri(function() {
          e(d, v);
        });
      };
      ri(function() {
        l = e;
      });
      for (var a = i.length - 22; Y(i, a) != 101010256; --a)
        if (!a || i.length - a > 65558)
          return l(N(13, 0, 1), null), r;
      var h = Q(i, a + 8);
      if (h) {
        var f = h, o = Y(i, a + 16), c = o == 4294967295;
        if (c) {
          if (a = Y(i, a - 12), Y(i, a) != 101075792)
            return l(N(13, 0, 1), null), r;
          f = h = Y(i, a + 32), o = Y(i, a + 48);
        }
        for (var p = t && t.filter, m = function(d) {
          var v = ge(i, o, c), E = v[0], A = v[1], x = v[2], y = v[3], L = v[4], z = v[5], U = pe(i, z);
          o = L;
          var T = function(C, b) {
            C ? (r(), l(C, null)) : (b && (s[y] = b), --h || l(null, s));
          };
          if (!p || p({ name: y, size: A, originalSize: x, compression: E }))
            if (!E)
              T(null, et(i, U, U + A));
            else if (E == 8) {
              var Z = i.subarray(U, U + A);
              if (A < 32e4)
                try {
                  T(null, Ct(Z, new M(x)));
                } catch (C) {
                  T(C, null);
                }
              else
                n.push(Ai(Z, { size: x }, T));
            } else
              T(N(14, "unknown compression type " + E, 1), null);
          else
            T(null, null);
        }, g = 0; g < f; ++g)
          m(g);
      } else
        l(null, {});
      return r;
    }
    _.unzip = ke;
    function Ye(i, t) {
      for (var e = {}, n = i.length - 22; Y(i, n) != 101010256; --n)
        (!n || i.length - n > 65558) && N(13);
      var r = Q(i, n + 8);
      if (!r)
        return {};
      var s = Y(i, n + 16), l = s == 4294967295;
      l && (n = Y(i, n - 12), Y(i, n) != 101075792 && N(13), r = Y(i, n + 32), s = Y(i, n + 48));
      for (var a = t && t.filter, h = 0; h < r; ++h) {
        var f = ge(i, s, l), o = f[0], c = f[1], p = f[2], m = f[3], g = f[4], d = f[5], v = pe(i, d);
        s = g, (!a || a({ name: m, size: c, originalSize: p, compression: o })) && (o ? o == 8 ? e[m] = Ct(i.subarray(v, v + c), new M(p)) : N(14, "unknown compression type " + o) : e[m] = et(i, v, v + c));
      }
      return e;
    }
    _.unzipSync = Ye;
  });
  var Ve = vt((rn, ai) => {
    var F = F || {};
    F.NIFTI1 = F.NIFTI1 || (typeof H < "u" ? li() : null);
    F.NIFTI2 = F.NIFTI2 || (typeof H < "u" ? zi() : null);
    F.NIFTIEXTENSION = F.NIFTIEXTENSION || (typeof H < "u" ? Tt() : null);
    F.Utils = F.Utils || (typeof H < "u" ? kt() : null);
    var Ne = Ne || (typeof H < "u" ? de() : null);
    F.isNIFTI1 = function(i, t = false) {
      var e, n, r, s;
      return i.byteLength < F.NIFTI1.STANDARD_HEADER_SIZE ? false : (e = new DataView(i), e && (n = e.getUint8(F.NIFTI1.MAGIC_NUMBER_LOCATION)), r = e.getUint8(F.NIFTI1.MAGIC_NUMBER_LOCATION + 1), s = e.getUint8(F.NIFTI1.MAGIC_NUMBER_LOCATION + 2), t && n === F.NIFTI1.MAGIC_NUMBER2[0] && r === F.NIFTI1.MAGIC_NUMBER2[1] && s === F.NIFTI1.MAGIC_NUMBER2[2] ? true : n === F.NIFTI1.MAGIC_NUMBER[0] && r === F.NIFTI1.MAGIC_NUMBER[1] && s === F.NIFTI1.MAGIC_NUMBER[2]);
    };
    F.isNIFTI2 = function(i, t = false) {
      var e, n, r, s;
      return i.byteLength < F.NIFTI1.STANDARD_HEADER_SIZE ? false : (e = new DataView(i), n = e.getUint8(F.NIFTI2.MAGIC_NUMBER_LOCATION), r = e.getUint8(F.NIFTI2.MAGIC_NUMBER_LOCATION + 1), s = e.getUint8(F.NIFTI2.MAGIC_NUMBER_LOCATION + 2), t && n === F.NIFTI2.MAGIC_NUMBER2[0] && r === F.NIFTI2.MAGIC_NUMBER2[1] && s === F.NIFTI2.MAGIC_NUMBER2[2] ? true : n === F.NIFTI2.MAGIC_NUMBER[0] && r === F.NIFTI2.MAGIC_NUMBER[1] && s === F.NIFTI2.MAGIC_NUMBER[2]);
    };
    F.isNIFTI = function(i, t = false) {
      return F.isNIFTI1(i, t) || F.isNIFTI2(i, t);
    };
    F.isCompressed = function(i) {
      var t, e, n;
      return !!(i && (t = new DataView(i), e = t.getUint8(0), n = t.getUint8(1), e === F.Utils.GUNZIP_MAGIC_COOKIE1 || n === F.Utils.GUNZIP_MAGIC_COOKIE2));
    };
    F.decompress = function(i) {
      return Ne.decompressSync(new Uint8Array(i)).buffer;
    };
    F.readHeader = function(i, t = false) {
      var e = null;
      return F.isCompressed(i) && (i = F.decompress(i)), F.isNIFTI1(i, t) ? e = new F.NIFTI1() : F.isNIFTI2(i, t) && (e = new F.NIFTI2()), e ? e.readHeader(i) : console.error("That file does not appear to be NIFTI!"), e;
    };
    F.hasExtension = function(i) {
      return i.extensionFlag[0] != 0;
    };
    F.readImage = function(i, t) {
      var e = i.vox_offset, n = 1, r = 1;
      i.dims[4] && (n = i.dims[4]), i.dims[5] && (r = i.dims[5]);
      var s = i.dims[1] * i.dims[2] * i.dims[3] * n * r * (i.numBitsPerVoxel / 8);
      return t.slice(e, e + s);
    };
    F.readExtension = function(i, t) {
      var e = i.getExtensionLocation(), n = i.extensionSize;
      return t.slice(e, e + n);
    };
    F.readExtensionData = function(i, t) {
      var e = i.getExtensionLocation(), n = i.extensionSize;
      return t.slice(e + 8, e + n);
    };
    var Xe = typeof ai;
    Xe !== "undefined" && ai.exports && (ai.exports = F);
  });
  Ve();
})();

// src/files/nifti.ts
async function loadHeader(file) {
  try {
    const buf = await file.readBytes(1024);
    const header = globalThis.nifti.readHeader(buf.buffer);
    if (header) {
      header.pixdim = header.pixDims;
      header.dim = header.dims;
    }
    return header;
  } catch (err) {
    logger.warning(`NIfTI file could not be opened or read ${file.path}`);
    logger.debug(err);
    return;
  }
}

// src/schema/associations.ts
var associationLookup = {
  events: {
    extensions: [".tsv"],
    inherit: true,
    load: (file) => {
      return file.text().then((text) => parseTSV(text));
    }
  },
  aslcontext: {
    extensions: [".tsv"],
    inherit: true,
    load: (file) => {
      return Promise.resolve({ path: file.path, n_rows: 0, volume_type: [] });
    }
  },
  m0scan: {
    extensions: [".nii", ".nii.gz"],
    inherit: false,
    load: (file) => {
      return Promise.resolve({ path: file.path });
    }
  },
  magnitude: {
    extensions: [".nii", ".nii.gz"],
    inherit: false,
    load: (file) => {
      return Promise.resolve({ path: file.path, onset: "silly" });
    }
  },
  magnitude1: {
    extensions: [".nii", ".nii.gz"],
    inherit: false,
    load: (file) => {
      return Promise.resolve({ path: file.path });
    }
  },
  bval: {
    extensions: [".nii", ".nii.gz"],
    inherit: true,
    load: (file) => {
      return Promise.resolve({ path: file.path, n_cols: 0 });
    }
  },
  bvec: {
    extensions: [".nii", ".nii.gz"],
    inherit: true,
    load: (file) => {
      return Promise.resolve({ path: file.path, n_cols: 0 });
    }
  },
  channels: {
    extensions: [".tsv"],
    inherit: true,
    load: (file) => {
      return file.text().then((text) => parseTSV(text));
    }
  }
};
async function buildAssociations(fileTree, source) {
  const associations = {};
  for (const key in associationLookup) {
    const { extensions, inherit } = associationLookup[key];
    const paths = getPaths(fileTree, source, key, extensions);
    if (paths.length === 0) {
      continue;
    }
    if (paths.length > 1) {
    }
    associations[key] = await associationLookup[key].load(paths[0]);
  }
  return Promise.resolve(associations);
}
function getPaths(fileTree, source, targetSuffix, targetExtensions) {
  const validAssociations = fileTree.files.filter((file) => {
    const { suffix, extension, entities } = readEntities(file.name);
    return targetExtensions.includes(extension) && suffix === targetSuffix && Object.keys(entities).every((entity) => {
      return entity in source.entities && entities[entity] === source.entities[entity];
    });
  });
  const nextDir = fileTree.directories.find((directory) => {
    return source.file.path.startsWith(directory.path);
  });
  if (nextDir) {
    validAssociations.push(
      ...getPaths(nextDir, source, targetSuffix, targetExtensions)
    );
  }
  return validAssociations;
}

// src/schema/context.ts
var BIDSContextDataset = class {
  constructor(options, description = {}) {
    this.dataset_description = description;
    this.files = [];
    this.tree = {};
    this.ignored = [];
    this.modalities = [];
    this.subjects = [];
    if (options) {
      this.options = options;
    }
    if (!this.dataset_description.DatasetType && this.dataset_description.GeneratedBy) {
      this.dataset_description.DatasetType = "derivative";
    } else if (!this.dataset_description.DatasetType) {
      this.dataset_description.DatasetType = "raw";
    }
  }
};
var defaultDsContext = new BIDSContextDataset();
var BIDSContext = class {
  constructor(fileTree, file, issues, dsContext) {
    this.fileTree = fileTree;
    this.filenameRules = [];
    this.issues = issues;
    this.file = file;
    const bidsEntities = readEntities(file.name);
    this.suffix = bidsEntities.suffix;
    this.extension = bidsEntities.extension;
    this.entities = bidsEntities.entities;
    this.dataset = dsContext ? dsContext : defaultDsContext;
    this.subject = {};
    this.datatype = "";
    this.modality = "";
    this.sidecar = {};
    this.columns = new ColumnsMap();
    this.associations = {};
  }
  get json() {
    return this.file.text().then((text) => JSON.parse(text)).catch((error2) => {
    });
  }
  get path() {
    return this.file.path;
  }
  /**
   * Implementation specific absolute path for the dataset root
   *
   * In the browser, this is always at the root
   */
  get datasetPath() {
    return this.fileTree.path;
  }
  /**
   * Crawls fileTree from root to current context file, loading any valid
   * json sidecars found.
   */
  async loadSidecar(fileTree) {
    if (!fileTree) {
      fileTree = this.fileTree;
    }
    const validSidecars = fileTree.files.filter((file) => {
      const { suffix, extension, entities } = readEntities(file.name);
      return extension === ".json" && suffix === this.suffix && Object.keys(entities).every((entity) => {
        return entity in this.entities && entities[entity] === this.entities[entity];
      });
    });
    if (validSidecars.length > 1) {
      const exactMatch = validSidecars.find(
        (sidecar) => sidecar.path == this.file.path.replace(this.extension, ".json")
      );
      if (exactMatch) {
        validSidecars.splice(1);
        validSidecars[0] = exactMatch;
      } else {
        logger.warning(
          `Multiple sidecar files detected for '${this.file.path}'`
        );
      }
    }
    if (validSidecars.length === 1) {
      const json = await validSidecars[0].text().then((text) => JSON.parse(text)).catch((error2) => {
      });
      this.sidecar = { ...this.sidecar, ...json };
    }
    const nextDir = fileTree.directories.find((directory) => {
      return this.file.path.startsWith(directory.path);
    });
    if (nextDir) {
      await this.loadSidecar(nextDir);
    }
  }
  async loadNiftiHeader() {
    if (this.extension.startsWith(".nii") && this.dataset.options && !this.dataset.options.ignoreNiftiHeaders) {
      this.nifti_header = await loadHeader(this.file);
    }
  }
  async loadColumns() {
    if (this.extension !== ".tsv") {
      return;
    }
    this.columns = await this.file.text().then((text) => parseTSV(text)).catch((error2) => {
      logger.warning(
        `tsv file could not be opened by loadColumns '${this.file.path}'`
      );
      logger.debug(error2);
      return /* @__PURE__ */ new Map();
    });
    return;
  }
  async loadAssociations() {
    this.associations = await buildAssociations(this.fileTree, this);
    return;
  }
  async asyncLoads() {
    await Promise.allSettled([
      this.loadSidecar(),
      this.loadColumns(),
      this.loadAssociations()
    ]);
    this.loadNiftiHeader();
  }
};

// src/schema/walk.ts
async function* _walkFileTree(fileTree, root, issues, dsContext) {
  for (const file of fileTree.files) {
    yield new BIDSContext(root, file, issues, dsContext);
  }
  for (const dir of fileTree.directories) {
    yield* _walkFileTree(dir, root, issues, dsContext);
  }
}
async function* walkFileTree(fileTree, issues, dsContext) {
  yield* _walkFileTree(fileTree, fileTree, issues, dsContext);
}

// src/utils/objectPathHandler.ts
var hasProp = (obj, prop) => {
  return Object.prototype.hasOwnProperty.call(obj, prop);
};
var objectPathHandler = {
  get(target, property) {
    let res = target;
    for (const prop of property.split(".")) {
      if (hasProp(res, prop)) {
        res = res[prop];
      } else {
        return void 0;
      }
    }
    return res;
  }
};

// http-url:https://bids-specification.readthedocs.io/en/latest/schema.json
var schema_default = { schema_version: "0.7.2-dev", bids_version: "1.9.0-dev", meta: { associations: { events: { selectors: ["task in entities", "extension != '.json'"], target: { suffix: "events", extension: ".tsv" }, inherit: true }, aslcontext: { selectors: ["suffix == 'asl'", "match(extension, '\\.nii(\\.gz)?$')"], target: { suffix: "aslcontext", extension: ".tsv" }, inherit: true }, m0scan: { selectors: ["suffix == 'asl'", "match(extension, '\\.nii(\\.gz)?$')"], target: { suffix: "m0scan", extension: [".nii", ".nii.gz"] }, inherit: false }, magnitude: { selectors: ["suffix == 'fieldmap'", "match(extension, '\\.nii(\\.gz)?$')"], target: { suffix: "magnitude", extension: [".nii", ".nii.gz"] }, inherit: false }, magnitude1: { selectors: ["match(suffix, 'phase(diff|1)$')", "match(extension, '\\.nii(\\.gz)?$')"], target: { suffix: "magnitude1", extension: [".nii", ".nii.gz"] }, inherit: false }, bval: { selectors: ["suffix == 'dwi'", "match(extension, '\\.nii(\\.gz)?$')"], target: { extension: ".bval" }, inherit: true }, bvec: { selectors: ["suffix == 'dwi'", "match(extension, '\\.nii(\\.gz)?$')"], target: { extension: ".bvec" }, inherit: true }, channels: { selectors: ["intersects([suffix], ['eeg', 'ieeg', 'meg', 'nirs', 'motion', 'optodes'])", "extension != '.json'"], target: { suffix: "channels", extension: ".tsv" }, inherit: true }, coordsystem: { selectors: ["intersects([suffix], ['eeg', 'ieeg', 'meg', 'nirs', 'motion', 'electrodes', 'optodes'])", "extension != '.json'"], target: { suffix: "coordsystem", extension: ".json" }, inherit: true } }, context: { context: { type: "object", properties: { schema: { description: "The BIDS specification schema", type: "object" }, dataset: { description: "Properties and contents of the entire dataset", type: "object", properties: { dataset_description: { description: "Contents of /dataset_description.json", type: "object" }, files: { description: "List of all files in dataset", type: "array" }, tree: { description: "Tree view of all files in dataset", type: "object" }, ignored: { description: "Set of ignored files", type: "array" }, datatypes: { description: "Data types present in the dataset", type: "array" }, modalities: { description: "Modalities present in the dataset", type: "array" }, subjects: { description: "Collections of subjects in dataset", type: "object", properties: { sub_dirs: { description: "Subjects as determined by sub-*/ directories", type: "array", items: { type: "string" } }, participant_id: { description: "The participant_id column of participants.tsv", type: "array", items: { type: "string" } }, phenotype: { description: "The union of participant_id columns in phenotype files", type: "array", items: { type: "string" } } } } } }, subject: { description: "Properties and contents of the current subject", type: "object", properties: { sessions: { description: "Collections of sessions in subject", type: "object", properties: { ses_dirs: { description: "Sessions as determined by ses-*/ directories", type: "array", items: { type: "string" } }, session_id: { description: "The session_id column of sessions.tsv", type: "array", items: { type: "string" } }, phenotype: { description: "The union of session_id columns in phenotype files", type: "array", items: { type: "string" } } } } } }, path: { description: "Path of the current file", type: "string" }, size: { description: "Length of the current file in bytes", type: "int" }, entities: { description: "Entities parsed from the current filename", type: "object" }, datatype: { description: "Datatype of current file, for examples, anat", type: "string" }, suffix: { description: "Suffix of current file", type: "string" }, extension: { description: "Extension of current file including initial dot", type: "string" }, modality: { description: "Modality of current file, for examples, MRI", type: "string" }, sidecar: { description: "Sidecar metadata constructed via the inheritance principle", type: "object" }, associations: { description: "Associated files, indexed by suffix, selected according to the inheritance principle\n", type: "object", properties: { events: { description: "Events file", type: "object", properties: { path: { description: "Path to associated events file", type: "string" }, onset: { description: "Contents of the onset column", type: "array", items: { type: "string" } } } }, aslcontext: { description: "ASL context file", type: "object", properties: { path: { description: "Path to associated aslcontext file", type: "string" }, n_rows: { description: "Number of rows in aslcontext.tsv", type: "integer" }, volume_type: { description: "Contents of the volume_type column", type: "array", items: { type: "string" } } } }, m0scan: { description: "M0 scan file", type: "object", properties: { path: { description: "Path to associated M0 scan file", type: "string" } } }, magnitude: { description: "Magnitude image file", type: "object", properties: { path: { description: "Path to associated magnitude file", type: "string" } } }, magnitude1: { description: "Magnitude1 image file", type: "object", properties: { path: { description: "Path to associated magnitude1 file", type: "string" } } }, bval: { description: "B value file", type: "object", properties: { path: { description: "Path to associated bval file", type: "string" }, n_cols: { description: "Number of columns in bval file", type: "integer" } } }, bvec: { description: "B vector file", type: "object", properties: { path: { description: "Path to associated bvec file", type: "string" }, n_cols: { description: "Number of columns in bvec file", type: "integer" } } }, channels: { description: "Channels file", type: "object", properties: { path: { description: "Path to associated channels file", type: "string" }, type: { description: "Contents of the type column", type: "array", items: { type: "string" } } } }, coordsystem: { description: "Coordinate system file", type: "object", properties: { path: { description: "Path to associated coordsystem file", type: "string" } } } } }, columns: { description: "TSV columns, indexed by column header, values are arrays with column contents", type: "object", additionalProperties: { type: "array" } }, json: { description: "Contents of the current JSON file", type: "object" }, gzip: { description: "Parsed contents of gzip header", type: "object", properties: { timestamp: { description: "Modification time, unix timestamp", type: "number" }, filename: { description: "Filename", type: "string" }, comment: { description: "Comment", type: "string" } } }, nifti_header: { name: "NIfTI Header", description: "Parsed contents of NIfTI header referenced elsewhere in schema.", type: "object", properties: { dim_info: { name: "Dimension Information", description: "Metadata about dimensions data.", type: "object", properties: { freq: { name: "Frequency", description: "These fields encode which spatial dimension (1, 2, or 3).", type: "integer" }, phase: { name: "Phase", description: "Corresponds to which acquisition dimension for MRI data.", type: "integer" }, slice: { name: "Slice", description: "Slice dimensions.", type: "integer" } } }, dim: { name: "Data Dimensions", description: "Data seq dimensions.", type: "array", minItems: 8, maxItems: 8, items: { type: "integer" } }, pixdim: { name: "Pixel Dimension", description: "Grid spacings (unit per dimension).", type: "array", minItems: 8, maxItems: 8, items: { type: "number" } }, shape: { name: "Data shape", description: "Data array shape, equal to dim[1:dim[0] + 1]", type: "array", minItems: 0, maxItems: 7, items: { type: "integer" } }, voxel_sizes: { name: "Voxel sizes", description: "Voxel sizes, equal to pixdim[1:dim[0] + 1]", type: "array", minItems: 0, maxItems: 7, items: { type: "number" } }, xyzt_units: { name: "XYZT Units", description: "Units of pixdim[1..4]", type: "object", properties: { xyz: { name: "XYZ Units", description: "String representing the unit of voxel spacing.", type: "string", enum: ["unknown", "meter", "mm", "um"] }, t: { name: "Time Unit", description: "String representing the unit of inter-volume intervals.", type: "string", enum: ["unknown", "sec", "msec", "usec"] } } }, qform_code: { name: "qform code", description: "Use of the quaternion fields.", type: "integer" }, sform_code: { name: "sform code", description: "Use of the affine fields.", type: "integer" } } }, ome: { name: "Open Microscopy Environment fields", description: "Parsed contents of OME-XML header, which may be found in OME-TIFF or OME-ZARR files", type: "object", properties: { PhysicalSizeX: { name: "PhysicalSizeX", description: "Pixels / @PhysicalSizeX", type: "float" }, PhysicalSizeY: { name: "PhysicalSizeY", description: "Pixels / @PhysicalSizeY", type: "float" }, PhysicalSizeZ: { name: "PhysicalSizeZ", description: "Pixels / @PhysicalSizeZ", type: "float" }, PhysicalSizeXUnit: { name: "PhysicalSizeXUnit", description: "Pixels / @PhysicalSizeXUnit", type: "string" }, PhysicalSizeYUnit: { name: "PhysicalSizeYUnit", description: "Pixels / @PhysicalSizeYUnit", type: "string" }, PhysicalSizeZUnit: { name: "PhysicalSizeZUnit", description: "Pixels / @PhysicalSizeZUnit", type: "string" } } }, tiff: { name: "TIFF", description: "TIFF file format metadata", type: "object", properties: { version: { name: "Version", description: "TIFF file format version (the second 2-byte block)", type: "int" } } } } } }, expression_tests: [{ expression: "sidecar.MissingValue", result: null }, { expression: "null.anything", result: null }, { expression: "(null)", result: null }, { expression: "null[0]", result: null }, { expression: "null && true", result: null }, { expression: "null || true", result: null }, { expression: "true && null", result: null }, { expression: "false && null", result: false }, { expression: "true || null", result: true }, { expression: "false || null", result: null }, { expression: "!null", result: null }, { expression: "null + 1", result: null }, { expression: "null - 1", result: null }, { expression: "null * 1", result: null }, { expression: "null / 1", result: null }, { expression: "1 + null", result: null }, { expression: "1 - null", result: null }, { expression: "1 * null", result: null }, { expression: "1 / null", result: null }, { expression: "'str1' + null", result: null }, { expression: "null + 'str1'", result: null }, { expression: "intersects([], null)", result: null }, { expression: "intersects(null, [])", result: null }, { expression: "match(null, 'pattern')", result: null }, { expression: "match('string', null)", result: null }, { expression: "substr(null, 1, 4)", result: null }, { expression: "substr('string', null, 4)", result: null }, { expression: "substr('string', 1, null)", result: null }, { expression: "min(null)", result: null }, { expression: "max(null)", result: null }, { expression: "length(null)", result: null }, { expression: "type(null)", result: "null" }, { expression: "null == false", result: false }, { expression: "null == true", result: false }, { expression: "null != false", result: true }, { expression: "null != true", result: true }, { expression: "null != 1.5", result: true }, { expression: "null == null", result: true }, { expression: "null == 1", result: false }, { expression: '"VolumeTiming" in null', result: false }, { expression: 'exists(null, "bids-uri")', result: false }, { expression: "exists([], null)", result: false }, { expression: "evaluate(true)", result: true }, { expression: "evaluate(false)", result: false }, { expression: "evaluate(null)", result: false }, { expression: "1 + 2", result: 3 }, { expression: '"cat" + "dog"', result: "catdog" }, { expression: '1 + "cat"', result: null }, { expression: "match('string', '.*')", result: true }, { expression: "match('', '.')", result: false }, { expression: "substr('string', 1, 4)", result: "tri" }, { expression: "substr('string', 0, 20)", result: "string" }, { expression: "type(1)", result: "number" }, { expression: "type([])", result: "array" }, { expression: "type({})", result: "object" }, { expression: "type(true)", result: "boolean" }, { expression: "intersects([1], [1, 2])", result: true }, { expression: "intersects([1], [])", result: false }, { expression: "length([1, 2, 3])", result: 3 }, { expression: "length([])", result: 0 }, { expression: "count([1, 2, 3], 1)", result: 1 }, { expression: 'index(["i", "j", "k"], "i")', result: 0 }, { expression: 'index(["i", "j", "k"], "j")', result: 1 }, { expression: 'index(["i", "j", "k"], "x")', result: null }, { expression: "sorted([3, 2, 1])", result: [1, 2, 3] }, { expression: 'min([-1, "n/a", 1])', result: -1 }, { expression: 'max([-1, "n/a", 1])', result: 1 }, { expression: "[3, 2, 1][0]", result: 3 }, { expression: '"string"[0]', result: "s" }], versions: ["1.9.0", "1.8.0", "1.7.0", "1.6.0", "1.5.0", "1.4.1", "1.4.0", "1.3.0", "1.2.2", "1.2.1", "1.2.0", "1.1.2", "1.1.1", "1.1.0", "1.0.2", "1.0.1", "1.0.0"] }, objects: { columns: { HED: { name: "HED", display_name: "HED Tag", description: "Hierarchical Event Descriptor (HED) Tag.\nSee the [HED Appendix](SPEC_ROOT/appendices/hed.md) for details.\n", type: "string" }, abbreviation: { name: "abbreviation", display_name: "Abbreviation", description: "The unique label abbreviation\n", type: "string" }, acq_time__scans: { name: "acq_time", display_name: "Scan acquisition time", description: "Acquisition time refers to when the first data point in each run was acquired.\nFurthermore, if this header is provided, the acquisition times of all files\nfrom the same recording MUST be identical.\nDatetime format and their anonymization are described in\n[Units](SPEC_ROOT/common-principles.md#units).\n", type: "string", format: "datetime" }, acq_time__sessions: { name: "acq_time", display_name: "Session acquisition time", description: "Acquisition time refers to when the first data point of the first run was acquired.\nDatetime format and their anonymization are described in\n[Units](SPEC_ROOT/common-principles.md#units).\n", type: "string", format: "datetime" }, age: { name: "age", display_name: "Subject age", description: "Numeric value in years (float or integer value).\n\nIt is recommended to tag participant ages that are 89 or higher as 89+,\nfor privacy purposes.\n", type: "number", unit: "year" }, cardiac: { name: "cardiac", display_name: "Cardiac measurement", description: "continuous pulse measurement\n", type: "number" }, color: { name: "color", display_name: "Color label", description: "Hexadecimal. Label color for visualization.\n", type: "string", unit: "hexadecimal" }, component: { name: "component", display_name: "Component", description: "Description of the spatial axis or label of quaternion component associated with the channel.\nFor example, `x`,`y`,`z` for position channels,\nor `quat_x`, `quat_y`, `quat_z`, `quat_w` for quaternion orientation channels.\n", type: "string", enum: ["x", "y", "z", "quat_x", "quat_y", "quat_z", "quat_w", "n/a"] }, detector__channels: { name: "detector", display_name: "Detector Name", description: "Name of the detector as specified in the `*_optodes.tsv` file.\n`n/a` for channels that do not contain NIRS signals (for example, acceleration).\n", anyOf: [{ type: "string" }, { type: "string", enum: ["n/a"] }] }, detector_type: { name: "detector_type", display_name: "Detector Type", description: "The type of detector. Only to be used if the field `DetectorType` in `*_nirs.json` is set to `mixed`.\n", anyOf: [{ type: "string" }] }, derived_from: { name: "derived_from", display_name: "Derived from", description: "`sample-<label>` entity from which a sample is derived,\nfor example a slice of tissue (`sample-02`) derived from a block of tissue (`sample-01`).\n", type: "string", pattern: "^sample-[0-9a-zA-Z]+$" }, description: { name: "description", display_name: "Description", description: "Brief free-text description of the channel, or other information of interest.\n", type: "string" }, description__optode: { name: "description", display_name: "Description", description: "Free-form text description of the optode, or other information of interest.\n", type: "string" }, dimension: { name: "dimension", display_name: "Dimension", description: "Size of the group (grid/strip/probe) that this electrode belongs to.\nMust be of form `[AxB]` with the smallest dimension first (for example, `[1x8]`).\n", type: "string" }, duration: { name: "duration", display_name: "Event duration", description: 'Duration of the event (measured from onset) in seconds.\nMust always be either zero or positive (or `n/a` if unavailable).\nA "duration" value of zero implies that the delta function or event is so\nshort as to be effectively modeled as an impulse.\n', anyOf: [{ type: "number", unit: "s", minimum: 0 }, { type: "string", enum: ["n/a"] }] }, filename: { name: "filename", display_name: "Filename", description: "Relative paths to files.\n", type: "string", format: "participant_relative" }, group__channel: { name: "group", display_name: "Channel group", description: "Which group of channels (grid/strip/seeg/depth) this channel belongs to.\nThis is relevant because one group has one cable-bundle and noise can be shared.\nThis can be a name or number.\n", anyOf: [{ type: "string" }, { type: "number" }] }, handedness: { name: "handedness", display_name: "Subject handedness", description: 'String value indicating one of "left", "right", "ambidextrous".\n\nFor "left", use one of these values: `left`, `l`, `L`, `LEFT`, `Left`.\n\nFor "right", use one of these values: `right`, `r`, `R`, `RIGHT`, `Right`.\n\nFor "ambidextrous", use one of these values: `ambidextrous`, `a`, `A`, `AMBIDEXTROUS`,\n`Ambidextrous`.\n', type: "string", enum: ["left", "l", "L", "LEFT", "Left", "right", "r", "R", "RIGHT", "Right", "ambidextrous", "a", "A", "AMBIDEXTROUS", "Ambidextrous", "n/a"] }, hemisphere: { name: "hemisphere", display_name: "Electrode hemisphere", description: "The hemisphere in which the electrode is placed.\n", type: "string", enum: ["L", "R"] }, high_cutoff: { name: "high_cutoff", display_name: "High cutoff", description: "Frequencies used for the low-pass filter applied to the channel in Hz.\nIf no low-pass filter applied, use `n/a`.\nNote that hardware anti-aliasing in A/D conversion of all MEG/EEG electronics\napplies a low-pass filter; specify its frequency here if applicable.\n", anyOf: [{ type: "number", unit: "Hz", minimum: 0 }, { type: "string", enum: ["n/a"] }] }, hplc_recovery_fractions: { name: "hplc_recovery_fractions", display_name: "HPLC recovery fractions", description: "HPLC recovery fractions (the fraction of activity that gets loaded onto the HPLC).\n", type: "number", unit: "arbitrary" }, impedance: { name: "impedance", display_name: "Electrode impedance", description: "Impedance of the electrode, units MUST be in `kOhm`.\n", type: "number", unit: "kOhm" }, index: { name: "index", display_name: "Label index", description: "The label integer index.\n", type: "integer" }, low_cutoff: { name: "low_cutoff", display_name: "Low cutoff", description: "Frequencies used for the high-pass filter applied to the channel in Hz.\nIf no high-pass filter applied, use `n/a`.\n", anyOf: [{ type: "number", unit: "Hz" }, { type: "string", enum: ["n/a"] }] }, manufacturer: { name: "manufacturer", display_name: "Manufacturer", description: "The manufacturer for each electrode.\nCan be used if electrodes were manufactured by more than one company.\n", type: "string" }, mapping: { name: "mapping", display_name: "Label mapping", description: "Corresponding integer label in the standard BIDS label lookup.\n", type: "integer" }, material: { name: "material", display_name: "Electrode material", description: "Material of the electrode (for example, `Tin`, `Ag/AgCl`, `Gold`).\n", type: "string" }, metabolite_parent_fraction: { name: "metabolite_parent_fraction", display_name: "Metabolite parent fraction", description: "Parent fraction of the radiotracer (0-1).\n", type: "number", minimum: 0, maximum: 1 }, metabolite_polar_fraction: { name: "metabolite_polar_fraction", display_name: "Metabolite polar fraction", description: "Polar metabolite fraction of the radiotracer (0-1).\n", type: "number", minimum: 0, maximum: 1 }, name__channels: { name: "name", display_name: "Channel name", description: "Label of the channel.\n", type: "string" }, name__electrodes: { name: "name", display_name: "Electrode name", description: "Name of the electrode contact point.\n", type: "string" }, name__optodes: { name: "name", display_name: "Optode name", description: "Name of the optode, must be unique.\n", type: "string" }, name__segmentations: { name: "name", display_name: "Label name", description: "The unique label name.\n", type: "string" }, notch: { name: "notch", display_name: "Notch frequencies", description: "Frequencies used for the notch filter applied to the channel, in Hz.\nIf no notch filter applied, use `n/a`.\n", anyOf: [{ type: "number", unit: "Hz" }, { type: "string", enum: ["n/a"] }] }, onset: { name: "onset", display_name: "Event onset", description: 'Onset (in seconds) of the event, measured from the beginning of the acquisition\nof the first data point stored in the corresponding task data file.\nNegative onsets are allowed, to account for events that occur prior to the first\nstored data point.\nFor example, in case there is an in-scanner training phase that begins before\nthe scanning sequence has started events from this sequence should have\nnegative onset time counting down to the beginning of the acquisition of the\nfirst volume.\n\nIf any data points have been discarded before forming the data file\n(for example, "dummy volumes" in BOLD fMRI),\na time of 0 corresponds to the first stored data point and not the first\nacquired data point.\n', type: "number", unit: "s" }, pathology: { name: "pathology", display_name: "Pathology", description: "String value describing the pathology of the sample or type of control.\nWhen different from `healthy`, pathology SHOULD be specified.\nThe pathology may be specified in either `samples.tsv` or\n`sessions.tsv`, depending on whether the pathology changes over time.\n", type: "string" }, participant_id: { name: "participant_id", display_name: "Participant ID", description: "A participant identifier of the form `sub-<label>`,\nmatching a participant entity found in the dataset.\n", type: "string", pattern: "^sub-[0-9a-zA-Z]+$" }, placement__motion: { name: "placement", display_name: "Placement", description: "Placement of the tracked point on the body (for example,\nparticipant, avatar centroid, torso, left arm).\nIt can refer to an external vocabulary for describing body parts.\n", type: "string" }, plasma_radioactivity: { name: "plasma_radioactivity", display_name: "Plasma radioactivity", description: "Radioactivity in plasma, in unit of plasma radioactivity (for example, `kBq/mL`).\n", type: "number" }, reference__eeg: { name: "reference", display_name: "Electrode reference", description: "Name of the reference electrode(s).\nThis column is not needed when it is common to all channels.\nIn that case the reference electrode(s) can be specified in `*_eeg.json` as `EEGReference`).\n", type: "string" }, reference__ieeg: { name: "reference", display_name: "Electrode reference", description: "Specification of the reference (for example, `mastoid`, `ElectrodeName01`, `intracranial`, `CAR`, `other`, `n/a`).\nIf the channel is not an electrode channel (for example, a microphone channel) use `n/a`.\n", anyOf: [{ type: "string" }, { type: "string", enum: ["n/a"] }] }, respiratory: { name: "respiratory", display_name: "Respiratory measurement", description: "continuous breathing measurement\n", type: "number" }, response_time: { name: "response_time", display_name: "Response time", description: "Response time measured in seconds.\nA negative response time can be used to represent preemptive responses and\n`n/a` denotes a missed response.\n", anyOf: [{ type: "number", unit: "s" }, { type: "string", enum: ["n/a"] }] }, sample_id: { name: "sample_id", display_name: "Sample ID", description: "A sample identifier of the form `sample-<label>`,\nmatching a sample entity found in the dataset.\n", type: "string", pattern: "^sample-[0-9a-zA-Z]+$" }, sample_type: { name: "sample_type", display_name: "Sample type", description: "Biosample type defined by\n[ENCODE Biosample Type](https://www.encodeproject.org/profiles/biosample_type).\n", type: "string", enum: ["cell line", "in vitro differentiated cells", "primary cell", "cell-free sample", "cloning host", "tissue", "whole organisms", "organoid", "technical sample"] }, sampling_frequency: { name: "sampling_frequency", display_name: "Channel sampling frequency", description: "Sampling rate of the channel in Hz.\n", type: "number", unit: "Hz" }, session_id: { name: "session_id", display_name: "Session ID", description: "A session identifier of the form `ses-<label>`,\nmatching a session found in the dataset.\n", type: "string", pattern: "^ses-[0-9a-zA-Z]+$" }, sex: { name: "sex", display_name: "Sex", description: 'String value indicating phenotypical sex, one of "male", "female", "other".\n\nFor "male", use one of these values: `male`, `m`, `M`, `MALE`, `Male`.\n\nFor "female", use one of these values: `female`, `f`, `F`, `FEMALE`, `Female`.\n\nFor "other", use one of these values: `other`, `o`, `O`, `OTHER`, `Other`.\n', type: "string", enum: ["male", "m", "M", "MALE", "Male", "female", "f", "F", "FEMALE", "Female", "other", "o", "O", "OTHER", "Other", "n/a"] }, short_channel: { name: "short_channel", display_name: "Short Channel", description: "Is the channel designated as short.\nThe total number of channels listed as short channels\nSHOULD be stored in `ShortChannelCount` in `*_nirs.json`.\n", type: "boolean" }, size: { name: "size", display_name: "Electrode size", description: "Surface area of the electrode, units MUST be in `mm^2`.\n", type: "number", unit: "mm^2" }, software_filters: { name: "software_filters", display_name: "Software filters", description: "List of temporal and/or spatial software filters applied\n(for example, `SSS`, `SpatialCompensation`).\nNote that parameters should be defined in the general MEG sidecar .json file.\nIndicate `n/a` in the absence of software filters applied.\n", anyOf: [{ type: "string" }, { type: "string", enum: ["n/a"] }] }, source__channels: { name: "source", display_name: "Source name", description: "Name of the source as specified in the `*_optodes.tsv` file.\n`n/a` for channels that do not contain fNIRS signals (for example, acceleration).\n", anyOf: [{ type: "string" }, { type: "string", enum: ["n/a"] }] }, source__optodes: { name: "source_type", display_name: "Source type", description: "The type of source. Only to be used if the field `SourceType` in `*_nirs.json` is set to `mixed`.\n", anyOf: [{ type: "string" }] }, species: { name: "species", display_name: "Species", description: "The `species` column SHOULD be a binomial species name from the\n[NCBI Taxonomy](https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi)\n(for example, `homo sapiens`, `mus musculus`, `rattus norvegicus`).\nFor backwards compatibility, if `species` is absent, the participant is assumed to be\n`homo sapiens`.\n", type: "string" }, status: { name: "status", display_name: "Channel status", description: "Data quality observed on the channel.\nA channel is considered `bad` if its data quality is compromised by excessive noise.\nIf quality is unknown, then a value of `n/a` may be used.\nDescription of noise type SHOULD be provided in `[status_description]`.\n", type: "string", enum: ["good", "bad", "n/a"] }, status_description: { name: "status_description", display_name: "Channel status description", description: "Freeform text description of noise or artifact affecting data quality on the channel.\nIt is meant to explain why the channel was declared bad in the `status` column.\n", type: "string" }, stim_file: { name: "stim_file", display_name: "Stimulus file", description: "Represents the location of the stimulus file (such as an image, video, or\naudio file) presented at the given onset time.\nThere are no restrictions on the file formats of the stimuli files,\nbut they should be stored in the `/stimuli` directory\n(under the root directory of the dataset; with optional subdirectories).\nThe values under the `stim_file` column correspond to a path relative to\n`/stimuli`.\nFor example `images/cat03.jpg` will be translated to `/stimuli/images/cat03.jpg`.\n", type: "string", format: "stimuli_relative" }, strain: { name: "strain", display_name: "Strain", description: "For species different from `homo sapiens`, string value indicating\nthe strain of the species, for example: `C57BL/6J`.\n", type: "string" }, strain_rrid: { name: "strain_rrid", display_name: "Strain RRID", description: "For species different from `homo sapiens`, research resource identifier\n([RRID](https://scicrunch.org/resources/Organisms/search))\nof the strain of the species, for example: `RRID:IMSR_JAX:000664`.\n", type: "string", format: "rrid" }, time: { name: "time", display_name: "Time", description: "Time, in seconds, relative to `TimeZero` defined by the `*_pet.json`.\nFor example, 5.\n", type: "number", unit: "s" }, tracked_point__channels: { name: "tracked_point", display_name: "Tracked point channel", description: 'Label of the point that is being tracked, for example, label of a tracker\nor a marker (for example,`"LeftFoot"`, `"RightWrist"`).\n', type: "string" }, trial_type: { name: "trial_type", display_name: "Trial type", description: "Primary categorisation of each trial to identify them as instances of the\nexperimental conditions.\nFor example: for a response inhibition task, it could take on values `go` and\n`no-go` to refer to response initiation and response inhibition experimental\nconditions.\n", type: "string" }, trigger: { name: "trigger", display_name: "Trigger", description: "continuous measurement of the scanner trigger signal\n", type: "number" }, type__channels: { name: "type", display_name: "Channel type", description: "Type of channel; MUST use the channel types listed below.\nNote that the type MUST be in upper-case.\n", type: "string", enum: ["ACCEL", "ADC", "ANGACCEL", "AUDIO", "DAC", "DBS", "ECG", "ECOG", "EEG", "EMG", "EOG", "EYEGAZE", "FITERR", "GSR", "GYRO", "HEOG", "HLU", "JNTANG", "LATENCY", "MAGN", "MEGGRADAXIAL", "MEGGRADPLANAR", "MEGMAG", "MEGOTHER", "MEGREFGRADAXIAL", "MEGREFGRADPLANAR", "MEGREFMAG", "MISC", "NIRSCWAMPLITUDE", "NIRSCWFLUORESCENSEAMPLITUDE", "NIRSCWHBO", "NIRSCWHBR", "NIRSCWMUA", "NIRSCWOPTICALDENSITY", "ORNT", "OTHER", "PD", "POS", "PPG", "PUPIL", "REF", "RESP", "SEEG", "SYSCLOCK", "TEMP", "TRIG", "VEL", "VEOG"] }, type__electrodes: { name: "type", display_name: "Electrode type", description: "Type of the electrode (for example, cup, ring, clip-on, wire, needle).\n", type: "string" }, type__optodes: { name: "type", display_name: "Type", description: "The type of the optode.\n", type: "string", enum: ["source", "detector", "n/a"] }, units: { name: "units", display_name: "Units", description: "Physical unit of the value represented in this channel,\nfor example, `V` for Volt, or `fT/cm` for femto Tesla per centimeter\n(see [Units](SPEC_ROOT/common-principles.md#units)).\n", type: "string", format: "unit" }, units__nirs: { name: "units", display_name: "Units", description: "Physical unit of the value represented in this channel,\nspecified according to the SI unit symbol and possibly prefix symbol,\nor as a derived SI unit (for example, `V`, or unitless for changes in optical densities).\nFor guidelines about units see the [Appendix](SPEC_ROOT/appendices/units.md)\nand [Common Principles](SPEC_ROOT/common-principles.md#units) pages.\n", type: "string", format: "unit" }, units__motion: { name: "units", display_name: "Units", description: 'Physical or virtual unit of the value represented in this channel,\nfor example, \'"rad"\' or \'"deg"\' for angular quantities or \'"m"\' for position data.\nIf motion data is recorded in a virtual space and deviate from standard SI units,\nthe unit used MUST be specified in the sidecar `*_motion.json`\nfile (for example `"vm"` for virtual meters). `"rad"` is used for Euler angles\nand `"n/a"` for quaternions.\nFor guidelines about units see the [Appendix](SPEC_ROOT/appendices/units.md)\nand [Common Principles](SPEC_ROOT/common-principles.md#units) pages.\n', type: "string", format: "unit" }, volume_type: { name: "volume_type", display_name: "ASL volume type", description: "The `*_aslcontext.tsv` table consists of a single column of labels identifying\nthe `volume_type` of each volume in the corresponding `*_asl.nii[.gz]` file.\n", type: "string", enum: ["control", "label", "m0scan", "deltam", "cbf"] }, wavelength_nominal: { name: "wavelength_nominal", display_name: "Wavelength nominal", description: "Specified wavelength of light in nm.\n`n/a` for channels that do not contain raw NIRS signals (for example, acceleration).\nThis field is equivalent to `/nirs(i)/probe/wavelengths` in the SNIRF specification.\n", anyOf: [{ type: "number" }, { type: "string", enum: ["n/a"] }] }, wavelength_actual: { name: "wavelength_actual", display_name: "Wavelength actual", description: "Measured wavelength of light in nm.\n`n/a` for channels that do not contain raw NIRS signals (acceleration).\nThis field is equivalent to `measurementList.wavelengthActual` in the SNIRF specification.\n", type: "number" }, wavelength_emission_actual: { name: "wavelength_emission_actual", display_name: "Wavelength emission actual", description: "Measured emission wavelength of light in nm.\n`n/a` for channels that do not contain raw NIRS signals (acceleration).\nThis field is equivalent to `measurementList.wavelengthEmissionActual` in the SNIRF specification.\n", type: "number" }, whole_blood_radioactivity: { name: "whole_blood_radioactivity", display_name: "Whole blood radioactivity", description: "Radioactivity in whole blood samples,\nin unit of radioactivity measurements in whole blood samples (for example, `kBq/mL`).\n", type: "number" }, x: { name: "x", display_name: "X position", description: "Recorded position along the x-axis.\n", type: "number" }, y: { name: "y", display_name: "Y position", description: "Recorded position along the y-axis.\n", type: "number" }, z: { name: "z", display_name: "Z position", description: "Recorded position along the z-axis.\n", anyOf: [{ type: "number" }, { type: "string", enum: ["n/a"] }] }, x__optodes: { name: "x", display_name: "X position", description: 'Recorded position along the x-axis.\n`"n/a"` if not available.\n', anyOf: [{ type: "number" }, { type: "string", enum: ["n/a"] }] }, y__optodes: { name: "y", display_name: "Y position", description: 'Recorded position along the y-axis.\n`"n/a"` if not available.\n', anyOf: [{ type: "number" }, { type: "string", enum: ["n/a"] }] }, z__optodes: { name: "z", display_name: "Z position", description: 'Recorded position along the z-axis.\n`"n/a"` if not available.\n', anyOf: [{ type: "number" }, { type: "string", enum: ["n/a"] }] }, template_x: { name: "template_x", display_name: "X template position", description: "Assumed or ideal position along the x axis.\n", anyOf: [{ type: "number" }, { type: "string", enum: ["n/a"] }] }, template_y: { name: "template_y", display_name: "Y template position", description: "Assumed or ideal position along the y axis.\n", anyOf: [{ type: "number" }, { type: "string", enum: ["n/a"] }] }, template_z: { name: "template_z", display_name: "Z template position", description: "Assumed or ideal position along the z axis.\n", anyOf: [{ type: "number" }, { type: "string", enum: ["n/a"] }] } }, common_principles: { data_acquisition: { display_name: "Data acquisition", description: "A continuous uninterrupted block of time during which a brain scanning instrument was acquiring data according to\nparticular scanning sequence/protocol.\n" }, data_type: { display_name: "Data type", description: "A functional group of different types of data.\nData files are contained in a directory named for the data type.\nIn raw datasets, the data type directory is nested inside subject and (optionally) session directories.\nBIDS defines the following data types:\n\n    1.  `func` (task based and resting state functional MRI)\n\n    2.  `dwi` (diffusion weighted imaging)\n\n    3.  `fmap` (field inhomogeneity mapping data such as field maps)\n\n    4.  `anat` (structural imaging such as T1, T2, PD, and so on)\n\n    5.  `perf` (perfusion)\n\n    6.  `meg` (magnetoencephalography)\n\n    7.  `eeg` (electroencephalography)\n\n    8.  `ieeg` (intracranial electroencephalography)\n\n    9.  `beh` (behavioral)\n\n    10. `pet` (positron emission tomography)\n\n    11. `micr` (microscopy)\n\n    12. `nirs` (near infrared spectroscopy)\n\n    13. `motion` (motion)\n" }, dataset: { display_name: "Dataset", description: "A set of neuroimaging and behavioral data acquired for a purpose of a particular study.\nA dataset consists of data acquired from one or more subjects, possibly from multiple sessions.\n" }, deprecated: { display_name: "DEPRECATED", description: `A "deprecated" entity or metadata field SHOULD NOT be used in the generation of new datasets.
It remains in the standard in order to preserve the interpretability of existing datasets.
Validating software SHOULD warn when deprecated practices are detected
and provide a suggestion for updating the dataset to preserve the curator's intent.
` }, event: { display_name: "Event", description: `Something that happens or may be perceived by a test subject as happening
at a particular instant during the recording.
Events are most commonly associated with on- or offset of stimulus presentations,
or with the distinct marker of on- or offset of a subject's response or motor action.
Other events may include unplanned incidents
(for example, sudden onset of noise and vibrations due to construction work,
laboratory device malfunction),
changes in task instructions (for example, switching the response hand),
or experiment control parameters (for example, changing the stimulus presentation rate over experimental blocks),
and noted data feature occurrences (for example, a recording electrode producing noise).
In BIDS, each event has an onset time and duration.
Note that not all tasks will have recorded events (for example, "resting state").
` }, extension: { display_name: "File extension", description: "A portion of the filename after the left-most period (`.`) preceded by any other alphanumeric.\nFor example, `.gitignore` does not have a file extension,\nbut the file extension of `test.nii.gz` is `.nii.gz`.\nNote that the left-most period is included in the file extension.\n" }, index: { display_name: "index", description: "A nonnegative integer, possibly prefixed with arbitrary number of 0s for consistent indentation,\nfor example, it is `01` in `run-01` following `run-<index>` specification.\n" }, label: { display_name: "label", description: "An alphanumeric value, possibly prefixed with arbitrary number of 0s for consistent indentation,\nfor example, it is `rest` in `task-rest` following `task-<label>` specification.\nNote that labels MUST not collide when casing is ignored\n(see [Case collision intolerance](SPEC_ROOT/common-principles.md#case-collision-intolerance)).\n" }, modality: { display_name: "Modality", description: "The category of brain data recorded by a file.\nFor MRI data, different pulse sequences are considered distinct modalities,\nsuch as `T1w`, `bold` or `dwi`.\nFor passive recording techniques, such as EEG, MEG or iEEG,\nthe technique is sufficiently uniform to define the modalities `eeg`, `meg` and `ieeg`.\nWhen applicable, the modality is indicated in the **suffix**.\nThe modality may overlap with, but should not be confused with the **data type**.\n" }, run: { display_name: "Run", description: 'An uninterrupted repetition of data acquisition that has the same acquisition parameters and task\n(however events can change from run to run due to different subject response\nor randomized nature of the stimuli).\nRun is a synonym of a data acquisition.\nNote that "uninterrupted" may look different by modality due to the nature of the recording.\nFor example, in [MRI](SPEC_ROOT/modality-specific-files/magnetic-resonance-imaging-data.md)\nor [MEG](SPEC_ROOT/modality-specific-files/magnetoencephalography.md),\nif a subject leaves the scanner, the acquisition must be restarted.\nFor some types of [PET](SPEC_ROOT/modality-specific-files/positron-emission-tomography.md) acquisitions,\na subject may leave and re-enter the scanner without interrupting the scan.\n' }, sample: { display_name: "Sample", description: "A sample pertaining to a subject such as tissue, primary cell or cell-free sample.\nSample labels MUST be unique within a subject and it is RECOMMENDED\nthat they be unique throughout the dataset.\n" }, session: { display_name: "Session", description: "A logical grouping of neuroimaging and behavioral data consistent across subjects.\nSession can (but doesn't have to) be synonymous to a visit in a longitudinal study.\nIn general, subjects will stay in the scanner during one session.\nHowever, for example, if a subject has to leave the scanner room\nand then be re-positioned on the scanner bed,\nthe set of MRI acquisitions will still be considered as a session\nand match sessions acquired in other subjects.\nSimilarly, in situations where different data types are obtained over several visits\n(for example fMRI on one day followed by DWI the day after) those can be grouped in one session.\nDefining multiple sessions is appropriate when several identical or similar data acquisitions\nare planned and performed on all -or most- subjects,\noften in the case of some intervention between sessions (for example, training).\nIn the [PET](SPEC_ROOT/modality-specific-files/positron-emission-tomography.md) context,\na session may also indicate a group of related scans, taken in one or more visits.\n" }, suffix: { display_name: "suffix", description: "An alphanumeric string that forms part of a filename, located after all\n[entities](SPEC_ROOT/common-principles.md#entities) and\nfollowing a final `_`, right before the **file extension**;\nfor example, it is `eeg` in `sub-05_task-matchingpennies_eeg.vhdr`.\n" }, subject: { display_name: "Subject", description: "A person or animal participating in the study.\nUsed interchangeably with term **Participant**.\n" }, task: { display_name: "Task", description: 'A set of structured activities performed by the participant.\nTasks are usually accompanied by stimuli and responses, and can greatly vary in complexity.\nFor the purpose of this specification we consider the so-called "resting state" a task.\nIn the context of brain scanning, a task is always tied to one data acquisition.\nTherefore, even if during one acquisition the subject performed multiple conceptually different behaviors\n(with different sets of instructions) they will be considered one (combined) task.\n' } }, datatypes: { anat: { value: "anat", display_name: "Anatomical Magnetic Resonance Imaging", description: "Magnetic resonance imaging sequences designed to characterize static, anatomical features.\n" }, beh: { value: "beh", display_name: "Behavioral Data", description: "Behavioral data.\n" }, dwi: { value: "dwi", display_name: "Diffusion-Weighted Imaging", description: "Diffusion-weighted imaging (DWI).\n" }, eeg: { value: "eeg", display_name: "Electroencephalography", description: "Electroencephalography" }, fmap: { value: "fmap", display_name: "Field maps", description: "MRI scans for estimating B0 inhomogeneity-induced distortions.\n" }, func: { value: "func", display_name: "Task-Based Magnetic Resonance Imaging", description: "Task (including resting state) imaging data\n" }, ieeg: { value: "ieeg", display_name: "Intracranial electroencephalography", description: "Intracranial electroencephalography (iEEG) or electrocorticography (ECoG) data\n" }, meg: { value: "meg", display_name: "Magnetoencephalography", description: "Magnetoencephalography" }, micr: { value: "micr", display_name: "Microscopy", description: "Microscopy" }, motion: { value: "motion", display_name: "Motion", description: "Motion data from a tracking system" }, perf: { value: "perf", display_name: "Perfusion imaging", description: "Blood perfusion imaging data, including arterial spin labeling (ASL)\n" }, pet: { value: "pet", display_name: "Positron Emission Tomography", description: "Positron emission tomography data\n" }, nirs: { value: "nirs", display_name: "Near-Infrared Spectroscopy", description: "Near-Infrared Spectroscopy data organized around the SNIRF format" } }, entities: { acquisition: { name: "acq", display_name: "Acquisition", description: "The `acq-<label>` entity corresponds to a custom label the user MAY use to distinguish\na different set of parameters used for acquiring the same modality.\n\nFor example, this should be used when a study includes two T1w images -\none full brain low resolution and one restricted field of view but high resolution.\nIn such case two files could have the following names:\n`sub-01_acq-highres_T1w.nii.gz` and `sub-01_acq-lowres_T1w.nii.gz`;\nhowever, the user is free to choose any other label than `highres` and `lowres` as long\nas they are consistent across subjects and sessions.\n\nIn case different sequences are used to record the same modality\n(for example, `RARE` and `FLASH` for T1w)\nthis field can also be used to make that distinction.\nThe level of detail at which the distinction is made\n(for example, just between `RARE` and `FLASH`, or between `RARE`, `FLASH`, and `FLASHsubsampled`)\nremains at the discretion of the researcher.\n", type: "string", format: "label" }, atlas: { name: "atlas", display_name: "Atlas", description: "The `atlas-<label>` key/value pair corresponds to a custom label the user\nMAY use to distinguish a different atlas used for similar type of data.\n\nThis entity is only applicable to derivative data.\n", type: "string", format: "label" }, ceagent: { name: "ce", display_name: "Contrast Enhancing Agent", description: 'The `ce-<label>` entity can be used to distinguish sequences using different contrast enhanced images.\nThe label is the name of the contrast agent.\n\nThis entity represents the `"ContrastBolusIngredient"` metadata field.\nTherefore, if the `ce-<label>` entity is present in a filename,\n`"ContrastBolusIngredient"` MAY also be added in the JSON file, with the same label.\n', type: "string", format: "label" }, chunk: { name: "chunk", display_name: "Chunk", description: "The `chunk-<index>` key/value pair is used to distinguish between different regions,\n2D images or 3D volumes files,\nof the same physical sample with different fields of view acquired in the same imaging experiment.\n", type: "string", format: "index" }, density: { name: "den", display_name: "Density", description: 'Density of non-parametric surfaces.\n\nThis entity represents the `"Density"` metadata field.\nTherefore, if the `den-<label>` entity is present in a filename,\n`"Density"` MUST also be added in the JSON file, to provide interpretation.\n\nThis entity is only applicable to derivative data.\n', type: "string", format: "label" }, description: { name: "desc", display_name: "Description", description: "When necessary to distinguish two files that do not otherwise have a\ndistinguishing entity, the `desc-<label>` entity SHOULD be used.\n\nThis entity is only applicable to derivative data.\n", type: "string", format: "label" }, direction: { name: "dir", display_name: "Phase-Encoding Direction", description: 'The `dir-<label>` entity can be set to an arbitrary alphanumeric label\n(for example, `dir-LR` or `dir-AP`)\nto distinguish different phase-encoding directions.\n\nThis entity represents the `"PhaseEncodingDirection"` metadata field.\nTherefore, if the `dir-<label>` entity is present in a filename,\n`"PhaseEncodingDirection"` MUST be defined in the associated metadata.\nPlease note that the `<label>` does not need to match the actual value of the field.\n', type: "string", format: "label" }, echo: { name: "echo", display_name: "Echo", description: 'If files belonging to an entity-linked file collection are acquired at different\necho times, the `echo-<index>` entity MUST be used to distinguish individual files.\n\nThis entity represents the `"EchoTime"` metadata field.\nTherefore, if the `echo-<index>` entity is present in a filename,\n`"EchoTime"` MUST be defined in the associated metadata.\nPlease note that the `<index>` denotes the number/index (in the form of a nonnegative integer),\nnot the `"EchoTime"` value of the separate JSON file.\n', type: "string", format: "index" }, flip: { name: "flip", display_name: "Flip Angle", description: 'If files belonging to an entity-linked file collection are acquired at different\nflip angles, the `_flip-<index>` entity pair MUST be used to distinguish\nindividual files.\n\nThis entity represents the `"FlipAngle"` metadata field.\nTherefore, if the `flip-<index>` entity is present in a filename,\n`"FlipAngle"` MUST be defined in the associated metadata.\nPlease note that the `<index>` denotes the number/index (in the form of a nonnegative integer),\nnot the `"FlipAngle"` value of the separate JSON file.\n', type: "string", format: "index" }, hemisphere: { name: "hemi", display_name: "Hemisphere", description: "The `hemi-<label>` entity indicates which hemibrain is described by the file.\nAllowed label values for this entity are `L` and `R`, for the left and right\nhemibrains, respectively.\n", type: "string", format: "label", enum: ["L", "R"] }, inversion: { name: "inv", display_name: "Inversion Time", description: 'If files belonging to an entity-linked file collection are acquired at different inversion times,\nthe `inv-<index>` entity MUST be used to distinguish individual files.\n\nThis entity represents the `"InversionTime` metadata field.\nTherefore, if the `inv-<index>` entity is present in a filename,\n`"InversionTime"` MUST be defined in the associated metadata.\nPlease note that the `<index>` denotes the number/index (in the form of a nonnegative integer),\nnot the `"InversionTime"` value of the separate JSON file.\n', type: "string", format: "index" }, label: { name: "label", display_name: "Label", description: "Tissue-type label, following a prescribed vocabulary.\nApplies to binary masks and probabilistic/partial volume segmentations\nthat describe a single tissue type.\n\nThis entity is only applicable to derivative data.\n", type: "string", format: "label" }, modality: { name: "mod", display_name: "Corresponding Modality", description: "The `mod-<label>` entity corresponds to modality label for defacing\nmasks, for example, T1w, inplaneT1, referenced by a defacemask image.\nFor example, `sub-01_mod-T1w_defacemask.nii.gz`.\n", type: "string", format: "label" }, mtransfer: { name: "mt", display_name: "Magnetization Transfer", description: 'If files belonging to an entity-linked file collection are acquired at different\nmagnetization transfer (MT) states, the `_mt-<label>` entity MUST be used to\ndistinguish individual files.\n\nThis entity represents the `"MTState"` metadata field.\nTherefore, if the `mt-<label>` entity is present in a filename,\n`"MTState"` MUST be defined in the associated metadata.\nAllowed label values for this entity are `on` and `off`,\nfor images acquired in presence and absence of an MT pulse, respectively.\n', type: "string", format: "label", enum: ["on", "off"] }, part: { name: "part", display_name: "Part", description: 'This entity is used to indicate which component of the complex\nrepresentation of the MRI signal is represented in voxel data.\nThe `part-<label>` entity is associated with the DICOM Tag\n`0008, 9208`.\nAllowed label values for this entity are `phase`, `mag`, `real` and `imag`,\nwhich are typically used in `part-mag`/`part-phase` or\n`part-real`/`part-imag` pairs of files.\n\nPhase images MAY be in radians or in arbitrary units.\nThe sidecar JSON file MUST include the `"Units"` of the `phase` image.\nThe possible options are `"rad"` or `"arbitrary"`.\n\nWhen there is only a magnitude image of a given type, the `part` entity MAY be\nomitted.\n', type: "string", format: "label", enum: ["mag", "phase", "real", "imag"] }, processing: { name: "proc", display_name: "Processed (on device)", description: "The proc label is analogous to rec for MR and denotes a variant of\na file that was a result of particular processing performed on the device.\n\nThis is useful for files produced in particular by Neuromag/Elekta/MEGIN's\nMaxFilter (for example, `sss`, `tsss`, `trans`, `quat` or `mc`),\nwhich some installations impose to be run on raw data because of active\nshielding software corrections before the MEG data can actually be\nexploited.\n", type: "string", format: "label" }, reconstruction: { name: "rec", display_name: "Reconstruction", description: "The `rec-<label>` entity can be used to distinguish different reconstruction algorithms\n(for example, `MoCo` for the ones using motion correction).\n", type: "string", format: "label" }, recording: { name: "recording", display_name: "Recording", description: "The `recording-<label>` entity can be used to distinguish continuous recording files.\n\nThis entity is commonly applied when continuous recordings have different sampling frequencies or start times.\nFor example, physiological recordings with different sampling frequencies may be distinguished using\nlabels like `recording-100Hz` and `recording-500Hz`.\n", type: "string", format: "label" }, resolution: { name: "res", display_name: "Resolution", description: 'Resolution of regularly sampled N-dimensional data.\n\nThis entity represents the `"Resolution"` metadata field.\nTherefore, if the `res-<label>` entity is present in a filename,\n`"Resolution"` MUST also be added in the JSON file, to provide interpretation.\n\nThis entity is only applicable to derivative data.\n', type: "string", format: "label" }, run: { name: "run", display_name: "Run", description: "The `run-<index>` entity is used to distinguish separate data acquisitions with the same acquisition parameters\nand (other) entities.\n\nIf several data acquisitions (for example, MRI scans or EEG recordings)\nwith the same acquisition parameters are acquired in the same session,\nthey MUST be indexed with the [`run-<index>`](SPEC_ROOT/appendices/entities.md#run) entity:\n`_run-1`, `_run-2`, `_run-3`, and so on\n(only nonnegative integers are allowed as run indices).\n\nIf different entities apply,\nsuch as a different session indicated by [`ses-<label>`][SPEC_ROOT/appendices/entities.md#ses),\nor different acquisition parameters indicated by\n[`acq-<label>`](SPEC_ROOT/appendices/entities.md#acq),\nthen `run` is not needed to distinguish the scans and MAY be omitted.\n", type: "string", format: "index" }, sample: { name: "sample", display_name: "Sample", description: "A sample pertaining to a subject such as tissue, primary cell or cell-free sample.\nThe `sample-<label>` entity is used to distinguish between different samples from the same subject.\nThe label MUST be unique per subject and is RECOMMENDED to be unique throughout the dataset.\n", type: "string", format: "label" }, session: { name: "ses", display_name: "Session", description: "A logical grouping of neuroimaging and behavioral data consistent across subjects.\nSession can (but doesn't have to) be synonymous to a visit in a longitudinal study.\nIn general, subjects will stay in the scanner during one session.\nHowever, for example, if a subject has to leave the scanner room and then\nbe re-positioned on the scanner bed, the set of MRI acquisitions will still\nbe considered as a session and match sessions acquired in other subjects.\nSimilarly, in situations where different data types are obtained over\nseveral visits (for example fMRI on one day followed by DWI the day after)\nthose can be grouped in one session.\n\nDefining multiple sessions is appropriate when several identical or similar\ndata acquisitions are planned and performed on all -or most- subjects,\noften in the case of some intervention between sessions\n(for example, training).\n", type: "string", format: "label" }, space: { name: "space", display_name: "Space", description: "The `space-<label>` entity can be used to indicate the way in which electrode positions are interpreted\n(for EEG/MEG/iEEG data)\nor the spatial reference to which a file has been aligned (for MRI data).\nThe `<label>` MUST be taken from one of the modality specific lists in the\n[Coordinate Systems Appendix](SPEC_ROOT/appendices/coordinate-systems.md).\nFor example, for iEEG data, the restricted keywords listed under\n[iEEG Specific Coordinate Systems](SPEC_ROOT/appendices/coordinate-systems.md#ieeg-specific-coordinate-systems)\nare acceptable for `<label>`.\n\nFor EEG/MEG/iEEG data, this entity can be applied to raw data,\nbut for other data types, it is restricted to derivative data.\n", type: "string", format: "label" }, split: { name: "split", display_name: "Split", description: "In the case of long data recordings that exceed a file size of 2Gb,\n`.fif` files are conventionally split into multiple parts.\nEach of these files has an internal pointer to the next file.\nThis is important when renaming these split recordings to the BIDS convention.\n\nInstead of a simple renaming, files should be read in and saved under their\nnew names with dedicated tools like [MNE-Python](https://mne.tools/),\nwhich will ensure that not only the filenames, but also the internal file pointers, will be updated.\n\nIt is RECOMMENDED that `.fif` files with multiple parts use the `split-<index>` entity to indicate each part.\nIf there are multiple parts of a recording and the optional `scans.tsv` is provided,\nall files MUST be listed separately in `scans.tsv` and\nthe entries for the `acq_time` column in `scans.tsv` MUST all be identical,\nas described in [Scans file](SPEC_ROOT/modality-agnostic-files.md#scans-file).\n", type: "string", format: "index" }, stain: { name: "stain", display_name: "Stain", description: 'The `stain-<label>` key/pair values can be used to distinguish image files\nfrom the same sample using different stains or antibodies for contrast enhancement.\n\nThis entity represents the `"SampleStaining"` metadata field.\nTherefore, if the `stain-<label>` entity is present in a filename,\n`"SampleStaining"` SHOULD be defined in the associated metadata,\nalthough the label may be different.\n\nDescriptions of antibodies SHOULD also be indicated in the `"SamplePrimaryAntibodies"`\nand/or `"SampleSecondaryAntibodies"` metadata fields, as appropriate.\n', type: "string", format: "label" }, subject: { name: "sub", display_name: "Subject", description: "A person or animal participating in the study.\n", type: "string", format: "label" }, task: { name: "task", display_name: "Task", description: 'A set of structured activities performed by the participant.\nTasks are usually accompanied by stimuli and responses, and can greatly vary in complexity.\n\nIn the context of brain scanning, a task is always tied to one data acquisition.\nTherefore, even if during one acquisition the subject performed multiple conceptually different behaviors\n(with different sets of instructions) they will be considered one (combined) task.\n\nWhile tasks may be repeated across multiple acquisitions,\na given task may have different sets of stimuli (for example, randomized order) and participant responses\nacross subjects, sessions, and runs.\n\nThe `task-<label>` MUST be consistent across subjects and sessions.\n\nFiles with the `task-<label>` entity SHOULD have an associated\n[events file](SPEC_ROOT/modality-specific-files/task-events.md#task-events),\nas well as certain metadata fields in the associated JSON file.\n\nFor the purpose of this specification we consider the so-called "resting state" a task,\nalthough events files are not expected for resting state data.\nAdditionally, a common convention in the specification is to include the word "rest" in\nthe `task` label for resting state files (for example, `task-rest`).\n', type: "string", format: "label" }, tracer: { name: "trc", display_name: "Tracer", description: 'The `trc-<label>` entity can be used to distinguish sequences using different tracers.\n\nThis entity represents the `"TracerName"` metadata field.\nTherefore, if the `trc-<label>` entity is present in a filename,\n`"TracerName"` MUST be defined in the associated metadata.\nPlease note that the `<label>` does not need to match the actual value of the field.\n', type: "string", format: "label" }, tracksys: { name: "tracksys", display_name: "Tracking system", description: 'The `tracksys-<label>` entity can be used as a key-value pair\nto label *_motion.tsv and *_motion.json files.\nIt can also be used to label *_channel.tsv or *_events.tsv files\nwhen they belong to a specific tracking system.\n\nThis entity corresponds to the `"TrackingSystemName"` metadata field in a *_motion.json file.\n`tracksys-<label>` entity is a concise string whereas `"TrackingSystemName"`\nmay be longer and more human readable.\n', type: "string", format: "label" } }, enums: { _EEGCoordSys: { type: "string", enum: ["CapTrak", "EEGLAB", "EEGLAB-HJ", "Other"] }, _GeneticLevelEnum: { type: "string", enum: ["Genetic", "Genomic", "Epigenomic", "Transcriptomic", "Metabolomic", "Proteomic"] }, _MEGCoordSys: { type: "string", enum: ["CTF", "ElektaNeuromag", "4DBti", "KitYokogawa", "ChietiItab", "Other"] }, _StandardTemplateCoordSys: { type: "string", enum: ["ICBM452AirSpace", "ICBM452Warp5Space", "IXI549Space", "fsaverage", "fsaverageSym", "fsLR", "MNIColin27", "MNI152Lin", "MNI152NLin2009aSym", "MNI152NLin2009bSym", "MNI152NLin2009cSym", "MNI152NLin2009aAsym", "MNI152NLin2009bAsym", "MNI152NLin2009cAsym", "MNI152NLin6Sym", "MNI152NLin6ASym", "MNI305", "NIHPD", "OASIS30AntsOASISAnts", "OASIS30Atropos", "Talairach", "UNCInfant"] }, _StandardTemplateDeprecatedCoordSys: { type: "string", enum: ["fsaverage3", "fsaverage4", "fsaverage5", "fsaverage6", "fsaveragesym", "UNCInfant0V21", "UNCInfant1V21", "UNCInfant2V21", "UNCInfant0V22", "UNCInfant1V22", "UNCInfant2V22", "UNCInfant0V23", "UNCInfant1V23", "UNCInfant2V23"] }, _iEEGCoordSys: { type: "string", enum: ["Pixels", "ACPC", "ScanRAS", "Other"] }, left_hemisphere: { value: "L", display_name: "Left Hemisphere", description: "A left hemibrain image.\n" }, right_hemisphere: { value: "R", display_name: "Right Hemisphere", description: "A right hemibrain image.\n" }, CASL: { value: "CASL", display_name: "Continuous arterial spin labeling", description: "Continuous arterial spin labeling was employed.\n" }, PCASL: { value: "PCASL", display_name: "Pseudo-continuous arterial spin labeling", description: "Pseudo-continuous arterial spin labeling was employed.\n" }, PASL: { value: "PASL", display_name: "Pulsed arterial spin labeling", description: "Pulsed arterial spin labeling was employed.\n" }, Separate: { value: "Separate", display_name: "Separate", description: "A separate `m0scan` file is present.\n" }, Included: { value: "Included", display_name: "Included", description: "An m0scan volume is contained within the associated `asl` file.\n" }, Estimate: { value: "Estimate", display_name: "Estimate", description: "A single whole-brain M0 value is provided in the metadata.\n" }, Absent: { value: "Absent", display_name: "Absent", description: "No specific M0 information is present.\n" }, TwoD: { value: "2D", display_name: "Two-dimensional", description: "Two-dimensional MR acquisition.\n" }, ThreeD: { value: "3D", display_name: "Three-dimensional", description: "Three-dimensional MR acquisition.\n" }, HARD: { value: "HARD", display_name: "Hard pulse", description: "A very brief, strong, rectangular pulse.\n" }, GAUSSIAN: { value: "GAUSSIAN", display_name: "Gaussian pulse", description: "A Gaussian pulse.\n" }, GAUSSHANN: { value: "GAUSSHANN", display_name: "Gaussian-Hanning pulse.", description: "A Gaussian pulse with a Hanning window.\n" }, SINC: { value: "SINC", display_name: "Sinc pulse", description: "A sinc-shaped pulse.\n" }, SINCHANN: { value: "SINCHANN", display_name: "Sinc-Hanning pulse", description: "A sinc-shaped pulse with a Hanning window.\n" }, SINCGAUSS: { value: "SINCGAUSS", display_name: "Sinc-Gauss pulse", description: "A sinc-shaped pulse with a Gaussian window.\n" }, FERMI: { value: "FERMI", display_name: "Fermi pulse", description: "A Fermi-shaped pulse.\n" }, i: { value: "i", display_name: "i", description: "The encoding direction is along the first axis of the data in the NIFTI file,\nand the encoding value increases from the zero index to the maximum index.\n" }, j: { value: "j", display_name: "j", description: "The encoding direction is along the second axis of the data in the NIFTI file,\nand the encoding value increases from the zero index to the maximum index.\n" }, k: { value: "k", display_name: "k", description: "The encoding direction is along the third axis of the data in the NIFTI file,\nand the encoding value increases from the zero index to the maximum index.\n" }, iMinus: { value: "i-", display_name: "i-", description: "The encoding direction is along the first axis of the data in the NIFTI file,\nand the encoding value decreases from the zero index to the maximum index.\n" }, jMinus: { value: "j-", display_name: "j-", description: "The encoding direction is along the second axis of the data in the NIFTI file,\nand the encoding value decreases from the zero index to the maximum index.\n" }, kMinus: { value: "k-", display_name: "k-", description: "The encoding direction is along the third axis of the data in the NIFTI file,\nand the encoding value decreases from the zero index to the maximum index.\n" }, continuous: { value: "continuous", display_name: "Continuous recording", description: "Continuous recording.\n" }, epoched: { value: "epoched", display_name: "Epoched recording", description: "Recording is limited to time windows around events of interest\n(for example, stimulus presentations or subject responses).\n" }, discontinuous: { value: "discontinuous", display_name: "Discontinuous recording", description: "Discontinuous recording.\n" }, orig: { value: "orig", display_name: "orig", description: "A (potentially unique) per-image space.\nUseful for describing the source of transforms from an input image to a target space.\n" }, Brain: { value: "Brain", display_name: "Brain mask", description: "A brain mask.\n" }, Lesion: { value: "Lesion", display_name: "Lesion mask", description: "A lesion mask.\n" }, Face: { value: "Face", display_name: "Face mask", description: "A face mask.\n" }, ROI: { value: "ROI", display_name: "ROI mask", description: "A region of interest mask.\n" }, CapTrak: { value: "CapTrak", display_name: "CapTrak", description: "RAS orientation and the origin approximately between LPA and RPA\n" }, EEGLAB: { value: "EEGLAB", display_name: "EEGLAB", description: "ALS orientation and the origin exactly between LPA and RPA.\nFor more information, see the\n[EEGLAB wiki page](https://eeglab.org/tutorials/ConceptsGuide/coordinateSystem.html#eeglab-coordinate-system).\n" }, "EEGLAB-HJ": { value: "EEGLAB-HJ", display_name: "EEGLAB-HJ", description: "ALS orientation and the origin exactly between LHJ and RHJ.\nFor more information, see the\n[EEGLAB wiki page](https://eeglab.org/tutorials/ConceptsGuide/coordinateSystem.html#\\\neeglab-hj-coordinate-system).\n" }, Other: { value: "Other", display_name: "Other", description: "Other coordinate system.\n" }, Genetic: { value: "Genetic", display_name: "Genetic", description: "Data report on a single genetic location (typically directly in the `participants.tsv` file).\n" }, Genomic: { value: "Genomic", display_name: "Genomic", description: "Data link to participants' genome (multiple genetic locations).\n" }, Epigenomic: { value: "Epigenomic", display_name: "Epigenomic", description: "Data link to participants' characterization of reversible modifications of DNA.\n" }, Transcriptomic: { value: "Transcriptomic", display_name: "Transcriptomic", description: "Data link to participants RNA levels.\n" }, Metabolomic: { value: "Metabolomic", display_name: "Metabolomic", description: "Data link to participants' products of cellular metabolic functions.\n" }, Proteomic: { value: "Proteomic", display_name: "Proteomic", description: "Data link to participants peptides and proteins quantification.\n" }, CTF: { value: "CTF", display_name: "CTF", description: "ALS orientation and the origin between the ears.\n" }, ElektaNeuromag: { value: "ElektaNeuromag", display_name: "Elekta Neuromag", description: "RAS orientation and the origin between the ears.\n" }, "4DBti": { value: "4DBti", display_name: "4D BTI", description: "ALS orientation and the origin between the ears.\n" }, KitYokogawa: { value: "KitYokogawa", display_name: "KIT/Yokogawa", description: "ALS orientation and the origin between the ears.\n" }, ChietiItab: { value: "ChietiItab", display_name: "Chieti ITAB", description: "RAS orientation and the origin between the ears.\n" }, individual: { value: "individual", display_name: "individual", description: "Participant specific anatomical space (for example derived from T1w and/or T2w images).\nThis coordinate system requires specifying an additional, participant-specific file to be fully defined.\nIn context of surfaces this space has been referred to as `fsnative`.\n\nIn order for this space to be interpretable, `SpatialReference` metadata MUST be provided.\n" }, study: { value: "study", display_name: "study", description: "Custom space defined using a group/study-specific template.\nThis coordinate system requires specifying an additional file to be fully defined.\n\nIn order for this space to be interpretable, `SpatialReference` metadata MUST be provided.\n" }, scanner: { value: "scanner", display_name: "scanner", description: "The intrinsic coordinate system of the original image (the first entry of `RawSources`)\nafter reconstruction and conversion to NIfTI or equivalent for the case of surfaces and dual volume/surface\nfiles.\n\nThe `scanner` coordinate system is implicit and assumed by default if the derivative filename does not\ndefine **any** `space-<label>`.\nPlease note that `space-scanner` SHOULD NOT be used,\nit is mentioned in this specification to make its existence explicit.\n" }, ICBM452AirSpace: { value: "ICBM452AirSpace", display_name: "ICBM452AirSpace", description: 'Reference space defined by the "average of 452 T1-weighted MRIs of normal young adult brains"\nwith "linear transforms of the subjects into the atlas space using a 12-parameter affine\ntransformation".\n' }, ICBM452Warp5Space: { value: "ICBM452Warp5Space", display_name: "ICBM452Warp5Space", description: 'Reference space defined by the "average of 452 T1-weighted MRIs of normal young adult brains"\n"based on a 5th order polynomial transformation into the atlas space".\n' }, IXI549Space: { value: "IXI549Space", display_name: "IXI549Space", description: 'Reference space defined by the average of the "549 (...) subjects from the IXI dataset"\nlinearly transformed to ICBM MNI 452.\n\nUsed by SPM12.\n' }, fsaverage: { value: "fsaverage", display_name: "fsaverage", description: "The `fsaverage` is a **dual template** providing both volumetric and surface coordinates references.\nThe volumetric template corresponds to a FreeSurfer variant of `MNI305` space.\nThe `fsaverage` atlas also defines a surface reference system (formerly described as fsaverage[3|4|5|6|sym]).\n\nUsed by Freesurfer.\n" }, fsaverageSym: { value: "fsaverageSym", display_name: "fsaverageSym", description: "The `fsaverage` is a **dual template** providing both volumetric and surface coordinates references.\nThe volumetric template corresponds to a FreeSurfer variant of `MNI305` space.\nThe `fsaverageSym` atlas also defines a symmetric surface reference system\n(formerly described as `fsaveragesym`).\n\nUsed by Freesurfer.\n" }, fsLR: { value: "fsLR", display_name: "fsLR", description: "The `fsLR` is a **dual template** providing both volumetric and surface coordinates references.\nThe volumetric template corresponds to `MNI152NLin6Asym`.\nSurface templates are given at several sampling densities:\n164k (used by HCP pipelines for 3T and 7T anatomical analysis),\n59k (used by HCP pipelines for 7T MRI bold and DWI analysis),\n32k (used by HCP pipelines for 3T MRI bold and DWI analysis), or\n4k (used by HCP pipelines for MEG analysis) fsaverage_LR surface reconstructed from the T1w image.\n\nUsed by Freesurfer.\n" }, MNIColin27: { value: "MNIColin27", display_name: "MNIColin27", description: "Average of 27 T1 scans of a single subject.\n\nUsed by SPM96.\n" }, MNI152Lin: { value: "MNI152Lin", display_name: "MNI152Lin", description: "Also known as ICBM (version with linear coregistration).\n\nUsed by SPM99 to SPM8.\n" }, MNI152NLin2009aSym: { value: "MNI152NLin2009aSym", display_name: "MNI152NLin2009aSym", description: "Also known as ICBM (non-linear coregistration with 40 iterations, released in 2009).\nThis is the first symmetric version.\n\nUsed by the DARTEL toolbox in SPM12b.\n" }, MNI152NLin2009bSym: { value: "MNI152NLin2009bSym", display_name: "MNI152NLin2009bSym", description: "Also known as ICBM (non-linear coregistration with 40 iterations, released in 2009).\nThis is the second symmetric version.\n\nUsed by the DARTEL toolbox in SPM12b.\n" }, MNI152NLin2009cSym: { value: "MNI152NLin2009cSym", display_name: "MNI152NLin2009cSym", description: "Also known as ICBM (non-linear coregistration with 40 iterations, released in 2009).\nThis is the third symmetric version.\n\nUsed by the DARTEL toolbox in SPM12b.\n" }, MNI152NLin2009aAsym: { value: "MNI152NLin2009aAsym", display_name: "MNI152NLin2009aAsym", description: "Also known as ICBM (non-linear coregistration with 40 iterations, released in 2009).\nThis is the first asymmetric version.\n\nUsed by the DARTEL toolbox in SPM12b.\n" }, MNI152NLin2009bAsym: { value: "MNI152NLin2009bAsym", display_name: "MNI152NLin2009bAsym", description: "Also known as ICBM (non-linear coregistration with 40 iterations, released in 2009).\nThis is the second asymmetric version.\n\nUsed by the DARTEL toolbox in SPM12b.\n" }, MNI152NLin2009cAsym: { value: "MNI152NLin2009cAsym", display_name: "MNI152NLin2009cAsym", description: "Also known as ICBM (non-linear coregistration with 40 iterations, released in 2009).\nThis is the third asymmetric version.\n\nUsed by the DARTEL toolbox in SPM12b.\n" }, MNI152NLin6Sym: { value: "MNI152NLin6Sym", display_name: "MNI152NLin6Sym", description: "Also known as symmetric ICBM 6th generation (non-linear coregistration).\n\nUsed by FSL.\n" }, MNI152NLin6ASym: { value: "MNI152NLin6ASym", display_name: "MNI152NLin6ASym", description: "A variation of `MNI152NLin6Sym` built by A. Janke that is released as the _MNI template_ of FSL.\nVolumetric templates included with\n[HCP-Pipelines](https://github.com/Washington-University/HCPpipelines/tree/master/global/templates)\ncorrespond to this template too.\n\nUsed by FSL and HPC-Pipelines.\n" }, MNI305: { value: "MNI305", display_name: "MNI205", description: "Also known as avg305.\n" }, NIHPD: { value: "NIHPD", display_name: "NIHPD", description: "Pediatric templates generated from the NIHPD sample.\nAvailable for different age groups\n(4.5-18.5 y.o., 4.5-8.5 y.o., 7-11 y.o., 7.5-13.5 y.o., 10-14 y.o., 13-18.5 y.o.).\nThis template also comes in either -symmetric or -asymmetric flavor.\n" }, OASIS30AntsOASISAnts: { value: "OASIS30AntsOASISAnts", display_name: "OASIS30AntsOASISAnts", description: "OASIS30AntsOASISAnts\n" }, OASIS30Atropos: { value: "OASIS30Atropos", display_name: "OASIS30Atropos", description: "OASIS30Atropos\n" }, Talairach: { value: "Talairach", display_name: "Talairach", description: "Piecewise linear scaling of the brain is implemented as described in TT88.\n" }, UNCInfant: { value: "UNCInfant", display_name: "UNCInfant", description: "Infant Brain Atlases from Neonates to 1- and 2-year-olds.\n" }, fsaverage3: { value: "fsaverage3", display_name: "fsaverage3", description: "Images were sampled to the FreeSurfer surface reconstructed from the subject's T1w image,\nand registered to an fsaverage template.\nFor new datasets, the recommended alternative is fsaverage.\n" }, fsaverage4: { value: "fsaverage4", display_name: "fsaverage4", description: "Images were sampled to the FreeSurfer surface reconstructed from the subject's T1w image,\nand registered to an fsaverage template.\nFor new datasets, the recommended alternative is fsaverage.\n" }, fsaverage5: { value: "fsaverage5", display_name: "fsaverage5", description: "Images were sampled to the FreeSurfer surface reconstructed from the subject's T1w image,\nand registered to an fsaverage template.\nFor new datasets, the recommended alternative is fsaverage.\n" }, fsaverage6: { value: "fsaverage6", display_name: "fsaverage6", description: "Images were sampled to the FreeSurfer surface reconstructed from the subject's T1w image,\nand registered to an fsaverage template.\nFor new datasets, the recommended alternative is fsaverage.\n" }, fsaveragesym: { value: "fsaveragesym", display_name: "fsaveragesym", description: "Images were sampled to the FreeSurfer surface reconstructed from the subject's T1w image,\nand registered to an fsaverage template.\nFor new datasets, the recommended alternative is fsaverageSym.\n" }, UNCInfant0V21: { value: "UNCInfant0V21", display_name: "UNCInfant0V21", description: "Infant Brain Atlases from Neonates to 1- and 2-year-olds. See https://www.nitrc.org/projects/pediatricatlas.\nFor new datasets, the recommended alternative is UNCInfant.\n" }, UNCInfant1V21: { value: "UNCInfant1V21", display_name: "UNCInfant1V21", description: "Infant Brain Atlases from Neonates to 1- and 2-year-olds. See https://www.nitrc.org/projects/pediatricatlas.\nFor new datasets, the recommended alternative is UNCInfant.\n" }, UNCInfant2V21: { value: "UNCInfant2V21", display_name: "UNCInfant2V21", description: "Infant Brain Atlases from Neonates to 1- and 2-year-olds. See https://www.nitrc.org/projects/pediatricatlas.\nFor new datasets, the recommended alternative is UNCInfant.\n" }, UNCInfant0V22: { value: "UNCInfant0V22", display_name: "UNCInfant0V22", description: "Infant Brain Atlases from Neonates to 1- and 2-year-olds. See https://www.nitrc.org/projects/pediatricatlas.\nFor new datasets, the recommended alternative is UNCInfant.\n" }, UNCInfant1V22: { value: "UNCInfant1V22", display_name: "UNCInfant1V22", description: "Infant Brain Atlases from Neonates to 1- and 2-year-olds. See https://www.nitrc.org/projects/pediatricatlas.\nFor new datasets, the recommended alternative is UNCInfant.\n" }, UNCInfant2V22: { value: "UNCInfant2V22", display_name: "UNCInfant2V22", description: "Infant Brain Atlases from Neonates to 1- and 2-year-olds. See https://www.nitrc.org/projects/pediatricatlas.\nFor new datasets, the recommended alternative is UNCInfant.\n" }, UNCInfant0V23: { value: "UNCInfant0V23", display_name: "UNCInfant0V23", description: "Infant Brain Atlases from Neonates to 1- and 2-year-olds. See https://www.nitrc.org/projects/pediatricatlas.\nFor new datasets, the recommended alternative is UNCInfant.\n" }, UNCInfant1V23: { value: "UNCInfant1V23", display_name: "UNCInfant1V23", description: "Infant Brain Atlases from Neonates to 1- and 2-year-olds. See https://www.nitrc.org/projects/pediatricatlas.\nFor new datasets, the recommended alternative is UNCInfant.\n" }, UNCInfant2V23: { value: "UNCInfant2V23", display_name: "UNCInfant2V23", description: "Infant Brain Atlases from Neonates to 1- and 2-year-olds. See https://www.nitrc.org/projects/pediatricatlas.\nFor new datasets, the recommended alternative is UNCInfant.\n" }, Pixels: { value: "Pixels", display_name: "Pixels", description: "If electrodes are localized in 2D space (only x and y are\nspecified and z is n/a), then the positions in this file must correspond to\nthe locations expressed in pixels on the photo/drawing/rendering of the\nelectrodes on the brain. In this case, coordinates must be (row,column)\npairs, with (0,0) corresponding to the upper left pixel and (N,0)\ncorresponding to the lower left pixel.\n" }, ACPC: { value: "ACPC", display_name: "ACPC", description: "The origin of the coordinate system is at the Anterior Commissure\nand the negative y-axis is passing through the Posterior Commissure. The\npositive z-axis is passing through a mid-hemispheric point in the superior\ndirection. The anatomical landmarks are determined in the individual's\nanatomical scan and no scaling or deformations have been applied to the\nindividual's anatomical scan. For more information, see the\n[ACPC site](https://www.fieldtriptoolbox.org/faq/acpc/) on the FieldTrip\ntoolbox wiki.\n" }, ScanRAS: { value: "ScanRAS", display_name: "ScanRAS", description: "The origin of the coordinate system is the center of the\ngradient coil for the corresponding T1w image of the subject, and the x-axis\nincreases left to right, the y-axis increases posterior to anterior and\nthe z-axis increases inferior to superior. For more information see the\n[Nipy Documentation](https://nipy.org/nibabel/coordinate_systems.html). It is\nstrongly encouraged to align the subject's T1w to ACPC so that the `ACPC`\ncoordinate system can be used. If the subject's T1w in the BIDS dataset\nis not aligned to ACPC, `ScanRAS` should be used.\n" }, on__mtransfer: { value: "on", display_name: "On", description: "The image acquired in the presence of the magnetization transfer pulse,\nalso known as the off-resonance pulse.\n" }, off__mtransfer: { value: "off", display_name: "Off", description: "The image acquired in the absence of the magnetization transfer pulse.\n" }, magnitude: { value: "mag", display_name: "Magnitude", description: 'A magnitude image, typically paired with an associated "phase" image.\n' }, phase: { value: "phase", display_name: "Phase", description: 'A phase image, typically paird with an associated "magnitude" (part-mag) image.\nImages with this key/value pair MAY be in radians or in arbitrary units.\nThe sidecar JSON file MUST include the units of the `phase` image.\nThe possible options are `rad` or `arbitrary`.\n' }, real: { value: "real", display_name: "Real", description: 'A real-valued image, typically paired with an associated "imaginary" (part-imag) image.\n' }, imaginary: { value: "imag", display_name: "Imaginary", description: 'An imaginary-valued image, typically paird with an associated "real" image.\n' }, ACCEL: { value: "ACCEL", display_name: "ACCEL", tags: ["fnirs", "motion"], description: "Accelerometer channel, one channel for each spatial axis.\nColumn `component` for the axis MUST be added to the `*_channels.tsv` file (x, y, or z).\n" }, ANGACCEL: { value: "ANGACCEL", display_name: "ANGACCEL", tags: ["motion"], description: "Angular acceleration channel, one channel for each spatial axis.\nColumn `component` for the axis MUST be added to the `*_channels.tsv` file (x, y, or z).\n" }, GYRO: { value: "GYRO", display_name: "GYRO", tags: ["fnirs", "motion"], description: "Gyrometer channel, one channel for each spatial axis.\nColumn `component` for the axis MUST be added to the `*_channels.tsv` file (x, y, or z).\n" }, JNTANG: { value: "JNTANG", display_name: "JNTANG", tags: ["motion"], description: "Joint angle channel between two fixed axis belonging to two bodyparts.\nAngle SHOULD be defined between proximal and distal bodypart in `deg`.\n" }, LATENCY: { value: "LATENCY", display_name: "LATENCY", tags: ["motion"], description: "Latency of samples in seconds from recording onset.\nMUST be in form of `ss[.000000]`,\nwhere `[.000000]` is an optional subsecond resolution between 1 and 6 decimal points.\n" }, MAGN: { value: "MAGN", display_name: "MAGN", tags: ["fnirs", "motion"], description: "Magnetic field strength, one channel for each spatial axis.\nColumn `component` for the axis MUST be added to the `*_channels.tsv` file (x, y or z).\n" }, MISC: { value: "MISC", display_name: "MISC", tags: ["eeg", "meg", "ieeg", "fnirs", "motion"], description: "Miscellaneous channels.\n" }, ORNT: { value: "ORNT", display_name: "ORNT", tags: ["fnirs", "motion"], description: "Orientation channel, one channel for each spatial axis or quaternion component.\nColumn `component` for the axis or quaternion label MUST be added to the `*_channels.tsv` file\n(x, y, z, quat_x, quat_y, quat_z, or quat_w).\n" }, POS: { value: "POS", display_name: "POS", tags: ["motion"], description: "Position in space, one channel for each spatial axis.\nColumn `component` for the axis MUST be added to the `*_channels.tsv` file (x, y or z).\n" }, VEL: { value: "VEL", display_name: "VEL", tags: ["motion"], description: "Velocity, one channel for each spatial axis.\nColumn `component` for the axis MUST be added to the `*_channels.tsv` file (x, y or z).\n" }, AUDIO: { value: "AUDIO", display_name: "AUDIO", tags: ["eeg", "meg", "ieeg", "fnirs"], description: "Audio signal.\n" }, EEG: { value: "EEG", display_name: "EEG", tags: ["eeg", "meg", "ieeg", "fnirs"], description: "Electroencephalogram channel.\n" }, EOG: { value: "EOG", display_name: "EOG", tags: ["eeg", "meg", "ieeg", "fnirs"], description: "Generic electrooculogram (eye), different from HEOG and VEOG.\n" }, ECG: { value: "ECG", display_name: "ECG", tags: ["eeg", "meg", "ieeg", "fnirs"], description: "Electrocardiogram (heart).\n" }, EMG: { value: "EMG", display_name: "EMG", tags: ["eeg", "meg", "ieeg", "fnirs"], description: "Electromyogram (muscle).\n" }, EYEGAZE: { value: "EYEGAZE", display_name: "EYEGAZE", tags: ["eeg", "meg", "ieeg", "fnirs"], description: "Eye tracker gaze.\n" }, GSR: { value: "GSR", display_name: "GSR", tags: ["eeg"], description: "Galvanic skin response.\n" }, HEOG: { value: "HEOG", display_name: "HEOG", tags: ["eeg", "meg", "ieeg", "fnirs"], description: "Horizontal EOG (eye).\n" }, PPG: { value: "PPG", display_name: "PPG", tags: ["eeg"], description: "Photoplethysmography.\n" }, PUPIL: { value: "PUPIL", display_name: "PUPIL", tags: ["eeg", "meg", "ieeg", "fnirs"], description: "Eye tracker pupil diameter.\n" }, REF: { value: "REF", display_name: "REF", tags: ["eeg", "ieeg"], description: "Reference channel.\n" }, RESP: { value: "RESP", display_name: "RESP", tags: ["eeg"], description: "Respiration.\n" }, SYSCLOCK: { value: "SYSCLOCK", display_name: "SYSCLOCK", tags: ["eeg", "meg", "ieeg", "fnirs"], description: "System time showing elapsed time since trial started.\n" }, TEMP: { value: "TEMP", display_name: "TEMP", tags: ["eeg"], description: "Temperature.\n" }, TRIG: { value: "TRIG", display_name: "TRIG", tags: ["eeg", "meg", "ieeg", "fnirs"], description: "Analog (TTL in Volt) or digital (binary TTL) trigger channel.\n" }, VEOG: { value: "VEOG", display_name: "VEOG", tags: ["eeg", "meg", "ieeg", "fnirs"], description: "Vertical EOG (eye).\n" }, MEGMAG: { value: "MEGMAG", display_name: "MEGMAG", tags: ["meg", "fnirs"], description: "MEG magnetometer.\n" }, MEGGRADAXIAL: { value: "MEGGRADAXIAL", display_name: "MEGGRADAXIAL", tags: ["meg", "fnirs"], description: "MEG axial gradiometer.\n" }, MEGGRADPLANAR: { value: "MEGGRADPLANAR", display_name: "MEGGRADPLANAR", tags: ["meg", "fnirs"], description: "MEG planargradiometer.\n" }, MEGREFMAG: { value: "MEGREFMAG", display_name: "MEGREFMAG", tags: ["meg", "fnirs"], description: "MEG reference magnetometer.\n" }, MEGREFGRADAXIAL: { value: "MEGREFGRADAXIAL", display_name: "MEGREFGRADAXIAL", tags: ["meg", "fnirs"], description: "MEG reference axial gradiometer.\n" }, MEGREFGRADPLANAR: { value: "MEGREFGRADPLANAR", display_name: "MEGREFGRADPLANAR", tags: ["meg", "fnirs"], description: "MEG reference planar gradiometer.\n" }, MEGOTHER: { value: "MEGOTHER", display_name: "MEGOTHER", tags: ["meg", "ieeg", "fnirs"], description: "Any other type of MEG sensor.\n" }, ECOG: { value: "ECOG", display_name: "ECOG", tags: ["meg", "ieeg", "fnirs"], description: "Electrode channel.\n" }, SEEG: { value: "SEEG", display_name: "SEEG", tags: ["meg", "ieeg", "fnirs"], description: "Electrode channel.\n" }, DBS: { value: "DBS", display_name: "DBS", tags: ["meg", "ieeg", "fnirs"], description: "Electrode channel.\n" }, PD: { value: "PD", display_name: "PD", tags: ["meg", "ieeg", "fnirs"], description: "Photodiode.\n" }, ADC: { value: "ADC", display_name: "ADC", tags: ["meg", "ieeg", "fnirs"], description: "Analog to Digital input.\n" }, DAC: { value: "DAC", display_name: "DAC", tags: ["meg", "ieeg", "fnirs"], description: "Digital to Analog output.\n" }, HLU: { value: "HLU", display_name: "HLU", tags: ["meg", "fnirs"], description: "Measured position of head and head coils.\n" }, FITERR: { value: "FITERR", display_name: "FITERR", tags: ["meg", "fnirs"], description: "Fit error signal from each head localization coil.\n" }, OTHER: { value: "OTHER", display_name: "OTHER", tags: ["meg", "fnirs"], description: "Any other type of channel.\n" }, NIRSCWAMPLITUDE: { value: "NIRSCWAMPLITUDE", display_name: "NIRSCWAMPLITUDE", tags: ["fnirs"], description: "Continuous wave amplitude measurements. Equivalent to dataType 001 in SNIRF.\n" }, NIRSCWFLUORESCENSEAMPLITUDE: { value: "NIRSCWFLUORESCENSEAMPLITUDE", display_name: "NIRSCWFLUORESCENSEAMPLITUDE", tags: ["fnirs"], description: "Continuous wave fluorescence amplitude measurements. Equivalent to dataType 051 in SNIRF.\n" }, NIRSCWOPTICALDENSITY: { value: "NIRSCWOPTICALDENSITY", display_name: "NIRSCWOPTICALDENSITY", tags: ["fnirs"], description: "Continuous wave change in optical density measurements. Equivalent to dataTypeLabel dOD in SNIRF.\n" }, NIRSCWHBO: { value: "NIRSCWHBO", display_name: "NIRSCWHBO", tags: ["fnirs"], description: "Continuous wave oxygenated hemoglobin (oxyhemoglobin) concentration measurements.\nEquivalent to dataTypeLabel HbO in SNIRF.\n" }, NIRSCWHBR: { value: "NIRSCWHBR", display_name: "NIRSCWHBR", tags: ["fnirs"], description: "Continuous wave deoxygenated hemoglobin (deoxyhemoglobin) concentration measurements.\nEquivalent to dataTypeLabel HbR in SNIRF.\n" }, NIRSCWMUA: { value: "NIRSCWMUA", display_name: "NIRSCWMUA", tags: ["fnirs"], description: "Continuous wave optical absorption measurements. Equivalent to dataTypeLabel mua in SNIRF.\n" } }, extensions: { ave: { value: ".ave", display_name: "AVE", description: "File containing data averaged by segments of interest.\n\nUsed by KIT, Yokogawa, and Ricoh MEG systems.\n" }, bdf: { value: ".bdf", display_name: "Biosemi Data Format", description: "A [Biosemi](https://www.biosemi.com/) Data Format file.\n\nEach recording consists of a single `.bdf` file.\n[`bdf+`](https://www.teuniz.net/edfbrowser/bdfplus%20format%20description.html) files are permitted.\nThe capital `.BDF` extension MUST NOT be used.\n" }, bval: { value: ".bval", display_name: "FSL-Format Gradient Amplitudes", description: "A space-delimited file containing gradient directions (b-vectors) of diffusion measurement.\n\nThe `bval` file contains the *b*-values (in s/mm<sup>2</sup>) corresponding to the\nvolumes in the relevant NIfTI file, with 0 designating *b*=0 volumes.\n" }, bvec: { value: ".bvec", display_name: "FSL-Format Gradient Directions", description: "A space-delimited file containing gradient directions (b-vectors) of diffusion measurement.\n\nThis file contains 3 rows with *N* space-delimited floating-point numbers,\ncorresponding to the *N* volumes in the corresponding NIfTI file.\n\nThe first row contains the *x* elements, the second row contains the *y* elements and\nthe third row contains the *z* elements of a unit vector in the direction of the applied\ndiffusion gradient, where the *i*-th elements in each row correspond together to\nthe *i*-th volume, with `[0,0,0]` for *non-diffusion-weighted* (also called *b*=0 or *low-b*)\nvolumes.\n\nFollowing the FSL format for the `bvec` specification, the coordinate system of\nthe *b* vectors MUST be defined with respect to the coordinate system defined by\nthe header of the corresponding `_dwi` NIfTI file and not the scanner's device\ncoordinate system (see [Coordinate systems](SPEC_ROOT/appendices/coordinate-systems.md)).\nThe most relevant limitation imposed by this choice is that the gradient information cannot\nbe directly stored in this format if the scanner generates *b*-vectors in *scanner coordinates*.\n" }, chn: { value: ".chn", display_name: "KRISS CHN", description: "A file generated by KRISS MEG systems containing the position of the center of the MEG coils.\n\nEach experimental run on the KRISS system produces a file with extension `.kdf`.\nAdditional files that may be available in the same directory include\nthe digitized positions of the head points (`\\_digitizer.txt`),\nthe position of the center of the MEG coils (`.chn`),\nand the event markers (`.trg`).\n" }, con: { value: ".con", display_name: "KIT/Yokogawa/Ricoh Continuous Data", description: "Raw continuous data from a KIT/Yokogawa/Ricoh MEG system.\n\nSuccessor to the `.sqd` extension for raw continuous data.\n" }, dat: { value: ".dat", display_name: "MEG Fine-Calibration Format", description: "A fine-calibration file used for Neuromag/Elekta/MEGIN MEG recording hardware.\n" }, CTF: { value: ".ds/", display_name: "CTF MEG Dataset Directory", description: "A directory for MEG data, typically containing a `.meg4` file for the data and a `.res4` file for the resources.\n" }, dlabelnii: { value: ".dlabel.nii", display_name: "CIFTI-2 Dense Label File", description: "A CIFTI-2 dense label file.\n\nThis extension may only be used in derivative datasets.\n" }, edf: { value: ".edf", display_name: "European Data Format", description: "A [European data format](https://www.edfplus.info/) file.\n\nEach recording consists of a single `.edf`` file.\n[`edf+`](https://www.edfplus.info/specs/edfplus.html) files are permitted.\nThe capital `.EDF` extension MUST NOT be used.\n" }, eeg: { value: ".eeg", display_name: "BrainVision Binary Data", description: "A binary data file in the\n[BrainVision Core Data Format](https://www.brainproducts.com/support-resources/brainvision-core-data-format-1-0/).\nThese files come in three-file sets, including a `.vhdr`, a `.vmrk`, and a `.eeg` file.\n" }, fdt: { value: ".fdt", display_name: "EEGLAB FDT", description: "An [EEGLAB](https://sccn.ucsd.edu/eeglab) file.\n\nThe format used by the MATLAB toolbox [EEGLAB](https://sccn.ucsd.edu/eeglab).\nEach recording consists of a `.set` file with an optional `.fdt` file.\n" }, fif: { value: ".fif", display_name: "Functional Imaging File Format", description: "An MEG file format used by Neuromag, Elekta, and MEGIN.\n" }, jpg: { value: ".jpg", display_name: "Joint Photographic Experts Group Format", description: "A JPEG image file.\n" }, json: { value: ".json", display_name: "JavaScript Object Notation", description: 'A JSON file.\n\nIn the BIDS specification, JSON files are primarily used as "sidecar" files, in which metadata describing "data"\nfiles are encoded.\nThese sidecar files follow the inheritance principle.\n\nThere are also a few special cases of JSON files being first-order data files, such as `genetic_info.json`.\n' }, kdf: { value: ".kdf", display_name: "KRISS KDF", description: "A KRISS (file with extension `.kdf`) file.\n\nEach experimental run on the KRISS system produces a file with extension `.kdf`.\nAdditional files that may be available in the same directory include\nthe digitized positions of the head points (`\\_digitizer.txt`),\nthe position of the center of the MEG coils (`.chn`),\nand the event markers (`.trg`).\n" }, labelgii: { value: ".label.gii", display_name: "GIFTI label/annotation file", description: "A GIFTI label/annotation file.\n\nThis extension may only be used in derivative datasets.\n" }, md: { value: ".md", display_name: "Markdown", description: "A Markdown file.\n" }, mefd: { value: ".mefd/", display_name: "Multiscale Electrophysiology File Format Version 3.0", description: "A directory in the [MEF3](https://osf.io/e3sf9/) format.\n\nEach recording consists of a `.mefd` directory.\n" }, mhd: { value: ".mhd", display_name: "ITAB Binary Header", description: "Produced by ITAB-ARGOS153 systems. This file a binary header file, and is generated along with a\nraw data file with the `.raw` extension.\n" }, mrk: { value: ".mrk", display_name: "MRK", description: "A file containing MEG sensor coil positions.\n\nUsed by KIT, Yokogawa, and Ricoh MEG systems.\nSuccessor to the `.sqd` extension for marker files.\n" }, OMEZARR: { value: ".ome.zarr/", display_name: "OME Next Generation File Format", description: "An OME-NGFF file.\n\nOME-NGFF is a [Zarr](https://zarr.readthedocs.io)-based format, organizing data arrays in nested directories.\nThis format was developed by the Open Microscopy Environment to provide data stream access to very large data.\n" }, nii: { value: ".nii", display_name: "NIfTI", description: "A Neuroimaging Informatics Technology Initiative (NIfTI) data file.\n" }, niigz: { value: ".nii.gz", display_name: "Compressed NIfTI", description: "A compressed Neuroimaging Informatics Technology Initiative (NIfTI) data file.\n" }, nwb: { value: ".nwb", display_name: "Neurodata Without Borders Format", description: "A [Neurodata Without Borders](https://nwb-schema.readthedocs.io) file.\n\nEach recording consists of a single `.nwb` file.\n" }, OMEBigTiff: { value: ".ome.btf", display_name: "Open Microscopy Environment BigTIFF", description: "A [BigTIFF](https://www.awaresystems.be/imaging/tiff/bigtiff.html) image file, for very large images.\n" }, OMETiff: { value: ".ome.tif", display_name: "Open Microscopy Environment Tag Image File Format", description: "An [OME-TIFF](https://docs.openmicroscopy.org/ome-model/6.1.2/ome-tiff/specification.html#) image file.\n" }, png: { value: ".png", display_name: "Portable Network Graphics", description: "A [Portable Network Graphics](http://www.libpng.org/pub/png/) file.\n" }, pos: { value: ".pos", display_name: "Head Point Position", description: "File containing digitized positions of the head points.\n\nThis may be produced by a 4D neuroimaging/BTi MEG system or a CTF MEG system.\n" }, raw: { value: ".raw", display_name: "RAW", description: "When produced by a KIT / Yokogawa / Ricoh MEG system, this file contains trial-based evoked fields.\n\nWhen produced by an ITAB-ARGOS153 system, this file contains raw data and is generated along with\nan associated binary header file  with the `.mhd` extension.\n" }, rst: { value: ".rst", display_name: "reStructuredText", description: "A [reStructuredText](https://docutils.sourceforge.io/rst.html) file.\n" }, set: { value: ".set", display_name: "EEGLAB SET", description: "An [EEGLAB](https://sccn.ucsd.edu/eeglab) file.\n\nThe format used by the MATLAB toolbox [EEGLAB](https://sccn.ucsd.edu/eeglab).\nEach recording consists of a `.set` file with an optional `.fdt` file.\n" }, snirf: { value: ".snirf", display_name: "Shared Near Infrared Spectroscopy Format", description: "HDF5 file organized according to the [SNIRF specification](https://github.com/fNIRS/snirf)\n" }, sqd: { value: ".sqd", display_name: "SQD", description: "A file containing either raw MEG data or MEG sensor coil positions.\nWhile this extension is still valid, it has been succeeded by `.con` for raw MEG data and `.mrk` for\nmarker information.\n\nUsed by KIT, Yokogawa, and Ricoh MEG systems.\n" }, tif: { value: ".tif", display_name: "Tag Image File Format", description: "A [Tag Image File Format](https://en.wikipedia.org/wiki/TIFF) file.\n" }, trg: { value: ".trg", display_name: "KRISS TRG", description: "A file generated by KRISS MEG systems containing the event markers.\n\nEach experimental run on the KRISS system produces a file with extension `.kdf`.\nAdditional files that may be available in the same directory include\nthe digitized positions of the head points (`\\_digitizer.txt`),\nthe position of the center of the MEG coils (`.chn`),\nand the event markers (`.trg`).\n" }, tsv: { value: ".tsv", display_name: "Tab-Delimited", description: "A tab-delimited file.\n" }, tsvgz: { value: ".tsv.gz", display_name: "Compressed Tab-Delimited", description: "A gzipped tab-delimited file.\nThis file extension is only used for very large tabular data, such as physiological recordings.\nFor smaller data, the unzipped `.tsv` extension is preferred.\n" }, txt: { value: ".txt", display_name: "Text", description: "A free-form text file.\n\nTab-delimited files should have the `.tsv` extension rather than a `.txt` extension.\n" }, vhdr: { value: ".vhdr", display_name: "BrainVision Text Header", description: "A text header file in the\n[BrainVision Core Data Format](https://www.brainproducts.com/support-resources/brainvision-core-data-format-1-0/).\nThese files come in three-file sets, including a `.vhdr`, a `.vmrk`, and a `.eeg` file.\n" }, vmrk: { value: ".vmrk", display_name: "BrainVision Marker", description: "A text marker file in the\n[BrainVision Core Data Format](https://www.brainproducts.com/support-resources/brainvision-core-data-format-1-0/).\nThese files come in three-file sets, including a `.vhdr`, a `.vmrk`, and a `.eeg` file.\n" }, Any: { value: ".*", display_name: "Any Extension", description: "Any extension is allowed.\n" }, None: { value: "", display_name: "No extension", description: "A file with no extension.\n" }, Directory: { value: "/", display_name: "Directory", description: "A directory with no extension.\nCorresponds to BTi/4D data.\n" } }, files: { CHANGES: { display_name: "Changelog", file_type: "regular", description: "Version history of the dataset (describing changes, updates and corrections) MAY be provided in\nthe form of a `CHANGES` text file.\nThis file MUST follow the\n[CPAN Changelog convention](https://metacpan.org/pod/release/HAARG/CPAN-Changes-0.400002/lib/\\\nCPAN/Changes/Spec.pod).\nThe `CHANGES` file MUST be either in ASCII or UTF-8 encoding.\n" }, CITATION: { display_name: "CITATION.cff", file_type: "regular", description: "A description of the citation information for the dataset, following the\n[Citation File Format](https://citation-file-format.github.io/) specification.\nThis file permits more detailed and structured descriptions than\n[dataset_description.json](SPEC_ROOT/glossary.md#dataset_description-files).\n" }, LICENSE: { display_name: "License", file_type: "regular", description: 'A `LICENSE` file MAY be provided in addition to the short specification of the\nused license in the `dataset_description.json` `"License"` field.\nThe `"License"` field and `LICENSE` file MUST correspond.\nThe `LICENSE` file MUST be either in ASCII or UTF-8 encoding.\n' }, README: { display_name: "README", file_type: "regular", description: "A REQUIRED text file, `README`, SHOULD describe the dataset in more detail.\nThe `README` file MUST be either in ASCII or UTF-8 encoding and MAY have one of the extensions:\n`.md` ([Markdown](https://www.markdownguide.org/)),\n`.rst` ([reStructuredText](https://docutils.sourceforge.io/rst.html)),\nor `.txt`.\nA BIDS dataset MUST NOT contain more than one `README` file (with or without extension)\nat its root directory.\nBIDS does not make any recommendations with regards to the\n[Markdown flavor](https://www.markdownguide.org/extended-syntax/#lightweight-markup-languages)\nand does not validate the syntax of Markdown and reStructuredText.\nThe `README` file SHOULD be structured such that its contents can be easily understood\neven if the used format is not rendered.\nA guideline for creating a good `README` file can be found in the\n[bids-starter-kit](https://github.com/bids-standard/bids-starter-kit/tree/main/templates/).\n" }, dataset_description: { display_name: "Dataset Description", file_type: "regular", description: "The file `dataset_description.json` is a JSON file describing the dataset.\n" }, genetic_info: { display_name: "Genetic Information", file_type: "regular", description: "The `genetic_info.json` file describes the genetic information available in the\n`participants.tsv` file and/or the genetic database described in\n`dataset_description.json`.\n\nDatasets containing the `Genetics` field in `dataset_description.json` or the\n`genetic_id` column in `participants.tsv` MUST include this file.\n" }, participants: { display_name: "Participant Information", file_type: "regular", description: "The purpose of this RECOMMENDED file is to describe properties of participants\nsuch as age, sex, handedness, species and strain.\nIf this file exists, it MUST contain the column `participant_id`,\nwhich MUST consist of `sub-<label>` values identifying one row for each participant,\nfollowed by a list of optional columns describing participants.\nEach participant MUST be described by one and only one row.\n\nCommonly used *optional* columns in `participants.tsv` files are `age`, `sex`,\n`handedness`, `strain`, and `strain_rrid`.\n\nThe RECOMMENDED `species` column SHOULD be a binomial species name from the\n[NCBI Taxonomy](https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi)\n(for examples `homo sapiens`, `mus musculus`, `rattus norvegicus`).\nFor backwards compatibility, if `species` is absent, the participant is assumed to be\n`homo sapiens`.\n" }, samples: { display_name: "Sample Information", file_type: "regular", description: "The purpose of this file is to describe properties of samples, indicated by the `sample` entity.\nThis file is REQUIRED if `sample-<label>` is present in any filename within the dataset.\nEach sample MUST be described by one and only one row.\n" }, code: { display_name: "Code", file_type: "directory", description: "A directory in which to store any code\n(for example the one used to generate the derivatives from the raw data).\nSee the [Code section](SPEC_ROOT/modality-agnostic-files.md#code)\nfor more information.\n" }, derivatives: { display_name: "Derivative data", file_type: "directory", description: "Derivative data (for example preprocessed files).\nSee the [relevant section](SPEC_ROOT/common-principles.md#source-vs-raw-vs-derived-data)\nfor more information.\n" }, sourcedata: { display_name: "Source data", file_type: "directory", description: "A directory where to store data before harmonization, reconstruction,\nand/or file format conversion (for example, E-Prime event logs or DICOM files).\nSee the [relevant section](SPEC_ROOT/common-principles.md#source-vs-raw-vs-derived-data)\nfor more information.\n" }, stimuli: { display_name: "Stimulus files", file_type: "directory", description: "A directory to store any stimulus files used during an experiment.\nSee the [relevant section](SPEC_ROOT/modality-specific-files/task-events.md#stimuli-directory)\nfor more information.\n" } }, formats: { index: { display_name: "Index", description: "Non-negative, optionally prefixed with leading zeros for better visual homogeneity and sorting.\n", pattern: "[0-9]+" }, label: { display_name: "Label", description: "Freeform labels without special characters.\n", pattern: "[0-9a-zA-Z]+" }, boolean: { display_name: "Boolean", description: 'A boolean.\nMust be either "true" or "false".\n', pattern: "(true|false)" }, integer: { display_name: "Integer", description: "An integer which may be positive or negative.\n", pattern: "[+-]?\\d+" }, number: { display_name: "Number", description: "A number which may be an integer or float, positive or negative.\n", pattern: "[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)([eE][+-]?[0-9]+)?" }, string: { display_name: "String", description: "The basic string type (not a specific format).\nThis should allow any free-form string.\n", pattern: ".*" }, hed_version: { display_name: "HED Version", description: "The version string of the used HED schema.\n", pattern: "^(?:[a-zA-Z]+:)?(?:[a-zA-Z]+_)?(?:0|[1-9]\\d*)\\.(?:0|[1-9]\\d*)\\.(?:0|[1-9]\\d*)\\ (?:-(?:(?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\\.(?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?\\ (?:\\+(?:[0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*))?$" }, bids_uri: { display_name: "BIDS uniform resource indicator", description: 'A BIDS uniform resource indicator.\n\nThe validation for this format is minimal.\nIt simply ensures that the value is a string with any characters that may appear in a valid URI,\nstarting with "bids:".\n', pattern: "bids:[0-9a-zA-Z/#:\\?\\_\\-\\.]+" }, dataset_relative: { display_name: "Path relative to the BIDS dataset directory", description: 'A path to a file, relative to the dataset directory.\n\nThe validation for this format is minimal.\nIt simply ensures that the value is a string with any characters that may appear in a valid path,\nwithout starting with "/" (an absolute path).\n', pattern: "(?!/)[0-9a-zA-Z/\\_\\-\\.]+" }, date: { display_name: "Date", description: 'A date in the form `"YYYY-MM-DD[Z]"`,\nwhere [Z] is an optional, valid timezone code.\n', pattern: "[0-9]{4}-[0-9]{2}-[0-9]{2}([A-Z]{2,4})?" }, datetime: { display_name: "Datetime", description: 'A datetime in the form `"YYYY-MM-DDThh:mm:ss[.000000][Z]"`,\nwhere [.000000] is an optional subsecond resolution between 1 and 6 decimal points,\nand [Z] is an optional, valid timezone code.\n', pattern: "[0-9]{4}-[0-9]{2}-[0-9]{2}T(?:2[0-3]|[01][0-9]):[0-5][0-9]:[0-5][0-9](\\.[0-9]{1,6})?([A-Z]{2,4})?" }, file_relative: { display_name: "Path relative to the parent file", description: 'A path to a file, relative to the file in which the field is defined.\n\nThe validation for this format is minimal.\nIt simply ensures that the value is a string with any characters that may appear in a valid path,\nwithout starting with "/" (an absolute path).\n', pattern: "(?!/)[0-9a-zA-Z/\\_\\-\\.]+" }, participant_relative: { display_name: "Path relative to the participant directory", description: `A path to a file, relative to the participant's directory in the dataset.

The validation for this format is minimal.
It simply ensures that the value is a string with any characters that may appear in a valid path,
without starting with "/" (an absolute path) or "sub/"
(a relative path starting with the participant directory, rather than relative to that directory).
`, pattern: "(?!/)(?!sub-)[0-9a-zA-Z/\\_\\-\\.]+" }, rrid: { display_name: "Research resource identifier", description: "A [research resource identifier](https://scicrunch.org/resources).\n", pattern: "RRID:.+_.+" }, stimuli_relative: { display_name: "Path relative to the stimuli directory", description: 'A path to a stimulus file, relative to a `/stimuli` directory somewhere.\n\nThe validation for this format is minimal.\nIt simply ensures that the value is a string with any characters that may appear in a valid path,\nwithout starting with "/" (an absolute path) or "stimuli/"\n(a relative path starting with the stimuli directory, rather than relative to that directory).\n', pattern: "(?!/)(?!stimuli/)[0-9a-zA-Z/\\_\\-\\.]+" }, time: { display_name: "Time", description: 'A time in the form `"hh:mm:ss"`.\n', pattern: "(?:2[0-3]|[01]?[0-9]):[0-5][0-9]:[0-5][0-9]" }, unit: { display_name: "A standardized unit", description: "A unit.\nSI units in CMIXF formatting are RECOMMENDED\n(see [Units](SPEC_ROOT/common-principles.md#units)).\n\nCurrently this matches any string.\n\nTODO: Somehow reference the actual unit options in the Units appendix.\n", pattern: ".*" }, uri: { display_name: "Uniform resource indicator", description: "A uniform resource indicator.\n", pattern: "(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\\?([^#]*))?(#(.*))?" } }, metadata: { ACCELChannelCount: { name: "ACCELChannelCount", display_name: "Acceleration channel count", description: "Number of acceleration channels.\n", type: "integer", minimum: 0 }, Acknowledgements: { name: "Acknowledgements", display_name: "Acknowledgements", description: "Text acknowledging contributions of individuals or institutions beyond\nthose listed in Authors or Funding.\n", type: "string" }, AcquisitionDuration: { name: "AcquisitionDuration", display_name: "Acquisition Duration", description: 'Duration (in seconds) of volume acquisition.\nCorresponds to DICOM Tag 0018, 9073 `Acquisition Duration`.\nThis field is mutually exclusive with `"RepetitionTime"`.\n', type: "number", exclusiveMinimum: 0, unit: "s" }, AcquisitionMode: { name: "AcquisitionMode", display_name: "Acquisition Mode", description: 'Type of acquisition of the PET data (for example, `"list mode"`).\n', type: "string" }, AcquisitionVoxelSize: { name: "AcquisitionVoxelSize", display_name: "Acquisition Voxel Size", description: "An array of numbers with a length of 3, in millimeters.\nThis parameter denotes the original acquisition voxel size,\nexcluding any inter-slice gaps and before any interpolation or resampling\nwithin reconstruction or image processing.\nAny point spread function effects, for example due to T2-blurring,\nthat would decrease the effective resolution are not considered here.\n", type: "array", minItems: 3, maxItems: 3, items: { type: "number", exclusiveMinimum: 0, unit: "mm" } }, Anaesthesia: { name: "Anaesthesia", display_name: "Anaesthesia", description: "Details of anaesthesia used, if any.\n", type: "string" }, AnalyticalApproach: { name: "AnalyticalApproach", display_name: "Analytical Approach", description: 'Methodology or methodologies used to analyze the `"GeneticLevel"`.\nValues MUST be taken from the\n[database of Genotypes and Phenotypes\n(dbGaP)](https://www.ncbi.nlm.nih.gov/gap/advanced)\nunder /Study/Molecular Data Type (for example, SNP Genotypes (Array) or\nMethylation (CpG).\n', anyOf: [{ type: "string" }, { type: "array", items: { type: "string" } }] }, AnatomicalLandmarkCoordinateSystem: { name: "AnatomicalLandmarkCoordinateSystem", display_name: "Anatomical Landmark Coordinate System", description: 'Defines the coordinate system for the anatomical landmarks.\nSee the [Coordinate Systems Appendix](SPEC_ROOT/appendices/coordinate-systems.md)\nfor a list of restricted keywords for coordinate systems.\nIf `"Other"`, provide definition of the coordinate system in\n`"AnatomicalLandmarkCoordinateSystemDescription"`.\n', type: "string", enum: ["CTF", "ElektaNeuromag", "4DBti", "KitYokogawa", "ChietiItab", "Other", "CapTrak", "EEGLAB", "EEGLAB-HJ", "Other", "ICBM452AirSpace", "ICBM452Warp5Space", "IXI549Space", "fsaverage", "fsaverageSym", "fsLR", "MNIColin27", "MNI152Lin", "MNI152NLin2009aSym", "MNI152NLin2009bSym", "MNI152NLin2009cSym", "MNI152NLin2009aAsym", "MNI152NLin2009bAsym", "MNI152NLin2009cAsym", "MNI152NLin6Sym", "MNI152NLin6ASym", "MNI305", "NIHPD", "OASIS30AntsOASISAnts", "OASIS30Atropos", "Talairach", "UNCInfant", "fsaverage3", "fsaverage4", "fsaverage5", "fsaverage6", "fsaveragesym", "UNCInfant0V21", "UNCInfant1V21", "UNCInfant2V21", "UNCInfant0V22", "UNCInfant1V22", "UNCInfant2V22", "UNCInfant0V23", "UNCInfant1V23", "UNCInfant2V23"] }, AnatomicalLandmarkCoordinateSystemDescription: { name: "AnatomicalLandmarkCoordinateSystemDescription", display_name: "Anatomical Landmark Coordinate System Description", description: "Free-form text description of the coordinate system.\nMay also include a link to a documentation page or paper describing the\nsystem in greater detail.\n", type: "string" }, AnatomicalLandmarkCoordinateUnits: { name: "AnatomicalLandmarkCoordinateUnits", display_name: "Anatomical Landmark Coordinate Units", description: 'Units of the coordinates of `"AnatomicalLandmarkCoordinateSystem"`.\n', type: "string", enum: ["m", "mm", "cm", "n/a"] }, AnatomicalLandmarkCoordinates: { name: "AnatomicalLandmarkCoordinates", display_name: "Anatomical Landmark Coordinates", description: 'Key-value pairs of the labels and 3-D digitized locations of anatomical landmarks,\ninterpreted following the `"AnatomicalLandmarkCoordinateSystem"`\n(for example, `{"NAS": [12.7,21.3,13.9], "LPA": [5.2,11.3,9.6],\n"RPA": [20.2,11.3,9.1]}`.\nEach array MUST contain three numeric values corresponding to x, y, and z\naxis of the coordinate system in that exact order.\n', type: "object", additionalProperties: { type: "array", items: { type: "number" }, minItems: 3, maxItems: 3 } }, AnatomicalLandmarkCoordinates__mri: { name: "AnatomicalLandmarkCoordinates", display_name: "Anatomical Landmark Coordinates", description: 'Key-value pairs of any number of additional anatomical landmarks and their\ncoordinates in voxel units (where first voxel has index 0,0,0)\nrelative to the associated anatomical MRI\n(for example, `{"AC": [127,119,149], "PC": [128,93,141],\n"IH": [131,114,206]}`, or `{"NAS": [127,213,139], "LPA": [52,113,96],\n"RPA": [202,113,91]}`).\nEach array MUST contain three numeric values corresponding to x, y, and z\naxis of the coordinate system in that exact order.\n', type: "object", additionalProperties: { type: "array", items: { type: "number" }, minItems: 3, maxItems: 3 } }, ANGACCELChannelCount: { name: "ANGACCELChannelCount", display_name: "Angular acceleration channel count", description: "Number of angular acceleration channels.\n", type: "integer", minimum: 0 }, ArterialSpinLabelingType: { name: "ArterialSpinLabelingType", display_name: "Arterial Spin Labeling Type", description: "The arterial spin labeling type.\n", type: "string", enum: ["CASL", "PCASL", "PASL"] }, AssociatedEmptyRoom: { name: "AssociatedEmptyRoom", display_name: "Associated Empty Room", description: "One or more [BIDS URIs](SPEC_ROOT/common-principles.md#bids-uri)\npointing to empty-room file(s) associated with the subject's MEG recording.\nUsing forward-slash separated paths relative to the dataset root is\n[DEPRECATED](SPEC_ROOT/common-principles.md#definitions).\n", anyOf: [{ type: "array", items: { anyOf: [{ type: "string", format: "dataset_relative" }, { type: "string", format: "bids_uri" }] } }, { type: "string", format: "dataset_relative" }, { type: "string", format: "bids_uri" }] }, Atlas: { name: "Atlas", display_name: "Atlas", description: "Which atlas (if any) was used to generate the mask.\n", type: "string" }, AttenuationCorrection: { name: "AttenuationCorrection", display_name: "Attenuation Correction", description: "Short description of the attenuation correction method used.\n", type: "string" }, AttenuationCorrectionMethodReference: { name: "AttenuationCorrectionMethodReference", display_name: "Attenuation Correction Method Reference", description: "Reference paper for the attenuation correction method used.\n", type: "string" }, Authors: { name: "Authors", display_name: "Authors", description: "List of individuals who contributed to the creation/curation of the dataset.\n", type: "array", items: { type: "string" } }, B0FieldIdentifier: { name: "B0FieldIdentifier", display_name: "B0 Field Identifier", description: 'The presence of this key states that this particular 3D or 4D image MAY be\nused for fieldmap estimation purposes.\nEach `"B0FieldIdentifier"` MUST be a unique string within one participant\'s tree,\nshared only by the images meant to be used as inputs for the estimation of a\nparticular instance of the *B<sub>0</sub> field* estimation.\nIt is RECOMMENDED to derive this identifier from DICOM Tags, for example,\nDICOM tag 0018, 1030 `Protocol Name`, or DICOM tag 0018, 0024 `Sequence Name`\nwhen the former is not defined (for example, in GE devices.)\n', anyOf: [{ type: "string" }, { type: "array", items: { type: "string" } }] }, B0FieldSource: { name: "B0FieldSource", display_name: "B0 Field Source", description: 'At least one existing `"B0FieldIdentifier"` defined by images in the\nparticipant\'s tree.\nThis field states the *B<sub>0</sub> field* estimation designated by the\n`"B0FieldIdentifier"` that may be used to correct the dataset for distortions\ncaused by B<sub>0</sub> inhomogeneities.\n`"B0FieldSource"` and `"B0FieldIdentifier"` MAY both be present for images that\nare used to estimate their own B<sub>0</sub> field, for example, in "pepolar"\nacquisitions.\n', anyOf: [{ type: "string" }, { type: "array", items: { type: "string" } }] }, BIDSVersion: { name: "BIDSVersion", display_name: "BIDS Version", description: "The version of the BIDS standard that was used.\n", type: "string" }, BackgroundSuppression: { name: "BackgroundSuppression", display_name: "Background Suppression", description: "Boolean indicating if background suppression is used.\n", type: "boolean" }, BackgroundSuppressionNumberPulses: { name: "BackgroundSuppressionNumberPulses", display_name: "Background Suppression Number Pulses", description: "The number of background suppression pulses used.\nNote that this excludes any effect of background suppression pulses applied\nbefore the labeling.\n", type: "number", minimum: 0 }, BackgroundSuppressionPulseTime: { name: "BackgroundSuppressionPulseTime", display_name: "Background Suppression Pulse Time", description: "Array of numbers containing timing, in seconds,\nof the background suppression pulses with respect to the start of the\nlabeling.\nIn case of multi-PLD with different background suppression pulse times,\nonly the pulse time of the first PLD should be defined.\n", type: "array", items: { type: "number", minimum: 0, unit: "s" } }, BasedOn: { name: "BasedOn", display_name: "Based On", description: "List of files in a file collection to generate the map.\nFieldmaps are also listed, if involved in the processing.\nThis field is DEPRECATED, and this metadata SHOULD be recorded in the\n`Sources` field using [BIDS URIs](SPEC_ROOT/common-principles.md#bids-uri)\nto distinguish sources from different datasets.\n", anyOf: [{ type: "string", format: "participant_relative" }, { type: "array", items: { type: "string", format: "participant_relative" } }] }, BloodDensity: { name: "BloodDensity", display_name: "Blood Density", description: 'Measured blood density. Unit of blood density should be in `"g/mL"`.\n', type: "number", unit: "g/mL" }, BodyPart: { name: "BodyPart", display_name: "Body Part", description: "Body part of the organ / body region scanned.\n", type: "string" }, BodyPartDetails: { name: "BodyPartDetails", display_name: "Body Part Details", description: 'Additional details about body part or location (for example: `"corpus callosum"`).\n', type: "string" }, BodyPartDetailsOntology: { name: "BodyPartDetailsOntology", display_name: "Body Part Details Ontology", description: '[URI](SPEC_ROOT/common-principles.md#uniform-resource-indicator) of ontology used for\nBodyPartDetails (for example: `"https://www.ebi.ac.uk/ols/ontologies/uberon"`).\n', type: "string", format: "uri" }, BolusCutOffDelayTime: { name: "BolusCutOffDelayTime", display_name: "Bolus Cut Off Delay Time", description: "Duration between the end of the labeling and the start of the bolus cut-off\nsaturation pulse(s), in seconds.\nThis can be a number or array of numbers, of which the values must be\nnon-negative and monotonically increasing, depending on the number of bolus\ncut-off saturation pulses.\nFor Q2TIPS, only the values for the first and last bolus cut-off saturation\npulses are provided.\nBased on DICOM Tag 0018, 925F `ASL Bolus Cut-off Delay Time`.\n", anyOf: [{ type: "number", minimum: 0, unit: "s" }, { type: "array", items: { type: "number", unit: "s", minimum: 0 } }] }, BolusCutOffFlag: { name: "BolusCutOffFlag", display_name: "Bolus Cut Off Flag", description: "Boolean indicating if a bolus cut-off technique is used.\nCorresponds to DICOM Tag 0018, 925C `ASL Bolus Cut-off Flag`.\n", type: "boolean" }, BolusCutOffTechnique: { name: "BolusCutOffTechnique", display_name: "Bolus Cut Off Technique", description: 'Name of the technique used, for example `"Q2TIPS"`, `"QUIPSS"`, `"QUIPSSII"`.\nCorresponds to DICOM Tag 0018, 925E `ASL Bolus Cut-off Technique`.\n', type: "string" }, BrainLocation: { name: "BrainLocation", display_name: "Brain Location", description: 'Refers to the location in space of the `"TissueOrigin"`.\nValues may be an MNI coordinate,\na label taken from the\n[Allen Brain Atlas](https://atlas.brain-map.org/atlas?atlas=265297125&plate=\\\n112360888&structure=4392&x=40348.15104166667&y=46928.75&zoom=-7&resolution=\\\n206.60&z=3),\nor layer to refer to layer-specific gene expression,\nwhich can also tie up with laminar fMRI.\n', type: "string" }, CASLType: { name: "CASLType", display_name: "CASL Type", description: "Describes if a separate coil is used for labeling.\n", type: "string", enum: ["single-coil", "double-coil"] }, CapManufacturer: { name: "CapManufacturer", display_name: "Cap Manufacturer", description: 'Name of the cap manufacturer (for example, `"EasyCap"`).\n', type: "string" }, CapManufacturersModelName: { name: "CapManufacturersModelName", display_name: "Cap Manufacturers Model Name", description: 'Manufacturer\'s designation of the cap model\n(for example, `"actiCAP 64 Ch Standard-2"`).\n', type: "string" }, CellType: { name: "CellType", display_name: "Cell Type", description: "Describes the type of cell analyzed.\nValues SHOULD come from the\n[cell ontology](http://obofoundry.org/ontology/cl.html).\n", type: "string" }, ChunkTransformationMatrix: { name: "ChunkTransformationMatrix", display_name: "Chunk Transformation Matrix", description: "3x3 or 4x4 affine transformation matrix describing spatial chunk transformation,\nfor 2D and 3D respectively (for examples: `[[2, 0, 0], [0, 3, 0], [0, 0, 1]]`\nin 2D for 2x and 3x scaling along the first and second axis respectively; or\n`[[1, 0, 0, 0], [0, 2, 0, 0], [0, 0, 3, 0], [0, 0, 0, 1]]` in 3D for 2x and 3x\nscaling along the second and third axis respectively).\nNote that non-spatial dimensions like time and channel are not included in the\ntransformation matrix.\n", anyOf: [{ type: "array", minItems: 3, maxItems: 3, items: { type: "array", minItems: 3, maxItems: 3, items: { type: "number" } } }, { type: "array", minItems: 4, maxItems: 4, items: { type: "array", minItems: 4, maxItems: 4, items: { type: "number" } } }] }, ChunkTransformationMatrixAxis: { name: "ChunkTransformationMatrixAxis", display_name: "Chunk Transformation Matrix Axis", description: 'Describe the axis of the ChunkTransformationMatrix\n(for examples: `["X", "Y"]` or `["Z", "Y", "X"]`).\n', type: "array", minItems: 2, maxItems: 3, items: { type: "string" } }, Code: { name: "Code", display_name: "Code", description: "[URI](SPEC_ROOT/common-principles.md#uniform-resource-indicator)\nof the code used to present the stimuli.\nPersistent identifiers such as DOIs are preferred.\nIf multiple versions of code may be hosted at the same location,\nrevision-specific URIs are recommended.\n", type: "string", format: "uri" }, CogAtlasID: { name: "CogAtlasID", display_name: "Cognitive Atlas ID", description: "[URI](SPEC_ROOT/common-principles.md#uniform-resource-indicator)\nof the corresponding [Cognitive Atlas](https://www.cognitiveatlas.org/)\nTask term.\n", type: "string", format: "uri" }, CogPOID: { name: "CogPOID", display_name: "Cognitive Paradigm Ontology ID", description: "[URI](SPEC_ROOT/common-principles.md#uniform-resource-indicator)\nof the corresponding [CogPO](http://www.cogpo.org/) term.\n", type: "string", format: "uri" }, CoilCombinationMethod: { name: "CoilCombinationMethod", display_name: "Coil Combination Method", description: "Almost all fMRI studies using phased-array coils use root-sum-of-squares\n(rSOS) combination, but other methods exist.\nThe image reconstruction is changed by the coil combination method\n(as for the matrix coil mode above),\nso anything non-standard should be reported.\n", type: "string" }, Columns: { name: "Columns", display_name: "Columns", description: "Names of columns in file.\n", type: "array", items: { type: "string" } }, ContinuousHeadLocalization: { name: "ContinuousHeadLocalization", display_name: "Continuous Head Localization", description: "`true` or `false` value indicating whether continuous head localisation\nwas performed.\n", type: "boolean" }, ContrastBolusIngredient: { name: "ContrastBolusIngredient", display_name: "Contrast Bolus Ingredient", description: "Active ingredient of agent.\nCorresponds to DICOM Tag 0018, 1048 `Contrast/Bolus Ingredient`.\n", type: "string", enum: ["IODINE", "GADOLINIUM", "CARBON DIOXIDE", "BARIUM", "XENON", "UNKNOWN", "NONE"] }, DCOffsetCorrection: { name: "DCOffsetCorrection", display_name: "DC Offset Correction", description: 'A description of the method (if any) used to correct for a DC offset.\nIf the method used was subtracting the mean value for each channel,\nuse "mean".\n', type: "string" }, DatasetDOI: { name: "DatasetDOI", display_name: "DatasetDOI", description: "The Digital Object Identifier of the dataset (not the corresponding paper).\nDOIs SHOULD be expressed as a valid\n[URI](SPEC_ROOT/common-principles.md#uniform-resource-indicator);\nbare DOIs such as `10.0.2.3/dfjj.10` are\n[DEPRECATED](SPEC_ROOT/common-principles.md#definitions).\n", type: "string", format: "uri" }, DatasetLinks: { name: "DatasetLinks", display_name: "Dataset Links", description: 'Used to map a given `<dataset-name>` from a [BIDS URI](SPEC_ROOT/common-principles.md#bids-uri)\nof the form `bids:<dataset-name>:path/within/dataset` to a local or remote location.\nThe `<dataset-name>`: `""` (an empty string) is a reserved keyword that MUST NOT be a key in\n`DatasetLinks` (example: `bids::path/within/dataset`).\n', type: "object", additionalProperties: { type: "string", format: "uri" } }, DatasetType: { name: "DatasetType", display_name: "Dataset Type", description: 'The interpretation of the dataset.\nFor backwards compatibility, the default value is `"raw"`.\n', type: "string", enum: ["raw", "derivative"] }, DecayCorrectionFactor: { name: "DecayCorrectionFactor", display_name: "Decay Correction Factor", description: "Decay correction factor for each frame.\n", type: "array", items: { type: "number" } }, DelayAfterTrigger: { name: "DelayAfterTrigger", display_name: "Delay After Trigger", description: 'Duration (in seconds) from trigger delivery to scan onset.\nThis delay is commonly caused by adjustments and loading times.\nThis specification is entirely independent of\n`"NumberOfVolumesDiscardedByScanner"` or `"NumberOfVolumesDiscardedByUser"`,\nas the delay precedes the acquisition.\n', type: "number", unit: "s" }, DelayTime: { name: "DelayTime", display_name: "Delay Time", description: 'User specified time (in seconds) to delay the acquisition of data for the\nfollowing volume.\nIf the field is not present it is assumed to be set to zero.\nCorresponds to Siemens CSA header field `lDelayTimeInTR`.\nThis field is REQUIRED for sparse sequences using the `"RepetitionTime"` field\nthat do not have the `"SliceTiming"` field set to allowed for accurate\ncalculation of "acquisition time".\nThis field is mutually exclusive with `"VolumeTiming"`.\n', type: "number", unit: "s" }, Density: { name: "Density", display_name: "Density", description: "Specifies the interpretation of the density keyword.\nIf an object is used, then the keys should be values for the `den` entity\nand values should be descriptions of those `den` values.\n", anyOf: [{ type: "string" }, { type: "object", additionalProperties: { type: "string" } }] }, Derivative: { name: "Derivative", display_name: "Derivative", description: "Indicates that values in the corresponding column are transformations of values\nfrom other columns (for example a summary score based on a subset of items in a\nquestionnaire).\n", type: "boolean" }, Description: { name: "Description", display_name: "Description", description: "Free-form natural language description.\n", type: "string" }, DetectorType: { name: "DetectorType", display_name: "Detector Type", description: 'Type of detector. This is a free form description with the following suggested terms:\n`"SiPD"`, `"APD"`. Preferably a specific model/part number is supplied.\nIf individual channels have different `DetectorType`,\nthen the field here should be specified as `"mixed"`\nand this column should be included in `optodes.tsv`.\n', anyOf: [{ type: "string", format: "unit" }, { type: "string", enum: ["mixed"] }] }, DeviceSerialNumber: { name: "DeviceSerialNumber", display_name: "Device Serial Number", description: "The serial number of the equipment that produced the measurements.\nA pseudonym can also be used to prevent the equipment from being\nidentifiable, so long as each pseudonym is unique within the dataset.\n", type: "string" }, DewarPosition: { name: "DewarPosition", display_name: "Dewar Position", description: 'Position of the dewar during the MEG scan:\n`"upright"`, `"supine"` or `"degrees"` of angle from vertical:\nfor example on CTF systems, `"upright=15\xB0, supine=90\xB0"`.\n', type: "string" }, DigitizedHeadPoints: { name: "DigitizedHeadPoints", display_name: "Digitized Head Points", description: "`true` or `false` value indicating whether head points outlining the\nscalp/face surface are contained within this recording.\n", type: "boolean" }, DigitizedHeadPoints__coordsystem: { name: "DigitizedHeadPoints", display_name: "Digitized Head Points", description: 'Relative path to the file containing the locations of digitized head points\ncollected during the session (for example, `"sub-01_headshape.pos"`).\nRECOMMENDED for all MEG systems, especially for CTF and BTi/4D.\nFor Neuromag/Elekta/MEGIN, the head points will be stored in the `.fif` file.\n', type: "string", format: "file_relative" }, DigitizedHeadPointsCoordinateSystem: { name: "DigitizedHeadPointsCoordinateSystem", display_name: "Digitized Head Points Coordinate System", description: 'Defines the coordinate system for the digitized head points.\nSee the\n[Coordinate Systems Appendix](SPEC_ROOT/appendices/coordinate-systems.md)\nfor a list of restricted keywords for coordinate systems.\nIf `"Other"`, provide definition of the coordinate system in\n`"DigitizedHeadPointsCoordinateSystemDescription"`.\n', type: "string", enum: ["CTF", "ElektaNeuromag", "4DBti", "KitYokogawa", "ChietiItab", "Other", "CapTrak", "EEGLAB", "EEGLAB-HJ", "Other", "ICBM452AirSpace", "ICBM452Warp5Space", "IXI549Space", "fsaverage", "fsaverageSym", "fsLR", "MNIColin27", "MNI152Lin", "MNI152NLin2009aSym", "MNI152NLin2009bSym", "MNI152NLin2009cSym", "MNI152NLin2009aAsym", "MNI152NLin2009bAsym", "MNI152NLin2009cAsym", "MNI152NLin6Sym", "MNI152NLin6ASym", "MNI305", "NIHPD", "OASIS30AntsOASISAnts", "OASIS30Atropos", "Talairach", "UNCInfant", "fsaverage3", "fsaverage4", "fsaverage5", "fsaverage6", "fsaveragesym", "UNCInfant0V21", "UNCInfant1V21", "UNCInfant2V21", "UNCInfant0V22", "UNCInfant1V22", "UNCInfant2V22", "UNCInfant0V23", "UNCInfant1V23", "UNCInfant2V23"] }, DigitizedHeadPointsCoordinateSystemDescription: { name: "DigitizedHeadPointsCoordinateSystemDescription", display_name: "Digitized Head Points Coordinate System Description", description: "Free-form text description of the coordinate system.\nMay also include a link to a documentation page or paper describing the\nsystem in greater detail.\n", type: "string" }, DigitizedHeadPointsCoordinateUnits: { name: "DigitizedHeadPointsCoordinateUnits", display_name: "Digitized Head Points Coordinate Units", description: 'Units of the coordinates of `"DigitizedHeadPointsCoordinateSystem"`.\n', type: "string", enum: ["m", "mm", "cm", "n/a"] }, DigitizedLandmarks: { name: "DigitizedLandmarks", display_name: "Digitized Landmarks", description: "`true` or `false` value indicating whether anatomical landmark points\n(fiducials) are contained within this recording.\n", type: "boolean" }, DispersionConstant: { name: "DispersionConstant", display_name: "Dispersion Constant", description: "External dispersion time constant resulting from tubing in default unit\nseconds.\n", type: "number", unit: "s" }, DispersionCorrected: { name: "DispersionCorrected", display_name: "Dispersion Corrected", description: "Boolean flag specifying whether the blood data have been dispersion-corrected.\nNOTE: not customary for manual samples, and hence should be set to `false`.\n", type: "boolean" }, DoseCalibrationFactor: { name: "DoseCalibrationFactor", display_name: "Dose Calibration Factor", description: "Multiplication factor used to transform raw data (in counts/sec) to meaningful unit (Bq/ml).\nCorresponds to DICOM Tag 0054, 1322 `Dose Calibration Factor`.\n", type: "number" }, DwellTime: { name: "DwellTime", display_name: "Dwell Time", description: 'Actual dwell time (in seconds) of the receiver per point in the readout\ndirection, including any oversampling.\nFor Siemens, this corresponds to DICOM field 0019, 1018 (in ns).\nThis value is necessary for the optional readout distortion correction of\nanatomicals in the HCP Pipelines.\nIt also usefully provides a handle on the readout bandwidth,\nwhich isn\'t captured in the other metadata tags.\nNot to be confused with `"EffectiveEchoSpacing"`, and the frequent mislabeling\nof echo spacing (which is spacing in the phase encoding direction) as\n"dwell time" (which is spacing in the readout direction).\n', type: "number", unit: "s" }, ECGChannelCount: { name: "ECGChannelCount", display_name: "ECG Channel Count", description: "Number of ECG channels.\n", type: "integer", minimum: 0 }, ECOGChannelCount: { name: "ECOGChannelCount", display_name: "ECOG Channel Count", description: "Number of ECoG channels.\n", type: "integer", minimum: 0 }, EEGChannelCount: { name: "EEGChannelCount", display_name: "EEG Channel Count", description: "Number of EEG channels recorded simultaneously (for example, `21`).\n", type: "integer", minimum: 0 }, EEGCoordinateSystem: { name: "EEGCoordinateSystem", display_name: "EEG Coordinate System", description: 'Defines the coordinate system for the EEG sensors.\n\nSee the\n[Coordinate Systems Appendix](SPEC_ROOT/appendices/coordinate-systems.md)\nfor a list of restricted keywords for coordinate systems.\nIf `"Other"`, provide definition of the coordinate system in\n`EEGCoordinateSystemDescription`.\n', type: "string", enum: ["CTF", "ElektaNeuromag", "4DBti", "KitYokogawa", "ChietiItab", "Other", "CapTrak", "EEGLAB", "EEGLAB-HJ", "Other", "ICBM452AirSpace", "ICBM452Warp5Space", "IXI549Space", "fsaverage", "fsaverageSym", "fsLR", "MNIColin27", "MNI152Lin", "MNI152NLin2009aSym", "MNI152NLin2009bSym", "MNI152NLin2009cSym", "MNI152NLin2009aAsym", "MNI152NLin2009bAsym", "MNI152NLin2009cAsym", "MNI152NLin6Sym", "MNI152NLin6ASym", "MNI305", "NIHPD", "OASIS30AntsOASISAnts", "OASIS30Atropos", "Talairach", "UNCInfant", "fsaverage3", "fsaverage4", "fsaverage5", "fsaverage6", "fsaveragesym", "UNCInfant0V21", "UNCInfant1V21", "UNCInfant2V21", "UNCInfant0V22", "UNCInfant1V22", "UNCInfant2V22", "UNCInfant0V23", "UNCInfant1V23", "UNCInfant2V23"] }, EEGCoordinateSystemDescription: { name: "EEGCoordinateSystemDescription", display_name: "EEG Coordinate System Description", description: "Free-form text description of the coordinate system.\nMay also include a link to a documentation page or paper describing the\nsystem in greater detail.\n", type: "string" }, EEGCoordinateUnits: { name: "EEGCoordinateUnits", display_name: "EEG Coordinate Units", description: "Units of the coordinates of `EEGCoordinateSystem`.\n", type: "string", enum: ["m", "mm", "cm", "n/a"] }, EEGGround: { name: "EEGGround", display_name: "EEG Ground", description: 'Description of the location of the ground electrode\n(for example, `"placed on right mastoid (M2)"`).\n', type: "string" }, EEGPlacementScheme: { name: "EEGPlacementScheme", display_name: "EEG Placement Scheme", description: 'Placement scheme of EEG electrodes.\nEither the name of a standardized placement system (for example, `"10-20"`)\nor a list of standardized electrode names (for example, `["Cz", "Pz"]`).\n', type: "string" }, EEGReference: { name: "EEGReference", display_name: "EEG Reference", description: 'General description of the reference scheme used and (when applicable) of\nlocation of the reference electrode in the raw recordings\n(for example, `"left mastoid"`, `"Cz"`, `"CMS"`).\nIf different channels have a different reference,\nthis field should have a general description and the channel specific\nreference should be defined in the `channels.tsv` file.\n', type: "string" }, EMGChannelCount: { name: "EMGChannelCount", display_name: "EMG Channel Count", description: "Number of EMG channels.\n", type: "integer", minimum: 0 }, EOGChannelCount: { name: "EOGChannelCount", display_name: "EOG Channel Count", description: "Number of EOG channels.\n", type: "integer", minimum: 0 }, EchoTime: { name: "EchoTime", display_name: "Echo Time", description: "The echo time (TE) for the acquisition, specified in seconds.\nCorresponds to DICOM Tag 0018, 0081 `Echo Time`\n(please note that the DICOM term is in milliseconds not seconds).\nThe data type number may apply to files from any MRI modality concerned with\na single value for this field, or to the files in a\n[file collection](SPEC_ROOT/appendices/file-collections.md)\nwhere the value of this field is iterated using the\n[`echo` entity](SPEC_ROOT/appendices/entities.md#echo).\nThe data type array provides a value for each volume in a 4D dataset and\nshould only be used when the volume timing is critical for interpretation\nof the data, such as in\n[ASL](SPEC_ROOT/modality-specific-files/magnetic-resonance-imaging-data.md#\\\narterial-spin-labeling-perfusion-data)\nor variable echo time fMRI sequences.\n", anyOf: [{ type: "number", unit: "s", exclusiveMinimum: 0 }, { type: "array", items: { type: "number", unit: "s", exclusiveMinimum: 0 } }] }, EchoTime1: { name: "EchoTime1", display_name: "Echo Time1", description: "The time (in seconds) when the first (shorter) echo occurs.\n", type: "number", unit: "s", exclusiveMinimum: 0 }, EchoTime2: { name: "EchoTime2", display_name: "Echo Time2", description: "The time (in seconds) when the second (longer) echo occurs.\n", type: "number", unit: "s", exclusiveMinimum: 0 }, EchoTime__fmap: { name: "EchoTime", display_name: "Echo Time", description: "The time (in seconds) when the echo corresponding to this map was acquired.\n", type: "number", unit: "s", exclusiveMinimum: 0 }, EffectiveEchoSpacing: { name: "EffectiveEchoSpacing", display_name: "Effective Echo Spacing", description: 'The "effective" sampling interval, specified in seconds,\nbetween lines in the phase-encoding direction,\ndefined based on the size of the reconstructed image in the phase direction.\nIt is frequently, but incorrectly, referred to as "dwell time"\n(see the `"DwellTime"` parameter for actual dwell time).\nIt is required for unwarping distortions using field maps.\nNote that beyond just in-plane acceleration,\na variety of other manipulations to the phase encoding need to be accounted\nfor properly, including partial fourier, phase oversampling,\nphase resolution, phase field-of-view and interpolation.\n', type: "number", exclusiveMinimum: 0, unit: "s" }, ElectricalStimulation: { name: "ElectricalStimulation", display_name: "Electrical Stimulation", description: "Boolean field to specify if electrical stimulation was done during the\nrecording (options are `true` or `false`). Parameters for event-like\nstimulation should be specified in the `events.tsv` file.\n", type: "boolean" }, ElectricalStimulationParameters: { name: "ElectricalStimulationParameters", display_name: "Electrical Stimulation Parameters", description: "Free form description of stimulation parameters, such as frequency or shape.\nSpecific onsets can be specified in the events.tsv file.\nSpecific shapes can be described here in freeform text.\n", type: "string" }, ElectrodeManufacturer: { name: "ElectrodeManufacturer", display_name: "Electrode Manufacturer", description: 'Can be used if all electrodes are of the same manufacturer\n(for example, `"AD-TECH"`, `"DIXI"`).\nIf electrodes of different manufacturers are used,\nplease use the corresponding table in the `_electrodes.tsv` file.\n', type: "string" }, ElectrodeManufacturersModelName: { name: "ElectrodeManufacturersModelName", display_name: "Electrode Manufacturers Model Name", description: "If different electrode types are used,\nplease use the corresponding table in the `_electrodes.tsv` file.\n", type: "string" }, EpochLength: { name: "EpochLength", display_name: "Epoch Length", description: "Duration of individual epochs in seconds (for example, `1`)\nin case of epoched data.\nIf recording was continuous or discontinuous, leave out the field.\n", type: "number", minimum: 0 }, EstimationAlgorithm: { name: "EstimationAlgorithm", display_name: "Estimation Algorithm", description: 'Type of algorithm used to perform fitting\n(for example, `"linear"`, `"non-linear"`, `"LM"` and such).\n', type: "string" }, EstimationReference: { name: "EstimationReference", display_name: "Estimation Reference", description: "Reference to the study/studies on which the implementation is based.\n", type: "string" }, EthicsApprovals: { name: "EthicsApprovals", display_name: "Ethics Approvals", description: "List of ethics committee approvals of the research protocols and/or\nprotocol identifiers.\n", type: "array", items: { type: "string" } }, FiducialsCoordinateSystem: { name: "FiducialsCoordinateSystem", display_name: "Fiducials Coordinate System", description: 'Defines the coordinate system for the fiducials.\nPreferably the same as the `"EEGCoordinateSystem"`.\nSee the\n[Coordinate Systems Appendix](SPEC_ROOT/appendices/coordinate-systems.md)\nfor a list of restricted keywords for coordinate systems.\nIf `"Other"`, provide definition of the coordinate system in\n`"FiducialsCoordinateSystemDescription"`.\n', type: "string", enum: ["CTF", "ElektaNeuromag", "4DBti", "KitYokogawa", "ChietiItab", "Other", "CapTrak", "EEGLAB", "EEGLAB-HJ", "Other", "ICBM452AirSpace", "ICBM452Warp5Space", "IXI549Space", "fsaverage", "fsaverageSym", "fsLR", "MNIColin27", "MNI152Lin", "MNI152NLin2009aSym", "MNI152NLin2009bSym", "MNI152NLin2009cSym", "MNI152NLin2009aAsym", "MNI152NLin2009bAsym", "MNI152NLin2009cAsym", "MNI152NLin6Sym", "MNI152NLin6ASym", "MNI305", "NIHPD", "OASIS30AntsOASISAnts", "OASIS30Atropos", "Talairach", "UNCInfant", "fsaverage3", "fsaverage4", "fsaverage5", "fsaverage6", "fsaveragesym", "UNCInfant0V21", "UNCInfant1V21", "UNCInfant2V21", "UNCInfant0V22", "UNCInfant1V22", "UNCInfant2V22", "UNCInfant0V23", "UNCInfant1V23", "UNCInfant2V23"] }, FiducialsCoordinateSystemDescription: { name: "FiducialsCoordinateSystemDescription", display_name: "Fiducials Coordinate System Description", description: "Free-form text description of the coordinate system.\nMay also include a link to a documentation page or paper describing the\nsystem in greater detail.\n", type: "string" }, FiducialsCoordinateUnits: { name: "FiducialsCoordinateUnits", display_name: "Fiducials Coordinate Units", description: 'Units in which the coordinates that are  listed in the field\n`"FiducialsCoordinateSystem"` are represented.\n', type: "string", enum: ["m", "mm", "cm", "n/a"] }, FiducialsCoordinates: { name: "FiducialsCoordinates", display_name: "Fiducials Coordinates", description: 'Key-value pairs of the labels and 3-D digitized position of anatomical\nlandmarks, interpreted following the `"FiducialsCoordinateSystem"`\n(for example, `{"NAS": [12.7,21.3,13.9], "LPA": [5.2,11.3,9.6],\n"RPA": [20.2,11.3,9.1]}`).\nEach array MUST contain three numeric values corresponding to x, y, and z\naxis of the coordinate system in that exact order.\n', type: "object", additionalProperties: { type: "array", items: { type: "number" }, minItems: 3, maxItems: 3 } }, FiducialsDescription: { name: "FiducialsDescription", display_name: "Fiducials Description", description: 'Free-form text description of how the fiducials such as vitamin-E capsules\nwere placed relative to anatomical landmarks,\nand how the position of the fiducials were measured\n(for example, `"both with Polhemus and with T1w MRI"`).\n', type: "string" }, FlipAngle: { name: "FlipAngle", display_name: "Flip Angle", description: "Flip angle (FA) for the acquisition, specified in degrees.\nCorresponds to: DICOM Tag 0018, 1314 `Flip Angle`.\nThe data type number may apply to files from any MRI modality concerned with\na single value for this field, or to the files in a\n[file collection](SPEC_ROOT/appendices/file-collections.md)\nwhere the value of this field is iterated using the\n[`flip` entity](SPEC_ROOT/appendices/entities.md#flip).\nThe data type array provides a value for each volume in a 4D dataset and\nshould only be used when the volume timing is critical for interpretation of\nthe data, such as in\n[ASL](SPEC_ROOT/modality-specific-files/magnetic-resonance-imaging-data.md#\\\narterial-spin-labeling-perfusion-data)\nor variable flip angle fMRI sequences.\n", anyOf: [{ type: "number", unit: "degree", exclusiveMinimum: 0, maximum: 360 }, { type: "array", items: { type: "number", unit: "degree", exclusiveMinimum: 0, maximum: 360 } }] }, FrameDuration: { name: "FrameDuration", display_name: "Frame Duration", description: "Time duration of each frame in default unit seconds.\nThis corresponds to DICOM Tag 0018, 1242 `Actual Frame Duration` converted\nto seconds.\n", type: "array", items: { type: "number" }, unit: "s" }, FrameTimesStart: { name: "FrameTimesStart", display_name: "Frame Times Start", description: 'Start times for all frames relative to `"TimeZero"` in default unit seconds.\n', type: "array", items: { type: "number" }, unit: "s" }, Funding: { name: "Funding", display_name: "Funding", description: "List of sources of funding (grant numbers).\n", type: "array", items: { type: "string" } }, GeneratedBy: { name: "GeneratedBy", display_name: "Generated By", description: "Used to specify provenance of the dataset.\n", type: "array", minItems: 1, items: { type: "object", required_fields: ["Name"], recommended_fields: ["Version"], properties: { Name: { name: "Name", description: 'Name of the pipeline or process that generated the outputs. Use `"Manual"` to\nindicate the derivatives were generated by hand, or adjusted manually after an\ninitial run of an automated pipeline.\n', type: "string" }, Version: { name: "Version", description: "Version of the pipeline", type: "string" }, Description: { name: "Description", description: 'Plain-text description of the pipeline or process that generated the outputs.\nRECOMMENDED if `Name` is `"Manual"`.\n', type: "string" }, CodeURL: { name: "CodeURL", description: "URL where the code used to generate the dataset may be found.", type: "string", format: "uri" }, Container: { name: "Container", description: "Used to specify the location and relevant attributes of software container image\nused to produce the dataset. Valid keys in this object include `Type`, `Tag` and\n[`URI`][uri] with [string][] values.\n", type: "object", recommended_fields: ["Type", "Tag", "URI"], properties: { Type: { type: "string" }, Tag: { type: "string" }, URI: { type: "string", format: "uri" } } } } } }, GeneticLevel: { name: "GeneticLevel", display_name: "Genetic Level", description: 'Describes the level of analysis.\nValues MUST be one of `"Genetic"`, `"Genomic"`, `"Epigenomic"`,\n`"Transcriptomic"`, `"Metabolomic"`, or `"Proteomic"`.\n\nFor more information on these levels, see\n[Multi-omics approaches to disease](https://genomebiology.biomedcentral.com/articles/10.1186/s13059-017-1215-1)\nby Hasin et al. 2017.\n', anyOf: [{ type: "string", enum: ["Genetic", "Genomic", "Epigenomic", "Transcriptomic", "Metabolomic", "Proteomic"] }, { type: "array", items: { type: "string", enum: ["Genetic", "Genomic", "Epigenomic", "Transcriptomic", "Metabolomic", "Proteomic"] } }] }, Genetics: { name: "Genetics", display_name: "Genetics", description: "An object containing information about the genetics descriptor.\n", type: "object", required_fields: ["Dataset"], properties: { Dataset: { name: "Dataset", description: "[URI](SPEC_ROOT/common-principles.md#uniform-resource-indicator)\nwhere data can be retrieved.\n", type: "string", format: "uri" }, Database: { name: "Database", description: "[URI](SPEC_ROOT/common-principles.md#uniform-resource-indicator)\nof database where the dataset is hosted.\n", type: "string", format: "uri" }, Descriptors: { name: "Descriptors", description: "List of relevant descriptors (for example, journal articles) for dataset\nusing a valid\n[URI](SPEC_ROOT/common-principles.md#uniform-resource-indicator)\nwhen possible.\n", anyOf: [{ type: "string" }, { type: "array", items: { type: "string" } }] } } }, GradientSetType: { name: "GradientSetType", display_name: "Gradient Set Type", description: "It should be possible to infer the gradient coil from the scanner model.\nIf not, for example because of a custom upgrade or use of a gradient\ninsert set, then the specifications of the actual gradient coil should be\nreported independently.\n", type: "string" }, GYROChannelCount: { name: "GYROChannelCount", display_name: "Gyrometer Channel Count", description: "Number of gyrometer channels.\n", type: "integer", minimum: 0 }, HED: { name: "HED", display_name: "HED", description: "Hierarchical Event Descriptor (HED) information,\nsee the [HED Appendix](SPEC_ROOT/appendices/hed.md) for details.\n", anyOf: [{ type: "string" }, { type: "object", additionalProperties: { type: "string" } }] }, HEDVersion: { name: "HEDVersion", display_name: "HED Version", description: "If HED tags are used:\nThe version of the HED schema used to validate HED tags for study.\nMay include a single schema or a base schema and one or more library schema.\n", anyOf: [{ type: "string", format: "hed_version" }, { type: "array", items: { type: "string", format: "hed_version" } }] }, Haematocrit: { name: "Haematocrit", display_name: "Haematocrit", description: "Measured haematocrit, meaning the volume of erythrocytes divided by the\nvolume of whole blood.\n", type: "number" }, HardcopyDeviceSoftwareVersion: { name: "HardcopyDeviceSoftwareVersion", display_name: "Hardcopy Device Software Version", description: "Manufacturer's designation of the software of the device that created this\nHardcopy Image (the printer).\nCorresponds to DICOM Tag 0018, 101A `Hardcopy Device Software Version`.\n", type: "string" }, HardwareFilters: { name: "HardwareFilters", display_name: "Hardware Filters", description: 'Object of temporal hardware filters applied, or `"n/a"` if the data is not\navailable. Each key-value pair in the JSON object is a name of the filter and\nan object in which its parameters are defined as key-value pairs.\nFor example, `{"Highpass RC filter": {"Half amplitude cutoff (Hz)":\n0.0159, "Roll-off": "6dB/Octave"}}`.\n', anyOf: [{ type: "object", additionalProperties: { type: "object" } }, { type: "string", enum: ["n/a"] }] }, HeadCircumference: { name: "HeadCircumference", display_name: "Head Circumference", description: "Circumference of the participant's head, expressed in cm (for example, `58`).\n", type: "number", exclusiveMinimum: 0, unit: "cm" }, HeadCoilCoordinateSystem: { name: "HeadCoilCoordinateSystem", display_name: "Head Coil Coordinate System", description: 'Defines the coordinate system for the head coils.\nSee the\n[Coordinate Systems Appendix](SPEC_ROOT/appendices/coordinate-systems.md)\nfor a list of restricted keywords for coordinate systems.\nIf `"Other"`, provide definition of the coordinate system in\n`HeadCoilCoordinateSystemDescription`.\n', type: "string", enum: ["CTF", "ElektaNeuromag", "4DBti", "KitYokogawa", "ChietiItab", "Other", "CapTrak", "EEGLAB", "EEGLAB-HJ", "Other", "ICBM452AirSpace", "ICBM452Warp5Space", "IXI549Space", "fsaverage", "fsaverageSym", "fsLR", "MNIColin27", "MNI152Lin", "MNI152NLin2009aSym", "MNI152NLin2009bSym", "MNI152NLin2009cSym", "MNI152NLin2009aAsym", "MNI152NLin2009bAsym", "MNI152NLin2009cAsym", "MNI152NLin6Sym", "MNI152NLin6ASym", "MNI305", "NIHPD", "OASIS30AntsOASISAnts", "OASIS30Atropos", "Talairach", "UNCInfant", "fsaverage3", "fsaverage4", "fsaverage5", "fsaverage6", "fsaveragesym", "UNCInfant0V21", "UNCInfant1V21", "UNCInfant2V21", "UNCInfant0V22", "UNCInfant1V22", "UNCInfant2V22", "UNCInfant0V23", "UNCInfant1V23", "UNCInfant2V23"] }, HeadCoilCoordinateSystemDescription: { name: "HeadCoilCoordinateSystemDescription", display_name: "Head Coil Coordinate System Description", description: "Free-form text description of the coordinate system.\nMay also include a link to a documentation page or paper describing the system in greater detail.\n", type: "string" }, HeadCoilCoordinateUnits: { name: "HeadCoilCoordinateUnits", display_name: "Head Coil Coordinate Units", description: "Units of the coordinates of `HeadCoilCoordinateSystem`.\n", type: "string", enum: ["m", "mm", "cm", "n/a"] }, HeadCoilCoordinates: { name: "HeadCoilCoordinates", display_name: "Head Coil Coordinates", description: 'Key-value pairs describing head localization coil labels and their\ncoordinates, interpreted following the `HeadCoilCoordinateSystem`\n(for example, `{"NAS": [12.7,21.3,13.9], "LPA": [5.2,11.3,9.6],\n"RPA": [20.2,11.3,9.1]}`).\nNote that coils are not always placed at locations that have a known\nanatomical name (for example, for Neuromag/Elekta/MEGIN, Yokogawa systems);\nin that case generic labels can be used\n(for example, `{"coil1": [12.2,21.3,12.3], "coil2": [6.7,12.3,8.6],\n"coil3": [21.9,11.0,8.1]}`).\nEach array MUST contain three numeric values corresponding to x, y, and z\naxis of the coordinate system in that exact order.\n', type: "object", additionalProperties: { type: "array", items: { type: "number" }, minItems: 3, maxItems: 3 } }, HeadCoilFrequency: { name: "HeadCoilFrequency", display_name: "Head Coil Frequency", description: "List of frequencies (in Hz) used by the head localisation coils\n('HLC' in CTF systems, 'HPI' in Neuromag/Elekta/MEGIN, 'COH' in BTi/4D)\nthat track the subject's head position in the MEG helmet\n(for example, `[293, 307, 314, 321]`).\n", anyOf: [{ type: "number", unit: "Hz" }, { type: "array", items: { type: "number", unit: "Hz" } }] }, HeadStabilization: { name: "HeadStabilization", display_name: "Head stabilization", description: 'Head restraint method used during the experiment\nto prevent rotation and/or translation of the head.\nExample: "chin-rest", "head-rest", "bite-bar", "chin-rest and head-rest", "none"\n', type: "string" }, HowToAcknowledge: { name: "HowToAcknowledge", display_name: "How To Acknowledge", description: "Text containing instructions on how researchers using this dataset should\nacknowledge the original authors.\nThis field can also be used to define a publication that should be cited in\npublications that use the dataset.\n", type: "string" }, ImageAcquisitionProtocol: { name: "ImageAcquisitionProtocol", display_name: "Image Acquisition Protocol", description: "Description of the image acquisition protocol or\n[URI](SPEC_ROOT/common-principles.md#uniform-resource-indicator)\n(for example from [protocols.io](https://www.protocols.io/)).\n", type: "string" }, ImageDecayCorrected: { name: "ImageDecayCorrected", display_name: "Image Decay Corrected", description: "Boolean flag specifying whether the image data have been decay-corrected.\n", type: "boolean" }, ImageDecayCorrectionTime: { name: "ImageDecayCorrectionTime", display_name: "Image Decay Correction Time", description: 'Point in time from which the decay correction was applied with respect to\n`"TimeZero"` in the default unit seconds.\n', type: "number", unit: "s" }, Immersion: { name: "Immersion", display_name: "Immersion", description: "Lens immersion medium. If the file format is OME-TIFF, the value MUST be consistent\nwith the `Immersion` OME metadata field.\n", type: "string" }, InfusionRadioactivity: { name: "InfusionRadioactivity", display_name: "Infusion Radioactivity", description: 'Amount of radioactivity infused into the patient.\nThis value must be less than or equal to the total injected radioactivity\n(`"InjectedRadioactivity"`).\nUnits should be the same as `"InjectedRadioactivityUnits"`.\n', type: "number" }, InfusionSpeed: { name: "InfusionSpeed", display_name: "Infusion Speed", description: "If given, infusion speed.\n", type: "number" }, InfusionSpeedUnits: { name: "InfusionSpeedUnits", display_name: "Infusion Speed Units", description: 'Unit of infusion speed (for example, `"mL/s"`).\n', type: "string", format: "unit" }, InfusionStart: { name: "InfusionStart", display_name: "Infusion Start", description: 'Time of start of infusion with respect to `"TimeZero"` in the default unit\nseconds.\n', type: "number", unit: "s" }, InjectedMass: { name: "InjectedMass", display_name: "Injected Mass", description: 'Total mass of radiolabeled compound injected into subject (for example, `10`).\nThis can be derived as the ratio of the `"InjectedRadioactivity"` and\n`"MolarRadioactivity"`.\n**For those tracers in which injected mass is not available (for example FDG)\ncan be set to `"n/a"`)**.\n', anyOf: [{ type: "number" }, { type: "string", enum: ["n/a"] }] }, InjectedMassPerWeight: { name: "InjectedMassPerWeight", display_name: "Injected Mass Per Weight", description: "Injected mass per kilogram bodyweight.\n", type: "number" }, InjectedMassPerWeightUnits: { name: "InjectedMassPerWeightUnits", display_name: "Injected Mass Per Weight Units", description: 'Unit format of the injected mass per kilogram bodyweight\n(for example, `"ug/kg"`).\n', type: "string", format: "unit" }, InjectedMassUnits: { name: "InjectedMassUnits", display_name: "Injected Mass Units", description: 'Unit format of the mass of compound injected (for example, `"ug"` or\n`"umol"`).\n**Note this is not required for an FDG acquisition, since it is not available,\nand SHOULD be set to `"n/a"`**.\n', anyOf: [{ type: "string", format: "unit" }, { type: "string", enum: ["n/a"] }] }, InjectedRadioactivity: { name: "InjectedRadioactivity", display_name: "Injected Radioactivity", description: "Total amount of radioactivity injected into the patient (for example, `400`).\nFor bolus-infusion experiments, this value should be the sum of all injected\nradioactivity originating from both bolus and infusion.\nCorresponds to DICOM Tag 0018, 1074 `Radionuclide Total Dose`.\n", type: "number" }, InjectedRadioactivityUnits: { name: "InjectedRadioactivityUnits", display_name: "Injected Radioactivity Units", description: 'Unit format of the specified injected radioactivity (for example, `"MBq"`).\n', type: "string", format: "unit" }, InjectedVolume: { name: "InjectedVolume", display_name: "Injected Volume", description: 'Injected volume of the radiotracer in the unit `"mL"`.\n', type: "number", unit: "mL" }, InjectionEnd: { name: "InjectionEnd", display_name: "Injection End", description: 'Time of end of injection with respect to `"TimeZero"` in the default unit\nseconds.\n', type: "number", unit: "s" }, InjectionStart: { name: "InjectionStart", display_name: "Injection Start", description: 'Time of start of injection with respect to `"TimeZero"` in the default unit\nseconds.\nThis corresponds to DICOM Tag 0018, 1072 `Contrast/Bolus Start Time`\nconverted to seconds relative to `"TimeZero"`.\n', type: "number", unit: "s" }, InstitutionAddress: { name: "InstitutionAddress", display_name: "Institution Address", description: "The address of the institution in charge of the equipment that produced the\nmeasurements.\n", type: "string" }, InstitutionName: { name: "InstitutionName", display_name: "Institution Name", description: "The name of the institution in charge of the equipment that produced the\nmeasurements.\n", type: "string" }, InstitutionalDepartmentName: { name: "InstitutionalDepartmentName", display_name: "Institutional Department Name", description: "The department in the institution in charge of the equipment that produced\nthe measurements.\n", type: "string" }, Instructions: { name: "Instructions", display_name: "Instructions", description: "Text of the instructions given to participants before the recording.\n", type: "string" }, IntendedFor: { name: "IntendedFor", display_name: "Intended For", description: "The paths to files for which the associated file is intended to be used.\nContains one or more [BIDS URIs](SPEC_ROOT/common-principles.md#bids-uri).\nUsing forward-slash separated paths relative to the participant subdirectory is\n[DEPRECATED](SPEC_ROOT/common-principles.md#definitions).\n", anyOf: [{ type: "string", format: "bids_uri" }, { type: "string", format: "participant_relative" }, { type: "array", items: { anyOf: [{ type: "string", format: "bids_uri" }, { type: "string", format: "participant_relative" }] } }] }, IntendedFor__ds_relative: { name: "IntendedFor", display_name: "Intended For", description: "The paths to files for which the associated file is intended to be used.\nContains one or more [BIDS URIs](SPEC_ROOT/common-principles.md#bids-uri).\nUsing forward-slash separated paths relative to the dataset root is\n[DEPRECATED](SPEC_ROOT/common-principles.md#definitions).\n", anyOf: [{ type: "string", format: "bids_uri" }, { type: "string", format: "dataset_relative" }, { type: "array", items: { anyOf: [{ type: "string", format: "bids_uri" }, { type: "string", format: "dataset_relative" }] } }] }, InversionTime: { name: "InversionTime", display_name: "Inversion Time", description: "The inversion time (TI) for the acquisition, specified in seconds.\nInversion time is the time after the middle of inverting RF pulse to middle\nof excitation pulse to detect the amount of longitudinal magnetization.\nCorresponds to DICOM Tag 0018, 0082 `Inversion Time`\n(please note that the DICOM term is in milliseconds not seconds).\n", type: "number", unit: "s", exclusiveMinimum: 0 }, JNTANGChannelCount: { name: "JNTANGChannelCount", display_name: "Joint angle channel count", description: "Number of joint angle channels.\n", type: "integer", minimum: 0 }, LabelingDistance: { name: "LabelingDistance", display_name: "Labeling Distance", description: "Distance from the center of the imaging slab to the center of the labeling\nplane (`(P)CASL`) or the leading edge of the labeling slab (`PASL`),\nin millimeters.\nIf the labeling is performed inferior to the isocenter,\nthis number should be negative.\nBased on DICOM macro C.8.13.5.14.\n", type: "number", unit: "mm" }, LabelingDuration: { name: "LabelingDuration", display_name: "Labeling Duration", description: 'Total duration of the labeling pulse train, in seconds,\ncorresponding to the temporal width of the labeling bolus for\n`"PCASL"` or `"CASL"`.\nIn case all control-label volumes (or deltam or CBF) have the same\n`LabelingDuration`, a scalar must be specified.\nIn case the control-label volumes (or deltam or cbf) have a different\n`"LabelingDuration"`, an array of numbers must be specified,\nfor which any `m0scan` in the timeseries has a `"LabelingDuration"` of zero.\nIn case an array of numbers is provided,\nits length should be equal to the number of volumes specified in\n`*_aslcontext.tsv`.\nCorresponds to DICOM Tag 0018, 9258 `ASL Pulse Train Duration`.\n', anyOf: [{ type: "number", minimum: 0, unit: "s" }, { type: "array", items: { type: "number", unit: "s", minimum: 0 } }] }, LabelingEfficiency: { name: "LabelingEfficiency", display_name: "Labeling Efficiency", description: "Labeling efficiency, specified as a number between zero and one,\nonly if obtained externally (for example phase-contrast based).\n", type: "number", exclusiveMinimum: 0 }, LabelingLocationDescription: { name: "LabelingLocationDescription", display_name: "Labeling Location Description", description: 'Description of the location of the labeling plane (`"CASL"` or `"PCASL"`) or\nthe labeling slab (`"PASL"`) that cannot be captured by fields\n`LabelingOrientation` or `LabelingDistance`.\nMay include a link to an anonymized screenshot of the planning of the\nlabeling slab/plane with respect to the imaging slab or slices\n`*_asllabeling.*`.\nBased on DICOM macro C.8.13.5.14.\n', type: "string" }, LabelingOrientation: { name: "LabelingOrientation", display_name: "Labeling Orientation", description: "Orientation of the labeling plane (`(P)CASL`) or slab (`PASL`).\nThe direction cosines of a normal vector perpendicular to the ASL labeling\nslab or plane with respect to the patient.\nCorresponds to DICOM Tag 0018, 9255 `ASL Slab Orientation`.\n", type: "array", items: { type: "number" } }, LabelingPulseAverageB1: { name: "LabelingPulseAverageB1", display_name: "Labeling Pulse Average B1", description: 'The average B1-field strength of the RF labeling pulses, in microteslas.\nAs an alternative, `"LabelingPulseFlipAngle"` can be provided.\n', type: "number", exclusiveMinimum: 0, unit: "uT" }, LabelingPulseAverageGradient: { name: "LabelingPulseAverageGradient", display_name: "Labeling Pulse Average Gradient", description: "The average labeling gradient, in milliteslas per meter.\n", type: "number", exclusiveMinimum: 0, unit: "mT/m" }, LabelingPulseDuration: { name: "LabelingPulseDuration", display_name: "Labeling Pulse Duration", description: "Duration of the individual labeling pulses, in milliseconds.\n", type: "number", exclusiveMinimum: 0, unit: "ms" }, LabelingPulseFlipAngle: { name: "LabelingPulseFlipAngle", display_name: "Labeling Pulse Flip Angle", description: 'The flip angle of a single labeling pulse, in degrees,\nwhich can be given as an alternative to `"LabelingPulseAverageB1"`.\n', type: "number", exclusiveMinimum: 0, maximum: 360, unit: "degree" }, LabelingPulseInterval: { name: "LabelingPulseInterval", display_name: "Labeling Pulse Interval", description: "Delay between the peaks of the individual labeling pulses, in milliseconds.\n", type: "number", exclusiveMinimum: 0, unit: "ms" }, LabelingPulseMaximumGradient: { name: "LabelingPulseMaximumGradient", display_name: "Labeling Pulse Maximum Gradient", description: "The maximum amplitude of the gradient switched on during the application of\nthe labeling RF pulse(s), in milliteslas per meter.\n", type: "number", exclusiveMinimum: 0, unit: "mT/m" }, LabelingSlabThickness: { name: "LabelingSlabThickness", display_name: "Labeling Slab Thickness", description: "Thickness of the labeling slab in millimeters.\nFor non-selective FAIR a zero is entered.\nCorresponds to DICOM Tag 0018, 9254 `ASL Slab Thickness`.\n", type: "number", exclusiveMinimum: 0, unit: "mm" }, LATENCYChannelCount: { name: "LATENCYChannelCount", display_name: "Latency channel count", description: "Number of Latency channels.\n", type: "integer", minimum: 0 }, Levels: { name: "Levels", display_name: "Levels", description: "For categorical variables: An object of possible values (keys) and their\ndescriptions (values).\n", type: "object", additionalProperties: { type: "string" } }, License: { name: "License", display_name: "License", description: "The license for the dataset.\nThe use of license name abbreviations is RECOMMENDED for specifying a license\n(see [Licenses](SPEC_ROOT/appendices/licenses.md)).\nThe corresponding full license text MAY be specified in an additional\n`LICENSE` file.\n", type: "string" }, LongName: { name: "LongName", display_name: "Long Name", description: "Long (unabbreviated) name of the column.\n", type: "string" }, LookLocker: { name: "LookLocker", display_name: "Look Locker", description: "Boolean indicating if a Look-Locker readout is used.\n", type: "boolean" }, M0Estimate: { name: "M0Estimate", display_name: "M0Estimate", description: "A single numerical whole-brain M0 value (referring to the M0 of blood),\nonly if obtained externally\n(for example retrieved from CSF in a separate measurement).\n", type: "number", exclusiveMinimum: 0 }, M0Type: { name: "M0Type", display_name: "M0Type", description: 'Describes the presence of M0 information.\n`"Separate"` means that a separate `*_m0scan.nii[.gz]` is present.\n`"Included"` means that an m0scan volume is contained within the current\n`*_asl.nii[.gz]`.\n`"Estimate"` means that a single whole-brain M0 value is provided.\n`"Absent"` means that no specific M0 information is present.\n', type: "string", enum: ["Separate", "Included", "Estimate", "Absent"] }, MAGNChannelCount: { name: "MAGNChannelCount", display_name: "Magnetometer Channel Count", description: "Number of magnetometer channels.\n", type: "integer", minimum: 0 }, MEGChannelCount: { name: "MEGChannelCount", display_name: "MEG Channel Count", description: "Number of MEG channels (for example, `275`).\n", type: "integer", minimum: 0 }, MEGCoordinateSystem: { name: "MEGCoordinateSystem", display_name: "MEG Coordinate System", description: 'Defines the coordinate system for the MEG sensors.\nSee the\n[Coordinate Systems Appendix](SPEC_ROOT/appendices/coordinate-systems.md)\nfor a list of restricted keywords for coordinate systems.\nIf `"Other"`, provide definition of the coordinate system in\n`"MEGCoordinateSystemDescription"`.\n', type: "string", enum: ["CTF", "ElektaNeuromag", "4DBti", "KitYokogawa", "ChietiItab", "Other", "CapTrak", "EEGLAB", "EEGLAB-HJ", "Other", "ICBM452AirSpace", "ICBM452Warp5Space", "IXI549Space", "fsaverage", "fsaverageSym", "fsLR", "MNIColin27", "MNI152Lin", "MNI152NLin2009aSym", "MNI152NLin2009bSym", "MNI152NLin2009cSym", "MNI152NLin2009aAsym", "MNI152NLin2009bAsym", "MNI152NLin2009cAsym", "MNI152NLin6Sym", "MNI152NLin6ASym", "MNI305", "NIHPD", "OASIS30AntsOASISAnts", "OASIS30Atropos", "Talairach", "UNCInfant", "fsaverage3", "fsaverage4", "fsaverage5", "fsaverage6", "fsaveragesym", "UNCInfant0V21", "UNCInfant1V21", "UNCInfant2V21", "UNCInfant0V22", "UNCInfant1V22", "UNCInfant2V22", "UNCInfant0V23", "UNCInfant1V23", "UNCInfant2V23"] }, MEGCoordinateSystemDescription: { name: "MEGCoordinateSystemDescription", display_name: "MEG Coordinate System Description", description: "Free-form text description of the coordinate system.\nMay also include a link to a documentation page or paper describing the\nsystem in greater detail.\n", type: "string" }, MEGCoordinateUnits: { name: "MEGCoordinateUnits", display_name: "MEG Coordinate Units", description: 'Units of the coordinates of `"MEGCoordinateSystem"`.\n', type: "string", enum: ["m", "mm", "cm", "n/a"] }, MEGREFChannelCount: { name: "MEGREFChannelCount", display_name: "MEGREF Channel Count", description: "Number of MEG reference channels (for example, `23`).\nFor systems without such channels (for example, Neuromag Vectorview),\n`MEGREFChannelCount` should be set to `0`.\n", type: "integer", minimum: 0 }, MISCChannelCount: { name: "MISCChannelCount", display_name: "Miscellaneous channel count", description: "Number of miscellaneous channels not covered otherwise.\n", type: "integer", minimum: 0 }, MotionChannelCount: { name: "MotionChannelCount", display_name: "Motion Channel Count", description: "Number of motion channels (for example, `275`).\n", type: "integer", minimum: 0 }, MRAcquisitionType: { name: "MRAcquisitionType", display_name: "MR Acquisition Type", description: "Type of sequence readout.\nCorresponds to DICOM Tag 0018, 0023 `MR Acquisition Type`.\n", type: "string", enum: ["2D", "3D"] }, MRTransmitCoilSequence: { name: "MRTransmitCoilSequence", display_name: "MR Transmit Coil Sequence", description: "This is a relevant field if a non-standard transmit coil is used.\nCorresponds to DICOM Tag 0018, 9049 `MR Transmit Coil Sequence`.\n", type: "string" }, MTNumberOfPulses: { name: "MTNumberOfPulses", display_name: "MT Number Of Pulses", description: "The number of magnetization transfer RF pulses applied before the readout.\n", type: "number" }, MTOffsetFrequency: { name: "MTOffsetFrequency", display_name: "MT Offset Frequency", description: "The frequency offset of the magnetization transfer pulse with respect to the\ncentral H1 Larmor frequency in Hertz (Hz).\n", type: "number", unit: "Hz" }, MTPulseBandwidth: { name: "MTPulseBandwidth", display_name: "MT Pulse Bandwidth", description: "The excitation bandwidth of the magnetization transfer pulse in Hertz (Hz).\n", type: "number", unit: "Hz" }, MTPulseDuration: { name: "MTPulseDuration", display_name: "MT Pulse Duration", description: "Duration of the magnetization transfer RF pulse in seconds.\n", type: "number", unit: "s" }, MTPulseShape: { name: "MTPulseShape", display_name: "MT Pulse Shape", description: 'Shape of the magnetization transfer RF pulse waveform.\nThe value `"GAUSSHANN"` refers to a Gaussian pulse with a Hanning window.\nThe value `"SINCHANN"` refers to a sinc pulse with a Hanning window.\nThe value `"SINCGAUSS"` refers to a sinc pulse with a Gaussian window.\n', type: "string", enum: ["HARD", "GAUSSIAN", "GAUSSHANN", "SINC", "SINCHANN", "SINCGAUSS", "FERMI"] }, MTState: { name: "MTState", display_name: "MT State", description: "Boolean stating whether the magnetization transfer pulse is applied.\nCorresponds to DICOM Tag 0018, 9020 `Magnetization Transfer`.\n", type: "boolean" }, MagneticFieldStrength: { name: "MagneticFieldStrength", display_name: "Magnetic Field Strength", description: "Nominal field strength of MR magnet in Tesla.\nCorresponds to DICOM Tag 0018, 0087 `Magnetic Field Strength`.\n", type: "number" }, Magnification: { name: "Magnification", display_name: "Magnification", description: 'Lens magnification (for example: `40`). If the file format is OME-TIFF,\nthe value MUST be consistent with the `"NominalMagnification"` OME metadata field.\n', type: "number", exclusiveMinimum: 0 }, Manual: { name: "Manual", display_name: "Manual", description: "Indicates if the segmentation was performed manually or via an automated\nprocess.\n", type: "boolean" }, Manufacturer: { name: "Manufacturer", display_name: "Manufacturer", description: "Manufacturer of the equipment that produced the measurements.\n", type: "string" }, ManufacturersModelName: { name: "ManufacturersModelName", display_name: "Manufacturers Model Name", description: "Manufacturer's model name of the equipment that produced the measurements.\n", type: "string" }, MatrixCoilMode: { name: "MatrixCoilMode", display_name: "Matrix Coil Mode", description: '(If used)\nA method for reducing the number of independent channels by combining in\nanalog the signals from multiple coil elements.\nThere are typically different default modes when using un-accelerated or\naccelerated (for example, `"GRAPPA"`, `"SENSE"`) imaging.\n', type: "string" }, MaxMovement: { name: "MaxMovement", display_name: "Max Movement", description: "Maximum head movement (in mm) detected during the recording,\nas measured by the head localisation coils (for example, `4.8`).\n", type: "number", unit: "mm" }, MeasurementToolMetadata: { name: "MeasurementToolMetadata", display_name: "Measurement Tool Metadata", description: 'A description of the measurement tool as a whole.\nContains two fields: `"Description"` and `"TermURL"`.\n`"Description"` is a free text description of the measurement tool.\n`"TermURL"` is a URL to an entity in an ontology corresponding to this tool.\n', type: "object", properties: { TermURL: { type: "string", format: "uri" }, Description: { type: "string" } } }, MetaboliteAvail: { name: "MetaboliteAvail", display_name: "Metabolite Available", description: "Boolean that specifies if metabolite measurements are available.\nIf `true`, the `metabolite_parent_fraction` column MUST be present in the\ncorresponding `*_blood.tsv` file.\n", type: "boolean" }, MetaboliteMethod: { name: "MetaboliteMethod", display_name: "Metabolite Method", description: "Method used to measure metabolites.\n", type: "string" }, MetaboliteRecoveryCorrectionApplied: { name: "MetaboliteRecoveryCorrectionApplied", display_name: "Metabolite Recovery Correction Applied", description: "Metabolite recovery correction from the HPLC, for tracers where it changes\nwith time postinjection.\nIf `true`, the `hplc_recovery_fractions` column MUST be present in the\ncorresponding `*_blood.tsv` file.\n", type: "boolean" }, MiscChannelCount: { name: "MiscChannelCount", display_name: "Misc Channel Count", description: "Number of miscellaneous analog channels for auxiliary signals.\n", type: "integer", minimum: 0 }, MissingValues: { name: "MissingValues", display_name: "MissingValues", description: 'Describes how missing values are represented in the given recording system\n(for example a tracking system in motion), can take values such as, "NaN", "0".\n', type: "string" }, MixingTime: { name: "MixingTime", display_name: "Mixing Time", description: "In the context of a stimulated- and spin-echo 3D EPI sequence for B1+ mapping,\ncorresponds to the interval between spin- and stimulated-echo pulses.\nIn the context of a diffusion-weighted double spin-echo sequence,\ncorresponds to the interval between two successive diffusion sensitizing\ngradients, specified in seconds.\n", type: "number", unit: "s" }, ModeOfAdministration: { name: "ModeOfAdministration", display_name: "Mode Of Administration", description: 'Mode of administration of the injection\n(for example, `"bolus"`, `"infusion"`, or `"bolus-infusion"`).\n', type: "string" }, MolarActivity: { name: "MolarActivity", display_name: "Molar Activity", description: "Molar activity of compound injected.\nCorresponds to DICOM Tag 0018, 1077 `Radiopharmaceutical Specific Activity`.\n", type: "number" }, MolarActivityMeasTime: { name: "MolarActivityMeasTime", display_name: "Molar Activity Measurement Time", description: 'Time to which molar radioactivity measurement above applies in the default\nunit `"hh:mm:ss"`.\n', type: "string", format: "time" }, MolarActivityUnits: { name: "MolarActivityUnits", display_name: "Molar Activity Units", description: 'Unit of the specified molar radioactivity (for example, `"GBq/umol"`).\n', type: "string", format: "unit" }, MultibandAccelerationFactor: { name: "MultibandAccelerationFactor", display_name: "Multiband Acceleration Factor", description: "The multiband factor, for multiband acquisitions.\n", type: "number" }, MultipartID: { name: "MultipartID", display_name: "MultipartID", description: "A unique (per participant) label tagging DWI runs that are part of a\nmultipart scan.\n", type: "string" }, Name: { name: "Name", display_name: "Name", description: "Name of the dataset.\n", type: "string" }, NegativeContrast: { name: "NegativeContrast", display_name: "Negative Contrast", description: "`true` or `false` value specifying whether increasing voxel intensity\n(within sample voxels) denotes a decreased value with respect to the\ncontrast suffix.\nThis is commonly the case when Cerebral Blood Volume is estimated via\nusage of a contrast agent in conjunction with a T2\\* weighted acquisition\nprotocol.\n", type: "boolean" }, NIRSChannelCount: { name: "NIRSChannelCount", display_name: "NIRS Channel Count", description: "Total number of NIRS channels, including short channels.\nCorresponds to the number of rows in `channels.tsv` with any NIRS type.\n", type: "integer", minimum: 0 }, NIRSSourceOptodeCount: { name: "NIRSSourceOptodeCount", display_name: "NIRS Source Optode Count", description: 'Number of NIRS sources.\nCorresponds to the number of rows in `optodes.tsv` with type `"source"`.\n', type: "integer", minimum: 1 }, NIRSDetectorOptodeCount: { name: "NIRSDetectorOptodeCount", display_name: "NIRS Detector Optode Channel Count", description: 'Number of NIRS detectors.\nCorresponds to the number of rows in `optodes.tsv` with type `"detector"`.\n', type: "integer", minimum: 1 }, NIRSPlacementScheme: { name: "NIRSPlacementScheme", display_name: "NIRS Placement Scheme", description: 'Placement scheme of NIRS optodes.\nEither the name of a standardized placement system (for example, `"10-20"`)\nor an array of standardized position names (for example, `["Cz", "Pz"]`).\nThis field should only be used if a cap was not used.\nIf a standard cap was used, then it should be specified in `CapManufacturer`\nand `CapManufacturersModelName` and this field should be set to `"n/a"`\n', anyOf: [{ type: "string" }, { type: "array", items: { type: "string" } }] }, NIRSCoordinateSystem: { name: "NIRSCoordinateSystem", display_name: "NIRS Coordinate System", description: 'Defines the coordinate system in which the optode positions are expressed.\n\nSee\n[Appendix VIII](SPEC_ROOT/appendices/coordinate-systems.md)\nfor a list of restricted keywords for coordinate systems.\nIf `"Other"`, a definition of the coordinate system MUST be\nprovided in `NIRSCoordinateSystemDescription`.\n', type: "string", enum: ["CTF", "ElektaNeuromag", "4DBti", "KitYokogawa", "ChietiItab", "Other", "CapTrak", "EEGLAB", "EEGLAB-HJ", "Other", "ICBM452AirSpace", "ICBM452Warp5Space", "IXI549Space", "fsaverage", "fsaverageSym", "fsLR", "MNIColin27", "MNI152Lin", "MNI152NLin2009aSym", "MNI152NLin2009bSym", "MNI152NLin2009cSym", "MNI152NLin2009aAsym", "MNI152NLin2009bAsym", "MNI152NLin2009cAsym", "MNI152NLin6Sym", "MNI152NLin6ASym", "MNI305", "NIHPD", "OASIS30AntsOASISAnts", "OASIS30Atropos", "Talairach", "UNCInfant", "fsaverage3", "fsaverage4", "fsaverage5", "fsaverage6", "fsaveragesym", "UNCInfant0V21", "UNCInfant1V21", "UNCInfant2V21", "UNCInfant0V22", "UNCInfant1V22", "UNCInfant2V22", "UNCInfant0V23", "UNCInfant1V23", "UNCInfant2V23"] }, NIRSCoordinateSystemDescription: { name: "NIRSCoordinateSystemDescription", display_name: "NIRS Coordinate System Description", description: "Free-form text description of the coordinate system.\nMay also include a link to a documentation page or paper describing the\nsystem in greater detail.\n", type: "string" }, NIRSCoordinateUnits: { name: "NIRSCoordinateUnits", display_name: "NIRS Coordinate Units", description: "Units of the coordinates of `NIRSCoordinateSystem`.\n", type: "string", enum: ["m", "mm", "cm", "n/a"] }, NIRSCoordinateProcessingDescription: { name: "NIRSCoordinateProcessingDescription", display_name: "NIRS Coordinate Processing Description", description: 'Has any post-processing (such as projection) been done on the optode\npositions (for example, `"surface_projection"`, `"n/a"`).\n', type: "string" }, NonlinearGradientCorrection: { name: "NonlinearGradientCorrection", display_name: "Nonlinear Gradient Correction", description: "Boolean stating if the image saved has been corrected for gradient\nnonlinearities by the scanner sequence.\n", type: "boolean" }, NumberOfVolumesDiscardedByScanner: { name: "NumberOfVolumesDiscardedByScanner", display_name: "Number Of Volumes Discarded By Scanner", description: 'Number of volumes ("dummy scans") discarded by the scanner\n(as opposed to those discarded by the user post hoc)\nbefore saving the imaging file.\nFor example, a sequence that automatically discards the first 4 volumes\nbefore saving would have this field as 4.\nA sequence that does not discard dummy scans would have this set to 0.\nPlease note that the onsets recorded in the `events.tsv` file should always\nrefer to the beginning of the acquisition of the first volume in the\ncorresponding imaging file - independent of the value of\n`"NumberOfVolumesDiscardedByScanner"` field.\n', type: "integer", minimum: 0 }, NumberOfVolumesDiscardedByUser: { name: "NumberOfVolumesDiscardedByUser", display_name: "Number Of Volumes Discarded By User", description: 'Number of volumes ("dummy scans") discarded by the user before including the\nfile in the dataset.\nIf possible, including all of the volumes is strongly recommended.\nPlease note that the onsets recorded in the `events.tsv` file should always\nrefer to the beginning of the acquisition of the first volume in the\ncorresponding imaging file - independent of the value of\n`"NumberOfVolumesDiscardedByUser"` field.\n', type: "integer", minimum: 0 }, NumberShots: { name: "NumberShots", display_name: "Number Shots", description: 'The number of RF excitations needed to reconstruct a slice or volume\n(may be referred to as partition).\nPlease mind that this is not the same as Echo Train Length which denotes the\nnumber of k-space lines collected after excitation in a multi-echo readout.\nThe data type array is applicable for specifying this parameter before and\nafter the k-space center is sampled.\nPlease see\n[`"NumberShots"` metadata field]\\\n(SPEC_ROOT/appendices/qmri.md#numbershots-metadata-field)\nin the qMRI appendix for corresponding calculations.\n', anyOf: [{ type: "number" }, { type: "array", items: { type: "number" } }] }, NumericalAperture: { name: "NumericalAperture", display_name: "Numerical Aperture", description: "Lens numerical aperture (for example: `1.4`). If the file format is OME-TIFF,\nthe value MUST be consistent with the `LensNA` OME metadata field.\n", type: "number", exclusiveMinimum: 0 }, OperatingSystem: { name: "OperatingSystem", display_name: "Operating System", description: "Operating system used to run the stimuli presentation software\n(for formatting recommendations, see examples below this table).\n", type: "string" }, ORNTChannelCount: { name: "ORNTChannelCount", display_name: "Orientation Channel Count", description: "Number of orientation channels.\n", type: "integer", minimum: 0 }, OtherAcquisitionParameters: { name: "OtherAcquisitionParameters", display_name: "Other Acquisition Parameters", description: "Description of other relevant image acquisition parameters.\n", type: "string" }, PASLType: { name: "PASLType", display_name: "PASL Type", description: 'Type of the labeling pulse of the `PASL` labeling,\nfor example `"FAIR"`, `"EPISTAR"`, or `"PICORE"`.\n', type: "string" }, PCASLType: { name: "PCASLType", display_name: "PCASL Type", description: "The type of gradient pulses used in the `control` condition.\n", type: "string", enum: ["balanced", "unbalanced"] }, ParallelAcquisitionTechnique: { name: "ParallelAcquisitionTechnique", display_name: "Parallel Acquisition Technique", description: 'The type of parallel imaging used (for example `"GRAPPA"`, `"SENSE"`).\nCorresponds to DICOM Tag 0018, 9078 `Parallel Acquisition Technique`.\n', type: "string" }, ParallelReductionFactorInPlane: { name: "ParallelReductionFactorInPlane", display_name: "Parallel Reduction Factor In Plane", description: "The parallel imaging (for instance, GRAPPA) factor in plane.\nUse the denominator of the fraction of k-space encoded for each slice.\nFor example, 2 means half of k-space is encoded.\nCorresponds to DICOM Tag 0018, 9069 `Parallel Reduction Factor In-plane`.\n", type: "number" }, ParallelReductionFactorOutOfPlane: { name: "ParallelReductionFactorOutOfPlane", display_name: "Parallel Reduction Factor Out of Plane", description: "The parallel imaging (for instance, GRAPPA) factor in the second phase encoding dimension of 3D sequences.\nUse the denominator of the fraction of k-space encoded in the second phase encoding dimension.\nFor example, 2 means half of k-space is encoded.\nWill typically be 1 for 2D sequences, as each slice in a 2D acquisition is usually fully encoded.\n`ParallelReductionFactorOutOfPlane` should not be confused with `MultibandAccelerationFactor`,\nas they imply different methods of accelerating the acquisition.\nCorresponds to DICOM Tag 0018, 9155 `Parallel Reduction Factor out-of-plane`.\n", type: "number" }, PartialFourier: { name: "PartialFourier", display_name: "Partial Fourier", description: "The fraction of partial Fourier information collected.\nCorresponds to DICOM Tag 0018, 9081 `Partial Fourier`.\n", type: "number" }, PartialFourierDirection: { name: "PartialFourierDirection", display_name: "Partial Fourier Direction", description: "The direction where only partial Fourier information was collected.\nCorresponds to DICOM Tag 0018, 9036 `Partial Fourier Direction`.\n", type: "string" }, PharmaceuticalDoseAmount: { name: "PharmaceuticalDoseAmount", display_name: "Pharmaceutical Dose Amount", description: "Dose amount of pharmaceutical coadministered with tracer.\n", anyOf: [{ type: "number" }, { type: "array", items: { type: "number" } }] }, PharmaceuticalDoseRegimen: { name: "PharmaceuticalDoseRegimen", display_name: "Pharmaceutical Dose Regimen", description: 'Details of the pharmaceutical dose regimen.\nEither adequate description or short-code relating to regimen documented\nelsewhere (for example, `"single oral bolus"`).\n', type: "string" }, PharmaceuticalDoseTime: { name: "PharmaceuticalDoseTime", display_name: "Pharmaceutical Dose Time", description: 'Time of administration of pharmaceutical dose, relative to time zero.\nFor an infusion, this should be a vector with two elements specifying the\nstart and end of the infusion period. For more complex dose regimens,\nthe regimen description should be complete enough to enable unambiguous\ninterpretation of `"PharmaceuticalDoseTime"`.\nUnit format of the specified pharmaceutical dose time MUST be seconds.\n', anyOf: [{ type: "number", unit: "s" }, { type: "array", items: { type: "number", unit: "s" } }] }, PharmaceuticalDoseUnits: { name: "PharmaceuticalDoseUnits", display_name: "Pharmaceutical Dose Units", description: 'Unit format relating to pharmaceutical dose\n(for example, `"mg"` or `"mg/kg"`).\n', type: "string", format: "unit" }, PharmaceuticalName: { name: "PharmaceuticalName", display_name: "Pharmaceutical Name", description: "Name of pharmaceutical coadministered with tracer.\n", type: "string" }, PhaseEncodingDirection: { name: "PhaseEncodingDirection", display_name: "Phase Encoding Direction", description: "The letters `i`, `j`, `k` correspond to the first, second and third axis of\nthe data in the NIFTI file.\nThe polarity of the phase encoding is assumed to go from zero index to\nmaximum index unless `-` sign is present\n(then the order is reversed - starting from the highest index instead of\nzero).\n`PhaseEncodingDirection` is defined as the direction along which phase is was\nmodulated which may result in visible distortions.\nNote that this is not the same as the DICOM term\n`InPlanePhaseEncodingDirection` which can have `ROW` or `COL` values.\n", type: "string", enum: ["i", "i-", "j", "j-", "k", "k-"] }, PhotoDescription: { name: "PhotoDescription", display_name: "Photo Description", description: "Description of the photo.\n", type: "string" }, PixelSize: { name: "PixelSize", display_name: "Pixel Size", description: "A 2- or 3-number array of the physical size of a pixel, either `[PixelSizeX, PixelSizeY]`\nor `[PixelSizeX, PixelSizeY, PixelSizeZ]`, where X is the width, Y the height and Z the\ndepth.\nIf the file format is OME-TIFF, these values need to be consistent with `PhysicalSizeX`,\n`PhysicalSizeY` and `PhysicalSizeZ` OME metadata fields, after converting in\n`PixelSizeUnits` according to `PhysicalSizeXunit`, `PhysicalSizeYunit` and\n`PhysicalSizeZunit` OME fields.\n", type: "array", minItems: 2, maxItems: 3, items: { type: "number", minimum: 0 } }, PixelSizeUnits: { name: "PixelSizeUnits", display_name: "Pixel Size Units", description: 'Unit format of the specified `"PixelSize"`. MUST be one of: `"mm"` (millimeter), `"um"`\n(micrometer) or `"nm"` (nanometer).\n', type: "string", enum: ["mm", "um", "nm"] }, PlasmaAvail: { name: "PlasmaAvail", display_name: "Plasma Avail", description: "Boolean that specifies if plasma measurements are available.\n", type: "boolean" }, PlasmaFreeFraction: { name: "PlasmaFreeFraction", display_name: "Plasma Free Fraction", description: "Measured free fraction in plasma, meaning the concentration of free compound\nin plasma divided by total concentration of compound in plasma\n(Units: 0-100%).\n", type: "number", minimum: 0, maximum: 100 }, PlasmaFreeFractionMethod: { name: "PlasmaFreeFractionMethod", display_name: "Plasma Free Fraction Method", description: "Method used to estimate free fraction.\n", type: "string" }, POSChannelCount: { name: "POSChannelCount", display_name: "Position Channel Count", description: "Number of position channels.\n", type: "integer", minimum: 0 }, PostLabelingDelay: { name: "PostLabelingDelay", display_name: "Post Labeling Delay", description: 'This is the postlabeling delay (PLD) time, in seconds, after the end of the\nlabeling (for `"CASL"` or `"PCASL"`) or middle of the labeling pulse\n(for `"PASL"`) until the middle of the excitation pulse applied to the\nimaging slab (for 3D acquisition) or first slice (for 2D acquisition).\nCan be a number (for a single-PLD time series) or an array of numbers\n(for multi-PLD and Look-Locker).\nIn the latter case, the array of numbers contains the PLD of each volume,\nnamely each `control` and `label`, in the acquisition order.\nAny image within the time-series without a PLD, for example an `m0scan`,\nis indicated by a zero.\nBased on DICOM Tags 0018, 9079 `Inversion Times` and 0018, 0082\n`InversionTime`.\n', anyOf: [{ type: "number", exclusiveMinimum: 0, unit: "s" }, { type: "array", items: { type: "number", exclusiveMinimum: 0, unit: "s" } }] }, PowerLineFrequency: { name: "PowerLineFrequency", display_name: "Power Line Frequency", description: "Frequency (in Hz) of the power grid at the geographical location of the\ninstrument (for example, `50` or `60`).\n", anyOf: [{ type: "number", exclusiveMinimum: 0, unit: "Hz" }, { type: "string", enum: ["n/a"] }] }, PromptRate: { name: "PromptRate", display_name: "Prompt Rate", description: 'Prompt rate for each frame (same units as `Units`, for example, `"Bq/mL"`).\n', type: "array", items: { type: "number" } }, PulseSequenceDetails: { name: "PulseSequenceDetails", display_name: "Pulse Sequence Details", description: 'Information beyond pulse sequence type that identifies the specific pulse\nsequence used (for example,\n`"Standard Siemens Sequence distributed with the VB17 software"`,\n`"Siemens WIP ### version #.##,"` or\n`"Sequence written by X using a version compiled on MM/DD/YYYY"`).\n', type: "string" }, PulseSequenceType: { name: "PulseSequenceType", display_name: "Pulse Sequence Type", description: 'A general description of the pulse sequence used for the scan\n(for example, `"MPRAGE"`, `"Gradient Echo EPI"`, `"Spin Echo EPI"`,\n`"Multiband gradient echo EPI"`).\n', type: "string" }, Purity: { name: "Purity", display_name: "Purity", description: "Purity of the radiolabeled compound (between 0 and 100%).\n", type: "number", minimum: 0, maximum: 100 }, RandomRate: { name: "RandomRate", display_name: "Random Rate", description: 'Random rate for each frame (same units as `"Units"`, for example, `"Bq/mL"`).\n', type: "array", items: { type: "number" } }, RawSources: { name: "RawSources", display_name: "Raw Sources", description: "A list of paths relative to dataset root pointing to the BIDS-Raw file(s)\nthat were used in the creation of this derivative.\nThis field is DEPRECATED, and this metadata SHOULD be recorded in the\n`Sources` field using [BIDS URIs](SPEC_ROOT/common-principles.md#bids-uri)\nto distinguish sources from different datasets.\n", type: "array", items: { type: "string", format: "dataset_relative" } }, ReceiveCoilActiveElements: { name: "ReceiveCoilActiveElements", display_name: "Receive Coil Active Elements", description: "Information describing the active/selected elements of the receiver coil.\nThis does not correspond to a tag in the DICOM ontology.\nThe vendor-defined terminology for active coil elements can go in this field.\n", type: "string" }, ReceiveCoilName: { name: "ReceiveCoilName", display_name: "Receive Coil Name", description: "Information describing the receiver coil.\nCorresponds to DICOM Tag 0018, 1250 `Receive Coil Name`,\nalthough not all vendors populate that DICOM Tag,\nin which case this field can be derived from an appropriate\nprivate DICOM field.\n", type: "string" }, ReconFilterSize: { name: "ReconFilterSize", display_name: "Recon Filter Size", description: 'Kernel size of post-recon filter (FWHM) in default units `"mm"`.\n', anyOf: [{ type: "number", unit: "mm" }, { type: "array", items: { type: "number", unit: "mm" } }] }, ReconFilterType: { name: "ReconFilterType", display_name: "Recon Filter Type", description: 'Type of post-recon smoothing (for example, `["Shepp"]`).\n', anyOf: [{ type: "string" }, { type: "array", items: { type: "string" } }] }, ReconMethodImplementationVersion: { name: "ReconMethodImplementationVersion", display_name: "Recon Method Implementation Version", description: "Identification for the software used, such as name and version.\n", type: "string" }, ReconMethodName: { name: "ReconMethodName", display_name: "Recon Method Name", description: 'Reconstruction method or algorithm (for example, `"3d-op-osem"`).\n', type: "string" }, ReconMethodParameterLabels: { name: "ReconMethodParameterLabels", display_name: "Recon Method Parameter Labels", description: 'Names of reconstruction parameters (for example, `["subsets", "iterations"]`).\n', type: "array", items: { type: "string" } }, ReconMethodParameterUnits: { name: "ReconMethodParameterUnits", display_name: "Recon Method Parameter Units", description: 'Unit of reconstruction parameters (for example, `["none", "none"]`).\n', type: "array", items: { type: "string", format: "unit" } }, ReconMethodParameterValues: { name: "ReconMethodParameterValues", display_name: "Recon Method Parameter Values", description: "Values of reconstruction parameters (for example, `[21, 3]`).\n", type: "array", items: { type: "number" } }, RecordingDuration: { name: "RecordingDuration", display_name: "Recording Duration", description: "Length of the recording in seconds (for example, `3600`).\n", type: "number", unit: "s" }, RecordingType: { name: "RecordingType", display_name: "Recording Type", description: 'Defines whether the recording is `"continuous"`, `"discontinuous"`, or\n`"epoched"`, where `"epoched"` is limited to time windows about events of\ninterest (for example, stimulus presentations or subject responses).\n', type: "string", enum: ["continuous", "epoched", "discontinuous"] }, ReferencesAndLinks: { name: "ReferencesAndLinks", display_name: "References And Links", description: "List of references to publications that contain information on the dataset.\nA reference may be textual or a\n[URI](SPEC_ROOT/common-principles.md#uniform-resource-indicator).\n", items: { type: "string" }, type: "array" }, RepetitionTime: { name: "RepetitionTime", display_name: "Repetition Time", description: `The time in seconds between the beginning of an acquisition of one volume
and the beginning of acquisition of the volume following it (TR).
When used in the context of functional acquisitions this parameter best
corresponds to
[DICOM Tag 0020, 0110](http://dicomlookup.com/lookup.asp?sw=Tnumber&q=(0020,0110)):
the "time delta between images in a
dynamic of functional set of images" but may also be found in
[DICOM Tag 0018, 0080](http://dicomlookup.com/lookup.asp?sw=Tnumber&q=(0018,0080)):
"the period of time in msec between the beginning
of a pulse sequence and the beginning of the succeeding
(essentially identical) pulse sequence".
This definition includes time between scans (when no data has been acquired)
in case of sparse acquisition schemes.
This value MUST be consistent with the 'pixdim[4]' field (after accounting
for units stored in 'xyzt_units' field) in the NIfTI header.
This field is mutually exclusive with VolumeTiming.
`, type: "number", exclusiveMinimum: 0, unit: "s" }, RepetitionTimeExcitation: { name: "RepetitionTimeExcitation", display_name: "Repetition Time Excitation", description: 'The interval, in seconds, between two successive excitations.\n[DICOM Tag 0018, 0080](http://dicomlookup.com/lookup.asp?sw=Tnumber&q=(0018,0080))\nbest refers to this parameter.\nThis field may be used together with the `"RepetitionTimePreparation"` for\ncertain use cases, such as\n[MP2RAGE](https://doi.org/10.1016/j.neuroimage.2009.10.002).\nUse `RepetitionTimeExcitation` (in combination with\n`"RepetitionTimePreparation"` if needed) for anatomy imaging data rather than\n`"RepetitionTime"` as it is already defined as the amount of time that it takes\nto acquire a single volume in the\n[task imaging data](SPEC_ROOT/modality-specific-files/magnetic-resonance-\\\nimaging-data.md#task-including-resting-state-imaging-data)\nsection.\n', type: "number", minimum: 0, unit: "s" }, RepetitionTimePreparation: { name: "RepetitionTimePreparation", display_name: "Repetition Time Preparation", description: "The interval, in seconds, that it takes a preparation pulse block to\nre-appear at the beginning of the succeeding (essentially identical) pulse\nsequence block.\nThe data type number may apply to files from any MRI modality concerned with\na single value for this field.\nThe data type array provides a value for each volume in a 4D dataset and\nshould only be used when the volume timing is critical for interpretation of\nthe data, such as in\n[ASL](SPEC_ROOT/modality-specific-files/magnetic-resonance-imaging-data.md\\\n#arterial-spin-labeling-perfusion-data).\n", anyOf: [{ type: "number", minimum: 0, unit: "s" }, { type: "array", items: { type: "number", minimum: 0, unit: "s" } }] }, Resolution: { name: "Resolution", display_name: "Resolution", description: "Specifies the interpretation of the resolution keyword.\nIf an object is used, then the keys should be values for the `res` entity\nand values should be descriptions of those `res` values.\n", anyOf: [{ type: "string" }, { type: "object", additionalProperties: { type: "string" } }] }, RotationOrder: { name: "RotationOrder", display_name: "RotationOrder", description: "Specify the sequence in which the elemental 3D extrinsic rotations are applied around the three distinct axes.\n", type: "string", enum: ["XYZ", "XZY", "YXZ", "YZX", "ZXY", "ZYX", "n/a"] }, RotationRule: { name: "RotationRule", display_name: "Rotation Rule", description: 'In case orientation channels are present, indicate whether rotations are applied\nclockwise around an axis when seen from the positive direction (left-hand rule) or\ncounter-clockwise (right-hand rule). Must be one of: "left-hand", "right-hand".\n', type: "string", enum: ["left-hand", "right-hand", "n/a"] }, SEEGChannelCount: { name: "SEEGChannelCount", display_name: "SEEG Channel Count", description: "Number of SEEG channels.\n", type: "integer", minimum: 0 }, SampleEmbedding: { name: "SampleEmbedding", display_name: "Sample Embedding", description: 'Description of the tissue sample embedding (for example: `"Epoxy resin"`).\n', type: "string" }, SampleEnvironment: { name: "SampleEnvironment", display_name: "Sample Environment", description: 'Environment in which the sample was imaged. MUST be one of: `"in vivo"`, `"ex vivo"`\nor `"in vitro"`.\n', type: "string", enum: ["in vivo", "ex vivo", "in vitro"] }, SampleExtractionInstitution: { name: "SampleExtractionInstitution", display_name: "Sample Extraction Institution", description: "The name of the institution in charge of the extraction of the sample,\nif different from the institution in charge of the equipment that produced the image.\n", type: "string" }, SampleExtractionProtocol: { name: "SampleExtractionProtocol", display_name: "Sample Extraction Protocol", description: "Description of the sample extraction protocol or\n[URI](SPEC_ROOT/common-principles.md#uniform-resource-indicator)\n(for example from [protocols.io](https://www.protocols.io/)).\n", type: "string" }, SampleFixation: { name: "SampleFixation", display_name: "Sample Fixation", description: 'Description of the tissue sample fixation\n(for example: `"4% paraformaldehyde, 2% glutaraldehyde"`).\n', type: "string" }, SampleOrigin: { name: "SampleOrigin", display_name: "Sample Origin", description: "Describes from which tissue the genetic information was extracted.\n", type: "string", enum: ["blood", "saliva", "brain", "csf", "breast milk", "bile", "amniotic fluid", "other biospecimen"] }, SamplePrimaryAntibody: { name: "SamplePrimaryAntibody", display_name: "Sample Primary Antibody", description: 'Description(s) of the primary antibody used for immunostaining.\nEither an [RRID](https://scicrunch.org/resources) or the name, supplier and catalog\nnumber of a commercial antibody.\nFor non-commercial antibodies either an [RRID](https://scicrunch.org/resources) or the\nhost-animal and immunogen used (for examples: `"RRID:AB_2122563"` or\n`"Rabbit anti-Human HTR5A Polyclonal Antibody, Invitrogen, Catalog # PA1-2453"`).\nMAY be an array of strings if different antibodies are used in each channel of the file.\n', anyOf: [{ type: "string" }, { type: "array", items: { type: "string" } }] }, SampleSecondaryAntibody: { name: "SampleSecondaryAntibody", display_name: "Sample Secondary Antibody", description: 'Description(s) of the secondary antibody used for immunostaining.\nEither an [RRID](https://scicrunch.org/resources) or the name, supplier and catalog\nnumber of a commercial antibody.\nFor non-commercial antibodies either an [RRID](https://scicrunch.org/resources) or the\nhost-animal and immunogen used (for examples: `"RRID:AB_228322"` or\n`"Goat anti-Mouse IgM Secondary Antibody, Invitrogen, Catalog # 31172"`).\nMAY be an array of strings if different antibodies are used in each channel of the file.\n', anyOf: [{ type: "string" }, { type: "array", items: { type: "string" } }] }, SampleStaining: { name: "SampleStaining", display_name: "Sample Staining", description: 'Description(s) of the tissue sample staining (for example: `"Osmium"`).\nMAY be an array of strings if different stains are used in each channel of the file\n(for example: `["LFB", "PLP"]`).\n', anyOf: [{ type: "string" }, { type: "array", items: { type: "string" } }] }, SamplingFrequency: { name: "SamplingFrequency", display_name: "Sampling Frequency", description: "Sampling frequency (in Hz) of all the data in the recording,\nregardless of their type (for example, `2400`).\n", type: "number", unit: "Hz" }, SamplingFrequencyEffective: { name: "SamplingFrequencyEffective", display_name: "Effective Sampling Frequency", description: "Effective sampling frequency (in Hz) of all the data in the recording,\nregardless of their type (for example, `2400`) which can be determined if timestamps\nper sample are provided.\n", type: "number", unit: "Hz" }, SamplingFrequency__nirs: { name: "SamplingFrequency", display_name: "Sampling Frequency", description: "Sampling frequency (in Hz) of all the data in the recording,\nregardless of their type (for example, `2400`).\n", anyOf: [{ type: "number", unit: "Hz" }, { type: "string", enum: ["n/a"] }] }, ScaleFactor: { name: "ScaleFactor", display_name: "Scale Factor", description: "Scale factor for each frame. This field MUST be defined if the imaging data (`.nii[.gz]`) are scaled.\nIf this field is not defined, then it is assumed that the scaling factor is 1. Defining this field\nwhen the scaling factor is 1 is RECOMMENDED, for the sake of clarity.\n", type: "array", items: { type: "number" } }, ScanDate: { name: "ScanDate", display_name: "Scan Date", description: 'Date of scan in the format `"YYYY-MM-DD[Z]"`.\nThis field is DEPRECATED, and this metadata SHOULD be recorded in the `acq_time` column of the\ncorresponding [Scans file](SPEC_ROOT/modality-agnostic-files.md#scans-file).\n', type: "string", format: "date" }, ScanOptions: { name: "ScanOptions", display_name: "Scan Options", description: "Parameters of ScanningSequence.\nCorresponds to DICOM Tag 0018, 0022 `Scan Options`.\n", anyOf: [{ type: "string" }, { type: "array", items: { type: "string" } }] }, ScanStart: { name: "ScanStart", display_name: "Scan Start", description: "Time of start of scan with respect to `TimeZero` in the default unit seconds.\n", type: "number", unit: "s" }, ScanningSequence: { name: "ScanningSequence", display_name: "Scanning Sequence", description: "Description of the type of data acquired.\nCorresponds to DICOM Tag 0018, 0020 `Scanning Sequence`.\n", anyOf: [{ type: "string" }, { type: "array", items: { type: "string" } }] }, ScatterFraction: { name: "ScatterFraction", display_name: "Scatter Fraction", description: "Scatter fraction for each frame (Units: 0-100%).\n", type: "array", items: { type: "number", minimum: 0, maximum: 100 } }, ScreenDistance: { name: "ScreenDistance", display_name: "Screen Distance", description: "Distance between the participant's eye and the screen. If no screen was used, use `n/a`.\n", anyOf: [{ type: "number", unit: "m" }, { type: "string", enum: ["n/a"] }] }, ScreenRefreshRate: { name: "ScreenRefreshRate", display_name: "Screen Refresh Rate", description: 'Refresh rate of the screen (when used), in Hertz (equivalent to frames per second, "FPS").\n', type: "number", unit: "Hz" }, ScreenResolution: { name: "ScreenResolution", display_name: "Screen Resolution", description: "Screen resolution in pixel\n(for example `[1920, 1200]` for a screen of 1920-width by 1080-height pixels),\nif no screen use `n/a`.\n", anyOf: [{ type: "array", items: { type: "integer", minItems: 2, maxItems: 2 } }, { type: "string", enum: ["n/a"] }] }, ScreenSize: { name: "ScreenSize", display_name: "Screen Size", description: "Screen size in m, excluding potential screen borders\n(for example `[0.472, 0.295]` for a screen of 47.2-width by 29.5-height cm),\nif no screen use `n/a`.\n", anyOf: [{ type: "array", items: { type: "number", unit: "m", minItems: 2, maxItems: 2 } }, { type: "string", enum: ["n/a"] }] }, SequenceName: { name: "SequenceName", display_name: "Sequence Name", description: "Manufacturer's designation of the sequence name.\nCorresponds to DICOM Tag 0018, 0024 `Sequence Name`.\n", type: "string" }, SequenceVariant: { name: "SequenceVariant", display_name: "Sequence Variant", description: "Variant of the ScanningSequence.\nCorresponds to DICOM Tag 0018, 0021 `Sequence Variant`.\n", anyOf: [{ type: "string" }, { type: "array", items: { type: "string" } }] }, ShortChannelCount: { name: "ShortChannelCount", display_name: "Short Channel Count", description: "The number of short channels. 0 indicates no short channels.\n", type: "integer", minimum: 0 }, SinglesRate: { name: "SinglesRate", display_name: "Singles Rate", description: 'Singles rate for each frame (same units as `Units`, for example, `"Bq/mL"`).\n', type: "array", items: { type: "number" } }, SkullStripped: { name: "SkullStripped", display_name: "Skull Stripped", description: "Whether the volume was skull stripped (non-brain voxels set to zero) or not.\n", type: "boolean" }, SliceEncodingDirection: { name: "SliceEncodingDirection", display_name: "Slice Encoding Direction", description: 'The axis of the NIfTI data along which slices were acquired,\nand the direction in which `"SliceTiming"` is defined with respect to.\n`i`, `j`, `k` identifiers correspond to the first, second and third axis of\nthe data in the NIfTI file.\nA `-` sign indicates that the contents of `"SliceTiming"` are defined in\nreverse order - that is, the first entry corresponds to the slice with the\nlargest index, and the final entry corresponds to slice index zero.\nWhen present, the axis defined by `"SliceEncodingDirection"` needs to be\nconsistent with the `slice_dim` field in the NIfTI header.\nWhen absent, the entries in `"SliceTiming"` must be in the order of increasing\nslice index as defined by the NIfTI header.\n', type: "string", enum: ["i", "i-", "j", "j-", "k", "k-"] }, SliceThickness: { name: "SliceThickness", display_name: "Slice Thickness", description: 'Slice thickness of the tissue sample in the unit micrometers (`"um"`) (for example: `5`).\n', type: "number", unit: "um", exclusiveMinimum: 0 }, SliceTiming: { name: "SliceTiming", display_name: "Slice Timing", description: 'The time at which each slice was acquired within each volume (frame) of the\nacquisition.\nSlice timing is not slice order -- rather, it is a list of times containing\nthe time (in seconds) of each slice acquisition in relation to the beginning\nof volume acquisition.\nThe list goes through the slices along the slice axis in the slice encoding\ndimension (see below).\nNote that to ensure the proper interpretation of the `"SliceTiming"` field,\nit is important to check if the OPTIONAL `SliceEncodingDirection` exists.\nIn particular, if `"SliceEncodingDirection"` is negative,\nthe entries in `"SliceTiming"` are defined in reverse order with respect to the\nslice axis, such that the final entry in the `"SliceTiming"` list is the time\nof acquisition of slice 0. Without this parameter slice time correction will\nnot be possible.\n', type: "array", items: { type: "number", minimum: 0, unit: "s" } }, SoftwareFilters: { name: "SoftwareFilters", display_name: "Software Filters", description: '[Object](https://www.json.org/json-en.html)\nof temporal software filters applied, or `"n/a"` if the data is\nnot available.\nEach key-value pair in the JSON object is a name of the filter and an object\nin which its parameters are defined as key-value pairs\n(for example, `{"Anti-aliasing filter":\n{"half-amplitude cutoff (Hz)": 500, "Roll-off": "6dB/Octave"}}`).\n', anyOf: [{ type: "object", additionalProperties: { type: "object" } }, { type: "string", enum: ["n/a"] }] }, SoftwareName: { name: "SoftwareName", display_name: "Software Name", description: "Name of the software that was used to present the stimuli.\n", type: "string" }, SoftwareRRID: { name: "SoftwareRRID", display_name: "SoftwareRRID", description: "[Research Resource Identifier](https://scicrunch.org/resources) of the\nsoftware that was used to present the stimuli.\nExamples: The RRID for Psychtoolbox is 'SCR_002881',\nand that of PsychoPy is 'SCR_006571'.\n", type: "string", format: "rrid" }, SoftwareVersion: { name: "SoftwareVersion", display_name: "Software Version", description: "Version of the software that was used to present the stimuli.\n", type: "string" }, SoftwareVersions: { name: "SoftwareVersions", display_name: "Software Versions", description: "Manufacturer's designation of software version of the equipment that produced\nthe measurements.\n", type: "string" }, SourceDatasets: { name: "SourceDatasets", display_name: "Source Datasets", description: 'Used to specify the locations and relevant attributes of all source datasets.\nValid keys in each object include `"URL"`, `"DOI"` (see\n[URI](SPEC_ROOT/common-principles.md#uniform-resource-indicator)), and\n`"Version"` with\n[string](https://www.w3schools.com/js/js_json_datatypes.asp)\nvalues.\n', type: "array", items: { type: "object", properties: { URL: { type: "string", format: "uri" }, DOI: { type: "string" }, Version: { type: "string" } } } }, Sources: { name: "Sources", display_name: "Sources", description: 'A list of files with the paths specified using\n[BIDS URIs](SPEC_ROOT/common-principles.md#bids-uri);\nthese files were directly used in the creation of this derivative data file.\nFor example, if a derivative A is used in the creation of another\nderivative B, which is in turn used to generate C in a chain of A->B->C,\nC should only list B in `"Sources"`, and B should only list A in `"Sources"`.\nHowever, in case both X and Y are directly used in the creation of Z,\nthen Z should list X and Y in `"Sources"`,\nregardless of whether X was used to generate Y.\nUsing paths specified relative to the dataset root is\n[DEPRECATED](SPEC_ROOT/common-principles.md#definitions).\n', type: "array", items: { type: "string", format: "dataset_relative" } }, SourceType: { name: "SourceType", display_name: "Source Type", description: 'Type of source. Preferably a specific model/part number is supplied.\nThis is a freeform description, but the following keywords are suggested:\n`"LED"`, `"LASER"`, `"VCSEL"`. If individual channels have different SourceType,\nthen the field here should be specified as "mixed"\nand this column should be included in optodes.tsv.\n', type: "string" }, SpatialAxes: { name: "SpatialAxes", display_name: "Spatial axes", description: 'Refers to the coordinate system in which the motion data are to be interpreted,\nif the recorded data can be mapped to a fixed reference frame. A sequence of\ncharacters F/B (forward-backward), L/R (left-right), and U/D (up-down). The\nposition of a character in the sequence determines which of the X,Y,Z axes it\nmaps to. For example, "FRD" for X-forward, Y-right, Z-down. For 1D or 2D cases,\nonly specify the used axes and use the character "_" for unused axes\n("F_R" when the Y axis is not used, for instance).\n', type: "string" }, SpatialReference: { name: "SpatialReference", display_name: "Spatial Reference", description: "For images with a single reference, the value MUST be a single string.\nFor images with multiple references, such as surface and volume references,\na JSON object MUST be used.\n", anyOf: [{ type: "string", enum: ["orig"] }, { type: "string", format: "uri" }, { type: "string", format: "dataset_relative" }, { type: "object", additionalProperties: { anyOf: [{ type: "string", enum: ["orig"] }, { type: "string", format: "uri" }, { type: "string", format: "dataset_relative" }] } }] }, SpecificRadioactivity: { name: "SpecificRadioactivity", display_name: "Specific Radioactivity", description: 'Specific activity of compound injected.\n**Note this is not required for an FDG acquisition, since it is not available,\nand SHOULD be set to `"n/a"`**.\n', anyOf: [{ type: "number" }, { type: "string", enum: ["n/a"] }] }, SpecificRadioactivityMeasTime: { name: "SpecificRadioactivityMeasTime", display_name: "Specific Radioactivity Measurement Time", description: 'Time to which specific radioactivity measurement above applies in the default\nunit `"hh:mm:ss"`.\n', type: "string", format: "time" }, SpecificRadioactivityUnits: { name: "SpecificRadioactivityUnits", display_name: "Specific Radioactivity Units", description: 'Unit format of specified specific radioactivity (for example, `"Bq/g"`).\n**Note this is not required for an FDG acquisition, since it is not available,\nand SHOULD be set to `"n/a"`**.\n', anyOf: [{ type: "string", format: "unit" }, { type: "string", enum: ["n/a"] }] }, SpoilingGradientDuration: { name: "SpoilingGradientDuration", display_name: "Spoiling Gradient Duration", description: "The duration of the spoiler gradient lobe in seconds.\nThe duration of a trapezoidal lobe is defined as the summation of ramp-up\nand plateau times.\n", type: "number", unit: "s" }, SpoilingGradientMoment: { name: "SpoilingGradientMoment", display_name: "Spoiling Gradient Moment", description: "Zeroth moment of the spoiler gradient lobe in\nmillitesla times second per meter (mT.s/m).\n", type: "number", unit: "mT.s/m" }, SpoilingRFPhaseIncrement: { name: "SpoilingRFPhaseIncrement", display_name: "Spoiling RF Phase Increment", description: "The amount of incrementation described in degrees,\nwhich is applied to the phase of the excitation pulse at each TR period for\nachieving RF spoiling.\n", type: "number", unit: "degrees" }, SpoilingState: { name: "SpoilingState", display_name: "Spoiling State", description: "Boolean stating whether the pulse sequence uses any type of spoiling\nstrategy to suppress residual transverse magnetization.\n", type: "boolean" }, SpoilingType: { name: "SpoilingType", display_name: "Spoiling Type", description: "Specifies which spoiling method(s) are used by a spoiled sequence.\n", type: "string", enum: ["RF", "GRADIENT", "COMBINED"] }, StartTime: { name: "StartTime", display_name: "Start Time", description: "Start time in seconds in relation to the start of acquisition of the first\ndata sample in the corresponding (neural) dataset (negative values are allowed).\nThis data MAY be specified with sub-second precision using the syntax `s[.000000]`,\nwhere `s` reflects whole seconds, and `.000000` reflects OPTIONAL fractional seconds.\n", type: "number", unit: "s" }, StationName: { name: "StationName", display_name: "Station Name", description: "Institution defined name of the machine that produced the measurements.\n", type: "string" }, StimulusPresentation: { name: "StimulusPresentation", display_name: "Stimulus Presentation", description: "Object containing key-value pairs related to the software used to present\nthe stimuli during the experiment.\n", type: "object", recommended_fields: ["OperatingSystem", "ScreenDistance", "ScreenRefreshRate", "ScreenResolution", "ScreenSize", "SoftwareName", "SoftwareRRID", "SoftwareVersion", "Code", "HeadStabilization"], properties: { OperatingSystem: { name: "OperatingSystem", display_name: "Operating System", description: "Operating system used to run the stimuli presentation software\n(for formatting recommendations, see examples below this table).\n", type: "string" }, ScreenDistance: { name: "ScreenDistance", display_name: "Screen Distance", description: "Distance between the participant's eye and the screen. If no screen was used, use `n/a`.\n", anyOf: [{ type: "number", unit: "m" }, { type: "string", enum: ["n/a"] }] }, ScreenRefreshRate: { name: "ScreenRefreshRate", display_name: "Screen Refresh Rate", description: 'Refresh rate of the screen (when used), in Hertz (equivalent to frames per second, "FPS").\n', type: "number", unit: "Hz" }, ScreenResolution: { name: "ScreenResolution", display_name: "Screen Resolution", description: "Screen resolution in pixel\n(for example `[1920, 1200]` for a screen of 1920-width by 1080-height pixels),\nif no screen use `n/a`.\n", anyOf: [{ type: "array", items: { type: "integer", minItems: 2, maxItems: 2 } }, { type: "string", enum: ["n/a"] }] }, ScreenSize: { name: "ScreenSize", display_name: "Screen Size", description: "Screen size in m, excluding potential screen borders\n(for example `[0.472, 0.295]` for a screen of 47.2-width by 29.5-height cm),\nif no screen use `n/a`.\n", anyOf: [{ type: "array", items: { type: "number", unit: "m", minItems: 2, maxItems: 2 } }, { type: "string", enum: ["n/a"] }] }, SoftwareName: { name: "SoftwareName", display_name: "Software Name", description: "Name of the software that was used to present the stimuli.\n", type: "string" }, SoftwareRRID: { name: "SoftwareRRID", display_name: "SoftwareRRID", description: "[Research Resource Identifier](https://scicrunch.org/resources) of the\nsoftware that was used to present the stimuli.\nExamples: The RRID for Psychtoolbox is 'SCR_002881',\nand that of PsychoPy is 'SCR_006571'.\n", type: "string", format: "rrid" }, SoftwareVersion: { name: "SoftwareVersion", display_name: "Software Version", description: "Version of the software that was used to present the stimuli.\n", type: "string" }, Code: { name: "Code", display_name: "Code", description: "[URI](SPEC_ROOT/common-principles.md#uniform-resource-indicator)\nof the code used to present the stimuli.\nPersistent identifiers such as DOIs are preferred.\nIf multiple versions of code may be hosted at the same location,\nrevision-specific URIs are recommended.\n", type: "string", format: "uri" } } }, SubjectArtefactDescription: { name: "SubjectArtefactDescription", display_name: "Subject Artifact Description", description: 'Freeform description of the observed subject artifact and its possible cause\n(for example, `"Vagus Nerve Stimulator"`, `"non-removable implant"`).\nIf this field is set to `"n/a"`, it will be interpreted as absence of major\nsource of artifacts except cardiac and blinks.\n', type: "string" }, TaskDescription: { name: "TaskDescription", display_name: "Task Description", description: "Longer description of the task.\n", type: "string" }, TaskName: { name: "TaskName", display_name: "Task Name", description: 'Name of the task.\nNo two tasks should have the same name.\nThe task label included in the filename is derived from this `"TaskName"` field\nby removing all non-alphanumeric characters (that is, all except those matching `[0-9a-zA-Z]`).\nFor example `"TaskName"` `"faces n-back"` or `"head nodding"` will correspond to task labels\n`facesnback` and `headnodding`, respectively.\n', type: "string" }, TermURL: { name: "TermURL", display_name: "TermURL", description: 'URL pointing to a formal definition of this type of data in an ontology available on the web.\nFor example: https://www.ncbi.nlm.nih.gov/mesh/68008297 for "male".\n', type: "string", format: "uri" }, TimeZero: { name: "TimeZero", display_name: "Time Zero", description: 'Time zero to which all scan and/or blood measurements have been adjusted to,\nin the unit "hh:mm:ss".\nThis should be equal to `"InjectionStart"` or `"ScanStart"`.\n', type: "string", format: "time" }, TissueDeformationScaling: { name: "TissueDeformationScaling", display_name: "Tissue Deformation Scaling", description: "Estimated deformation of the tissue, given as a percentage of the original\ntissue size (for examples: for a shrinkage of 3%, the value is `97`;\nand for an expansion of 100%, the value is `200`).\n", type: "number", exclusiveMinimum: 0 }, TissueOrigin: { name: "TissueOrigin", display_name: "Tissue Origin", description: 'Describes the type of tissue analyzed for `"SampleOrigin"` `brain`.\n', type: "string", enum: ["gray matter", "white matter", "csf", "meninges", "macrovascular", "microvascular"] }, TotalAcquiredPairs: { name: "TotalAcquiredPairs", display_name: "Total Acquired Pairs", description: "The total number of acquired `control`-`label` pairs.\nA single pair consists of a single `control` and a single `label` image.\n", type: "number", exclusiveMinimum: 0 }, TotalReadoutTime: { name: "TotalReadoutTime", display_name: "Total Readout Time", description: 'This is actually the "effective" total readout time,\ndefined as the readout duration, specified in seconds,\nthat would have generated data with the given level of distortion.\nIt is NOT the actual, physical duration of the readout train.\nIf `"EffectiveEchoSpacing"` has been properly computed,\nit is just `EffectiveEchoSpacing * (ReconMatrixPE - 1)`.\n', type: "number", unit: "s" }, TracerMolecularWeight: { name: "TracerMolecularWeight", display_name: "Tracer Molecular Weight", description: "Accurate molecular weight of the tracer used.\n", type: "number" }, TracerMolecularWeightUnits: { name: "TracerMolecularWeightUnits", display_name: "Tracer Molecular Weight Units", description: 'Unit of the molecular weights measurement (for example, `"g/mol"`).\n', type: "string", format: "unit" }, TracerName: { name: "TracerName", display_name: "Tracer Name", description: 'Name of the tracer compound used (for example, `"CIMBI-36"`)\n', type: "string" }, TracerRadLex: { name: "TracerRadLex", display_name: "Tracer Rad Lex", description: "ID of the tracer compound from the RadLex Ontology.\n", type: "string" }, TracerRadionuclide: { name: "TracerRadionuclide", display_name: "Tracer Radionuclide", description: 'Radioisotope labeling tracer (for example, `"C11"`).\n', type: "string" }, TracerSNOMED: { name: "TracerSNOMED", display_name: "TracerSNOMED", description: "ID of the tracer compound from the SNOMED Ontology\n(subclass of Radioactive isotope).\n", type: "string" }, TubingLength: { name: "TubingLength", display_name: "Tubing Length", description: "The length of the blood tubing, from the subject to the detector in meters.\n", type: "number", unit: "m" }, TriggerChannelCount: { name: "TriggerChannelCount", display_name: "Trigger Channel Count", description: "Number of channels for digital (binary TTL) triggers or analog equivalents (TTL in volt).\nCorresponds to the `TRIG` channel type.\n", type: "integer", minimum: 0 }, TrackedPointsCount: { name: "TrackedPointsCount", display_name: "Tracked Points Count", description: "Number of different tracked points tracked in a motion tracking system.\n", type: "number", unit: "m" }, TrackingSystemName: { name: "TrackingSystemName", display_name: "Tracking System Name", description: 'A human-readable name of the tracking system to complement `"tracksys"` label\nof the corresponding *_motion.tsv filename.\n', type: "string" }, TubingType: { name: "TubingType", display_name: "Tubing Type", description: "Description of the type of tubing used, ideally including the material and\n(internal) diameter.\n", type: "string" }, Type: { name: "Type", display_name: "Type", description: 'Short identifier of the mask.\nThe value `"Brain"` refers to a brain mask.\nThe value `"Lesion"` refers to a lesion mask.\nThe value `"Face"` refers to a face mask.\nThe value `"ROI"` refers to a region of interest mask.\n', type: "string", enum: ["Brain", "Lesion", "Face", "ROI"] }, Units: { name: "Units", display_name: "Units", description: "Measurement units for the associated file.\nSI units in CMIXF formatting are RECOMMENDED\n(see [Units](SPEC_ROOT/common-principles.md#units)).\n", type: "string", format: "unit" }, VascularCrushing: { name: "VascularCrushing", display_name: "Vascular Crushing", description: "Boolean indicating if Vascular Crushing is used.\nCorresponds to DICOM Tag 0018, 9259 `ASL Crusher Flag`.\n", type: "boolean" }, VascularCrushingVENC: { name: "VascularCrushingVENC", display_name: "Vascular Crushing VENC", description: "The crusher gradient strength, in centimeters per second.\nSpecify either one number for the total time-series, or provide an array of\nnumbers, for example when using QUASAR, using the value zero to identify\nvolumes for which `VascularCrushing` was turned off.\nCorresponds to DICOM Tag 0018, 925A `ASL Crusher Flow Limit`.\n", anyOf: [{ type: "number", unit: "cm/s" }, { type: "array", items: { type: "number", unit: "cm/s" } }] }, VELChannelCount: { name: "VELChannelCount", display_name: "Velocity Channel Count", description: "Number of linear velocity channels.\n", type: "integer", minimum: 0 }, VisionCorrection: { name: "VisionCorrection", display_name: "Vision correction", description: 'Equipment used to correct participant vision during an experiment.\nExample: "spectacles", "lenses", "none".\n', type: "string" }, VolumeTiming: { name: "VolumeTiming", display_name: "Volume Timing", description: 'The time at which each volume was acquired during the acquisition.\nIt is described using a list of times referring to the onset of each volume\nin the BOLD series.\nThe list must have the same length as the BOLD series,\nand the values must be non-negative and monotonically increasing.\nThis field is mutually exclusive with `"RepetitionTime"` and `"DelayTime"`.\nIf defined, this requires acquisition time (TA) be defined via either\n`"SliceTiming"` or `"AcquisitionDuration"` be defined.\n', type: "array", minItems: 1, items: { type: "number", unit: "s" } }, WholeBloodAvail: { name: "WholeBloodAvail", display_name: "Whole Blood Avail", description: "Boolean that specifies if whole blood measurements are available.\nIf `true`, the `whole_blood_radioactivity` column MUST be present in the\ncorresponding `*_blood.tsv` file.\n", type: "boolean" }, WithdrawalRate: { name: "WithdrawalRate", display_name: "Withdrawal Rate", description: 'The rate at which the blood was withdrawn from the subject.\nThe unit of the specified withdrawal rate should be in `"mL/s"`.\n', type: "number", unit: "mL/s" }, iEEGCoordinateProcessingDescription: { name: "iEEGCoordinateProcessingDescription", display_name: "iEEG Coordinate Processing Description", description: 'Has any post-processing (such as projection) been done on the electrode\npositions (for example, `"surface_projection"`, `"none"`).\n', type: "string" }, iEEGCoordinateProcessingReference: { name: "iEEGCoordinateProcessingReference", display_name: "iEEG Coordinate Processing Reference", description: "A reference to a paper that defines in more detail the method used to\nlocalize the electrodes and to post-process the electrode positions.\n", type: "string" }, iEEGCoordinateSystem: { name: "iEEGCoordinateSystem", display_name: "iEEG Coordinate System", description: 'Defines the coordinate system for the iEEG sensors.\nSee the\n[Coordinate Systems Appendix](SPEC_ROOT/appendices/coordinate-systems.md)\nfor a list of restricted keywords for coordinate systems.\nIf `"Other"`, provide definition of the coordinate system in\n`iEEGCoordinateSystemDescription`.\nIf positions correspond to pixel indices in a 2D image\n(of either a volume-rendering, surface-rendering, operative photo, or\noperative drawing), this MUST be `"Pixels"`.\nFor more information, see the section on\n[2D coordinate systems](SPEC_ROOT/modality-specific-files/intracranial\\\n-electroencephalography.md#allowed-2d-coordinate-systems).\n', type: "string", enum: ["Pixels", "ACPC", "ScanRAS", "Other", "ICBM452AirSpace", "ICBM452Warp5Space", "IXI549Space", "fsaverage", "fsaverageSym", "fsLR", "MNIColin27", "MNI152Lin", "MNI152NLin2009aSym", "MNI152NLin2009bSym", "MNI152NLin2009cSym", "MNI152NLin2009aAsym", "MNI152NLin2009bAsym", "MNI152NLin2009cAsym", "MNI152NLin6Sym", "MNI152NLin6ASym", "MNI305", "NIHPD", "OASIS30AntsOASISAnts", "OASIS30Atropos", "Talairach", "UNCInfant", "fsaverage3", "fsaverage4", "fsaverage5", "fsaverage6", "fsaveragesym", "UNCInfant0V21", "UNCInfant1V21", "UNCInfant2V21", "UNCInfant0V22", "UNCInfant1V22", "UNCInfant2V22", "UNCInfant0V23", "UNCInfant1V23", "UNCInfant2V23"] }, iEEGCoordinateSystemDescription: { name: "iEEGCoordinateSystemDescription", display_name: "iEEG Coordinate System Description", description: "Free-form text description of the coordinate system.\nMay also include a link to a documentation page or paper describing the\nsystem in greater detail.\n", type: "string" }, iEEGCoordinateUnits: { name: "iEEGCoordinateUnits", display_name: "iEEG Coordinate Units", description: 'Units of the `*_electrodes.tsv`.\nMUST be `"pixels"` if `iEEGCoordinateSystem` is `Pixels`.\n', type: "string", enum: ["m", "mm", "cm", "pixels", "n/a"] }, iEEGElectrodeGroups: { name: "iEEGElectrodeGroups", display_name: "iEEG Electrode Groups", description: 'Field to describe the way electrodes are grouped into strips, grids or depth\nprobes.\nFor example, `"grid1: 10x8 grid on left temporal pole, strip2: 1x8 electrode\nstrip on xxx"`.\n', type: "string" }, iEEGGround: { name: "iEEGGround", display_name: "iEEG Ground", description: 'Description of the location of the ground electrode\n(`"placed on right mastoid (M2)"`).\n', type: "string" }, iEEGPlacementScheme: { name: "iEEGPlacementScheme", display_name: "iEEG Placement Scheme", description: 'Freeform description of the placement of the iEEG electrodes.\nLeft/right/bilateral/depth/surface\n(for example, `"left frontal grid and bilateral hippocampal depth"` or\n`"surface strip and STN depth"` or\n`"clinical indication bitemporal, bilateral temporal strips and left grid"`).\n', type: "string" }, iEEGReference: { name: "iEEGReference", display_name: "iEEG Reference", description: 'General description of the reference scheme used and (when applicable) of\nlocation of the reference electrode in the raw recordings\n(for example, `"left mastoid"`, `"bipolar"`,\n`"T01"` for electrode with name T01,\n`"intracranial electrode on top of a grid, not included with data"`,\n`"upside down electrode"`).\nIf different channels have a different reference,\nthis field should have a general description and the channel specific\nreference should be defined in the `channels.tsv` file.\n', type: "string" } }, modalities: { mri: { display_name: "Magnetic Resonance Imaging", description: "Data acquired with an MRI scanner.\n" }, eeg: { display_name: "Electroencephalography", description: "Data acquired with EEG.\n" }, ieeg: { display_name: "Intracranial Electroencephalography", description: "Data acquired with iEEG.\n" }, meg: { display_name: "Magnetoencephalography", description: "Data acquired with an MEG scanner.\n" }, beh: { display_name: "Behavioral experiments", description: "Behavioral data acquired without accompanying neuroimaging data.\n" }, pet: { display_name: "Positron Emission Tomography", description: "Data acquired with PET.\n" }, micr: { display_name: "Microscopy", description: "Data acquired with a microscope.\n" }, motion: { display_name: "Motion", description: "Data acquired with Motion-Capture systems.\n" }, nirs: { display_name: "Near-Infrared Spectroscopy", description: "Data acquired with NIRS." } }, suffixes: { TwoPE: { value: "2PE", display_name: "2-photon excitation microscopy", description: "2-photon excitation microscopy imaging data\n" }, BF: { value: "BF", display_name: "Bright-field microscopy", description: "Bright-field microscopy imaging data\n" }, Chimap: { value: "Chimap", display_name: "Quantitative susceptibility map (QSM)", description: "In parts per million (ppm).\nQSM allows for determining the underlying magnetic susceptibility of tissue\n(Chi)\n([Wang & Liu, 2014](https://doi.org/10.1002/mrm.25358)).\nChi maps are REQUIRED to use this suffix regardless of the method used to\ngenerate them.\n", unit: "ppm" }, CARS: { value: "CARS", display_name: "Coherent anti-Stokes Raman spectroscopy", description: "Coherent anti-Stokes Raman spectroscopy imaging data\n" }, CONF: { value: "CONF", display_name: "Confocal microscopy", description: "Confocal microscopy imaging data\n" }, DIC: { value: "DIC", display_name: "Differential interference contrast microscopy", description: "Differential interference contrast microscopy imaging data\n" }, DF: { value: "DF", display_name: "Dark-field microscopy", description: "Dark-field microscopy imaging data\n" }, FLAIR: { value: "FLAIR", display_name: "Fluid attenuated inversion recovery image", description: "In arbitrary units (arbitrary).\nStructural images with predominant T2 contribution (also known as T2-FLAIR),\nin which signal from fluids (for example, CSF) is nulled out by adjusting\ninversion time, coupled with notably long repetition and echo times.\n", unit: "arbitrary" }, FLASH: { value: "FLASH", display_name: "Fast-Low-Angle-Shot image", description: "FLASH (Fast-Low-Angle-Shot) is a vendor-specific implementation for spoiled\ngradient echo acquisition.\nIt is commonly used for rapid anatomical imaging and also for many different\nqMRI applications.\nWhen used for a single file, it does not convey any information about the\nimage contrast.\nWhen used in a file collection, it may result in conflicts across filenames of\ndifferent applications.\n**Change:** Removed from suffixes.\n" }, FLUO: { value: "FLUO", display_name: "Fluorescence microscopy", description: "Fluorescence microscopy imaging data\n" }, IRT1: { value: "IRT1", display_name: "Inversion recovery T1 mapping", description: "The IRT1 method involves multiple inversion recovery spin-echo images\nacquired at different inversion times\n([Barral et al. 2010](https://doi.org/10.1002/mrm.22497)).\n" }, M0map: { value: "M0map", display_name: "Equilibrium magnetization (M0) map", description: "In arbitrary units (arbitrary).\nA common quantitative MRI (qMRI) fitting variable that represents the amount\nof magnetization at thermal equilibrium.\nM0 maps are RECOMMENDED to use this suffix if generated by qMRI applications\n(for example, variable flip angle T1 mapping).\n", unit: "arbitrary" }, MEGRE: { value: "MEGRE", display_name: "Multi-echo Gradient Recalled Echo", description: "Anatomical gradient echo images acquired at different echo times.\nPlease note that this suffix is not intended for the logical grouping of\nimages acquired using an Echo Planar Imaging (EPI) readout.\n" }, MESE: { value: "MESE", display_name: "Multi-echo Spin Echo", description: "The MESE method involves multiple spin echo images acquired at different echo\ntimes and is primarily used for T2 mapping.\nPlease note that this suffix is not intended for the logical grouping of\nimages acquired using an Echo Planar Imaging (EPI) readout.\n" }, MP2RAGE: { value: "MP2RAGE", display_name: "Magnetization Prepared Two Gradient Echoes", description: "The MP2RAGE method is a special protocol that collects several images at\ndifferent flip angles and inversion times to create a parametric T1map by\ncombining the magnitude and phase images\n([Marques et al. 2010](https://doi.org/10.1016/j.neuroimage.2009.10.002)).\n" }, MPE: { value: "MPE", display_name: "Multi-photon excitation microscopy", description: "Multi-photon excitation microscopy imaging data\n" }, MPM: { value: "MPM", display_name: "Multi-parametric Mapping", description: "The MPM approaches (a.k.a hMRI) involves the acquisition of highly-similar\nanatomical images that differ in terms of application of a magnetization\ntransfer RF pulse (MTon or MToff), flip angle and (optionally) echo time and\nmagnitue/phase parts\n([Weiskopf et al. 2013](https://doi.org/10.3389/fnins.2013.00095)).\nSee [here](https://owncloud.gwdg.de/index.php/s/iv2TOQwGy4FGDDZ) for\nsuggested MPM acquisition protocols.\n" }, MTR: { value: "MTR", display_name: "Magnetization Transfer Ratio", description: "This method is to calculate a semi-quantitative magnetization transfer ratio\nmap.\n" }, MTRmap: { value: "MTRmap", display_name: "Magnetization transfer ratio image", description: "In arbitrary units (arbitrary).\nMTR maps are REQUIRED to use this suffix regardless of the method used to\ngenerate them.\nMTRmap intensity values are RECOMMENDED to be represented in percentage in\nthe range of 0-100%.\n", unit: "arbitrary", minValue: 0, maxValue: 100 }, MTS: { value: "MTS", display_name: "Magnetization transfer saturation", description: "This method is to calculate a semi-quantitative magnetization transfer\nsaturation index map.\nThe MTS method involves three sets of anatomical images that differ in terms\nof application of a magnetization transfer RF pulse (MTon or MToff) and flip\nangle ([Helms et al. 2008](https://doi.org/10.1002/mrm.21732)).\n" }, MTVmap: { value: "MTVmap", display_name: "Macromolecular tissue volume (MTV) image", description: "In arbitrary units (arbitrary).\nMTV maps are REQUIRED to use this suffix regardless of the method used to\ngenerate them.\n", unit: "arbitrary" }, MTsat: { value: "MTsat", display_name: "Magnetization transfer saturation image", description: "In arbitrary units (arbitrary).\nMTsat maps are REQUIRED to use this suffix regardless of the method used to\ngenerate them.\n", unit: "arbitrary" }, MWFmap: { value: "MWFmap", display_name: "Myelin water fraction image", description: "In arbitrary units (arbitrary).\nMWF maps are REQUIRED to use this suffix regardless of the method used to\ngenerate them.\nMWF intensity values are RECOMMENDED to be represented in percentage in the\nrange of 0-100%.\n", unit: "arbitrary", minValue: 0, maxValue: 100 }, NLO: { value: "NLO", display_name: "Nonlinear optical microscopy", description: "Nonlinear optical microscopy imaging data\n" }, OCT: { value: "OCT", display_name: "Optical coherence tomography", description: "Optical coherence tomography imaging data\n" }, PC: { value: "PC", display_name: "Phase-contrast microscopy", description: "Phase-contrast microscopy imaging data\n" }, PD: { value: "PD", display_name: "Proton density image", description: "Ambiguous, may refer to a parametric image or to a conventional image.\n**Change:** Replaced by `PDw` or `PDmap`.\n", unit: "arbitrary" }, PDT2: { value: "PDT2", display_name: "PD and T2 weighted image", description: "In arbitrary units (arbitrary).\nA two-volume 4D image, where the volumes are, respectively, PDw and T2w\nimages acquired simultaneously.\nIf separated into 3D volumes, the `PDw` and `T2w` suffixes SHOULD be used instead,\nand an acquisition entity MAY be used to distinguish the images from others with\nthe same suffix, for example, `acq-PDT2_PDw.nii` and `acq-PDT2_T2w.nii`.\n", unit: "arbitrary" }, PDmap: { value: "PDmap", display_name: "Proton density image", description: "In arbitrary units (arbitrary).\nPD maps are REQUIRED to use this suffix regardless of the method used to\ngenerate them.\n", unit: "arbitrary" }, PDw: { value: "PDw", display_name: "Proton density (PD) weighted image", description: "In arbitrary units (arbitrary).\nThe contrast of these images is mainly determined by spatial variations in\nthe spin density (1H) of the imaged specimen.\nIn spin-echo sequences this contrast is achieved at short repetition and long\necho times.\nIn a gradient-echo acquisition, PD weighting dominates the contrast at long\nrepetition and short echo times, and at small flip angles.\n", unit: "arbitrary" }, PLI: { value: "PLI", display_name: "Polarized-light microscopy", description: "Polarized-light microscopy imaging data\n" }, R1map: { value: "R1map", display_name: "Longitudinal relaxation rate image", description: "In seconds<sup>-1</sup> (1/s).\nR1 maps (R1 = 1/T1) are REQUIRED to use this suffix regardless of the method\nused to generate them.\n", unit: "1/s" }, R2map: { value: "R2map", display_name: "True transverse relaxation rate image", description: "In seconds<sup>-1</sup> (1/s).\nR2 maps (R2 = 1/T2) are REQUIRED to use this suffix regardless of the method\nused to generate them.\n", unit: "1/s" }, R2starmap: { value: "R2starmap", display_name: "Observed transverse relaxation rate image", description: "In seconds<sup>-1</sup> (1/s).\nR2-star maps (R2star = 1/T2star) are REQUIRED to use this suffix regardless\nof the method used to generate them.\n", unit: "1/s" }, RB1COR: { value: "RB1COR", display_name: "RB1COR", description: "Low resolution images acquired by the body coil\n(in the gantry of the scanner) and the head coil using identical acquisition\nparameters to generate a combined sensitivity map as described in\n[Papp et al. (2016)](https://doi.org/10.1002/mrm.26058).\n" }, RB1map: { value: "RB1map", display_name: "RF receive sensitivity map", description: "In arbitrary units (arbitrary).\nRadio frequency (RF) receive (B1-) sensitivity maps are REQUIRED to use this\nsuffix regardless of the method used to generate them.\nRB1map intensity values are RECOMMENDED to be represented as percent\nmultiplicative factors such that Amplitude<sub>effective</sub> =\nB1-<sub>intensity</sub>\\*Amplitude<sub>ideal</sub>.\n", unit: "arbitrary" }, S0map: { value: "S0map", display_name: "Observed signal amplitude (S0) image", description: "In arbitrary units (arbitrary).\nFor a multi-echo (typically fMRI) sequence, S0 maps index the baseline signal\nbefore exponential (T2-star) signal decay.\nIn other words: the exponential of the intercept for a linear decay model\nacross log-transformed echos. For more information, please see, for example,\n[the tedana documentation](https://tedana.readthedocs.io/en/latest/\\\napproach.html#monoexponential-decay-model-fit).\nS0 maps are RECOMMENDED to use this suffix if derived from an ME-FMRI dataset.\n" }, SEM: { value: "SEM", display_name: "Scanning electron microscopy", description: "Scanning electron microscopy imaging data\n" }, SPIM: { value: "SPIM", display_name: "Selective plane illumination microscopy", description: "Selective plane illumination microscopy imaging data\n" }, SR: { value: "SR", display_name: "Super-resolution microscopy", description: "Super-resolution microscopy imaging data\n" }, T1map: { value: "T1map", display_name: "Longitudinal relaxation time image", description: "In seconds (s).\nT1 maps are REQUIRED to use this suffix regardless of the method used to\ngenerate them.\nSee [this interactive book on T1 mapping](https://qmrlab.org/t1_book/intro)\nfor further reading on T1-mapping.\n", unit: "s" }, T1rho: { value: "T1rho", display_name: "T1 in rotating frame (T1 rho) image", description: "In seconds (s).\nT1-rho maps are REQUIRED to use this suffix regardless of the method used to\ngenerate them.\n", unit: "s" }, T1w: { value: "T1w", display_name: "T1-weighted image", description: "In arbitrary units (arbitrary).\nThe contrast of these images is mainly determined by spatial variations in\nthe longitudinal relaxation time of the imaged specimen.\nIn spin-echo sequences this contrast is achieved at relatively short\nrepetition and echo times.\nTo achieve this weighting in gradient-echo images, again, short repetition\nand echo times are selected; however, at relatively large flip angles.\nAnother common approach to increase T1 weighting in gradient-echo images is\nto add an inversion preparation block to the beginning of the imaging\nsequence (for example, `TurboFLASH` or `MP-RAGE`).\n", unit: "arbitrary" }, T2map: { value: "T2map", display_name: "True transverse relaxation time image", description: "In seconds (s).\nT2 maps are REQUIRED to use this suffix regardless of the method used to\ngenerate them.\n", unit: "s" }, T2star: { value: "T2star", display_name: "T2\\* image", description: "Ambiguous, may refer to a parametric image or to a conventional image.\n**Change:** Replaced by `T2starw` or `T2starmap`.\n", anyOf: [{ unit: "arbitrary" }, { unit: "s" }] }, T2starmap: { value: "T2starmap", display_name: "Observed transverse relaxation time image", description: "In seconds (s).\nT2-star maps are REQUIRED to use this suffix regardless of the method used to\ngenerate them.\n", unit: "s" }, T2starw: { value: "T2starw", display_name: "T2star weighted image", description: "In arbitrary units (arbitrary).\nThe contrast of these images is mainly determined by spatial variations in\nthe (observed) transverse relaxation time of the imaged specimen.\nIn spin-echo sequences, this effect is negated as the excitation is followed\nby an inversion pulse.\nThe contrast of gradient-echo images natively depends on T2-star effects.\nHowever, for T2-star variation to dominate the image contrast,\ngradient-echo acquisitions are carried out at long repetition and echo times,\nand at small flip angles.\n", unit: "arbitrary" }, T2w: { value: "T2w", display_name: "T2-weighted image", description: "In arbitrary units (arbitrary).\nThe contrast of these images is mainly determined by spatial variations in\nthe (true) transverse relaxation time of the imaged specimen.\nIn spin-echo sequences this contrast is achieved at relatively long\nrepetition and echo times.\nGenerally, gradient echo sequences are not the most suitable option for\nachieving T2 weighting, as their contrast natively depends on T2-star rather\nthan on T2.\n", unit: "arbitrary" }, TB1AFI: { value: "TB1AFI", display_name: "TB1AFI", description: "This method ([Yarnykh 2007](https://doi.org/10.1002/mrm.21120))\ncalculates a B1<sup>+</sup> map from two images acquired at interleaved (two)\nTRs with identical RF pulses using a steady-state sequence.\n" }, TB1DAM: { value: "TB1DAM", display_name: "TB1DAM", description: "The double-angle B1<sup>+</sup> method\n([Insko and Bolinger 1993](https://doi.org/10.1006/jmra.1993.1133)) is based\non the calculation of the actual angles from signal ratios,\ncollected by two acquisitions at different nominal excitation flip angles.\nCommon sequence types for this application include spin echo and echo planar\nimaging.\n" }, TB1EPI: { value: "TB1EPI", display_name: "TB1EPI", description: "This B1<sup>+</sup> mapping method\n([Jiru and Klose 2006](https://doi.org/10.1002/mrm.21083)) is based on two\nEPI readouts to acquire spin echo (SE) and stimulated echo (STE) images at\nmultiple flip angles in one sequence, used in the calculation of deviations\nfrom the nominal flip angle.\n" }, TB1RFM: { value: "TB1RFM", display_name: "TB1RFM", description: "The result of a Siemens `rf_map` product sequence.\nThis sequence produces two images.\nThe first image appears like an anatomical image and the second output is a\nscaled flip angle map.\n" }, TB1SRGE: { value: "TB1SRGE", display_name: "TB1SRGE", description: "Saturation-prepared with 2 rapid gradient echoes (SA2RAGE) uses a ratio of\ntwo saturation recovery images with different time delays,\nand a simulated look-up table to estimate B1+\n([Eggenschwiler et al. 2011](https://doi.org/10.1002/mrm.23145)).\nThis sequence can also be used in conjunction with MP2RAGE T1 mapping to\niteratively improve B1+ and T1 map estimation\n([Marques & Gruetter 2013](https://doi.org/10.1371/journal.pone.0069294)).\n" }, TB1TFL: { value: "TB1TFL", display_name: "TB1TFL", description: "The result of a Siemens `tfl_b1_map` product sequence.\nThis sequence produces two images.\nThe first image appears like an anatomical image and the second output is a\nscaled flip angle map.\n" }, TB1map: { value: "TB1map", display_name: "RF transmit field image", description: "In arbitrary units (arbitrary).\nRadio frequency (RF) transmit (B1+) field maps are REQUIRED to use this\nsuffix regardless of the method used to generate them.\nTB1map intensity values are RECOMMENDED to be represented as percent\nmultiplicative factors such that FlipAngle<sub>effective</sub> =\nB1+<sub>intensity</sub>\\*FlipAngle<sub>nominal</sub> .\n", unit: "arbitrary" }, TEM: { value: "TEM", display_name: "Transmission electron microscopy", description: "Transmission electron microscopy imaging data\n" }, UNIT1: { value: "UNIT1", display_name: "Homogeneous (flat) T1-weighted MP2RAGE image", description: "In arbitrary units (arbitrary).\nUNIT1 images are REQUIRED to use this suffix regardless of the method used to\ngenerate them.\nNote that although this image is T1-weighted, regions without MR signal will\ncontain white salt-and-pepper noise that most segmentation algorithms will\nfail on.\nTherefore, it is important to dissociate it from `T1w`.\nPlease see [`MP2RAGE` specific notes](SPEC_ROOT/appendices/qmri.md#unit1-images)\nin the qMRI appendix for further information.\n" }, VFA: { value: "VFA", display_name: "Variable flip angle", description: "The VFA method involves at least two spoiled gradient echo (SPGR) of\nsteady-state free precession (SSFP) images acquired at different flip angles.\nDepending on the provided metadata fields and the sequence type,\ndata may be eligible for DESPOT1, DESPOT2 and their variants\n([Deoni et al. 2005](https://doi.org/10.1002/mrm.20314)).\n" }, angio: { value: "angio", display_name: "Angiogram", description: "Magnetic resonance angiography sequences focus on enhancing the contrast of\nblood vessels (generally arteries, but sometimes veins) against other tissue\ntypes.\n" }, asl: { value: "asl", display_name: "Arterial Spin Labeling", description: "The complete ASL time series stored as a 4D NIfTI file in the original\nacquisition order, with possible volume types including: control, label,\nm0scan, deltam, cbf.\n" }, aslcontext: { value: "aslcontext", display_name: "Arterial Spin Labeling Context", description: "A TSV file defining the image types for volumes in an associated ASL file.\n" }, asllabeling: { value: "asllabeling", display_name: "ASL Labeling Screenshot", description: "An anonymized screenshot of the planning of the labeling slab/plane\nwith respect to the imaging slab or slices.\nThis screenshot is based on DICOM macro C.8.13.5.14.\n" }, beh: { value: "beh", display_name: "Behavioral recording", description: 'Behavioral recordings from tasks.\nThese files are similar to events files, but do not include the `"onset"` and\n`"duration"` columns that are mandatory for events files.\n' }, blood: { value: "blood", display_name: "Blood recording data", description: "Blood measurements of radioactivity stored in\n[tabular files](SPEC_ROOT/common-principles.md#tabular-files)\nand located in the `pet/` directory along with the corresponding PET data.\n" }, bold: { value: "bold", display_name: "Blood-Oxygen-Level Dependent image", description: "Blood-Oxygen-Level Dependent contrast (specialized T2\\* weighting)\n" }, cbv: { value: "cbv", display_name: "Cerebral blood volume image", description: "Cerebral Blood Volume contrast (specialized T2\\* weighting or difference between T1 weighted images)\n" }, channels: { value: "channels", display_name: "Channels File", description: "Channel information.\n" }, coordsystem: { value: "coordsystem", display_name: "Coordinate System File", description: "A JSON document specifying the coordinate system(s) used for the MEG, EEG,\nhead localization coils, and anatomical landmarks.\n" }, defacemask: { value: "defacemask", display_name: "Defacing Mask", description: "A binary mask that was used to remove facial features from an anatomical MRI\nimage.\n" }, dseg: { value: "dseg", display_name: "Discrete Segmentation", description: "A discrete segmentation.\n\nThis suffix may only be used in derivative datasets.\n" }, dwi: { value: "dwi", display_name: "Diffusion-weighted image", description: "Diffusion-weighted imaging contrast (specialized T2 weighting).\n" }, eeg: { value: "eeg", display_name: "Electroencephalography", description: "Electroencephalography recording data.\n" }, electrodes: { value: "electrodes", display_name: "Electrodes", description: "File that gives the location of (i)EEG electrodes.\n" }, epi: { value: "epi", display_name: "EPI", description: "The phase-encoding polarity (PEpolar) technique combines two or more Spin Echo\nEPI scans with different phase encoding directions to estimate the underlying\ninhomogeneity/deformation map.\n" }, events: { value: "events", display_name: "Events", description: "Event timing information from a behavioral task.\n" }, fieldmap: { value: "fieldmap", display_name: "Fieldmap", description: "Some MR schemes such as spiral-echo imaging (SEI) sequences are able to\ndirectly provide maps of the *B<sub>0</sub>* field inhomogeneity.\n" }, headshape: { value: "headshape", display_name: "Headshape File", description: "The 3-D locations of points that describe the head shape and/or electrode\nlocations can be digitized and stored in separate files.\n" }, ieeg: { value: "ieeg", display_name: "Intracranial Electroencephalography", description: "Intracranial electroencephalography recording data.\n" }, inplaneT1: { value: "inplaneT1", display_name: "Inplane T1", description: "In arbitrary units (arbitrary).\nT1 weighted structural image matched to a functional (task) image.\n", unit: "arbitrary" }, inplaneT2: { value: "inplaneT2", display_name: "Inplane T2", description: "In arbitrary units (arbitrary).\nT2 weighted structural image matched to a functional (task) image.\n", unit: "arbitrary" }, m0scan: { value: "m0scan", display_name: "M0 image", description: "The M0 image is a calibration image, used to estimate the equilibrium\nmagnetization of blood.\n" }, magnitude: { value: "magnitude", display_name: "Magnitude", description: "Field-mapping MR schemes such as gradient-recalled echo (GRE) generate a\nMagnitude image to be used for anatomical reference.\nRequires the existence of Phase, Phase-difference or Fieldmap maps.\n" }, magnitude1: { value: "magnitude1", display_name: "Magnitude", description: "Magnitude map generated by GRE or similar schemes, associated with the first\necho in the sequence.\n" }, magnitude2: { value: "magnitude2", display_name: "Magnitude", description: "Magnitude map generated by GRE or similar schemes, associated with the second\necho in the sequence.\n" }, markers: { value: "markers", display_name: "MEG Sensor Coil Positions", description: "Another manufacturer-specific detail pertains to the KIT/Yokogawa/Ricoh\nsystem, which saves the MEG sensor coil positions in a separate file with two\npossible filename extensions  (`.sqd`, `.mrk`).\nFor these files, the `markers` suffix MUST be used.\nFor example: `sub-01_task-nback_markers.sqd`\n" }, mask: { value: "mask", display_name: "Binary Mask", description: 'A binary mask that functions as a discrete "label" for a single structure.\n\nThis suffix may only be used in derivative datasets.\n' }, meg: { value: "meg", display_name: "Magnetoencephalography", description: "Unprocessed MEG data stored in the native file format of the MEG instrument\nwith which the data was collected.\n" }, motion: { value: "motion", display_name: "Motion", description: "Data recorded from a tracking system store.\n" }, nirs: { value: "nirs", display_name: "Near Infrared Spectroscopy", description: "Data associated with a Shared Near Infrared Spectroscopy Format file." }, optodes: { value: "optodes", display_name: "Optodes", description: "Either a light emitting device, sometimes called a transmitter, or a photoelectric transducer, sometimes called a\nreceiver.\n" }, pet: { value: "pet", display_name: "Positron Emission Tomography", description: "PET imaging data SHOULD be stored in 4D\n(or 3D, if only one volume was acquired) NIfTI files with the `_pet` suffix.\nVolumes MUST be stored in chronological order\n(the order they were acquired in).\n" }, phase: { value: "phase", display_name: "Phase image", description: "[DEPRECATED](SPEC_ROOT/common-principles.md#definitions).\nPhase information associated with magnitude information stored in BOLD\ncontrast.\nThis suffix should be replaced by the\n[`part-phase`](SPEC_ROOT/appendices/entities.md#part)\nin conjunction with the `bold` suffix.\n", anyOf: [{ unit: "arbitrary" }, { unit: "rad" }] }, phase1: { value: "phase1", display_name: "Phase", description: "Phase map generated by GRE or similar schemes, associated with the first\necho in the sequence.\n" }, phase2: { value: "phase2", display_name: "Phase", description: "Phase map generated by GRE or similar schemes, associated with the second\necho in the sequence.\n" }, phasediff: { value: "phasediff", display_name: "Phase-difference", description: "Some scanners subtract the `phase1` from the `phase2` map and generate a\nunique `phasediff` file.\nFor instance, this is a common output for the built-in fieldmap sequence of\nSiemens scanners.\n" }, photo: { value: "photo", display_name: "Photo File", description: "Photos of the anatomical landmarks, head localization coils or tissue sample.\n" }, physio: { value: "physio", display_name: "Physiological recording", description: "Physiological recordings such as cardiac and respiratory signals.\n" }, probseg: { value: "probseg", display_name: "Probabilistic Segmentation", description: "A probabilistic segmentation.\n\nThis suffix may only be used in derivative datasets.\n" }, sbref: { value: "sbref", display_name: "Single-band reference image", description: "Single-band reference for one or more multi-band `dwi` images.\n" }, scans: { value: "scans", display_name: "Scans file", description: "The purpose of this file is to describe timing and other properties of each imaging acquisition\nsequence (each run file) within one session.\nEach neural recording file SHOULD be described by exactly one row. Some recordings consist of\nmultiple parts, that span several files, for example through echo-, part-, or split- entities.\nSuch recordings MUST be documented with one row per file.\nRelative paths to files should be used under a compulsory filename header.\nIf acquisition time is included it should be listed under the acq_time header.\nAcquisition time refers to when the first data point in each run was acquired.\nFurthermore, if this header is provided, the acquisition times of all files that belong to a\nrecording MUST be identical.\nDatetime should be expressed as described in Units.\nAdditional fields can include external behavioral measures relevant to the scan.\nFor example vigilance questionnaire score administered after a resting state scan.\nAll such included additional fields SHOULD be documented in an accompanying _scans.json file\nthat describes these fields in detail (see Tabular files).\n" }, sessions: { value: "sessions", display_name: "Sessions file", description: "In case of multiple sessions there is an option of adding additional sessions.tsv files\ndescribing variables changing between sessions.\nIn such case one file per participant SHOULD be added.\nThese files MUST include a session_id column and describe each session by one and only one row.\nColumn names in sessions.tsv files MUST be different from group level participant key column\nnames in the participants.tsv file.\n" }, stim: { value: "stim", display_name: "Continuous recording", description: "Continuous measures, such as parameters of a film or audio stimulus.\n" }, uCT: { value: "uCT", display_name: "Micro-CT", description: "Micro-CT imaging data\n" } } }, rules: { checks: { anat: { T1wFileWithTooManyDimensions: { issue: { code: "T1W_FILE_WITH_TOO_MANY_DIMENSIONS", message: "_T1w.nii[.gz] files must have exactly three dimensions.\n", level: "error" }, selectors: ["suffix == 'T1w'", "nifti_header != null"], checks: ["nifti_header.dim[0] == 3"] }, PDT2Volumes: { issue: { code: "PDT2_FILE_SHOULD_HAVE_TWO_VOLUMES", message: "_PDT2.nii[.gz] files should be 4D images with exactly two volumes.\n", level: "warning" }, selectors: ["suffix == 'PDT2'", "nifti_header != null"], checks: ["nifti_header.dim[0] == 4", "nifti_header.dim[4] == 2"] }, PDT2Echos: { issue: { code: "PDT2_ECHOS_SHOULD_MATCH_NIFTI_LENGTH", message: "The EchoTime parameter for _PDT2.nii[.gz] files should have one value\nper volume.\n", level: "warning" }, selectors: ["suffix == 'PDT2'", "sidecar.EchoTime != null", "nifti_header.dim[0] == 4"], checks: ["type(sidecar.EchoTime) == 'array'", "len(sidecar.EchoTime) == nifti_header.dim[4]"] } }, asl: { ASLLabelingDurationNiftiLength: { issue: { code: "LABELING_DURATION_LENGTH_NOT_MATCHING_NIFTI", message: "The number of values for 'LabelingDuration' for this file does not match the 4th dimension\nof the NIfTI header.\n'LabelingDuration' is the total duration of the labeling pulse train, in seconds,\ncorresponding to the temporal width of the labeling bolus for `(P)CASL`.\nIn case all control-label volumes (or deltam or CBF) have the same `LabelingDuration`, a scalar must be\nspecified.\nIn case the control-label volumes (or deltam or cbf) have a different `LabelingDuration`,\nan array of numbers must be specified, for which any `m0scan` in the timeseries has a `LabelingDuration` of\nzero.\nIn case an array of numbers is provided, its length should be equal to the number of volumes specified in\nthe associated `aslcontext.tsv`. Corresponds to DICOM Tag 0018,9258 `ASL Pulse Train Duration`.\n", level: "error" }, selectors: ['suffix == "asl"', '"LabelingDuration" in sidecar', "type(sidecar.LabelingDuration) == 'array'", 'type(nifti_header) != "null"'], checks: ["length(sidecar.LabelingDuration) == nifti_header.dim[4]"] }, ASLContextConsistent: { issue: { code: "ASLCONTEXT_TSV_NOT_CONSISTENT", message: "The number of volumes in the 'aslcontext.tsv' for this file does not match the number of\nvalues in the NIfTI header.\n", level: "error" }, selectors: ['suffix == "asl"', 'type(associations.aslcontext) != "null"', 'type(nifti_header) != "null"'], checks: ["nifti_header.dim[4] == associations.aslcontext.n_rows"] }, ASLFlipAngleNiftiLength: { issue: { code: "FLIP_ANGLE_NOT_MATCHING_NIFTI", message: "The number of values for 'FlipAngle' for this file does not match the 4th dimension of the NIfTI header.\n'FlipAngle' is the flip angle (FA) for the acquisition, specified in degrees.\nCorresponds to: DICOM Tag 0018, 1314 `Flip Angle`.\nThe data type number may apply to files from any MRI modality concerned with a single value for this field,\nor to the files in a file collection where the value of this field is iterated using the flip entity.\nThe data type array provides a value for each volume in a 4D dataset and should only be used when the\nvolume timing is critical for interpretation of the data, such as in ASL or variable flip\nangle fMRI sequences.\n", level: "error" }, selectors: ['suffix == "asl"', '"FlipAngle" in sidecar', "type(sidecar.FlipAngle) == 'array'", 'type(nifti_header) != "null"'], checks: ["length(sidecar.FlipAngle) == nifti_header.dim[4]"] }, ASLFlipAngleASLContextLength: { issue: { code: "FLIP_ANGLE_NOT_MATCHING_ASLCONTEXT_TSV", message: "The number of values for 'FlipAngle' for this file does not match the number of volumes in the\nassociated 'aslcontext.tsv'.\n'FlipAngle' is the flip angle (FA) for the acquisition, specified in degrees.\nCorresponds to: DICOM Tag 0018, 1314 `Flip Angle`.\nThe data type number may apply to files from any MRI modality concerned with a single value for this field,\nor to the files in a file collection where the value of this field is iterated using the flip entity.\nThe data type array provides a value for each volume in a 4D dataset and should only be used when the volume\ntiming is critical for interpretation of the data, such as in ASL or variable flip angle fMRI sequences.\n", level: "error" }, selectors: ['suffix == "asl"', 'type(associations.aslcontext) != "null"', "type(sidecar.FlipAngle) == 'array'"], checks: ["length(sidecar.FlipAngle) == associations.aslcontext.n_rows"] }, ASLPostLabelingDelayNiftiLength: { issue: { code: "POST_LABELING_DELAY_NOT_MATCHING_NIFTI", message: "The number of values for 'PostLabelingDelay' for this file does not match the 4th dimension of the NIfTI\nheader.\n'PostLabelingDelay' is the time, in seconds, after the end of the labeling (for (P)CASL) or middle of the\nlabeling pulse (for PASL) until the middle of the excitation pulse applied to the imaging slab\n(for 3D acquisition) or first slice (for 2D acquisition).\nCan be a number (for a single-PLD time series) or an array of numbers (for multi-PLD and Look-Locker).\nIn the latter case, the array of numbers contains the PLD of each volume\n(that is, each 'control' and 'label')\nin the acquisition order. Any image within the time-series without a PLD (for example, an 'm0scan') is\nindicated by a zero.\nBased on DICOM Tags 0018,9079 Inversion Times and 0018,0082 InversionTime.\n", level: "error" }, selectors: ['suffix == "asl"', 'type(associations.aslcontext) != "null"', "type(sidecar.PostLabelingDelay) == 'array'", 'type(nifti_header) != "null"'], checks: ["length(sidecar.PostLabelingDelay) == nifti_header.dim[4]"] }, ASLPostLabelingDelayASLContextLength: { issue: { code: "POST_LABELING_DELAY_NOT_MATCHING_ASLCONTEXT_TSV", message: "The number of values for 'PostLabelingDelay' for this file does not match the number of volumes\nin the associated 'aslcontext.tsv'.\n'PostLabelingDelay' is the time, in seconds, after the end of the labeling (for (P)CASL) or\nmiddle of the labeling pulse (for PASL) until the middle of the excitation pulse applied to\nthe imaging slab (for 3D acquisition) or first slice (for 2D acquisition).\nCan be a number (for a single-PLD time series) or an array of numbers (for multi-PLD and Look-Locker).\nIn the latter case, the array of numbers contains the PLD of each volume\n(that is, each 'control' and 'label')\nin the acquisition order.\nAny image within the time-series without a PLD (for example, an 'm0scan') is indicated by a zero.\nBased on DICOM Tags 0018,9079 Inversion Times and 0018,0082 InversionTime.\n", level: "error" }, selectors: ['suffix == "asl"', 'type(associations.aslcontext) != "null"', "type(sidecar.PostLabelingDelay) == 'array'"], checks: ["length(sidecar.PostLabelingDelay) == associations.aslcontext.n_rows"] }, ASLLabelingDurationASLContextLength: { issue: { code: "LABELLING_DURATION_NOT_MATCHING_ASLCONTEXT_TSV", message: "The number of values for 'LabelingDuration' for this file does not match the number of volumes\nin the associated 'aslcontext.tsv'.\n'LabelingDuration' is the total duration of the labeling pulse train, in seconds,\ncorresponding to the temporal width of the labeling bolus for `(P)CASL`.\nIn case all control-label volumes (or deltam or CBF) have the same `LabelingDuration`,\na scalar must be specified.\nIn case the control-label volumes (or deltam or cbf) have a different `LabelingDuration`,\nan array of numbers must be specified, for which any `m0scan` in the timeseries has a\n`LabelingDuration` of zero.\nIn case an array of numbers is provided, its length should be equal to the number of volumes\nspecified in the associated `aslcontext.tsv`.\nCorresponds to DICOM Tag 0018,9258 `ASL Pulse Train Duration`.\n", level: "error" }, selectors: ['suffix == "asl"', 'type(associations.aslcontext) != "null"', "type(sidecar.LabelingDuration) == 'array'"], checks: ["length(sidecar.LabelingDuration) == associations.aslcontext.n_rows"] }, ASLRepetitionTimePreparationASLContextLength: { issue: { code: "REPETITIONTIMEPREPARATION_NOT_MATCHING_ASLCONTEXT_TSV", message: "The number of values of 'RepetitionTimePreparation' for this file does not match the number of\nvolumes in the associated 'aslcontext.tsv'.\n'RepetitionTimePreparation' is the interval, in seconds, that it takes a preparation pulse block to\nre-appear at the beginning of the succeeding (essentially identical) pulse sequence block.\nThe data type number may apply to files from any MRI modality concerned with a single value for this field.\nThe data type array provides a value for each volume in a 4D dataset and should only be used when the\nvolume timing is critical for interpretation of the data, such as in ASL.\n", level: "error" }, selectors: ['suffix == "asl"', 'type(associations.aslcontext) != "null"', "type(sidecar.RepetitionTimePreparation) == 'array'"], checks: ["length(sidecar.RepetitionTimePreparation) == associations.aslcontext.n_rows"] }, ASLBackgroundSuppressionNumberPulses: { issue: { code: "BACKGROUND_SUPPRESSION_PULSE_NUMBER_NOT_CONSISTENT", message: "The 'BackgroundSuppressionNumberPulses' field is not consistent with the length of\n'BackgroundSuppressionPulseTime'.\n'BackgroundSuppressionNumberPulses' is the number of background suppression pulses used.\nNote that this excludes any effect of background suppression pulses applied before the labeling.\n", level: "warning" }, selectors: ['suffix == "asl"', '"BackgroundSuppressionNumberPulses" in sidecar', '"BackgroundSuppressionPulseTime" in sidecar', "type(sidecar.BackgroundSuppressionPulseTime) == 'array'"], checks: ["length(sidecar.BackgroundSuppressionPulseTime) == sidecar.BackgroundSuppressionNumberPulses"] }, ASLTotalAcquiredVolumesASLContextLength: { issue: { code: "TOTAL_ACQUIRED_VOLUMES_NOT_CONSISTENT", message: "The number of values for 'TotalAcquiredVolumes' for this file does not match number of\nvolumes in the associated 'aslcontext.tsv'.\n'TotalAcquiredVolumes' is the original number of 3D volumes acquired for each volume defined in the\nassociated 'aslcontext.tsv'.\n", level: "warning" }, selectors: ['suffix == "asl"', 'type(associations.aslcontext) != "null"', '"TotalAcquiredVolumes" in sidecar'], checks: ["aslcontext.n_rows == sidecar.TotalAcquiredVolumes"] }, PostLabelingDelayGreater: { issue: { code: "POST_LABELING_DELAY_GREATER", message: "'PostLabelingDelay' is greater than 10. Are you sure it's expressed in seconds?\n", level: "warning" }, selectors: ['suffix == "asl"', "sidecar.PostLabelingDelay != null"], checks: ["sidecar.PostLabelingDelay <= 10"] }, BolusCutOffDelayTimeGreater: { issue: { code: "BOLUS_CUT_OFF_DELAY_TIME_GREATER", message: "'BolusCutOffDelayTime' is greater than 10. Are you sure it's expressed in seconds?\n", level: "warning" }, selectors: ["sidecar.BolusCutOffDelayTime != null"], checks: ["sidecar.BolusCutOffDelayTime <= 10"] }, LabelingDurationGreater: { issue: { code: "LABELING_DURATION_GREATER", message: "'LabelingDuration' is greater than 10. Are you sure it's expressed in seconds?\n", level: "warning" }, selectors: ["sidecar.LabelingDuration != null"], checks: ["sidecar.LabelingDuration <= 10"] }, ASLEchoTimeASLContextLength: { issue: { code: "ECHO_TIME_NOT_CONSISTENT", message: "The number of values for 'EchoTime' for this file does not match number of volumes in the\nassociated 'aslcontext.tsv'.\n'EchoTime' is the echo time (TE) for the acquisition, specified in seconds.\n", level: "warning" }, selectors: ['suffix == "asl"', 'type(associations.aslcontext) != "null"', "type(sidecar.EchoTime) == 'array'"], checks: ["length(sidecar.EchoTime) == associations.aslcontext.n_rows"] }, ASLM0TypeAbsentScan: { issue: { code: "M0Type_SET_INCORRECTLY_TO_ABSENT", message: "You defined M0Type as 'absent' while including a separate 'm0scan.nii[.gz]' and\n'm0scan.json', or defining the 'M0Estimate' field.\nThis is not allowed, please check that this field are filled correctly.\n", level: "error" }, selectors: ['suffix == "asl"', 'type(associations.aslcontext) != "null"', 'type(associations.m0scan) != "null"', '"M0Type" in sidecar'], checks: ['sidecar.M0Type != "absent"'] }, ASLM0TypeAbsentASLContext: { issue: { code: "M0Type_SET_INCORRECTLY_TO_ABSENT_IN_ASLCONTEXT", message: "You defined M0Type as 'absent' while including an m0scan volume within the associated\n'aslcontext.tsv'.\nThis is not allowed, please check that this field are filled correctly.\n", level: "error" }, selectors: ['suffix == "asl"', 'type(associations.aslcontext) != "null"', 'intersects(associations.aslcontext.volume_type, ["m0scan"])', '"M0Type" in sidecar'], checks: ['sidecar.M0Type != "absent"'] }, ASLM0TypeIncorrect: { issue: { code: "M0Type_SET_INCORRECTLY", message: "M0Type was not defined correctly.\nIf 'M0Type' is equal to 'separate', the dataset should include an associated\n'm0scan.nii[.gz]' and 'm0scan.json' file.\n", level: "error" }, selectors: ['suffix == "asl"', 'type(associations.aslcontext) != "null"', 'sidecar.M0Type == "separate"'], checks: ['type(associations.m0scan) != "null"'] } }, common_derivatives: { ResInSidecar: { selectors: ['dataset.dataset_description.DatasetType == "derivative"', 'intersects([modality], ["mri", "pet"])', "match(extension, '^\\.nii(\\.gz)?$')", 'type(sidecar.Resolution) == "object"'], checks: ["entities.resolution in sidecar.Resolution"] }, DenInSidecar: { selectors: ['dataset.dataset_description.DatasetType == "derivative"', 'intersects([modality], ["mri", "pet"])', "match(extension, '^\\.nii(\\.gz)?$')", 'type(sidecar.Density) == "object"'], checks: ["entities.density in sidecar.Density"] } }, dataset: { SubjectFolders: { issue: { code: "SUBJECT_FOLDERS", message: 'There are no subject directories (labeled "sub-*") in the root of this dataset.\n', level: "error" }, selectors: ["path == 'dataset_description.json'"], checks: ["length(dataset.subjects.sub_dirs) > 0"] }, ParticipantIDMismtach: { issue: { code: "PARTICIPANT_ID_MISMATCH", message: "Participant labels found in this dataset did not match the values in participant_id column\nfound in the participants.tsv file.\n", level: "error" }, selectors: ["path == 'participants.tsv'"], checks: ["sorted(columns.participant_label) == sorted(dataset.subjects.sub_dirs)"] }, PhenotypeSubjectsMissing: { issue: { code: "PHENOTYPE_SUBJECTS_MISSING", message: "A phenotype/ .tsv file lists subjects that were not found in the dataset.\n", level: "error" }, selectors: ["path == 'dataset_description.json'"], checks: ["sorted(dataset.subjects.phenotype) == sorted(dataset.subjects.sub_dirs)"] }, SamplesTSVMissing: { issue: { code: "SAMPLES_TSV_MISSING", message: "The compulsory file '/samples.tsv' is missing.\nSee 'Modality agnostic files' section of the BIDS specification.\n", level: "error" }, selectors: ["path == 'dataset_description.json'", '"micr" in dataset.modalities'], checks: ["'samples.tsv' in dataset.files"] }, UnknownVersion: { issue: { code: "UNKNOWN_BIDS_VERSION", message: "The BIDSVersion field of 'dataset_description.json' does not match a known release.\nThe BIDS Schema used for validation may be out of date.\n", level: "warning" }, selectors: ["path == 'dataset_description.json'"], checks: ["intersects([json.BIDSVersion], schema.meta.versions)"] }, SingleSourceAuthors: { issue: { code: "AUTHORS_AND_CITATION_FILE_MUTUALLY_EXCLUSIVE", level: "error", message: `'CITATION.cff' file found. The "Authors" field of 'dataset_description.json'
must be removed to avoid inconsistency.
` }, selectors: ["path == 'CITATION.cff'"], checks: ['!("Authors" in dataset.dataset_description)'] }, SingleSourceCitationFields: { issue: { code: "SINGLE_SOURCE_CITATION_FIELDS", level: "warning", message: `CITATION.cff file found.
The "HowToAckowledge", "License", and "ReferencesAndLinks" fields of
'dataset_description.json' should be removed to avoid inconsistency.
` }, selectors: ["path == 'CITATION.cff'"], checks: ['!("HowToAcknowledge" in dataset.dataset_description)', '!("License" in dataset.dataset_description)', '!("ReferencesAndLinks" in dataset.dataset_description)'] } }, dwi: { DWIVolumeCount: { issue: { code: "VOLUME_COUNT_MISMATCH", message: "The number of volumes in this scan does not match the number of volumes in the\nassociated '.bvec' and '.bval' files.\n", level: "error" }, selectors: ['suffix == "dwi"', '"bval" in associations', '"bvec" in associations', 'type(nifti_header) != "null"'], checks: ["associations.bval.n_cols == nifti_header.dim[4]", "associations.bvec.n_cols == nifti_header.dim[4]"] }, DWIBvalRows: { issue: { code: "BVAL_MULTIPLE_ROWS", message: "'.bval' files should contain exactly one row of values.\n", level: "error" }, selectors: ['extension == ".bval"'], checks: ["data.n_rows == 1"] }, DWIBvecRows: { issue: { code: "BVEC_NUMBER_ROWS", message: "'.bvec' files should contain exactly three rows of values.\n", level: "error" }, selectors: ['extension == ".bvec"'], checks: ["data.n_rows == 3"] }, DWIMissingBvec: { issue: { code: "DWI_MISSING_BVEC", message: "DWI scans must have a corresponding '.bvec' file.\n", level: "error" }, selectors: ['suffix == "dwi"', "match(extension, '^\\.nii(\\.gz)?$')"], checks: ['"bvec" in associations'] }, DWIMissingBval: { issue: { code: "DWI_MISSING_BVAL", message: "DWI scans must have a corresponding '.bval' file.\n", level: "error" }, selectors: ['suffix == "dwi"', "match(extension, '^\\.nii(\\.gz)?$')"], checks: ['"bval" in associations'] } }, events: { EventsMissing: { issue: { code: "EVENTS_TSV_MISSING", message: `Task scans should have a corresponding 'events.tsv' file.
If this is a resting state scan you can ignore this warning or rename the task to include the word "rest".
`, level: "warning" }, selectors: ['dataset.dataset_description.DatasetType == "raw"', '"task" in entities', '!match(entities.task, "rest")', 'suffix != "events"'], checks: ['"events" in associations'] }, StimulusFileMissing: { issue: { code: "STIMULUS_FILE_MISSING", message: "A stimulus file was declared but not found in the dataset.\n", level: "error" }, selectors: ['suffix == "events"', "columns.stim_file != null"], checks: ['exists(columns.stim_file, "stimuli") == length(columns.stim_file) - count(columns.stim_file, "n/a")'] } }, fmap: { EchoTime12DifferenceUnreasonable: { issue: { code: "ECHOTIME1_2_DIFFERENCE_UNREASONABLE", message: "The value of (EchoTime2 - EchoTime1) should be within the range of 0.0001 - 0.01.\n", level: "error" }, selectors: ['suffix == "phasediff"'], checks: ["sidecar.EchoTime2 - sidecar.EchoTime1 >= 0.0001", "sidecar.EchoTime2 - sidecar.EchoTime1 <= 0.01"] }, FmapFieldmapWithoutMagnitude: { issue: { code: "FIELDMAP_WITHOUT_MAGNITUDE_FILE", message: "'fieldmap.nii[.gz]' file does not have an associated 'magnitude.nii[.gz]' file.\n", level: "error" }, selectors: ['suffix == "fieldmap"'], checks: ['"magnitude" in associations'] }, FmapPhasediffWithoutMagnitude: { issue: { code: "MISSING_MAGNITUDE1_FILE", message: "'phasediff.nii[.gz]' file does not have an associated 'magnitude1.nii[.gz]' file.\n", level: "warning" }, selectors: ['suffix == "phasediff"'], checks: ['"magnitude1" in associations'] }, MagnitudeFileWithTooManyDimensions: { issue: { code: "MAGNITUDE_FILE_WITH_TOO_MANY_DIMENSIONS", message: "'magnitude1.nii[.gz]' and 'magnitude2.nii[.gz]' files must have exactly three dimensions.\n", level: "error" }, selectors: ["intersects([suffix], ['magnitude1', 'magnitude2'])", "nifti_header != null"], checks: ["nifti_header.dim[0] == 3"] } }, func: { PhaseSuffixDeprecated: { issue: { code: "PHASE_SUFFIX_DEPRECATED", message: "DEPRECATED. Phase information associated with magnitude information stored in BOLD contrast.\nThis suffix should be replaced by the 'part-phase' entity in conjunction with the 'bold' suffix.\nFor backwards compatibility, 'phase' is considered equivalent to 'part-phase_bold'.\nWhen the 'phase' suffix is not used, each file shares the same name with the exception of the\n'part-<mag|phase>' or 'part-<real|imag>' key/value.\n", level: "warning" }, selectors: ['datatype == "func"'], checks: ['suffix != "phase"'] }, RepetitionTimeGreaterThan: { issue: { code: "REPETITION_TIME_GREATER_THAN", message: "'RepetitionTime' is greater than 100. Are you sure it's expressed in seconds?\n", level: "warning" }, selectors: ['suffix == "bold"', 'type(sidecar.RepetitionTime) != "null"'], checks: ["sidecar.RepetitionTime <= 100"] }, RepetitionTimeMismatch: { issue: { code: "REPETITION_TIME_MISMATCH", message: "Repetition time did not match between the scan's header and the associated JSON metadata file.\n", level: "error" }, selectors: ['suffix == "bold"', 'type(sidecar.RepetitionTime) != "null"', 'type(nifti_header) != "null"'], checks: ["sidecar.RepetitionTime == nifti_header.pixdim[4]"] }, BoldNot4d: { issue: { code: "BOLD_NOT_4D", message: "BOLD scans must be 4 dimensional.\n", level: "error" }, selectors: ['suffix == "bold"', 'type(nifti_header) != "null"'], checks: ["nifti_header.dim[0] == 4"] }, SliceTimingGreaterThanRepetitionTime: { issue: { code: "SLICETIMING_VALUES_GREATER_THAN_REPETITION_TIME", message: "'SliceTiming' contains invalid value(s) greater than 'RepetitionTime'.\n'SliceTiming' values should be in seconds, not milliseconds (common mistake).\n", level: "error" }, selectors: ['suffix == "bold"', 'type(sidecar.SliceTiming) != "null"', 'type(sidecar.RepetitionTime) != "null"'], checks: ["max(sidecar.SliceTiming) <= sidecar.RepetitionTime"] }, VolumeTimingRepetitionTimeMutex: { issue: { code: "VOLUME_TIMING_AND_REPETITION_TIME_MUTUALLY_EXCLUSIVE", message: "The fields 'VolumeTiming' and 'RepetitionTime' for this file are mutually exclusive.\nChoose 'RepetitionTime' when the same repetition time is used for all volumes,\nor 'VolumeTiming' when variable times are used.\n", level: "error" }, selectors: ['type(sidecar.VolumeTiming) != "null"'], checks: ['type(sidecar.RepetitionTime) == "null"'] }, RepetitionTimeAcquisitionDurationMutex: { issue: { code: "REPETITION_TIME_AND_ACQUISITION_DURATION_MUTUALLY_EXCLUSIVE", message: "The fields 'RepetitionTime' and 'AcquisitionDuration' for this file are mutually exclusive.\nTo specify acquisition duration, use 'SliceTiming' or 'DelayTime'\n(RepetitionTime - AcquisitionDuration).\n", level: "error" }, selectors: ['type(sidecar.AcquistionDuration) != "null"'], checks: ['type(sidecar.RepetitionTime) == "null"'] }, VolumeTimingDelayTimeMutex: { issue: { code: "VOLUME_TIMING_AND_DELAY_TIME_MUTUALLY_EXCLUSIVE", message: "The fields 'VolumeTiming' and 'DelayTime' for this file are mutually exclusive.\nTo specify acquisition duration, use 'AcquisitionDuration' or 'SliceTiming'.\n", level: "error" }, selectors: ['type(sidecar.VolumeTiming) != "null"'], checks: ['type(sidecar.DelayTime) == "null"'] }, SliceTimingAcquisitionDurationMutex: { issue: { code: "SLICE_TIMING_AND_DURATION_MUTUALLY_EXCLUSIVE", message: "'SliceTiming' is defined for this file.\nNeither 'DelayTime' nor 'AcquisitionDuration' may be defined in addition.\n", level: "error" }, selectors: ['type(sidecar.SliceTiming) != "null"'], checks: ['type(sidecar.AcquisitionDuration) == "null"', 'type(sidecar.DelayTime) == "null"'] } }, general: { DuplicateFiles: { issue: { code: "DUPLICATE_FILES", message: "File exists with and without `.gz` extension.\n", level: "error" }, selectors: ["match(extension, '\\.gz$')"], checks: ['exists(substr(path, 0, length(path) - 3), "dataset") == 0'] }, ReadmeFileSmall: { issue: { code: "README_FILE_SMALL", message: "The recommended file '/README' is very small.\nPlease consider expanding it with additional information about the dataset.\n", level: "warning" }, selectors: ["match(path, '^README')"], checks: ["size > 150"] } }, hints: { TooFewAuthors: { issue: { code: "TOO_FEW_AUTHORS", message: "The 'Authors' field of 'dataset_description.json' should contain an array of values -\nwith one author per value.\nThis was triggered based on the presence of only one author field.\nPlease ignore if all contributors are already properly listed.\n", level: "warning" }, selectors: ["path == '/dataset_description.json'"], checks: ["length(json.Authors) > 1"] }, SuspiciouslyLongBOLDDesign: { issue: { code: "SUSPICIOUSLY_LONG_EVENT_DESIGN", message: "The onset of the last event is after the total duration of the corresponding scan.\nThis design is suspiciously long.\n", level: "warning" }, selectors: ['suffix == "bold"', "associations.events != null", 'type(nifti_header) != "null"'], checks: ["max(associations.events.onset) < nifti_header.pixdim[4] * nifti_header.dim[4]"] }, SuspiciouslyShortBOLDDesign: { issue: { code: "SUSPICIOUSLY_SHORT_EVENT_DESIGN", message: "The onset of the last event is less than half the total duration of the corresponding scan.\nThis design is suspiciously short.\n", level: "warning" }, selectors: ['suffix == "bold"', "associations.events != null", 'type(nifti_header) != "null"'], checks: ["max(associations.events.onset) > nifti_header.pixdim[4] * nifti_header.dim[4] / 2"] } }, micr: { PixelSizeInconsistent: { issue: { code: "PIXEL_SIZE_INCONSISTENT", message: "'PixelSize' need to be consistent with the 'PhysicalSizeX', 'PhysicalSizeY' and 'PhysicalSizeZ'\nOME metadata fields.\n", level: "error" }, selectors: ["ome != null", "sidecar.PixelSize != null", "sidecar.PixelSizeUnit != null"], checks: ['ome.PhysicalSizeX * 10 ** (-3 * index(["mm", "um", "nm"], ome.PhysicalSizeXUnit))\n== sidecar.PixelSize[0] * 10 ** (-3 * index(["mm", "um", "nm"], sidecar.PixelSizeUnit))\n', 'ome.PhysicalSizeY * 10 ** (-3 * index(["mm", "um", "nm"], ome.PhysicalSizeYUnit))\n== sidecar.PixelSize[1] * 10 ** (-3 * index(["mm", "um", "nm"], sidecar.PixelSizeUnit))\n', 'ome.PhysicalSizeZ * 10 ** (-3 * index(["mm", "um", "nm"], ome.PhysicalSizeZUnit))\n== sidecar.PixelSize[2] * 10 ** (-3 * index(["mm", "um", "nm"], sidecar.PixelSizeUnit))\n'] }, InconsistentTiffExtension: { issue: { code: "INCONSISTENT_TIFF_EXTENSION", message: "Inconsistent TIFF file type and extension\n", level: "error" }, selectors: ["tiff != null", "intersects([extension], ['.ome.tif', '.ome.btf'])"], checks: ["tiff.version == 42 || tiff.version == 43", "(extension == '.ome.tif') == (tiff.version == 42)", "(extension == '.ome.btf') == (tiff.version == 43)"] } }, mri: { PhasePartUnits: { issue: { code: "PHASE_UNITS", message: 'Phase images (with the `part-phase` entity) must have units "rad" or "arbitrary".\n', level: "error" }, selectors: ['modality == "mri"', 'entities.part == "phase"', '"Units" in sidecar'], checks: ['intersects([sidecar.Units], ["rad", "arbitrary"])'] }, EchoTimeGreaterThan: { issue: { code: "ECHO_TIME_GREATER_THAN", message: "'EchoTime' is greater than 1. Are you sure it's expressed in seconds?\n", level: "warning" }, selectors: ['modality == "mri"', "sidecar.EchoTime"], checks: ["sidecar.EchoTime <= 1"] }, TotalReadoutTimeGreaterThan: { issue: { code: "TOTAL_READOUT_TIME_GREATER_THAN", message: "'TotalReadoutTime' is greater than 10. Are you sure it's expressed in seconds?\n", level: "warning" }, selectors: ['modality == "mri"', "sidecar.TotalReadoutTime"], checks: ["sidecar.TotalReadoutTime <= 10"] }, EffectiveEchoSpacingTooLarge: { issue: { code: "EFFECTIVEECHOSPACING_TOO_LARGE", message: "Abnormally high value of 'EffectiveEchoSpacing'.\n", level: "error" }, selectors: ['modality == "mri"', 'type(sidecar.RepetitionTime) != "null"', 'type(sidecar.EffectiveEchoSpacing) != "null"', 'type(sidecar.PhaseEncodingDirection) != "null"', 'type(nifti_header) != "null"'], checks: ['sidecar.RepetitionTime >= (\n  sidecar.EffectiveEchoSpacing\n  * nifti_header.dim[index(["i", "j", "k"], sidecar.PhaseEncodingDirection[0])]\n)\n'] }, SliceTimingElements: { issue: { code: "SLICETIMING_ELEMENTS", message: "The number of elements in the 'SliceTiming' array should match the 'k'\ndimension of the corresponding NIfTI volume.\n", level: "warning" }, selectors: ['modality == "mri"', 'type(sidecar.SliceTiming) != "null"', 'type(nifti_header) != "null"'], checks: ["length(sidecar.SliceTiming) == nifti_header.dim[3]"] }, EESGreaterThanTRT: { issue: { code: "EFFECTIVEECHOSPACING_LARGER_THAN_TOTALREADOUTTIME", message: "'EffectiveEchoSpacing' should always be smaller than 'TotalReadoutTime'.\n", level: "error" }, selectors: ['modality == "mri"', "sidecar.EffectiveEchoSpacing != null", "sidecar.TotalReadoutTime != null"], checks: ["sidecar.EffectiveEchoSpacing < sidecar.TotalReadoutTime"] }, VolumeTimingNotMonotonicallyIncreasing: { issue: { code: "VOLUME_TIMING_NOT_MONOTONICALLY_INCREASING", message: "'VolumeTiming' is not monotonically increasing.\n", level: "error" }, selectors: ['modality == "mri"', "sidecar.VolumeTiming != null"], checks: ["sorted(sidecar.VolumeTiming) == sidecar.VolumeTiming"] }, BolusCutOffDelayTimeNotMonotonicallyIncreasing: { issue: { code: "BOLUS_CUT_OFF_DELAY_TIME_NOT_MONOTONICALLY_INCREASING", message: "'BolusCutOffDelayTime' is not monotonically increasing.\n", level: "error" }, selectors: ['modality == "mri"', "sidecar.BolusCutoffDelayTime != null"], checks: ["sorted(sidecar.BolusCutoffDelayTime) == sidecar.BolusCutoffDelayTime"] }, RepetitionTimePreparationNotConsistent: { issue: { code: "REPETITIONTIME_PREPARATION_NOT_CONSISTENT", message: "The number of values for 'RepetitionTimePreparation' for this file does\nnot match the 4th dimension of the NIfTI header.\n", level: "error" }, selectors: ['modality == "mri"', 'type(sidecar.RepetitionTimePreparation) == "array"', 'type(nifti_header) != "null"'], checks: ["length(sidecar.RepetitionTimePreparation) == nifti_header.dim[4]"] } }, nifti: { NiftiDimension: { issue: { code: "NIFTI_DIMENSION", message: "NIfTI file's header field for dimension information is blank or too short.\n", level: "warning" }, selectors: ['type(nifti_header) != "null"'], checks: ["length(nifti_header.shape) > 0", "min(nifti_header.shape) > 0"] }, NiftiUnit: { issue: { code: "NIFTI_UNIT", message: "NIfTI file's header field for unit information for x, y, z, and t dimensions is empty or too short.\n", level: "warning" }, selectors: ['type(nifti_header) != "null"'], checks: ["nifti_header.xyzt_units.xyz != 'unknown'", "nifti_header.dim[0] < 4 || nifti_header.xyzt_units.t != 'unknown'"] }, NiftiPixdim: { issue: { code: "NIFTI_PIXDIM", message: "NIfTI file's header field for pixel dimension information is empty or too short.\n", level: "warning" }, selectors: ['type(nifti_header) != "null"'], checks: ["min(nifti_header.voxel_sizes) > 0"] }, XformCodes0: { issue: { code: "SFORM_AND_QFORM_IN_IMAGE_HEADER_ARE_ZERO", message: "sform_code and qform_code in the image header are 0.\nThe image/file will be considered invalid or assumed to be in LAS orientation.\n", level: "warning" }, selectors: ["nifti_header != null"], checks: ["nifti_header.qform_code != 0 || nifti_header.sform_code != 0"] } }, nirs: { NASamplingFreq: { selectors: ['suffix == "nirs"', 'samplingFrequency == "n/a"'], checks: ["associations.channels.sampling_frequency != null"] }, NIRSChannelCount: { selectors: ['datatype == "nirs"', 'suffix == "nirs"'], checks: ['sidecar.NIRSChannelCount\n== count(associations.channels.type, "NIRSCWAMPLITUDE")\n+  count(associations.channels.type, "NIRSCWFLUORESCENSEAMPLITUDE")\n+  count(associations.channels.type, "NIRSCWOPTICALDENSITY")\n+  count(associations.channels.type, "NIRSCWHBO")\n+  count(associations.channels.type, "NIRSCWHBR")\n+  count(associations.channels.type, "NIRSCWMUA")\n'] }, ACCELChannelCountReq: { selectors: ['suffix == "nirs"'], checks: ['sidecar.ACCELChannelCount == count(associations.channels.type, "ACCEL")'] }, GYROChannelCountReq: { selectors: ['suffix == "nirs"'], checks: ['sidecar.GYROChannelCount == count(associations.channels.type, "GYRO")'] }, MAGNChannelCountReq: { selectors: ['suffix == "nirs"'], checks: ['sidecar.MAGNChannelCount == count(associations.channels.type, "MAGN")'] }, ShortChannelCountReq: { selectors: ['suffix == "nirs"'], checks: ['sidecar.ShortChannelCount == count(associations.channels.short_channel, "true")'] }, Component: { selectors: ['datatype == "nirs"', 'suffix == "channels"', 'extension == ".tsv"', 'intersects(columns.type, ["ACCEL", "GYRO", "MAGN"])'], checks: ["columns.component != null"] }, RequiredChannels: { selectors: ['datatype == "nirs"', 'suffix == "optodes"', 'extension == ".tsv"'], checks: ["associations.channels != null"] }, RequiredTemplateX: { selectors: ['datatype == "nirs"', 'suffix == "optodes"', 'extension == ".tsv"', 'intersects(columns.x, ["n/a"])'], checks: ["columns.template_x != null"] }, RequiredTemplateY: { selectors: ['datatype == "nirs"', 'suffix == "optodes"', 'extension == ".tsv"', 'intersects(columns.y, ["n/a"])'], checks: ["columns.template_y != null"] }, RequiredTemplateZ: { selectors: ['datatype == "nirs"', 'suffix == "optodes"', 'extension == ".tsv"', 'intersects(columns.z, ["n/a"])'], checks: ["columns.template_z != null"] }, RequiredCoordsystem: { selectors: ['datatype == "nirs"', 'suffix == "optodes"', 'extension == ".tsv"'], checks: ["associations.coordsystem != null"] } }, privacy: { GzipHeaderFields: { issue: { code: "GZIP_HEADER_DATA", message: "The gzip header contains a non-zero timestamp or a non-empty filename and/or comment field.\nThese may leak sensitive information or indicate a non-reproducible conversion process.\n", level: "warning" }, selectors: ['match(extension, ".gz$")', "gzip != null"], checks: ["gzip.timestamp == 0", 'gzip.filename == ""', 'gzip.comment == ""'] }, CheckAge89: { issue: { code: "AGE_89", message: 'As per section 164.514(C) of "The De-identification Standard" under HIPAA guidelines,\nparticipants with age 89 or higher should be tagged as 89+. More information can be found at\nhttps://www.hhs.gov/hipaa/for-professionals/privacy/special-topics/de-identification/#standard.\n', level: "warning" }, selectors: ["path == 'participants.tsv'", "columns.age != null"], checks: ["max(columns.age) < 89"] } }, references: { SubjectRelativeIntendedFor: { selectors: ['datatype != "ieeg"', 'type(sidecar.IntendedFor) != "null"'], checks: ['exists(sidecar.IntendedFor, "bids-uri") || exists(sidecar.IntendedFor, "subject")'] }, DatasetRelativeIntendedFor: { selectors: ['datatype == "ieeg"', 'type(sidecar.IntendedFor) != "null"'], checks: ['exists(sidecar.IntendedFor, "bids-uri") || exists(sidecar.IntendedFor, "dataset")'] }, AssociatedEmptyRoom: { selectors: ['suffix == "meg"', 'type(sidecar.AssociatedEmptyRoom) != "null"'], checks: ['exists(sidecar.AssociatedEmptyRoom, "bids-uri") || exists(sidecar.AssociatedEmptyRoom, "dataset")'] }, Stimuli: { selectors: ['suffix == "events"', 'extension == ".tsv"', 'type(columns.stim_file) != "null"'], checks: ['exists(columns.stim_file, "stimuli")'] }, Sources: { selectors: ['dataset.dataset_description.DatasetType == "derivatives"', 'type(sidecar.Sources) != "null"'], checks: ['exists(sidecar.Sources, "bids-uri") || exists(sidecar.Sources, "dataset")'] }, SpatialReferences: { selectors: ['dataset.dataset_description.DatasetType == "derivatives"', 'type(sidecar.SpatialReference.URI) != "null"'], checks: ['exists(sidecar.SpatialReference.URI, "bids-uri") || exists(sidecar.SpatialReference.URI, "dataset")'] } } }, common_principles: ["dataset", "modality", "data_type", "subject", "session", "sample", "data_acquisition", "task", "event", "run", "index", "label", "suffix", "extension", "deprecated"], dataset_metadata: { dataset_description: { selectors: ['path == "/dataset_description.json"'], fields: { Name: "required", BIDSVersion: "required", DatasetType: "recommended", License: "recommended", Authors: { level: "recommended", issue: { code: "NO_AUTHORS", message: "The Authors field of dataset_description.json should contain an array of fields -\nwith one author per field. This was triggered because there are no authors, which\nwill make DOI registration from dataset metadata impossible.\n" } }, Acknowledgements: "optional", HowToAcknowledge: "optional", Funding: "optional", EthicsApprovals: "optional", ReferencesAndLinks: "optional", DatasetDOI: "optional", GeneratedBy: "recommended", SourceDatasets: "recommended" } }, derivative_description: { selectors: ['path == "/dataset_description.json"', 'json.DatasetType == "derivative"'], fields: { GeneratedBy: "required" } }, dataset_description_with_genetics: { selectors: ['path == "/dataset_description.json"', 'intersects(dataset.files, ["/genetic_info.json"])'], fields: { Genetics: "required" } }, genetic_info: { selectors: ['path == "/genetic_info.json"'], fields: { GeneticLevel: "required", SampleOrigin: "required", AnalyticalApproach: "optional", TissueOrigin: "optional", BrainLocation: "optional", CellType: "optional" } } }, entities: ["subject", "session", "sample", "task", "tracksys", "acquisition", "ceagent", "tracer", "stain", "reconstruction", "direction", "run", "modality", "echo", "flip", "inversion", "mtransfer", "part", "processing", "hemisphere", "space", "split", "recording", "chunk", "atlas", "resolution", "density", "label", "description"], errors: { InternalError: { code: "INTERNAL_ERROR", message: "Internal error. SOME VALIDATION STEPS MAY NOT HAVE OCCURRED.\n", level: "error" }, NotIncluded: { code: "NOT_INCLUDED", message: "Files with such naming scheme are not part of BIDS specification. This error is\nmost commonly caused by typos in filenames that make them not BIDS compatible.\nPlease consult the specification and make sure your files are named correctly.\n", level: "error" }, NiftiHeaderUnreadable: { code: "NIFTI_HEADER_UNREADABLE", message: "We were unable to parse header data from this NIfTI file.\nPlease ensure it is not corrupted or mislabeled.\n", level: "error", selectors: ["match(extension, '^\\.nii(\\.gz)?$')"] }, JsonInvalid: { code: "JSON_INVALID", message: "Not a valid JSON file.\n", level: "error", selectors: ['extension == ".json"'] }, GzNotGzipped: { code: "GZ_NOT_GZIPPED", message: "This file ends in the .gz extension but is not actually gzipped.\n", level: "error", selectors: ["match(extension, '\\.gz$')"] }, BvalMultipleRows: { code: "BVAL_MULTIPLE_ROWS", message: ".bval files should contain exactly one row of volumes.\n", level: "error", selectors: ['extension == ".bval"'] }, BvecNumberRows: { code: "BVEC_NUMBER_ROWS", message: ".bvec files should contain exactly three rows of volumes.\n", level: "error", selectors: ['extension == ".bvec"'] }, NiftiTooSmall: { code: "NIFTI_TOO_SMALL", message: "This file is too small to contain the minimal NIfTI header.\n", level: "error", selectors: ["match(extension, '^\\.nii(\\.gz)?$')"] }, OrphanedSymlink: { code: "ORPHANED_SYMLINK", message: "This file appears to be an orphaned symlink.\nMake sure it correctly points to its referent.\n", level: "error" }, FileRead: { code: "FILE_READ", message: "We were unable to read this file.\nMake sure it contains data (file size > 0 kB) and is not corrupted,\nincorrectly named, or incorrectly symlinked.\n", level: "error" }, BvecRowLength: { code: "BVEC_ROW_LENGTH", message: "Each row in a .bvec file should contain the same number of values.\n", level: "error", selectors: ['extension == ".bvec"'] }, BFile: { code: "B_FILE", message: ".bval and .bvec files must be single space delimited\nand contain only numerical values.\n", level: "error", selectors: ['intersects([extension], [".bval", ".bvec"])'] }, JsonSchemaValidationError: { code: "JSON_SCHEMA_VALIDATION_ERROR", message: "Invalid JSON file. The file is not formatted according the schema.\n", level: "error", selectors: ['extension == ".json"'] }, NoValidDataFoundForSubject: { code: "NO_VALID_DATA_FOUND_FOR_SUBJECT", message: "No BIDS compatible data found for at least one subject.\n", level: "error" }, WrongNewLine: { code: "WRONG_NEW_LINE", message: "All TSV files must use Line Feed '\\n' characters to denote new lines.\nThis files uses Carriage Return '\\r'.\n", level: "error", selectors: ['extension == ".tsv"'] }, MalformedBvec: { code: "MALFORMED_BVEC", message: "The contents of this .bvec file are undefined or severely malformed.\n", level: "error", selectors: ['extension == ".bvec"'] }, MalformedBval: { code: "MALFORMED_BVAL", message: "The contents of this .bval file are undefined or severely malformed.\n", level: "error", selectors: ['extension == ".bval"'] }, SidecarWithoutDatafile: { code: "SIDECAR_WITHOUT_DATAFILE", message: "A json sidecar file was found without a corresponding data file.\n", level: "error", selectors: ['extension == ".json"'] }, MissingSession: { code: "MISSING_SESSION", message: "Not all subjects contain the same sessions.\n", level: "warning" }, InaccessibleRemoteFile: { code: "INACCESSIBLE_REMOTE_FILE", message: "This file appears to be a symlink to a remote annexed file,\nbut could not be accessed from any of the configured remotes.\n", level: "error" }, EmptyFile: { code: "EMPTY_FILE", message: "Empty files not allowed.\n", level: "error" }, BrainvisionLinksBroken: { code: "BRAINVISION_LINKS_BROKEN", message: "Internal file pointers in BrainVision file triplet (*.eeg, *.vhdr,\nand *.vmrk) are broken or some files do not exist.\n", level: "error", selectors: ['intersects([extension], [".eeg", ".vhdr", ".vmrk"])'] }, HedError: { code: "HED_ERROR", message: "The validation on this HED string returned an error.\n", level: "error", selectors: ['suffix == "events"', 'extension == ".tsv"'] }, HedWarning: { code: "HED_WARNING", message: "The validation on this HED string returned a warning.\n", level: "warning", selectors: ['suffix == "events"', 'extension == ".tsv"'] }, HedInternalError: { code: "HED_INTERNAL_ERROR", message: "An internal error occurred during HED validation.\n", level: "error", selectors: ['suffix == "events"', 'extension == ".tsv"'] }, HedInternalWarning: { code: "HED_INTERNAL_WARNING", message: "An internal warning occurred during HED validation.\n", level: "warning", selectors: ['suffix == "events"', 'extension == ".tsv"'] }, HedMissingValueInSidecar: { code: "HED_MISSING_VALUE_IN_SIDECAR", message: "The json sidecar does not contain this column value as\na possible key to a HED string.\n", level: "warning", selectors: ['suffix == "events"', 'extension == ".tsv"'] }, HedVersionNotDefined: { code: "HED_VERSION_NOT_DEFINED", message: "You should define 'HEDVersion' for this file.\nIf you don't provide this information, the HED validation will use\nthe latest version available.\n", level: "warning", selectors: ['suffix == "events"', 'extension == ".tsv"'] }, InvalidJsonEncoding: { code: "INVALID_JSON_ENCODING", message: "JSON files must be valid utf-8.\n", level: "error", selectors: ['extension == ".json"'] } }, files: { common: { core: { dataset_description: { level: "required", path: "dataset_description.json" }, CITATION: { level: "optional", path: "CITATION.cff" }, README: { level: "recommended", stem: "README", extensions: ["", ".md", ".rst", ".txt"] }, CHANGES: { level: "optional", path: "CHANGES" }, LICENSE: { level: "optional", path: "LICENSE" }, genetic_info: { level: "optional", path: "genetic_info.json" }, code: { level: "optional", path: "code" }, derivatives: { level: "optional", path: "derivatives" }, sourcedata: { level: "optional", path: "sourcedata" }, stimuli: { level: "optional", path: "stimuli" } }, tables: { participants: { level: "optional", stem: "participants", extensions: [".tsv", ".json"] }, samples: { level: "optional", stem: "samples", extensions: [".tsv", ".json"] }, scans: { level: "optional", suffixes: ["scans"], extensions: [".tsv", ".json"], entities: { subject: "required", session: "optional" } }, sessions: { level: "optional", suffixes: ["sessions"], extensions: [".tsv", ".json"], entities: { subject: "required" } } } }, deriv: { imaging: { anat_parametric_volumetric: { entities: { space: "optional", resolution: "optional", density: "optional", description: "optional", subject: "required", session: "optional", task: "optional", acquisition: "optional", ceagent: "optional", reconstruction: "optional", run: "optional" }, suffixes: ["T1map", "T2map", "T2starmap", "R1map", "R2map", "R2starmap", "PDmap", "MTRmap", "MTsat", "UNIT1", "T1rho", "MWFmap", "MTVmap", "Chimap", "S0map", "M0map"], extensions: [".nii.gz", ".nii", ".json"], datatypes: ["anat"] }, anat_nonparametric_volumetric: { entities: { space: "optional", resolution: "optional", density: "optional", description: "optional", subject: "required", session: "optional", task: "optional", acquisition: "optional", ceagent: "optional", reconstruction: "optional", run: "optional", echo: "optional", part: "optional" }, suffixes: ["T1w", "T2w", "PDw", "T2starw", "FLAIR", "inplaneT1", "inplaneT2", "PDT2", "angio", "T2star", "FLASH", "PD"], extensions: [".nii.gz", ".nii", ".json"], datatypes: ["anat"] }, dwi_volumetric: { entities: { space: "optional", resolution: "optional", density: "optional", description: "optional", subject: "required", session: "optional", acquisition: "optional", reconstruction: "optional", direction: "optional", run: "optional", part: "optional" }, suffixes: ["dwi"], extensions: [".nii.gz", ".nii", ".json", ".bvec", ".bval"], datatypes: ["dwi"] }, func_volumetric: { entities: { space: "optional", resolution: "optional", density: "optional", description: "optional", subject: "required", session: "optional", task: "required", acquisition: "optional", ceagent: "optional", reconstruction: "optional", direction: "optional", run: "optional", echo: "optional", part: "optional" }, suffixes: ["bold", "cbv", "sbref"], extensions: [".nii.gz", ".nii", ".json"], datatypes: ["func"] }, anat_parametric_mask: { suffixes: ["mask"], entities: { space: "optional", resolution: "optional", density: "optional", label: "optional", description: "optional", subject: "required", session: "optional", task: "optional", acquisition: "optional", ceagent: "optional", reconstruction: "optional", run: "optional" }, extensions: [".nii.gz", ".nii", ".json"], datatypes: ["anat"] }, anat_nonparametric_mask: { suffixes: ["mask"], entities: { space: "optional", resolution: "optional", density: "optional", label: "optional", description: "optional", subject: "required", session: "optional", task: "optional", acquisition: "optional", ceagent: "optional", reconstruction: "optional", run: "optional", echo: "optional", part: "optional" }, extensions: [".nii.gz", ".nii", ".json"], datatypes: ["anat"] }, dwi_mask: { suffixes: ["mask"], entities: { space: "optional", resolution: "optional", density: "optional", label: "optional", description: "optional", subject: "required", session: "optional", acquisition: "optional", reconstruction: "optional", direction: "optional", run: "optional", part: "optional" }, extensions: [".nii.gz", ".nii", ".json", ".bvec", ".bval"], datatypes: ["dwi"] }, func_mask: { suffixes: ["mask"], entities: { space: "optional", resolution: "optional", density: "optional", label: "optional", description: "optional", subject: "required", session: "optional", task: "required", acquisition: "optional", ceagent: "optional", reconstruction: "optional", direction: "optional", run: "optional", echo: "optional", part: "optional" }, extensions: [".nii.gz", ".nii", ".json"], datatypes: ["func"] }, anat_parametric_discrete_segmentation: { suffixes: ["dseg"], entities: { space: "optional", resolution: "optional", density: "optional", description: "optional", subject: "required", session: "optional", task: "optional", acquisition: "optional", ceagent: "optional", reconstruction: "optional", run: "optional" }, extensions: [".nii.gz", ".nii", ".json", ".tsv"], datatypes: ["anat"] }, anat_nonparametric_discrete_segmentation: { suffixes: ["dseg"], entities: { space: "optional", resolution: "optional", density: "optional", description: "optional", subject: "required", session: "optional", task: "optional", acquisition: "optional", ceagent: "optional", reconstruction: "optional", run: "optional", echo: "optional", part: "optional" }, extensions: [".nii.gz", ".nii", ".json", ".tsv"], datatypes: ["anat"] }, func_discrete_segmentation: { suffixes: ["dseg"], entities: { space: "optional", resolution: "optional", density: "optional", description: "optional", subject: "required", session: "optional", task: "required", acquisition: "optional", ceagent: "optional", reconstruction: "optional", direction: "optional", run: "optional", echo: "optional", part: "optional" }, extensions: [".nii.gz", ".nii", ".json"], datatypes: ["func"] }, dwi_discrete_segmentation: { suffixes: ["dseg"], entities: { space: "optional", resolution: "optional", density: "optional", description: "optional", subject: "required", session: "optional", acquisition: "optional", reconstruction: "optional", direction: "optional", run: "optional", part: "optional" }, extensions: [".nii.gz", ".nii", ".json", ".bvec", ".bval"], datatypes: ["dwi"] }, anat_parametric_probabilistic_segmentation: { suffixes: ["probseg"], entities: { space: "optional", resolution: "optional", density: "optional", label: "optional", description: "optional", subject: "required", session: "optional", task: "optional", acquisition: "optional", ceagent: "optional", reconstruction: "optional", run: "optional" }, extensions: [".nii.gz", ".nii", ".json"], datatypes: ["anat"] }, anat_nonparametric_probabilistic_segmentation: { suffixes: ["probseg"], entities: { space: "optional", resolution: "optional", density: "optional", label: "optional", description: "optional", subject: "required", session: "optional", task: "optional", acquisition: "optional", ceagent: "optional", reconstruction: "optional", run: "optional", echo: "optional", part: "optional" }, extensions: [".nii.gz", ".nii", ".json"], datatypes: ["anat"] }, func_probabilistic_segmentation: { suffixes: ["probseg"], entities: { space: "optional", resolution: "optional", density: "optional", label: "optional", description: "optional", subject: "required", session: "optional", task: "required", acquisition: "optional", ceagent: "optional", reconstruction: "optional", direction: "optional", run: "optional", echo: "optional", part: "optional" }, extensions: [".nii.gz", ".nii", ".json"], datatypes: ["func"] }, dwi_probabilistic_segmentation: { suffixes: ["probseg"], entities: { space: "optional", resolution: "optional", density: "optional", label: "optional", description: "optional", subject: "required", session: "optional", acquisition: "optional", reconstruction: "optional", direction: "optional", run: "optional", part: "optional" }, extensions: [".nii.gz", ".nii", ".json", ".bvec", ".bval"], datatypes: ["dwi"] }, anat_parametic_discrete_surface: { suffixes: ["dseg"], extensions: [".label.gii", ".dlabel.nii", ".json", ".tsv"], entities: { hemisphere: "optional", space: "optional", resolution: "optional", density: "optional", description: "optional", subject: "required", session: "optional", task: "optional", acquisition: "optional", ceagent: "optional", reconstruction: "optional", run: "optional" }, datatypes: ["anat"] }, anat_nonparametic_discrete_surface: { suffixes: ["dseg"], extensions: [".label.gii", ".dlabel.nii", ".json", ".tsv"], entities: { hemisphere: "optional", space: "optional", resolution: "optional", density: "optional", description: "optional", subject: "required", session: "optional", task: "optional", acquisition: "optional", ceagent: "optional", reconstruction: "optional", run: "optional", echo: "optional", part: "optional" }, datatypes: ["anat"] } }, preprocessed_data: { anat_nonparametric_common: { entities: { space: "optional", description: "optional", subject: "required", session: "optional", task: "optional", acquisition: "optional", ceagent: "optional", reconstruction: "optional", run: "optional", echo: "optional", part: "optional" }, suffixes: ["T1w", "T2w", "PDw", "T2starw", "FLAIR", "inplaneT1", "inplaneT2", "PDT2", "angio", "T2star", "FLASH", "PD"], extensions: [".nii.gz", ".nii", ".json"], datatypes: ["anat"] }, anat_parametric_common: { entities: { space: "optional", description: "optional", subject: "required", session: "optional", task: "optional", acquisition: "optional", ceagent: "optional", reconstruction: "optional", run: "optional" }, suffixes: ["T1map", "T2map", "T2starmap", "R1map", "R2map", "R2starmap", "PDmap", "MTRmap", "MTsat", "UNIT1", "T1rho", "MWFmap", "MTVmap", "Chimap", "S0map", "M0map"], extensions: [".nii.gz", ".nii", ".json"], datatypes: ["anat"] }, anat_defacemask_common: { entities: { space: "optional", description: "optional", subject: "required", session: "optional", task: "optional", acquisition: "optional", ceagent: "optional", reconstruction: "optional", run: "optional", modality: "optional" }, suffixes: ["defacemask"], extensions: [".nii.gz", ".nii", ".json"], datatypes: ["anat"] }, anat_multiecho_common: { entities: { space: "optional", description: "optional", subject: "required", session: "optional", task: "optional", acquisition: "optional", ceagent: "optional", reconstruction: "optional", run: "optional", echo: "required", part: "optional" }, suffixes: ["MESE", "MEGRE"], extensions: [".nii.gz", ".nii", ".json"], datatypes: ["anat"] }, anat_multiflip_common: { entities: { space: "optional", description: "optional", subject: "required", session: "optional", task: "optional", acquisition: "optional", ceagent: "optional", reconstruction: "optional", run: "optional", echo: "optional", flip: "required", part: "optional" }, suffixes: ["VFA"], extensions: [".nii.gz", ".nii", ".json"], datatypes: ["anat"] }, anat_multiinversion_common: { entities: { space: "optional", description: "optional", subject: "required", session: "optional", task: "optional", acquisition: "optional", ceagent: "optional", reconstruction: "optional", run: "optional", inversion: "required", part: "optional" }, suffixes: ["IRT1"], extensions: [".nii.gz", ".nii", ".json"], datatypes: ["anat"] }, anat_mp2rage_common: { entities: { space: "optional", description: "optional", subject: "required", session: "optional", task: "optional", acquisition: "optional", ceagent: "optional", reconstruction: "optional", run: "optional", echo: "optional", flip: "optional", inversion: "required", part: "optional" }, suffixes: ["MP2RAGE"], extensions: [".nii.gz", ".nii", ".json"], datatypes: ["anat"] }, anat_vfamt_common: { entities: { space: "optional", description: "optional", subject: "required", session: "optional", task: "optional", acquisition: "optional", ceagent: "optional", reconstruction: "optional", run: "optional", echo: "optional", flip: "required", mtransfer: "required", part: "optional" }, suffixes: ["MPM", "MTS"], extensions: [".nii.gz", ".nii", ".json"], datatypes: ["anat"] }, anat_mtr_common: { entities: { space: "optional", description: "optional", subject: "required", session: "optional", task: "optional", acquisition: "optional", ceagent: "optional", reconstruction: "optional", run: "optional", mtransfer: "required", part: "optional" }, suffixes: ["MTR"], extensions: [".nii.gz", ".nii", ".json"], datatypes: ["anat"] }, beh_noncontinuous_common: { entities: { space: "optional", description: "optional", subject: "required", session: "optional", task: "required", acquisition: "optional", run: "optional" }, suffixes: ["beh"], extensions: [".tsv", ".json"], datatypes: ["beh"] }, dwi_dwi_common: { entities: { space: "optional", description: "optional", subject: "required", session: "optional", acquisition: "optional", reconstruction: "optional", direction: "optional", run: "optional", part: "optional" }, suffixes: ["dwi"], extensions: [".nii.gz", ".nii", ".json", ".bvec", ".bval"], datatypes: ["dwi"] }, dwi_sbref_common: { entities: { space: "optional", description: "optional", subject: "required", session: "optional", acquisition: "optional", reconstruction: "optional", direction: "optional", run: "optional", part: "optional" }, suffixes: ["sbref"], extensions: [".nii.gz", ".nii", ".json"], datatypes: ["dwi"] }, eeg_eeg_common: { entities: { space: "optional", description: "optional", subject: "required", session: "optional", task: "required", acquisition: "optional", run: "optional" }, suffixes: ["eeg"], extensions: [".json", ".edf", ".vhdr", ".vmrk", ".eeg", ".set", ".fdt", ".bdf"], datatypes: ["eeg"] }, fmap_fieldmaps_common: { entities: { space: "optional", description: "optional", subject: "required", session: "optional", acquisition: "optional", run: "optional" }, suffixes: ["phasediff", "phase1", "phase2", "magnitude1", "magnitude2", "magnitude", "fieldmap"], extensions: [".nii.gz", ".nii", ".json"], datatypes: ["fmap"] }, fmap_pepolar_common: { entities: { space: "optional", description: "optional", subject: "required", session: "optional", acquisition: "optional", ceagent: "optional", direction: "required", run: "optional" }, suffixes: ["epi", "m0scan"], extensions: [".nii.gz", ".nii", ".json"], datatypes: ["fmap"] }, fmap_TB1DAM_common: { entities: { space: "optional", description: "optional", subject: "required", session: "optional", acquisition: "optional", ceagent: "optional", reconstruction: "optional", run: "optional", flip: "required", inversion: "optional", part: "optional" }, suffixes: ["TB1DAM"], extensions: [".nii.gz", ".nii", ".json"], datatypes: ["fmap"] }, fmap_TB1EPI_common: { entities: { space: "optional", description: "optional", subject: "required", session: "optional", acquisition: "optional", ceagent: "optional", reconstruction: "optional", run: "optional", echo: "required", flip: "required", inversion: "optional", part: "optional" }, suffixes: ["TB1EPI"], extensions: [".nii.gz", ".nii", ".json"], datatypes: ["fmap"] }, fmap_RFFieldMaps_common: { entities: { space: "optional", description: "optional", subject: "required", session: "optional", acquisition: "optional", ceagent: "optional", reconstruction: "optional", run: "optional", echo: "optional", flip: "optional", inversion: "optional", part: "optional" }, suffixes: ["TB1AFI", "TB1TFL", "TB1RFM", "RB1COR"], extensions: [".nii.gz", ".nii", ".json"], datatypes: ["fmap"] }, fmap_TB1SRGE_common: { entities: { space: "optional", description: "optional", subject: "required", session: "optional", acquisition: "optional", ceagent: "optional", reconstruction: "optional", run: "optional", echo: "optional", flip: "required", inversion: "required", part: "optional" }, suffixes: ["TB1SRGE"], extensions: [".nii.gz", ".nii", ".json"], datatypes: ["fmap"] }, fmap_parametric_common: { entities: { space: "optional", description: "optional", subject: "required", session: "optional", acquisition: "optional", ceagent: "optional", reconstruction: "optional", run: "optional" }, suffixes: ["TB1map", "RB1map"], extensions: [".nii.gz", ".nii", ".json"], datatypes: ["fmap"] }, func_func_common: { entities: { space: "optional", description: "optional", subject: "required", session: "optional", task: "required", acquisition: "optional", ceagent: "optional", reconstruction: "optional", direction: "optional", run: "optional", echo: "optional", part: "optional" }, suffixes: ["bold", "cbv", "sbref"], extensions: [".nii.gz", ".nii", ".json"], datatypes: ["func"] }, func_phase_common: { entities: { space: "optional", description: "optional", subject: "required", session: "optional", task: "required", acquisition: "optional", ceagent: "optional", reconstruction: "optional", direction: "optional", run: "optional", echo: "optional" }, suffixes: ["phase"], extensions: [".nii.gz", ".nii", ".json"], datatypes: ["func"] }, ieeg_ieeg_common: { entities: { space: "optional", description: "optional", subject: "required", session: "optional", task: "required", acquisition: "optional", run: "optional" }, suffixes: ["ieeg"], extensions: [".mefd/", ".json", ".edf", ".vhdr", ".eeg", ".vmrk", ".set", ".fdt", ".nwb"], datatypes: ["ieeg"] }, meg_meg_common: { entities: { space: "optional", description: "optional", subject: "required", session: "optional", task: "required", acquisition: "optional", run: "optional", processing: "optional", split: "optional" }, suffixes: ["meg"], extensions: ["/", ".ds/", ".json", ".fif", ".sqd", ".con", ".raw", ".ave", ".mrk", ".kdf", ".mhd", ".trg", ".chn"], datatypes: ["meg"] }, meg_calibration_common: { entities: { space: "optional", description: "optional", subject: "required", session: "optional", acquisition: { level: "required", enum: ["calibration"] } }, suffixes: ["meg"], extensions: [".dat"], datatypes: ["meg"] }, meg_crosstalk_common: { entities: { space: "optional", description: "optional", subject: "required", session: "optional", acquisition: { level: "required", enum: ["crosstalk"] } }, suffixes: ["meg"], extensions: [".fif"], datatypes: ["meg"] }, meg_headshape_common: { entities: { space: "optional", description: "optional", subject: "required", session: "optional", acquisition: "optional" }, suffixes: ["headshape"], extensions: [".*", ".pos"], datatypes: ["meg"] }, meg_markers_common: { entities: { space: "optional", description: "optional", subject: "required", session: "optional", task: "optional", acquisition: "optional" }, suffixes: ["markers"], extensions: [".sqd", ".mrk"], datatypes: ["meg"] }, micr_microscopy_common: { entities: { space: "optional", description: "optional", subject: "required", session: "optional", sample: "required", acquisition: "optional", stain: "optional", run: "optional", chunk: "optional" }, suffixes: ["TEM", "SEM", "uCT", "BF", "DF", "PC", "DIC", "FLUO", "CONF", "PLI", "CARS", "2PE", "MPE", "SR", "NLO", "OCT", "SPIM"], extensions: [".ome.tif", ".ome.btf", ".ome.zarr/", ".png", ".tif", ".json"], datatypes: ["micr"] }, perf_asl_common: { entities: { space: "optional", description: "optional", subject: "required", session: "optional", acquisition: "optional", reconstruction: "optional", direction: "optional", run: "optional" }, suffixes: ["asl", "m0scan"], extensions: [".nii.gz", ".nii", ".json"], datatypes: ["perf"] }, pet_pet_common: { entities: { space: "optional", description: "optional", subject: "required", session: "optional", task: "optional", tracer: "optional", reconstruction: "optional", run: "optional" }, suffixes: ["pet"], extensions: [".nii.gz", ".nii", ".json"], datatypes: ["pet"] }, pet_blood_common: { entities: { space: "optional", description: "optional", subject: "required", session: "optional", task: "optional", tracer: "optional", reconstruction: "optional", run: "optional", recording: "required" }, suffixes: ["blood"], extensions: [".tsv", ".json"], datatypes: ["pet"] } } }, raw: { anat: { nonparametric: { suffixes: ["T1w", "T2w", "PDw", "T2starw", "FLAIR", "inplaneT1", "inplaneT2", "PDT2", "angio", "T2star", "FLASH", "PD"], extensions: [".nii.gz", ".nii", ".json"], datatypes: ["anat"], entities: { subject: "required", session: "optional", task: "optional", acquisition: "optional", ceagent: "optional", reconstruction: "optional", run: "optional", echo: "optional", part: "optional" } }, parametric: { suffixes: ["T1map", "T2map", "T2starmap", "R1map", "R2map", "R2starmap", "PDmap", "MTRmap", "MTsat", "UNIT1", "T1rho", "MWFmap", "MTVmap", "Chimap", "S0map", "M0map"], extensions: [".nii.gz", ".nii", ".json"], datatypes: ["anat"], entities: { subject: "required", session: "optional", task: "optional", acquisition: "optional", ceagent: "optional", reconstruction: "optional", run: "optional" } }, defacemask: { suffixes: ["defacemask"], extensions: [".nii.gz", ".nii", ".json"], datatypes: ["anat"], entities: { subject: "required", session: "optional", task: "optional", acquisition: "optional", ceagent: "optional", reconstruction: "optional", run: "optional", modality: "optional" } }, multiecho: { suffixes: ["MESE", "MEGRE"], extensions: [".nii.gz", ".nii", ".json"], datatypes: ["anat"], entities: { subject: "required", session: "optional", task: "optional", acquisition: "optional", ceagent: "optional", reconstruction: "optional", run: "optional", echo: "required", part: "optional" } }, multiflip: { suffixes: ["VFA"], extensions: [".nii.gz", ".nii", ".json"], datatypes: ["anat"], entities: { subject: "required", session: "optional", task: "optional", acquisition: "optional", ceagent: "optional", reconstruction: "optional", run: "optional", echo: "optional", flip: "required", part: "optional" } }, multiinversion: { suffixes: ["IRT1"], extensions: [".nii.gz", ".nii", ".json"], datatypes: ["anat"], entities: { subject: "required", session: "optional", task: "optional", acquisition: "optional", ceagent: "optional", reconstruction: "optional", run: "optional", inversion: "required", part: "optional" } }, mp2rage: { suffixes: ["MP2RAGE"], extensions: [".nii.gz", ".nii", ".json"], datatypes: ["anat"], entities: { subject: "required", session: "optional", task: "optional", acquisition: "optional", ceagent: "optional", reconstruction: "optional", run: "optional", echo: "optional", flip: "optional", inversion: "required", part: "optional" } }, vfamt: { suffixes: ["MPM", "MTS"], extensions: [".nii.gz", ".nii", ".json"], datatypes: ["anat"], entities: { subject: "required", session: "optional", task: "optional", acquisition: "optional", ceagent: "optional", reconstruction: "optional", run: "optional", echo: "optional", flip: "required", mtransfer: "required", part: "optional" } }, mtr: { suffixes: ["MTR"], extensions: [".nii.gz", ".nii", ".json"], datatypes: ["anat"], entities: { subject: "required", session: "optional", task: "optional", acquisition: "optional", ceagent: "optional", reconstruction: "optional", run: "optional", mtransfer: "required", part: "optional" } } }, beh: { noncontinuous: { suffixes: ["beh"], extensions: [".tsv", ".json"], datatypes: ["beh"], entities: { subject: "required", session: "optional", task: "required", acquisition: "optional", run: "optional" } } }, channels: { channels: { suffixes: ["channels"], extensions: [".json", ".tsv"], datatypes: ["eeg", "ieeg", "nirs"], entities: { subject: "required", session: "optional", task: "required", acquisition: "optional", run: "optional" } }, channels__meg: { datatypes: ["meg"], entities: { processing: "optional", subject: "required", session: "optional", task: "required", acquisition: "optional", run: "optional" }, suffixes: ["channels"], extensions: [".json", ".tsv"] }, channels__motion: { datatypes: ["motion"], entities: { tracksys: "required", subject: "required", session: "optional", task: "required", acquisition: "optional", run: "optional" }, suffixes: ["channels"], extensions: [".json", ".tsv"] }, coordsystem: { suffixes: ["coordsystem"], extensions: [".json"], datatypes: ["meg", "nirs"], entities: { subject: "required", session: "optional", acquisition: "optional" } }, coordsystem__eeg: { datatypes: ["eeg", "ieeg"], entities: { space: "optional", subject: "required", session: "optional", acquisition: "optional" }, suffixes: ["coordsystem"], extensions: [".json"] }, electrodes: { suffixes: ["electrodes"], extensions: [".json", ".tsv"], datatypes: ["eeg", "ieeg"], entities: { subject: "required", session: "optional", acquisition: "optional", space: "optional" } }, electrodes__meg: { datatypes: ["meg"], entities: { processing: "optional", subject: "required", session: "optional", acquisition: "optional", space: "optional" }, suffixes: ["electrodes"], extensions: [".json", ".tsv"] }, optodes: { suffixes: ["optodes"], extensions: [".tsv", ".json"], datatypes: ["nirs"], entities: { subject: "required", session: "optional", acquisition: "optional" } } }, dwi: { dwi: { suffixes: ["dwi"], extensions: [".nii.gz", ".nii", ".json", ".bvec", ".bval"], datatypes: ["dwi"], entities: { subject: "required", session: "optional", acquisition: "optional", reconstruction: "optional", direction: "optional", run: "optional", part: "optional" } }, sbref: { suffixes: ["sbref"], extensions: [".nii.gz", ".nii", ".json"], datatypes: ["dwi"], entities: { subject: "required", session: "optional", acquisition: "optional", reconstruction: "optional", direction: "optional", run: "optional", part: "optional" } } }, eeg: { eeg: { suffixes: ["eeg"], extensions: [".json", ".edf", ".vhdr", ".vmrk", ".eeg", ".set", ".fdt", ".bdf"], datatypes: ["eeg"], entities: { subject: "required", session: "optional", task: "required", acquisition: "optional", run: "optional" } } }, fmap: { fieldmaps: { suffixes: ["phasediff", "phase1", "phase2", "magnitude1", "magnitude2", "magnitude", "fieldmap"], extensions: [".nii.gz", ".nii", ".json"], datatypes: ["fmap"], entities: { subject: "required", session: "optional", acquisition: "optional", run: "optional" } }, pepolar: { suffixes: ["epi", "m0scan"], extensions: [".nii.gz", ".nii", ".json"], datatypes: ["fmap"], entities: { subject: "required", session: "optional", acquisition: "optional", ceagent: "optional", direction: "required", run: "optional" } }, TB1DAM: { suffixes: ["TB1DAM"], extensions: [".nii.gz", ".nii", ".json"], datatypes: ["fmap"], entities: { subject: "required", session: "optional", acquisition: "optional", ceagent: "optional", reconstruction: "optional", run: "optional", flip: "required", inversion: "optional", part: "optional" } }, TB1EPI: { suffixes: ["TB1EPI"], extensions: [".nii.gz", ".nii", ".json"], datatypes: ["fmap"], entities: { subject: "required", session: "optional", acquisition: "optional", ceagent: "optional", reconstruction: "optional", run: "optional", echo: "required", flip: "required", inversion: "optional", part: "optional" } }, RFFieldMaps: { suffixes: ["TB1AFI", "TB1TFL", "TB1RFM", "RB1COR"], extensions: [".nii.gz", ".nii", ".json"], datatypes: ["fmap"], entities: { subject: "required", session: "optional", acquisition: "optional", ceagent: "optional", reconstruction: "optional", run: "optional", echo: "optional", flip: "optional", inversion: "optional", part: "optional" } }, TB1SRGE: { suffixes: ["TB1SRGE"], extensions: [".nii.gz", ".nii", ".json"], datatypes: ["fmap"], entities: { subject: "required", session: "optional", acquisition: "optional", ceagent: "optional", reconstruction: "optional", run: "optional", echo: "optional", flip: "required", inversion: "required", part: "optional" } }, parametric: { suffixes: ["TB1map", "RB1map"], extensions: [".nii.gz", ".nii", ".json"], datatypes: ["fmap"], entities: { subject: "required", session: "optional", acquisition: "optional", ceagent: "optional", reconstruction: "optional", run: "optional" } } }, func: { func: { suffixes: ["bold", "cbv", "sbref"], extensions: [".nii.gz", ".nii", ".json"], datatypes: ["func"], entities: { subject: "required", session: "optional", task: "required", acquisition: "optional", ceagent: "optional", reconstruction: "optional", direction: "optional", run: "optional", echo: "optional", part: "optional" } }, phase: { suffixes: ["phase"], extensions: [".nii.gz", ".nii", ".json"], datatypes: ["func"], entities: { subject: "required", session: "optional", task: "required", acquisition: "optional", ceagent: "optional", reconstruction: "optional", direction: "optional", run: "optional", echo: "optional" } } }, ieeg: { ieeg: { suffixes: ["ieeg"], extensions: [".mefd/", ".json", ".edf", ".vhdr", ".eeg", ".vmrk", ".set", ".fdt", ".nwb"], datatypes: ["ieeg"], entities: { subject: "required", session: "optional", task: "required", acquisition: "optional", run: "optional" } } }, meg: { meg: { suffixes: ["meg"], extensions: ["/", ".ds/", ".json", ".fif", ".sqd", ".con", ".raw", ".ave", ".mrk", ".kdf", ".mhd", ".trg", ".chn"], datatypes: ["meg"], entities: { subject: "required", session: "optional", task: "required", acquisition: "optional", run: "optional", processing: "optional", split: "optional" } }, calibration: { suffixes: ["meg"], extensions: [".dat"], datatypes: ["meg"], entities: { subject: "required", session: "optional", acquisition: { level: "required", enum: ["calibration"] } } }, crosstalk: { suffixes: ["meg"], extensions: [".fif"], datatypes: ["meg"], entities: { subject: "required", session: "optional", acquisition: { level: "required", enum: ["crosstalk"] } } }, headshape: { suffixes: ["headshape"], extensions: [".*", ".pos"], datatypes: ["meg"], entities: { subject: "required", session: "optional", acquisition: "optional" } }, markers: { suffixes: ["markers"], extensions: [".sqd", ".mrk"], datatypes: ["meg"], entities: { subject: "required", session: "optional", task: "optional", acquisition: "optional", space: "optional" } } }, micr: { microscopy: { suffixes: ["TEM", "SEM", "uCT", "BF", "DF", "PC", "DIC", "FLUO", "CONF", "PLI", "CARS", "2PE", "MPE", "SR", "NLO", "OCT", "SPIM"], extensions: [".ome.tif", ".ome.btf", ".ome.zarr/", ".png", ".tif", ".json"], datatypes: ["micr"], entities: { subject: "required", session: "optional", sample: "required", acquisition: "optional", stain: "optional", run: "optional", chunk: "optional" } } }, motion: { motion: { suffixes: ["motion"], extensions: [".tsv", ".json"], datatypes: ["motion"], entities: { subject: "required", session: "optional", task: "required", tracksys: "required", acquisition: "optional", run: "optional" } } }, nirs: { nirs: { suffixes: ["nirs"], extensions: [".snirf", ".json"], datatypes: ["nirs"], entities: { subject: "required", session: "optional", task: "required", acquisition: "optional", run: "optional" } } }, perf: { asl: { suffixes: ["asl", "m0scan"], extensions: [".nii.gz", ".nii", ".json"], datatypes: ["perf"], entities: { subject: "required", session: "optional", acquisition: "optional", reconstruction: "optional", direction: "optional", run: "optional" } }, aslcontext: { suffixes: ["aslcontext"], extensions: [".tsv"], datatypes: ["perf"], entities: { subject: "required", session: "optional", acquisition: "optional", reconstruction: "optional", direction: "optional", run: "optional" } }, asllabeling: { suffixes: ["asllabeling"], extensions: [".jpg", ".png", ".tif"], datatypes: ["perf"], entities: { subject: "required", session: "optional", acquisition: "optional", reconstruction: "optional", run: "optional" } } }, pet: { pet: { suffixes: ["pet"], extensions: [".nii.gz", ".nii", ".json"], datatypes: ["pet"], entities: { subject: "required", session: "optional", task: "optional", tracer: "optional", reconstruction: "optional", run: "optional" } }, blood: { suffixes: ["blood"], extensions: [".tsv", ".json"], datatypes: ["pet"], entities: { subject: "required", session: "optional", task: "optional", tracer: "optional", reconstruction: "optional", run: "optional", recording: "required" } } }, photo: { photo: { suffixes: ["photo"], extensions: [".jpg", ".png", ".tif"], datatypes: ["eeg", "ieeg", "meg", "nirs"], entities: { subject: "required", session: "optional", acquisition: "optional" } }, photo__micr: { extensions: [".jpg", ".png", ".tif", ".json"], datatypes: ["micr"], entities: { sample: "required", subject: "required", session: "optional", acquisition: "optional" }, suffixes: ["photo"] } }, task: { events: { suffixes: ["events"], extensions: [".tsv", ".json"], datatypes: ["beh", "eeg", "ieeg", "meg", "nirs"], entities: { subject: "required", session: "optional", task: "required", acquisition: "optional", run: "optional" } }, timeseries: { suffixes: ["physio", "stim"], extensions: [".tsv.gz", ".json"], datatypes: ["beh", "eeg", "ieeg", "nirs"], entities: { subject: "required", session: "optional", task: "required", acquisition: "optional", run: "optional", recording: "optional" } }, events__mri: { datatypes: ["func"], entities: { ceagent: "optional", reconstruction: "optional", direction: "optional", subject: "required", session: "optional", task: "required", acquisition: "optional", run: "optional" }, suffixes: ["events"], extensions: [".tsv", ".json"] }, events__motion: { datatypes: ["motion"], entities: { tracksys: "optional", subject: "required", session: "optional", task: "required", acquisition: "optional", run: "optional" }, suffixes: ["events"], extensions: [".tsv", ".json"] }, events__pet: { datatypes: ["pet"], entities: { subject: "required", session: "optional", task: "required", tracer: "optional", reconstruction: "optional", run: "optional" }, suffixes: ["events"], extensions: [".tsv", ".json"] }, timeseries__mri: { datatypes: ["dwi", "perf"], entities: { reconstruction: "optional", direction: "optional", subject: "required", session: "optional", task: "required", acquisition: "optional", run: "optional", recording: "optional" }, suffixes: ["physio", "stim"], extensions: [".tsv.gz", ".json"] }, timeseries__func: { datatypes: ["func"], entities: { ceagent: "optional", reconstruction: "optional", direction: "optional", subject: "required", session: "optional", task: "required", acquisition: "optional", run: "optional", recording: "optional" }, suffixes: ["physio", "stim"], extensions: [".tsv.gz", ".json"] }, timeseries__meg: { datatypes: ["meg"], entities: { processing: "optional", subject: "required", session: "optional", task: "required", acquisition: "optional", run: "optional", recording: "optional" }, suffixes: ["physio", "stim"], extensions: [".tsv.gz", ".json"] }, timeseries__motion: { datatypes: ["motion"], entities: { tracksys: "optional", subject: "required", session: "optional", task: "required", acquisition: "optional", run: "optional", recording: "optional" }, suffixes: ["physio", "stim"], extensions: [".tsv.gz", ".json"] }, timeseries__pet: { datatypes: ["pet"], entities: { subject: "required", session: "optional", task: "required", tracer: "optional", reconstruction: "optional", run: "optional", recording: "optional" }, suffixes: ["physio", "stim"], extensions: [".tsv.gz", ".json"] } } } }, modalities: { mri: { datatypes: ["anat", "dwi", "fmap", "func", "perf"] }, eeg: { datatypes: ["eeg"] }, ieeg: { datatypes: ["ieeg"] }, meg: { datatypes: ["meg"] }, beh: { datatypes: ["beh"] }, pet: { datatypes: ["pet"] }, micr: { datatypes: ["micr"] }, motion: { datatypes: ["motion"] }, nirs: { datatypes: ["nirs"] } }, sidecars: { anat: { MRIAnatomyCommonMetadataFields: { selectors: ['datatype == "anat"', 'match(extension, "^\\.nii(\\.gz)?$")'], fields: { ContrastBolusIngredient: "optional", RepetitionTimeExcitation: "optional", RepetitionTimePreparation: "optional" } }, TaskMetadata: { selectors: ['datatype == "anat"', "entity.task != null", 'match(extension, "^\\.nii(\\.gz)?$")'], fields: { TaskName: { level: "recommended", level_addendum: "if `task` entity is present" }, TaskDescription: { level: "recommended", level_addendum: "if `task` entity is present" }, Instructions: { level: "recommended", level_addendum: "if `task` entity is present" } } } }, asl: { MRIASLTextOnly: { selectors: ['datatype == "perf"', 'intersects([suffix], ["asl", "m0scan"])'], fields: { RepetitionTimePreparation: "required" } }, MRIASLCommonMetadataFields: { selectors: ['datatype == "perf"', 'suffix == "asl"'], fields: { ArterialSpinLabelingType: "required", PostLabelingDelay: "required", BackgroundSuppression: "required", M0Type: "required", TotalAcquiredPairs: "required", VascularCrushing: "recommended", AcquisitionVoxelSize: "recommended", LabelingOrientation: "recommended", LabelingDistance: "recommended", LabelingLocationDescription: "recommended", LookLocker: "optional", LabelingEfficiency: "optional" } }, MRIASLCommonMetadataFieldsM0TypeRec: { selectors: ['datatype == "perf"', 'suffix == "asl"', 'sidecar.M0Type != "Estimate"'], fields: { M0Estimate: { level: "optional", level_addendum: "required if `M0Type` is `Estimate`" } } }, MRIASLCommonMetadataFieldsM0TypeReq: { selectors: ['datatype == "perf"', 'suffix == "asl"', 'sidecar.M0Type == "Estimate"'], fields: { M0Estimate: { level: "required", issue: { code: "M0ESTIMATE_NOT_DEFINED", message: "You must define `M0Estimate` for this file, because `M0Type` is set to\n'Estimate'. `M0Estimate` is a single numerical whole-brain M0 value\n(referring to the M0 of blood), only if obtained externally (for example\nretrieved from CSF in a separate measurement).\n" } } } }, MRIASLCommonMetadataFieldsBackgroundSuppressionOpt: { selectors: ['datatype == "perf"', 'suffix == "asl"', "sidecar.BackgroundSuppression == false"], fields: { BackgroundSuppressionNumberPulses: { level: "optional", level_addendum: "recommended if `BackgroundSuppression` is `true`" }, BackgroundSuppressionPulseTime: { level: "optional", level_addendum: "recommended if `BackgroundSuppression` is `true`" } } }, MRIASLCommonMetadataFieldsBackgroundSuppressionReq: { selectors: ['datatype == "perf"', 'suffix == "asl"', "sidecar.BackgroundSuppression == true"], fields: { BackgroundSuppressionNumberPulses: "recommended", BackgroundSuppressionPulseTime: "recommended" } }, MRIASLCommonMetadataFieldsVascularCrushingOpt: { selectors: ['datatype == "perf"', 'suffix == "asl"', "sidecar.VascularCrushing == false"], fields: { VascularCrushingVENC: { level: "optional", level_addendum: "recommended if `VascularCrushing` is `true`" } } }, MRIASLCommonMetadataFieldsVascularCrushingRec: { selectors: ['datatype == "perf"', 'suffix == "asl"', "sidecar.VascularCrushing == true"], fields: { VascularCrushingVENC: "recommended" } }, MRIASLCaslPcaslSpecific: { selectors: ['datatype == "perf"', 'suffix == "asl"', 'intersects([sidecar.ArterialSpinLabelingType], ["CASL", "PCASL"])'], fields: { LabelingDuration: "required", LabelingPulseAverageGradient: "recommended", LabelingPulseMaximumGradient: "recommended", LabelingPulseAverageB1: "recommended", LabelingPulseDuration: "recommended", LabelingPulseFlipAngle: "recommended", LabelingPulseInterval: "recommended" } }, MRIASLPcaslSpecific: { selectors: ['datatype == "perf"', 'suffix == "asl"', 'sidecar.ArterialSpinLabelingType == "PCASL"'], fields: { PCASLType: { level: "recommended", level_addendum: 'if `ArterialSpinLabelingType` is `"PCASL"`' } } }, MRIASLCaslSpecific: { selectors: ['datatype == "perf"', 'suffix == "asl"', 'sidecar.ArterialSpinLabelingType == "CASL"'], fields: { CASLType: { level: "recommended", level_addendum: 'if `ArterialSpinLabelingType` is `"CASL"`' } } }, MRIASLPaslSpecific: { selectors: ['datatype == "perf"', 'suffix == "asl"', 'sidecar.ArterialSpinLabelingType == "PASL"'], fields: { BolusCutOffFlag: "required", PASLType: "recommended", LabelingSlabThickness: "recommended" } }, MRIASLPASLSpecificBolusCutOffFlagFalse: { selectors: ['datatype == "perf"', 'suffix == "asl"', 'sidecar.ArterialSpinLabelingType == "PASL"', "sidecar.BolusCutOffFlag == false"], fields: { BolusCutOffDelayTime: { level: "optional", level_addendum: "required if `BolusCutOffFlag` is `true`" }, BolusCutOffTechnique: { level: "optional", level_addendum: "required if `BolusCutOffFlag` is `true`" } } }, MRIASLPaslSpecificBolusCutOffFlagTrue: { selectors: ['datatype == "perf"', 'suffix == "asl"', 'sidecar.ArterialSpinLabelingType == "PASL"', "sidecar.BolusCutOffFlag == true"], fields: { BolusCutOffDelayTime: { level: "required", issue: { code: "PASL_BOLUS_CUT_OFF_DELAY_TIME", message: "It is required to define 'BolusCutOffDelayTime' for this file,\nwhen 'BolusCutOffFlag' is set to true. 'BolusCutOffDelayTime' is\nthe duration between the end of the labeling and the start of the\nbolus cut-off saturation pulse(s), in seconds. This can be a number\nor array of numbers, of which the values must be non-negative and\nmonotonically increasing, depending on the number of bolus cut-off\nsaturation pulses. For Q2TIPS, only the values for the first and last\nbolus cut-off saturation pulses are provided. Based on DICOM Tag\n0018,925F ASL Bolus Cut-off Delay Time.\n" } }, BolusCutOffTechnique: { level: "required", issue: { code: "PASL_BOLUS_CUT_OFF_TECHINIQUE", message: "It is required to define `BolusCutOffTechnique` for this file,\nwhen `BolusCutOffFlag` is set to `true`. `BolusCutOffTechnique`,\nis the name of the technique used\n(for example, Q2TIPS, QUIPSS or QUIPSSII).\nCorresponds to DICOM Tag 0018,925E `ASL Bolus Cut-off Technique`.\n" } } } }, MRIASLM0Scan: { selectors: ['datatype == "perf"', 'suffix == "m0scan"'], fields: { IntendedFor: { level: "required", description_addendum: "This is used to refer to the ASL time series for which the `*_m0scan.nii[.gz]` is intended.\n" }, AcquisitionVoxelSize: "recommended" } } }, beh: { BEHTaskInformation: { selectors: ['intersects([suffix], ["beh", "events"])'], fields: { TaskName: "recommended", Instructions: "recommended", TaskDescription: "recommended", CogAtlasID: "recommended", CogPOID: "recommended" } }, BEHInstitutionInformation: { selectors: ['intersects([suffix], ["beh", "events"])'], fields: { InstitutionName: "recommended", InstitutionAddress: "recommended", InstitutionalDepartmentName: "recommended" } } }, continuous: { Continuous: { selectors: ['intersects([suffix], ["physio", "stim"])'], fields: { SamplingFrequency: "required", StartTime: "required", Columns: "required" } }, Physio: { selectors: ['suffix == "physio"'], fields: { Manufacturer: "recommended", ManufacturersModelName: "recommended", SoftwareVersions: "recommended", DeviceSerialNumber: "recommended" } } }, derivatives: { common_derivatives: { CommonDerivativeFields: { selectors: ['dataset.dataset_description.DatasetType == "derivative"'], fields: { Description: { level: "recommended", description_addendum: "This describes the nature of the file." }, Sources: "optional", RawSources: "deprecated" } }, SpatialReferenceEntity: { selectors: ['dataset.dataset_description.DatasetType == "derivative"', '"space" in entities'], fields: { SpatialReference: { level: "recommended", level_addendum: "if the derivative is aligned to a standard template listed in\n[Standard template identifiers][templates]. Required otherwise.\n" } } }, SpatialReferenceNonStandard: { selectors: ['dataset.dataset_description.DatasetType == "derivative"', "!intersects(schema.objects.metadata._StandardTemplateCoordSys, [entities.space])"], fields: { SpatialReference: "required" } }, MaskDerivatives: { selectors: ['dataset.dataset_description.DatasetType == "derivative"', 'suffix == "mask"'], fields: { Type: "recommended", Sources: "recommended", RawSources: "deprecated" } }, MaskDerivativesAtlas: { selectors: ['dataset.dataset_description.DatasetType == "derivative"', 'suffix == "mask"', '"label" in entities'], fields: { Atlas: { level: "recommended", level_addendum: "if `label` entity is defined" } } }, SegmentationCommon: { selectors: ['dataset.dataset_description.DatasetType == "derivative"', 'intersects([suffix], ["dseg", "probseg"])'], fields: { Manual: "optional" } }, SegmentationCommonAtlas: { selectors: ['dataset.dataset_description.DatasetType == "derivative"', 'intersects([suffix], ["dseg", "probseg"])', '"atlas" in entities'], fields: { Atlas: { level: "recommended", level_addendum: "if `atlas` is present" } } }, ImageDerivatives: { selectors: ['dataset.dataset_description.DatasetType == "derivative"', 'intersects([modality], ["mri", "pet"])', 'match(extension, "^\\.nii(\\.gz)?$")', '!intersects([suffix], ["dseg", "probseg", "mask"])'], fields: { SkullStripped: "required" } }, ImageDerivativeResEntity: { selectors: ['dataset.dataset_description.DatasetType == "derivative"', 'intersects([modality], ["mri", "pet"])', '"res" in entities'], fields: { Resolution: { level: "required", level_addendum: "if `res` is present" } } }, ImageDerivativeDenEntity: { selectors: ['dataset.dataset_description.DatasetType == "derivative"', 'intersects([modality], ["mri", "pet"])', '"den" in entities'], fields: { Density: { level: "required", level_addendum: "if `den` is present" } } } } }, dwi: { MRIDiffusionMultipart: { selectors: ['datatype == "dwi"', 'suffix == "dwi"', 'match(extension, "^\\.nii(\\.gz)?$")'], fields: { MultipartID: "optional" } }, MRIDiffusionOtherMetadata: { selectors: ['datatype == "dwi"', 'suffix == "dwi"', 'match(extension, "^\\.nii(\\.gz)?$")'], fields: { PhaseEncodingDirection: "recommended", TotalReadoutTime: "recommended" } } }, eeg: { EEGHardware: { selectors: ['datatype == "eeg"', 'suffix == "eeg"'], fields: { Manufacturer: "recommended", ManufacturersModelName: "recommended", SoftwareVersions: "recommended", DeviceSerialNumber: "recommended" } }, EEGTaskInformation: { selectors: ['datatype == "eeg"', 'suffix == "eeg"'], fields: { TaskName: { level: "required", description_addendum: "A recommended convention is to name resting state task using labels\nbeginning with `rest`.\n" }, TaskDescription: "recommended", Instructions: { level: "recommended", description_addendum: "This is especially important in context of resting state recordings and\ndistinguishing between eyes open and eyes closed paradigms.\n" }, CogAtlasID: "recommended", CogPOID: "recommended" } }, EEGInstitutionInformation: { selectors: ['datatype == "eeg"', 'suffix == "eeg"'], fields: { InstitutionName: "recommended", InstitutionAddress: "recommended", InstitutionalDepartmentName: "recommended" } }, EEGRequired: { selectors: ['datatype == "eeg"', 'suffix == "eeg"'], fields: { EEGReference: "required", SamplingFrequency: { level: "required", description_addendum: "The sampling frequency of data channels that deviate from the main sampling\nfrequency SHOULD be specified in the `channels.tsv` file.\n" }, PowerLineFrequency: "required", SoftwareFilters: "required" } }, EEGRecommended: { selectors: ['datatype == "eeg"', 'suffix == "eeg"'], fields: { CapManufacturer: "recommended", CapManufacturersModelName: "recommended", EEGChannelCount: "recommended", ECGChannelCount: "recommended", EMGChannelCount: "recommended", EOGChannelCount: "recommended", MISCChannelCount: "recommended", TriggerChannelCount: "recommended", RecordingDuration: "recommended", RecordingType: "recommended", EpochLength: "recommended", EEGGround: "recommended", HeadCircumference: "recommended", EEGPlacementScheme: "recommended", HardwareFilters: "recommended", SubjectArtefactDescription: "recommended" } }, EEGCoordsystemGeneral: { selectors: ['datatype == "eeg"', 'suffix == "coordsystem"'], fields: { IntendedFor: { level: "optional", description_addendum: "This identifies the MRI or CT scan associated with the electrodes,\nlandmarks, and fiducials.\n" } } }, EEGCoordsystemPositions: { selectors: ['datatype == "eeg"', 'suffix == "coordsystem"'], fields: { EEGCoordinateSystem: "required", EEGCoordinateUnits: "required", EEGCoordinateSystemDescription: { level: "recommended", level_addendum: 'required if `EEGCoordinateSystem` is `"Other"`' } } }, EEGCoordsystemOther: { selectors: ['datatype == "eeg"', 'suffix == "coordsystem"', '"EEGCoordinateSystem" in sidecar', 'sidecar.EEGCoordinateSystem == "Other"'], fields: { EEGCoordinateSystemDescription: "required" } }, EEGCoordsystemFiducials: { selectors: ['datatype == "eeg"', 'suffix == "coordsystem"'], fields: { FiducialsDescription: "optional", FiducialsCoordinates: "recommended", FiducialsCoordinateSystem: "recommended", FiducialsCoordinateUnits: "recommended", FiducialsCoordinateSystemDescription: { level: "recommended", level_addendum: 'required if `FiducialsCoordinateSystem` is `"Other"`' } } }, EEGCoordsystemOtherFiducialCoordinateSystem: { selectors: ['datatype == "eeg"', 'suffix == "coordsystem"', 'sidecar.FiducialsCoordinateSystem == "Other"'], fields: { FiducialsCoordinateSystemDescription: "required" } }, EEGCoordsystemLandmark: { selectors: ['datatype == "eeg"', 'suffix == "coordsystem"'], fields: { AnatomicalLandmarkCoordinates: "recommended", AnatomicalLandmarkCoordinateSystem: { level: "recommended", description_addendum: "Preferably the same as the `EEGCoordinateSystem`." }, AnatomicalLandmarkCoordinateUnits: "recommended" } }, EEGCoordsystemLandmarkDescriptionRec: { selectors: ['datatype == "eeg"', 'suffix == "coordsystem"', 'sidecar.AnatomicalLandmarkCoordinateSystem != "Other"'], fields: { AnatomicalLandmarkCoordinateSystemDescription: { level: "recommended", level_addendum: 'required if `AnatomicalLandmarkCoordinateSystem` is `"Other"`' } } }, EEGCoordsystemLandmarkDescriptionReq: { selectors: ['datatype == "eeg"', 'suffix == "coordsystem"', 'sidecar.AnatomicalLandmarkCoordinateSystem == "Other"'], fields: { AnatomicalLandmarkCoordinateSystemDescription: "required" } } }, entity_rules: { EntitiesTaskMetadata: { selectors: ['"task" in entities'], fields: { TaskName: "recommended" } }, EntitiesCeMetadata: { selectors: ['"ce" in entities'], fields: { ContrastBolusIngredient: "optional" } }, EntitiesTrcMetadata: { selectors: ['"trc" in entities'], fields: { TracerName: "required" } }, EntitiesStainMetadata: { selectors: ['"stain" in entities'], fields: { SampleStaining: "recommended", SamplePrimaryAntibody: "recommended", SampleSecondaryAntibody: "recommended" } }, EntitiesEchoMetadata: { selectors: ['"echo" in entities'], fields: { EchoTime: "required" } }, EntitiesFlipMetadata: { selectors: ['"flip" in entities'], fields: { FlipAngle: "required" } }, EntitiesInvMetadata: { selectors: ['"inv" in entities'], fields: { InversionTime: "required" } }, EntitiesMTMetadata: { selectors: ['"mt" in entities'], fields: { MTState: "required" } }, EntitiesPartMetadata: { selectors: ['entities.part == "phase"'], fields: { Units: "required" } }, EntitiesResMetadata: { selectors: ['"res" in entities'], fields: { Resolution: "required" } }, EntitiesDenMetadata: { selectors: ['"den" in entities'], fields: { Density: "required" } } }, events: { StimulusPresentation: { selectors: ['suffix == "events"'], fields: { StimulusPresentation: "recommended", VisionCorrection: "optional" } } }, fmap: { MRIFieldmapIntendedFor: { selectors: ['datatype == "fmap"', "match(extension, '\\.nii(\\.gz)?$')"], fields: { IntendedFor: { level: "optional", description_addendum: "This field is optional, and in case the fieldmaps do not correspond\nto any particular scans, it does not have to be filled.\n" } } }, MRIFieldmapB0FieldIdentifier: { selectors: ['datatype == "fmap"', "match(extension, '\\.nii(\\.gz)?$')", '!("IntendedFor" in sidecar)'], fields: { B0FieldIdentifier: "recommended" } }, MRIFieldmapPhaseDifferencePhasediff: { selectors: ['datatype == "fmap"', 'suffix == "phasediff"', "match(extension, '\\.nii(\\.gz)?$')"], fields: { EchoTime1: "required", EchoTime2: "required" } }, MRIFieldmapTwoPhase: { selectors: ['datatype == "fmap"', 'intersects([suffix], ["phase1", "phase2"])', "match(extension, '\\.nii(\\.gz)?$')"], fields: { EchoTime__fmap: "required" } }, MRIFieldmapDirectFieldMapping: { selectors: ['datatype == "fmap"', 'suffix == "fieldmap"', "match(extension, '\\.nii(\\.gz)?$')"], fields: { Units: { level: "required", description_addendum: 'Fieldmaps must be in units of Hertz (`"Hz"`),\nradians per second (`"rad/s"`), or Tesla (`"T"`).\n' } } }, MRIFieldmapPepolar: { selectors: ['datatype == "fmap"', 'suffix == "epi"', "match(extension, '\\.nii(\\.gz)?$')"], fields: { PhaseEncodingDirection: "required", TotalReadoutTime: "required" } } }, func: { MRIFuncRequired: { selectors: ['datatype == "func"', 'suffix == "bold"', 'match(extension, "^\\.nii(\\.gz)?$")'], fields: { TaskName: { level: "required", description_addendum: "A recommended convention is to name resting state task using labels\nbeginning with `rest`.\n" } } }, MRIFuncRepetitionTime: { selectors: ['datatype == "func"', 'suffix == "bold"', '!("VolumeTiming" in sidecar)', 'match(extension, "^\\.nii(\\.gz)?$")'], fields: { RepetitionTime: { level: "required", level_addendum: "mutually exclusive with `VolumeTiming`" } } }, MRIFuncVolumeTiming: { selectors: ['datatype == "func"', 'suffix == "bold"', '!("RepetitionTime" in sidecar)', 'match(extension, "^\\.nii(\\.gz)?$")'], fields: { VolumeTiming: { level: "required", level_addendum: "mutually exclusive with `RepetitionTime`" } } }, MRIFuncTimingParameters: { selectors: ['datatype == "func"', 'suffix == "bold"'], fields: { NumberOfVolumesDiscardedByScanner: "recommended", NumberOfVolumesDiscardedByUser: "recommended", DelayTime: "recommended", AcquisitionDuration: { level: "recommended", level_addendum: 'required for sequences that are described with the `VolumeTiming`\nfield and that do not have the `SliceTiming` field set to allow for\naccurate calculation of "acquisition time"\n', issue: { name: "VOLUME_TIMING_MISSING_ACQUISITION_DURATION", message: "The field 'VolumeTiming' requires 'AcquisitionDuration' or 'SliceTiming' to be defined.\n" } }, DelayAfterTrigger: "recommended" } }, MRIFuncTaskInformation: { selectors: ['datatype == "func"', 'suffix == "bold"'], fields: { Instructions: { level: "recommended", description_addendum: "This is especially important in context of resting state recordings and\ndistinguishing between eyes open and eyes closed paradigms.\n" }, TaskDescription: "recommended", CogAtlasID: "recommended", CogPOID: "recommended" } }, PhaseSuffixUnits: { selectors: ['datatype == "func"', 'suffix == "phase"', 'match(extension, "^\\.nii(\\.gz)?$")'], fields: { Units: "required" } } }, ieeg: { iEEGHardware: { selectors: ['datatype == "ieeg"', 'suffix == "ieeg"'], fields: { Manufacturer: { level: "recommended", description_addendum: 'For example, `"TDT"`, `"Blackrock"`.' }, ManufacturersModelName: "recommended", SoftwareVersions: "recommended", DeviceSerialNumber: "recommended" } }, iEEGTaskInformation: { selectors: ['datatype == "ieeg"', 'suffix == "ieeg"'], fields: { TaskName: { level: "required", description_addendum: "A recommended convention is to name resting state task using labels\nbeginning with `rest`.\n" }, TaskDescription: "recommended", Instructions: { level: "recommended", description_addendum: "This is especially important in context of resting state recordings and\ndistinguishing between eyes open and eyes closed paradigms.\n" }, CogAtlasID: "recommended", CogPOID: "recommended" } }, iEEGInstitutionInformation: { selectors: ['datatype == "ieeg"', 'suffix == "ieeg"'], fields: { InstitutionName: "recommended", InstitutionAddress: "recommended", InstitutionalDepartmentName: "recommended" } }, iEEGRequired: { selectors: ['datatype == "ieeg"', 'suffix == "ieeg"'], fields: { iEEGReference: "required", SamplingFrequency: { level: "required", description_addendum: "The sampling frequency of data channels that deviate from the main sampling\nfrequency SHOULD be specified in the `channels.tsv` file.\n" }, PowerLineFrequency: "required", SoftwareFilters: "required" } }, iEEGRecommended: { selectors: ['datatype == "ieeg"', 'suffix == "ieeg"'], fields: { DCOffsetCorrection: "deprecated", HardwareFilters: "recommended", ElectrodeManufacturer: "recommended", ElectrodeManufacturersModelName: "recommended", ECOGChannelCount: "recommended", SEEGChannelCount: "recommended", EEGChannelCount: "recommended", EOGChannelCount: "recommended", ECGChannelCount: "recommended", EMGChannelCount: "recommended", MiscChannelCount: "recommended", TriggerChannelCount: "recommended", RecordingDuration: "recommended", RecordingType: "recommended", EpochLength: "recommended", iEEGGround: "recommended", iEEGPlacementScheme: "recommended", iEEGElectrodeGroups: "recommended", SubjectArtefactDescription: "recommended" } }, iEEGOptional: { selectors: ['datatype == "ieeg"', 'suffix == "ieeg"'], fields: { ElectricalStimulation: "optional", ElectricalStimulationParameters: "optional" } }, iEEGCoordsystemGeneral: { selectors: ['datatype == "ieeg"', 'suffix == "coordsystem"'], fields: { IntendedFor__ds_relative: { level: "optional", description_addendum: "If only a surface reconstruction is available, this should point to\nthe surface reconstruction file.\nNote that this file should have the same coordinate system\nspecified in `iEEGCoordinateSystem`.\nFor example, **T1**: `'bids::sub-<label>/ses-<label>/anat/sub-01_T1w.nii.gz'`\n**Surface**: `'bids::derivatives/surfaces/sub-<label>/ses-<label>/anat/\nsub-01_hemi-R_desc-T1w_pial.surf.gii'`\n**Operative photo**: `'bids::sub-<label>/ses-<label>/ieeg/\nsub-0001_ses-01_acq-photo1_photo.jpg'`\n**Talairach**: `'bids::derivatives/surfaces/sub-Talairach/ses-01/anat/\nsub-Talairach_hemi-R_pial.surf.gii'`\n" } } }, iEEGCoordsystemPositions: { selectors: ['datatype == "ieeg"', 'suffix == "coordsystem"'], fields: { iEEGCoordinateSystem: "required", iEEGCoordinateUnits: "required", iEEGCoordinateSystemDescription: { level: "recommended", level_addendum: 'required if `iEEGCoordinateSystem` is `"Other"`' }, iEEGCoordinateProcessingDescription: "recommended", iEEGCoordinateProcessingReference: "recommended" } }, iEEGCoordsystemOther: { selectors: ['datatype == "ieeg"', 'suffix == "coordsystem"', '"iEEGCoordinateSystem" in sidecar', 'sidecar.iEEGCoordinateSystem == "Other"'], fields: { iEEGCoordinateSystemDescription: "required" } } }, meg: { MEGHardware: { selectors: ['datatype == "meg"', '"task" in entities', 'suffix == "meg"'], fields: { Manufacturer: { level: "recommended", description_addendum: 'For MEG scanners, this must be one of:\n`"CTF"`, `"Elekta/Neuromag"`, `"BTi/4D"`, `"KIT/Yokogawa"`,\n`"ITAB"`, `"KRISS"`, `"Other"`.\nSee the [MEG Systems Appendix](SPEC_ROOT/appendices/meg-systems.md) for\npreferred names.\n' }, ManufacturersModelName: { level: "recommended", description_addendum: "See the [MEG Systems Appendix](SPEC_ROOT/appendices/meg-systems.md) for\npreferred names.\n" }, SoftwareVersions: "recommended", DeviceSerialNumber: "recommended" } }, MEGTaskInformation: { selectors: ['datatype == "meg"', '"task" in entities', 'suffix == "meg"'], fields: { TaskName: { level: "required", description_addendum: "A recommended convention is to name resting state task using labels\nbeginning with `rest`.\n" }, TaskDescription: "recommended", Instructions: { level: "recommended", description_addendum: "This is especially important in context of resting state recordings and\ndistinguishing between eyes open and eyes closed paradigms.\n" }, CogAtlasID: "recommended", CogPOID: "recommended" } }, MEGInstitutionInformation: { selectors: ['datatype == "meg"', '"task" in entities', 'suffix == "meg"'], fields: { InstitutionName: "recommended", InstitutionAddress: "recommended", InstitutionalDepartmentName: "recommended" } }, MEGRequired: { selectors: ['datatype == "meg"', '"task" in entities', 'suffix == "meg"'], fields: { SamplingFrequency: { level: "required", description_addendum: "The sampling frequency of data channels that deviate from the main sampling\nfrequency SHOULD be specified in the `channels.tsv` file.\n" }, PowerLineFrequency: "required", DewarPosition: "required", SoftwareFilters: "required", DigitizedLandmarks: "required", DigitizedHeadPoints: "required" } }, MEGRecommended: { selectors: ['datatype == "meg"', '"task" in entities', 'suffix == "meg"'], fields: { MEGChannelCount: "recommended", MEGREFChannelCount: "recommended", EEGChannelCount: "recommended", ECOGChannelCount: "recommended", SEEGChannelCount: "recommended", EOGChannelCount: "recommended", ECGChannelCount: "recommended", EMGChannelCount: "recommended", MiscChannelCount: "recommended", TriggerChannelCount: "recommended", RecordingDuration: "recommended", RecordingType: "recommended", EpochLength: "recommended", ContinuousHeadLocalization: "recommended", HeadCoilFrequency: "recommended", MaxMovement: "recommended", SubjectArtefactDescription: "recommended", AssociatedEmptyRoom: "recommended", HardwareFilters: "recommended" } }, MEGwithEEG: { selectors: ['datatype == "meg"', 'suffix == "meg"', 'intersects(dataset.modalities, ["eeg"])'], fields: { EEGPlacementScheme: "optional", CapManufacturer: "optional", CapManufacturersModelName: "optional", EEGReference: "optional" } }, MEGCoordsystemWithEEG: { selectors: ['datatype == "meg"', 'suffix == "coordsystem"'], fields: { MEGCoordinateSystem: "required", MEGCoordinateUnits: "required", MEGCoordinateSystemDescription: { level: "optional", level_addendum: "required if `MEGCoordinateSystem` is `Other`" }, EEGCoordinateSystem: { level: "optional", description_addendum: "See [Recording EEG simultaneously with MEG]\n(/modality-specific-files/magnetoencephalography.html#recording-eeg-simultaneously-with-meg).\nPreferably the same as the `MEGCoordinateSystem`.\n" }, EEGCoordinateUnits: "optional", EEGCoordinateSystemDescription: { level: "optional", level_addendum: "required if `EEGCoordinateSystem` is `Other`", description_addendum: "See [Recording EEG simultaneously with MEG]\n(/modality-specific-files/magnetoencephalography.html#recording-eeg-simultaneously-with-meg).\n" } } }, MEGCoordsystemWithEEGMEGCoordinateSystem: { selectors: ['datatype == "meg"', 'suffix == "coordsystem"', '"MEGCoordinateSystem" in sidecar', 'sidecar.MEGCoordinateSystem == "Other"'], fields: { MEGCoordinateSystemDescription: "required" } }, MEGCoordsystemWithEEGEEGCoordinateSystem: { selectors: ['datatype == "meg"', 'suffix == "coordsystem"', '"EEGCoordinateSystem" in sidecar', 'sidecar.EEGCoordinateSystem == "Other"'], fields: { EEGCoordinateSystemDescription: "required" } }, MEGCoordsystemHeadLocalizationCoils: { selectors: ['datatype == "meg"', 'suffix == "coordsystem"'], fields: { HeadCoilCoordinates: "optional", HeadCoilCoordinateSystem: "optional", HeadCoilCoordinateUnits: "optional", HeadCoilCoordinateSystemDescription: { level: "optional", level_addendum: "required if `HeadCoilCoordinateSystem` is `Other`" } } }, MEGCoordsystemHeadLocalizationCoilsHeadCoilCoordinateSystem: { selectors: ['datatype == "meg"', 'suffix == "coordsystem"', '"HeadCoilCoordinateSystem" in sidecar', 'sidecar.HeadCoilCoordinateSystem == "Other"'], fields: { HeadCoilCoordinateSystemDescription: "required" } }, MEGCoordsystemDigitizedHeadPoints: { selectors: ['datatype == "meg"', 'suffix == "coordsystem"'], fields: { DigitizedHeadPoints: "optional", DigitizedHeadPointsCoordinateSystem: "optional", DigitizedHeadPointsCoordinateUnits: "optional", DigitizedHeadPointsCoordinateSystemDescription: { level: "optional", level_addendum: "required if `DigitizedHeadPointsCoordinateSystem` is `Other`" } } }, MEGCoordsystemDigitizedHeadPointsDigitizedHeadPointsCoordinateSystem: { selectors: ['datatype == "meg"', 'suffix == "coordsystem"', '"DigitizedHeadPointsCoordinateSystem" in sidecar', 'sidecar.DigitizedHeadPointsCoordinateSystem == "Other"'], fields: { DigitizedHeadPointsCoordinateSystemDescription: "required" } }, MEGCoordsystemAnatomicalMRI: { selectors: ['datatype == "meg"', 'suffix == "coordsystem"', 'intersects(dataset.datatypes, ["anat"])'], fields: { IntendedFor: { level: "optional", description_addendum: "This is used to identify the structural MRI(s),\npossibly of different types if a list is specified,\nto be used with the MEG recording.\n" } } }, MEGCoordsystemAnatomicalLandmarks: { selectors: ['datatype == "meg"', 'suffix == "coordsystem"'], fields: { AnatomicalLandmarkCoordinates: "optional", AnatomicalLandmarkCoordinateSystem: { level: "optional", description_addendum: "Preferably the same as the `MEGCoordinateSystem`.\n" }, AnatomicalLandmarkCoordinateUnits: "optional", AnatomicalLandmarkCoordinateSystemDescription: { level: "optional", level_addendum: "required if `AnatomicalLandmarkCoordinateSystem` is `Other`" } } }, MEGCoordsystemAnatomicalLandmarksAnatomicalLandmarkCoordinateSystem: { selectors: ['datatype == "meg"', 'suffix == "coordsystem"', '"AnatomicalLandmarkCoordinateSystem" in sidecar', 'sidecar.AnatomicalLandmarkCoordinateSystem == "Other"'], fields: { AnatomicalLandmarkCoordinateSystemDescription: "required" } }, MEGCoordsystemFiducialsInformation: { selectors: ['datatype == "meg"', 'suffix == "coordsystem"'], fields: { FiducialsDescription: "optional" } } }, micr: { MicroscopyHardware: { selectors: ['datatype == "micr"', 'suffix != "photo"'], fields: { Manufacturer: "recommended", ManufacturersModelName: "recommended", DeviceSerialNumber: "recommended", StationName: "recommended", SoftwareVersions: "recommended" } }, MicroscopyInstitutionInformation: { selectors: ['datatype == "micr"', 'suffix != "photo"'], fields: { InstitutionName: "recommended", InstitutionAddress: "recommended", InstitutionalDepartmentName: "recommended" } }, MicroscopyImageAcquisition: { selectors: ['datatype == "micr"', 'suffix != "photo"'], fields: { PixelSize: "required", PixelSizeUnits: "required", Immersion: "optional", NumericalAperture: "optional", Magnification: "optional", ImageAcquisitionProtocol: "optional", OtherAcquisitionParameters: "optional" } }, MicroscopySample: { selectors: ['datatype == "micr"', 'suffix != "photo"'], fields: { BodyPart: { level: "recommended", description_addendum: 'From [DICOM Body Part\nExamined](http://dicom.nema.org/medical/dicom/current/output/chtml/part16/chapter_L.html#chapter_L)\n(for example `"BRAIN"`).\n' }, BodyPartDetails: "recommended", BodyPartDetailsOntology: "optional", SampleEnvironment: "recommended", SampleEmbedding: "optional", SampleFixation: "optional", SampleStaining: "recommended", SamplePrimaryAntibody: "recommended", SampleSecondaryAntibody: "recommended", SliceThickness: "optional", TissueDeformationScaling: "optional", SampleExtractionProtocol: "optional", SampleExtractionInstitution: "optional" } }, MicroscopyChunkTransformations: { selectors: ['datatype == "micr"', 'suffix != "photo"', '"chunk" in entities'], fields: { ChunkTransformationMatrix: { level: "recommended", level_addendum: "if `chunk-<index>` is used in filenames" } } }, MicroscopyChunkTransformationsMatrixAxis: { selectors: ['datatype == "micr"', 'suffix != "photo"', '"chunk" in entities', '"ChunkTransformationMatrix" in sidecar'], fields: { ChunkTransformationMatrixAxis: { level: "required", level_addendum: "if `ChunkTransformationMatrix` is present" } } }, Photo: { selectors: ['datatype == "micr"', 'suffix == "photo"'], fields: { PhotoDescription: "optional", IntendedFor: { level: "optional", description_addendum: "This field is OPTIONAL, in case the photos do not correspond\nto any particular images, it does not have to be filled.\n" } } } }, motion: { motionHardware: { selectors: ['datatype == "motion"', 'suffix == "motion"'], fields: { DeviceSerialNumber: "recommended", Manufacturer: "recommended", ManufacturersModelName: "recommended", SoftwareVersions: "recommended" } }, motionInstitutionInformation: { selectors: ['datatype == "motion"', 'suffix == "motion"'], fields: { InstitutionName: "recommended", InstitutionAddress: "recommended", InstitutionalDepartmentName: "recommended" } }, motionTaskInformation: { selectors: ['datatype == "motion"', 'suffix == "motion"'], fields: { TaskName: { level: "required", description_addendum: 'Task names for motion datasets usually contain information\nabout the specific motion task (for example, "`walking`").\n' }, TaskDescription: "recommended", Instructions: "recommended" } }, motionRequired: { selectors: ['datatype == "motion"', 'suffix == "motion"'], fields: { SamplingFrequency: { level: "required", description_addendum: 'This field refers to the nominal sampling frequency. For motion data one can use\n"`SamplingFrequencyEffective`" if nominal and effective differ.\nThe sampling frequency of data channels that deviate from the main (nominal) sampling\nfrequency SHOULD be specified in the "`_tracksys-<label>_channels.tsv`" file.\n' } } }, motionRecommended: { selectors: ['datatype == "motion"', 'suffix == "motion"'], fields: { ACCELChannelCount: "recommended", ANGACCELChannelCount: "recommended", GYROChannelCount: "recommended", JNTANGChannelCount: "recommended", LATENCYChannelCount: "recommended", MAGNChannelCount: "recommended", MISCChannelCount: "recommended", MissingValues: "recommended", MotionChannelCount: "recommended", ORNTChannelCount: "recommended", POSChannelCount: "recommended", RotationOrder: "recommended", RotationRule: "recommended", SamplingFrequencyEffective: { level: "recommended", description_addendum: "If not available, the field takes value `n/a`.\n" }, SpatialAxes: "recommended", SubjectArtefactDescription: "recommended", TrackedPointsCount: "recommended", TrackingSystemName: "optional", VELChannelCount: "recommended" } } }, mri: { MRIHardware: { selectors: ['modality == "mri"'], fields: { Manufacturer: { level: "recommended", description_addendum: "Corresponds to DICOM Tag 0008, 0070 `Manufacturer`." }, ManufacturersModelName: { level: "recommended", description_addendum: "Corresponds to DICOM Tag 0008, 1090 `Manufacturers Model Name`." }, DeviceSerialNumber: { level: "recommended", description_addendum: "Corresponds to DICOM Tag 0018, 1000 `DeviceSerialNumber`." }, StationName: { level: "recommended", description_addendum: "Corresponds to DICOM Tag 0008, 1010 `Station Name`." }, SoftwareVersions: { level: "recommended", description_addendum: "Corresponds to DICOM Tag 0018, 1020 `Software Versions`." }, HardcopyDeviceSoftwareVersion: "DEPRECATED", MagneticFieldStrength: { level: "recommended, but required for Arterial Spin Labeling" }, ReceiveCoilName: "recommended", ReceiveCoilActiveElements: "recommended", GradientSetType: "recommended", MRTransmitCoilSequence: "recommended", MatrixCoilMode: "recommended", CoilCombinationMethod: "recommended" } }, MRIScannerHardwareASL: { selectors: ['datatype == "perf"', 'suffix == "asl"', 'intersects([suffix], ["asl", "m0scan"])'], fields: { MagneticFieldStrength: "required" } }, MRISequenceSpecifics: { selectors: ['modality == "mri"'], fields: { PulseSequenceType: "recommended", ScanningSequence: "recommended", SequenceVariant: "recommended", ScanOptions: "recommended", SequenceName: "recommended", PulseSequenceDetails: "recommended", NonlinearGradientCorrection: "recommended, but required if [PET](./positron-emission-tomography.md) data are present\n", MRAcquisitionType: "recommended, but required for Arterial Spin Labeling", MTState: "recommended", MTOffsetFrequency: "optional", MTPulseBandwidth: "optional", MTNumberOfPulses: "optional", MTPulseShape: "optional", MTPulseDuration: "optional", SpoilingState: "recommended", SpoilingType: "optional", SpoilingRFPhaseIncrement: "optional", SpoilingGradientMoment: "optional", SpoilingGradientDuration: "optional" } }, PETMRISequenceSpecifics: { selectors: ['modality == "mri"', 'intersects(dataset.modalities, ["pet"])'], fields: { NonlinearGradientCorrection: "required" } }, ASLMRISequenceSpecifics: { selectors: ['datatype == "perf"', 'suffix == "asl"'], fields: { MRAcquisitionType: "required" } }, MTParameters: { selectors: ["sidecar.MTState == true"], fields: { MTOffsetFrequency: "recommended", MTPulseBandwidth: "recommended", MTNumberOfPulses: "recommended", MTPulseShape: "recommended", MTPulseDuration: "recommended" } }, SpoilingType: { selectors: ["sidecar.SpoilingState == true"], fields: { SpoilingType: "recommended" } }, SpoilingRF: { selectors: ['intersects([sidecar.SpoilingType], ["RF", "COMBINED"])'], fields: { SpoilingRFPhaseIncrement: "recommended" } }, SpoilingGradient: { selectors: ['intersects([sidecar.SpoilingType], ["GRADIENT", "COMBINED"])'], fields: { SpoilingGradientMoment: "recommended", SpoilingGradientDuration: "recommended" } }, MRISpatialEncoding: { selectors: ['modality == "mri"'], fields: { NumberShots: "recommended", ParallelReductionFactorInPlane: "recommended", ParallelReductionFactorOutOfPlane: "recommended", ParallelAcquisitionTechnique: "recommended", PartialFourier: "recommended", PartialFourierDirection: "recommended", EffectiveEchoSpacing: { level: "recommended", level_addendum: "required if corresponding fieldmap data present", description_addendum: "<sup>2</sup>" }, MixingTime: "recommended" } }, PhaseEncodingDirectionRec: { selectors: ['modality == "mri"', 'suffix != "epi"'], fields: { PhaseEncodingDirection: { level: "recommended", level_addendum: "required if corresponding fieldmap data is present\nor when using multiple runs with different phase encoding directions\n(which can be later used for field inhomogeneity correction).\n" }, TotalReadoutTime: { level: "recommended", level_addendum: "required if corresponding 'field/distortion' maps\nacquired with opposing phase encoding directions are present\n(see [Case 4: Multiple phase encoded\ndirections](#case-4-multiple-phase-encoded-directions-pepolar))\n" } } }, PhaseEncodingDirectionReq: { selectors: ['modality == "mri"', 'suffix == "epi"'], fields: { PhaseEncodingDirection: { level: "required", issue: { name: "PHASE_ENCODING_DIRECTION_MUST_DEFINE", issue: "You have to define 'PhaseEncodingDirection' for this file.\n" } }, TotalReadoutTime: { level: "required", description_addendum: "<sup>3</sup>", issue: { name: "TOTAL_READOUT_TIME_MUST_DEFINE", message: "You have to define 'TotalReadoutTime' for this file.\n" } } } }, MRITimingParameters: { selectors: ['modality == "mri"'], fields: { EchoTime: { level: "recommended", level_addendum: "required if corresponding fieldmap data is present,\nor the data comes from a multi-echo sequence or Arterial Spin Labeling.\n", issue: { name: "ECHO_TIME_NOT_DEFINED", message: "You must define 'EchoTime' for this file. 'EchoTime' is the echo time (TE)\nfor the acquisition, specified in seconds. Corresponds to DICOM Tag\n0018, 0081 Echo Time (please note that the DICOM term is in milliseconds\nnot seconds). The data type number may apply to files from any MRI modality\nconcerned with a single value for this field, or to the files in a file\ncollection where the value of this field is iterated using the echo entity.\nThe data type array provides a value for each volume in a 4D dataset and\nshould only be used when the volume timing is critical for interpretation\nof the data, such as in ASL or variable echo time fMRI sequences.\n" } }, InversionTime: "recommended", SliceTiming: { level: "recommended", level_addendum: "required for sparse sequences that do not have the `DelayTime` field set,\nand Arterial Spin Labeling with `MRAcquisitionType` set on `2D`.\n" }, SliceEncodingDirection: "recommended", DwellTime: "recommended" } }, SliceTimingASL: { selectors: ['datatype == "perf"', 'intersects([suffix], ["asl", "m0scan"])', 'sidecar.MRAcquisitionType == "2D"'], fields: { EchoTime: "required", SliceTiming: { level: "required", issue: { code: "SLICE_TIMING_NOT_DEFINED_2D_ASL", message: "You should define `SliceTiming` for this file, because `SequenceType` is sets\nto a 2D sequence. `SliceTiming` is the time at which each slice was\nacquired within each volume (frame) of the acquisition. Slice timing\nis not slice order -- rather, it is a list of times containing the\ntime (in seconds) of each slice acquisition in relation to the beginning\nof volume acquisition. The list goes through the slices along the slice\naxis in the slice encoding dimension (see below). Note that to ensure the\nproper interpretation of the `SliceTiming` field, it is important to check\nif the optional `SliceEncodingDirection` exists. In particular, if\n`SliceEncodingDirection` is negative, the entries in `SliceTiming` are\ndefined in reverse order with respect to the slice axis, such that the\nfinal entry in the `SliceTiming` list is the time of acquisition of slice 0.\nWithout this parameter slice time correction will not be possible.\n" } } } }, MRIRFandContrast: { selectors: ['modality == "mri"'], fields: { NegativeContrast: "optional" } }, MRIFlipAngleLookLockerFalse: { selectors: ['modality == "mri"', "sidecar.LookLocker != true"], fields: { FlipAngle: { level: "recommended", level_addendum: "required if LookLocker is set to `true`" } } }, MRIFlipAngleLookLockerTrue: { selectors: ['modality == "mri"', "sidecar.LookLocker == true"], fields: { FlipAngle: { level: "required", issue: { name: "LOOK_LOCKER_FLIP_ANGLE_MISSING", message: "You should define 'FlipAngle' for this file, in\ncase of a LookLocker acquisition. 'FlipAngle' is the\nflip angle (FA) for the acquisition, specified in degrees.\nCorresponds to: DICOM Tag 0018, 1314 `Flip Angle`. The data\ntype number may apply to files from any MRI modality concerned\nwith a single value for this field, or to the files in a file\ncollection where the value of this field is iterated using the\nflip entity. The data type array provides a value for each volume\nin a 4D dataset and should only be used when the volume timing is\ncritical for interpretation of the data, such as in ASL or\nvariable flip angle fMRI sequences.\n" } } } }, MRISliceAcceleration: { selectors: ['modality == "mri"'], fields: { MultibandAccelerationFactor: "recommended" } }, MRIAnatomicalLandmarks: { selectors: ['modality == "mri"'], fields: { AnatomicalLandmarkCoordinates__mri: "recommended" } }, MRIEchoPlanarImagingAndB0Mapping: { selectors: ['modality == "mri"'], fields: { B0FieldIdentifier: "recommended", B0FieldSource: "recommended" } }, MRIInstitutionInformation: { selectors: ['modality == "mri"'], fields: { InstitutionName: { level: "recommended", description_addendum: "Corresponds to DICOM Tag 0008, 0080 `InstitutionName`." }, InstitutionAddress: { level: "recommended", description_addendum: "Corresponds to DICOM Tag 0008, 0081 `InstitutionAddress`." }, InstitutionalDepartmentName: { level: "recommended", description_addendum: "Corresponds to DICOM Tag 0008, 1040 `Institutional Department Name`." } } } }, nirs: { CoordinateSystem: { selectors: ['datatype == "nirs"', 'suffix == "coordsystem"'], fields: { NIRSCoordinateSystem: "required", NIRSCoordinateUnits: "required", NIRSCoordinateProcessingDescription: "recommended" } }, Fiducials: { selectors: ['datatype == "nirs"', 'suffix == "coordsystem"'], fields: { FiducialsDescription: "optional", FiducialsCoordinates: "recommended", FiducialsCoordinateUnits: "recommended", FiducialsCoordinateSystem: "recommended" } }, AnatomicalLandmark: { selectors: ['datatype == "nirs"', 'suffix == "coordsystem"'], fields: { AnatomicalLandmarkCoordinates: "recommended", AnatomicalLandmarkCoordinateSystem: "recommended", AnatomicalLandmarkCoordinateUnits: "recommended" } }, CoordsystemGeneral: { selectors: ['datatype == "nirs"', 'suffix == "coordsystem"'], fields: { IntendedFor: { level: "optional", description_addendum: "This identifies the MRI or CT scan associated with the optodes,\nlandmarks, and fiducials.\n" } } }, CoordinateSystemDescriptionRec: { selectors: ['datatype == "nirs"', 'suffix == "coordsystem"', 'json.NIRSCoordinateSystem != "other"'], fields: { NIRSCoordinateSystemDescription: { level: "recommended", level_addendum: 'required if NIRSCoordinateSystem is "other"' } } }, CoordinateSystemDescriptionReq: { selectors: ['datatype == "nirs"', 'suffix == "coordsystem"', 'json.NIRSCoordinateSystem == "other"'], fields: { NIRSCoordinateSystemDescription: "required" } }, AnatomicalLandmarkCoordinateSystemDescriptionRec: { selectors: ['datatype == "nirs"', 'suffix == "coordsystem"', 'json.AnatomicalLandmarkCoordinateSystem != "other"'], fields: { AnatomicalLandmarkCoordinateSystemDescription: { level: "recommended", level_addendum: 'required if NIRSCoordinateSystem is "other"' } } }, AnatomicalLandmarkCoordinateSystemDescriptionReq: { selectors: ['datatype == "nirs"', 'suffix == "coordsystem"', 'json.AnatomicalLandmarkCoordinateSystem == "other"'], fields: { AnatomicalLandmarkCoordinateSystemDescription: "required" } }, FiducialsCoordinateSystemDescriptionRec: { selectors: ['datatype == "nirs"', 'suffix == "coordsystem"', 'json.FiducialsCoordinateSystem != "other"'], fields: { FiducialsCoordinateSystemDescription: { level: "recommended", level_addendum: 'required if FiducialsCoordinateSystem is "other"' } } }, FiducialsCoordinateSystemDescriptionReq: { selectors: ['datatype == "nirs"', 'suffix == "coordsystem"', 'json.FiducialsCoordinateSystem == "other"'], fields: { FiducialsCoordinateSystemDescription: "required" } }, NirsHardware: { selectors: ['datatype == "nirs"', 'suffix == "nirs"'], fields: { Manufacturer: "recommended", ManufacturersModelName: "recommended", SoftwareVersions: "recommended", DeviceSerialNumber: "recommended" } }, NirsBase: { selectors: ['datatype == "nirs"', 'suffix == "nirs"'], fields: { RecordingDuration: "recommended", HeadCircumference: "recommended", HardwareFilters: "recommended", SubjectArtefactDescription: "recommended" } }, NirsTaskInformation: { selectors: ['datatype == "nirs"', 'suffix == "nirs"'], fields: { TaskName: "required", TaskDescription: "recommended", Instructions: "recommended", CogAtlasID: "recommended", CogPOID: "recommended" } }, NirsInstitutionInformation: { selectors: ['datatype == "nirs"', 'suffix == "nirs"'], fields: { InstitutionName: "recommended", InstitutionAddress: "recommended", InstitutionalDepartmentName: "recommended" } }, NirsRequired: { selectors: ['datatype == "nirs"', 'suffix == "nirs"'], fields: { SamplingFrequency__nirs: { level: "required", description_addendum: 'Sampling frequency (in Hz) of all the data in the recording, regardless of their type (for example, `12`). If\nindividual channels have different sampling rates, then the field here MUST be specified as `n/a` and the\nvalues MUST be specified in the `sampling_frequency` column in channels.tsv.")\n' }, NIRSChannelCount: "required", NIRSSourceOptodeCount: "required", NIRSDetectorOptodeCount: "required", ACCELChannelCount: { level: "optional", level_addendum: "required if any channel type is ACC" }, GYROChannelCount: { level: "optional", level_addendum: "required if any channel type is GYRO" }, MAGNChannelCount: { level: "optional", level_addendum: "required if any channel type is MAGN" } } }, NirsRecommend: { selectors: ['datatype == "nirs"', 'suffix == "nirs"'], fields: { CapManufacturer: { level: "recommended", description_addendum: "If no cap was used, such as with optodes\nthat are directly taped to the scalp, then the string `none` MUST be used and the `NIRSPlacementScheme` field\nMAY be used to specify the optode placement.\n" }, CapManufacturersModelName: { level: "recommended", description_addendum: 'If there is no official model number then a description may be provided (for example, `Headband with print\n(S-M)`). If a cap from a manufacturer was modified, then the field MUST be set to `custom`. If no cap\nwas used, then the `CapManufacturer` field MUST be `none` and this field MUST be `n/a`.")\n' }, SourceType: "recommended", DetectorType: "recommended", ShortChannelCount: "recommended", NIRSPlacementScheme: "recommended" } } }, pet: { PETHardware: { selectors: ['datatype == "pet"', 'suffix == "pet"'], fields: { Manufacturer: { level: "required", description_addendum: "Corresponds to DICOM Tag 0008, 0070 `Manufacturer`." }, ManufacturersModelName: { level: "required", description_addendum: "Corresponds to DICOM Tag 0008, 1090 `Manufacturers Model Name`." }, Units: { level: "required", description_addendum: 'SI unit for radioactivity (Becquerel) should be used (for example, "Bq/mL").\nCorresponds to DICOM Tag 0054, 1001 `Units`.\n' }, BodyPart: { level: "recommended", description_addendum: "Corresponds to DICOM Tag 0018, 0015 `Body Part Examined`." } } }, PETInstitutionInformation: { selectors: ['datatype == "pet"', 'suffix == "pet"'], fields: { InstitutionName: { level: "recommended", description_addendum: "Corresponds to DICOM Tag 0008, 0080 `InstitutionName`." }, InstitutionAddress: { level: "recommended", description_addendum: "Corresponds to DICOM Tag 0008, 0081 `InstitutionAddress`." }, InstitutionalDepartmentName: { level: "recommended", description_addendum: "Corresponds to DICOM Tag 0008, 1040 `Institutional Department Name`." } } }, PETRadioChemistry: { selectors: ['datatype == "pet"', 'suffix == "pet"'], fields: { TracerName: { level: "required", description_addendum: "Corresponds to DICOM Tags (0008,0105) `Mapping Resource` and\n(0008,0122) `Mapping Resource Name`.\n" }, TracerRadionuclide: { level: "required", description_addendum: "Corresponds to DICOM Tags (0008,0104) `CodeValue` and (0008,0104) `CodeMeaning`.\n" }, InjectedRadioactivity: "required", InjectedRadioactivityUnits: "required", InjectedMass: "required", InjectedMassUnits: "required", SpecificRadioactivity: "required", SpecificRadioactivityUnits: "required", ModeOfAdministration: "required", TracerRadLex: "recommended", TracerSNOMED: "recommended", TracerMolecularWeight: "recommended", TracerMolecularWeightUnits: "recommended", InjectedMassPerWeight: "recommended", InjectedMassPerWeightUnits: "recommended", SpecificRadioactivityMeasTime: "recommended", MolarActivity: "recommended", MolarActivityUnits: "recommended", MolarActivityMeasTime: "recommended", InfusionRadioactivity: { level: "recommended", level_addendum: "required if ModeOfAdministration is `'bolus-infusion'`" }, InfusionStart: { level: "recommended", level_addendum: "required if ModeOfAdministration is `'bolus-infusion'`" }, InfusionSpeed: { level: "recommended", level_addendum: "required if ModeOfAdministration is `'bolus-infusion'`" }, InfusionSpeedUnits: { level: "recommended", level_addendum: "required if ModeOfAdministration is `'bolus-infusion'`" }, InjectedVolume: { level: "recommended", level_addendum: "required if ModeOfAdministration is `'bolus-infusion'`" }, Purity: "recommended" } }, EntitiesBolusMetadata: { selectors: ['datatype == "pet"', 'suffix == "pet"', "sidecar.ModeOfAdministration == 'bolus-infusion'"], fields: { InfusionRadioactivity: "required", InfusionStart: "required", InfusionSpeed: "required", InfusionSpeedUnits: "required", InjectedVolume: "required" } }, PETPharmaceuticals: { selectors: ['datatype == "pet"', 'suffix == "pet"'], fields: { PharmaceuticalName: { level: "recommended", description_addendum: "Corresponds to DICOM Tag (0008,0034) `Intervention Drug Name`." }, PharmaceuticalDoseAmount: { level: "recommended", description_addendum: "Corresponds to DICOM Tag (0008,0028) `Intervention Drug Dose`." }, PharmaceuticalDoseUnits: "recommended", PharmaceuticalDoseRegimen: "recommended", PharmaceuticalDoseTime: { level: "recommended", description_addendum: "Corresponds to a combination of DICOM Tags (0008,0027) `Intervention Drug Stop Time`\nand (0008,0035) `Intervention Drug Start Time`.\n" }, Anaesthesia: "optional" } }, PETTime: { selectors: ['datatype == "pet"', 'suffix == "pet"'], fields: { TimeZero: "required", ScanStart: "required", InjectionStart: { level: "required", description_addendum: "Corresponds to DICOM Tag (0018,1072) `Radiopharmaceutical Start Time`." }, FrameTimesStart: "required", FrameDuration: "required", InjectionEnd: { level: "recommended", description_addendum: "Corresponds to DICOM Tag (0018,1073) `Radiopharmaceutical Stop Time`\nconverted to seconds relative to TimeZero.\n" }, ScanDate: { level: "deprecated", description_addendum: "Corresponds to DICOM Tag (0008,0022) `Acquisition Date`." } } }, PETReconstruction: { selectors: ['datatype == "pet"', 'suffix == "pet"'], fields: { AcquisitionMode: "required", ImageDecayCorrected: "required", ImageDecayCorrectionTime: "required", ReconMethodName: { level: "required", description_addendum: "This partly matches the DICOM Tag (0054,1103) `Reconstruction Method`." }, ReconMethodParameterLabels: { level: "required", description_addendum: "This partly matches the DICOM Tag (0054,1103) `Reconstruction Method`." }, ReconMethodParameterUnits: { level: "recommended", level_addendum: 'required if `ReconMethodParameterLabels` does not contain `"none"`', description_addendum: "This partly matches the DICOM Tag (0054,1103) `Reconstruction Method`." }, ReconMethodParameterValues: { level: "recommended", level_addendum: 'required if `ReconMethodParameterLabels` does not contain `"none"`', description_addendum: "This partly matches the DICOM Tag (0054,1103) `Reconstruction Method`." }, ReconFilterType: { level: "required", description_addendum: "This partly matches the DICOM Tag (0018,1210) `Convolution Kernel`." }, ReconFilterSize: { level: "recommended", level_addendum: 'required if `ReconFilterType` is not `"none"`', description_addendum: "This partly matches the DICOM Tag (0018,1210) `Convolution Kernel`." }, AttenuationCorrection: { level: "required", description_addendum: "This corresponds to DICOM Tag (0054,1101) `Attenuation Correction Method`." }, ReconMethodImplementationVersion: "recommended", AttenuationCorrectionMethodReference: "recommended", ScaleFactor: "recommended", ScatterFraction: { level: "recommended", description_addendum: "Corresponds to DICOM Tag (0054,1323) `Scatter Fraction Factor`." }, DecayCorrectionFactor: { level: "recommended", description_addendum: "Corresponds to DICOM Tag (0054,1321) `Decay Factor`." }, DoseCalibrationFactor: { level: "recommended", description_addendum: "Corresponds to DICOM Tag (0054,1322) `Dose Calibration Factor`." }, PromptRate: "recommended", SinglesRate: "recommended", RandomRate: "recommended" } }, EntitiesReconMethodMetadata: { selectors: ['datatype == "pet"', 'suffix == "pet"', '!intersects(sidecar.ReconMethodParameterLabels, ["none"])'], fields: { ReconMethodParameterValues: "required", ReconMethodParameterUnits: "required" } }, EntitiesReconFilterMetadata: { selectors: ['datatype == "pet"', 'suffix == "pet"', '!intersects(sidecar.ReconFilterType, ["none"])'], fields: { ReconFilterSize: "required" } }, BloodRecording: { selectors: ['datatype == "pet"', 'suffix == "blood"'], fields: { PlasmaAvail: "required", MetaboliteAvail: "required", WholeBloodAvail: "required", DispersionCorrected: "required", WithdrawalRate: "recommended", TubingType: "recommended", TubingLength: "recommended", DispersionConstant: "recommended", Haematocrit: "recommended", BloodDensity: "recommended" } }, BloodPlasmaFreeFraction: { selectors: ['datatype == "pet"', 'suffix == "blood"', "sidecar.PlasmaAvail == true"], fields: { PlasmaFreeFraction: { level: "recommended", level_addendum: "if `PlasmaAvail` is `true`" }, PlasmaFreeFractionMethod: { level: "recommended", level_addendum: "if `PlasmaAvail` is `true`" } } }, BloodMetaboliteMethod: { selectors: ['datatype == "pet"', 'suffix == "blood"', "sidecar.MetaboliteAvail == true"], fields: { MetaboliteMethod: { level: "required", level_addendum: "if `MetaboliteAvail` is `true`" }, MetaboliteRecoveryCorrectionApplied: { level: "required", level_addendum: "if `MetaboliteAvail` is `true`" } } }, PETTask: { selectors: ['datatype == "pet"', '"task" in entities'], fields: { TaskName: { level: "recommended", description_addendum: "If used to denote resting scans, a RECOMMENDED convention is to use labels\nbeginning with `rest`.\n" }, Instructions: { level: "recommended", description_addendum: "This is especially important in context of resting state recordings\nand distinguishing between eyes open and eyes closed paradigms.\n" }, TaskDescription: "recommended", CogAtlasID: "recommended", CogPOID: "recommended" } } } }, tabular_data: { derivatives: { common_derivatives: { SegmentationLookup: { selectors: ['dataset.dataset_description.DatasetType == "derivative"', 'intersects([suffix], ["dseg", "probseg"])'], columns: { index: "required", name__segmentations: "required", abbreviation: "optional", color: "optional", mapping: "optional" }, index_columns: ["index"] } } }, eeg: { EEGChannels: { selectors: ['datatype == "eeg"', 'suffix == "channels"', 'extension == ".tsv"'], initial_columns: ["name__channels", "type__channels", "units"], columns: { name__channels: "required", type__channels: "required", units: "required", description: "optional", sampling_frequency: "optional", reference__eeg: "optional", low_cutoff: "optional", high_cutoff: "optional", notch: "optional", status: "optional", status_description: "optional" }, index_columns: ["name__channels"], additional_columns: "allowed_if_defined" }, EEGElectrodes: { selectors: ['datatype == "eeg"', 'suffix == "electrodes"', 'extension == ".tsv"'], initial_columns: ["name__electrodes", "x", "y", "z"], columns: { name__electrodes: "required", x: "required", y: "required", z: "required", type__electrodes: "recommended", material: "recommended", impedance: "recommended" }, index_columns: ["name__electrodes"], additional_columns: "allowed_if_defined" } }, ieeg: { iEEGChannels: { selectors: ['datatype == "ieeg"', 'suffix == "channels"', 'extension == ".tsv"'], initial_columns: ["name__channels", "type__channels", "units", "low_cutoff", "high_cutoff"], columns: { name__channels: { level: "required", description_addendum: "When a corresponding electrode is specified in `_electrodes.tsv`,\nthe name of that electrode MAY be specified here and the reference electrode\nname MAY be provided in the `reference` column.\n" }, type__channels: "required", units: "required", low_cutoff: "required", high_cutoff: "required", reference__ieeg: "optional", group__channel: { level: "optional", description_addendum: "Note that any groups specified in `_electrodes.tsv` must match those present here.\n" }, sampling_frequency: "optional", description: "optional", notch: "optional", status: "optional", status_description: "optional" }, index_columns: ["name__channels"], additional_columns: "allowed_if_defined" }, iEEGElectrodes: { selectors: ['datatype == "ieeg"', 'suffix == "electrodes"', 'extension == ".tsv"'], initial_columns: ["name__electrodes", "x", "y", "z", "size"], columns: { name__electrodes: "required", x: "required", y: "required", z: { level: "required", description_addendum: "If electrodes are in 2D space this should be a column of `n/a` values.\n" }, size: "required", material: "recommended", manufacturer: "recommended", group__channel: { level: "recommended", description_addendum: "Note that any group specified here should match a group specified in `_channels.tsv`.\n" }, hemisphere: "recommended", type__electrodes: "optional", impedance: "optional", dimension: "optional" }, index_columns: ["name__electrodes"], additional_columns: "allowed_if_defined" } }, meg: { MEGChannels: { selectors: ['datatype == "meg"', 'suffix == "channels"', 'extension == ".tsv"'], initial_columns: ["name__channels", "type__channels", "units"], columns: { name__channels: "required", type__channels: "required", units: "required", description: "optional", sampling_frequency: "optional", low_cutoff: "optional", high_cutoff: "optional", notch: "optional", software_filters: "optional", status: "optional", status_description: "optional" }, index_columns: ["name__channels"], additional_columns: "allowed_if_defined" } }, modality_agnostic: { Participants: { selectors: ['path == "participants.tsv"'], initial_columns: ["participant_id"], columns: { participant_id: { level: "required", description_addendum: "There MUST be exactly one row for each participant.\n" }, species: "recommended", age: "recommended", sex: "recommended", handedness: "recommended", strain: "recommended", strain_rrid: "recommended" }, index_columns: ["participant_id"], additional_columns: "allowed" }, Samples: { selectors: ['path == "samples.tsv"'], columns: { sample_id: "required", participant_id: "required", sample_type: "required", pathology: "recommended", derived_from: "recommended" }, index_columns: ["sample_id", "participant_id"], additional_columns: "allowed" }, Scans: { selectors: ['suffix == "scans"', 'extension == ".tsv"'], initial_columns: ["filename"], columns: { filename: { level: "required", description_addendum: "There MUST be exactly one row for each file.\n" }, acq_time__scans: "optional" }, index_columns: ["filename"], additional_columns: "allowed" }, Sessions: { selectors: ['suffix == "sessions"', 'extension == ".tsv"'], initial_columns: ["session_id"], columns: { session_id: { level: "required", description_addendum: "There MUST be exactly one row for each session.\n" }, acq_time__sessions: "optional", pathology: "recommended" }, index_columns: ["session_id"], additional_columns: "allowed" } }, motion: { motionChannels: { selectors: ['datatype == "motion"', 'suffix == "channels"', 'extension == ".tsv"'], initial_columns: ["name__channels", "component", "type__channels", "tracked_point__channels", "units__motion"], columns: { name__channels: "required", component: "required", type__channels: "required", tracked_point__channels: "required", units__motion: "required", placement__motion: "recommended", description: "optional", sampling_frequency: "optional", status: "optional", status_description: "optional" }, additional_columns: "allowed_if_defined" } }, nirs: { nirsChannels: { selectors: ['datatype == "nirs"', 'suffix == "channels"', 'extension == ".tsv"'], initial_columns: ["name__channels", "type__channels", "source__channels", "detector__channels", "wavelength_nominal", "units__nirs"], columns: { name__channels: "required", type__channels: "required", source__channels: "required", detector__channels: "required", wavelength_nominal: "required", units__nirs: "required", sampling_frequency: { level: "optional", level_addendum: "required if `SamplingFrequency` is `n/a` in `_nirs.json`" }, component: { level: "optional", level_addendum: "required if `type` is `ACCEL`, `GYRO` or `MAGN`" }, wavelength_actual: "optional", low_cutoff: "optional", high_cutoff: "optional", description: "optional", wavelength_emission_actual: "optional", short_channel: "optional", status: "optional", status_description: "optional" }, additional_columns: "allowed_if_defined" }, nirsOptodes: { selectors: ['datatype == "nirs"', 'suffix == "optodes"', 'extension == ".tsv"'], initial_columns: ["name__optodes", "type__optodes", "x__optodes", "y__optodes", "z__optodes"], columns: { name__optodes: "required", type__optodes: "required", x__optodes: "required", y__optodes: "required", z__optodes: "required", template_x: { level: "optional", level_addendum: "required if `x` is `n/a`" }, template_y: { level: "optional", level_addendum: "required if `y` is `n/a`" }, template_z: { level: "optional", level_addendum: "required if `z` is `n/a`" }, description__optode: "optional", detector_type: "optional", source__optodes: "optional" }, additional_columns: "allowed_if_defined" } }, perf: { ASLContext: { selectors: ['datatype == "perf"', 'suffix == "aslcontext"'], columns: { volume_type: "required" }, additional_columns: "not_allowed" } }, pet: { Blood: { selectors: ['datatype == "pet"', 'suffix == "blood"', 'extension == ".tsv"'], columns: { time: "required", plasma_radioactivity: { level: "optional", level_addendum: "required if `PlasmaAvail` is `true`" }, metabolite_parent_fraction: { level: "optional", level_addendum: "required if `MetaboliteAvail` is `true`" }, metabolite_polar_fraction: { level: "optional", level_addendum: "recommended if `MetaboliteAvail` is `true`" }, hplc_recovery_fractions: { level: "optional", level_addendum: "required if `MetaboliteRecoveryCorrectionApplied` is `true`" }, whole_blood_radioactivity: { level: "optional", level_addendum: "required if `WholeBloodAvail` is `true`" } } }, BloodPlasma: { selectors: ['datatype == "pet"', 'suffix == "blood"', 'extension == ".tsv"', "sidecar.PlasmaAvail == true"], columns: { plasma_radioactivity: "required" } }, BloodMetabolite: { selectors: ['datatype == "pet"', 'suffix == "blood"', 'extension == ".tsv"', "sidecar.MetaboliteAvail == true"], columns: { metabolite_parent_fraction: "required", metabolite_polar_fraction: "recommended" } }, BloodMetaboliteCorrection: { selectors: ['datatype == "pet"', 'suffix == "blood"', 'extension == ".tsv"', "sidecar.MetaboliteRecoveryCorrectionApplied == true"], columns: { hplc_recovery_fractions: "required" } }, BloodWholeBlood: { selectors: ['datatype == "pet"', 'suffix == "blood"', 'extension == ".tsv"', "sidecar.WholeBloodAvail == true"], columns: { whole_blood_radioactivity: "required" } } }, physio: { PhysioColumns: { selectors: ['suffix == "physio"'], columns: { cardiac: "optional", respiratory: "optional", trigger: "optional" }, additional_columns: "allowed" } }, task: { TaskEvents: { selectors: ['"task" in entities', 'suffix == "events"'], columns: { onset: "required", duration: "required", trial_type: "optional", response_time: "optional", HED: "optional", stim_file: "optional" }, additional_columns: "allowed", initial_columns: ["onset", "duration"] } } } } };

// src/setup/loadSchema.ts
async function loadSchema(version = "latest") {
  const versionRegex = /^v\d/;
  let schemaUrl = version;
  const bidsSchema = typeof Deno !== "undefined" ? Deno.env.get("BIDS_SCHEMA") : void 0;
  if (bidsSchema !== void 0) {
    schemaUrl = bidsSchema;
  } else if (version === "latest" || versionRegex.test(version)) {
    schemaUrl = `https://bids-specification.readthedocs.io/en/${version}/schema.json`;
  }
  try {
    const schemaModule = await import(schemaUrl);
    return new Proxy(
      schemaModule.default,
      objectPathHandler
    );
  } catch (error2) {
    console.error(error2);
    console.error(
      `Warning, could not load schema from ${schemaUrl}, falling back to internal version`
    );
    return new Proxy(
      schema_default,
      objectPathHandler
    );
  }
}

// src/summary/collectSubjectMetadata.ts
var PARTICIPANT_ID = "participantId";
var collectSubjectMetadata = (participantsTsvContent) => {
  if (!participantsTsvContent) {
    return [];
  }
  const contentTable = participantsTsvContent.split(/\r?\n/).filter((row) => row !== "").map((row) => row.split("	"));
  const [snakeCaseHeaders, ...subjectData] = contentTable;
  const headers = snakeCaseHeaders.map(
    (header) => header === "participant_id" ? PARTICIPANT_ID : header
  );
  const targetKeys = [PARTICIPANT_ID, "age", "sex", "group"].map((key) => ({
    key,
    index: headers.findIndex((targetKey) => targetKey === key)
  })).filter(({ index }) => index !== -1);
  const participantIdKey = targetKeys.find(({ key }) => key === PARTICIPANT_ID);
  const ageKey = targetKeys.find(({ key }) => key === "age");
  if (participantIdKey === void 0)
    return [];
  else
    return subjectData.map((data) => {
      data[participantIdKey.index] = data[participantIdKey.index].replace(
        /^sub-/,
        ""
      );
      if (ageKey)
        data[ageKey.index] = parseInt(data[ageKey.index]);
      return data;
    }).map(
      (data) => (
        //extract all target metadata for each subject
        targetKeys.reduce(
          (subject, { key, index }) => ({
            ...subject,
            [key]: data[index]
          }),
          {}
        )
      )
    );
};

// src/summary/summary.ts
var modalityPrettyLookup = {
  mri: "MRI",
  pet: "PET",
  meg: "MEG",
  eeg: "EEG",
  ieeg: "iEEG",
  micro: "Microscopy"
};
var secondaryLookup = {
  dwi: "MRI_Diffusion",
  anat: "MRI_Structural",
  func: "MRI_Functional",
  perf: "MRI_Perfusion"
};
function computeModalities(modalities) {
  const nonZero = Object.keys(modalities).filter((a) => modalities[a] !== 0);
  if (nonZero.length === 0) {
    return [];
  }
  const sortedModalities = nonZero.sort((a, b) => {
    if (modalities[b] === modalities[a]) {
      if (b === "mri") {
        return -1;
      } else {
        return 0;
      }
    }
    return modalities[b] - modalities[a];
  });
  return sortedModalities.map(
    (mod) => mod in modalityPrettyLookup ? modalityPrettyLookup[mod] : mod
  );
}
function computeSecondaryModalities(secondary) {
  const nonZeroSecondary = Object.keys(secondary).filter(
    (a) => secondary[a] !== 0
  );
  const sortedSecondary = nonZeroSecondary.sort(
    (a, b) => secondary[b] - secondary[a]
  );
  return sortedSecondary;
}
var Summary = class {
  constructor() {
    this.dataProcessed = false;
    this.totalFiles = -1;
    this.size = 0;
    this.sessions = /* @__PURE__ */ new Set();
    this.subjects = /* @__PURE__ */ new Set();
    this.subjectMetadata = [];
    this.tasks = /* @__PURE__ */ new Set();
    this.pet = {};
    this.dataTypes = /* @__PURE__ */ new Set();
    this.modalitiesCount = {
      mri: 0,
      pet: 0,
      meg: 0,
      eeg: 0,
      ieeg: 0,
      microscopy: 0
    };
    this.secondaryModalitiesCount = {
      MRI_Diffusion: 0,
      MRI_Structural: 0,
      MRI_Functional: 0,
      MRI_Perfusion: 0,
      PET_Static: 0,
      PET_Dynamic: 0,
      iEEG_ECoG: 0,
      iEEG_SEEG: 0
    };
    this.schemaVersion = "";
  }
  get modalities() {
    return computeModalities(this.modalitiesCount);
  }
  get secondaryModalities() {
    return computeSecondaryModalities(this.secondaryModalitiesCount);
  }
  async update(context) {
    if (context.file.path.startsWith("/derivatives") && !this.dataProcessed) {
      return;
    }
    this.totalFiles++;
    this.size += await context.file.size;
    if ("sub" in context.entities) {
      this.subjects.add(context.entities.sub);
    }
    if ("ses" in context.entities) {
      this.sessions.add(context.entities.ses);
    }
    if (context.datatype.length) {
      this.dataTypes.add(context.datatype);
    }
    if (context.extension === ".json") {
      const parsedJson = await context.json;
      if ("TaskName" in parsedJson) {
        this.tasks.add(parsedJson.TaskName);
      }
    }
    if (context.modality) {
      this.modalitiesCount[context.modality]++;
    }
    if (context.datatype in secondaryLookup) {
      const key = secondaryLookup[context.datatype];
      this.secondaryModalitiesCount[key]++;
    } else if (context.datatype === "pet" && "rec" in context.entities) {
      if (["acstat", "nacstat"].includes(context.entities.rec)) {
        this.secondaryModalitiesCount.PET_Static++;
      } else if (["acdyn", "nacdyn"].includes(context.entities.rec)) {
        this.secondaryModalitiesCount.PET_Dynamic++;
      }
    }
    if (context.file.path.endsWith("participants.tsv")) {
      const tsvContents = await context.file.text();
      this.subjectMetadata = collectSubjectMetadata(tsvContents);
    }
  }
  formatOutput() {
    return {
      sessions: Array.from(this.sessions),
      subjects: Array.from(this.subjects),
      subjectMetadata: this.subjectMetadata,
      tasks: Array.from(this.tasks),
      modalities: this.modalities,
      secondaryModalities: this.secondaryModalities,
      totalFiles: this.totalFiles,
      size: this.size,
      dataProcessed: this.dataProcessed,
      pet: this.pet,
      dataTypes: Array.from(this.dataTypes),
      schemaVersion: this.schemaVersion
    };
  }
};

// src/issues/list.ts
var filenameIssues = {
  INVALID_ENTITY_LABEL: {
    severity: "error",
    reason: "entity label doesn't match format found for files with this suffix"
  },
  ENTITY_WITH_NO_LABEL: {
    severity: "error",
    reason: "Found an entity with no label."
  },
  MISSING_REQUIRED_ENTITY: {
    severity: "error",
    reason: "Missing required entity for files with this suffix."
  },
  ENTITY_NOT_IN_RULE: {
    severity: "error",
    reason: "Entity not listed as required or optional for files with this suffix"
  },
  DATATYPE_MISMATCH: {
    severity: "error",
    reason: "The datatype directory does not match datatype of found suffix and extension"
  },
  ALL_FILENAME_RULES_HAVE_ISSUES: {
    severity: "error",
    reason: "Multiple filename rules were found as potential matches. All of them had at least one issue during filename validation."
  },
  EXTENSION_MISMATCH: {
    severity: "error",
    reason: "Extension used by file does not match allowed extensions for its suffix"
  },
  JSON_KEY_REQUIRED: {
    severity: "error",
    reason: "A data file's JSON sidecar is missing a key listed as required."
  },
  JSON_KEY_RECOMMENDED: {
    severity: "warning",
    reason: "A data files JSON sidecar is missing a key listed as recommended."
  },
  TSV_ERROR: {
    severity: "error",
    reason: "generic place holder for errors from tsv files"
  },
  TSV_COLUMN_MISSING: {
    severity: "error",
    reason: "A required column is missing"
  },
  TSV_COLUMN_ORDER_INCORRECT: {
    severity: "error",
    reason: "Some TSV columns are in the incorrect order"
  },
  TSV_ADDITIONAL_COLUMNS_NOT_ALLOWED: {
    severity: "error",
    reason: "A TSV file has extra columns which are not allowed for its file type"
  },
  TSV_INDEX_VALUE_NOT_UNIQUE: {
    severity: "error",
    reason: "An index column(s) was specified for the tsv file and not all of the values for it are unique."
  },
  TSV_VALUE_INCORRECT_TYPE: {
    severity: "error",
    reason: "A value in a column did match the acceptable type for that column headers specified format."
  },
  CHECK_ERROR: {
    severity: "error",
    reason: "generic place holder for errors from failed `checks` evaluated from schema."
  },
  NOT_INCLUDED: {
    severity: "error",
    reason: 'Files with such naming scheme are not part of BIDS specification. This error is most commonly caused by typos in file names that make them not BIDS compatible. Please consult the specification and make sure your files are named correctly. If this is not a file naming issue (for example when including files not yet covered by the BIDS specification) you should include a ".bidsignore" file in your dataset (see https://github.com/bids-standard/bids-validator#bidsignore for details). Please note that derived (processed) data should be placed in /derivatives folder and source data (such as DICOMS or behavioural logs in proprietary formats) should be placed in the /sourcedata folder.'
  },
  EMPTY_FILE: {
    severity: "error",
    reason: "Empty files not allowed."
  }
};
var nonSchemaIssues = { ...filenameIssues };

// src/types/issues.ts
var Issue = class {
  constructor({
    key,
    severity,
    reason,
    files
  }) {
    this.key = key;
    this.severity = severity;
    this.reason = reason;
    if (Array.isArray(files)) {
      this.files = /* @__PURE__ */ new Map();
      for (const f of files) {
        this.files.set(f.path, f);
      }
    } else {
      this.files = files;
    }
  }
  get helpUrl() {
    return `https://neurostars.org/search?q=${this.key}`;
  }
};

// src/issues/datasetIssues.ts
var CODE_DEPRECATED = Number.MIN_SAFE_INTEGER;
var issueFile = (issue, f) => {
  const evidence = f.evidence || "";
  const reason = issue.reason || "";
  const line = f.line || 0;
  const character = f.character || 0;
  return {
    key: issue.key,
    code: CODE_DEPRECATED,
    file: { path: f.path, name: f.name, relativePath: f.path },
    evidence,
    line,
    character,
    severity: issue.severity,
    reason,
    helpUrl: issue.helpUrl
  };
};
var DatasetIssues = class extends Map {
  constructor() {
    super();
  }
  add({
    key,
    reason,
    severity = "error",
    files = []
  }) {
    const existingIssue = this.get(key);
    if (existingIssue) {
      for (const f of files) {
        existingIssue.files.set(f.path, f);
      }
      return existingIssue;
    } else {
      const newIssue = new Issue({
        key,
        severity,
        reason,
        files
      });
      this.set(key, newIssue);
      return newIssue;
    }
  }
  // Shorthand to test if an issue has occurred
  hasIssue({ key }) {
    if (this.has(key)) {
      return true;
    }
    return false;
  }
  addNonSchemaIssue(key, files) {
    if (key in nonSchemaIssues) {
      this.add({
        key,
        reason: nonSchemaIssues[key].reason,
        severity: nonSchemaIssues[key].severity,
        files
      });
    } else {
      throw new Error(
        `key: ${key} does not exist in non-schema issues definitions`
      );
    }
  }
  fileInIssues(path3) {
    const matchingIssues = [];
    for (const [key, issue] of this) {
      if (issue.files.get(path3)) {
        matchingIssues.push(issue);
      }
    }
    return matchingIssues;
  }
  /**
   * Report Issue keys related to a file
   * @param path File path relative to dataset root
   * @returns Array of matching issue keys
   */
  getFileIssueKeys(path3) {
    return this.fileInIssues(path3).map((issue) => issue.key);
  }
  /**
   * Format output
   *
   * Converts from new internal representation to old IssueOutput structure
   */
  formatOutput() {
    const output = {
      errors: [],
      warnings: []
    };
    for (const [key, issue] of this) {
      const outputIssue = {
        severity: issue.severity,
        key: issue.key,
        code: CODE_DEPRECATED,
        additionalFileCount: 0,
        reason: issue.reason,
        files: Array.from(issue.files.values()).map((f) => issueFile(issue, f)),
        helpUrl: issue.helpUrl
      };
      if (issue.severity === "warning") {
        output.warnings.push(outputIssue);
      } else {
        output.errors.push(outputIssue);
      }
    }
    return output;
  }
};

// src/validators/filenameValidate.ts
var CHECKS = [
  missingLabel,
  atRoot,
  entityLabelCheck,
  checkRules
];
async function filenameValidate(schema, context) {
  for (const check of CHECKS) {
    await check(schema, context);
  }
  return Promise.resolve();
}
function isAtRoot(context) {
  if (context.file.path.split(SEP).length !== 2) {
    return false;
  }
  return true;
}
async function missingLabel(schema, context) {
  const fileNoLabelEntities = Object.keys(context.entities).filter(
    (key) => context.entities[key] === "NOENTITY"
  );
  const fileEntities = Object.keys(context.entities).filter(
    (key) => !fileNoLabelEntities.includes(key)
  );
  if (fileNoLabelEntities.length) {
    context.issues.addNonSchemaIssue("ENTITY_WITH_NO_LABEL", [
      { ...context.file, evidence: fileNoLabelEntities.join(", ") }
    ]);
  }
  return Promise.resolve();
}
function atRoot(schema, context) {
  return Promise.resolve();
}
function lookupEntityLiteral(name, schema) {
  if (schema.objects && hasProp(schema.objects, "entities") && hasProp(schema.objects.entities, name)) {
    const entityObj = schema.objects.entities[name];
    if (hasProp(entityObj, "name")) {
      return entityObj.name;
    }
  }
  return "";
}
function getEntityByLiteral(fileEntity, schema) {
  if ("entities" in schema.objects && typeof schema.objects.entities === "object") {
    const entities = schema.objects.entities;
    const key = Object.keys(entities).find((key2) => {
      return hasProp(entities, key2) && hasProp(entities[key2], "name") && // @ts-expect-error
      entities[key2].name === fileEntity;
    });
    if (key && hasProp(entities, key)) {
      return entities[key];
    }
  }
  return null;
}
async function entityLabelCheck(schema, context) {
  if (!("formats" in schema.objects) || !("entities" in schema.objects)) {
    throw new Error("schema missing keys");
  }
  const formats = schema.objects.formats;
  const entities = schema.objects.entities;
  Object.keys(context.entities).map((fileEntity) => {
    const entity = getEntityByLiteral(fileEntity, schema);
    if (entity && entity.format && typeof entity.format === "string" && hasProp(formats, entity.format)) {
      const pattern = formats[entity.format].pattern;
      const rePattern = new RegExp(`^${pattern}$`);
      const label = context.entities[fileEntity];
      if (!rePattern.test(label)) {
        context.issues.addNonSchemaIssue("INVALID_ENTITY_LABEL", [
          {
            ...context.file,
            evidence: `entity: ${fileEntity} label: ${label} pattern: ${pattern}`
          }
        ]);
      }
    } else {
    }
  });
  return Promise.resolve();
}
var ruleChecks = [
  entityRuleIssue,
  datatypeMismatch,
  extensionMismatch
];
async function checkRules(schema, context) {
  if (context.filenameRules.length === 1) {
    for (const check of ruleChecks) {
      check(
        context.filenameRules[0],
        schema,
        context
      );
    }
  } else {
    const ogIssues = context.issues;
    const noIssues = [];
    const someIssues = [];
    for (const path3 of context.filenameRules) {
      const tempIssues = new DatasetIssues();
      context.issues = tempIssues;
      for (const check of ruleChecks) {
        check(path3, schema, context);
      }
      tempIssues.size ? someIssues.push([path3, tempIssues]) : noIssues.push([path3, tempIssues]);
    }
    if (noIssues.length) {
      context.issues = ogIssues;
      context.filenameRules = [noIssues[0][0]];
    } else if (someIssues.length) {
      context.issues = ogIssues;
      context.issues.addNonSchemaIssue("ALL_FILENAME_RULES_HAVE_ISSUES", [
        {
          ...context.file,
          evidence: `Rules that matched with issues: ${someIssues.map((x) => x[0]).join(", ")}`
        }
      ]);
    }
  }
  return Promise.resolve();
}
function entityRuleIssue(path3, schema, context) {
  const rule = schema[path3];
  if (!("entities" in rule)) {
    if (Object.keys(context.entities).length > 0) {
    }
    return;
  }
  const fileEntities = Object.keys(context.entities);
  const ruleEntities = Object.keys(rule.entities).map(
    (key) => lookupEntityLiteral(key, schema)
  );
  if (!isAtRoot(context)) {
    const ruleEntitiesRequired = Object.entries(rule.entities).filter(([_, v]) => v === "required").map(([k, _]) => lookupEntityLiteral(k, schema));
    const missingRequired = ruleEntitiesRequired.filter(
      (required) => !fileEntities.includes(required)
    );
    if (missingRequired.length) {
      context.issues.addNonSchemaIssue("MISSING_REQUIRED_ENTITY", [
        {
          ...context.file,
          evidence: `${missingRequired.join(", ")} missing from rule ${path3}`
        }
      ]);
    }
  }
  const entityNotInRule = fileEntities.filter(
    (fileEntity) => !ruleEntities.includes(fileEntity)
  );
  if (entityNotInRule.length) {
    context.issues.addNonSchemaIssue("ENTITY_NOT_IN_RULE", [
      {
        ...context.file,
        evidence: `${entityNotInRule.join(", ")} not in rule ${path3}`
      }
    ]);
  }
}
function datatypeMismatch(path3, schema, context) {
  const rule = schema[path3];
  if (!!context.datatype && Array.isArray(rule.datatypes) && !rule.datatypes.includes(context.datatype)) {
    context.issues.addNonSchemaIssue("DATATYPE_MISMATCH", [
      { ...context.file, evidence: `Datatype rule being applied: ${path3}` }
    ]);
  }
}
async function extensionMismatch(path3, schema, context) {
  const rule = schema[path3];
  if (Array.isArray(rule.extensions) && !rule.extensions.includes(context.extension)) {
    context.issues.addNonSchemaIssue("EXTENSION_MISMATCH", [
      { ...context.file, evidence: `Rule: ${path3}` }
    ]);
  }
}

// src/validators/filenameIdentify.ts
var CHECKS2 = [
  datatypeFromDirectory,
  findRuleMatches,
  hasMatch,
  cleanContext
];
async function filenameIdentify(schema, context) {
  for (const check of CHECKS2) {
    await check(schema, context);
  }
}
function findRuleMatches(schema, context) {
  const schemaPath = "rules.files";
  Object.keys(schema[schemaPath]).map((key) => {
    const path3 = `${schemaPath}.${key}`;
    _findRuleMatches(schema[path3], path3, context);
  });
  return Promise.resolve();
}
function _findRuleMatches(node, path3, context) {
  if ("path" in node && context.file.name.endsWith(node.path) || "stem" in node && context.file.name.startsWith(node.stem) || "suffixes" in node && node.suffixes.includes(context.suffix)) {
    context.filenameRules.push(path3);
    return;
  }
  if (!("path" in node || "stem" in node || "suffixes" in node) && typeof node === "object") {
    Object.keys(node).map((key) => {
      _findRuleMatches(node[key], `${path3}.${key}`, context);
    });
  }
}
async function datatypeFromDirectory(schema, context) {
  const subEntity = schema.objects.entities.subject.name;
  const subFormat = schema.objects.formats[subEntity.format];
  const sesEntity = schema.objects.entities.session.name;
  const sesFormat = schema.objects.formats[sesEntity.format];
  const parts = context.file.path.split(SEP);
  let datatypeIndex = 2;
  if (parts[0] !== "") {
  }
  const subParts = parts[1].split("-");
  if (!(subParts.length === 2 && subParts[0] === subEntity)) {
  }
  if (parts.length < 3) {
    return Promise.resolve();
  }
  const sesParts = parts[2].split("-");
  if (sesParts.length === 2 && sesParts[0] === sesEntity) {
    datatypeIndex = 3;
  }
  const dirDatatype = parts[datatypeIndex];
  for (let key in schema.rules.modalities) {
    if (schema.rules.modalities[key].datatypes.includes(dirDatatype)) {
      context.modality = key;
      context.datatype = dirDatatype;
      return Promise.resolve();
    }
  }
}
function hasMatch(schema, context) {
  if (context.filenameRules.length === 0 && context.file.path !== "/.bidsignore") {
    context.issues.addNonSchemaIssue("NOT_INCLUDED", [context.file]);
  }
  if (context.filenameRules.length > 1) {
    const datatypeMatch = context.filenameRules.filter((rulePath) => {
      if (Array.isArray(schema[rulePath].datatypes)) {
        return schema[rulePath].datatypes.includes(context.datatype);
      } else {
        return false;
      }
    });
    if (datatypeMatch.length > 0) {
      context.filenameRules = datatypeMatch;
    }
  }
  if (context.filenameRules.length > 1) {
    const entExtMatch = context.filenameRules.filter((rulePath) => {
      return entitiesExtensionsInRule(schema, context, rulePath);
    });
    if (entExtMatch.length > 0) {
      context.filenameRules = [entExtMatch[0]];
    }
  }
  if (context.filenameRules.length > 1) {
  }
  return Promise.resolve();
}
function entitiesExtensionsInRule(schema, context, path3) {
  const rule = schema[path3];
  const fileEntities = Object.keys(context.entities);
  const ruleEntities = Object.keys(rule.entities).map(
    (key) => lookupEntityLiteral(key, schema)
  );
  const extInRule = !rule.extensions || rule.extensions && rule.extensions.includes(context.extension);
  const entInRule = !rule.entities || rule.entities && fileEntities.every((ent) => {
    return ruleEntities.includes(ent);
  });
  return extInRule && entInRule;
}
function cleanContext(schema, context) {
  const rules = context.filenameRules.map((path3) => schema[path3]);
  const filenameParts = [
    ["entities", "entities", {}],
    ["extensions", "extension", ""],
    ["suffixes", "suffix", ""]
  ];
  filenameParts.map((part) => {
    if (rules.every(
      (rule) => !rule[part[0]] || Object.keys(rule[part[0]]).length === 0
    )) {
      context[part[1]] = part[2];
    }
  });
}

// src/validators/internal/emptyFile.ts
var emptyFile = (schema, context) => {
  if (context.file.size === 0) {
    context.issues.addNonSchemaIssue("EMPTY_FILE", [context.file]);
  }
  return Promise.resolve();
};

// src/validators/bids.ts
var CHECKS3 = [
  emptyFile,
  filenameIdentify,
  filenameValidate,
  applyRules
];
async function validate(fileTree, options) {
  const issues = new DatasetIssues();
  const summary = new Summary();
  const schema = await loadSchema(options.schema);
  summary.schemaVersion = schema.schema_version;
  const ddFile = fileTree.files.find(
    (file) => file.name === "dataset_description.json"
  );
  let dsContext;
  if (ddFile) {
    const description = await ddFile.text().then((text) => JSON.parse(text));
    summary.dataProcessed = description.DatasetType === "derivative";
    dsContext = new BIDSContextDataset(options, description);
  } else {
    dsContext = new BIDSContextDataset(options);
  }
  let derivatives = [];
  fileTree.directories = fileTree.directories.filter((dir) => {
    if (dir.name === "derivatives") {
      dir.directories.map((deriv) => {
        if (deriv.files.some(
          (file) => file.name === "dataset_description.json"
        )) {
          derivatives.push(deriv);
        }
      });
      return false;
    }
    return true;
  });
  for await (const context of walkFileTree(fileTree, issues, dsContext)) {
    if (context.file.ignored) {
      continue;
    }
    await context.asyncLoads();
    for (const check of CHECKS3) {
      await check(schema, context);
    }
    await summary.update(context);
  }
  let derivativesSummary = {};
  await Promise.allSettled(
    derivatives.map(async (deriv) => {
      derivativesSummary[deriv.name] = await validate(deriv, options);
      return derivativesSummary[deriv.name];
    })
  );
  let output = {
    issues,
    summary: summary.formatOutput()
  };
  if (Object.keys(derivativesSummary).length) {
    output["derivativesSummary"] = derivativesSummary;
  }
  return output;
}

// http-url:https://deno.land/x/pretty_bytes@v2.0.0/mod.ts
function prettyBytes(num, options = {}) {
  if (!Number.isFinite(num)) {
    throw new TypeError(`Expected a finite number, got ${typeof num}: ${num}`);
  }
  const UNITS_FIRSTLETTER = (options.bits ? "b" : "B") + "kMGTPEZY";
  if (options.signed && num === 0) {
    return ` 0 ${UNITS_FIRSTLETTER[0]}`;
  }
  const prefix = num < 0 ? "-" : options.signed ? "+" : "";
  num = Math.abs(num);
  const localeOptions = getLocaleOptions(options);
  if (num < 1) {
    const numberString2 = toLocaleString(num, options.locale, localeOptions);
    return prefix + numberString2 + " " + UNITS_FIRSTLETTER[0];
  }
  const exponent = Math.min(
    Math.floor(
      options.binary ? Math.log(num) / Math.log(1024) : Math.log10(num) / 3
    ),
    UNITS_FIRSTLETTER.length - 1
  );
  num /= Math.pow(options.binary ? 1024 : 1e3, exponent);
  if (!localeOptions) {
    num = Number(num.toPrecision(3));
  }
  const numberString = toLocaleString(
    num,
    options.locale,
    localeOptions
  );
  let unit = UNITS_FIRSTLETTER[exponent];
  if (exponent > 0) {
    unit += options.binary ? "i" : "";
    unit += options.bits ? "bit" : "B";
  }
  return prefix + numberString + " " + unit;
}
function getLocaleOptions({ maximumFractionDigits, minimumFractionDigits }) {
  if (maximumFractionDigits || minimumFractionDigits) {
    return {
      maximumFractionDigits,
      minimumFractionDigits
    };
  }
}
function toLocaleString(num, locale, options) {
  if (typeof locale === "string" || Array.isArray(locale)) {
    return num.toLocaleString(locale, options);
  } else if (locale === true || options !== void 0) {
    return num.toLocaleString(void 0, options);
  }
  return num.toString();
}

// src/utils/output.ts
function consoleFormat(result, options) {
  const output = [];
  if (result.issues.size === 0) {
    output.push(colors_exports.green("This dataset appears to be BIDS compatible."));
  } else {
    result.issues.forEach((issue) => output.push(formatIssue(issue, options)));
  }
  output.push("");
  output.push(formatSummary(result.summary));
  output.push("");
  return output.join("\n");
}
function formatIssue(issue, options) {
  const severity = issue.severity;
  const color = severity === "error" ? "red" : "yellow";
  const output = [];
  output.push(
    "	" + colors_exports[color](
      `[${severity.toUpperCase()}] ${issue.reason} (${issue.key})`
    )
  );
  output.push("");
  let fileOutCount = 0;
  issue.files.forEach((file) => {
    if (!options?.verbose && fileOutCount > 2) {
      return;
    }
    output.push("		." + file.path);
    if (file.line) {
      let msg = "			@ line: " + file.line;
      if (file.character) {
        msg += " character: " + file.character;
      }
      output.push(msg);
    }
    if (file.evidence) {
      output.push("			Evidence: " + file.evidence);
    }
    fileOutCount++;
  });
  if (!options?.verbose) {
    output.push("");
    output.push("		" + issue.files.size + " more files with the same issue");
  }
  output.push("");
  if (issue.helpUrl) {
    output.push(
      colors_exports.cyan(
        "	Please visit " + issue.helpUrl + " for existing conversations about this issue."
      )
    );
    output.push("");
  }
  return output.join("\n");
}
function formatSummary(summary) {
  const output = [];
  const numSessions = summary.sessions.length > 0 ? summary.sessions.length : 1;
  const column1 = [
    summary.totalFiles + " Files, " + prettyBytes(summary.size),
    summary.subjects.length + " - Subjects " + numSessions + " - Sessions"
  ], column2 = summary.tasks, column3 = summary.modalities;
  const longestColumn = Math.max(column1.length, column2.length, column3.length);
  const pad = "       ";
  const headers = [
    pad,
    colors_exports.magenta("Summary:") + pad,
    colors_exports.magenta("Available Tasks:") + pad,
    colors_exports.magenta("Available Modalities:")
  ];
  const rows = [];
  for (let i = 0; i < longestColumn; i++) {
    const val1 = column1[i] ? column1[i] + pad : "";
    const val2 = column2[i] ? column2[i] + pad : "";
    const val3 = column3[i] ? column3[i] : "";
    rows.push([pad, val1, val2, val3]);
  }
  const table = new Table().header(headers).body(rows).border(false).padding(1).indent(2).toString();
  output.push(table);
  output.push("");
  output.push(
    colors_exports.cyan(
      "	If you have any questions, please post on https://neurostars.org/tags/bids."
    )
  );
  return output.join("\n");
}

// src/main.ts
async function main() {
  const options = await parseOptions(Deno.args);
  setupLogging(options.debug);
  const absolutePath = resolve3(options.datasetPath);
  const tree = await readFileTree(absolutePath);
  const schemaResult = await validate(tree, options);
  if (options.json) {
    console.log(
      JSON.stringify(schemaResult, (key, value) => {
        if (value instanceof Map) {
          return Array.from(value.values());
        } else {
          return value;
        }
      })
    );
  } else {
    console.log(
      consoleFormat(schemaResult, {
        verbose: options.verbose ? options.verbose : false
      })
    );
  }
}
export {
  fileListToTree,
  main,
  validate
};