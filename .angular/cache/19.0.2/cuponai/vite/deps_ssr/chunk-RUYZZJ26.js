import { createRequire } from 'module';const require = createRequire(import.meta.url);
import {
  MapReduceDocumentsChain,
  RefineDocumentsChain,
  StuffDocumentsChain
} from "./chunk-PQXCRRQ6.js";
import {
  LLMChain
} from "./chunk-NDTJ5GJZ.js";
import {
  BaseChain
} from "./chunk-GFBVB7YW.js";
import {
  AIMessagePromptTemplate,
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate
} from "./chunk-VP7I2KXP.js";
import {
  PromptTemplate
} from "./chunk-QXUYJWH2.js";
import {
  __async,
  __spreadProps,
  __spreadValues
} from "./chunk-LKDWXENB.js";

// node_modules/@langchain/core/dist/example_selectors/conditional.js
var BasePromptSelector = class {
  /**
   * Asynchronous version of `getPrompt` that also accepts an options object
   * for partial variables.
   * @param llm The language model for which to get a prompt.
   * @param options Optional object for partial variables.
   * @returns A Promise that resolves to a prompt template.
   */
  getPromptAsync(llm, options) {
    return __async(this, null, function* () {
      const prompt = this.getPrompt(llm);
      return prompt.partial(options?.partialVariables ?? {});
    });
  }
};
var ConditionalPromptSelector = class extends BasePromptSelector {
  constructor(default_prompt, conditionals = []) {
    super();
    Object.defineProperty(this, "defaultPrompt", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "conditionals", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.defaultPrompt = default_prompt;
    this.conditionals = conditionals;
  }
  /**
   * Method that selects a prompt based on a set of conditions. If none of
   * the conditions are met, it returns the default prompt.
   * @param llm The language model for which to get a prompt.
   * @returns A prompt template.
   */
  getPrompt(llm) {
    for (const [condition, prompt] of this.conditionals) {
      if (condition(llm)) {
        return prompt;
      }
    }
    return this.defaultPrompt;
  }
};
function isChatModel(llm) {
  return llm._modelType() === "base_chat_model";
}

// node_modules/langchain/dist/chains/question_answering/stuff_prompts.js
var DEFAULT_QA_PROMPT = new PromptTemplate({
  template: "Use the following pieces of context to answer the question at the end. If you don't know the answer, just say that you don't know, don't try to make up an answer.\n\n{context}\n\nQuestion: {question}\nHelpful Answer:",
  inputVariables: ["context", "question"]
});
var system_template = `Use the following pieces of context to answer the users question. 
If you don't know the answer, just say that you don't know, don't try to make up an answer.
----------------
{context}`;
var messages = [SystemMessagePromptTemplate.fromTemplate(system_template), HumanMessagePromptTemplate.fromTemplate("{question}")];
var CHAT_PROMPT = ChatPromptTemplate.fromMessages(messages);
var QA_PROMPT_SELECTOR = new ConditionalPromptSelector(DEFAULT_QA_PROMPT, [[isChatModel, CHAT_PROMPT]]);

// node_modules/langchain/dist/chains/question_answering/map_reduce_prompts.js
var qa_template = `Use the following portion of a long document to see if any of the text is relevant to answer the question. 
Return any relevant text verbatim.
{context}
Question: {question}
Relevant text, if any:`;
var DEFAULT_COMBINE_QA_PROMPT = PromptTemplate.fromTemplate(qa_template);
var system_template2 = `Use the following portion of a long document to see if any of the text is relevant to answer the question. 
Return any relevant text verbatim.
----------------
{context}`;
var messages2 = [SystemMessagePromptTemplate.fromTemplate(system_template2), HumanMessagePromptTemplate.fromTemplate("{question}")];
var CHAT_QA_PROMPT = ChatPromptTemplate.fromMessages(messages2);
var COMBINE_QA_PROMPT_SELECTOR = new ConditionalPromptSelector(DEFAULT_COMBINE_QA_PROMPT, [[isChatModel, CHAT_QA_PROMPT]]);
var combine_prompt = `Given the following extracted parts of a long document and a question, create a final answer. 
If you don't know the answer, just say that you don't know. Don't try to make up an answer.

QUESTION: Which state/country's law governs the interpretation of the contract?
=========
Content: This Agreement is governed by English law and the parties submit to the exclusive jurisdiction of the English courts in  relation to any dispute (contractual or non-contractual) concerning this Agreement save that either party may apply to any court for an  injunction or other relief to protect its Intellectual Property Rights.

Content: No Waiver. Failure or delay in exercising any right or remedy under this Agreement shall not constitute a waiver of such (or any other)  right or remedy.

11.7 Severability. The invalidity, illegality or unenforceability of any term (or part of a term) of this Agreement shall not affect the continuation  in force of the remainder of the term (if any) and this Agreement.

11.8 No Agency. Except as expressly stated otherwise, nothing in this Agreement shall create an agency, partnership or joint venture of any  kind between the parties.

11.9 No Third-Party Beneficiaries.

Content: (b) if Google believes, in good faith, that the Distributor has violated or caused Google to violate any Anti-Bribery Laws (as  defined in Clause 8.5) or that such a violation is reasonably likely to occur,
=========
FINAL ANSWER: This Agreement is governed by English law.

QUESTION: What did the president say about Michael Jackson?
=========
Content: Madam Speaker, Madam Vice President, our First Lady and Second Gentleman. Members of Congress and the Cabinet. Justices of the Supreme Court. My fellow Americans.  

Last year COVID-19 kept us apart. This year we are finally together again. 

Tonight, we meet as Democrats Republicans and Independents. But most importantly as Americans. 

With a duty to one another to the American people to the Constitution. 

And with an unwavering resolve that freedom will always triumph over tyranny. 

Six days ago, Russia’s Vladimir Putin sought to shake the foundations of the free world thinking he could make it bend to his menacing ways. But he badly miscalculated. 

He thought he could roll into Ukraine and the world would roll over. Instead he met a wall of strength he never imagined. 

He met the Ukrainian people. 

From President Zelenskyy to every Ukrainian, their fearlessness, their courage, their determination, inspires the world. 

Groups of citizens blocking tanks with their bodies. Everyone from students to retirees teachers turned soldiers defending their homeland.

Content: And we won’t stop. 

We have lost so much to COVID-19. Time with one another. And worst of all, so much loss of life. 

Let’s use this moment to reset. Let’s stop looking at COVID-19 as a partisan dividing line and see it for what it is: A God-awful disease.  

Let’s stop seeing each other as enemies, and start seeing each other for who we really are: Fellow Americans.  

We can’t change how divided we’ve been. But we can change how we move forward—on COVID-19 and other issues we must face together. 

I recently visited the New York City Police Department days after the funerals of Officer Wilbert Mora and his partner, Officer Jason Rivera. 

They were responding to a 9-1-1 call when a man shot and killed them with a stolen gun. 

Officer Mora was 27 years old. 

Officer Rivera was 22. 

Both Dominican Americans who’d grown up on the same streets they later chose to patrol as police officers. 

I spoke with their families and told them that we are forever in debt for their sacrifice, and we will carry on their mission to restore the trust and safety every community deserves.

Content: And a proud Ukrainian people, who have known 30 years  of independence, have repeatedly shown that they will not tolerate anyone who tries to take their country backwards.  

To all Americans, I will be honest with you, as I’ve always promised. A Russian dictator, invading a foreign country, has costs around the world. 

And I’m taking robust action to make sure the pain of our sanctions  is targeted at Russia’s economy. And I will use every tool at our disposal to protect American businesses and consumers. 

Tonight, I can announce that the United States has worked with 30 other countries to release 60 Million barrels of oil from reserves around the world.  

America will lead that effort, releasing 30 Million barrels from our own Strategic Petroleum Reserve. And we stand ready to do more if necessary, unified with our allies.  

These steps will help blunt gas prices here at home. And I know the news about what’s happening can seem alarming. 

But I want you to know that we are going to be okay.

Content: More support for patients and families. 

To get there, I call on Congress to fund ARPA-H, the Advanced Research Projects Agency for Health. 

It’s based on DARPA—the Defense Department project that led to the Internet, GPS, and so much more.  

ARPA-H will have a singular purpose—to drive breakthroughs in cancer, Alzheimer’s, diabetes, and more. 

A unity agenda for the nation. 

We can do this. 

My fellow Americans—tonight , we have gathered in a sacred space—the citadel of our democracy. 

In this Capitol, generation after generation, Americans have debated great questions amid great strife, and have done great things. 

We have fought for freedom, expanded liberty, defeated totalitarianism and terror. 

And built the strongest, freest, and most prosperous nation the world has ever known. 

Now is the hour. 

Our moment of responsibility. 

Our test of resolve and conscience, of history itself. 

It is in this moment that our character is formed. Our purpose is found. Our future is forged. 

Well I know this nation.
=========
FINAL ANSWER: The president did not mention Michael Jackson.

QUESTION: {question}
=========
{summaries}
=========
FINAL ANSWER:`;
var COMBINE_PROMPT = PromptTemplate.fromTemplate(combine_prompt);
var system_combine_template = `Given the following extracted parts of a long document and a question, create a final answer. 
If you don't know the answer, just say that you don't know. Don't try to make up an answer.
----------------
{summaries}`;
var combine_messages = [SystemMessagePromptTemplate.fromTemplate(system_combine_template), HumanMessagePromptTemplate.fromTemplate("{question}")];
var CHAT_COMBINE_PROMPT = ChatPromptTemplate.fromMessages(combine_messages);
var COMBINE_PROMPT_SELECTOR = new ConditionalPromptSelector(COMBINE_PROMPT, [[isChatModel, CHAT_COMBINE_PROMPT]]);

// node_modules/langchain/dist/chains/question_answering/refine_prompts.js
var DEFAULT_REFINE_PROMPT_TMPL = `The original question is as follows: {question}
We have provided an existing answer: {existing_answer}
We have the opportunity to refine the existing answer
(only if needed) with some more context below.
------------
{context}
------------
Given the new context, refine the original answer to better answer the question. 
If the context isn't useful, return the original answer.`;
var DEFAULT_REFINE_PROMPT = new PromptTemplate({
  inputVariables: ["question", "existing_answer", "context"],
  template: DEFAULT_REFINE_PROMPT_TMPL
});
var refineTemplate = `The original question is as follows: {question}
We have provided an existing answer: {existing_answer}
We have the opportunity to refine the existing answer
(only if needed) with some more context below.
------------
{context}
------------
Given the new context, refine the original answer to better answer the question. 
If the context isn't useful, return the original answer.`;
var messages3 = [HumanMessagePromptTemplate.fromTemplate("{question}"), AIMessagePromptTemplate.fromTemplate("{existing_answer}"), HumanMessagePromptTemplate.fromTemplate(refineTemplate)];
var CHAT_REFINE_PROMPT = ChatPromptTemplate.fromMessages(messages3);
var REFINE_PROMPT_SELECTOR = new ConditionalPromptSelector(DEFAULT_REFINE_PROMPT, [[isChatModel, CHAT_REFINE_PROMPT]]);
var DEFAULT_TEXT_QA_PROMPT_TMPL = `Context information is below. 
---------------------
{context}
---------------------
Given the context information and no prior knowledge, answer the question: {question}`;
var DEFAULT_TEXT_QA_PROMPT = new PromptTemplate({
  inputVariables: ["context", "question"],
  template: DEFAULT_TEXT_QA_PROMPT_TMPL
});
var chat_qa_prompt_template = `Context information is below. 
---------------------
{context}
---------------------
Given the context information and no prior knowledge, answer any questions`;
var chat_messages = [SystemMessagePromptTemplate.fromTemplate(chat_qa_prompt_template), HumanMessagePromptTemplate.fromTemplate("{question}")];
var CHAT_QUESTION_PROMPT = ChatPromptTemplate.fromMessages(chat_messages);
var QUESTION_PROMPT_SELECTOR = new ConditionalPromptSelector(DEFAULT_TEXT_QA_PROMPT, [[isChatModel, CHAT_QUESTION_PROMPT]]);

// node_modules/langchain/dist/chains/question_answering/load.js
var loadQAChain = (llm, params = {
  type: "stuff"
}) => {
  const {
    type
  } = params;
  if (type === "stuff") {
    return loadQAStuffChain(llm, params);
  }
  if (type === "map_reduce") {
    return loadQAMapReduceChain(llm, params);
  }
  if (type === "refine") {
    return loadQARefineChain(llm, params);
  }
  throw new Error(`Invalid _type: ${type}`);
};
function loadQAStuffChain(llm, params = {}) {
  const {
    prompt = QA_PROMPT_SELECTOR.getPrompt(llm),
    verbose
  } = params;
  const llmChain = new LLMChain({
    prompt,
    llm,
    verbose
  });
  const chain = new StuffDocumentsChain({
    llmChain,
    verbose
  });
  return chain;
}
function loadQAMapReduceChain(llm, params = {}) {
  const {
    combineMapPrompt = COMBINE_QA_PROMPT_SELECTOR.getPrompt(llm),
    combinePrompt = COMBINE_PROMPT_SELECTOR.getPrompt(llm),
    verbose,
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
    documentVariableName: "summaries",
    verbose
  });
  const chain = new MapReduceDocumentsChain({
    llmChain,
    combineDocumentChain,
    returnIntermediateSteps,
    verbose
  });
  return chain;
}
function loadQARefineChain(llm, params = {}) {
  const {
    questionPrompt = QUESTION_PROMPT_SELECTOR.getPrompt(llm),
    refinePrompt = REFINE_PROMPT_SELECTOR.getPrompt(llm),
    refineLLM,
    verbose
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
    verbose
  });
  return chain;
}

