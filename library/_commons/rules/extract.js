import {
  placeholderMessageId,
  placeholderDataId,
  $COMMENT,
} from "../constants/bases.js";

/**
 * @typedef {import("../../../types/_commons/typedefs.js").ExtractRule} ExtractRule
 */

/** @type {ExtractRule} */
const rule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Extracts strict string literals (no template literals) from object values along with the file path they're in and their SourceLocation object.",
    },
    schema: [
      {
        type: "object",
        properties: {
          composedVariablesOnly: {
            type: "boolean",
            default: false,
          },
          makePlaceholders: {
            type: "object",
            properties: {
              composedValues_originalKeys: {
                type: "object",
                additionalProperties: { type: "string" },
                default: {},
              },
              aliasValues_originalKeys: {
                type: "object",
                additionalProperties: { type: "string" },
                default: {},
              },
              regularValuesOnly_originalKeys: {
                type: "object",
                additionalProperties: { type: "string" },
                default: {},
              },
            },
            required: [
              "composedValues_originalKeys",
              "aliasValues_originalKeys",
              "regularValuesOnly_originalKeys",
            ],
            additionalProperties: false,
            default: undefined, // personal overkill
          },
        },
        additionalProperties: false,
        default: {},
        oneOf: [
          {
            properties: {
              composedVariablesOnly: { const: false },
              makePlaceholders: { const: undefined },
            },
          },
          {
            required: ["composedVariablesOnly"],
            properties: {
              makePlaceholders: { const: undefined },
            },
          },
          {
            required: ["makePlaceholders"],
            properties: {
              composedVariablesOnly: { const: false },
            },
          },
        ],
      },
    ],
    messages: {
      [placeholderMessageId]: `{{ ${placeholderDataId} }}`,
    },
  },
  create: (context) => {
    const options = context.options[0] || {}; // personal overkill
    const composedVariablesOnly = options.composedVariablesOnly;
    const makePlaceholders = options.makePlaceholders;

    // as a measure of caution, returns early if both composedVariablesOnly && makePlaceholders are defined/truthy
    if (composedVariablesOnly && makePlaceholders) return {};

    return {
      ObjectExpression: (node) => {
        for (const prop of node.properties) {
          if (
            prop.type === "Property" &&
            prop.value &&
            prop.value.type === "Literal" &&
            typeof prop.value.value === "string" &&
            (!composedVariablesOnly ||
              prop.value.value.includes(`${$COMMENT}#`))
          ) {
            const propValueNode = prop.value;

            if (makePlaceholders) {
              const {
                composedValues_originalKeys,
                aliasValues_originalKeys,
                regularValuesOnly_originalKeys,
              } = makePlaceholders;

              const originalKey =
                composedValues_originalKeys[propValueNode.value] ||
                aliasValues_originalKeys[propValueNode.value] ||
                regularValuesOnly_originalKeys[propValueNode.value];

              if (originalKey /* and not done already */) {
                console.log("In fixing.");
                console.log("originalKey is:", originalKey);
                console.log("Value is:", propValueNode.value);
                // context.report({
                //   node: propValueNode,
                //   messageId: placeholderMessageId,
                //   data: {
                //     [placeholderDataId]: JSON.stringify({
                //       value: propValueNode.value,
                //       filePath: context.filename,
                //       loc: propValueNode.loc,
                //     }),
                //   },
                //   fix: (fixer) =>
                //     fixer.insertTextAfterRange(
                //       node.range,
                //       ` /* ${$COMMENT}#${originalKey} */`
                //     ),
                // });
              }
            }

            // const commentAfter =
            //   context.sourceCode.getCommentsAfter(propValueNode)[0];
            else
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
