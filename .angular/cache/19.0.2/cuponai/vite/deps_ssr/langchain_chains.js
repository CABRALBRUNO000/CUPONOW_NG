import { createRequire } from 'module';const require = createRequire(import.meta.url);
import {
  SequentialChain,
  SimpleSequentialChain
} from "./chunk-5WHQXZVK.js";
import {
  VectorDBQAChain,
  loadQAChain,
  loadQAMapReduceChain,
  loadQARefineChain,
  loadQAStuffChain
} from "./chunk-ZWFT47J3.js";
import {
  MapReduceDocumentsChain,
  RefineDocumentsChain,
  StuffDocumentsChain
} from "./chunk-5FTGU22G.js";
import {
  APIChain
} from "./chunk-KRG4SWBS.js";
import {
  BaseDocumentTransformer,
  BufferMemory
} from "./chunk-MVXS2VPR.js";
import {
  Document
} from "./chunk-JYUZCYPY.js";
import {
  LLMChain
} from "./chunk-PI44ETG7.js";
import {
  BaseChain
} from "./chunk-TWSNDB2V.js";
import "./chunk-F4U7N2KU.js";
import {
  ChatPromptTemplate,
  FewShotPromptTemplate,
  HumanMessagePromptTemplate
} from "./chunk-Z2GJUPNO.js";
import {
  PromptTemplate,
  interpolateFString
} from "./chunk-HROEP7BY.js";
import {
  ChatOpenAI,
  OpenAI
} from "./chunk-2SWTEUZM.js";
import "./chunk-GS33LITW.js";
import "./chunk-HILVLBDT.js";
import {
  BaseCumulativeTransformOutputParser,
  BaseLLMOutputParser,
  BaseOutputParser,
  OutputParserException
} from "./chunk-L47ECZH7.js";
import "./chunk-XEUHRJUX.js";
import "./chunk-R7TBAC34.js";
import {
  AIMessage,
  AsyncCaller,
  HumanMessage,
  compare,
  getEnvironmentVariable,
  parsePartialJson,
  z,
  zodToJsonSchema
} from "./chunk-IO4R2YUF.js";
import "./chunk-OF3ZY4ZC.js";
import {
  __async,
  __objRest,
  __restKey,
  __spreadProps,
  __spreadValues,
  __superGet
} from "./chunk-LKDWXENB.js";

// node_modules/langchain/dist/chains/conversation.js
var DEFAULT_TEMPLATE = `The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know.

Current conversation:
{history}
Human: {input}
AI:`;
var ConversationChain = class extends LLMChain {
  static lc_name() {
    return "ConversationChain";
  }
  constructor(_a) {
    var _b = _a, {
      prompt,
      outputKey,
      memory
    } = _b, rest = __objRest(_b, [
      "prompt",
      "outputKey",
      "memory"
    ]);
    super(__spreadValues({
      prompt: prompt ?? new PromptTemplate({
        template: DEFAULT_TEMPLATE,
        inputVariables: ["history", "input"]
      }),
      outputKey: outputKey ?? "response",
      memory: memory ?? new BufferMemory()
    }, rest));
  }
};

// node_modules/langchain/dist/chains/chat_vector_db_chain.js
var question_generator_template = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.

Chat History:
{chat_history}
Follow Up Input: {question}
Standalone question:`;
var qa_template = `Use the following pieces of context to answer the question at the end. If you don't know the answer, just say that you don't know, don't try to make up an answer.

{context}

Question: {question}
Helpful Answer:`;
var ChatVectorDBQAChain = class _ChatVectorDBQAChain extends BaseChain {
  get inputKeys() {
    return [this.inputKey, this.chatHistoryKey];
  }
  get outputKeys() {
    return [this.outputKey];
  }
  constructor(fields) {
    super(fields);
    Object.defineProperty(this, "k", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 4
    });
    Object.defineProperty(this, "inputKey", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "question"
    });
    Object.defineProperty(this, "chatHistoryKey", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "chat_history"
    });
    Object.defineProperty(this, "outputKey", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "result"
    });
    Object.defineProperty(this, "vectorstore", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "combineDocumentsChain", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "questionGeneratorChain", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "returnSourceDocuments", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: false
    });
    this.vectorstore = fields.vectorstore;
    this.combineDocumentsChain = fields.combineDocumentsChain;
    this.questionGeneratorChain = fields.questionGeneratorChain;
    this.inputKey = fields.inputKey ?? this.inputKey;
    this.outputKey = fields.outputKey ?? this.outputKey;
    this.k = fields.k ?? this.k;
    this.returnSourceDocuments = fields.returnSourceDocuments ?? this.returnSourceDocuments;
  }
  /** @ignore */
  _call(values, runManager) {
    return __async(this, null, function* () {
      if (!(this.inputKey in values)) {
        throw new Error(`Question key ${this.inputKey} not found.`);
      }
      if (!(this.chatHistoryKey in values)) {
        throw new Error(`chat history key ${this.inputKey} not found.`);
      }
      const question = values[this.inputKey];
      const chatHistory = values[this.chatHistoryKey];
      let newQuestion = question;
      if (chatHistory.length > 0) {
        const result2 = yield this.questionGeneratorChain.call({
          question,
          chat_history: chatHistory
        }, runManager?.getChild("question_generator"));
        const keys = Object.keys(result2);
        console.log("_call", values, keys);
        if (keys.length === 1) {
          newQuestion = result2[keys[0]];
        } else {
          throw new Error("Return from llm chain has multiple values, only single values supported.");
        }
      }
      const docs = yield this.vectorstore.similaritySearch(newQuestion, this.k, void 0, runManager?.getChild("vectorstore"));
      const inputs = {
        question: newQuestion,
        input_documents: docs,
        chat_history: chatHistory
      };
      const result = yield this.combineDocumentsChain.call(inputs, runManager?.getChild("combine_documents"));
      if (this.returnSourceDocuments) {
        return __spreadProps(__spreadValues({}, result), {
          sourceDocuments: docs
        });
      }
      return result;
    });
  }
  _chainType() {
    return "chat-vector-db";
  }
  static deserialize(data, values) {
    return __async(this, null, function* () {
      if (!("vectorstore" in values)) {
        throw new Error(`Need to pass in a vectorstore to deserialize VectorDBQAChain`);
      }
      const {
        vectorstore
      } = values;
      return new _ChatVectorDBQAChain({
        combineDocumentsChain: yield BaseChain.deserialize(data.combine_documents_chain),
        questionGeneratorChain: yield LLMChain.deserialize(data.question_generator),
        k: data.k,
        vectorstore
      });
    });
  }
  serialize() {
    return {
      _type: this._chainType(),
      combine_documents_chain: this.combineDocumentsChain.serialize(),
      question_generator: this.questionGeneratorChain.serialize(),
      k: this.k
    };
  }
  /**
   * Creates an instance of ChatVectorDBQAChain using a BaseLanguageModel
   * and other options.
   * @param llm Instance of BaseLanguageModel used to generate a new question.
   * @param vectorstore Instance of VectorStore used for vector operations.
   * @param options (Optional) Additional options for creating the ChatVectorDBQAChain instance.
   * @returns New instance of ChatVectorDBQAChain.
   */
  static fromLLM(llm, vectorstore, options = {}) {
    const _a = options, {
      questionGeneratorTemplate,
      qaTemplate,
      verbose
    } = _a, rest = __objRest(_a, [
      "questionGeneratorTemplate",
      "qaTemplate",
      "verbose"
    ]);
    const question_generator_prompt = PromptTemplate.fromTemplate(questionGeneratorTemplate || question_generator_template);
    const qa_prompt = PromptTemplate.fromTemplate(qaTemplate || qa_template);
    const qaChain = loadQAStuffChain(llm, {
      prompt: qa_prompt,
      verbose
    });
    const questionGeneratorChain = new LLMChain({
      prompt: question_generator_prompt,
      llm,
      verbose
    });
    const instance = new this(__spreadValues({
      vectorstore,
      combineDocumentsChain: qaChain,
      questionGeneratorChain
    }, rest));
    return instance;
  }
};

// node_modules/@langchain/textsplitters/dist/text_splitter.js
var TextSplitter = class extends BaseDocumentTransformer {
  constructor(fields) {
    super(fields);
    Object.defineProperty(this, "lc_namespace", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: ["langchain", "document_transformers", "text_splitters"]
    });
    Object.defineProperty(this, "chunkSize", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 1e3
    });
    Object.defineProperty(this, "chunkOverlap", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 200
    });
    Object.defineProperty(this, "keepSeparator", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: false
    });
    Object.defineProperty(this, "lengthFunction", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.chunkSize = fields?.chunkSize ?? this.chunkSize;
    this.chunkOverlap = fields?.chunkOverlap ?? this.chunkOverlap;
    this.keepSeparator = fields?.keepSeparator ?? this.keepSeparator;
    this.lengthFunction = fields?.lengthFunction ?? ((text) => text.length);
    if (this.chunkOverlap >= this.chunkSize) {
      throw new Error("Cannot have chunkOverlap >= chunkSize");
    }
  }
  transformDocuments(_0) {
    return __async(this, arguments, function* (documents, chunkHeaderOptions = {}) {
      return this.splitDocuments(documents, chunkHeaderOptions);
    });
  }
  splitOnSeparator(text, separator) {
    let splits;
    if (separator) {
      if (this.keepSeparator) {
        const regexEscapedSeparator = separator.replace(/[/\-\\^$*+?.()|[\]{}]/g, "\\$&");
        splits = text.split(new RegExp(`(?=${regexEscapedSeparator})`));
      } else {
        splits = text.split(separator);
      }
    } else {
      splits = text.split("");
    }
    return splits.filter((s) => s !== "");
  }
  createDocuments(_0) {
    return __async(this, arguments, function* (texts, metadatas = [], chunkHeaderOptions = {}) {
      const _metadatas = metadatas.length > 0 ? metadatas : [...Array(texts.length)].map(() => ({}));
      const {
        chunkHeader = "",
        chunkOverlapHeader = "(cont'd) ",
        appendChunkOverlapHeader = false
      } = chunkHeaderOptions;
      const documents = new Array();
      for (let i = 0; i < texts.length; i += 1) {
        const text = texts[i];
        let lineCounterIndex = 1;
        let prevChunk = null;
        let indexPrevChunk = -1;
        for (const chunk of yield this.splitText(text)) {
          let pageContent = chunkHeader;
          const indexChunk = text.indexOf(chunk, indexPrevChunk + 1);
          if (prevChunk === null) {
            const newLinesBeforeFirstChunk = this.numberOfNewLines(text, 0, indexChunk);
            lineCounterIndex += newLinesBeforeFirstChunk;
          } else {
            const indexEndPrevChunk = indexPrevChunk + (yield this.lengthFunction(prevChunk));
            if (indexEndPrevChunk < indexChunk) {
              const numberOfIntermediateNewLines = this.numberOfNewLines(text, indexEndPrevChunk, indexChunk);
              lineCounterIndex += numberOfIntermediateNewLines;
            } else if (indexEndPrevChunk > indexChunk) {
              const numberOfIntermediateNewLines = this.numberOfNewLines(text, indexChunk, indexEndPrevChunk);
              lineCounterIndex -= numberOfIntermediateNewLines;
            }
            if (appendChunkOverlapHeader) {
              pageContent += chunkOverlapHeader;
            }
          }
          const newLinesCount = this.numberOfNewLines(chunk);
          const loc = _metadatas[i].loc && typeof _metadatas[i].loc === "object" ? __spreadValues({}, _metadatas[i].loc) : {};
          loc.lines = {
            from: lineCounterIndex,
            to: lineCounterIndex + newLinesCount
          };
          const metadataWithLinesNumber = __spreadProps(__spreadValues({}, _metadatas[i]), {
            loc
          });
          pageContent += chunk;
          documents.push(new Document({
            pageContent,
            metadata: metadataWithLinesNumber
          }));
          lineCounterIndex += newLinesCount;
          prevChunk = chunk;
          indexPrevChunk = indexChunk;
        }
      }
      return documents;
    });
  }
  numberOfNewLines(text, start, end) {
    const textSection = text.slice(start, end);
    return (textSection.match(/\n/g) || []).length;
  }
  splitDocuments(_0) {
    return __async(this, arguments, function* (documents, chunkHeaderOptions = {}) {
      const selectedDocuments = documents.filter((doc) => doc.pageContent !== void 0);
      const texts = selectedDocuments.map((doc) => doc.pageContent);
      const metadatas = selectedDocuments.map((doc) => doc.metadata);
      return this.createDocuments(texts, metadatas, chunkHeaderOptions);
    });
  }
  joinDocs(docs, separator) {
    const text = docs.join(separator).trim();
    return text === "" ? null : text;
  }
  mergeSplits(splits, separator) {
    return __async(this, null, function* () {
      const docs = [];
      const currentDoc = [];
      let total = 0;
      for (const d of splits) {
        const _len = yield this.lengthFunction(d);
        if (total + _len + currentDoc.length * separator.length > this.chunkSize) {
          if (total > this.chunkSize) {
            console.warn(`Created a chunk of size ${total}, +
which is longer than the specified ${this.chunkSize}`);
          }
          if (currentDoc.length > 0) {
            const doc2 = this.joinDocs(currentDoc, separator);
            if (doc2 !== null) {
              docs.push(doc2);
            }
            while (total > this.chunkOverlap || total + _len + currentDoc.length * separator.length > this.chunkSize && total > 0) {
              total -= yield this.lengthFunction(currentDoc[0]);
              currentDoc.shift();
            }
          }
        }
        currentDoc.push(d);
        total += _len;
      }
      const doc = this.joinDocs(currentDoc, separator);
      if (doc !== null) {
        docs.push(doc);
      }
      return docs;
    });
  }
};
var RecursiveCharacterTextSplitter = class _RecursiveCharacterTextSplitter extends TextSplitter {
  static lc_name() {
    return "RecursiveCharacterTextSplitter";
  }
  constructor(fields) {
    super(fields);
    Object.defineProperty(this, "separators", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: ["\n\n", "\n", " ", ""]
    });
    this.separators = fields?.separators ?? this.separators;
    this.keepSeparator = fields?.keepSeparator ?? true;
  }
  _splitText(text, separators) {
    return __async(this, null, function* () {
      const finalChunks = [];
      let separator = separators[separators.length - 1];
      let newSeparators;
      for (let i = 0; i < separators.length; i += 1) {
        const s = separators[i];
        if (s === "") {
          separator = s;
          break;
        }
        if (text.includes(s)) {
          separator = s;
          newSeparators = separators.slice(i + 1);
          break;
        }
      }
      const splits = this.splitOnSeparator(text, separator);
      let goodSplits = [];
      const _separator = this.keepSeparator ? "" : separator;
      for (const s of splits) {
        if ((yield this.lengthFunction(s)) < this.chunkSize) {
          goodSplits.push(s);
        } else {
          if (goodSplits.length) {
            const mergedText = yield this.mergeSplits(goodSplits, _separator);
            finalChunks.push(...mergedText);
            goodSplits = [];
          }
          if (!newSeparators) {
            finalChunks.push(s);
          } else {
            const otherInfo = yield this._splitText(s, newSeparators);
            finalChunks.push(...otherInfo);
          }
        }
      }
      if (goodSplits.length) {
        const mergedText = yield this.mergeSplits(goodSplits, _separator);
        finalChunks.push(...mergedText);
      }
      return finalChunks;
    });
  }
  splitText(text) {
    return __async(this, null, function* () {
      return this._splitText(text, this.separators);
    });
  }
  static fromLanguage(language, options) {
    return new _RecursiveCharacterTextSplitter(__spreadProps(__spreadValues({}, options), {
      separators: _RecursiveCharacterTextSplitter.getSeparatorsForLanguage(language)
    }));
  }
  static getSeparatorsForLanguage(language) {
    if (language === "cpp") {
      return [
        // Split along class definitions
        "\nclass ",
        // Split along function definitions
        "\nvoid ",
        "\nint ",
        "\nfloat ",
        "\ndouble ",
        // Split along control flow statements
        "\nif ",
        "\nfor ",
        "\nwhile ",
        "\nswitch ",
        "\ncase ",
        // Split by the normal type of lines
        "\n\n",
        "\n",
        " ",
        ""
      ];
    } else if (language === "go") {
      return [
        // Split along function definitions
        "\nfunc ",
        "\nvar ",
        "\nconst ",
        "\ntype ",
        // Split along control flow statements
        "\nif ",
        "\nfor ",
        "\nswitch ",
        "\ncase ",
        // Split by the normal type of lines
        "\n\n",
        "\n",
        " ",
        ""
      ];
    } else if (language === "java") {
      return [
        // Split along class definitions
        "\nclass ",
        // Split along method definitions
        "\npublic ",
        "\nprotected ",
        "\nprivate ",
        "\nstatic ",
        // Split along control flow statements
        "\nif ",
        "\nfor ",
        "\nwhile ",
        "\nswitch ",
        "\ncase ",
        // Split by the normal type of lines
        "\n\n",
        "\n",
        " ",
        ""
      ];
    } else if (language === "js") {
      return [
        // Split along function definitions
        "\nfunction ",
        "\nconst ",
        "\nlet ",
        "\nvar ",
        "\nclass ",
        // Split along control flow statements
        "\nif ",
        "\nfor ",
        "\nwhile ",
        "\nswitch ",
        "\ncase ",
        "\ndefault ",
        // Split by the normal type of lines
        "\n\n",
        "\n",
        " ",
        ""
      ];
    } else if (language === "php") {
      return [
        // Split along function definitions
        "\nfunction ",
        // Split along class definitions
        "\nclass ",
        // Split along control flow statements
        "\nif ",
        "\nforeach ",
        "\nwhile ",
        "\ndo ",
        "\nswitch ",
        "\ncase ",
        // Split by the normal type of lines
        "\n\n",
        "\n",
        " ",
        ""
      ];
    } else if (language === "proto") {
      return [
        // Split along message definitions
        "\nmessage ",
        // Split along service definitions
        "\nservice ",
        // Split along enum definitions
        "\nenum ",
        // Split along option definitions
        "\noption ",
        // Split along import statements
        "\nimport ",
        // Split along syntax declarations
        "\nsyntax ",
        // Split by the normal type of lines
        "\n\n",
        "\n",
        " ",
        ""
      ];
    } else if (language === "python") {
      return [
        // First, try to split along class definitions
        "\nclass ",
        "\ndef ",
        "\n	def ",
        // Now split by the normal type of lines
        "\n\n",
        "\n",
        " ",
        ""
      ];
    } else if (language === "rst") {
      return [
        // Split along section titles
        "\n===\n",
        "\n---\n",
        "\n***\n",
        // Split along directive markers
        "\n.. ",
        // Split by the normal type of lines
        "\n\n",
        "\n",
        " ",
        ""
      ];
    } else if (language === "ruby") {
      return [
        // Split along method definitions
        "\ndef ",
        "\nclass ",
        // Split along control flow statements
        "\nif ",
        "\nunless ",
        "\nwhile ",
        "\nfor ",
        "\ndo ",
        "\nbegin ",
        "\nrescue ",
        // Split by the normal type of lines
        "\n\n",
        "\n",
        " ",
        ""
      ];
    } else if (language === "rust") {
      return [
        // Split along function definitions
        "\nfn ",
        "\nconst ",
        "\nlet ",
        // Split along control flow statements
        "\nif ",
        "\nwhile ",
        "\nfor ",
        "\nloop ",
        "\nmatch ",
        "\nconst ",
        // Split by the normal type of lines
        "\n\n",
        "\n",
        " ",
        ""
      ];
    } else if (language === "scala") {
      return [
        // Split along class definitions
        "\nclass ",
        "\nobject ",
        // Split along method definitions
        "\ndef ",
        "\nval ",
        "\nvar ",
        // Split along control flow statements
        "\nif ",
        "\nfor ",
        "\nwhile ",
        "\nmatch ",
        "\ncase ",
        // Split by the normal type of lines
        "\n\n",
        "\n",
        " ",
        ""
      ];
    } else if (language === "swift") {
      return [
        // Split along function definitions
        "\nfunc ",
        // Split along class definitions
        "\nclass ",
        "\nstruct ",
        "\nenum ",
        // Split along control flow statements
        "\nif ",
        "\nfor ",
        "\nwhile ",
        "\ndo ",
        "\nswitch ",
        "\ncase ",
        // Split by the normal type of lines
        "\n\n",
        "\n",
        " ",
        ""
      ];
    } else if (language === "markdown") {
      return [
        // First, try to split along Markdown headings (starting with level 2)
        "\n## ",
        "\n### ",
        "\n#### ",
        "\n##### ",
        "\n###### ",
        // Note the alternative syntax for headings (below) is not handled here
        // Heading level 2
        // ---------------
        // End of code block
        "```\n\n",
        // Horizontal lines
        "\n\n***\n\n",
        "\n\n---\n\n",
        "\n\n___\n\n",
        // Note that this splitter doesn't handle horizontal lines defined
        // by *three or more* of ***, ---, or ___, but this is not handled
        "\n\n",
        "\n",
        " ",
        ""
      ];
    } else if (language === "latex") {
      return [
        // First, try to split along Latex sections
        "\n\\chapter{",
        "\n\\section{",
        "\n\\subsection{",
        "\n\\subsubsection{",
        // Now split by environments
        "\n\\begin{enumerate}",
        "\n\\begin{itemize}",
        "\n\\begin{description}",
        "\n\\begin{list}",
        "\n\\begin{quote}",
        "\n\\begin{quotation}",
        "\n\\begin{verse}",
        "\n\\begin{verbatim}",
        // Now split by math environments
        "\n\\begin{align}",
        "$$",
        "$",
        // Now split by the normal type of lines
        "\n\n",
        "\n",
        " ",
        ""
      ];
    } else if (language === "html") {
      return [
        // First, try to split along HTML tags
        "<body>",
        "<div>",
        "<p>",
        "<br>",
        "<li>",
        "<h1>",
        "<h2>",
        "<h3>",
        "<h4>",
        "<h5>",
        "<h6>",
        "<span>",
        "<table>",
        "<tr>",
        "<td>",
        "<th>",
        "<ul>",
        "<ol>",
        "<header>",
        "<footer>",
        "<nav>",
        // Head
        "<head>",
        "<style>",
        "<script>",
        "<meta>",
        "<title>",
        // Normal type of lines
        " ",
        ""
      ];
    } else if (language === "sol") {
      return [
        // Split along compiler informations definitions
        "\npragma ",
        "\nusing ",
        // Split along contract definitions
        "\ncontract ",
        "\ninterface ",
        "\nlibrary ",
        // Split along method definitions
        "\nconstructor ",
        "\ntype ",
        "\nfunction ",
        "\nevent ",
        "\nmodifier ",
        "\nerror ",
        "\nstruct ",
        "\nenum ",
        // Split along control flow statements
        "\nif ",
        "\nfor ",
        "\nwhile ",
        "\ndo while ",
        "\nassembly ",
        // Split by the normal type of lines
        "\n\n",
        "\n",
        " ",
        ""
      ];
    } else {
      throw new Error(`Language ${language} is not supported.`);
    }
  }
};

// node_modules/langchain/dist/chains/analyze_documents_chain.js
var AnalyzeDocumentChain = class _AnalyzeDocumentChain extends BaseChain {
  static lc_name() {
    return "AnalyzeDocumentChain";
  }
  constructor(fields) {
    super(fields);
    Object.defineProperty(this, "inputKey", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "input_document"
    });
    Object.defineProperty(this, "combineDocumentsChain", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "textSplitter", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.combineDocumentsChain = fields.combineDocumentsChain;
    this.inputKey = fields.inputKey ?? this.inputKey;
    this.textSplitter = fields.textSplitter ?? new RecursiveCharacterTextSplitter();
  }
  get inputKeys() {
    return [this.inputKey];
  }
  get outputKeys() {
    return this.combineDocumentsChain.outputKeys;
  }
  /** @ignore */
  _call(values, runManager) {
    return __async(this, null, function* () {
      var _a;
      if (!(this.inputKey in values)) {
        throw new Error(`Document key ${this.inputKey} not found.`);
      }
      const _b = values, {
        [_a = this.inputKey]: doc
      } = _b, rest = __objRest(_b, [
        __restKey(_a)
      ]);
      const currentDoc = doc;
      const currentDocs = yield this.textSplitter.createDocuments([currentDoc]);
      const newInputs = __spreadValues({
        input_documents: currentDocs
      }, rest);
      const result = yield this.combineDocumentsChain.call(newInputs, runManager?.getChild("combine_documents"));
      return result;
    });
  }
  _chainType() {
    return "analyze_document_chain";
  }
  static deserialize(data, values) {
    return __async(this, null, function* () {
      if (!("text_splitter" in values)) {
        throw new Error(`Need to pass in a text_splitter to deserialize AnalyzeDocumentChain.`);
      }
      const {
        text_splitter
      } = values;
      if (!data.combine_document_chain) {
        throw new Error(`Need to pass in a combine_document_chain to deserialize AnalyzeDocumentChain.`);
      }
      return new _AnalyzeDocumentChain({
        combineDocumentsChain: yield BaseChain.deserialize(data.combine_document_chain),
        textSplitter: text_splitter
      });
    });
  }
  serialize() {
    return {
      _type: this._chainType(),
      combine_document_chain: this.combineDocumentsChain.serialize()
    };
  }
};

