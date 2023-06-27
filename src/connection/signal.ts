type Listener<T extends unknown[]> = (...args: T) => void

/**
 * A signal is an event emitter that supports registering a listener and
 * dispatching an event to each registered listener.
 */
export class Signal<T extends unknown[]> {
  private _id = 0
  private _listeners: { [key: string]: Listener<T> } = {}

  dispatch(...args: T) {
    for (const key in this._listeners) {
      this._listeners[key](...args)
    }
  }

  attach(listener: Listener<T>) {
    if (typeof listener !== 'function') {
      throw new Error('listener function expected')
    }
    const id = this._id++
    this._listeners[id] = listener
    // return function that'll detach the listener
    return () => delete this._listeners[id]
  }
}
