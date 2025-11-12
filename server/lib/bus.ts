/**
 * Brazukas Delivery - Event Bus
 * Sistema de eventos para comunicação em tempo real
 */

type EventHandler = (data: any) => void;

class EventBus {
  private listeners: Map<string, EventHandler[]> = new Map();

  on(event: string, handler: EventHandler): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(handler);
  }

  off(event: string, handler: EventHandler): void {
    const handlers = this.listeners.get(event);
    if (!handlers) return;

    const index = handlers.indexOf(handler);
    if (index > -1) {
      handlers.splice(index, 1);
    }
  }

  emit(event: string, data: any): void {
    const handlers = this.listeners.get(event);
    if (!handlers) return;

    handlers.forEach((handler) => {
      try {
        handler(data);
      } catch (err) {
        console.error(`Error in event handler for ${event}:`, err);
      }
    });
  }

  once(event: string, handler: EventHandler): void {
    const wrapper = (data: any) => {
      handler(data);
      this.off(event, wrapper);
    };
    this.on(event, wrapper);
  }

  clear(event?: string): void {
    if (event) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
  }
}

// Singleton
const bus = new EventBus();

export default bus;