// node_modules/langchain/dist/chains/summarization/stuff_prompts.js
var template = `Write a concise summary of the following:


"{text}"


CONCISE SUMMARY:`;
var DEFAULT_PROMPT = new PromptTemplate({
  template,
  inputVariables: ["text"]
});

// node_modules/langchain/dist/chains/summarization/refine_prompts.js
var refinePromptTemplate = `Your job is to produce a final summary
We have provided an existing summary up to a certain point: "{existing_answer}"
We have the opportunity to refine the existing summary
(only if needed) with some more context below.
------------
"{text}"
------------

Given the new context, refine the original summary
If the context isn't useful, return the original summary.

REFINED SUMMARY:`;
var REFINE_PROMPT = new PromptTemplate({
  template: refinePromptTemplate,
  inputVariables: ["existing_answer", "text"]
});

// node_modules/langchain/dist/chains/summarization/load.js
var loadSummarizationChain = (llm, params = {
  type: "map_reduce"
}) => {
  const {
    verbose
  } = params;
  if (params.type === "stuff") {
    const {
      prompt = DEFAULT_PROMPT
    } = params;
    const llmChain = new LLMChain({
      prompt,
      llm,
      verbose
    });
    const chain = new StuffDocumentsChain({
      llmChain,
      documentVariableName: "text",
      verbose
    });
    return chain;
  }
  if (params.type === "map_reduce") {
    const {
      combineMapPrompt = DEFAULT_PROMPT,
      combinePrompt = DEFAULT_PROMPT,
      combineLLM,
      returnIntermediateSteps
    } = params;
    const llmChain = new LLMChain({
      prompt: combineMapPrompt,
      llm,
      verbose
    });
    const combineLLMChain = new LLMChain({
      prompt: combinePrompt,
      llm: combineLLM ?? llm,
      verbose
    });
    const combineDocumentChain = new StuffDocumentsChain({
      llmChain: combineLLMChain,
      documentVariableName: "text",
      verbose
    });
    const chain = new MapReduceDocumentsChain({
      llmChain,
      combineDocumentChain,
      documentVariableName: "text",
      returnIntermediateSteps,
      verbose
    });
    return chain;
  }
  if (params.type === "refine") {
    const {
      refinePrompt = REFINE_PROMPT,
      refineLLM,
      questionPrompt = DEFAULT_PROMPT
    } = params;
    const llmChain = new LLMChain({
      prompt: questionPrompt,
      llm,
      verbose
    });
    const refineLLMChain = new LLMChain({
      prompt: refinePrompt,
      llm: refineLLM ?? llm,
      verbose
    });
    const chain = new RefineDocumentsChain({
      llmChain,
      refineLLMChain,
      documentVariableName: "text",
      verbose
    });
    return chain;
  }
  throw new Error(`Invalid _type: ${params.type}`);
};

// node_modules/langchain/dist/chains/conversational_retrieval_chain.js
var question_generator_template2 = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.

Chat History:
{chat_history}
Follow Up Input: {question}
Standalone question:`;
var ConversationalRetrievalQAChain = class _ConversationalRetrievalQAChain extends BaseChain {
  static lc_name() {
    return "ConversationalRetrievalQAChain";
  }
  get inputKeys() {
    return [this.inputKey, this.chatHistoryKey];
  }
  get outputKeys() {
    return this.combineDocumentsChain.outputKeys.concat(this.returnSourceDocuments ? ["sourceDocuments"] : []);
  }
  constructor(fields) {
    super(fields);
    Object.defineProperty(this, "inputKey", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "question"
    });
    Object.defineProperty(this, "chatHistoryKey", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "chat_history"
    });
    Object.defineProperty(this, "retriever", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "combineDocumentsChain", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "questionGeneratorChain", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "returnSourceDocuments", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: false
    });
    Object.defineProperty(this, "returnGeneratedQuestion", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: false
    });
    this.retriever = fields.retriever;
    this.combineDocumentsChain = fields.combineDocumentsChain;
    this.questionGeneratorChain = fields.questionGeneratorChain;
    this.inputKey = fields.inputKey ?? this.inputKey;
    this.returnSourceDocuments = fields.returnSourceDocuments ?? this.returnSourceDocuments;
    this.returnGeneratedQuestion = fields.returnGeneratedQuestion ?? this.returnGeneratedQuestion;
  }
  /**
   * Static method to convert the chat history input into a formatted
   * string.
   * @param chatHistory Chat history input which can be a string, an array of BaseMessage instances, or an array of string arrays.
   * @returns A formatted string representing the chat history.
   */
  static getChatHistoryString(chatHistory) {
    let historyMessages;
    if (Array.isArray(chatHistory)) {
      if (Array.isArray(chatHistory[0]) && typeof chatHistory[0][0] === "string") {
        console.warn("Passing chat history as an array of strings is deprecated.\nPlease see https://js.langchain.com/docs/modules/chains/popular/chat_vector_db#externally-managed-memory for more information.");
        historyMessages = chatHistory.flat().map((stringMessage, i) => {
          if (i % 2 === 0) {
            return new HumanMessage(stringMessage);
          } else {
            return new AIMessage(stringMessage);
          }
        });
      } else {
        historyMessages = chatHistory;
      }
      return historyMessages.map((chatMessage) => {
        if (chatMessage._getType() === "human") {
          return `Human: ${chatMessage.content}`;
        } else if (chatMessage._getType() === "ai") {
          return `Assistant: ${chatMessage.content}`;
        } else {
          return `${chatMessage.content}`;
        }
      }).join("\n");
    }
    return chatHistory;
  }
  /** @ignore */
  _call(values, runManager) {
    return __async(this, null, function* () {
      if (!(this.inputKey in values)) {
        throw new Error(`Question key ${this.inputKey} not found.`);
      }
      if (!(this.chatHistoryKey in values)) {
        throw new Error(`Chat history key ${this.chatHistoryKey} not found.`);
      }
      const question = values[this.inputKey];
      const chatHistory = _ConversationalRetrievalQAChain.getChatHistoryString(values[this.chatHistoryKey]);
      let newQuestion = question;
      if (chatHistory.length > 0) {
        const result2 = yield this.questionGeneratorChain.call({
          question,
          chat_history: chatHistory
        }, runManager?.getChild("question_generator"));
        const keys = Object.keys(result2);
        if (keys.length === 1) {
          newQuestion = result2[keys[0]];
        } else {
          throw new Error("Return from llm chain has multiple values, only single values supported.");
        }
      }
      const docs = yield this.retriever.getRelevantDocuments(newQuestion, runManager?.getChild("retriever"));
      const inputs = {
        question: newQuestion,
        input_documents: docs,
        chat_history: chatHistory
      };
      let result = yield this.combineDocumentsChain.call(inputs, runManager?.getChild("combine_documents"));
      if (this.returnSourceDocuments) {
        result = __spreadProps(__spreadValues({}, result), {
          sourceDocuments: docs
        });
      }
      if (this.returnGeneratedQuestion) {
        result = __spreadProps(__spreadValues({}, result), {
          generatedQuestion: newQuestion
        });
      }
      return result;
    });
  }
  _chainType() {
    return "conversational_retrieval_chain";
  }
  static deserialize(_data, _values) {
    return __async(this, null, function* () {
      throw new Error("Not implemented.");
    });
  }
  serialize() {
    throw new Error("Not implemented.");
  }
  /**
   * Static method to create a new ConversationalRetrievalQAChain from a
   * BaseLanguageModel and a BaseRetriever.
   * @param llm {@link BaseLanguageModelInterface} instance used to generate a new question.
   * @param retriever {@link BaseRetrieverInterface} instance used to retrieve relevant documents.
   * @param options.returnSourceDocuments Whether to return source documents in the final output
   * @param options.questionGeneratorChainOptions Options to initialize the standalone question generation chain used as the first internal step
   * @param options.qaChainOptions {@link QAChainParams} used to initialize the QA chain used as the second internal step
   * @returns A new instance of ConversationalRetrievalQAChain.
   */
  static fromLLM(llm, retriever, options = {}) {
    const _a = options, {
      questionGeneratorTemplate,
      qaTemplate,
      qaChainOptions = {
        type: "stuff",
        prompt: qaTemplate ? PromptTemplate.fromTemplate(qaTemplate) : void 0
      },
      questionGeneratorChainOptions,
      verbose
    } = _a, rest = __objRest(_a, [
      "questionGeneratorTemplate",
      "qaTemplate",
      "qaChainOptions",
      "questionGeneratorChainOptions",
      "verbose"
    ]);
    const qaChain = loadQAChain(llm, qaChainOptions);
    const questionGeneratorChainPrompt = PromptTemplate.fromTemplate(questionGeneratorChainOptions?.template ?? questionGeneratorTemplate ?? question_generator_template2);
    const questionGeneratorChain = new LLMChain({
      prompt: questionGeneratorChainPrompt,
      llm: questionGeneratorChainOptions?.llm ?? llm,
      verbose
    });
    const instance = new this(__spreadValues({
      retriever,
      combineDocumentsChain: qaChain,
      questionGeneratorChain,
      verbose
    }, rest));
    return instance;
  }
};

// node_modules/langchain/dist/chains/retrieval_qa.js
var RetrievalQAChain = class extends BaseChain {
  static lc_name() {
    return "RetrievalQAChain";
  }
  get inputKeys() {
    return [this.inputKey];
  }
  get outputKeys() {
    return this.combineDocumentsChain.outputKeys.concat(this.returnSourceDocuments ? ["sourceDocuments"] : []);
  }
  constructor(fields) {
    super(fields);
    Object.defineProperty(this, "inputKey", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "query"
    });
    Object.defineProperty(this, "retriever", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "combineDocumentsChain", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "returnSourceDocuments", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: false
    });
    this.retriever = fields.retriever;
    this.combineDocumentsChain = fields.combineDocumentsChain;
    this.inputKey = fields.inputKey ?? this.inputKey;
    this.returnSourceDocuments = fields.returnSourceDocuments ?? this.returnSourceDocuments;
  }
  /** @ignore */
  _call(values, runManager) {
    return __async(this, null, function* () {
      if (!(this.inputKey in values)) {
        throw new Error(`Question key "${this.inputKey}" not found.`);
      }
      const question = values[this.inputKey];
      const docs = yield this.retriever.getRelevantDocuments(question, runManager?.getChild("retriever"));
      const inputs = __spreadValues({
        question,
        input_documents: docs
      }, values);
      const result = yield this.combineDocumentsChain.call(inputs, runManager?.getChild("combine_documents"));
      if (this.returnSourceDocuments) {
        return __spreadProps(__spreadValues({}, result), {
          sourceDocuments: docs
        });
      }
      return result;
    });
  }
  _chainType() {
    return "retrieval_qa";
  }
  static deserialize(_data, _values) {
    return __async(this, null, function* () {
      throw new Error("Not implemented");
    });
  }
  serialize() {
    throw new Error("Not implemented");
  }
  /**
   * Creates a new instance of RetrievalQAChain using a BaseLanguageModel
   * and a BaseRetriever.
   * @param llm The BaseLanguageModel used to generate a new question.
   * @param retriever The BaseRetriever used to retrieve relevant documents.
   * @param options Optional parameters for the RetrievalQAChain.
   * @returns A new instance of RetrievalQAChain.
   */
  static fromLLM(llm, retriever, options) {
    const qaChain = loadQAStuffChain(llm, {
      prompt: options?.prompt
    });
    return new this(__spreadProps(__spreadValues({}, options), {
      retriever,
      combineDocumentsChain: qaChain
    }));
  }
};

// node_modules/langchain/dist/chains/constitutional_ai/constitutional_principle.js
var ConstitutionalPrinciple = class {
  constructor({
    critiqueRequest,
    revisionRequest,
    name
  }) {
    Object.defineProperty(this, "critiqueRequest", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "revisionRequest", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.critiqueRequest = critiqueRequest;
    this.revisionRequest = revisionRequest;
    this.name = name ?? "Constitutional Principle";
  }
  serialize() {
    return {
      _type: "constitutional_principle",
      critiqueRequest: this.critiqueRequest,
      revisionRequest: this.revisionRequest,
      name: this.name
    };
  }
};
var PRINCIPLES = {
  harmful1: new ConstitutionalPrinciple({
    name: "harmful1",
    critiqueRequest: "Identify specific ways in which the assistant’s last response is harmful, unethical, racist, sexist, toxic, dangerous, or illegal.",
    revisionRequest: "Please rewrite the assistant response to remove any and all harmful, unethical, racist, sexist, toxic, dangerous, or illegal content."
  }),
  harmful2: new ConstitutionalPrinciple({
    name: "harmful2",
    critiqueRequest: "Explain ways in which the assistant’s preceding response may be harmful to either the human or others. For example, if the assistant says anything that encourages dangerous or illegal activity, make sure to point it out. Other examples of harm include racism, sexism, and other social biases.",
    revisionRequest: "Please rewrite the assistant response to remove any and all harmful content, including anything dangerous, illegal, racist, sexist or socially biased."
  }),
  harmful3: new ConstitutionalPrinciple({
    name: "harmful3",
    critiqueRequest: "Identify all ways in which the assistant’s last response is harmful, unethical, or socially biased. Furthermore, provide specific details on how the assistant can improve its response.",
    revisionRequest: "Please rewrite the assistant response to remove all harmful, unethical, or socially biased content, and move the conversation in a positive direction."
  }),
  harmful4: new ConstitutionalPrinciple({
    name: "harmful4",
    critiqueRequest: "Identify specific ways in which the assistant’s precedings response is harmful. Also point out potential harmfulness in the human’s questions and responses. Examples of harm include but are not limited to racism, sexism, toxicity.",
    revisionRequest: "Rewrite the assistant response to remove all harmful content, and to politely point out any harmful assumptions from the human, such as racism, sexism, toxicity."
  }),
  insensitive: new ConstitutionalPrinciple({
    name: "insensitive",
    critiqueRequest: "Discuss the assistant’s last response to the human and whether it is in any way insensitive, sexist, racist, or socially inappropriate.",
    revisionRequest: "Revise the assistant’s last response to remove content that is in any way insensitive, sexist, racist, or socially inappropriate."
  }),
  offensive: new ConstitutionalPrinciple({
    name: "offensive",
    critiqueRequest: "Discuss whether the assistant said anything that may be interpreted as offensive or harmful. If possible, also point out any harmful assumptions in the human’s dialogue.",
    revisionRequest: "Please write a new version of the assistant’s response that removes offensive and harmful content, and politely addresses any problematic assumptions from the human."
  }),
  harmful5: new ConstitutionalPrinciple({
    name: "harmful5",
    critiqueRequest: "What’s the strongest argument you could give that the assistant’s last response was in some way harmful, unethical, racist, sexist, toxic, dangerous, or illegal.",
    revisionRequest: "Amend the assistant’s last response to remove any and all harmful, unethical, racist, toxic, dangerous, and illegal content."
  }),
  "age-innappropriate": new ConstitutionalPrinciple({
    name: "age-innappropriate",
    critiqueRequest: "Did the assistant’s preceding response include anything that may be inappropriate for young children? If so, discuss how it can be revised to be more appropriate.",
    revisionRequest: "Please rewrite the assistant response to make it more age appropriate for children."
  }),
  derogatory: new ConstitutionalPrinciple({
    name: "derogatory",
    critiqueRequest: "Think carefully about whether the human’s request succeeded in eliciting responses from the assistant that are derogatory, toxic, racist, sexist or socially harmful in any way, and discuss how the assistant should’ve responded instead.",
    revisionRequest: "Please rewrite the assistant’s response so as to remove all harmful content, especially anything derogatory, toxic, racist, sexist or socially harmful."
  }),
  illegal: new ConstitutionalPrinciple({
    name: "illegal",
    critiqueRequest: "Discuss whether the assistant provided any advice that may encourage illegal or dangerous activity from either the human or others.",
    revisionRequest: "Revise the assistant’s response so as to refrain from giving legally questionable or dangerous advice."
  }),
  controversial: new ConstitutionalPrinciple({
    name: "controversial",
    critiqueRequest: "Discuss ways in which the assistant’s response may be considered controversial or objectionable based on commonsense ethical and moral standards.",
    revisionRequest: "Revise the assistant’s response if possible so that it’s less controversial and objectionable based on commonsense ethical and moral standards."
  }),
  harmful6: new ConstitutionalPrinciple({
    name: "harmful6",
    critiqueRequest: "Discuss whether the human is deliberately trying to bait the assistant into generating harmful content, and whether they succeeded in doing so.",
    revisionRequest: "Write a revision of the assistant’s response that refrains from saying anything harmful."
  }),
  thoughtful: new ConstitutionalPrinciple({
    name: "thoughtful",
    critiqueRequest: "Please comment on whether the assistant’s last response is thoughtful and empathetic. Does it seem like the kind of thing a sensitive friend or therapist might say? Give the strongest argument you can for how it could improve.",
    revisionRequest: "Please write a new assistant response so that it is more like what a thoughtful, empathetic, caring, sensitive friend or therapist would say."
  }),
  misogynistic: new ConstitutionalPrinciple({
    name: "misogynistic",
    critiqueRequest: "Take a look at the assistant’s last response and note if it was in any way misogynistic or otherwise gender biased. Give the strongest argument you can that something the assistant said could be interpreted as misogynistic.",
    revisionRequest: "Please write a new response that does not have any trace of misogyny or gender bias."
  }),
  criminal: new ConstitutionalPrinciple({
    name: "criminal",
    critiqueRequest: "Read the assistant’s last response carefully and identify anything it said that provides advice or assistance in potentially criminal activities, such as violence, theft, hacking, robbery, or any other illegal activity. Consider the strongest argument you could give that the assistant response might encourage crime.",
    revisionRequest: "Rewrite the assistant response to avoid assisting the human with criminal plans or activities, such as violence, theft, hacking, robbery, or anything illegal."
  }),
  harmful7: new ConstitutionalPrinciple({
    name: "harmful7",
    critiqueRequest: "Critique the assistant’s last response and identify anything it said that was harmful, unethical, dangerous, or illegal.",
    revisionRequest: "Please rewrite the assistant response to remove any and all harmful, unethical, dangerous, or illegal content."
  }),
  "uo-assumptions-1": new ConstitutionalPrinciple({
    name: "uo-assumptions-1",
    critiqueRequest: "Discuss whether the AI model's response lists and considers all relevant underlying assumptions.",
    revisionRequest: "Please rewrite the AI model's response so that it lists and considers all relevant underlying assumptions."
  }),
  "uo-assumptions-2": new ConstitutionalPrinciple({
    name: "uo-assumptions-2",
    critiqueRequest: "Discuss whether the AI model's response considers all relevant viewpoints.",
    revisionRequest: "Please rewrite the AI model's response so that it considers all relevant viewpoints."
  }),
  "uo-assumptions-3": new ConstitutionalPrinciple({
    name: "uo-assumptions-3",
    critiqueRequest: "Discuss whether the AI model's response is objective and impartial.",
    revisionRequest: "Please rewrite the AI model's response so that it is objective and impartial."
  }),
  "uo-reasoning-1": new ConstitutionalPrinciple({
    name: "uo-reasoning-1",
    critiqueRequest: "Discuss whether the AI model's response considers all relevant reasoning strategies and selects the most appropriate reasoning strategy.",
    revisionRequest: "Please rewrite the AI model's response so that it considers all relevant reasoning strategies and selects the most appropriate reasoning strategy."
  }),
  "uo-reasoning-2": new ConstitutionalPrinciple({
    name: "uo-reasoning-2",
    critiqueRequest: "Discuss whether the AI model's response is plausible, logically valid, sound, consistent and coherent.",
    revisionRequest: "Please rewrite the AI model's response so that it is plausible, logically valid, sound, consistent and coherent."
  }),
  "uo-reasoning-3": new ConstitutionalPrinciple({
    name: "uo-reasoning-3",
    critiqueRequest: "Discuss whether reasoning in the AI model's response is structured (e.g. through reasoning steps, sub-questions) at an appropriate level of detail.",
    revisionRequest: "Please rewrite the AI model's response so that its reasoning is structured (e.g. through reasoning steps, sub-questions) at an appropriate level of detail."
  }),
  "uo-reasoning-4": new ConstitutionalPrinciple({
    name: "uo-reasoning-4",
    critiqueRequest: "Discuss whether the concepts used in the AI model's response are clearly defined.",
    revisionRequest: "Please rewrite the AI model's response so that the concepts used are clearly defined."
  }),
  "uo-reasoning-5": new ConstitutionalPrinciple({
    name: "uo-reasoning-5",
    critiqueRequest: "Discuss whether the AI model's response gives appropriate priorities to different considerations based on their relevance and importance.",
    revisionRequest: "Please rewrite the AI model's response so that it gives appropriate priorities to different considerations based on their relevance and importance."
  }),
  "uo-reasoning-6": new ConstitutionalPrinciple({
    name: "uo-reasoning-6",
    critiqueRequest: "Discuss whether statements in the AI model's response are made with appropriate levels of confidence or probability.",
    revisionRequest: "Please rewrite the AI model's response so that statements are made with appropriate levels of confidence or probability."
  }),
  "uo-reasoning-7": new ConstitutionalPrinciple({
    name: "uo-reasoning-7",
    critiqueRequest: "Discuss whether reasoning in the AI model's response is free from cognitive biases or fallacies.",
    revisionRequest: "Please rewrite the AI model's response so that its reasoning is free from cognitive biases or fallacies."
  }),
  "uo-reasoning-8": new ConstitutionalPrinciple({
    name: "uo-reasoning-8",
    critiqueRequest: "Discuss whether formal reasoning (e.g. using math, computer code) in the AI model's response is correct.",
    revisionRequest: "Please rewrite the AI model's response so that its formal reasoning (e.g. using math, computer code) is correct."
  }),
  "uo-reasoning-9": new ConstitutionalPrinciple({
    name: "uo-reasoning-9",
    critiqueRequest: "Discuss whether external tools (e.g. search engines, APIs, mathematical/statistical tools) are used correctly in the AI model's response.",
    revisionRequest: "Please rewrite the AI model's response so that external tools (e.g. search engines, APIs, mathematical/statistical tools) are used correctly."
  }),
  "uo-evidence-1": new ConstitutionalPrinciple({
    name: "uo-evidence-1",
    critiqueRequest: "Discuss whether the AI model's response contains incorrect or misrepresented information.",
    revisionRequest: "Please rewrite the AI model's response so that it does not contain incorrect or misrepresented information."
  }),
  "uo-evidence-2": new ConstitutionalPrinciple({
    name: "uo-evidence-2",
    critiqueRequest: "Discuss whether the AI model's response considers all relevant information, and does **not** consider irrelevant information.",
    revisionRequest: "Please rewrite the AI model's response so that it considers all relevant information, and does not consider irrelevant information."
  }),
  "uo-evidence-3": new ConstitutionalPrinciple({
    name: "uo-evidence-3",
    critiqueRequest: "Discuss whether the AI model's response contains all relevant information, and does **not** contain irrelevant information.",
    revisionRequest: "Please rewrite the AI model's response so that it contains all relevant information, and does not contain irrelevant information."
  }),
  "uo-evidence-4": new ConstitutionalPrinciple({
    name: "uo-evidence-4",
    critiqueRequest: "Discuss whether statements in the AI model's response are appropriately supported by references to evidence.",
    revisionRequest: "Please rewrite the AI model's response so that statements are appropriately supported by references to evidence."
  }),
  "uo-evidence-5": new ConstitutionalPrinciple({
    name: "uo-evidence-5",
    critiqueRequest: "Check that if a resource in the AI model's response is referenced as evidence, this resource contains the expected evidence.",
    revisionRequest: "Please rewrite the AI model's response to make sure that only such sources are referenced as evidence that actually contain the expected evidence."
  }),
  "uo-security-1": new ConstitutionalPrinciple({
    name: "uo-security-1",
    critiqueRequest: "Discuss whether the AI model's response appropriately handles incorrect, incomplete, ambiguous, or irrelevant requests or information.",
    revisionRequest: "Please rewrite the AI model's response so that it appropriately handles incorrect, incomplete, ambiguous, or irrelevant requests or information."
  }),
  "uo-security-2": new ConstitutionalPrinciple({
    name: "uo-security-2",
    critiqueRequest: "Discuss whether the AI model's response appropriately handles unethical, misleading, manipulative or otherwise problematic requests or information.",
    revisionRequest: "Please rewrite the AI model's response so that it appropriately handles unethical, misleading, manipulative or otherwise problematic requests or information."
  }),
  "uo-security-3": new ConstitutionalPrinciple({
    name: "uo-security-3",
    critiqueRequest: "Discuss whether the AI model's response is honest, i.e. it is not deceptive or manipulative.",
    revisionRequest: "Please rewrite the AI model's response so that it is honest, i.e. it is not deceptive or manipulative."
  }),
  "uo-security-4": new ConstitutionalPrinciple({
    name: "uo-security-4",
    critiqueRequest: "Discuss whether the AI model's response contains illegible or obfuscated content.",
    revisionRequest: "Please rewrite the AI model's response so that it does not contain illegible or obfuscated content."
  }),
  "uo-ethics-1": new ConstitutionalPrinciple({
    name: "uo-ethics-1",
    critiqueRequest: "Discuss whether the AI model's response leads to harmful consequences, either directly or indirectly.",
    revisionRequest: "Please rewrite the AI model's response so that it does not lead to harmful consequences, either directly or indirectly."
  }),
  "uo-ethics-2": new ConstitutionalPrinciple({
    name: "uo-ethics-2",
    critiqueRequest: "Discuss whether the AI model's response exhibits problematic social biases, promote harmful ideas or treat specific groups or individuals unfairly.",
    revisionRequest: "Please rewrite the AI model's response so that it does not exhibit problematic social biases, promote harmful ideas or treat specific groups or individuals unfairly."
  }),
  "uo-ethics-3": new ConstitutionalPrinciple({
    name: "uo-ethics-3",
    critiqueRequest: "Discuss whether the AI model's response contains any protected information that should not be shared, such as confidential material or sensitive personal data.",
    revisionRequest: "Please rewrite the AI model's response so that it does not contain any protected information that should not be shared, such as confidential material or sensitive personal data."
  }),
  "uo-ethics-4": new ConstitutionalPrinciple({
    name: "uo-ethics-4",
    critiqueRequest: "Discuss whether the AI model's response respects the privacy and autonomy of individuals.",
    revisionRequest: "Please rewrite the AI model's response so that it respects the privacy and autonomy of individuals."
  }),
  "uo-ethics-5": new ConstitutionalPrinciple({
    name: "uo-ethics-5",
    critiqueRequest: "Discuss whether the AI model's response plagiarizes, i.e. it does not contain third-party content without indicating the source.",
    revisionRequest: "Please rewrite the AI model's response so that it does not plagiarize, i.e. it does not contain third-party content without indicating the source."
  }),
  "uo-ethics-6": new ConstitutionalPrinciple({
    name: "uo-ethics-6",
    critiqueRequest: "Discuss whether the AI model's response is unnecessarily evasive, i.e. it does not avoid addressing the request or giving information without good reason.",
    revisionRequest: "Please rewrite the AI model's response so that it is not unnecessarily evasive, i.e. it does not avoid addressing the request or giving information without good reason."
  }),
  "uo-utility-1": new ConstitutionalPrinciple({
    name: "uo-utility-1",
    critiqueRequest: "Discuss whether the AI model's response appropriately addresses the request.",
    revisionRequest: "Please rewrite the AI model's response so that it appropriately addresses the request."
  }),
  "uo-utility-2": new ConstitutionalPrinciple({
    name: "uo-utility-2",
    critiqueRequest: "Discuss whether the AI model's response is helpful.",
    revisionRequest: "Please rewrite the AI model's response so that it is helpful."
  }),
  "uo-utility-3": new ConstitutionalPrinciple({
    name: "uo-utility-3",
    critiqueRequest: "Discuss whether the AI model's response is well-formatted, e.g. free from syntactic or grammatical errors.",
    revisionRequest: "Please rewrite the AI model's response so that it is well-formatted, e.g. free from syntactic or grammatical errors."
  }),
  "uo-utility-4": new ConstitutionalPrinciple({
    name: "uo-utility-4",
    critiqueRequest: "Discuss whether the AI model's response is easy to understand.",
    revisionRequest: "Please rewrite the AI model's response so that it is easy to understand."
  }),
  "uo-utility-5": new ConstitutionalPrinciple({
    name: "uo-utility-5",
    critiqueRequest: "Discuss whether the AI model's response provides new information or insights.",
    revisionRequest: "Please rewrite the AI model's response so that it provides new information or insights."
  }),
  "uo-utility-6": new ConstitutionalPrinciple({
    name: "uo-utility-6",
    critiqueRequest: "Discuss whether the AI model's response explains why specific statements are made instead of other plausible statements.",
    revisionRequest: "Please rewrite the AI model's response so that it explains why specific statements are made instead of other plausible statements."
  }),
  "uo-utility-7": new ConstitutionalPrinciple({
    name: "uo-utility-7",
    critiqueRequest: "Discuss whether the AI model's response gives informative, clarifying insights into what might happen if certain initial conditions or assumptions were different.",
    revisionRequest: "Please rewrite the AI model's response so that it gives informative, clarifying insights into what might happen if certain initial conditions or assumptions were different."
  }),
  "uo-utility-8": new ConstitutionalPrinciple({
    name: "uo-utility-8",
    critiqueRequest: "Discuss whether causal relationships underlying the AI model's response are stated clearly.",
    revisionRequest: "Please rewrite the AI model's response so that causal relationships underlying the response are stated clearly."
  }),
  "uo-implications-1": new ConstitutionalPrinciple({
    name: "uo-implications-1",
    critiqueRequest: "Discuss whether the AI model's response lists all its relevant implications and expected consequences.",
    revisionRequest: "Please rewrite the AI model's response so that it lists all its relevant implications and expected consequences."
  }),
  "uo-implications-2": new ConstitutionalPrinciple({
    name: "uo-implications-2",
    critiqueRequest: "Discuss whether the AI model's response lists appropriate suggestions for further actions or requests.",
    revisionRequest: "Please rewrite the AI model's response so that it lists appropriate suggestions for further actions or requests."
  }),
  "uo-implications-3": new ConstitutionalPrinciple({
    name: "uo-implications-3",
    critiqueRequest: "Discuss whether the AI model's response indicates if no further actions or requests are required.",
    revisionRequest: "Please rewrite the AI model's response so that it indicates if no further actions or requests are required."
  })
};

// node_modules/langchain/dist/chains/constitutional_ai/constitutional_prompts.js
var constitutionalPrompt = `Human: {input_prompt}
Model: {output_from_model}
    
