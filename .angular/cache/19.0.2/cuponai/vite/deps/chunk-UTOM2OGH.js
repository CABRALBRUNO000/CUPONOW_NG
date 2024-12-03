import {
  BaseCumulativeTransformOutputParser,
  JsonOutputParser,
  OutputParserException,
  StructuredOutputParser
} from "./chunk-W7L2JLTK.js";
import {
  BaseLangChain,
  BaseLanguageModel,
  RunnablePassthrough,
  calculateMaxTokens,
  isOpenAITool
} from "./chunk-CFFRNM6V.js";
import {
  AIMessage,
  AIMessageChunk,
  AsyncCaller,
  CallbackManager,
  ChatGenerationChunk,
  ChatMessage,
  ChatMessageChunk,
  FunctionMessageChunk,
  GenerationChunk,
  HumanMessage,
  HumanMessageChunk,
  RUN_KEY,
  Runnable,
  RunnableLambda,
  RunnableSequence,
  SystemMessageChunk,
  ToolInputParsingException,
  ToolMessage,
  ToolMessageChunk,
  ZodFirstPartyTypeKind,
  _isToolCall,
  coerceMessageLikeToMessage,
  concat,
  ensureConfig,
  getBufferString,
  getEnvironmentVariable,
  isAIMessage,
  isAIMessageChunk,
  isLogStreamHandler,
  isStreamEventsHandler,
  parseCallbackConfigArg,
  parsePartialJson,
  z,
  zodToJsonSchema
} from "./chunk-ZKGI5TDH.js";
import {
  __async,
  __asyncGenerator,
  __await,
  __forAwait,
  __objRest,
  __spreadProps,
  __spreadValues,
  __superGet
} from "./chunk-522HO4QB.js";

// node_modules/openai/internal/qs/formats.mjs
var default_format = "RFC3986";
var formatters = {
  RFC1738: (v) => String(v).replace(/%20/g, "+"),
  RFC3986: (v) => String(v)
};
var RFC1738 = "RFC1738";

// node_modules/openai/internal/qs/utils.mjs
var is_array = Array.isArray;
var hex_table = (() => {
  const array = [];
  for (let i = 0; i < 256; ++i) {
    array.push("%" + ((i < 16 ? "0" : "") + i.toString(16)).toUpperCase());
  }
  return array;
})();
var limit = 1024;
var encode = (str2, _defaultEncoder, charset, _kind, format) => {
  if (str2.length === 0) {
    return str2;
  }
  let string = str2;
  if (typeof str2 === "symbol") {
    string = Symbol.prototype.toString.call(str2);
  } else if (typeof str2 !== "string") {
    string = String(str2);
  }
  if (charset === "iso-8859-1") {
    return escape(string).replace(/%u[0-9a-f]{4}/gi, function($0) {
      return "%26%23" + parseInt($0.slice(2), 16) + "%3B";
    });
  }
  let out = "";
  for (let j = 0; j < string.length; j += limit) {
    const segment = string.length >= limit ? string.slice(j, j + limit) : string;
    const arr = [];
    for (let i = 0; i < segment.length; ++i) {
      let c = segment.charCodeAt(i);
      if (c === 45 || // -
      c === 46 || // .
      c === 95 || // _
      c === 126 || // ~
      c >= 48 && c <= 57 || // 0-9
      c >= 65 && c <= 90 || // a-z
      c >= 97 && c <= 122 || // A-Z
      format === RFC1738 && (c === 40 || c === 41)) {
        arr[arr.length] = segment.charAt(i);
        continue;
      }
      if (c < 128) {
        arr[arr.length] = hex_table[c];
        continue;
      }
      if (c < 2048) {
        arr[arr.length] = hex_table[192 | c >> 6] + hex_table[128 | c & 63];
        continue;
      }
      if (c < 55296 || c >= 57344) {
        arr[arr.length] = hex_table[224 | c >> 12] + hex_table[128 | c >> 6 & 63] + hex_table[128 | c & 63];
        continue;
      }
      i += 1;
      c = 65536 + ((c & 1023) << 10 | segment.charCodeAt(i) & 1023);
      arr[arr.length] = hex_table[240 | c >> 18] + hex_table[128 | c >> 12 & 63] + hex_table[128 | c >> 6 & 63] + hex_table[128 | c & 63];
    }
    out += arr.join("");
  }
  return out;
};
function is_buffer(obj) {
  if (!obj || typeof obj !== "object") {
    return false;
  }
  return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));
}
function maybe_map(val, fn) {
  if (is_array(val)) {
    const mapped = [];
    for (let i = 0; i < val.length; i += 1) {
      mapped.push(fn(val[i]));
    }
    return mapped;
  }
  return fn(val);
}

// node_modules/openai/internal/qs/stringify.mjs
var has = Object.prototype.hasOwnProperty;
var array_prefix_generators = {
  brackets(prefix) {
    return String(prefix) + "[]";
  },
  comma: "comma",
  indices(prefix, key) {
    return String(prefix) + "[" + key + "]";
  },
  repeat(prefix) {
    return String(prefix);
  }
};
var is_array2 = Array.isArray;
var push = Array.prototype.push;
var push_to_array = function(arr, value_or_array) {
  push.apply(arr, is_array2(value_or_array) ? value_or_array : [value_or_array]);
};
var to_ISO = Date.prototype.toISOString;
var defaults = {
  addQueryPrefix: false,
  allowDots: false,
  allowEmptyArrays: false,
  arrayFormat: "indices",
  charset: "utf-8",
  charsetSentinel: false,
  delimiter: "&",
  encode: true,
  encodeDotInKeys: false,
  encoder: encode,
  encodeValuesOnly: false,
  format: default_format,
  formatter: formatters[default_format],
  /** @deprecated */
  indices: false,
  serializeDate(date) {
    return to_ISO.call(date);
  },
  skipNulls: false,
  strictNullHandling: false
};
function is_non_nullish_primitive(v) {
  return typeof v === "string" || typeof v === "number" || typeof v === "boolean" || typeof v === "symbol" || typeof v === "bigint";
}
var sentinel = {};
function inner_stringify(object, prefix, generateArrayPrefix, commaRoundTrip, allowEmptyArrays, strictNullHandling, skipNulls, encodeDotInKeys, encoder, filter, sort, allowDots, serializeDate, format, formatter, encodeValuesOnly, charset, sideChannel) {
  let obj = object;
  let tmp_sc = sideChannel;
  let step = 0;
  let find_flag = false;
  while ((tmp_sc = tmp_sc.get(sentinel)) !== void 0 && !find_flag) {
    const pos = tmp_sc.get(object);
    step += 1;
    if (typeof pos !== "undefined") {
      if (pos === step) {
        throw new RangeError("Cyclic object value");
      } else {
        find_flag = true;
      }
    }
    if (typeof tmp_sc.get(sentinel) === "undefined") {
      step = 0;
    }
  }
  if (typeof filter === "function") {
    obj = filter(prefix, obj);
  } else if (obj instanceof Date) {
    obj = serializeDate?.(obj);
  } else if (generateArrayPrefix === "comma" && is_array2(obj)) {
    obj = maybe_map(obj, function(value) {
      if (value instanceof Date) {
        return serializeDate?.(value);
      }
      return value;
    });
  }
  if (obj === null) {
    if (strictNullHandling) {
      return encoder && !encodeValuesOnly ? (
        // @ts-expect-error
        encoder(prefix, defaults.encoder, charset, "key", format)
      ) : prefix;
    }
    obj = "";
  }
  if (is_non_nullish_primitive(obj) || is_buffer(obj)) {
    if (encoder) {
      const key_value = encodeValuesOnly ? prefix : encoder(prefix, defaults.encoder, charset, "key", format);
      return [formatter?.(key_value) + "=" + // @ts-expect-error
      formatter?.(encoder(obj, defaults.encoder, charset, "value", format))];
    }
    return [formatter?.(prefix) + "=" + formatter?.(String(obj))];
  }
  const values = [];
  if (typeof obj === "undefined") {
    return values;
  }
  let obj_keys;
  if (generateArrayPrefix === "comma" && is_array2(obj)) {
    if (encodeValuesOnly && encoder) {
      obj = maybe_map(obj, encoder);
    }
    obj_keys = [{
      value: obj.length > 0 ? obj.join(",") || null : void 0
    }];
  } else if (is_array2(filter)) {
    obj_keys = filter;
  } else {
    const keys = Object.keys(obj);
    obj_keys = sort ? keys.sort(sort) : keys;
  }
  const encoded_prefix = encodeDotInKeys ? String(prefix).replace(/\./g, "%2E") : String(prefix);
  const adjusted_prefix = commaRoundTrip && is_array2(obj) && obj.length === 1 ? encoded_prefix + "[]" : encoded_prefix;
  if (allowEmptyArrays && is_array2(obj) && obj.length === 0) {
    return adjusted_prefix + "[]";
  }
  for (let j = 0; j < obj_keys.length; ++j) {
    const key = obj_keys[j];
    const value = (
      // @ts-ignore
      typeof key === "object" && typeof key.value !== "undefined" ? key.value : obj[key]
    );
    if (skipNulls && value === null) {
      continue;
    }
    const encoded_key = allowDots && encodeDotInKeys ? key.replace(/\./g, "%2E") : key;
    const key_prefix = is_array2(obj) ? typeof generateArrayPrefix === "function" ? generateArrayPrefix(adjusted_prefix, encoded_key) : adjusted_prefix : adjusted_prefix + (allowDots ? "." + encoded_key : "[" + encoded_key + "]");
    sideChannel.set(object, step);
    const valueSideChannel = /* @__PURE__ */ new WeakMap();
    valueSideChannel.set(sentinel, sideChannel);
    push_to_array(values, inner_stringify(
      value,
      key_prefix,
      generateArrayPrefix,
      commaRoundTrip,
      allowEmptyArrays,
      strictNullHandling,
      skipNulls,
      encodeDotInKeys,
      // @ts-ignore
      generateArrayPrefix === "comma" && encodeValuesOnly && is_array2(obj) ? null : encoder,
      filter,
      sort,
      allowDots,
      serializeDate,
      format,
      formatter,
      encodeValuesOnly,
      charset,
      valueSideChannel
    ));
  }
  return values;
}
function normalize_stringify_options(opts = defaults) {
  if (typeof opts.allowEmptyArrays !== "undefined" && typeof opts.allowEmptyArrays !== "boolean") {
    throw new TypeError("`allowEmptyArrays` option can only be `true` or `false`, when provided");
  }
  if (typeof opts.encodeDotInKeys !== "undefined" && typeof opts.encodeDotInKeys !== "boolean") {
    throw new TypeError("`encodeDotInKeys` option can only be `true` or `false`, when provided");
  }
  if (opts.encoder !== null && typeof opts.encoder !== "undefined" && typeof opts.encoder !== "function") {
    throw new TypeError("Encoder has to be a function.");
  }
  const charset = opts.charset || defaults.charset;
  if (typeof opts.charset !== "undefined" && opts.charset !== "utf-8" && opts.charset !== "iso-8859-1") {
    throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
  }
  let format = default_format;
  if (typeof opts.format !== "undefined") {
    if (!has.call(formatters, opts.format)) {
      throw new TypeError("Unknown format option provided.");
    }
    format = opts.format;
  }
  const formatter = formatters[format];
  let filter = defaults.filter;
  if (typeof opts.filter === "function" || is_array2(opts.filter)) {
    filter = opts.filter;
  }
  let arrayFormat;
  if (opts.arrayFormat && opts.arrayFormat in array_prefix_generators) {
    arrayFormat = opts.arrayFormat;
  } else if ("indices" in opts) {
    arrayFormat = opts.indices ? "indices" : "repeat";
  } else {
    arrayFormat = defaults.arrayFormat;
  }
  if ("commaRoundTrip" in opts && typeof opts.commaRoundTrip !== "boolean") {
    throw new TypeError("`commaRoundTrip` must be a boolean, or absent");
  }
  const allowDots = typeof opts.allowDots === "undefined" ? !!opts.encodeDotInKeys === true ? true : defaults.allowDots : !!opts.allowDots;
  return {
    addQueryPrefix: typeof opts.addQueryPrefix === "boolean" ? opts.addQueryPrefix : defaults.addQueryPrefix,
    // @ts-ignore
    allowDots,
    allowEmptyArrays: typeof opts.allowEmptyArrays === "boolean" ? !!opts.allowEmptyArrays : defaults.allowEmptyArrays,
    arrayFormat,
    charset,
    charsetSentinel: typeof opts.charsetSentinel === "boolean" ? opts.charsetSentinel : defaults.charsetSentinel,
    commaRoundTrip: !!opts.commaRoundTrip,
    delimiter: typeof opts.delimiter === "undefined" ? defaults.delimiter : opts.delimiter,
    encode: typeof opts.encode === "boolean" ? opts.encode : defaults.encode,
    encodeDotInKeys: typeof opts.encodeDotInKeys === "boolean" ? opts.encodeDotInKeys : defaults.encodeDotInKeys,
    encoder: typeof opts.encoder === "function" ? opts.encoder : defaults.encoder,
    encodeValuesOnly: typeof opts.encodeValuesOnly === "boolean" ? opts.encodeValuesOnly : defaults.encodeValuesOnly,
    filter,
    format,
    formatter,
    serializeDate: typeof opts.serializeDate === "function" ? opts.serializeDate : defaults.serializeDate,
    skipNulls: typeof opts.skipNulls === "boolean" ? opts.skipNulls : defaults.skipNulls,
    // @ts-ignore
    sort: typeof opts.sort === "function" ? opts.sort : null,
    strictNullHandling: typeof opts.strictNullHandling === "boolean" ? opts.strictNullHandling : defaults.strictNullHandling
  };
}
function stringify(object, opts = {}) {
  let obj = object;
  const options = normalize_stringify_options(opts);
  let obj_keys;
  let filter;
  if (typeof options.filter === "function") {
    filter = options.filter;
    obj = filter("", obj);
  } else if (is_array2(options.filter)) {
    filter = options.filter;
    obj_keys = filter;
  }
  const keys = [];
  if (typeof obj !== "object" || obj === null) {
    return "";
  }
  const generateArrayPrefix = array_prefix_generators[options.arrayFormat];
  const commaRoundTrip = generateArrayPrefix === "comma" && options.commaRoundTrip;
  if (!obj_keys) {
    obj_keys = Object.keys(obj);
  }
  if (options.sort) {
    obj_keys.sort(options.sort);
  }
  const sideChannel = /* @__PURE__ */ new WeakMap();
  for (let i = 0; i < obj_keys.length; ++i) {
    const key = obj_keys[i];
    if (options.skipNulls && obj[key] === null) {
      continue;
    }
    push_to_array(keys, inner_stringify(
      obj[key],
      key,
      // @ts-expect-error
      generateArrayPrefix,
      commaRoundTrip,
      options.allowEmptyArrays,
      options.strictNullHandling,
      options.skipNulls,
      options.encodeDotInKeys,
      options.encode ? options.encoder : null,
      options.filter,
      options.sort,
      options.allowDots,
      options.serializeDate,
      options.format,
      options.formatter,
      options.encodeValuesOnly,
      options.charset,
      sideChannel
    ));
  }
  const joined = keys.join(options.delimiter);
  let prefix = options.addQueryPrefix === true ? "?" : "";
  if (options.charsetSentinel) {
    if (options.charset === "iso-8859-1") {
      prefix += "utf8=%26%2310003%3B&";
    } else {
      prefix += "utf8=%E2%9C%93&";
    }
  }
  return joined.length > 0 ? prefix + joined : "";
}

// node_modules/openai/version.mjs
var VERSION = "4.74.0";

// node_modules/openai/_shims/registry.mjs
var auto = false;
var kind = void 0;
var fetch2 = void 0;
var Request2 = void 0;
var Response2 = void 0;
var Headers2 = void 0;
var FormData2 = void 0;
var Blob2 = void 0;
var File2 = void 0;
var ReadableStream2 = void 0;
var getMultipartRequestOptions = void 0;
var getDefaultAgent = void 0;
var fileFromPath = void 0;
var isFsReadStream = void 0;
function setShims(shims, options = {
  auto: false
}) {
  if (auto) {
    throw new Error(`you must \`import 'openai/shims/${shims.kind}'\` before importing anything else from openai`);
  }
  if (kind) {
    throw new Error(`can't \`import 'openai/shims/${shims.kind}'\` after \`import 'openai/shims/${kind}'\``);
  }
  auto = options.auto;
  kind = shims.kind;
  fetch2 = shims.fetch;
  Request2 = shims.Request;
  Response2 = shims.Response;
  Headers2 = shims.Headers;
  FormData2 = shims.FormData;
  Blob2 = shims.Blob;
  File2 = shims.File;
  ReadableStream2 = shims.ReadableStream;
  getMultipartRequestOptions = shims.getMultipartRequestOptions;
  getDefaultAgent = shims.getDefaultAgent;
  fileFromPath = shims.fileFromPath;
  isFsReadStream = shims.isFsReadStream;
}

// node_modules/openai/_shims/MultipartBody.mjs
var MultipartBody = class {
  constructor(body) {
    this.body = body;
  }
  get [Symbol.toStringTag]() {
    return "MultipartBody";
  }
};

// node_modules/openai/_shims/web-runtime.mjs
function getRuntime({
  manuallyImported
} = {}) {
  const recommendation = manuallyImported ? `You may need to use polyfills` : `Add one of these imports before your first \`import … from 'openai'\`:
- \`import 'openai/shims/node'\` (if you're running on Node)
- \`import 'openai/shims/web'\` (otherwise)
`;
  let _fetch, _Request, _Response, _Headers;
  try {
    _fetch = fetch;
    _Request = Request;
    _Response = Response;
    _Headers = Headers;
  } catch (error) {
    throw new Error(`this environment is missing the following Web Fetch API type: ${error.message}. ${recommendation}`);
  }
  return {
    kind: "web",
    fetch: _fetch,
    Request: _Request,
    Response: _Response,
    Headers: _Headers,
    FormData: (
      // @ts-ignore
      typeof FormData !== "undefined" ? FormData : class FormData {
        // @ts-ignore
        constructor() {
          throw new Error(`file uploads aren't supported in this environment yet as 'FormData' is undefined. ${recommendation}`);
        }
      }
    ),
    Blob: typeof Blob !== "undefined" ? Blob : class Blob {
      constructor() {
        throw new Error(`file uploads aren't supported in this environment yet as 'Blob' is undefined. ${recommendation}`);
      }
    },
    File: (
      // @ts-ignore
      typeof File !== "undefined" ? File : class File {
        // @ts-ignore
        constructor() {
          throw new Error(`file uploads aren't supported in this environment yet as 'File' is undefined. ${recommendation}`);
        }
      }
    ),
    ReadableStream: (
      // @ts-ignore
      typeof ReadableStream !== "undefined" ? ReadableStream : class ReadableStream {
        // @ts-ignore
        constructor() {
          throw new Error(`streaming isn't supported in this environment yet as 'ReadableStream' is undefined. ${recommendation}`);
        }
      }
    ),
    getMultipartRequestOptions: (form, opts) => __async(this, null, function* () {
      return __spreadProps(__spreadValues({}, opts), {
        body: new MultipartBody(form)
      });
    }),
    getDefaultAgent: (url) => void 0,
    fileFromPath: () => {
      throw new Error("The `fileFromPath` function is only supported in Node. See the README for more details: https://www.github.com/openai/openai-node#file-uploads");
    },
    isFsReadStream: (value) => false
  };
}

// node_modules/openai/_shims/index.mjs
if (!kind) setShims(getRuntime(), {
  auto: true
});

// node_modules/openai/error.mjs
var OpenAIError = class extends Error {
};
var APIError = class _APIError extends OpenAIError {
  constructor(status, error, message, headers) {
    super(`${_APIError.makeMessage(status, error, message)}`);
    this.status = status;
    this.headers = headers;
    this.request_id = headers?.["x-request-id"];
    const data = error;
    this.error = data;
    this.code = data?.["code"];
    this.param = data?.["param"];
    this.type = data?.["type"];
  }
  static makeMessage(status, error, message) {
    const msg = error?.message ? typeof error.message === "string" ? error.message : JSON.stringify(error.message) : error ? JSON.stringify(error) : message;
    if (status && msg) {
      return `${status} ${msg}`;
    }
    if (status) {
      return `${status} status code (no body)`;
    }
    if (msg) {
      return msg;
    }
    return "(no status code or body)";
  }
  static generate(status, errorResponse, message, headers) {
    if (!status) {
      return new APIConnectionError({
        message,
        cause: castToError(errorResponse)
      });
    }
    const error = errorResponse?.["error"];
    if (status === 400) {
      return new BadRequestError(status, error, message, headers);
    }
    if (status === 401) {
      return new AuthenticationError(status, error, message, headers);
    }
    if (status === 403) {
      return new PermissionDeniedError(status, error, message, headers);
    }
    if (status === 404) {
      return new NotFoundError(status, error, message, headers);
    }
    if (status === 409) {
      return new ConflictError(status, error, message, headers);
    }
    if (status === 422) {
      return new UnprocessableEntityError(status, error, message, headers);
    }
    if (status === 429) {
      return new RateLimitError(status, error, message, headers);
    }
    if (status >= 500) {
      return new InternalServerError(status, error, message, headers);
    }
    return new _APIError(status, error, message, headers);
  }
};
var APIUserAbortError = class extends APIError {
  constructor({
    message
  } = {}) {
    super(void 0, void 0, message || "Request was aborted.", void 0);
    this.status = void 0;
  }
};
var APIConnectionError = class extends APIError {
  constructor({
    message,
    cause
  }) {
    super(void 0, void 0, message || "Connection error.", void 0);
    this.status = void 0;
    if (cause) this.cause = cause;
  }
};
var APIConnectionTimeoutError = class extends APIConnectionError {
  constructor({
    message
  } = {}) {
    super({
      message: message ?? "Request timed out."
    });
  }
};
var BadRequestError = class extends APIError {
  constructor() {
    super(...arguments);
    this.status = 400;
  }
};
var AuthenticationError = class extends APIError {
  constructor() {
    super(...arguments);
    this.status = 401;
  }
};
var PermissionDeniedError = class extends APIError {
  constructor() {
    super(...arguments);
    this.status = 403;
  }
};
var NotFoundError = class extends APIError {
  constructor() {
    super(...arguments);
    this.status = 404;
  }
};
var ConflictError = class extends APIError {
  constructor() {
    super(...arguments);
    this.status = 409;
  }
};
var UnprocessableEntityError = class extends APIError {
  constructor() {
    super(...arguments);
    this.status = 422;
  }
};
var RateLimitError = class extends APIError {
  constructor() {
    super(...arguments);
    this.status = 429;
  }
};
var InternalServerError = class extends APIError {
};
var LengthFinishReasonError = class extends OpenAIError {
  constructor() {
    super(`Could not parse response content as the length limit was reached`);
  }
};
var ContentFilterFinishReasonError = class extends OpenAIError {
  constructor() {
    super(`Could not parse response content as the request was rejected by the content filter`);
  }
};

// node_modules/openai/internal/decoders/line.mjs
var LineDecoder = class _LineDecoder {
  constructor() {
    this.buffer = [];
    this.trailingCR = false;
  }
  decode(chunk) {
    let text = this.decodeText(chunk);
    if (this.trailingCR) {
      text = "\r" + text;
      this.trailingCR = false;
    }
    if (text.endsWith("\r")) {
      this.trailingCR = true;
      text = text.slice(0, -1);
    }
    if (!text) {
      return [];
    }
    const trailingNewline = _LineDecoder.NEWLINE_CHARS.has(text[text.length - 1] || "");
    let lines = text.split(_LineDecoder.NEWLINE_REGEXP);
    if (trailingNewline) {
      lines.pop();
    }
    if (lines.length === 1 && !trailingNewline) {
      this.buffer.push(lines[0]);
      return [];
    }
    if (this.buffer.length > 0) {
      lines = [this.buffer.join("") + lines[0], ...lines.slice(1)];
      this.buffer = [];
    }
    if (!trailingNewline) {
      this.buffer = [lines.pop() || ""];
    }
    return lines;
  }
  decodeText(bytes) {
    if (bytes == null) return "";
    if (typeof bytes === "string") return bytes;
    if (typeof Buffer !== "undefined") {
      if (bytes instanceof Buffer) {
        return bytes.toString();
      }
      if (bytes instanceof Uint8Array) {
        return Buffer.from(bytes).toString();
      }
      throw new OpenAIError(`Unexpected: received non-Uint8Array (${bytes.constructor.name}) stream chunk in an environment with a global "Buffer" defined, which this library assumes to be Node. Please report this error.`);
    }
    if (typeof TextDecoder !== "undefined") {
      if (bytes instanceof Uint8Array || bytes instanceof ArrayBuffer) {
        this.textDecoder ?? (this.textDecoder = new TextDecoder("utf8"));
        return this.textDecoder.decode(bytes);
      }
      throw new OpenAIError(`Unexpected: received non-Uint8Array/ArrayBuffer (${bytes.constructor.name}) in a web platform. Please report this error.`);
    }
    throw new OpenAIError(`Unexpected: neither Buffer nor TextDecoder are available as globals. Please report this error.`);
  }
  flush() {
    if (!this.buffer.length && !this.trailingCR) {
      return [];
    }
    const lines = [this.buffer.join("")];
    this.buffer = [];
    this.trailingCR = false;
    return lines;
  }
};
LineDecoder.NEWLINE_CHARS = /* @__PURE__ */ new Set(["\n", "\r"]);
LineDecoder.NEWLINE_REGEXP = /\r\n|[\n\r]/g;

// node_modules/openai/streaming.mjs
var Stream = class _Stream {
  constructor(iterator, controller) {
    this.iterator = iterator;
    this.controller = controller;
  }
  static fromSSEResponse(response, controller) {
    let consumed = false;
    function iterator() {
      return __asyncGenerator(this, null, function* () {
        if (consumed) {
          throw new Error("Cannot iterate over a consumed stream, use `.tee()` to split the stream.");
        }
        consumed = true;
        let done = false;
        try {
          try {
            for (var iter = __forAwait(_iterSSEMessages(response, controller)), more, temp, error; more = !(temp = yield new __await(iter.next())).done; more = false) {
              const sse = temp.value;
              if (done) continue;
              if (sse.data.startsWith("[DONE]")) {
                done = true;
                continue;
              }
              if (sse.event === null) {
                let data;
                try {
                  data = JSON.parse(sse.data);
                } catch (e) {
                  console.error(`Could not parse message into JSON:`, sse.data);
                  console.error(`From chunk:`, sse.raw);
                  throw e;
                }
                if (data && data.error) {
                  throw new APIError(void 0, data.error, void 0, void 0);
                }
                yield data;
              } else {
                let data;
                try {
                  data = JSON.parse(sse.data);
                } catch (e) {
                  console.error(`Could not parse message into JSON:`, sse.data);
                  console.error(`From chunk:`, sse.raw);
                  throw e;
                }
                if (sse.event == "error") {
                  throw new APIError(void 0, data.error, data.message, void 0);
                }
                yield {
                  event: sse.event,
                  data
                };
              }
            }
          } catch (temp) {
            error = [temp];
          } finally {
            try {
              more && (temp = iter.return) && (yield new __await(temp.call(iter)));
            } finally {
              if (error)
                throw error[0];
            }
          }
          done = true;
        } catch (e) {
          if (e instanceof Error && e.name === "AbortError") return;
          throw e;
        } finally {
          if (!done) controller.abort();
        }
      });
    }
    return new _Stream(iterator, controller);
  }
  /**
   * Generates a Stream from a newline-separated ReadableStream
   * where each item is a JSON value.
   */
  static fromReadableStream(readableStream, controller) {
    let consumed = false;
    function iterLines() {
      return __asyncGenerator(this, null, function* () {
        const lineDecoder = new LineDecoder();
        const iter = readableStreamAsyncIterable(readableStream);
        try {
          for (var iter2 = __forAwait(iter), more, temp, error; more = !(temp = yield new __await(iter2.next())).done; more = false) {
            const chunk = temp.value;
            for (const line of lineDecoder.decode(chunk)) {
              yield line;
            }
          }
        } catch (temp) {
          error = [temp];
        } finally {
          try {
            more && (temp = iter2.return) && (yield new __await(temp.call(iter2)));
          } finally {
            if (error)
              throw error[0];
          }
        }
        for (const line of lineDecoder.flush()) {
          yield line;
        }
      });
    }
    function iterator() {
      return __asyncGenerator(this, null, function* () {
        if (consumed) {
          throw new Error("Cannot iterate over a consumed stream, use `.tee()` to split the stream.");
        }
        consumed = true;
        let done = false;
        try {
          try {
            for (var iter = __forAwait(iterLines()), more, temp, error; more = !(temp = yield new __await(iter.next())).done; more = false) {
              const line = temp.value;
              if (done) continue;
              if (line) yield JSON.parse(line);
            }
          } catch (temp) {
            error = [temp];
          } finally {
            try {
              more && (temp = iter.return) && (yield new __await(temp.call(iter)));
            } finally {
              if (error)
                throw error[0];
            }
          }
          done = true;
        } catch (e) {
          if (e instanceof Error && e.name === "AbortError") return;
          throw e;
        } finally {
          if (!done) controller.abort();
        }
      });
    }
    return new _Stream(iterator, controller);
  }
  [Symbol.asyncIterator]() {
    return this.iterator();
  }
  /**
   * Splits the stream into two streams which can be
   * independently read from at different speeds.
   */
  tee() {
    const left = [];
    const right = [];
    const iterator = this.iterator();
    const teeIterator = (queue) => {
      return {
        next: () => {
          if (queue.length === 0) {
            const result = iterator.next();
            left.push(result);
            right.push(result);
          }
          return queue.shift();
        }
      };
    };
    return [new _Stream(() => teeIterator(left), this.controller), new _Stream(() => teeIterator(right), this.controller)];
  }
  /**
   * Converts this stream to a newline-separated ReadableStream of
   * JSON stringified values in the stream
   * which can be turned back into a Stream with `Stream.fromReadableStream()`.
   */
  toReadableStream() {
    const self = this;
    let iter;
    const encoder = new TextEncoder();
    return new ReadableStream2({
      start() {
        return __async(this, null, function* () {
          iter = self[Symbol.asyncIterator]();
        });
      },
      pull(ctrl) {
        return __async(this, null, function* () {
          try {
            const {
              value,
              done
            } = yield iter.next();
            if (done) return ctrl.close();
            const bytes = encoder.encode(JSON.stringify(value) + "\n");
            ctrl.enqueue(bytes);
          } catch (err) {
            ctrl.error(err);
          }
        });
      },
      cancel() {
        return __async(this, null, function* () {
          yield iter.return?.();
        });
      }
    });
  }
};
function _iterSSEMessages(response, controller) {
  return __asyncGenerator(this, null, function* () {
    if (!response.body) {
      controller.abort();
      throw new OpenAIError(`Attempted to iterate over a response with no body`);
    }
    const sseDecoder = new SSEDecoder();
    const lineDecoder = new LineDecoder();
    const iter = readableStreamAsyncIterable(response.body);
    try {
      for (var iter2 = __forAwait(iterSSEChunks(iter)), more, temp, error; more = !(temp = yield new __await(iter2.next())).done; more = false) {
        const sseChunk = temp.value;
        for (const line of lineDecoder.decode(sseChunk)) {
          const sse = sseDecoder.decode(line);
          if (sse) yield sse;
        }
      }
    } catch (temp) {
      error = [temp];
    } finally {
      try {
        more && (temp = iter2.return) && (yield new __await(temp.call(iter2)));
      } finally {
        if (error)
          throw error[0];
      }
    }
    for (const line of lineDecoder.flush()) {
      const sse = sseDecoder.decode(line);
      if (sse) yield sse;
    }
  });
}
function iterSSEChunks(iterator) {
  return __asyncGenerator(this, null, function* () {
    let data = new Uint8Array();
    try {
      for (var iter = __forAwait(iterator), more, temp, error; more = !(temp = yield new __await(iter.next())).done; more = false) {
        const chunk = temp.value;
        if (chunk == null) {
          continue;
        }
        const binaryChunk = chunk instanceof ArrayBuffer ? new Uint8Array(chunk) : typeof chunk === "string" ? new TextEncoder().encode(chunk) : chunk;
        let newData = new Uint8Array(data.length + binaryChunk.length);
        newData.set(data);
        newData.set(binaryChunk, data.length);
        data = newData;
        let patternIndex;
        while ((patternIndex = findDoubleNewlineIndex(data)) !== -1) {
          yield data.slice(0, patternIndex);
          data = data.slice(patternIndex);
        }
      }
    } catch (temp) {
      error = [temp];
    } finally {
      try {
        more && (temp = iter.return) && (yield new __await(temp.call(iter)));
      } finally {
        if (error)
          throw error[0];
      }
    }
    if (data.length > 0) {
      yield data;
    }
  });
}
function findDoubleNewlineIndex(buffer) {
  const newline = 10;
  const carriage = 13;
  for (let i = 0; i < buffer.length - 2; i++) {
    if (buffer[i] === newline && buffer[i + 1] === newline) {
      return i + 2;
    }
    if (buffer[i] === carriage && buffer[i + 1] === carriage) {
      return i + 2;
    }
    if (buffer[i] === carriage && buffer[i + 1] === newline && i + 3 < buffer.length && buffer[i + 2] === carriage && buffer[i + 3] === newline) {
      return i + 4;
    }
  }
  return -1;
}
var SSEDecoder = class {
  constructor() {
    this.event = null;
    this.data = [];
    this.chunks = [];
  }
  decode(line) {
    if (line.endsWith("\r")) {
      line = line.substring(0, line.length - 1);
    }
    if (!line) {
      if (!this.event && !this.data.length) return null;
      const sse = {
        event: this.event,
        data: this.data.join("\n"),
        raw: this.chunks
      };
      this.event = null;
      this.data = [];
      this.chunks = [];
      return sse;
    }
    this.chunks.push(line);
    if (line.startsWith(":")) {
      return null;
    }
    let [fieldname, _, value] = partition(line, ":");
    if (value.startsWith(" ")) {
      value = value.substring(1);
    }
    if (fieldname === "event") {
      this.event = value;
    } else if (fieldname === "data") {
      this.data.push(value);
    }
    return null;
  }
};
function partition(str2, delimiter) {
  const index = str2.indexOf(delimiter);
  if (index !== -1) {
    return [str2.substring(0, index), delimiter, str2.substring(index + delimiter.length)];
  }
  return [str2, "", ""];
}
function readableStreamAsyncIterable(stream) {
  if (stream[Symbol.asyncIterator]) return stream;
  const reader = stream.getReader();
  return {
    next() {
      return __async(this, null, function* () {
        try {
          const result = yield reader.read();
          if (result?.done) reader.releaseLock();
          return result;
        } catch (e) {
          reader.releaseLock();
          throw e;
        }
      });
    },
    return() {
      return __async(this, null, function* () {
        const cancelPromise = reader.cancel();
        reader.releaseLock();
        yield cancelPromise;
        return {
          done: true,
          value: void 0
        };
      });
    },
    [Symbol.asyncIterator]() {
      return this;
    }
  };
}

// node_modules/openai/uploads.mjs
var isResponseLike = (value) => value != null && typeof value === "object" && typeof value.url === "string" && typeof value.blob === "function";
var isFileLike = (value) => value != null && typeof value === "object" && typeof value.name === "string" && typeof value.lastModified === "number" && isBlobLike(value);
var isBlobLike = (value) => value != null && typeof value === "object" && typeof value.size === "number" && typeof value.type === "string" && typeof value.text === "function" && typeof value.slice === "function" && typeof value.arrayBuffer === "function";
var isUploadable = (value) => {
  return isFileLike(value) || isResponseLike(value) || isFsReadStream(value);
};
function toFile(value, name, options) {
  return __async(this, null, function* () {
    value = yield value;
    if (isFileLike(value)) {
      return value;
    }
    if (isResponseLike(value)) {
      const blob = yield value.blob();
      name || (name = new URL(value.url).pathname.split(/[\\/]/).pop() ?? "unknown_file");
      const data = isBlobLike(blob) ? [yield blob.arrayBuffer()] : [blob];
      return new File2(data, name, options);
    }
    const bits = yield getBytes(value);
    name || (name = getName(value) ?? "unknown_file");
    if (!options?.type) {
      const type = bits[0]?.type;
      if (typeof type === "string") {
        options = __spreadProps(__spreadValues({}, options), {
          type
        });
      }
    }
    return new File2(bits, name, options);
  });
}
function getBytes(value) {
  return __async(this, null, function* () {
    let parts = [];
    if (typeof value === "string" || ArrayBuffer.isView(value) || // includes Uint8Array, Buffer, etc.
    value instanceof ArrayBuffer) {
      parts.push(value);
    } else if (isBlobLike(value)) {
      parts.push(yield value.arrayBuffer());
    } else if (isAsyncIterableIterator(value)) {
      try {
        for (var iter = __forAwait(value), more, temp, error; more = !(temp = yield iter.next()).done; more = false) {
          const chunk = temp.value;
          parts.push(chunk);
        }
      } catch (temp) {
        error = [temp];
      } finally {
        try {
          more && (temp = iter.return) && (yield temp.call(iter));
        } finally {
          if (error)
            throw error[0];
        }
      }
    } else {
      throw new Error(`Unexpected data type: ${typeof value}; constructor: ${value?.constructor?.name}; props: ${propsForError(value)}`);
    }
    return parts;
  });
}
function propsForError(value) {
  const props = Object.getOwnPropertyNames(value);
  return `[${props.map((p) => `"${p}"`).join(", ")}]`;
}
function getName(value) {
  return getStringFromMaybeBuffer(value.name) || getStringFromMaybeBuffer(value.filename) || // For fs.ReadStream
  getStringFromMaybeBuffer(value.path)?.split(/[\\/]/).pop();
}
var getStringFromMaybeBuffer = (x) => {
  if (typeof x === "string") return x;
  if (typeof Buffer !== "undefined" && x instanceof Buffer) return String(x);
  return void 0;
};
var isAsyncIterableIterator = (value) => value != null && typeof value === "object" && typeof value[Symbol.asyncIterator] === "function";
var isMultipartBody = (body) => body && typeof body === "object" && body.body && body[Symbol.toStringTag] === "MultipartBody";
var multipartFormRequestOptions = (opts) => __async(void 0, null, function* () {
  const form = yield createForm(opts.body);
  return getMultipartRequestOptions(form, opts);
});
var createForm = (body) => __async(void 0, null, function* () {
  const form = new FormData2();
  yield Promise.all(Object.entries(body || {}).map(([key, value]) => addFormValue(form, key, value)));
  return form;
});
var addFormValue = (form, key, value) => __async(void 0, null, function* () {
  if (value === void 0) return;
  if (value == null) {
    throw new TypeError(`Received null for "${key}"; to pass null in FormData, you must use the string 'null'`);
  }
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    form.append(key, String(value));
  } else if (isUploadable(value)) {
    const file = yield toFile(value);
    form.append(key, file);
  } else if (Array.isArray(value)) {
    yield Promise.all(value.map((entry) => addFormValue(form, key + "[]", entry)));
  } else if (typeof value === "object") {
    yield Promise.all(Object.entries(value).map(([name, prop]) => addFormValue(form, `${key}[${name}]`, prop)));
  } else {
    throw new TypeError(`Invalid value given to form, expected a string, number, boolean, object, Array, File or Blob but got ${value} instead`);
  }
});

// node_modules/openai/core.mjs
var __classPrivateFieldSet = function(receiver, state, value, kind2, f) {
  if (kind2 === "m") throw new TypeError("Private method is not writable");
  if (kind2 === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind2 === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
};
var __classPrivateFieldGet = function(receiver, state, kind2, f) {
  if (kind2 === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind2 === "m" ? f : kind2 === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _AbstractPage_client;
function defaultParseResponse(props) {
  return __async(this, null, function* () {
    const {
      response
    } = props;
    if (props.options.stream) {
      debug("response", response.status, response.url, response.headers, response.body);
      if (props.options.__streamClass) {
        return props.options.__streamClass.fromSSEResponse(response, props.controller);
      }
      return Stream.fromSSEResponse(response, props.controller);
    }
    if (response.status === 204) {
      return null;
    }
    if (props.options.__binaryResponse) {
      return response;
    }
    const contentType = response.headers.get("content-type");
    const isJSON = contentType?.includes("application/json") || contentType?.includes("application/vnd.api+json");
    if (isJSON) {
      const json = yield response.json();
      debug("response", response.status, response.url, response.headers, json);
      return _addRequestID(json, response);
    }
    const text = yield response.text();
    debug("response", response.status, response.url, response.headers, text);
    return text;
  });
}
function _addRequestID(value, response) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return value;
  }
  return Object.defineProperty(value, "_request_id", {
    value: response.headers.get("x-request-id"),
    enumerable: false
  });
}
var APIPromise = class _APIPromise extends Promise {
  constructor(responsePromise, parseResponse = defaultParseResponse) {
    super((resolve) => {
      resolve(null);
    });
    this.responsePromise = responsePromise;
    this.parseResponse = parseResponse;
  }
  _thenUnwrap(transform) {
    return new _APIPromise(this.responsePromise, (props) => __async(this, null, function* () {
      return _addRequestID(transform(yield this.parseResponse(props), props), props.response);
    }));
  }
  /**
   * Gets the raw `Response` instance instead of parsing the response
   * data.
   *
   * If you want to parse the response body but still get the `Response`
   * instance, you can use {@link withResponse()}.
   *
   * 👋 Getting the wrong TypeScript type for `Response`?
   * Try setting `"moduleResolution": "NodeNext"` if you can,
   * or add one of these imports before your first `import … from 'openai'`:
   * - `import 'openai/shims/node'` (if you're running on Node)
   * - `import 'openai/shims/web'` (otherwise)
   */
  asResponse() {
    return this.responsePromise.then((p) => p.response);
  }
  /**
   * Gets the parsed response data, the raw `Response` instance and the ID of the request,
   * returned via the X-Request-ID header which is useful for debugging requests and reporting
   * issues to OpenAI.
   *
   * If you just want to get the raw `Response` instance without parsing it,
   * you can use {@link asResponse()}.
   *
   *
   * 👋 Getting the wrong TypeScript type for `Response`?
   * Try setting `"moduleResolution": "NodeNext"` if you can,
   * or add one of these imports before your first `import … from 'openai'`:
   * - `import 'openai/shims/node'` (if you're running on Node)
   * - `import 'openai/shims/web'` (otherwise)
   */
  withResponse() {
    return __async(this, null, function* () {
      const [data, response] = yield Promise.all([this.parse(), this.asResponse()]);
      return {
        data,
        response,
        request_id: response.headers.get("x-request-id")
      };
    });
  }
  parse() {
    if (!this.parsedPromise) {
      this.parsedPromise = this.responsePromise.then(this.parseResponse);
    }
    return this.parsedPromise;
  }
  then(onfulfilled, onrejected) {
    return this.parse().then(onfulfilled, onrejected);
  }
  catch(onrejected) {
    return this.parse().catch(onrejected);
  }
  finally(onfinally) {
    return this.parse().finally(onfinally);
  }
};
var APIClient = class {
  constructor({
    baseURL,
    maxRetries = 2,
    timeout = 6e5,
    // 10 minutes
    httpAgent,
    fetch: overridenFetch
  }) {
    this.baseURL = baseURL;
    this.maxRetries = validatePositiveInteger("maxRetries", maxRetries);
    this.timeout = validatePositiveInteger("timeout", timeout);
    this.httpAgent = httpAgent;
    this.fetch = overridenFetch ?? fetch2;
  }
  authHeaders(opts) {
    return {};
  }
  /**
   * Override this to add your own default headers, for example:
   *
   *  {
   *    ...super.defaultHeaders(),
   *    Authorization: 'Bearer 123',
   *  }
   */
  defaultHeaders(opts) {
    return __spreadValues(__spreadValues({
      Accept: "application/json",
      "Content-Type": "application/json",
      "User-Agent": this.getUserAgent()
    }, getPlatformHeaders()), this.authHeaders(opts));
  }
  /**
   * Override this to add your own headers validation:
   */
  validateHeaders(headers, customHeaders) {
  }
  defaultIdempotencyKey() {
    return `stainless-node-retry-${uuid4()}`;
  }
  get(path, opts) {
    return this.methodRequest("get", path, opts);
  }
  post(path, opts) {
    return this.methodRequest("post", path, opts);
  }
  patch(path, opts) {
    return this.methodRequest("patch", path, opts);
  }
  put(path, opts) {
    return this.methodRequest("put", path, opts);
  }
  delete(path, opts) {
    return this.methodRequest("delete", path, opts);
  }
  methodRequest(method, path, opts) {
    return this.request(Promise.resolve(opts).then((opts2) => __async(this, null, function* () {
      const body = opts2 && isBlobLike(opts2?.body) ? new DataView(yield opts2.body.arrayBuffer()) : opts2?.body instanceof DataView ? opts2.body : opts2?.body instanceof ArrayBuffer ? new DataView(opts2.body) : opts2 && ArrayBuffer.isView(opts2?.body) ? new DataView(opts2.body.buffer) : opts2?.body;
      return __spreadProps(__spreadValues({
        method,
        path
      }, opts2), {
        body
      });
    })));
  }
  getAPIList(path, Page2, opts) {
    return this.requestAPIList(Page2, __spreadValues({
      method: "get",
      path
    }, opts));
  }
  calculateContentLength(body) {
    if (typeof body === "string") {
      if (typeof Buffer !== "undefined") {
        return Buffer.byteLength(body, "utf8").toString();
      }
      if (typeof TextEncoder !== "undefined") {
        const encoder = new TextEncoder();
        const encoded = encoder.encode(body);
        return encoded.length.toString();
      }
    } else if (ArrayBuffer.isView(body)) {
      return body.byteLength.toString();
    }
    return null;
  }
  buildRequest(options, {
    retryCount = 0
  } = {}) {
    const {
      method,
      path,
      query,
      headers = {}
    } = options;
    const body = ArrayBuffer.isView(options.body) || options.__binaryRequest && typeof options.body === "string" ? options.body : isMultipartBody(options.body) ? options.body.body : options.body ? JSON.stringify(options.body, null, 2) : null;
    const contentLength = this.calculateContentLength(body);
    const url = this.buildURL(path, query);
    if ("timeout" in options) validatePositiveInteger("timeout", options.timeout);
    const timeout = options.timeout ?? this.timeout;
    const httpAgent = options.httpAgent ?? this.httpAgent ?? getDefaultAgent(url);
    const minAgentTimeout = timeout + 1e3;
    if (typeof httpAgent?.options?.timeout === "number" && minAgentTimeout > (httpAgent.options.timeout ?? 0)) {
      httpAgent.options.timeout = minAgentTimeout;
    }
    if (this.idempotencyHeader && method !== "get") {
      if (!options.idempotencyKey) options.idempotencyKey = this.defaultIdempotencyKey();
      headers[this.idempotencyHeader] = options.idempotencyKey;
    }
    const reqHeaders = this.buildHeaders({
      options,
      headers,
      contentLength,
      retryCount
    });
    const req = __spreadProps(__spreadValues(__spreadProps(__spreadValues({
      method
    }, body && {
      body
    }), {
      headers: reqHeaders
    }), httpAgent && {
      agent: httpAgent
    }), {
      // @ts-ignore node-fetch uses a custom AbortSignal type that is
      // not compatible with standard web types
      signal: options.signal ?? null
    });
    return {
      req,
      url,
      timeout
    };
  }
  buildHeaders({
    options,
    headers,
    contentLength,
    retryCount
  }) {
    const reqHeaders = {};
    if (contentLength) {
      reqHeaders["content-length"] = contentLength;
    }
    const defaultHeaders = this.defaultHeaders(options);
    applyHeadersMut(reqHeaders, defaultHeaders);
    applyHeadersMut(reqHeaders, headers);
    if (isMultipartBody(options.body) && kind !== "node") {
      delete reqHeaders["content-type"];
    }
    if (getHeader(defaultHeaders, "x-stainless-retry-count") === void 0 && getHeader(headers, "x-stainless-retry-count") === void 0) {
      reqHeaders["x-stainless-retry-count"] = String(retryCount);
    }
    this.validateHeaders(reqHeaders, headers);
    return reqHeaders;
  }
  /**
   * Used as a callback for mutating the given `FinalRequestOptions` object.
   */
  prepareOptions(options) {
    return __async(this, null, function* () {
    });
  }
  /**
   * Used as a callback for mutating the given `RequestInit` object.
   *
   * This is useful for cases where you want to add certain headers based off of
   * the request properties, e.g. `method` or `url`.
   */
  prepareRequest(_0, _1) {
    return __async(this, arguments, function* (request, {
      url,
      options
    }) {
    });
  }
  parseHeaders(headers) {
    return !headers ? {} : Symbol.iterator in headers ? Object.fromEntries(Array.from(headers).map((header) => [...header])) : __spreadValues({}, headers);
  }
  makeStatusError(status, error, message, headers) {
    return APIError.generate(status, error, message, headers);
  }
  request(options, remainingRetries = null) {
    return new APIPromise(this.makeRequest(options, remainingRetries));
  }
  makeRequest(optionsInput, retriesRemaining) {
    return __async(this, null, function* () {
      const options = yield optionsInput;
      const maxRetries = options.maxRetries ?? this.maxRetries;
      if (retriesRemaining == null) {
        retriesRemaining = maxRetries;
      }
      yield this.prepareOptions(options);
      const {
        req,
        url,
        timeout
      } = this.buildRequest(options, {
        retryCount: maxRetries - retriesRemaining
      });
      yield this.prepareRequest(req, {
        url,
        options
      });
      debug("request", url, options, req.headers);
      if (options.signal?.aborted) {
        throw new APIUserAbortError();
      }
      const controller = new AbortController();
      const response = yield this.fetchWithTimeout(url, req, timeout, controller).catch(castToError);
      if (response instanceof Error) {
        if (options.signal?.aborted) {
          throw new APIUserAbortError();
        }
        if (retriesRemaining) {
          return this.retryRequest(options, retriesRemaining);
        }
        if (response.name === "AbortError") {
          throw new APIConnectionTimeoutError();
        }
        throw new APIConnectionError({
          cause: response
        });
      }
      const responseHeaders = createResponseHeaders(response.headers);
      if (!response.ok) {
        if (retriesRemaining && this.shouldRetry(response)) {
          const retryMessage2 = `retrying, ${retriesRemaining} attempts remaining`;
          debug(`response (error; ${retryMessage2})`, response.status, url, responseHeaders);
          return this.retryRequest(options, retriesRemaining, responseHeaders);
        }
        const errText = yield response.text().catch((e) => castToError(e).message);
        const errJSON = safeJSON(errText);
        const errMessage = errJSON ? void 0 : errText;
        const retryMessage = retriesRemaining ? `(error; no more retries left)` : `(error; not retryable)`;
        debug(`response (error; ${retryMessage})`, response.status, url, responseHeaders, errMessage);
        const err = this.makeStatusError(response.status, errJSON, errMessage, responseHeaders);
        throw err;
      }
      return {
        response,
        options,
        controller
      };
    });
  }
  requestAPIList(Page2, options) {
    const request = this.makeRequest(options, null);
    return new PagePromise(this, request, Page2);
  }
  buildURL(path, query) {
    const url = isAbsoluteURL(path) ? new URL(path) : new URL(this.baseURL + (this.baseURL.endsWith("/") && path.startsWith("/") ? path.slice(1) : path));
    const defaultQuery = this.defaultQuery();
    if (!isEmptyObj(defaultQuery)) {
      query = __spreadValues(__spreadValues({}, defaultQuery), query);
    }
    if (typeof query === "object" && query && !Array.isArray(query)) {
      url.search = this.stringifyQuery(query);
    }
    return url.toString();
  }
  stringifyQuery(query) {
    return Object.entries(query).filter(([_, value]) => typeof value !== "undefined").map(([key, value]) => {
      if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
        return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
      }
      if (value === null) {
        return `${encodeURIComponent(key)}=`;
      }
      throw new OpenAIError(`Cannot stringify type ${typeof value}; Expected string, number, boolean, or null. If you need to pass nested query parameters, you can manually encode them, e.g. { query: { 'foo[key1]': value1, 'foo[key2]': value2 } }, and please open a GitHub issue requesting better support for your use case.`);
    }).join("&");
  }
  fetchWithTimeout(url, init, ms, controller) {
    return __async(this, null, function* () {
      const _a2 = init || {}, {
        signal
      } = _a2, options = __objRest(_a2, [
        "signal"
      ]);
      if (signal) signal.addEventListener("abort", () => controller.abort());
      const timeout = setTimeout(() => controller.abort(), ms);
      return this.getRequestClient().fetch.call(void 0, url, __spreadValues({
        signal: controller.signal
      }, options)).finally(() => {
        clearTimeout(timeout);
      });
    });
  }
  getRequestClient() {
    return {
      fetch: this.fetch
    };
  }
  shouldRetry(response) {
    const shouldRetryHeader = response.headers.get("x-should-retry");
    if (shouldRetryHeader === "true") return true;
    if (shouldRetryHeader === "false") return false;
    if (response.status === 408) return true;
    if (response.status === 409) return true;
    if (response.status === 429) return true;
    if (response.status >= 500) return true;
    return false;
  }
  retryRequest(options, retriesRemaining, responseHeaders) {
    return __async(this, null, function* () {
      let timeoutMillis;
      const retryAfterMillisHeader = responseHeaders?.["retry-after-ms"];
      if (retryAfterMillisHeader) {
        const timeoutMs = parseFloat(retryAfterMillisHeader);
        if (!Number.isNaN(timeoutMs)) {
          timeoutMillis = timeoutMs;
        }
      }
      const retryAfterHeader = responseHeaders?.["retry-after"];
      if (retryAfterHeader && !timeoutMillis) {
        const timeoutSeconds = parseFloat(retryAfterHeader);
        if (!Number.isNaN(timeoutSeconds)) {
          timeoutMillis = timeoutSeconds * 1e3;
        } else {
          timeoutMillis = Date.parse(retryAfterHeader) - Date.now();
        }
      }
      if (!(timeoutMillis && 0 <= timeoutMillis && timeoutMillis < 60 * 1e3)) {
        const maxRetries = options.maxRetries ?? this.maxRetries;
        timeoutMillis = this.calculateDefaultRetryTimeoutMillis(retriesRemaining, maxRetries);
      }
      yield sleep(timeoutMillis);
      return this.makeRequest(options, retriesRemaining - 1);
    });
  }
  calculateDefaultRetryTimeoutMillis(retriesRemaining, maxRetries) {
    const initialRetryDelay = 0.5;
    const maxRetryDelay = 8;
    const numRetries = maxRetries - retriesRemaining;
    const sleepSeconds = Math.min(initialRetryDelay * Math.pow(2, numRetries), maxRetryDelay);
    const jitter = 1 - Math.random() * 0.25;
    return sleepSeconds * jitter * 1e3;
  }
  getUserAgent() {
    return `${this.constructor.name}/JS ${VERSION}`;
  }
};
var AbstractPage = class {
  constructor(client, response, body, options) {
    _AbstractPage_client.set(this, void 0);
    __classPrivateFieldSet(this, _AbstractPage_client, client, "f");
    this.options = options;
    this.response = response;
    this.body = body;
  }
  hasNextPage() {
    const items = this.getPaginatedItems();
    if (!items.length) return false;
    return this.nextPageInfo() != null;
  }
  getNextPage() {
    return __async(this, null, function* () {
      const nextInfo = this.nextPageInfo();
      if (!nextInfo) {
        throw new OpenAIError("No next page expected; please check `.hasNextPage()` before calling `.getNextPage()`.");
      }
      const nextOptions = __spreadValues({}, this.options);
      if ("params" in nextInfo && typeof nextOptions.query === "object") {
        nextOptions.query = __spreadValues(__spreadValues({}, nextOptions.query), nextInfo.params);
      } else if ("url" in nextInfo) {
        const params = [...Object.entries(nextOptions.query || {}), ...nextInfo.url.searchParams.entries()];
        for (const [key, value] of params) {
          nextInfo.url.searchParams.set(key, value);
        }
        nextOptions.query = void 0;
        nextOptions.path = nextInfo.url.toString();
      }
      return yield __classPrivateFieldGet(this, _AbstractPage_client, "f").requestAPIList(this.constructor, nextOptions);
    });
  }
  iterPages() {
    return __asyncGenerator(this, null, function* () {
      let page = this;
      yield page;
      while (page.hasNextPage()) {
        page = yield new __await(page.getNextPage());
        yield page;
      }
    });
  }
  [(_AbstractPage_client = /* @__PURE__ */ new WeakMap(), Symbol.asyncIterator)]() {
    return __asyncGenerator(this, null, function* () {
      try {
        for (var iter = __forAwait(this.iterPages()), more, temp, error; more = !(temp = yield new __await(iter.next())).done; more = false) {
          const page = temp.value;
          for (const item of page.getPaginatedItems()) {
            yield item;
          }
        }
      } catch (temp) {
        error = [temp];
      } finally {
        try {
          more && (temp = iter.return) && (yield new __await(temp.call(iter)));
        } finally {
          if (error)
            throw error[0];
        }
      }
    });
  }
};
var PagePromise = class extends APIPromise {
  constructor(client, request, Page2) {
    super(request, (props) => __async(this, null, function* () {
      return new Page2(client, props.response, yield defaultParseResponse(props), props.options);
    }));
  }
  /**
   * Allow auto-paginating iteration on an unawaited list call, eg:
   *
   *    for await (const item of client.items.list()) {
   *      console.log(item)
   *    }
   */
  [Symbol.asyncIterator]() {
    return __asyncGenerator(this, null, function* () {
      const page = yield new __await(this);
      try {
        for (var iter = __forAwait(page), more, temp, error; more = !(temp = yield new __await(iter.next())).done; more = false) {
          const item = temp.value;
          yield item;
        }
      } catch (temp) {
        error = [temp];
      } finally {
        try {
          more && (temp = iter.return) && (yield new __await(temp.call(iter)));
        } finally {
          if (error)
            throw error[0];
        }
      }
    });
  }
};
var createResponseHeaders = (headers) => {
  return new Proxy(Object.fromEntries(
    // @ts-ignore
    headers.entries()
  ), {
    get(target, name) {
      const key = name.toString();
      return target[key.toLowerCase()] || target[key];
    }
  });
};
var requestOptionsKeys = {
  method: true,
  path: true,
  query: true,
  body: true,
  headers: true,
  maxRetries: true,
  stream: true,
  timeout: true,
  httpAgent: true,
  signal: true,
  idempotencyKey: true,
  __binaryRequest: true,
  __binaryResponse: true,
  __streamClass: true
};
var isRequestOptions = (obj) => {
  return typeof obj === "object" && obj !== null && !isEmptyObj(obj) && Object.keys(obj).every((k) => hasOwn(requestOptionsKeys, k));
};
var getPlatformProperties = () => {
  if (typeof Deno !== "undefined" && Deno.build != null) {
    return {
      "X-Stainless-Lang": "js",
      "X-Stainless-Package-Version": VERSION,
      "X-Stainless-OS": normalizePlatform(Deno.build.os),
      "X-Stainless-Arch": normalizeArch(Deno.build.arch),
      "X-Stainless-Runtime": "deno",
      "X-Stainless-Runtime-Version": typeof Deno.version === "string" ? Deno.version : Deno.version?.deno ?? "unknown"
    };
  }
  if (typeof EdgeRuntime !== "undefined") {
    return {
      "X-Stainless-Lang": "js",
      "X-Stainless-Package-Version": VERSION,
      "X-Stainless-OS": "Unknown",
      "X-Stainless-Arch": `other:${EdgeRuntime}`,
      "X-Stainless-Runtime": "edge",
      "X-Stainless-Runtime-Version": process.version
    };
  }
  if (Object.prototype.toString.call(typeof process !== "undefined" ? process : 0) === "[object process]") {
    return {
      "X-Stainless-Lang": "js",
      "X-Stainless-Package-Version": VERSION,
      "X-Stainless-OS": normalizePlatform(process.platform),
      "X-Stainless-Arch": normalizeArch(process.arch),
      "X-Stainless-Runtime": "node",
      "X-Stainless-Runtime-Version": process.version
    };
  }
  const browserInfo = getBrowserInfo();
  if (browserInfo) {
    return {
      "X-Stainless-Lang": "js",
      "X-Stainless-Package-Version": VERSION,
      "X-Stainless-OS": "Unknown",
      "X-Stainless-Arch": "unknown",
      "X-Stainless-Runtime": `browser:${browserInfo.browser}`,
      "X-Stainless-Runtime-Version": browserInfo.version
    };
  }
  return {
    "X-Stainless-Lang": "js",
    "X-Stainless-Package-Version": VERSION,
    "X-Stainless-OS": "Unknown",
    "X-Stainless-Arch": "unknown",
    "X-Stainless-Runtime": "unknown",
    "X-Stainless-Runtime-Version": "unknown"
  };
};
function getBrowserInfo() {
  if (typeof navigator === "undefined" || !navigator) {
    return null;
  }
  const browserPatterns = [{
    key: "edge",
    pattern: /Edge(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/
  }, {
    key: "ie",
    pattern: /MSIE(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/
  }, {
    key: "ie",
    pattern: /Trident(?:.*rv\:(\d+)\.(\d+)(?:\.(\d+))?)?/
  }, {
    key: "chrome",
    pattern: /Chrome(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/
  }, {
    key: "firefox",
    pattern: /Firefox(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/
  }, {
    key: "safari",
    pattern: /(?:Version\W+(\d+)\.(\d+)(?:\.(\d+))?)?(?:\W+Mobile\S*)?\W+Safari/
  }];
  for (const {
    key,
    pattern
  } of browserPatterns) {
    const match = pattern.exec(navigator.userAgent);
    if (match) {
      const major = match[1] || 0;
      const minor = match[2] || 0;
      const patch = match[3] || 0;
      return {
        browser: key,
        version: `${major}.${minor}.${patch}`
      };
    }
  }
  return null;
}
var normalizeArch = (arch) => {
  if (arch === "x32") return "x32";
  if (arch === "x86_64" || arch === "x64") return "x64";
  if (arch === "arm") return "arm";
  if (arch === "aarch64" || arch === "arm64") return "arm64";
  if (arch) return `other:${arch}`;
  return "unknown";
};
var normalizePlatform = (platform) => {
  platform = platform.toLowerCase();
  if (platform.includes("ios")) return "iOS";
  if (platform === "android") return "Android";
  if (platform === "darwin") return "MacOS";
  if (platform === "win32") return "Windows";
  if (platform === "freebsd") return "FreeBSD";
  if (platform === "openbsd") return "OpenBSD";
  if (platform === "linux") return "Linux";
  if (platform) return `Other:${platform}`;
  return "Unknown";
};
var _platformHeaders;
var getPlatformHeaders = () => {
  return _platformHeaders ?? (_platformHeaders = getPlatformProperties());
};
var safeJSON = (text) => {
  try {
    return JSON.parse(text);
  } catch (err) {
    return void 0;
  }
};
var startsWithSchemeRegexp = new RegExp("^(?:[a-z]+:)?//", "i");
var isAbsoluteURL = (url) => {
  return startsWithSchemeRegexp.test(url);
};
var sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
var validatePositiveInteger = (name, n) => {
  if (typeof n !== "number" || !Number.isInteger(n)) {
    throw new OpenAIError(`${name} must be an integer`);
  }
  if (n < 0) {
    throw new OpenAIError(`${name} must be a positive integer`);
  }
  return n;
};
var castToError = (err) => {
  if (err instanceof Error) return err;
  if (typeof err === "object" && err !== null) {
    try {
      return new Error(JSON.stringify(err));
    } catch {
    }
  }
  return new Error(err);
};
var readEnv = (env) => {
  if (typeof process !== "undefined") {
    return process.env?.[env]?.trim() ?? void 0;
  }
  if (typeof Deno !== "undefined") {
    return Deno.env?.get?.(env)?.trim();
  }
  return void 0;
};
function isEmptyObj(obj) {
  if (!obj) return true;
  for (const _k in obj) return false;
  return true;
}
function hasOwn(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}
function applyHeadersMut(targetHeaders, newHeaders) {
  for (const k in newHeaders) {
    if (!hasOwn(newHeaders, k)) continue;
    const lowerKey = k.toLowerCase();
    if (!lowerKey) continue;
    const val = newHeaders[k];
    if (val === null) {
      delete targetHeaders[lowerKey];
    } else if (val !== void 0) {
      targetHeaders[lowerKey] = val;
    }
  }
}
function debug(action, ...args) {
  if (typeof process !== "undefined" && process?.env?.["DEBUG"] === "true") {
    console.log(`OpenAI:DEBUG:${action}`, ...args);
  }
}
var uuid4 = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === "x" ? r : r & 3 | 8;
    return v.toString(16);
  });
};
var isRunningInBrowser = () => {
  return (
    // @ts-ignore
    typeof window !== "undefined" && // @ts-ignore
    typeof window.document !== "undefined" && // @ts-ignore
    typeof navigator !== "undefined"
  );
};
var isHeadersProtocol = (headers) => {
  return typeof headers?.get === "function";
};
var getHeader = (headers, header) => {
  const lowerCasedHeader = header.toLowerCase();
  if (isHeadersProtocol(headers)) {
    const intercapsHeader = header[0]?.toUpperCase() + header.substring(1).replace(/([^\w])(\w)/g, (_m, g1, g2) => g1 + g2.toUpperCase());
    for (const key of [header, lowerCasedHeader, header.toUpperCase(), intercapsHeader]) {
      const value = headers.get(key);
      if (value) {
        return value;
      }
    }
  }
  for (const [key, value] of Object.entries(headers)) {
    if (key.toLowerCase() === lowerCasedHeader) {
      if (Array.isArray(value)) {
        if (value.length <= 1) return value[0];
        console.warn(`Received ${value.length} entries for the ${header} header, using the first entry.`);
        return value[0];
      }
      return value;
    }
  }
  return void 0;
};
function isObj(obj) {
  return obj != null && typeof obj === "object" && !Array.isArray(obj);
}

// node_modules/openai/pagination.mjs
var Page = class extends AbstractPage {
  constructor(client, response, body, options) {
    super(client, response, body, options);
    this.data = body.data || [];
    this.object = body.object;
  }
  getPaginatedItems() {
    return this.data ?? [];
  }
  // @deprecated Please use `nextPageInfo()` instead
  /**
   * This page represents a response that isn't actually paginated at the API level
   * so there will never be any next page params.
   */
  nextPageParams() {
    return null;
  }
  nextPageInfo() {
    return null;
  }
};
var CursorPage = class extends AbstractPage {
  constructor(client, response, body, options) {
    super(client, response, body, options);
    this.data = body.data || [];
  }
  getPaginatedItems() {
    return this.data ?? [];
  }
  // @deprecated Please use `nextPageInfo()` instead
  nextPageParams() {
    const info = this.nextPageInfo();
    if (!info) return null;
    if ("params" in info) return info.params;
    const params = Object.fromEntries(info.url.searchParams);
    if (!Object.keys(params).length) return null;
    return params;
  }
  nextPageInfo() {
    const data = this.getPaginatedItems();
    if (!data.length) {
      return null;
    }
    const id = data[data.length - 1]?.id;
    if (!id) {
      return null;
    }
    return {
      params: {
        after: id
      }
    };
  }
};

// node_modules/openai/resource.mjs
var APIResource = class {
  constructor(client) {
    this._client = client;
  }
};

// node_modules/openai/resources/chat/completions.mjs
var Completions = class extends APIResource {
  create(body, options) {
    return this._client.post("/chat/completions", __spreadProps(__spreadValues({
      body
    }, options), {
      stream: body.stream ?? false
    }));
  }
};

// node_modules/openai/resources/chat/chat.mjs
var Chat = class extends APIResource {
  constructor() {
    super(...arguments);
    this.completions = new Completions(this._client);
  }
};
Chat.Completions = Completions;

// node_modules/openai/resources/audio/speech.mjs
var Speech = class extends APIResource {
  /**
   * Generates audio from the input text.
   */
  create(body, options) {
    return this._client.post("/audio/speech", __spreadProps(__spreadValues({
      body
    }, options), {
      __binaryResponse: true
    }));
  }
};

// node_modules/openai/resources/audio/transcriptions.mjs
var Transcriptions = class extends APIResource {
  create(body, options) {
    return this._client.post("/audio/transcriptions", multipartFormRequestOptions(__spreadValues({
      body
    }, options)));
  }
};

// node_modules/openai/resources/audio/translations.mjs
var Translations = class extends APIResource {
  create(body, options) {
    return this._client.post("/audio/translations", multipartFormRequestOptions(__spreadValues({
      body
    }, options)));
  }
};

// node_modules/openai/resources/audio/audio.mjs
var Audio = class extends APIResource {
  constructor() {
    super(...arguments);
    this.transcriptions = new Transcriptions(this._client);
    this.translations = new Translations(this._client);
    this.speech = new Speech(this._client);
  }
};
Audio.Transcriptions = Transcriptions;
Audio.Translations = Translations;
Audio.Speech = Speech;

// node_modules/openai/resources/batches.mjs
var Batches = class extends APIResource {
  /**
   * Creates and executes a batch from an uploaded file of requests
   */
  create(body, options) {
    return this._client.post("/batches", __spreadValues({
      body
    }, options));
  }
  /**
   * Retrieves a batch.
   */
  retrieve(batchId, options) {
    return this._client.get(`/batches/${batchId}`, options);
  }
  list(query = {}, options) {
    if (isRequestOptions(query)) {
      return this.list({}, query);
    }
    return this._client.getAPIList("/batches", BatchesPage, __spreadValues({
      query
    }, options));
  }
  /**
   * Cancels an in-progress batch. The batch will be in status `cancelling` for up to
   * 10 minutes, before changing to `cancelled`, where it will have partial results
   * (if any) available in the output file.
   */
  cancel(batchId, options) {
    return this._client.post(`/batches/${batchId}/cancel`, options);
  }
};
var BatchesPage = class extends CursorPage {
};
Batches.BatchesPage = BatchesPage;

// node_modules/openai/resources/beta/assistants.mjs
var Assistants = class extends APIResource {
  /**
   * Create an assistant with a model and instructions.
   */
  create(body, options) {
    return this._client.post("/assistants", __spreadProps(__spreadValues({
      body
    }, options), {
      headers: __spreadValues({
        "OpenAI-Beta": "assistants=v2"
      }, options?.headers)
    }));
  }
  /**
   * Retrieves an assistant.
   */
  retrieve(assistantId, options) {
    return this._client.get(`/assistants/${assistantId}`, __spreadProps(__spreadValues({}, options), {
      headers: __spreadValues({
        "OpenAI-Beta": "assistants=v2"
      }, options?.headers)
    }));
  }
  /**
   * Modifies an assistant.
   */
  update(assistantId, body, options) {
    return this._client.post(`/assistants/${assistantId}`, __spreadProps(__spreadValues({
      body
    }, options), {
      headers: __spreadValues({
        "OpenAI-Beta": "assistants=v2"
      }, options?.headers)
    }));
  }
  list(query = {}, options) {
    if (isRequestOptions(query)) {
      return this.list({}, query);
    }
    return this._client.getAPIList("/assistants", AssistantsPage, __spreadProps(__spreadValues({
      query
    }, options), {
      headers: __spreadValues({
        "OpenAI-Beta": "assistants=v2"
      }, options?.headers)
    }));
  }
  /**
   * Delete an assistant.
   */
  del(assistantId, options) {
    return this._client.delete(`/assistants/${assistantId}`, __spreadProps(__spreadValues({}, options), {
      headers: __spreadValues({
        "OpenAI-Beta": "assistants=v2"
      }, options?.headers)
    }));
  }
};
var AssistantsPage = class extends CursorPage {
};
Assistants.AssistantsPage = AssistantsPage;

// node_modules/openai/lib/RunnableFunction.mjs
function isRunnableFunctionWithParse(fn) {
  return typeof fn.parse === "function";
}

// node_modules/openai/lib/chatCompletionUtils.mjs
var isAssistantMessage = (message) => {
  return message?.role === "assistant";
};
var isFunctionMessage = (message) => {
  return message?.role === "function";
};
var isToolMessage = (message) => {
  return message?.role === "tool";
};

// node_modules/openai/lib/EventStream.mjs
var __classPrivateFieldSet2 = function(receiver, state, value, kind2, f) {
  if (kind2 === "m") throw new TypeError("Private method is not writable");
  if (kind2 === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind2 === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
};
var __classPrivateFieldGet2 = function(receiver, state, kind2, f) {
  if (kind2 === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind2 === "m" ? f : kind2 === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _EventStream_instances;
var _EventStream_connectedPromise;
var _EventStream_resolveConnectedPromise;
var _EventStream_rejectConnectedPromise;
var _EventStream_endPromise;
var _EventStream_resolveEndPromise;
var _EventStream_rejectEndPromise;
var _EventStream_listeners;
var _EventStream_ended;
var _EventStream_errored;
var _EventStream_aborted;
var _EventStream_catchingPromiseCreated;
var _EventStream_handleError;
var EventStream = class {
  constructor() {
    _EventStream_instances.add(this);
    this.controller = new AbortController();
    _EventStream_connectedPromise.set(this, void 0);
    _EventStream_resolveConnectedPromise.set(this, () => {
    });
    _EventStream_rejectConnectedPromise.set(this, () => {
    });
    _EventStream_endPromise.set(this, void 0);
    _EventStream_resolveEndPromise.set(this, () => {
    });
    _EventStream_rejectEndPromise.set(this, () => {
    });
    _EventStream_listeners.set(this, {});
    _EventStream_ended.set(this, false);
    _EventStream_errored.set(this, false);
    _EventStream_aborted.set(this, false);
    _EventStream_catchingPromiseCreated.set(this, false);
    __classPrivateFieldSet2(this, _EventStream_connectedPromise, new Promise((resolve, reject) => {
      __classPrivateFieldSet2(this, _EventStream_resolveConnectedPromise, resolve, "f");
      __classPrivateFieldSet2(this, _EventStream_rejectConnectedPromise, reject, "f");
    }), "f");
    __classPrivateFieldSet2(this, _EventStream_endPromise, new Promise((resolve, reject) => {
      __classPrivateFieldSet2(this, _EventStream_resolveEndPromise, resolve, "f");
      __classPrivateFieldSet2(this, _EventStream_rejectEndPromise, reject, "f");
    }), "f");
    __classPrivateFieldGet2(this, _EventStream_connectedPromise, "f").catch(() => {
    });
    __classPrivateFieldGet2(this, _EventStream_endPromise, "f").catch(() => {
    });
  }
  _run(executor) {
    setTimeout(() => {
      executor().then(() => {
        this._emitFinal();
        this._emit("end");
      }, __classPrivateFieldGet2(this, _EventStream_instances, "m", _EventStream_handleError).bind(this));
    }, 0);
  }
  _connected() {
    if (this.ended) return;
    __classPrivateFieldGet2(this, _EventStream_resolveConnectedPromise, "f").call(this);
    this._emit("connect");
  }
  get ended() {
    return __classPrivateFieldGet2(this, _EventStream_ended, "f");
  }
  get errored() {
    return __classPrivateFieldGet2(this, _EventStream_errored, "f");
  }
  get aborted() {
    return __classPrivateFieldGet2(this, _EventStream_aborted, "f");
  }
  abort() {
    this.controller.abort();
  }
  /**
   * Adds the listener function to the end of the listeners array for the event.
   * No checks are made to see if the listener has already been added. Multiple calls passing
   * the same combination of event and listener will result in the listener being added, and
   * called, multiple times.
   * @returns this ChatCompletionStream, so that calls can be chained
   */
  on(event, listener) {
    const listeners = __classPrivateFieldGet2(this, _EventStream_listeners, "f")[event] || (__classPrivateFieldGet2(this, _EventStream_listeners, "f")[event] = []);
    listeners.push({
      listener
    });
    return this;
  }
  /**
   * Removes the specified listener from the listener array for the event.
   * off() will remove, at most, one instance of a listener from the listener array. If any single
   * listener has been added multiple times to the listener array for the specified event, then
   * off() must be called multiple times to remove each instance.
   * @returns this ChatCompletionStream, so that calls can be chained
   */
  off(event, listener) {
    const listeners = __classPrivateFieldGet2(this, _EventStream_listeners, "f")[event];
    if (!listeners) return this;
    const index = listeners.findIndex((l) => l.listener === listener);
    if (index >= 0) listeners.splice(index, 1);
    return this;
  }
  /**
   * Adds a one-time listener function for the event. The next time the event is triggered,
   * this listener is removed and then invoked.
   * @returns this ChatCompletionStream, so that calls can be chained
   */
  once(event, listener) {
    const listeners = __classPrivateFieldGet2(this, _EventStream_listeners, "f")[event] || (__classPrivateFieldGet2(this, _EventStream_listeners, "f")[event] = []);
    listeners.push({
      listener,
      once: true
    });
    return this;
  }
  /**
   * This is similar to `.once()`, but returns a Promise that resolves the next time
   * the event is triggered, instead of calling a listener callback.
   * @returns a Promise that resolves the next time given event is triggered,
   * or rejects if an error is emitted.  (If you request the 'error' event,
   * returns a promise that resolves with the error).
   *
   * Example:
   *
   *   const message = await stream.emitted('message') // rejects if the stream errors
   */
  emitted(event) {
    return new Promise((resolve, reject) => {
      __classPrivateFieldSet2(this, _EventStream_catchingPromiseCreated, true, "f");
      if (event !== "error") this.once("error", reject);
      this.once(event, resolve);
    });
  }
  done() {
    return __async(this, null, function* () {
      __classPrivateFieldSet2(this, _EventStream_catchingPromiseCreated, true, "f");
      yield __classPrivateFieldGet2(this, _EventStream_endPromise, "f");
    });
  }
  _emit(event, ...args) {
    if (__classPrivateFieldGet2(this, _EventStream_ended, "f")) {
      return;
    }
    if (event === "end") {
      __classPrivateFieldSet2(this, _EventStream_ended, true, "f");
      __classPrivateFieldGet2(this, _EventStream_resolveEndPromise, "f").call(this);
    }
    const listeners = __classPrivateFieldGet2(this, _EventStream_listeners, "f")[event];
    if (listeners) {
      __classPrivateFieldGet2(this, _EventStream_listeners, "f")[event] = listeners.filter((l) => !l.once);
      listeners.forEach(({
        listener
      }) => listener(...args));
    }
    if (event === "abort") {
      const error = args[0];
      if (!__classPrivateFieldGet2(this, _EventStream_catchingPromiseCreated, "f") && !listeners?.length) {
        Promise.reject(error);
      }
      __classPrivateFieldGet2(this, _EventStream_rejectConnectedPromise, "f").call(this, error);
      __classPrivateFieldGet2(this, _EventStream_rejectEndPromise, "f").call(this, error);
      this._emit("end");
      return;
    }
    if (event === "error") {
      const error = args[0];
      if (!__classPrivateFieldGet2(this, _EventStream_catchingPromiseCreated, "f") && !listeners?.length) {
        Promise.reject(error);
      }
      __classPrivateFieldGet2(this, _EventStream_rejectConnectedPromise, "f").call(this, error);
      __classPrivateFieldGet2(this, _EventStream_rejectEndPromise, "f").call(this, error);
      this._emit("end");
    }
  }
  _emitFinal() {
  }
};
_EventStream_connectedPromise = /* @__PURE__ */ new WeakMap(), _EventStream_resolveConnectedPromise = /* @__PURE__ */ new WeakMap(), _EventStream_rejectConnectedPromise = /* @__PURE__ */ new WeakMap(), _EventStream_endPromise = /* @__PURE__ */ new WeakMap(), _EventStream_resolveEndPromise = /* @__PURE__ */ new WeakMap(), _EventStream_rejectEndPromise = /* @__PURE__ */ new WeakMap(), _EventStream_listeners = /* @__PURE__ */ new WeakMap(), _EventStream_ended = /* @__PURE__ */ new WeakMap(), _EventStream_errored = /* @__PURE__ */ new WeakMap(), _EventStream_aborted = /* @__PURE__ */ new WeakMap(), _EventStream_catchingPromiseCreated = /* @__PURE__ */ new WeakMap(), _EventStream_instances = /* @__PURE__ */ new WeakSet(), _EventStream_handleError = function _EventStream_handleError2(error) {
  __classPrivateFieldSet2(this, _EventStream_errored, true, "f");
  if (error instanceof Error && error.name === "AbortError") {
    error = new APIUserAbortError();
  }
  if (error instanceof APIUserAbortError) {
    __classPrivateFieldSet2(this, _EventStream_aborted, true, "f");
    return this._emit("abort", error);
  }
  if (error instanceof OpenAIError) {
    return this._emit("error", error);
  }
  if (error instanceof Error) {
    const openAIError = new OpenAIError(error.message);
    openAIError.cause = error;
    return this._emit("error", openAIError);
  }
  return this._emit("error", new OpenAIError(String(error)));
};

// node_modules/openai/lib/parser.mjs
function makeParseableResponseFormat(response_format, parser) {
  const obj = __spreadValues({}, response_format);
  Object.defineProperties(obj, {
    $brand: {
      value: "auto-parseable-response-format",
      enumerable: false
    },
    $parseRaw: {
      value: parser,
      enumerable: false
    }
  });
  return obj;
}
function isAutoParsableResponseFormat(response_format) {
  return response_format?.["$brand"] === "auto-parseable-response-format";
}
function makeParseableTool(tool, {
  parser,
  callback
}) {
  const obj = __spreadValues({}, tool);
  Object.defineProperties(obj, {
    $brand: {
      value: "auto-parseable-tool",
      enumerable: false
    },
    $parseRaw: {
      value: parser,
      enumerable: false
    },
    $callback: {
      value: callback,
      enumerable: false
    }
  });
  return obj;
}
function isAutoParsableTool(tool) {
  return tool?.["$brand"] === "auto-parseable-tool";
}
function maybeParseChatCompletion(completion, params) {
  if (!params || !hasAutoParseableInput(params)) {
    return __spreadProps(__spreadValues({}, completion), {
      choices: completion.choices.map((choice) => __spreadProps(__spreadValues({}, choice), {
        message: __spreadProps(__spreadValues({}, choice.message), {
          parsed: null,
          tool_calls: choice.message.tool_calls ?? []
        })
      }))
    });
  }
  return parseChatCompletion(completion, params);
}
function parseChatCompletion(completion, params) {
  const choices = completion.choices.map((choice) => {
    if (choice.finish_reason === "length") {
      throw new LengthFinishReasonError();
    }
    if (choice.finish_reason === "content_filter") {
      throw new ContentFilterFinishReasonError();
    }
    return __spreadProps(__spreadValues({}, choice), {
      message: __spreadProps(__spreadValues({}, choice.message), {
        tool_calls: choice.message.tool_calls?.map((toolCall) => parseToolCall(params, toolCall)) ?? [],
        parsed: choice.message.content && !choice.message.refusal ? parseResponseFormat(params, choice.message.content) : null
      })
    });
  });
  return __spreadProps(__spreadValues({}, completion), {
    choices
  });
}
function parseResponseFormat(params, content) {
  if (params.response_format?.type !== "json_schema") {
    return null;
  }
  if (params.response_format?.type === "json_schema") {
    if ("$parseRaw" in params.response_format) {
      const response_format = params.response_format;
      return response_format.$parseRaw(content);
    }
    return JSON.parse(content);
  }
  return null;
}
function parseToolCall(params, toolCall) {
  const inputTool = params.tools?.find((inputTool2) => inputTool2.function?.name === toolCall.function.name);
  return __spreadProps(__spreadValues({}, toolCall), {
    function: __spreadProps(__spreadValues({}, toolCall.function), {
      parsed_arguments: isAutoParsableTool(inputTool) ? inputTool.$parseRaw(toolCall.function.arguments) : inputTool?.function.strict ? JSON.parse(toolCall.function.arguments) : null
    })
  });
}
function shouldParseToolCall(params, toolCall) {
  if (!params) {
    return false;
  }
  const inputTool = params.tools?.find((inputTool2) => inputTool2.function?.name === toolCall.function.name);
  return isAutoParsableTool(inputTool) || inputTool?.function.strict || false;
}
function hasAutoParseableInput(params) {
  if (isAutoParsableResponseFormat(params.response_format)) {
    return true;
  }
  return params.tools?.some((t) => isAutoParsableTool(t) || t.type === "function" && t.function.strict === true) ?? false;
}
function validateInputTools(tools) {
  for (const tool of tools ?? []) {
    if (tool.type !== "function") {
      throw new OpenAIError(`Currently only \`function\` tool types support auto-parsing; Received \`${tool.type}\``);
    }
    if (tool.function.strict !== true) {
      throw new OpenAIError(`The \`${tool.function.name}\` tool is not marked with \`strict: true\`. Only strict function tools can be auto-parsed`);
    }
  }
}

// node_modules/openai/lib/AbstractChatCompletionRunner.mjs
var __classPrivateFieldGet3 = function(receiver, state, kind2, f) {
  if (kind2 === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind2 === "m" ? f : kind2 === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _AbstractChatCompletionRunner_instances;
var _AbstractChatCompletionRunner_getFinalContent;
var _AbstractChatCompletionRunner_getFinalMessage;
var _AbstractChatCompletionRunner_getFinalFunctionCall;
var _AbstractChatCompletionRunner_getFinalFunctionCallResult;
var _AbstractChatCompletionRunner_calculateTotalUsage;
var _AbstractChatCompletionRunner_validateParams;
var _AbstractChatCompletionRunner_stringifyFunctionCallResult;
var DEFAULT_MAX_CHAT_COMPLETIONS = 10;
var AbstractChatCompletionRunner = class extends EventStream {
  constructor() {
    super(...arguments);
    _AbstractChatCompletionRunner_instances.add(this);
    this._chatCompletions = [];
    this.messages = [];
  }
  _addChatCompletion(chatCompletion) {
    this._chatCompletions.push(chatCompletion);
    this._emit("chatCompletion", chatCompletion);
    const message = chatCompletion.choices[0]?.message;
    if (message) this._addMessage(message);
    return chatCompletion;
  }
  _addMessage(message, emit = true) {
    if (!("content" in message)) message.content = null;
    this.messages.push(message);
    if (emit) {
      this._emit("message", message);
      if ((isFunctionMessage(message) || isToolMessage(message)) && message.content) {
        this._emit("functionCallResult", message.content);
      } else if (isAssistantMessage(message) && message.function_call) {
        this._emit("functionCall", message.function_call);
      } else if (isAssistantMessage(message) && message.tool_calls) {
        for (const tool_call of message.tool_calls) {
          if (tool_call.type === "function") {
            this._emit("functionCall", tool_call.function);
          }
        }
      }
    }
  }
  /**
   * @returns a promise that resolves with the final ChatCompletion, or rejects
   * if an error occurred or the stream ended prematurely without producing a ChatCompletion.
   */
  finalChatCompletion() {
    return __async(this, null, function* () {
      yield this.done();
      const completion = this._chatCompletions[this._chatCompletions.length - 1];
      if (!completion) throw new OpenAIError("stream ended without producing a ChatCompletion");
      return completion;
    });
  }
  /**
   * @returns a promise that resolves with the content of the final ChatCompletionMessage, or rejects
   * if an error occurred or the stream ended prematurely without producing a ChatCompletionMessage.
   */
  finalContent() {
    return __async(this, null, function* () {
      yield this.done();
      return __classPrivateFieldGet3(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_getFinalContent).call(this);
    });
  }
  /**
   * @returns a promise that resolves with the the final assistant ChatCompletionMessage response,
   * or rejects if an error occurred or the stream ended prematurely without producing a ChatCompletionMessage.
   */
  finalMessage() {
    return __async(this, null, function* () {
      yield this.done();
      return __classPrivateFieldGet3(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_getFinalMessage).call(this);
    });
  }
  /**
   * @returns a promise that resolves with the content of the final FunctionCall, or rejects
   * if an error occurred or the stream ended prematurely without producing a ChatCompletionMessage.
   */
  finalFunctionCall() {
    return __async(this, null, function* () {
      yield this.done();
      return __classPrivateFieldGet3(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_getFinalFunctionCall).call(this);
    });
  }
  finalFunctionCallResult() {
    return __async(this, null, function* () {
      yield this.done();
      return __classPrivateFieldGet3(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_getFinalFunctionCallResult).call(this);
    });
  }
  totalUsage() {
    return __async(this, null, function* () {
      yield this.done();
      return __classPrivateFieldGet3(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_calculateTotalUsage).call(this);
    });
  }
  allChatCompletions() {
    return [...this._chatCompletions];
  }
  _emitFinal() {
    const completion = this._chatCompletions[this._chatCompletions.length - 1];
    if (completion) this._emit("finalChatCompletion", completion);
    const finalMessage = __classPrivateFieldGet3(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_getFinalMessage).call(this);
    if (finalMessage) this._emit("finalMessage", finalMessage);
    const finalContent = __classPrivateFieldGet3(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_getFinalContent).call(this);
    if (finalContent) this._emit("finalContent", finalContent);
    const finalFunctionCall = __classPrivateFieldGet3(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_getFinalFunctionCall).call(this);
    if (finalFunctionCall) this._emit("finalFunctionCall", finalFunctionCall);
    const finalFunctionCallResult = __classPrivateFieldGet3(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_getFinalFunctionCallResult).call(this);
    if (finalFunctionCallResult != null) this._emit("finalFunctionCallResult", finalFunctionCallResult);
    if (this._chatCompletions.some((c) => c.usage)) {
      this._emit("totalUsage", __classPrivateFieldGet3(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_calculateTotalUsage).call(this));
    }
  }
  _createChatCompletion(client, params, options) {
    return __async(this, null, function* () {
      const signal = options?.signal;
      if (signal) {
        if (signal.aborted) this.controller.abort();
        signal.addEventListener("abort", () => this.controller.abort());
      }
      __classPrivateFieldGet3(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_validateParams).call(this, params);
      const chatCompletion = yield client.chat.completions.create(__spreadProps(__spreadValues({}, params), {
        stream: false
      }), __spreadProps(__spreadValues({}, options), {
        signal: this.controller.signal
      }));
      this._connected();
      return this._addChatCompletion(parseChatCompletion(chatCompletion, params));
    });
  }
  _runChatCompletion(client, params, options) {
    return __async(this, null, function* () {
      for (const message of params.messages) {
        this._addMessage(message, false);
      }
      return yield this._createChatCompletion(client, params, options);
    });
  }
  _runFunctions(client, params, options) {
    return __async(this, null, function* () {
      const role = "function";
      const _a2 = params, {
        function_call = "auto",
        stream
      } = _a2, restParams = __objRest(_a2, [
        "function_call",
        "stream"
      ]);
      const singleFunctionToCall = typeof function_call !== "string" && function_call?.name;
      const {
        maxChatCompletions = DEFAULT_MAX_CHAT_COMPLETIONS
      } = options || {};
      const functionsByName = {};
      for (const f of params.functions) {
        functionsByName[f.name || f.function.name] = f;
      }
      const functions = params.functions.map((f) => ({
        name: f.name || f.function.name,
        parameters: f.parameters,
        description: f.description
      }));
      for (const message of params.messages) {
        this._addMessage(message, false);
      }
      for (let i = 0; i < maxChatCompletions; ++i) {
        const chatCompletion = yield this._createChatCompletion(client, __spreadProps(__spreadValues({}, restParams), {
          function_call,
          functions,
          messages: [...this.messages]
        }), options);
        const message = chatCompletion.choices[0]?.message;
        if (!message) {
          throw new OpenAIError(`missing message in ChatCompletion response`);
        }
        if (!message.function_call) return;
        const {
          name,
          arguments: args
        } = message.function_call;
        const fn = functionsByName[name];
        if (!fn) {
          const content2 = `Invalid function_call: ${JSON.stringify(name)}. Available options are: ${functions.map((f) => JSON.stringify(f.name)).join(", ")}. Please try again`;
          this._addMessage({
            role,
            name,
            content: content2
          });
          continue;
        } else if (singleFunctionToCall && singleFunctionToCall !== name) {
          const content2 = `Invalid function_call: ${JSON.stringify(name)}. ${JSON.stringify(singleFunctionToCall)} requested. Please try again`;
          this._addMessage({
            role,
            name,
            content: content2
          });
          continue;
        }
        let parsed;
        try {
          parsed = isRunnableFunctionWithParse(fn) ? yield fn.parse(args) : args;
        } catch (error) {
          this._addMessage({
            role,
            name,
            content: error instanceof Error ? error.message : String(error)
          });
          continue;
        }
        const rawContent = yield fn.function(parsed, this);
        const content = __classPrivateFieldGet3(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_stringifyFunctionCallResult).call(this, rawContent);
        this._addMessage({
          role,
          name,
          content
        });
        if (singleFunctionToCall) return;
      }
    });
  }
  _runTools(client, params, options) {
    return __async(this, null, function* () {
      const role = "tool";
      const _a2 = params, {
        tool_choice = "auto",
        stream
      } = _a2, restParams = __objRest(_a2, [
        "tool_choice",
        "stream"
      ]);
      const singleFunctionToCall = typeof tool_choice !== "string" && tool_choice?.function?.name;
      const {
        maxChatCompletions = DEFAULT_MAX_CHAT_COMPLETIONS
      } = options || {};
      const inputTools = params.tools.map((tool) => {
        if (isAutoParsableTool(tool)) {
          if (!tool.$callback) {
            throw new OpenAIError("Tool given to `.runTools()` that does not have an associated function");
          }
          return {
            type: "function",
            function: {
              function: tool.$callback,
              name: tool.function.name,
              description: tool.function.description || "",
              parameters: tool.function.parameters,
              parse: tool.$parseRaw,
              strict: true
            }
          };
        }
        return tool;
      });
      const functionsByName = {};
      for (const f of inputTools) {
        if (f.type === "function") {
          functionsByName[f.function.name || f.function.function.name] = f.function;
        }
      }
      const tools = "tools" in params ? inputTools.map((t) => t.type === "function" ? {
        type: "function",
        function: {
          name: t.function.name || t.function.function.name,
          parameters: t.function.parameters,
          description: t.function.description,
          strict: t.function.strict
        }
      } : t) : void 0;
      for (const message of params.messages) {
        this._addMessage(message, false);
      }
      for (let i = 0; i < maxChatCompletions; ++i) {
        const chatCompletion = yield this._createChatCompletion(client, __spreadProps(__spreadValues({}, restParams), {
          tool_choice,
          tools,
          messages: [...this.messages]
        }), options);
        const message = chatCompletion.choices[0]?.message;
        if (!message) {
          throw new OpenAIError(`missing message in ChatCompletion response`);
        }
        if (!message.tool_calls?.length) {
          return;
        }
        for (const tool_call of message.tool_calls) {
          if (tool_call.type !== "function") continue;
          const tool_call_id = tool_call.id;
          const {
            name,
            arguments: args
          } = tool_call.function;
          const fn = functionsByName[name];
          if (!fn) {
            const content2 = `Invalid tool_call: ${JSON.stringify(name)}. Available options are: ${Object.keys(functionsByName).map((name2) => JSON.stringify(name2)).join(", ")}. Please try again`;
            this._addMessage({
              role,
              tool_call_id,
              content: content2
            });
            continue;
          } else if (singleFunctionToCall && singleFunctionToCall !== name) {
            const content2 = `Invalid tool_call: ${JSON.stringify(name)}. ${JSON.stringify(singleFunctionToCall)} requested. Please try again`;
            this._addMessage({
              role,
              tool_call_id,
              content: content2
            });
            continue;
          }
          let parsed;
          try {
            parsed = isRunnableFunctionWithParse(fn) ? yield fn.parse(args) : args;
          } catch (error) {
            const content2 = error instanceof Error ? error.message : String(error);
            this._addMessage({
              role,
              tool_call_id,
              content: content2
            });
            continue;
          }
          const rawContent = yield fn.function(parsed, this);
          const content = __classPrivateFieldGet3(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_stringifyFunctionCallResult).call(this, rawContent);
          this._addMessage({
            role,
            tool_call_id,
            content
          });
          if (singleFunctionToCall) {
            return;
          }
        }
      }
      return;
    });
  }
};
_AbstractChatCompletionRunner_instances = /* @__PURE__ */ new WeakSet(), _AbstractChatCompletionRunner_getFinalContent = function _AbstractChatCompletionRunner_getFinalContent2() {
  return __classPrivateFieldGet3(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_getFinalMessage).call(this).content ?? null;
}, _AbstractChatCompletionRunner_getFinalMessage = function _AbstractChatCompletionRunner_getFinalMessage2() {
  let i = this.messages.length;
  while (i-- > 0) {
    const message = this.messages[i];
    if (isAssistantMessage(message)) {
      const _a2 = message, {
        function_call
      } = _a2, rest = __objRest(_a2, [
        "function_call"
      ]);
      const ret = __spreadProps(__spreadValues({}, rest), {
        content: message.content ?? null,
        refusal: message.refusal ?? null
      });
      if (function_call) {
        ret.function_call = function_call;
      }
      return ret;
    }
  }
  throw new OpenAIError("stream ended without producing a ChatCompletionMessage with role=assistant");
}, _AbstractChatCompletionRunner_getFinalFunctionCall = function _AbstractChatCompletionRunner_getFinalFunctionCall2() {
  for (let i = this.messages.length - 1; i >= 0; i--) {
    const message = this.messages[i];
    if (isAssistantMessage(message) && message?.function_call) {
      return message.function_call;
    }
    if (isAssistantMessage(message) && message?.tool_calls?.length) {
      return message.tool_calls.at(-1)?.function;
    }
  }
  return;
}, _AbstractChatCompletionRunner_getFinalFunctionCallResult = function _AbstractChatCompletionRunner_getFinalFunctionCallResult2() {
  for (let i = this.messages.length - 1; i >= 0; i--) {
    const message = this.messages[i];
    if (isFunctionMessage(message) && message.content != null) {
      return message.content;
    }
    if (isToolMessage(message) && message.content != null && typeof message.content === "string" && this.messages.some((x) => x.role === "assistant" && x.tool_calls?.some((y) => y.type === "function" && y.id === message.tool_call_id))) {
      return message.content;
    }
  }
  return;
}, _AbstractChatCompletionRunner_calculateTotalUsage = function _AbstractChatCompletionRunner_calculateTotalUsage2() {
  const total = {
    completion_tokens: 0,
    prompt_tokens: 0,
    total_tokens: 0
  };
  for (const {
    usage
  } of this._chatCompletions) {
    if (usage) {
      total.completion_tokens += usage.completion_tokens;
      total.prompt_tokens += usage.prompt_tokens;
      total.total_tokens += usage.total_tokens;
    }
  }
  return total;
}, _AbstractChatCompletionRunner_validateParams = function _AbstractChatCompletionRunner_validateParams2(params) {
  if (params.n != null && params.n > 1) {
    throw new OpenAIError("ChatCompletion convenience helpers only support n=1 at this time. To use n>1, please use chat.completions.create() directly.");
  }
}, _AbstractChatCompletionRunner_stringifyFunctionCallResult = function _AbstractChatCompletionRunner_stringifyFunctionCallResult2(rawContent) {
  return typeof rawContent === "string" ? rawContent : rawContent === void 0 ? "undefined" : JSON.stringify(rawContent);
};

// node_modules/openai/lib/ChatCompletionRunner.mjs
var ChatCompletionRunner = class _ChatCompletionRunner extends AbstractChatCompletionRunner {
  /** @deprecated - please use `runTools` instead. */
  static runFunctions(client, params, options) {
    const runner = new _ChatCompletionRunner();
    const opts = __spreadProps(__spreadValues({}, options), {
      headers: __spreadProps(__spreadValues({}, options?.headers), {
        "X-Stainless-Helper-Method": "runFunctions"
      })
    });
    runner._run(() => runner._runFunctions(client, params, opts));
    return runner;
  }
  static runTools(client, params, options) {
    const runner = new _ChatCompletionRunner();
    const opts = __spreadProps(__spreadValues({}, options), {
      headers: __spreadProps(__spreadValues({}, options?.headers), {
        "X-Stainless-Helper-Method": "runTools"
      })
    });
    runner._run(() => runner._runTools(client, params, opts));
    return runner;
  }
  _addMessage(message, emit = true) {
    super._addMessage(message, emit);
    if (isAssistantMessage(message) && message.content) {
      this._emit("content", message.content);
    }
  }
};

// node_modules/openai/_vendor/partial-json-parser/parser.mjs
var STR = 1;
var NUM = 2;
var ARR = 4;
var OBJ = 8;
var NULL = 16;
var BOOL = 32;
var NAN = 64;
var INFINITY = 128;
var MINUS_INFINITY = 256;
var INF = INFINITY | MINUS_INFINITY;
var SPECIAL = NULL | BOOL | INF | NAN;
var ATOM = STR | NUM | SPECIAL;
var COLLECTION = ARR | OBJ;
var ALL = ATOM | COLLECTION;
var Allow = {
  STR,
  NUM,
  ARR,
  OBJ,
  NULL,
  BOOL,
  NAN,
  INFINITY,
  MINUS_INFINITY,
  INF,
  SPECIAL,
  ATOM,
  COLLECTION,
  ALL
};
var PartialJSON = class extends Error {
};
var MalformedJSON = class extends Error {
};
function parseJSON(jsonString, allowPartial = Allow.ALL) {
  if (typeof jsonString !== "string") {
    throw new TypeError(`expecting str, got ${typeof jsonString}`);
  }
  if (!jsonString.trim()) {
    throw new Error(`${jsonString} is empty`);
  }
  return _parseJSON(jsonString.trim(), allowPartial);
}
var _parseJSON = (jsonString, allow) => {
  const length = jsonString.length;
  let index = 0;
  const markPartialJSON = (msg) => {
    throw new PartialJSON(`${msg} at position ${index}`);
  };
  const throwMalformedError = (msg) => {
    throw new MalformedJSON(`${msg} at position ${index}`);
  };
  const parseAny = () => {
    skipBlank();
    if (index >= length) markPartialJSON("Unexpected end of input");
    if (jsonString[index] === '"') return parseStr();
    if (jsonString[index] === "{") return parseObj();
    if (jsonString[index] === "[") return parseArr();
    if (jsonString.substring(index, index + 4) === "null" || Allow.NULL & allow && length - index < 4 && "null".startsWith(jsonString.substring(index))) {
      index += 4;
      return null;
    }
    if (jsonString.substring(index, index + 4) === "true" || Allow.BOOL & allow && length - index < 4 && "true".startsWith(jsonString.substring(index))) {
      index += 4;
      return true;
    }
    if (jsonString.substring(index, index + 5) === "false" || Allow.BOOL & allow && length - index < 5 && "false".startsWith(jsonString.substring(index))) {
      index += 5;
      return false;
    }
    if (jsonString.substring(index, index + 8) === "Infinity" || Allow.INFINITY & allow && length - index < 8 && "Infinity".startsWith(jsonString.substring(index))) {
      index += 8;
      return Infinity;
    }
    if (jsonString.substring(index, index + 9) === "-Infinity" || Allow.MINUS_INFINITY & allow && 1 < length - index && length - index < 9 && "-Infinity".startsWith(jsonString.substring(index))) {
      index += 9;
      return -Infinity;
    }
    if (jsonString.substring(index, index + 3) === "NaN" || Allow.NAN & allow && length - index < 3 && "NaN".startsWith(jsonString.substring(index))) {
      index += 3;
      return NaN;
    }
    return parseNum();
  };
  const parseStr = () => {
    const start = index;
    let escape2 = false;
    index++;
    while (index < length && (jsonString[index] !== '"' || escape2 && jsonString[index - 1] === "\\")) {
      escape2 = jsonString[index] === "\\" ? !escape2 : false;
      index++;
    }
    if (jsonString.charAt(index) == '"') {
      try {
        return JSON.parse(jsonString.substring(start, ++index - Number(escape2)));
      } catch (e) {
        throwMalformedError(String(e));
      }
    } else if (Allow.STR & allow) {
      try {
        return JSON.parse(jsonString.substring(start, index - Number(escape2)) + '"');
      } catch (e) {
        return JSON.parse(jsonString.substring(start, jsonString.lastIndexOf("\\")) + '"');
      }
    }
    markPartialJSON("Unterminated string literal");
  };
  const parseObj = () => {
    index++;
    skipBlank();
    const obj = {};
    try {
      while (jsonString[index] !== "}") {
        skipBlank();
        if (index >= length && Allow.OBJ & allow) return obj;
        const key = parseStr();
        skipBlank();
        index++;
        try {
          const value = parseAny();
          Object.defineProperty(obj, key, {
            value,
            writable: true,
            enumerable: true,
            configurable: true
          });
        } catch (e) {
          if (Allow.OBJ & allow) return obj;
          else throw e;
        }
        skipBlank();
        if (jsonString[index] === ",") index++;
      }
    } catch (e) {
      if (Allow.OBJ & allow) return obj;
      else markPartialJSON("Expected '}' at end of object");
    }
    index++;
    return obj;
  };
  const parseArr = () => {
    index++;
    const arr = [];
    try {
      while (jsonString[index] !== "]") {
        arr.push(parseAny());
        skipBlank();
        if (jsonString[index] === ",") {
          index++;
        }
      }
    } catch (e) {
      if (Allow.ARR & allow) {
        return arr;
      }
      markPartialJSON("Expected ']' at end of array");
    }
    index++;
    return arr;
  };
  const parseNum = () => {
    if (index === 0) {
      if (jsonString === "-" && Allow.NUM & allow) markPartialJSON("Not sure what '-' is");
      try {
        return JSON.parse(jsonString);
      } catch (e) {
        if (Allow.NUM & allow) {
          try {
            if ("." === jsonString[jsonString.length - 1]) return JSON.parse(jsonString.substring(0, jsonString.lastIndexOf(".")));
            return JSON.parse(jsonString.substring(0, jsonString.lastIndexOf("e")));
          } catch (e2) {
          }
        }
        throwMalformedError(String(e));
      }
    }
    const start = index;
    if (jsonString[index] === "-") index++;
    while (jsonString[index] && !",]}".includes(jsonString[index])) index++;
    if (index == length && !(Allow.NUM & allow)) markPartialJSON("Unterminated number literal");
    try {
      return JSON.parse(jsonString.substring(start, index));
    } catch (e) {
      if (jsonString.substring(start, index) === "-" && Allow.NUM & allow) markPartialJSON("Not sure what '-' is");
      try {
        return JSON.parse(jsonString.substring(start, jsonString.lastIndexOf("e")));
      } catch (e2) {
        throwMalformedError(String(e2));
      }
    }
  };
  const skipBlank = () => {
    while (index < length && " \n\r	".includes(jsonString[index])) {
      index++;
    }
  };
  return parseAny();
};
var partialParse = (input) => parseJSON(input, Allow.ALL ^ Allow.NUM);

// node_modules/openai/lib/ChatCompletionStream.mjs
var __classPrivateFieldSet3 = function(receiver, state, value, kind2, f) {
  if (kind2 === "m") throw new TypeError("Private method is not writable");
  if (kind2 === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind2 === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
};
var __classPrivateFieldGet4 = function(receiver, state, kind2, f) {
  if (kind2 === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind2 === "m" ? f : kind2 === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _ChatCompletionStream_instances;
var _ChatCompletionStream_params;
var _ChatCompletionStream_choiceEventStates;
var _ChatCompletionStream_currentChatCompletionSnapshot;
var _ChatCompletionStream_beginRequest;
var _ChatCompletionStream_getChoiceEventState;
var _ChatCompletionStream_addChunk;
var _ChatCompletionStream_emitToolCallDoneEvent;
var _ChatCompletionStream_emitContentDoneEvents;
var _ChatCompletionStream_endRequest;
var _ChatCompletionStream_getAutoParseableResponseFormat;
var _ChatCompletionStream_accumulateChatCompletion;
var ChatCompletionStream = class _ChatCompletionStream extends AbstractChatCompletionRunner {
  constructor(params) {
    super();
    _ChatCompletionStream_instances.add(this);
    _ChatCompletionStream_params.set(this, void 0);
    _ChatCompletionStream_choiceEventStates.set(this, void 0);
    _ChatCompletionStream_currentChatCompletionSnapshot.set(this, void 0);
    __classPrivateFieldSet3(this, _ChatCompletionStream_params, params, "f");
    __classPrivateFieldSet3(this, _ChatCompletionStream_choiceEventStates, [], "f");
  }
  get currentChatCompletionSnapshot() {
    return __classPrivateFieldGet4(this, _ChatCompletionStream_currentChatCompletionSnapshot, "f");
  }
  /**
   * Intended for use on the frontend, consuming a stream produced with
   * `.toReadableStream()` on the backend.
   *
   * Note that messages sent to the model do not appear in `.on('message')`
   * in this context.
   */
  static fromReadableStream(stream) {
    const runner = new _ChatCompletionStream(null);
    runner._run(() => runner._fromReadableStream(stream));
    return runner;
  }
  static createChatCompletion(client, params, options) {
    const runner = new _ChatCompletionStream(params);
    runner._run(() => runner._runChatCompletion(client, __spreadProps(__spreadValues({}, params), {
      stream: true
    }), __spreadProps(__spreadValues({}, options), {
      headers: __spreadProps(__spreadValues({}, options?.headers), {
        "X-Stainless-Helper-Method": "stream"
      })
    })));
    return runner;
  }
  _createChatCompletion(client, params, options) {
    return __async(this, null, function* () {
      __superGet(_ChatCompletionStream.prototype, this, "_createChatCompletion");
      const signal = options?.signal;
      if (signal) {
        if (signal.aborted) this.controller.abort();
        signal.addEventListener("abort", () => this.controller.abort());
      }
      __classPrivateFieldGet4(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_beginRequest).call(this);
      const stream = yield client.chat.completions.create(__spreadProps(__spreadValues({}, params), {
        stream: true
      }), __spreadProps(__spreadValues({}, options), {
        signal: this.controller.signal
      }));
      this._connected();
      try {
        for (var iter = __forAwait(stream), more, temp, error; more = !(temp = yield iter.next()).done; more = false) {
          const chunk = temp.value;
          __classPrivateFieldGet4(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_addChunk).call(this, chunk);
        }
      } catch (temp) {
        error = [temp];
      } finally {
        try {
          more && (temp = iter.return) && (yield temp.call(iter));
        } finally {
          if (error)
            throw error[0];
        }
      }
      if (stream.controller.signal?.aborted) {
        throw new APIUserAbortError();
      }
      return this._addChatCompletion(__classPrivateFieldGet4(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_endRequest).call(this));
    });
  }
  _fromReadableStream(readableStream, options) {
    return __async(this, null, function* () {
      const signal = options?.signal;
      if (signal) {
        if (signal.aborted) this.controller.abort();
        signal.addEventListener("abort", () => this.controller.abort());
      }
      __classPrivateFieldGet4(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_beginRequest).call(this);
      this._connected();
      const stream = Stream.fromReadableStream(readableStream, this.controller);
      let chatId;
      try {
        for (var iter = __forAwait(stream), more, temp, error; more = !(temp = yield iter.next()).done; more = false) {
          const chunk = temp.value;
          if (chatId && chatId !== chunk.id) {
            this._addChatCompletion(__classPrivateFieldGet4(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_endRequest).call(this));
          }
          __classPrivateFieldGet4(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_addChunk).call(this, chunk);
          chatId = chunk.id;
        }
      } catch (temp) {
        error = [temp];
      } finally {
        try {
          more && (temp = iter.return) && (yield temp.call(iter));
        } finally {
          if (error)
            throw error[0];
        }
      }
      if (stream.controller.signal?.aborted) {
        throw new APIUserAbortError();
      }
      return this._addChatCompletion(__classPrivateFieldGet4(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_endRequest).call(this));
    });
  }
  [(_ChatCompletionStream_params = /* @__PURE__ */ new WeakMap(), _ChatCompletionStream_choiceEventStates = /* @__PURE__ */ new WeakMap(), _ChatCompletionStream_currentChatCompletionSnapshot = /* @__PURE__ */ new WeakMap(), _ChatCompletionStream_instances = /* @__PURE__ */ new WeakSet(), _ChatCompletionStream_beginRequest = function _ChatCompletionStream_beginRequest2() {
    if (this.ended) return;
    __classPrivateFieldSet3(this, _ChatCompletionStream_currentChatCompletionSnapshot, void 0, "f");
  }, _ChatCompletionStream_getChoiceEventState = function _ChatCompletionStream_getChoiceEventState2(choice) {
    let state = __classPrivateFieldGet4(this, _ChatCompletionStream_choiceEventStates, "f")[choice.index];
    if (state) {
      return state;
    }
    state = {
      content_done: false,
      refusal_done: false,
      logprobs_content_done: false,
      logprobs_refusal_done: false,
      done_tool_calls: /* @__PURE__ */ new Set(),
      current_tool_call_index: null
    };
    __classPrivateFieldGet4(this, _ChatCompletionStream_choiceEventStates, "f")[choice.index] = state;
    return state;
  }, _ChatCompletionStream_addChunk = function _ChatCompletionStream_addChunk2(chunk) {
    if (this.ended) return;
    const completion = __classPrivateFieldGet4(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_accumulateChatCompletion).call(this, chunk);
    this._emit("chunk", chunk, completion);
    for (const choice of chunk.choices) {
      const choiceSnapshot = completion.choices[choice.index];
      if (choice.delta.content != null && choiceSnapshot.message?.role === "assistant" && choiceSnapshot.message?.content) {
        this._emit("content", choice.delta.content, choiceSnapshot.message.content);
        this._emit("content.delta", {
          delta: choice.delta.content,
          snapshot: choiceSnapshot.message.content,
          parsed: choiceSnapshot.message.parsed
        });
      }
      if (choice.delta.refusal != null && choiceSnapshot.message?.role === "assistant" && choiceSnapshot.message?.refusal) {
        this._emit("refusal.delta", {
          delta: choice.delta.refusal,
          snapshot: choiceSnapshot.message.refusal
        });
      }
      if (choice.logprobs?.content != null && choiceSnapshot.message?.role === "assistant") {
        this._emit("logprobs.content.delta", {
          content: choice.logprobs?.content,
          snapshot: choiceSnapshot.logprobs?.content ?? []
        });
      }
      if (choice.logprobs?.refusal != null && choiceSnapshot.message?.role === "assistant") {
        this._emit("logprobs.refusal.delta", {
          refusal: choice.logprobs?.refusal,
          snapshot: choiceSnapshot.logprobs?.refusal ?? []
        });
      }
      const state = __classPrivateFieldGet4(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_getChoiceEventState).call(this, choiceSnapshot);
      if (choiceSnapshot.finish_reason) {
        __classPrivateFieldGet4(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_emitContentDoneEvents).call(this, choiceSnapshot);
        if (state.current_tool_call_index != null) {
          __classPrivateFieldGet4(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_emitToolCallDoneEvent).call(this, choiceSnapshot, state.current_tool_call_index);
        }
      }
      for (const toolCall of choice.delta.tool_calls ?? []) {
        if (state.current_tool_call_index !== toolCall.index) {
          __classPrivateFieldGet4(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_emitContentDoneEvents).call(this, choiceSnapshot);
          if (state.current_tool_call_index != null) {
            __classPrivateFieldGet4(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_emitToolCallDoneEvent).call(this, choiceSnapshot, state.current_tool_call_index);
          }
        }
        state.current_tool_call_index = toolCall.index;
      }
      for (const toolCallDelta of choice.delta.tool_calls ?? []) {
        const toolCallSnapshot = choiceSnapshot.message.tool_calls?.[toolCallDelta.index];
        if (!toolCallSnapshot?.type) {
          continue;
        }
        if (toolCallSnapshot?.type === "function") {
          this._emit("tool_calls.function.arguments.delta", {
            name: toolCallSnapshot.function?.name,
            index: toolCallDelta.index,
            arguments: toolCallSnapshot.function.arguments,
            parsed_arguments: toolCallSnapshot.function.parsed_arguments,
            arguments_delta: toolCallDelta.function?.arguments ?? ""
          });
        } else {
          assertNever(toolCallSnapshot?.type);
        }
      }
    }
  }, _ChatCompletionStream_emitToolCallDoneEvent = function _ChatCompletionStream_emitToolCallDoneEvent2(choiceSnapshot, toolCallIndex) {
    const state = __classPrivateFieldGet4(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_getChoiceEventState).call(this, choiceSnapshot);
    if (state.done_tool_calls.has(toolCallIndex)) {
      return;
    }
    const toolCallSnapshot = choiceSnapshot.message.tool_calls?.[toolCallIndex];
    if (!toolCallSnapshot) {
      throw new Error("no tool call snapshot");
    }
    if (!toolCallSnapshot.type) {
      throw new Error("tool call snapshot missing `type`");
    }
    if (toolCallSnapshot.type === "function") {
      const inputTool = __classPrivateFieldGet4(this, _ChatCompletionStream_params, "f")?.tools?.find((tool) => tool.type === "function" && tool.function.name === toolCallSnapshot.function.name);
      this._emit("tool_calls.function.arguments.done", {
        name: toolCallSnapshot.function.name,
        index: toolCallIndex,
        arguments: toolCallSnapshot.function.arguments,
        parsed_arguments: isAutoParsableTool(inputTool) ? inputTool.$parseRaw(toolCallSnapshot.function.arguments) : inputTool?.function.strict ? JSON.parse(toolCallSnapshot.function.arguments) : null
      });
    } else {
      assertNever(toolCallSnapshot.type);
    }
  }, _ChatCompletionStream_emitContentDoneEvents = function _ChatCompletionStream_emitContentDoneEvents2(choiceSnapshot) {
    const state = __classPrivateFieldGet4(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_getChoiceEventState).call(this, choiceSnapshot);
    if (choiceSnapshot.message.content && !state.content_done) {
      state.content_done = true;
      const responseFormat = __classPrivateFieldGet4(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_getAutoParseableResponseFormat).call(this);
      this._emit("content.done", {
        content: choiceSnapshot.message.content,
        parsed: responseFormat ? responseFormat.$parseRaw(choiceSnapshot.message.content) : null
      });
    }
    if (choiceSnapshot.message.refusal && !state.refusal_done) {
      state.refusal_done = true;
      this._emit("refusal.done", {
        refusal: choiceSnapshot.message.refusal
      });
    }
    if (choiceSnapshot.logprobs?.content && !state.logprobs_content_done) {
      state.logprobs_content_done = true;
      this._emit("logprobs.content.done", {
        content: choiceSnapshot.logprobs.content
      });
    }
    if (choiceSnapshot.logprobs?.refusal && !state.logprobs_refusal_done) {
      state.logprobs_refusal_done = true;
      this._emit("logprobs.refusal.done", {
        refusal: choiceSnapshot.logprobs.refusal
      });
    }
  }, _ChatCompletionStream_endRequest = function _ChatCompletionStream_endRequest2() {
    if (this.ended) {
      throw new OpenAIError(`stream has ended, this shouldn't happen`);
    }
    const snapshot = __classPrivateFieldGet4(this, _ChatCompletionStream_currentChatCompletionSnapshot, "f");
    if (!snapshot) {
      throw new OpenAIError(`request ended without sending any chunks`);
    }
    __classPrivateFieldSet3(this, _ChatCompletionStream_currentChatCompletionSnapshot, void 0, "f");
    __classPrivateFieldSet3(this, _ChatCompletionStream_choiceEventStates, [], "f");
    return finalizeChatCompletion(snapshot, __classPrivateFieldGet4(this, _ChatCompletionStream_params, "f"));
  }, _ChatCompletionStream_getAutoParseableResponseFormat = function _ChatCompletionStream_getAutoParseableResponseFormat2() {
    const responseFormat = __classPrivateFieldGet4(this, _ChatCompletionStream_params, "f")?.response_format;
    if (isAutoParsableResponseFormat(responseFormat)) {
      return responseFormat;
    }
    return null;
  }, _ChatCompletionStream_accumulateChatCompletion = function _ChatCompletionStream_accumulateChatCompletion2(chunk) {
    var _a2, _b, _c, _d;
    let snapshot = __classPrivateFieldGet4(this, _ChatCompletionStream_currentChatCompletionSnapshot, "f");
    const _a3 = chunk, {
      choices
    } = _a3, rest = __objRest(_a3, [
      "choices"
    ]);
    if (!snapshot) {
      snapshot = __classPrivateFieldSet3(this, _ChatCompletionStream_currentChatCompletionSnapshot, __spreadProps(__spreadValues({}, rest), {
        choices: []
      }), "f");
    } else {
      Object.assign(snapshot, rest);
    }
    for (const _f of chunk.choices) {
      const _g = _f, {
        delta,
        finish_reason,
        index,
        logprobs = null
      } = _g, other = __objRest(_g, [
        "delta",
        "finish_reason",
        "index",
        "logprobs"
      ]);
      let choice = snapshot.choices[index];
      if (!choice) {
        choice = snapshot.choices[index] = __spreadValues({
          finish_reason,
          index,
          message: {},
          logprobs
        }, other);
      }
      if (logprobs) {
        if (!choice.logprobs) {
          choice.logprobs = Object.assign({}, logprobs);
        } else {
          const _b2 = logprobs, {
            content: content2,
            refusal: refusal2
          } = _b2, rest3 = __objRest(_b2, [
            "content",
            "refusal"
          ]);
          assertIsEmpty(rest3);
          Object.assign(choice.logprobs, rest3);
          if (content2) {
            (_a2 = choice.logprobs).content ?? (_a2.content = []);
            choice.logprobs.content.push(...content2);
          }
          if (refusal2) {
            (_b = choice.logprobs).refusal ?? (_b.refusal = []);
            choice.logprobs.refusal.push(...refusal2);
          }
        }
      }
      if (finish_reason) {
        choice.finish_reason = finish_reason;
        if (__classPrivateFieldGet4(this, _ChatCompletionStream_params, "f") && hasAutoParseableInput(__classPrivateFieldGet4(this, _ChatCompletionStream_params, "f"))) {
          if (finish_reason === "length") {
            throw new LengthFinishReasonError();
          }
          if (finish_reason === "content_filter") {
            throw new ContentFilterFinishReasonError();
          }
        }
      }
      Object.assign(choice, other);
      if (!delta) continue;
      const _c2 = delta, {
        content,
        refusal,
        function_call,
        role,
        tool_calls
      } = _c2, rest2 = __objRest(_c2, [
        "content",
        "refusal",
        "function_call",
        "role",
        "tool_calls"
      ]);
      assertIsEmpty(rest2);
      Object.assign(choice.message, rest2);
      if (refusal) {
        choice.message.refusal = (choice.message.refusal || "") + refusal;
      }
      if (role) choice.message.role = role;
      if (function_call) {
        if (!choice.message.function_call) {
          choice.message.function_call = function_call;
        } else {
          if (function_call.name) choice.message.function_call.name = function_call.name;
          if (function_call.arguments) {
            (_c = choice.message.function_call).arguments ?? (_c.arguments = "");
            choice.message.function_call.arguments += function_call.arguments;
          }
        }
      }
      if (content) {
        choice.message.content = (choice.message.content || "") + content;
        if (!choice.message.refusal && __classPrivateFieldGet4(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_getAutoParseableResponseFormat).call(this)) {
          choice.message.parsed = partialParse(choice.message.content);
        }
      }
      if (tool_calls) {
        if (!choice.message.tool_calls) choice.message.tool_calls = [];
        for (const _d2 of tool_calls) {
          const _e = _d2, {
            index: index2,
            id,
            type,
            function: fn
          } = _e, rest3 = __objRest(_e, [
            "index",
            "id",
            "type",
            "function"
          ]);
          const tool_call = (_d = choice.message.tool_calls)[index2] ?? (_d[index2] = {});
          Object.assign(tool_call, rest3);
          if (id) tool_call.id = id;
          if (type) tool_call.type = type;
          if (fn) tool_call.function ?? (tool_call.function = {
            name: fn.name ?? "",
            arguments: ""
          });
          if (fn?.name) tool_call.function.name = fn.name;
          if (fn?.arguments) {
            tool_call.function.arguments += fn.arguments;
            if (shouldParseToolCall(__classPrivateFieldGet4(this, _ChatCompletionStream_params, "f"), tool_call)) {
              tool_call.function.parsed_arguments = partialParse(tool_call.function.arguments);
            }
          }
        }
      }
    }
    return snapshot;
  }, Symbol.asyncIterator)]() {
    const pushQueue = [];
    const readQueue = [];
    let done = false;
    this.on("chunk", (chunk) => {
      const reader = readQueue.shift();
      if (reader) {
        reader.resolve(chunk);
      } else {
        pushQueue.push(chunk);
      }
    });
    this.on("end", () => {
      done = true;
      for (const reader of readQueue) {
        reader.resolve(void 0);
      }
      readQueue.length = 0;
    });
    this.on("abort", (err) => {
      done = true;
      for (const reader of readQueue) {
        reader.reject(err);
      }
      readQueue.length = 0;
    });
    this.on("error", (err) => {
      done = true;
      for (const reader of readQueue) {
        reader.reject(err);
      }
      readQueue.length = 0;
    });
    return {
      next: () => __async(this, null, function* () {
        if (!pushQueue.length) {
          if (done) {
            return {
              value: void 0,
              done: true
            };
          }
          return new Promise((resolve, reject) => readQueue.push({
            resolve,
            reject
          })).then((chunk2) => chunk2 ? {
            value: chunk2,
            done: false
          } : {
            value: void 0,
            done: true
          });
        }
        const chunk = pushQueue.shift();
        return {
          value: chunk,
          done: false
        };
      }),
      return: () => __async(this, null, function* () {
        this.abort();
        return {
          value: void 0,
          done: true
        };
      })
    };
  }
  toReadableStream() {
    const stream = new Stream(this[Symbol.asyncIterator].bind(this), this.controller);
    return stream.toReadableStream();
  }
};
function finalizeChatCompletion(snapshot, params) {
  const _a2 = snapshot, {
    id,
    choices,
    created,
    model,
    system_fingerprint
  } = _a2, rest = __objRest(_a2, [
    "id",
    "choices",
    "created",
    "model",
    "system_fingerprint"
  ]);
  const completion = __spreadValues(__spreadProps(__spreadValues({}, rest), {
    id,
    choices: choices.map((_b) => {
      var _c = _b, {
        message,
        finish_reason,
        index,
        logprobs
      } = _c, choiceRest = __objRest(_c, [
        "message",
        "finish_reason",
        "index",
        "logprobs"
      ]);
      if (!finish_reason) {
        throw new OpenAIError(`missing finish_reason for choice ${index}`);
      }
      const _a3 = message, {
        content = null,
        function_call,
        tool_calls
      } = _a3, messageRest = __objRest(_a3, [
        "content",
        "function_call",
        "tool_calls"
      ]);
      const role = message.role;
      if (!role) {
        throw new OpenAIError(`missing role for choice ${index}`);
      }
      if (function_call) {
        const {
          arguments: args,
          name
        } = function_call;
        if (args == null) {
          throw new OpenAIError(`missing function_call.arguments for choice ${index}`);
        }
        if (!name) {
          throw new OpenAIError(`missing function_call.name for choice ${index}`);
        }
        return __spreadProps(__spreadValues({}, choiceRest), {
          message: {
            content,
            function_call: {
              arguments: args,
              name
            },
            role,
            refusal: message.refusal ?? null
          },
          finish_reason,
          index,
          logprobs
        });
      }
      if (tool_calls) {
        return __spreadProps(__spreadValues({}, choiceRest), {
          index,
          finish_reason,
          logprobs,
          message: __spreadProps(__spreadValues({}, messageRest), {
            role,
            content,
            refusal: message.refusal ?? null,
            tool_calls: tool_calls.map((tool_call, i) => {
              const _a4 = tool_call, {
                function: fn,
                type,
                id: id2
              } = _a4, toolRest = __objRest(_a4, [
                "function",
                "type",
                "id"
              ]);
              const _b2 = fn || {}, {
                arguments: args,
                name
              } = _b2, fnRest = __objRest(_b2, [
                "arguments",
                "name"
              ]);
              if (id2 == null) {
                throw new OpenAIError(`missing choices[${index}].tool_calls[${i}].id
${str(snapshot)}`);
              }
              if (type == null) {
                throw new OpenAIError(`missing choices[${index}].tool_calls[${i}].type
${str(snapshot)}`);
              }
              if (name == null) {
                throw new OpenAIError(`missing choices[${index}].tool_calls[${i}].function.name
${str(snapshot)}`);
              }
              if (args == null) {
                throw new OpenAIError(`missing choices[${index}].tool_calls[${i}].function.arguments
${str(snapshot)}`);
              }
              return __spreadProps(__spreadValues({}, toolRest), {
                id: id2,
                type,
                function: __spreadProps(__spreadValues({}, fnRest), {
                  name,
                  arguments: args
                })
              });
            })
          })
        });
      }
      return __spreadProps(__spreadValues({}, choiceRest), {
        message: __spreadProps(__spreadValues({}, messageRest), {
          content,
          role,
          refusal: message.refusal ?? null
        }),
        finish_reason,
        index,
        logprobs
      });
    }),
    created,
    model,
    object: "chat.completion"
  }), system_fingerprint ? {
    system_fingerprint
  } : {});
  return maybeParseChatCompletion(completion, params);
}
function str(x) {
  return JSON.stringify(x);
}
function assertIsEmpty(obj) {
  return;
}
function assertNever(_x) {
}

// node_modules/openai/lib/ChatCompletionStreamingRunner.mjs
var ChatCompletionStreamingRunner = class _ChatCompletionStreamingRunner extends ChatCompletionStream {
  static fromReadableStream(stream) {
    const runner = new _ChatCompletionStreamingRunner(null);
    runner._run(() => runner._fromReadableStream(stream));
    return runner;
  }
  /** @deprecated - please use `runTools` instead. */
  static runFunctions(client, params, options) {
    const runner = new _ChatCompletionStreamingRunner(null);
    const opts = __spreadProps(__spreadValues({}, options), {
      headers: __spreadProps(__spreadValues({}, options?.headers), {
        "X-Stainless-Helper-Method": "runFunctions"
      })
    });
    runner._run(() => runner._runFunctions(client, params, opts));
    return runner;
  }
  static runTools(client, params, options) {
    const runner = new _ChatCompletionStreamingRunner(
      // @ts-expect-error TODO these types are incompatible
      params
    );
    const opts = __spreadProps(__spreadValues({}, options), {
      headers: __spreadProps(__spreadValues({}, options?.headers), {
        "X-Stainless-Helper-Method": "runTools"
      })
    });
    runner._run(() => runner._runTools(client, params, opts));
    return runner;
  }
};

// node_modules/openai/resources/beta/chat/completions.mjs
var Completions2 = class extends APIResource {
  parse(body, options) {
    validateInputTools(body.tools);
    return this._client.chat.completions.create(body, __spreadProps(__spreadValues({}, options), {
      headers: __spreadProps(__spreadValues({}, options?.headers), {
        "X-Stainless-Helper-Method": "beta.chat.completions.parse"
      })
    }))._thenUnwrap((completion) => parseChatCompletion(completion, body));
  }
  runFunctions(body, options) {
    if (body.stream) {
      return ChatCompletionStreamingRunner.runFunctions(this._client, body, options);
    }
    return ChatCompletionRunner.runFunctions(this._client, body, options);
  }
  runTools(body, options) {
    if (body.stream) {
      return ChatCompletionStreamingRunner.runTools(this._client, body, options);
    }
    return ChatCompletionRunner.runTools(this._client, body, options);
  }
  /**
   * Creates a chat completion stream
   */
  stream(body, options) {
    return ChatCompletionStream.createChatCompletion(this._client, body, options);
  }
};

// node_modules/openai/resources/beta/chat/chat.mjs
var Chat2 = class extends APIResource {
  constructor() {
    super(...arguments);
    this.completions = new Completions2(this._client);
  }
};
(function(Chat3) {
  Chat3.Completions = Completions2;
})(Chat2 || (Chat2 = {}));

// node_modules/openai/lib/AssistantStream.mjs
var __classPrivateFieldGet5 = function(receiver, state, kind2, f) {
  if (kind2 === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind2 === "m" ? f : kind2 === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet4 = function(receiver, state, value, kind2, f) {
  if (kind2 === "m") throw new TypeError("Private method is not writable");
  if (kind2 === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind2 === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
};
var _AssistantStream_instances;
var _AssistantStream_events;
var _AssistantStream_runStepSnapshots;
var _AssistantStream_messageSnapshots;
var _AssistantStream_messageSnapshot;
var _AssistantStream_finalRun;
var _AssistantStream_currentContentIndex;
var _AssistantStream_currentContent;
var _AssistantStream_currentToolCallIndex;
var _AssistantStream_currentToolCall;
var _AssistantStream_currentEvent;
var _AssistantStream_currentRunSnapshot;
var _AssistantStream_currentRunStepSnapshot;
var _AssistantStream_addEvent;
var _AssistantStream_endRequest;
var _AssistantStream_handleMessage;
var _AssistantStream_handleRunStep;
var _AssistantStream_handleEvent;
var _AssistantStream_accumulateRunStep;
var _AssistantStream_accumulateMessage;
var _AssistantStream_accumulateContent;
var _AssistantStream_handleRun;
var AssistantStream = class _AssistantStream extends EventStream {
  constructor() {
    super(...arguments);
    _AssistantStream_instances.add(this);
    _AssistantStream_events.set(this, []);
    _AssistantStream_runStepSnapshots.set(this, {});
    _AssistantStream_messageSnapshots.set(this, {});
    _AssistantStream_messageSnapshot.set(this, void 0);
    _AssistantStream_finalRun.set(this, void 0);
    _AssistantStream_currentContentIndex.set(this, void 0);
    _AssistantStream_currentContent.set(this, void 0);
    _AssistantStream_currentToolCallIndex.set(this, void 0);
    _AssistantStream_currentToolCall.set(this, void 0);
    _AssistantStream_currentEvent.set(this, void 0);
    _AssistantStream_currentRunSnapshot.set(this, void 0);
    _AssistantStream_currentRunStepSnapshot.set(this, void 0);
  }
  [(_AssistantStream_events = /* @__PURE__ */ new WeakMap(), _AssistantStream_runStepSnapshots = /* @__PURE__ */ new WeakMap(), _AssistantStream_messageSnapshots = /* @__PURE__ */ new WeakMap(), _AssistantStream_messageSnapshot = /* @__PURE__ */ new WeakMap(), _AssistantStream_finalRun = /* @__PURE__ */ new WeakMap(), _AssistantStream_currentContentIndex = /* @__PURE__ */ new WeakMap(), _AssistantStream_currentContent = /* @__PURE__ */ new WeakMap(), _AssistantStream_currentToolCallIndex = /* @__PURE__ */ new WeakMap(), _AssistantStream_currentToolCall = /* @__PURE__ */ new WeakMap(), _AssistantStream_currentEvent = /* @__PURE__ */ new WeakMap(), _AssistantStream_currentRunSnapshot = /* @__PURE__ */ new WeakMap(), _AssistantStream_currentRunStepSnapshot = /* @__PURE__ */ new WeakMap(), _AssistantStream_instances = /* @__PURE__ */ new WeakSet(), Symbol.asyncIterator)]() {
    const pushQueue = [];
    const readQueue = [];
    let done = false;
    this.on("event", (event) => {
      const reader = readQueue.shift();
      if (reader) {
        reader.resolve(event);
      } else {
        pushQueue.push(event);
      }
    });
    this.on("end", () => {
      done = true;
      for (const reader of readQueue) {
        reader.resolve(void 0);
      }
      readQueue.length = 0;
    });
    this.on("abort", (err) => {
      done = true;
      for (const reader of readQueue) {
        reader.reject(err);
      }
      readQueue.length = 0;
    });
    this.on("error", (err) => {
      done = true;
      for (const reader of readQueue) {
        reader.reject(err);
      }
      readQueue.length = 0;
    });
    return {
      next: () => __async(this, null, function* () {
        if (!pushQueue.length) {
          if (done) {
            return {
              value: void 0,
              done: true
            };
          }
          return new Promise((resolve, reject) => readQueue.push({
            resolve,
            reject
          })).then((chunk2) => chunk2 ? {
            value: chunk2,
            done: false
          } : {
            value: void 0,
            done: true
          });
        }
        const chunk = pushQueue.shift();
        return {
          value: chunk,
          done: false
        };
      }),
      return: () => __async(this, null, function* () {
        this.abort();
        return {
          value: void 0,
          done: true
        };
      })
    };
  }
  static fromReadableStream(stream) {
    const runner = new _AssistantStream();
    runner._run(() => runner._fromReadableStream(stream));
    return runner;
  }
  _fromReadableStream(readableStream, options) {
    return __async(this, null, function* () {
      const signal = options?.signal;
      if (signal) {
        if (signal.aborted) this.controller.abort();
        signal.addEventListener("abort", () => this.controller.abort());
      }
      this._connected();
      const stream = Stream.fromReadableStream(readableStream, this.controller);
      try {
        for (var iter = __forAwait(stream), more, temp, error; more = !(temp = yield iter.next()).done; more = false) {
          const event = temp.value;
          __classPrivateFieldGet5(this, _AssistantStream_instances, "m", _AssistantStream_addEvent).call(this, event);
        }
      } catch (temp) {
        error = [temp];
      } finally {
        try {
          more && (temp = iter.return) && (yield temp.call(iter));
        } finally {
          if (error)
            throw error[0];
        }
      }
      if (stream.controller.signal?.aborted) {
        throw new APIUserAbortError();
      }
      return this._addRun(__classPrivateFieldGet5(this, _AssistantStream_instances, "m", _AssistantStream_endRequest).call(this));
    });
  }
  toReadableStream() {
    const stream = new Stream(this[Symbol.asyncIterator].bind(this), this.controller);
    return stream.toReadableStream();
  }
  static createToolAssistantStream(threadId, runId, runs, params, options) {
    const runner = new _AssistantStream();
    runner._run(() => runner._runToolAssistantStream(threadId, runId, runs, params, __spreadProps(__spreadValues({}, options), {
      headers: __spreadProps(__spreadValues({}, options?.headers), {
        "X-Stainless-Helper-Method": "stream"
      })
    })));
    return runner;
  }
  _createToolAssistantStream(run, threadId, runId, params, options) {
    return __async(this, null, function* () {
      const signal = options?.signal;
      if (signal) {
        if (signal.aborted) this.controller.abort();
        signal.addEventListener("abort", () => this.controller.abort());
      }
      const body = __spreadProps(__spreadValues({}, params), {
        stream: true
      });
      const stream = yield run.submitToolOutputs(threadId, runId, body, __spreadProps(__spreadValues({}, options), {
        signal: this.controller.signal
      }));
      this._connected();
      try {
        for (var iter = __forAwait(stream), more, temp, error; more = !(temp = yield iter.next()).done; more = false) {
          const event = temp.value;
          __classPrivateFieldGet5(this, _AssistantStream_instances, "m", _AssistantStream_addEvent).call(this, event);
        }
      } catch (temp) {
        error = [temp];
      } finally {
        try {
          more && (temp = iter.return) && (yield temp.call(iter));
        } finally {
          if (error)
            throw error[0];
        }
      }
      if (stream.controller.signal?.aborted) {
        throw new APIUserAbortError();
      }
      return this._addRun(__classPrivateFieldGet5(this, _AssistantStream_instances, "m", _AssistantStream_endRequest).call(this));
    });
  }
  static createThreadAssistantStream(params, thread, options) {
    const runner = new _AssistantStream();
    runner._run(() => runner._threadAssistantStream(params, thread, __spreadProps(__spreadValues({}, options), {
      headers: __spreadProps(__spreadValues({}, options?.headers), {
        "X-Stainless-Helper-Method": "stream"
      })
    })));
    return runner;
  }
  static createAssistantStream(threadId, runs, params, options) {
    const runner = new _AssistantStream();
    runner._run(() => runner._runAssistantStream(threadId, runs, params, __spreadProps(__spreadValues({}, options), {
      headers: __spreadProps(__spreadValues({}, options?.headers), {
        "X-Stainless-Helper-Method": "stream"
      })
    })));
    return runner;
  }
  currentEvent() {
    return __classPrivateFieldGet5(this, _AssistantStream_currentEvent, "f");
  }
  currentRun() {
    return __classPrivateFieldGet5(this, _AssistantStream_currentRunSnapshot, "f");
  }
  currentMessageSnapshot() {
    return __classPrivateFieldGet5(this, _AssistantStream_messageSnapshot, "f");
  }
  currentRunStepSnapshot() {
    return __classPrivateFieldGet5(this, _AssistantStream_currentRunStepSnapshot, "f");
  }
  finalRunSteps() {
    return __async(this, null, function* () {
      yield this.done();
      return Object.values(__classPrivateFieldGet5(this, _AssistantStream_runStepSnapshots, "f"));
    });
  }
  finalMessages() {
    return __async(this, null, function* () {
      yield this.done();
      return Object.values(__classPrivateFieldGet5(this, _AssistantStream_messageSnapshots, "f"));
    });
  }
  finalRun() {
    return __async(this, null, function* () {
      yield this.done();
      if (!__classPrivateFieldGet5(this, _AssistantStream_finalRun, "f")) throw Error("Final run was not received.");
      return __classPrivateFieldGet5(this, _AssistantStream_finalRun, "f");
    });
  }
  _createThreadAssistantStream(thread, params, options) {
    return __async(this, null, function* () {
      const signal = options?.signal;
      if (signal) {
        if (signal.aborted) this.controller.abort();
        signal.addEventListener("abort", () => this.controller.abort());
      }
      const body = __spreadProps(__spreadValues({}, params), {
        stream: true
      });
      const stream = yield thread.createAndRun(body, __spreadProps(__spreadValues({}, options), {
        signal: this.controller.signal
      }));
      this._connected();
      try {
        for (var iter = __forAwait(stream), more, temp, error; more = !(temp = yield iter.next()).done; more = false) {
          const event = temp.value;
          __classPrivateFieldGet5(this, _AssistantStream_instances, "m", _AssistantStream_addEvent).call(this, event);
        }
      } catch (temp) {
        error = [temp];
      } finally {
        try {
          more && (temp = iter.return) && (yield temp.call(iter));
        } finally {
          if (error)
            throw error[0];
        }
      }
      if (stream.controller.signal?.aborted) {
        throw new APIUserAbortError();
      }
      return this._addRun(__classPrivateFieldGet5(this, _AssistantStream_instances, "m", _AssistantStream_endRequest).call(this));
    });
  }
  _createAssistantStream(run, threadId, params, options) {
    return __async(this, null, function* () {
      const signal = options?.signal;
      if (signal) {
        if (signal.aborted) this.controller.abort();
        signal.addEventListener("abort", () => this.controller.abort());
      }
      const body = __spreadProps(__spreadValues({}, params), {
        stream: true
      });
      const stream = yield run.create(threadId, body, __spreadProps(__spreadValues({}, options), {
        signal: this.controller.signal
      }));
      this._connected();
      try {
        for (var iter = __forAwait(stream), more, temp, error; more = !(temp = yield iter.next()).done; more = false) {
          const event = temp.value;
          __classPrivateFieldGet5(this, _AssistantStream_instances, "m", _AssistantStream_addEvent).call(this, event);
        }
      } catch (temp) {
        error = [temp];
      } finally {
        try {
          more && (temp = iter.return) && (yield temp.call(iter));
        } finally {
          if (error)
            throw error[0];
        }
      }
      if (stream.controller.signal?.aborted) {
        throw new APIUserAbortError();
      }
      return this._addRun(__classPrivateFieldGet5(this, _AssistantStream_instances, "m", _AssistantStream_endRequest).call(this));
    });
  }
  static accumulateDelta(acc, delta) {
    for (const [key, deltaValue] of Object.entries(delta)) {
      if (!acc.hasOwnProperty(key)) {
        acc[key] = deltaValue;
        continue;
      }
      let accValue = acc[key];
      if (accValue === null || accValue === void 0) {
        acc[key] = deltaValue;
        continue;
      }
      if (key === "index" || key === "type") {
        acc[key] = deltaValue;
        continue;
      }
      if (typeof accValue === "string" && typeof deltaValue === "string") {
        accValue += deltaValue;
      } else if (typeof accValue === "number" && typeof deltaValue === "number") {
        accValue += deltaValue;
      } else if (isObj(accValue) && isObj(deltaValue)) {
        accValue = this.accumulateDelta(accValue, deltaValue);
      } else if (Array.isArray(accValue) && Array.isArray(deltaValue)) {
        if (accValue.every((x) => typeof x === "string" || typeof x === "number")) {
          accValue.push(...deltaValue);
          continue;
        }
        for (const deltaEntry of deltaValue) {
          if (!isObj(deltaEntry)) {
            throw new Error(`Expected array delta entry to be an object but got: ${deltaEntry}`);
          }
          const index = deltaEntry["index"];
          if (index == null) {
            console.error(deltaEntry);
            throw new Error("Expected array delta entry to have an `index` property");
          }
          if (typeof index !== "number") {
            throw new Error(`Expected array delta entry \`index\` property to be a number but got ${index}`);
          }
          const accEntry = accValue[index];
          if (accEntry == null) {
            accValue.push(deltaEntry);
          } else {
            accValue[index] = this.accumulateDelta(accEntry, deltaEntry);
          }
        }
        continue;
      } else {
        throw Error(`Unhandled record type: ${key}, deltaValue: ${deltaValue}, accValue: ${accValue}`);
      }
      acc[key] = accValue;
    }
    return acc;
  }
  _addRun(run) {
    return run;
  }
  _threadAssistantStream(params, thread, options) {
    return __async(this, null, function* () {
      return yield this._createThreadAssistantStream(thread, params, options);
    });
  }
  _runAssistantStream(threadId, runs, params, options) {
    return __async(this, null, function* () {
      return yield this._createAssistantStream(runs, threadId, params, options);
    });
  }
  _runToolAssistantStream(threadId, runId, runs, params, options) {
    return __async(this, null, function* () {
      return yield this._createToolAssistantStream(runs, threadId, runId, params, options);
    });
  }
};
_AssistantStream_addEvent = function _AssistantStream_addEvent2(event) {
  if (this.ended) return;
  __classPrivateFieldSet4(this, _AssistantStream_currentEvent, event, "f");
  __classPrivateFieldGet5(this, _AssistantStream_instances, "m", _AssistantStream_handleEvent).call(this, event);
  switch (event.event) {
    case "thread.created":
      break;
    case "thread.run.created":
    case "thread.run.queued":
    case "thread.run.in_progress":
    case "thread.run.requires_action":
    case "thread.run.completed":
    case "thread.run.failed":
    case "thread.run.cancelling":
    case "thread.run.cancelled":
    case "thread.run.expired":
      __classPrivateFieldGet5(this, _AssistantStream_instances, "m", _AssistantStream_handleRun).call(this, event);
      break;
    case "thread.run.step.created":
    case "thread.run.step.in_progress":
    case "thread.run.step.delta":
    case "thread.run.step.completed":
    case "thread.run.step.failed":
    case "thread.run.step.cancelled":
    case "thread.run.step.expired":
      __classPrivateFieldGet5(this, _AssistantStream_instances, "m", _AssistantStream_handleRunStep).call(this, event);
      break;
    case "thread.message.created":
    case "thread.message.in_progress":
    case "thread.message.delta":
    case "thread.message.completed":
    case "thread.message.incomplete":
      __classPrivateFieldGet5(this, _AssistantStream_instances, "m", _AssistantStream_handleMessage).call(this, event);
      break;
    case "error":
      throw new Error("Encountered an error event in event processing - errors should be processed earlier");
  }
}, _AssistantStream_endRequest = function _AssistantStream_endRequest2() {
  if (this.ended) {
    throw new OpenAIError(`stream has ended, this shouldn't happen`);
  }
  if (!__classPrivateFieldGet5(this, _AssistantStream_finalRun, "f")) throw Error("Final run has not been received");
  return __classPrivateFieldGet5(this, _AssistantStream_finalRun, "f");
}, _AssistantStream_handleMessage = function _AssistantStream_handleMessage2(event) {
  const [accumulatedMessage, newContent] = __classPrivateFieldGet5(this, _AssistantStream_instances, "m", _AssistantStream_accumulateMessage).call(this, event, __classPrivateFieldGet5(this, _AssistantStream_messageSnapshot, "f"));
  __classPrivateFieldSet4(this, _AssistantStream_messageSnapshot, accumulatedMessage, "f");
  __classPrivateFieldGet5(this, _AssistantStream_messageSnapshots, "f")[accumulatedMessage.id] = accumulatedMessage;
  for (const content of newContent) {
    const snapshotContent = accumulatedMessage.content[content.index];
    if (snapshotContent?.type == "text") {
      this._emit("textCreated", snapshotContent.text);
    }
  }
  switch (event.event) {
    case "thread.message.created":
      this._emit("messageCreated", event.data);
      break;
    case "thread.message.in_progress":
      break;
    case "thread.message.delta":
      this._emit("messageDelta", event.data.delta, accumulatedMessage);
      if (event.data.delta.content) {
        for (const content of event.data.delta.content) {
          if (content.type == "text" && content.text) {
            let textDelta = content.text;
            let snapshot = accumulatedMessage.content[content.index];
            if (snapshot && snapshot.type == "text") {
              this._emit("textDelta", textDelta, snapshot.text);
            } else {
              throw Error("The snapshot associated with this text delta is not text or missing");
            }
          }
          if (content.index != __classPrivateFieldGet5(this, _AssistantStream_currentContentIndex, "f")) {
            if (__classPrivateFieldGet5(this, _AssistantStream_currentContent, "f")) {
              switch (__classPrivateFieldGet5(this, _AssistantStream_currentContent, "f").type) {
                case "text":
                  this._emit("textDone", __classPrivateFieldGet5(this, _AssistantStream_currentContent, "f").text, __classPrivateFieldGet5(this, _AssistantStream_messageSnapshot, "f"));
                  break;
                case "image_file":
                  this._emit("imageFileDone", __classPrivateFieldGet5(this, _AssistantStream_currentContent, "f").image_file, __classPrivateFieldGet5(this, _AssistantStream_messageSnapshot, "f"));
                  break;
              }
            }
            __classPrivateFieldSet4(this, _AssistantStream_currentContentIndex, content.index, "f");
          }
          __classPrivateFieldSet4(this, _AssistantStream_currentContent, accumulatedMessage.content[content.index], "f");
        }
      }
      break;
    case "thread.message.completed":
    case "thread.message.incomplete":
      if (__classPrivateFieldGet5(this, _AssistantStream_currentContentIndex, "f") !== void 0) {
        const currentContent = event.data.content[__classPrivateFieldGet5(this, _AssistantStream_currentContentIndex, "f")];
        if (currentContent) {
          switch (currentContent.type) {
            case "image_file":
              this._emit("imageFileDone", currentContent.image_file, __classPrivateFieldGet5(this, _AssistantStream_messageSnapshot, "f"));
              break;
            case "text":
              this._emit("textDone", currentContent.text, __classPrivateFieldGet5(this, _AssistantStream_messageSnapshot, "f"));
              break;
          }
        }
      }
      if (__classPrivateFieldGet5(this, _AssistantStream_messageSnapshot, "f")) {
        this._emit("messageDone", event.data);
      }
      __classPrivateFieldSet4(this, _AssistantStream_messageSnapshot, void 0, "f");
  }
}, _AssistantStream_handleRunStep = function _AssistantStream_handleRunStep2(event) {
  const accumulatedRunStep = __classPrivateFieldGet5(this, _AssistantStream_instances, "m", _AssistantStream_accumulateRunStep).call(this, event);
  __classPrivateFieldSet4(this, _AssistantStream_currentRunStepSnapshot, accumulatedRunStep, "f");
  switch (event.event) {
    case "thread.run.step.created":
      this._emit("runStepCreated", event.data);
      break;
    case "thread.run.step.delta":
      const delta = event.data.delta;
      if (delta.step_details && delta.step_details.type == "tool_calls" && delta.step_details.tool_calls && accumulatedRunStep.step_details.type == "tool_calls") {
        for (const toolCall of delta.step_details.tool_calls) {
          if (toolCall.index == __classPrivateFieldGet5(this, _AssistantStream_currentToolCallIndex, "f")) {
            this._emit("toolCallDelta", toolCall, accumulatedRunStep.step_details.tool_calls[toolCall.index]);
          } else {
            if (__classPrivateFieldGet5(this, _AssistantStream_currentToolCall, "f")) {
              this._emit("toolCallDone", __classPrivateFieldGet5(this, _AssistantStream_currentToolCall, "f"));
            }
            __classPrivateFieldSet4(this, _AssistantStream_currentToolCallIndex, toolCall.index, "f");
            __classPrivateFieldSet4(this, _AssistantStream_currentToolCall, accumulatedRunStep.step_details.tool_calls[toolCall.index], "f");
            if (__classPrivateFieldGet5(this, _AssistantStream_currentToolCall, "f")) this._emit("toolCallCreated", __classPrivateFieldGet5(this, _AssistantStream_currentToolCall, "f"));
          }
        }
      }
      this._emit("runStepDelta", event.data.delta, accumulatedRunStep);
      break;
    case "thread.run.step.completed":
    case "thread.run.step.failed":
    case "thread.run.step.cancelled":
    case "thread.run.step.expired":
      __classPrivateFieldSet4(this, _AssistantStream_currentRunStepSnapshot, void 0, "f");
      const details = event.data.step_details;
      if (details.type == "tool_calls") {
        if (__classPrivateFieldGet5(this, _AssistantStream_currentToolCall, "f")) {
          this._emit("toolCallDone", __classPrivateFieldGet5(this, _AssistantStream_currentToolCall, "f"));
          __classPrivateFieldSet4(this, _AssistantStream_currentToolCall, void 0, "f");
        }
      }
      this._emit("runStepDone", event.data, accumulatedRunStep);
      break;
    case "thread.run.step.in_progress":
      break;
  }
}, _AssistantStream_handleEvent = function _AssistantStream_handleEvent2(event) {
  __classPrivateFieldGet5(this, _AssistantStream_events, "f").push(event);
  this._emit("event", event);
}, _AssistantStream_accumulateRunStep = function _AssistantStream_accumulateRunStep2(event) {
  switch (event.event) {
    case "thread.run.step.created":
      __classPrivateFieldGet5(this, _AssistantStream_runStepSnapshots, "f")[event.data.id] = event.data;
      return event.data;
    case "thread.run.step.delta":
      let snapshot = __classPrivateFieldGet5(this, _AssistantStream_runStepSnapshots, "f")[event.data.id];
      if (!snapshot) {
        throw Error("Received a RunStepDelta before creation of a snapshot");
      }
      let data = event.data;
      if (data.delta) {
        const accumulated = AssistantStream.accumulateDelta(snapshot, data.delta);
        __classPrivateFieldGet5(this, _AssistantStream_runStepSnapshots, "f")[event.data.id] = accumulated;
      }
      return __classPrivateFieldGet5(this, _AssistantStream_runStepSnapshots, "f")[event.data.id];
    case "thread.run.step.completed":
    case "thread.run.step.failed":
    case "thread.run.step.cancelled":
    case "thread.run.step.expired":
    case "thread.run.step.in_progress":
      __classPrivateFieldGet5(this, _AssistantStream_runStepSnapshots, "f")[event.data.id] = event.data;
      break;
  }
  if (__classPrivateFieldGet5(this, _AssistantStream_runStepSnapshots, "f")[event.data.id]) return __classPrivateFieldGet5(this, _AssistantStream_runStepSnapshots, "f")[event.data.id];
  throw new Error("No snapshot available");
}, _AssistantStream_accumulateMessage = function _AssistantStream_accumulateMessage2(event, snapshot) {
  let newContent = [];
  switch (event.event) {
    case "thread.message.created":
      return [event.data, newContent];
    case "thread.message.delta":
      if (!snapshot) {
        throw Error("Received a delta with no existing snapshot (there should be one from message creation)");
      }
      let data = event.data;
      if (data.delta.content) {
        for (const contentElement of data.delta.content) {
          if (contentElement.index in snapshot.content) {
            let currentContent = snapshot.content[contentElement.index];
            snapshot.content[contentElement.index] = __classPrivateFieldGet5(this, _AssistantStream_instances, "m", _AssistantStream_accumulateContent).call(this, contentElement, currentContent);
          } else {
            snapshot.content[contentElement.index] = contentElement;
            newContent.push(contentElement);
          }
        }
      }
      return [snapshot, newContent];
    case "thread.message.in_progress":
    case "thread.message.completed":
    case "thread.message.incomplete":
      if (snapshot) {
        return [snapshot, newContent];
      } else {
        throw Error("Received thread message event with no existing snapshot");
      }
  }
  throw Error("Tried to accumulate a non-message event");
}, _AssistantStream_accumulateContent = function _AssistantStream_accumulateContent2(contentElement, currentContent) {
  return AssistantStream.accumulateDelta(currentContent, contentElement);
}, _AssistantStream_handleRun = function _AssistantStream_handleRun2(event) {
  __classPrivateFieldSet4(this, _AssistantStream_currentRunSnapshot, event.data, "f");
  switch (event.event) {
    case "thread.run.created":
      break;
    case "thread.run.queued":
      break;
    case "thread.run.in_progress":
      break;
    case "thread.run.requires_action":
    case "thread.run.cancelled":
    case "thread.run.failed":
    case "thread.run.completed":
    case "thread.run.expired":
      __classPrivateFieldSet4(this, _AssistantStream_finalRun, event.data, "f");
      if (__classPrivateFieldGet5(this, _AssistantStream_currentToolCall, "f")) {
        this._emit("toolCallDone", __classPrivateFieldGet5(this, _AssistantStream_currentToolCall, "f"));
        __classPrivateFieldSet4(this, _AssistantStream_currentToolCall, void 0, "f");
      }
      break;
    case "thread.run.cancelling":
      break;
  }
};

// node_modules/openai/resources/beta/threads/messages.mjs
var Messages = class extends APIResource {
  /**
   * Create a message.
   */
  create(threadId, body, options) {
    return this._client.post(`/threads/${threadId}/messages`, __spreadProps(__spreadValues({
      body
    }, options), {
      headers: __spreadValues({
        "OpenAI-Beta": "assistants=v2"
      }, options?.headers)
    }));
  }
  /**
   * Retrieve a message.
   */
  retrieve(threadId, messageId, options) {
    return this._client.get(`/threads/${threadId}/messages/${messageId}`, __spreadProps(__spreadValues({}, options), {
      headers: __spreadValues({
        "OpenAI-Beta": "assistants=v2"
      }, options?.headers)
    }));
  }
  /**
   * Modifies a message.
   */
  update(threadId, messageId, body, options) {
    return this._client.post(`/threads/${threadId}/messages/${messageId}`, __spreadProps(__spreadValues({
      body
    }, options), {
      headers: __spreadValues({
        "OpenAI-Beta": "assistants=v2"
      }, options?.headers)
    }));
  }
  list(threadId, query = {}, options) {
    if (isRequestOptions(query)) {
      return this.list(threadId, {}, query);
    }
    return this._client.getAPIList(`/threads/${threadId}/messages`, MessagesPage, __spreadProps(__spreadValues({
      query
    }, options), {
      headers: __spreadValues({
        "OpenAI-Beta": "assistants=v2"
      }, options?.headers)
    }));
  }
  /**
   * Deletes a message.
   */
  del(threadId, messageId, options) {
    return this._client.delete(`/threads/${threadId}/messages/${messageId}`, __spreadProps(__spreadValues({}, options), {
      headers: __spreadValues({
        "OpenAI-Beta": "assistants=v2"
      }, options?.headers)
    }));
  }
};
var MessagesPage = class extends CursorPage {
};
Messages.MessagesPage = MessagesPage;

// node_modules/openai/resources/beta/threads/runs/steps.mjs
var Steps = class extends APIResource {
  retrieve(threadId, runId, stepId, query = {}, options) {
    if (isRequestOptions(query)) {
      return this.retrieve(threadId, runId, stepId, {}, query);
    }
    return this._client.get(`/threads/${threadId}/runs/${runId}/steps/${stepId}`, __spreadProps(__spreadValues({
      query
    }, options), {
      headers: __spreadValues({
        "OpenAI-Beta": "assistants=v2"
      }, options?.headers)
    }));
  }
  list(threadId, runId, query = {}, options) {
    if (isRequestOptions(query)) {
      return this.list(threadId, runId, {}, query);
    }
    return this._client.getAPIList(`/threads/${threadId}/runs/${runId}/steps`, RunStepsPage, __spreadProps(__spreadValues({
      query
    }, options), {
      headers: __spreadValues({
        "OpenAI-Beta": "assistants=v2"
      }, options?.headers)
    }));
  }
};
var RunStepsPage = class extends CursorPage {
};
Steps.RunStepsPage = RunStepsPage;

// node_modules/openai/resources/beta/threads/runs/runs.mjs
var Runs = class extends APIResource {
  constructor() {
    super(...arguments);
    this.steps = new Steps(this._client);
  }
  create(threadId, params, options) {
    const _a2 = params, {
      include
    } = _a2, body = __objRest(_a2, [
      "include"
    ]);
    return this._client.post(`/threads/${threadId}/runs`, __spreadProps(__spreadValues({
      query: {
        include
      },
      body
    }, options), {
      headers: __spreadValues({
        "OpenAI-Beta": "assistants=v2"
      }, options?.headers),
      stream: params.stream ?? false
    }));
  }
  /**
   * Retrieves a run.
   */
  retrieve(threadId, runId, options) {
    return this._client.get(`/threads/${threadId}/runs/${runId}`, __spreadProps(__spreadValues({}, options), {
      headers: __spreadValues({
        "OpenAI-Beta": "assistants=v2"
      }, options?.headers)
    }));
  }
  /**
   * Modifies a run.
   */
  update(threadId, runId, body, options) {
    return this._client.post(`/threads/${threadId}/runs/${runId}`, __spreadProps(__spreadValues({
      body
    }, options), {
      headers: __spreadValues({
        "OpenAI-Beta": "assistants=v2"
      }, options?.headers)
    }));
  }
  list(threadId, query = {}, options) {
    if (isRequestOptions(query)) {
      return this.list(threadId, {}, query);
    }
    return this._client.getAPIList(`/threads/${threadId}/runs`, RunsPage, __spreadProps(__spreadValues({
      query
    }, options), {
      headers: __spreadValues({
        "OpenAI-Beta": "assistants=v2"
      }, options?.headers)
    }));
  }
  /**
   * Cancels a run that is `in_progress`.
   */
  cancel(threadId, runId, options) {
    return this._client.post(`/threads/${threadId}/runs/${runId}/cancel`, __spreadProps(__spreadValues({}, options), {
      headers: __spreadValues({
        "OpenAI-Beta": "assistants=v2"
      }, options?.headers)
    }));
  }
  /**
   * A helper to create a run an poll for a terminal state. More information on Run
   * lifecycles can be found here:
   * https://platform.openai.com/docs/assistants/how-it-works/runs-and-run-steps
   */
  createAndPoll(threadId, body, options) {
    return __async(this, null, function* () {
      const run = yield this.create(threadId, body, options);
      return yield this.poll(threadId, run.id, options);
    });
  }
  /**
   * Create a Run stream
   *
   * @deprecated use `stream` instead
   */
  createAndStream(threadId, body, options) {
    return AssistantStream.createAssistantStream(threadId, this._client.beta.threads.runs, body, options);
  }
  /**
   * A helper to poll a run status until it reaches a terminal state. More
   * information on Run lifecycles can be found here:
   * https://platform.openai.com/docs/assistants/how-it-works/runs-and-run-steps
   */
  poll(threadId, runId, options) {
    return __async(this, null, function* () {
      const headers = __spreadProps(__spreadValues({}, options?.headers), {
        "X-Stainless-Poll-Helper": "true"
      });
      if (options?.pollIntervalMs) {
        headers["X-Stainless-Custom-Poll-Interval"] = options.pollIntervalMs.toString();
      }
      while (true) {
        const {
          data: run,
          response
        } = yield this.retrieve(threadId, runId, __spreadProps(__spreadValues({}, options), {
          headers: __spreadValues(__spreadValues({}, options?.headers), headers)
        })).withResponse();
        switch (run.status) {
          case "queued":
          case "in_progress":
          case "cancelling":
            let sleepInterval = 5e3;
            if (options?.pollIntervalMs) {
              sleepInterval = options.pollIntervalMs;
            } else {
              const headerInterval = response.headers.get("openai-poll-after-ms");
              if (headerInterval) {
                const headerIntervalMs = parseInt(headerInterval);
                if (!isNaN(headerIntervalMs)) {
                  sleepInterval = headerIntervalMs;
                }
              }
            }
            yield sleep(sleepInterval);
            break;
          case "requires_action":
          case "incomplete":
          case "cancelled":
          case "completed":
          case "failed":
          case "expired":
            return run;
        }
      }
    });
  }
  /**
   * Create a Run stream
   */
  stream(threadId, body, options) {
    return AssistantStream.createAssistantStream(threadId, this._client.beta.threads.runs, body, options);
  }
  submitToolOutputs(threadId, runId, body, options) {
    return this._client.post(`/threads/${threadId}/runs/${runId}/submit_tool_outputs`, __spreadProps(__spreadValues({
      body
    }, options), {
      headers: __spreadValues({
        "OpenAI-Beta": "assistants=v2"
      }, options?.headers),
      stream: body.stream ?? false
    }));
  }
  /**
   * A helper to submit a tool output to a run and poll for a terminal run state.
   * More information on Run lifecycles can be found here:
   * https://platform.openai.com/docs/assistants/how-it-works/runs-and-run-steps
   */
  submitToolOutputsAndPoll(threadId, runId, body, options) {
    return __async(this, null, function* () {
      const run = yield this.submitToolOutputs(threadId, runId, body, options);
      return yield this.poll(threadId, run.id, options);
    });
  }
  /**
   * Submit the tool outputs from a previous run and stream the run to a terminal
   * state. More information on Run lifecycles can be found here:
   * https://platform.openai.com/docs/assistants/how-it-works/runs-and-run-steps
   */
  submitToolOutputsStream(threadId, runId, body, options) {
    return AssistantStream.createToolAssistantStream(threadId, runId, this._client.beta.threads.runs, body, options);
  }
};
var RunsPage = class extends CursorPage {
};
Runs.RunsPage = RunsPage;
Runs.Steps = Steps;
Runs.RunStepsPage = RunStepsPage;

// node_modules/openai/resources/beta/threads/threads.mjs
var Threads = class extends APIResource {
  constructor() {
    super(...arguments);
    this.runs = new Runs(this._client);
    this.messages = new Messages(this._client);
  }
  create(body = {}, options) {
    if (isRequestOptions(body)) {
      return this.create({}, body);
    }
    return this._client.post("/threads", __spreadProps(__spreadValues({
      body
    }, options), {
      headers: __spreadValues({
        "OpenAI-Beta": "assistants=v2"
      }, options?.headers)
    }));
  }
  /**
   * Retrieves a thread.
   */
  retrieve(threadId, options) {
    return this._client.get(`/threads/${threadId}`, __spreadProps(__spreadValues({}, options), {
      headers: __spreadValues({
        "OpenAI-Beta": "assistants=v2"
      }, options?.headers)
    }));
  }
  /**
   * Modifies a thread.
   */
  update(threadId, body, options) {
    return this._client.post(`/threads/${threadId}`, __spreadProps(__spreadValues({
      body
    }, options), {
      headers: __spreadValues({
        "OpenAI-Beta": "assistants=v2"
      }, options?.headers)
    }));
  }
  /**
   * Delete a thread.
   */
  del(threadId, options) {
    return this._client.delete(`/threads/${threadId}`, __spreadProps(__spreadValues({}, options), {
      headers: __spreadValues({
        "OpenAI-Beta": "assistants=v2"
      }, options?.headers)
    }));
  }
  createAndRun(body, options) {
    return this._client.post("/threads/runs", __spreadProps(__spreadValues({
      body
    }, options), {
      headers: __spreadValues({
        "OpenAI-Beta": "assistants=v2"
      }, options?.headers),
      stream: body.stream ?? false
    }));
  }
  /**
   * A helper to create a thread, start a run and then poll for a terminal state.
   * More information on Run lifecycles can be found here:
   * https://platform.openai.com/docs/assistants/how-it-works/runs-and-run-steps
   */
  createAndRunPoll(body, options) {
    return __async(this, null, function* () {
      const run = yield this.createAndRun(body, options);
      return yield this.runs.poll(run.thread_id, run.id, options);
    });
  }
  /**
   * Create a thread and stream the run back
   */
  createAndRunStream(body, options) {
    return AssistantStream.createThreadAssistantStream(body, this._client.beta.threads, options);
  }
};
Threads.Runs = Runs;
Threads.RunsPage = RunsPage;
Threads.Messages = Messages;
Threads.MessagesPage = MessagesPage;

// node_modules/openai/lib/Util.mjs
var allSettledWithThrow = (promises) => __async(void 0, null, function* () {
  const results = yield Promise.allSettled(promises);
  const rejected = results.filter((result) => result.status === "rejected");
  if (rejected.length) {
    for (const result of rejected) {
      console.error(result.reason);
    }
    throw new Error(`${rejected.length} promise(s) failed - see the above errors`);
  }
  const values = [];
  for (const result of results) {
    if (result.status === "fulfilled") {
      values.push(result.value);
    }
  }
  return values;
});

// node_modules/openai/resources/beta/vector-stores/files.mjs
var Files = class extends APIResource {
  /**
   * Create a vector store file by attaching a
   * [File](https://platform.openai.com/docs/api-reference/files) to a
   * [vector store](https://platform.openai.com/docs/api-reference/vector-stores/object).
   */
  create(vectorStoreId, body, options) {
    return this._client.post(`/vector_stores/${vectorStoreId}/files`, __spreadProps(__spreadValues({
      body
    }, options), {
      headers: __spreadValues({
        "OpenAI-Beta": "assistants=v2"
      }, options?.headers)
    }));
  }
  /**
   * Retrieves a vector store file.
   */
  retrieve(vectorStoreId, fileId, options) {
    return this._client.get(`/vector_stores/${vectorStoreId}/files/${fileId}`, __spreadProps(__spreadValues({}, options), {
      headers: __spreadValues({
        "OpenAI-Beta": "assistants=v2"
      }, options?.headers)
    }));
  }
  list(vectorStoreId, query = {}, options) {
    if (isRequestOptions(query)) {
      return this.list(vectorStoreId, {}, query);
    }
    return this._client.getAPIList(`/vector_stores/${vectorStoreId}/files`, VectorStoreFilesPage, __spreadProps(__spreadValues({
      query
    }, options), {
      headers: __spreadValues({
        "OpenAI-Beta": "assistants=v2"
      }, options?.headers)
    }));
  }
  /**
   * Delete a vector store file. This will remove the file from the vector store but
   * the file itself will not be deleted. To delete the file, use the
   * [delete file](https://platform.openai.com/docs/api-reference/files/delete)
   * endpoint.
   */
  del(vectorStoreId, fileId, options) {
    return this._client.delete(`/vector_stores/${vectorStoreId}/files/${fileId}`, __spreadProps(__spreadValues({}, options), {
      headers: __spreadValues({
        "OpenAI-Beta": "assistants=v2"
      }, options?.headers)
    }));
  }
  /**
   * Attach a file to the given vector store and wait for it to be processed.
   */
  createAndPoll(vectorStoreId, body, options) {
    return __async(this, null, function* () {
      const file = yield this.create(vectorStoreId, body, options);
      return yield this.poll(vectorStoreId, file.id, options);
    });
  }
  /**
   * Wait for the vector store file to finish processing.
   *
   * Note: this will return even if the file failed to process, you need to check
   * file.last_error and file.status to handle these cases
   */
  poll(vectorStoreId, fileId, options) {
    return __async(this, null, function* () {
      const headers = __spreadProps(__spreadValues({}, options?.headers), {
        "X-Stainless-Poll-Helper": "true"
      });
      if (options?.pollIntervalMs) {
        headers["X-Stainless-Custom-Poll-Interval"] = options.pollIntervalMs.toString();
      }
      while (true) {
        const fileResponse = yield this.retrieve(vectorStoreId, fileId, __spreadProps(__spreadValues({}, options), {
          headers
        })).withResponse();
        const file = fileResponse.data;
        switch (file.status) {
          case "in_progress":
            let sleepInterval = 5e3;
            if (options?.pollIntervalMs) {
              sleepInterval = options.pollIntervalMs;
            } else {
              const headerInterval = fileResponse.response.headers.get("openai-poll-after-ms");
              if (headerInterval) {
                const headerIntervalMs = parseInt(headerInterval);
                if (!isNaN(headerIntervalMs)) {
                  sleepInterval = headerIntervalMs;
                }
              }
            }
            yield sleep(sleepInterval);
            break;
          case "failed":
          case "completed":
            return file;
        }
      }
    });
  }
  /**
   * Upload a file to the `files` API and then attach it to the given vector store.
   *
   * Note the file will be asynchronously processed (you can use the alternative
   * polling helper method to wait for processing to complete).
   */
  upload(vectorStoreId, file, options) {
    return __async(this, null, function* () {
      const fileInfo = yield this._client.files.create({
        file,
        purpose: "assistants"
      }, options);
      return this.create(vectorStoreId, {
        file_id: fileInfo.id
      }, options);
    });
  }
  /**
   * Add a file to a vector store and poll until processing is complete.
   */
  uploadAndPoll(vectorStoreId, file, options) {
    return __async(this, null, function* () {
      const fileInfo = yield this.upload(vectorStoreId, file, options);
      return yield this.poll(vectorStoreId, fileInfo.id, options);
    });
  }
};
var VectorStoreFilesPage = class extends CursorPage {
};
Files.VectorStoreFilesPage = VectorStoreFilesPage;

// node_modules/openai/resources/beta/vector-stores/file-batches.mjs
var FileBatches = class extends APIResource {
  /**
   * Create a vector store file batch.
   */
  create(vectorStoreId, body, options) {
    return this._client.post(`/vector_stores/${vectorStoreId}/file_batches`, __spreadProps(__spreadValues({
      body
    }, options), {
      headers: __spreadValues({
        "OpenAI-Beta": "assistants=v2"
      }, options?.headers)
    }));
  }
  /**
   * Retrieves a vector store file batch.
   */
  retrieve(vectorStoreId, batchId, options) {
    return this._client.get(`/vector_stores/${vectorStoreId}/file_batches/${batchId}`, __spreadProps(__spreadValues({}, options), {
      headers: __spreadValues({
        "OpenAI-Beta": "assistants=v2"
      }, options?.headers)
    }));
  }
  /**
   * Cancel a vector store file batch. This attempts to cancel the processing of
   * files in this batch as soon as possible.
   */
  cancel(vectorStoreId, batchId, options) {
    return this._client.post(`/vector_stores/${vectorStoreId}/file_batches/${batchId}/cancel`, __spreadProps(__spreadValues({}, options), {
      headers: __spreadValues({
        "OpenAI-Beta": "assistants=v2"
      }, options?.headers)
    }));
  }
  /**
   * Create a vector store batch and poll until all files have been processed.
   */
  createAndPoll(vectorStoreId, body, options) {
    return __async(this, null, function* () {
      const batch = yield this.create(vectorStoreId, body);
      return yield this.poll(vectorStoreId, batch.id, options);
    });
  }
  listFiles(vectorStoreId, batchId, query = {}, options) {
    if (isRequestOptions(query)) {
      return this.listFiles(vectorStoreId, batchId, {}, query);
    }
    return this._client.getAPIList(`/vector_stores/${vectorStoreId}/file_batches/${batchId}/files`, VectorStoreFilesPage, __spreadProps(__spreadValues({
      query
    }, options), {
      headers: __spreadValues({
        "OpenAI-Beta": "assistants=v2"
      }, options?.headers)
    }));
  }
  /**
   * Wait for the given file batch to be processed.
   *
   * Note: this will return even if one of the files failed to process, you need to
   * check batch.file_counts.failed_count to handle this case.
   */
  poll(vectorStoreId, batchId, options) {
    return __async(this, null, function* () {
      const headers = __spreadProps(__spreadValues({}, options?.headers), {
        "X-Stainless-Poll-Helper": "true"
      });
      if (options?.pollIntervalMs) {
        headers["X-Stainless-Custom-Poll-Interval"] = options.pollIntervalMs.toString();
      }
      while (true) {
        const {
          data: batch,
          response
        } = yield this.retrieve(vectorStoreId, batchId, __spreadProps(__spreadValues({}, options), {
          headers
        })).withResponse();
        switch (batch.status) {
          case "in_progress":
            let sleepInterval = 5e3;
            if (options?.pollIntervalMs) {
              sleepInterval = options.pollIntervalMs;
            } else {
              const headerInterval = response.headers.get("openai-poll-after-ms");
              if (headerInterval) {
                const headerIntervalMs = parseInt(headerInterval);
                if (!isNaN(headerIntervalMs)) {
                  sleepInterval = headerIntervalMs;
                }
              }
            }
            yield sleep(sleepInterval);
            break;
          case "failed":
          case "cancelled":
          case "completed":
            return batch;
        }
      }
    });
  }
  /**
   * Uploads the given files concurrently and then creates a vector store file batch.
   *
   * The concurrency limit is configurable using the `maxConcurrency` parameter.
   */
  uploadAndPoll(_0, _1, _2) {
    return __async(this, arguments, function* (vectorStoreId, {
      files,
      fileIds = []
    }, options) {
      if (files == null || files.length == 0) {
        throw new Error(`No \`files\` provided to process. If you've already uploaded files you should use \`.createAndPoll()\` instead`);
      }
      const configuredConcurrency = options?.maxConcurrency ?? 5;
      const concurrencyLimit = Math.min(configuredConcurrency, files.length);
      const client = this._client;
      const fileIterator = files.values();
      const allFileIds = [...fileIds];
      function processFiles(iterator) {
        return __async(this, null, function* () {
          for (let item of iterator) {
            const fileObj = yield client.files.create({
              file: item,
              purpose: "assistants"
            }, options);
            allFileIds.push(fileObj.id);
          }
        });
      }
      const workers = Array(concurrencyLimit).fill(fileIterator).map(processFiles);
      yield allSettledWithThrow(workers);
      return yield this.createAndPoll(vectorStoreId, {
        file_ids: allFileIds
      });
    });
  }
};

// node_modules/openai/resources/beta/vector-stores/vector-stores.mjs
var VectorStores = class extends APIResource {
  constructor() {
    super(...arguments);
    this.files = new Files(this._client);
    this.fileBatches = new FileBatches(this._client);
  }
  /**
   * Create a vector store.
   */
  create(body, options) {
    return this._client.post("/vector_stores", __spreadProps(__spreadValues({
      body
    }, options), {
      headers: __spreadValues({
        "OpenAI-Beta": "assistants=v2"
      }, options?.headers)
    }));
  }
  /**
   * Retrieves a vector store.
   */
  retrieve(vectorStoreId, options) {
    return this._client.get(`/vector_stores/${vectorStoreId}`, __spreadProps(__spreadValues({}, options), {
      headers: __spreadValues({
        "OpenAI-Beta": "assistants=v2"
      }, options?.headers)
    }));
  }
  /**
   * Modifies a vector store.
   */
  update(vectorStoreId, body, options) {
    return this._client.post(`/vector_stores/${vectorStoreId}`, __spreadProps(__spreadValues({
      body
    }, options), {
      headers: __spreadValues({
        "OpenAI-Beta": "assistants=v2"
      }, options?.headers)
    }));
  }
  list(query = {}, options) {
    if (isRequestOptions(query)) {
      return this.list({}, query);
    }
    return this._client.getAPIList("/vector_stores", VectorStoresPage, __spreadProps(__spreadValues({
      query
    }, options), {
      headers: __spreadValues({
        "OpenAI-Beta": "assistants=v2"
      }, options?.headers)
    }));
  }
  /**
   * Delete a vector store.
   */
  del(vectorStoreId, options) {
    return this._client.delete(`/vector_stores/${vectorStoreId}`, __spreadProps(__spreadValues({}, options), {
      headers: __spreadValues({
        "OpenAI-Beta": "assistants=v2"
      }, options?.headers)
    }));
  }
};
var VectorStoresPage = class extends CursorPage {
};
VectorStores.VectorStoresPage = VectorStoresPage;
VectorStores.Files = Files;
VectorStores.VectorStoreFilesPage = VectorStoreFilesPage;
VectorStores.FileBatches = FileBatches;

// node_modules/openai/resources/beta/beta.mjs
var Beta = class extends APIResource {
  constructor() {
    super(...arguments);
    this.vectorStores = new VectorStores(this._client);
    this.chat = new Chat2(this._client);
    this.assistants = new Assistants(this._client);
    this.threads = new Threads(this._client);
  }
};
Beta.VectorStores = VectorStores;
Beta.VectorStoresPage = VectorStoresPage;
Beta.Assistants = Assistants;
Beta.AssistantsPage = AssistantsPage;
Beta.Threads = Threads;

// node_modules/openai/resources/completions.mjs
var Completions3 = class extends APIResource {
  create(body, options) {
    return this._client.post("/completions", __spreadProps(__spreadValues({
      body
    }, options), {
      stream: body.stream ?? false
    }));
  }
};

// node_modules/openai/resources/embeddings.mjs
var Embeddings = class extends APIResource {
  /**
   * Creates an embedding vector representing the input text.
   */
  create(body, options) {
    return this._client.post("/embeddings", __spreadValues({
      body
    }, options));
  }
};

// node_modules/openai/resources/files.mjs
var Files2 = class extends APIResource {
  /**
   * Upload a file that can be used across various endpoints. Individual files can be
   * up to 512 MB, and the size of all files uploaded by one organization can be up
   * to 100 GB.
   *
   * The Assistants API supports files up to 2 million tokens and of specific file
   * types. See the
   * [Assistants Tools guide](https://platform.openai.com/docs/assistants/tools) for
   * details.
   *
   * The Fine-tuning API only supports `.jsonl` files. The input also has certain
   * required formats for fine-tuning
   * [chat](https://platform.openai.com/docs/api-reference/fine-tuning/chat-input) or
   * [completions](https://platform.openai.com/docs/api-reference/fine-tuning/completions-input)
   * models.
   *
   * The Batch API only supports `.jsonl` files up to 200 MB in size. The input also
   * has a specific required
   * [format](https://platform.openai.com/docs/api-reference/batch/request-input).
   *
   * Please [contact us](https://help.openai.com/) if you need to increase these
   * storage limits.
   */
  create(body, options) {
    return this._client.post("/files", multipartFormRequestOptions(__spreadValues({
      body
    }, options)));
  }
  /**
   * Returns information about a specific file.
   */
  retrieve(fileId, options) {
    return this._client.get(`/files/${fileId}`, options);
  }
  list(query = {}, options) {
    if (isRequestOptions(query)) {
      return this.list({}, query);
    }
    return this._client.getAPIList("/files", FileObjectsPage, __spreadValues({
      query
    }, options));
  }
  /**
   * Delete a file.
   */
  del(fileId, options) {
    return this._client.delete(`/files/${fileId}`, options);
  }
  /**
   * Returns the contents of the specified file.
   */
  content(fileId, options) {
    return this._client.get(`/files/${fileId}/content`, __spreadProps(__spreadValues({}, options), {
      __binaryResponse: true
    }));
  }
  /**
   * Returns the contents of the specified file.
   *
   * @deprecated The `.content()` method should be used instead
   */
  retrieveContent(fileId, options) {
    return this._client.get(`/files/${fileId}/content`, __spreadProps(__spreadValues({}, options), {
      headers: __spreadValues({
        Accept: "application/json"
      }, options?.headers)
    }));
  }
  /**
   * Waits for the given file to be processed, default timeout is 30 mins.
   */
  waitForProcessing(_0) {
    return __async(this, arguments, function* (id, {
      pollInterval = 5e3,
      maxWait = 30 * 60 * 1e3
    } = {}) {
      const TERMINAL_STATES = /* @__PURE__ */ new Set(["processed", "error", "deleted"]);
      const start = Date.now();
      let file = yield this.retrieve(id);
      while (!file.status || !TERMINAL_STATES.has(file.status)) {
        yield sleep(pollInterval);
        file = yield this.retrieve(id);
        if (Date.now() - start > maxWait) {
          throw new APIConnectionTimeoutError({
            message: `Giving up on waiting for file ${id} to finish processing after ${maxWait} milliseconds.`
          });
        }
      }
      return file;
    });
  }
};
var FileObjectsPage = class extends CursorPage {
};
Files2.FileObjectsPage = FileObjectsPage;

// node_modules/openai/resources/fine-tuning/jobs/checkpoints.mjs
var Checkpoints = class extends APIResource {
  list(fineTuningJobId, query = {}, options) {
    if (isRequestOptions(query)) {
      return this.list(fineTuningJobId, {}, query);
    }
    return this._client.getAPIList(`/fine_tuning/jobs/${fineTuningJobId}/checkpoints`, FineTuningJobCheckpointsPage, __spreadValues({
      query
    }, options));
  }
};
var FineTuningJobCheckpointsPage = class extends CursorPage {
};
Checkpoints.FineTuningJobCheckpointsPage = FineTuningJobCheckpointsPage;

// node_modules/openai/resources/fine-tuning/jobs/jobs.mjs
var Jobs = class extends APIResource {
  constructor() {
    super(...arguments);
    this.checkpoints = new Checkpoints(this._client);
  }
  /**
   * Creates a fine-tuning job which begins the process of creating a new model from
   * a given dataset.
   *
   * Response includes details of the enqueued job including job status and the name
   * of the fine-tuned models once complete.
   *
   * [Learn more about fine-tuning](https://platform.openai.com/docs/guides/fine-tuning)
   */
  create(body, options) {
    return this._client.post("/fine_tuning/jobs", __spreadValues({
      body
    }, options));
  }
  /**
   * Get info about a fine-tuning job.
   *
   * [Learn more about fine-tuning](https://platform.openai.com/docs/guides/fine-tuning)
   */
  retrieve(fineTuningJobId, options) {
    return this._client.get(`/fine_tuning/jobs/${fineTuningJobId}`, options);
  }
  list(query = {}, options) {
    if (isRequestOptions(query)) {
      return this.list({}, query);
    }
    return this._client.getAPIList("/fine_tuning/jobs", FineTuningJobsPage, __spreadValues({
      query
    }, options));
  }
  /**
   * Immediately cancel a fine-tune job.
   */
  cancel(fineTuningJobId, options) {
    return this._client.post(`/fine_tuning/jobs/${fineTuningJobId}/cancel`, options);
  }
  listEvents(fineTuningJobId, query = {}, options) {
    if (isRequestOptions(query)) {
      return this.listEvents(fineTuningJobId, {}, query);
    }
    return this._client.getAPIList(`/fine_tuning/jobs/${fineTuningJobId}/events`, FineTuningJobEventsPage, __spreadValues({
      query
    }, options));
  }
};
var FineTuningJobsPage = class extends CursorPage {
};
var FineTuningJobEventsPage = class extends CursorPage {
};
Jobs.FineTuningJobsPage = FineTuningJobsPage;
Jobs.FineTuningJobEventsPage = FineTuningJobEventsPage;
Jobs.Checkpoints = Checkpoints;
Jobs.FineTuningJobCheckpointsPage = FineTuningJobCheckpointsPage;

// node_modules/openai/resources/fine-tuning/fine-tuning.mjs
var FineTuning = class extends APIResource {
  constructor() {
    super(...arguments);
    this.jobs = new Jobs(this._client);
  }
};
FineTuning.Jobs = Jobs;
FineTuning.FineTuningJobsPage = FineTuningJobsPage;
FineTuning.FineTuningJobEventsPage = FineTuningJobEventsPage;

// node_modules/openai/resources/images.mjs
var Images = class extends APIResource {
  /**
   * Creates a variation of a given image.
   */
  createVariation(body, options) {
    return this._client.post("/images/variations", multipartFormRequestOptions(__spreadValues({
      body
    }, options)));
  }
  /**
   * Creates an edited or extended image given an original image and a prompt.
   */
  edit(body, options) {
    return this._client.post("/images/edits", multipartFormRequestOptions(__spreadValues({
      body
    }, options)));
  }
  /**
   * Creates an image given a prompt.
   */
  generate(body, options) {
    return this._client.post("/images/generations", __spreadValues({
      body
    }, options));
  }
};

// node_modules/openai/resources/models.mjs
var Models = class extends APIResource {
  /**
   * Retrieves a model instance, providing basic information about the model such as
   * the owner and permissioning.
   */
  retrieve(model, options) {
    return this._client.get(`/models/${model}`, options);
  }
  /**
   * Lists the currently available models, and provides basic information about each
   * one such as the owner and availability.
   */
  list(options) {
    return this._client.getAPIList("/models", ModelsPage, options);
  }
  /**
   * Delete a fine-tuned model. You must have the Owner role in your organization to
   * delete a model.
   */
  del(model, options) {
    return this._client.delete(`/models/${model}`, options);
  }
};
var ModelsPage = class extends Page {
};
Models.ModelsPage = ModelsPage;

// node_modules/openai/resources/moderations.mjs
var Moderations = class extends APIResource {
  /**
   * Classifies if text and/or image inputs are potentially harmful. Learn more in
   * the [moderation guide](https://platform.openai.com/docs/guides/moderation).
   */
  create(body, options) {
    return this._client.post("/moderations", __spreadValues({
      body
    }, options));
  }
};

// node_modules/openai/resources/uploads/parts.mjs
var Parts = class extends APIResource {
  /**
   * Adds a
   * [Part](https://platform.openai.com/docs/api-reference/uploads/part-object) to an
   * [Upload](https://platform.openai.com/docs/api-reference/uploads/object) object.
   * A Part represents a chunk of bytes from the file you are trying to upload.
   *
   * Each Part can be at most 64 MB, and you can add Parts until you hit the Upload
   * maximum of 8 GB.
   *
   * It is possible to add multiple Parts in parallel. You can decide the intended
   * order of the Parts when you
   * [complete the Upload](https://platform.openai.com/docs/api-reference/uploads/complete).
   */
  create(uploadId, body, options) {
    return this._client.post(`/uploads/${uploadId}/parts`, multipartFormRequestOptions(__spreadValues({
      body
    }, options)));
  }
};

// node_modules/openai/resources/uploads/uploads.mjs
var Uploads = class extends APIResource {
  constructor() {
    super(...arguments);
    this.parts = new Parts(this._client);
  }
  /**
   * Creates an intermediate
   * [Upload](https://platform.openai.com/docs/api-reference/uploads/object) object
   * that you can add
   * [Parts](https://platform.openai.com/docs/api-reference/uploads/part-object) to.
   * Currently, an Upload can accept at most 8 GB in total and expires after an hour
   * after you create it.
   *
   * Once you complete the Upload, we will create a
   * [File](https://platform.openai.com/docs/api-reference/files/object) object that
   * contains all the parts you uploaded. This File is usable in the rest of our
   * platform as a regular File object.
   *
   * For certain `purpose`s, the correct `mime_type` must be specified. Please refer
   * to documentation for the supported MIME types for your use case:
   *
   * - [Assistants](https://platform.openai.com/docs/assistants/tools/file-search#supported-files)
   *
   * For guidance on the proper filename extensions for each purpose, please follow
   * the documentation on
   * [creating a File](https://platform.openai.com/docs/api-reference/files/create).
   */
  create(body, options) {
    return this._client.post("/uploads", __spreadValues({
      body
    }, options));
  }
  /**
   * Cancels the Upload. No Parts may be added after an Upload is cancelled.
   */
  cancel(uploadId, options) {
    return this._client.post(`/uploads/${uploadId}/cancel`, options);
  }
  /**
   * Completes the
   * [Upload](https://platform.openai.com/docs/api-reference/uploads/object).
   *
   * Within the returned Upload object, there is a nested
   * [File](https://platform.openai.com/docs/api-reference/files/object) object that
   * is ready to use in the rest of the platform.
   *
   * You can specify the order of the Parts by passing in an ordered list of the Part
   * IDs.
   *
   * The number of bytes uploaded upon completion must match the number of bytes
   * initially specified when creating the Upload object. No Parts may be added after
   * an Upload is completed.
   */
  complete(uploadId, body, options) {
    return this._client.post(`/uploads/${uploadId}/complete`, __spreadValues({
      body
    }, options));
  }
};
Uploads.Parts = Parts;

// node_modules/openai/index.mjs
var _a;
var OpenAI = class extends APIClient {
  /**
   * API Client for interfacing with the OpenAI API.
   *
   * @param {string | undefined} [opts.apiKey=process.env['OPENAI_API_KEY'] ?? undefined]
   * @param {string | null | undefined} [opts.organization=process.env['OPENAI_ORG_ID'] ?? null]
   * @param {string | null | undefined} [opts.project=process.env['OPENAI_PROJECT_ID'] ?? null]
   * @param {string} [opts.baseURL=process.env['OPENAI_BASE_URL'] ?? https://api.openai.com/v1] - Override the default base URL for the API.
   * @param {number} [opts.timeout=10 minutes] - The maximum amount of time (in milliseconds) the client will wait for a response before timing out.
   * @param {number} [opts.httpAgent] - An HTTP agent used to manage HTTP(s) connections.
   * @param {Core.Fetch} [opts.fetch] - Specify a custom `fetch` function implementation.
   * @param {number} [opts.maxRetries=2] - The maximum number of times the client will retry a request.
   * @param {Core.Headers} opts.defaultHeaders - Default headers to include with every request to the API.
   * @param {Core.DefaultQuery} opts.defaultQuery - Default query parameters to include with every request to the API.
   * @param {boolean} [opts.dangerouslyAllowBrowser=false] - By default, client-side use of this library is not allowed, as it risks exposing your secret API credentials to attackers.
   */
  constructor(_a2 = {}) {
    var _b = _a2, {
      baseURL = readEnv("OPENAI_BASE_URL"),
      apiKey = readEnv("OPENAI_API_KEY"),
      organization = readEnv("OPENAI_ORG_ID") ?? null,
      project = readEnv("OPENAI_PROJECT_ID") ?? null
    } = _b, opts = __objRest(_b, [
      "baseURL",
      "apiKey",
      "organization",
      "project"
    ]);
    if (apiKey === void 0) {
      throw new OpenAIError("The OPENAI_API_KEY environment variable is missing or empty; either provide it, or instantiate the OpenAI client with an apiKey option, like new OpenAI({ apiKey: 'My API Key' }).");
    }
    const options = __spreadProps(__spreadValues({
      apiKey,
      organization,
      project
    }, opts), {
      baseURL: baseURL || `https://api.openai.com/v1`
    });
    if (!options.dangerouslyAllowBrowser && isRunningInBrowser()) {
      throw new OpenAIError("It looks like you're running in a browser-like environment.\n\nThis is disabled by default, as it risks exposing your secret API credentials to attackers.\nIf you understand the risks and have appropriate mitigations in place,\nyou can set the `dangerouslyAllowBrowser` option to `true`, e.g.,\n\nnew OpenAI({ apiKey, dangerouslyAllowBrowser: true });\n\nhttps://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety\n");
    }
    super({
      baseURL: options.baseURL,
      timeout: options.timeout ?? 6e5,
      httpAgent: options.httpAgent,
      maxRetries: options.maxRetries,
      fetch: options.fetch
    });
    this.completions = new Completions3(this);
    this.chat = new Chat(this);
    this.embeddings = new Embeddings(this);
    this.files = new Files2(this);
    this.images = new Images(this);
    this.audio = new Audio(this);
    this.moderations = new Moderations(this);
    this.models = new Models(this);
    this.fineTuning = new FineTuning(this);
    this.beta = new Beta(this);
    this.batches = new Batches(this);
    this.uploads = new Uploads(this);
    this._options = options;
    this.apiKey = apiKey;
    this.organization = organization;
    this.project = project;
  }
  defaultQuery() {
    return this._options.defaultQuery;
  }
  defaultHeaders(opts) {
    return __spreadValues(__spreadProps(__spreadValues({}, super.defaultHeaders(opts)), {
      "OpenAI-Organization": this.organization,
      "OpenAI-Project": this.project
    }), this._options.defaultHeaders);
  }
  authHeaders(opts) {
    return {
      Authorization: `Bearer ${this.apiKey}`
    };
  }
  stringifyQuery(query) {
    return stringify(query, {
      arrayFormat: "brackets"
    });
  }
};
_a = OpenAI;
OpenAI.OpenAI = _a;
OpenAI.DEFAULT_TIMEOUT = 6e5;
OpenAI.OpenAIError = OpenAIError;
OpenAI.APIError = APIError;
OpenAI.APIConnectionError = APIConnectionError;
OpenAI.APIConnectionTimeoutError = APIConnectionTimeoutError;
OpenAI.APIUserAbortError = APIUserAbortError;
OpenAI.NotFoundError = NotFoundError;
OpenAI.ConflictError = ConflictError;
OpenAI.RateLimitError = RateLimitError;
OpenAI.BadRequestError = BadRequestError;
OpenAI.AuthenticationError = AuthenticationError;
OpenAI.InternalServerError = InternalServerError;
OpenAI.PermissionDeniedError = PermissionDeniedError;
OpenAI.UnprocessableEntityError = UnprocessableEntityError;
OpenAI.toFile = toFile;
OpenAI.fileFromPath = fileFromPath;
OpenAI.Completions = Completions3;
OpenAI.Chat = Chat;
OpenAI.Embeddings = Embeddings;
OpenAI.Files = Files2;
OpenAI.FileObjectsPage = FileObjectsPage;
OpenAI.Images = Images;
OpenAI.Audio = Audio;
OpenAI.Moderations = Moderations;
OpenAI.Models = Models;
OpenAI.ModelsPage = ModelsPage;
OpenAI.FineTuning = FineTuning;
OpenAI.Beta = Beta;
OpenAI.Batches = Batches;
OpenAI.BatchesPage = BatchesPage;
OpenAI.Uploads = Uploads;
var AzureOpenAI = class _AzureOpenAI extends OpenAI {
  /**
   * API Client for interfacing with the Azure OpenAI API.
   *
   * @param {string | undefined} [opts.apiVersion=process.env['OPENAI_API_VERSION'] ?? undefined]
   * @param {string | undefined} [opts.endpoint=process.env['AZURE_OPENAI_ENDPOINT'] ?? undefined] - Your Azure endpoint, including the resource, e.g. `https://example-resource.azure.openai.com/`
   * @param {string | undefined} [opts.apiKey=process.env['AZURE_OPENAI_API_KEY'] ?? undefined]
   * @param {string | undefined} opts.deployment - A model deployment, if given, sets the base client URL to include `/deployments/{deployment}`.
   * @param {string | null | undefined} [opts.organization=process.env['OPENAI_ORG_ID'] ?? null]
   * @param {string} [opts.baseURL=process.env['OPENAI_BASE_URL']] - Sets the base URL for the API, e.g. `https://example-resource.azure.openai.com/openai/`.
   * @param {number} [opts.timeout=10 minutes] - The maximum amount of time (in milliseconds) the client will wait for a response before timing out.
   * @param {number} [opts.httpAgent] - An HTTP agent used to manage HTTP(s) connections.
   * @param {Core.Fetch} [opts.fetch] - Specify a custom `fetch` function implementation.
   * @param {number} [opts.maxRetries=2] - The maximum number of times the client will retry a request.
   * @param {Core.Headers} opts.defaultHeaders - Default headers to include with every request to the API.
   * @param {Core.DefaultQuery} opts.defaultQuery - Default query parameters to include with every request to the API.
   * @param {boolean} [opts.dangerouslyAllowBrowser=false] - By default, client-side use of this library is not allowed, as it risks exposing your secret API credentials to attackers.
   */
  constructor(_a2 = {}) {
    var _b = _a2, {
      baseURL = readEnv("OPENAI_BASE_URL"),
      apiKey = readEnv("AZURE_OPENAI_API_KEY"),
      apiVersion = readEnv("OPENAI_API_VERSION"),
      endpoint,
      deployment,
      azureADTokenProvider,
      dangerouslyAllowBrowser
    } = _b, opts = __objRest(_b, [
      "baseURL",
      "apiKey",
      "apiVersion",
      "endpoint",
      "deployment",
      "azureADTokenProvider",
      "dangerouslyAllowBrowser"
    ]);
    if (!apiVersion) {
      throw new OpenAIError("The OPENAI_API_VERSION environment variable is missing or empty; either provide it, or instantiate the AzureOpenAI client with an apiVersion option, like new AzureOpenAI({ apiVersion: 'My API Version' }).");
    }
    if (typeof azureADTokenProvider === "function") {
      dangerouslyAllowBrowser = true;
    }
    if (!azureADTokenProvider && !apiKey) {
      throw new OpenAIError("Missing credentials. Please pass one of `apiKey` and `azureADTokenProvider`, or set the `AZURE_OPENAI_API_KEY` environment variable.");
    }
    if (azureADTokenProvider && apiKey) {
      throw new OpenAIError("The `apiKey` and `azureADTokenProvider` arguments are mutually exclusive; only one can be passed at a time.");
    }
    apiKey ?? (apiKey = API_KEY_SENTINEL);
    opts.defaultQuery = __spreadProps(__spreadValues({}, opts.defaultQuery), {
      "api-version": apiVersion
    });
    if (!baseURL) {
      if (!endpoint) {
        endpoint = process.env["AZURE_OPENAI_ENDPOINT"];
      }
      if (!endpoint) {
        throw new OpenAIError("Must provide one of the `baseURL` or `endpoint` arguments, or the `AZURE_OPENAI_ENDPOINT` environment variable");
      }
      baseURL = `${endpoint}/openai`;
    } else {
      if (endpoint) {
        throw new OpenAIError("baseURL and endpoint are mutually exclusive");
      }
    }
    super(__spreadValues(__spreadValues({
      apiKey,
      baseURL
    }, opts), dangerouslyAllowBrowser !== void 0 ? {
      dangerouslyAllowBrowser
    } : {}));
    this.apiVersion = "";
    this._azureADTokenProvider = azureADTokenProvider;
    this.apiVersion = apiVersion;
    this._deployment = deployment;
  }
  buildRequest(options) {
    if (_deployments_endpoints.has(options.path) && options.method === "post" && options.body !== void 0) {
      if (!isObj(options.body)) {
        throw new Error("Expected request body to be an object");
      }
      const model = this._deployment || options.body["model"];
      if (model !== void 0 && !this.baseURL.includes("/deployments")) {
        options.path = `/deployments/${model}${options.path}`;
      }
    }
    return super.buildRequest(options);
  }
  _getAzureADToken() {
    return __async(this, null, function* () {
      if (typeof this._azureADTokenProvider === "function") {
        const token = yield this._azureADTokenProvider();
        if (!token || typeof token !== "string") {
          throw new OpenAIError(`Expected 'azureADTokenProvider' argument to return a string but it returned ${token}`);
        }
        return token;
      }
      return void 0;
    });
  }
  authHeaders(opts) {
    return {};
  }
  prepareOptions(opts) {
    return __async(this, null, function* () {
      if (opts.headers?.["api-key"]) {
        return __superGet(_AzureOpenAI.prototype, this, "prepareOptions").call(this, opts);
      }
      const token = yield this._getAzureADToken();
      opts.headers ?? (opts.headers = {});
      if (token) {
        opts.headers["Authorization"] = `Bearer ${token}`;
      } else if (this.apiKey !== API_KEY_SENTINEL) {
        opts.headers["api-key"] = this.apiKey;
      } else {
        throw new OpenAIError("Unable to handle auth");
      }
      return __superGet(_AzureOpenAI.prototype, this, "prepareOptions").call(this, opts);
    });
  }
};
var _deployments_endpoints = /* @__PURE__ */ new Set(["/completions", "/chat/completions", "/embeddings", "/audio/transcriptions", "/audio/translations", "/audio/speech", "/images/generations"]);
var API_KEY_SENTINEL = "<Missing Key>";

// node_modules/@langchain/core/dist/utils/types/is_zod_schema.js
function isZodSchema(input) {
  return typeof input?.parse === "function";
}

// node_modules/@langchain/core/dist/language_models/chat_models.js
var BaseChatModel = class _BaseChatModel extends BaseLanguageModel {
  constructor(fields) {
    super(fields);
    Object.defineProperty(this, "lc_namespace", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: ["langchain", "chat_models", this._llmType()]
    });
  }
  _separateRunnableConfigFromCallOptionsCompat(options) {
    const [runnableConfig, callOptions] = super._separateRunnableConfigFromCallOptions(options);
    callOptions.signal = runnableConfig.signal;
    return [runnableConfig, callOptions];
  }
  /**
   * Invokes the chat model with a single input.
   * @param input The input for the language model.
   * @param options The call options.
   * @returns A Promise that resolves to a BaseMessageChunk.
   */
  invoke(input, options) {
    return __async(this, null, function* () {
      const promptValue = _BaseChatModel._convertInputToPromptValue(input);
      const result = yield this.generatePrompt([promptValue], options, options?.callbacks);
      const chatGeneration = result.generations[0][0];
      return chatGeneration.message;
    });
  }
  // eslint-disable-next-line require-yield
  _streamResponseChunks(_messages, _options, _runManager) {
    return __asyncGenerator(this, null, function* () {
      throw new Error("Not implemented.");
    });
  }
  _streamIterator(input, options) {
    return __asyncGenerator(this, null, function* () {
      if (this._streamResponseChunks === _BaseChatModel.prototype._streamResponseChunks) {
        yield this.invoke(input, options);
      } else {
        const prompt = _BaseChatModel._convertInputToPromptValue(input);
        const messages = prompt.toChatMessages();
        const [runnableConfig, callOptions] = this._separateRunnableConfigFromCallOptionsCompat(options);
        const inheritableMetadata = __spreadValues(__spreadValues({}, runnableConfig.metadata), this.getLsParams(callOptions));
        const callbackManager_ = yield new __await(CallbackManager.configure(runnableConfig.callbacks, this.callbacks, runnableConfig.tags, this.tags, inheritableMetadata, this.metadata, {
          verbose: this.verbose
        }));
        const extra = {
          options: callOptions,
          invocation_params: this?.invocationParams(callOptions),
          batch_size: 1
        };
        const runManagers = yield new __await(callbackManager_?.handleChatModelStart(this.toJSON(), [messages], runnableConfig.runId, void 0, extra, void 0, void 0, runnableConfig.runName));
        let generationChunk;
        let llmOutput;
        try {
          try {
            for (var iter = __forAwait(this._streamResponseChunks(messages, callOptions, runManagers?.[0])), more, temp, error; more = !(temp = yield new __await(iter.next())).done; more = false) {
              const chunk = temp.value;
              if (chunk.message.id == null) {
                const runId = runManagers?.at(0)?.runId;
                if (runId != null) chunk.message._updateId(`run-${runId}`);
              }
              chunk.message.response_metadata = __spreadValues(__spreadValues({}, chunk.generationInfo), chunk.message.response_metadata);
              yield chunk.message;
              if (!generationChunk) {
                generationChunk = chunk;
              } else {
                generationChunk = generationChunk.concat(chunk);
              }
              if (isAIMessageChunk(chunk.message) && chunk.message.usage_metadata !== void 0) {
                llmOutput = {
                  tokenUsage: {
                    promptTokens: chunk.message.usage_metadata.input_tokens,
                    completionTokens: chunk.message.usage_metadata.output_tokens,
                    totalTokens: chunk.message.usage_metadata.total_tokens
                  }
                };
              }
            }
          } catch (temp) {
            error = [temp];
          } finally {
            try {
              more && (temp = iter.return) && (yield new __await(temp.call(iter)));
            } finally {
              if (error)
                throw error[0];
            }
          }
        } catch (err) {
          yield new __await(Promise.all((runManagers ?? []).map((runManager) => runManager?.handleLLMError(err))));
          throw err;
        }
        yield new __await(Promise.all((runManagers ?? []).map((runManager) => runManager?.handleLLMEnd({
          // TODO: Remove cast after figuring out inheritance
          generations: [[generationChunk]],
          llmOutput
        }))));
      }
    });
  }
  getLsParams(options) {
    const providerName = this.getName().startsWith("Chat") ? this.getName().replace("Chat", "") : this.getName();
    return {
      ls_model_type: "chat",
      ls_stop: options.stop,
      ls_provider: providerName
    };
  }
  /** @ignore */
  _generateUncached(messages, parsedOptions, handledOptions) {
    return __async(this, null, function* () {
      const baseMessages = messages.map((messageList) => messageList.map(coerceMessageLikeToMessage));
      const inheritableMetadata = __spreadValues(__spreadValues({}, handledOptions.metadata), this.getLsParams(parsedOptions));
      const callbackManager_ = yield CallbackManager.configure(handledOptions.callbacks, this.callbacks, handledOptions.tags, this.tags, inheritableMetadata, this.metadata, {
        verbose: this.verbose
      });
      const extra = {
        options: parsedOptions,
        invocation_params: this?.invocationParams(parsedOptions),
        batch_size: 1
      };
      const runManagers = yield callbackManager_?.handleChatModelStart(this.toJSON(), baseMessages, handledOptions.runId, void 0, extra, void 0, void 0, handledOptions.runName);
      const generations = [];
      const llmOutputs = [];
      const hasStreamingHandler = !!runManagers?.[0].handlers.find((handler) => {
        return isStreamEventsHandler(handler) || isLogStreamHandler(handler);
      });
      if (hasStreamingHandler && baseMessages.length === 1 && this._streamResponseChunks !== _BaseChatModel.prototype._streamResponseChunks) {
        try {
          const stream = yield this._streamResponseChunks(baseMessages[0], parsedOptions, runManagers?.[0]);
          let aggregated;
          let llmOutput;
          try {
            for (var iter = __forAwait(stream), more, temp, error; more = !(temp = yield iter.next()).done; more = false) {
              const chunk = temp.value;
              if (chunk.message.id == null) {
                const runId = runManagers?.at(0)?.runId;
                if (runId != null) chunk.message._updateId(`run-${runId}`);
              }
              if (aggregated === void 0) {
                aggregated = chunk;
              } else {
                aggregated = concat(aggregated, chunk);
              }
              if (isAIMessageChunk(chunk.message) && chunk.message.usage_metadata !== void 0) {
                llmOutput = {
                  tokenUsage: {
                    promptTokens: chunk.message.usage_metadata.input_tokens,
                    completionTokens: chunk.message.usage_metadata.output_tokens,
                    totalTokens: chunk.message.usage_metadata.total_tokens
                  }
                };
              }
            }
          } catch (temp) {
            error = [temp];
          } finally {
            try {
              more && (temp = iter.return) && (yield temp.call(iter));
            } finally {
              if (error)
                throw error[0];
            }
          }
          if (aggregated === void 0) {
            throw new Error("Received empty response from chat model call.");
          }
          generations.push([aggregated]);
          yield runManagers?.[0].handleLLMEnd({
            generations,
            llmOutput
          });
        } catch (e) {
          yield runManagers?.[0].handleLLMError(e);
          throw e;
        }
      } else {
        const results = yield Promise.allSettled(baseMessages.map((messageList, i) => this._generate(messageList, __spreadProps(__spreadValues({}, parsedOptions), {
          promptIndex: i
        }), runManagers?.[i])));
        yield Promise.all(results.map((pResult, i) => __async(this, null, function* () {
          if (pResult.status === "fulfilled") {
            const result = pResult.value;
            for (const generation of result.generations) {
              if (generation.message.id == null) {
                const runId = runManagers?.at(0)?.runId;
                if (runId != null) generation.message._updateId(`run-${runId}`);
              }
              generation.message.response_metadata = __spreadValues(__spreadValues({}, generation.generationInfo), generation.message.response_metadata);
            }
            if (result.generations.length === 1) {
              result.generations[0].message.response_metadata = __spreadValues(__spreadValues({}, result.llmOutput), result.generations[0].message.response_metadata);
            }
            generations[i] = result.generations;
            llmOutputs[i] = result.llmOutput;
            return runManagers?.[i]?.handleLLMEnd({
              generations: [result.generations],
              llmOutput: result.llmOutput
            });
          } else {
            yield runManagers?.[i]?.handleLLMError(pResult.reason);
            return Promise.reject(pResult.reason);
          }
        })));
      }
      const output = {
        generations,
        llmOutput: llmOutputs.length ? this._combineLLMOutput?.(...llmOutputs) : void 0
      };
      Object.defineProperty(output, RUN_KEY, {
        value: runManagers ? {
          runIds: runManagers?.map((manager) => manager.runId)
        } : void 0,
        configurable: true
      });
      return output;
    });
  }
  _generateCached(_0) {
    return __async(this, arguments, function* ({
      messages,
      cache,
      llmStringKey,
      parsedOptions,
      handledOptions
    }) {
      const baseMessages = messages.map((messageList) => messageList.map(coerceMessageLikeToMessage));
      const inheritableMetadata = __spreadValues(__spreadValues({}, handledOptions.metadata), this.getLsParams(parsedOptions));
      const callbackManager_ = yield CallbackManager.configure(handledOptions.callbacks, this.callbacks, handledOptions.tags, this.tags, inheritableMetadata, this.metadata, {
        verbose: this.verbose
      });
      const extra = {
        options: parsedOptions,
        invocation_params: this?.invocationParams(parsedOptions),
        batch_size: 1,
        cached: true
      };
      const runManagers = yield callbackManager_?.handleChatModelStart(this.toJSON(), baseMessages, handledOptions.runId, void 0, extra, void 0, void 0, handledOptions.runName);
      const missingPromptIndices = [];
      const results = yield Promise.allSettled(baseMessages.map((baseMessage, index) => __async(this, null, function* () {
        const prompt = _BaseChatModel._convertInputToPromptValue(baseMessage).toString();
        const result = yield cache.lookup(prompt, llmStringKey);
        if (result == null) {
          missingPromptIndices.push(index);
        }
        return result;
      })));
      const cachedResults = results.map((result, index) => ({
        result,
        runManager: runManagers?.[index]
      })).filter(({
        result
      }) => result.status === "fulfilled" && result.value != null || result.status === "rejected");
      const generations = [];
      yield Promise.all(cachedResults.map((_02, _1) => __async(this, [_02, _1], function* ({
        result: promiseResult,
        runManager
      }, i) {
        if (promiseResult.status === "fulfilled") {
          const result = promiseResult.value;
          generations[i] = result;
          if (result.length) {
            yield runManager?.handleLLMNewToken(result[0].text);
          }
          return runManager?.handleLLMEnd({
            generations: [result]
          });
        } else {
          yield runManager?.handleLLMError(promiseResult.reason);
          return Promise.reject(promiseResult.reason);
        }
      })));
      const output = {
        generations,
        missingPromptIndices
      };
      Object.defineProperty(output, RUN_KEY, {
        value: runManagers ? {
          runIds: runManagers?.map((manager) => manager.runId)
        } : void 0,
        configurable: true
      });
      return output;
    });
  }
  /**
   * Generates chat based on the input messages.
   * @param messages An array of arrays of BaseMessage instances.
   * @param options The call options or an array of stop sequences.
   * @param callbacks The callbacks for the language model.
   * @returns A Promise that resolves to an LLMResult.
   */
  generate(messages, options, callbacks) {
    return __async(this, null, function* () {
      let parsedOptions;
      if (Array.isArray(options)) {
        parsedOptions = {
          stop: options
        };
      } else {
        parsedOptions = options;
      }
      const baseMessages = messages.map((messageList) => messageList.map(coerceMessageLikeToMessage));
      const [runnableConfig, callOptions] = this._separateRunnableConfigFromCallOptionsCompat(parsedOptions);
      runnableConfig.callbacks = runnableConfig.callbacks ?? callbacks;
      if (!this.cache) {
        return this._generateUncached(baseMessages, callOptions, runnableConfig);
      }
      const {
        cache
      } = this;
      const llmStringKey = this._getSerializedCacheKeyParametersForCall(callOptions);
      const {
        generations,
        missingPromptIndices
      } = yield this._generateCached({
        messages: baseMessages,
        cache,
        llmStringKey,
        parsedOptions: callOptions,
        handledOptions: runnableConfig
      });
      let llmOutput = {};
      if (missingPromptIndices.length > 0) {
        const results = yield this._generateUncached(missingPromptIndices.map((i) => baseMessages[i]), callOptions, runnableConfig);
        yield Promise.all(results.generations.map((generation, index) => __async(this, null, function* () {
          const promptIndex = missingPromptIndices[index];
          generations[promptIndex] = generation;
          const prompt = _BaseChatModel._convertInputToPromptValue(baseMessages[promptIndex]).toString();
          return cache.update(prompt, llmStringKey, generation);
        })));
        llmOutput = results.llmOutput ?? {};
      }
      return {
        generations,
        llmOutput
      };
    });
  }
  /**
   * Get the parameters used to invoke the model
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  invocationParams(_options) {
    return {};
  }
  _modelType() {
    return "base_chat_model";
  }
  /**
   * @deprecated
   * Return a json-like object representing this LLM.
   */
  serialize() {
    return __spreadProps(__spreadValues({}, this.invocationParams()), {
      _type: this._llmType(),
      _model: this._modelType()
    });
  }
  /**
   * Generates a prompt based on the input prompt values.
   * @param promptValues An array of BasePromptValue instances.
   * @param options The call options or an array of stop sequences.
   * @param callbacks The callbacks for the language model.
   * @returns A Promise that resolves to an LLMResult.
   */
  generatePrompt(promptValues, options, callbacks) {
    return __async(this, null, function* () {
      const promptMessages = promptValues.map((promptValue) => promptValue.toChatMessages());
      return this.generate(promptMessages, options, callbacks);
    });
  }
  /**
   * @deprecated Use .invoke() instead. Will be removed in 0.2.0.
   *
   * Makes a single call to the chat model.
   * @param messages An array of BaseMessage instances.
   * @param options The call options or an array of stop sequences.
   * @param callbacks The callbacks for the language model.
   * @returns A Promise that resolves to a BaseMessage.
   */
  call(messages, options, callbacks) {
    return __async(this, null, function* () {
      const result = yield this.generate([messages.map(coerceMessageLikeToMessage)], options, callbacks);
      const generations = result.generations;
      return generations[0][0].message;
    });
  }
  /**
   * @deprecated Use .invoke() instead. Will be removed in 0.2.0.
   *
   * Makes a single call to the chat model with a prompt value.
   * @param promptValue The value of the prompt.
   * @param options The call options or an array of stop sequences.
   * @param callbacks The callbacks for the language model.
   * @returns A Promise that resolves to a BaseMessage.
   */
  callPrompt(promptValue, options, callbacks) {
    return __async(this, null, function* () {
      const promptMessages = promptValue.toChatMessages();
      return this.call(promptMessages, options, callbacks);
    });
  }
  /**
   * @deprecated Use .invoke() instead. Will be removed in 0.2.0.
   *
   * Predicts the next message based on the input messages.
   * @param messages An array of BaseMessage instances.
   * @param options The call options or an array of stop sequences.
   * @param callbacks The callbacks for the language model.
   * @returns A Promise that resolves to a BaseMessage.
   */
  predictMessages(messages, options, callbacks) {
    return __async(this, null, function* () {
      return this.call(messages, options, callbacks);
    });
  }
  /**
   * @deprecated Use .invoke() instead. Will be removed in 0.2.0.
   *
   * Predicts the next message based on a text input.
   * @param text The text input.
   * @param options The call options or an array of stop sequences.
   * @param callbacks The callbacks for the language model.
   * @returns A Promise that resolves to a string.
   */
  predict(text, options, callbacks) {
    return __async(this, null, function* () {
      const message = new HumanMessage(text);
      const result = yield this.call([message], options, callbacks);
      if (typeof result.content !== "string") {
        throw new Error("Cannot use predict when output is not a string.");
      }
      return result.content;
    });
  }
  withStructuredOutput(outputSchema, config) {
    if (typeof this.bindTools !== "function") {
      throw new Error(`Chat model must implement ".bindTools()" to use withStructuredOutput.`);
    }
    if (config?.strict) {
      throw new Error(`"strict" mode is not supported for this model by default.`);
    }
    const schema = outputSchema;
    const name = config?.name;
    const description = schema.description ?? "A function available to call.";
    const method = config?.method;
    const includeRaw = config?.includeRaw;
    if (method === "jsonMode") {
      throw new Error(`Base withStructuredOutput implementation only supports "functionCalling" as a method.`);
    }
    let functionName = name ?? "extract";
    let tools;
    if (isZodSchema(schema)) {
      tools = [{
        type: "function",
        function: {
          name: functionName,
          description,
          parameters: zodToJsonSchema(schema)
        }
      }];
    } else {
      if ("name" in schema) {
        functionName = schema.name;
      }
      tools = [{
        type: "function",
        function: {
          name: functionName,
          description,
          parameters: schema
        }
      }];
    }
    const llm = this.bindTools(tools);
    const outputParser = RunnableLambda.from((input) => {
      if (!input.tool_calls || input.tool_calls.length === 0) {
        throw new Error("No tool calls found in the response.");
      }
      const toolCall = input.tool_calls.find((tc) => tc.name === functionName);
      if (!toolCall) {
        throw new Error(`No tool call found with name ${functionName}.`);
      }
      return toolCall.args;
    });
    if (!includeRaw) {
      return llm.pipe(outputParser).withConfig({
        runName: "StructuredOutput"
      });
    }
    const parserAssign = RunnablePassthrough.assign({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      parsed: (input, config2) => outputParser.invoke(input.raw, config2)
    });
    const parserNone = RunnablePassthrough.assign({
      parsed: () => null
    });
    const parsedWithFallback = parserAssign.withFallbacks({
      fallbacks: [parserNone]
    });
    return RunnableSequence.from([{
      raw: llm
    }, parsedWithFallback]).withConfig({
      runName: "StructuredOutputRunnable"
    });
  }
};

// node_modules/@langchain/core/dist/output_parsers/openai_tools/json_output_tools_parsers.js
function parseToolCall2(rawToolCall, options) {
  if (rawToolCall.function === void 0) {
    return void 0;
  }
  let functionArgs;
  if (options?.partial) {
    try {
      functionArgs = parsePartialJson(rawToolCall.function.arguments ?? "{}");
    } catch (e) {
      return void 0;
    }
  } else {
    try {
      functionArgs = JSON.parse(rawToolCall.function.arguments);
    } catch (e) {
      throw new OutputParserException([`Function "${rawToolCall.function.name}" arguments:`, ``, rawToolCall.function.arguments, ``, `are not valid JSON.`, `Error: ${e.message}`].join("\n"));
    }
  }
  const parsedToolCall = {
    name: rawToolCall.function.name,
    args: functionArgs,
    type: "tool_call"
  };
  if (options?.returnId) {
    parsedToolCall.id = rawToolCall.id;
  }
  return parsedToolCall;
}
function convertLangChainToolCallToOpenAI(toolCall) {
  if (toolCall.id === void 0) {
    throw new Error(`All OpenAI tool calls must have an "id" field.`);
  }
  return {
    id: toolCall.id,
    type: "function",
    function: {
      name: toolCall.name,
      arguments: JSON.stringify(toolCall.args)
    }
  };
}
function makeInvalidToolCall(rawToolCall, errorMsg) {
  return {
    name: rawToolCall.function?.name,
    args: rawToolCall.function?.arguments,
    id: rawToolCall.id,
    error: errorMsg,
    type: "invalid_tool_call"
  };
}
var JsonOutputToolsParser = class extends BaseCumulativeTransformOutputParser {
  static lc_name() {
    return "JsonOutputToolsParser";
  }
  constructor(fields) {
    super(fields);
    Object.defineProperty(this, "returnId", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: false
    });
    Object.defineProperty(this, "lc_namespace", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: ["langchain", "output_parsers", "openai_tools"]
    });
    Object.defineProperty(this, "lc_serializable", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: true
    });
    this.returnId = fields?.returnId ?? this.returnId;
  }
  _diff() {
    throw new Error("Not supported.");
  }
  parse() {
    return __async(this, null, function* () {
      throw new Error("Not implemented.");
    });
  }
  parseResult(generations) {
    return __async(this, null, function* () {
      const result = yield this.parsePartialResult(generations, false);
      return result;
    });
  }
  /**
   * Parses the output and returns a JSON object. If `argsOnly` is true,
   * only the arguments of the function call are returned.
   * @param generations The output of the LLM to parse.
   * @returns A JSON object representation of the function call or its arguments.
   */
  parsePartialResult(generations, partial = true) {
    return __async(this, null, function* () {
      const message = generations[0].message;
      let toolCalls;
      if (isAIMessage(message) && message.tool_calls?.length) {
        toolCalls = message.tool_calls.map((toolCall) => {
          const _a2 = toolCall, {
            id
          } = _a2, rest = __objRest(_a2, [
            "id"
          ]);
          if (!this.returnId) {
            return rest;
          }
          return __spreadValues({
            id
          }, rest);
        });
      } else if (message.additional_kwargs.tool_calls !== void 0) {
        const rawToolCalls = JSON.parse(JSON.stringify(message.additional_kwargs.tool_calls));
        toolCalls = rawToolCalls.map((rawToolCall) => {
          return parseToolCall2(rawToolCall, {
            returnId: this.returnId,
            partial
          });
        });
      }
      if (!toolCalls) {
        return [];
      }
      const parsedToolCalls = [];
      for (const toolCall of toolCalls) {
        if (toolCall !== void 0) {
          const backwardsCompatibleToolCall = {
            type: toolCall.name,
            args: toolCall.args,
            id: toolCall.id
          };
          parsedToolCalls.push(backwardsCompatibleToolCall);
        }
      }
      return parsedToolCalls;
    });
  }
};
var JsonOutputKeyToolsParser = class _JsonOutputKeyToolsParser extends JsonOutputToolsParser {
  static lc_name() {
    return "JsonOutputKeyToolsParser";
  }
  constructor(params) {
    super(params);
    Object.defineProperty(this, "lc_namespace", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: ["langchain", "output_parsers", "openai_tools"]
    });
    Object.defineProperty(this, "lc_serializable", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: true
    });
    Object.defineProperty(this, "returnId", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: false
    });
    Object.defineProperty(this, "keyName", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "returnSingle", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: false
    });
    Object.defineProperty(this, "zodSchema", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.keyName = params.keyName;
    this.returnSingle = params.returnSingle ?? this.returnSingle;
    this.zodSchema = params.zodSchema;
  }
  _validateResult(result) {
    return __async(this, null, function* () {
      if (this.zodSchema === void 0) {
        return result;
      }
      const zodParsedResult = yield this.zodSchema.safeParseAsync(result);
      if (zodParsedResult.success) {
        return zodParsedResult.data;
      } else {
        throw new OutputParserException(`Failed to parse. Text: "${JSON.stringify(result, null, 2)}". Error: ${JSON.stringify(zodParsedResult.error.errors)}`, JSON.stringify(result, null, 2));
      }
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parsePartialResult(generations) {
    return __async(this, null, function* () {
      const results = yield __superGet(_JsonOutputKeyToolsParser.prototype, this, "parsePartialResult").call(this, generations);
      const matchingResults = results.filter((result) => result.type === this.keyName);
      let returnedValues = matchingResults;
      if (!matchingResults.length) {
        return void 0;
      }
      if (!this.returnId) {
        returnedValues = matchingResults.map((result) => result.args);
      }
      if (this.returnSingle) {
        return returnedValues[0];
      }
      return returnedValues;
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parseResult(generations) {
    return __async(this, null, function* () {
      const results = yield __superGet(_JsonOutputKeyToolsParser.prototype, this, "parsePartialResult").call(this, generations, false);
      const matchingResults = results.filter((result) => result.type === this.keyName);
      let returnedValues = matchingResults;
      if (!matchingResults.length) {
        return void 0;
      }
      if (!this.returnId) {
        returnedValues = matchingResults.map((result) => result.args);
      }
      if (this.returnSingle) {
        return this._validateResult(returnedValues[0]);
      }
      const toolCallResults = yield Promise.all(returnedValues.map((value) => this._validateResult(value)));
      return toolCallResults;
    });
  }
};

// node_modules/openai/_vendor/zod-to-json-schema/Options.mjs
var ignoreOverride = Symbol("Let zodToJsonSchema decide on which parser to use");
var defaultOptions = {
  name: void 0,
  $refStrategy: "root",
  effectStrategy: "input",
  pipeStrategy: "all",
  dateStrategy: "format:date-time",
  mapStrategy: "entries",
  nullableStrategy: "from-target",
  removeAdditionalStrategy: "passthrough",
  definitionPath: "definitions",
  target: "jsonSchema7",
  strictUnions: false,
  errorMessages: false,
  markdownDescription: false,
  patternStrategy: "escape",
  applyRegexFlags: false,
  emailStrategy: "format:email",
  base64Strategy: "contentEncoding:base64",
  nameStrategy: "ref"
};
var getDefaultOptions = (options) => {
  return typeof options === "string" ? __spreadProps(__spreadValues({}, defaultOptions), {
    basePath: ["#"],
    definitions: {},
    name: options
  }) : __spreadValues(__spreadProps(__spreadValues({}, defaultOptions), {
    basePath: ["#"],
    definitions: {}
  }), options);
};

// node_modules/openai/_vendor/zod-to-json-schema/util.mjs
var zodDef = (zodSchema) => {
  return "_def" in zodSchema ? zodSchema._def : zodSchema;
};
function isEmptyObj2(obj) {
  if (!obj) return true;
  for (const _k in obj) return false;
  return true;
}

// node_modules/openai/_vendor/zod-to-json-schema/Refs.mjs
var getRefs = (options) => {
  const _options = getDefaultOptions(options);
  const currentPath = _options.name !== void 0 ? [..._options.basePath, _options.definitionPath, _options.name] : _options.basePath;
  return __spreadProps(__spreadValues({}, _options), {
    currentPath,
    propertyPath: void 0,
    seenRefs: /* @__PURE__ */ new Set(),
    seen: new Map(Object.entries(_options.definitions).map(([name, def]) => [zodDef(def), {
      def: zodDef(def),
      path: [..._options.basePath, _options.definitionPath, name],
      // Resolution of references will be forced even though seen, so it's ok that the schema is undefined here for now.
      jsonSchema: void 0
    }]))
  });
};

// node_modules/openai/_vendor/zod-to-json-schema/errorMessages.mjs
function addErrorMessage(res, key, errorMessage, refs) {
  if (!refs?.errorMessages) return;
  if (errorMessage) {
    res.errorMessage = __spreadProps(__spreadValues({}, res.errorMessage), {
      [key]: errorMessage
    });
  }
}
function setResponseValueAndErrors(res, key, value, errorMessage, refs) {
  res[key] = value;
  addErrorMessage(res, key, errorMessage, refs);
}

// node_modules/openai/_vendor/zod-to-json-schema/parsers/any.mjs
function parseAnyDef() {
  return {};
}

// node_modules/openai/_vendor/zod-to-json-schema/parsers/array.mjs
function parseArrayDef(def, refs) {
  const res = {
    type: "array"
  };
  if (def.type?._def?.typeName !== ZodFirstPartyTypeKind.ZodAny) {
    res.items = parseDef(def.type._def, __spreadProps(__spreadValues({}, refs), {
      currentPath: [...refs.currentPath, "items"]
    }));
  }
  if (def.minLength) {
    setResponseValueAndErrors(res, "minItems", def.minLength.value, def.minLength.message, refs);
  }
  if (def.maxLength) {
    setResponseValueAndErrors(res, "maxItems", def.maxLength.value, def.maxLength.message, refs);
  }
  if (def.exactLength) {
    setResponseValueAndErrors(res, "minItems", def.exactLength.value, def.exactLength.message, refs);
    setResponseValueAndErrors(res, "maxItems", def.exactLength.value, def.exactLength.message, refs);
  }
  return res;
}

// node_modules/openai/_vendor/zod-to-json-schema/parsers/bigint.mjs
function parseBigintDef(def, refs) {
  const res = {
    type: "integer",
    format: "int64"
  };
  if (!def.checks) return res;
  for (const check of def.checks) {
    switch (check.kind) {
      case "min":
        if (refs.target === "jsonSchema7") {
          if (check.inclusive) {
            setResponseValueAndErrors(res, "minimum", check.value, check.message, refs);
          } else {
            setResponseValueAndErrors(res, "exclusiveMinimum", check.value, check.message, refs);
          }
        } else {
          if (!check.inclusive) {
            res.exclusiveMinimum = true;
          }
          setResponseValueAndErrors(res, "minimum", check.value, check.message, refs);
        }
        break;
      case "max":
        if (refs.target === "jsonSchema7") {
          if (check.inclusive) {
            setResponseValueAndErrors(res, "maximum", check.value, check.message, refs);
          } else {
            setResponseValueAndErrors(res, "exclusiveMaximum", check.value, check.message, refs);
          }
        } else {
          if (!check.inclusive) {
            res.exclusiveMaximum = true;
          }
          setResponseValueAndErrors(res, "maximum", check.value, check.message, refs);
        }
        break;
      case "multipleOf":
        setResponseValueAndErrors(res, "multipleOf", check.value, check.message, refs);
        break;
    }
  }
  return res;
}

// node_modules/openai/_vendor/zod-to-json-schema/parsers/boolean.mjs
function parseBooleanDef() {
  return {
    type: "boolean"
  };
}

// node_modules/openai/_vendor/zod-to-json-schema/parsers/branded.mjs
function parseBrandedDef(_def, refs) {
  return parseDef(_def.type._def, refs);
}

// node_modules/openai/_vendor/zod-to-json-schema/parsers/catch.mjs
var parseCatchDef = (def, refs) => {
  return parseDef(def.innerType._def, refs);
};

// node_modules/openai/_vendor/zod-to-json-schema/parsers/date.mjs
function parseDateDef(def, refs, overrideDateStrategy) {
  const strategy = overrideDateStrategy ?? refs.dateStrategy;
  if (Array.isArray(strategy)) {
    return {
      anyOf: strategy.map((item, i) => parseDateDef(def, refs, item))
    };
  }
  switch (strategy) {
    case "string":
    case "format:date-time":
      return {
        type: "string",
        format: "date-time"
      };
    case "format:date":
      return {
        type: "string",
        format: "date"
      };
    case "integer":
      return integerDateParser(def, refs);
  }
}
var integerDateParser = (def, refs) => {
  const res = {
    type: "integer",
    format: "unix-time"
  };
  if (refs.target === "openApi3") {
    return res;
  }
  for (const check of def.checks) {
    switch (check.kind) {
      case "min":
        setResponseValueAndErrors(
          res,
          "minimum",
          check.value,
          // This is in milliseconds
          check.message,
          refs
        );
        break;
      case "max":
        setResponseValueAndErrors(
          res,
          "maximum",
          check.value,
          // This is in milliseconds
          check.message,
          refs
        );
        break;
    }
  }
  return res;
};

// node_modules/openai/_vendor/zod-to-json-schema/parsers/default.mjs
function parseDefaultDef(_def, refs) {
  return __spreadProps(__spreadValues({}, parseDef(_def.innerType._def, refs)), {
    default: _def.defaultValue()
  });
}

// node_modules/openai/_vendor/zod-to-json-schema/parsers/effects.mjs
function parseEffectsDef(_def, refs, forceResolution) {
  return refs.effectStrategy === "input" ? parseDef(_def.schema._def, refs, forceResolution) : {};
}

// node_modules/openai/_vendor/zod-to-json-schema/parsers/enum.mjs
function parseEnumDef(def) {
  return {
    type: "string",
    enum: [...def.values]
  };
}

// node_modules/openai/_vendor/zod-to-json-schema/parsers/intersection.mjs
var isJsonSchema7AllOfType = (type) => {
  if ("type" in type && type.type === "string") return false;
  return "allOf" in type;
};
function parseIntersectionDef(def, refs) {
  const allOf = [parseDef(def.left._def, __spreadProps(__spreadValues({}, refs), {
    currentPath: [...refs.currentPath, "allOf", "0"]
  })), parseDef(def.right._def, __spreadProps(__spreadValues({}, refs), {
    currentPath: [...refs.currentPath, "allOf", "1"]
  }))].filter((x) => !!x);
  let unevaluatedProperties = refs.target === "jsonSchema2019-09" ? {
    unevaluatedProperties: false
  } : void 0;
  const mergedAllOf = [];
  allOf.forEach((schema) => {
    if (isJsonSchema7AllOfType(schema)) {
      mergedAllOf.push(...schema.allOf);
      if (schema.unevaluatedProperties === void 0) {
        unevaluatedProperties = void 0;
      }
    } else {
      let nestedSchema = schema;
      if ("additionalProperties" in schema && schema.additionalProperties === false) {
        const _a2 = schema, {
          additionalProperties
        } = _a2, rest = __objRest(_a2, [
          "additionalProperties"
        ]);
        nestedSchema = rest;
      } else {
        unevaluatedProperties = void 0;
      }
      mergedAllOf.push(nestedSchema);
    }
  });
  return mergedAllOf.length ? __spreadValues({
    allOf: mergedAllOf
  }, unevaluatedProperties) : void 0;
}

// node_modules/openai/_vendor/zod-to-json-schema/parsers/literal.mjs
function parseLiteralDef(def, refs) {
  const parsedType = typeof def.value;
  if (parsedType !== "bigint" && parsedType !== "number" && parsedType !== "boolean" && parsedType !== "string") {
    return {
      type: Array.isArray(def.value) ? "array" : "object"
    };
  }
  if (refs.target === "openApi3") {
    return {
      type: parsedType === "bigint" ? "integer" : parsedType,
      enum: [def.value]
    };
  }
  return {
    type: parsedType === "bigint" ? "integer" : parsedType,
    const: def.value
  };
}

// node_modules/openai/_vendor/zod-to-json-schema/parsers/string.mjs
var emojiRegex;
var zodPatterns = {
  /**
   * `c` was changed to `[cC]` to replicate /i flag
   */
  cuid: /^[cC][^\s-]{8,}$/,
  cuid2: /^[0-9a-z]+$/,
  ulid: /^[0-9A-HJKMNP-TV-Z]{26}$/,
  /**
   * `a-z` was added to replicate /i flag
   */
  email: /^(?!\.)(?!.*\.\.)([a-zA-Z0-9_'+\-\.]*)[a-zA-Z0-9_+-]@([a-zA-Z0-9][a-zA-Z0-9\-]*\.)+[a-zA-Z]{2,}$/,
  /**
   * Constructed a valid Unicode RegExp
   *
   * Lazily instantiate since this type of regex isn't supported
   * in all envs (e.g. React Native).
   *
   * See:
   * https://github.com/colinhacks/zod/issues/2433
   * Fix in Zod:
   * https://github.com/colinhacks/zod/commit/9340fd51e48576a75adc919bff65dbc4a5d4c99b
   */
  emoji: () => {
    if (emojiRegex === void 0) {
      emojiRegex = RegExp("^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$", "u");
    }
    return emojiRegex;
  },
  /**
   * Unused
   */
  uuid: /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
  /**
   * Unused
   */
  ipv4: /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/,
  /**
   * Unused
   */
  ipv6: /^(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))$/,
  base64: /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/,
  nanoid: /^[a-zA-Z0-9_-]{21}$/
};
function parseStringDef(def, refs) {
  const res = {
    type: "string"
  };
  function processPattern(value) {
    return refs.patternStrategy === "escape" ? escapeNonAlphaNumeric(value) : value;
  }
  if (def.checks) {
    for (const check of def.checks) {
      switch (check.kind) {
        case "min":
          setResponseValueAndErrors(res, "minLength", typeof res.minLength === "number" ? Math.max(res.minLength, check.value) : check.value, check.message, refs);
          break;
        case "max":
          setResponseValueAndErrors(res, "maxLength", typeof res.maxLength === "number" ? Math.min(res.maxLength, check.value) : check.value, check.message, refs);
          break;
        case "email":
          switch (refs.emailStrategy) {
            case "format:email":
              addFormat(res, "email", check.message, refs);
              break;
            case "format:idn-email":
              addFormat(res, "idn-email", check.message, refs);
              break;
            case "pattern:zod":
              addPattern(res, zodPatterns.email, check.message, refs);
              break;
          }
          break;
        case "url":
          addFormat(res, "uri", check.message, refs);
          break;
        case "uuid":
          addFormat(res, "uuid", check.message, refs);
          break;
        case "regex":
          addPattern(res, check.regex, check.message, refs);
          break;
        case "cuid":
          addPattern(res, zodPatterns.cuid, check.message, refs);
          break;
        case "cuid2":
          addPattern(res, zodPatterns.cuid2, check.message, refs);
          break;
        case "startsWith":
          addPattern(res, RegExp(`^${processPattern(check.value)}`), check.message, refs);
          break;
        case "endsWith":
          addPattern(res, RegExp(`${processPattern(check.value)}$`), check.message, refs);
          break;
        case "datetime":
          addFormat(res, "date-time", check.message, refs);
          break;
        case "date":
          addFormat(res, "date", check.message, refs);
          break;
        case "time":
          addFormat(res, "time", check.message, refs);
          break;
        case "duration":
          addFormat(res, "duration", check.message, refs);
          break;
        case "length":
          setResponseValueAndErrors(res, "minLength", typeof res.minLength === "number" ? Math.max(res.minLength, check.value) : check.value, check.message, refs);
          setResponseValueAndErrors(res, "maxLength", typeof res.maxLength === "number" ? Math.min(res.maxLength, check.value) : check.value, check.message, refs);
          break;
        case "includes": {
          addPattern(res, RegExp(processPattern(check.value)), check.message, refs);
          break;
        }
        case "ip": {
          if (check.version !== "v6") {
            addFormat(res, "ipv4", check.message, refs);
          }
          if (check.version !== "v4") {
            addFormat(res, "ipv6", check.message, refs);
          }
          break;
        }
        case "emoji":
          addPattern(res, zodPatterns.emoji, check.message, refs);
          break;
        case "ulid": {
          addPattern(res, zodPatterns.ulid, check.message, refs);
          break;
        }
        case "base64": {
          switch (refs.base64Strategy) {
            case "format:binary": {
              addFormat(res, "binary", check.message, refs);
              break;
            }
            case "contentEncoding:base64": {
              setResponseValueAndErrors(res, "contentEncoding", "base64", check.message, refs);
              break;
            }
            case "pattern:zod": {
              addPattern(res, zodPatterns.base64, check.message, refs);
              break;
            }
          }
          break;
        }
        case "nanoid": {
          addPattern(res, zodPatterns.nanoid, check.message, refs);
        }
        case "toLowerCase":
        case "toUpperCase":
        case "trim":
          break;
        default:
          /* @__PURE__ */ ((_) => {
          })(check);
      }
    }
  }
  return res;
}
var escapeNonAlphaNumeric = (value) => Array.from(value).map((c) => /[a-zA-Z0-9]/.test(c) ? c : `\\${c}`).join("");
var addFormat = (schema, value, message, refs) => {
  if (schema.format || schema.anyOf?.some((x) => x.format)) {
    if (!schema.anyOf) {
      schema.anyOf = [];
    }
    if (schema.format) {
      schema.anyOf.push(__spreadValues({
        format: schema.format
      }, schema.errorMessage && refs.errorMessages && {
        errorMessage: {
          format: schema.errorMessage.format
        }
      }));
      delete schema.format;
      if (schema.errorMessage) {
        delete schema.errorMessage.format;
        if (Object.keys(schema.errorMessage).length === 0) {
          delete schema.errorMessage;
        }
      }
    }
    schema.anyOf.push(__spreadValues({
      format: value
    }, message && refs.errorMessages && {
      errorMessage: {
        format: message
      }
    }));
  } else {
    setResponseValueAndErrors(schema, "format", value, message, refs);
  }
};
var addPattern = (schema, regex, message, refs) => {
  if (schema.pattern || schema.allOf?.some((x) => x.pattern)) {
    if (!schema.allOf) {
      schema.allOf = [];
    }
    if (schema.pattern) {
      schema.allOf.push(__spreadValues({
        pattern: schema.pattern
      }, schema.errorMessage && refs.errorMessages && {
        errorMessage: {
          pattern: schema.errorMessage.pattern
        }
      }));
      delete schema.pattern;
      if (schema.errorMessage) {
        delete schema.errorMessage.pattern;
        if (Object.keys(schema.errorMessage).length === 0) {
          delete schema.errorMessage;
        }
      }
    }
    schema.allOf.push(__spreadValues({
      pattern: processRegExp(regex, refs)
    }, message && refs.errorMessages && {
      errorMessage: {
        pattern: message
      }
    }));
  } else {
    setResponseValueAndErrors(schema, "pattern", processRegExp(regex, refs), message, refs);
  }
};
var processRegExp = (regexOrFunction, refs) => {
  const regex = typeof regexOrFunction === "function" ? regexOrFunction() : regexOrFunction;
  if (!refs.applyRegexFlags || !regex.flags) return regex.source;
  const flags = {
    i: regex.flags.includes("i"),
    m: regex.flags.includes("m"),
    s: regex.flags.includes("s")
    // `.` matches newlines
  };
  const source = flags.i ? regex.source.toLowerCase() : regex.source;
  let pattern = "";
  let isEscaped = false;
  let inCharGroup = false;
  let inCharRange = false;
  for (let i = 0; i < source.length; i++) {
    if (isEscaped) {
      pattern += source[i];
      isEscaped = false;
      continue;
    }
    if (flags.i) {
      if (inCharGroup) {
        if (source[i].match(/[a-z]/)) {
          if (inCharRange) {
            pattern += source[i];
            pattern += `${source[i - 2]}-${source[i]}`.toUpperCase();
            inCharRange = false;
          } else if (source[i + 1] === "-" && source[i + 2]?.match(/[a-z]/)) {
            pattern += source[i];
            inCharRange = true;
          } else {
            pattern += `${source[i]}${source[i].toUpperCase()}`;
          }
          continue;
        }
      } else if (source[i].match(/[a-z]/)) {
        pattern += `[${source[i]}${source[i].toUpperCase()}]`;
        continue;
      }
    }
    if (flags.m) {
      if (source[i] === "^") {
        pattern += `(^|(?<=[\r
]))`;
        continue;
      } else if (source[i] === "$") {
        pattern += `($|(?=[\r
]))`;
        continue;
      }
    }
    if (flags.s && source[i] === ".") {
      pattern += inCharGroup ? `${source[i]}\r
` : `[${source[i]}\r
]`;
      continue;
    }
    pattern += source[i];
    if (source[i] === "\\") {
      isEscaped = true;
    } else if (inCharGroup && source[i] === "]") {
      inCharGroup = false;
    } else if (!inCharGroup && source[i] === "[") {
      inCharGroup = true;
    }
  }
  try {
    const regexTest = new RegExp(pattern);
  } catch {
    console.warn(`Could not convert regex pattern at ${refs.currentPath.join("/")} to a flag-independent form! Falling back to the flag-ignorant source`);
    return regex.source;
  }
  return pattern;
};

// node_modules/openai/_vendor/zod-to-json-schema/parsers/record.mjs
function parseRecordDef(def, refs) {
  if (refs.target === "openApi3" && def.keyType?._def.typeName === ZodFirstPartyTypeKind.ZodEnum) {
    return {
      type: "object",
      required: def.keyType._def.values,
      properties: def.keyType._def.values.reduce((acc, key) => __spreadProps(__spreadValues({}, acc), {
        [key]: parseDef(def.valueType._def, __spreadProps(__spreadValues({}, refs), {
          currentPath: [...refs.currentPath, "properties", key]
        })) ?? {}
      }), {}),
      additionalProperties: false
    };
  }
  const schema = {
    type: "object",
    additionalProperties: parseDef(def.valueType._def, __spreadProps(__spreadValues({}, refs), {
      currentPath: [...refs.currentPath, "additionalProperties"]
    })) ?? {}
  };
  if (refs.target === "openApi3") {
    return schema;
  }
  if (def.keyType?._def.typeName === ZodFirstPartyTypeKind.ZodString && def.keyType._def.checks?.length) {
    const keyType = Object.entries(parseStringDef(def.keyType._def, refs)).reduce((acc, [key, value]) => key === "type" ? acc : __spreadProps(__spreadValues({}, acc), {
      [key]: value
    }), {});
    return __spreadProps(__spreadValues({}, schema), {
      propertyNames: keyType
    });
  } else if (def.keyType?._def.typeName === ZodFirstPartyTypeKind.ZodEnum) {
    return __spreadProps(__spreadValues({}, schema), {
      propertyNames: {
        enum: def.keyType._def.values
      }
    });
  }
  return schema;
}

// node_modules/openai/_vendor/zod-to-json-schema/parsers/map.mjs
function parseMapDef(def, refs) {
  if (refs.mapStrategy === "record") {
    return parseRecordDef(def, refs);
  }
  const keys = parseDef(def.keyType._def, __spreadProps(__spreadValues({}, refs), {
    currentPath: [...refs.currentPath, "items", "items", "0"]
  })) || {};
  const values = parseDef(def.valueType._def, __spreadProps(__spreadValues({}, refs), {
    currentPath: [...refs.currentPath, "items", "items", "1"]
  })) || {};
  return {
    type: "array",
    maxItems: 125,
    items: {
      type: "array",
      items: [keys, values],
      minItems: 2,
      maxItems: 2
    }
  };
}

// node_modules/openai/_vendor/zod-to-json-schema/parsers/nativeEnum.mjs
function parseNativeEnumDef(def) {
  const object = def.values;
  const actualKeys = Object.keys(def.values).filter((key) => {
    return typeof object[object[key]] !== "number";
  });
  const actualValues = actualKeys.map((key) => object[key]);
  const parsedTypes = Array.from(new Set(actualValues.map((values) => typeof values)));
  return {
    type: parsedTypes.length === 1 ? parsedTypes[0] === "string" ? "string" : "number" : ["string", "number"],
    enum: actualValues
  };
}

// node_modules/openai/_vendor/zod-to-json-schema/parsers/never.mjs
function parseNeverDef() {
  return {
    not: {}
  };
}

// node_modules/openai/_vendor/zod-to-json-schema/parsers/null.mjs
function parseNullDef(refs) {
  return refs.target === "openApi3" ? {
    enum: ["null"],
    nullable: true
  } : {
    type: "null"
  };
}

// node_modules/openai/_vendor/zod-to-json-schema/parsers/union.mjs
var primitiveMappings = {
  ZodString: "string",
  ZodNumber: "number",
  ZodBigInt: "integer",
  ZodBoolean: "boolean",
  ZodNull: "null"
};
function parseUnionDef(def, refs) {
  if (refs.target === "openApi3") return asAnyOf(def, refs);
  const options = def.options instanceof Map ? Array.from(def.options.values()) : def.options;
  if (options.every((x) => x._def.typeName in primitiveMappings && (!x._def.checks || !x._def.checks.length))) {
    const types = options.reduce((types2, x) => {
      const type = primitiveMappings[x._def.typeName];
      return type && !types2.includes(type) ? [...types2, type] : types2;
    }, []);
    return {
      type: types.length > 1 ? types : types[0]
    };
  } else if (options.every((x) => x._def.typeName === "ZodLiteral" && !x.description)) {
    const types = options.reduce((acc, x) => {
      const type = typeof x._def.value;
      switch (type) {
        case "string":
        case "number":
        case "boolean":
          return [...acc, type];
        case "bigint":
          return [...acc, "integer"];
        case "object":
          if (x._def.value === null) return [...acc, "null"];
        case "symbol":
        case "undefined":
        case "function":
        default:
          return acc;
      }
    }, []);
    if (types.length === options.length) {
      const uniqueTypes = types.filter((x, i, a) => a.indexOf(x) === i);
      return {
        type: uniqueTypes.length > 1 ? uniqueTypes : uniqueTypes[0],
        enum: options.reduce((acc, x) => {
          return acc.includes(x._def.value) ? acc : [...acc, x._def.value];
        }, [])
      };
    }
  } else if (options.every((x) => x._def.typeName === "ZodEnum")) {
    return {
      type: "string",
      enum: options.reduce((acc, x) => [...acc, ...x._def.values.filter((x2) => !acc.includes(x2))], [])
    };
  }
  return asAnyOf(def, refs);
}
var asAnyOf = (def, refs) => {
  const anyOf = (def.options instanceof Map ? Array.from(def.options.values()) : def.options).map((x, i) => parseDef(x._def, __spreadProps(__spreadValues({}, refs), {
    currentPath: [...refs.currentPath, "anyOf", `${i}`]
  }))).filter((x) => !!x && (!refs.strictUnions || typeof x === "object" && Object.keys(x).length > 0));
  return anyOf.length ? {
    anyOf
  } : void 0;
};

// node_modules/openai/_vendor/zod-to-json-schema/parsers/nullable.mjs
function parseNullableDef(def, refs) {
  if (["ZodString", "ZodNumber", "ZodBigInt", "ZodBoolean", "ZodNull"].includes(def.innerType._def.typeName) && (!def.innerType._def.checks || !def.innerType._def.checks.length)) {
    if (refs.target === "openApi3" || refs.nullableStrategy === "property") {
      return {
        type: primitiveMappings[def.innerType._def.typeName],
        nullable: true
      };
    }
    return {
      type: [primitiveMappings[def.innerType._def.typeName], "null"]
    };
  }
  if (refs.target === "openApi3") {
    const base2 = parseDef(def.innerType._def, __spreadProps(__spreadValues({}, refs), {
      currentPath: [...refs.currentPath]
    }));
    if (base2 && "$ref" in base2) return {
      allOf: [base2],
      nullable: true
    };
    return base2 && __spreadProps(__spreadValues({}, base2), {
      nullable: true
    });
  }
  const base = parseDef(def.innerType._def, __spreadProps(__spreadValues({}, refs), {
    currentPath: [...refs.currentPath, "anyOf", "0"]
  }));
  return base && {
    anyOf: [base, {
      type: "null"
    }]
  };
}

// node_modules/openai/_vendor/zod-to-json-schema/parsers/number.mjs
function parseNumberDef(def, refs) {
  const res = {
    type: "number"
  };
  if (!def.checks) return res;
  for (const check of def.checks) {
    switch (check.kind) {
      case "int":
        res.type = "integer";
        addErrorMessage(res, "type", check.message, refs);
        break;
      case "min":
        if (refs.target === "jsonSchema7") {
          if (check.inclusive) {
            setResponseValueAndErrors(res, "minimum", check.value, check.message, refs);
          } else {
            setResponseValueAndErrors(res, "exclusiveMinimum", check.value, check.message, refs);
          }
        } else {
          if (!check.inclusive) {
            res.exclusiveMinimum = true;
          }
          setResponseValueAndErrors(res, "minimum", check.value, check.message, refs);
        }
        break;
      case "max":
        if (refs.target === "jsonSchema7") {
          if (check.inclusive) {
            setResponseValueAndErrors(res, "maximum", check.value, check.message, refs);
          } else {
            setResponseValueAndErrors(res, "exclusiveMaximum", check.value, check.message, refs);
          }
        } else {
          if (!check.inclusive) {
            res.exclusiveMaximum = true;
          }
          setResponseValueAndErrors(res, "maximum", check.value, check.message, refs);
        }
        break;
      case "multipleOf":
        setResponseValueAndErrors(res, "multipleOf", check.value, check.message, refs);
        break;
    }
  }
  return res;
}

// node_modules/openai/_vendor/zod-to-json-schema/parsers/object.mjs
function decideAdditionalProperties(def, refs) {
  if (refs.removeAdditionalStrategy === "strict") {
    return def.catchall._def.typeName === "ZodNever" ? def.unknownKeys !== "strict" : parseDef(def.catchall._def, __spreadProps(__spreadValues({}, refs), {
      currentPath: [...refs.currentPath, "additionalProperties"]
    })) ?? true;
  } else {
    return def.catchall._def.typeName === "ZodNever" ? def.unknownKeys === "passthrough" : parseDef(def.catchall._def, __spreadProps(__spreadValues({}, refs), {
      currentPath: [...refs.currentPath, "additionalProperties"]
    })) ?? true;
  }
}
function parseObjectDef(def, refs) {
  const result = __spreadProps(__spreadValues({
    type: "object"
  }, Object.entries(def.shape()).reduce((acc, [propName, propDef]) => {
    if (propDef === void 0 || propDef._def === void 0) return acc;
    const parsedDef = parseDef(propDef._def, __spreadProps(__spreadValues({}, refs), {
      currentPath: [...refs.currentPath, "properties", propName],
      propertyPath: [...refs.currentPath, "properties", propName]
    }));
    if (parsedDef === void 0) return acc;
    return {
      properties: __spreadProps(__spreadValues({}, acc.properties), {
        [propName]: parsedDef
      }),
      required: propDef.isOptional() && !refs.openaiStrictMode ? acc.required : [...acc.required, propName]
    };
  }, {
    properties: {},
    required: []
  })), {
    additionalProperties: decideAdditionalProperties(def, refs)
  });
  if (!result.required.length) delete result.required;
  return result;
}

// node_modules/openai/_vendor/zod-to-json-schema/parsers/optional.mjs
var parseOptionalDef = (def, refs) => {
  if (refs.currentPath.toString() === refs.propertyPath?.toString()) {
    return parseDef(def.innerType._def, refs);
  }
  const innerSchema = parseDef(def.innerType._def, __spreadProps(__spreadValues({}, refs), {
    currentPath: [...refs.currentPath, "anyOf", "1"]
  }));
  return innerSchema ? {
    anyOf: [{
      not: {}
    }, innerSchema]
  } : {};
};

// node_modules/openai/_vendor/zod-to-json-schema/parsers/pipeline.mjs
var parsePipelineDef = (def, refs) => {
  if (refs.pipeStrategy === "input") {
    return parseDef(def.in._def, refs);
  } else if (refs.pipeStrategy === "output") {
    return parseDef(def.out._def, refs);
  }
  const a = parseDef(def.in._def, __spreadProps(__spreadValues({}, refs), {
    currentPath: [...refs.currentPath, "allOf", "0"]
  }));
  const b = parseDef(def.out._def, __spreadProps(__spreadValues({}, refs), {
    currentPath: [...refs.currentPath, "allOf", a ? "1" : "0"]
  }));
  return {
    allOf: [a, b].filter((x) => x !== void 0)
  };
};

// node_modules/openai/_vendor/zod-to-json-schema/parsers/promise.mjs
function parsePromiseDef(def, refs) {
  return parseDef(def.type._def, refs);
}

// node_modules/openai/_vendor/zod-to-json-schema/parsers/set.mjs
function parseSetDef(def, refs) {
  const items = parseDef(def.valueType._def, __spreadProps(__spreadValues({}, refs), {
    currentPath: [...refs.currentPath, "items"]
  }));
  const schema = {
    type: "array",
    uniqueItems: true,
    items
  };
  if (def.minSize) {
    setResponseValueAndErrors(schema, "minItems", def.minSize.value, def.minSize.message, refs);
  }
  if (def.maxSize) {
    setResponseValueAndErrors(schema, "maxItems", def.maxSize.value, def.maxSize.message, refs);
  }
  return schema;
}

// node_modules/openai/_vendor/zod-to-json-schema/parsers/tuple.mjs
function parseTupleDef(def, refs) {
  if (def.rest) {
    return {
      type: "array",
      minItems: def.items.length,
      items: def.items.map((x, i) => parseDef(x._def, __spreadProps(__spreadValues({}, refs), {
        currentPath: [...refs.currentPath, "items", `${i}`]
      }))).reduce((acc, x) => x === void 0 ? acc : [...acc, x], []),
      additionalItems: parseDef(def.rest._def, __spreadProps(__spreadValues({}, refs), {
        currentPath: [...refs.currentPath, "additionalItems"]
      }))
    };
  } else {
    return {
      type: "array",
      minItems: def.items.length,
      maxItems: def.items.length,
      items: def.items.map((x, i) => parseDef(x._def, __spreadProps(__spreadValues({}, refs), {
        currentPath: [...refs.currentPath, "items", `${i}`]
      }))).reduce((acc, x) => x === void 0 ? acc : [...acc, x], [])
    };
  }
}

// node_modules/openai/_vendor/zod-to-json-schema/parsers/undefined.mjs
function parseUndefinedDef() {
  return {
    not: {}
  };
}

// node_modules/openai/_vendor/zod-to-json-schema/parsers/unknown.mjs
function parseUnknownDef() {
  return {};
}

// node_modules/openai/_vendor/zod-to-json-schema/parsers/readonly.mjs
var parseReadonlyDef = (def, refs) => {
  return parseDef(def.innerType._def, refs);
};

// node_modules/openai/_vendor/zod-to-json-schema/parseDef.mjs
function parseDef(def, refs, forceResolution = false) {
  const seenItem = refs.seen.get(def);
  if (refs.override) {
    const overrideResult = refs.override?.(def, refs, seenItem, forceResolution);
    if (overrideResult !== ignoreOverride) {
      return overrideResult;
    }
  }
  if (seenItem && !forceResolution) {
    const seenSchema = get$ref(seenItem, refs);
    if (seenSchema !== void 0) {
      if ("$ref" in seenSchema) {
        refs.seenRefs.add(seenSchema.$ref);
      }
      return seenSchema;
    }
  }
  const newItem = {
    def,
    path: refs.currentPath,
    jsonSchema: void 0
  };
  refs.seen.set(def, newItem);
  const jsonSchema = selectParser(def, def.typeName, refs, forceResolution);
  if (jsonSchema) {
    addMeta(def, refs, jsonSchema);
  }
  newItem.jsonSchema = jsonSchema;
  return jsonSchema;
}
var get$ref = (item, refs) => {
  switch (refs.$refStrategy) {
    case "root":
      return {
        $ref: item.path.join("/")
      };
    case "extract-to-root":
      const name = item.path.slice(refs.basePath.length + 1).join("_");
      if (name !== refs.name && refs.nameStrategy === "duplicate-ref") {
        refs.definitions[name] = item.def;
      }
      return {
        $ref: [...refs.basePath, refs.definitionPath, name].join("/")
      };
    case "relative":
      return {
        $ref: getRelativePath(refs.currentPath, item.path)
      };
    case "none":
    case "seen": {
      if (item.path.length < refs.currentPath.length && item.path.every((value, index) => refs.currentPath[index] === value)) {
        console.warn(`Recursive reference detected at ${refs.currentPath.join("/")}! Defaulting to any`);
        return {};
      }
      return refs.$refStrategy === "seen" ? {} : void 0;
    }
  }
};
var getRelativePath = (pathA, pathB) => {
  let i = 0;
  for (; i < pathA.length && i < pathB.length; i++) {
    if (pathA[i] !== pathB[i]) break;
  }
  return [(pathA.length - i).toString(), ...pathB.slice(i)].join("/");
};
var selectParser = (def, typeName, refs, forceResolution) => {
  switch (typeName) {
    case ZodFirstPartyTypeKind.ZodString:
      return parseStringDef(def, refs);
    case ZodFirstPartyTypeKind.ZodNumber:
      return parseNumberDef(def, refs);
    case ZodFirstPartyTypeKind.ZodObject:
      return parseObjectDef(def, refs);
    case ZodFirstPartyTypeKind.ZodBigInt:
      return parseBigintDef(def, refs);
    case ZodFirstPartyTypeKind.ZodBoolean:
      return parseBooleanDef();
    case ZodFirstPartyTypeKind.ZodDate:
      return parseDateDef(def, refs);
    case ZodFirstPartyTypeKind.ZodUndefined:
      return parseUndefinedDef();
    case ZodFirstPartyTypeKind.ZodNull:
      return parseNullDef(refs);
    case ZodFirstPartyTypeKind.ZodArray:
      return parseArrayDef(def, refs);
    case ZodFirstPartyTypeKind.ZodUnion:
    case ZodFirstPartyTypeKind.ZodDiscriminatedUnion:
      return parseUnionDef(def, refs);
    case ZodFirstPartyTypeKind.ZodIntersection:
      return parseIntersectionDef(def, refs);
    case ZodFirstPartyTypeKind.ZodTuple:
      return parseTupleDef(def, refs);
    case ZodFirstPartyTypeKind.ZodRecord:
      return parseRecordDef(def, refs);
    case ZodFirstPartyTypeKind.ZodLiteral:
      return parseLiteralDef(def, refs);
    case ZodFirstPartyTypeKind.ZodEnum:
      return parseEnumDef(def);
    case ZodFirstPartyTypeKind.ZodNativeEnum:
      return parseNativeEnumDef(def);
    case ZodFirstPartyTypeKind.ZodNullable:
      return parseNullableDef(def, refs);
    case ZodFirstPartyTypeKind.ZodOptional:
      return parseOptionalDef(def, refs);
    case ZodFirstPartyTypeKind.ZodMap:
      return parseMapDef(def, refs);
    case ZodFirstPartyTypeKind.ZodSet:
      return parseSetDef(def, refs);
    case ZodFirstPartyTypeKind.ZodLazy:
      return parseDef(def.getter()._def, refs);
    case ZodFirstPartyTypeKind.ZodPromise:
      return parsePromiseDef(def, refs);
    case ZodFirstPartyTypeKind.ZodNaN:
    case ZodFirstPartyTypeKind.ZodNever:
      return parseNeverDef();
    case ZodFirstPartyTypeKind.ZodEffects:
      return parseEffectsDef(def, refs, forceResolution);
    case ZodFirstPartyTypeKind.ZodAny:
      return parseAnyDef();
    case ZodFirstPartyTypeKind.ZodUnknown:
      return parseUnknownDef();
    case ZodFirstPartyTypeKind.ZodDefault:
      return parseDefaultDef(def, refs);
    case ZodFirstPartyTypeKind.ZodBranded:
      return parseBrandedDef(def, refs);
    case ZodFirstPartyTypeKind.ZodReadonly:
      return parseReadonlyDef(def, refs);
    case ZodFirstPartyTypeKind.ZodCatch:
      return parseCatchDef(def, refs);
    case ZodFirstPartyTypeKind.ZodPipeline:
      return parsePipelineDef(def, refs);
    case ZodFirstPartyTypeKind.ZodFunction:
    case ZodFirstPartyTypeKind.ZodVoid:
    case ZodFirstPartyTypeKind.ZodSymbol:
      return void 0;
    default:
      return /* @__PURE__ */ ((_) => void 0)(typeName);
  }
};
var addMeta = (def, refs, jsonSchema) => {
  if (def.description) {
    jsonSchema.description = def.description;
    if (refs.markdownDescription) {
      jsonSchema.markdownDescription = def.description;
    }
  }
  return jsonSchema;
};

// node_modules/openai/_vendor/zod-to-json-schema/zodToJsonSchema.mjs
var zodToJsonSchema2 = (schema, options) => {
  const refs = getRefs(options);
  const name = typeof options === "string" ? options : options?.nameStrategy === "title" ? void 0 : options?.name;
  const main = parseDef(schema._def, name === void 0 ? refs : __spreadProps(__spreadValues({}, refs), {
    currentPath: [...refs.basePath, refs.definitionPath, name]
  }), false) ?? {};
  const title = typeof options === "object" && options.name !== void 0 && options.nameStrategy === "title" ? options.name : void 0;
  if (title !== void 0) {
    main.title = title;
  }
  const definitions = (() => {
    if (isEmptyObj2(refs.definitions)) {
      return void 0;
    }
    const definitions2 = {};
    const processedDefinitions = /* @__PURE__ */ new Set();
    for (let i = 0; i < 500; i++) {
      const newDefinitions = Object.entries(refs.definitions).filter(([key]) => !processedDefinitions.has(key));
      if (newDefinitions.length === 0) break;
      for (const [key, schema2] of newDefinitions) {
        definitions2[key] = parseDef(zodDef(schema2), __spreadProps(__spreadValues({}, refs), {
          currentPath: [...refs.basePath, refs.definitionPath, key]
        }), true) ?? {};
        processedDefinitions.add(key);
      }
    }
    return definitions2;
  })();
  const combined = name === void 0 ? definitions ? __spreadProps(__spreadValues({}, main), {
    [refs.definitionPath]: definitions
  }) : main : refs.nameStrategy === "duplicate-ref" ? __spreadValues(__spreadValues({}, main), definitions || refs.seenRefs.size ? {
    [refs.definitionPath]: __spreadValues(__spreadValues({}, definitions), refs.seenRefs.size ? {
      [name]: main
    } : void 0)
  } : void 0) : {
    $ref: [...refs.$refStrategy === "relative" ? [] : refs.basePath, refs.definitionPath, name].join("/"),
    [refs.definitionPath]: __spreadProps(__spreadValues({}, definitions), {
      [name]: main
    })
  };
  if (refs.target === "jsonSchema7") {
    combined.$schema = "http://json-schema.org/draft-07/schema#";
  } else if (refs.target === "jsonSchema2019-09") {
    combined.$schema = "https://json-schema.org/draft/2019-09/schema#";
  }
  return combined;
};

// node_modules/openai/helpers/zod.mjs
function zodToJsonSchema3(schema, options) {
  return zodToJsonSchema2(schema, {
    openaiStrictMode: true,
    name: options.name,
    nameStrategy: "duplicate-ref",
    $refStrategy: "extract-to-root",
    nullableStrategy: "property"
  });
}
function zodResponseFormat(zodObject, name, props) {
  return makeParseableResponseFormat({
    type: "json_schema",
    json_schema: __spreadProps(__spreadValues({}, props), {
      name,
      strict: true,
      schema: zodToJsonSchema3(zodObject, {
        name
      })
    })
  }, (content) => zodObject.parse(JSON.parse(content)));
}
function zodFunction(options) {
  return makeParseableTool({
    type: "function",
    function: __spreadValues({
      name: options.name,
      parameters: zodToJsonSchema3(options.parameters, {
        name: options.name
      }),
      strict: true
    }, options.description ? {
      description: options.description
    } : void 0)
  }, {
    callback: options.function,
    parser: (args) => options.parameters.parse(JSON.parse(args))
  });
}

// node_modules/@langchain/openai/dist/utils/azure.js
function getEndpoint(config) {
  const {
    azureOpenAIApiDeploymentName,
    azureOpenAIApiInstanceName,
    azureOpenAIApiKey,
    azureOpenAIBasePath,
    baseURL,
    azureADTokenProvider,
    azureOpenAIEndpoint
  } = config;
  if ((azureOpenAIApiKey || azureADTokenProvider) && azureOpenAIBasePath && azureOpenAIApiDeploymentName) {
    return `${azureOpenAIBasePath}/${azureOpenAIApiDeploymentName}`;
  }
  if ((azureOpenAIApiKey || azureADTokenProvider) && azureOpenAIEndpoint && azureOpenAIApiDeploymentName) {
    return `${azureOpenAIEndpoint}/openai/deployments/${azureOpenAIApiDeploymentName}`;
  }
  if (azureOpenAIApiKey || azureADTokenProvider) {
    if (!azureOpenAIApiInstanceName) {
      throw new Error("azureOpenAIApiInstanceName is required when using azureOpenAIApiKey");
    }
    if (!azureOpenAIApiDeploymentName) {
      throw new Error("azureOpenAIApiDeploymentName is a required parameter when using azureOpenAIApiKey");
    }
    return `https://${azureOpenAIApiInstanceName}.openai.azure.com/openai/deployments/${azureOpenAIApiDeploymentName}`;
  }
  return baseURL;
}

// node_modules/@langchain/core/dist/utils/function_calling.js
function convertToOpenAIFunction(tool, fields) {
  const fieldsCopy = typeof fields === "number" ? void 0 : fields;
  return __spreadValues({
    name: tool.name,
    description: tool.description,
    parameters: zodToJsonSchema(tool.schema)
  }, fieldsCopy?.strict !== void 0 ? {
    strict: fieldsCopy.strict
  } : {});
}
function convertToOpenAITool(tool, fields) {
  const fieldsCopy = typeof fields === "number" ? void 0 : fields;
  let toolDef;
  if (isLangChainTool(tool)) {
    toolDef = {
      type: "function",
      function: convertToOpenAIFunction(tool)
    };
  } else {
    toolDef = tool;
  }
  if (fieldsCopy?.strict !== void 0) {
    toolDef.function.strict = fieldsCopy.strict;
  }
  return toolDef;
}
function isStructuredTool(tool) {
  return tool !== void 0 && Array.isArray(tool.lc_namespace);
}
function isRunnableToolLike(tool) {
  return tool !== void 0 && Runnable.isRunnable(tool) && "lc_name" in tool.constructor && typeof tool.constructor.lc_name === "function" && tool.constructor.lc_name() === "RunnableToolLike";
}
function isStructuredToolParams(tool) {
  return !!tool && typeof tool === "object" && "name" in tool && "schema" in tool && // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isZodSchema(tool.schema);
}
function isLangChainTool(tool) {
  return isStructuredToolParams(tool) || isRunnableToolLike(tool) || // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isStructuredTool(tool);
}

// node_modules/@langchain/openai/dist/utils/errors.js
function addLangChainErrorFields(error, lc_error_code) {
  error.lc_error_code = lc_error_code;
  error.message = `${error.message}

Troubleshooting URL: https://js.langchain.com/docs/troubleshooting/errors/${lc_error_code}/
`;
  return error;
}

// node_modules/@langchain/openai/dist/utils/openai.js
function wrapOpenAIClientError(e) {
  let error;
  if (e.constructor.name === APIConnectionTimeoutError.name) {
    error = new Error(e.message);
    error.name = "TimeoutError";
  } else if (e.constructor.name === APIUserAbortError.name) {
    error = new Error(e.message);
    error.name = "AbortError";
  } else if (e.status === 400 && e.message.includes("tool_calls")) {
    error = addLangChainErrorFields(e, "INVALID_TOOL_RESULTS");
  } else if (e.status === 401) {
    error = addLangChainErrorFields(e, "MODEL_AUTHENTICATION");
  } else if (e.status === 429) {
    error = addLangChainErrorFields(e, "MODEL_RATE_LIMIT");
  } else if (e.status === 404) {
    error = addLangChainErrorFields(e, "MODEL_NOT_FOUND");
  } else {
    error = e;
  }
  return error;
}
function formatToOpenAIAssistantTool(tool) {
  return {
    type: "function",
    function: {
      name: tool.name,
      description: tool.description,
      parameters: zodToJsonSchema(tool.schema)
    }
  };
}
function formatToOpenAIToolChoice(toolChoice) {
  if (!toolChoice) {
    return void 0;
  } else if (toolChoice === "any" || toolChoice === "required") {
    return "required";
  } else if (toolChoice === "auto") {
    return "auto";
  } else if (toolChoice === "none") {
    return "none";
  } else if (typeof toolChoice === "string") {
    return {
      type: "function",
      function: {
        name: toolChoice
      }
    };
  } else {
    return toolChoice;
  }
}

// node_modules/@langchain/openai/dist/utils/openai-format-fndef.js
function isAnyOfProp(prop) {
  return prop.anyOf !== void 0 && Array.isArray(prop.anyOf);
}
function formatFunctionDefinitions(functions) {
  const lines = ["namespace functions {", ""];
  for (const f of functions) {
    if (f.description) {
      lines.push(`// ${f.description}`);
    }
    if (Object.keys(f.parameters.properties ?? {}).length > 0) {
      lines.push(`type ${f.name} = (_: {`);
      lines.push(formatObjectProperties(f.parameters, 0));
      lines.push("}) => any;");
    } else {
      lines.push(`type ${f.name} = () => any;`);
    }
    lines.push("");
  }
  lines.push("} // namespace functions");
  return lines.join("\n");
}
function formatObjectProperties(obj, indent) {
  const lines = [];
  for (const [name, param] of Object.entries(obj.properties ?? {})) {
    if (param.description && indent < 2) {
      lines.push(`// ${param.description}`);
    }
    if (obj.required?.includes(name)) {
      lines.push(`${name}: ${formatType(param, indent)},`);
    } else {
      lines.push(`${name}?: ${formatType(param, indent)},`);
    }
  }
  return lines.map((line) => " ".repeat(indent) + line).join("\n");
}
function formatType(param, indent) {
  if (isAnyOfProp(param)) {
    return param.anyOf.map((v) => formatType(v, indent)).join(" | ");
  }
  switch (param.type) {
    case "string":
      if (param.enum) {
        return param.enum.map((v) => `"${v}"`).join(" | ");
      }
      return "string";
    case "number":
      if (param.enum) {
        return param.enum.map((v) => `${v}`).join(" | ");
      }
      return "number";
    case "integer":
      if (param.enum) {
        return param.enum.map((v) => `${v}`).join(" | ");
      }
      return "number";
    case "boolean":
      return "boolean";
    case "null":
      return "null";
    case "object":
      return ["{", formatObjectProperties(param, indent + 2), "}"].join("\n");
    case "array":
      if (param.items) {
        return `${formatType(param.items, indent)}[]`;
      }
      return "any[]";
    default:
      return "";
  }
}

// node_modules/@langchain/openai/dist/utils/tools.js
function _convertToOpenAITool(tool, fields) {
  let toolDef;
  if (isLangChainTool(tool)) {
    const oaiToolDef = zodFunction({
      name: tool.name,
      parameters: tool.schema,
      description: tool.description
    });
    if (!oaiToolDef.function.parameters) {
      toolDef = {
        type: "function",
        function: convertToOpenAIFunction(tool, fields)
      };
    } else {
      toolDef = {
        type: oaiToolDef.type,
        function: __spreadValues({
          name: oaiToolDef.function.name,
          description: oaiToolDef.function.description,
          parameters: oaiToolDef.function.parameters
        }, fields?.strict !== void 0 ? {
          strict: fields.strict
        } : {})
      };
    }
  } else {
    toolDef = tool;
  }
  if (fields?.strict !== void 0) {
    toolDef.function.strict = fields.strict;
  }
  return toolDef;
}

// node_modules/@langchain/openai/dist/chat_models.js
function extractGenericMessageCustomRole(message) {
  if (message.role !== "system" && message.role !== "assistant" && message.role !== "user" && message.role !== "function" && message.role !== "tool") {
    console.warn(`Unknown message role: ${message.role}`);
  }
  return message.role;
}
function messageToOpenAIRole(message) {
  const type = message._getType();
  switch (type) {
    case "system":
      return "system";
    case "ai":
      return "assistant";
    case "human":
      return "user";
    case "function":
      return "function";
    case "tool":
      return "tool";
    case "generic": {
      if (!ChatMessage.isInstance(message)) throw new Error("Invalid generic chat message");
      return extractGenericMessageCustomRole(message);
    }
    default:
      throw new Error(`Unknown message type: ${type}`);
  }
}
function openAIResponseToChatMessage(message, rawResponse, includeRawResponse) {
  const rawToolCalls = message.tool_calls;
  switch (message.role) {
    case "assistant": {
      const toolCalls = [];
      const invalidToolCalls = [];
      for (const rawToolCall of rawToolCalls ?? []) {
        try {
          toolCalls.push(parseToolCall2(rawToolCall, {
            returnId: true
          }));
        } catch (e) {
          invalidToolCalls.push(makeInvalidToolCall(rawToolCall, e.message));
        }
      }
      const additional_kwargs = {
        function_call: message.function_call,
        tool_calls: rawToolCalls
      };
      if (includeRawResponse !== void 0) {
        additional_kwargs.__raw_response = rawResponse;
      }
      let response_metadata;
      if (rawResponse.system_fingerprint) {
        response_metadata = {
          usage: __spreadValues({}, rawResponse.usage),
          system_fingerprint: rawResponse.system_fingerprint
        };
      }
      if (message.audio) {
        additional_kwargs.audio = message.audio;
      }
      return new AIMessage({
        content: message.content || "",
        tool_calls: toolCalls,
        invalid_tool_calls: invalidToolCalls,
        additional_kwargs,
        response_metadata,
        id: rawResponse.id
      });
    }
    default:
      return new ChatMessage(message.content || "", message.role ?? "unknown");
  }
}
function _convertDeltaToMessageChunk(delta, rawResponse, defaultRole, includeRawResponse) {
  const role = delta.role ?? defaultRole;
  const content = delta.content ?? "";
  let additional_kwargs;
  if (delta.function_call) {
    additional_kwargs = {
      function_call: delta.function_call
    };
  } else if (delta.tool_calls) {
    additional_kwargs = {
      tool_calls: delta.tool_calls
    };
  } else {
    additional_kwargs = {};
  }
  if (includeRawResponse) {
    additional_kwargs.__raw_response = rawResponse;
  }
  if (delta.audio) {
    additional_kwargs.audio = __spreadProps(__spreadValues({}, delta.audio), {
      index: rawResponse.choices[0].index
    });
  }
  const response_metadata = {
    usage: __spreadValues({}, rawResponse.usage)
  };
  if (role === "user") {
    return new HumanMessageChunk({
      content,
      response_metadata
    });
  } else if (role === "assistant") {
    const toolCallChunks = [];
    if (Array.isArray(delta.tool_calls)) {
      for (const rawToolCall of delta.tool_calls) {
        toolCallChunks.push({
          name: rawToolCall.function?.name,
          args: rawToolCall.function?.arguments,
          id: rawToolCall.id,
          index: rawToolCall.index,
          type: "tool_call_chunk"
        });
      }
    }
    return new AIMessageChunk({
      content,
      tool_call_chunks: toolCallChunks,
      additional_kwargs,
      id: rawResponse.id,
      response_metadata
    });
  } else if (role === "system") {
    return new SystemMessageChunk({
      content,
      response_metadata
    });
  } else if (role === "function") {
    return new FunctionMessageChunk({
      content,
      additional_kwargs,
      name: delta.name,
      response_metadata
    });
  } else if (role === "tool") {
    return new ToolMessageChunk({
      content,
      additional_kwargs,
      tool_call_id: delta.tool_call_id,
      response_metadata
    });
  } else {
    return new ChatMessageChunk({
      content,
      role,
      response_metadata
    });
  }
}
function _convertMessagesToOpenAIParams(messages) {
  return messages.flatMap((message) => {
    const completionParam = {
      role: messageToOpenAIRole(message),
      content: message.content
    };
    if (message.name != null) {
      completionParam.name = message.name;
    }
    if (message.additional_kwargs.function_call != null) {
      completionParam.function_call = message.additional_kwargs.function_call;
      completionParam.content = null;
    }
    if (isAIMessage(message) && !!message.tool_calls?.length) {
      completionParam.tool_calls = message.tool_calls.map(convertLangChainToolCallToOpenAI);
      completionParam.content = null;
    } else {
      if (message.additional_kwargs.tool_calls != null) {
        completionParam.tool_calls = message.additional_kwargs.tool_calls;
      }
      if (message.tool_call_id != null) {
        completionParam.tool_call_id = message.tool_call_id;
      }
    }
    if (message.additional_kwargs.audio && typeof message.additional_kwargs.audio === "object" && "id" in message.additional_kwargs.audio) {
      const audioMessage = {
        role: "assistant",
        audio: {
          id: message.additional_kwargs.audio.id
        }
      };
      return [completionParam, audioMessage];
    }
    return completionParam;
  });
}
function _convertChatOpenAIToolTypeToOpenAITool(tool, fields) {
  if (isOpenAITool(tool)) {
    if (fields?.strict !== void 0) {
      return __spreadProps(__spreadValues({}, tool), {
        function: __spreadProps(__spreadValues({}, tool.function), {
          strict: fields.strict
        })
      });
    }
    return tool;
  }
  return _convertToOpenAITool(tool, fields);
}
var ChatOpenAI = class extends BaseChatModel {
  static lc_name() {
    return "ChatOpenAI";
  }
  get callKeys() {
    return [...super.callKeys, "options", "function_call", "functions", "tools", "tool_choice", "promptIndex", "response_format", "seed"];
  }
  get lc_secrets() {
    return {
      openAIApiKey: "OPENAI_API_KEY",
      apiKey: "OPENAI_API_KEY",
      azureOpenAIApiKey: "AZURE_OPENAI_API_KEY",
      organization: "OPENAI_ORGANIZATION"
    };
  }
  get lc_aliases() {
    return {
      modelName: "model",
      openAIApiKey: "openai_api_key",
      apiKey: "openai_api_key",
      azureOpenAIApiVersion: "azure_openai_api_version",
      azureOpenAIApiKey: "azure_openai_api_key",
      azureOpenAIApiInstanceName: "azure_openai_api_instance_name",
      azureOpenAIApiDeploymentName: "azure_openai_api_deployment_name"
    };
  }
  constructor(fields, configuration) {
    super(fields ?? {});
    Object.defineProperty(this, "lc_serializable", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: true
    });
    Object.defineProperty(this, "temperature", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 1
    });
    Object.defineProperty(this, "topP", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 1
    });
    Object.defineProperty(this, "frequencyPenalty", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 0
    });
    Object.defineProperty(this, "presencePenalty", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 0
    });
    Object.defineProperty(this, "n", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 1
    });
    Object.defineProperty(this, "logitBias", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "modelName", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "gpt-3.5-turbo"
    });
    Object.defineProperty(this, "model", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "gpt-3.5-turbo"
    });
    Object.defineProperty(this, "modelKwargs", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "stop", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "stopSequences", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "user", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "timeout", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "streaming", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: false
    });
    Object.defineProperty(this, "streamUsage", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: true
    });
    Object.defineProperty(this, "maxTokens", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "logprobs", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "topLogprobs", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "openAIApiKey", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "apiKey", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "azureOpenAIApiVersion", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "azureOpenAIApiKey", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "azureADTokenProvider", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "azureOpenAIApiInstanceName", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "azureOpenAIApiDeploymentName", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "azureOpenAIBasePath", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "azureOpenAIEndpoint", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "organization", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "__includeRawResponse", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "client", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "clientConfig", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "supportsStrictToolCalling", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "audio", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "modalities", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.openAIApiKey = fields?.apiKey ?? fields?.openAIApiKey ?? fields?.configuration?.apiKey ?? getEnvironmentVariable("OPENAI_API_KEY");
    this.apiKey = this.openAIApiKey;
    this.azureOpenAIApiKey = fields?.azureOpenAIApiKey ?? getEnvironmentVariable("AZURE_OPENAI_API_KEY");
    this.azureADTokenProvider = fields?.azureADTokenProvider ?? void 0;
    if (!this.azureOpenAIApiKey && !this.apiKey && !this.azureADTokenProvider) {
      throw new Error("OpenAI or Azure OpenAI API key or Token Provider not found");
    }
    this.azureOpenAIApiInstanceName = fields?.azureOpenAIApiInstanceName ?? getEnvironmentVariable("AZURE_OPENAI_API_INSTANCE_NAME");
    this.azureOpenAIApiDeploymentName = fields?.azureOpenAIApiDeploymentName ?? getEnvironmentVariable("AZURE_OPENAI_API_DEPLOYMENT_NAME");
    this.azureOpenAIApiVersion = fields?.azureOpenAIApiVersion ?? getEnvironmentVariable("AZURE_OPENAI_API_VERSION");
    this.azureOpenAIBasePath = fields?.azureOpenAIBasePath ?? getEnvironmentVariable("AZURE_OPENAI_BASE_PATH");
    this.organization = fields?.configuration?.organization ?? getEnvironmentVariable("OPENAI_ORGANIZATION");
    this.azureOpenAIEndpoint = fields?.azureOpenAIEndpoint ?? getEnvironmentVariable("AZURE_OPENAI_ENDPOINT");
    this.modelName = fields?.model ?? fields?.modelName ?? this.model;
    this.model = this.modelName;
    this.modelKwargs = fields?.modelKwargs ?? {};
    this.timeout = fields?.timeout;
    this.temperature = fields?.temperature ?? this.temperature;
    this.topP = fields?.topP ?? this.topP;
    this.frequencyPenalty = fields?.frequencyPenalty ?? this.frequencyPenalty;
    this.presencePenalty = fields?.presencePenalty ?? this.presencePenalty;
    this.maxTokens = fields?.maxTokens;
    this.logprobs = fields?.logprobs;
    this.topLogprobs = fields?.topLogprobs;
    this.n = fields?.n ?? this.n;
    this.logitBias = fields?.logitBias;
    this.stop = fields?.stopSequences ?? fields?.stop;
    this.stopSequences = this?.stop;
    this.user = fields?.user;
    this.__includeRawResponse = fields?.__includeRawResponse;
    this.audio = fields?.audio;
    this.modalities = fields?.modalities;
    if (this.azureOpenAIApiKey || this.azureADTokenProvider) {
      if (!this.azureOpenAIApiInstanceName && !this.azureOpenAIBasePath && !this.azureOpenAIEndpoint) {
        throw new Error("Azure OpenAI API instance name not found");
      }
      if (!this.azureOpenAIApiDeploymentName && this.azureOpenAIBasePath) {
        const parts = this.azureOpenAIBasePath.split("/openai/deployments/");
        if (parts.length === 2) {
          const [, deployment] = parts;
          this.azureOpenAIApiDeploymentName = deployment;
        }
      }
      if (!this.azureOpenAIApiDeploymentName) {
        throw new Error("Azure OpenAI API deployment name not found");
      }
      if (!this.azureOpenAIApiVersion) {
        throw new Error("Azure OpenAI API version not found");
      }
      this.apiKey = this.apiKey ?? "";
      this.streamUsage = false;
    }
    this.streaming = fields?.streaming ?? false;
    this.streamUsage = fields?.streamUsage ?? this.streamUsage;
    this.clientConfig = __spreadValues(__spreadValues({
      apiKey: this.apiKey,
      organization: this.organization,
      baseURL: configuration?.basePath ?? fields?.configuration?.basePath,
      dangerouslyAllowBrowser: true,
      defaultHeaders: configuration?.baseOptions?.headers ?? fields?.configuration?.baseOptions?.headers,
      defaultQuery: configuration?.baseOptions?.params ?? fields?.configuration?.baseOptions?.params
    }, configuration), fields?.configuration);
    if (fields?.supportsStrictToolCalling !== void 0) {
      this.supportsStrictToolCalling = fields.supportsStrictToolCalling;
    }
  }
  getLsParams(options) {
    const params = this.invocationParams(options);
    return {
      ls_provider: "openai",
      ls_model_name: this.model,
      ls_model_type: "chat",
      ls_temperature: params.temperature ?? void 0,
      ls_max_tokens: params.max_tokens ?? void 0,
      ls_stop: options.stop
    };
  }
  bindTools(tools, kwargs) {
    let strict;
    if (kwargs?.strict !== void 0) {
      strict = kwargs.strict;
    } else if (this.supportsStrictToolCalling !== void 0) {
      strict = this.supportsStrictToolCalling;
    }
    return this.bind(__spreadValues({
      tools: tools.map((tool) => _convertChatOpenAIToolTypeToOpenAITool(tool, {
        strict
      }))
    }, kwargs));
  }
  createResponseFormat(resFormat) {
    if (resFormat && resFormat.type === "json_schema" && resFormat.json_schema.schema && isZodSchema2(resFormat.json_schema.schema)) {
      return zodResponseFormat(resFormat.json_schema.schema, resFormat.json_schema.name, {
        description: resFormat.json_schema.description
      });
    }
    return resFormat;
  }
  /**
   * Get the parameters used to invoke the model
   */
  invocationParams(options, extra) {
    let strict;
    if (options?.strict !== void 0) {
      strict = options.strict;
    } else if (this.supportsStrictToolCalling !== void 0) {
      strict = this.supportsStrictToolCalling;
    }
    let streamOptionsConfig = {};
    if (options?.stream_options !== void 0) {
      streamOptionsConfig = {
        stream_options: options.stream_options
      };
    } else if (this.streamUsage && (this.streaming || extra?.streaming)) {
      streamOptionsConfig = {
        stream_options: {
          include_usage: true
        }
      };
    }
    const params = __spreadValues(__spreadValues(__spreadValues(__spreadProps(__spreadValues({
      model: this.model,
      temperature: this.temperature,
      top_p: this.topP,
      frequency_penalty: this.frequencyPenalty,
      presence_penalty: this.presencePenalty,
      max_tokens: this.maxTokens === -1 ? void 0 : this.maxTokens,
      logprobs: this.logprobs,
      top_logprobs: this.topLogprobs,
      n: this.n,
      logit_bias: this.logitBias,
      stop: options?.stop ?? this.stopSequences,
      user: this.user,
      // if include_usage is set or streamUsage then stream must be set to true.
      stream: this.streaming,
      functions: options?.functions,
      function_call: options?.function_call,
      tools: options?.tools?.length ? options.tools.map((tool) => _convertChatOpenAIToolTypeToOpenAITool(tool, {
        strict
      })) : void 0,
      tool_choice: formatToOpenAIToolChoice(options?.tool_choice),
      response_format: this.createResponseFormat(options?.response_format),
      seed: options?.seed
    }, streamOptionsConfig), {
      parallel_tool_calls: options?.parallel_tool_calls
    }), this.audio || options?.audio ? {
      audio: this.audio || options?.audio
    } : {}), this.modalities || options?.modalities ? {
      modalities: this.modalities || options?.modalities
    } : {}), this.modelKwargs);
    if (options?.prediction !== void 0) {
      params.prediction = options.prediction;
    }
    return params;
  }
  /** @ignore */
  _identifyingParams() {
    return __spreadValues(__spreadValues({
      model_name: this.model
    }, this.invocationParams()), this.clientConfig);
  }
  _streamResponseChunks(messages, options, runManager) {
    return __asyncGenerator(this, null, function* () {
      const messagesMapped = _convertMessagesToOpenAIParams(messages);
      const params = __spreadProps(__spreadValues({}, this.invocationParams(options, {
        streaming: true
      })), {
        messages: messagesMapped,
        stream: true
      });
      let defaultRole;
      const streamIterable = yield new __await(this.completionWithRetry(params, options));
      let usage;
      try {
        for (var iter = __forAwait(streamIterable), more, temp, error; more = !(temp = yield new __await(iter.next())).done; more = false) {
          const data = temp.value;
          const choice = data?.choices?.[0];
          if (data.usage) {
            usage = data.usage;
          }
          if (!choice) {
            continue;
          }
          const {
            delta
          } = choice;
          if (!delta) {
            continue;
          }
          const chunk = _convertDeltaToMessageChunk(delta, data, defaultRole, this.__includeRawResponse);
          defaultRole = delta.role ?? defaultRole;
          const newTokenIndices = {
            prompt: options.promptIndex ?? 0,
            completion: choice.index ?? 0
          };
          if (typeof chunk.content !== "string") {
            console.log("[WARNING]: Received non-string content from OpenAI. This is currently not supported.");
            continue;
          }
          const generationInfo = __spreadValues({}, newTokenIndices);
          if (choice.finish_reason != null) {
            generationInfo.finish_reason = choice.finish_reason;
            generationInfo.system_fingerprint = data.system_fingerprint;
          }
          if (this.logprobs) {
            generationInfo.logprobs = choice.logprobs;
          }
          const generationChunk = new ChatGenerationChunk({
            message: chunk,
            text: chunk.content,
            generationInfo
          });
          yield generationChunk;
          yield new __await(runManager?.handleLLMNewToken(generationChunk.text ?? "", newTokenIndices, void 0, void 0, void 0, {
            chunk: generationChunk
          }));
        }
      } catch (temp) {
        error = [temp];
      } finally {
        try {
          more && (temp = iter.return) && (yield new __await(temp.call(iter)));
        } finally {
          if (error)
            throw error[0];
        }
      }
      if (usage) {
        const inputTokenDetails = __spreadValues(__spreadValues({}, usage.prompt_tokens_details?.audio_tokens !== null && {
          audio: usage.prompt_tokens_details?.audio_tokens
        }), usage.prompt_tokens_details?.cached_tokens !== null && {
          cache_read: usage.prompt_tokens_details?.cached_tokens
        });
        const outputTokenDetails = __spreadValues(__spreadValues({}, usage.completion_tokens_details?.audio_tokens !== null && {
          audio: usage.completion_tokens_details?.audio_tokens
        }), usage.completion_tokens_details?.reasoning_tokens !== null && {
          reasoning: usage.completion_tokens_details?.reasoning_tokens
        });
        const generationChunk = new ChatGenerationChunk({
          message: new AIMessageChunk({
            content: "",
            response_metadata: {
              usage: __spreadValues({}, usage)
            },
            usage_metadata: __spreadValues(__spreadValues({
              input_tokens: usage.prompt_tokens,
              output_tokens: usage.completion_tokens,
              total_tokens: usage.total_tokens
            }, Object.keys(inputTokenDetails).length > 0 && {
              input_token_details: inputTokenDetails
            }), Object.keys(outputTokenDetails).length > 0 && {
              output_token_details: outputTokenDetails
            })
          }),
          text: ""
        });
        yield generationChunk;
      }
      if (options.signal?.aborted) {
        throw new Error("AbortError");
      }
    });
  }
  /**
   * Get the identifying parameters for the model
   *
   */
  identifyingParams() {
    return this._identifyingParams();
  }
  /** @ignore */
  _generate(messages, options, runManager) {
    return __async(this, null, function* () {
      const usageMetadata = {};
      const params = this.invocationParams(options);
      const messagesMapped = _convertMessagesToOpenAIParams(messages);
      if (params.stream) {
        const stream = this._streamResponseChunks(messages, options, runManager);
        const finalChunks = {};
        try {
          for (var iter = __forAwait(stream), more, temp, error; more = !(temp = yield iter.next()).done; more = false) {
            const chunk = temp.value;
            chunk.message.response_metadata = __spreadValues(__spreadValues({}, chunk.generationInfo), chunk.message.response_metadata);
            const index = chunk.generationInfo?.completion ?? 0;
            if (finalChunks[index] === void 0) {
              finalChunks[index] = chunk;
            } else {
              finalChunks[index] = finalChunks[index].concat(chunk);
            }
          }
        } catch (temp) {
          error = [temp];
        } finally {
          try {
            more && (temp = iter.return) && (yield temp.call(iter));
          } finally {
            if (error)
              throw error[0];
          }
        }
        const generations = Object.entries(finalChunks).sort(([aKey], [bKey]) => parseInt(aKey, 10) - parseInt(bKey, 10)).map(([_, value]) => value);
        const {
          functions,
          function_call
        } = this.invocationParams(options);
        const promptTokenUsage = yield this.getEstimatedTokenCountFromPrompt(messages, functions, function_call);
        const completionTokenUsage = yield this.getNumTokensFromGenerations(generations);
        usageMetadata.input_tokens = promptTokenUsage;
        usageMetadata.output_tokens = completionTokenUsage;
        usageMetadata.total_tokens = promptTokenUsage + completionTokenUsage;
        return {
          generations,
          llmOutput: {
            estimatedTokenUsage: {
              promptTokens: usageMetadata.input_tokens,
              completionTokens: usageMetadata.output_tokens,
              totalTokens: usageMetadata.total_tokens
            }
          }
        };
      } else {
        let data;
        if (options.response_format && options.response_format.type === "json_schema") {
          data = yield this.betaParsedCompletionWithRetry(__spreadProps(__spreadValues({}, params), {
            stream: false,
            messages: messagesMapped
          }), __spreadValues({
            signal: options?.signal
          }, options?.options));
        } else {
          data = yield this.completionWithRetry(__spreadProps(__spreadValues({}, params), {
            stream: false,
            messages: messagesMapped
          }), __spreadValues({
            signal: options?.signal
          }, options?.options));
        }
        const {
          completion_tokens: completionTokens,
          prompt_tokens: promptTokens,
          total_tokens: totalTokens,
          prompt_tokens_details: promptTokensDetails,
          completion_tokens_details: completionTokensDetails
        } = data?.usage ?? {};
        if (completionTokens) {
          usageMetadata.output_tokens = (usageMetadata.output_tokens ?? 0) + completionTokens;
        }
        if (promptTokens) {
          usageMetadata.input_tokens = (usageMetadata.input_tokens ?? 0) + promptTokens;
        }
        if (totalTokens) {
          usageMetadata.total_tokens = (usageMetadata.total_tokens ?? 0) + totalTokens;
        }
        if (promptTokensDetails?.audio_tokens !== null || promptTokensDetails?.cached_tokens !== null) {
          usageMetadata.input_token_details = __spreadValues(__spreadValues({}, promptTokensDetails?.audio_tokens !== null && {
            audio: promptTokensDetails?.audio_tokens
          }), promptTokensDetails?.cached_tokens !== null && {
            cache_read: promptTokensDetails?.cached_tokens
          });
        }
        if (completionTokensDetails?.audio_tokens !== null || completionTokensDetails?.reasoning_tokens !== null) {
          usageMetadata.output_token_details = __spreadValues(__spreadValues({}, completionTokensDetails?.audio_tokens !== null && {
            audio: completionTokensDetails?.audio_tokens
          }), completionTokensDetails?.reasoning_tokens !== null && {
            reasoning: completionTokensDetails?.reasoning_tokens
          });
        }
        const generations = [];
        for (const part of data?.choices ?? []) {
          const text = part.message?.content ?? "";
          const generation = {
            text,
            message: openAIResponseToChatMessage(part.message ?? {
              role: "assistant"
            }, data, this.__includeRawResponse)
          };
          generation.generationInfo = __spreadValues(__spreadValues({}, part.finish_reason ? {
            finish_reason: part.finish_reason
          } : {}), part.logprobs ? {
            logprobs: part.logprobs
          } : {});
          if (isAIMessage(generation.message)) {
            generation.message.usage_metadata = usageMetadata;
          }
          generation.message = new AIMessage(__spreadValues({}, generation.message));
          generations.push(generation);
        }
        return {
          generations,
          llmOutput: {
            tokenUsage: {
              promptTokens: usageMetadata.input_tokens,
              completionTokens: usageMetadata.output_tokens,
              totalTokens: usageMetadata.total_tokens
            }
          }
        };
      }
    });
  }
  /**
   * Estimate the number of tokens a prompt will use.
   * Modified from: https://github.com/hmarr/openai-chat-tokens/blob/main/src/index.ts
   */
  getEstimatedTokenCountFromPrompt(messages, functions, function_call) {
    return __async(this, null, function* () {
      let tokens = (yield this.getNumTokensFromMessages(messages)).totalCount;
      if (functions && function_call !== "auto") {
        const promptDefinitions = formatFunctionDefinitions(functions);
        tokens += yield this.getNumTokens(promptDefinitions);
        tokens += 9;
      }
      if (functions && messages.find((m) => m._getType() === "system")) {
        tokens -= 4;
      }
      if (function_call === "none") {
        tokens += 1;
      } else if (typeof function_call === "object") {
        tokens += (yield this.getNumTokens(function_call.name)) + 4;
      }
      return tokens;
    });
  }
  /**
   * Estimate the number of tokens an array of generations have used.
   */
  getNumTokensFromGenerations(generations) {
    return __async(this, null, function* () {
      const generationUsages = yield Promise.all(generations.map((generation) => __async(this, null, function* () {
        if (generation.message.additional_kwargs?.function_call) {
          return (yield this.getNumTokensFromMessages([generation.message])).countPerMessage[0];
        } else {
          return yield this.getNumTokens(generation.message.content);
        }
      })));
      return generationUsages.reduce((a, b) => a + b, 0);
    });
  }
  getNumTokensFromMessages(messages) {
    return __async(this, null, function* () {
      let totalCount = 0;
      let tokensPerMessage = 0;
      let tokensPerName = 0;
      if (this.model === "gpt-3.5-turbo-0301") {
        tokensPerMessage = 4;
        tokensPerName = -1;
      } else {
        tokensPerMessage = 3;
        tokensPerName = 1;
      }
      const countPerMessage = yield Promise.all(messages.map((message) => __async(this, null, function* () {
        const textCount = yield this.getNumTokens(message.content);
        const roleCount = yield this.getNumTokens(messageToOpenAIRole(message));
        const nameCount = message.name !== void 0 ? tokensPerName + (yield this.getNumTokens(message.name)) : 0;
        let count = textCount + tokensPerMessage + roleCount + nameCount;
        const openAIMessage = message;
        if (openAIMessage._getType() === "function") {
          count -= 2;
        }
        if (openAIMessage.additional_kwargs?.function_call) {
          count += 3;
        }
        if (openAIMessage?.additional_kwargs.function_call?.name) {
          count += yield this.getNumTokens(openAIMessage.additional_kwargs.function_call?.name);
        }
        if (openAIMessage.additional_kwargs.function_call?.arguments) {
          try {
            count += yield this.getNumTokens(
              // Remove newlines and spaces
              JSON.stringify(JSON.parse(openAIMessage.additional_kwargs.function_call?.arguments))
            );
          } catch (error) {
            console.error("Error parsing function arguments", error, JSON.stringify(openAIMessage.additional_kwargs.function_call));
            count += yield this.getNumTokens(openAIMessage.additional_kwargs.function_call?.arguments);
          }
        }
        totalCount += count;
        return count;
      })));
      totalCount += 3;
      return {
        totalCount,
        countPerMessage
      };
    });
  }
  completionWithRetry(request, options) {
    return __async(this, null, function* () {
      const requestOptions = this._getClientOptions(options);
      return this.caller.call(() => __async(this, null, function* () {
        try {
          const res = yield this.client.chat.completions.create(request, requestOptions);
          return res;
        } catch (e) {
          const error = wrapOpenAIClientError(e);
          throw error;
        }
      }));
    });
  }
  /**
   * Call the beta chat completions parse endpoint. This should only be called if
   * response_format is set to "json_object".
   * @param {OpenAIClient.Chat.ChatCompletionCreateParamsNonStreaming} request
   * @param {OpenAICoreRequestOptions | undefined} options
   */
  betaParsedCompletionWithRetry(request, options) {
    return __async(this, null, function* () {
      const requestOptions = this._getClientOptions(options);
      return this.caller.call(() => __async(this, null, function* () {
        try {
          const res = yield this.client.beta.chat.completions.parse(request, requestOptions);
          return res;
        } catch (e) {
          const error = wrapOpenAIClientError(e);
          throw error;
        }
      }));
    });
  }
  _getClientOptions(options) {
    if (!this.client) {
      const openAIEndpointConfig = {
        azureOpenAIApiDeploymentName: this.azureOpenAIApiDeploymentName,
        azureOpenAIApiInstanceName: this.azureOpenAIApiInstanceName,
        azureOpenAIApiKey: this.azureOpenAIApiKey,
        azureOpenAIBasePath: this.azureOpenAIBasePath,
        baseURL: this.clientConfig.baseURL,
        azureOpenAIEndpoint: this.azureOpenAIEndpoint
      };
      const endpoint = getEndpoint(openAIEndpointConfig);
      const params = __spreadProps(__spreadValues({}, this.clientConfig), {
        baseURL: endpoint,
        timeout: this.timeout,
        maxRetries: 0
      });
      if (!params.baseURL) {
        delete params.baseURL;
      }
      this.client = new OpenAI(params);
    }
    const requestOptions = __spreadValues(__spreadValues({}, this.clientConfig), options);
    if (this.azureOpenAIApiKey) {
      requestOptions.headers = __spreadValues({
        "api-key": this.azureOpenAIApiKey
      }, requestOptions.headers);
      requestOptions.query = __spreadValues({
        "api-version": this.azureOpenAIApiVersion
      }, requestOptions.query);
    }
    return requestOptions;
  }
  _llmType() {
    return "openai";
  }
  /** @ignore */
  _combineLLMOutput(...llmOutputs) {
    return llmOutputs.reduce((acc, llmOutput) => {
      if (llmOutput && llmOutput.tokenUsage) {
        acc.tokenUsage.completionTokens += llmOutput.tokenUsage.completionTokens ?? 0;
        acc.tokenUsage.promptTokens += llmOutput.tokenUsage.promptTokens ?? 0;
        acc.tokenUsage.totalTokens += llmOutput.tokenUsage.totalTokens ?? 0;
      }
      return acc;
    }, {
      tokenUsage: {
        completionTokens: 0,
        promptTokens: 0,
        totalTokens: 0
      }
    });
  }
  withStructuredOutput(outputSchema, config) {
    let schema;
    let name;
    let method;
    let includeRaw;
    if (isStructuredOutputMethodParams(outputSchema)) {
      schema = outputSchema.schema;
      name = outputSchema.name;
      method = outputSchema.method;
      includeRaw = outputSchema.includeRaw;
    } else {
      schema = outputSchema;
      name = config?.name;
      method = config?.method;
      includeRaw = config?.includeRaw;
    }
    let llm;
    let outputParser;
    if (config?.strict !== void 0 && method === "jsonMode") {
      throw new Error("Argument `strict` is only supported for `method` = 'function_calling'");
    }
    if (method === "jsonMode") {
      llm = this.bind({
        response_format: {
          type: "json_object"
        }
      });
      if (isZodSchema2(schema)) {
        outputParser = StructuredOutputParser.fromZodSchema(schema);
      } else {
        outputParser = new JsonOutputParser();
      }
    } else if (method === "jsonSchema") {
      llm = this.bind({
        response_format: {
          type: "json_schema",
          json_schema: {
            name: name ?? "extract",
            description: schema.description,
            schema,
            strict: config?.strict
          }
        }
      });
      if (isZodSchema2(schema)) {
        outputParser = StructuredOutputParser.fromZodSchema(schema);
      } else {
        outputParser = new JsonOutputParser();
      }
    } else {
      let functionName = name ?? "extract";
      if (isZodSchema2(schema)) {
        const asJsonSchema = zodToJsonSchema(schema);
        llm = this.bind(__spreadValues({
          tools: [{
            type: "function",
            function: {
              name: functionName,
              description: asJsonSchema.description,
              parameters: asJsonSchema
            }
          }],
          tool_choice: {
            type: "function",
            function: {
              name: functionName
            }
          }
        }, config?.strict !== void 0 ? {
          strict: config.strict
        } : {}));
        outputParser = new JsonOutputKeyToolsParser({
          returnSingle: true,
          keyName: functionName,
          zodSchema: schema
        });
      } else {
        let openAIFunctionDefinition;
        if (typeof schema.name === "string" && typeof schema.parameters === "object" && schema.parameters != null) {
          openAIFunctionDefinition = schema;
          functionName = schema.name;
        } else {
          functionName = schema.title ?? functionName;
          openAIFunctionDefinition = {
            name: functionName,
            description: schema.description ?? "",
            parameters: schema
          };
        }
        llm = this.bind(__spreadValues({
          tools: [{
            type: "function",
            function: openAIFunctionDefinition
          }],
          tool_choice: {
            type: "function",
            function: {
              name: functionName
            }
          }
        }, config?.strict !== void 0 ? {
          strict: config.strict
        } : {}));
        outputParser = new JsonOutputKeyToolsParser({
          returnSingle: true,
          keyName: functionName
        });
      }
    }
    if (!includeRaw) {
      return llm.pipe(outputParser);
    }
    const parserAssign = RunnablePassthrough.assign({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      parsed: (input, config2) => outputParser.invoke(input.raw, config2)
    });
    const parserNone = RunnablePassthrough.assign({
      parsed: () => null
    });
    const parsedWithFallback = parserAssign.withFallbacks({
      fallbacks: [parserNone]
    });
    return RunnableSequence.from([{
      raw: llm
    }, parsedWithFallback]);
  }
};
function isZodSchema2(input) {
  return typeof input?.parse === "function";
}
function isStructuredOutputMethodParams(x) {
  return x !== void 0 && // eslint-disable-next-line @typescript-eslint/no-explicit-any
  typeof x.schema === "object";
}

// node_modules/@langchain/openai/dist/azure/chat_models.js
var AzureChatOpenAI = class extends ChatOpenAI {
  _llmType() {
    return "azure_openai";
  }
  get lc_aliases() {
    return {
      openAIApiKey: "openai_api_key",
      openAIApiVersion: "openai_api_version",
      openAIBasePath: "openai_api_base",
      deploymentName: "deployment_name",
      azureOpenAIEndpoint: "azure_endpoint",
      azureOpenAIApiVersion: "openai_api_version",
      azureOpenAIBasePath: "openai_api_base",
      azureOpenAIApiDeploymentName: "deployment_name"
    };
  }
  constructor(fields) {
    const newFields = fields ? __spreadValues({}, fields) : fields;
    if (newFields) {
      newFields.azureOpenAIApiDeploymentName = newFields.azureOpenAIApiDeploymentName ?? newFields.deploymentName;
      newFields.azureOpenAIApiKey = newFields.azureOpenAIApiKey ?? newFields.openAIApiKey;
      newFields.azureOpenAIApiVersion = newFields.azureOpenAIApiVersion ?? newFields.openAIApiVersion;
    }
    super(newFields);
  }
  getLsParams(options) {
    const params = super.getLsParams(options);
    params.ls_provider = "azure";
    return params;
  }
  _getClientOptions(options) {
    if (!this.client) {
      const openAIEndpointConfig = {
        azureOpenAIApiDeploymentName: this.azureOpenAIApiDeploymentName,
        azureOpenAIApiInstanceName: this.azureOpenAIApiInstanceName,
        azureOpenAIApiKey: this.azureOpenAIApiKey,
        azureOpenAIBasePath: this.azureOpenAIBasePath,
        azureADTokenProvider: this.azureADTokenProvider,
        baseURL: this.clientConfig.baseURL,
        azureOpenAIEndpoint: this.azureOpenAIEndpoint
      };
      const endpoint = getEndpoint(openAIEndpointConfig);
      const params = __spreadProps(__spreadValues({}, this.clientConfig), {
        baseURL: endpoint,
        timeout: this.timeout,
        maxRetries: 0
      });
      if (!this.azureADTokenProvider) {
        params.apiKey = openAIEndpointConfig.azureOpenAIApiKey;
      }
      if (!params.baseURL) {
        delete params.baseURL;
      }
      params.defaultHeaders = __spreadProps(__spreadValues({}, params.defaultHeaders), {
        "User-Agent": params.defaultHeaders?.["User-Agent"] ? `${params.defaultHeaders["User-Agent"]}: langchainjs-azure-openai-v2` : `langchainjs-azure-openai-v2`
      });
      this.client = new AzureOpenAI(__spreadValues({
        apiVersion: this.azureOpenAIApiVersion,
        azureADTokenProvider: this.azureADTokenProvider,
        deployment: this.azureOpenAIApiDeploymentName
      }, params));
    }
    const requestOptions = __spreadValues(__spreadValues({}, this.clientConfig), options);
    if (this.azureOpenAIApiKey) {
      requestOptions.headers = __spreadValues({
        "api-key": this.azureOpenAIApiKey
      }, requestOptions.headers);
      requestOptions.query = __spreadValues({
        "api-version": this.azureOpenAIApiVersion
      }, requestOptions.query);
    }
    return requestOptions;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toJSON() {
    const json = super.toJSON();
    function isRecord(obj) {
      return typeof obj === "object" && obj != null;
    }
    if (isRecord(json) && isRecord(json.kwargs)) {
      delete json.kwargs.azure_openai_base_path;
      delete json.kwargs.azure_openai_api_deployment_name;
      delete json.kwargs.azure_openai_api_key;
      delete json.kwargs.azure_openai_api_version;
      delete json.kwargs.azure_open_ai_base_path;
      if (!json.kwargs.azure_endpoint && this.azureOpenAIEndpoint) {
        json.kwargs.azure_endpoint = this.azureOpenAIEndpoint;
      }
      if (!json.kwargs.azure_endpoint && this.azureOpenAIBasePath) {
        const parts = this.azureOpenAIBasePath.split("/openai/deployments/");
        if (parts.length === 2 && parts[0].startsWith("http")) {
          const [endpoint] = parts;
          json.kwargs.azure_endpoint = endpoint;
        }
      }
      if (!json.kwargs.azure_endpoint && this.azureOpenAIApiInstanceName) {
        json.kwargs.azure_endpoint = `https://${this.azureOpenAIApiInstanceName}.openai.azure.com/`;
      }
      if (!json.kwargs.deployment_name && this.azureOpenAIApiDeploymentName) {
        json.kwargs.deployment_name = this.azureOpenAIApiDeploymentName;
      }
      if (!json.kwargs.deployment_name && this.azureOpenAIBasePath) {
        const parts = this.azureOpenAIBasePath.split("/openai/deployments/");
        if (parts.length === 2) {
          const [, deployment] = parts;
          json.kwargs.deployment_name = deployment;
        }
      }
      if (json.kwargs.azure_endpoint && json.kwargs.deployment_name && json.kwargs.openai_api_base) {
        delete json.kwargs.openai_api_base;
      }
      if (json.kwargs.azure_openai_api_instance_name && json.kwargs.azure_endpoint) {
        delete json.kwargs.azure_openai_api_instance_name;
      }
    }
    return json;
  }
};

// node_modules/@langchain/core/dist/language_models/llms.js
var BaseLLM = class _BaseLLM extends BaseLanguageModel {
  constructor(_a2) {
    var _b = _a2, {
      concurrency
    } = _b, rest = __objRest(_b, [
      "concurrency"
    ]);
    super(concurrency ? __spreadValues({
      maxConcurrency: concurrency
    }, rest) : rest);
    Object.defineProperty(this, "lc_namespace", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: ["langchain", "llms", this._llmType()]
    });
  }
  /**
   * This method takes an input and options, and returns a string. It
   * converts the input to a prompt value and generates a result based on
   * the prompt.
   * @param input Input for the LLM.
   * @param options Options for the LLM call.
   * @returns A string result based on the prompt.
   */
  invoke(input, options) {
    return __async(this, null, function* () {
      const promptValue = _BaseLLM._convertInputToPromptValue(input);
      const result = yield this.generatePrompt([promptValue], options, options?.callbacks);
      return result.generations[0][0].text;
    });
  }
  // eslint-disable-next-line require-yield
  _streamResponseChunks(_input, _options, _runManager) {
    return __asyncGenerator(this, null, function* () {
      throw new Error("Not implemented.");
    });
  }
  _separateRunnableConfigFromCallOptionsCompat(options) {
    const [runnableConfig, callOptions] = super._separateRunnableConfigFromCallOptions(options);
    callOptions.signal = runnableConfig.signal;
    return [runnableConfig, callOptions];
  }
  _streamIterator(input, options) {
    return __asyncGenerator(this, null, function* () {
      if (this._streamResponseChunks === _BaseLLM.prototype._streamResponseChunks) {
        yield this.invoke(input, options);
      } else {
        const prompt = _BaseLLM._convertInputToPromptValue(input);
        const [runnableConfig, callOptions] = this._separateRunnableConfigFromCallOptionsCompat(options);
        const callbackManager_ = yield new __await(CallbackManager.configure(runnableConfig.callbacks, this.callbacks, runnableConfig.tags, this.tags, runnableConfig.metadata, this.metadata, {
          verbose: this.verbose
        }));
        const extra = {
          options: callOptions,
          invocation_params: this?.invocationParams(callOptions),
          batch_size: 1
        };
        const runManagers = yield new __await(callbackManager_?.handleLLMStart(this.toJSON(), [prompt.toString()], runnableConfig.runId, void 0, extra, void 0, void 0, runnableConfig.runName));
        let generation = new GenerationChunk({
          text: ""
        });
        try {
          try {
            for (var iter = __forAwait(this._streamResponseChunks(prompt.toString(), callOptions, runManagers?.[0])), more, temp, error; more = !(temp = yield new __await(iter.next())).done; more = false) {
              const chunk = temp.value;
              if (!generation) {
                generation = chunk;
              } else {
                generation = generation.concat(chunk);
              }
              if (typeof chunk.text === "string") {
                yield chunk.text;
              }
            }
          } catch (temp) {
            error = [temp];
          } finally {
            try {
              more && (temp = iter.return) && (yield new __await(temp.call(iter)));
            } finally {
              if (error)
                throw error[0];
            }
          }
        } catch (err) {
          yield new __await(Promise.all((runManagers ?? []).map((runManager) => runManager?.handleLLMError(err))));
          throw err;
        }
        yield new __await(Promise.all((runManagers ?? []).map((runManager) => runManager?.handleLLMEnd({
          generations: [[generation]]
        }))));
      }
    });
  }
  /**
   * This method takes prompt values, options, and callbacks, and generates
   * a result based on the prompts.
   * @param promptValues Prompt values for the LLM.
   * @param options Options for the LLM call.
   * @param callbacks Callbacks for the LLM call.
   * @returns An LLMResult based on the prompts.
   */
  generatePrompt(promptValues, options, callbacks) {
    return __async(this, null, function* () {
      const prompts = promptValues.map((promptValue) => promptValue.toString());
      return this.generate(prompts, options, callbacks);
    });
  }
  /**
   * Get the parameters used to invoke the model
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  invocationParams(_options) {
    return {};
  }
  _flattenLLMResult(llmResult) {
    const llmResults = [];
    for (let i = 0; i < llmResult.generations.length; i += 1) {
      const genList = llmResult.generations[i];
      if (i === 0) {
        llmResults.push({
          generations: [genList],
          llmOutput: llmResult.llmOutput
        });
      } else {
        const llmOutput = llmResult.llmOutput ? __spreadProps(__spreadValues({}, llmResult.llmOutput), {
          tokenUsage: {}
        }) : void 0;
        llmResults.push({
          generations: [genList],
          llmOutput
        });
      }
    }
    return llmResults;
  }
  /** @ignore */
  _generateUncached(prompts, parsedOptions, handledOptions) {
    return __async(this, null, function* () {
      const callbackManager_ = yield CallbackManager.configure(handledOptions.callbacks, this.callbacks, handledOptions.tags, this.tags, handledOptions.metadata, this.metadata, {
        verbose: this.verbose
      });
      const extra = {
        options: parsedOptions,
        invocation_params: this?.invocationParams(parsedOptions),
        batch_size: prompts.length
      };
      const runManagers = yield callbackManager_?.handleLLMStart(this.toJSON(), prompts, handledOptions.runId, void 0, extra, void 0, void 0, handledOptions?.runName);
      const hasStreamingHandler = !!runManagers?.[0].handlers.find((handler) => {
        return isStreamEventsHandler(handler) || isLogStreamHandler(handler);
      });
      let output;
      if (hasStreamingHandler && prompts.length === 1 && this._streamResponseChunks !== _BaseLLM.prototype._streamResponseChunks) {
        try {
          const stream = yield this._streamResponseChunks(prompts[0], parsedOptions, runManagers?.[0]);
          let aggregated;
          try {
            for (var iter = __forAwait(stream), more, temp, error; more = !(temp = yield iter.next()).done; more = false) {
              const chunk = temp.value;
              if (aggregated === void 0) {
                aggregated = chunk;
              } else {
                aggregated = concat(aggregated, chunk);
              }
            }
          } catch (temp) {
            error = [temp];
          } finally {
            try {
              more && (temp = iter.return) && (yield temp.call(iter));
            } finally {
              if (error)
                throw error[0];
            }
          }
          if (aggregated === void 0) {
            throw new Error("Received empty response from chat model call.");
          }
          output = {
            generations: [[aggregated]],
            llmOutput: {}
          };
          yield runManagers?.[0].handleLLMEnd(output);
        } catch (e) {
          yield runManagers?.[0].handleLLMError(e);
          throw e;
        }
      } else {
        try {
          output = yield this._generate(prompts, parsedOptions, runManagers?.[0]);
        } catch (err) {
          yield Promise.all((runManagers ?? []).map((runManager) => runManager?.handleLLMError(err)));
          throw err;
        }
        const flattenedOutputs = this._flattenLLMResult(output);
        yield Promise.all((runManagers ?? []).map((runManager, i) => runManager?.handleLLMEnd(flattenedOutputs[i])));
      }
      const runIds = runManagers?.map((manager) => manager.runId) || void 0;
      Object.defineProperty(output, RUN_KEY, {
        value: runIds ? {
          runIds
        } : void 0,
        configurable: true
      });
      return output;
    });
  }
  _generateCached(_0) {
    return __async(this, arguments, function* ({
      prompts,
      cache,
      llmStringKey,
      parsedOptions,
      handledOptions,
      runId
    }) {
      const callbackManager_ = yield CallbackManager.configure(handledOptions.callbacks, this.callbacks, handledOptions.tags, this.tags, handledOptions.metadata, this.metadata, {
        verbose: this.verbose
      });
      const extra = {
        options: parsedOptions,
        invocation_params: this?.invocationParams(parsedOptions),
        batch_size: prompts.length,
        cached: true
      };
      const runManagers = yield callbackManager_?.handleLLMStart(this.toJSON(), prompts, runId, void 0, extra, void 0, void 0, handledOptions?.runName);
      const missingPromptIndices = [];
      const results = yield Promise.allSettled(prompts.map((prompt, index) => __async(this, null, function* () {
        const result = yield cache.lookup(prompt, llmStringKey);
        if (result == null) {
          missingPromptIndices.push(index);
        }
        return result;
      })));
      const cachedResults = results.map((result, index) => ({
        result,
        runManager: runManagers?.[index]
      })).filter(({
        result
      }) => result.status === "fulfilled" && result.value != null || result.status === "rejected");
      const generations = [];
      yield Promise.all(cachedResults.map((_02, _1) => __async(this, [_02, _1], function* ({
        result: promiseResult,
        runManager
      }, i) {
        if (promiseResult.status === "fulfilled") {
          const result = promiseResult.value;
          generations[i] = result;
          if (result.length) {
            yield runManager?.handleLLMNewToken(result[0].text);
          }
          return runManager?.handleLLMEnd({
            generations: [result]
          });
        } else {
          yield runManager?.handleLLMError(promiseResult.reason);
          return Promise.reject(promiseResult.reason);
        }
      })));
      const output = {
        generations,
        missingPromptIndices
      };
      Object.defineProperty(output, RUN_KEY, {
        value: runManagers ? {
          runIds: runManagers?.map((manager) => manager.runId)
        } : void 0,
        configurable: true
      });
      return output;
    });
  }
  /**
   * Run the LLM on the given prompts and input, handling caching.
   */
  generate(prompts, options, callbacks) {
    return __async(this, null, function* () {
      if (!Array.isArray(prompts)) {
        throw new Error("Argument 'prompts' is expected to be a string[]");
      }
      let parsedOptions;
      if (Array.isArray(options)) {
        parsedOptions = {
          stop: options
        };
      } else {
        parsedOptions = options;
      }
      const [runnableConfig, callOptions] = this._separateRunnableConfigFromCallOptionsCompat(parsedOptions);
      runnableConfig.callbacks = runnableConfig.callbacks ?? callbacks;
      if (!this.cache) {
        return this._generateUncached(prompts, callOptions, runnableConfig);
      }
      const {
        cache
      } = this;
      const llmStringKey = this._getSerializedCacheKeyParametersForCall(callOptions);
      const {
        generations,
        missingPromptIndices
      } = yield this._generateCached({
        prompts,
        cache,
        llmStringKey,
        parsedOptions: callOptions,
        handledOptions: runnableConfig,
        runId: runnableConfig.runId
      });
      let llmOutput = {};
      if (missingPromptIndices.length > 0) {
        const results = yield this._generateUncached(missingPromptIndices.map((i) => prompts[i]), callOptions, runnableConfig);
        yield Promise.all(results.generations.map((generation, index) => __async(this, null, function* () {
          const promptIndex = missingPromptIndices[index];
          generations[promptIndex] = generation;
          return cache.update(prompts[promptIndex], llmStringKey, generation);
        })));
        llmOutput = results.llmOutput ?? {};
      }
      return {
        generations,
        llmOutput
      };
    });
  }
  /**
   * @deprecated Use .invoke() instead. Will be removed in 0.2.0.
   * Convenience wrapper for {@link generate} that takes in a single string prompt and returns a single string output.
   */
  call(prompt, options, callbacks) {
    return __async(this, null, function* () {
      const {
        generations
      } = yield this.generate([prompt], options, callbacks);
      return generations[0][0].text;
    });
  }
  /**
   * @deprecated Use .invoke() instead. Will be removed in 0.2.0.
   *
   * This method is similar to `call`, but it's used for making predictions
   * based on the input text.
   * @param text Input text for the prediction.
   * @param options Options for the LLM call.
   * @param callbacks Callbacks for the LLM call.
   * @returns A prediction based on the input text.
   */
  predict(text, options, callbacks) {
    return __async(this, null, function* () {
      return this.call(text, options, callbacks);
    });
  }
  /**
   * @deprecated Use .invoke() instead. Will be removed in 0.2.0.
   *
   * This method takes a list of messages, options, and callbacks, and
   * returns a predicted message.
   * @param messages A list of messages for the prediction.
   * @param options Options for the LLM call.
   * @param callbacks Callbacks for the LLM call.
   * @returns A predicted message based on the list of messages.
   */
  predictMessages(messages, options, callbacks) {
    return __async(this, null, function* () {
      const text = getBufferString(messages);
      const prediction = yield this.call(text, options, callbacks);
      return new AIMessage(prediction);
    });
  }
  /**
   * Get the identifying parameters of the LLM.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _identifyingParams() {
    return {};
  }
  /**
   * @deprecated
   * Return a json-like object representing this LLM.
   */
  serialize() {
    return __spreadProps(__spreadValues({}, this._identifyingParams()), {
      _type: this._llmType(),
      _model: this._modelType()
    });
  }
  _modelType() {
    return "base_llm";
  }
};
var LLM = class extends BaseLLM {
  _generate(prompts, options, runManager) {
    return __async(this, null, function* () {
      const generations = yield Promise.all(prompts.map((prompt, promptIndex) => this._call(prompt, __spreadProps(__spreadValues({}, options), {
        promptIndex
      }), runManager).then((text) => [{
        text
      }])));
      return {
        generations
      };
    });
  }
};

// node_modules/@langchain/core/dist/utils/chunk_array.js
var chunkArray = (arr, chunkSize) => arr.reduce((chunks, elem, index) => {
  const chunkIndex = Math.floor(index / chunkSize);
  const chunk = chunks[chunkIndex] || [];
  chunks[chunkIndex] = chunk.concat([elem]);
  return chunks;
}, []);

// node_modules/@langchain/openai/dist/legacy.js
var OpenAIChat = class extends LLM {
  static lc_name() {
    return "OpenAIChat";
  }
  get callKeys() {
    return [...super.callKeys, "options", "promptIndex"];
  }
  get lc_secrets() {
    return {
      openAIApiKey: "OPENAI_API_KEY",
      azureOpenAIApiKey: "AZURE_OPENAI_API_KEY",
      organization: "OPENAI_ORGANIZATION"
    };
  }
  get lc_aliases() {
    return {
      modelName: "model",
      openAIApiKey: "openai_api_key",
      azureOpenAIApiVersion: "azure_openai_api_version",
      azureOpenAIApiKey: "azure_openai_api_key",
      azureOpenAIApiInstanceName: "azure_openai_api_instance_name",
      azureOpenAIApiDeploymentName: "azure_openai_api_deployment_name"
    };
  }
  constructor(fields, configuration) {
    super(fields ?? {});
    Object.defineProperty(this, "lc_serializable", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: true
    });
    Object.defineProperty(this, "temperature", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 1
    });
    Object.defineProperty(this, "topP", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 1
    });
    Object.defineProperty(this, "frequencyPenalty", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 0
    });
    Object.defineProperty(this, "presencePenalty", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 0
    });
    Object.defineProperty(this, "n", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 1
    });
    Object.defineProperty(this, "logitBias", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "maxTokens", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "modelName", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "gpt-3.5-turbo"
    });
    Object.defineProperty(this, "model", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "gpt-3.5-turbo"
    });
    Object.defineProperty(this, "prefixMessages", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "modelKwargs", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "timeout", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "stop", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "user", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "streaming", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: false
    });
    Object.defineProperty(this, "openAIApiKey", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "azureOpenAIApiVersion", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "azureOpenAIApiKey", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "azureOpenAIApiInstanceName", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "azureOpenAIApiDeploymentName", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "azureOpenAIBasePath", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "organization", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "client", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "clientConfig", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.openAIApiKey = fields?.apiKey ?? fields?.openAIApiKey ?? getEnvironmentVariable("OPENAI_API_KEY");
    this.azureOpenAIApiKey = fields?.azureOpenAIApiKey ?? getEnvironmentVariable("AZURE_OPENAI_API_KEY");
    if (!this.azureOpenAIApiKey && !this.openAIApiKey) {
      throw new Error("OpenAI or Azure OpenAI API key not found");
    }
    this.azureOpenAIApiInstanceName = fields?.azureOpenAIApiInstanceName ?? getEnvironmentVariable("AZURE_OPENAI_API_INSTANCE_NAME");
    this.azureOpenAIApiDeploymentName = (fields?.azureOpenAIApiCompletionsDeploymentName || fields?.azureOpenAIApiDeploymentName) ?? (getEnvironmentVariable("AZURE_OPENAI_API_COMPLETIONS_DEPLOYMENT_NAME") || getEnvironmentVariable("AZURE_OPENAI_API_DEPLOYMENT_NAME"));
    this.azureOpenAIApiVersion = fields?.azureOpenAIApiVersion ?? getEnvironmentVariable("AZURE_OPENAI_API_VERSION");
    this.azureOpenAIBasePath = fields?.azureOpenAIBasePath ?? getEnvironmentVariable("AZURE_OPENAI_BASE_PATH");
    this.organization = fields?.configuration?.organization ?? getEnvironmentVariable("OPENAI_ORGANIZATION");
    this.modelName = fields?.model ?? fields?.modelName ?? this.modelName;
    this.prefixMessages = fields?.prefixMessages ?? this.prefixMessages;
    this.modelKwargs = fields?.modelKwargs ?? {};
    this.timeout = fields?.timeout;
    this.temperature = fields?.temperature ?? this.temperature;
    this.topP = fields?.topP ?? this.topP;
    this.frequencyPenalty = fields?.frequencyPenalty ?? this.frequencyPenalty;
    this.presencePenalty = fields?.presencePenalty ?? this.presencePenalty;
    this.n = fields?.n ?? this.n;
    this.logitBias = fields?.logitBias;
    this.maxTokens = fields?.maxTokens;
    this.stop = fields?.stop;
    this.user = fields?.user;
    this.streaming = fields?.streaming ?? false;
    if (this.n > 1) {
      throw new Error("Cannot use n > 1 in OpenAIChat LLM. Use ChatOpenAI Chat Model instead.");
    }
    if (this.azureOpenAIApiKey) {
      if (!this.azureOpenAIApiInstanceName && !this.azureOpenAIBasePath) {
        throw new Error("Azure OpenAI API instance name not found");
      }
      if (!this.azureOpenAIApiDeploymentName) {
        throw new Error("Azure OpenAI API deployment name not found");
      }
      if (!this.azureOpenAIApiVersion) {
        throw new Error("Azure OpenAI API version not found");
      }
      this.openAIApiKey = this.openAIApiKey ?? "";
    }
    this.clientConfig = __spreadValues(__spreadValues({
      apiKey: this.openAIApiKey,
      organization: this.organization,
      baseURL: configuration?.basePath ?? fields?.configuration?.basePath,
      dangerouslyAllowBrowser: true,
      defaultHeaders: configuration?.baseOptions?.headers ?? fields?.configuration?.baseOptions?.headers,
      defaultQuery: configuration?.baseOptions?.params ?? fields?.configuration?.baseOptions?.params
    }, configuration), fields?.configuration);
  }
  /**
   * Get the parameters used to invoke the model
   */
  invocationParams(options) {
    return __spreadValues({
      model: this.modelName,
      temperature: this.temperature,
      top_p: this.topP,
      frequency_penalty: this.frequencyPenalty,
      presence_penalty: this.presencePenalty,
      n: this.n,
      logit_bias: this.logitBias,
      max_tokens: this.maxTokens === -1 ? void 0 : this.maxTokens,
      stop: options?.stop ?? this.stop,
      user: this.user,
      stream: this.streaming
    }, this.modelKwargs);
  }
  /** @ignore */
  _identifyingParams() {
    return __spreadValues(__spreadValues({
      model_name: this.modelName
    }, this.invocationParams()), this.clientConfig);
  }
  /**
   * Get the identifying parameters for the model
   */
  identifyingParams() {
    return __spreadValues(__spreadValues({
      model_name: this.modelName
    }, this.invocationParams()), this.clientConfig);
  }
  /**
   * Formats the messages for the OpenAI API.
   * @param prompt The prompt to be formatted.
   * @returns Array of formatted messages.
   */
  formatMessages(prompt) {
    const message = {
      role: "user",
      content: prompt
    };
    return this.prefixMessages ? [...this.prefixMessages, message] : [message];
  }
  _streamResponseChunks(prompt, options, runManager) {
    return __asyncGenerator(this, null, function* () {
      const params = __spreadProps(__spreadValues({}, this.invocationParams(options)), {
        messages: this.formatMessages(prompt),
        stream: true
      });
      const stream = yield new __await(this.completionWithRetry(params, options));
      try {
        for (var iter = __forAwait(stream), more, temp, error; more = !(temp = yield new __await(iter.next())).done; more = false) {
          const data = temp.value;
          const choice = data?.choices[0];
          if (!choice) {
            continue;
          }
          const {
            delta
          } = choice;
          const generationChunk = new GenerationChunk({
            text: delta.content ?? ""
          });
          yield generationChunk;
          const newTokenIndices = {
            prompt: options.promptIndex ?? 0,
            completion: choice.index ?? 0
          };
          void runManager?.handleLLMNewToken(generationChunk.text ?? "", newTokenIndices);
        }
      } catch (temp) {
        error = [temp];
      } finally {
        try {
          more && (temp = iter.return) && (yield new __await(temp.call(iter)));
        } finally {
          if (error)
            throw error[0];
        }
      }
      if (options.signal?.aborted) {
        throw new Error("AbortError");
      }
    });
  }
  /** @ignore */
  _call(prompt, options, runManager) {
    return __async(this, null, function* () {
      const params = this.invocationParams(options);
      if (params.stream) {
        const stream = yield this._streamResponseChunks(prompt, options, runManager);
        let finalChunk;
        try {
          for (var iter = __forAwait(stream), more, temp, error; more = !(temp = yield iter.next()).done; more = false) {
            const chunk = temp.value;
            if (finalChunk === void 0) {
              finalChunk = chunk;
            } else {
              finalChunk = finalChunk.concat(chunk);
            }
          }
        } catch (temp) {
          error = [temp];
        } finally {
          try {
            more && (temp = iter.return) && (yield temp.call(iter));
          } finally {
            if (error)
              throw error[0];
          }
        }
        return finalChunk?.text ?? "";
      } else {
        const response = yield this.completionWithRetry(__spreadProps(__spreadValues({}, params), {
          stream: false,
          messages: this.formatMessages(prompt)
        }), __spreadValues({
          signal: options.signal
        }, options.options));
        return response?.choices[0]?.message?.content ?? "";
      }
    });
  }
  completionWithRetry(request, options) {
    return __async(this, null, function* () {
      const requestOptions = this._getClientOptions(options);
      return this.caller.call(() => __async(this, null, function* () {
        try {
          const res = yield this.client.chat.completions.create(request, requestOptions);
          return res;
        } catch (e) {
          const error = wrapOpenAIClientError(e);
          throw error;
        }
      }));
    });
  }
  /** @ignore */
  _getClientOptions(options) {
    if (!this.client) {
      const openAIEndpointConfig = {
        azureOpenAIApiDeploymentName: this.azureOpenAIApiDeploymentName,
        azureOpenAIApiInstanceName: this.azureOpenAIApiInstanceName,
        azureOpenAIApiKey: this.azureOpenAIApiKey,
        azureOpenAIBasePath: this.azureOpenAIBasePath,
        baseURL: this.clientConfig.baseURL
      };
      const endpoint = getEndpoint(openAIEndpointConfig);
      const params = __spreadProps(__spreadValues({}, this.clientConfig), {
        baseURL: endpoint,
        timeout: this.timeout,
        maxRetries: 0
      });
      if (!params.baseURL) {
        delete params.baseURL;
      }
      this.client = new OpenAI(params);
    }
    const requestOptions = __spreadValues(__spreadValues({}, this.clientConfig), options);
    if (this.azureOpenAIApiKey) {
      requestOptions.headers = __spreadValues({
        "api-key": this.azureOpenAIApiKey
      }, requestOptions.headers);
      requestOptions.query = __spreadValues({
        "api-version": this.azureOpenAIApiVersion
      }, requestOptions.query);
    }
    return requestOptions;
  }
  _llmType() {
    return "openai";
  }
};

// node_modules/@langchain/openai/dist/llms.js
var OpenAI2 = class extends BaseLLM {
  static lc_name() {
    return "OpenAI";
  }
  get callKeys() {
    return [...super.callKeys, "options"];
  }
  get lc_secrets() {
    return {
      openAIApiKey: "OPENAI_API_KEY",
      apiKey: "OPENAI_API_KEY",
      azureOpenAIApiKey: "AZURE_OPENAI_API_KEY",
      organization: "OPENAI_ORGANIZATION"
    };
  }
  get lc_aliases() {
    return {
      modelName: "model",
      openAIApiKey: "openai_api_key",
      apiKey: "openai_api_key",
      azureOpenAIApiVersion: "azure_openai_api_version",
      azureOpenAIApiKey: "azure_openai_api_key",
      azureOpenAIApiInstanceName: "azure_openai_api_instance_name",
      azureOpenAIApiDeploymentName: "azure_openai_api_deployment_name"
    };
  }
  constructor(fields, configuration) {
    let model = fields?.model ?? fields?.modelName;
    if ((model?.startsWith("gpt-3.5-turbo") || model?.startsWith("gpt-4")) && !model?.includes("-instruct")) {
      console.warn([`Your chosen OpenAI model, "${model}", is a chat model and not a text-in/text-out LLM.`, `Passing it into the "OpenAI" class is deprecated and only permitted for backwards-compatibility. You may experience odd behavior.`, `Please use the "ChatOpenAI" class instead.`, "", `See this page for more information:`, "|", `└> https://js.langchain.com/docs/integrations/chat/openai`].join("\n"));
      return new OpenAIChat(fields, configuration);
    }
    super(fields ?? {});
    Object.defineProperty(this, "lc_serializable", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: true
    });
    Object.defineProperty(this, "temperature", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 0.7
    });
    Object.defineProperty(this, "maxTokens", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 256
    });
    Object.defineProperty(this, "topP", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 1
    });
    Object.defineProperty(this, "frequencyPenalty", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 0
    });
    Object.defineProperty(this, "presencePenalty", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 0
    });
    Object.defineProperty(this, "n", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 1
    });
    Object.defineProperty(this, "bestOf", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "logitBias", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "modelName", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "gpt-3.5-turbo-instruct"
    });
    Object.defineProperty(this, "model", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "gpt-3.5-turbo-instruct"
    });
    Object.defineProperty(this, "modelKwargs", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "batchSize", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 20
    });
    Object.defineProperty(this, "timeout", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "stop", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "stopSequences", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "user", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "streaming", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: false
    });
    Object.defineProperty(this, "openAIApiKey", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "apiKey", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "azureOpenAIApiVersion", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "azureOpenAIApiKey", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "azureADTokenProvider", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "azureOpenAIApiInstanceName", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "azureOpenAIApiDeploymentName", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "azureOpenAIBasePath", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "organization", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "client", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "clientConfig", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    model = model ?? this.model;
    this.openAIApiKey = fields?.apiKey ?? fields?.openAIApiKey ?? getEnvironmentVariable("OPENAI_API_KEY");
    this.apiKey = this.openAIApiKey;
    this.azureOpenAIApiKey = fields?.azureOpenAIApiKey ?? getEnvironmentVariable("AZURE_OPENAI_API_KEY");
    this.azureADTokenProvider = fields?.azureADTokenProvider ?? void 0;
    if (!this.azureOpenAIApiKey && !this.apiKey && !this.azureADTokenProvider) {
      throw new Error("OpenAI or Azure OpenAI API key or Token Provider not found");
    }
    this.azureOpenAIApiInstanceName = fields?.azureOpenAIApiInstanceName ?? getEnvironmentVariable("AZURE_OPENAI_API_INSTANCE_NAME");
    this.azureOpenAIApiDeploymentName = (fields?.azureOpenAIApiCompletionsDeploymentName || fields?.azureOpenAIApiDeploymentName) ?? (getEnvironmentVariable("AZURE_OPENAI_API_COMPLETIONS_DEPLOYMENT_NAME") || getEnvironmentVariable("AZURE_OPENAI_API_DEPLOYMENT_NAME"));
    this.azureOpenAIApiVersion = fields?.azureOpenAIApiVersion ?? getEnvironmentVariable("AZURE_OPENAI_API_VERSION");
    this.azureOpenAIBasePath = fields?.azureOpenAIBasePath ?? getEnvironmentVariable("AZURE_OPENAI_BASE_PATH");
    this.organization = fields?.configuration?.organization ?? getEnvironmentVariable("OPENAI_ORGANIZATION");
    this.modelName = model;
    this.model = model;
    this.modelKwargs = fields?.modelKwargs ?? {};
    this.batchSize = fields?.batchSize ?? this.batchSize;
    this.timeout = fields?.timeout;
    this.temperature = fields?.temperature ?? this.temperature;
    this.maxTokens = fields?.maxTokens ?? this.maxTokens;
    this.topP = fields?.topP ?? this.topP;
    this.frequencyPenalty = fields?.frequencyPenalty ?? this.frequencyPenalty;
    this.presencePenalty = fields?.presencePenalty ?? this.presencePenalty;
    this.n = fields?.n ?? this.n;
    this.bestOf = fields?.bestOf ?? this.bestOf;
    this.logitBias = fields?.logitBias;
    this.stop = fields?.stopSequences ?? fields?.stop;
    this.stopSequences = fields?.stopSequences;
    this.user = fields?.user;
    this.streaming = fields?.streaming ?? false;
    if (this.streaming && this.bestOf && this.bestOf > 1) {
      throw new Error("Cannot stream results when bestOf > 1");
    }
    if (this.azureOpenAIApiKey || this.azureADTokenProvider) {
      if (!this.azureOpenAIApiInstanceName && !this.azureOpenAIBasePath) {
        throw new Error("Azure OpenAI API instance name not found");
      }
      if (!this.azureOpenAIApiDeploymentName) {
        throw new Error("Azure OpenAI API deployment name not found");
      }
      if (!this.azureOpenAIApiVersion) {
        throw new Error("Azure OpenAI API version not found");
      }
      this.apiKey = this.apiKey ?? "";
    }
    this.clientConfig = __spreadValues(__spreadValues({
      apiKey: this.apiKey,
      organization: this.organization,
      baseURL: configuration?.basePath ?? fields?.configuration?.basePath,
      dangerouslyAllowBrowser: true,
      defaultHeaders: configuration?.baseOptions?.headers ?? fields?.configuration?.baseOptions?.headers,
      defaultQuery: configuration?.baseOptions?.params ?? fields?.configuration?.baseOptions?.params
    }, configuration), fields?.configuration);
  }
  /**
   * Get the parameters used to invoke the model
   */
  invocationParams(options) {
    return __spreadValues({
      model: this.model,
      temperature: this.temperature,
      max_tokens: this.maxTokens,
      top_p: this.topP,
      frequency_penalty: this.frequencyPenalty,
      presence_penalty: this.presencePenalty,
      n: this.n,
      best_of: this.bestOf,
      logit_bias: this.logitBias,
      stop: options?.stop ?? this.stopSequences,
      user: this.user,
      stream: this.streaming
    }, this.modelKwargs);
  }
  /** @ignore */
  _identifyingParams() {
    return __spreadValues(__spreadValues({
      model_name: this.model
    }, this.invocationParams()), this.clientConfig);
  }
  /**
   * Get the identifying parameters for the model
   */
  identifyingParams() {
    return this._identifyingParams();
  }
  /**
   * Call out to OpenAI's endpoint with k unique prompts
   *
   * @param [prompts] - The prompts to pass into the model.
   * @param [options] - Optional list of stop words to use when generating.
   * @param [runManager] - Optional callback manager to use when generating.
   *
   * @returns The full LLM output.
   *
   * @example
   * ```ts
   * import { OpenAI } from "langchain/llms/openai";
   * const openai = new OpenAI();
   * const response = await openai.generate(["Tell me a joke."]);
   * ```
   */
  _generate(prompts, options, runManager) {
    return __async(this, null, function* () {
      const subPrompts = chunkArray(prompts, this.batchSize);
      const choices = [];
      const tokenUsage = {};
      const params = this.invocationParams(options);
      if (params.max_tokens === -1) {
        if (prompts.length !== 1) {
          throw new Error("max_tokens set to -1 not supported for multiple inputs");
        }
        params.max_tokens = yield calculateMaxTokens({
          prompt: prompts[0],
          // Cast here to allow for other models that may not fit the union
          modelName: this.model
        });
      }
      for (let i = 0; i < subPrompts.length; i += 1) {
        const data = params.stream ? yield (() => __async(this, null, function* () {
          const choices2 = [];
          let response;
          const stream = yield this.completionWithRetry(__spreadProps(__spreadValues({}, params), {
            stream: true,
            prompt: subPrompts[i]
          }), options);
          try {
            for (var iter = __forAwait(stream), more, temp, error; more = !(temp = yield iter.next()).done; more = false) {
              const message = temp.value;
              if (!response) {
                response = {
                  id: message.id,
                  object: message.object,
                  created: message.created,
                  model: message.model
                };
              }
              for (const part of message.choices) {
                if (!choices2[part.index]) {
                  choices2[part.index] = part;
                } else {
                  const choice = choices2[part.index];
                  choice.text += part.text;
                  choice.finish_reason = part.finish_reason;
                  choice.logprobs = part.logprobs;
                }
                void runManager?.handleLLMNewToken(part.text, {
                  prompt: Math.floor(part.index / this.n),
                  completion: part.index % this.n
                });
              }
            }
          } catch (temp) {
            error = [temp];
          } finally {
            try {
              more && (temp = iter.return) && (yield temp.call(iter));
            } finally {
              if (error)
                throw error[0];
            }
          }
          if (options.signal?.aborted) {
            throw new Error("AbortError");
          }
          return __spreadProps(__spreadValues({}, response), {
            choices: choices2
          });
        }))() : yield this.completionWithRetry(__spreadProps(__spreadValues({}, params), {
          stream: false,
          prompt: subPrompts[i]
        }), __spreadValues({
          signal: options.signal
        }, options.options));
        choices.push(...data.choices);
        const {
          completion_tokens: completionTokens,
          prompt_tokens: promptTokens,
          total_tokens: totalTokens
        } = data.usage ? data.usage : {
          completion_tokens: void 0,
          prompt_tokens: void 0,
          total_tokens: void 0
        };
        if (completionTokens) {
          tokenUsage.completionTokens = (tokenUsage.completionTokens ?? 0) + completionTokens;
        }
        if (promptTokens) {
          tokenUsage.promptTokens = (tokenUsage.promptTokens ?? 0) + promptTokens;
        }
        if (totalTokens) {
          tokenUsage.totalTokens = (tokenUsage.totalTokens ?? 0) + totalTokens;
        }
      }
      const generations = chunkArray(choices, this.n).map((promptChoices) => promptChoices.map((choice) => ({
        text: choice.text ?? "",
        generationInfo: {
          finishReason: choice.finish_reason,
          logprobs: choice.logprobs
        }
      })));
      return {
        generations,
        llmOutput: {
          tokenUsage
        }
      };
    });
  }
  // TODO(jacoblee): Refactor with _generate(..., {stream: true}) implementation?
  _streamResponseChunks(input, options, runManager) {
    return __asyncGenerator(this, null, function* () {
      const params = __spreadProps(__spreadValues({}, this.invocationParams(options)), {
        prompt: input,
        stream: true
      });
      const stream = yield new __await(this.completionWithRetry(params, options));
      try {
        for (var iter = __forAwait(stream), more, temp, error; more = !(temp = yield new __await(iter.next())).done; more = false) {
          const data = temp.value;
          const choice = data?.choices[0];
          if (!choice) {
            continue;
          }
          const chunk = new GenerationChunk({
            text: choice.text,
            generationInfo: {
              finishReason: choice.finish_reason
            }
          });
          yield chunk;
          void runManager?.handleLLMNewToken(chunk.text ?? "");
        }
      } catch (temp) {
        error = [temp];
      } finally {
        try {
          more && (temp = iter.return) && (yield new __await(temp.call(iter)));
        } finally {
          if (error)
            throw error[0];
        }
      }
      if (options.signal?.aborted) {
        throw new Error("AbortError");
      }
    });
  }
  completionWithRetry(request, options) {
    return __async(this, null, function* () {
      const requestOptions = this._getClientOptions(options);
      return this.caller.call(() => __async(this, null, function* () {
        try {
          const res = yield this.client.completions.create(request, requestOptions);
          return res;
        } catch (e) {
          const error = wrapOpenAIClientError(e);
          throw error;
        }
      }));
    });
  }
  /**
   * Calls the OpenAI API with retry logic in case of failures.
   * @param request The request to send to the OpenAI API.
   * @param options Optional configuration for the API call.
   * @returns The response from the OpenAI API.
   */
  _getClientOptions(options) {
    if (!this.client) {
      const openAIEndpointConfig = {
        azureOpenAIApiDeploymentName: this.azureOpenAIApiDeploymentName,
        azureOpenAIApiInstanceName: this.azureOpenAIApiInstanceName,
        azureOpenAIApiKey: this.azureOpenAIApiKey,
        azureOpenAIBasePath: this.azureOpenAIBasePath,
        baseURL: this.clientConfig.baseURL
      };
      const endpoint = getEndpoint(openAIEndpointConfig);
      const params = __spreadProps(__spreadValues({}, this.clientConfig), {
        baseURL: endpoint,
        timeout: this.timeout,
        maxRetries: 0
      });
      if (!params.baseURL) {
        delete params.baseURL;
      }
      this.client = new OpenAI(params);
    }
    const requestOptions = __spreadValues(__spreadValues({}, this.clientConfig), options);
    if (this.azureOpenAIApiKey) {
      requestOptions.headers = __spreadValues({
        "api-key": this.azureOpenAIApiKey
      }, requestOptions.headers);
      requestOptions.query = __spreadValues({
        "api-version": this.azureOpenAIApiVersion
      }, requestOptions.query);
    }
    return requestOptions;
  }
  _llmType() {
    return "openai";
  }
};

// node_modules/@langchain/openai/dist/azure/llms.js
var AzureOpenAI2 = class extends OpenAI2 {
  get lc_aliases() {
    return {
      openAIApiKey: "openai_api_key",
      openAIApiVersion: "openai_api_version",
      openAIBasePath: "openai_api_base"
    };
  }
  constructor(fields) {
    const newFields = fields ? __spreadValues({}, fields) : fields;
    if (newFields) {
      newFields.azureOpenAIApiDeploymentName = newFields.azureOpenAIApiDeploymentName ?? newFields.deploymentName;
      newFields.azureOpenAIApiKey = newFields.azureOpenAIApiKey ?? newFields.openAIApiKey;
      newFields.azureOpenAIApiVersion = newFields.azureOpenAIApiVersion ?? newFields.openAIApiVersion;
    }
    super(newFields);
  }
  _getClientOptions(options) {
    if (!this.client) {
      const openAIEndpointConfig = {
        azureOpenAIApiDeploymentName: this.azureOpenAIApiDeploymentName,
        azureOpenAIApiInstanceName: this.azureOpenAIApiInstanceName,
        azureOpenAIApiKey: this.azureOpenAIApiKey,
        azureOpenAIBasePath: this.azureOpenAIBasePath,
        azureADTokenProvider: this.azureADTokenProvider,
        baseURL: this.clientConfig.baseURL
      };
      const endpoint = getEndpoint(openAIEndpointConfig);
      const params = __spreadProps(__spreadValues({}, this.clientConfig), {
        baseURL: endpoint,
        timeout: this.timeout,
        maxRetries: 0
      });
      if (!this.azureADTokenProvider) {
        params.apiKey = openAIEndpointConfig.azureOpenAIApiKey;
      }
      if (!params.baseURL) {
        delete params.baseURL;
      }
      params.defaultHeaders = __spreadProps(__spreadValues({}, params.defaultHeaders), {
        "User-Agent": params.defaultHeaders?.["User-Agent"] ? `${params.defaultHeaders["User-Agent"]}: langchainjs-azure-openai-v2` : `langchainjs-azure-openai-v2`
      });
      this.client = new AzureOpenAI(__spreadValues({
        apiVersion: this.azureOpenAIApiVersion,
        azureADTokenProvider: this.azureADTokenProvider
      }, params));
    }
    const requestOptions = __spreadValues(__spreadValues({}, this.clientConfig), options);
    if (this.azureOpenAIApiKey) {
      requestOptions.headers = __spreadValues({
        "api-key": this.azureOpenAIApiKey
      }, requestOptions.headers);
      requestOptions.query = __spreadValues({
        "api-version": this.azureOpenAIApiVersion
      }, requestOptions.query);
    }
    return requestOptions;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toJSON() {
    const json = super.toJSON();
    function isRecord(obj) {
      return typeof obj === "object" && obj != null;
    }
    if (isRecord(json) && isRecord(json.kwargs)) {
      delete json.kwargs.azure_openai_base_path;
      delete json.kwargs.azure_openai_api_deployment_name;
      delete json.kwargs.azure_openai_api_key;
      delete json.kwargs.azure_openai_api_version;
      delete json.kwargs.azure_open_ai_base_path;
    }
    return json;
  }
};

// node_modules/@langchain/core/dist/embeddings.js
var Embeddings2 = class {
  constructor(params) {
    Object.defineProperty(this, "caller", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.caller = new AsyncCaller(params ?? {});
  }
};

// node_modules/@langchain/openai/dist/embeddings.js
var OpenAIEmbeddings = class extends Embeddings2 {
  constructor(fields, configuration) {
    const fieldsWithDefaults = __spreadValues({
      maxConcurrency: 2
    }, fields);
    super(fieldsWithDefaults);
    Object.defineProperty(this, "modelName", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "text-embedding-ada-002"
    });
    Object.defineProperty(this, "model", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "text-embedding-ada-002"
    });
    Object.defineProperty(this, "batchSize", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 512
    });
    Object.defineProperty(this, "stripNewLines", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: true
    });
    Object.defineProperty(this, "dimensions", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "timeout", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "azureOpenAIApiVersion", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "azureOpenAIApiKey", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "azureADTokenProvider", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "azureOpenAIApiInstanceName", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "azureOpenAIApiDeploymentName", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "azureOpenAIBasePath", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "organization", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "client", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "clientConfig", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    let apiKey = fieldsWithDefaults?.apiKey ?? fieldsWithDefaults?.openAIApiKey ?? getEnvironmentVariable("OPENAI_API_KEY");
    const azureApiKey = fieldsWithDefaults?.azureOpenAIApiKey ?? getEnvironmentVariable("AZURE_OPENAI_API_KEY");
    this.azureADTokenProvider = fields?.azureADTokenProvider ?? void 0;
    if (!azureApiKey && !apiKey && !this.azureADTokenProvider) {
      throw new Error("OpenAI or Azure OpenAI API key or Token Provider not found");
    }
    const azureApiInstanceName = fieldsWithDefaults?.azureOpenAIApiInstanceName ?? getEnvironmentVariable("AZURE_OPENAI_API_INSTANCE_NAME");
    const azureApiDeploymentName = (fieldsWithDefaults?.azureOpenAIApiEmbeddingsDeploymentName || fieldsWithDefaults?.azureOpenAIApiDeploymentName) ?? (getEnvironmentVariable("AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME") || getEnvironmentVariable("AZURE_OPENAI_API_DEPLOYMENT_NAME"));
    const azureApiVersion = fieldsWithDefaults?.azureOpenAIApiVersion ?? getEnvironmentVariable("AZURE_OPENAI_API_VERSION");
    this.azureOpenAIBasePath = fieldsWithDefaults?.azureOpenAIBasePath ?? getEnvironmentVariable("AZURE_OPENAI_BASE_PATH");
    this.organization = fieldsWithDefaults?.configuration?.organization ?? getEnvironmentVariable("OPENAI_ORGANIZATION");
    this.modelName = fieldsWithDefaults?.model ?? fieldsWithDefaults?.modelName ?? this.model;
    this.model = this.modelName;
    this.batchSize = fieldsWithDefaults?.batchSize ?? (azureApiKey ? 1 : this.batchSize);
    this.stripNewLines = fieldsWithDefaults?.stripNewLines ?? this.stripNewLines;
    this.timeout = fieldsWithDefaults?.timeout;
    this.dimensions = fieldsWithDefaults?.dimensions;
    this.azureOpenAIApiVersion = azureApiVersion;
    this.azureOpenAIApiKey = azureApiKey;
    this.azureOpenAIApiInstanceName = azureApiInstanceName;
    this.azureOpenAIApiDeploymentName = azureApiDeploymentName;
    if (this.azureOpenAIApiKey || this.azureADTokenProvider) {
      if (!this.azureOpenAIApiInstanceName && !this.azureOpenAIBasePath) {
        throw new Error("Azure OpenAI API instance name not found");
      }
      if (!this.azureOpenAIApiDeploymentName) {
        throw new Error("Azure OpenAI API deployment name not found");
      }
      if (!this.azureOpenAIApiVersion) {
        throw new Error("Azure OpenAI API version not found");
      }
      apiKey = apiKey ?? "";
    }
    this.clientConfig = __spreadValues(__spreadValues({
      apiKey,
      organization: this.organization,
      baseURL: configuration?.basePath,
      dangerouslyAllowBrowser: true,
      defaultHeaders: configuration?.baseOptions?.headers,
      defaultQuery: configuration?.baseOptions?.params
    }, configuration), fields?.configuration);
  }
  /**
   * Method to generate embeddings for an array of documents. Splits the
   * documents into batches and makes requests to the OpenAI API to generate
   * embeddings.
   * @param texts Array of documents to generate embeddings for.
   * @returns Promise that resolves to a 2D array of embeddings for each document.
   */
  embedDocuments(texts) {
    return __async(this, null, function* () {
      const batches = chunkArray(this.stripNewLines ? texts.map((t) => t.replace(/\n/g, " ")) : texts, this.batchSize);
      const batchRequests = batches.map((batch) => {
        const params = {
          model: this.model,
          input: batch
        };
        if (this.dimensions) {
          params.dimensions = this.dimensions;
        }
        return this.embeddingWithRetry(params);
      });
      const batchResponses = yield Promise.all(batchRequests);
      const embeddings = [];
      for (let i = 0; i < batchResponses.length; i += 1) {
        const batch = batches[i];
        const {
          data: batchResponse
        } = batchResponses[i];
        for (let j = 0; j < batch.length; j += 1) {
          embeddings.push(batchResponse[j].embedding);
        }
      }
      return embeddings;
    });
  }
  /**
   * Method to generate an embedding for a single document. Calls the
   * embeddingWithRetry method with the document as the input.
   * @param text Document to generate an embedding for.
   * @returns Promise that resolves to an embedding for the document.
   */
  embedQuery(text) {
    return __async(this, null, function* () {
      const params = {
        model: this.model,
        input: this.stripNewLines ? text.replace(/\n/g, " ") : text
      };
      if (this.dimensions) {
        params.dimensions = this.dimensions;
      }
      const {
        data
      } = yield this.embeddingWithRetry(params);
      return data[0].embedding;
    });
  }
  /**
   * Private method to make a request to the OpenAI API to generate
   * embeddings. Handles the retry logic and returns the response from the
   * API.
   * @param request Request to send to the OpenAI API.
   * @returns Promise that resolves to the response from the API.
   */
  embeddingWithRetry(request) {
    return __async(this, null, function* () {
      if (!this.client) {
        const openAIEndpointConfig = {
          azureOpenAIApiDeploymentName: this.azureOpenAIApiDeploymentName,
          azureOpenAIApiInstanceName: this.azureOpenAIApiInstanceName,
          azureOpenAIApiKey: this.azureOpenAIApiKey,
          azureOpenAIBasePath: this.azureOpenAIBasePath,
          baseURL: this.clientConfig.baseURL
        };
        const endpoint = getEndpoint(openAIEndpointConfig);
        const params = __spreadProps(__spreadValues({}, this.clientConfig), {
          baseURL: endpoint,
          timeout: this.timeout,
          maxRetries: 0
        });
        if (!params.baseURL) {
          delete params.baseURL;
        }
        this.client = new OpenAI(params);
      }
      const requestOptions = {};
      if (this.azureOpenAIApiKey) {
        requestOptions.headers = __spreadValues({
          "api-key": this.azureOpenAIApiKey
        }, requestOptions.headers);
        requestOptions.query = __spreadValues({
          "api-version": this.azureOpenAIApiVersion
        }, requestOptions.query);
      }
      return this.caller.call(() => __async(this, null, function* () {
        try {
          const res = yield this.client.embeddings.create(request, requestOptions);
          return res;
        } catch (e) {
          const error = wrapOpenAIClientError(e);
          throw error;
        }
      }));
    });
  }
};

// node_modules/@langchain/openai/dist/azure/embeddings.js
var AzureOpenAIEmbeddings = class extends OpenAIEmbeddings {
  constructor(fields, configuration) {
    const newFields = __spreadValues({}, fields);
    if (Object.entries(newFields).length) {
      newFields.azureOpenAIApiDeploymentName = newFields.azureOpenAIApiDeploymentName ?? newFields.deploymentName;
      newFields.azureOpenAIApiKey = newFields.azureOpenAIApiKey ?? newFields.apiKey;
      newFields.azureOpenAIApiVersion = newFields.azureOpenAIApiVersion ?? newFields.openAIApiVersion;
    }
    super(newFields, configuration);
  }
  embeddingWithRetry(request) {
    return __async(this, null, function* () {
      if (!this.client) {
        const openAIEndpointConfig = {
          azureOpenAIApiDeploymentName: this.azureOpenAIApiDeploymentName,
          azureOpenAIApiInstanceName: this.azureOpenAIApiInstanceName,
          azureOpenAIApiKey: this.azureOpenAIApiKey,
          azureOpenAIBasePath: this.azureOpenAIBasePath,
          azureADTokenProvider: this.azureADTokenProvider,
          baseURL: this.clientConfig.baseURL
        };
        const endpoint = getEndpoint(openAIEndpointConfig);
        const params = __spreadProps(__spreadValues({}, this.clientConfig), {
          baseURL: endpoint,
          timeout: this.timeout,
          maxRetries: 0
        });
        if (!this.azureADTokenProvider) {
          params.apiKey = openAIEndpointConfig.azureOpenAIApiKey;
        }
        if (!params.baseURL) {
          delete params.baseURL;
        }
        params.defaultHeaders = __spreadProps(__spreadValues({}, params.defaultHeaders), {
          "User-Agent": params.defaultHeaders?.["User-Agent"] ? `${params.defaultHeaders["User-Agent"]}: langchainjs-azure-openai-v2` : `langchainjs-azure-openai-v2`
        });
        this.client = new AzureOpenAI(__spreadValues({
          apiVersion: this.azureOpenAIApiVersion,
          azureADTokenProvider: this.azureADTokenProvider,
          deployment: this.azureOpenAIApiDeploymentName
        }, params));
      }
      const requestOptions = {};
      if (this.azureOpenAIApiKey) {
        requestOptions.headers = __spreadValues({
          "api-key": this.azureOpenAIApiKey
        }, requestOptions.headers);
        requestOptions.query = __spreadValues({
          "api-version": this.azureOpenAIApiVersion
        }, requestOptions.query);
      }
      return this.caller.call(() => __async(this, null, function* () {
        try {
          const res = yield this.client.embeddings.create(request, requestOptions);
          return res;
        } catch (e) {
          const error = wrapOpenAIClientError(e);
          throw error;
        }
      }));
    });
  }
};

// node_modules/@langchain/core/dist/tools/index.js
var StructuredTool = class extends BaseLangChain {
  get lc_namespace() {
    return ["langchain", "tools"];
  }
  constructor(fields) {
    super(fields ?? {});
    Object.defineProperty(this, "returnDirect", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: false
    });
    Object.defineProperty(this, "verboseParsingErrors", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: false
    });
    Object.defineProperty(this, "responseFormat", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "content"
    });
    this.verboseParsingErrors = fields?.verboseParsingErrors ?? this.verboseParsingErrors;
    this.responseFormat = fields?.responseFormat ?? this.responseFormat;
  }
  /**
   * Invokes the tool with the provided input and configuration.
   * @param input The input for the tool.
   * @param config Optional configuration for the tool.
   * @returns A Promise that resolves with a string.
   */
  invoke(input, config) {
    return __async(this, null, function* () {
      let tool_call_id;
      let toolInput;
      if (_isToolCall(input)) {
        tool_call_id = input.id;
        toolInput = input.args;
      } else {
        toolInput = input;
      }
      const ensuredConfig = ensureConfig(config);
      return this.call(toolInput, __spreadProps(__spreadValues({}, ensuredConfig), {
        configurable: __spreadProps(__spreadValues({}, ensuredConfig.configurable), {
          tool_call_id
        })
      }));
    });
  }
  /**
   * @deprecated Use .invoke() instead. Will be removed in 0.3.0.
   *
   * Calls the tool with the provided argument, configuration, and tags. It
   * parses the input according to the schema, handles any errors, and
   * manages callbacks.
   * @param arg The input argument for the tool.
   * @param configArg Optional configuration or callbacks for the tool.
   * @param tags Optional tags for the tool.
   * @returns A Promise that resolves with a string.
   */
  call(arg, configArg, tags) {
    return __async(this, null, function* () {
      let parsed;
      try {
        parsed = yield this.schema.parseAsync(arg);
      } catch (e) {
        let message = `Received tool input did not match expected schema`;
        if (this.verboseParsingErrors) {
          message = `${message}
Details: ${e.message}`;
        }
        throw new ToolInputParsingException(message, JSON.stringify(arg));
      }
      const config = parseCallbackConfigArg(configArg);
      const callbackManager_ = yield CallbackManager.configure(config.callbacks, this.callbacks, config.tags || tags, this.tags, config.metadata, this.metadata, {
        verbose: this.verbose
      });
      const runManager = yield callbackManager_?.handleToolStart(this.toJSON(), typeof parsed === "string" ? parsed : JSON.stringify(parsed), config.runId, void 0, void 0, void 0, config.runName);
      delete config.runId;
      let result;
      try {
        result = yield this._call(parsed, runManager, config);
      } catch (e) {
        yield runManager?.handleToolError(e);
        throw e;
      }
      let content;
      let artifact;
      if (this.responseFormat === "content_and_artifact") {
        if (Array.isArray(result) && result.length === 2) {
          [content, artifact] = result;
        } else {
          throw new Error(`Tool response format is "content_and_artifact" but the output was not a two-tuple.
Result: ${JSON.stringify(result)}`);
        }
      } else {
        content = result;
      }
      let toolCallId;
      if (config && "configurable" in config) {
        toolCallId = config.configurable.tool_call_id;
      }
      const formattedOutput = _formatToolOutput({
        content,
        artifact,
        toolCallId,
        name: this.name
      });
      yield runManager?.handleToolEnd(formattedOutput);
      return formattedOutput;
    });
  }
};
var Tool = class extends StructuredTool {
  constructor(fields) {
    super(fields);
    Object.defineProperty(this, "schema", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: z.object({
        input: z.string().optional()
      }).transform((obj) => obj.input)
    });
  }
  /**
   * @deprecated Use .invoke() instead. Will be removed in 0.3.0.
   *
   * Calls the tool with the provided argument and callbacks. It handles
   * string inputs specifically.
   * @param arg The input argument for the tool, which can be a string, undefined, or an input of the tool's schema.
   * @param callbacks Optional callbacks for the tool.
   * @returns A Promise that resolves with a string.
   */
  call(arg, callbacks) {
    return super.call(typeof arg === "string" || !arg ? {
      input: arg
    } : arg, callbacks);
  }
};
function _formatToolOutput(params) {
  const {
    content,
    artifact,
    toolCallId
  } = params;
  if (toolCallId) {
    if (typeof content === "string" || Array.isArray(content) && content.every((item) => typeof item === "object")) {
      return new ToolMessage({
        content,
        artifact,
        tool_call_id: toolCallId,
        name: params.name
      });
    } else {
      return new ToolMessage({
        content: _stringify(content),
        artifact,
        tool_call_id: toolCallId,
        name: params.name
      });
    }
  } else {
    return content;
  }
}
function _stringify(content) {
  try {
    return JSON.stringify(content, null, 2);
  } catch (_noOp) {
    return `${content}`;
  }
}

// node_modules/@langchain/openai/dist/tools/dalle.js
var DallEAPIWrapper = class extends Tool {
  static lc_name() {
    return "DallEAPIWrapper";
  }
  constructor(fields) {
    if (fields?.responseFormat !== void 0 && ["url", "b64_json"].includes(fields.responseFormat)) {
      fields.dallEResponseFormat = fields.responseFormat;
      fields.responseFormat = "content";
    }
    super(fields);
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "dalle_api_wrapper"
    });
    Object.defineProperty(this, "description", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "A wrapper around OpenAI DALL-E API. Useful for when you need to generate images from a text description. Input should be an image description."
    });
    Object.defineProperty(this, "client", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "model", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "dall-e-3"
    });
    Object.defineProperty(this, "style", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "vivid"
    });
    Object.defineProperty(this, "quality", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "standard"
    });
    Object.defineProperty(this, "n", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 1
    });
    Object.defineProperty(this, "size", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "1024x1024"
    });
    Object.defineProperty(this, "dallEResponseFormat", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "url"
    });
    Object.defineProperty(this, "user", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    const openAIApiKey = fields?.apiKey ?? fields?.openAIApiKey ?? getEnvironmentVariable("OPENAI_API_KEY");
    const organization = fields?.organization ?? getEnvironmentVariable("OPENAI_ORGANIZATION");
    const clientConfig = {
      apiKey: openAIApiKey,
      organization,
      dangerouslyAllowBrowser: true,
      baseUrl: fields?.baseUrl
    };
    this.client = new OpenAI(clientConfig);
    this.model = fields?.model ?? fields?.modelName ?? this.model;
    this.style = fields?.style ?? this.style;
    this.quality = fields?.quality ?? this.quality;
    this.n = fields?.n ?? this.n;
    this.size = fields?.size ?? this.size;
    this.dallEResponseFormat = fields?.dallEResponseFormat ?? this.dallEResponseFormat;
    this.user = fields?.user;
  }
  /**
   * Processes the API response if multiple images are generated.
   * Returns a list of MessageContentImageUrl objects. If the response
   * format is `url`, then the `image_url` field will contain the URL.
   * If it is `b64_json`, then the `image_url` field will contain an object
   * with a `url` field with the base64 encoded image.
   *
   * @param {OpenAIClient.Images.ImagesResponse[]} response The API response
   * @returns {MessageContentImageUrl[]}
   */
  processMultipleGeneratedUrls(response) {
    if (this.dallEResponseFormat === "url") {
      return response.flatMap((res) => {
        const imageUrlContent = res.data.flatMap((item) => {
          if (!item.url) return [];
          return {
            type: "image_url",
            image_url: item.url
          };
        }).filter((item) => item !== void 0 && item.type === "image_url" && typeof item.image_url === "string" && item.image_url !== void 0);
        return imageUrlContent;
      });
    } else {
      return response.flatMap((res) => {
        const b64Content = res.data.flatMap((item) => {
          if (!item.b64_json) return [];
          return {
            type: "image_url",
            image_url: {
              url: item.b64_json
            }
          };
        }).filter((item) => item !== void 0 && item.type === "image_url" && typeof item.image_url === "object" && "url" in item.image_url && typeof item.image_url.url === "string" && item.image_url.url !== void 0);
        return b64Content;
      });
    }
  }
  /** @ignore */
  _call(input) {
    return __async(this, null, function* () {
      const generateImageFields = {
        model: this.model,
        prompt: input,
        n: 1,
        size: this.size,
        response_format: this.dallEResponseFormat,
        style: this.style,
        quality: this.quality,
        user: this.user
      };
      if (this.n > 1) {
        const results = yield Promise.all(Array.from({
          length: this.n
        }).map(() => this.client.images.generate(generateImageFields)));
        return this.processMultipleGeneratedUrls(results);
      }
      const response = yield this.client.images.generate(generateImageFields);
      let data = "";
      if (this.dallEResponseFormat === "url") {
        [data] = response.data.map((item) => item.url).filter((url) => url !== "undefined");
      } else {
        [data] = response.data.map((item) => item.b64_json).filter((b64_json) => b64_json !== "undefined");
      }
      return data;
    });
  }
};
Object.defineProperty(DallEAPIWrapper, "toolName", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: "dalle_api_wrapper"
});

// node_modules/@langchain/openai/dist/utils/prompts.js
function convertPromptToOpenAI(formattedPrompt) {
  const messages = formattedPrompt.toChatMessages();
  return {
    messages: _convertMessagesToOpenAIParams(messages)
  };
}

export {
  toFile,
  OpenAI,
  getEndpoint,
  convertToOpenAIFunction,
  convertToOpenAITool,
  wrapOpenAIClientError,
  formatToOpenAIAssistantTool,
  formatToOpenAIToolChoice,
  messageToOpenAIRole,
  _convertMessagesToOpenAIParams,
  ChatOpenAI,
  AzureChatOpenAI,
  OpenAIChat,
  OpenAI2,
  AzureOpenAI2 as AzureOpenAI,
  OpenAIEmbeddings,
  AzureOpenAIEmbeddings,
  DallEAPIWrapper,
  convertPromptToOpenAI
};
//# sourceMappingURL=chunk-UTOM2OGH.js.map
