import { Panel } from '../components/Panel.js';
import { UIUtil } from '../../utils/UIUtil.js';
import { GameLogLoader, GameLogLoaderEvents } from '../../model/game/loader/GameLogLoader.js';

/**
 * The LoadingBar class definition.
 *
 * @author Stefan Glaser
 */
class LoadingBar extends Panel
{
  /**
   * LoadingBar Constructor
   *
   * @param {!GameLogLoader} gameLogLoader the game log loader instance
   */
  constructor(gameLogLoader) {
    super('jsm-loading-bar');

    /**
     * The game log loader instance.
     * @type {!GameLogLoader}
     */
    this.gameLogLoader = gameLogLoader;

    /**
     * The progress label.
     * @type {!Element}
     */
    this.progressBar = document.createElement('div');
    this.progressBar.style.width = '0px';
    this.domElement.appendChild(this.progressBar);

    /**
     * The progress label.
     * @type {!Element}
     */
    this.label = document.createElement('span');
    this.label.innerHTML = '0 / 0 KB';
    this.domElement.appendChild(this.label);


    // By default hide the loading bar
    this.setVisible(false);



    /** @type {!Function} */
    this.handleLoadStartListener = this.handleLoadStart.bind(this);
    /** @type {!Function} */
    this.handleLoadProgressListener = this.handleLoadProgress.bind(this);
    /** @type {!Function} */
    this.handleLoadEndListener = this.handleLoadEnd.bind(this);

    // Add game log loader event listeners
    this.gameLogLoader.addEventListener(GameLogLoaderEvents.START, this.handleLoadStartListener);
    this.gameLogLoader.addEventListener(GameLogLoaderEvents.PROGRESS, this.handleLoadProgressListener);
    this.gameLogLoader.addEventListener(GameLogLoaderEvents.FINISHED, this.handleLoadEndListener);
    this.gameLogLoader.addEventListener(GameLogLoaderEvents.ERROR, this.handleLoadEndListener);
  }

  /**
   * GameLogLoader->"start" event listener.
   * This event listener is triggered when loading a new game log file has started.
   *
   * @param {!Object} evt the event object
   */
  handleLoadStart (evt)
  {
    // Reset labels and progress bar
    this.progressBar.style.width = '0%';
    this.label.innerHTML = '0 / 0 MB';

    // Ensure loading bar is visible
    this.setVisible(true);
  }

  /**
   * GameLogLoader->"progress" event listener.
   * This event listener is triggered when new data was received.
   *
   * @param {!Object} evt the event object
   */
  handleLoadProgress (evt)
  {
    this.setProgress(100 * evt.loaded / evt.total, evt.loaded / 1000000, evt.total / 1000000);
  }

  /**
   * GameLogLoader->"finished"|"error" event listener.
   * This event listener is triggered when loading a new game log file has terminated.
   *
   * @param {!Object} evt the event object
   */
  handleLoadEnd (evt)
  {
    // Hide loading bar on load end
    this.setVisible(false);
  }

  /**
   * The callback triggered when a new replay file is loaded.
   *
   * @param  {number} percent the loaded percentage
   * @param  {number} loadedMB the MBs loaded
   * @param  {number} totalMB the total MBs to load
   * @return {void}
   */
  setProgress (percent, loadedMB, totalMB)
  {
    this.progressBar.style.width = '' + percent.toFixed(1) + '%';
    this.label.innerHTML = '' + loadedMB.toFixed(3) + ' / ' + totalMB.toFixed(3) + ' MB';
  }
}

export { LoadingBar };
