import { Panel } from './Panel.js';
import { UIUtil } from '../../utils/UIUtil.js';

/**
 * The Overlay class definition.
 *
 * The Overlay abstracts
 *
 * @author Stefan Glaser / http://chaosscripting.net
 */
class Overlay extends Panel
{
  /**
   * Overlay Constructor
   *
   * @param {string=} className the css class string of the inner panel
   * @param {boolean=} hideOnClick true if clicking on inner panel should cause the overlay to close, false if not (default: false)
   */
  constructor (className, hideOnClick)
  {
    super('overlay full-size');

    /**
     * The inner overlay panel.
     * @type {!Element}
     */
    this.innerElement = UIUtil.createDiv(className);
    this.domElement.appendChild(this.innerElement);

    const scope = this;

    /** @param {!Event} event */
    const hideOverlay = function(event) {
      scope.setVisible(false);
      event.stopPropagation();
    };

    // Add mouse and touch listener
    this.domElement.addEventListener('mousedown', hideOverlay);
    this.domElement.addEventListener('ontouchstart', hideOverlay);

    if (!hideOnClick) {
      this.innerElement.addEventListener('mousedown', UIUtil.StopEventPropagationListener);
      this.innerElement.addEventListener('ontouchstart', UIUtil.StopEventPropagationListener);
    }

    this.setVisible(false);
  }
}

export { Overlay };
