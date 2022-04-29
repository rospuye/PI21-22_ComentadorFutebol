import { Panel } from '../components/Panel.js';
import { UIUtil } from '../../utils/UIUtil.js';
import { FullscreenManager, FullscreenManagerEvents } from '../utils/FullscreenManager.js';
import { HelpOverlay } from './overlay/HelpOverlay.js';
import { InfoOverlay } from './overlay/InfoOverlay.js';
import { PanelGroup } from '../components/PanelGroup.js';
import { PlaylistOverlay } from './overlay/PlaylistOverlay.js';
import { SettingsOverlay } from './overlay/SettingsOverlay.js';
import { GameInfoBoard } from './GameInfoBoard.js';
import { MonitorModel, MonitorModelEvents, MonitorStates } from '../../model/MonitorModel.js';
import { LogPlayer, LogPlayerStates, LogPlayerEvents } from '../../model/logplayer/LogPlayer.js';


/**
 * The PlayerUI class definition.
 *
 * @author Stefan Glaser
 */
class PlayerUI extends Panel
{
  /**
   * PlayerUI Constructor
   *
   * @param {!MonitorModel} model the monitor model
   * @param {!FullscreenManager} fullscreenManager
   */
  constructor(model, fullscreenManager) {
    super('jsm-player-pane full-size');

    /**
     * The monitor model instance.
     * @type {!MonitorModel}
     */
    this.model = model;

    /**
     * The fullscreen manager.
     * @type {!FullscreenManager}
     */
    this.fullscreenManager = fullscreenManager;

    /**
     * The info overlay.
     * @type {!InfoOverlay}
     */
    this.infoOverlay = new InfoOverlay();
    this.appendChild(this.infoOverlay.domElement);

    /**
     * The settings overlay.
     * @type {!SettingsOverlay}
     */
    this.settingsOverlay = new SettingsOverlay(model.settings.monitorConfig);
    this.appendChild(this.settingsOverlay.domElement);

    /**
     * The playlist overlay.
     * @type {!PlaylistOverlay}
     */
    this.playlistOverlay = new PlaylistOverlay(model.logPlayer);
    this.appendChild(this.playlistOverlay.domElement);

    /**
     * The overlay group.
     * @type {!PanelGroup}
     */
    this.overlayGroup = new PanelGroup();
    this.overlayGroup.add(this.infoOverlay);
    this.overlayGroup.add(this.settingsOverlay);
    this.overlayGroup.add(this.playlistOverlay);

    /**
     * The shadow pane.
     * @type {!Element}
     */
    this.shadowPane = UIUtil.createDiv('jsm-shadow-pane');
    this.appendChild(this.shadowPane);

    /**
     * The game info board.
     * @type {!GameInfoBoard}
     */
    this.gameInfoBoard = new GameInfoBoard();
    this.gameInfoBoard.setVisible(false);
    this.domElement.appendChild(this.gameInfoBoard.domElement);

    /**
     * The waiting indicator.
     * @type {!Element}
     */
    this.waitingIndicator = UIUtil.createDiv('jsm-waiting-indicator no-text-select');
    this.waitingIndicator.title = 'Waiting for new stream data...';
    this.appendChild(this.waitingIndicator);
    UIUtil.setVisibility(this.waitingIndicator, false);

    /**
     * The bottom player bar pane.
     * @type {!Element}
     */
    this.barPane = UIUtil.createDiv('jsm-player-bar');
    this.appendChild(this.barPane);

    const scope = this;




    /**
     * The player time slider.
     * @type {!Element}
     */
    this.timeSlider = document.createElement('input');
    this.timeSlider.className = 'time-slider';
    this.timeSlider.type = 'range';
    this.timeSlider.min = 0;
    this.timeSlider.max = 6000;
    this.timeSlider.step = 1;
    this.timeSlider.value = 0;
    this.timeSlider.addEventListener('change', function(evt) {
      scope.model.logPlayer.jump(this.value);
    });
    this.timeSlider.addEventListener('input', function(evt) {
      scope.model.logPlayer.jump(this.value);
    });
    UIUtil.setVisibility(this.timeSlider, false);
    this.barPane.appendChild(this.timeSlider);

    /**
     * The player controls pane.
     * @type {!Element}
     */
    this.leftPane = UIUtil.createDiv('left');
    UIUtil.setVisibility(this.leftPane, false);
    this.barPane.appendChild(this.leftPane);

    /**
     * The player settings pane.
     * @type {!Element}
     */
    this.rightPane = UIUtil.createDiv('right');
    this.barPane.appendChild(this.rightPane);


    /**
     * The Play / Pause / Replay button
     * @type {!Element}
     */
    this.playBtn = UIUtil.createPlayerButton('',
      'player-btn icon-play',
      'Play',
      function() {
        scope.overlayGroup.hideAll();
        scope.model.logPlayer.playPause();
      },
      true);
    this.leftPane.appendChild(this.playBtn);

    /**
     * The jump previous goal button
     * @type {!Element}
     */
    this.jumpPreviousGoalBtn = UIUtil.createPlayerButton('',
      'player-btn icon-jump-prev',
      'Jump Previous Goal',
      function() {
        scope.overlayGroup.hideAll();
        scope.model.logPlayer.jumpGoal(true);
      },
      true);
    this.leftPane.appendChild(this.jumpPreviousGoalBtn);

    /**
     * The step backwards button
     * @type {!Element}
     */
    this.stepBackwardsBtn = UIUtil.createPlayerButton('',
      'player-btn icon-step-back',
      'Step Backwards',
      function() {
        scope.overlayGroup.hideAll();
        scope.model.logPlayer.step(true);
      },
      true);
    this.leftPane.appendChild(this.stepBackwardsBtn);

    /**
     * The step forwards button
     * @type {!Element}
     */
    this.stepForwardBtn = UIUtil.createPlayerButton('',
      'player-btn icon-step-fwd',
      'Step Forwards',
      function() {
        scope.overlayGroup.hideAll();
        scope.model.logPlayer.step();
      },
      true);
    this.leftPane.appendChild(this.stepForwardBtn);

    /**
     * The jump next goal button
     * @type {!Element}
     */
    this.jumpNextGoalBtn = UIUtil.createPlayerButton('',
      'player-btn icon-jump-next',
      'Jump Next Goal',
      function() {
        scope.overlayGroup.hideAll();
        scope.model.logPlayer.jumpGoal();
      },
      true);
    this.leftPane.appendChild(this.jumpNextGoalBtn);

    /**
     * The current time label
     * @type {!Element}
     */
    this.currentTimeLbl = UIUtil.createSpan('0:00.<small>00</small>', 'current-time');
    this.leftPane.appendChild(this.currentTimeLbl);

    /**
     * The time divider label
     * @type {!Element}
     */
    this.timeDividerLbl = UIUtil.createSpan('/', 'time-divider');
    this.leftPane.appendChild(this.timeDividerLbl);

    /**
     * The total time label
     * @type {!Element}
     */
    this.totalTimeLbl = UIUtil.createSpan('0:00', 'total-time');
    this.leftPane.appendChild(this.totalTimeLbl);


    /**
     * The toggle playlist button
     * @type {!Element}
     */
    this.playlistBtn = UIUtil.createPlayerButton('',
      'player-btn icon-playlist',
      'Playlist',
      function() { scope.playlistOverlay.toggleVisibility() },
      true);
    this.rightPane.appendChild(this.playlistBtn);

    // UIUtil.setVisibility(this.playlistBtn, this.model.state === MonitorStates.REPLAY);
    // this.playlistBtn.disabled = this.model.logPlayer.playlist === null;
    UIUtil.setVisibility(this.playlistBtn, this.model.logPlayer.playlist !== null);

    /**
     * The toggle info button
     * @type {!Element}
     */
    this.infoBtn = UIUtil.createPlayerButton('',
      'player-btn icon-info',
      'Info',
      function() { scope.infoOverlay.toggleVisibility() },
      true);
    this.rightPane.appendChild(this.infoBtn);

    /**
     * The toggle settings button
     * @type {!Element}
     */
    this.settingsBtn = UIUtil.createPlayerButton('',
      'player-btn icon-settings',
      'Settings',
      function() { scope.settingsOverlay.toggleVisibility() },
      true);
    this.rightPane.appendChild(this.settingsBtn);

    /**
     * The fullscreen button
     * @type {!Element}
     */
    this.fullscreenBtn = UIUtil.createPlayerButton('',
      'player-btn icon-fullscreen',
      'Fullscreen',
      function() {
        scope.overlayGroup.hideAll();
        scope.fullscreenManager.toggleFullscreen();
      },
      true);
    this.rightPane.appendChild(this.fullscreenBtn);

    if (!UIUtil.isFullscreenEnabled()) {
      this.fullscreenBtn.disabled = true;
      this.fullscreenBtn.title = 'Fullscreen not supported!';
    }



    /** @type {!Function} */
    this.handleFullscreenChangeListener = this.handleFullscreenChange.bind(this);

    /** @type {!Function} */
    this.handleMonitorStateChangeListener = this.handleMonitorStateChange.bind(this);

    /** @type {!Function} */
    this.handlePlayerStateChangeListener = this.handlePlayerStateChange.bind(this);
    /** @type {!Function} */
    this.handlePlayerTimeChangeListener = this.handlePlayerTimeChange.bind(this);
    /** @type {!Function} */
    this.handleGameLogUpdatedListener = this.handleGameLogUpdated.bind(this);
    /** @type {!Function} */
    this.handleGameLogChangeListener = this.handleGameLogChange.bind(this);
    /** @type {!Function} */
    this.handlePlaylistChangeListener = this.handlePlaylistChange.bind(this);


    // Add monitor model event listener
    this.model.addEventListener(MonitorModelEvents.STATE_CHANGE, this.handleMonitorStateChangeListener);

    // Add fullscreen manager event listener
    this.fullscreenManager.addEventListener(FullscreenManagerEvents.CHANGE, this.handleFullscreenChangeListener);
  }

