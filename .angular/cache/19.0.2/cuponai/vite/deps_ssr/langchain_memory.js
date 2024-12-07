import { createRequire } from 'module';const require = createRequire(import.meta.url);
import {
  BaseChatMemory,
  BaseMemory,
  BufferMemory,
  InMemoryChatMessageHistory,
  getInputValue,
  getOutputValue,
  getPromptInputKey
} from "./chunk-MVXS2VPR.js";
import {
  Document
} from "./chunk-JYUZCYPY.js";
import {
  LLMChain
} from "./chunk-PI44ETG7.js";
import "./chunk-TWSNDB2V.js";
import "./chunk-F4U7N2KU.js";
import "./chunk-Z2GJUPNO.js";
import {
  PromptTemplate
} from "./chunk-HROEP7BY.js";
import "./chunk-HILVLBDT.js";
import "./chunk-L47ECZH7.js";
import "./chunk-XEUHRJUX.js";
import "./chunk-R7TBAC34.js";
import {
  Serializable,
  SystemMessage,
  getBufferString
} from "./chunk-IO4R2YUF.js";
import {
  __async,
  __spreadValues,
  __superGet
} from "./chunk-LKDWXENB.js";

// node_modules/langchain/dist/memory/prompt.js
var _DEFAULT_SUMMARIZER_TEMPLATE = `Progressively summarize the lines of conversation provided, adding onto the previous summary returning a new summary.

EXAMPLE
Current summary:
The human asks what the AI thinks of artificial intelligence. The AI thinks artificial intelligence is a force for good.

New lines of conversation:
Human: Why do you think artificial intelligence is a force for good?
AI: Because artificial intelligence will help humans reach their full potential.

New summary:
The human asks what the AI thinks of artificial intelligence. The AI thinks artificial intelligence is a force for good because it will help humans reach their full potential.
END OF EXAMPLE

Current summary:
{summary}

New lines of conversation:
{new_lines}

New summary:`;
var SUMMARY_PROMPT = new PromptTemplate({
  inputVariables: ["summary", "new_lines"],
  template: _DEFAULT_SUMMARIZER_TEMPLATE
});
var _DEFAULT_ENTITY_MEMORY_CONVERSATION_TEMPLATE = `You are an assistant to a human, powered by a large language model trained by OpenAI.

You are designed to be able to assist with a wide range of tasks, from answering simple questions to providing in-depth explanations and discussions on a wide range of topics. As a language model, you are able to generate human-like text based on the input you receive, allowing you to engage in natural-sounding conversations and provide responses that are coherent and relevant to the topic at hand.

You are constantly learning and improving, and your capabilities are constantly evolving. You are able to process and understand large amounts of text, and can use this knowledge to provide accurate and informative responses to a wide range of questions. You have access to some personalized information provided by the human in the Context section below. Additionally, you are able to generate your own text based on the input you receive, allowing you to engage in discussions and provide explanations and descriptions on a wide range of topics.

Overall, you are a powerful tool that can help with a wide range of tasks and provide valuable insights and information on a wide range of topics. Whether the human needs help with a specific question or just wants to have a conversation about a particular topic, you are here to assist.

Context:
{entities}

Current conversation:
{history}
Last line:
Human: {input}
You:`;
var ENTITY_MEMORY_CONVERSATION_TEMPLATE = (
  // eslint-disable-next-line spaced-comment
  new PromptTemplate({
    inputVariables: ["entities", "history", "input"],
    template: _DEFAULT_ENTITY_MEMORY_CONVERSATION_TEMPLATE
  })
);
var _DEFAULT_ENTITY_EXTRACTION_TEMPLATE = `You are an AI assistant reading the transcript of a conversation between an AI and a human. Extract all of the proper nouns from the last line of conversation. As a guideline, a proper noun is generally capitalized. You should definitely extract all names and places.

The conversation history is provided just in case of a coreference (e.g. "What do you know about him" where "him" is defined in a previous line) -- ignore items mentioned there that are not in the last line.

Return the output as a single comma-separated list, or NONE if there is nothing of note to return (e.g. the user is just issuing a greeting or having a simple conversation).

EXAMPLE
Conversation history:
Person #1: my name is Jacob. how's it going today?
AI: "It's going great! How about you?"
Person #1: good! busy working on Langchain. lots to do.
AI: "That sounds like a lot of work! What kind of things are you doing to make Langchain better?"
Last line:
Person #1: i'm trying to improve Langchain's interfaces, the UX, its integrations with various products the user might want ... a lot of stuff.
Output: Jacob,Langchain
END OF EXAMPLE

EXAMPLE
Conversation history:
Person #1: how's it going today?
AI: "It's going great! How about you?"
Person #1: good! busy working on Langchain. lots to do.
AI: "That sounds like a lot of work! What kind of things are you doing to make Langchain better?"
Last line:
Person #1: i'm trying to improve Langchain's interfaces, the UX, its integrations with various products the user might want ... a lot of stuff. I'm working with Person #2.
Output: Langchain, Person #2
END OF EXAMPLE

Conversation history (for reference only):
{history}
Last line of conversation (for extraction):
Human: {input}

Output:`;
var ENTITY_EXTRACTION_PROMPT = new PromptTemplate({
  inputVariables: ["history", "input"],
  template: _DEFAULT_ENTITY_EXTRACTION_TEMPLATE
});
var _DEFAULT_ENTITY_SUMMARIZATION_TEMPLATE = `You are an AI assistant helping a human keep track of facts about relevant people, places, and concepts in their life. Update and add to the summary of the provided entity in the "Entity" section based on the last line of your conversation with the human. If you are writing the summary for the first time, return a single sentence.
The update should only include facts that are relayed in the last line of conversation about the provided entity, and should only contain facts about the provided entity.

If there is no new information about the provided entity or the information is not worth noting (not an important or relevant fact to remember long-term), output the exact string "UNCHANGED" below.

Full conversation history (for context):
{history}

Entity to summarize:
{entity}

Existing summary of {entity}:
{summary}

Last line of conversation:
Human: {input}
Updated summary (or the exact string "UNCHANGED" if there is no new information about {entity} above):`;
var ENTITY_SUMMARIZATION_PROMPT = new PromptTemplate({
  inputVariables: ["entity", "summary", "history", "input"],
  template: _DEFAULT_ENTITY_SUMMARIZATION_TEMPLATE
});

