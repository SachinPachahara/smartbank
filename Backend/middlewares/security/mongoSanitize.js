/**
 * NoSQL Injection Sanitizer Middleware
 * Recursively inspects and cleans req.body, req.query, and req.params
 * by stripping keys that start with '$' or contain '.'
 */
function sanitize(target) {
  if (!target || typeof target !== "object") return target;

  if (Array.isArray(target)) {
    for (let i = 0; i < target.length; i++) {
      target[i] = sanitize(target[i]);
    }
    return target;
  }

  for (const key of Object.keys(target)) {
    if (key.startsWith("$") || key.includes(".")) {
      console.warn(`[Security Alert] Stripped potential NoSQL injection key: ${key}`);
      delete target[key];
    } else if (typeof target[key] === "object" && target[key] !== null) {
      sanitize(target[key]);
    }
  }

  return target;
}

const mongoSanitizeMiddleware = (req, res, next) => {
  if (req.body) sanitize(req.body);
  if (req.query) sanitize(req.query);
  if (req.params) sanitize(req.params);
  next();
};

module.exports = {
  mongoSanitizeMiddleware,
  sanitize,
};
