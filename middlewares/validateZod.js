export const validateZod =
  (schema, target = 'body') =>
  (req, res, next) => {
    try {
      const data = req[target];
      const result = schema.parse(data);

      if (!result.success) {
        const errors = result.error.issues.map((i) => ({
          path: i.path.join('.'),
          message: i.message,
          code: i.code,
        }));
        return res.status(400).json({ errors });
      }

      req[target] = result.data;
      next();
    } catch (e) {
      console.log(e);
      const errMessage = JSON.parse(e.message);
      const message = errMessage.map((obj) => {
        return { path: obj.path[0], message: obj.message };
      });
      return res.status(400).json(message);
      // next(e);
    }
  };