// node_modules/langchain/dist/chains/vector_db_qa.js
var VectorDBQAChain = class _VectorDBQAChain extends BaseChain {
  static lc_name() {
    return "VectorDBQAChain";
  }
  get inputKeys() {
    return [this.inputKey];
  }
  get outputKeys() {
    return this.combineDocumentsChain.outputKeys.concat(this.returnSourceDocuments ? ["sourceDocuments"] : []);
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
      value: "query"
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
    Object.defineProperty(this, "returnSourceDocuments", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: false
    });
    this.vectorstore = fields.vectorstore;
    this.combineDocumentsChain = fields.combineDocumentsChain;
    this.inputKey = fields.inputKey ?? this.inputKey;
    this.k = fields.k ?? this.k;
    this.returnSourceDocuments = fields.returnSourceDocuments ?? this.returnSourceDocuments;
  }
  /** @ignore */
  _call(values, runManager) {
    return __async(this, null, function* () {
      if (!(this.inputKey in values)) {
        throw new Error(`Question key ${this.inputKey} not found.`);
      }
      const question = values[this.inputKey];
      const docs = yield this.vectorstore.similaritySearch(question, this.k, values.filter, runManager?.getChild("vectorstore"));
      const inputs = {
        question,
        input_documents: docs
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
    return "vector_db_qa";
  }
  static deserialize(data, values) {
    return __async(this, null, function* () {
      if (!("vectorstore" in values)) {
        throw new Error(`Need to pass in a vectorstore to deserialize VectorDBQAChain`);
      }
      const {
        vectorstore
      } = values;
      if (!data.combine_documents_chain) {
        throw new Error(`VectorDBQAChain must have combine_documents_chain in serialized data`);
      }
      return new _VectorDBQAChain({
        combineDocumentsChain: yield BaseChain.deserialize(data.combine_documents_chain),
        k: data.k,
        vectorstore
      });
    });
  }
  serialize() {
    return {
      _type: this._chainType(),
      combine_documents_chain: this.combineDocumentsChain.serialize(),
      k: this.k
    };
  }
  /**
   * Static method that creates a VectorDBQAChain instance from a
   * BaseLanguageModel and a vector store. It also accepts optional options
   * to customize the chain.
   * @param llm The BaseLanguageModel instance.
   * @param vectorstore The vector store used for similarity search.
   * @param options Optional options to customize the chain.
   * @returns A new instance of VectorDBQAChain.
   */
  static fromLLM(llm, vectorstore, options) {
    const qaChain = loadQAStuffChain(llm);
    return new this(__spreadValues({
      vectorstore,
      combineDocumentsChain: qaChain
    }, options));
  }
};

export {
  loadQAChain,
  loadQAStuffChain,
  loadQAMapReduceChain,
  loadQARefineChain,
  VectorDBQAChain
};
//# sourceMappingURL=chunk-RUYZZJ26.js.map