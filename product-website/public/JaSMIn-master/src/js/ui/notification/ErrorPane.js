import { Panel } from '../components/Panel.js';
import { UIUtil } from '../../utils/UIUtil.js';

/**
 * The ErrorOverlay class definition.
 *
 * @author Stefan Glaser
 */
class ErrorOverlay extends Panel
{
  /**
   * ErrorOverlay Constructor
   */
  constructor ()
  {
    super('jsm-error-pane full-size');

    // Create title label
    this.domElement.appendChild(UIUtil.createSpan('Error...', 'title'));

    /**
     * The error message label.
     * @type {!Element}
     */
    this.errorLbl = UIUtil.createSpan('n/a', 'error');
    this.domElement.appendChild(this.errorLbl);
  }

  /**
   * Set the error message to display and show/hide the component.
   *
   * @param {string=} message the error message to display, or undefined to clear the last error and hide the component
   */
  setErrorMessage (message)
  {
    if (message === undefined) {
      this.setVisible(false);
    } else {
      this.errorLbl.innerHTML = message;

      this.setVisible(true);
    }
  }
}

export { ErrorOverlay };
