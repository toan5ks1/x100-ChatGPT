import fs from 'node:fs';

const packageJson = JSON.parse(fs.readFileSync('../package.json', 'utf8'));

/**
 * After changing, please reload the extension at `chrome://extensions`
 * @type {chrome.runtime.ManifestV3}
 */
const manifest = {
  manifest_version: 3,
  name: 'SorryGPT-4o',
  version: packageJson.version,
  description: `🚀 The ultimate Chrome extension designed to give you free, legit, and seamless access to GPT-4o (unlimited free tier).`,
  host_permissions: ['*://chatgpt.com/*'],
  permissions: ['storage', 'scripting', 'tabs', 'activeTab', 'cookies', 'webRequest'],
  background: {
    service_worker: 'background.iife.js',
    type: 'module',
  },
  action: {
    default_popup: 'popup/index.html',
    default_icon: 'icon-34.png',
  },
  icons: {
    128: 'icon-128.png',
  },
  content_scripts: [
    {
      matches: ['*://chatgpt.com/*'],
      js: ['content-ui/index.iife.js'],
    },
    {
      matches: ['*://chatgpt.com/*'],
      css: ['content.css'], // public folder
    },
  ],
  web_accessible_resources: [
    {
      resources: ['*.js', '*.css', '*.svg', 'icon-128.png', 'icon-34.png'],
      matches: ['*://*/*'],
    },
  ],
};

export default manifest;
