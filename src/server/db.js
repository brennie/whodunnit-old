/**
 * Determine if the error is a SQL `UNIQUE` constraint violation error.
 *
 * @param {Error} The database error.
 *
 * @returns {boolean} Whether or not the error is a `UNIQUE` constraint
 *          violation error.
 */
export const isUniqueConstraintError = err => {
  if (process.env.NODE_ENV === 'production') {
    /* This is the PostgreSQL error code for `unique_violation`. */
    return err.code === '23505';
  } else {
    return err.code === 'SQLITE_CONSTRAINT';
  }
};
