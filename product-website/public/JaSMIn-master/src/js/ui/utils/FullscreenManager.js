import { EventDispatcher } from '../../utils/EventDispatcher.js';
import { UIUtil } from '../../utils/UIUtil.js';


/**
 * @enum {string}
 */
export const FullscreenManagerEvents = {
  CHANGE: 'change',
};

/**
 * Helper class for managinf fullscreen modi.
 *
 * @author Stefan Glaser
 */
class FullscreenManager extends EventDispatcher
{
  /**
   * FullscreenManager Constructor.
   *
   * ::implements {IPublisher}
   * ::implements {IEventDispatcher}
   * @param {!Element} container the container of interest
   */
  constructor (container)
  {
    super();

    /**
     * The container of interest.
     * @type {!Element}
     */
    this.container = container;


    /**
     * The change event.
     * @type {!Object}
     */
    this.changeEvent = { type: FullscreenManagerEvents.CHANGE };


    /** @type {!Function} */
    this.handleFullscreenChangeListener = this.handleFullscreenChange.bind(this);


    // Add fullscreen change listeners
    document.addEventListener('fullscreenchange', this.handleFullscreenChangeListener);
    document.addEventListener('mozfullscreenchange', this.handleFullscreenChangeListener);
    document.addEventListener('msfullscreenchange', this.handleFullscreenChangeListener);
    document.addEventListener('webkitfullscreenchange', this.handleFullscreenChangeListener);
  }

  /**
   * Toggle fullscreen mode of container.
   * @return {void}
   */
  toggleFullscreen ()
  {
    if (this.container === UIUtil.getFullscreenElement()) {
      UIUtil.cancelFullscreen();
    } else {
      UIUtil.requestFullscreenFor(this.container);
    }

    // Publish change event
    this.dispatchEvent(this.changeEvent);
  }

  /**
   * Request fullscreen mode for container.
   * @return {void}
   */
  requestFullscreen ()
  {
    if (this.container !== UIUtil.getFullscreenElement()) {
      UIUtil.requestFullscreenFor(this.container);

      // Publish change event
      this.dispatchEvent(this.changeEvent);
    }
  }

  /**
   * Cancel fullscreen mode for container.
   * @return {void}
   */
  cancelFullscreen ()
  {
    if (this.container === UIUtil.getFullscreenElement()) {
      UIUtil.cancelFullscreen();

      // Publish change event
      this.dispatchEvent(this.changeEvent);
    }
  }

  /**
   * Check if the container is currently in fullscreen mode.
   * @return {boolean} true, if in fullscreen mode, false otherwise
   */
  isFullscreen ()
  {
    return this.container === UIUtil.getFullscreenElement();
  }

  /**
   * The callback triggered when the window enters / leaves fullscreen.
   *
   * @param  {!Object} event the event
   * @return {void}
   */
  handleFullscreenChange (event)
  {
    // Publish change event
    this.dispatchEvent(this.changeEvent);
  }
}

export { FullscreenManager };
