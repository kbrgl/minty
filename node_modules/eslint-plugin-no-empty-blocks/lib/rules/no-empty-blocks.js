/**
 * @fileoverview Rule to flag use of an empty block statement
 * @author Alex Shnayder
 */

'use strict';

module.exports = function(context) {
  return {
    BlockStatement: function(node) {
      var parent = node.parent,
          parentType = parent.type;


      // Not sure if there is a reason to allow empty finally blocks
      // If ever find one, this will help:

      // var isFinallyBlock = (parentType === 'TryStatement') && (parent.finalizer === node),

      //     // Parent.handlers is deprecated
      //     hasHandler = !!(parent.handler || (parent.handlers && parent.handlers.length));

      // if (isFinallyBlock && !hasHandler) {
      //   return;
      // }


      // If the body is not empty, we can just return immediately
      if (node.body.length !== 0) {
        return;
      }

      // A function is generally allowed to be empty
      if (['FunctionDeclaration', 'FunctionExpression', 'ArrowFunctionExpression'].indexOf(parentType) !== -1) {
        return;
      }

      // If the `allowCatch` option is provided, allow empty catch blocks
      if (context.options[0] === 'allowCatch' && parentType === 'CatchClause') {
        return;
      }

      // Any other block is only allowed to be empty if it contains a comment
      if (context.getComments(node).trailing.length > 0) {
        return;
      }

      context.report(node, 'Empty block statement.');
    },

    SwitchStatement: function(node) {
      if (typeof node.cases === 'undefined' || node.cases.length === 0) {
        context.report(node, 'Empty switch statement.');
      }
    }
  };
};
