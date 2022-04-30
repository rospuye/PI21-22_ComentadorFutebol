import { UIUtil } from '../../utils/UIUtil.js';

class Panel
{
  /**
   * Panel Constructor
   *
   * @param {string=} className the css class string
   */
  constructor (className)
  {
    /**
     * The component root element.
     * @type {!Element}
     */
    this.domElement = UIUtil.createDiv(className);

    /**
     * Visibility change listener
     * @type {!Function | undefined}
     */
    this.onVisibilityChanged = undefined;
  }

  /**
   * Add (append) the given element to the panel.
   *
   * @param {!Element} element the element to add/append
   */
  appendChild (element)
  {
    this.domElement.appendChild(element);
  }

  /**
   * Set this component visible or invisible.
   *
   * @param {boolean=} visible true for visible, false for invisible
   */
  setVisible (visible)
  {
    if (visible === undefined) {
      visible = true;
    }

    const isVisible = UIUtil.isVisible(this.domElement);

    if (isVisible !== visible) {
      UIUtil.setVisibility(this.domElement, visible);
      if (this.onVisibilityChanged) {
        this.onVisibilityChanged(this);
      }
    }
  }

  /**
   * Toggle visibility of panel.
   */
  toggleVisibility ()
  {
    const newVal = !UIUtil.isVisible(this.domElement);

    UIUtil.setVisibility(this.domElement, newVal);
      if (this.onVisibilityChanged) {
        this.onVisibilityChanged(this);
      }
  }

  /**
   * Check if this component is currently visible.
   *
   * @return {boolean} true for visible, false for invisible
   */
  isVisible ()
  {
    return UIUtil.isVisible(this.domElement);
  }
}

export { Panel };
