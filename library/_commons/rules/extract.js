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
          // documentConfigData
          // type "object" (Record<string, string>) (optional)
          // passed object are the original and ... I'm gonna need a reversedOriginalFlattenedConfigData
          // default: null
        },
        additionalProperties: false,
      },
    ],
    messages: {
      [placeholderMessageId]: `{{ ${placeholderDataId} }}`,
    },
  },
  create: (context) => {
    const options = context.options[0] || {};
    const composedVariablesOnly = options.composedVariablesOnly ?? false;

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

            // const commentAfter =
            //   context.sourceCode.getCommentsAfter(propValueNode)[0];

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
              fix: undefined, // documentConfigData ?
              // (fixer) => fixer.insertTextAfterRange(node.range, ` /* this */`) : undefined
            });
          }
        }
      },
    };
  },
};

export default rule; // extract-object-string-literal-values
