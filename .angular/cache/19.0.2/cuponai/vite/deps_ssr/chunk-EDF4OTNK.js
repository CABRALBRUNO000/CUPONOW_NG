import { createRequire } from 'module';const require = createRequire(import.meta.url);
import {
  ChatGenerationChunk,
  GenerationChunk,
  Runnable,
  addLangChainErrorFields,
  compare,
  convertToChunk,
  isBaseMessage,
  isBaseMessageChunk,
  parseJsonMarkdown,
  z,
  zodToJsonSchema
} from "./chunk-APP2RMRU.js";
import {
  __async,
  __asyncGenerator,
  __await,
  __forAwait,
  __spreadProps,
  __spreadValues,
  __yieldStar
} from "./chunk-LKDWXENB.js";

// node_modules/@langchain/core/dist/output_parsers/base.js
var BaseLLMOutputParser = class extends Runnable {
  /**
   * Parses the result of an LLM call with a given prompt. By default, it
   * simply calls `parseResult`.
   * @param generations The generations from an LLM call.
   * @param _prompt The prompt used in the LLM call.
   * @param callbacks Optional callbacks.
   * @returns A promise of the parsed output.
   */
  parseResultWithPrompt(generations, _prompt, callbacks) {
    return this.parseResult(generations, callbacks);
  }
  _baseMessageToString(message) {
    return typeof message.content === "string" ? message.content : this._baseMessageContentToString(message.content);
  }
  _baseMessageContentToString(content) {
    return JSON.stringify(content);
  }
  /**
   * Calls the parser with a given input and optional configuration options.
   * If the input is a string, it creates a generation with the input as
   * text and calls `parseResult`. If the input is a `BaseMessage`, it
   * creates a generation with the input as a message and the content of the
   * input as text, and then calls `parseResult`.
   * @param input The input to the parser, which can be a string or a `BaseMessage`.
   * @param options Optional configuration options.
   * @returns A promise of the parsed output.
   */
  invoke(input, options) {
    return __async(this, null, function* () {
      if (typeof input === "string") {
        return this._callWithConfig((input2, options2) => __async(this, null, function* () {
          return this.parseResult([{
            text: input2
          }], options2?.callbacks);
        }), input, __spreadProps(__spreadValues({}, options), {
          runType: "parser"
        }));
      } else {
        return this._callWithConfig((input2, options2) => __async(this, null, function* () {
          return this.parseResult([{
            message: input2,
            text: this._baseMessageToString(input2)
          }], options2?.callbacks);
        }), input, __spreadProps(__spreadValues({}, options), {
          runType: "parser"
        }));
      }
    });
  }
};
var BaseOutputParser = class extends BaseLLMOutputParser {
  parseResult(generations, callbacks) {
    return this.parse(generations[0].text, callbacks);
  }
  parseWithPrompt(text, _prompt, callbacks) {
    return __async(this, null, function* () {
      return this.parse(text, callbacks);
    });
  }
  /**
   * Return the string type key uniquely identifying this class of parser
   */
  _type() {
    throw new Error("_type not implemented");
  }
};
var OutputParserException = class extends Error {
  constructor(message, llmOutput, observation, sendToLLM = false) {
    super(message);
    Object.defineProperty(this, "llmOutput", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "observation", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "sendToLLM", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.llmOutput = llmOutput;
    this.observation = observation;
    this.sendToLLM = sendToLLM;
    if (sendToLLM) {
      if (observation === void 0 || llmOutput === void 0) {
        throw new Error("Arguments 'observation' & 'llmOutput' are required if 'sendToLlm' is true");
      }
    }
    addLangChainErrorFields(this, "OUTPUT_PARSING_FAILURE");
  }
};

// node_modules/@langchain/core/dist/output_parsers/structured.js
var StructuredOutputParser = class extends BaseOutputParser {
  static lc_name() {
    return "StructuredOutputParser";
  }
  toJSON() {
    return this.toJSONNotImplemented();
  }
  constructor(schema) {
    super(schema);
    Object.defineProperty(this, "schema", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: schema
    });
    Object.defineProperty(this, "lc_namespace", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: ["langchain", "output_parsers", "structured"]
    });
  }
  /**
   * Creates a new StructuredOutputParser from a Zod schema.
   * @param schema The Zod schema which the output should match
   * @returns A new instance of StructuredOutputParser.
   */
  static fromZodSchema(schema) {
    return new this(schema);
  }
  /**
   * Creates a new StructuredOutputParser from a set of names and
   * descriptions.
   * @param schemas An object where each key is a name and each value is a description
   * @returns A new instance of StructuredOutputParser.
   */
  static fromNamesAndDescriptions(schemas) {
    const zodSchema = z.object(Object.fromEntries(Object.entries(schemas).map(([name, description]) => [name, z.string().describe(description)])));
    return new this(zodSchema);
  }
  /**
   * Returns a markdown code snippet with a JSON object formatted according
   * to the schema.
   * @param options Optional. The options for formatting the instructions
   * @returns A markdown code snippet with a JSON object formatted according to the schema.
   */
  getFormatInstructions() {
    return `You must format your output as a JSON value that adheres to a given "JSON Schema" instance.

"JSON Schema" is a declarative language that allows you to annotate and validate JSON documents.

For example, the example "JSON Schema" instance {{"properties": {{"foo": {{"description": "a list of test words", "type": "array", "items": {{"type": "string"}}}}}}, "required": ["foo"]}}}}
would match an object with one required property, "foo". The "type" property specifies "foo" must be an "array", and the "description" property semantically describes it as "a list of test words". The items within "foo" must be strings.
Thus, the object {{"foo": ["bar", "baz"]}} is a well-formatted instance of this example "JSON Schema". The object {{"properties": {{"foo": ["bar", "baz"]}}}} is not well-formatted.

Your output will be parsed and type-checked according to the provided schema instance, so make sure all fields in your output match the schema exactly and there are no trailing commas!

Here is the JSON Schema instance your output must adhere to. Include the enclosing markdown codeblock:
\`\`\`json
${JSON.stringify(zodToJsonSchema(this.schema))}
\`\`\`
`;
  }
  /**
   * Parses the given text according to the schema.
   * @param text The text to parse
   * @returns The parsed output.
   */
  parse(text) {
    return __async(this, null, function* () {
      try {
        const json = text.includes("```") ? text.trim().split(/```(?:json)?/)[1] : text.trim();
        const escapedJson = json.replace(/"([^"\\]*(\\.[^"\\]*)*)"/g, (_match, capturedGroup) => {
          const escapedInsideQuotes = capturedGroup.replace(/\n/g, "\\n");
          return `"${escapedInsideQuotes}"`;
        }).replace(/\n/g, "");
        return yield this.schema.parseAsync(JSON.parse(escapedJson));
      } catch (e) {
        throw new OutputParserException(`Failed to parse. Text: "${text}". Error: ${e}`, text);
      }
    });
  }
};

// node_modules/@langchain/core/dist/utils/@cfworker/json-schema/src/deep-compare-strict.js
function deepCompareStrict(a, b) {
  const typeofa = typeof a;
  if (typeofa !== typeof b) {
    return false;
  }
  if (Array.isArray(a)) {
    if (!Array.isArray(b)) {
      return false;
    }
    const length = a.length;
    if (length !== b.length) {
      return false;
    }
    for (let i = 0; i < length; i++) {
      if (!deepCompareStrict(a[i], b[i])) {
        return false;
      }
    }
    return true;
  }
  if (typeofa === "object") {
    if (!a || !b) {
      return a === b;
    }
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    const length = aKeys.length;
    if (length !== bKeys.length) {
      return false;
    }
    for (const k of aKeys) {
      if (!deepCompareStrict(a[k], b[k])) {
        return false;
      }
    }
    return true;
  }
  return a === b;
}

// node_modules/@langchain/core/dist/utils/@cfworker/json-schema/src/dereference.js
var initialBaseURI = (
  // @ts-ignore
  typeof self !== "undefined" && self.location && self.location.origin !== "null" ? (
    //@ts-ignore
    new URL(self.location.origin + self.location.pathname + location.search)
  ) : new URL("https://github.com/cfworker")
);

// node_modules/@langchain/core/dist/utils/@cfworker/json-schema/src/format.js
var DATE = /^(\d\d\d\d)-(\d\d)-(\d\d)$/;
var DAYS = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var TIME = /^(\d\d):(\d\d):(\d\d)(\.\d+)?(z|[+-]\d\d(?::?\d\d)?)?$/i;
var HOSTNAME = /^(?=.{1,253}\.?$)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[-0-9a-z]{0,61}[0-9a-z])?)*\.?$/i;
var URIREF = /^(?:[a-z][a-z0-9+\-.]*:)?(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'"()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?(?:\?(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
var URITEMPLATE = /^(?:(?:[^\x00-\x20"'<>%\\^`{|}]|%[0-9a-f]{2})|\{[+#./;?&=,!@|]?(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?(?:,(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?)*\})*$/i;
var URL_ = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u{00a1}-\u{ffff}0-9]+-?)*[a-z\u{00a1}-\u{ffff}0-9]+)(?:\.(?:[a-z\u{00a1}-\u{ffff}0-9]+-?)*[a-z\u{00a1}-\u{ffff}0-9]+)*(?:\.(?:[a-z\u{00a1}-\u{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/iu;
var UUID = /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i;
var JSON_POINTER = /^(?:\/(?:[^~/]|~0|~1)*)*$/;
var JSON_POINTER_URI_FRAGMENT = /^#(?:\/(?:[a-z0-9_\-.!$&'()*+,;:=@]|%[0-9a-f]{2}|~0|~1)*)*$/i;
var RELATIVE_JSON_POINTER = /^(?:0|[1-9][0-9]*)(?:#|(?:\/(?:[^~/]|~0|~1)*)*)$/;
var FASTDATE = /^\d\d\d\d-[0-1]\d-[0-3]\d$/;
var FASTTIME = /^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i;
var FASTDATETIME = /^\d\d\d\d-[0-1]\d-[0-3]\d[t\s](?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i;
var FASTURIREFERENCE = /^(?:(?:[a-z][a-z0-9+-.]*:)?\/?\/)?(?:[^\\\s#][^\s#]*)?(?:#[^\\\s]*)?$/i;
var EMAIL = (input) => {
  if (input[0] === '"') return false;
  const [name, host, ...rest] = input.split("@");
  if (!name || !host || rest.length !== 0 || name.length > 64 || host.length > 253) return false;
  if (name[0] === "." || name.endsWith(".") || name.includes("..")) return false;
  if (!/^[a-z0-9.-]+$/i.test(host) || !/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+$/i.test(name)) return false;
  return host.split(".").every((part) => /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/i.test(part));
};
var IPV4 = /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/;
var IPV6 = /^((([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))$/i;
var DURATION = (input) => input.length > 1 && input.length < 80 && (/^P\d+([.,]\d+)?W$/.test(input) || /^P[\dYMDTHS]*(\d[.,]\d+)?[YMDHS]$/.test(input) && /^P([.,\d]+Y)?([.,\d]+M)?([.,\d]+D)?(T([.,\d]+H)?([.,\d]+M)?([.,\d]+S)?)?$/.test(input));
function bind(r) {
  return r.test.bind(r);
}
var fullFormat = {
  date,
  time: time.bind(void 0, false),
  "date-time": date_time,
  duration: DURATION,
  uri,
  "uri-reference": bind(URIREF),
  "uri-template": bind(URITEMPLATE),
  url: bind(URL_),
  email: EMAIL,
  hostname: bind(HOSTNAME),
  ipv4: bind(IPV4),
  ipv6: bind(IPV6),
  regex,
  uuid: bind(UUID),
  "json-pointer": bind(JSON_POINTER),
  "json-pointer-uri-fragment": bind(JSON_POINTER_URI_FRAGMENT),
  "relative-json-pointer": bind(RELATIVE_JSON_POINTER)
};
var fastFormat = __spreadProps(__spreadValues({}, fullFormat), {
  date: bind(FASTDATE),
  time: bind(FASTTIME),
  "date-time": bind(FASTDATETIME),
  "uri-reference": bind(FASTURIREFERENCE)
});
function isLeapYear(year) {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}
function date(str) {
  const matches = str.match(DATE);
  if (!matches) return false;
  const year = +matches[1];
  const month = +matches[2];
  const day = +matches[3];
  return month >= 1 && month <= 12 && day >= 1 && day <= (month == 2 && isLeapYear(year) ? 29 : DAYS[month]);
}
function time(full, str) {
  const matches = str.match(TIME);
  if (!matches) return false;
  const hour = +matches[1];
  const minute = +matches[2];
  const second = +matches[3];
  const timeZone = !!matches[5];
  return (hour <= 23 && minute <= 59 && second <= 59 || hour == 23 && minute == 59 && second == 60) && (!full || timeZone);
}
var DATE_TIME_SEPARATOR = /t|\s/i;
function date_time(str) {
  const dateTime = str.split(DATE_TIME_SEPARATOR);
  return dateTime.length == 2 && date(dateTime[0]) && time(true, dateTime[1]);
}
var NOT_URI_FRAGMENT = /\/|:/;
var URI_PATTERN = /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
function uri(str) {
  return NOT_URI_FRAGMENT.test(str) && URI_PATTERN.test(str);
}
var Z_ANCHOR = /[^\\]\\Z/;
function regex(str) {
  if (Z_ANCHOR.test(str)) return false;
  try {
    new RegExp(str);
    return true;
  } catch (e) {
    return false;
  }
}

// node_modules/@langchain/core/dist/output_parsers/transform.js
var BaseTransformOutputParser = class extends BaseOutputParser {
  _transform(inputGenerator) {
    return __asyncGenerator(this, null, function* () {
      try {
        for (var iter = __forAwait(inputGenerator), more, temp, error; more = !(temp = yield new __await(iter.next())).done; more = false) {
          const chunk = temp.value;
          if (typeof chunk === "string") {
            yield this.parseResult([{
              text: chunk
            }]);
          } else {
            yield this.parseResult([{
              message: chunk,
              text: this._baseMessageToString(chunk)
            }]);
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
  /**
   * Transforms an asynchronous generator of input into an asynchronous
   * generator of parsed output.
   * @param inputGenerator An asynchronous generator of input.
   * @param options A configuration object.
   * @returns An asynchronous generator of parsed output.
   */
  transform(inputGenerator, options) {
    return __asyncGenerator(this, null, function* () {
      yield* __yieldStar(this._transformStreamWithConfig(inputGenerator, this._transform.bind(this), __spreadProps(__spreadValues({}, options), {
        runType: "parser"
      })));
    });
  }
};
var BaseCumulativeTransformOutputParser = class extends BaseTransformOutputParser {
  constructor(fields) {
    super(fields);
    Object.defineProperty(this, "diff", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: false
    });
    this.diff = fields?.diff ?? this.diff;
  }
  _transform(inputGenerator) {
    return __asyncGenerator(this, null, function* () {
      let prevParsed;
      let accGen;
      try {
        for (var iter = __forAwait(inputGenerator), more, temp, error; more = !(temp = yield new __await(iter.next())).done; more = false) {
          const chunk = temp.value;
          if (typeof chunk !== "string" && typeof chunk.content !== "string") {
            throw new Error("Cannot handle non-string output.");
          }
          let chunkGen;
          if (isBaseMessageChunk(chunk)) {
            if (typeof chunk.content !== "string") {
              throw new Error("Cannot handle non-string message output.");
            }
            chunkGen = new ChatGenerationChunk({
              message: chunk,
              text: chunk.content
            });
          } else if (isBaseMessage(chunk)) {
            if (typeof chunk.content !== "string") {
              throw new Error("Cannot handle non-string message output.");
            }
            chunkGen = new ChatGenerationChunk({
              message: convertToChunk(chunk),
              text: chunk.content
            });
          } else {
            chunkGen = new GenerationChunk({
              text: chunk
            });
          }
          if (accGen === void 0) {
            accGen = chunkGen;
          } else {
            accGen = accGen.concat(chunkGen);
          }
          const parsed = yield new __await(this.parsePartialResult([accGen]));
          if (parsed !== void 0 && parsed !== null && !deepCompareStrict(parsed, prevParsed)) {
            if (this.diff) {
              yield this._diff(prevParsed, parsed);
            } else {
              yield parsed;
            }
            prevParsed = parsed;
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
  getFormatInstructions() {
    return "";
  }
};

// node_modules/@langchain/core/dist/output_parsers/json.js
var JsonOutputParser = class extends BaseCumulativeTransformOutputParser {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "lc_namespace", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: ["langchain_core", "output_parsers"]
    });
    Object.defineProperty(this, "lc_serializable", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: true
    });
  }
  static lc_name() {
    return "JsonOutputParser";
  }
  _diff(prev, next) {
    if (!next) {
      return void 0;
    }
    if (!prev) {
      return [{
        op: "replace",
        path: "",
        value: next
      }];
    }
    return compare(prev, next);
  }
  // This should actually return Partial<T>, but there's no way
  // to specify emitted chunks as instances separate from the main output type.
  parsePartialResult(generations) {
    return __async(this, null, function* () {
      return parseJsonMarkdown(generations[0].text);
    });
  }
  parse(text) {
    return __async(this, null, function* () {
      return parseJsonMarkdown(text, JSON.parse);
    });
  }
  getFormatInstructions() {
    return "";
  }
};

// node_modules/@langchain/core/dist/utils/sax-js/sax.js
var initializeSax = function() {
  const sax2 = {};
  sax2.parser = function(strict, opt) {
    return new SAXParser(strict, opt);
  };
  sax2.SAXParser = SAXParser;
  sax2.SAXStream = SAXStream;
  sax2.createStream = createStream;
  sax2.MAX_BUFFER_LENGTH = 64 * 1024;
  const buffers = ["comment", "sgmlDecl", "textNode", "tagName", "doctype", "procInstName", "procInstBody", "entity", "attribName", "attribValue", "cdata", "script"];
  sax2.EVENTS = ["text", "processinginstruction", "sgmldeclaration", "doctype", "comment", "opentagstart", "attribute", "opentag", "closetag", "opencdata", "cdata", "closecdata", "error", "end", "ready", "script", "opennamespace", "closenamespace"];
  function SAXParser(strict, opt) {
    if (!(this instanceof SAXParser)) {
      return new SAXParser(strict, opt);
    }
    var parser = this;
    clearBuffers(parser);
    parser.q = parser.c = "";
    parser.bufferCheckPosition = sax2.MAX_BUFFER_LENGTH;
    parser.opt = opt || {};
    parser.opt.lowercase = parser.opt.lowercase || parser.opt.lowercasetags;
    parser.looseCase = parser.opt.lowercase ? "toLowerCase" : "toUpperCase";
    parser.tags = [];
    parser.closed = parser.closedRoot = parser.sawRoot = false;
    parser.tag = parser.error = null;
    parser.strict = !!strict;
    parser.noscript = !!(strict || parser.opt.noscript);
    parser.state = S.BEGIN;
    parser.strictEntities = parser.opt.strictEntities;
    parser.ENTITIES = parser.strictEntities ? Object.create(sax2.XML_ENTITIES) : Object.create(sax2.ENTITIES);
    parser.attribList = [];
    if (parser.opt.xmlns) {
      parser.ns = Object.create(rootNS);
    }
    parser.trackPosition = parser.opt.position !== false;
    if (parser.trackPosition) {
      parser.position = parser.line = parser.column = 0;
    }
    emit(parser, "onready");
  }
  if (!Object.create) {
    Object.create = function(o) {
      function F() {
      }
      F.prototype = o;
      var newf = new F();
      return newf;
    };
  }
  if (!Object.keys) {
    Object.keys = function(o) {
      var a = [];
      for (var i in o) if (o.hasOwnProperty(i)) a.push(i);
      return a;
    };
  }
  function checkBufferLength(parser) {
    var maxAllowed = Math.max(sax2.MAX_BUFFER_LENGTH, 10);
    var maxActual = 0;
    for (var i = 0, l = buffers.length; i < l; i++) {
      var len = parser[buffers[i]].length;
      if (len > maxAllowed) {
        switch (buffers[i]) {
          case "textNode":
            closeText(parser);
            break;
          case "cdata":
            emitNode(parser, "oncdata", parser.cdata);
            parser.cdata = "";
            break;
          case "script":
            emitNode(parser, "onscript", parser.script);
            parser.script = "";
            break;
          default:
            error(parser, "Max buffer length exceeded: " + buffers[i]);
        }
      }
      maxActual = Math.max(maxActual, len);
    }
    var m = sax2.MAX_BUFFER_LENGTH - maxActual;
    parser.bufferCheckPosition = m + parser.position;
  }
  function clearBuffers(parser) {
    for (var i = 0, l = buffers.length; i < l; i++) {
      parser[buffers[i]] = "";
    }
  }
  function flushBuffers(parser) {
    closeText(parser);
    if (parser.cdata !== "") {
      emitNode(parser, "oncdata", parser.cdata);
      parser.cdata = "";
    }
    if (parser.script !== "") {
      emitNode(parser, "onscript", parser.script);
      parser.script = "";
    }
  }
  SAXParser.prototype = {
    end: function() {
      end(this);
    },
    write,
    resume: function() {
      this.error = null;
      return this;
    },
    close: function() {
      return this.write(null);
    },
    flush: function() {
      flushBuffers(this);
    }
  };
  var Stream = ReadableStream;
  if (!Stream) Stream = function() {
  };
  var streamWraps = sax2.EVENTS.filter(function(ev) {
    return ev !== "error" && ev !== "end";
  });
  function createStream(strict, opt) {
    return new SAXStream(strict, opt);
  }
  function SAXStream(strict, opt) {
    if (!(this instanceof SAXStream)) {
      return new SAXStream(strict, opt);
    }
    Stream.apply(this);
    this._parser = new SAXParser(strict, opt);
    this.writable = true;
    this.readable = true;
    var me = this;
    this._parser.onend = function() {
      me.emit("end");
    };
    this._parser.onerror = function(er) {
      me.emit("error", er);
      me._parser.error = null;
    };
    this._decoder = null;
    streamWraps.forEach(function(ev) {
      Object.defineProperty(me, "on" + ev, {
        get: function() {
          return me._parser["on" + ev];
        },
        set: function(h) {
          if (!h) {
            me.removeAllListeners(ev);
            me._parser["on" + ev] = h;
            return h;
          }
          me.on(ev, h);
        },
        enumerable: true,
        configurable: false
      });
    });
  }
  SAXStream.prototype = Object.create(Stream.prototype, {
    constructor: {
      value: SAXStream
    }
  });
  SAXStream.prototype.write = function(data) {
    this._parser.write(data.toString());
    this.emit("data", data);
    return true;
  };
  SAXStream.prototype.end = function(chunk) {
    if (chunk && chunk.length) {
      this.write(chunk);
    }
    this._parser.end();
    return true;
  };
  SAXStream.prototype.on = function(ev, handler) {
    var me = this;
    if (!me._parser["on" + ev] && streamWraps.indexOf(ev) !== -1) {
      me._parser["on" + ev] = function() {
        var args = arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments);
        args.splice(0, 0, ev);
        me.emit.apply(me, args);
      };
    }
    return Stream.prototype.on.call(me, ev, handler);
  };
  var CDATA = "[CDATA[";
  var DOCTYPE = "DOCTYPE";
  var XML_NAMESPACE = "http://www.w3.org/XML/1998/namespace";
  var XMLNS_NAMESPACE = "http://www.w3.org/2000/xmlns/";
  var rootNS = {
    xml: XML_NAMESPACE,
    xmlns: XMLNS_NAMESPACE
  };
  var nameStart = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/;
  var nameBody = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/;
  var entityStart = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/;
  var entityBody = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/;
  function isWhitespace(c) {
    return c === " " || c === "\n" || c === "\r" || c === "	";
  }
  function isQuote(c) {
    return c === '"' || c === "'";
  }
  function isAttribEnd(c) {
    return c === ">" || isWhitespace(c);
  }
  function isMatch(regex2, c) {
    return regex2.test(c);
  }
  function notMatch(regex2, c) {
    return !isMatch(regex2, c);
  }
  var S = 0;
  sax2.STATE = {
    BEGIN: S++,
    BEGIN_WHITESPACE: S++,
    TEXT: S++,
    TEXT_ENTITY: S++,
    OPEN_WAKA: S++,
    SGML_DECL: S++,
    SGML_DECL_QUOTED: S++,
    DOCTYPE: S++,
    DOCTYPE_QUOTED: S++,
    DOCTYPE_DTD: S++,
    DOCTYPE_DTD_QUOTED: S++,
    COMMENT_STARTING: S++,
    COMMENT: S++,
    COMMENT_ENDING: S++,
    COMMENT_ENDED: S++,
    CDATA: S++,
    CDATA_ENDING: S++,
    CDATA_ENDING_2: S++,
    PROC_INST: S++,
    PROC_INST_BODY: S++,
    PROC_INST_ENDING: S++,
    OPEN_TAG: S++,
    OPEN_TAG_SLASH: S++,
    ATTRIB: S++,
    ATTRIB_NAME: S++,
    ATTRIB_NAME_SAW_WHITE: S++,
    ATTRIB_VALUE: S++,
    ATTRIB_VALUE_QUOTED: S++,
    ATTRIB_VALUE_CLOSED: S++,
    ATTRIB_VALUE_UNQUOTED: S++,
    ATTRIB_VALUE_ENTITY_Q: S++,
    ATTRIB_VALUE_ENTITY_U: S++,
    CLOSE_TAG: S++,
    CLOSE_TAG_SAW_WHITE: S++,
    SCRIPT: S++,
    SCRIPT_ENDING: S++
    // <script> ... <
  };
  sax2.XML_ENTITIES = {
    amp: "&",
    gt: ">",
    lt: "<",
    quot: '"',
    apos: "'"
  };
  sax2.ENTITIES = {
    amp: "&",
    gt: ">",
    lt: "<",
    quot: '"',
    apos: "'",
    AElig: 198,
    Aacute: 193,
    Acirc: 194,
    Agrave: 192,
    Aring: 197,
    Atilde: 195,
    Auml: 196,
    Ccedil: 199,
    ETH: 208,
    Eacute: 201,
    Ecirc: 202,
    Egrave: 200,
    Euml: 203,
    Iacute: 205,
    Icirc: 206,
    Igrave: 204,
    Iuml: 207,
    Ntilde: 209,
    Oacute: 211,
    Ocirc: 212,
    Ograve: 210,
    Oslash: 216,
    Otilde: 213,
    Ouml: 214,
    THORN: 222,
    Uacute: 218,
    Ucirc: 219,
    Ugrave: 217,
    Uuml: 220,
    Yacute: 221,
    aacute: 225,
    acirc: 226,
    aelig: 230,
    agrave: 224,
    aring: 229,
    atilde: 227,
    auml: 228,
    ccedil: 231,
    eacute: 233,
    ecirc: 234,
    egrave: 232,
    eth: 240,
    euml: 235,
    iacute: 237,
    icirc: 238,
    igrave: 236,
    iuml: 239,
    ntilde: 241,
    oacute: 243,
    ocirc: 244,
    ograve: 242,
    oslash: 248,
    otilde: 245,
    ouml: 246,
    szlig: 223,
    thorn: 254,
    uacute: 250,
    ucirc: 251,
    ugrave: 249,
    uuml: 252,
    yacute: 253,
    yuml: 255,
    copy: 169,
    reg: 174,
    nbsp: 160,
    iexcl: 161,
    cent: 162,
    pound: 163,
    curren: 164,
    yen: 165,
    brvbar: 166,
    sect: 167,
    uml: 168,
    ordf: 170,
    laquo: 171,
    not: 172,
    shy: 173,
    macr: 175,
    deg: 176,
    plusmn: 177,
    sup1: 185,
    sup2: 178,
    sup3: 179,
    acute: 180,
    micro: 181,
    para: 182,
    middot: 183,
    cedil: 184,
    ordm: 186,
    raquo: 187,
    frac14: 188,
    frac12: 189,
    frac34: 190,
    iquest: 191,
    times: 215,
    divide: 247,
    OElig: 338,
    oelig: 339,
    Scaron: 352,
    scaron: 353,
    Yuml: 376,
    fnof: 402,
    circ: 710,
    tilde: 732,
    Alpha: 913,
    Beta: 914,
    Gamma: 915,
    Delta: 916,
    Epsilon: 917,
    Zeta: 918,
    Eta: 919,
    Theta: 920,
    Iota: 921,
    Kappa: 922,
    Lambda: 923,
    Mu: 924,
    Nu: 925,
    Xi: 926,
    Omicron: 927,
    Pi: 928,
    Rho: 929,
    Sigma: 931,
    Tau: 932,
    Upsilon: 933,
    Phi: 934,
    Chi: 935,
    Psi: 936,
    Omega: 937,
    alpha: 945,
    beta: 946,
    gamma: 947,
    delta: 948,
    epsilon: 949,
    zeta: 950,
    eta: 951,
    theta: 952,
    iota: 953,
    kappa: 954,
    lambda: 955,
    mu: 956,
    nu: 957,
    xi: 958,
    omicron: 959,
    pi: 960,
    rho: 961,
    sigmaf: 962,
    sigma: 963,
    tau: 964,
    upsilon: 965,
    phi: 966,
    chi: 967,
    psi: 968,
    omega: 969,
    thetasym: 977,
    upsih: 978,
    piv: 982,
    ensp: 8194,
    emsp: 8195,
    thinsp: 8201,
    zwnj: 8204,
    zwj: 8205,
    lrm: 8206,
    rlm: 8207,
    ndash: 8211,
    mdash: 8212,
    lsquo: 8216,
    rsquo: 8217,
    sbquo: 8218,
    ldquo: 8220,
    rdquo: 8221,
    bdquo: 8222,
    dagger: 8224,
    Dagger: 8225,
    bull: 8226,
    hellip: 8230,
    permil: 8240,
    prime: 8242,
    Prime: 8243,
    lsaquo: 8249,
    rsaquo: 8250,
    oline: 8254,
    frasl: 8260,
    euro: 8364,
    image: 8465,
    weierp: 8472,
    real: 8476,
    trade: 8482,
    alefsym: 8501,
    larr: 8592,
    uarr: 8593,
    rarr: 8594,
    darr: 8595,
    harr: 8596,
    crarr: 8629,
    lArr: 8656,
    uArr: 8657,
    rArr: 8658,
    dArr: 8659,
    hArr: 8660,
    forall: 8704,
    part: 8706,
    exist: 8707,
    empty: 8709,
    nabla: 8711,
    isin: 8712,
    notin: 8713,
    ni: 8715,
    prod: 8719,
    sum: 8721,
    minus: 8722,
    lowast: 8727,
    radic: 8730,
    prop: 8733,
    infin: 8734,
    ang: 8736,
    and: 8743,
    or: 8744,
    cap: 8745,
    cup: 8746,
    int: 8747,
    there4: 8756,
    sim: 8764,
    cong: 8773,
    asymp: 8776,
    ne: 8800,
    equiv: 8801,
    le: 8804,
    ge: 8805,
    sub: 8834,
    sup: 8835,
    nsub: 8836,
    sube: 8838,
    supe: 8839,
    oplus: 8853,
    otimes: 8855,
    perp: 8869,
    sdot: 8901,
    lceil: 8968,
    rceil: 8969,
    lfloor: 8970,
    rfloor: 8971,
    lang: 9001,
    rang: 9002,
    loz: 9674,
    spades: 9824,
    clubs: 9827,
    hearts: 9829,
    diams: 9830
  };
  Object.keys(sax2.ENTITIES).forEach(function(key) {
    var e = sax2.ENTITIES[key];
    var s2 = typeof e === "number" ? String.fromCharCode(e) : e;
    sax2.ENTITIES[key] = s2;
  });
  for (var s in sax2.STATE) {
    sax2.STATE[sax2.STATE[s]] = s;
  }
  S = sax2.STATE;
  function emit(parser, event, data) {
    parser[event] && parser[event](data);
  }
  function emitNode(parser, nodeType, data) {
    if (parser.textNode) closeText(parser);
    emit(parser, nodeType, data);
  }
  function closeText(parser) {
    parser.textNode = textopts(parser.opt, parser.textNode);
    if (parser.textNode) emit(parser, "ontext", parser.textNode);
    parser.textNode = "";
  }
  function textopts(opt, text) {
    if (opt.trim) text = text.trim();
    if (opt.normalize) text = text.replace(/\s+/g, " ");
    return text;
  }
  function error(parser, er) {
    closeText(parser);
    if (parser.trackPosition) {
      er += "\nLine: " + parser.line + "\nColumn: " + parser.column + "\nChar: " + parser.c;
    }
    er = new Error(er);
    parser.error = er;
    emit(parser, "onerror", er);
    return parser;
  }
  function end(parser) {
    if (parser.sawRoot && !parser.closedRoot) strictFail(parser, "Unclosed root tag");
    if (parser.state !== S.BEGIN && parser.state !== S.BEGIN_WHITESPACE && parser.state !== S.TEXT) {
      error(parser, "Unexpected end");
    }
    closeText(parser);
    parser.c = "";
    parser.closed = true;
    emit(parser, "onend");
    SAXParser.call(parser, parser.strict, parser.opt);
    return parser;
  }
  function strictFail(parser, message) {
    if (typeof parser !== "object" || !(parser instanceof SAXParser)) {
      throw new Error("bad call to strictFail");
    }
    if (parser.strict) {
      error(parser, message);
    }
  }
  function newTag(parser) {
    if (!parser.strict) parser.tagName = parser.tagName[parser.looseCase]();
    var parent = parser.tags[parser.tags.length - 1] || parser;
    var tag = parser.tag = {
      name: parser.tagName,
      attributes: {}
    };
    if (parser.opt.xmlns) {
      tag.ns = parent.ns;
    }
    parser.attribList.length = 0;
    emitNode(parser, "onopentagstart", tag);
  }
  function qname(name, attribute) {
    var i = name.indexOf(":");
    var qualName = i < 0 ? ["", name] : name.split(":");
    var prefix = qualName[0];
    var local = qualName[1];
    if (attribute && name === "xmlns") {
      prefix = "xmlns";
      local = "";
    }
    return {
      prefix,
      local
    };
  }
  function attrib(parser) {
    if (!parser.strict) {
      parser.attribName = parser.attribName[parser.looseCase]();
    }
    if (parser.attribList.indexOf(parser.attribName) !== -1 || parser.tag.attributes.hasOwnProperty(parser.attribName)) {
      parser.attribName = parser.attribValue = "";
      return;
    }
    if (parser.opt.xmlns) {
      var qn = qname(parser.attribName, true);
      var prefix = qn.prefix;
      var local = qn.local;
      if (prefix === "xmlns") {
        if (local === "xml" && parser.attribValue !== XML_NAMESPACE) {
          strictFail(parser, "xml: prefix must be bound to " + XML_NAMESPACE + "\nActual: " + parser.attribValue);
        } else if (local === "xmlns" && parser.attribValue !== XMLNS_NAMESPACE) {
          strictFail(parser, "xmlns: prefix must be bound to " + XMLNS_NAMESPACE + "\nActual: " + parser.attribValue);
        } else {
          var tag = parser.tag;
          var parent = parser.tags[parser.tags.length - 1] || parser;
          if (tag.ns === parent.ns) {
            tag.ns = Object.create(parent.ns);
          }
          tag.ns[local] = parser.attribValue;
        }
      }
      parser.attribList.push([parser.attribName, parser.attribValue]);
    } else {
      parser.tag.attributes[parser.attribName] = parser.attribValue;
      emitNode(parser, "onattribute", {
        name: parser.attribName,
        value: parser.attribValue
      });
    }
    parser.attribName = parser.attribValue = "";
  }
  function openTag(parser, selfClosing) {
    if (parser.opt.xmlns) {
      var tag = parser.tag;
      var qn = qname(parser.tagName);
      tag.prefix = qn.prefix;
      tag.local = qn.local;
      tag.uri = tag.ns[qn.prefix] || "";
      if (tag.prefix && !tag.uri) {
        strictFail(parser, "Unbound namespace prefix: " + JSON.stringify(parser.tagName));
        tag.uri = qn.prefix;
      }
      var parent = parser.tags[parser.tags.length - 1] || parser;
      if (tag.ns && parent.ns !== tag.ns) {
        Object.keys(tag.ns).forEach(function(p) {
          emitNode(parser, "onopennamespace", {
            prefix: p,
            uri: tag.ns[p]
          });
        });
      }
      for (var i = 0, l = parser.attribList.length; i < l; i++) {
        var nv = parser.attribList[i];
        var name = nv[0];
        var value = nv[1];
        var qualName = qname(name, true);
        var prefix = qualName.prefix;
        var local = qualName.local;
        var uri2 = prefix === "" ? "" : tag.ns[prefix] || "";
        var a = {
          name,
          value,
          prefix,
          local,
          uri: uri2
        };
        if (prefix && prefix !== "xmlns" && !uri2) {
          strictFail(parser, "Unbound namespace prefix: " + JSON.stringify(prefix));
          a.uri = prefix;
        }
        parser.tag.attributes[name] = a;
        emitNode(parser, "onattribute", a);
      }
      parser.attribList.length = 0;
    }
    parser.tag.isSelfClosing = !!selfClosing;
    parser.sawRoot = true;
    parser.tags.push(parser.tag);
    emitNode(parser, "onopentag", parser.tag);
    if (!selfClosing) {
      if (!parser.noscript && parser.tagName.toLowerCase() === "script") {
        parser.state = S.SCRIPT;
      } else {
        parser.state = S.TEXT;
      }
      parser.tag = null;
      parser.tagName = "";
    }
    parser.attribName = parser.attribValue = "";
    parser.attribList.length = 0;
  }
  function closeTag(parser) {
    if (!parser.tagName) {
      strictFail(parser, "Weird empty close tag.");
      parser.textNode += "</>";
      parser.state = S.TEXT;
      return;
    }
    if (parser.script) {
      if (parser.tagName !== "script") {
        parser.script += "</" + parser.tagName + ">";
        parser.tagName = "";
        parser.state = S.SCRIPT;
        return;
      }
      emitNode(parser, "onscript", parser.script);
      parser.script = "";
    }
    var t = parser.tags.length;
    var tagName = parser.tagName;
    if (!parser.strict) {
      tagName = tagName[parser.looseCase]();
    }
    var closeTo = tagName;
    while (t--) {
      var close = parser.tags[t];
      if (close.name !== closeTo) {
        strictFail(parser, "Unexpected close tag");
      } else {
        break;
      }
    }
    if (t < 0) {
      strictFail(parser, "Unmatched closing tag: " + parser.tagName);
      parser.textNode += "</" + parser.tagName + ">";
      parser.state = S.TEXT;
      return;
    }
    parser.tagName = tagName;
    var s2 = parser.tags.length;
    while (s2-- > t) {
      var tag = parser.tag = parser.tags.pop();
      parser.tagName = parser.tag.name;
      emitNode(parser, "onclosetag", parser.tagName);
      var x = {};
      for (var i in tag.ns) {
        x[i] = tag.ns[i];
      }
      var parent = parser.tags[parser.tags.length - 1] || parser;
      if (parser.opt.xmlns && tag.ns !== parent.ns) {
        Object.keys(tag.ns).forEach(function(p) {
          var n = tag.ns[p];
          emitNode(parser, "onclosenamespace", {
            prefix: p,
            uri: n
          });
        });
      }
    }
    if (t === 0) parser.closedRoot = true;
    parser.tagName = parser.attribValue = parser.attribName = "";
    parser.attribList.length = 0;
    parser.state = S.TEXT;
  }
  function parseEntity(parser) {
    var entity = parser.entity;
    var entityLC = entity.toLowerCase();
    var num;
    var numStr = "";
    if (parser.ENTITIES[entity]) {
      return parser.ENTITIES[entity];
    }
    if (parser.ENTITIES[entityLC]) {
      return parser.ENTITIES[entityLC];
    }
    entity = entityLC;
    if (entity.charAt(0) === "#") {
      if (entity.charAt(1) === "x") {
        entity = entity.slice(2);
        num = parseInt(entity, 16);
        numStr = num.toString(16);
      } else {
        entity = entity.slice(1);
        num = parseInt(entity, 10);
        numStr = num.toString(10);
      }
    }
    entity = entity.replace(/^0+/, "");
    if (isNaN(num) || numStr.toLowerCase() !== entity) {
      strictFail(parser, "Invalid character entity");
      return "&" + parser.entity + ";";
    }
    return String.fromCodePoint(num);
  }
  function beginWhiteSpace(parser, c) {
    if (c === "<") {
      parser.state = S.OPEN_WAKA;
      parser.startTagPosition = parser.position;
    } else if (!isWhitespace(c)) {
      strictFail(parser, "Non-whitespace before first tag.");
      parser.textNode = c;
      parser.state = S.TEXT;
    }
  }
  function charAt(chunk, i) {
    var result = "";
    if (i < chunk.length) {
      result = chunk.charAt(i);
    }
    return result;
  }
  function write(chunk) {
    var parser = this;
    if (this.error) {
      throw this.error;
    }
    if (parser.closed) {
      return error(parser, "Cannot write after close. Assign an onready handler.");
    }
    if (chunk === null) {
      return end(parser);
    }
    if (typeof chunk === "object") {
      chunk = chunk.toString();
    }
    var i = 0;
    var c = "";
    while (true) {
      c = charAt(chunk, i++);
      parser.c = c;
      if (!c) {
        break;
      }
      if (parser.trackPosition) {
        parser.position++;
        if (c === "\n") {
          parser.line++;
          parser.column = 0;
        } else {
          parser.column++;
        }
      }
      switch (parser.state) {
        case S.BEGIN:
          parser.state = S.BEGIN_WHITESPACE;
          if (c === "\uFEFF") {
            continue;
          }
          beginWhiteSpace(parser, c);
          continue;
        case S.BEGIN_WHITESPACE:
          beginWhiteSpace(parser, c);
          continue;
        case S.TEXT:
          if (parser.sawRoot && !parser.closedRoot) {
            var starti = i - 1;
            while (c && c !== "<" && c !== "&") {
              c = charAt(chunk, i++);
              if (c && parser.trackPosition) {
                parser.position++;
                if (c === "\n") {
                  parser.line++;
                  parser.column = 0;
                } else {
                  parser.column++;
                }
              }
            }
            parser.textNode += chunk.substring(starti, i - 1);
          }
          if (c === "<" && !(parser.sawRoot && parser.closedRoot && !parser.strict)) {
            parser.state = S.OPEN_WAKA;
            parser.startTagPosition = parser.position;
          } else {
            if (!isWhitespace(c) && (!parser.sawRoot || parser.closedRoot)) {
              strictFail(parser, "Text data outside of root node.");
            }
            if (c === "&") {
              parser.state = S.TEXT_ENTITY;
            } else {
              parser.textNode += c;
            }
          }
          continue;
        case S.SCRIPT:
          if (c === "<") {
            parser.state = S.SCRIPT_ENDING;
          } else {
            parser.script += c;
          }
          continue;
        case S.SCRIPT_ENDING:
          if (c === "/") {
            parser.state = S.CLOSE_TAG;
          } else {
            parser.script += "<" + c;
            parser.state = S.SCRIPT;
          }
          continue;
        case S.OPEN_WAKA:
          if (c === "!") {
            parser.state = S.SGML_DECL;
            parser.sgmlDecl = "";
          } else if (isWhitespace(c)) {
          } else if (isMatch(nameStart, c)) {
            parser.state = S.OPEN_TAG;
            parser.tagName = c;
          } else if (c === "/") {
            parser.state = S.CLOSE_TAG;
            parser.tagName = "";
          } else if (c === "?") {
            parser.state = S.PROC_INST;
            parser.procInstName = parser.procInstBody = "";
          } else {
            strictFail(parser, "Unencoded <");
            if (parser.startTagPosition + 1 < parser.position) {
              var pad = parser.position - parser.startTagPosition;
              c = new Array(pad).join(" ") + c;
            }
            parser.textNode += "<" + c;
            parser.state = S.TEXT;
          }
          continue;
        case S.SGML_DECL:
          if ((parser.sgmlDecl + c).toUpperCase() === CDATA) {
            emitNode(parser, "onopencdata");
            parser.state = S.CDATA;
            parser.sgmlDecl = "";
            parser.cdata = "";
          } else if (parser.sgmlDecl + c === "--") {
            parser.state = S.COMMENT;
            parser.comment = "";
            parser.sgmlDecl = "";
          } else if ((parser.sgmlDecl + c).toUpperCase() === DOCTYPE) {
            parser.state = S.DOCTYPE;
            if (parser.doctype || parser.sawRoot) {
              strictFail(parser, "Inappropriately located doctype declaration");
            }
            parser.doctype = "";
            parser.sgmlDecl = "";
          } else if (c === ">") {
            emitNode(parser, "onsgmldeclaration", parser.sgmlDecl);
            parser.sgmlDecl = "";
            parser.state = S.TEXT;
          } else if (isQuote(c)) {
            parser.state = S.SGML_DECL_QUOTED;
            parser.sgmlDecl += c;
          } else {
            parser.sgmlDecl += c;
          }
          continue;
        case S.SGML_DECL_QUOTED:
          if (c === parser.q) {
            parser.state = S.SGML_DECL;
            parser.q = "";
          }
          parser.sgmlDecl += c;
          continue;
        case S.DOCTYPE:
          if (c === ">") {
            parser.state = S.TEXT;
            emitNode(parser, "ondoctype", parser.doctype);
            parser.doctype = true;
          } else {
            parser.doctype += c;
            if (c === "[") {
              parser.state = S.DOCTYPE_DTD;
            } else if (isQuote(c)) {
              parser.state = S.DOCTYPE_QUOTED;
              parser.q = c;
            }
          }
          continue;
        case S.DOCTYPE_QUOTED:
          parser.doctype += c;
          if (c === parser.q) {
            parser.q = "";
            parser.state = S.DOCTYPE;
          }
          continue;
        case S.DOCTYPE_DTD:
          parser.doctype += c;
          if (c === "]") {
            parser.state = S.DOCTYPE;
          } else if (isQuote(c)) {
            parser.state = S.DOCTYPE_DTD_QUOTED;
            parser.q = c;
          }
          continue;
        case S.DOCTYPE_DTD_QUOTED:
          parser.doctype += c;
          if (c === parser.q) {
            parser.state = S.DOCTYPE_DTD;
            parser.q = "";
          }
          continue;
        case S.COMMENT:
          if (c === "-") {
            parser.state = S.COMMENT_ENDING;
          } else {
            parser.comment += c;
          }
          continue;
        case S.COMMENT_ENDING:
          if (c === "-") {
            parser.state = S.COMMENT_ENDED;
            parser.comment = textopts(parser.opt, parser.comment);
            if (parser.comment) {
              emitNode(parser, "oncomment", parser.comment);
            }
            parser.comment = "";
          } else {
            parser.comment += "-" + c;
            parser.state = S.COMMENT;
          }
          continue;
        case S.COMMENT_ENDED:
          if (c !== ">") {
            strictFail(parser, "Malformed comment");
            parser.comment += "--" + c;
            parser.state = S.COMMENT;
          } else {
            parser.state = S.TEXT;
          }
          continue;
        case S.CDATA:
          if (c === "]") {
            parser.state = S.CDATA_ENDING;
          } else {
            parser.cdata += c;
          }
          continue;
        case S.CDATA_ENDING:
          if (c === "]") {
            parser.state = S.CDATA_ENDING_2;
          } else {
            parser.cdata += "]" + c;
            parser.state = S.CDATA;
          }
          continue;
        case S.CDATA_ENDING_2:
          if (c === ">") {
            if (parser.cdata) {
              emitNode(parser, "oncdata", parser.cdata);
            }
            emitNode(parser, "onclosecdata");
            parser.cdata = "";
            parser.state = S.TEXT;
          } else if (c === "]") {
            parser.cdata += "]";
          } else {
            parser.cdata += "]]" + c;
            parser.state = S.CDATA;
          }
          continue;
        case S.PROC_INST:
          if (c === "?") {
            parser.state = S.PROC_INST_ENDING;
          } else if (isWhitespace(c)) {
            parser.state = S.PROC_INST_BODY;
          } else {
            parser.procInstName += c;
          }
          continue;
        case S.PROC_INST_BODY:
          if (!parser.procInstBody && isWhitespace(c)) {
            continue;
          } else if (c === "?") {
            parser.state = S.PROC_INST_ENDING;
          } else {
            parser.procInstBody += c;
          }
          continue;
        case S.PROC_INST_ENDING:
          if (c === ">") {
            emitNode(parser, "onprocessinginstruction", {
              name: parser.procInstName,
              body: parser.procInstBody
            });
            parser.procInstName = parser.procInstBody = "";
            parser.state = S.TEXT;
          } else {
            parser.procInstBody += "?" + c;
            parser.state = S.PROC_INST_BODY;
          }
          continue;
        case S.OPEN_TAG:
          if (isMatch(nameBody, c)) {
            parser.tagName += c;
          } else {
            newTag(parser);
            if (c === ">") {
              openTag(parser);
            } else if (c === "/") {
              parser.state = S.OPEN_TAG_SLASH;
            } else {
              if (!isWhitespace(c)) {
                strictFail(parser, "Invalid character in tag name");
              }
              parser.state = S.ATTRIB;
            }
          }
          continue;
        case S.OPEN_TAG_SLASH:
          if (c === ">") {
            openTag(parser, true);
            closeTag(parser);
          } else {
            strictFail(parser, "Forward-slash in opening tag not followed by >");
            parser.state = S.ATTRIB;
          }
          continue;
        case S.ATTRIB:
          if (isWhitespace(c)) {
            continue;
          } else if (c === ">") {
            openTag(parser);
          } else if (c === "/") {
            parser.state = S.OPEN_TAG_SLASH;
          } else if (isMatch(nameStart, c)) {
            parser.attribName = c;
            parser.attribValue = "";
            parser.state = S.ATTRIB_NAME;
          } else {
            strictFail(parser, "Invalid attribute name");
          }
          continue;
        case S.ATTRIB_NAME:
          if (c === "=") {
            parser.state = S.ATTRIB_VALUE;
          } else if (c === ">") {
            strictFail(parser, "Attribute without value");
            parser.attribValue = parser.attribName;
            attrib(parser);
            openTag(parser);
          } else if (isWhitespace(c)) {
            parser.state = S.ATTRIB_NAME_SAW_WHITE;
          } else if (isMatch(nameBody, c)) {
            parser.attribName += c;
          } else {
            strictFail(parser, "Invalid attribute name");
          }
          continue;
        case S.ATTRIB_NAME_SAW_WHITE:
          if (c === "=") {
            parser.state = S.ATTRIB_VALUE;
          } else if (isWhitespace(c)) {
            continue;
          } else {
            strictFail(parser, "Attribute without value");
            parser.tag.attributes[parser.attribName] = "";
            parser.attribValue = "";
            emitNode(parser, "onattribute", {
              name: parser.attribName,
              value: ""
            });
            parser.attribName = "";
            if (c === ">") {
              openTag(parser);
            } else if (isMatch(nameStart, c)) {
              parser.attribName = c;
              parser.state = S.ATTRIB_NAME;
            } else {
              strictFail(parser, "Invalid attribute name");
              parser.state = S.ATTRIB;
            }
          }
          continue;
        case S.ATTRIB_VALUE:
          if (isWhitespace(c)) {
            continue;
          } else if (isQuote(c)) {
            parser.q = c;
            parser.state = S.ATTRIB_VALUE_QUOTED;
          } else {
            strictFail(parser, "Unquoted attribute value");
            parser.state = S.ATTRIB_VALUE_UNQUOTED;
            parser.attribValue = c;
          }
          continue;
        case S.ATTRIB_VALUE_QUOTED:
          if (c !== parser.q) {
            if (c === "&") {
              parser.state = S.ATTRIB_VALUE_ENTITY_Q;
            } else {
              parser.attribValue += c;
            }
            continue;
          }
          attrib(parser);
          parser.q = "";
          parser.state = S.ATTRIB_VALUE_CLOSED;
          continue;
        case S.ATTRIB_VALUE_CLOSED:
          if (isWhitespace(c)) {
            parser.state = S.ATTRIB;
          } else if (c === ">") {
            openTag(parser);
          } else if (c === "/") {
            parser.state = S.OPEN_TAG_SLASH;
          } else if (isMatch(nameStart, c)) {
            strictFail(parser, "No whitespace between attributes");
            parser.attribName = c;
            parser.attribValue = "";
            parser.state = S.ATTRIB_NAME;
          } else {
            strictFail(parser, "Invalid attribute name");
          }
          continue;
        case S.ATTRIB_VALUE_UNQUOTED:
          if (!isAttribEnd(c)) {
            if (c === "&") {
              parser.state = S.ATTRIB_VALUE_ENTITY_U;
            } else {
              parser.attribValue += c;
            }
            continue;
          }
          attrib(parser);
          if (c === ">") {
            openTag(parser);
          } else {
            parser.state = S.ATTRIB;
          }
          continue;
        case S.CLOSE_TAG:
          if (!parser.tagName) {
            if (isWhitespace(c)) {
              continue;
            } else if (notMatch(nameStart, c)) {
              if (parser.script) {
                parser.script += "</" + c;
                parser.state = S.SCRIPT;
              } else {
                strictFail(parser, "Invalid tagname in closing tag.");
              }
            } else {
              parser.tagName = c;
            }
          } else if (c === ">") {
            closeTag(parser);
          } else if (isMatch(nameBody, c)) {
            parser.tagName += c;
          } else if (parser.script) {
            parser.script += "</" + parser.tagName;
            parser.tagName = "";
            parser.state = S.SCRIPT;
          } else {
            if (!isWhitespace(c)) {
              strictFail(parser, "Invalid tagname in closing tag");
            }
            parser.state = S.CLOSE_TAG_SAW_WHITE;
          }
          continue;
        case S.CLOSE_TAG_SAW_WHITE:
          if (isWhitespace(c)) {
            continue;
          }
          if (c === ">") {
            closeTag(parser);
          } else {
            strictFail(parser, "Invalid characters in closing tag");
          }
          continue;
        case S.TEXT_ENTITY:
        case S.ATTRIB_VALUE_ENTITY_Q:
        case S.ATTRIB_VALUE_ENTITY_U:
          var returnState;
          var buffer;
          switch (parser.state) {
            case S.TEXT_ENTITY:
              returnState = S.TEXT;
              buffer = "textNode";
              break;
            case S.ATTRIB_VALUE_ENTITY_Q:
              returnState = S.ATTRIB_VALUE_QUOTED;
              buffer = "attribValue";
              break;
            case S.ATTRIB_VALUE_ENTITY_U:
              returnState = S.ATTRIB_VALUE_UNQUOTED;
              buffer = "attribValue";
              break;
          }
          if (c === ";") {
            if (parser.opt.unparsedEntities) {
              var parsedEntity = parseEntity(parser);
              parser.entity = "";
              parser.state = returnState;
              parser.write(parsedEntity);
            } else {
              parser[buffer] += parseEntity(parser);
              parser.entity = "";
              parser.state = returnState;
            }
          } else if (isMatch(parser.entity.length ? entityBody : entityStart, c)) {
            parser.entity += c;
          } else {
            strictFail(parser, "Invalid character in entity name");
            parser[buffer] += "&" + parser.entity + c;
            parser.entity = "";
            parser.state = returnState;
          }
          continue;
        default: {
          throw new Error(parser, "Unknown state: " + parser.state);
        }
      }
    }
    if (parser.position >= parser.bufferCheckPosition) {
      checkBufferLength(parser);
    }
    return parser;
  }
  if (!String.fromCodePoint) {
    (function() {
      var stringFromCharCode = String.fromCharCode;
      var floor = Math.floor;
      var fromCodePoint = function() {
        var MAX_SIZE = 16384;
        var codeUnits = [];
        var highSurrogate;
        var lowSurrogate;
        var index = -1;
        var length = arguments.length;
        if (!length) {
          return "";
        }
        var result = "";
        while (++index < length) {
          var codePoint = Number(arguments[index]);
          if (!isFinite(codePoint) || // `NaN`, `+Infinity`, or `-Infinity`
          codePoint < 0 || // not a valid Unicode code point
          codePoint > 1114111 || // not a valid Unicode code point
          floor(codePoint) !== codePoint) {
            throw RangeError("Invalid code point: " + codePoint);
          }
          if (codePoint <= 65535) {
            codeUnits.push(codePoint);
          } else {
            codePoint -= 65536;
            highSurrogate = (codePoint >> 10) + 55296;
            lowSurrogate = codePoint % 1024 + 56320;
            codeUnits.push(highSurrogate, lowSurrogate);
          }
          if (index + 1 === length || codeUnits.length > MAX_SIZE) {
            result += stringFromCharCode.apply(null, codeUnits);
            codeUnits.length = 0;
          }
        }
        return result;
      };
      if (Object.defineProperty) {
        Object.defineProperty(String, "fromCodePoint", {
          value: fromCodePoint,
          configurable: true,
          writable: true
        });
      } else {
        String.fromCodePoint = fromCodePoint;
      }
    })();
  }
  return sax2;
};
var sax = initializeSax();

export {
  BaseLLMOutputParser,
  BaseOutputParser,
  OutputParserException,
  BaseCumulativeTransformOutputParser,
  StructuredOutputParser,
  JsonOutputParser
};
/*! Bundled license information:

@langchain/core/dist/utils/sax-js/sax.js:
  (*! http://mths.be/fromcodepoint v0.1.0 by @mathias *)
*/
//# sourceMappingURL=chunk-EDF4OTNK.js.map
