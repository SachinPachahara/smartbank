/* CORS domains configuration */

const devWhitelist = [
  "http://localhost:3000",
  "http://localhost:5000",
  "http://localhost:5173",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:5000",
  "http://127.0.0.1:5173",
];

const domainsFromEnv = process.env.CORS_DOMAINS || "";

const productionWhitelist = domainsFromEnv
  .split(",")
  .map((item) => item.trim().replace(/\/+$/, ""))
  .filter(Boolean);

const isAllowedOrigin = (origin) => {
  // Allow requests with no origin (mobile apps, curl, server-to-server, postman)
  if (!origin) return true;

  const normalizedOrigin = origin.replace(/\/+$/, "");

  // If wildcards are explicitly allowed in env
  if (productionWhitelist.includes("*")) return true;

  // Check explicit whitelist from CORS_DOMAINS
  if (productionWhitelist.includes(normalizedOrigin)) return true;

  // Automatically allow any Vercel deployment preview / production domain (*.vercel.app)
  if (/^https:\/\/[a-zA-Z0-9-_.]+\.vercel\.app$/.test(normalizedOrigin)) {
    return true;
  }

  // Always allow localhost in dev or testing
  if (
    devWhitelist.includes(normalizedOrigin) ||
    /^http:\/\/localhost:\d+$/.test(normalizedOrigin) ||
    /^http:\/\/127\.0\.0\.1:\d+$/.test(normalizedOrigin)
  ) {
    return true;
  }

  return false;
};

const corsOptions = {
  origin: function (origin, callback) {
    if (isAllowedOrigin(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked for origin: ${origin}`));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

module.exports = {
  corsDevOptions: corsOptions,
  corsProOptions: corsOptions,
};
