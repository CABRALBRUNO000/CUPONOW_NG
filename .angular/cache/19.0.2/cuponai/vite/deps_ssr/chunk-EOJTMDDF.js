import { createRequire } from 'module';const require = createRequire(import.meta.url);
import {
  BaseChain
} from "./chunk-GFBVB7YW.js";
import {
  __async
} from "./chunk-LKDWXENB.js";

// node_modules/langchain/dist/util/set.js
function intersection(setA, setB) {
  const _intersection = /* @__PURE__ */ new Set();
  for (const elem of setB) {
    if (setA.has(elem)) {
      _intersection.add(elem);
    }
  }
  return _intersection;
}
function union(setA, setB) {
  const _union = new Set(setA);
  for (const elem of setB) {
    _union.add(elem);
  }
  return _union;
}
function difference(setA, setB) {
  const _difference = new Set(setA);
  for (const elem of setB) {
    _difference.delete(elem);
  }
  return _difference;
}

// node_modules/langchain/dist/chains/sequential_chain.js
function formatSet(input) {
  return Array.from(input).map((i) => `"${i}"`).join(", ");
}
var SequentialChain = class _SequentialChain extends BaseChain {
  static lc_name() {
    return "SequentialChain";
  }
  get inputKeys() {
    return this.inputVariables;
  }
  get outputKeys() {
    return this.outputVariables;
  }
  constructor(fields) {
    super(fields);
    Object.defineProperty(this, "chains", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "inputVariables", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "outputVariables", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "returnAll", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.chains = fields.chains;
    this.inputVariables = fields.inputVariables;
    this.outputVariables = fields.outputVariables ?? [];
    if (this.outputVariables.length > 0 && fields.returnAll) {
      throw new Error("Either specify variables to return using `outputVariables` or use `returnAll` param. Cannot apply both conditions at the same time.");
    }
    this.returnAll = fields.returnAll ?? false;
    this._validateChains();
  }
  /** @ignore */
  _validateChains() {
    if (this.chains.length === 0) {
      throw new Error("Sequential chain must have at least one chain.");
    }
    const memoryKeys = this.memory?.memoryKeys ?? [];
    const inputKeysSet = new Set(this.inputKeys);
    const memoryKeysSet = new Set(memoryKeys);
    const keysIntersection = intersection(inputKeysSet, memoryKeysSet);
    if (keysIntersection.size > 0) {
      throw new Error(`The following keys: ${formatSet(keysIntersection)} are overlapping between memory and input keys of the chain variables. This can lead to unexpected behaviour. Please use input and memory keys that don't overlap.`);
    }
    const availableKeys = union(inputKeysSet, memoryKeysSet);
    for (const chain of this.chains) {
      let missingKeys = difference(new Set(chain.inputKeys), availableKeys);
      if (chain.memory) {
        missingKeys = difference(missingKeys, new Set(chain.memory.memoryKeys));
      }
      if (missingKeys.size > 0) {
        throw new Error(`Missing variables for chain "${chain._chainType()}": ${formatSet(missingKeys)}. Only got the following variables: ${formatSet(availableKeys)}.`);
      }
      const outputKeysSet = new Set(chain.outputKeys);
      const overlappingOutputKeys = intersection(availableKeys, outputKeysSet);
      if (overlappingOutputKeys.size > 0) {
        throw new Error(`The following output variables for chain "${chain._chainType()}" are overlapping: ${formatSet(overlappingOutputKeys)}. This can lead to unexpected behaviour.`);
      }
      for (const outputKey of outputKeysSet) {
        availableKeys.add(outputKey);
      }
    }
    if (this.outputVariables.length === 0) {
      if (this.returnAll) {
        const outputKeys = difference(availableKeys, inputKeysSet);
        this.outputVariables = Array.from(outputKeys);
      } else {
        this.outputVariables = this.chains[this.chains.length - 1].outputKeys;
      }
    } else {
      const missingKeys = difference(new Set(this.outputVariables), new Set(availableKeys));
      if (missingKeys.size > 0) {
        throw new Error(`The following output variables were expected to be in the final chain output but were not found: ${formatSet(missingKeys)}.`);
      }
    }
  }
  /** @ignore */
  _call(values, runManager) {
    return __async(this, null, function* () {
      let input = {};
      const allChainValues = values;
      let i = 0;
      for (const chain of this.chains) {
        i += 1;
        input = yield chain.call(allChainValues, runManager?.getChild(`step_${i}`));
        for (const key of Object.keys(input)) {
          allChainValues[key] = input[key];
        }
      }
      const output = {};
      for (const key of this.outputVariables) {
        output[key] = allChainValues[key];
      }
      return output;
    });
  }
  _chainType() {
    return "sequential_chain";
  }
  static deserialize(data) {
    return __async(this, null, function* () {
      const chains = [];
      const inputVariables = data.input_variables;
      const outputVariables = data.output_variables;
      const serializedChains = data.chains;
      for (const serializedChain of serializedChains) {
        const deserializedChain = yield BaseChain.deserialize(serializedChain);
        chains.push(deserializedChain);
      }
      return new _SequentialChain({
        chains,
        inputVariables,
        outputVariables
      });
    });
  }
  serialize() {
    const chains = [];
    for (const chain of this.chains) {
      chains.push(chain.serialize());
    }
    return {
      _type: this._chainType(),
      input_variables: this.inputVariables,
      output_variables: this.outputVariables,
      chains
    };
  }
};
var SimpleSequentialChain = class _SimpleSequentialChain extends BaseChain {
  static lc_name() {
    return "SimpleSequentialChain";
  }
  get inputKeys() {
    return [this.inputKey];
  }
  get outputKeys() {
    return [this.outputKey];
  }
  constructor(fields) {
    super(fields);
    Object.defineProperty(this, "chains", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "inputKey", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "input"
    });
    Object.defineProperty(this, "outputKey", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "output"
    });
    Object.defineProperty(this, "trimOutputs", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.chains = fields.chains;
    this.trimOutputs = fields.trimOutputs ?? false;
    this._validateChains();
  }
  /** @ignore */
  _validateChains() {
    for (const chain of this.chains) {
      if (chain.inputKeys.filter((k) => !chain.memory?.memoryKeys.includes(k)).length !== 1) {
        throw new Error(`Chains used in SimpleSequentialChain should all have one input, got ${chain.inputKeys.length} for ${chain._chainType()}.`);
      }
      if (chain.outputKeys.length !== 1) {
        throw new Error(`Chains used in SimpleSequentialChain should all have one output, got ${chain.outputKeys.length} for ${chain._chainType()}.`);
      }
    }
  }
  /** @ignore */
  _call(values, runManager) {
    return __async(this, null, function* () {
      let input = values[this.inputKey];
      let i = 0;
      for (const chain of this.chains) {
        i += 1;
        input = (yield chain.call({
          [chain.inputKeys[0]]: input,
          signal: values.signal
        }, runManager?.getChild(`step_${i}`)))[chain.outputKeys[0]];
        if (this.trimOutputs) {
          input = input.trim();
        }
        yield runManager?.handleText(input);
      }
      return {
        [this.outputKey]: input
      };
    });
  }
  _chainType() {
    return "simple_sequential_chain";
  }
  static deserialize(data) {
    return __async(this, null, function* () {
      const chains = [];
      const serializedChains = data.chains;
      for (const serializedChain of serializedChains) {
        const deserializedChain = yield BaseChain.deserialize(serializedChain);
        chains.push(deserializedChain);
      }
      return new _SimpleSequentialChain({
        chains
      });
    });
  }
  serialize() {
    const chains = [];
    for (const chain of this.chains) {
      chains.push(chain.serialize());
    }
    return {
      _type: this._chainType(),
      chains
    };
  }
};

export {
  SequentialChain,
  SimpleSequentialChain
};
//# sourceMappingURL=chunk-EOJTMDDF.js.map