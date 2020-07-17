// const NextI18Next = require("next-i18next").default;

// module.exports = new NextI18Next({
//   lng: "en",
//   defaultLanguage: "en",
//   otherLanguages: ["ar"],
//   defaultNS: "common",
//   ns: "translations1234",
//   localePath: "public/translations/",
//   localeStructure: "{{lng}}",
//   strictMode: false,
//   localeSubpaths: {
//     en: "en",
//     ar: "ar",
//   },
//   shallowRender: true,
// });

const NextI18Next = require("next-i18next").default;

const NextI18NextInstance = new NextI18Next({
  lng: "en",
  defaultLanguage: "en",
  otherLanguages: ["ar"],
  defaultNS: "common",
  ns: "common",
  debug: false,
  shallowRender: false,
  keySeparator: false,
  localePath: "public/translations",
  localeSubpaths: true,
  localeStructure: "{{lng}}/{{ns}}",
});

module.exports = NextI18NextInstance;

module.exports = { appWithTranslation, withTranslation } = NextI18NextInstance;
