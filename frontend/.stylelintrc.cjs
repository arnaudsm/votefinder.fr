module.exports = {
  extends: 'stylelint-config-standard-scss',
  rules: {
    // Custom rules
    'no-descending-specificity': null,
    'color-function-notation': 'legacy',

    // MUI rules
    'alpha-value-notation': null,
    'custom-property-pattern': null,
    'media-feature-range-notation': null,
    'no-empty-source': null,
    'selector-class-pattern': null,
    'string-no-newline': null, // not compatible with prettier
    'value-keyword-case': null,
  }
}
