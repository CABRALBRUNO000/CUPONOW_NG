import {
  ChatPromptTemplate
} from "./chunk-BPQYAL6B.js";
import {
  BasePromptTemplate
} from "./chunk-OBIMT5KJ.js";
import {
  __async,
  __spreadProps,
  __spreadValues
} from "./chunk-522HO4QB.js";

// node_modules/@langchain/core/dist/prompts/pipeline.js
var PipelinePromptTemplate = class _PipelinePromptTemplate extends BasePromptTemplate {
  static lc_name() {
    return "PipelinePromptTemplate";
  }
  constructor(input) {
    super(__spreadProps(__spreadValues({}, input), {
      inputVariables: []
    }));
    Object.defineProperty(this, "pipelinePrompts", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "finalPrompt", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.pipelinePrompts = input.pipelinePrompts;
    this.finalPrompt = input.finalPrompt;
    this.inputVariables = this.computeInputValues();
  }
  /**
   * Computes the input values required by the pipeline prompts.
   * @returns Array of input values required by the pipeline prompts.
   */
  computeInputValues() {
    const intermediateValues = this.pipelinePrompts.map((pipelinePrompt) => pipelinePrompt.name);
    const inputValues = this.pipelinePrompts.map((pipelinePrompt) => pipelinePrompt.prompt.inputVariables.filter((inputValue) => !intermediateValues.includes(inputValue))).flat();
    return [...new Set(inputValues)];
  }
  static extractRequiredInputValues(allValues, requiredValueNames) {
    return requiredValueNames.reduce((requiredValues, valueName) => {
      requiredValues[valueName] = allValues[valueName];
      return requiredValues;
    }, {});
  }
  /**
   * Formats the pipeline prompts based on the provided input values.
   * @param values Input values to format the pipeline prompts.
   * @returns Promise that resolves with the formatted input values.
   */
  formatPipelinePrompts(values) {
    return __async(this, null, function* () {
      const allValues = yield this.mergePartialAndUserVariables(values);
      for (const {
        name: pipelinePromptName,
        prompt: pipelinePrompt
      } of this.pipelinePrompts) {
        const pipelinePromptInputValues = _PipelinePromptTemplate.extractRequiredInputValues(allValues, pipelinePrompt.inputVariables);
        if (pipelinePrompt instanceof ChatPromptTemplate) {
          allValues[pipelinePromptName] = yield pipelinePrompt.formatMessages(pipelinePromptInputValues);
        } else {
          allValues[pipelinePromptName] = yield pipelinePrompt.format(pipelinePromptInputValues);
        }
      }
      return _PipelinePromptTemplate.extractRequiredInputValues(allValues, this.finalPrompt.inputVariables);
    });
  }
  /**
   * Formats the final prompt value based on the provided input values.
   * @param values Input values to format the final prompt value.
   * @returns Promise that resolves with the formatted final prompt value.
   */
  formatPromptValue(values) {
    return __async(this, null, function* () {
      return this.finalPrompt.formatPromptValue(yield this.formatPipelinePrompts(values));
    });
  }
  format(values) {
    return __async(this, null, function* () {
      return this.finalPrompt.format(yield this.formatPipelinePrompts(values));
    });
  }
  /**
   * Handles partial prompts, which are prompts that have been partially
   * filled with input values.
   * @param values Partial input values.
   * @returns Promise that resolves with a new PipelinePromptTemplate instance with updated input variables.
   */
  partial(values) {
    return __async(this, null, function* () {
      const promptDict = __spreadValues({}, this);
      promptDict.inputVariables = this.inputVariables.filter((iv) => !(iv in values));
      promptDict.partialVariables = __spreadValues(__spreadValues({}, this.partialVariables ?? {}), values);
      return new _PipelinePromptTemplate(promptDict);
    });
  }
  serialize() {
    throw new Error("Not implemented.");
  }
  _getPromptType() {
    return "pipeline";
  }
};

// node_modules/@langchain/core/dist/prompts/structured.js
function isWithStructuredOutput(x) {
  return typeof x === "object" && x != null && "withStructuredOutput" in x && typeof x.withStructuredOutput === "function";
}
function isRunnableBinding(x) {
  return typeof x === "object" && x != null && "lc_id" in x && Array.isArray(x.lc_id) && x.lc_id.join("/") === "langchain_core/runnables/RunnableBinding";
}
var StructuredPrompt = class _StructuredPrompt extends ChatPromptTemplate {
  get lc_aliases() {
    return __spreadProps(__spreadValues({}, super.lc_aliases), {
      schema: "schema_"
    });
  }
  constructor(input) {
    super(input);
    Object.defineProperty(this, "schema", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "lc_namespace", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: ["langchain_core", "prompts", "structured"]
    });
    this.schema = input.schema;
  }
  pipe(coerceable) {
    if (isWithStructuredOutput(coerceable)) {
      return super.pipe(coerceable.withStructuredOutput(this.schema));
    }
    if (isRunnableBinding(coerceable) && isWithStructuredOutput(coerceable.bound)) {
      return super.pipe(coerceable.bound.withStructuredOutput(this.schema).bind(coerceable.kwargs ?? {}).withConfig(coerceable.config));
    }
    throw new Error(`Structured prompts need to be piped to a language model that supports the "withStructuredOutput()" method.`);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromMessagesAndSchema(promptMessages, schema) {
    return _StructuredPrompt.fromMessages(promptMessages, {
      schema
    });
  }
};

export {
  PipelinePromptTemplate,
  StructuredPrompt
};
//# sourceMappingURL=chunk-A6AZVN2W.js.map
