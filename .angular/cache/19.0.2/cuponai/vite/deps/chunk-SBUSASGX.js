import {
  LLMChain
} from "./chunk-DTYQH5LK.js";
import {
  BaseChain
} from "./chunk-QN6VT6LH.js";
import {
  PromptTemplate
} from "./chunk-OBIMT5KJ.js";
import {
  __async,
  __objRest,
  __restKey,
  __spreadProps,
  __spreadValues
} from "./chunk-522HO4QB.js";

// node_modules/langchain/dist/chains/combine_docs_chain.js
var StuffDocumentsChain = class _StuffDocumentsChain extends BaseChain {
  static lc_name() {
    return "StuffDocumentsChain";
  }
  get inputKeys() {
    return [this.inputKey, ...this.llmChain.inputKeys].filter((key) => key !== this.documentVariableName);
  }
  get outputKeys() {
    return this.llmChain.outputKeys;
  }
  constructor(fields) {
    super(fields);
    Object.defineProperty(this, "llmChain", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "inputKey", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "input_documents"
    });
    Object.defineProperty(this, "documentVariableName", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "context"
    });
    this.llmChain = fields.llmChain;
    this.documentVariableName = fields.documentVariableName ?? this.documentVariableName;
    this.inputKey = fields.inputKey ?? this.inputKey;
  }
  /** @ignore */
  _prepInputs(values) {
    var _a;
    if (!(this.inputKey in values)) {
      throw new Error(`Document key ${this.inputKey} not found.`);
    }
    const _b = values, {
      [_a = this.inputKey]: docs
    } = _b, rest = __objRest(_b, [
      __restKey(_a)
    ]);
    const texts = docs.map(({
      pageContent
    }) => pageContent);
    const text = texts.join("\n\n");
    return __spreadProps(__spreadValues({}, rest), {
      [this.documentVariableName]: text
    });
  }
  /** @ignore */
  _call(values, runManager) {
    return __async(this, null, function* () {
      const result = yield this.llmChain.call(this._prepInputs(values), runManager?.getChild("combine_documents"));
      return result;
    });
  }
  _chainType() {
    return "stuff_documents_chain";
  }
  static deserialize(data) {
    return __async(this, null, function* () {
      if (!data.llm_chain) {
        throw new Error("Missing llm_chain");
      }
      return new _StuffDocumentsChain({
        llmChain: yield LLMChain.deserialize(data.llm_chain)
      });
    });
  }
  serialize() {
    return {
      _type: this._chainType(),
      llm_chain: this.llmChain.serialize()
    };
  }
};
var MapReduceDocumentsChain = class _MapReduceDocumentsChain extends BaseChain {
  static lc_name() {
    return "MapReduceDocumentsChain";
  }
  get inputKeys() {
    return [this.inputKey, ...this.combineDocumentChain.inputKeys];
  }
  get outputKeys() {
    return this.combineDocumentChain.outputKeys;
  }
  constructor(fields) {
    super(fields);
    Object.defineProperty(this, "llmChain", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "inputKey", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "input_documents"
    });
    Object.defineProperty(this, "documentVariableName", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "context"
    });
    Object.defineProperty(this, "returnIntermediateSteps", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: false
    });
    Object.defineProperty(this, "maxTokens", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 3e3
    });
    Object.defineProperty(this, "maxIterations", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 10
    });
    Object.defineProperty(this, "ensureMapStep", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: false
    });
    Object.defineProperty(this, "combineDocumentChain", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.llmChain = fields.llmChain;
    this.combineDocumentChain = fields.combineDocumentChain;
    this.documentVariableName = fields.documentVariableName ?? this.documentVariableName;
    this.ensureMapStep = fields.ensureMapStep ?? this.ensureMapStep;
    this.inputKey = fields.inputKey ?? this.inputKey;
    this.maxTokens = fields.maxTokens ?? this.maxTokens;
    this.maxIterations = fields.maxIterations ?? this.maxIterations;
    this.returnIntermediateSteps = fields.returnIntermediateSteps ?? false;
  }
  /** @ignore */
  _call(values, runManager) {
    return __async(this, null, function* () {
      var _a;
      if (!(this.inputKey in values)) {
        throw new Error(`Document key ${this.inputKey} not found.`);
      }
      const _b = values, {
        [_a = this.inputKey]: docs
      } = _b, rest = __objRest(_b, [
        __restKey(_a)
      ]);
      let currentDocs = docs;
      let intermediateSteps = [];
      for (let i = 0; i < this.maxIterations; i += 1) {
        const inputs = currentDocs.map((d) => __spreadValues({
          [this.documentVariableName]: d.pageContent
        }, rest));
        const canSkipMapStep = i !== 0 || !this.ensureMapStep;
        if (canSkipMapStep) {
          const formatted = yield this.combineDocumentChain.llmChain.prompt.format(this.combineDocumentChain._prepInputs(__spreadValues({
            [this.combineDocumentChain.inputKey]: currentDocs
          }, rest)));
          const length = yield this.combineDocumentChain.llmChain._getNumTokens(formatted);
          const withinTokenLimit = length < this.maxTokens;
          if (withinTokenLimit) {
            break;
          }
        }
        const results = yield this.llmChain.apply(
          inputs,
          // If we have a runManager, then we need to create a child for each input
          // so that we can track the progress of each input.
          runManager ? Array.from({
            length: inputs.length
          }, (_, i2) => runManager.getChild(`map_${i2 + 1}`)) : void 0
        );
        const {
          outputKey
        } = this.llmChain;
        if (this.returnIntermediateSteps) {
          intermediateSteps = intermediateSteps.concat(results.map((r) => r[outputKey]));
        }
        currentDocs = results.map((r) => ({
          pageContent: r[outputKey],
          metadata: {}
        }));
      }
      const newInputs = __spreadValues({
        [this.combineDocumentChain.inputKey]: currentDocs
      }, rest);
      const result = yield this.combineDocumentChain.call(newInputs, runManager?.getChild("combine_documents"));
      if (this.returnIntermediateSteps) {
        return __spreadProps(__spreadValues({}, result), {
          intermediateSteps
        });
      }
      return result;
    });
  }
  _chainType() {
    return "map_reduce_documents_chain";
  }
  static deserialize(data) {
    return __async(this, null, function* () {
      if (!data.llm_chain) {
        throw new Error("Missing llm_chain");
      }
      if (!data.combine_document_chain) {
        throw new Error("Missing combine_document_chain");
      }
      return new _MapReduceDocumentsChain({
        llmChain: yield LLMChain.deserialize(data.llm_chain),
        combineDocumentChain: yield StuffDocumentsChain.deserialize(data.combine_document_chain)
      });
    });
  }
  serialize() {
    return {
      _type: this._chainType(),
      llm_chain: this.llmChain.serialize(),
      combine_document_chain: this.combineDocumentChain.serialize()
    };
  }
};
var RefineDocumentsChain = class _RefineDocumentsChain extends BaseChain {
  static lc_name() {
    return "RefineDocumentsChain";
  }
  get defaultDocumentPrompt() {
    return new PromptTemplate({
      inputVariables: ["page_content"],
      template: "{page_content}"
    });
  }
  get inputKeys() {
    return [.../* @__PURE__ */ new Set([this.inputKey, ...this.llmChain.inputKeys, ...this.refineLLMChain.inputKeys])].filter((key) => key !== this.documentVariableName && key !== this.initialResponseName);
  }
  get outputKeys() {
    return [this.outputKey];
  }
  constructor(fields) {
    super(fields);
    Object.defineProperty(this, "llmChain", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "inputKey", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "input_documents"
    });
    Object.defineProperty(this, "outputKey", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "output_text"
    });
    Object.defineProperty(this, "documentVariableName", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "context"
    });
    Object.defineProperty(this, "initialResponseName", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "existing_answer"
    });
    Object.defineProperty(this, "refineLLMChain", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "documentPrompt", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: this.defaultDocumentPrompt
    });
    this.llmChain = fields.llmChain;
    this.refineLLMChain = fields.refineLLMChain;
    this.documentVariableName = fields.documentVariableName ?? this.documentVariableName;
    this.inputKey = fields.inputKey ?? this.inputKey;
    this.outputKey = fields.outputKey ?? this.outputKey;
    this.documentPrompt = fields.documentPrompt ?? this.documentPrompt;
    this.initialResponseName = fields.initialResponseName ?? this.initialResponseName;
  }
  /** @ignore */
  _constructInitialInputs(doc, rest) {
    return __async(this, null, function* () {
      const baseInfo = __spreadValues({
        page_content: doc.pageContent
      }, doc.metadata);
      const documentInfo = {};
      this.documentPrompt.inputVariables.forEach((value) => {
        documentInfo[value] = baseInfo[value];
      });
      const baseInputs = {
        [this.documentVariableName]: yield this.documentPrompt.format(__spreadValues({}, documentInfo))
      };
      const inputs = __spreadValues(__spreadValues({}, baseInputs), rest);
      return inputs;
    });
  }
  /** @ignore */
  _constructRefineInputs(doc, res) {
    return __async(this, null, function* () {
      const baseInfo = __spreadValues({
        page_content: doc.pageContent
      }, doc.metadata);
      const documentInfo = {};
      this.documentPrompt.inputVariables.forEach((value) => {
        documentInfo[value] = baseInfo[value];
      });
      const baseInputs = {
        [this.documentVariableName]: yield this.documentPrompt.format(__spreadValues({}, documentInfo))
      };
      const inputs = __spreadValues({
        [this.initialResponseName]: res
      }, baseInputs);
      return inputs;
    });
  }
  /** @ignore */
  _call(values, runManager) {
    return __async(this, null, function* () {
      var _a;
      if (!(this.inputKey in values)) {
        throw new Error(`Document key ${this.inputKey} not found.`);
      }
      const _b = values, {
        [_a = this.inputKey]: docs
      } = _b, rest = __objRest(_b, [
        __restKey(_a)
      ]);
      const currentDocs = docs;
      const initialInputs = yield this._constructInitialInputs(currentDocs[0], rest);
      let res = yield this.llmChain.predict(__spreadValues({}, initialInputs), runManager?.getChild("answer"));
      const refineSteps = [res];
      for (let i = 1; i < currentDocs.length; i += 1) {
        const refineInputs = yield this._constructRefineInputs(currentDocs[i], res);
        const inputs = __spreadValues(__spreadValues({}, refineInputs), rest);
        res = yield this.refineLLMChain.predict(__spreadValues({}, inputs), runManager?.getChild("refine"));
        refineSteps.push(res);
      }
      return {
        [this.outputKey]: res
      };
    });
  }
  _chainType() {
    return "refine_documents_chain";
  }
  static deserialize(data) {
    return __async(this, null, function* () {
      const SerializedLLMChain = data.llm_chain;
      if (!SerializedLLMChain) {
        throw new Error("Missing llm_chain");
      }
      const SerializedRefineDocumentChain = data.refine_llm_chain;
      if (!SerializedRefineDocumentChain) {
        throw new Error("Missing refine_llm_chain");
      }
      return new _RefineDocumentsChain({
        llmChain: yield LLMChain.deserialize(SerializedLLMChain),
        refineLLMChain: yield LLMChain.deserialize(SerializedRefineDocumentChain)
      });
    });
  }
  serialize() {
    return {
      _type: this._chainType(),
      llm_chain: this.llmChain.serialize(),
      refine_llm_chain: this.refineLLMChain.serialize()
    };
  }
};

export {
  StuffDocumentsChain,
  MapReduceDocumentsChain,
  RefineDocumentsChain
};
//# sourceMappingURL=chunk-SBUSASGX.js.map
