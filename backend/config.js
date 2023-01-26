const config = {
    db: {
      connectionLimit: 5,
      /* don't expose password or any sensitive info, done only for demo */
      host: "<host>",
      user: "<user>",
      password: "<password>",
      database: "<database>",
      port: "<port>"
    },
    listPerPage: 10,
  };
  module.exports = config;