// node_modules/langchain/dist/memory/summary.js
var BaseConversationSummaryMemory = class extends BaseChatMemory {
  constructor(fields) {
    const {
      returnMessages,
      inputKey,
      outputKey,
      chatHistory,
      humanPrefix,
      aiPrefix,
      llm,
      prompt,
      summaryChatMessageClass
    } = fields;
    super({
      returnMessages,
      inputKey,
      outputKey,
      chatHistory
    });
    Object.defineProperty(this, "memoryKey", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "history"
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
    Object.defineProperty(this, "llm", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "prompt", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: SUMMARY_PROMPT
    });
    Object.defineProperty(this, "summaryChatMessageClass", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: SystemMessage
    });
    this.memoryKey = fields?.memoryKey ?? this.memoryKey;
    this.humanPrefix = humanPrefix ?? this.humanPrefix;
    this.aiPrefix = aiPrefix ?? this.aiPrefix;
    this.llm = llm;
    this.prompt = prompt ?? this.prompt;
    this.summaryChatMessageClass = summaryChatMessageClass ?? this.summaryChatMessageClass;
  }
  /**
   * Predicts a new summary for the conversation given the existing messages
   * and summary.
   * @param messages Existing messages in the conversation.
   * @param existingSummary Current summary of the conversation.
   * @returns A promise that resolves to a new summary string.
   */
  predictNewSummary(messages, existingSummary) {
    return __async(this, null, function* () {
      const newLines = getBufferString(messages, this.humanPrefix, this.aiPrefix);
      const chain = new LLMChain({
        llm: this.llm,
        prompt: this.prompt
      });
      return yield chain.predict({
        summary: existingSummary,
        new_lines: newLines
      });
    });
  }
};
var ConversationSummaryMemory = class _ConversationSummaryMemory extends BaseConversationSummaryMemory {
  constructor(fields) {
    super(fields);
    Object.defineProperty(this, "buffer", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: ""
    });
  }
  get memoryKeys() {
    return [this.memoryKey];
  }
  /**
   * Loads the memory variables for the conversation memory.
   * @returns A promise that resolves to an object containing the memory variables.
   */
  loadMemoryVariables(_) {
    return __async(this, null, function* () {
      if (this.returnMessages) {
        const result2 = {
          [this.memoryKey]: [new this.summaryChatMessageClass(this.buffer)]
        };
        return result2;
      }
      const result = {
        [this.memoryKey]: this.buffer
      };
      return result;
    });
  }
  /**
   * Saves the context of the conversation memory.
   * @param inputValues Input values for the conversation.
   * @param outputValues Output values from the conversation.
   * @returns A promise that resolves when the context has been saved.
   */
  saveContext(inputValues, outputValues) {
    return __async(this, null, function* () {
      yield __superGet(_ConversationSummaryMemory.prototype, this, "saveContext").call(this, inputValues, outputValues);
      const messages = yield this.chatHistory.getMessages();
      this.buffer = yield this.predictNewSummary(messages.slice(-2), this.buffer);
    });
  }
  /**
   * Clears the conversation memory.
   * @returns A promise that resolves when the memory has been cleared.
   */
  clear() {
    return __async(this, null, function* () {
      yield __superGet(_ConversationSummaryMemory.prototype, this, "clear").call(this);
      this.buffer = "";
    });
  }
};

