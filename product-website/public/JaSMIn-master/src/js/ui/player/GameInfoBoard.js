import { Panel } from '../components/Panel.js';
import { UIUtil } from '../../utils/UIUtil.js';
import { WorldState } from '../../model/game/WorldState.js';

class GameInfoBoard extends Panel
{
  /**
   * GameInfoBoard Contructor
   */
  constructor ()
  {
    super('jsm-game-info no-text-select');

    const infoLine = UIUtil.createDiv('info-line');
    this.domElement.appendChild(infoLine);

    const stateLine = UIUtil.createDiv('state-line');
    this.domElement.appendChild(stateLine);

    /**
     * The game time label.
     * @type {!Element}
     */
    this.gameTimeLbl = UIUtil.createSpan('00:00.<small>00</small>', 'game_time_lbl');
    infoLine.appendChild(this.gameTimeLbl);

    /**
     * The left team label
     * @type {!Element}
     */
    this.leftTeamLbl = UIUtil.createSpan('Left', 'left-team');
    infoLine.appendChild(this.leftTeamLbl);

    /**
     * The left team score label
     * @type {!Element}
     */
    this.leftScoreLbl = UIUtil.createSpan('0', 'left-score');
    infoLine.appendChild(this.leftScoreLbl);

    /**
     * The score divider label
     * @type {!Element}
     */
    this.scoreDividerLbl = UIUtil.createSpan(':', 'score-divider');
    infoLine.appendChild(this.scoreDividerLbl);

    /**
     * The right team score label
     * @type {!Element}
     */
    this.rightScoreLbl = UIUtil.createSpan('0', 'right-score');
    infoLine.appendChild(this.rightScoreLbl);

    /**
     * The right team label
     * @type {!Element}
     */
    this.rightTeamLbl = UIUtil.createSpan('Right', 'right-team');
    infoLine.appendChild(this.rightTeamLbl);

    /**
     * The game state label
     * @type {!Element}
     */
    this.gameStateLbl = UIUtil.createSpan('Unknown', 'game_state_lbl');
    stateLine.appendChild(this.gameStateLbl);

    /**
     * The world state used during the last update.
     * @type {?WorldState}
     */
    this.previousWorldState = null;
  }

  /**
   * Update the time, score and game state labels.
   *
   * @param  {(!WorldState | undefined)} state the current world state
   * @return {void}
   */
  update (state)
  {
    if (!state) {
      this.gameTimeLbl.innerHTML = '00:00.<small>00</small>';
      this.gameStateLbl.innerHTML = 'Unknown';
      this.leftScoreLbl.innerHTML = '0';
      this.rightScoreLbl.innerHTML = '0';
      this.previousWorldState = null;
      return;
    }

    // Do a full update for the first incomming state
    if (this.previousWorldState === null) {
      this.gameTimeLbl.innerHTML = UIUtil.toMMSScs(state.gameTime, true);
      this.gameStateLbl.innerHTML = state.gameState.playMode;
      this.leftScoreLbl.innerHTML = state.score.goalsLeft;
      this.rightScoreLbl.innerHTML = state.score.goalsRight;
      this.previousWorldState = state;
      return;
    }

    // Update game time label if changed
    if (this.previousWorldState.gameTime !== state.gameTime) {
      this.gameTimeLbl.innerHTML = UIUtil.toMMSScs(state.gameTime, true);
    }

    // Update game state label if changed
    if (this.previousWorldState.gameState !== state.gameState) {
      this.gameStateLbl.innerHTML = state.gameState.playMode;
    }

    // Update score labels if changed
    if (this.previousWorldState.score !== state.score) {
      this.leftScoreLbl.innerHTML = state.score.goalsLeft;
      this.rightScoreLbl.innerHTML = state.score.goalsRight;
    }

    // Remember current state
    this.previousWorldState = state;
  }

  /**
   * Update the team labels.
   *
   * @param  {string} leftTeamName the name of the left team
   * @param  {string} rightTeamName the name of the right team
   * @return {void}
   */
  updateTeamNames (leftTeamName, rightTeamName)
  {
    this.leftTeamLbl.innerHTML = leftTeamName;
    this.rightTeamLbl.innerHTML = rightTeamName;
  }

  /**
   * Update the team labels.
   *
   * @param  {!THREE.Color} leftTeamColor the color of the left team
   * @param  {!THREE.Color} rightTeamColor the color of the right team
   * @return {void}
   */
  updateTeamColors (leftTeamColor, rightTeamColor)
  {
    // Left Team
    const leftColor = UIUtil.getForegroundColor(leftTeamColor);

    this.leftTeamLbl.style.backgroundColor = this.leftScoreLbl.style.backgroundColor = leftTeamColor.getStyle();
    this.leftTeamLbl.style.color = this.leftScoreLbl.style.color = leftColor.getStyle();

    // Right Team
    const rightColor = UIUtil.getForegroundColor(rightTeamColor);

    this.rightTeamLbl.style.backgroundColor = this.rightScoreLbl.style.backgroundColor = rightTeamColor.getStyle();
    this.rightTeamLbl.style.color = this.rightScoreLbl.style.color = rightColor.getStyle();
  }
}

export { GameInfoBoard };
