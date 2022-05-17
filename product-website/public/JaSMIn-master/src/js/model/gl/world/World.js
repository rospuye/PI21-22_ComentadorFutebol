import { EventDispatcher } from '../../../utils/EventDispatcher.js';
import { Ball } from './Ball.js';
import { Field } from './Field.js';
import { ParameterMap } from '../../game/utils/ParameterMap.js';
import { Team } from './Team.js';
import { WorldLoader } from './loader/WorldLoader.js';
import { WorldState } from '../../game/WorldState.js';
import { TeamDescription } from '../../game/TeamDescription.js';
import { GameType, TeamSide } from '../../game/utils/GameUtil.js';


/**
 * the world events enum.
 * @enum {string}
 */
export const WorldEvents = {
  CHANGE: 'change'
};

/**
 * The World class definition.
 *
 * @author Stefan Glaser
 */
class World extends EventDispatcher
{
  /**
   * World Constructor
   *
   * ::implements {IPublisher}
   * ::implements {IEventDispatcher}
   */
  constructor()
  {
    super();

    /**
     * The world loader instance.
     * @type {!WorldLoader}
     */
    this.worldLoader = new WorldLoader();

    /**
     * The game type this world is representing.
     * @type {!GameType}
     */
    this.type = GameType.TWOD;

    /**
     * The list of server/simulation environment parameters.
     * @type {!ParameterMap}
     */
    this.environmentParams = new ParameterMap();

    /**
     * The list of player parameters.
     * @type {!ParameterMap}
     */
    this.playerParams = new ParameterMap();

    /**
     * The list of player types.
     * @type {!Array<!ParameterMap>}
     */
    this.playerTypes = [];

    /**
     * The world scene.
     * @type {!THREE.Scene}
     */
    this.scene = this.worldLoader.create();

    /**
     * The soccer field object.
     * @type {!Field}
     */
    this.field = new Field();
    this.scene.add(this.field.objGroup);

    // Create field representation
    this.worldLoader.updateField(this.field);

    /**
     * The soccer ball object.
     * @type {!Ball}
     */
    this.ball = new Ball();
    this.scene.add(this.ball.objGroup);
    this.scene.add(this.ball.objTwoDGroup);

    // Create ball representation
    this.worldLoader.createBall(this.ball);

    /**
     * The left team.
     * @type {!Team}
     */
    this.leftTeam = new Team(new TeamDescription('left', new THREE.Color('#0000ff'), TeamSide.LEFT));
    this.scene.add(this.leftTeam.objGroup);

    /**
     * The right team.
     * @type {!Team}
     */
    this.rightTeam = new Team(new TeamDescription('right', new THREE.Color('#ff0000'), TeamSide.RIGHT));
    this.scene.add(this.rightTeam.objGroup);

    /**
     * The world bounds.
     * @type {!THREE.Vector3}
     */
    this.boundingBox = new THREE.Vector3(512, 512, 512);
  }

  /**
   * Dispose this world.
   *
   * @return {void}
   */
  dispose ()
  {
    // TODO: Dispose threejs scene and other objects
    this.worldLoader.dispose();
  }

  /**
   * Create a (new) world representation for the given game log and update this world instance accordingsly.
   *
   * @param  {!GameType} type the world (replay) type (2D or 3D)
   * @param  {!ParameterMap} environmentParams the environment paraméter
   * @param  {!ParameterMap} playerParams the player parameter
   * @param  {!Array<!ParameterMap>} playerTypes the player types list
   * @param  {!TeamDescription} leftTeamDescription the left team description
   * @param  {!TeamDescription} rightTeamDescription the right team description
   * @return {void}
   */
  create (type, environmentParams, playerParams, playerTypes, leftTeamDescription, rightTeamDescription)
  {
    // Update parameters
    this.type = type;
    this.environmentParams = environmentParams;
    this.playerParams = playerParams;
    this.playerTypes = playerTypes;


    // Update field representation
    this.field.set(type, this.environmentParams);
    this.worldLoader.updateField(this.field);


    // Resize ball
    // let ballRadius = /** @type {number} */ (environmentParams[Environment2DParams.BALL_SIZE]);
    // if (!ballRadius) {
    //   ballRadius = type === GameType.TWOD ? 0.2 : 0.042;
    // }
    this.ball.setRadius(type === GameType.TWOD ? 0.2 : 0.042);


    // Reset and load teams
    this.leftTeam.set(leftTeamDescription);
    this.rightTeam.set(rightTeamDescription);
    this.updateTeams(type);


    // Update light shadow cone to closely match field
    this.worldLoader.updateScene(this.scene, this.field.fieldDimensions);


    // Publish change event
    this.dispatchEvent({
      type: WorldEvents.CHANGE
    });
  }

  /**
   * Update representations of teams.
   *
   * @param  {!GameType} type the world (replay) type (2D or 3D)
   * @return {void}
   */
  updateTeams (type)
  {
    // Reload teams
    this.worldLoader.loadTeam(type, this.leftTeam, this.environmentParams, this.playerParams);
    this.worldLoader.loadTeam(type, this.rightTeam, this.environmentParams, this.playerParams);
  }

  /**
   * Update world objects.
   *
   * @param  {!WorldState} state the current world state
   * @param  {!WorldState} nextState the next world state
   * @param  {number} t the interpolation time
   * @return {void}
   */
  update (state, nextState, t)
  {
    this.ball.update(state.ballState, nextState.ballState, t);

    this.leftTeam.update(state.leftAgentStates, nextState.leftAgentStates, t);
    this.rightTeam.update(state.rightAgentStates, nextState.rightAgentStates, t);
  }

  /**
   * Enable or disable shaddows.
   *
   * @param {boolean} enabled true to enable shadows, false to disable
   */
  setShadowsEnabled (enabled)
  {
    let i = this.scene.children.length;

    while (i--) {
      const child = this.scene.children[i];

      if (child.type == 'DirectionalLight' ||
          child.type == 'PointLight' ||
          child.type == 'SpotLight') {
        child.castShadow = enabled;
      }
    }
  }
}

export { World };
