export const validateZod =
  (schema, target = 'body') =>
  (req, res, next) => {
    try {
      const data = req[target];
      const parsedData = schema.parse(data);
      // req[target] = parsedData;
      if (target === 'body') req.body = parsedData;
      next();
    } catch (e) {
      console.error(e);

      if (e.name === 'ZodError' && e.issues) {
        const errors = e.issues.map((i) => ({
          // path: i.path.join('.'),
          path: Array.isArray(i.path) ? i.path.join('.') : i.path,
          message: i.message,
        }));
        return res.status(400).json(errors);
      }

      return res
        .status(500)
        .json([
          { path: 'server', message: e.message || 'Internal Server Error' },
        ]);
    }
  };