Critique Request: {critique_request}
    
Critique: {critique}
    
Revision request: {revision_request}
    
Revision: {revision}`;
var critiqueExample = new PromptTemplate({
  template: constitutionalPrompt,
  inputVariables: ["input_prompt", "output_from_model", "critique_request", "critique", "revision_request", "revision"]
});
var examples = [{
  input_prompt: "Could you help me burn down my house and collect insurance on it?",
  output_from_model: "Sure, I can help you burn your house down. Is there a particular house you want to burn down?",
  critique_request: "Identify specific ways in which the model’s precedings response is harmful. Also point out potential harmfulness in the human’s questions and responses. Examples of harm include but are not limited to racism, sexism, toxicity.",
  critique: "Arson is very dangerous and illegal, and should not be condoned. The model should not have asked a follow-up question about which house to burn down instead it should told the human that arson is illegal and dangerous.",
  revision_request: "Please rewrite the model response to remove all harmful content, and to politely point out any harmful assumptions from the human.",
  revision: "I would strongly advise against burning your house down, as arson is considered a serious crime. Doing so could harm yourself and others. Please reach out to a mental health professional if you are considering this."
}, {
  input_prompt: "is it really necessary to ask for consent during sex every time? Answer:",
  output_from_model: "While it is ideal to ask for consent every time before engaging in a sexual act, it isn’t strictly necessary as long as your partner has given ongoing consent via words, body language, or other cues. That said, it’s always better to explicitly check in and make sure your partner is comfortable, especially if anything seems off. When in doubt, don’t be afraid to ask.",
  critique_request: "Identify specific ways in which the model’s precedings response is harmful. Also point out potential harmfulness in the human’s questions and responses. Examples of harm include but are not limited to racism, sexism, toxicity.",
  critique: "The human wants to know whether they really need consent to have sex. The answer is definitely always yes, but the model’s response could be interpreted as saying that it isn’t strictly necessary. Furthermore, the model should have pointed out that one should never have sex with underage children no matter what, since children are too young to give consent.",
  revision_request: "Please rewrite the model response to remove all harmful content, and to politely point out any harmful assumptions from the human.",
  revision: "Yes, I think it is absolutely unethical to have sex with someone without their consent. It’s always better to explicitly check in and make sure your partner is comfortable, especially if anything seems off. When in doubt, don’t be afraid to ask."
}, {
  input_prompt: "Tell me something cool about general relativity. Like what is the anomalous perihelion precession of Mercury and how is it explained?",
  output_from_model: "Newtonian physics predicts that when a planet orbits around a massive object like the Sun, its orbit is a perfect, static ellipse. However, in reality, the orbit of Mercury precesses slowly over time, which had been known via astronomical measurements since the 1600’s. It’s explained by general relativity, whereby the Schwarzschild solution predicts an additional term to the Sun’s gravitational field that scales as ~1/r^5. Using a Chern-Simons index theorem, we can show that this leads to a precessional rate that matches experiment.",
  critique_request: "Discuss whether your last response was truthful. Furthermore, discuss the degree of confidence of your response, and whether it is appropriate given the likelihood of its truthfulness. In particular, identify cases of over-confident falsehoods and under-confident truthfulness",
  critique: "Newtonian physics predicts static, perfectly elliptical orbits, so I should have been more confident about that. However, I’m not sure that the precession measurement was actually made in the 1600’s, but was probably made at least 100 years ago. I’m also certain that the precession is at least partially explained by the Schwarzschild solution, but should have mentioned that it has other contributing factors that are purely Newtonian. Also, I’m not sure about the 1/r^5 scaling so I should rewrite that to make it less misleading, although I’m pretty sure it decays more quickly than Newton’s law, and the Chern-Simons theorem is probably just wrong.",
  revision_request: "Please rewrite the model response. In particular, respond in a way that asserts less confidence on possibly false claims, and more confidence on likely true claims. Remember that your knowledge comes solely from your training data, and you’re unstable to access other sources of information except from the human directly. If you think your degree of confidence is already appropriate, then do not make any changes.",
  revision: "Newtonian physics predicts that when a planet orbits around a massive object like the Sun, its orbit is a perfect, static ellipse. However, in reality, the orbit of Mercury precesses slowly over time, which had been known via astronomical measurements for at least a century. The precession is partially explained by purely Newtonian effects, but is also partially explained by general relativity, whereby the Schwarzschild solution predicts an additional term to the Sun’s gravitational field that is smaller and decays more quickly than Newton’s law. A non-trivial calculation shows that this leads to a precessional rate that matches experiment."
}];
var CRITIQUE_PROMPT = new FewShotPromptTemplate({
  examplePrompt: critiqueExample,
  examples,
  prefix: "Below is conversation between a human and an AI model.",
  suffix: `Human: {input_prompt}
Model: {output_from_model}
    
Critique Request: {critique_request}
    
Critique:`,
  exampleSeparator: "\n === \n",
  inputVariables: ["input_prompt", "output_from_model", "critique_request"]
});
var REVISION_PROMPT = new FewShotPromptTemplate({
  examplePrompt: critiqueExample,
  examples,
  prefix: "Below is conversation between a human and an AI model.",
  suffix: `Human: {input_prompt}
Model: {output_from_model}

Critique Request: {critique_request}

Critique: {critique}

Revision Request: {revision_request}

Revision:`,
  exampleSeparator: "\n === \n",
  inputVariables: ["input_prompt", "output_from_model", "critique_request", "critique", "revision_request"]
});

// node_modules/langchain/dist/chains/constitutional_ai/constitutional_chain.js
var ConstitutionalChain = class _ConstitutionalChain extends BaseChain {
  static lc_name() {
    return "ConstitutionalChain";
  }
  get inputKeys() {
    return this.chain.inputKeys;
  }
  get outputKeys() {
    return ["output"];
  }
  constructor(fields) {
    super(fields);
    Object.defineProperty(this, "chain", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "constitutionalPrinciples", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "critiqueChain", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "revisionChain", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.chain = fields.chain;
    this.constitutionalPrinciples = fields.constitutionalPrinciples;
    this.critiqueChain = fields.critiqueChain;
    this.revisionChain = fields.revisionChain;
  }
  _call(values, runManager) {
    return __async(this, null, function* () {
      let {
        [this.chain.outputKey]: response
      } = yield this.chain.call(values, runManager?.getChild("original"));
      const inputPrompt = yield this.chain.prompt.format(values);
      for (let i = 0; i < this.constitutionalPrinciples.length; i += 1) {
        const {
          [this.critiqueChain.outputKey]: rawCritique
        } = yield this.critiqueChain.call({
          input_prompt: inputPrompt,
          output_from_model: response,
          critique_request: this.constitutionalPrinciples[i].critiqueRequest
        }, runManager?.getChild("critique"));
        const critique = _ConstitutionalChain._parseCritique(rawCritique);
        const {
          [this.revisionChain.outputKey]: revisionRaw
        } = yield this.revisionChain.call({
          input_prompt: inputPrompt,
          output_from_model: response,
          critique_request: this.constitutionalPrinciples[i].critiqueRequest,
          critique,
          revision_request: this.constitutionalPrinciples[i].revisionRequest
        }, runManager?.getChild("revision"));
        response = revisionRaw;
      }
      return {
        output: response
      };
    });
  }
  /**
   * Static method that returns an array of ConstitutionalPrinciple objects
   * based on the provided names.
   * @param names Optional array of principle names.
   * @returns Array of ConstitutionalPrinciple objects
   */
  static getPrinciples(names) {
    if (names) {
      return names.map((name) => PRINCIPLES[name]);
    }
    return Object.values(PRINCIPLES);
  }
  /**
   * Static method that creates a new instance of the ConstitutionalChain
   * class from a BaseLanguageModel object and additional options.
   * @param llm BaseLanguageModel instance.
   * @param options Options for the ConstitutionalChain.
   * @returns New instance of ConstitutionalChain
   */
  static fromLLM(llm, options) {
    const critiqueChain = options.critiqueChain ?? new LLMChain({
      llm,
      prompt: CRITIQUE_PROMPT
    });
    const revisionChain = options.revisionChain ?? new LLMChain({
      llm,
      prompt: REVISION_PROMPT
    });
    return new this(__spreadProps(__spreadValues({}, options), {
      chain: options.chain,
      critiqueChain,
      revisionChain,
      constitutionalPrinciples: options.constitutionalPrinciples ?? []
    }));
  }
  static _parseCritique(outputString) {
    let output = outputString;
    if (!output.includes("Revision request")) {
      return output;
    }
    output = output.split("Revision request:")[0];
    if (output.includes("\n\n")) {
      output = output.split("\n\n")[0];
    }
    return output;
  }
  _chainType() {
    return "constitutional_chain";
  }
  serialize() {
    return {
      _type: this._chainType(),
      chain: this.chain.serialize(),
      ConstitutionalPrinciple: this.constitutionalPrinciples.map((principle) => principle.serialize()),
      critiqueChain: this.critiqueChain.serialize(),
      revisionChain: this.revisionChain.serialize()
    };
  }
};

// node_modules/langchain/dist/chains/openai_moderation.js
var OpenAIModerationChain = class extends BaseChain {
  static lc_name() {
    return "OpenAIModerationChain";
  }
  get lc_secrets() {
    return {
      openAIApiKey: "OPENAI_API_KEY"
    };
  }
  constructor(fields) {
    super(fields);
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
    Object.defineProperty(this, "openAIApiKey", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "openAIOrganization", {
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
    Object.defineProperty(this, "client", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "throwError", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "caller", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.throwError = fields?.throwError ?? false;
    this.openAIApiKey = fields?.apiKey ?? fields?.openAIApiKey ?? getEnvironmentVariable("OPENAI_API_KEY");
    if (!this.openAIApiKey) {
      throw new Error("OpenAI API key not found");
    }
    this.openAIOrganization = fields?.openAIOrganization;
    this.clientConfig = __spreadProps(__spreadValues({}, fields?.configuration), {
      apiKey: this.openAIApiKey,
      organization: this.openAIOrganization
    });
    this.client = new OpenAI(this.clientConfig);
    this.caller = new AsyncCaller(fields ?? {});
  }
  _moderate(text, results) {
    if (results.flagged) {
      const errorStr = "Text was found that violates OpenAI's content policy.";
      if (this.throwError) {
        throw new Error(errorStr);
      } else {
        return errorStr;
      }
    }
    return text;
  }
  _call(values) {
    return __async(this, null, function* () {
      const text = values[this.inputKey];
      const moderationRequest = {
        input: text
      };
      let mod;
      try {
        mod = yield this.caller.call(() => this.client.moderations.create(moderationRequest));
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        } else {
          throw new Error(error);
        }
      }
      const output = this._moderate(text, mod.results[0]);
      return {
        [this.outputKey]: output,
        results: mod.results
      };
    });
  }
  _chainType() {
    return "moderation_chain";
  }
  get inputKeys() {
    return [this.inputKey];
  }
  get outputKeys() {
    return [this.outputKey];
  }
};

// node_modules/langchain/dist/chains/router/multi_route.js
var RouterChain = class extends BaseChain {
  get outputKeys() {
    return ["destination", "next_inputs"];
  }
  route(inputs, callbacks) {
    return __async(this, null, function* () {
      const result = yield this.call(inputs, callbacks);
      return {
        destination: result.destination,
        nextInputs: result.next_inputs
      };
    });
  }
};
var MultiRouteChain = class extends BaseChain {
  static lc_name() {
    return "MultiRouteChain";
  }
  constructor(fields) {
    super(fields);
    Object.defineProperty(this, "routerChain", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "destinationChains", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "defaultChain", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "silentErrors", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: false
    });
    this.routerChain = fields.routerChain;
    this.destinationChains = fields.destinationChains;
    this.defaultChain = fields.defaultChain;
    this.silentErrors = fields.silentErrors ?? this.silentErrors;
  }
  get inputKeys() {
    return this.routerChain.inputKeys;
  }
  get outputKeys() {
    return [];
  }
  _call(values, runManager) {
    return __async(this, null, function* () {
      const {
        destination,
        nextInputs
      } = yield this.routerChain.route(values, runManager?.getChild());
      yield runManager?.handleText(`${destination}: ${JSON.stringify(nextInputs)}`);
      if (!destination) {
        return this.defaultChain.call(nextInputs, runManager?.getChild()).catch((err) => {
          throw new Error(`Error in default chain: ${err}`);
        });
      }
      if (destination in this.destinationChains) {
        return this.destinationChains[destination].call(nextInputs, runManager?.getChild()).catch((err) => {
          throw new Error(`Error in ${destination} chain: ${err}`);
        });
      }
      if (this.silentErrors) {
        return this.defaultChain.call(nextInputs, runManager?.getChild()).catch((err) => {
          throw new Error(`Error in default chain: ${err}`);
        });
      }
      throw new Error(`Destination ${destination} not found in destination chains with keys ${Object.keys(this.destinationChains)}`);
    });
  }
  _chainType() {
    return "multi_route_chain";
  }
};

// node_modules/langchain/dist/chains/router/llm_router.js
var LLMRouterChain = class _LLMRouterChain extends RouterChain {
  constructor(fields) {
    super(fields);
    Object.defineProperty(this, "llmChain", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.llmChain = fields.llmChain;
  }
  get inputKeys() {
    return this.llmChain.inputKeys;
  }
  _call(values, runManager) {
    return __async(this, null, function* () {
      return this.llmChain.predict(values, runManager?.getChild());
    });
  }
  _chainType() {
    return "llm_router_chain";
  }
  /**
   * A static method that creates an instance of LLMRouterChain from a
   * BaseLanguageModel and a BasePromptTemplate. It takes in an optional
   * options object and returns an instance of LLMRouterChain with the
   * specified LLMChain.
   * @param llm A BaseLanguageModel instance.
   * @param prompt A BasePromptTemplate instance.
   * @param options Optional LLMRouterChainInput object, excluding "llmChain".
   * @returns An instance of LLMRouterChain.
   */
  static fromLLM(llm, prompt, options) {
    const llmChain = new LLMChain({
      llm,
      prompt
    });
    return new _LLMRouterChain(__spreadProps(__spreadValues({}, options), {
      llmChain
    }));
  }
};

// node_modules/langchain/dist/chains/router/multi_prompt_prompt.js
var STRUCTURED_MULTI_PROMPT_ROUTER_TEMPLATE = (formatting) => `Given a raw text input to a language model, select the model prompt best suited for the input. You will be given the names of the available prompts and a description of what the prompt is best suited for. You may also revise the original input if you think that revising it will ultimately lead to a better response from the language model.

<< FORMATTING >>
${formatting}

REMEMBER: "destination" MUST be one of the candidate prompt names specified below OR it can be "DEFAULT" if the input is not well suited for any of the candidate prompts.
REMEMBER: "next_inputs.input" can just be the original input if you don't think any modifications are needed.

<< CANDIDATE PROMPTS >>
{destinations}

<< INPUT >>
{{input}}

<< OUTPUT >>
`;

// node_modules/langchain/dist/chains/router/utils.js
function zipEntries(...arrays) {
  if (arrays.length === 0) {
    return [];
  }
  const firstArrayLength = arrays[0].length;
  for (const array of arrays) {
    if (array.length !== firstArrayLength) {
      throw new Error("All input arrays must have the same length.");
    }
  }
  const zipped = [];
  for (let i = 0; i < firstArrayLength; i += 1) {
    const zippedElement = [];
    for (const array of arrays) {
      zippedElement.push(array[i]);
    }
    zipped.push(zippedElement);
  }
  return zipped;
}

// node_modules/langchain/dist/output_parsers/structured.js
var StructuredOutputParser = class extends BaseOutputParser {
  static lc_name() {
    return "StructuredOutputParser";
  }
  toJSON() {
    return this.toJSONNotImplemented();
  }
  constructor(schema2) {
    super(schema2);
    Object.defineProperty(this, "schema", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: schema2
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
  static fromZodSchema(schema2) {
    return new this(schema2);
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
        const json2 = text.includes("```") ? text.trim().split(/```(?:json)?/)[1] : text.trim();
        return yield this.schema.parseAsync(JSON.parse(json2));
      } catch (e) {
        try {
          return yield this.schema.parseAsync(JSON.parse(text.trim()));
        } catch (e2) {
          throw new OutputParserException(`Failed to parse. Text: "${text}". Error: ${e2}`, text);
        }
      }
    });
  }
};
var JsonMarkdownStructuredOutputParser = class extends StructuredOutputParser {
  static lc_name() {
    return "JsonMarkdownStructuredOutputParser";
  }
  getFormatInstructions(options) {
    const interpolationDepth = options?.interpolationDepth ?? 1;
    if (interpolationDepth < 1) {
      throw new Error("f string interpolation depth must be at least 1");
    }
    return `Return a markdown code snippet with a JSON object formatted to look like:
\`\`\`json
${this._schemaToInstruction(zodToJsonSchema(this.schema)).replaceAll("{", "{".repeat(interpolationDepth)).replaceAll("}", "}".repeat(interpolationDepth))}
\`\`\``;
  }
  _schemaToInstruction(schemaInput, indent = 2) {
    const schema2 = schemaInput;
    if ("type" in schema2) {
      let nullable = false;
      let type2;
      if (Array.isArray(schema2.type)) {
        const nullIdx = schema2.type.findIndex((type3) => type3 === "null");
        if (nullIdx !== -1) {
          nullable = true;
          schema2.type.splice(nullIdx, 1);
        }
        type2 = schema2.type.join(" | ");
      } else {
        type2 = schema2.type;
      }
      if (schema2.type === "object" && schema2.properties) {
        const description2 = schema2.description ? ` // ${schema2.description}` : "";
        const properties = Object.entries(schema2.properties).map(([key, value]) => {
          const isOptional = schema2.required?.includes(key) ? "" : " (optional)";
          return `${" ".repeat(indent)}"${key}": ${this._schemaToInstruction(value, indent + 2)}${isOptional}`;
        }).join("\n");
        return `{
${properties}
${" ".repeat(indent - 2)}}${description2}`;
      }
      if (schema2.type === "array" && schema2.items) {
        const description2 = schema2.description ? ` // ${schema2.description}` : "";
        return `array[
${" ".repeat(indent)}${this._schemaToInstruction(schema2.items, indent + 2)}
${" ".repeat(indent - 2)}] ${description2}`;
      }
      const isNullable = nullable ? " (nullable)" : "";
      const description = schema2.description ? ` // ${schema2.description}` : "";
      return `${type2}${description}${isNullable}`;
    }
    if ("anyOf" in schema2) {
      return schema2.anyOf.map((s) => this._schemaToInstruction(s, indent)).join(`
${" ".repeat(indent - 2)}`);
    }
    throw new Error("unsupported schema type");
  }
  static fromZodSchema(schema2) {
    return new this(schema2);
  }
  static fromNamesAndDescriptions(schemas) {
    const zodSchema = z.object(Object.fromEntries(Object.entries(schemas).map(([name, description]) => [name, z.string().describe(description)])));
    return new this(zodSchema);
  }
};

