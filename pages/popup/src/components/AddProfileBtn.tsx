import { Button } from '@extension/ui/components/button';
import { PlusIcon } from '@extension/ui/components/icon';
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
    <Button
      className="flex items-center gap-1 border border-zinc-500 rounded-md px-2 py-1"
      onClick={() => removeCookie(addNewSlot)}>
      <PlusIcon className="size-4" />
      Add profile
    </Button>
  );
};

export default AddProfileBtn;
