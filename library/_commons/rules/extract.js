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
          },
          makePlaceholders: {
            type: "object",
            properties: {
              composedValues_originalKeys: {
                type: "object",
                additionalProperties: { type: "string" },
              },
              aliasValues_originalKeys: {
                type: "object",
                additionalProperties: { type: "string" },
              },
              regularValuesOnly_originalKeys: {
                type: "object",
                additionalProperties: { type: "string" },
              },
            },
            required: [
              "composedValues_originalKeys",
              "aliasValues_originalKeys",
              "regularValuesOnly_originalKeys",
            ],
            additionalProperties: false,
          },
        },
        additionalProperties: false,
        default: {},
        oneOf: [
          {
            // Neither (empty options)
            properties: {
              composedVariablesOnly: { not: {} },
              makePlaceholders: { not: {} },
            },
          },
          {
            // Only composedVariablesOnly (true or false)
            properties: {
              composedVariablesOnly: { type: "boolean" },
              makePlaceholders: { not: {} }, // Must be undefined/missing
            },
            required: ["composedVariablesOnly"],
          },
          {
            // Only makePlaceholders
            properties: {
              makePlaceholders: { type: "object" },
              composedVariablesOnly: { not: {} }, // Must be undefined/missing
            },
            required: ["makePlaceholders"],
          },
        ],
      },
    ],
    messages: {
      [placeholderMessageId]: `{{ ${placeholderDataId} }}`,
    },
    fixable: "code",
  },
  create: (context) => {
    const options = context.options[0] || {};
    const composedVariablesOnly = options.composedVariablesOnly ?? false;
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
            const data = {
              [placeholderDataId]: JSON.stringify({
                value: propValueNode.value,
                filePath: context.filename,
                loc: propValueNode.loc,
              }),
            };

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

              if (originalKey) {
                const placeholder = `${$COMMENT}#${originalKey}`;

                const sourceCode = context.sourceCode;
                const commentsAfter =
                  sourceCode.getCommentsAfter(propValueNode);

                const hasExistingPlaceholder = commentsAfter.some((comment) =>
                  comment.value.includes(placeholder)
                );

                if (!hasExistingPlaceholder) {
                  context.report({
                    node: propValueNode,
                    messageId: placeholderMessageId,
                    data,
                    fix: (fixer) =>
                      fixer.insertTextAfter(
                        propValueNode,
                        ` /* ${placeholder} */`
                      ),
                  });
                }
              }
            } else
              context.report({
                node: propValueNode,
                messageId: placeholderMessageId,
                data,
              });
          }
        }
      },
    };
  },
};

export default rule; // extract-object-string-literal-values
