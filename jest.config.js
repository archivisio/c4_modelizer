export default {
  roots: ["<rootDir>"],
  preset: "ts-jest",
  moduleNameMapper: {
    "^@components/(.*)$": "<rootDir>/src/components/$1",
    "^@assets/(.*)$": "<rootDir>/src/assets/$1",
    "^@contexts/(.*)$": "<rootDir>/src/contexts/$1",
    "^@data/(.*)$": "<rootDir>/src/data/$1",
    "^@hooks/(.*)$": "<rootDir>/src/hooks/$1",
    "^@icons/(.*)$": "<rootDir>/src/icons/$1",
    "^@locales/(.*)$": "<rootDir>/src/locales/$1",
    "^@store/(.*)$": "<rootDir>/src/store/$1",
    "^@interfaces/(.*)$": "<rootDir>/src/types/$1",
    "^@utils/(.*)$": "<rootDir>/src/utils/$1",
    "^@plugins/(.*)$": "<rootDir>/src/plugins/$1",
    "^@slots/(.*)$": "<rootDir>/src/slots/$1",
  },
  transform: {
    ".+\\.(css|less|sass|scss|png|jpg|gif|ttf|woff|woff2|svg)$":
      "jest-transform-stub",
    "^.+\\.(ts|tsx)$": [`ts-jest`, { tsconfig: 'tsconfig.app.json' }]
  },
};
