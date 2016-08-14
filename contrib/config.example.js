module.exports = {
  db: {
    client: 'sqlite3',
    connection: {
      filename: 'whodunnit.db',
    },
  },
  port: '9999',
  /* These secret is used for signing cookies. They *must* be changed on a
   * production server.
   */
  secrets: ['secret-key'],
};
