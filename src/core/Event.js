class Event {
  constructor() {
    this.events = new Map();
  }

  emit(event, ...args) {
    this.events.get(event)?.forEach((callbackSet) => {
      callbackSet.forEach((callback) => callback(...args));
    });
  }

  on(event, caller, callback) {
    let callerMap = this.events.get(event);
    if (!callerMap) {
      callerMap = new Map();
      this.events.set(event, callerMap);
    }

    let callbacks = callerMap.get(caller);
    if (!callbacks) {
      callbacks = new Set();
      callerMap.set(caller, callbacks);
    }

    callbacks.add(callback);

    return { off: () => this.off(event, caller, callback) };
  }

  off(event, caller, callback) {
    this.events.get(event)?.get(caller)?.delete(callback);
    this.cleanUp(caller);
  }

  unsubscribe(caller) {
    this.events.forEach((event) => {
      event.delete(caller);
    });
    this.cleanUp(caller);
  }

  cleanUp(caller) {
    this.events.forEach((callerMap, event) => {
      if (callerMap.get(caller)?.size === 0) callerMap.delete(caller);
      if (callerMap.size === 0) this.events.delete(event);
    });
  }
}

export const event = new Event();