  /**
   * Refresh the controls of the player bar (adapt to current model state).
   *
   * @return {void}
   */
  refreshControls ()
  {
    // Reset waiting indicator
    UIUtil.setVisibility(this.waitingIndicator, false);


    // Refresh player-buttons and time slider
    if (this.model.state === MonitorStates.REPLAY) {
      UIUtil.setVisibility(this.timeSlider, true);
      UIUtil.setVisibility(this.leftPane, true);

      // Refresh playlist button
      // UIUtil.setVisibility(this.playlistBtn, true);
      // this.playlistBtn.disabled = this.model.logPlayer.playlist === null;
      UIUtil.setVisibility(this.playlistBtn, this.model.logPlayer.playlist !== null);

      if (this.model.logPlayer.state === LogPlayerStates.EMPTY) {
        // Disable player controls
        this.timeSlider.disabled = true;
        this.playBtn.disabled = true;
        this.jumpPreviousGoalBtn.disabled = true;
        this.stepBackwardsBtn.disabled = true;
        this.stepForwardBtn.disabled = true;
        this.jumpNextGoalBtn.disabled = true;

        // Hide game info board
        this.gameInfoBoard.setVisible(false);

        // Reset time labels
        this.currentTimeLbl.innerHTML = '0:00.<small>00</small>';
        this.totalTimeLbl.innerHTML = '0:00';
      } else {
        // Enable player controls
        this.timeSlider.disabled = false;
        this.playBtn.disabled = false;
        this.jumpPreviousGoalBtn.disabled = false;
        this.stepBackwardsBtn.disabled = false;
        this.stepForwardBtn.disabled = false;
        this.jumpNextGoalBtn.disabled = false;

        // Show & update game info board
        this.gameInfoBoard.setVisible(true);
        this.gameInfoBoard.updateTeamNames(this.model.logPlayer.gameLog.leftTeam.name, this.model.logPlayer.gameLog.rightTeam.name);
        this.gameInfoBoard.update(this.model.logPlayer.getCurrentWorldState());
        this.updateTeamColors();

        // Reset time slider
        this.timeSlider.value = this.model.logPlayer.playIndex;
        this.timeSlider.max = this.model.logPlayer.gameLog.states.length - 1;
        this.updateSliderBackground();


        this.currentTimeLbl.innerHTML = UIUtil.toMMSScs(this.model.logPlayer.playTime);
        this.totalTimeLbl.innerHTML = UIUtil.toMMSS(this.model.logPlayer.gameLog.duration);
      }

      UIUtil.setVisibility(this.waitingIndicator, this.model.logPlayer.state === LogPlayerStates.WAITING);

      this.refreshPlayBtn();
    } else {
      // Hide player controls
      UIUtil.setVisibility(this.timeSlider, false);
      UIUtil.setVisibility(this.leftPane, false);
      UIUtil.setVisibility(this.playlistBtn, false);
      this.gameInfoBoard.setVisible(false);
    }
  }

