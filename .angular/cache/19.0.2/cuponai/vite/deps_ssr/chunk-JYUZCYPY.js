import { createRequire } from 'module';const require = createRequire(import.meta.url);

// node_modules/@langchain/core/dist/documents/document.js
var Document = class {
  constructor(fields) {
    Object.defineProperty(this, "pageContent", {
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
    Object.defineProperty(this, "id", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.pageContent = fields.pageContent !== void 0 ? fields.pageContent.toString() : "";
    this.metadata = fields.metadata ?? {};
    this.id = fields.id;
  }
};

export {
  Document
};
//# sourceMappingURL=chunk-JYUZCYPY.js.map
