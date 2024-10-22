import { createRoot } from 'react-dom/client';
import App from '@src/App';
import tailwindcssOutput from '../dist/tailwind-output.css?inline';

const EXTENSION_ROOT_ID = 'chrome-extension-sorry-gpt-4o';

function injectUI() {
  if (!document.getElementById(EXTENSION_ROOT_ID)) {
    console.log('Injecting content UI...');
    const root = document.createElement('div');
    root.id = EXTENSION_ROOT_ID;
    document.body.appendChild(root);

    const rootIntoShadow = document.createElement('div');
    rootIntoShadow.id = 'shadow-root';
    const shadowRoot = root.attachShadow({ mode: 'open' });

    if (navigator.userAgent.includes('Firefox')) {
      const styleElement = document.createElement('style');
      styleElement.innerHTML = tailwindcssOutput;
      shadowRoot.appendChild(styleElement);
    } else {
      const globalStyleSheet = new CSSStyleSheet();
      globalStyleSheet.replaceSync(tailwindcssOutput);
      shadowRoot.adoptedStyleSheets = [globalStyleSheet];
    }

    shadowRoot.appendChild(rootIntoShadow);
    createRoot(rootIntoShadow).render(<App />);
  }
}

// Monitor the DOM to detect removal of your UI
const observer = new MutationObserver(mutations => {
  mutations.forEach(() => {
    const isRootRemoved = !document.getElementById(EXTENSION_ROOT_ID);
    if (isRootRemoved) {
      console.log('Content UI removed, reinjecting...');
      injectUI(); // Reinject the UI if removed
    }
  });
});

// Start observing the entire body for changes
observer.observe(document.body, {
  childList: true,
  subtree: true, // Monitor nested changes
});

injectUI();

function injectUIWithRetries(retries = 3) {
  if (!document.getElementById(EXTENSION_ROOT_ID)) {
    console.log('Injecting content UI...');
    injectUI();
  } else {
    console.log('Content UI already exists.');
  }

  // Retry injection every second if needed
  if (retries > 0) {
    setTimeout(() => injectUIWithRetries(retries - 1), 100);
  }
}

injectUIWithRetries(); // Start the injection process
