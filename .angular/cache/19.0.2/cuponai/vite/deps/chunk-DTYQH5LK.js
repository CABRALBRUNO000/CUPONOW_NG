import {
  BaseChain
} from "./chunk-QN6VT6LH.js";
import {
  BaseOutputParser
} from "./chunk-W7L2JLTK.js";
import {
  BaseLanguageModel
} from "./chunk-CFFRNM6V.js";
import {
  BasePromptTemplate
} from "./chunk-OBIMT5KJ.js";
import {
  Runnable
} from "./chunk-ZKGI5TDH.js";
import {
  __async,
  __spreadValues
} from "./chunk-522HO4QB.js";

// node_modules/langchain/dist/output_parsers/noop.js
var NoOpOutputParser = class extends BaseOutputParser {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "lc_namespace", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: ["langchain", "output_parsers", "default"]
    });
    Object.defineProperty(this, "lc_serializable", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: true
    });
  }
  static lc_name() {
    return "NoOpOutputParser";
  }
  /**
   * This method takes a string as input and returns the same string as
   * output. It does not perform any operations on the input string.
   * @param text The input string to be parsed.
   * @returns The same input string without any operations performed on it.
   */
  parse(text) {
    return Promise.resolve(text);
  }
  /**
   * This method returns an empty string. It does not provide any formatting
   * instructions.
   * @returns An empty string, indicating no formatting instructions.
   */
  getFormatInstructions() {
    return "";
  }
};

// node_modules/langchain/dist/chains/llm_chain.js
function isBaseLanguageModel(llmLike) {
  return typeof llmLike._llmType === "function";
}
function _getLanguageModel(llmLike) {
  if (isBaseLanguageModel(llmLike)) {
    return llmLike;
  } else if ("bound" in llmLike && Runnable.isRunnable(llmLike.bound)) {
    return _getLanguageModel(llmLike.bound);
  } else if ("runnable" in llmLike && "fallbacks" in llmLike && Runnable.isRunnable(llmLike.runnable)) {
    return _getLanguageModel(llmLike.runnable);
  } else if ("default" in llmLike && Runnable.isRunnable(llmLike.default)) {
    return _getLanguageModel(llmLike.default);
  } else {
    throw new Error("Unable to extract BaseLanguageModel from llmLike object.");
  }
}
var LLMChain = class _LLMChain extends BaseChain {
  static lc_name() {
    return "LLMChain";
  }
  get inputKeys() {
    return this.prompt.inputVariables;
  }
  get outputKeys() {
    return [this.outputKey];
  }
  constructor(fields) {
    super(fields);
    Object.defineProperty(this, "lc_serializable", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: true
    });
    Object.defineProperty(this, "prompt", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "llm", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "llmKwargs", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "outputKey", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "text"
    });
    Object.defineProperty(this, "outputParser", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.prompt = fields.prompt;
    this.llm = fields.llm;
    this.llmKwargs = fields.llmKwargs;
    this.outputKey = fields.outputKey ?? this.outputKey;
    this.outputParser = fields.outputParser ?? new NoOpOutputParser();
    if (this.prompt.outputParser) {
      if (fields.outputParser) {
        throw new Error("Cannot set both outputParser and prompt.outputParser");
      }
      this.outputParser = this.prompt.outputParser;
    }
  }
  getCallKeys() {
    const callKeys = "callKeys" in this.llm ? this.llm.callKeys : [];
    return callKeys;
  }
  /** @ignore */
  _selectMemoryInputs(values) {
    const valuesForMemory = super._selectMemoryInputs(values);
    const callKeys = this.getCallKeys();
    for (const key of callKeys) {
      if (key in values) {
        delete valuesForMemory[key];
      }
    }
    return valuesForMemory;
  }
  /** @ignore */
  _getFinalOutput(generations, promptValue, runManager) {
    return __async(this, null, function* () {
      let finalCompletion;
      if (this.outputParser) {
        finalCompletion = yield this.outputParser.parseResultWithPrompt(generations, promptValue, runManager?.getChild());
      } else {
        finalCompletion = generations[0].text;
      }
      return finalCompletion;
    });
  }
  /**
   * Run the core logic of this chain and add to output if desired.
   *
   * Wraps _call and handles memory.
   */
  call(values, config) {
    return super.call(values, config);
  }
  /** @ignore */
  _call(values, runManager) {
    return __async(this, null, function* () {
      const valuesForPrompt = __spreadValues({}, values);
      const valuesForLLM = __spreadValues({}, this.llmKwargs);
      const callKeys = this.getCallKeys();
      for (const key of callKeys) {
        if (key in values) {
          if (valuesForLLM) {
            valuesForLLM[key] = values[key];
            delete valuesForPrompt[key];
          }
        }
      }
      const promptValue = yield this.prompt.formatPromptValue(valuesForPrompt);
      if ("generatePrompt" in this.llm) {
        const {
          generations
        } = yield this.llm.generatePrompt([promptValue], valuesForLLM, runManager?.getChild());
        return {
          [this.outputKey]: yield this._getFinalOutput(generations[0], promptValue, runManager)
        };
      }
      const modelWithParser = this.outputParser ? this.llm.pipe(this.outputParser) : this.llm;
      const response = yield modelWithParser.invoke(promptValue, runManager?.getChild());
      return {
        [this.outputKey]: response
      };
    });
  }
  /**
   * Format prompt with values and pass to LLM
   *
   * @param values - keys to pass to prompt template
   * @param callbackManager - CallbackManager to use
   * @returns Completion from LLM.
   *
   * @example
   * ```ts
   * llm.predict({ adjective: "funny" })
   * ```
   */
  predict(values, callbackManager) {
    return __async(this, null, function* () {
      const output = yield this.call(values, callbackManager);
      return output[this.outputKey];
    });
  }
  _chainType() {
    return "llm";
  }
  static deserialize(data) {
    return __async(this, null, function* () {
      const {
        llm,
        prompt
      } = data;
      if (!llm) {
        throw new Error("LLMChain must have llm");
      }
      if (!prompt) {
        throw new Error("LLMChain must have prompt");
      }
      return new _LLMChain({
        llm: yield BaseLanguageModel.deserialize(llm),
        prompt: yield BasePromptTemplate.deserialize(prompt)
      });
    });
  }
  /** @deprecated */
  serialize() {
    const serialize = "serialize" in this.llm ? this.llm.serialize() : void 0;
    return {
      _type: `${this._chainType()}_chain`,
      llm: serialize,
      prompt: this.prompt.serialize()
    };
  }
  _getNumTokens(text) {
    return _getLanguageModel(this.llm).getNumTokens(text);
  }
};

export {
  LLMChain
};
//# sourceMappingURL=chunk-DTYQH5LK.js.map
