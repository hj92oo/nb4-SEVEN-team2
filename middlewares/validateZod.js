export const validateZod =
  (schema, target = "body") =>
  (req, res, next) => {
    try {
      const data = req[target];
      const result = schema.safeParse(data);

      if (!result.success) {
        const errors = result.error.issues.map((i) => ({
          path: i.path.join("."),
          message: i.message,
          code: i.code,
        }));
        return res.status(400).json({ errors });
      }

      req[target] = result.data;
      next();
    } catch (e) {
      next(e);
    }
  };