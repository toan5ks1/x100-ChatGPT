import { type Slot } from '../../types';

export class SlotsManipulatorService {
  static getSlotById(slots: Slot[], id: string): Slot | undefined {
    return slots.find(slot => slot.id === id);
  }

  static addSlot(slots: Slot[], slot: Slot): Slot[] {
    return [...slots, slot];
  }

  static updateSlot(slots: Slot[], slot: Slot): Slot[] {
    return slots.reduce<Slot[]>((previousValue, currentValue) => {
      if (currentValue.id === slot.id) {
        return previousValue.concat(slot);
      }
      return previousValue.concat(currentValue);
    }, []);
  }

  static deleteSlot(slots: Slot[], slotId: string): Slot[] {
    return slots.filter(slot => slot.id !== slotId);
  }
}
