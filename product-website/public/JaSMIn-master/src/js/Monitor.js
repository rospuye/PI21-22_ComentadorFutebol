import { MonitorModel } from './model/MonitorModel.js';
import { MonitorParameters } from './MonitorParameters.js';
import { MonitorUI } from './ui/MonitorUI.js';

class Monitor
{
  /**
   * External Monitor API.
   *
   * Embedded vs. Standalone:
   * The player can run in embedded or standalone mode. While the standalone
   * version features full functionality integrated in the player itself, the
   * embedded version only provides the core monitor/player component and
   * expects to be commanded from outside the player component.
   * By default, the player runs in standalone mode. To enable the embedded mode,
   * provide the following parameter to the player:
   * params['embedded'] = true
   *
   * Autoplay:
   * The player can check the address-line parameters for a replay path. If
   * autoplay is enabled, the player will look for a replay file path in the
   * address-line and try to load and play it straight away.
   * params['autoplay'] = true
   *
   *
   *
   * Parameter Object:
   * params['embedded'] = <boolean>
   * params['archives'] = undefined | [{url:<string>, name:<string>}, ...]
   *
   * @param {?Element=} containerElement the parent element of the monitor
   * @param {?Object=} params the parameter object
   */
  constructor (containerElement, params)
  {
    // Fetch a valid root container
    let container = document.body;
    if (containerElement) {
      container = containerElement;

      // Clear player container (to remove placeholders)
      container.innerHTML = '';
    }

    /**
     * Parameter wrapper object.
     * @type {!MonitorParameters}
     */
    const monitorParams = new MonitorParameters(params);

    /**
     * The monitor model.
     * @type {!MonitorModel}
     */
    this.model = new MonitorModel(monitorParams.isEmbedded());

    /**
     * The monitor user interface.
     * @type {!MonitorUI}
     */
    this.ui = new MonitorUI(this.model, container);


    try {
      this.applyParams(monitorParams);
    } catch (ex) {
      console.log('Error while applying monitor parameters!');
    }
  }

  /**
   * Apply the given monitor parameter.
   *
   * @param {!MonitorParameters} params the monitor params
   * @return {void}
   */
  applyParams (params)
  {
    // Add Archives
    const archives = params.getArchives();
    for (let i = 0; i < archives.length; i++) {
      if (archives[i].url && archives[i].name) {
        this.ui.resourceExplorer.archiveExplorer.addLocation(archives[i].url, archives[i].name);
      }
    }


    // Check for resource path parameters
    let url = params.getGameLogURL();
    if (url) {
      // Found game log url
      this.loadGameLog(url);
      this.ui.hideExplorer();
    } else {
      // Check for playlist path parameter
      url = params.getPlaylistURL();

      if (url) {
        this.loadPlaylist(url);
        this.ui.hideExplorer();
      }
    }
  }

  /**
   * Try to load the given files.
   *
   * @param {!Array<!File>} files a list of local files to load/open
   */
  loadFiles (files)
  {
    this.model.loadFiles(files);
  }

  /**
   * Load and play a game log file.
   *
   * @param {string} url the game log file url
   * @return {void}
   */
  loadGameLog (url)
  {
    this.model.loadGameLog(url);
  }

  /**
   * Load a playlist.
   *
   * @param {string} url the playlist url
   * @return {void}
   */
  loadPlaylist (url)
  {
    this.model.loadPlaylist(url);
  }

  /**
   * Connect to the given streaming server and play the replay stream.
   *
   * @param {string} url the replay streaming server url
   * @return {void}
   */
  connectStream (url)
  {
    this.model.connectStream(url);
  }

  /**
   * Connect to a simulation server.
   *
   * @param {string} url the simulation server web-socket url.
   * @return {void}
   */
  connectSimulator (url)
  {
    this.model.connectSimulator(url);
  }

  /**
   * Trigger play/pause command.
   *
   * @return {void}
   */
  playPause ()
  {
    this.model.logPlayer.playPause();
  }

  /**
   * Trigger stop command.
   *
   * @return {void}
   */
  stop () {}

  /**
   * Trigger step command.
   *
   * @param {boolean=} backwards fowrwards/backwards direction indicator (default: forward)
   * @return {void}
   */
  step (backwards)
  {
    this.model.logPlayer.step(backwards);
  }

  /**
   * Trigger jump command.
   *
   * @param {number} stateIdx the state index to jump to. Negative values are interpreted as: (statesArray.length + stateIdx)
   * @return {void}
   */
  jump (stateIdx)
  {
    this.model.logPlayer.jump(stateIdx);
  }

  /**
   * Trigger jump goal command.
   *
   * @param {boolean=} previous next/previous indicator (default: next)
   * @return {void}
   */
  jumpGoal (previous)
  {
    this.model.logPlayer.jumpGoal(previous);
  }
}

export { Monitor };
