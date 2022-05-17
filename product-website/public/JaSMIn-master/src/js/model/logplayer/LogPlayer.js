import { EventDispatcher } from '../../utils/EventDispatcher.js';
import { GameLog } from '../game/GameLog.js';
import { WorldState } from '../game/WorldState.js';
import { GameLogLoader, GameLogLoaderEvents } from '../game/loader/GameLogLoader.js';
import { MonitorConfiguration } from '../settings/MonitorConfiguration.js';
import { Playlist, PlaylistEvents } from './Playlist.js';
import { PlaylistLoader, PlaylistLoaderEvents } from './PlaylistLoader.js';
import { World } from '../gl/world/World.js';


/**
 * The game log player states enum.
 * @enum {number}
 */
export const LogPlayerStates = {
  EMPTY: 0,
  PAUSE: 1,
  PLAY: 2,
  WAITING: 3,
  END: 4
};

/**
 * the game log player events enum.
 * @enum {string}
 */
export const LogPlayerEvents = {
  STATE_CHANGE: 'state-change',
  TIME_CHANGE: 'time-change',
  GAME_LOG_CHANGE: 'game-log-change',
  GAME_LOG_UPDATED: 'game-log-updated',
  PLAYLIST_CHANGE: 'playlist-change'
};

/**
 * The LogPlayer class definition.
 *
 * The LogPlayer is the central class representing the player logic, etc.
 *
 * @author Stefan Glaser
 */
class LogPlayer extends EventDispatcher
{
  /**
   * LogPlayer Constructor
   *
   * ::implements {IPublisher}
   * ::implements {IEventDispatcher}
   * @param {!World} world the GL world instance
   * @param {!MonitorConfiguration} monitorConfig the monitor configuration
   */
  constructor (world, monitorConfig)
  {
    super();

    /**
     * The game log loader instance.
     * @type {!GameLogLoader}
     */
    this.gameLogLoader = new GameLogLoader();

    /**
     * The playlist loader instance.
     * @type {!PlaylistLoader}
     */
    this.playlistLoader = new PlaylistLoader();

    /**
     * The GL world instance.
     * @type {!World}
     */
    this.world = world;

    /**
     * The monitor configuration instance.
     * @type {!MonitorConfiguration}
     */
    this.monitorConfig = monitorConfig;

    /**
     * The game log instance.
     * @type {?GameLog}
     */
    this.gameLog = null;

    /**
     * The game log playlist instance.
     * @type {?Playlist}
     */
    this.playlist = null;

    /**
     * The index of the currently played entry in the playlist.
     * @type {number}
     */
    this.playlistIndex = -1;

    /**
     * The player state.
     * @type {!LogPlayerStates}
     */
    this.state = LogPlayerStates.EMPTY;

    /**
     * The playback speed.
     * @type {number}
     */
    this.playSpeed = 1;

    /**
     * The current play time.
     * @type {number}
     */
    this.playTime = 0;

    /**
     * The index in the game log state array to the current play time.
     * @type {number}
     */
    this.playIndex = 0;

    /**
     * The number of goals in the passed.
     * @type {number}
     */
    this.passedGoals = 0;

    /**
     * The number of goals in the future.
     * @type {number}
     */
    this.upcomingGoals = 0;

    /**
     * Flag if the world scene should be updated although the player is currently not playing.
     * @type {boolean}
     */
    this.needsUpdate = true;


    /** @type {!Function} */
    this.handleGameLogUpdateListener = this.handleGameLogUpdate.bind(this);
    /** @type {!Function} */
    this.handleNewGameLogListener = this.handleNewGameLog.bind(this);
    /** @type {!Function} */
    this.handleGameLogLoadEndListener = this.handleGameLogLoadEnd.bind(this);

    /** @type {!Function} */
    this.handlePlaylistLoadEndListener = this.handlePlaylistLoadEnd.bind(this);

    /** @type {!Function} */
    this.handlePlaylistIndexChangeListener = this.handlePlaylistIndexChange.bind(this);

    // Add game log loader listers
    this.gameLogLoader.addEventListener(GameLogLoaderEvents.NEW_GAME_LOG, this.handleNewGameLogListener);
    this.gameLogLoader.addEventListener(GameLogLoaderEvents.FINISHED, this.handleGameLogLoadEndListener);
    this.gameLogLoader.addEventListener(GameLogLoaderEvents.ERROR, this.handleGameLogLoadEndListener);

    this.playlistLoader.addEventListener(PlaylistLoaderEvents.FINISHED, this.handlePlaylistLoadEndListener);
    this.playlistLoader.addEventListener(PlaylistLoaderEvents.ERROR, this.handlePlaylistLoadEndListener);
  }