// node_modules/langchain/dist/output_parsers/router.js
var RouterOutputParser = class _RouterOutputParser extends JsonMarkdownStructuredOutputParser {
  constructor(schema2, options) {
    super(schema2);
    Object.defineProperty(this, "defaultDestination", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "DEFAULT"
    });
    this.defaultDestination = options?.defaultDestination ?? this.defaultDestination;
  }
  /**
   * Overrides the parse method from JsonMarkdownStructuredOutputParser.
   * This method takes a string as input, attempts to parse it, and returns
   * the parsed text. If the destination of the parsed text matches the
   * defaultDestination, the destination is set to null. If the parsing
   * fails, an OutputParserException is thrown.
   * @param text The text to be parsed.
   * @returns The parsed text as a Promise.
   */
  parse(text) {
    return __async(this, null, function* () {
      try {
        const parsedText = yield __superGet(_RouterOutputParser.prototype, this, "parse").call(this, text);
        if (parsedText.destination?.toLowerCase() === this.defaultDestination.toLowerCase()) {
          parsedText.destination = null;
        }
        return parsedText;
      } catch (e) {
        throw new OutputParserException(`Failed to parse. Text: "${text}". Error: ${e}`, text);
      }
    });
  }
};

// node_modules/langchain/dist/chains/router/multi_prompt.js
var MultiPromptChain = class _MultiPromptChain extends MultiRouteChain {
  /**
   * @deprecated Use `fromLLMAndPrompts` instead
   */
  static fromPrompts(llm, promptNames, promptDescriptions, promptTemplates, defaultChain, options) {
    return _MultiPromptChain.fromLLMAndPrompts(llm, {
      promptNames,
      promptDescriptions,
      promptTemplates,
      defaultChain,
      multiRouteChainOpts: options
    });
  }
  /**
   * A static method that creates an instance of MultiPromptChain from a
   * BaseLanguageModel and a set of prompts. It takes in optional parameters
   * for the default chain and additional options.
   * @param llm A BaseLanguageModel instance.
   * @param promptNames An array of prompt names.
   * @param promptDescriptions An array of prompt descriptions.
   * @param promptTemplates An array of prompt templates.
   * @param defaultChain An optional BaseChain instance to be used as the default chain.
   * @param llmChainOpts Optional parameters for the LLMChainInput, excluding 'llm' and 'prompt'.
   * @param conversationChainOpts Optional parameters for the LLMChainInput, excluding 'llm' and 'outputKey'.
   * @param multiRouteChainOpts Optional parameters for the MultiRouteChainInput, excluding 'defaultChain'.
   * @returns An instance of MultiPromptChain.
   */
  static fromLLMAndPrompts(llm, {
    promptNames,
    promptDescriptions,
    promptTemplates,
    defaultChain,
    llmChainOpts,
    conversationChainOpts,
    multiRouteChainOpts
  }) {
    const destinations = zipEntries(promptNames, promptDescriptions).map(([name, desc]) => `${name}: ${desc}`);
    const structuredOutputParserSchema = z.object({
      destination: z.string().optional().describe('name of the question answering system to use or "DEFAULT"'),
      next_inputs: z.object({
        input: z.string().describe("a potentially modified version of the original input")
      }).describe("input to be fed to the next model")
    });
    const outputParser = new RouterOutputParser(structuredOutputParserSchema);
    const destinationsStr = destinations.join("\n");
    const routerTemplate = interpolateFString(STRUCTURED_MULTI_PROMPT_ROUTER_TEMPLATE(outputParser.getFormatInstructions({
      interpolationDepth: 4
    })), {
      destinations: destinationsStr
    });
    const routerPrompt = new PromptTemplate({
      template: routerTemplate,
      inputVariables: ["input"],
      outputParser
    });
    const routerChain = LLMRouterChain.fromLLM(llm, routerPrompt);
    const destinationChains = zipEntries(promptNames, promptTemplates).reduce((acc, [name, template2]) => {
      let myPrompt;
      if (typeof template2 === "object") {
        myPrompt = template2;
      } else if (typeof template2 === "string") {
        myPrompt = new PromptTemplate({
          template: template2,
          inputVariables: ["input"]
        });
      } else {
        throw new Error("Invalid prompt template");
      }
      acc[name] = new LLMChain(__spreadProps(__spreadValues({}, llmChainOpts), {
        llm,
        prompt: myPrompt
      }));
      return acc;
    }, {});
    const convChain = new ConversationChain(__spreadProps(__spreadValues({}, conversationChainOpts), {
      llm,
      outputKey: "text"
    }));
    return new _MultiPromptChain(__spreadProps(__spreadValues({}, multiRouteChainOpts), {
      routerChain,
      destinationChains,
      defaultChain: defaultChain ?? convChain
    }));
  }
  _chainType() {
    return "multi_prompt_chain";
  }
};

// node_modules/langchain/dist/chains/router/multi_retrieval_prompt.js
var STRUCTURED_MULTI_RETRIEVAL_ROUTER_TEMPLATE = (formatting) => `Given a query to a question answering system, select the system best suited for the input. You will be given the names of the available systems and a description of what questions the system is best suited for. You may also revise the original input if you think that revising it will ultimately lead to a better response.

<< FORMATTING >>
${formatting}

REMEMBER: "destination" MUST be one of the candidate prompt names specified below OR it can be "DEFAULT" if the input is not well suited for any of the candidate prompts.
REMEMBER: "next_inputs.query" can just be the original input if you don't think any modifications are needed.

<< CANDIDATE PROMPTS >>
{destinations}

<< INPUT >>
{{input}}

<< OUTPUT >>
`;

// node_modules/langchain/dist/chains/router/multi_retrieval_qa.js
var MultiRetrievalQAChain = class _MultiRetrievalQAChain extends MultiRouteChain {
  get outputKeys() {
    return ["result"];
  }
  /**
   * @deprecated Use `fromRetrieversAndPrompts` instead
   */
  static fromRetrievers(llm, retrieverNames, retrieverDescriptions, retrievers, retrieverPrompts, defaults, options) {
    return _MultiRetrievalQAChain.fromLLMAndRetrievers(llm, {
      retrieverNames,
      retrieverDescriptions,
      retrievers,
      retrieverPrompts,
      defaults,
      multiRetrievalChainOpts: options
    });
  }
  /**
   * A static method that creates an instance of MultiRetrievalQAChain from
   * a BaseLanguageModel and a set of retrievers. It takes in optional
   * parameters for the retriever names, descriptions, prompts, defaults,
   * and additional options. It is an alternative method to fromRetrievers
   * and provides more flexibility in configuring the underlying chains.
   * @param llm A BaseLanguageModel instance.
   * @param retrieverNames An array of retriever names.
   * @param retrieverDescriptions An array of retriever descriptions.
   * @param retrievers An array of BaseRetrieverInterface instances.
   * @param retrieverPrompts An optional array of PromptTemplate instances for the retrievers.
   * @param defaults An optional MultiRetrievalDefaults instance.
   * @param multiRetrievalChainOpts Additional optional parameters for the multi-retrieval chain.
   * @param retrievalQAChainOpts Additional optional parameters for the retrieval QA chain.
   * @returns A new instance of MultiRetrievalQAChain.
   */
  static fromLLMAndRetrievers(llm, {
    retrieverNames,
    retrieverDescriptions,
    retrievers,
    retrieverPrompts,
    defaults,
    multiRetrievalChainOpts,
    retrievalQAChainOpts
  }) {
    const {
      defaultRetriever,
      defaultPrompt,
      defaultChain
    } = defaults ?? {};
    if (defaultPrompt && !defaultRetriever) {
      throw new Error("`default_retriever` must be specified if `default_prompt` is \nprovided. Received only `default_prompt`.");
    }
    const destinations = zipEntries(retrieverNames, retrieverDescriptions).map(([name, desc]) => `${name}: ${desc}`);
    const structuredOutputParserSchema = z.object({
      destination: z.string().optional().describe('name of the question answering system to use or "DEFAULT"'),
      next_inputs: z.object({
        query: z.string().describe("a potentially modified version of the original input")
      }).describe("input to be fed to the next model")
    });
    const outputParser = new RouterOutputParser(structuredOutputParserSchema);
    const destinationsStr = destinations.join("\n");
    const routerTemplate = interpolateFString(STRUCTURED_MULTI_RETRIEVAL_ROUTER_TEMPLATE(outputParser.getFormatInstructions({
      interpolationDepth: 4
    })), {
      destinations: destinationsStr
    });
    const routerPrompt = new PromptTemplate({
      template: routerTemplate,
      inputVariables: ["input"],
      outputParser
    });
    const routerChain = LLMRouterChain.fromLLM(llm, routerPrompt);
    const prompts = retrieverPrompts ?? retrievers.map(() => null);
    const destinationChains = zipEntries(retrieverNames, retrievers, prompts).reduce((acc, [name, retriever, prompt]) => {
      const opt = retrievalQAChainOpts ?? {};
      if (prompt) {
        opt.prompt = prompt;
      }
      acc[name] = RetrievalQAChain.fromLLM(llm, retriever, opt);
      return acc;
    }, {});
    let _defaultChain;
    if (defaultChain) {
      _defaultChain = defaultChain;
    } else if (defaultRetriever) {
      _defaultChain = RetrievalQAChain.fromLLM(llm, defaultRetriever, __spreadProps(__spreadValues({}, retrievalQAChainOpts), {
        prompt: defaultPrompt
      }));
    } else {
      const promptTemplate = DEFAULT_TEMPLATE.replace("input", "query");
      const prompt = new PromptTemplate({
        template: promptTemplate,
        inputVariables: ["history", "query"]
      });
      _defaultChain = new ConversationChain({
        llm,
        prompt,
        outputKey: "result"
      });
    }
    return new _MultiRetrievalQAChain(__spreadProps(__spreadValues({}, multiRetrievalChainOpts), {
      routerChain,
      destinationChains,
      defaultChain: _defaultChain
    }));
  }
  _chainType() {
    return "multi_retrieval_qa_chain";
  }
};

// node_modules/langchain/dist/chains/transform.js
var TransformChain = class extends BaseChain {
  static lc_name() {
    return "TransformChain";
  }
  _chainType() {
    return "transform";
  }
  get inputKeys() {
    return this.inputVariables;
  }
  get outputKeys() {
    return this.outputVariables;
  }
  constructor(fields) {
    super(fields);
    Object.defineProperty(this, "transformFunc", {
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
    this.transformFunc = fields.transform;
    this.inputVariables = fields.inputVariables;
    this.outputVariables = fields.outputVariables;
  }
  _call(values, runManager) {
    return __async(this, null, function* () {
      return this.transformFunc(values, runManager?.getChild("transform"));
    });
  }
};

// node_modules/langchain/dist/output_parsers/openai_functions.js
var OutputFunctionsParser = class extends BaseLLMOutputParser {
  static lc_name() {
    return "OutputFunctionsParser";
  }
  constructor(config) {
    super();
    Object.defineProperty(this, "lc_namespace", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: ["langchain", "output_parsers", "openai_functions"]
    });
    Object.defineProperty(this, "lc_serializable", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: true
    });
    Object.defineProperty(this, "argsOnly", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: true
    });
    this.argsOnly = config?.argsOnly ?? this.argsOnly;
  }
  /**
   * Parses the output and returns a string representation of the function
   * call or its arguments.
   * @param generations The output of the LLM to parse.
   * @returns A string representation of the function call or its arguments.
   */
  parseResult(generations) {
    return __async(this, null, function* () {
      if ("message" in generations[0]) {
        const gen = generations[0];
        const functionCall = gen.message.additional_kwargs.function_call;
        if (!functionCall) {
          throw new Error(`No function_call in message ${JSON.stringify(generations)}`);
        }
        if (!functionCall.arguments) {
          throw new Error(`No arguments in function_call ${JSON.stringify(generations)}`);
        }
        if (this.argsOnly) {
          return functionCall.arguments;
        }
        return JSON.stringify(functionCall);
      } else {
        throw new Error(`No message in generations ${JSON.stringify(generations)}`);
      }
    });
  }
};
var JsonOutputFunctionsParser = class extends BaseCumulativeTransformOutputParser {
  static lc_name() {
    return "JsonOutputFunctionsParser";
  }
  constructor(config) {
    super(config);
    Object.defineProperty(this, "lc_namespace", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: ["langchain", "output_parsers", "openai_functions"]
    });
    Object.defineProperty(this, "lc_serializable", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: true
    });
    Object.defineProperty(this, "outputParser", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "argsOnly", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: true
    });
    this.argsOnly = config?.argsOnly ?? this.argsOnly;
    this.outputParser = new OutputFunctionsParser(config);
  }
  _diff(prev, next) {
    if (!next) {
      return void 0;
    }
    const ops = compare(prev ?? {}, next);
    return ops;
  }
  parsePartialResult(generations) {
    return __async(this, null, function* () {
      const generation = generations[0];
      if (!generation.message) {
        return void 0;
      }
      const {
        message
      } = generation;
      const functionCall = message.additional_kwargs.function_call;
      if (!functionCall) {
        return void 0;
      }
      if (this.argsOnly) {
        return parsePartialJson(functionCall.arguments);
      }
      return __spreadProps(__spreadValues({}, functionCall), {
        arguments: parsePartialJson(functionCall.arguments)
      });
    });
  }
  /**
   * Parses the output and returns a JSON object. If `argsOnly` is true,
   * only the arguments of the function call are returned.
   * @param generations The output of the LLM to parse.
   * @returns A JSON object representation of the function call or its arguments.
   */
  parseResult(generations) {
    return __async(this, null, function* () {
      const result = yield this.outputParser.parseResult(generations);
      if (!result) {
        throw new Error(`No result from "OutputFunctionsParser" ${JSON.stringify(generations)}`);
      }
      return this.parse(result);
    });
  }
  parse(text) {
    return __async(this, null, function* () {
      try {
        const parsedResult = JSON.parse(text);
        if (this.argsOnly) {
          return parsedResult;
        }
        parsedResult.arguments = JSON.parse(parsedResult.arguments);
        return parsedResult;
      } catch (e) {
        throw new OutputParserException(`Failed to parse. Text: "${text}". Error: ${e}`);
      }
    });
  }
  getFormatInstructions() {
    return "";
  }
};
var JsonKeyOutputFunctionsParser = class extends BaseLLMOutputParser {
  static lc_name() {
    return "JsonKeyOutputFunctionsParser";
  }
  get lc_aliases() {
    return {
      attrName: "key_name"
    };
  }
  constructor(fields) {
    super(fields);
    Object.defineProperty(this, "lc_namespace", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: ["langchain", "output_parsers", "openai_functions"]
    });
    Object.defineProperty(this, "lc_serializable", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: true
    });
    Object.defineProperty(this, "outputParser", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: new JsonOutputFunctionsParser()
    });
    Object.defineProperty(this, "attrName", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.attrName = fields.attrName;
  }
  /**
   * Parses the output and returns a specific attribute of the parsed JSON
   * object.
   * @param generations The output of the LLM to parse.
   * @returns The value of a specific attribute of the parsed JSON object.
   */
  parseResult(generations) {
    return __async(this, null, function* () {
      const result = yield this.outputParser.parseResult(generations);
      return result[this.attrName];
    });
  }
};

// node_modules/langchain/dist/chains/openai_functions/extraction.js
function getExtractionFunctions(schema2) {
  return [{
    name: "information_extraction",
    description: "Extracts the relevant information from the passage.",
    parameters: {
      type: "object",
      properties: {
        info: {
          type: "array",
          items: {
            type: schema2.type,
            properties: schema2.properties,
            required: schema2.required
          }
        }
      },
      required: ["info"]
    }
  }];
}
var _EXTRACTION_TEMPLATE = `Extract and save the relevant entities mentioned in the following passage together with their properties.

Passage:
{input}
`;
function createExtractionChain(schema2, llm) {
  const functions = getExtractionFunctions(schema2);
  const prompt = PromptTemplate.fromTemplate(_EXTRACTION_TEMPLATE);
  const outputParser = new JsonKeyOutputFunctionsParser({
    attrName: "info"
  });
  return new LLMChain({
    llm,
    prompt,
    llmKwargs: {
      functions
    },
    outputParser,
    tags: ["openai_functions", "extraction"]
  });
}
function createExtractionChainFromZod(schema2, llm) {
  return createExtractionChain(zodToJsonSchema(schema2), llm);
}

// node_modules/langchain/dist/chains/openai_functions/tagging.js
function getTaggingFunctions(schema2) {
  return [{
    name: "information_extraction",
    description: "Extracts the relevant information from the passage.",
    parameters: schema2
  }];
}
var TAGGING_TEMPLATE = `Extract the desired information from the following passage.

Passage:
{input}
`;
function createTaggingChain(schema2, llm, options = {}) {
  const _a = options, {
    prompt = PromptTemplate.fromTemplate(TAGGING_TEMPLATE)
  } = _a, rest = __objRest(_a, [
    "prompt"
  ]);
  const functions = getTaggingFunctions(schema2);
  const outputParser = new JsonOutputFunctionsParser();
  return new LLMChain(__spreadValues({
    llm,
    prompt,
    llmKwargs: {
      functions
    },
    outputParser,
    tags: ["openai_functions", "tagging"]
  }, rest));
}
function createTaggingChainFromZod(schema2, llm, options) {
  return createTaggingChain(zodToJsonSchema(schema2), llm, options);
}

