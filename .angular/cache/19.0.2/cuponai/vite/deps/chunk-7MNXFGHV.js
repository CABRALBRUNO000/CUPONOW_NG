import {
  AIMessage,
  HumanMessage,
  Runnable,
  Serializable,
  getBufferString
} from "./chunk-ZKGI5TDH.js";
import {
  __async
} from "./chunk-522HO4QB.js";

// node_modules/@langchain/core/dist/memory.js
var BaseMemory = class {
};
var getValue = (values, key) => {
  if (key !== void 0) {
    return values[key];
  }
  const keys = Object.keys(values);
  if (keys.length === 1) {
    return values[keys[0]];
  }
};
var getInputValue = (inputValues, inputKey) => {
  const value = getValue(inputValues, inputKey);
  if (!value) {
    const keys = Object.keys(inputValues);
    throw new Error(`input values have ${keys.length} keys, you must specify an input key or pass only 1 key as input`);
  }
  return value;
};
var getOutputValue = (outputValues, outputKey) => {
  const value = getValue(outputValues, outputKey);
  if (!value && value !== "") {
    const keys = Object.keys(outputValues);
    throw new Error(`output values have ${keys.length} keys, you must specify an output key or pass only 1 key as output`);
  }
  return value;
};
function getPromptInputKey(inputs, memoryVariables) {
  const promptInputKeys = Object.keys(inputs).filter((key) => !memoryVariables.includes(key) && key !== "stop");
  if (promptInputKeys.length !== 1) {
    throw new Error(`One input key expected, but got ${promptInputKeys.length}`);
  }
  return promptInputKeys[0];
}

// node_modules/@langchain/core/dist/chat_history.js
var BaseListChatMessageHistory = class extends Serializable {
  /**
   * This is a convenience method for adding a human message string to the store.
   * Please note that this is a convenience method. Code should favor the
   * bulk addMessages interface instead to save on round-trips to the underlying
   * persistence layer.
   * This method may be deprecated in a future release.
   */
  addUserMessage(message) {
    return this.addMessage(new HumanMessage(message));
  }
  /** @deprecated Use addAIMessage instead */
  addAIChatMessage(message) {
    return this.addMessage(new AIMessage(message));
  }
  /**
   * This is a convenience method for adding an AI message string to the store.
   * Please note that this is a convenience method. Code should favor the bulk
   * addMessages interface instead to save on round-trips to the underlying
   * persistence layer.
   * This method may be deprecated in a future release.
   */
  addAIMessage(message) {
    return this.addMessage(new AIMessage(message));
  }
  /**
   * Add a list of messages.
   *
   * Implementations should override this method to handle bulk addition of messages
   * in an efficient manner to avoid unnecessary round-trips to the underlying store.
   *
   * @param messages - A list of BaseMessage objects to store.
   */
  addMessages(messages) {
    return __async(this, null, function* () {
      for (const message of messages) {
        yield this.addMessage(message);
      }
    });
  }
  /**
   * Remove all messages from the store.
   */
  clear() {
    throw new Error("Not implemented.");
  }
};
var InMemoryChatMessageHistory = class extends BaseListChatMessageHistory {
  constructor(messages) {
    super(...arguments);
    Object.defineProperty(this, "lc_namespace", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: ["langchain", "stores", "message", "in_memory"]
    });
    Object.defineProperty(this, "messages", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: []
    });
    this.messages = messages ?? [];
  }
  /**
   * Method to get all the messages stored in the ChatMessageHistory
   * instance.
   * @returns Array of stored BaseMessage instances.
   */
  getMessages() {
    return __async(this, null, function* () {
      return this.messages;
    });
  }
  /**
   * Method to add a new message to the ChatMessageHistory instance.
   * @param message The BaseMessage instance to add.
   * @returns A promise that resolves when the message has been added.
   */
  addMessage(message) {
    return __async(this, null, function* () {
      this.messages.push(message);
    });
  }
  /**
   * Method to clear all the messages from the ChatMessageHistory instance.
   * @returns A promise that resolves when all messages have been cleared.
   */
  clear() {
    return __async(this, null, function* () {
      this.messages = [];
    });
  }
};

