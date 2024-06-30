module.exports = {
  extends: [
    'stylelint-config-standard-scss',
    'stylelint-prettier/recommended',
    'stylelint-config-prettier-scss',
  ],
  rules: {
    'prettier/prettier': true,

    // Custom rules
    'no-descending-specificity': null,

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
