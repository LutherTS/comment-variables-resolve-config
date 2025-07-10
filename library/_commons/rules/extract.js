import { placeholderMessageId, placeholderDataId } from "../constants/bases.js";

/**
 * @typedef {import('@typescript-eslint/utils').TSESLint.RuleModule<typeof placeholderMessageId, []>} Rule
 */

/** @type {Rule} */
const rule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Extracts strict string literals (no template literals) from object values along with the file path they're in and their SourceLocation object.",
    },
    schema: [],
    messages: {
      [placeholderMessageId]: `{{ ${placeholderDataId} }}`,
    },
  },
  create: (context) => {
    return {
      ObjectExpression: (node) => {
        for (const prop of node.properties) {
          if (
            prop.type === "Property" &&
            prop.value &&
            prop.value.type === "Literal" &&
            typeof prop.value.value === "string"
          ) {
            const propValueNode = prop.value;
            context.report({
              node: propValueNode,
              messageId: placeholderMessageId,
              data: {
                [placeholderDataId]: JSON.stringify({
                  value: propValueNode.value,
                  filePath: context.filename,
                  loc: propValueNode.loc,
                }),
              },
            });
          }
        }
      },
    };
  },
};

export default rule; // extract-object-string-literal-values