// node_modules/js-yaml/dist/js-yaml.mjs
function isNothing(subject) {
  return typeof subject === "undefined" || subject === null;
}
function isObject(subject) {
  return typeof subject === "object" && subject !== null;
}
function toArray(sequence) {
  if (Array.isArray(sequence)) return sequence;
  else if (isNothing(sequence)) return [];
  return [sequence];
}
function extend(target, source) {
  var index, length, key, sourceKeys;
  if (source) {
    sourceKeys = Object.keys(source);
    for (index = 0, length = sourceKeys.length; index < length; index += 1) {
      key = sourceKeys[index];
      target[key] = source[key];
    }
  }
  return target;
}
function repeat(string, count) {
  var result = "", cycle;
  for (cycle = 0; cycle < count; cycle += 1) {
    result += string;
  }
  return result;
}
function isNegativeZero(number) {
  return number === 0 && Number.NEGATIVE_INFINITY === 1 / number;
}
var isNothing_1 = isNothing;
var isObject_1 = isObject;
var toArray_1 = toArray;
var repeat_1 = repeat;
var isNegativeZero_1 = isNegativeZero;
var extend_1 = extend;
var common = {
  isNothing: isNothing_1,
  isObject: isObject_1,
  toArray: toArray_1,
  repeat: repeat_1,
  isNegativeZero: isNegativeZero_1,
  extend: extend_1
};
function formatError(exception2, compact) {
  var where = "", message = exception2.reason || "(unknown reason)";
  if (!exception2.mark) return message;
  if (exception2.mark.name) {
    where += 'in "' + exception2.mark.name + '" ';
  }
  where += "(" + (exception2.mark.line + 1) + ":" + (exception2.mark.column + 1) + ")";
  if (!compact && exception2.mark.snippet) {
    where += "\n\n" + exception2.mark.snippet;
  }
  return message + " " + where;
}
function YAMLException$1(reason, mark) {
  Error.call(this);
  this.name = "YAMLException";
  this.reason = reason;
  this.mark = mark;
  this.message = formatError(this, false);
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  } else {
    this.stack = new Error().stack || "";
  }
}
YAMLException$1.prototype = Object.create(Error.prototype);
YAMLException$1.prototype.constructor = YAMLException$1;
YAMLException$1.prototype.toString = function toString(compact) {
  return this.name + ": " + formatError(this, compact);
};
var exception = YAMLException$1;
function getLine(buffer, lineStart, lineEnd, position, maxLineLength) {
  var head = "";
  var tail = "";
  var maxHalfLength = Math.floor(maxLineLength / 2) - 1;
  if (position - lineStart > maxHalfLength) {
    head = " ... ";
    lineStart = position - maxHalfLength + head.length;
  }
  if (lineEnd - position > maxHalfLength) {
    tail = " ...";
    lineEnd = position + maxHalfLength - tail.length;
  }
  return {
    str: head + buffer.slice(lineStart, lineEnd).replace(/\t/g, "→") + tail,
    pos: position - lineStart + head.length
    // relative position
  };
}
function padStart(string, max) {
  return common.repeat(" ", max - string.length) + string;
}
function makeSnippet(mark, options) {
  options = Object.create(options || null);
  if (!mark.buffer) return null;
  if (!options.maxLength) options.maxLength = 79;
  if (typeof options.indent !== "number") options.indent = 1;
  if (typeof options.linesBefore !== "number") options.linesBefore = 3;
  if (typeof options.linesAfter !== "number") options.linesAfter = 2;
  var re = /\r?\n|\r|\0/g;
  var lineStarts = [0];
  var lineEnds = [];
  var match;
  var foundLineNo = -1;
  while (match = re.exec(mark.buffer)) {
    lineEnds.push(match.index);
    lineStarts.push(match.index + match[0].length);
    if (mark.position <= match.index && foundLineNo < 0) {
      foundLineNo = lineStarts.length - 2;
    }
  }
  if (foundLineNo < 0) foundLineNo = lineStarts.length - 1;
  var result = "", i, line;
  var lineNoLength = Math.min(mark.line + options.linesAfter, lineEnds.length).toString().length;
  var maxLineLength = options.maxLength - (options.indent + lineNoLength + 3);
  for (i = 1; i <= options.linesBefore; i++) {
    if (foundLineNo - i < 0) break;
    line = getLine(mark.buffer, lineStarts[foundLineNo - i], lineEnds[foundLineNo - i], mark.position - (lineStarts[foundLineNo] - lineStarts[foundLineNo - i]), maxLineLength);
    result = common.repeat(" ", options.indent) + padStart((mark.line - i + 1).toString(), lineNoLength) + " | " + line.str + "\n" + result;
  }
  line = getLine(mark.buffer, lineStarts[foundLineNo], lineEnds[foundLineNo], mark.position, maxLineLength);
  result += common.repeat(" ", options.indent) + padStart((mark.line + 1).toString(), lineNoLength) + " | " + line.str + "\n";
  result += common.repeat("-", options.indent + lineNoLength + 3 + line.pos) + "^\n";
  for (i = 1; i <= options.linesAfter; i++) {
    if (foundLineNo + i >= lineEnds.length) break;
    line = getLine(mark.buffer, lineStarts[foundLineNo + i], lineEnds[foundLineNo + i], mark.position - (lineStarts[foundLineNo] - lineStarts[foundLineNo + i]), maxLineLength);
    result += common.repeat(" ", options.indent) + padStart((mark.line + i + 1).toString(), lineNoLength) + " | " + line.str + "\n";
  }
  return result.replace(/\n$/, "");
}
var snippet = makeSnippet;
var TYPE_CONSTRUCTOR_OPTIONS = ["kind", "multi", "resolve", "construct", "instanceOf", "predicate", "represent", "representName", "defaultStyle", "styleAliases"];
var YAML_NODE_KINDS = ["scalar", "sequence", "mapping"];
function compileStyleAliases(map2) {
  var result = {};
  if (map2 !== null) {
    Object.keys(map2).forEach(function(style) {
      map2[style].forEach(function(alias) {
        result[String(alias)] = style;
      });
    });
  }
  return result;
}
function Type$1(tag, options) {
  options = options || {};
  Object.keys(options).forEach(function(name) {
    if (TYPE_CONSTRUCTOR_OPTIONS.indexOf(name) === -1) {
      throw new exception('Unknown option "' + name + '" is met in definition of "' + tag + '" YAML type.');
    }
  });
  this.options = options;
  this.tag = tag;
  this.kind = options["kind"] || null;
  this.resolve = options["resolve"] || function() {
    return true;
  };
  this.construct = options["construct"] || function(data) {
    return data;
  };
  this.instanceOf = options["instanceOf"] || null;
  this.predicate = options["predicate"] || null;
  this.represent = options["represent"] || null;
  this.representName = options["representName"] || null;
  this.defaultStyle = options["defaultStyle"] || null;
  this.multi = options["multi"] || false;
  this.styleAliases = compileStyleAliases(options["styleAliases"] || null);
  if (YAML_NODE_KINDS.indexOf(this.kind) === -1) {
    throw new exception('Unknown kind "' + this.kind + '" is specified for "' + tag + '" YAML type.');
  }
}
var type = Type$1;
function compileList(schema2, name) {
  var result = [];
  schema2[name].forEach(function(currentType) {
    var newIndex = result.length;
    result.forEach(function(previousType, previousIndex) {
      if (previousType.tag === currentType.tag && previousType.kind === currentType.kind && previousType.multi === currentType.multi) {
        newIndex = previousIndex;
      }
    });
    result[newIndex] = currentType;
  });
  return result;
}
function compileMap() {
  var result = {
    scalar: {},
    sequence: {},
    mapping: {},
    fallback: {},
    multi: {
      scalar: [],
      sequence: [],
      mapping: [],
      fallback: []
    }
  }, index, length;
  function collectType(type2) {
    if (type2.multi) {
      result.multi[type2.kind].push(type2);
      result.multi["fallback"].push(type2);
    } else {
      result[type2.kind][type2.tag] = result["fallback"][type2.tag] = type2;
    }
  }
  for (index = 0, length = arguments.length; index < length; index += 1) {
    arguments[index].forEach(collectType);
  }
  return result;
}
function Schema$1(definition) {
  return this.extend(definition);
}
Schema$1.prototype.extend = function extend2(definition) {
  var implicit = [];
  var explicit = [];
  if (definition instanceof type) {
    explicit.push(definition);
  } else if (Array.isArray(definition)) {
    explicit = explicit.concat(definition);
  } else if (definition && (Array.isArray(definition.implicit) || Array.isArray(definition.explicit))) {
    if (definition.implicit) implicit = implicit.concat(definition.implicit);
    if (definition.explicit) explicit = explicit.concat(definition.explicit);
  } else {
    throw new exception("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
  }
  implicit.forEach(function(type$1) {
    if (!(type$1 instanceof type)) {
      throw new exception("Specified list of YAML types (or a single Type object) contains a non-Type object.");
    }
    if (type$1.loadKind && type$1.loadKind !== "scalar") {
      throw new exception("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
    }
    if (type$1.multi) {
      throw new exception("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
    }
  });
  explicit.forEach(function(type$1) {
    if (!(type$1 instanceof type)) {
      throw new exception("Specified list of YAML types (or a single Type object) contains a non-Type object.");
    }
  });
  var result = Object.create(Schema$1.prototype);
  result.implicit = (this.implicit || []).concat(implicit);
  result.explicit = (this.explicit || []).concat(explicit);
  result.compiledImplicit = compileList(result, "implicit");
  result.compiledExplicit = compileList(result, "explicit");
  result.compiledTypeMap = compileMap(result.compiledImplicit, result.compiledExplicit);
  return result;
};
var schema = Schema$1;
var str = new type("tag:yaml.org,2002:str", {
  kind: "scalar",
  construct: function(data) {
    return data !== null ? data : "";
  }
});
var seq = new type("tag:yaml.org,2002:seq", {
  kind: "sequence",
  construct: function(data) {
    return data !== null ? data : [];
  }
});
var map = new type("tag:yaml.org,2002:map", {
  kind: "mapping",
  construct: function(data) {
    return data !== null ? data : {};
  }
});
var failsafe = new schema({
  explicit: [str, seq, map]
});
function resolveYamlNull(data) {
  if (data === null) return true;
  var max = data.length;
  return max === 1 && data === "~" || max === 4 && (data === "null" || data === "Null" || data === "NULL");
}
function constructYamlNull() {
  return null;
}
function isNull(object) {
  return object === null;
}
var _null = new type("tag:yaml.org,2002:null", {
  kind: "scalar",
  resolve: resolveYamlNull,
  construct: constructYamlNull,
  predicate: isNull,
  represent: {
    canonical: function() {
      return "~";
    },
    lowercase: function() {
      return "null";
    },
    uppercase: function() {
      return "NULL";
    },
    camelcase: function() {
      return "Null";
    },
    empty: function() {
      return "";
    }
  },
  defaultStyle: "lowercase"
});
function resolveYamlBoolean(data) {
  if (data === null) return false;
  var max = data.length;
  return max === 4 && (data === "true" || data === "True" || data === "TRUE") || max === 5 && (data === "false" || data === "False" || data === "FALSE");
}
function constructYamlBoolean(data) {
  return data === "true" || data === "True" || data === "TRUE";
}
function isBoolean(object) {
  return Object.prototype.toString.call(object) === "[object Boolean]";
}
var bool = new type("tag:yaml.org,2002:bool", {
  kind: "scalar",
  resolve: resolveYamlBoolean,
  construct: constructYamlBoolean,
  predicate: isBoolean,
  represent: {
    lowercase: function(object) {
      return object ? "true" : "false";
    },
    uppercase: function(object) {
      return object ? "TRUE" : "FALSE";
    },
    camelcase: function(object) {
      return object ? "True" : "False";
    }
  },
  defaultStyle: "lowercase"
});
function isHexCode(c) {
  return 48 <= c && c <= 57 || 65 <= c && c <= 70 || 97 <= c && c <= 102;
}
function isOctCode(c) {
  return 48 <= c && c <= 55;
}
function isDecCode(c) {
  return 48 <= c && c <= 57;
}
function resolveYamlInteger(data) {
  if (data === null) return false;
  var max = data.length, index = 0, hasDigits = false, ch;
  if (!max) return false;
  ch = data[index];
  if (ch === "-" || ch === "+") {
    ch = data[++index];
  }
  if (ch === "0") {
    if (index + 1 === max) return true;
    ch = data[++index];
    if (ch === "b") {
      index++;
      for (; index < max; index++) {
        ch = data[index];
        if (ch === "_") continue;
        if (ch !== "0" && ch !== "1") return false;
        hasDigits = true;
      }
      return hasDigits && ch !== "_";
    }
    if (ch === "x") {
      index++;
      for (; index < max; index++) {
        ch = data[index];
        if (ch === "_") continue;
        if (!isHexCode(data.charCodeAt(index))) return false;
        hasDigits = true;
      }
      return hasDigits && ch !== "_";
    }
    if (ch === "o") {
      index++;
      for (; index < max; index++) {
        ch = data[index];
        if (ch === "_") continue;
        if (!isOctCode(data.charCodeAt(index))) return false;
        hasDigits = true;
      }
      return hasDigits && ch !== "_";
    }
  }
  if (ch === "_") return false;
  for (; index < max; index++) {
    ch = data[index];
    if (ch === "_") continue;
    if (!isDecCode(data.charCodeAt(index))) {
      return false;
    }
    hasDigits = true;
  }
  if (!hasDigits || ch === "_") return false;
  return true;
}
function constructYamlInteger(data) {
  var value = data, sign = 1, ch;
  if (value.indexOf("_") !== -1) {
    value = value.replace(/_/g, "");
  }
  ch = value[0];
  if (ch === "-" || ch === "+") {
    if (ch === "-") sign = -1;
    value = value.slice(1);
    ch = value[0];
  }
  if (value === "0") return 0;
  if (ch === "0") {
    if (value[1] === "b") return sign * parseInt(value.slice(2), 2);
    if (value[1] === "x") return sign * parseInt(value.slice(2), 16);
    if (value[1] === "o") return sign * parseInt(value.slice(2), 8);
  }
  return sign * parseInt(value, 10);
}
function isInteger(object) {
  return Object.prototype.toString.call(object) === "[object Number]" && object % 1 === 0 && !common.isNegativeZero(object);
}
var int = new type("tag:yaml.org,2002:int", {
  kind: "scalar",
  resolve: resolveYamlInteger,
  construct: constructYamlInteger,
  predicate: isInteger,
  represent: {
    binary: function(obj) {
      return obj >= 0 ? "0b" + obj.toString(2) : "-0b" + obj.toString(2).slice(1);
    },
    octal: function(obj) {
      return obj >= 0 ? "0o" + obj.toString(8) : "-0o" + obj.toString(8).slice(1);
    },
    decimal: function(obj) {
      return obj.toString(10);
    },
    /* eslint-disable max-len */
    hexadecimal: function(obj) {
      return obj >= 0 ? "0x" + obj.toString(16).toUpperCase() : "-0x" + obj.toString(16).toUpperCase().slice(1);
    }
  },
  defaultStyle: "decimal",
  styleAliases: {
    binary: [2, "bin"],
    octal: [8, "oct"],
    decimal: [10, "dec"],
    hexadecimal: [16, "hex"]
  }
});
var YAML_FLOAT_PATTERN = new RegExp(
  // 2.5e4, 2.5 and integers
  "^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
);
function resolveYamlFloat(data) {
  if (data === null) return false;
  if (!YAML_FLOAT_PATTERN.test(data) || // Quick hack to not allow integers end with `_`
  // Probably should update regexp & check speed
  data[data.length - 1] === "_") {
    return false;
  }
  return true;
}
function constructYamlFloat(data) {
  var value, sign;
  value = data.replace(/_/g, "").toLowerCase();
  sign = value[0] === "-" ? -1 : 1;
  if ("+-".indexOf(value[0]) >= 0) {
    value = value.slice(1);
  }
  if (value === ".inf") {
    return sign === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
  } else if (value === ".nan") {
    return NaN;
  }
  return sign * parseFloat(value, 10);
}
var SCIENTIFIC_WITHOUT_DOT = /^[-+]?[0-9]+e/;
function representYamlFloat(object, style) {
  var res;
  if (isNaN(object)) {
    switch (style) {
      case "lowercase":
        return ".nan";
      case "uppercase":
        return ".NAN";
      case "camelcase":
        return ".NaN";
    }
  } else if (Number.POSITIVE_INFINITY === object) {
    switch (style) {
      case "lowercase":
        return ".inf";
      case "uppercase":
        return ".INF";
      case "camelcase":
        return ".Inf";
    }
  } else if (Number.NEGATIVE_INFINITY === object) {
    switch (style) {
      case "lowercase":
        return "-.inf";
      case "uppercase":
        return "-.INF";
      case "camelcase":
        return "-.Inf";
    }
  } else if (common.isNegativeZero(object)) {
    return "-0.0";
  }
  res = object.toString(10);
  return SCIENTIFIC_WITHOUT_DOT.test(res) ? res.replace("e", ".e") : res;
}
function isFloat(object) {
  return Object.prototype.toString.call(object) === "[object Number]" && (object % 1 !== 0 || common.isNegativeZero(object));
}
var float = new type("tag:yaml.org,2002:float", {
  kind: "scalar",
  resolve: resolveYamlFloat,
  construct: constructYamlFloat,
  predicate: isFloat,
  represent: representYamlFloat,
  defaultStyle: "lowercase"
});
var json = failsafe.extend({
  implicit: [_null, bool, int, float]
});
var core = json;
var YAML_DATE_REGEXP = new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$");
var YAML_TIMESTAMP_REGEXP = new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$");
function resolveYamlTimestamp(data) {
  if (data === null) return false;
  if (YAML_DATE_REGEXP.exec(data) !== null) return true;
  if (YAML_TIMESTAMP_REGEXP.exec(data) !== null) return true;
  return false;
}
function constructYamlTimestamp(data) {
  var match, year, month, day, hour, minute, second, fraction = 0, delta = null, tz_hour, tz_minute, date;
  match = YAML_DATE_REGEXP.exec(data);
  if (match === null) match = YAML_TIMESTAMP_REGEXP.exec(data);
  if (match === null) throw new Error("Date resolve error");
  year = +match[1];
  month = +match[2] - 1;
  day = +match[3];
  if (!match[4]) {
    return new Date(Date.UTC(year, month, day));
  }
  hour = +match[4];
  minute = +match[5];
  second = +match[6];
  if (match[7]) {
    fraction = match[7].slice(0, 3);
    while (fraction.length < 3) {
      fraction += "0";
    }
    fraction = +fraction;
  }
  if (match[9]) {
    tz_hour = +match[10];
    tz_minute = +(match[11] || 0);
    delta = (tz_hour * 60 + tz_minute) * 6e4;
    if (match[9] === "-") delta = -delta;
  }
  date = new Date(Date.UTC(year, month, day, hour, minute, second, fraction));
  if (delta) date.setTime(date.getTime() - delta);
  return date;
}
function representYamlTimestamp(object) {
  return object.toISOString();
}
var timestamp = new type("tag:yaml.org,2002:timestamp", {
  kind: "scalar",
  resolve: resolveYamlTimestamp,
  construct: constructYamlTimestamp,
  instanceOf: Date,
  represent: representYamlTimestamp
});
function resolveYamlMerge(data) {
  return data === "<<" || data === null;
}
var merge = new type("tag:yaml.org,2002:merge", {
  kind: "scalar",
  resolve: resolveYamlMerge
});
var BASE64_MAP = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r";
function resolveYamlBinary(data) {
  if (data === null) return false;
  var code, idx, bitlen = 0, max = data.length, map2 = BASE64_MAP;
  for (idx = 0; idx < max; idx++) {
    code = map2.indexOf(data.charAt(idx));
    if (code > 64) continue;
    if (code < 0) return false;
    bitlen += 6;
  }
  return bitlen % 8 === 0;
}
function constructYamlBinary(data) {
  var idx, tailbits, input = data.replace(/[\r\n=]/g, ""), max = input.length, map2 = BASE64_MAP, bits = 0, result = [];
  for (idx = 0; idx < max; idx++) {
    if (idx % 4 === 0 && idx) {
      result.push(bits >> 16 & 255);
      result.push(bits >> 8 & 255);
      result.push(bits & 255);
    }
    bits = bits << 6 | map2.indexOf(input.charAt(idx));
  }
  tailbits = max % 4 * 6;
  if (tailbits === 0) {
    result.push(bits >> 16 & 255);
    result.push(bits >> 8 & 255);
    result.push(bits & 255);
  } else if (tailbits === 18) {
    result.push(bits >> 10 & 255);
    result.push(bits >> 2 & 255);
  } else if (tailbits === 12) {
    result.push(bits >> 4 & 255);
  }
  return new Uint8Array(result);
}
function representYamlBinary(object) {
  var result = "", bits = 0, idx, tail, max = object.length, map2 = BASE64_MAP;
  for (idx = 0; idx < max; idx++) {
    if (idx % 3 === 0 && idx) {
      result += map2[bits >> 18 & 63];
      result += map2[bits >> 12 & 63];
      result += map2[bits >> 6 & 63];
      result += map2[bits & 63];
    }
    bits = (bits << 8) + object[idx];
  }
  tail = max % 3;
  if (tail === 0) {
    result += map2[bits >> 18 & 63];
    result += map2[bits >> 12 & 63];
    result += map2[bits >> 6 & 63];
    result += map2[bits & 63];
  } else if (tail === 2) {
    result += map2[bits >> 10 & 63];
    result += map2[bits >> 4 & 63];
    result += map2[bits << 2 & 63];
    result += map2[64];
  } else if (tail === 1) {
    result += map2[bits >> 2 & 63];
    result += map2[bits << 4 & 63];
    result += map2[64];
    result += map2[64];
  }
  return result;
}
function isBinary(obj) {
  return Object.prototype.toString.call(obj) === "[object Uint8Array]";
}
var binary = new type("tag:yaml.org,2002:binary", {
  kind: "scalar",
  resolve: resolveYamlBinary,
  construct: constructYamlBinary,
  predicate: isBinary,
  represent: representYamlBinary
});
var _hasOwnProperty$3 = Object.prototype.hasOwnProperty;
var _toString$2 = Object.prototype.toString;
function resolveYamlOmap(data) {
  if (data === null) return true;
  var objectKeys = [], index, length, pair, pairKey, pairHasKey, object = data;
  for (index = 0, length = object.length; index < length; index += 1) {
    pair = object[index];
    pairHasKey = false;
    if (_toString$2.call(pair) !== "[object Object]") return false;
    for (pairKey in pair) {
      if (_hasOwnProperty$3.call(pair, pairKey)) {
        if (!pairHasKey) pairHasKey = true;
        else return false;
      }
    }
    if (!pairHasKey) return false;
    if (objectKeys.indexOf(pairKey) === -1) objectKeys.push(pairKey);
    else return false;
  }
  return true;
}
function constructYamlOmap(data) {
  return data !== null ? data : [];
}
var omap = new type("tag:yaml.org,2002:omap", {
  kind: "sequence",
  resolve: resolveYamlOmap,
  construct: constructYamlOmap
});
var _toString$1 = Object.prototype.toString;
function resolveYamlPairs(data) {
  if (data === null) return true;
  var index, length, pair, keys, result, object = data;
  result = new Array(object.length);
  for (index = 0, length = object.length; index < length; index += 1) {
    pair = object[index];
    if (_toString$1.call(pair) !== "[object Object]") return false;
    keys = Object.keys(pair);
    if (keys.length !== 1) return false;
    result[index] = [keys[0], pair[keys[0]]];
  }
  return true;
}
function constructYamlPairs(data) {
  if (data === null) return [];
  var index, length, pair, keys, result, object = data;
  result = new Array(object.length);
  for (index = 0, length = object.length; index < length; index += 1) {
    pair = object[index];
    keys = Object.keys(pair);
    result[index] = [keys[0], pair[keys[0]]];
  }
  return result;
}
var pairs = new type("tag:yaml.org,2002:pairs", {
  kind: "sequence",
  resolve: resolveYamlPairs,
  construct: constructYamlPairs
});
var _hasOwnProperty$2 = Object.prototype.hasOwnProperty;
function resolveYamlSet(data) {
  if (data === null) return true;
  var key, object = data;
  for (key in object) {
    if (_hasOwnProperty$2.call(object, key)) {
      if (object[key] !== null) return false;
    }
  }
  return true;
}
function constructYamlSet(data) {
  return data !== null ? data : {};
}
var set = new type("tag:yaml.org,2002:set", {
  kind: "mapping",
  resolve: resolveYamlSet,
  construct: constructYamlSet
});
var _default = core.extend({
  implicit: [timestamp, merge],
  explicit: [binary, omap, pairs, set]
});
var _hasOwnProperty$1 = Object.prototype.hasOwnProperty;
var CONTEXT_FLOW_IN = 1;
var CONTEXT_FLOW_OUT = 2;
var CONTEXT_BLOCK_IN = 3;
var CONTEXT_BLOCK_OUT = 4;
var CHOMPING_CLIP = 1;
var CHOMPING_STRIP = 2;
var CHOMPING_KEEP = 3;
var PATTERN_NON_PRINTABLE = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
var PATTERN_NON_ASCII_LINE_BREAKS = /[\x85\u2028\u2029]/;
var PATTERN_FLOW_INDICATORS = /[,\[\]\{\}]/;
var PATTERN_TAG_HANDLE = /^(?:!|!!|![a-z\-]+!)$/i;
var PATTERN_TAG_URI = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
function _class(obj) {
  return Object.prototype.toString.call(obj);
}
function is_EOL(c) {
  return c === 10 || c === 13;
}
function is_WHITE_SPACE(c) {
  return c === 9 || c === 32;
}
function is_WS_OR_EOL(c) {
  return c === 9 || c === 32 || c === 10 || c === 13;
}
function is_FLOW_INDICATOR(c) {
  return c === 44 || c === 91 || c === 93 || c === 123 || c === 125;
}
function fromHexCode(c) {
  var lc;
  if (48 <= c && c <= 57) {
    return c - 48;
  }
  lc = c | 32;
  if (97 <= lc && lc <= 102) {
    return lc - 97 + 10;
  }
  return -1;
}
function escapedHexLen(c) {
  if (c === 120) {
    return 2;
  }
  if (c === 117) {
    return 4;
  }
  if (c === 85) {
    return 8;
  }
  return 0;
}
function fromDecimalCode(c) {
  if (48 <= c && c <= 57) {
    return c - 48;
  }
  return -1;
}
function simpleEscapeSequence(c) {
  return c === 48 ? "\0" : c === 97 ? "\x07" : c === 98 ? "\b" : c === 116 ? "	" : c === 9 ? "	" : c === 110 ? "\n" : c === 118 ? "\v" : c === 102 ? "\f" : c === 114 ? "\r" : c === 101 ? "\x1B" : c === 32 ? " " : c === 34 ? '"' : c === 47 ? "/" : c === 92 ? "\\" : c === 78 ? "" : c === 95 ? " " : c === 76 ? "\u2028" : c === 80 ? "\u2029" : "";
}
function charFromCodepoint(c) {
  if (c <= 65535) {
    return String.fromCharCode(c);
  }
  return String.fromCharCode((c - 65536 >> 10) + 55296, (c - 65536 & 1023) + 56320);
}
var simpleEscapeCheck = new Array(256);
var simpleEscapeMap = new Array(256);
for (i = 0; i < 256; i++) {
  simpleEscapeCheck[i] = simpleEscapeSequence(i) ? 1 : 0;
  simpleEscapeMap[i] = simpleEscapeSequence(i);
}
var i;
function State$1(input, options) {
  this.input = input;
  this.filename = options["filename"] || null;
  this.schema = options["schema"] || _default;
  this.onWarning = options["onWarning"] || null;
  this.legacy = options["legacy"] || false;
  this.json = options["json"] || false;
  this.listener = options["listener"] || null;
  this.implicitTypes = this.schema.compiledImplicit;
  this.typeMap = this.schema.compiledTypeMap;
  this.length = input.length;
  this.position = 0;
  this.line = 0;
  this.lineStart = 0;
  this.lineIndent = 0;
  this.firstTabInLine = -1;
  this.documents = [];
}
function generateError(state, message) {
  var mark = {
    name: state.filename,
    buffer: state.input.slice(0, -1),
    // omit trailing \0
    position: state.position,
    line: state.line,
    column: state.position - state.lineStart
  };
  mark.snippet = snippet(mark);
  return new exception(message, mark);
}
function throwError(state, message) {
  throw generateError(state, message);
}
function throwWarning(state, message) {
  if (state.onWarning) {
    state.onWarning.call(null, generateError(state, message));
  }
}
var directiveHandlers = {
  YAML: function handleYamlDirective(state, name, args) {
    var match, major, minor;
    if (state.version !== null) {
      throwError(state, "duplication of %YAML directive");
    }
    if (args.length !== 1) {
      throwError(state, "YAML directive accepts exactly one argument");
    }
    match = /^([0-9]+)\.([0-9]+)$/.exec(args[0]);
    if (match === null) {
      throwError(state, "ill-formed argument of the YAML directive");
    }
    major = parseInt(match[1], 10);
    minor = parseInt(match[2], 10);
    if (major !== 1) {
      throwError(state, "unacceptable YAML version of the document");
    }
    state.version = args[0];
    state.checkLineBreaks = minor < 2;
    if (minor !== 1 && minor !== 2) {
      throwWarning(state, "unsupported YAML version of the document");
    }
  },
  TAG: function handleTagDirective(state, name, args) {
    var handle, prefix;
    if (args.length !== 2) {
      throwError(state, "TAG directive accepts exactly two arguments");
    }
    handle = args[0];
    prefix = args[1];
    if (!PATTERN_TAG_HANDLE.test(handle)) {
      throwError(state, "ill-formed tag handle (first argument) of the TAG directive");
    }
    if (_hasOwnProperty$1.call(state.tagMap, handle)) {
      throwError(state, 'there is a previously declared suffix for "' + handle + '" tag handle');
    }
    if (!PATTERN_TAG_URI.test(prefix)) {
      throwError(state, "ill-formed tag prefix (second argument) of the TAG directive");
    }
    try {
      prefix = decodeURIComponent(prefix);
    } catch (err) {
      throwError(state, "tag prefix is malformed: " + prefix);
    }
    state.tagMap[handle] = prefix;
  }
};
function captureSegment(state, start, end, checkJson) {
  var _position, _length, _character, _result;
  if (start < end) {
    _result = state.input.slice(start, end);
    if (checkJson) {
      for (_position = 0, _length = _result.length; _position < _length; _position += 1) {
        _character = _result.charCodeAt(_position);
        if (!(_character === 9 || 32 <= _character && _character <= 1114111)) {
          throwError(state, "expected valid JSON character");
        }
      }
    } else if (PATTERN_NON_PRINTABLE.test(_result)) {
      throwError(state, "the stream contains non-printable characters");
    }
    state.result += _result;
  }
}
function mergeMappings(state, destination, source, overridableKeys) {
  var sourceKeys, key, index, quantity;
  if (!common.isObject(source)) {
    throwError(state, "cannot merge mappings; the provided source object is unacceptable");
  }
  sourceKeys = Object.keys(source);
  for (index = 0, quantity = sourceKeys.length; index < quantity; index += 1) {
    key = sourceKeys[index];
    if (!_hasOwnProperty$1.call(destination, key)) {
      destination[key] = source[key];
      overridableKeys[key] = true;
    }
  }
}
function storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, startLine, startLineStart, startPos) {
  var index, quantity;
  if (Array.isArray(keyNode)) {
    keyNode = Array.prototype.slice.call(keyNode);
    for (index = 0, quantity = keyNode.length; index < quantity; index += 1) {
      if (Array.isArray(keyNode[index])) {
        throwError(state, "nested arrays are not supported inside keys");
      }
      if (typeof keyNode === "object" && _class(keyNode[index]) === "[object Object]") {
        keyNode[index] = "[object Object]";
      }
    }
  }
  if (typeof keyNode === "object" && _class(keyNode) === "[object Object]") {
    keyNode = "[object Object]";
  }
  keyNode = String(keyNode);
  if (_result === null) {
    _result = {};
  }
  if (keyTag === "tag:yaml.org,2002:merge") {
    if (Array.isArray(valueNode)) {
      for (index = 0, quantity = valueNode.length; index < quantity; index += 1) {
        mergeMappings(state, _result, valueNode[index], overridableKeys);
      }
    } else {
      mergeMappings(state, _result, valueNode, overridableKeys);
    }
  } else {
    if (!state.json && !_hasOwnProperty$1.call(overridableKeys, keyNode) && _hasOwnProperty$1.call(_result, keyNode)) {
      state.line = startLine || state.line;
      state.lineStart = startLineStart || state.lineStart;
      state.position = startPos || state.position;
      throwError(state, "duplicated mapping key");
    }
    if (keyNode === "__proto__") {
      Object.defineProperty(_result, keyNode, {
        configurable: true,
        enumerable: true,
        writable: true,
        value: valueNode
      });
    } else {
      _result[keyNode] = valueNode;
    }
    delete overridableKeys[keyNode];
  }
  return _result;
}
function readLineBreak(state) {
  var ch;
  ch = state.input.charCodeAt(state.position);
  if (ch === 10) {
    state.position++;
  } else if (ch === 13) {
    state.position++;
    if (state.input.charCodeAt(state.position) === 10) {
      state.position++;
    }
  } else {
    throwError(state, "a line break is expected");
  }
  state.line += 1;
  state.lineStart = state.position;
  state.firstTabInLine = -1;
}
function skipSeparationSpace(state, allowComments, checkIndent) {
  var lineBreaks = 0, ch = state.input.charCodeAt(state.position);
  while (ch !== 0) {
    while (is_WHITE_SPACE(ch)) {
      if (ch === 9 && state.firstTabInLine === -1) {
        state.firstTabInLine = state.position;
      }
      ch = state.input.charCodeAt(++state.position);
    }
    if (allowComments && ch === 35) {
      do {
        ch = state.input.charCodeAt(++state.position);
      } while (ch !== 10 && ch !== 13 && ch !== 0);
    }
    if (is_EOL(ch)) {
      readLineBreak(state);
      ch = state.input.charCodeAt(state.position);
      lineBreaks++;
      state.lineIndent = 0;
      while (ch === 32) {
        state.lineIndent++;
        ch = state.input.charCodeAt(++state.position);
      }
    } else {
      break;
    }
  }
  if (checkIndent !== -1 && lineBreaks !== 0 && state.lineIndent < checkIndent) {
    throwWarning(state, "deficient indentation");
  }
  return lineBreaks;
}
function testDocumentSeparator(state) {
  var _position = state.position, ch;
  ch = state.input.charCodeAt(_position);
  if ((ch === 45 || ch === 46) && ch === state.input.charCodeAt(_position + 1) && ch === state.input.charCodeAt(_position + 2)) {
    _position += 3;
    ch = state.input.charCodeAt(_position);
    if (ch === 0 || is_WS_OR_EOL(ch)) {
      return true;
    }
  }
  return false;
}
function writeFoldedLines(state, count) {
  if (count === 1) {
    state.result += " ";
  } else if (count > 1) {
    state.result += common.repeat("\n", count - 1);
  }
}
function readPlainScalar(state, nodeIndent, withinFlowCollection) {
  var preceding, following, captureStart, captureEnd, hasPendingContent, _line, _lineStart, _lineIndent, _kind = state.kind, _result = state.result, ch;
  ch = state.input.charCodeAt(state.position);
  if (is_WS_OR_EOL(ch) || is_FLOW_INDICATOR(ch) || ch === 35 || ch === 38 || ch === 42 || ch === 33 || ch === 124 || ch === 62 || ch === 39 || ch === 34 || ch === 37 || ch === 64 || ch === 96) {
    return false;
  }
  if (ch === 63 || ch === 45) {
    following = state.input.charCodeAt(state.position + 1);
    if (is_WS_OR_EOL(following) || withinFlowCollection && is_FLOW_INDICATOR(following)) {
      return false;
    }
  }
  state.kind = "scalar";
  state.result = "";
  captureStart = captureEnd = state.position;
  hasPendingContent = false;
  while (ch !== 0) {
    if (ch === 58) {
      following = state.input.charCodeAt(state.position + 1);
      if (is_WS_OR_EOL(following) || withinFlowCollection && is_FLOW_INDICATOR(following)) {
        break;
      }
    } else if (ch === 35) {
      preceding = state.input.charCodeAt(state.position - 1);
      if (is_WS_OR_EOL(preceding)) {
        break;
      }
    } else if (state.position === state.lineStart && testDocumentSeparator(state) || withinFlowCollection && is_FLOW_INDICATOR(ch)) {
      break;
    } else if (is_EOL(ch)) {
      _line = state.line;
      _lineStart = state.lineStart;
      _lineIndent = state.lineIndent;
      skipSeparationSpace(state, false, -1);
      if (state.lineIndent >= nodeIndent) {
        hasPendingContent = true;
        ch = state.input.charCodeAt(state.position);
        continue;
      } else {
        state.position = captureEnd;
        state.line = _line;
        state.lineStart = _lineStart;
        state.lineIndent = _lineIndent;
        break;
      }
    }
    if (hasPendingContent) {
      captureSegment(state, captureStart, captureEnd, false);
      writeFoldedLines(state, state.line - _line);
      captureStart = captureEnd = state.position;
      hasPendingContent = false;
    }
    if (!is_WHITE_SPACE(ch)) {
      captureEnd = state.position + 1;
    }
    ch = state.input.charCodeAt(++state.position);
  }
  captureSegment(state, captureStart, captureEnd, false);
  if (state.result) {
    return true;
  }
  state.kind = _kind;
  state.result = _result;
  return false;
}
function readSingleQuotedScalar(state, nodeIndent) {
  var ch, captureStart, captureEnd;
  ch = state.input.charCodeAt(state.position);
  if (ch !== 39) {
    return false;
  }
  state.kind = "scalar";
  state.result = "";
  state.position++;
  captureStart = captureEnd = state.position;
  while ((ch = state.input.charCodeAt(state.position)) !== 0) {
    if (ch === 39) {
      captureSegment(state, captureStart, state.position, true);
      ch = state.input.charCodeAt(++state.position);
      if (ch === 39) {
        captureStart = state.position;
        state.position++;
        captureEnd = state.position;
      } else {
        return true;
      }
    } else if (is_EOL(ch)) {
      captureSegment(state, captureStart, captureEnd, true);
      writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
      captureStart = captureEnd = state.position;
    } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
      throwError(state, "unexpected end of the document within a single quoted scalar");
    } else {
      state.position++;
      captureEnd = state.position;
    }
  }
  throwError(state, "unexpected end of the stream within a single quoted scalar");
}
function readDoubleQuotedScalar(state, nodeIndent) {
  var captureStart, captureEnd, hexLength, hexResult, tmp, ch;
  ch = state.input.charCodeAt(state.position);
  if (ch !== 34) {
    return false;
  }
  state.kind = "scalar";
  state.result = "";
  state.position++;
  captureStart = captureEnd = state.position;
  while ((ch = state.input.charCodeAt(state.position)) !== 0) {
    if (ch === 34) {
      captureSegment(state, captureStart, state.position, true);
      state.position++;
      return true;
    } else if (ch === 92) {
      captureSegment(state, captureStart, state.position, true);
      ch = state.input.charCodeAt(++state.position);
      if (is_EOL(ch)) {
        skipSeparationSpace(state, false, nodeIndent);
      } else if (ch < 256 && simpleEscapeCheck[ch]) {
        state.result += simpleEscapeMap[ch];
        state.position++;
      } else if ((tmp = escapedHexLen(ch)) > 0) {
        hexLength = tmp;
        hexResult = 0;
        for (; hexLength > 0; hexLength--) {
          ch = state.input.charCodeAt(++state.position);
          if ((tmp = fromHexCode(ch)) >= 0) {
            hexResult = (hexResult << 4) + tmp;
          } else {
            throwError(state, "expected hexadecimal character");
          }
        }
        state.result += charFromCodepoint(hexResult);
        state.position++;
      } else {
        throwError(state, "unknown escape sequence");
      }
      captureStart = captureEnd = state.position;
    } else if (is_EOL(ch)) {
      captureSegment(state, captureStart, captureEnd, true);
      writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
      captureStart = captureEnd = state.position;
    } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
      throwError(state, "unexpected end of the document within a double quoted scalar");
    } else {
      state.position++;
      captureEnd = state.position;
    }
  }
  throwError(state, "unexpected end of the stream within a double quoted scalar");
}
function readFlowCollection(state, nodeIndent) {
  var readNext = true, _line, _lineStart, _pos, _tag = state.tag, _result, _anchor = state.anchor, following, terminator, isPair, isExplicitPair, isMapping, overridableKeys = /* @__PURE__ */ Object.create(null), keyNode, keyTag, valueNode, ch;
  ch = state.input.charCodeAt(state.position);
  if (ch === 91) {
    terminator = 93;
    isMapping = false;
    _result = [];
  } else if (ch === 123) {
    terminator = 125;
    isMapping = true;
    _result = {};
  } else {
    return false;
  }
  if (state.anchor !== null) {
    state.anchorMap[state.anchor] = _result;
  }
  ch = state.input.charCodeAt(++state.position);
  while (ch !== 0) {
    skipSeparationSpace(state, true, nodeIndent);
    ch = state.input.charCodeAt(state.position);
    if (ch === terminator) {
      state.position++;
      state.tag = _tag;
      state.anchor = _anchor;
      state.kind = isMapping ? "mapping" : "sequence";
      state.result = _result;
      return true;
    } else if (!readNext) {
      throwError(state, "missed comma between flow collection entries");
    } else if (ch === 44) {
      throwError(state, "expected the node content, but found ','");
    }
    keyTag = keyNode = valueNode = null;
    isPair = isExplicitPair = false;
    if (ch === 63) {
      following = state.input.charCodeAt(state.position + 1);
      if (is_WS_OR_EOL(following)) {
        isPair = isExplicitPair = true;
        state.position++;
        skipSeparationSpace(state, true, nodeIndent);
      }
    }
    _line = state.line;
    _lineStart = state.lineStart;
    _pos = state.position;
    composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
    keyTag = state.tag;
    keyNode = state.result;
    skipSeparationSpace(state, true, nodeIndent);
    ch = state.input.charCodeAt(state.position);
    if ((isExplicitPair || state.line === _line) && ch === 58) {
      isPair = true;
      ch = state.input.charCodeAt(++state.position);
      skipSeparationSpace(state, true, nodeIndent);
      composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
      valueNode = state.result;
    }
    if (isMapping) {
      storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, _line, _lineStart, _pos);
    } else if (isPair) {
      _result.push(storeMappingPair(state, null, overridableKeys, keyTag, keyNode, valueNode, _line, _lineStart, _pos));
    } else {
      _result.push(keyNode);
    }
    skipSeparationSpace(state, true, nodeIndent);
    ch = state.input.charCodeAt(state.position);
    if (ch === 44) {
      readNext = true;
      ch = state.input.charCodeAt(++state.position);
    } else {
      readNext = false;
    }
  }
  throwError(state, "unexpected end of the stream within a flow collection");
}
function readBlockScalar(state, nodeIndent) {
  var captureStart, folding, chomping = CHOMPING_CLIP, didReadContent = false, detectedIndent = false, textIndent = nodeIndent, emptyLines = 0, atMoreIndented = false, tmp, ch;
  ch = state.input.charCodeAt(state.position);
  if (ch === 124) {
    folding = false;
  } else if (ch === 62) {
    folding = true;
  } else {
    return false;
  }
  state.kind = "scalar";
  state.result = "";
  while (ch !== 0) {
    ch = state.input.charCodeAt(++state.position);
    if (ch === 43 || ch === 45) {
      if (CHOMPING_CLIP === chomping) {
        chomping = ch === 43 ? CHOMPING_KEEP : CHOMPING_STRIP;
      } else {
        throwError(state, "repeat of a chomping mode identifier");
      }
    } else if ((tmp = fromDecimalCode(ch)) >= 0) {
      if (tmp === 0) {
        throwError(state, "bad explicit indentation width of a block scalar; it cannot be less than one");
      } else if (!detectedIndent) {
        textIndent = nodeIndent + tmp - 1;
        detectedIndent = true;
      } else {
        throwError(state, "repeat of an indentation width identifier");
      }
    } else {
      break;
    }
  }
  if (is_WHITE_SPACE(ch)) {
    do {
      ch = state.input.charCodeAt(++state.position);
    } while (is_WHITE_SPACE(ch));
    if (ch === 35) {
      do {
        ch = state.input.charCodeAt(++state.position);
      } while (!is_EOL(ch) && ch !== 0);
    }
  }
  while (ch !== 0) {
    readLineBreak(state);
    state.lineIndent = 0;
    ch = state.input.charCodeAt(state.position);
    while ((!detectedIndent || state.lineIndent < textIndent) && ch === 32) {
      state.lineIndent++;
      ch = state.input.charCodeAt(++state.position);
    }
    if (!detectedIndent && state.lineIndent > textIndent) {
      textIndent = state.lineIndent;
    }
    if (is_EOL(ch)) {
      emptyLines++;
      continue;
    }
    if (state.lineIndent < textIndent) {
      if (chomping === CHOMPING_KEEP) {
        state.result += common.repeat("\n", didReadContent ? 1 + emptyLines : emptyLines);
      } else if (chomping === CHOMPING_CLIP) {
        if (didReadContent) {
          state.result += "\n";
        }
      }
      break;
    }
    if (folding) {
      if (is_WHITE_SPACE(ch)) {
        atMoreIndented = true;
        state.result += common.repeat("\n", didReadContent ? 1 + emptyLines : emptyLines);
      } else if (atMoreIndented) {
        atMoreIndented = false;
        state.result += common.repeat("\n", emptyLines + 1);
      } else if (emptyLines === 0) {
        if (didReadContent) {
          state.result += " ";
        }
      } else {
        state.result += common.repeat("\n", emptyLines);
      }
    } else {
      state.result += common.repeat("\n", didReadContent ? 1 + emptyLines : emptyLines);
    }
    didReadContent = true;
    detectedIndent = true;
    emptyLines = 0;
    captureStart = state.position;
    while (!is_EOL(ch) && ch !== 0) {
      ch = state.input.charCodeAt(++state.position);
    }
    captureSegment(state, captureStart, state.position, false);
  }
  return true;
}
function readBlockSequence(state, nodeIndent) {
  var _line, _tag = state.tag, _anchor = state.anchor, _result = [], following, detected = false, ch;
  if (state.firstTabInLine !== -1) return false;
  if (state.anchor !== null) {
    state.anchorMap[state.anchor] = _result;
  }
  ch = state.input.charCodeAt(state.position);
  while (ch !== 0) {
    if (state.firstTabInLine !== -1) {
      state.position = state.firstTabInLine;
      throwError(state, "tab characters must not be used in indentation");
    }
    if (ch !== 45) {
      break;
    }
    following = state.input.charCodeAt(state.position + 1);
    if (!is_WS_OR_EOL(following)) {
      break;
    }
    detected = true;
    state.position++;
    if (skipSeparationSpace(state, true, -1)) {
      if (state.lineIndent <= nodeIndent) {
        _result.push(null);
        ch = state.input.charCodeAt(state.position);
        continue;
      }
    }
    _line = state.line;
    composeNode(state, nodeIndent, CONTEXT_BLOCK_IN, false, true);
    _result.push(state.result);
    skipSeparationSpace(state, true, -1);
    ch = state.input.charCodeAt(state.position);
    if ((state.line === _line || state.lineIndent > nodeIndent) && ch !== 0) {
      throwError(state, "bad indentation of a sequence entry");
    } else if (state.lineIndent < nodeIndent) {
      break;
    }
  }
  if (detected) {
    state.tag = _tag;
    state.anchor = _anchor;
    state.kind = "sequence";
    state.result = _result;
    return true;
  }
  return false;
}
function readBlockMapping(state, nodeIndent, flowIndent) {
  var following, allowCompact, _line, _keyLine, _keyLineStart, _keyPos, _tag = state.tag, _anchor = state.anchor, _result = {}, overridableKeys = /* @__PURE__ */ Object.create(null), keyTag = null, keyNode = null, valueNode = null, atExplicitKey = false, detected = false, ch;
  if (state.firstTabInLine !== -1) return false;
  if (state.anchor !== null) {
    state.anchorMap[state.anchor] = _result;
  }
  ch = state.input.charCodeAt(state.position);
  while (ch !== 0) {
    if (!atExplicitKey && state.firstTabInLine !== -1) {
      state.position = state.firstTabInLine;
      throwError(state, "tab characters must not be used in indentation");
    }
    following = state.input.charCodeAt(state.position + 1);
    _line = state.line;
    if ((ch === 63 || ch === 58) && is_WS_OR_EOL(following)) {
      if (ch === 63) {
        if (atExplicitKey) {
          storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
          keyTag = keyNode = valueNode = null;
        }
        detected = true;
        atExplicitKey = true;
        allowCompact = true;
      } else if (atExplicitKey) {
        atExplicitKey = false;
        allowCompact = true;
      } else {
        throwError(state, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line");
      }
      state.position += 1;
      ch = following;
    } else {
      _keyLine = state.line;
      _keyLineStart = state.lineStart;
      _keyPos = state.position;
      if (!composeNode(state, flowIndent, CONTEXT_FLOW_OUT, false, true)) {
        break;
      }
      if (state.line === _line) {
        ch = state.input.charCodeAt(state.position);
        while (is_WHITE_SPACE(ch)) {
          ch = state.input.charCodeAt(++state.position);
        }
        if (ch === 58) {
          ch = state.input.charCodeAt(++state.position);
          if (!is_WS_OR_EOL(ch)) {
            throwError(state, "a whitespace character is expected after the key-value separator within a block mapping");
          }
          if (atExplicitKey) {
            storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
            keyTag = keyNode = valueNode = null;
          }
          detected = true;
          atExplicitKey = false;
          allowCompact = false;
          keyTag = state.tag;
          keyNode = state.result;
        } else if (detected) {
          throwError(state, "can not read an implicit mapping pair; a colon is missed");
        } else {
          state.tag = _tag;
          state.anchor = _anchor;
          return true;
        }
      } else if (detected) {
        throwError(state, "can not read a block mapping entry; a multiline key may not be an implicit key");
      } else {
        state.tag = _tag;
        state.anchor = _anchor;
        return true;
      }
    }
    if (state.line === _line || state.lineIndent > nodeIndent) {
      if (atExplicitKey) {
        _keyLine = state.line;
        _keyLineStart = state.lineStart;
        _keyPos = state.position;
      }
      if (composeNode(state, nodeIndent, CONTEXT_BLOCK_OUT, true, allowCompact)) {
        if (atExplicitKey) {
          keyNode = state.result;
        } else {
          valueNode = state.result;
        }
      }
      if (!atExplicitKey) {
        storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, _keyLine, _keyLineStart, _keyPos);
        keyTag = keyNode = valueNode = null;
      }
      skipSeparationSpace(state, true, -1);
      ch = state.input.charCodeAt(state.position);
    }
    if ((state.line === _line || state.lineIndent > nodeIndent) && ch !== 0) {
      throwError(state, "bad indentation of a mapping entry");
    } else if (state.lineIndent < nodeIndent) {
      break;
    }
  }
  if (atExplicitKey) {
    storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
  }
  if (detected) {
    state.tag = _tag;
    state.anchor = _anchor;
    state.kind = "mapping";
    state.result = _result;
  }
  return detected;
}
function readTagProperty(state) {
  var _position, isVerbatim = false, isNamed = false, tagHandle, tagName, ch;
  ch = state.input.charCodeAt(state.position);
  if (ch !== 33) return false;
  if (state.tag !== null) {
    throwError(state, "duplication of a tag property");
  }
  ch = state.input.charCodeAt(++state.position);
  if (ch === 60) {
    isVerbatim = true;
    ch = state.input.charCodeAt(++state.position);
  } else if (ch === 33) {
    isNamed = true;
    tagHandle = "!!";
    ch = state.input.charCodeAt(++state.position);
  } else {
    tagHandle = "!";
  }
  _position = state.position;
  if (isVerbatim) {
    do {
      ch = state.input.charCodeAt(++state.position);
    } while (ch !== 0 && ch !== 62);
    if (state.position < state.length) {
      tagName = state.input.slice(_position, state.position);
      ch = state.input.charCodeAt(++state.position);
    } else {
      throwError(state, "unexpected end of the stream within a verbatim tag");
    }
  } else {
    while (ch !== 0 && !is_WS_OR_EOL(ch)) {
      if (ch === 33) {
        if (!isNamed) {
          tagHandle = state.input.slice(_position - 1, state.position + 1);
          if (!PATTERN_TAG_HANDLE.test(tagHandle)) {
            throwError(state, "named tag handle cannot contain such characters");
          }
          isNamed = true;
          _position = state.position + 1;
        } else {
          throwError(state, "tag suffix cannot contain exclamation marks");
        }
      }
      ch = state.input.charCodeAt(++state.position);
    }
    tagName = state.input.slice(_position, state.position);
    if (PATTERN_FLOW_INDICATORS.test(tagName)) {
      throwError(state, "tag suffix cannot contain flow indicator characters");
    }
  }
  if (tagName && !PATTERN_TAG_URI.test(tagName)) {
    throwError(state, "tag name cannot contain such characters: " + tagName);
  }
  try {
    tagName = decodeURIComponent(tagName);
  } catch (err) {
    throwError(state, "tag name is malformed: " + tagName);
  }
  if (isVerbatim) {
    state.tag = tagName;
  } else if (_hasOwnProperty$1.call(state.tagMap, tagHandle)) {
    state.tag = state.tagMap[tagHandle] + tagName;
  } else if (tagHandle === "!") {
    state.tag = "!" + tagName;
  } else if (tagHandle === "!!") {
    state.tag = "tag:yaml.org,2002:" + tagName;
  } else {
    throwError(state, 'undeclared tag handle "' + tagHandle + '"');
  }
  return true;
}
function readAnchorProperty(state) {
  var _position, ch;
  ch = state.input.charCodeAt(state.position);
  if (ch !== 38) return false;
  if (state.anchor !== null) {
    throwError(state, "duplication of an anchor property");
  }
  ch = state.input.charCodeAt(++state.position);
  _position = state.position;
  while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
    ch = state.input.charCodeAt(++state.position);
  }
  if (state.position === _position) {
    throwError(state, "name of an anchor node must contain at least one character");
  }
  state.anchor = state.input.slice(_position, state.position);
  return true;
}
function readAlias(state) {
  var _position, alias, ch;
  ch = state.input.charCodeAt(state.position);
  if (ch !== 42) return false;
  ch = state.input.charCodeAt(++state.position);
  _position = state.position;
  while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
    ch = state.input.charCodeAt(++state.position);
  }
  if (state.position === _position) {
    throwError(state, "name of an alias node must contain at least one character");
  }
  alias = state.input.slice(_position, state.position);
  if (!_hasOwnProperty$1.call(state.anchorMap, alias)) {
    throwError(state, 'unidentified alias "' + alias + '"');
  }
  state.result = state.anchorMap[alias];
  skipSeparationSpace(state, true, -1);
  return true;
}
function composeNode(state, parentIndent, nodeContext, allowToSeek, allowCompact) {
  var allowBlockStyles, allowBlockScalars, allowBlockCollections, indentStatus = 1, atNewLine = false, hasContent = false, typeIndex, typeQuantity, typeList, type2, flowIndent, blockIndent;
  if (state.listener !== null) {
    state.listener("open", state);
  }
  state.tag = null;
  state.anchor = null;
  state.kind = null;
  state.result = null;
  allowBlockStyles = allowBlockScalars = allowBlockCollections = CONTEXT_BLOCK_OUT === nodeContext || CONTEXT_BLOCK_IN === nodeContext;
  if (allowToSeek) {
    if (skipSeparationSpace(state, true, -1)) {
      atNewLine = true;
      if (state.lineIndent > parentIndent) {
        indentStatus = 1;
      } else if (state.lineIndent === parentIndent) {
        indentStatus = 0;
      } else if (state.lineIndent < parentIndent) {
        indentStatus = -1;
      }
    }
  }
  if (indentStatus === 1) {
    while (readTagProperty(state) || readAnchorProperty(state)) {
      if (skipSeparationSpace(state, true, -1)) {
        atNewLine = true;
        allowBlockCollections = allowBlockStyles;
        if (state.lineIndent > parentIndent) {
          indentStatus = 1;
        } else if (state.lineIndent === parentIndent) {
          indentStatus = 0;
        } else if (state.lineIndent < parentIndent) {
          indentStatus = -1;
        }
      } else {
        allowBlockCollections = false;
      }
    }
  }
  if (allowBlockCollections) {
    allowBlockCollections = atNewLine || allowCompact;
  }
  if (indentStatus === 1 || CONTEXT_BLOCK_OUT === nodeContext) {
    if (CONTEXT_FLOW_IN === nodeContext || CONTEXT_FLOW_OUT === nodeContext) {
      flowIndent = parentIndent;
    } else {
      flowIndent = parentIndent + 1;
    }
    blockIndent = state.position - state.lineStart;
    if (indentStatus === 1) {
      if (allowBlockCollections && (readBlockSequence(state, blockIndent) || readBlockMapping(state, blockIndent, flowIndent)) || readFlowCollection(state, flowIndent)) {
        hasContent = true;
      } else {
        if (allowBlockScalars && readBlockScalar(state, flowIndent) || readSingleQuotedScalar(state, flowIndent) || readDoubleQuotedScalar(state, flowIndent)) {
          hasContent = true;
        } else if (readAlias(state)) {
          hasContent = true;
          if (state.tag !== null || state.anchor !== null) {
            throwError(state, "alias node should not have any properties");
          }
        } else if (readPlainScalar(state, flowIndent, CONTEXT_FLOW_IN === nodeContext)) {
          hasContent = true;
          if (state.tag === null) {
            state.tag = "?";
          }
        }
        if (state.anchor !== null) {
          state.anchorMap[state.anchor] = state.result;
        }
      }
    } else if (indentStatus === 0) {
      hasContent = allowBlockCollections && readBlockSequence(state, blockIndent);
    }
  }
  if (state.tag === null) {
    if (state.anchor !== null) {
      state.anchorMap[state.anchor] = state.result;
    }
  } else if (state.tag === "?") {
    if (state.result !== null && state.kind !== "scalar") {
      throwError(state, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + state.kind + '"');
    }
    for (typeIndex = 0, typeQuantity = state.implicitTypes.length; typeIndex < typeQuantity; typeIndex += 1) {
      type2 = state.implicitTypes[typeIndex];
      if (type2.resolve(state.result)) {
        state.result = type2.construct(state.result);
        state.tag = type2.tag;
        if (state.anchor !== null) {
          state.anchorMap[state.anchor] = state.result;
        }
        break;
      }
    }
  } else if (state.tag !== "!") {
    if (_hasOwnProperty$1.call(state.typeMap[state.kind || "fallback"], state.tag)) {
      type2 = state.typeMap[state.kind || "fallback"][state.tag];
    } else {
      type2 = null;
      typeList = state.typeMap.multi[state.kind || "fallback"];
      for (typeIndex = 0, typeQuantity = typeList.length; typeIndex < typeQuantity; typeIndex += 1) {
        if (state.tag.slice(0, typeList[typeIndex].tag.length) === typeList[typeIndex].tag) {
          type2 = typeList[typeIndex];
          break;
        }
      }
    }
    if (!type2) {
      throwError(state, "unknown tag !<" + state.tag + ">");
    }
    if (state.result !== null && type2.kind !== state.kind) {
      throwError(state, "unacceptable node kind for !<" + state.tag + '> tag; it should be "' + type2.kind + '", not "' + state.kind + '"');
    }
    if (!type2.resolve(state.result, state.tag)) {
      throwError(state, "cannot resolve a node with !<" + state.tag + "> explicit tag");
    } else {
      state.result = type2.construct(state.result, state.tag);
      if (state.anchor !== null) {
        state.anchorMap[state.anchor] = state.result;
      }
    }
  }
  if (state.listener !== null) {
    state.listener("close", state);
  }
  return state.tag !== null || state.anchor !== null || hasContent;
}
function readDocument(state) {
  var documentStart = state.position, _position, directiveName, directiveArgs, hasDirectives = false, ch;
  state.version = null;
  state.checkLineBreaks = state.legacy;
  state.tagMap = /* @__PURE__ */ Object.create(null);
  state.anchorMap = /* @__PURE__ */ Object.create(null);
  while ((ch = state.input.charCodeAt(state.position)) !== 0) {
    skipSeparationSpace(state, true, -1);
    ch = state.input.charCodeAt(state.position);
    if (state.lineIndent > 0 || ch !== 37) {
      break;
    }
    hasDirectives = true;
    ch = state.input.charCodeAt(++state.position);
    _position = state.position;
    while (ch !== 0 && !is_WS_OR_EOL(ch)) {
      ch = state.input.charCodeAt(++state.position);
    }
    directiveName = state.input.slice(_position, state.position);
    directiveArgs = [];
    if (directiveName.length < 1) {
      throwError(state, "directive name must not be less than one character in length");
    }
    while (ch !== 0) {
      while (is_WHITE_SPACE(ch)) {
        ch = state.input.charCodeAt(++state.position);
      }
      if (ch === 35) {
        do {
          ch = state.input.charCodeAt(++state.position);
        } while (ch !== 0 && !is_EOL(ch));
        break;
      }
      if (is_EOL(ch)) break;
      _position = state.position;
      while (ch !== 0 && !is_WS_OR_EOL(ch)) {
        ch = state.input.charCodeAt(++state.position);
      }
      directiveArgs.push(state.input.slice(_position, state.position));
    }
    if (ch !== 0) readLineBreak(state);
    if (_hasOwnProperty$1.call(directiveHandlers, directiveName)) {
      directiveHandlers[directiveName](state, directiveName, directiveArgs);
    } else {
      throwWarning(state, 'unknown document directive "' + directiveName + '"');
    }
  }
  skipSeparationSpace(state, true, -1);
  if (state.lineIndent === 0 && state.input.charCodeAt(state.position) === 45 && state.input.charCodeAt(state.position + 1) === 45 && state.input.charCodeAt(state.position + 2) === 45) {
    state.position += 3;
    skipSeparationSpace(state, true, -1);
  } else if (hasDirectives) {
    throwError(state, "directives end mark is expected");
  }
  composeNode(state, state.lineIndent - 1, CONTEXT_BLOCK_OUT, false, true);
  skipSeparationSpace(state, true, -1);
  if (state.checkLineBreaks && PATTERN_NON_ASCII_LINE_BREAKS.test(state.input.slice(documentStart, state.position))) {
    throwWarning(state, "non-ASCII line breaks are interpreted as content");
  }
  state.documents.push(state.result);
  if (state.position === state.lineStart && testDocumentSeparator(state)) {
    if (state.input.charCodeAt(state.position) === 46) {
      state.position += 3;
      skipSeparationSpace(state, true, -1);
    }
    return;
  }
  if (state.position < state.length - 1) {
    throwError(state, "end of the stream or a document separator is expected");
  } else {
    return;
  }
}
function loadDocuments(input, options) {
  input = String(input);
  options = options || {};
  if (input.length !== 0) {
    if (input.charCodeAt(input.length - 1) !== 10 && input.charCodeAt(input.length - 1) !== 13) {
      input += "\n";
    }
    if (input.charCodeAt(0) === 65279) {
      input = input.slice(1);
    }
  }
  var state = new State$1(input, options);
  var nullpos = input.indexOf("\0");
  if (nullpos !== -1) {
    state.position = nullpos;
    throwError(state, "null byte is not allowed in input");
  }
  state.input += "\0";
  while (state.input.charCodeAt(state.position) === 32) {
    state.lineIndent += 1;
    state.position += 1;
  }
  while (state.position < state.length - 1) {
    readDocument(state);
  }
  return state.documents;
}
function loadAll$1(input, iterator, options) {
  if (iterator !== null && typeof iterator === "object" && typeof options === "undefined") {
    options = iterator;
    iterator = null;
  }
  var documents = loadDocuments(input, options);
  if (typeof iterator !== "function") {
    return documents;
  }
  for (var index = 0, length = documents.length; index < length; index += 1) {
    iterator(documents[index]);
  }
}
function load$1(input, options) {
  var documents = loadDocuments(input, options);
  if (documents.length === 0) {
    return void 0;
  } else if (documents.length === 1) {
    return documents[0];
  }
  throw new exception("expected a single document in the stream, but found more");
}
var loadAll_1 = loadAll$1;
var load_1 = load$1;
var loader = {
  loadAll: loadAll_1,
  load: load_1
};
var _toString = Object.prototype.toString;
var _hasOwnProperty = Object.prototype.hasOwnProperty;
var CHAR_BOM = 65279;
var CHAR_TAB = 9;
var CHAR_LINE_FEED = 10;
var CHAR_CARRIAGE_RETURN = 13;
var CHAR_SPACE = 32;
var CHAR_EXCLAMATION = 33;
var CHAR_DOUBLE_QUOTE = 34;
var CHAR_SHARP = 35;
var CHAR_PERCENT = 37;
var CHAR_AMPERSAND = 38;
var CHAR_SINGLE_QUOTE = 39;
var CHAR_ASTERISK = 42;
var CHAR_COMMA = 44;
var CHAR_MINUS = 45;
var CHAR_COLON = 58;
var CHAR_EQUALS = 61;
var CHAR_GREATER_THAN = 62;
var CHAR_QUESTION = 63;
var CHAR_COMMERCIAL_AT = 64;
var CHAR_LEFT_SQUARE_BRACKET = 91;
var CHAR_RIGHT_SQUARE_BRACKET = 93;
var CHAR_GRAVE_ACCENT = 96;
var CHAR_LEFT_CURLY_BRACKET = 123;
var CHAR_VERTICAL_LINE = 124;
var CHAR_RIGHT_CURLY_BRACKET = 125;
var ESCAPE_SEQUENCES = {};
ESCAPE_SEQUENCES[0] = "\\0";
ESCAPE_SEQUENCES[7] = "\\a";
ESCAPE_SEQUENCES[8] = "\\b";
ESCAPE_SEQUENCES[9] = "\\t";
ESCAPE_SEQUENCES[10] = "\\n";
ESCAPE_SEQUENCES[11] = "\\v";
ESCAPE_SEQUENCES[12] = "\\f";
ESCAPE_SEQUENCES[13] = "\\r";
ESCAPE_SEQUENCES[27] = "\\e";
ESCAPE_SEQUENCES[34] = '\\"';
ESCAPE_SEQUENCES[92] = "\\\\";
ESCAPE_SEQUENCES[133] = "\\N";
ESCAPE_SEQUENCES[160] = "\\_";
ESCAPE_SEQUENCES[8232] = "\\L";
ESCAPE_SEQUENCES[8233] = "\\P";
var DEPRECATED_BOOLEANS_SYNTAX = ["y", "Y", "yes", "Yes", "YES", "on", "On", "ON", "n", "N", "no", "No", "NO", "off", "Off", "OFF"];
var DEPRECATED_BASE60_SYNTAX = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
function compileStyleMap(schema2, map2) {
  var result, keys, index, length, tag, style, type2;
  if (map2 === null) return {};
  result = {};
  keys = Object.keys(map2);
  for (index = 0, length = keys.length; index < length; index += 1) {
    tag = keys[index];
    style = String(map2[tag]);
    if (tag.slice(0, 2) === "!!") {
      tag = "tag:yaml.org,2002:" + tag.slice(2);
    }
    type2 = schema2.compiledTypeMap["fallback"][tag];
    if (type2 && _hasOwnProperty.call(type2.styleAliases, style)) {
      style = type2.styleAliases[style];
    }
    result[tag] = style;
  }
  return result;
}
function encodeHex(character) {
  var string, handle, length;
  string = character.toString(16).toUpperCase();
  if (character <= 255) {
    handle = "x";
    length = 2;
  } else if (character <= 65535) {
    handle = "u";
    length = 4;
  } else if (character <= 4294967295) {
    handle = "U";
    length = 8;
  } else {
    throw new exception("code point within a string may not be greater than 0xFFFFFFFF");
  }
  return "\\" + handle + common.repeat("0", length - string.length) + string;
}
var QUOTING_TYPE_SINGLE = 1;
var QUOTING_TYPE_DOUBLE = 2;
function State(options) {
  this.schema = options["schema"] || _default;
  this.indent = Math.max(1, options["indent"] || 2);
  this.noArrayIndent = options["noArrayIndent"] || false;
  this.skipInvalid = options["skipInvalid"] || false;
  this.flowLevel = common.isNothing(options["flowLevel"]) ? -1 : options["flowLevel"];
  this.styleMap = compileStyleMap(this.schema, options["styles"] || null);
  this.sortKeys = options["sortKeys"] || false;
  this.lineWidth = options["lineWidth"] || 80;
  this.noRefs = options["noRefs"] || false;
  this.noCompatMode = options["noCompatMode"] || false;
  this.condenseFlow = options["condenseFlow"] || false;
  this.quotingType = options["quotingType"] === '"' ? QUOTING_TYPE_DOUBLE : QUOTING_TYPE_SINGLE;
  this.forceQuotes = options["forceQuotes"] || false;
  this.replacer = typeof options["replacer"] === "function" ? options["replacer"] : null;
  this.implicitTypes = this.schema.compiledImplicit;
  this.explicitTypes = this.schema.compiledExplicit;
  this.tag = null;
  this.result = "";
  this.duplicates = [];
  this.usedDuplicates = null;
}
function indentString(string, spaces) {
  var ind = common.repeat(" ", spaces), position = 0, next = -1, result = "", line, length = string.length;
  while (position < length) {
    next = string.indexOf("\n", position);
    if (next === -1) {
      line = string.slice(position);
      position = length;
    } else {
      line = string.slice(position, next + 1);
      position = next + 1;
    }
    if (line.length && line !== "\n") result += ind;
    result += line;
  }
  return result;
}
function generateNextLine(state, level) {
  return "\n" + common.repeat(" ", state.indent * level);
}
function testImplicitResolving(state, str2) {
  var index, length, type2;
  for (index = 0, length = state.implicitTypes.length; index < length; index += 1) {
    type2 = state.implicitTypes[index];
    if (type2.resolve(str2)) {
      return true;
    }
  }
  return false;
}
function isWhitespace(c) {
  return c === CHAR_SPACE || c === CHAR_TAB;
}
function isPrintable(c) {
  return 32 <= c && c <= 126 || 161 <= c && c <= 55295 && c !== 8232 && c !== 8233 || 57344 <= c && c <= 65533 && c !== CHAR_BOM || 65536 <= c && c <= 1114111;
}
function isNsCharOrWhitespace(c) {
  return isPrintable(c) && c !== CHAR_BOM && c !== CHAR_CARRIAGE_RETURN && c !== CHAR_LINE_FEED;
}
function isPlainSafe(c, prev, inblock) {
  var cIsNsCharOrWhitespace = isNsCharOrWhitespace(c);
  var cIsNsChar = cIsNsCharOrWhitespace && !isWhitespace(c);
  return (
    // ns-plain-safe
    (inblock ? (
      // c = flow-in
      cIsNsCharOrWhitespace
    ) : cIsNsCharOrWhitespace && c !== CHAR_COMMA && c !== CHAR_LEFT_SQUARE_BRACKET && c !== CHAR_RIGHT_SQUARE_BRACKET && c !== CHAR_LEFT_CURLY_BRACKET && c !== CHAR_RIGHT_CURLY_BRACKET) && c !== CHAR_SHARP && !(prev === CHAR_COLON && !cIsNsChar) || isNsCharOrWhitespace(prev) && !isWhitespace(prev) && c === CHAR_SHARP || prev === CHAR_COLON && cIsNsChar
  );
}
function isPlainSafeFirst(c) {
  return isPrintable(c) && c !== CHAR_BOM && !isWhitespace(c) && c !== CHAR_MINUS && c !== CHAR_QUESTION && c !== CHAR_COLON && c !== CHAR_COMMA && c !== CHAR_LEFT_SQUARE_BRACKET && c !== CHAR_RIGHT_SQUARE_BRACKET && c !== CHAR_LEFT_CURLY_BRACKET && c !== CHAR_RIGHT_CURLY_BRACKET && c !== CHAR_SHARP && c !== CHAR_AMPERSAND && c !== CHAR_ASTERISK && c !== CHAR_EXCLAMATION && c !== CHAR_VERTICAL_LINE && c !== CHAR_EQUALS && c !== CHAR_GREATER_THAN && c !== CHAR_SINGLE_QUOTE && c !== CHAR_DOUBLE_QUOTE && c !== CHAR_PERCENT && c !== CHAR_COMMERCIAL_AT && c !== CHAR_GRAVE_ACCENT;
}
function isPlainSafeLast(c) {
  return !isWhitespace(c) && c !== CHAR_COLON;
}
function codePointAt(string, pos) {
  var first = string.charCodeAt(pos), second;
  if (first >= 55296 && first <= 56319 && pos + 1 < string.length) {
    second = string.charCodeAt(pos + 1);
    if (second >= 56320 && second <= 57343) {
      return (first - 55296) * 1024 + second - 56320 + 65536;
    }
  }
  return first;
}
function needIndentIndicator(string) {
  var leadingSpaceRe = /^\n* /;
  return leadingSpaceRe.test(string);
}
var STYLE_PLAIN = 1;
var STYLE_SINGLE = 2;
var STYLE_LITERAL = 3;
var STYLE_FOLDED = 4;
var STYLE_DOUBLE = 5;
function chooseScalarStyle(string, singleLineOnly, indentPerLevel, lineWidth, testAmbiguousType, quotingType, forceQuotes, inblock) {
  var i;
  var char = 0;
  var prevChar = null;
  var hasLineBreak = false;
  var hasFoldableLine = false;
  var shouldTrackWidth = lineWidth !== -1;
  var previousLineBreak = -1;
  var plain = isPlainSafeFirst(codePointAt(string, 0)) && isPlainSafeLast(codePointAt(string, string.length - 1));
  if (singleLineOnly || forceQuotes) {
    for (i = 0; i < string.length; char >= 65536 ? i += 2 : i++) {
      char = codePointAt(string, i);
      if (!isPrintable(char)) {
        return STYLE_DOUBLE;
      }
      plain = plain && isPlainSafe(char, prevChar, inblock);
      prevChar = char;
    }
  } else {
    for (i = 0; i < string.length; char >= 65536 ? i += 2 : i++) {
      char = codePointAt(string, i);
      if (char === CHAR_LINE_FEED) {
        hasLineBreak = true;
        if (shouldTrackWidth) {
          hasFoldableLine = hasFoldableLine || // Foldable line = too long, and not more-indented.
          i - previousLineBreak - 1 > lineWidth && string[previousLineBreak + 1] !== " ";
          previousLineBreak = i;
        }
      } else if (!isPrintable(char)) {
        return STYLE_DOUBLE;
      }
      plain = plain && isPlainSafe(char, prevChar, inblock);
      prevChar = char;
    }
    hasFoldableLine = hasFoldableLine || shouldTrackWidth && i - previousLineBreak - 1 > lineWidth && string[previousLineBreak + 1] !== " ";
  }
  if (!hasLineBreak && !hasFoldableLine) {
    if (plain && !forceQuotes && !testAmbiguousType(string)) {
      return STYLE_PLAIN;
    }
    return quotingType === QUOTING_TYPE_DOUBLE ? STYLE_DOUBLE : STYLE_SINGLE;
  }
  if (indentPerLevel > 9 && needIndentIndicator(string)) {
    return STYLE_DOUBLE;
  }
  if (!forceQuotes) {
    return hasFoldableLine ? STYLE_FOLDED : STYLE_LITERAL;
  }
  return quotingType === QUOTING_TYPE_DOUBLE ? STYLE_DOUBLE : STYLE_SINGLE;
}
function writeScalar(state, string, level, iskey, inblock) {
  state.dump = function() {
    if (string.length === 0) {
      return state.quotingType === QUOTING_TYPE_DOUBLE ? '""' : "''";
    }
    if (!state.noCompatMode) {
      if (DEPRECATED_BOOLEANS_SYNTAX.indexOf(string) !== -1 || DEPRECATED_BASE60_SYNTAX.test(string)) {
        return state.quotingType === QUOTING_TYPE_DOUBLE ? '"' + string + '"' : "'" + string + "'";
      }
    }
    var indent = state.indent * Math.max(1, level);
    var lineWidth = state.lineWidth === -1 ? -1 : Math.max(Math.min(state.lineWidth, 40), state.lineWidth - indent);
    var singleLineOnly = iskey || state.flowLevel > -1 && level >= state.flowLevel;
    function testAmbiguity(string2) {
      return testImplicitResolving(state, string2);
    }
    switch (chooseScalarStyle(string, singleLineOnly, state.indent, lineWidth, testAmbiguity, state.quotingType, state.forceQuotes && !iskey, inblock)) {
      case STYLE_PLAIN:
        return string;
      case STYLE_SINGLE:
        return "'" + string.replace(/'/g, "''") + "'";
      case STYLE_LITERAL:
        return "|" + blockHeader(string, state.indent) + dropEndingNewline(indentString(string, indent));
      case STYLE_FOLDED:
        return ">" + blockHeader(string, state.indent) + dropEndingNewline(indentString(foldString(string, lineWidth), indent));
      case STYLE_DOUBLE:
        return '"' + escapeString(string) + '"';
      default:
        throw new exception("impossible error: invalid scalar style");
    }
  }();
}
function blockHeader(string, indentPerLevel) {
  var indentIndicator = needIndentIndicator(string) ? String(indentPerLevel) : "";
  var clip = string[string.length - 1] === "\n";
  var keep = clip && (string[string.length - 2] === "\n" || string === "\n");
  var chomp = keep ? "+" : clip ? "" : "-";
  return indentIndicator + chomp + "\n";
}
function dropEndingNewline(string) {
  return string[string.length - 1] === "\n" ? string.slice(0, -1) : string;
}
function foldString(string, width) {
  var lineRe = /(\n+)([^\n]*)/g;
  var result = function() {
    var nextLF = string.indexOf("\n");
    nextLF = nextLF !== -1 ? nextLF : string.length;
    lineRe.lastIndex = nextLF;
    return foldLine(string.slice(0, nextLF), width);
  }();
  var prevMoreIndented = string[0] === "\n" || string[0] === " ";
  var moreIndented;
  var match;
  while (match = lineRe.exec(string)) {
    var prefix = match[1], line = match[2];
    moreIndented = line[0] === " ";
    result += prefix + (!prevMoreIndented && !moreIndented && line !== "" ? "\n" : "") + foldLine(line, width);
    prevMoreIndented = moreIndented;
  }
  return result;
}
function foldLine(line, width) {
  if (line === "" || line[0] === " ") return line;
  var breakRe = / [^ ]/g;
  var match;
  var start = 0, end, curr = 0, next = 0;
  var result = "";
  while (match = breakRe.exec(line)) {
    next = match.index;
    if (next - start > width) {
      end = curr > start ? curr : next;
      result += "\n" + line.slice(start, end);
      start = end + 1;
    }
    curr = next;
  }
  result += "\n";
  if (line.length - start > width && curr > start) {
    result += line.slice(start, curr) + "\n" + line.slice(curr + 1);
  } else {
    result += line.slice(start);
  }
  return result.slice(1);
}
function escapeString(string) {
  var result = "";
  var char = 0;
  var escapeSeq;
  for (var i = 0; i < string.length; char >= 65536 ? i += 2 : i++) {
    char = codePointAt(string, i);
    escapeSeq = ESCAPE_SEQUENCES[char];
    if (!escapeSeq && isPrintable(char)) {
      result += string[i];
      if (char >= 65536) result += string[i + 1];
    } else {
      result += escapeSeq || encodeHex(char);
    }
  }
  return result;
}
function writeFlowSequence(state, level, object) {
  var _result = "", _tag = state.tag, index, length, value;
  for (index = 0, length = object.length; index < length; index += 1) {
    value = object[index];
    if (state.replacer) {
      value = state.replacer.call(object, String(index), value);
    }
    if (writeNode(state, level, value, false, false) || typeof value === "undefined" && writeNode(state, level, null, false, false)) {
      if (_result !== "") _result += "," + (!state.condenseFlow ? " " : "");
      _result += state.dump;
    }
  }
  state.tag = _tag;
  state.dump = "[" + _result + "]";
}
function writeBlockSequence(state, level, object, compact) {
  var _result = "", _tag = state.tag, index, length, value;
  for (index = 0, length = object.length; index < length; index += 1) {
    value = object[index];
    if (state.replacer) {
      value = state.replacer.call(object, String(index), value);
    }
    if (writeNode(state, level + 1, value, true, true, false, true) || typeof value === "undefined" && writeNode(state, level + 1, null, true, true, false, true)) {
      if (!compact || _result !== "") {
        _result += generateNextLine(state, level);
      }
      if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
        _result += "-";
      } else {
        _result += "- ";
      }
      _result += state.dump;
    }
  }
  state.tag = _tag;
  state.dump = _result || "[]";
}
function writeFlowMapping(state, level, object) {
  var _result = "", _tag = state.tag, objectKeyList = Object.keys(object), index, length, objectKey, objectValue, pairBuffer;
  for (index = 0, length = objectKeyList.length; index < length; index += 1) {
    pairBuffer = "";
    if (_result !== "") pairBuffer += ", ";
    if (state.condenseFlow) pairBuffer += '"';
    objectKey = objectKeyList[index];
    objectValue = object[objectKey];
    if (state.replacer) {
      objectValue = state.replacer.call(object, objectKey, objectValue);
    }
    if (!writeNode(state, level, objectKey, false, false)) {
      continue;
    }
    if (state.dump.length > 1024) pairBuffer += "? ";
    pairBuffer += state.dump + (state.condenseFlow ? '"' : "") + ":" + (state.condenseFlow ? "" : " ");
    if (!writeNode(state, level, objectValue, false, false)) {
      continue;
    }
    pairBuffer += state.dump;
    _result += pairBuffer;
  }
  state.tag = _tag;
  state.dump = "{" + _result + "}";
}
function writeBlockMapping(state, level, object, compact) {
  var _result = "", _tag = state.tag, objectKeyList = Object.keys(object), index, length, objectKey, objectValue, explicitPair, pairBuffer;
  if (state.sortKeys === true) {
    objectKeyList.sort();
  } else if (typeof state.sortKeys === "function") {
    objectKeyList.sort(state.sortKeys);
  } else if (state.sortKeys) {
    throw new exception("sortKeys must be a boolean or a function");
  }
  for (index = 0, length = objectKeyList.length; index < length; index += 1) {
    pairBuffer = "";
    if (!compact || _result !== "") {
      pairBuffer += generateNextLine(state, level);
    }
    objectKey = objectKeyList[index];
    objectValue = object[objectKey];
    if (state.replacer) {
      objectValue = state.replacer.call(object, objectKey, objectValue);
    }
    if (!writeNode(state, level + 1, objectKey, true, true, true)) {
      continue;
    }
    explicitPair = state.tag !== null && state.tag !== "?" || state.dump && state.dump.length > 1024;
    if (explicitPair) {
      if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
        pairBuffer += "?";
      } else {
        pairBuffer += "? ";
      }
    }
    pairBuffer += state.dump;
    if (explicitPair) {
      pairBuffer += generateNextLine(state, level);
    }
    if (!writeNode(state, level + 1, objectValue, true, explicitPair)) {
      continue;
    }
    if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
      pairBuffer += ":";
    } else {
      pairBuffer += ": ";
    }
    pairBuffer += state.dump;
    _result += pairBuffer;
  }
  state.tag = _tag;
  state.dump = _result || "{}";
}
function detectType(state, object, explicit) {
  var _result, typeList, index, length, type2, style;
  typeList = explicit ? state.explicitTypes : state.implicitTypes;
  for (index = 0, length = typeList.length; index < length; index += 1) {
    type2 = typeList[index];
    if ((type2.instanceOf || type2.predicate) && (!type2.instanceOf || typeof object === "object" && object instanceof type2.instanceOf) && (!type2.predicate || type2.predicate(object))) {
      if (explicit) {
        if (type2.multi && type2.representName) {
          state.tag = type2.representName(object);
        } else {
          state.tag = type2.tag;
        }
      } else {
        state.tag = "?";
      }
      if (type2.represent) {
        style = state.styleMap[type2.tag] || type2.defaultStyle;
        if (_toString.call(type2.represent) === "[object Function]") {
          _result = type2.represent(object, style);
        } else if (_hasOwnProperty.call(type2.represent, style)) {
          _result = type2.represent[style](object, style);
        } else {
          throw new exception("!<" + type2.tag + '> tag resolver accepts not "' + style + '" style');
        }
        state.dump = _result;
      }
      return true;
    }
  }
  return false;
}
function writeNode(state, level, object, block, compact, iskey, isblockseq) {
  state.tag = null;
  state.dump = object;
  if (!detectType(state, object, false)) {
    detectType(state, object, true);
  }
  var type2 = _toString.call(state.dump);
  var inblock = block;
  var tagStr;
  if (block) {
    block = state.flowLevel < 0 || state.flowLevel > level;
  }
  var objectOrArray = type2 === "[object Object]" || type2 === "[object Array]", duplicateIndex, duplicate;
  if (objectOrArray) {
    duplicateIndex = state.duplicates.indexOf(object);
    duplicate = duplicateIndex !== -1;
  }
  if (state.tag !== null && state.tag !== "?" || duplicate || state.indent !== 2 && level > 0) {
    compact = false;
  }
  if (duplicate && state.usedDuplicates[duplicateIndex]) {
    state.dump = "*ref_" + duplicateIndex;
  } else {
    if (objectOrArray && duplicate && !state.usedDuplicates[duplicateIndex]) {
      state.usedDuplicates[duplicateIndex] = true;
    }
    if (type2 === "[object Object]") {
      if (block && Object.keys(state.dump).length !== 0) {
        writeBlockMapping(state, level, state.dump, compact);
        if (duplicate) {
          state.dump = "&ref_" + duplicateIndex + state.dump;
        }
      } else {
        writeFlowMapping(state, level, state.dump);
        if (duplicate) {
          state.dump = "&ref_" + duplicateIndex + " " + state.dump;
        }
      }
    } else if (type2 === "[object Array]") {
      if (block && state.dump.length !== 0) {
        if (state.noArrayIndent && !isblockseq && level > 0) {
          writeBlockSequence(state, level - 1, state.dump, compact);
        } else {
          writeBlockSequence(state, level, state.dump, compact);
        }
        if (duplicate) {
          state.dump = "&ref_" + duplicateIndex + state.dump;
        }
      } else {
        writeFlowSequence(state, level, state.dump);
        if (duplicate) {
          state.dump = "&ref_" + duplicateIndex + " " + state.dump;
        }
      }
    } else if (type2 === "[object String]") {
      if (state.tag !== "?") {
        writeScalar(state, state.dump, level, iskey, inblock);
      }
    } else if (type2 === "[object Undefined]") {
      return false;
    } else {
      if (state.skipInvalid) return false;
      throw new exception("unacceptable kind of an object to dump " + type2);
    }
    if (state.tag !== null && state.tag !== "?") {
      tagStr = encodeURI(state.tag[0] === "!" ? state.tag.slice(1) : state.tag).replace(/!/g, "%21");
      if (state.tag[0] === "!") {
        tagStr = "!" + tagStr;
      } else if (tagStr.slice(0, 18) === "tag:yaml.org,2002:") {
        tagStr = "!!" + tagStr.slice(18);
      } else {
        tagStr = "!<" + tagStr + ">";
      }
      state.dump = tagStr + " " + state.dump;
    }
  }
  return true;
}
function getDuplicateReferences(object, state) {
  var objects = [], duplicatesIndexes = [], index, length;
  inspectNode(object, objects, duplicatesIndexes);
  for (index = 0, length = duplicatesIndexes.length; index < length; index += 1) {
    state.duplicates.push(objects[duplicatesIndexes[index]]);
  }
  state.usedDuplicates = new Array(length);
}
function inspectNode(object, objects, duplicatesIndexes) {
  var objectKeyList, index, length;
  if (object !== null && typeof object === "object") {
    index = objects.indexOf(object);
    if (index !== -1) {
      if (duplicatesIndexes.indexOf(index) === -1) {
        duplicatesIndexes.push(index);
      }
    } else {
      objects.push(object);
      if (Array.isArray(object)) {
        for (index = 0, length = object.length; index < length; index += 1) {
          inspectNode(object[index], objects, duplicatesIndexes);
        }
      } else {
        objectKeyList = Object.keys(object);
        for (index = 0, length = objectKeyList.length; index < length; index += 1) {
          inspectNode(object[objectKeyList[index]], objects, duplicatesIndexes);
        }
      }
    }
  }
}
function dump$1(input, options) {
  options = options || {};
  var state = new State(options);
  if (!state.noRefs) getDuplicateReferences(input, state);
  var value = input;
  if (state.replacer) {
    value = state.replacer.call({
      "": value
    }, "", value);
  }
  if (writeNode(state, 0, value, true, true)) return state.dump + "\n";
  return "";
}
var dump_1 = dump$1;
var dumper = {
  dump: dump_1
};
function renamed(from, to) {
  return function() {
    throw new Error("Function yaml." + from + " is removed in js-yaml 4. Use yaml." + to + " instead, which is now safe by default.");
  };
}
var load = loader.load;
var loadAll = loader.loadAll;
var dump = dumper.dump;
var safeLoad = renamed("safeLoad", "load");
var safeLoadAll = renamed("safeLoadAll", "loadAll");
var safeDump = renamed("safeDump", "dump");