  /**
   * Dispose this player (removes listeners/callbacks from monitor).
   *
   * @return {void}
   */
  dispose ()
  {
    this.setGameLog(null);
    this.setPlaylist(null);
  }

  /**
   * Try loading the game log file at the specified url.
   *
   * @param {string} url the game log file url
   * @return {void}
   */
  loadGameLog (url)
  {
    // Clear playlist
    this.setPlaylist(null);

    this.gameLogLoader.load(url);
  }

  /**
   * Try loading the game log file.
   *
   * @param {!File} file the game log file instance
   * @return {void}
   */
  loadGameLogFile (file)
  {
    // Clear playlist
    this.setPlaylist(null);

    this.gameLogLoader.loadFile(file);
  }

  /**
   * Try loading the playlist at the specified url.
   *
   * @param {string} url the playlist url
   * @return {void}
   */
  loadPlaylist (url)
  {
    this.playlistLoader.load(url);
  }

  /**
   * Try loading the playlist file.
   *
   * @param {!File} file the playlist file instance
   * @return {void}
   */
  loadPlaylistFile (file)
  {
    this.playlistLoader.loadFile(file);
  }

  /**
   * Set the current game log instance.
   *
   * @param {?GameLog} gameLog the new game log instance or null to clear the present one
   * @return {void}
   */
  setGameLog (gameLog)
  {
    if (this.gameLog === gameLog) {
      return;
    }

    if (this.gameLog !== null) {
      if (this.gameLog.onChange === this.handleGameLogUpdateListener) {
        this.gameLog.onChange = undefined;
      }
    }

    this.gameLog = gameLog;

    if (this.gameLog !== null) {
      // Create new World representation
      this.world.create(this.gameLog.type,
                        this.gameLog.environmentParams,
                        this.gameLog.playerParams,
                        this.gameLog.playerTypes,
                        this.gameLog.leftTeam,
                        this.gameLog.rightTeam);

      if (!this.gameLog.fullyLoaded) {
        this.gameLog.onChange = this.handleGameLogUpdateListener;
      }

      // Reset player state
      this.playTime = 0;
      this.playIndex = 0;
      this.updateGoalCounts();
      this.needsUpdate = true;

      // Update playlist index if playlist exists
      if (this.playlist !== null) {
        this.playlistIndex = this.playlist.activeIndex;
      }

      // Reset player state to playing (in case of autoplaying a playlist), or to pausing
      if (this.playlist !== null && this.playlist.autoplay) {
        this.setState(LogPlayerStates.PLAY);
      } else {
        this.setState(LogPlayerStates.PAUSE);
      }
    } else {
      // Reset playlist index
      this.playlistIndex = -1;

      this.setState(LogPlayerStates.EMPTY);
    }

    // Publish change of game log
    this.dispatchEvent({
      type: LogPlayerEvents.GAME_LOG_CHANGE
    });
  }

  /**
   * Set the current playlist instance.
   *
   * @param {?Playlist} list the new playlist instance or null to clear the present one
   * @return {void}
   */
  setPlaylist (list)
  {
    if (this.playlist === list) {
      return;
    }

    if (this.playlist !== null) {
      // Stop listening to the old playlist instance
      this.playlist.removeEventListener(PlaylistEvents.ACTIVE_CHANGE, this.handlePlaylistIndexChangeListener);
    }

    this.playlist = list;

    // Clear current game log instance, reset playlist index and switch player state to EMPTY
    this.setGameLog(null);

    // Publish change of playlist
    this.dispatchEvent({
      type: LogPlayerEvents.PLAYLIST_CHANGE
    });

    if (this.playlist !== null) {
      this.playlist.addEventListener(PlaylistEvents.ACTIVE_CHANGE, this.handlePlaylistIndexChangeListener);

      // Try to play the first playlist entry
      this.playlist.nextEntry();
    }
  }

