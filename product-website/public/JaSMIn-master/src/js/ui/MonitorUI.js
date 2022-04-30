import { LogPlayer } from '../model/logplayer/LogPlayer.js';
import { MonitorModel, MonitorModelEvents, MonitorStates } from '../model/MonitorModel.js';
import { UIUtil } from '../utils/UIUtil.js';
import { DnDHandler } from './utils/DnDHandler.js';
import { FullscreenManager } from './utils/FullscreenManager.js';
import { GLPanel } from './gl/GLPanel.js';
import { InputController } from './player/InputController.js';
import { LoadingBar } from './player/LoadingBar.js';
import { PlayerUI } from './player/PlayerUI.js';
import { ResourceExplorer } from './explorer/ResourceExplorer.js';
import { WelcomeOverlay } from './player/WelcomeOverlay.js';
import { WorldLoader } from '../model/gl/world/loader/WorldLoader.js';
import { MonitorConfigurationEvents, MonitorConfigurationProperties } from '../model/settings/MonitorConfiguration.js';
import { WorldEvents } from '../model/gl/world/World.js';

/**
 * The MonitorUI class definition.
 *
 * The MonitorUI abstracts the handling of the player related ui elements.
 *
 * @author Stefan Glaser
 */
class MonitorUI
{
  /**
   * MonitorUI Constructor
   *
   * @param {!MonitorModel} model the monitor model
   * @param {!Element} container the monitor root dom element
   */
  constructor (model, container)
  {
    /**
     * The monitor model.
     * @type {!MonitorModel}
     */
    this.model = model;

    /**
     * The player root element.
     * @type {!Element}
     */
    this.domElement = UIUtil.createDiv('jsm-root');
    container.appendChild(this.domElement);

    /**
     * The drag and drop handler.
     * @type {!DnDHandler}
     */
    this.dndHandler = new DnDHandler();
    this.dndHandler.onNewFilesDropped = function () {
      const mm = model;

      return function (files) {
        mm.loadFiles(files);
      };
    }();

    /**
     * The fullscreen manager.
     * @type {!FullscreenManager}
     */
    this.fullscreenManager = new FullscreenManager(this.domElement);

    /**
     * The explorer root element.
     * @type {!Element}
     */
    this.explorerRoot = UIUtil.createDiv('explorer-root');
    this.domElement.appendChild(this.explorerRoot);

    /**
     * The root divider element.
     * @type {!Element}
     */
    this.rootDivider = UIUtil.createDiv('root-divider');
    this.domElement.appendChild(this.rootDivider);

    /**
     * The monitor root element.
     * @type {!Element}
     */
    this.monitorRoot = UIUtil.createDiv('monitor-root');
    this.domElement.appendChild(this.monitorRoot);

    /**
     * The resource explorer.
     * @type {!ResourceExplorer}
     */
    this.resourceExplorer = new ResourceExplorer(this.model);
    this.explorerRoot.appendChild(this.resourceExplorer.domElement);

    /**
     * The webgl panel instance, handling the webgl rendering.
     * @type {!GLPanel}
     */
    this.glPanel = new GLPanel(this.monitorRoot);
    this.glPanel.onNewRenderCycle = this.handleNewRenderCycle.bind(this);
    this.glPanel.scene = this.model.world.scene;
    this.glPanel.glInfoBoard.setVisible(this.model.settings.monitorConfig.glInfoEnabled);
    this.glPanel.renderer.shadowMap.enabled = this.model.settings.monitorConfig.shadowsEnabled;
    this.glPanel.renderInterval = 30;

    /**
     * The mouse and keyboard input controller.
     * @type {!InputController}
     */
    this.inputController = new InputController(this.model, this.glPanel, this.fullscreenManager, this.dndHandler);
    this.monitorRoot.appendChild(this.inputController.domElement);

    /**
     * The top loading bar.
     * @type {!LoadingBar}
     */
    this.loadingBar = new LoadingBar(this.model.logPlayer.gameLogLoader);
    this.monitorRoot.appendChild(this.loadingBar.domElement);

    /**
     * The welcome overlay (providing local file selection).
     * @type {!WelcomeOverlay}
     */
    this.welcomeOverlay = new WelcomeOverlay(this.dndHandler);
    this.monitorRoot.appendChild(this.welcomeOverlay.domElement);

    /**
     * The player bar.
     * @type {!PlayerUI}
     */
    this.playerUI = new PlayerUI(this.model, this.fullscreenManager);
    this.monitorRoot.appendChild(this.playerUI.domElement);



    /** @type {!Function} */
    this.handleRevealExplorerListener = this.showExplorer.bind(this);
    /** @type {!Function} */
    this.handleHideExplorerListener = this.hideExplorer.bind(this);
    /** @type {!Function} */
    this.handleAutoSizeExplorerListener = this.autoSizeExplorer.bind(this);

    /**
     * The reveal explorer button.
     * @type {!Element}
     */
    this.revealExplorerBtn = UIUtil.createPlayerButton('&nbsp;&nbsp;&gt;', 'reveal-explorer-btn', 'Show Resource Explorer', this.handleRevealExplorerListener, true);
    this.domElement.appendChild(this.revealExplorerBtn);
    UIUtil.setVisibility(this.revealExplorerBtn, false);

    /**
     * The hide explorer button.
     * @type {!Element}
     */
    this.hideExplorerBtn = UIUtil.createPlayerButton('&lt;&nbsp;&nbsp;', 'hide-explorer-btn', 'Hide Resource Explorer', this.handleHideExplorerListener, true);
    this.rootDivider.appendChild(this.hideExplorerBtn);


    /** @type {!Function} */
    this.handleMonitorStateChangeListener = this.handleMonitorStateChange.bind(this);

    /** @type {!Function} */
    this.handleEWResizeStartListener = this.handleEWResizeStart.bind(this);
    /** @type {!Function} */
    this.handleEWResizeEndListener = this.handleEWResizeEnd.bind(this);
    /** @type {!Function} */
    this.handleEWResizeListener = this.handleEWResize.bind(this);

    /** @type {!Function} */
    this.handleMonitorConfigChangeListener = this.handleMonitorConfigChange.bind(this);

    /** @type {!Function} */
    this.handleWorldChangeListener = this.handleWorldChange.bind(this);


    // Add monitor model event listener
    this.model.addEventListener(MonitorModelEvents.STATE_CHANGE, this.handleMonitorStateChangeListener);

    // Add root divider event listeners
    this.rootDivider.addEventListener('mousedown', this.handleEWResizeStartListener, false);
    this.rootDivider.addEventListener('dblclick', this.handleAutoSizeExplorerListener, false);

    // Add monitor config change lister
    this.model.settings.monitorConfig.addEventListener(MonitorConfigurationEvents.CHANGE, this.handleMonitorConfigChangeListener);

    // Add world change lister
    this.model.world.addEventListener(WorldEvents.CHANGE, this.handleWorldChangeListener);



    /** @type {!Function} */
    this.handleResizeListener = this.handleResize.bind(this);

    // Add window resize & beforeunload listener
    window.addEventListener('resize', this.handleResizeListener);
    window.addEventListener('beforeunload', function() {
      const mm = model;

      return function (evt) {
        mm.settings.save();
      };
    }());


    // Check for embedded mode
    if (this.model.embedded) {
      this.hideExplorer();

      // Hide welcome overlay
      this.welcomeOverlay.setVisible(false);
    }
  }

