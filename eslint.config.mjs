import reactHooks from "eslint-plugin-react-hooks";

export default [
  {
    ignores: ["build/**", "node_modules/**", ".react-router/**"],
  },
  reactHooks.configs.flat.recommended,
];