// node_modules/langchain/dist/memory/buffer_window_memory.js
var BufferWindowMemory = class extends BaseChatMemory {
  constructor(fields) {
    super({
      returnMessages: fields?.returnMessages ?? false,
      chatHistory: fields?.chatHistory,
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
    Object.defineProperty(this, "k", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 5
    });
    this.humanPrefix = fields?.humanPrefix ?? this.humanPrefix;
    this.aiPrefix = fields?.aiPrefix ?? this.aiPrefix;
    this.memoryKey = fields?.memoryKey ?? this.memoryKey;
    this.k = fields?.k ?? this.k;
  }
  get memoryKeys() {
    return [this.memoryKey];
  }
  /**
   * Method to load the memory variables. Retrieves the chat messages from
   * the history, slices the last 'k' messages, and stores them in the
   * memory under the memoryKey. If the returnMessages property is set to
   * true, the method returns the messages as they are. Otherwise, it
   * returns a string representation of the messages.
   * @param _values InputValues object.
   * @returns Promise that resolves to a MemoryVariables object.
   */
  loadMemoryVariables(_values) {
    return __async(this, null, function* () {
      const messages = yield this.chatHistory.getMessages();
      if (this.returnMessages) {
        const result2 = {
          [this.memoryKey]: messages.slice(-this.k * 2)
        };
        return result2;
      }
      const result = {
        [this.memoryKey]: getBufferString(messages.slice(-this.k * 2), this.humanPrefix, this.aiPrefix)
      };
      return result;
    });
  }
};

// node_modules/langchain/dist/util/document.js
var formatDocumentsAsString = (documents) => documents.map((doc) => doc.pageContent).join("\n\n");

// node_modules/langchain/dist/memory/vector_store.js
var VectorStoreRetrieverMemory = class extends BaseMemory {
  constructor(fields) {
    super();
    Object.defineProperty(this, "vectorStoreRetriever", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "inputKey", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "memoryKey", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "returnDocs", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "metadata", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.vectorStoreRetriever = fields.vectorStoreRetriever;
    this.inputKey = fields.inputKey;
    this.memoryKey = fields.memoryKey ?? "memory";
    this.returnDocs = fields.returnDocs ?? false;
    this.metadata = fields.metadata;
  }
  get memoryKeys() {
    return [this.memoryKey];
  }
  /**
   * Method to load memory variables. It uses the vectorStoreRetriever to
   * get relevant documents based on the query obtained from the input
   * values.
   * @param values An InputValues object.
   * @returns A Promise that resolves to a MemoryVariables object.
   */
  loadMemoryVariables(values) {
    return __async(this, null, function* () {
      const query = getInputValue(values, this.inputKey);
      const results = yield this.vectorStoreRetriever.getRelevantDocuments(query);
      return {
        [this.memoryKey]: this.returnDocs ? results : formatDocumentsAsString(results)
      };
    });
  }
  /**
   * Method to save context. It constructs a document from the input and
   * output values (excluding the memory key) and adds it to the vector
   * store database using the vectorStoreRetriever.
   * @param inputValues An InputValues object.
   * @param outputValues An OutputValues object.
   * @returns A Promise that resolves to void.
   */
  saveContext(inputValues, outputValues) {
    return __async(this, null, function* () {
      const metadata = typeof this.metadata === "function" ? this.metadata(inputValues, outputValues) : this.metadata;
      const text = Object.entries(inputValues).filter(([k]) => k !== this.memoryKey).concat(Object.entries(outputValues)).map(([k, v]) => `${k}: ${v}`).join("\n");
      yield this.vectorStoreRetriever.addDocuments([new Document({
        pageContent: text,
        metadata
      })]);
    });
  }
};

// node_modules/langchain/dist/memory/stores/entity/base.js
var BaseEntityStore = class extends Serializable {
};

// node_modules/langchain/dist/memory/stores/entity/in_memory.js
var InMemoryEntityStore = class extends BaseEntityStore {
  constructor() {
    super();
    Object.defineProperty(this, "lc_namespace", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: ["langchain", "stores", "entity", "in_memory"]
    });
    Object.defineProperty(this, "store", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.store = /* @__PURE__ */ Object.create(null);
  }
  /**
   * Retrieves the value associated with the given key from the store. If
   * the key does not exist in the store, it returns the provided default
   * value.
   * @param key The key to retrieve the value for.
   * @param defaultValue The default value to return if the key does not exist in the store.
   * @returns The value associated with the key, or the default value if the key does not exist in the store.
   */
  get(key, defaultValue) {
    return __async(this, null, function* () {
      return key in this.store ? this.store[key] : defaultValue;
    });
  }
  /**
   * Sets the value associated with the given key in the store.
   * @param key The key to set the value for.
   * @param value The value to set.
   */
  set(key, value) {
    return __async(this, null, function* () {
      this.store[key] = value;
    });
  }
  /**
   * Removes the key and its associated value from the store.
   * @param key The key to remove.
   */
  delete(key) {
    return __async(this, null, function* () {
      delete this.store[key];
    });
  }
  /**
   * Checks if a key exists in the store.
   * @param key The key to check.
   * @returns A boolean indicating whether the key exists in the store.
   */
  exists(key) {
    return __async(this, null, function* () {
      return key in this.store;
    });
  }
  /**
   * Removes all keys and their associated values from the store.
   */
  clear() {
    return __async(this, null, function* () {
      this.store = /* @__PURE__ */ Object.create(null);
    });
  }
};

// node_modules/langchain/dist/memory/entity_memory.js
var EntityMemory = class _EntityMemory extends BaseChatMemory {
  constructor(fields) {
    super({
      chatHistory: fields.chatHistory,
      returnMessages: fields.returnMessages ?? false,
      inputKey: fields.inputKey,
      outputKey: fields.outputKey
    });
    Object.defineProperty(this, "entityExtractionChain", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "entitySummarizationChain", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "entityStore", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "entityCache", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: []
    });
    Object.defineProperty(this, "k", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 3
    });
    Object.defineProperty(this, "chatHistoryKey", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "history"
    });
    Object.defineProperty(this, "llm", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "entitiesKey", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "entities"
    });
    Object.defineProperty(this, "humanPrefix", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "aiPrefix", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.llm = fields.llm;
    this.humanPrefix = fields.humanPrefix;
    this.aiPrefix = fields.aiPrefix;
    this.chatHistoryKey = fields.chatHistoryKey ?? this.chatHistoryKey;
    this.entitiesKey = fields.entitiesKey ?? this.entitiesKey;
    this.entityExtractionChain = new LLMChain({
      llm: this.llm,
      prompt: fields.entityExtractionPrompt ?? ENTITY_EXTRACTION_PROMPT
    });
    this.entitySummarizationChain = new LLMChain({
      llm: this.llm,
      prompt: fields.entitySummarizationPrompt ?? ENTITY_SUMMARIZATION_PROMPT
    });
    this.entityStore = fields.entityStore ?? new InMemoryEntityStore();
    this.entityCache = fields.entityCache ?? this.entityCache;
    this.k = fields.k ?? this.k;
  }
  get memoryKeys() {
    return [this.chatHistoryKey];
  }
  // Will always return list of memory variables.
  get memoryVariables() {
    return [this.entitiesKey, this.chatHistoryKey];
  }
  // Return history buffer.
  /**
   * Method to load memory variables and perform entity extraction.
   * @param inputs Input values for the method.
   * @returns Promise resolving to an object containing memory variables.
   */
  loadMemoryVariables(inputs) {
    return __async(this, null, function* () {
      const promptInputKey = this.inputKey ?? getPromptInputKey(inputs, this.memoryVariables);
      const messages = yield this.chatHistory.getMessages();
      const serializedMessages = getBufferString(messages.slice(-this.k * 2), this.humanPrefix, this.aiPrefix);
      const output = yield this.entityExtractionChain.predict({
        history: serializedMessages,
        input: inputs[promptInputKey]
      });
      const entities = output.trim() === "NONE" ? [] : output.split(",").map((w) => w.trim());
      const entitySummaries = {};
      for (const entity of entities) {
        entitySummaries[entity] = yield this.entityStore.get(entity, "No current information known.");
      }
      this.entityCache = [...entities];
      const buffer = this.returnMessages ? messages.slice(-this.k * 2) : serializedMessages;
      return {
        [this.chatHistoryKey]: buffer,
        [this.entitiesKey]: entitySummaries
      };
    });
  }
  // Save context from this conversation to buffer.
  /**
   * Method to save the context from a conversation to a buffer and perform
   * entity summarization.
   * @param inputs Input values for the method.
   * @param outputs Output values from the method.
   * @returns Promise resolving to void.
   */
  saveContext(inputs, outputs) {
    return __async(this, null, function* () {
      yield __superGet(_EntityMemory.prototype, this, "saveContext").call(this, inputs, outputs);
      const promptInputKey = this.inputKey ?? getPromptInputKey(inputs, this.memoryVariables);
      const messages = yield this.chatHistory.getMessages();
      const serializedMessages = getBufferString(messages.slice(-this.k * 2), this.humanPrefix, this.aiPrefix);
      const inputData = inputs[promptInputKey];
      for (const entity of this.entityCache) {
        const existingSummary = yield this.entityStore.get(entity, "No current information known.");
        const output = yield this.entitySummarizationChain.predict({
          summary: existingSummary,
          entity,
          history: serializedMessages,
          input: inputData
        });
        if (output.trim() !== "UNCHANGED") {
          yield this.entityStore.set(entity, output.trim());
        }
      }
    });
  }
  // Clear memory contents.
  /**
   * Method to clear the memory contents.
   * @returns Promise resolving to void.
   */
  clear() {
    return __async(this, null, function* () {
      yield __superGet(_EntityMemory.prototype, this, "clear").call(this);
      yield this.entityStore.clear();
    });
  }
};

