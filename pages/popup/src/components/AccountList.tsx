import { addSlotMessageSendToBackground, createNewChatGPTSlot, getAllSlotsFromBackground } from '@src/action';

const addNewSlot = () => {
  // const newSlot = createNewChatGPTSlot();
  getAllSlotsFromBackground();
  // addSlotMessageSendToBackground(newSlot);
};

export default function AccountListPage() {
  return (
    <>
      <button className={'font-bold mt-4 py-1 px-4 rounded shadow hover:scale-105'} onClick={addNewSlot}>
        Click to send the request get cookies
      </button>
    </>
  );
}
