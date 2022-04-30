import { Agent } from '../Agent.js';
import { Ball } from '../Ball.js';
import { Field } from '../Field.js';
import { NaoModelFactory } from '../robots/nao/NaoModelFactory.js';
import { ParameterMap } from '../../../game/utils/ParameterMap.js';
import { RobotModelFactory } from '../robots/RobotModelFactory.js';
import { SoccerBot2DModelFactory } from '../robots/soccerbot2d/SoccerBot2DModelFactory.js';
import { Team } from '../Team.js';
import { RobotModel } from '../RobotModel.js';
import { TeamDescription } from '../../../game/TeamDescription.js';
import { WorldModelFactory } from './WorldModelFactory.js';
import { GameType, TeamSide } from '../../../game/utils/GameUtil.js';

/**
 * The WorldLoader class definition.
 *
 * @author Stefan Glaser
 */
class WorldLoader
{
  /**
   * WorldLoader Constructor
   */
  constructor ()
  {
    /**
     * The world model factory for 2D and 3D simulation environments.
     * @type {!WorldModelFactory}
     */
    this.worldModelFactory = new WorldModelFactory();

    /**
     * The list of robot model factories for 2D simulation models.
     * @type {!Array<!RobotModelFactory>}
     */
    this.modelFactories2D = [new SoccerBot2DModelFactory()];

    /**
     * The list of robot model factories for 3D simulation models.
     * @type {!Array<!RobotModelFactory>}
     */
    this.modelFactories3D = [new NaoModelFactory()];
  }

  /**
   * Dispose all resources allocated within this instance.
   *
   * @return {void}
   */
  dispose () {}

  /**
   * Create a new default world scene representation, containing a sky-box and standard lighting.
   *
   * @return {!THREE.Scene} the new world scene object
   */
  create ()
  {
    const scene = new THREE.Scene();
    scene.name = 'soccerScene';

    this.worldModelFactory.createScene(scene);

    return scene;
  }

  /**
   * Create a ball representation.
   *
   * @param  {!Ball} ball the ball representation
   * @return {void}
   */
  createBall (ball)
  {
    this.worldModelFactory.createBall(ball);
  }

  /**
   * Update the scene representation.
   *
   * @param  {!THREE.Scene} scene the scene instance
   * @param  {!THREE.Vector2} fieldDimensions the field dimensions
   * @return {void}
   */
  updateScene (scene, fieldDimensions)
  {
    this.worldModelFactory.updateScene(scene, fieldDimensions);
  }

  /**
   * Update the field representation for the given field instance.
   * This function places and rescales the field and border objects according to the field dimensions.
   * Furthermore, a new set of field lines is created.
   *
   * @param  {!Field} field the field instance
   * @return {void}
   */
  updateField (field)
  {
    this.worldModelFactory.updateField(field);
  }

  /**
   * Load a team representation.
   * This method can be called repeatedly to load additional agents to a team,
   * as well as additional robot models to all agents of the team (this comes handy for streaming).
   *
   * @param  {!GameType} type the world type (2D or 3D)
   * @param  {!Team} team the team representation
   * @param  {!ParameterMap} environmentParams the environment parameter
   * @param  {!ParameterMap} playerParams the player paraméter
   * @return {!Team} the given team
   */
  loadTeam (type, team, environmentParams, playerParams)
  {
    const teamDescription = team.description;

    for (let i = 0; i < teamDescription.agents.length; ++i) {
      let agent = team.agents[i];

      // Create agent representation if not yet present
      if (agent === undefined) {
        agent = new Agent(teamDescription.agents[i]);
        team.agents[i] = agent;
        team.objGroup.add(agent.objGroup);
      }

      // Create robot models for agent if not yet present
      for (let j = 0; j < agent.description.playerTypes.length; ++j) {
        if (agent.models[j] === undefined) {
          const model = this.createModel(type,
                                         agent.description.playerTypes[j],
                                         teamDescription.side,
                                         agent.description.playerNo,
                                         environmentParams,
                                         playerParams);

          if (model !== null) {
            agent.models[j] = model;
            agent.models[j].setTeamColor(team.color);
            agent.objGroup.add(agent.models[j].objGroup);
          }
        }
      }
    }

    return team;
  }

  /**
   * Load a team representation.
   * This method can be called repeatedly to load additional agents to a team,
   * as well as additional robot models to all agents of the team (this comes handy for streaming).
   *
   * @param  {!GameType} gameType the world type (2D or 3D)
   * @param  {!ParameterMap} playerType the player type
   * @param  {!TeamSide} side the team side
   * @param  {number} playerNo the player number
   * @param  {!ParameterMap} environmentParams the environment paraméter
   * @param  {!ParameterMap} playerParams the player parameter
   * @return {?RobotModel} the new robot model, or null in case of an unknown model
   */
  createModel (gameType, playerType, side, playerNo, environmentParams, playerParams)
  {
    const modelFactories = gameType === GameType.TWOD ? this.modelFactories2D : this.modelFactories3D;
    let i = modelFactories.length;
    let model = null;

    while (i--) {
      model = modelFactories[i].createModel(playerType, side, playerNo, environmentParams, playerParams);

      if (model !== null) {
        break;
      }
    }

    return model;
  }
}

export { WorldLoader };
