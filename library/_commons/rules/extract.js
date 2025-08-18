import {
  placeholderMessageId,
  placeholderDataId,
  commentVariablesPluginName,
  extractRuleName,
  $COMMENT,
} from "../constants/bases.js";
import { makeIsolatedStringRegex } from "../utilities/helpers.js";

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
          findInstancesInConfig: {
            type: "object",
            properties: {
              placeholder: {
                type: "string",
              },
              key: {
                type: "string",
              },
              valueLocation: {
                type: "object",
                properties: {
                  value: { type: "string " },
                  filePath: { type: "string " },
                  loc: {
                    type: "object",
                    properties: {
                      start: {
                        type: "object",
                        properties: {
                          column: { type: "number" },
                          line: { type: "number" },
                        },
                        additionalProperties: false,
                      },
                      end: {
                        type: "object",
                        properties: {
                          column: { type: "number" },
                          line: { type: "number" },
                        },
                        additionalProperties: false,
                      },
                    },
                    additionalProperties: false,
                  },
                },
              },
            },
            required: ["placeholder", "key", "valueLocation"],
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
              findInstancesInConfig: { not: {} },
            },
          },
          {
            // only composedVariablesOnly (true or false)
            properties: {
              composedVariablesOnly: { type: "boolean" },
              makePlaceholders: { not: {} }, // must be undefined/missing
              findInstancesInConfig: { not: {} }, // must be undefined/missing
            },
            required: ["composedVariablesOnly"],
          },
          {
            // only makePlaceholders
            properties: {
              makePlaceholders: { type: "object" },
              composedVariablesOnly: { not: {} }, // must be undefined/missing
              findInstancesInConfig: { not: {} }, // must be undefined/missing
            },
            required: ["makePlaceholders"],
          },
          {
            // only findInstancesInConfig
            properties: {
              findInstancesInConfig: { type: "object" },
              composedVariablesOnly: { not: {} }, // must be undefined/missing
              makePlaceholders: { not: {} }, // must be undefined/missing
            },
            required: ["findInstancesInConfig"],
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
    const findInstancesInConfig = options.findInstancesInConfig;

    // as a measure of caution, returns early if both composedVariablesOnly && makePlaceholders are defined/truthy
    if (composedVariablesOnly && makePlaceholders && findInstancesInConfig)
      return {};

    if (!composedVariablesOnly && !makePlaceholders && !findInstancesInConfig) {
      /* case 1 */
      return {
        ObjectExpression: (node) => {
          for (const prop of node.properties) {
            if (
              prop.type === "Property" &&
              prop.value &&
              prop.value.type === "Literal" &&
              typeof prop.value.value === "string" &&
              // ignores multilined literal string values
              !prop.value.raw.includes("\\\n") &&
              !prop.value.raw.includes("\\\r") && // old MacOS style
              !prop.value.raw.includes("\\\r\n") // Windows style
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

    if (findInstancesInConfig) {
      /* case 4 */
      const { placeholder, key, valueLocation } = findInstancesInConfig;

      return {
        ObjectExpression: (node) => {
          for (const prop of node.properties) {
            if (
              prop.type === "Property" &&
              prop.value &&
              prop.value.type === "Literal" &&
              typeof prop.value.value === "string" &&
              // if the encounter instance isn't on the same line as would be its generated placeholder
              prop.value.loc.end.line !== valueLocation.loc.end.line
            ) {
              const propValueNode = prop.value;

              if (
                propValueNode.value === key // for alias variables
              ) {
                const data = {
                  [placeholderDataId]: JSON.stringify({
                    value: propValueNode.value,
                    filePath: context.filename,
                    loc: {
                      ...propValueNode.loc,
                      end: {
                        ...propValueNode.loc.end,
                        column: propValueNode.loc.end.column - 2,
                      }, // no idea what that substraction is specifically needed
                    },
                  }),
                };

                context.report({
                  node: propValueNode,
                  messageId: placeholderMessageId,
                  data,
                });
              } else if (
                makeIsolatedStringRegex(placeholder).test(
                  propValueNode.value // for segments in composed variables
                )
              ) {
                const matches = [
                  ...propValueNode.value.matchAll(
                    makeIsolatedStringRegex(placeholder)
                  ),
                ];

                const positions = matches.map((match) => ({
                  match: match[0],
                  start: match.index,
                  end: match.index + match[0].length,
                }));

                positions.forEach((e) => {
                  const loc = {
                    ...propValueNode.loc,
                    start: {
                      ...propValueNode.loc.start,
                      column: propValueNode.loc.start.column + e.start,
                    },
                    end: {
                      ...propValueNode.loc.end,
                      column: propValueNode.loc.start.column + e.end,
                    },
                  };

                  const data = {
                    [placeholderDataId]: JSON.stringify({
                      value: e.match,
                      filePath: context.filename,
                      loc,
                    }),
                  };

                  context.report({
                    loc,
                    messageId: placeholderMessageId,
                    data,
                  });
                });
              }
            }
          }
        },
      };
    }
  },
};

export default rule; // extract-object-string-literal-values

/** $COMMENT#JSDOC#CONSTANTS#EXTRACTRULECONFIGDATA */
export const extractRuleConfigData = Object.freeze({
  pluginName: commentVariablesPluginName,
  ruleName: extractRuleName,
  rule,
}); // the name could eventually be changed because it's function-sounding
