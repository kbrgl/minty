'use strict';

module.exports = {
  rules: {
    'no-empty-blocks': require('./lib/rules/no-empty-blocks')
  },
  rulesConfig: {
    'no-empty-blocks': [2, 'allowCatch']
  }
};