  /**
   * Set the player state.
   *
   * @param {!LogPlayerStates} newState the new player state
   */
  setState (newState)
  {
    if (this.state === newState) {
      return;
    }

    const oldState = this.state;
    // console.log('LogPlayer state changed from ' + oldState + ' to ' + newState);

    this.state = newState;

    // Every time we change the state, we should at least render once afterwards
    this.needsUpdate = true;

    // Publish state change event
    this.dispatchEvent({
      type: LogPlayerEvents.STATE_CHANGE,
      oldState: oldState,
      newState: newState
    });

    // If we reached the end of a game log, check the playlist for autoplaying
    if (this.state === LogPlayerStates.END &&
        this.playlist !== null &&
        this.playlist.autoplay) {
      // Try to play the next playlist entry
      this.playlist.setActiveIndex(this.playlistIndex + 1);
    }
  }

  /**
   * Set the play time of the player.
   *
   * @param {number} newTime the new play time
   */
  setPlayTime (newTime)
  {
    if (newTime < 0) {
      newTime = 0;
      this.setState(LogPlayerStates.PAUSE);
    } else if (newTime > this.gameLog.duration) {
      newTime = this.gameLog.duration + 0.000005;

      this.setState(this.gameLog.fullyLoaded ? LogPlayerStates.END : LogPlayerStates.WAITING);
    } else if (this.state === LogPlayerStates.END) {
      this.setState(LogPlayerStates.PAUSE);
    } else if (this.state === LogPlayerStates.WAITING) {
      this.setState(LogPlayerStates.PLAY);
    }

    if (this.playTime === newTime) {
      return;
    }

    const oldTime = this.playTime;
    this.playTime = newTime;

    this.playIndex = this.gameLog.getIndexForTime(newTime);
    this.updateGoalCounts();
    this.needsUpdate = true;

    this.dispatchEvent({
      type: LogPlayerEvents.TIME_CHANGE,
      oldTime: oldTime,
      newTime: newTime
    });
  }

  /**
   * Update the upcoming and passed goal counts.
   */
  updateGoalCounts ()
  {
    const idx = this.gameLog.gameScoreList.indexOf(this.gameLog.states[this.playIndex].score);
    this.upcomingGoals = 0;
    this.passedGoals = 0;

    for (let i = 1; i < this.gameLog.gameScoreList.length; i++) {
      if (i <= idx) {
        this.passedGoals++;
      } else {
        this.upcomingGoals++;
      }
    }
  }

  /**
   * Retrieve the world state to the current play time.
   *
   * @return {(!WorldState | undefined)} the current world state
   */
  getCurrentWorldState ()
  {
    return this.gameLog.states[this.playIndex];
  }

  /**
   * Progress play time.
   *
   * @param  {number} deltaT the time delta to add to the current time
   * @return {void}
   */
  progressPlayTime (deltaT)
  {
    this.setPlayTime(this.playTime + deltaT * this.playSpeed);
  }



  // ============================== EVENT LISTENER FUNCTIONS ==============================
  /**
   * Player update function. This is the central method to progress the player state (its play time) and to update the current world representation.
   * Call this method cyclically within your render cycle.
   *
   * @param  {number} deltaT the time since the last render call
   * @return {void}
   */
  update (deltaT)
  {
    // Check for valid game log
    if (this.gameLog === null) {
      return;
    }

    // Progress play time if player is in playing state and the time since the last render call is below 0.5 seconds.
    if (this.state === LogPlayerStates.PLAY && deltaT < 0.5) {
      this.progressPlayTime(deltaT);
    }

    if (this.state === LogPlayerStates.PLAY || this.needsUpdate) {
      this.needsUpdate = false;

      // Update world
      let idx = this.playIndex;
      let t = 0;

      if (this.monitorConfig.interpolateStates) {
        t = ((this.gameLog.startTime + this.playTime) - this.gameLog.states[idx].time) * this.gameLog.frequency;
      }

      if (idx + 1 >= this.gameLog.states.length) {
        // Final state
        --idx;
        t = 1;
      }

      this.world.update(this.gameLog.states[idx], this.gameLog.states[idx + 1], t);
    }
  }

  /**
   * GameLog->"update" event handler.
   * This event handler is triggered when the game log data has beed updated.
   *
   * @return {void}
   */
  handleGameLogUpdate ()
  {
    this.world.updateTeams(this.gameLog.type);
    this.updateGoalCounts();

    this.dispatchEvent({
      type: LogPlayerEvents.GAME_LOG_UPDATED
    });

    if (this.state === LogPlayerStates.WAITING) {
      this.setState(LogPlayerStates.PLAY);
    }
  }