  /**
   * Set the background of the slider to show progress in chrome.
   *
   * @return {void}
   */
  updateSliderBackground ()
  {
    // Hack for webkit-browsers which don't support input range progress indication
    const percent = (this.timeSlider.value / this.timeSlider.max) * 100;
    this.timeSlider.style.background = '-webkit-linear-gradient(left, #e00 0%, #e00 ' + percent + '%, rgba(204,204,204, 0.7) ' + percent + '%)';
  }

  /**
   * Enable/Disable the jump goal buttons based on passed/upcoming goal counts.
   *
   * @return {void}
   */
  updateJumpGoalButtons ()
  {
    this.jumpPreviousGoalBtn.disabled = this.model.logPlayer.passedGoals === 0;
    this.jumpNextGoalBtn.disabled = this.model.logPlayer.upcomingGoals === 0;
  }

  /**
   * Update the team colors.
   *
   * @return {void}
   */
  updateTeamColors ()
  {
    const world = this.model.world;
    const config = this.model.settings.monitorConfig;

    if (config.teamColorsEnabled) {
      world.leftTeam.setColor(config.leftTeamColor);
      world.rightTeam.setColor(config.rightTeamColor);
      this.gameInfoBoard.updateTeamColors(config.leftTeamColor, config.rightTeamColor);
    } else {
      world.leftTeam.setColor();
      world.rightTeam.setColor();
      this.gameInfoBoard.updateTeamColors(world.leftTeam.description.color, world.rightTeam.description.color);
    }
  }

