# Answers Core

<div>
  <a href="https://npmjs.org/package/@yext/answers-core">
    <img src="https://img.shields.io/npm/v/@yext/answers-core" alt="NPM version"/>
  </a>
  <a href="https://github.com/yext/answers-core/blob/master/LICENSE">
    <img src="https://img.shields.io/badge/License-BSD%203--Clause-blue.svg" alt="License"/>
  </a>
</div>

## ⭐ Features

- Thin & **minimal low-level HTTP client** to interact with the Yext Answers API
- Works in both the **browser** and **Node.js**
- **UMD compatible**, you can use it with any module loader
- 100% **TypeScript**, with detailed request and response models
- Offers both **ES6** and **ES5** versions

## 💡 Getting Started

First, install Answers-core via [npm](https://www.npmjs.com/get-npm):

```bash
npm install @yext/answers-core
```

Next, import and initialize the core library in your application.

```js
import { provideCore } from '@yext/answers-core';
const core = provideCore({
  apiKey: '<your api key>',
  experienceKey: '<one of your experience keys>',
  locale: 'en',
  experienceVersion: 'PRODUCTION',
});
```

If you want to use the ES5 version, which is compatible with browsers like Internet Explorer 11 out of the box, import from `@yext/answers-core/legacy` instead.

```js
import { provideCore } from '@yext/answers-core/legacy';
const core = provideCore({
  apiKey: '<your api key>',
  experienceKey: '<one of your experience keys>',
  locale: 'en',
  experienceVersion: 'PRODUCTION',
});
```

Now that the core is initialized, let's run a search on an "FAQs" vertical.

```js
core.verticalSearch({
  verticalKey: 'FAQs',
  query: 'What is Yext Answers?',
}).then(results => {
  // Do something with the search results
});
```

And that's it! See **[our documentation](https://github.com/yext/answers-core/tree/master/docs/answers-core.answerscore.md)** for a full list of supported API calls.

## 📄 License

Yext Answers-core is an open-sourced library licensed under the [BSD-3 License](https://github.com/yext/answers-core/blob/master/LICENSE).
