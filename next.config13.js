const withPlugins = require("next-compose-plugins");
const withCSS = require("@zeit/next-css");
const nextConfig = require("next/config");
const withImages = require("next-images");
const NextI18Next = require("next-i18next").default;
const nextI18NextMiddleware = require("next-i18next/middleware").default;
const nextEnv = require("next-env");
const withNext = require("next");
const path = require("path");
const withNextEnv = nextEnv({
  staticPrefix: "REACT_APP_",
  publicPrefix: "REACT_APP_",
});

module.exports = (config) => {
  return withNext(
    withImages(
      withCSS({
        cssLoaderOptions: {
          url: false,
        },
      })
    )
  );
};

// module.exports = withPlugins(
//   [
//     [
//       withCSS()
//     ]
//     [withImages, {}],
//     [withNextEnv],
//     [
//       new NextI18Next({
//         lng: "en",
//         defaultLanguage: "en",
//         otherLanguages: ["ar"],
//         defaultNS: "common",
//         ns: "common",
//         keySeparator: false,
//         debug: true,
//         localePath: "public/translations/",
//         localeStructure: "{{lng}}/{{ns}}",
//       }),
//     ],
//     [nextI18NextMiddleware],
//   ],
//   nextConfig
// );
