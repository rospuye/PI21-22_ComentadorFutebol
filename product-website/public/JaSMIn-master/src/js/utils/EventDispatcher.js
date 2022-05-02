/**
 * The EventDispatcher class definition.
 *
 * The EventDispatcher is kind of copied from threejs and extended to fit into the google closure environment.
 *
 * @author Stefan Glaser
 */
class EventDispatcher
{
  constructor()
  {
    /**
     * The object for holding all known event observer (listener) instances.
     * @type {?Object}
     */
    this.__event_observers = null;
  }

  /**
   * Add callback function for the given event type.
   *
   * @param {string} type the event type
   * @param {!Function} listener the callback function
   * @return {boolean} true if listener was added, false otherwise
   */
  addEventListener (type, listener)
  {
    // Lazy create listeners holder object
    if (this.__event_observers === null) {
      this.__event_observers = {};
    }
    const listeners = this.__event_observers;

    // Lazy create listener array for specific event
    if (listeners[type] === undefined) {
      listeners[type] = [];
    }

    // Add listener if not yet present
    if (listeners[type].indexOf(listener) === -1) {
      listeners[type].push(listener);
      return true;
    }

    return false;
  }

  /**
   * Remove listener callback funtion from the given event type.
   *
   * @param  {string} type the event name
   * @param  {!Function} listener the callback function
   * @return {boolean}
   */
  removeEventListener (type, listener)
  {
    const listeners = this.__event_observers;

    if (listeners === null) {
      // No listeners defined, thus nothing to do
      return false;
    }

    const listenerArray = listeners[type];

    if (listenerArray !== undefined) {
      const index = listenerArray.indexOf(listener);

      if (index !== -1) {
        listenerArray.splice(index, 1);
        return true;
      }
    }

    return false;
  }

  /**
   * Call to dispatch an event to all registered listeners.
   *
   * @param  {!Object} event the event to dispatch
   * @return {void}
   */
  dispatchEvent (event)
  {
    const listeners = this.__event_observers;

    if (listeners === null) {
      // No listeners defined, thus nothing to do
      return;
    }

    const listenerArray = listeners[event.type];

    if (listenerArray !== undefined) {
      const array = [];

      for (let i = 0; i < listenerArray.length; i++) {
        array[i] = listenerArray[i];
      }

      for (let i = 0; i < array.length; i++) {
        array[i].call(this, event);
      }
    }
  }
}

export { EventDispatcher };
