import { useEffect, useState } from 'react';

const useUrlChange = (onUrlChange: (newUrl: string) => void) => {
  const [currentUrl, setCurrentUrl] = useState(window.location.href);

  useEffect(() => {
    // Effect to run when currentUrl changes
    onUrlChange(currentUrl);
  }, [currentUrl]); // Add currentUrl and onUrlChange to dependency array

  useEffect(() => {
    let lastUrl = window.location.href;

    const checkUrlChange = () => {
      const newUrl = window.location.href;
      if (newUrl !== lastUrl) {
        lastUrl = newUrl; // Update the last known URL
        setCurrentUrl(newUrl); // Update state, triggering the effect
      }
    };

    // Use MutationObserver to monitor changes in the DOM
    const observer = new MutationObserver(() => {
      checkUrlChange();
    });

    // Start observing the body or the root element for changes
    observer.observe(document.body, { childList: true, subtree: true });

    // Optional: Check for URL change on page load
    window.addEventListener('popstate', checkUrlChange);

    // Cleanup observer and event listener on unmount
    return () => {
      observer.disconnect();
      window.removeEventListener('popstate', checkUrlChange);
    };
  }, []);

  return currentUrl; // Return the current URL if needed
};

export default useUrlChange;