  /**
   * GameLogLoader->"new-game-log" event handler.
   * This event handler is triggered when a new game log instance is available.
   *
   * @param  {!Object} event the event
   * @return {void}
   */
  handleNewGameLog (event)
  {
    this.setGameLog(event.gameLog);
  }

  /**
   * GameLogLoder->"finished"|"error" event handler.
   * This event handler is triggered when the game log loader finished loading a resource (either successfully or with an error).
   *
   * @param  {!Object} event the event
   * @return {void}
   */
  handleGameLogLoadEnd (event)
  {
    if (event.type === GameLogLoaderEvents.ERROR) {
      if (this.playlist !== null) {
        // Mark active playlist entry as invalid
        this.playlist.markAsInvalid(event.msg);

        // Try forward to the next entry
          this.playlist.nextEntry();
      } else {
        // If there exists a playlist, the loading error will be indicated within the corresponding playlist entry.
        // So only alert loading errors if no playlist is present.
        alert('Loading game log failed: ' + event.msg);
      }
    }
  }

  /**
   * PlaylistLoder->"finished"|"error" event handler.
   * This event handler is triggered when the playlist loader finished loading a resource (either successfully or with an error).
   *
   * @param  {!Object} event the event
   * @return {void}
   */
  handlePlaylistLoadEnd (event)
  {
    if (event.type === GameLogLoaderEvents.FINISHED) {
      this.setPlaylist(event.list);
    } else if (event.type === GameLogLoaderEvents.ERROR) {
      alert(event.msg);
    }
  }

  /**
   * Playlist->"active-change" event handler.
   * This event handler is triggered when the active index within the playlist has changed.
   *
   * @param  {!Object} event the event
   * @return {void}
   */
  handlePlaylistIndexChange (event)
  {
    const entry = this.playlist.getActiveEntry();

    if (entry !== null && entry.errorMsg === null) {
      if (entry.resource instanceof File) {
        this.gameLogLoader.loadFile(entry.resource);
      } else {
        this.gameLogLoader.load(/** @type {string} */ (entry.resource));
      }
    }
  }



  // ============================== PLAYER CONTROL FUNCTIONS ==============================
  /**
   * The play/pause command.
   *
   * @return {void}
   */
  playPause ()
  {
    if (this.gameLog === null) {
      return;
    }

    if (this.state === LogPlayerStates.PLAY || this.state == LogPlayerStates.WAITING) {
      this.setState(LogPlayerStates.PAUSE);
    } else if (this.state === LogPlayerStates.PAUSE) {
      this.setState(LogPlayerStates.PLAY);
    } else if (this.state === LogPlayerStates.END) {
      this.setPlayTime(0);
      this.setState(LogPlayerStates.PLAY);
    }
  }

  /**
   * The step (forward/backward) command.
   *
   * @param {boolean=} backwards
   * @return {void}
   */
  step (backwards)
  {
    if (this.gameLog === null) {
      return;
    }

    if (this.state === LogPlayerStates.PAUSE || this.state === LogPlayerStates.END) {
      // Step one state forward/backward
      this.jump(this.playIndex + (backwards ? -1 : 1));
    } else {
      // Step two seconds forward/backward
      this.progressPlayTime(backwards ? -2 : 2);
    }
  }

  /**
   * The play/pause command.
   *
   * @param {number} idx
   * @return {void}
   */
  jump (idx)
  {
    if (this.gameLog === null) {
      return;
    }

    if (idx < 0) {
      this.setPlayTime(0);
    } else if (idx >= this.gameLog.states.length) {
      this.setPlayTime(this.gameLog.duration + 1);
    } else {
      this.setPlayTime(this.gameLog.states[idx].time + 0.0001);
    }
  }

  /**
   * The play/pause command.
   *
   * @param {boolean=} previous
   * @return {void}
   */
  jumpGoal (previous)
  {
    if (this.gameLog === null) {
      return;
    }

    let time = this.playTime;
    const scoreList = this.gameLog.gameScoreList;

    if (previous) {
      for (let i = scoreList.length - 1; i > 0; --i) {
        if (scoreList[i].time < time) {
          this.setPlayTime(scoreList[i].time - 6);
          return;
        }
      }
    } else {
      time = time + 6;

      for (let i = 1; i < scoreList.length; ++i) {
        if (scoreList[i].time > time) {
          this.setPlayTime(scoreList[i].time - 6);
          return;
        }
      }
    }
  }
}

export { LogPlayer };
