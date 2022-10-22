/* eslint-disable @typescript-eslint/no-var-requires */
const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');
const { withSentryConfig } = require('@sentry/nextjs');
const withPWA = require('next-pwa')({
  dest: 'public',
  scope: '/app/',
  disable: process.env.NODE_ENV === 'development',
  dynamicStartUrlRedirect: '/app/',
  reloadOnOnline: false,
  register: false,
  skipWaiting: false,
});

const isSentryEnabled = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const SentryWebpackPluginOptions = {
  // see: https://github.com/getsentry/sentry-webpack-plugin#options.
  silent: true, // Suppresses all logs
};

module.exports = (phase) => {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER;

  let config = withPWA(
    withBundleAnalyzer({
      experimental: { esmExternals: true },
      trailingSlash: true,
      i18n: {
        locales: ['en-US'],
        defaultLocale: 'en-US',
      },
      env: {
        BASE_URL: isDev ? 'http://localhost:3000' : 'https://mdsilo.com',
      },
    })
  );

  if (isSentryEnabled) {
    config = withSentryConfig(config, SentryWebpackPluginOptions);
  }

  return config;
};