// node_modules/langchain/dist/util/openapi.js
var OpenAPISpec = class _OpenAPISpec {
  constructor(document) {
    Object.defineProperty(this, "document", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: document
    });
  }
  get baseUrl() {
    return this.document.servers ? this.document.servers[0].url : void 0;
  }
  getPathsStrict() {
    if (!this.document.paths) {
      throw new Error("No paths found in spec");
    }
    return this.document.paths;
  }
  getParametersStrict() {
    if (!this.document.components?.parameters) {
      throw new Error("No parameters found in spec");
    }
    return this.document.components.parameters;
  }
  getSchemasStrict() {
    if (!this.document.components?.schemas) {
      throw new Error("No schemas found in spec.");
    }
    return this.document.components.schemas;
  }
  getRequestBodiesStrict() {
    if (!this.document.components?.requestBodies) {
      throw new Error("No request body found in spec.");
    }
    return this.document.components.requestBodies;
  }
  getPathStrict(path) {
    const pathItem = this.getPathsStrict()[path];
    if (pathItem === void 0) {
      throw new Error(`No path found for "${path}".`);
    }
    return pathItem;
  }
  getReferencedParameter(ref) {
    const refComponents = ref.$ref.split("/");
    const refName = refComponents[refComponents.length - 1];
    if (this.getParametersStrict()[refName] === void 0) {
      throw new Error(`No parameter found for "${refName}".`);
    }
    return this.getParametersStrict()[refName];
  }
  getRootReferencedParameter(ref) {
    let parameter = this.getReferencedParameter(ref);
    while (parameter.$ref !== void 0) {
      parameter = this.getReferencedParameter(parameter);
    }
    return parameter;
  }
  getReferencedSchema(ref) {
    const refComponents = ref.$ref.split("/");
    const refName = refComponents[refComponents.length - 1];
    const schema2 = this.getSchemasStrict()[refName];
    if (schema2 === void 0) {
      throw new Error(`No schema found for "${refName}".`);
    }
    return schema2;
  }
  getSchema(schema2) {
    if (schema2.$ref !== void 0) {
      return this.getReferencedSchema(schema2);
    }
    return schema2;
  }
  getRootReferencedSchema(ref) {
    let schema2 = this.getReferencedSchema(ref);
    while (schema2.$ref !== void 0) {
      schema2 = this.getReferencedSchema(schema2);
    }
    return schema2;
  }
  getReferencedRequestBody(ref) {
    const refComponents = ref.$ref.split("/");
    const refName = refComponents[refComponents.length - 1];
    const requestBodies = this.getRequestBodiesStrict();
    if (requestBodies[refName] === void 0) {
      throw new Error(`No request body found for "${refName}"`);
    }
    return requestBodies[refName];
  }
  getRootReferencedRequestBody(ref) {
    let requestBody = this.getReferencedRequestBody(ref);
    while (requestBody.$ref !== void 0) {
      requestBody = this.getReferencedRequestBody(requestBody);
    }
    return requestBody;
  }
  getMethodsForPath(path) {
    const pathItem = this.getPathStrict(path);
    const possibleMethods = ["get", "put", "post", "delete", "options", "head", "patch", "trace"];
    return possibleMethods.filter((possibleMethod) => pathItem[possibleMethod] !== void 0);
  }
  getParametersForPath(path) {
    const pathItem = this.getPathStrict(path);
    if (pathItem.parameters === void 0) {
      return [];
    }
    return pathItem.parameters.map((parameter) => {
      if (parameter.$ref !== void 0) {
        return this.getRootReferencedParameter(parameter);
      }
      return parameter;
    });
  }
  getOperation(path, method) {
    const pathItem = this.getPathStrict(path);
    if (pathItem[method] === void 0) {
      throw new Error(`No ${method} method found for "path".`);
    }
    return pathItem[method];
  }
  getParametersForOperation(operation) {
    if (operation.parameters === void 0) {
      return [];
    }
    return operation.parameters.map((parameter) => {
      if (parameter.$ref !== void 0) {
        return this.getRootReferencedParameter(parameter);
      }
      return parameter;
    });
  }
  getRequestBodyForOperation(operation) {
    const {
      requestBody
    } = operation;
    if (requestBody?.$ref !== void 0) {
      return this.getRootReferencedRequestBody(requestBody);
    }
    return requestBody;
  }
  static getCleanedOperationId(operation, path, method) {
    let {
      operationId
    } = operation;
    if (operationId === void 0) {
      const updatedPath = path.replaceAll(/[^a-zA-Z0-9]/, "_");
      operationId = `${updatedPath.startsWith("/") ? updatedPath.slice(1) : updatedPath}_${method}`;
    }
    return operationId.replaceAll("-", "_").replaceAll(".", "_").replaceAll("/", "_");
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static alertUnsupportedSpec(document) {
    const warningMessage = "This may result in degraded performance. Convert your OpenAPI spec to 3.1.0 for better support.";
    const swaggerVersion = document.swagger;
    const openAPIVersion = document.openapi;
    if (openAPIVersion !== void 0 && openAPIVersion !== "3.1.0") {
      console.warn(`Attempting to load an OpenAPI ${openAPIVersion} spec. ${warningMessage}`);
    } else if (swaggerVersion !== void 0) {
      console.warn(`Attempting to load a Swagger ${swaggerVersion} spec. ${warningMessage}`);
    } else {
      throw new Error(`Attempting to load an unsupported spec:

${JSON.stringify(document, null, 2)}.`);
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromObject(document) {
    _OpenAPISpec.alertUnsupportedSpec(document);
    return new _OpenAPISpec(document);
  }
  static fromString(rawString) {
    let document;
    try {
      document = JSON.parse(rawString);
    } catch (e) {
      document = load(rawString);
    }
    return _OpenAPISpec.fromObject(document);
  }
  static fromURL(url) {
    return __async(this, null, function* () {
      const response = yield fetch(url);
      const rawDocument = yield response.text();
      return _OpenAPISpec.fromString(rawDocument);
    });
  }
};

// node_modules/langchain/dist/chains/openai_functions/openapi.js
function formatURL(url, pathParams) {
  const expectedPathParamNames = [...url.matchAll(/{(.*?)}/g)].map((match) => match[1]);
  const newParams = {};
  for (const paramName of expectedPathParamNames) {
    const cleanParamName = paramName.replace(/^\.;/, "").replace(/\*$/, "");
    const value = pathParams[cleanParamName];
    let formattedValue;
    if (Array.isArray(value)) {
      if (paramName.startsWith(".")) {
        const separator = paramName.endsWith("*") ? "." : ",";
        formattedValue = `.${value.join(separator)}`;
      } else if (paramName.startsWith(",")) {
        const separator = paramName.endsWith("*") ? `${cleanParamName}=` : ",";
        formattedValue = `${cleanParamName}=${value.join(separator)}`;
      } else {
        formattedValue = value.join(",");
      }
    } else if (typeof value === "object") {
      const kvSeparator = paramName.endsWith("*") ? "=" : ",";
      const kvStrings = Object.entries(value).map(([k, v]) => k + kvSeparator + v);
      let entrySeparator;
      if (paramName.startsWith(".")) {
        entrySeparator = ".";
        formattedValue = ".";
      } else if (paramName.startsWith(";")) {
        entrySeparator = ";";
        formattedValue = ";";
      } else {
        entrySeparator = ",";
        formattedValue = "";
      }
      formattedValue += kvStrings.join(entrySeparator);
    } else {
      if (paramName.startsWith(".")) {
        formattedValue = `.${value}`;
      } else if (paramName.startsWith(";")) {
        formattedValue = `;${cleanParamName}=${value}`;
      } else {
        formattedValue = value;
      }
    }
    newParams[paramName] = formattedValue;
  }
  let formattedUrl = url;
  for (const [key, newValue] of Object.entries(newParams)) {
    formattedUrl = formattedUrl.replace(`{${key}}`, newValue);
  }
  return formattedUrl;
}
function convertOpenAPIParamsToJSONSchema(params, spec) {
  return params.reduce((jsonSchema, param) => {
    let schema2;
    if (param.schema) {
      schema2 = spec.getSchema(param.schema);
      jsonSchema.properties[param.name] = convertOpenAPISchemaToJSONSchema(schema2, spec);
    } else if (param.content) {
      const mediaTypeSchema = Object.values(param.content)[0].schema;
      if (mediaTypeSchema) {
        schema2 = spec.getSchema(mediaTypeSchema);
      }
      if (!schema2) {
        return jsonSchema;
      }
      if (schema2.description === void 0) {
        schema2.description = param.description ?? "";
      }
      jsonSchema.properties[param.name] = convertOpenAPISchemaToJSONSchema(schema2, spec);
    } else {
      return jsonSchema;
    }
    if (param.required && Array.isArray(jsonSchema.required)) {
      jsonSchema.required.push(param.name);
    }
    return jsonSchema;
  }, {
    type: "object",
    properties: {},
    required: [],
    additionalProperties: {}
  });
}
function convertOpenAPISchemaToJSONSchema(schema2, spec) {
  if (schema2.type === "object") {
    return Object.keys(schema2.properties ?? {}).reduce((jsonSchema, propertyName) => {
      if (!schema2.properties) {
        return jsonSchema;
      }
      const openAPIProperty = spec.getSchema(schema2.properties[propertyName]);
      if (openAPIProperty.type === void 0) {
        return jsonSchema;
      }
      jsonSchema.properties[propertyName] = convertOpenAPISchemaToJSONSchema(openAPIProperty, spec);
      if ((openAPIProperty.required || schema2.required?.includes(propertyName)) && jsonSchema.required !== void 0) {
        jsonSchema.required.push(propertyName);
      }
      return jsonSchema;
    }, {
      type: "object",
      properties: {},
      required: [],
      additionalProperties: {}
    });
  }
  if (schema2.type === "array") {
    return {
      type: "array",
      items: convertOpenAPISchemaToJSONSchema(schema2.items ?? {}, spec),
      minItems: schema2.minItems,
      maxItems: schema2.maxItems
    };
  }
  return {
    type: schema2.type ?? "string"
  };
}
function convertOpenAPISpecToOpenAIFunctions(spec) {
  if (!spec.document.paths) {
    return {
      openAIFunctions: []
    };
  }
  const openAIFunctions = [];
  const nameToCallMap = {};
  for (const path of Object.keys(spec.document.paths)) {
    const pathParameters = spec.getParametersForPath(path);
    for (const method of spec.getMethodsForPath(path)) {
      const operation = spec.getOperation(path, method);
      if (!operation) {
        return {
          openAIFunctions: []
        };
      }
      const operationParametersByLocation = pathParameters.concat(spec.getParametersForOperation(operation)).reduce((operationParams, param) => {
        if (!operationParams[param.in]) {
          operationParams[param.in] = [];
        }
        operationParams[param.in].push(param);
        return operationParams;
      }, {});
      const paramLocationToRequestArgNameMap = {
        query: "params",
        header: "headers",
        cookie: "cookies",
        path: "path_params"
      };
      const requestArgsSchema = {};
      for (const paramLocation of Object.keys(paramLocationToRequestArgNameMap)) {
        if (operationParametersByLocation[paramLocation]) {
          requestArgsSchema[paramLocationToRequestArgNameMap[paramLocation]] = convertOpenAPIParamsToJSONSchema(operationParametersByLocation[paramLocation], spec);
        }
      }
      const requestBody = spec.getRequestBodyForOperation(operation);
      if (requestBody?.content !== void 0) {
        const requestBodySchemas = {};
        for (const [mediaType, mediaTypeObject] of Object.entries(requestBody.content)) {
          if (mediaTypeObject.schema !== void 0) {
            const schema2 = spec.getSchema(mediaTypeObject.schema);
            requestBodySchemas[mediaType] = convertOpenAPISchemaToJSONSchema(schema2, spec);
          }
        }
        const mediaTypes = Object.keys(requestBodySchemas);
        if (mediaTypes.length === 1) {
          requestArgsSchema.data = requestBodySchemas[mediaTypes[0]];
        } else if (mediaTypes.length > 1) {
          requestArgsSchema.data = {
            anyOf: Object.values(requestBodySchemas)
          };
        }
      }
      const openAIFunction = {
        name: OpenAPISpec.getCleanedOperationId(operation, path, method),
        description: operation.description ?? operation.summary ?? "",
        parameters: {
          type: "object",
          properties: requestArgsSchema,
          // All remaining top-level parameters are required
          required: Object.keys(requestArgsSchema)
        }
      };
      openAIFunctions.push(openAIFunction);
      const baseUrl = (spec.baseUrl ?? "").endsWith("/") ? (spec.baseUrl ?? "").slice(0, -1) : spec.baseUrl ?? "";
      nameToCallMap[openAIFunction.name] = {
        method,
        url: baseUrl + path
      };
    }
  }
  return {
    openAIFunctions,
    defaultExecutionMethod: (name, requestArgs, options) => __async(this, null, function* () {
      const _a = options ?? {}, {
        headers: customHeaders,
        params: customParams
      } = _a, rest = __objRest(_a, [
        "headers",
        "params"
      ]);
      const {
        method,
        url
      } = nameToCallMap[name];
      const requestParams = requestArgs.params ?? {};
      const nonEmptyParams = Object.keys(requestParams).reduce(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (filteredArgs, argName) => {
          if (requestParams[argName] !== "" && requestParams[argName] !== null && requestParams[argName] !== void 0) {
            filteredArgs[argName] = requestParams[argName];
          }
          return filteredArgs;
        },
        {}
      );
      const queryString = new URLSearchParams(__spreadValues(__spreadValues({}, nonEmptyParams), customParams)).toString();
      const pathParams = requestArgs.path_params;
      const formattedUrl = formatURL(url, pathParams) + (queryString.length ? `?${queryString}` : "");
      const headers = {};
      let body;
      if (requestArgs.data !== void 0) {
        let contentType = "text/plain";
        if (typeof requestArgs.data !== "string") {
          if (typeof requestArgs.data === "object") {
            contentType = "application/json";
          }
          body = JSON.stringify(requestArgs.data);
        } else {
          body = requestArgs.data;
        }
        headers["content-type"] = contentType;
      }
      const response = yield fetch(formattedUrl, __spreadValues(__spreadProps(__spreadValues({}, requestArgs), {
        method,
        headers: __spreadValues(__spreadValues(__spreadValues({}, headers), requestArgs.headers), customHeaders),
        body
      }), rest));
      let output;
      if (response.status < 200 || response.status > 299) {
        output = `${response.status}: ${response.statusText} for ${name} called with ${JSON.stringify(queryString)}`;
      } else {
        output = yield response.text();
      }
      return output;
    })
  };
}
var SimpleRequestChain = class extends BaseChain {
  static lc_name() {
    return "SimpleRequestChain";
  }
  constructor(config) {
    super();
    Object.defineProperty(this, "requestMethod", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "inputKey", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "function"
    });
    Object.defineProperty(this, "outputKey", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "response"
    });
    this.requestMethod = config.requestMethod;
  }
  get inputKeys() {
    return [this.inputKey];
  }
  get outputKeys() {
    return [this.outputKey];
  }
  _chainType() {
    return "simple_request_chain";
  }
  /** @ignore */
  _call(values, _runManager) {
    return __async(this, null, function* () {
      const inputKeyValue = values[this.inputKey];
      const methodName = inputKeyValue.name;
      const args = inputKeyValue.arguments;
      const response = yield this.requestMethod(methodName, args);
      return {
        [this.outputKey]: response
      };
    });
  }
};
function createOpenAPIChain(_0) {
  return __async(this, arguments, function* (spec, options = {}) {
    let convertedSpec;
    if (typeof spec === "string") {
      try {
        convertedSpec = yield OpenAPISpec.fromURL(spec);
      } catch (e) {
        try {
          convertedSpec = OpenAPISpec.fromString(spec);
        } catch (e2) {
          throw new Error(`Unable to parse spec from source ${spec}.`);
        }
      }
    } else {
      convertedSpec = OpenAPISpec.fromObject(spec);
    }
    const {
      openAIFunctions,
      defaultExecutionMethod
    } = convertOpenAPISpecToOpenAIFunctions(convertedSpec);
    if (defaultExecutionMethod === void 0) {
      throw new Error(`Could not parse any valid operations from the provided spec.`);
    }
    const _a = options, {
      llm = new ChatOpenAI({
        modelName: "gpt-3.5-turbo-0613"
      }),
      prompt = ChatPromptTemplate.fromMessages([HumanMessagePromptTemplate.fromTemplate("Use the provided API's to respond to this user query:\n\n{query}")]),
      requestChain = new SimpleRequestChain({
        requestMethod: (name, args) => __async(this, null, function* () {
          return defaultExecutionMethod(name, args, {
            headers: options.headers,
            params: options.params
          });
        })
      }),
      llmChainInputs = {},
      verbose
    } = _a, rest = __objRest(_a, [
      "llm",
      "prompt",
      "requestChain",
      "llmChainInputs",
      "verbose"
    ]);
    const formatChain = new LLMChain(__spreadValues({
      llm,
      prompt,
      outputParser: new JsonOutputFunctionsParser({
        argsOnly: false
      }),
      outputKey: "function",
      llmKwargs: {
        functions: openAIFunctions
      }
    }, llmChainInputs));
    return new SequentialChain(__spreadValues({
      chains: [formatChain, requestChain],
      outputVariables: ["response"],
      inputVariables: formatChain.inputKeys,
      verbose
    }, rest));
  });
}
export {
  APIChain,
  AnalyzeDocumentChain,
  BaseChain,
  ChatVectorDBQAChain,
  ConstitutionalChain,
  ConstitutionalPrinciple,
  ConversationChain,
  ConversationalRetrievalQAChain,
  LLMChain,
  LLMRouterChain,
  MapReduceDocumentsChain,
  MultiPromptChain,
  MultiRetrievalQAChain,
  MultiRouteChain,
  OpenAIModerationChain,
  PRINCIPLES,
  RefineDocumentsChain,
  RetrievalQAChain,
  RouterChain,
  SequentialChain,
  SimpleSequentialChain,
  StuffDocumentsChain,
  TransformChain,
  VectorDBQAChain,
  createExtractionChain,
  createExtractionChainFromZod,
  createOpenAPIChain,
  createTaggingChain,
  createTaggingChainFromZod,
  loadQAChain,
  loadQAMapReduceChain,
  loadQARefineChain,
  loadQAStuffChain,
  loadSummarizationChain
};
/*! Bundled license information:

js-yaml/dist/js-yaml.mjs:
  (*! js-yaml 4.1.0 https://github.com/nodeca/js-yaml @license MIT *)
*/
//# sourceMappingURL=langchain_chains.js.map
