/**
 * @typedef {import('@typescript-eslint/utils').TSESLint.RuleModule<"message", []>} Rule
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
      ["message"]: "{{ stringified }}",
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
              messageId: "message",
              data: {
                ["stringified"]: JSON.stringify({
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
