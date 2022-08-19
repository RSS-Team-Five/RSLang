const config = {
  API: {
    URL: 'http://host1836051.hostland.pro',
    ENDPOINTS: {
      USERS: 'users',
      SIGNIN: 'signin',
      WORDS: 'words',
    },
    QUERIES: {
      WORDS: {
        GROUP: 'group',
        PAGE: 'page',
      },
    },
  },
  book: {
    maxGroup: 6,
    maxPage: 30,
  },
  DEFAULT_HEADERS: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
};

export default config;