  /**
   * Refresh the player button.
   *
   * @return {void}
   */
  refreshPlayBtn ()
  {
    switch (this.model.logPlayer.state) {
      case LogPlayerStates.PLAY:
      case LogPlayerStates.WAITING:
        UIUtil.setIcon(this.playBtn, 'icon-pause');
        this.playBtn.title = 'Pause';
        break;
      case LogPlayerStates.END:
        UIUtil.setIcon(this.playBtn, 'icon-replay');
        this.playBtn.title = 'Replay';
        break;
      case LogPlayerStates.EMPTY:
      case LogPlayerStates.PAUSE:
      default:
        UIUtil.setIcon(this.playBtn, 'icon-play');
        this.playBtn.title = 'Play';
        break;
    }
  }

  /**
   * FullscreenManager->"change" event listener.
   * This event listener is triggered when the monitor component entered or left fullscreen mode.
   *
   * @param {!Object} evt the change event
   * @return {void}
   */
  handleFullscreenChange (evt)
  {
    if (this.fullscreenManager.isFullscreen()) {
      UIUtil.setIcon(this.fullscreenBtn, 'icon-partscreen');
      this.fullscreenBtn.title = 'Leave Fullscreen';
    } else {
      UIUtil.setIcon(this.fullscreenBtn, 'icon-fullscreen');
      this.fullscreenBtn.title = 'Fullscreen';
    }
  }

  /**
   * LogPlayer->"game-log-change" event listener.
   * This event listener is triggered when the game log instance within the player changed.
   *
   * @param  {!Object} event the event
   * @return {void}
   */
  handleGameLogChange (event)
  {
    this.timeSlider.value = this.model.logPlayer.playIndex;

    const newGameLog = this.model.logPlayer.gameLog;
    if (newGameLog) {
      this.timeSlider.max = newGameLog.states.length - 1;
      this.totalTimeLbl.innerHTML = UIUtil.toMMSS(newGameLog.duration);
      this.gameInfoBoard.updateTeamNames(newGameLog.leftTeam.name, newGameLog.rightTeam.name);
      this.gameInfoBoard.update(this.model.logPlayer.getCurrentWorldState());
      this.updateTeamColors();
    }

    this.updateSliderBackground();
    this.updateJumpGoalButtons();
    this.currentTimeLbl.innerHTML = UIUtil.toMMSScs(this.model.logPlayer.playTime);
  }

  /**
   * LogPlayer->"playlist-change" event listener.
   * This event listener is triggered when the playlist instance within the player changed.
   *
   * @param  {!Object} event the event
   * @return {void}
   */
  handlePlaylistChange (event)
  {
    // this.playlistBtn.disabled = this.model.logPlayer.playlist === null;
    UIUtil.setVisibility(this.playlistBtn, this.model.logPlayer.playlist !== null);
  }

