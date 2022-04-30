import { Overlay } from '../../components/Overlay.js';
import { MonitorConfiguration, MonitorConfigurationEvents, MonitorConfigurationProperties } from '../../../model/settings/MonitorConfiguration.js';
import { SingleChoiceItem } from '../../components/SingleChoiceItem.js';
import { ToggleItem } from '../../components/ToggleItem.js';
import { UIUtil } from '../../../utils/UIUtil.js';

/**
 * The SettingsOverlay class definition.
 *
 * @author Stefan Glaser
 */
class SettingsOverlay extends Overlay
{
  /**
   * SettingsOverlay Constructor
   *
   * @param {!MonitorConfiguration} config the monitor config
   */
  constructor (config)
  {
    super('jsm-settings');

    /**
     * The monitor config.
     * @type {!MonitorConfiguration}
     */
    this.config = config;


    const scope = this;

    /**
     * The main menu list.
     * @type {!Element}
     */
    this.mainMenu = UIUtil.createUL('jsm-menu');
    this.innerElement.appendChild(this.mainMenu);

    /**
     * The interpolate state item.
     * @type {!ToggleItem}
     */
    this.interpolateItem = new ToggleItem('Interpolation', 'On', 'Off', config.interpolateStates, 'item');
    this.interpolateItem.onChanged = function(isOn) {
      config.setInterpolateStates(isOn);
    };
    this.mainMenu.appendChild(this.interpolateItem.domElement);

    /**
     * The shadows enabeld state item.
     * @type {!ToggleItem}
     */
    this.shadowsItem = new ToggleItem('Shadows', 'On', 'Off', config.shadowsEnabled, 'item');
    this.shadowsItem.onChanged = function(isOn) {
      config.setShadowsEnabled(isOn);
    };
    this.mainMenu.appendChild(this.shadowsItem.domElement);

    /**
     * The monitor statistics state item.
     * @type {!ToggleItem}
     */
    this.statisticsItem = new ToggleItem('Monitor Statistics', 'On', 'Off', config.glInfoEnabled, 'item');
    this.statisticsItem.onChanged = function(isOn) {
      config.setGLInfoEnabled(isOn);
    };
    this.mainMenu.appendChild(this.statisticsItem.domElement);

    /**
     * The team colors enabled state item.
     * @type {!ToggleItem}
     */
    this.teamColorsItem = new ToggleItem('Team Colors', 'Fix', 'Auto', config.teamColorsEnabled, 'item');
    this.teamColorsItem.onChanged = function(isOn) {
      config.setTeamColorsEnabled(isOn);
      scope.teamColorChooserItem.style.height = isOn ? scope.teamColorChooserItem.scrollHeight + 'px' : '0px';
    };
    this.mainMenu.appendChild(this.teamColorsItem.domElement);

    /**
     * The team color chooser item.
     * @type {!Element}
     */
    this.teamColorChooserItem = UIUtil.createDiv('collapsable');
    this.teamColorChooserItem.onclick = function(event) { event.stopPropagation(); };

    if (!config.teamColorsEnabled) {
      this.teamColorChooserItem.style.height = '0px';
    }

    /**
     * The left team color chooser.
     * @type {!Element}
     */
    this.leftTeamColorChooser = UIUtil.createColorChooser('#' + config.leftTeamColor.getHexString(), 'Left team color', 'team-color');
    this.leftTeamColorChooser.onchange = function() {
      config.setTeamColor(scope.leftTeamColorChooser.value, true);
    };

    this.rightTeamColorChooser = UIUtil.createColorChooser('#' + config.rightTeamColor.getHexString(), 'Right team color', 'team-color');
    this.rightTeamColorChooser.onchange = function() {
      config.setTeamColor(scope.rightTeamColorChooser.value, false);
    };
    this.teamColorChooserItem.appendChild(this.leftTeamColorChooser);
    this.teamColorChooserItem.appendChild(this.rightTeamColorChooser);
    this.teamColorsItem.domElement.appendChild(this.teamColorChooserItem);



    // -------------------- Listeners -------------------- //
    /** @type {!Function} */
    this.handleConfigChangeListener = this.handleConfigChange.bind(this);

    // Add config change listeners
    this.config.addEventListener(MonitorConfigurationEvents.CHANGE, this.handleConfigChangeListener);
  }

  /**
   * Handle configuration change.
   *
   * @param {!Object} evt the change event
   * @return {void}
   */
  handleConfigChange (evt)
  {
    switch (evt.property) {
      case MonitorConfigurationProperties.INTERPOLATE_STATES:
        this.applyInterpolationSettings();
        break;
      case MonitorConfigurationProperties.TEAM_COLORS_ENABLED:
      case MonitorConfigurationProperties.TEAM_COLOR_LEFT:
      case MonitorConfigurationProperties.TEAM_COLOR_RIGHT:
        this.applyTeamColorSettings();
        break;
      case MonitorConfigurationProperties.SHADOWS_ENABLED:
        this.applyShadowSettings();
        break;
      case MonitorConfigurationProperties.GL_INFO_ENABLED:
        this.applyGLInfoSettings();
        break;
    }
  }

  /**
   * Apply team color settings.
   *
   * @return {void}
   */
  applyTeamColorSettings ()
  {
    const isOn = this.config.teamColorsEnabled;

    this.teamColorsItem.setState(isOn);
    this.teamColorChooserItem.style.height = isOn ? this.teamColorChooserItem.scrollHeight + 'px' : '0px';
    this.leftTeamColorChooser.value = '#' + this.config.leftTeamColor.getHexString();
    this.rightTeamColorChooser.value = '#' + this.config.rightTeamColor.getHexString();
  }

  /**
   * Apply shadow setting.
   *
   * @return {void}
   */
  applyShadowSettings ()
  {
    this.shadowsItem.setState(this.config.shadowsEnabled);
  }

  /**
   * Apply interpolate states setting.
   *
   * @return {void}
   */
  applyInterpolationSettings ()
  {
    this.interpolateItem.setState(this.config.interpolateStates);
  }

  /**
   * Apply monitor info settings.
   *
   * @return {void}
   */
  applyGLInfoSettings ()
  {
    this.statisticsItem.setState(this.config.glInfoEnabled);
  }
}

export { SettingsOverlay };
