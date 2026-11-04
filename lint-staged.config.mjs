export default {
  "apps/api/src/**/*.{ts,tsx}": [
    "pnpm --filter @spectaxi/api exec eslint --fix --max-warnings=0",
    "prettier --write",
  ],
  "apps/api/**/*.{mjs,json,md}": ["prettier --write"],
  "apps/admin/**/*.{ts,tsx,mjs}": [
    "pnpm --filter @spectaxi/admin exec eslint --fix --max-warnings=0",
    "prettier --write",
  ],
  "apps/web/**/*.{ts,tsx,mjs}": [
    "pnpm --filter @spectaxi/web exec eslint --fix --max-warnings=0",
    "prettier --write",
  ],
  "apps/mobile/**/*.{ts,tsx,js}": [
    "pnpm --filter @spectaxi/mobile exec eslint --fix --max-warnings=0",
    "prettier --write",
  ],
  "eslint/**/*.{js,mjs,cjs}": ["prettier --write"],
  "*.{json,md,yml,yaml,css}": ["prettier --write"],
};
