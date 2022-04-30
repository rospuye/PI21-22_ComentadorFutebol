import { Panel } from '../components/Panel.js';
import { DnDHandler } from '../utils/DnDHandler.js';
import { UIUtil } from '../../utils/UIUtil.js';

/**
 * The WelcomeOverlay class definition.
 *
 * @author Stefan Glaser
 */
class WelcomeOverlay extends Panel
{
  /**
   * WelcomeOverlay Constructor
   *
   * @param {!DnDHandler} dndHandler the dnd-handler
   */
  constructor (dndHandler)
  {
    super('jsm-welcome-pane full-size');

    /**
     * The dnd handler instance.
     * @type {!DnDHandler}
     */
    this.dndHandler = dndHandler;


    /**
     * The Drag & Drop box for local files.
     * @type {!Element}
     */
    this.dndBox = UIUtil.createDiv('dnd-box');
    this.dndBox.innerHTML = '<span>Drag &amp; Drop Replays or SServer Logs to Play</span>';
    this.appendChild(this.dndBox);

    this.dndHandler.addListeners(this.dndBox);
  }
}

export { WelcomeOverlay };
