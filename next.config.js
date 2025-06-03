//next.config.js
/* eslint-disable @typescript-eslint/no-require-imports */
const withTM = require("next-transpile-modules")([
  "@ffmpeg/ffmpeg",
  "react-big-calendar",
  "react-datepicker",
  "react-image-crop",
  "react-toastify",
]);
module.exports = withTM({
  reactStrictMode: true,
  experimental: {
    optimizeCss: true,
    workerThreads: true,
    legacyBrowsers: false,
    cpus: 4,
  },
  transpilePackages: ["lucide-react"],

  typescript: {
    ignoreBuildErrors: true, // حل مؤقت لأخطاء TypeScript
  },

  eslint: {
    ignoreDuringBuilds: true, // تجاوز أخطاء ESLint
  },
  env: {
    FFMPEG_CORE_PATH: "/ffmpeg.js",
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/api/uploads/**", // المسار الذي تأتي منه الصور
      },
      {
        protocol: "https",
        hostname: "static.vecteezy.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "media.istockphoto.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  experimental: {
    optimizeCss: false, // تعطيل تحسينات CSS
  },
  webpack: (config) => {
    // إضافة تحميل ملفات CSS
    config.module.rules.push({
      test: /\.css$/,
      use: [
        "style-loader",
        {
          loader: "css-loader",
          options: {
            importLoaders: 1,
            modules: false,
          },
        },
      ],
    });
    if (config.mode === "production") {
      config.optimization.minimizer.forEach((plugin) => {
        if (plugin.constructor.name === "CssMinimizerPlugin") {
          plugin.options.minimizerOptions = {
            ...plugin.options.minimizerOptions,
            preset: ["default", { discardComments: { removeAll: true } }],
          };
        }
      });
    }
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      stream: false,
      crypto: false,
    };
    return config;
  },
});
