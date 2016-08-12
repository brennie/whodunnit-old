import User from '../models/user';


export const getUsers = async (ctx) => {
  const results = await User
    .get(ctx.db);

  ctx.body = {
    count: results.length,
    users: results.map(u => ({
      id: u.id,
      name: u.name,
    })),
  };
};


export const getUser = async (ctx) => {
  const results = await User
    .get(ctx.db)
    .where('id', ctx.params.id);

  if (!results.length) {
    ctx.status = 404;
    ctx.body = {
      error: {
        message: `No user with ID ${ctx.params.id}.`,
      },
    };

    return;
  }

  const result = results[0];

  ctx.body = {
    user: {
      id: result.id,
      name: result.name,
    },
  };
};

export const createUser = async (ctx) => {
  const fields = Object.assign({}, ctx.request.body);
  const errors = User.validate(fields);

  if (errors.size) {
    ctx.status = 400;
    const fields = {};

    for (const [field, messages] of errors.entries()) {
      fields[field] = messages;
    }

    ctx.body = {
      error: {
        message: 'One or more fields contained errors.',
        fields: fields,
      },
    };

    return;
  }

  await User
    .create(ctx.db, fields)
    .then(id => {
      ctx.status = 201;
      ctx.body = {
        user: {
          id: id,
          email: fields.email,
          name: fields.name,
        },
      };
    })
    .catch(err => {
      if (err.code === 'SQLITE_CONSTRAINT') {
        ctx.status = 400;
        ctx.body = {
          error: {
            message: 'One or more fields contained errors.',
            fields: {
              email: ['A user with this e-mail address already exists.'],
            },
          },
        };
      } else {
        ctx.throw();
      }
    });
};