// node_modules/langchain/dist/memory/chat_memory.js
var BaseChatMemory = class extends BaseMemory {
  constructor(fields) {
    super();
    Object.defineProperty(this, "chatHistory", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "returnMessages", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: false
    });
    Object.defineProperty(this, "inputKey", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "outputKey", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.chatHistory = fields?.chatHistory ?? new InMemoryChatMessageHistory();
    this.returnMessages = fields?.returnMessages ?? this.returnMessages;
    this.inputKey = fields?.inputKey ?? this.inputKey;
    this.outputKey = fields?.outputKey ?? this.outputKey;
  }
  /**
   * Method to add user and AI messages to the chat history in sequence.
   * @param inputValues The input values from the user.
   * @param outputValues The output values from the AI.
   * @returns Promise that resolves when the context has been saved.
   */
  saveContext(inputValues, outputValues) {
    return __async(this, null, function* () {
      yield this.chatHistory.addUserMessage(getInputValue(inputValues, this.inputKey));
      yield this.chatHistory.addAIChatMessage(getOutputValue(outputValues, this.outputKey));
    });
  }
  /**
   * Method to clear the chat history.
   * @returns Promise that resolves when the chat history has been cleared.
   */
  clear() {
    return __async(this, null, function* () {
      yield this.chatHistory.clear();
    });
  }
};

// node_modules/langchain/dist/memory/buffer_memory.js
var BufferMemory = class extends BaseChatMemory {
  constructor(fields) {
    super({
      chatHistory: fields?.chatHistory,
      returnMessages: fields?.returnMessages ?? false,
      inputKey: fields?.inputKey,
      outputKey: fields?.outputKey
    });
    Object.defineProperty(this, "humanPrefix", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "Human"
    });
    Object.defineProperty(this, "aiPrefix", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "AI"
    });
    Object.defineProperty(this, "memoryKey", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "history"
    });
    this.humanPrefix = fields?.humanPrefix ?? this.humanPrefix;
    this.aiPrefix = fields?.aiPrefix ?? this.aiPrefix;
    this.memoryKey = fields?.memoryKey ?? this.memoryKey;
  }
  get memoryKeys() {
    return [this.memoryKey];
  }
  /**
   * Loads the memory variables. It takes an `InputValues` object as a
   * parameter and returns a `Promise` that resolves with a
   * `MemoryVariables` object.
   * @param _values `InputValues` object.
   * @returns A `Promise` that resolves with a `MemoryVariables` object.
   */
  loadMemoryVariables(_values) {
    return __async(this, null, function* () {
      const messages = yield this.chatHistory.getMessages();
      if (this.returnMessages) {
        const result2 = {
          [this.memoryKey]: messages
        };
        return result2;
      }
      const result = {
        [this.memoryKey]: getBufferString(messages, this.humanPrefix, this.aiPrefix)
      };
      return result;
    });
  }
};

// node_modules/@langchain/core/dist/documents/transformers.js
var BaseDocumentTransformer = class extends Runnable {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "lc_namespace", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: ["langchain_core", "documents", "transformers"]
    });
  }
  /**
   * Method to invoke the document transformation. This method calls the
   * transformDocuments method with the provided input.
   * @param input The input documents to be transformed.
   * @param _options Optional configuration object to customize the behavior of callbacks.
   * @returns A Promise that resolves to the transformed documents.
   */
  invoke(input, _options) {
    return this.transformDocuments(input);
  }
};

export {
  BaseMemory,
  getInputValue,
  getOutputValue,
  getPromptInputKey,
  InMemoryChatMessageHistory,
  BaseChatMemory,
  BufferMemory,
  BaseDocumentTransformer
};
//# sourceMappingURL=chunk-7MNXFGHV.js.map
