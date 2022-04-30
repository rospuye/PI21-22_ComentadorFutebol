/**
 * The FPSMeter class definition.
 *
 * @author Stefan Glaser
 */
class FPSMeter
{
  /**
   * FPSMeter Constructor
   *
   * @param {number=} size the history buffer size
   */
  constructor (size)
  {
    if (size === undefined || size < 1) {
      size = 1;
    }

    /**
     * The list of previous fps.
     * @type {!Array<number>}
     */
    this.fpsHistory = [];

    let i = size;
    while (i--) {
      this.fpsHistory.push(0);
    }

    /**
     * The current second.
     * @type {number}
     */
    this.currentSecond = -1;

    /**
     * The fps counter to the current second.
     * @type {number}
     */
    this.currentFPS = 0;

    /**
     * Callback function to call when a new second began.
     * @type {(!Function | undefined)}
     */
    this.onNewSecond = undefined;
  }

  /**
   * Proceed fps counter.
   *
   * @param  {number} time the current time
   * @return {void}
   */
  update (time)
  {
    if (this.currentSecond < 0) {
      this.currentSecond = Math.floor(time);
    } else {
      const newSecond = Math.floor(time);

      if (newSecond > this.currentSecond) {
        // New second started
        // console.log("FPS: " + this.currentFPS);

        // Shift history entries by one
        let i = this.fpsHistory.length - 1;
        while (i--) {
          this.fpsHistory[i + 1] = this.fpsHistory[i];
        }

        this.fpsHistory[0] = this.currentFPS;
        this.currentFPS = 0;

        this.currentSecond = newSecond;

        if (this.onNewSecond !== undefined) {
          this.onNewSecond();
        }
      }
    }

    this.currentFPS++;
  }

  /**
   * Retrieve the fps to the previous second.
   *
   * @return {number} the fps in the previous second
   */
  getMostRecentFPS ()
  {
    return this.fpsHistory[0];
  }
}

export { FPSMeter };
