import { EventDispatcher } from '../utils/EventDispatcher.js';
import { LogPlayer, LogPlayerEvents } from './logplayer/LogPlayer.js';
import { MonitorSettings } from './settings/MonitorSettings.js';
import { Playlist } from './logplayer/Playlist.js';
import { World } from './gl/world/World.js';
import { FileUtil } from '../utils/FileUtil.js';

/**
 * The monitor model event type enum.
 * @enum {string}
 */
export const MonitorModelEvents = {
  STATE_CHANGE: 'state-change',
};

/**
 * The monitor model state/mode enum.
 * @enum {string}
 */
export const MonitorStates = {
  INIT: 'init',
  REPLAY: 'replay',
  STREAM: 'stream',
  LIVE: 'live'
};

/**
 * The MonitorModel definition.
 *
 * @author Stefan Glaser
 */
class MonitorModel extends EventDispatcher
{
  /**
   * MonitorModel Constructor
   *
   * ::implements {IPublisher}
   * ::implements {IEventDispatcher}
   * @param {boolean} embedded indicator if the monitor is in embedded mode
   */
  constructor (embedded)
  {
    super();

    /**
     * Indicator if the monitor is started in embedded mode.
     * @type {boolean}
     */
    this.embedded = embedded;

    /**
     * The current state of the monitor.
     * @type {!MonitorStates}
     */
    this.state = MonitorStates.INIT;

    /**
     * The various monitor settings.
     * @type {!MonitorSettings}
     */
    this.settings = new MonitorSettings();

    /**
     * The GL world instance.
     * @type {!World}
     */
    this.world = new World();
    this.world.setShadowsEnabled(this.settings.monitorConfig.shadowsEnabled);

    /**
     * The game log player instance.
     * @type {!LogPlayer}
     */
    this.logPlayer = new LogPlayer(this.world, this.settings.monitorConfig);



    /** @type {!Function} */
    this.handleLogPlayerChangeListener = this.handleLogPlayerChange.bind(this);

    // Add log player event listeners
    this.logPlayer.addEventListener(LogPlayerEvents.GAME_LOG_CHANGE, this.handleLogPlayerChangeListener);
    this.logPlayer.addEventListener(LogPlayerEvents.PLAYLIST_CHANGE, this.handleLogPlayerChangeListener);
  }

  /**
   * Set the state of the monitor model.
   *
   * @param {!MonitorStates} newState the new monitor model state
   */
  setState (newState)
  {
    if (this.state === newState) {
      // Already in the "new" state, thus nothing to do
      return;
    }

    const oldState = this.state;
    this.state = newState;

    // Publish state change event
    this.dispatchEvent({
        type: MonitorModelEvents.STATE_CHANGE,
        oldState: oldState,
        newState: newState
      });
  }

  /**
   * Try to load the game log at the specified url.
   *
   * @param {string} url the game log url
   */
  loadGameLog (url)
  {
    this.logPlayer.loadGameLog(url);
  }

  /**
   * Try to load the playlist at the specified url.
   *
   * @param {string} url the playlist url
   */
  loadPlaylist (url)
  {
    this.logPlayer.loadPlaylist(url);
  }

  /**
   * Try to load the given files.
   *
   * @param {!Array<!File>} files a list of local files to load/open
   */
  loadFiles (files)
  {
    // Check for game log file(s) (.replay, .rpl2d, .rpl3d, .rcg)
    //  -> check for single game log file
    //  -> check for multiple game log files (playlist)
    //
    // Check for json file (.json)
    //  -> check for archive definition
    //  -> check for playlist definition
    const gameLogFiles = FileUtil.filterFiles(files, ['.replay', '.rpl2d', '.rpl3d', '.rcg']);
    const jsonFiles = FileUtil.filterFiles(files, ['.json']);

    if (gameLogFiles.length === 1) {
      // Load single game log file
      this.logPlayer.loadGameLogFile(gameLogFiles[0]);
    } else if(gameLogFiles.length > 1) {
      // Create a game log playlist
      const playlist = new Playlist('Local Playlist');
      playlist.addFiles(gameLogFiles);

      this.logPlayer.setPlaylist(playlist);
    } else if (jsonFiles.length > 0) {
      for (let i = 0; i < jsonFiles.length; i++) {
        // Process json-files individually

      }
    } else if (files.length > 0) {
      alert('Unsupported file type(s)!');
    }
  }

  /**
   * Connect to the given streaming server.
   *
   * @param {string} url the replay streaming server url
   * @return {void}
   */
  connectStream (url)
  {
    throw new Error('MonitorModel::connectStream(): Not implemented yet!');
  }

  /**
   * Connect to a simulation server.
   *
   * @param {string} url the simulation server web-socket url.
   * @return {void}
   */
  connectSimulator (url)
  {
    throw new Error('MonitorModel::connectSimulator(): Not implemented yet!');
  }

  /**
   * LogPlayer->"game-log-change"|"playlist-change" event listener.
   * This event listener is triggered when the game log or the playlist within the player has changed.
   *
   * @param {!Object} evt the event object
   * @return {void}
   */
  handleLogPlayerChange (evt)
  {
    // Make sure the monitor is in replay mode
    this.setState(MonitorStates.REPLAY);
  }
}

export { MonitorModel };
