module.exports = {
  db: {
    client: 'pg',
    connection: {
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
    },
  },
  port: '9999',
  /* These secret is used for signing cookies. They *must* be changed on a
   * production server.
   */
  secrets: ['secret-key'],
};