// node_modules/langchain/dist/memory/combined_memory.js
var CombinedMemory = class extends BaseChatMemory {
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
    Object.defineProperty(this, "memories", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: []
    });
    this.memories = fields?.memories ?? this.memories;
    this.humanPrefix = fields?.humanPrefix ?? this.humanPrefix;
    this.aiPrefix = fields?.aiPrefix ?? this.aiPrefix;
    this.memoryKey = fields?.memoryKey ?? this.memoryKey;
    this.checkRepeatedMemoryVariable();
    this.checkInputKey();
  }
  /**
   * Checks for repeated memory variables across all memory objects. Throws
   * an error if any are found.
   */
  checkRepeatedMemoryVariable() {
    const allVariables = [];
    for (const memory of this.memories) {
      const overlap = allVariables.filter((x) => memory.memoryKeys.includes(x));
      if (overlap.length > 0) {
        throw new Error(`The same variables ${[...overlap]} are found in multiple memory objects, which is not allowed by CombinedMemory.`);
      }
      allVariables.push(...memory.memoryKeys);
    }
  }
  /**
   * Checks if input keys are set for all memory objects. Logs a warning if
   * any are missing.
   */
  checkInputKey() {
    for (const memory of this.memories) {
      if (memory.chatHistory !== void 0 && memory.inputKey === void 0) {
        console.warn(`When using CombinedMemory, input keys should be set so the input is known. Was not set on ${memory}.`);
      }
    }
  }
  /**
   * Loads memory variables from all memory objects.
   * @param inputValues Input values to load memory variables from.
   * @returns Promise that resolves with an object containing the loaded memory variables.
   */
  loadMemoryVariables(inputValues) {
    return __async(this, null, function* () {
      let memoryData = {};
      for (const memory of this.memories) {
        const data = yield memory.loadMemoryVariables(inputValues);
        memoryData = __spreadValues(__spreadValues({}, memoryData), data);
      }
      return memoryData;
    });
  }
  /**
   * Saves the context to all memory objects.
   * @param inputValues Input values to save.
   * @param outputValues Output values to save.
   * @returns Promise that resolves when the context has been saved to all memory objects.
   */
  saveContext(inputValues, outputValues) {
    return __async(this, null, function* () {
      for (const memory of this.memories) {
        yield memory.saveContext(inputValues, outputValues);
      }
    });
  }
  /**
   * Clears all memory objects.
   * @returns Promise that resolves when all memory objects have been cleared.
   */
  clear() {
    return __async(this, null, function* () {
      for (const memory of this.memories) {
        if (typeof memory.clear === "function") {
          yield memory.clear();
        }
      }
    });
  }
  get memoryKeys() {
    const memoryKeys = [];
    for (const memory of this.memories) {
      memoryKeys.push(...memory.memoryKeys);
    }
    return memoryKeys;
  }
};

