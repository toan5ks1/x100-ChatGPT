import { type Slot } from '../../types';
import { type ILocalStorage, LocalStorage } from '../base/localStorage';
import { SlotsManipulatorService } from '../service/slotsManipulatorService';

export class SlotStorage {
  private static SLOTS = 'SLOTS';
  static storage: ILocalStorage = new LocalStorage();

  static async getAllSlots(): Promise<Slot[]> {
    try {
      const slots = await this.storage.load(this.SLOTS);
      if (Array.isArray(slots)) {
        return slots as Slot[];
      }
    } catch (e) {
      return [];
    }
    return [];
  }

  static async setAllSlots(slots: Slot[]): Promise<Slot[]> {
    await this.storage.save(this.SLOTS, slots);
    return slots;
  }

  static async getSelectedSlot(): Promise<Slot> {
    const slots = await this.getAllSlots();
    const selectedSlot = SlotsManipulatorService.getSelectedSlot(slots);
    if (selectedSlot) {
      return selectedSlot;
    }
    const notFoundError = new Error();
    notFoundError.name = 'Not found selected slot';
    notFoundError.message = 'Check selected slot.';
    throw notFoundError;
  }

  static async getSlotById(id: string): Promise<Slot> {
    const slots = await this.getAllSlots();
    const selectedSlot = SlotsManipulatorService.getSlotById(slots, id);
    if (selectedSlot) {
      return selectedSlot;
    }
    const notFoundError = new Error();
    notFoundError.name = 'Not found selected slot';
    notFoundError.message = 'Check selected slot.';
    throw notFoundError;
  }

  static async addSlot(slot: Omit<Slot, 'isSelected'>): Promise<Slot[]> {
    const slots: Slot[] = await this.getAllSlots();
    const newSlot: Slot = { ...slot, isSelected: slots.length === 0 };
    const isSlotExist = slots.find(_slot => _slot.id === slot.id);
    const finalSlots = isSlotExist?.id
      ? SlotsManipulatorService.updateSlot(slots, newSlot)
      : SlotsManipulatorService.addSlot(slots, newSlot);
    await this.storage.save(this.SLOTS, finalSlots);
    return finalSlots;
  }

  static async updateSlot(slot: Slot): Promise<Slot[]> {
    const slots = await this.getAllSlots();
    const updatedSlots = SlotsManipulatorService.updateSlot(slots, slot);
    await this.storage.save(this.SLOTS, updatedSlots);
    return updatedSlots;
  }

  static async deleteSlot(slotId: string): Promise<Slot[]> {
    const slots = await this.getAllSlots();
    const deletedSlots = SlotsManipulatorService.deleteSlot(slots, slotId);
    await this.storage.save(this.SLOTS, deletedSlots);
    return deletedSlots;
  }
}