  /**
   * World->"change" event listener.
   * This event listener is triggered when the world representation has changed.
   *
   * @param {!Object} evt the change event
   * @return {void}
   */
  handleWorldChange (evt)
  {
    this.inputController.camCon.setAreaOfInterest(this.model.world.field.fieldDimensions);
    this.inputController.camCon.setPredefinedPose();
    this.inputController.domElement.focus();
  }

  /**
   * @param {number} deltaT the time passed since the last render cycle in milliseconds
   * @return {void}
   */
  handleNewRenderCycle (deltaT)
  {
    // Do stuff...

    // Forward call to player
    if (this.model.state === MonitorStates.REPLAY) {
      this.model.logPlayer.update(deltaT);
    }
  }

  /**
   * @param {!Event} evt the mouse event
   * @return {void}
   */
  handleEWResizeStart (evt)
  {
    // Prevent scrolling, text-selection, etc.
    evt.preventDefault();
    evt.stopPropagation();

    this.domElement.style.cursor = 'ew-resize';
    this.domElement.addEventListener('mousemove', this.handleEWResizeListener, false);
    this.domElement.addEventListener('mouseup', this.handleEWResizeEndListener, false);
  }

  /**
   * @param {!Event} evt the mouse event
   * @return {void}
   */
  handleEWResizeEnd (evt)
  {
    this.domElement.style.cursor = '';
    this.domElement.removeEventListener('mousemove', this.handleEWResizeListener, false);
    this.domElement.removeEventListener('mouseup', this.handleEWResizeEndListener, false);

    const percent = 100 * (evt.clientX + 2) / this.domElement.offsetWidth;

    if (percent < 5) {
      this.hideExplorer();
    }
  }

