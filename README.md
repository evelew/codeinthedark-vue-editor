# Code in the dark editor in Vue

In this project, you will find the [code in the dark editor](https://github.com/codeinthedark/editor) written with Vue 3.

You can access this version [here](https://codeinthedark.evellynlima.com.br), it's just the same as the original.

## How to use

- Replace `assets/challenge/page.jpg` with the layout that will be used in your competition
- Add extra files, images for example, in the assets folder
- Edit the instructions in the file `src/components/Instructions.vue`

## Commands

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```sh
npm run test:e2e:dev
```

This runs the end-to-end tests against the Vite development server.
It is much faster than the production build.

But it's still recommended to test the production build with `test:e2e` before deploying (e.g. in CI environments):

```sh
npm run build
npm run test:e2e
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
