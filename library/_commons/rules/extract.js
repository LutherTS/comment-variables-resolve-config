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
              aliases_flattenedKeys: {
                type: "object",
                additionalProperties: { type: "string" },
              },
            },
            required: [
              "composedValues_originalKeys",
              "aliasValues_originalKeys",
              "regularValuesOnly_originalKeys",
              "aliases_flattenedKeys",
            ],
            additionalProperties: false,
          },
        },
        additionalProperties: false,
        default: {},
        oneOf: [
          {
            // neither (empty options)
            properties: {
              composedVariablesOnly: { not: {} },
              makePlaceholders: { not: {} },
            },
          },
          {
            // only composedVariablesOnly (true or false)
            properties: {
              composedVariablesOnly: { type: "boolean" },
              makePlaceholders: { not: {} }, // must be undefined/missing
            },
            required: ["composedVariablesOnly"],
          },
          {
            // only makePlaceholders
            properties: {
              makePlaceholders: { type: "object" },
              composedVariablesOnly: { not: {} }, // must be undefined/missing
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

    if (!composedVariablesOnly && !makePlaceholders) {
      /* case 1 */
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
              const data = {
                [placeholderDataId]: JSON.stringify({
                  value: propValueNode.value,
                  filePath: context.filename,
                  loc: propValueNode.loc,
                }),
              };

              context.report({
                node: propValueNode,
                messageId: placeholderMessageId,
                data,
              });
            }
          }
        },
      };
    }

    if (composedVariablesOnly) {
      /* case 2 */
      return {
        ObjectExpression: (node) => {
          for (const prop of node.properties) {
            if (
              prop.type === "Property" &&
              prop.value &&
              prop.value.type === "Literal" &&
              typeof prop.value.value === "string" &&
              prop.value.value.includes(`${$COMMENT}#`)
            ) {
              const propValueNode = prop.value;
              const data = {
                [placeholderDataId]: JSON.stringify({
                  value: propValueNode.value,
                  filePath: context.filename,
                  loc: propValueNode.loc,
                }),
              };

              context.report({
                node: propValueNode,
                messageId: placeholderMessageId,
                data,
              });
            }
          }
        },
      };
    }

    if (makePlaceholders) {
      /* case 3 */
      const {
        composedValues_originalKeys,
        aliasValues_originalKeys,
        regularValuesOnly_originalKeys,
        aliases_flattenedKeys,
      } = makePlaceholders;

      const flattenedKeysWithAliases = new Set(
        Object.values(aliases_flattenedKeys)
      );

      // currently only needed here for command placeholders
      const flattenedKeys_aliasPlaceholdersSets__map = new Map(
        [...flattenedKeysWithAliases].map((e) => {
          /** @type {Set<string>} */
          const aliasSet = new Set();
          return [e, aliasSet];
        })
      );
      Object.entries(aliases_flattenedKeys).forEach(([eKey, eVal]) => {
        flattenedKeys_aliasPlaceholdersSets__map
          .get(eVal)
          .add(`${$COMMENT}#${eKey}`);
      });

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

              const originalKey =
                composedValues_originalKeys[propValueNode.value] ||
                aliasValues_originalKeys[propValueNode.value] ||
                regularValuesOnly_originalKeys[propValueNode.value];

              if (originalKey) {
                const placeholder = `${$COMMENT}#${originalKey}`;

                const sourceCode = context.sourceCode;
                const commentsAfter =
                  sourceCode.getCommentsAfter(propValueNode);

                let hasExistingPlaceholder = commentsAfter.some((comment) =>
                  comment.value.includes(placeholder)
                );

                // now so aliases are recognized and not prefixed
                let hasExistingAliasPlaceholder = false;

                // this should actually be only for aliases
                if (aliasValues_originalKeys[propValueNode.value]) {
                  const aliasPlaceholdersSet =
                    flattenedKeys_aliasPlaceholdersSets__map.get(originalKey);

                  if (aliasPlaceholdersSet) {
                    const aliasPlaceholdersArray = [...aliasPlaceholdersSet];

                    hasExistingAliasPlaceholder = commentsAfter.some(
                      (comment) =>
                        aliasPlaceholdersArray.some((aliasPlaceholder) =>
                          comment.value.includes(aliasPlaceholder)
                        )
                    );
                  }
                }

                // and now you can leave aliases alone
                if (!hasExistingPlaceholder && !hasExistingAliasPlaceholder) {
                  const data = {
                    [placeholderDataId]: JSON.stringify({
                      value: propValueNode.value,
                      filePath: context.filename,
                      loc: propValueNode.loc,
                    }),
                  };

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
            }
          }
        },
      };
    }
  },
};

export default rule; // extract-object-string-literal-values
