import { createRequire } from 'module';const require = createRequire(import.meta.url);
import {
  BaseLangChain
} from "./chunk-A6ZYBSJS.js";
import {
  CallbackManager,
  RUN_KEY,
  ensureConfig,
  parseCallbackConfigArg
} from "./chunk-APP2RMRU.js";
import {
  __async,
  __objRest,
  __spreadProps,
  __spreadValues
} from "./chunk-LKDWXENB.js";

// node_modules/langchain/dist/chains/base.js
var BaseChain = class extends BaseLangChain {
  get lc_namespace() {
    return ["langchain", "chains", this._chainType()];
  }
  constructor(fields, verbose, callbacks) {
    if (arguments.length === 1 && typeof fields === "object" && !("saveContext" in fields)) {
      const _a = fields, {
        memory,
        callbackManager
      } = _a, rest = __objRest(_a, [
        "memory",
        "callbackManager"
      ]);
      super(__spreadProps(__spreadValues({}, rest), {
        callbacks: callbackManager ?? rest.callbacks
      }));
      this.memory = memory;
    } else {
      super({
        verbose,
        callbacks
      });
      this.memory = fields;
    }
  }
  /** @ignore */
  _selectMemoryInputs(values) {
    const valuesForMemory = __spreadValues({}, values);
    if ("signal" in valuesForMemory) {
      delete valuesForMemory.signal;
    }
    if ("timeout" in valuesForMemory) {
      delete valuesForMemory.timeout;
    }
    return valuesForMemory;
  }
  /**
   * Invoke the chain with the provided input and returns the output.
   * @param input Input values for the chain run.
   * @param config Optional configuration for the Runnable.
   * @returns Promise that resolves with the output of the chain run.
   */
  invoke(input, options) {
    return __async(this, null, function* () {
      const config = ensureConfig(options);
      const fullValues = yield this._formatValues(input);
      const callbackManager_ = yield CallbackManager.configure(config?.callbacks, this.callbacks, config?.tags, this.tags, config?.metadata, this.metadata, {
        verbose: this.verbose
      });
      const runManager = yield callbackManager_?.handleChainStart(this.toJSON(), fullValues, void 0, void 0, void 0, void 0, config?.runName);
      let outputValues;
      try {
        outputValues = yield fullValues.signal ? Promise.race([this._call(fullValues, runManager, config), new Promise((_, reject) => {
          fullValues.signal?.addEventListener("abort", () => {
            reject(new Error("AbortError"));
          });
        })]) : this._call(fullValues, runManager, config);
      } catch (e) {
        yield runManager?.handleChainError(e);
        throw e;
      }
      if (!(this.memory == null)) {
        yield this.memory.saveContext(this._selectMemoryInputs(input), outputValues);
      }
      yield runManager?.handleChainEnd(outputValues);
      Object.defineProperty(outputValues, RUN_KEY, {
        value: runManager ? {
          runId: runManager?.runId
        } : void 0,
        configurable: true
      });
      return outputValues;
    });
  }
  _validateOutputs(outputs) {
    const missingKeys = this.outputKeys.filter((k) => !(k in outputs));
    if (missingKeys.length) {
      throw new Error(`Missing output keys: ${missingKeys.join(", ")} from chain ${this._chainType()}`);
    }
  }
  prepOutputs(inputs, outputs, returnOnlyOutputs = false) {
    return __async(this, null, function* () {
      this._validateOutputs(outputs);
      if (this.memory) {
        yield this.memory.saveContext(inputs, outputs);
      }
      if (returnOnlyOutputs) {
        return outputs;
      }
      return __spreadValues(__spreadValues({}, inputs), outputs);
    });
  }
  /**
   * Return a json-like object representing this chain.
   */
  serialize() {
    throw new Error("Method not implemented.");
  }
  /** @deprecated Use .invoke() instead. Will be removed in 0.2.0. */
  run(input, config) {
    return __async(this, null, function* () {
      const inputKeys = this.inputKeys.filter((k) => !this.memory?.memoryKeys.includes(k));
      const isKeylessInput = inputKeys.length <= 1;
      if (!isKeylessInput) {
        throw new Error(`Chain ${this._chainType()} expects multiple inputs, cannot use 'run' `);
      }
      const values = inputKeys.length ? {
        [inputKeys[0]]: input
      } : {};
      const returnValues = yield this.call(values, config);
      const keys = Object.keys(returnValues);
      if (keys.length === 1) {
        return returnValues[keys[0]];
      }
      throw new Error("return values have multiple keys, `run` only supported when one key currently");
    });
  }
  _formatValues(values) {
    return __async(this, null, function* () {
      const fullValues = __spreadValues({}, values);
      if (fullValues.timeout && !fullValues.signal) {
        fullValues.signal = AbortSignal.timeout(fullValues.timeout);
        delete fullValues.timeout;
      }
      if (!(this.memory == null)) {
        const newValues = yield this.memory.loadMemoryVariables(this._selectMemoryInputs(values));
        for (const [key, value] of Object.entries(newValues)) {
          fullValues[key] = value;
        }
      }
      return fullValues;
    });
  }
  /**
   * @deprecated Use .invoke() instead. Will be removed in 0.2.0.
   *
   * Run the core logic of this chain and add to output if desired.
   *
   * Wraps _call and handles memory.
   */
  call(values, config, tags) {
    return __async(this, null, function* () {
      const parsedConfig = __spreadValues({
        tags
      }, parseCallbackConfigArg(config));
      return this.invoke(values, parsedConfig);
    });
  }
  /**
   * @deprecated Use .batch() instead. Will be removed in 0.2.0.
   *
   * Call the chain on all inputs in the list
   */
  apply(inputs, config) {
    return __async(this, null, function* () {
      return Promise.all(inputs.map((i, idx) => __async(this, null, function* () {
        return this.call(i, config?.[idx]);
      })));
    });
  }
  /**
   * Load a chain from a json-like object describing it.
   */
  static deserialize(_0) {
    return __async(this, arguments, function* (data, values = {}) {
      switch (data._type) {
        case "llm_chain": {
          const {
            LLMChain
          } = yield import("./llm_chain-F2VP3XWD.js");
          return LLMChain.deserialize(data);
        }
        case "sequential_chain": {
          const {
            SequentialChain
          } = yield import("./sequential_chain-NKX5LEIQ.js");
          return SequentialChain.deserialize(data);
        }
        case "simple_sequential_chain": {
          const {
            SimpleSequentialChain
          } = yield import("./sequential_chain-NKX5LEIQ.js");
          return SimpleSequentialChain.deserialize(data);
        }
        case "stuff_documents_chain": {
          const {
            StuffDocumentsChain
          } = yield import("./combine_docs_chain-RCH4I3OO.js");
          return StuffDocumentsChain.deserialize(data);
        }
        case "map_reduce_documents_chain": {
          const {
            MapReduceDocumentsChain
          } = yield import("./combine_docs_chain-RCH4I3OO.js");
          return MapReduceDocumentsChain.deserialize(data);
        }
        case "refine_documents_chain": {
          const {
            RefineDocumentsChain
          } = yield import("./combine_docs_chain-RCH4I3OO.js");
          return RefineDocumentsChain.deserialize(data);
        }
        case "vector_db_qa": {
          const {
            VectorDBQAChain
          } = yield import("./vector_db_qa-FHKMWKLF.js");
          return VectorDBQAChain.deserialize(data, values);
        }
        case "api_chain": {
          const {
            APIChain
          } = yield import("./api_chain-6ROY2HVI.js");
          return APIChain.deserialize(data);
        }
        default:
          throw new Error(`Invalid prompt type in config: ${data._type}`);
      }
    });
  }
};

export {
  BaseChain
};
//# sourceMappingURL=chunk-GFBVB7YW.js.map
