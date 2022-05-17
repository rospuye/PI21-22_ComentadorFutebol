import { Panel } from '../components/Panel.js';
import { FPSMeter } from '../../utils/FPSMeter.js';
import { UIUtil } from '../../utils/UIUtil.js';

class GLInfoBoard extends Panel
{
  /**
   * GLInfoBoard Constructor
   *
   * @param {!FPSMeter} fpsMeter the fps meter used by the gl panel
   */
  constructor (fpsMeter)
  {
    super('jsm-gl-info no-text-select');

    /**
     * The FPS meter instance.
     * @type {!FPSMeter}
     */
    this.fpsMeter = fpsMeter;
    this.fpsMeter.onNewSecond = this.handleNewSecond.bind(this);


    const list = document.createElement('ul');
    this.domElement.appendChild(list);

    /**
     * The FPS label.
     * @type {!Element}
     */
    this.fpsLbl = UIUtil.createSpan('0');

    const item = document.createElement('li');
    item.appendChild(UIUtil.createSpan('FPS:', 'label'));
    item.appendChild(this.fpsLbl);
    list.appendChild(item);

    /**
     * The reosultion label.
     * @type {!Element}
     */
    this.resolutionLbl = UIUtil.createSpan('0 x 0px');

    // item = document.createElement('li');
    // item.appendChild(UIUtil.createSpan('Resolution:', 'label'));
    // item.appendChild(this.resolutionLbl);
    // list.appendChild(item);
  }

  /**
   * Set the fps label.
   *
   * @param {number} fps the current fps
   */
  setFPS (fps)
  {
    this.fpsLbl.innerHTML = fps;
  }

  /**
   * Set the fps label.
   *
   * @param {number} width the monitor width
   * @param {number} height the monitor height
   */
  setResolution (width, height)
  {
    this.resolutionLbl.innerHTML = '' + width + ' x ' + height + 'px';
  }

  /**
   * FPSMeter->"onNewSecond" event listener.
   */
  handleNewSecond ()
  {
    this.fpsLbl.innerHTML = this.fpsMeter.fpsHistory[0];
  }
}

export { GLInfoBoard };