  /**
   * LogPlayer->"time-change" event listener.
   * This event listener is triggered when the play time of the log player changed.
   *
   * @param  {!Object} event the event
   * @return {void}
   */
  handlePlayerTimeChange (event)
  {
    this.timeSlider.value = this.model.logPlayer.playIndex;

    this.updateSliderBackground();
    this.updateJumpGoalButtons();
    this.currentTimeLbl.innerHTML = UIUtil.toMMSScs(this.model.logPlayer.playTime);
    this.gameInfoBoard.update(this.model.logPlayer.getCurrentWorldState());
  }

  /**
   * LogPlayer->"game-log-updated" event listener.
   * This event listener is triggered when the current game log was updated/extended.
   *
   * @param  {{type: string, newState: !LogPlayerStates}} event the event
   * @return {void}
   */
  handleGameLogUpdated (event)
  {
    const gameLog = this.model.logPlayer.gameLog;

    this.timeSlider.max = gameLog.states.length - 1;

    this.updateSliderBackground();
    this.updateJumpGoalButtons();
    this.totalTimeLbl.innerHTML = UIUtil.toMMSS(gameLog.duration);
    this.gameInfoBoard.updateTeamNames(gameLog.leftTeam.name, gameLog.rightTeam.name);
    this.updateTeamColors();
  }

  /**
   * MonitorModel->"state-change" event listener.
   * This event listener is triggered when the monitor model state has changed.
   *
   * @param {!Object} evt the change event
   * @return {void}
   */
  handleMonitorStateChange (evt)
  {
    // Refresh controls for new state
    this.refreshControls();

    // Remove obsolete event handler
    switch (evt.oldState) {
      case MonitorStates.REPLAY:
        // Remove log player state change listener
        this.model.logPlayer.removeEventListener(LogPlayerEvents.STATE_CHANGE, this.handlePlayerStateChangeListener);
        this.model.logPlayer.removeEventListener(LogPlayerEvents.GAME_LOG_UPDATED, this.handleGameLogUpdatedListener);
        this.model.logPlayer.removeEventListener(LogPlayerEvents.TIME_CHANGE, this.handlePlayerTimeChangeListener);
        this.model.logPlayer.removeEventListener(LogPlayerEvents.GAME_LOG_CHANGE, this.handleGameLogChangeListener);
        this.model.logPlayer.removeEventListener(LogPlayerEvents.PLAYLIST_CHANGE, this.handlePlaylistChangeListener);
        break;
      case MonitorStates.STREAM:
        break;
      case MonitorStates.LIVE:
        break;
      case MonitorStates.INIT:
      default:
        // Do nothing...
        break;
    }

    // Add relevant event handler
    switch (evt.newState) {
      case MonitorStates.REPLAY:
        // Add log player state change listener
        this.model.logPlayer.addEventListener(LogPlayerEvents.STATE_CHANGE, this.handlePlayerStateChangeListener);
        this.model.logPlayer.addEventListener(LogPlayerEvents.GAME_LOG_UPDATED, this.handleGameLogUpdatedListener);
        this.model.logPlayer.addEventListener(LogPlayerEvents.TIME_CHANGE, this.handlePlayerTimeChangeListener);
        this.model.logPlayer.addEventListener(LogPlayerEvents.GAME_LOG_CHANGE, this.handleGameLogChangeListener);
        this.model.logPlayer.addEventListener(LogPlayerEvents.PLAYLIST_CHANGE, this.handlePlaylistChangeListener);
        break;
      case MonitorStates.STREAM:
        break;
      case MonitorStates.LIVE:
        break;
      case MonitorStates.INIT:
      default:
        // Do nothing...
        break;
    }
  }

  /**
   * LogPlayer->"state-change" event listener.
   * This event listener is triggered when the log player state has changed.
   *
   * @param {!Object} evt the change event
   * @return {void}
   */
  handlePlayerStateChange (evt)
  {
    if (evt.oldState === LogPlayerStates.EMPTY) {
      this.refreshControls();
    } else {
      this.refreshPlayBtn();
    }

    if (this.model.logPlayer.state === LogPlayerStates.WAITING) {
      UIUtil.setVisibility(this.waitingIndicator, true);
    } else {
      UIUtil.setVisibility(this.waitingIndicator, false);
    }
  }
}

export { PlayerUI };