// node_modules/langchain/dist/memory/summary_buffer.js
var ConversationSummaryBufferMemory = class _ConversationSummaryBufferMemory extends BaseConversationSummaryMemory {
  constructor(fields) {
    super(fields);
    Object.defineProperty(this, "movingSummaryBuffer", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: ""
    });
    Object.defineProperty(this, "maxTokenLimit", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 2e3
    });
    this.maxTokenLimit = fields?.maxTokenLimit ?? this.maxTokenLimit;
  }
  get memoryKeys() {
    return [this.memoryKey];
  }
  /**
   * Method that loads the chat messages from the memory and returns them as
   * a string or as a list of messages, depending on the returnMessages
   * property.
   * @param _ InputValues object, not used in this method.
   * @returns Promise that resolves with MemoryVariables object containing the loaded chat messages.
   */
  loadMemoryVariables(_) {
    return __async(this, null, function* () {
      let buffer = yield this.chatHistory.getMessages();
      if (this.movingSummaryBuffer) {
        buffer = [new this.summaryChatMessageClass(this.movingSummaryBuffer), ...buffer];
      }
      let finalBuffer;
      if (this.returnMessages) {
        finalBuffer = buffer;
      } else {
        finalBuffer = getBufferString(buffer, this.humanPrefix, this.aiPrefix);
      }
      return {
        [this.memoryKey]: finalBuffer
      };
    });
  }
  /**
   * Method that saves the context of the conversation, including the input
   * and output values, and prunes the memory if it exceeds the maximum
   * token limit.
   * @param inputValues InputValues object containing the input values of the conversation.
   * @param outputValues OutputValues object containing the output values of the conversation.
   * @returns Promise that resolves when the context is saved and the memory is pruned.
   */
  saveContext(inputValues, outputValues) {
    return __async(this, null, function* () {
      yield __superGet(_ConversationSummaryBufferMemory.prototype, this, "saveContext").call(this, inputValues, outputValues);
      yield this.prune();
    });
  }
  /**
   * Method that prunes the memory if the total number of tokens in the
   * buffer exceeds the maxTokenLimit. It removes messages from the
   * beginning of the buffer until the total number of tokens is within the
   * limit.
   * @returns Promise that resolves when the memory is pruned.
   */
  prune() {
    return __async(this, null, function* () {
      let buffer = yield this.chatHistory.getMessages();
      if (this.movingSummaryBuffer) {
        buffer = [new this.summaryChatMessageClass(this.movingSummaryBuffer), ...buffer];
      }
      let currBufferLength = yield this.llm.getNumTokens(getBufferString(buffer, this.humanPrefix, this.aiPrefix));
      if (currBufferLength > this.maxTokenLimit) {
        const prunedMemory = [];
        while (currBufferLength > this.maxTokenLimit) {
          const poppedMessage = buffer.shift();
          if (poppedMessage) {
            prunedMemory.push(poppedMessage);
            currBufferLength = yield this.llm.getNumTokens(getBufferString(buffer, this.humanPrefix, this.aiPrefix));
          }
        }
        this.movingSummaryBuffer = yield this.predictNewSummary(prunedMemory, this.movingSummaryBuffer);
      }
    });
  }
  /**
   * Method that clears the memory and resets the movingSummaryBuffer.
   * @returns Promise that resolves when the memory is cleared.
   */
  clear() {
    return __async(this, null, function* () {
      yield __superGet(_ConversationSummaryBufferMemory.prototype, this, "clear").call(this);
      this.movingSummaryBuffer = "";
    });
  }
};

