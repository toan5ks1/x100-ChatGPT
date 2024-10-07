import { Button } from '@extension/ui/components/button';
import { cookieName, hostUrl } from '@extension/shared/index';

function onError(error: unknown) {
  console.log(`Error removing cookie: ${error}`);
}

function removeCookie(onRemoved: () => void) {
  const removing = chrome.cookies.remove({
    url: hostUrl,
    name: cookieName,
  });
  removing.then(onRemoved, onError);
}

const AddProfileBtn = () => {
  const addNewSlot = () => {
    window.open(hostUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Button variant="outline" onClick={() => removeCookie(addNewSlot)}>
      Add profile
    </Button>
  );
};

export default AddProfileBtn;