  /**
   * @param {!Event} evt the mouse event
   * @return {void}
   */
  handleEWResize (evt)
  {
    // Prevent scrolling, text-selection, etc.
    evt.preventDefault();
    evt.stopPropagation();

    let percent = 100 * (evt.clientX + 2) / this.domElement.offsetWidth;

    // Limit explorer width to a maximum of 50%
    if (percent > 50) {
      percent = 50;
    }

    // Hide explorer if now width is sell than 5%
    if (percent < 5) {
      this.explorerRoot.style.width = '0px';
      this.monitorRoot.style.width = 'calc(100% - 3px)';
    } else {
      this.explorerRoot.style.width = 'calc(' + percent + '% - 3px)';
      this.monitorRoot.style.width = '' + (100 - percent) + '%';
    }

    this.glPanel.autoResize();
  }

  /**
   * Handle resizing of window.
   *
   * @param {!Event} evt the resize event
   * @return {void}
   */
  handleResize (evt)
  {
    this.glPanel.autoResize();
  }

  /**
   * Automatically resize the resource explorer to its reuired width or the maximum width of 50%.
   *
   * @return {void}
   */
  autoSizeExplorer ()
  {
    if (this.explorerRoot.scrollWidth === this.explorerRoot.offsetWidth) {
      // Nothing to scroll, thus nothing to resize
      return;
    }

    // Show explorer and divider
    UIUtil.setVisibility(this.explorerRoot, true);
    UIUtil.setVisibility(this.rootDivider, true);

    let percent = 100 * (this.explorerRoot.scrollWidth + 3) / this.domElement.offsetWidth;

    if (percent > 50) {
      percent = 50;
    }

    // Resize containers
    this.explorerRoot.style.width = 'calc(' + percent + '% - 3px)';
    this.monitorRoot.style.width = '' + (100 - percent) + '%';
    this.glPanel.autoResize();

    // Hide reveal explorer button
    UIUtil.setVisibility(this.revealExplorerBtn, false);
  }

  /**
   * Show the resource explorer.
   *
   * @return {void}
   */
  showExplorer ()
  {
    if (this.model.embedded) {
      return;
    }

    // Show explorer and divider
    UIUtil.setVisibility(this.explorerRoot, true);
    UIUtil.setVisibility(this.rootDivider, true);

    // Resize containers
    this.explorerRoot.style.width = 'calc(25% - 3px)';
    this.explorerRoot.scrollLeft = 0;
    this.monitorRoot.style.width = '75%';
    this.glPanel.autoResize();

    // Hide reveal explorer button
    UIUtil.setVisibility(this.revealExplorerBtn, false);
  }

  /**
   * Hide the resource explorer.
   *
   * @return {void}
   */
  hideExplorer ()
  {
      // Hide explorer and divider
      UIUtil.setVisibility(this.explorerRoot, false);
      UIUtil.setVisibility(this.rootDivider, false);

      // Maximize monitor container
      this.monitorRoot.style.width = '100%';
      this.glPanel.autoResize();

      // Show reveal explorer button if not in embedded mode
      UIUtil.setVisibility(this.revealExplorerBtn, !this.model.embedded);
  }

  /**
   * MonitorConfiguration->"change" event handler.
   * This event handler is triggered when a property of the monitor configuration has changed.
   *
   * @param  {!Object} evt the event
   * @return {void}
   */
  handleMonitorConfigChange (evt)
  {
    const config = this.model.settings.monitorConfig;

    switch (evt.property) {
      case MonitorConfigurationProperties.SHADOWS_ENABLED:
        this.model.world.setShadowsEnabled(config.shadowsEnabled);
        this.glPanel.renderer.shadowMap.enabled = config.shadowsEnabled;
        break;
      case MonitorConfigurationProperties.TEAM_COLORS_ENABLED:
      case MonitorConfigurationProperties.TEAM_COLOR_LEFT:
      case MonitorConfigurationProperties.TEAM_COLOR_RIGHT:
        this.playerUI.updateTeamColors();
        break;
      case MonitorConfigurationProperties.GL_INFO_ENABLED:
        this.glPanel.glInfoBoard.setVisible(config.glInfoEnabled);
        break;
    }
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
    if (evt.newState !== MonitorStates.INIT) {
      this.welcomeOverlay.setVisible(false);
      this.glPanel.renderInterval = 1;
      this.glPanel.renderTTL = 1;
    } else {
      this.glPanel.renderInterval = 30;
    }
  }
}

export { MonitorUI };
