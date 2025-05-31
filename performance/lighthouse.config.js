module.exports = {
  extends: 'lighthouse:default',
  settings: {
    onlyAudits: [
      'first-contentful-paint',
      'largest-contentful-paint',
      'first-meaningful-paint',
      'speed-index',
      'screenshot-thumbnails',
      'final-screenshot',
      'estimated-input-latency',
      'total-blocking-time',
      'max-potential-fid',
      'cumulative-layout-shift',
      'server-response-time',
      'interactive',
      'user-timings',
      'critical-request-chains',
      'redirects',
      'uses-responsive-images',
      'offscreen-images',
      'render-blocking-resources',
      'unminified-css',
      'unminified-javascript',
      'unused-css-rules',
      'uses-optimized-images',
      'uses-text-compression',
      'uses-rel-preconnect',
      'font-display',
      'third-party-summary',
      'accessibility',
      'best-practices',
      'seo'
    ],
  },
  audits: [
    'metrics/first-contentful-paint',
    'metrics/largest-contentful-paint',
    'metrics/cumulative-layout-shift',
    'metrics/total-blocking-time'
  ],
  categories: {
    performance: {
      title: 'Performance',
      auditRefs: [
        {id: 'first-contentful-paint', weight: 3, group: 'metrics'},
        {id: 'largest-contentful-paint', weight: 25, group: 'metrics'},
        {id: 'total-blocking-time', weight: 25, group: 'metrics'},
        {id: 'cumulative-layout-shift', weight: 25, group: 'metrics'},
        {id: 'speed-index', weight: 10, group: 'metrics'},
      ]
    }
  }
}