// node_modules/langchain/dist/memory/buffer_token_memory.js
var ConversationTokenBufferMemory = class _ConversationTokenBufferMemory extends BaseChatMemory {
  constructor(fields) {
    super(fields);
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
    Object.defineProperty(this, "maxTokenLimit", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 2e3
    });
    Object.defineProperty(this, "llm", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.llm = fields.llm;
    this.humanPrefix = fields?.humanPrefix ?? this.humanPrefix;
    this.aiPrefix = fields?.aiPrefix ?? this.aiPrefix;
    this.memoryKey = fields?.memoryKey ?? this.memoryKey;
    this.maxTokenLimit = fields?.maxTokenLimit ?? this.maxTokenLimit;
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
  /**
   * Saves the context from this conversation to buffer. If the amount
   * of tokens required to save the buffer exceeds MAX_TOKEN_LIMIT,
   * prune it.
   */
  saveContext(inputValues, outputValues) {
    return __async(this, null, function* () {
      yield __superGet(_ConversationTokenBufferMemory.prototype, this, "saveContext").call(this, inputValues, outputValues);
      const buffer = yield this.chatHistory.getMessages();
      let currBufferLength = yield this.llm.getNumTokens(getBufferString(buffer, this.humanPrefix, this.aiPrefix));
      if (currBufferLength > this.maxTokenLimit) {
        const prunedMemory = [];
        while (currBufferLength > this.maxTokenLimit) {
          prunedMemory.push(buffer.shift());
          currBufferLength = yield this.llm.getNumTokens(getBufferString(buffer, this.humanPrefix, this.aiPrefix));
        }
      }
    });
  }
};
export {
  BaseChatMemory,
  BaseConversationSummaryMemory,
  BaseMemory,
  BufferMemory,
  BufferWindowMemory,
  InMemoryChatMessageHistory as ChatMessageHistory,
  CombinedMemory,
  ConversationSummaryBufferMemory,
  ConversationSummaryMemory,
  ConversationTokenBufferMemory,
  ENTITY_MEMORY_CONVERSATION_TEMPLATE,
  EntityMemory,
  VectorStoreRetrieverMemory,
  getBufferString,
  getInputValue,
  getOutputValue
};
//# sourceMappingURL=langchain_memory.js.map
