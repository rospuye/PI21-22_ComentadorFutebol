(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.JaSMIn = {}));
})(this, (function (exports) { 'use strict';

	/**
	 * The EventDispatcher class definition.
	 *
	 * The EventDispatcher is kind of copied from threejs and extended to fit into the google closure environment.
	 *
	 * @author Stefan Glaser
	 */
	class EventDispatcher
	{
	  constructor()
	  {
	    /**
	     * The object for holding all known event observer (listener) instances.
	     * @type {?Object}
	     */
	    this.__event_observers = null;
	  }

	  /**
	   * Add callback function for the given event type.
	   *
	   * @param {string} type the event type
	   * @param {!Function} listener the callback function
	   * @return {boolean} true if listener was added, false otherwise
	   */
	  addEventListener (type, listener)
	  {
	    // Lazy create listeners holder object
	    if (this.__event_observers === null) {
	      this.__event_observers = {};
	    }
	    const listeners = this.__event_observers;

	    // Lazy create listener array for specific event
	    if (listeners[type] === undefined) {
	      listeners[type] = [];
	    }

	    // Add listener if not yet present
	    if (listeners[type].indexOf(listener) === -1) {
	      listeners[type].push(listener);
	      return true;
	    }

	    return false;
	  }

	  /**
	   * Remove listener callback funtion from the given event type.
	   *
	   * @param  {string} type the event name
	   * @param  {!Function} listener the callback function
	   * @return {boolean}
	   */
	  removeEventListener (type, listener)
	  {
	    const listeners = this.__event_observers;

	    if (listeners === null) {
	      // No listeners defined, thus nothing to do
	      return false;
	    }

	    const listenerArray = listeners[type];

	    if (listenerArray !== undefined) {
	      const index = listenerArray.indexOf(listener);

	      if (index !== -1) {
	        listenerArray.splice(index, 1);
	        return true;
	      }
	    }

	    return false;
	  }

	  /**
	   * Call to dispatch an event to all registered listeners.
	   *
	   * @param  {!Object} event the event to dispatch
	   * @return {void}
	   */
	  dispatchEvent (event)
	  {
	    const listeners = this.__event_observers;

	    if (listeners === null) {
	      // No listeners defined, thus nothing to do
	      return;
	    }

	    const listenerArray = listeners[event.type];

	    if (listenerArray !== undefined) {
	      const array = [];

	      for (let i = 0; i < listenerArray.length; i++) {
	        array[i] = listenerArray[i];
	      }

	      for (let i = 0; i < array.length; i++) {
	        array[i].call(this, event);
	      }
	    }
	  }
	}

	/**
	 * The GameScore class definition.
	 *
	 * The GameScore provides information about the current score of a game.
	 *
	 * @author Stefan Glaser
	 */
	class GameScore
	{
	  /**
	   * GameScore Constructor
	   * Create a new GameScore holding the scoring information.
	   *
	   * @param {number} time
	   * @param {number} goalsLeft
	   * @param {number} goalsRight
	   * @param {number=} penScoreLeft
	   * @param {number=} penMissLeft
	   * @param {number=} penScoreRight
	   * @param {number=} penMissRight
	   */
	  constructor (time, goalsLeft, goalsRight, penScoreLeft, penMissLeft, penScoreRight, penMissRight)
	  {
	    /**
	     * The global time when this score was reached the first time.
	     * @type {number}
	     */
	    this.time = time;

	    /**
	     * The left team score.
	     * @type {number}
	     */
	    this.goalsLeft = goalsLeft;

	    /**
	     * The left team penalty score.
	     * @type {number}
	     */
	    this.penaltyScoreLeft = penScoreLeft !== undefined ? penScoreLeft : 0;

	    /**
	     * The left team penalty misses.
	     * @type {number}
	     */
	    this.penaltyMissLeft = penMissLeft !== undefined ? penMissLeft : 0;

	    /**
	     * The right team score.
	     * @type {number}
	     */
	    this.goalsRight = goalsRight;

	    /**
	     * The right team penalty score.
	     * @type {number}
	     */
	    this.penaltyScoreRight = penScoreRight !== undefined ? penScoreRight : 0;

	    /**
	     * The right team penalty misses.
	     * @type {number}
	     */
	    this.penaltyMissRight = penMissRight !== undefined ? penMissRight : 0;
	  }
	}

	/**
	 * The GameState class definition.
	 *
	 * The GameState provides information about the current state of a game.
	 *
	 * @author Stefan Glaser
	 */
	class GameState
	{
	  /**
	   * GameState Constructor
	   * Create a new GameState holding the game state information.
	   *
	   * @param {number} time
	   * @param {string} playMode
	   */
	  constructor (time, playMode)
	  {
	    /**
	     * The global time when this state was reached.
	     * @type {number}
	     */
	    this.time = time;

	    /**
	     * The play mode string.
	     * @type {string}
	     */
	    this.playMode = playMode;
	  }

	  /**
	   * Fetch the play mode string.
	   *
	   * @return {string} the play mode string
	   */
	  getPlayModeString ()
	  {
	    return this.playMode;
	  }
	}

	/**
	 * The ParameterMap class definition.
	 *
	 * The ParameterMap provides
	 *
	 * @author Stefan Glaser / http://chaosscripting.net
	 */
	class ParameterMap
	{
	  /**
	   * ParameterMap Constructor
	   *
	   * @param {!Object=} params the parameter object.
	   */
	  constructor(params)
	  {
	    /**
	     * The parameter object.
	     * @type {!Object}
	     */
	    this.paramObj = params !== undefined ? params : {};
	  }

	  /**
	   * Clear this parameter map.
	   *
	   * @return {void}
	   */
	  clear ()
	  {
	    this.paramObj = {};
	  }

	  /**
	   * Fetch a number parameter with the given key.
	   * This method will return null if:
	   * - the key is invalid (undefined)
	   * - the value with the given key is not a number
	   *
	   * @param {string | number} key the key of interest
	   * @return {?number}
	   */
	  getNumber (key)
	  {
	    const value = this.paramObj[key];

	    if (typeof value === 'number') {
	      return value;
	    }

	    return null;
	  }

	  /**
	   * Fetch a boolean parameter with the given key.
	   * This method will return null if:
	   * - the key is invalid (undefined)
	   *
	   * @param {string | number} key the key of interest
	   * @return {?boolean}
	   */
	  getBoolean (key)
	  {
	    const value = this.paramObj[key];

	    if (value !== undefined) {
	      return value ? true : false;
	    }

	    return null;
	  }

	  /**
	   * Fetch a string parameter with the given key.
	   * This method will return null if:
	   * - the key is invalid (undefined)
	   * - the value with the given key is not a string
	   *
	   * @param {string | number} key the key of interest
	   * @return {?string}
	   */
	  getString (key)
	  {
	    const value = this.paramObj[key];

	    if (typeof value === 'string') {
	      return value;
	    }

	    return null;
	  }

	  /**
	   * Fetch a new parameter wrapper object for the object with the given key.
	   * This method will return null if:
	   * - the key is invalid (undefined)
	   * - the value with the given key is not an object
	   *
	   * @param {string | number} key the key of interest
	   * @return {?ParameterMap}
	   */
	  getObject (key)
	  {
	    const value = this.paramObj[key];

	    if (typeof value === 'object') {
	      return new ParameterMap(/** @type {!Object} */ (value));
	    }

	    return null;
	  }
	}

	/**
	 * Enum holding the known game types.
	 * @enum {number}
	 */
	const GameType = {
	  TWOD: 1,
	  THREED: 2
	};

	/**
	 * An enum for the side of a team.
	 * @enum {number}
	 */
	const TeamSide = {
	  LEFT: -1,
	  NEUTRAL: 0,
	  RIGHT: 1
	};

	/**
	 *
	 * @author Stefan Glaser
	 */
	class GameUtil
	{
	  /**
	   * Retrieve a letter representing the side.
	   *
	   * @param  {!TeamSide} side the side value
	   * @param  {boolean=} uppercase true for upper case letter, false for lower case
	   * @return {string} 'l'/'L' for left side, 'r'/'R' for right side, 'n'/'N' for neutral
	   */
	  static getSideLetter (side, uppercase)
	  {
	    if (uppercase) {
	      return side === TeamSide.LEFT ? 'L' : side === TeamSide.RIGHT ? 'R' : 'N';
	    } else {
	      return side === TeamSide.LEFT ? 'l' : side === TeamSide.RIGHT ? 'r' : 'n';
	    }
	  }
	}

	/**
	 * The AgentDescription class definition.
	 *
	 * The AgentDescription provides information about the robot model and player number of an agent.
	 *
	 * @author Stefan Glaser
	 */
	class AgentDescription
	{
	  /**
	   * AgentDescription Constructor
	   * Create a new AgentDescription.
	   *
	   * @param {number} number the player number of this agent
	   * @param {!TeamSide} side the team side
	   * @param {!ParameterMap} playerType the initial player type specification of this agent
	   */
	  constructor (number, side, playerType)
	  {
	    /**
	     * The player number of the agent.
	     * @type {number}
	     */
	    this.playerNo = number;

	    /**
	     * The agent's team side.
	     * @type {!TeamSide}
	     */
	    this.side = side;

	    /**
	     * A list of player type indices, used by this agent.
	     * @type {!Array<!ParameterMap>}
	     */
	    this.playerTypes = [];
	    this.playerTypes.push(playerType);

	    /**
	     * The index of the last used player type of this agent.
	     * @type {number}
	     */
	    this.recentTypeIdx = 0;
	  }

	  /**
	   * Check if this agent is the goal keeper.
	   * @return {boolean} true if this agent is the goal keeper, false otherwise
	   */
	  isGoalie ()
	  {
	    return this.playerNo == 1;
	  }

	  /**
	   * Add the given player type specification to the list of player types if not yet present.
	   *
	   * @param {!ParameterMap} playerType the player type specification to add
	   * @return {boolean} false if nothing was modified, true otherwise
	   */
	  addPlayerType (playerType)
	  {
	    const idx = this.playerTypes.indexOf(playerType);

	    // Add player type to player type list if not yet present
	    if (idx === -1) {
	      this.playerTypes.push(playerType);
	      this.recentTypeIdx = this.playerTypes.length - 1;
	      return true;
	    } else {
	      this.recentTypeIdx = idx;
	      return false;
	    }
	  }

	  /**
	   * Retrieve a letter representing the side.
	   *
	   * @param  {boolean=} uppercase true for upper case letter, false for lower case
	   * @return {string} 'l'/'L' for left side, 'r'/'R' for right side and 'n'/'N' for neutral
	   */
	  getSideLetter (uppercase)
	  {
	    return GameUtil.getSideLetter(this.side, uppercase);
	  }
	}

	/**
	 * The TeamDescription class definition.
	 *
	 * The TeamDescription provides information about a team.
	 *
	 * @author Stefan Glaser
	 */
	class TeamDescription
	{
	  /**
	   * TeamDescription Constructor
	   * Create a new TeamDescription with the given parameters.
	   *
	   * @param {string} name the name of the team
	   * @param {!THREE.Color} color the team color
	   * @param {!TeamSide} side the team side (see TeamSide)
	   */
	  constructor (name, color, side)
	  {
	    /**
	     * The name of the team.
	     * @type {string}
	     */
	    this.name = name;

	    /**
	     * The list of agents playing for this team.
	     * @type {!Array<!AgentDescription>}
	     */
	    this.agents = [];

	    /**
	     * The team color.
	     * @type {!THREE.Color}
	     */
	    this.color = color;

	    /**
	     * The team side (see TeamSide)
	     * @type {!TeamSide}
	     */
	    this.side = side;
	  }

	  /**
	   * Set the name of this team.
	   *
	   * @param {string} name the new name of the team
	   * @return {boolean} true, if the name was updated, false otherwise
	   */
	  setName (name)
	  {
	    const newName = name.split('_').join(' ');

	    if (this.name !== newName) {
	      this.name = newName;
	      return true;
	    }

	    return false;
	  }

	  /**
	   * Set the color of this team.
	   *
	   * @param {!THREE.Color} color the new color of the team
	   * @return {boolean} true, if the color was updated, false otherwise
	   */
	  setColor (color)
	  {
	    if (!this.color.equals(color)) {
	      this.color = color;
	      return true;
	    }

	    return false;
	  }

	  /**
	   * Add an agent description for the given player number and robot model.
	   * If there doesn't exist an agent description to the given player number,
	   * this method will create a new agent description with the given player number and robot model.
	   * If there already exists an agent description with the given player number,
	   * this method will add the given robot model to the agent description if it is not yet present.
	   *
	   * @param {number} number the agent player number
	   * @param {!ParameterMap} playerType the player type
	   * @return {boolean} false if nothing was modified, true otherwise
	   */
	  addAgent (number, playerType)
	  {
	    let i = this.agents.length;

	    // Check if there already exists a agent description with the given number
	    while (i--) {
	      if (this.agents[i].playerNo === number) {
	        // Add the given player type to the agent
	        return this.agents[i].addPlayerType(playerType);
	      }
	    }

	    // If no agent definition was found for the given player number, create a new one
	    this.agents.push(new AgentDescription(number, this.side, playerType));

	    return true;
	  }

	  /**
	   * Retrieve the index of the last used player type specification of the agent with the given player number.
	   *
	   * @param  {number} number the player number of the agent of interest
	   * @return {number} the index of the last used player type specification
	   */
	  getRecentTypeIdx (number)
	  {
	    let i = this.agents.length;

	    // Retrieve the requested index from the agent description if existing
	    while (i--) {
	      if (this.agents[i].playerNo === number) {
	        return this.agents[i].recentTypeIdx;
	      }
	    }

	    // return zero by default, if no corresponding agent description was found
	    return 0;
	  }

	  /**
	   * Retrieve a letter representing the side.
	   *
	   * @param  {boolean=} uppercase true for upper case letter, false for lower case
	   * @return {string} 'l'/'L' for left side, 'r'/'R' for right side and 'n'/'N' for neutral
	   */
	  getSideLetter (uppercase)
	  {
	    return GameUtil.getSideLetter(this.side, uppercase);
	  }
	}

	/**
	 * Indices in the object state array.
	 * @enum {number}
	 */
	const OSIndices = {
	  X_POS: 0,
	  Y_POS: 1,
	  Z_POS: 2,
	  X_QUAT: 3,
	  Y_QUAT: 4,
	  Z_QUAT: 5,
	  W_QUAT: 6
	};



	/**
	 * The ObjectState class definition.
	 *
	 * This basic ObjectState provides information about the object's position and orientation at a specific point in time.
	 *
	 * @author Stefan Glaser
	 */
	class ObjectState
	{
	  /**
	   * ObjectState Constructor
	   * Create a new ObjectState with the given state information.
	   *
	   * @param {!Array<number> |
	   *         !Float32Array |
	   *         {
	   *           x: number,
	   *           y: number,
	   *           z: number,
	   *           qx: number,
	   *           qy: number,
	   *           qz: number,
	   *           qw: number
	   *         }=} params the object state information vector
	   */
	  constructor (params = undefined)
	  {
	    /**
	     * The generic state array of the object.
	     * @type {!Array<number> | !Float32Array}
	     */
	    this.state = [];

	    // Initialize unit quaternion if no state information was passed
	    if (params === undefined) {
	      this.state = ObjectState.encodeObjectState(0, 0, 0, 0, 0, 0, 1);
	    } else if (params instanceof Float32Array || params instanceof Array) {
	      this.state = params;
	    } else {
	      this.state = ObjectState.encodeObjectState(params.x, params.y, params.z, params.qx, params.qy, params.qz, params.qw);
	    }
	  }

	  /**
	   * Retrieve the x position of the object.
	   * @return {number} the x-position
	   */
	  get x ()
	  {
	    return this.state[OSIndices.X_POS] || 0;
	  }

	  /**
	   * Set the x position of the object.
	   * @param {number} x the new x position value
	   * @return {void}
	   */
	  set x (x)
	  {
	    this.state[OSIndices.X_POS] = x;
	  }

	  /**
	   * Retrieve the y position of the object.
	   * @return {number} the y-position
	   */
	  get y ()
	  {
	    return this.state[OSIndices.Y_POS] || 0;
	  }

	  /**
	   * Set the y position of the object.
	   * @param {number} y the new y position value
	   * @return {void}
	   */
	  set y (y)
	  {
	    this.state[OSIndices.Y_POS] = y;
	  }

	  /**
	   * Retrieve the z position of the object.
	   * @return {number} the z-position
	   */
	  get z ()
	  {
	    return this.state[OSIndices.Z_POS] || 0;
	  }

	  /**
	   * Set the z position of the object.
	   * @param {number} z the new z position value
	   * @return {void}
	   */
	  set z (z)
	  {
	    this.state[OSIndices.Z_POS] = z;
	  }

	  /**
	   * Retrieve the the x-term of the orientation quaternion vector of the object.
	   * @return {number} the x-term of the quaternion vector
	   */
	  get qx ()
	  {
	    return this.state[OSIndices.X_QUAT] || 0;
	  }

	  /**
	   * Set the the x-term of the orientation quaternion vector of the object.
	   * @param {number} qx the x-term of the quaternion vector
	   * @return {void}
	   */
	  set qx (qx)
	  {
	    this.state[OSIndices.X_QUAT] = qx;
	  }

	  /**
	   * Retrieve the the y-term of the orientation quaternion vector of the object.
	   * @return {number} the y-term of the quaternion vector
	   */
	  get qy ()
	  {
	    return this.state[OSIndices.Y_QUAT] || 0;
	  }

	  /**
	   * Set the the y-term of the orientation quaternion vector of the object.
	   * @param {number} qy the y-term of the quaternion vector
	   * @return {void}
	   */
	  set qy (qy)
	  {
	    this.state[OSIndices.Y_QUAT] = qy;
	  }

	  /**
	   * Retrieve the the z-term of the orientation quaternion vector of the object.
	   * @return {number} the z-term of the quaternion vector
	   */
	  get qz ()
	  {
	    return this.state[OSIndices.Z_QUAT] || 0;
	  }

	  /**
	   * Set the the z-term of the orientation quaternion vector of the object.
	   * @param {number} qz the z-term of the quaternion vector
	   * @return {void}
	   */
	  set qz (qz)
	  {
	    this.state[OSIndices.Z_QUAT] = qz;
	  }

	  /**
	   * Retrieve the the scalar term of the orientation quaternion of the object.
	   * @return {number} the scalar term of the quaternion
	   */
	  get qw ()
	  {
	    return this.state[OSIndices.W_QUAT] !== undefined ? this.state[OSIndices.W_QUAT] : 1;
	  }

	  /**
	   * Set the the scalar term of the orientation quaternion of the object.
	   * @param {number} qw the scalar term of the quaternion
	   * @return {void}
	   */
	  set qw (qw)
	  {
	    this.state[OSIndices.W_QUAT] = qw;
	  }

	  /**
	   * Retrieve the position of the object.
	   * @return {!THREE.Vector3} the position vector
	   */
	  get position ()
	  {
	    const stateInfo = this.state;
	    return new THREE.Vector3(stateInfo[OSIndices.X_POS] || 0, stateInfo[OSIndices.Y_POS] || 0, stateInfo[OSIndices.Z_POS] || 0);
	  }

	  /**
	   * Set the position of the object.
	   * @param {!THREE.Vector3} pos the position vector
	   * @return {void}
	   */
	  set position (pos)
	  {
	    this.state[OSIndices.X_POS] = pos.x;
	    this.state[OSIndices.Y_POS] = pos.y;
	    this.state[OSIndices.Z_POS] = pos.z;
	  }

	  /**
	   * Retrieve the orientation of the object.
	   * @return {!THREE.Quaternion} the orientation quaternion
	   */
	  get orientation ()
	  {
	    const stateInfo = this.state;
	    return new THREE.Quaternion(stateInfo[OSIndices.X_QUAT] || 0, stateInfo[OSIndices.Y_QUAT] || 0, stateInfo[OSIndices.Z_QUAT] || 0, stateInfo[OSIndices.W_QUAT] !== undefined ? stateInfo[OSIndices.W_QUAT] : 1);
	  }

	  /**
	   * Set the orientation of the object.
	   * @param {!THREE.Quaternion} rot the orientation quaternion
	   * @return {void}
	   */
	  set orientation (rot)
	  {
	    this.state[OSIndices.X_QUAT] = rot.x;
	    this.state[OSIndices.Y_QUAT] = rot.y;
	    this.state[OSIndices.Z_QUAT] = rot.z;
	    this.state[OSIndices.W_QUAT] = rot.w;
	  }

	  /**
	   * Checks ObjectState for validity.
	   * @return {boolean} true if the orientation quaternion is well defined, false otherwise
	   */
	  isValid ()
	  {
	    const stateInfo = this.state;
	    return stateInfo[OSIndices.X_QUAT] !== 0 || stateInfo[OSIndices.Y_QUAT] !== 0 || stateInfo[OSIndices.Z_QUAT] !== 0 || stateInfo[OSIndices.W_QUAT] !== 0;
	  }

	  /**
	   * Encode the given object state information into a more memory friendly array representation.
	   * 
	   * @param {number} x the x position of the object
	   * @param {number} y the y position of the object
	   * @param {number} z the z position of the object
	   * @param {number} qx the x-term of the quaternion vector
	   * @param {number} qy the y-term of the quaternion vector
	   * @param {number} qz the z-term of the quaternion vector
	   * @param {number} qw the scalar term of the quaternion
	   * @param {!Array<number> | !Float32Array=} target the target array
	   * @return {!Array<number> | !Float32Array} the array encoded state information
	   */
	  static encodeObjectState (x, y, z, qx, qy, qz, qw, target)
	  {
	    if (target === undefined) {
	      target = new Float32Array(7);
	    }

	    target[OSIndices.X_POS] = x;
	    target[OSIndices.Y_POS] = y;
	    target[OSIndices.Z_POS] = z;

	    target[OSIndices.X_QUAT] = qx;
	    target[OSIndices.Y_QUAT] = qy;
	    target[OSIndices.Z_QUAT] = qz;
	    target[OSIndices.W_QUAT] = qw;

	    return target;
	  }
	}

	/**
	 * Indices in the agent state array.
	 * @enum {number}
	 */
	 const ASIndices = {
	  MODEL_IDX: 7,
	  FLAGS: 8,
	  DATA_IDX: 9,
	  JOINT_ANGLES: 10
	};



	/**
	 * The AgentState class definition.
	 *
	 * The AgentState provides information about the state of an agent at a specific time.
	 *
	 * @author Stefan Glaser
	 */
	class AgentState extends ObjectState
	{
	  /**
	   * AgentState Constructor
	   * Create a new AgentState for the given state information.
	   * 
	   * @param {!Array<number> |
	   *         !Float32Array |
	   *         {
	   *           modelIdx: number,
	   *           flags: number,
	   *           x: number,
	   *           y: number,
	   *           z: number,
	   *           qx: number,
	   *           qy: number,
	   *           qz: number,
	   *           qw: number,
	   *           jointAngles: !Array<number>,
	   *           data: !Array<number>
	   *         }=} params the agent state parameter
	   */
	  constructor (params = undefined)
	  {
	    super((params instanceof Float32Array || params instanceof Array) ? params : []);

	    if (params === undefined) {
	      this.state = AgentState.encodeAgentState(0, 0, 0, 0, 0, 0, 0, 0, 1, [], []);
	    } else if (!(params instanceof Float32Array || params instanceof Array)) {
	      this.state = AgentState.encodeAgentState(params.modelIdx, params.flags, params.x, params.y, params.z, params.qx, params.qy, params.qz, params.qw, params.jointAngles, params.data);
	    }
	  }

	  /**
	   * Retrieve the index of the currently used robot model.
	   * @return {number} the currently model index
	   */
	  get modelIndex ()
	  {
	    return Math.round(this.state[ASIndices.MODEL_IDX] || 0);
	  }

	  /**
	   * Retrieve the agent flags bitfield.
	   * @return {number} the flags bitfield
	   */
	  get flags ()
	  {
	    return this.state[ASIndices.FLAGS] || 0;
	  }

	  /**
	   * Retreive the joint angles of the robot model.
	   * @return {!Array<number> | !Float32Array} the joint angles
	   */
	  get jointAngles ()
	  {
	    return this.state.slice(ASIndices.JOINT_ANGLES, this.state[ASIndices.DATA_IDX]);
	  }

	  /**
	   * Retreive the generic data associated with the agent (stamina, fouls, etc.).
	   * @return {!Array<number> | !Float32Array} the generic agent data
	   */
	  get data ()
	  {
	    return this.state.slice(this.state[ASIndices.DATA_IDX]);
	  }

	  /**
	   * @override
	   * @returns {boolean}
	   */
	  isValid ()
	  {
	    return super.isValid() && this.state.length > ASIndices.DATA_IDX;
	  }

	  /**
	   * Encode the given agent state information into a more memory friendly array representation.
	   *
	   * @param {number} modelIdx the index of the currently used robot model
	   * @param {number} flags the flags bitfield
	   * @param {number} x the x position of the object
	   * @param {number} y the y position of the object
	   * @param {number} z the z position of the object
	   * @param {number} qx the x-term of the quaternion vector
	   * @param {number} qy the y-term of the quaternion vector
	   * @param {number} qz the z-term of the quaternion vector
	   * @param {number} qw the scalar term of the quaternion
	   * @param {!Array<number>} jointAngles array holding the joint angles
	   * @param {!Array<number>} data dynamic data associated with the agent (stamina, fouls, etc.)
	   * @param {!Array<number> | !Float32Array=} target the target array
	   * @return {!Array<number> | !Float32Array} the array encoded state information
	   */
	  static encodeAgentState (modelIdx, flags, x, y, z, qx, qy, qz, qw, jointAngles, data, target = undefined)
	  {
	    if (target === undefined) {
	      target = new Float32Array(7 + 3 + jointAngles.length + data.length);
	    }

	    ObjectState.encodeObjectState(x, y, z, qx, qy, qz, qw, target);

	    const dataIdx = ASIndices.JOINT_ANGLES + jointAngles.length;
	    target[ASIndices.MODEL_IDX] = modelIdx;
	    target[ASIndices.FLAGS] = flags;
	    target[ASIndices.DATA_IDX] = dataIdx;

	    for (let i = 0; i < jointAngles.length; i++) {
	      target[ASIndices.JOINT_ANGLES + i] = jointAngles[i];
	    }

	    for (let i = 0; i < data.length; i++) {
	      target[dataIdx + i] = data[i];
	    }

	    return target;
	  }
	}

	/**
	 * The WorldState class definition.
	 *
	 * The WorldState provides information about the state of the game, the ball and all agents on the field.
	 *
	 * @author Stefan Glaser
	 */
	class WorldState
	{
	  /**
	   * WorldState Constructor
	   * Create a new WorldState holding the given information.
	   *
	   * @param {number} time the global time
	   * @param {number} gameTime the game time
	   * @param {!GameState} gameState the game state
	   * @param {!GameScore} score the game score
	   * @param {!Array<number> | !Float32Array} ball the ball state
	   * @param {!Array<!Array<number> | !Float32Array | undefined>} leftAgents array of agent states for the left team
	   * @param {!Array<!Array<number> | !Float32Array | undefined>} rightAgents array of agent states for the right team
	   */
	  constructor (time, gameTime, gameState, score, ball, leftAgents, rightAgents)
	  {
	    /**
	     * The global time.
	     * @type {number}
	     */
	    this.time = time;

	    /**
	     * The game time.
	     * @type {number}
	     */
	    this.gameTime = gameTime;

	    /**
	     * The state of the game.
	     * @type {!GameState}
	     */
	    this.gameState = gameState;

	    /**
	     * The game score.
	     * @type {!GameScore}
	     */
	    this.score = score;

	    /**
	     * The state of the ball.
	     * @type {!Array<number> | !Float32Array}
	     */
	    this.ballStateArr = ball;

	    /**
	     * The states of all left agents.
	     * @type {!Array<!Array<number> | !Float32Array | undefined>}
	     */
	    this.leftAgentStateArrs = leftAgents;

	    /**
	     * The states of all right agents.
	     * @type {!Array<!Array<number> | !Float32Array | undefined>}
	     */
	    this.rightAgentStateArrs = rightAgents;
	  }

	  /**
	   * Retrieve the ball state.
	   * 
	   * @return {!ObjectState}
	   */
	  get ballState ()
	  {
	    return new ObjectState(this.ballStateArr);
	  }

	  /**
	   * Retrieve the list of left agent states.
	   * 
	   * @return {!Array<!AgentState | undefined>}
	   */
	  get leftAgentStates ()
	  {
	    return WorldState.wrapAgentStatesArray(this.leftAgentStateArrs);
	  }

	  /**
	   * Retrieve the list of right agent states.
	   * 
	   * @return {!Array<!AgentState | undefined>}
	   */
	  get rightAgentStates ()
	  {
	    return WorldState.wrapAgentStatesArray(this.rightAgentStateArrs);
	  }

	  /**
	   * Wrap agent state arrays in actual agent state objects.
	   * 
	   * @param {!Array<!Array<number> | !Float32Array | undefined>} statesArr the array of states to wrap
	   * @return {!Array<!AgentState | undefined>}
	   */
	  static wrapAgentStatesArray (statesArr)
	  {
	    return statesArr.map(stateArr => stateArr !== undefined ? new AgentState(stateArr) : undefined);
	  }

	  /**
	   * Extract the list of underlying agent state information arrays.
	   * 
	   * @param {!Array<!AgentState | undefined>} agentStates the array of agent states to unwrap
	   * @return {!Array<!Array<number> | !Float32Array | undefined>}
	   */
	  static unwrapAgentStatesArray (agentStates)
	  {
	    return agentStates.map(agentState => agentState !== undefined ? agentState.state : undefined);
	  }
	}

	/**
	 * Simple helper for SimSpark simulator.
	 *
	 * @author Stefan Glaser
	 */
	class SparkUtil
	{
	  /**
	   * Create a new environment parameters object with default values set for 3D games.
	   *
	   * @return {!ParameterMap}
	   */
	  static createDefaultEnvironmentParams ()
	  {
	    return SparkUtil.createEnvironmentParamsV66();
	  }

	  /**
	   * Create a new set of environment parameters for SimSpark version 62.
	   *
	   * @return {!ParameterMap}
	   */
	  static createEnvironmentParamsV62 ()
	  {
	    const params = {};

	    params[Environment3DParams.LOG_STEP] = 200;

	    // Default parameters for version 66
	    params[Environment3DParams.FIELD_LENGTH] = 12;
	    params[Environment3DParams.FIELD_WIDTH] = 8;
	    params[Environment3DParams.FIELD_HEIGHT] = 40;
	    params[Environment3DParams.GOAL_WIDTH] = 1.4;
	    params[Environment3DParams.GOAL_DEPTH] = 0.4;
	    params[Environment3DParams.GOAL_HEIGHT] = 0.8;
	    params[Environment3DParams.FREE_KICK_DISTANCE] = 1;
	    params[Environment3DParams.AGENT_RADIUS] = 0.4;
	    params[Environment3DParams.BALL_RADIUS] = 0.042;
	    params[Environment3DParams.RULE_HALF_TIME] = 300;

	    return new ParameterMap(params);
	  }

	  /**
	   * Create a new set of environment parameters for SimSpark version 63.
	   *
	   * @return {!ParameterMap}
	   */
	  static createEnvironmentParamsV63 ()
	  {
	    const paramMap = SparkUtil.createEnvironmentParamsV62();

	    // Default parameters for version 66
	    paramMap.paramObj[Environment3DParams.FIELD_LENGTH] = 18;
	    paramMap.paramObj[Environment3DParams.FIELD_WIDTH] = 12;

	    paramMap.paramObj[Environment3DParams.GOAL_WIDTH] = 2.1;
	    paramMap.paramObj[Environment3DParams.GOAL_DEPTH] = 0.6;

	    paramMap.paramObj[Environment3DParams.FREE_KICK_DISTANCE] = 1.8;

	    return paramMap;
	  }

	  /**
	   * Create a new set of environment parameters for SimSpark version 64.
	   *
	   * @return {!ParameterMap}
	   */
	  static createEnvironmentParamsV64 ()
	  {
	    const paramMap = SparkUtil.createEnvironmentParamsV63();

	    // Default parameters for version 66
	    paramMap.paramObj[Environment3DParams.FIELD_LENGTH] = 21;
	    paramMap.paramObj[Environment3DParams.FIELD_WIDTH] = 14;

	    return paramMap;
	  }

	  /**
	   * Create a new set of environment parameters for SimSpark version 66.
	   *
	   * @return {!ParameterMap}
	   */
	  static createEnvironmentParamsV66 ()
	  {
	    const paramMap = SparkUtil.createEnvironmentParamsV63();

	    // Default parameters for version 66
	    paramMap.paramObj[Environment3DParams.FIELD_LENGTH] = 30;
	    paramMap.paramObj[Environment3DParams.FIELD_WIDTH] = 20;

	    paramMap.paramObj[Environment3DParams.FREE_KICK_DISTANCE] = 2;

	    return paramMap;
	  }

	  /**
	   * Create a new player parameters object with default values set for 3D games.
	   *
	   * @return {!ParameterMap}
	   */
	  static createDefaultPlayerParams ()
	  {
	    const params = {};

	    return new ParameterMap(params);
	  }

	  /**
	   * Create a new list of default player type parameter objects for 3D games.
	   *
	   * @return {!Array<!ParameterMap>}
	   */
	  static createDefaultPlayerTypeParams ()
	  {
	    const types = [];

	    // Create nao_hetero0 to nao_hetero4 player types
	    for (let i = 0; i < 5; i++) {
	      types[i] = new ParameterMap();
	      types[i].paramObj[PlayerType3DParams.MODEL_NAME] = 'nao_hetero';
	      types[i].paramObj[PlayerType3DParams.MODEL_TYPE] = i;
	    }

	    return types;
	  }
	}

	/**
	 * An enum providing known environment parameter names for 3D games.
	 * @enum {string}
	 */
	const Environment3DParams = {
	  LOG_STEP: 'log_step',

	  FIELD_LENGTH: 'FieldLength',
	  FIELD_WIDTH: 'FieldWidth',
	  FIELD_HEIGHT: 'FieldHeight',
	  GOAL_WIDTH: 'GoalWidth',
	  GOAL_DEPTH: 'GoalDepth',
	  GOAL_HEIGHT: 'GoalHeight',
	  BORDER_SIZE: 'BorderSize',
	  FREE_KICK_DISTANCE: 'FreeKickDistance',
	  WAIT_BEFORE_KICK_OFF: 'WaitBeforeKickOff',
	  AGENT_MASS: 'AgentMass',
	  AGENT_RADIUS: 'AgentRadius',
	  AGENT_MAX_SPEED: 'AgentMaxSpeed',
	  BALL_RADIUS: 'BallRadius',
	  BALL_MASS: 'BallMass',
	  RULE_GOAL_PAUSE_TIME: 'RuleGoalPauseTime',
	  RULE_KICK_IN_PAUSE_TIME: 'RuleKickInPauseTime',
	  RULE_HALF_TIME: 'RuleHalfTime',
	  PLAY_MODES: 'play_modes'
	};

	/**
	 * An enum providing known player type parameter names for 3D games.
	 * @enum {string}
	 */
	const PlayerType3DParams = {
	  MODEL_NAME: 'model',
	  MODEL_TYPE: 'model_type'
	};

	/**
	 * Simple helper for 2D league.
	 *
	 * @author Stefan Glaser
	 */
	class SServerUtil
	{
	  /**
	   * Create a set of default environment parameters.
	   *
	   * @return {!ParameterMap} a list of default environment parameters
	   */
	  static createDefaultEnvironmentParams ()
	  {
	    const params = {};

	    params[Environment2DParams.SIMULATOR_STEP] = 100;

	    return new ParameterMap(params);
	  }

	  /**
	   * Create a set of default player parameters.
	   *
	   * @return {!ParameterMap} a list of default player parameters
	   */
	  static createDefaultPlayerParams ()
	  {
	    const params = {};

	    params[Player2DParams.PLAYER_TYPES] = 1;

	    return new ParameterMap(params);
	  }

	  /**
	   * Create a set of default player types.
	   *
	   * @return {!Array<!ParameterMap>} a list of default player types
	   */
	  static createDefaultPlayerTypeParams ()
	  {
	    const types = [];

	    types[0] = new ParameterMap();
	    types[0].paramObj[PlayerType2DParams.PLAYER_SIZE] = 0.3;

	    return types;
	  }
	}

	/**
	 * An enum providing meaning the indices for the different elements in the agent flags bitfield for 2D games.
	 * @enum {number}
	 */
	const Agent2DFlags = {
	    DISABLE:         0x00000000,
	    STAND:           0x00000001,
	    KICK:            0x00000002,
	    KICK_FAULT:      0x00000004,
	    GOALIE:          0x00000008,
	    CATCH:           0x00000010,
	    CATCH_FAULT:     0x00000020,
	    BALL_TO_PLAYER:  0x00000040,
	    PLAYER_TO_BALL:  0x00000080,
	    DISCARD:         0x00000100,
	    LOST:            0x00000200,
	    BALL_COLLIDE:    0x00000400,
	    PLAYER_COLLIDE:  0x00000800,
	    TACKLE:          0x00001000,
	    TACKLE_FAULT:    0x00002000,
	    BACK_PASS:       0x00004000,
	    FREE_KICK_FAULT: 0x00008000,
	    POST_COLLIDE:    0x00010000,
	    FOUL_CHARGED:    0x00020000,
	    YELLOW_CARD:     0x00040000,
	    RED_CARD:        0x00080000,
	};

	/**
	 * An enum providing meaning the indices for the different elements in the agent data array for 2D games.
	 * @enum {number}
	 */
	const Agent2DData = {
	  STAMINA: 0,
	  STAMINA_EFFORT: 1,
	  STAMINA_RECOVERY: 2,
	  STAMINA_CAPACITY: 3,

	  VIEW_QUALITY: 4,
	  VIEW_WIDTH: 5,

	  FOCUS_SIDE: 6,
	  FOCUS_UNUM: 7,

	  KICK_COUNT: 8,
	  DASH_COUNT: 9,
	  TURN_COUNT: 10,
	  CATCH_COUNT: 11,
	  MOVE_COUNT: 12,
	  TURN_NECK_COUNT: 13,
	  VIEW_COUNT: 14,
	  SAY_COUNT: 15,
	  TACKLE_COUNT: 16,
	  POINT_TO_COUNT: 17,
	  ATTENTION_COUNT: 18
	};

	/**
	 * An enum providing meaning the indices for the different elements in the environement parameter array for 2D games.
	 * @enum {string}
	 */
	const Environment2DParams = {
	  GOAL_WIDTH: 'goal_width',
	  INERTIA_MOMENT: 'inertia_moment',
	  PLAYER_SIZE: 'player_size',
	  PLAYER_DECAY: 'player_decay',
	  PLAYER_RAND: 'player_rand',
	  PLAYER_WEIGHT: 'player_weight',
	  PLAYER_SPEED_MAX: 'player_speed_max',
	  PLAYER_ACCEL_MAX: 'player_accel_max',
	  STAMINA_MAX: 'stamina_max',
	  STAMINA_INC_MAX: 'stamina_inc_max',
	  RECOVER_INIT: 'recover_init',
	  RECOVER_DEC_THR: 'recover_dec_thr',
	  RECOVER_MIN: 'recover_min',
	  RECOVER_DEC: 'recover_dec',
	  EFFORT_INIT: 'effort_init',
	  EFFORT_DEC_THR: 'effort_dec_thr',
	  EFFORT_MIN: 'effort_min',
	  EFFORT_DEC: 'effort_dec',
	  EFFORT_INC_THR: 'effort_inc_thr',
	  EFFORT_INC: 'effort_inc',
	  KICK_RAND: 'kick_rand',
	  TEAM_ACTUATOR_NOISE: 'team_actuator_noise',
	  PLAYER_RAND_FACTOR_L: 'prand_factor_l',
	  PLAYER_RAND_FACTOR_R: 'prand_factor_r',
	  KICK_RAND_FACTOR_L: 'kick_rand_factor_l',
	  KICK_RAND_FACTOR_R: 'kick_rand_factor_r',
	  BALL_SIZE: 'ball_size',
	  BALL_DECAY: 'ball_decay',
	  BALL_RAND: 'ball_rand',
	  BALL_WEIGHT: 'ball_weight',
	  BALL_SPEED_MAX: 'ball_speed_max',
	  BALL_ACCEL_MAX: 'ball_accel_max',
	  DASH_POWER_RATE: 'dash_power_rate',
	  KICK_POWER_RATE: 'kick_power_rate',
	  KICKABLE_MARGIN: 'kickable_margin',
	  CONTROL_RADIUS: 'control_radius',
	  CONTROL_RADIUS_WIDTH: 'control_radius_width',
	  CATCH_PROBABILITY: 'catch_probability',
	  CATCHABLE_AREA_L: 'catchable_area_l',
	  CATCHABLE_AREA_W: 'catchable_area_w',
	  GOALIE_MAX_MOVES: 'goalie_max_moves',
	  MAX_POWER: 'maxpower',
	  MIN_POWER: 'minpower',
	  MAX_MOMENT: 'maxmoment',
	  MIN_MOMENT: 'minmoment',
	  MAX_NECK_MOMENT: 'maxneckmoment',
	  MIN_NECK_MOMENT: 'minneckmoment',
	  MAX_NECK_ANGLE: 'maxneckang',
	  MIN_NECK_ANGLE: 'minneckang',
	  VISIBLE_ANGLE: 'visible_angle',
	  VISIBLE_DISTANCE: 'visible_distance',
	  AUDIO_CUT_DIST: 'audio_cut_dist',
	  QUANTIZE_STEP: 'quantize_step',
	  LANDMARK_QUANTIZE_STEP: 'quantize_step_l',
	  CORNER_KICK_MARGIN: 'ckick_margin',
	  WIND_DIR: 'wind_dir',
	  WIND_FORCE: 'wind_force',
	  WIND_ANGLE: 'wind_ang',
	  WIND_RAND: 'wind_rand',
	  WIND_NONE: 'wind_none',
	  WIND_RANDOM: 'wind_random',
	  HALF_TIME: 'half_time',
	  DROP_BALL_TIME: 'drop_ball_time',
	  PORT: 'port',
	  COACH_PORT: 'coach_port',
	  ONLINE_COACH_PORT: 'olcoach_port',
	  SAY_COACH_COUNT_MAX: 'say_coach_cnt_max',
	  SAY_COACH_MSG_SIZE: 'say_coach_msg_size',
	  SIMULATOR_STEP: 'simulator_step',
	  SEND_STEP: 'send_step',
	  RECV_STEP: 'recv_step',
	  SENSE_BODY_STEP: 'sense_body_step',
	  SAY_MSG_SIZE: 'say_msg_size',
	  CLANG_WIN_SIZE: 'clang_win_size',
	  CLANG_DEFINE_WIN: 'clang_define_win',
	  CLANG_META_WIN: 'clang_meta_win',
	  CLANG_ADVICE_WIN: 'clang_advice_win',
	  CLANG_INFO_WIN: 'clang_info_win',
	  CLANG_DEL_WIN: 'clang_del_win',
	  CLANG_RULE_WIN: 'clang_rule_win',
	  CLANG_MESS_DELAY: 'clang_mess_delay',
	  CLANG_MESS_PER_CYCLE: 'clang_mess_per_cycle',
	  HEAR_MAX: 'hear_max',
	  HEAR_INC: 'hear_inc',
	  HEAR_DECAY: 'hear_decay',
	  CATCH_BAN_CYCLE: 'catch_ban_cycle',
	  COACH_MODE: 'coach',
	  COACH_WITH_REFEREE_MODE: 'coach_w_referee',
	  OLD_COACH_HEAR: 'old_coach_hear',
	  SEND_VI_STEP: 'send_vi_step',
	  USE_OFFSIDE: 'use_offside',
	  OFFSIDE_ACTIVE_AREA_SIZE: 'offside_active_area_size',
	  FORBID_KICK_OFF_OFFSIDE: 'forbid_kick_off_offside',
	  VERBOSE: 'verbose',
	  OFFSIDE_KICK_MARGIN: 'offside_kick_margin',
	  SLOW_DOWN_FACTOR: 'slow_down_factor',
	  SYNCH_MODE: 'synch_mode',
	  SYNCH_OFFSET: 'synch_offset',
	  SYNCH_MICRO_SLEEP: 'synch_micro_sleep',
	  START_GOAL_L: 'start_goal_l',
	  START_GOAL_R: 'start_goal_r',
	  FULLSTATE_L: 'fullstate_l',
	  FULLSTATE_R: 'fullstate_r',
	  SLOWNESS_ON_TOP_FOR_LEFT_TEAM: 'slowness_on_top_for_left_team',
	  SLOWNESS_ON_TOP_FOR_RIGHT_TEAM: 'slowness_on_top_for_right_team',
	  LANDMARK_FILE: 'landmark_file',
	  SEND_COMMS: 'send_comms',
	  TEXT_LOGGING: 'text_logging',
	  GAME_LOGGING: 'game_logging',
	  GAME_LOG_VERSION: 'game_log_version',
	  TEXT_LOG_DIR: 'text_log_dir',
	  GAME_LOG_DIR: 'game_log_dir',
	  TEXT_LOG_FIXED_NAME: 'text_log_fixed_name',
	  GAME_LOG_FIXED_NAME: 'game_log_fixed_name',
	  TEXT_LOG_FIXED: 'text_log_fixed',
	  GAME_LOG_FIXED: 'game_log_fixed',
	  TEXT_LOG_DATED: 'text_log_dated',
	  GAME_LOG_DATED: 'game_log_dated',
	  LOG_DATE_FORMAT: 'log_date_format',
	  LOG_TIMES: 'log_times',
	  RECORD_MESSAGES: 'record_messages',
	  TEXT_LOG_COMPRESSION: 'text_log_compression',
	  GAME_LOG_COMPRESSION: 'game_log_compression',
	  PROFILE: 'profile',
	  POINT_TO_BAN: 'point_to_ban',
	  POINT_TO_DURATION: 'point_to_duration',
	  TACKLE_DIST: 'tackle_dist',
	  TACKLE_BACK_DIST: 'tackle_back_dist',
	  TACKLE_WIDTH: 'tackle_width',
	  TACKLE_EXPONENT: 'tackle_exponent',
	  TACKLE_CYCLES: 'tackle_cycles',
	  TACKLE_POWER_RATE: 'tackle_power_rate',
	  FREEFORM_WAIT_PERIOD: 'freeform_wait_period',
	  FREEFORM_SEND_PERIOD: 'freeform_send_period',
	  FREE_KICK_FAULTS: 'free_kick_faults',
	  BACK_PASSES: 'back_passes',
	  PROPER_GOAL_KICKS: 'proper_goal_kicks',
	  STOPPED_BALL_VEL: 'stopped_ball_vel',
	  MAX_GOAL_KICKS: 'max_goal_kicks',
	  AUTO_MODE: 'auto_mode',
	  KICK_OFF_WAIT: 'kick_off_wait',
	  CONNECT_WAIT: 'connect_wait',
	  GAME_OVER_WAIT: 'game_over_wait',
	  TEAM_L_START: 'team_l_start',
	  TEAM_R_START: 'team_r_start',
	  KEEPAWAY_MODE: 'keepaway',
	  KEEPAWAY_LENGTH: 'keepaway_length',
	  KEEPAWAY_WIDTH: 'keepaway_width',
	  KEEPAWAY_LOGGING: 'keepaway_logging',
	  KEEPAWAY_LOG_DIR: 'keepaway_log_dir',
	  KEEPAWAY_LOG_FIXED_NAME: 'keepaway_log_fixed_name',
	  KEEPAWAY_LOG_FIXED: 'keepaway_log_fixed',
	  KEEPAWAY_LOG_DATED: 'keepaway_log_dated',
	  KEEPAWAY_START: 'keepaway_start',
	  NR_NORMAL_HALFS: 'nr_normal_halfs',
	  NR_EXTRA_HALFS: 'nr_extra_halfs',
	  PENALTY_SHOOT_OUTS: 'penalty_shoot_outs',
	  PEN_BEFORE_SETUP_WAIT: 'pen_before_setup_wait',
	  PEN_SETUP_WAIT: 'pen_setup_wait',
	  PEN_READY_WAIT: 'pen_ready_wait',
	  PEN_TAKEN_WAIT: 'pen_taken_wait',
	  PEN_NR_KICKS: 'pen_nr_kicks',
	  PEN_MAX_EXTRA_KICKS: 'pen_max_extra_kicks',
	  PEN_DIST_X: 'pen_dist_x',
	  PEN_RANDOM_WINNER: 'pen_random_winner',
	  PEN_MAX_GOALIE_DIST_X: 'pen_max_goalie_dist_x',
	  PEN_ALLOW_MULT_KICKS: 'pen_allow_mult_kicks',
	  PEN_COACH_MOVES_PLAYERS: 'pen_coach_moves_players',
	  BALL_STUCK_AREA: 'ball_stuck_area',
	  COACH_MSG_FILE: 'coach_msg_file',
	  MAX_TACKLE_POWER: 'max_tackle_power',
	  MAX_BACK_TACKLE_POWER: 'max_back_tackle_power',
	  PLAYER_SPEED_MAX_MIN: 'player_speed_max_min',
	  EXTRA_STAMINA: 'extra_stamina',
	  SYNCH_SEE_OFFSET: 'synch_see_offset',
	  MAX_MONITORS: 'max_monitors',
	  EXTRA_HALF_TIME: 'extra_half_time',
	  STAMINA_CAPACITY: 'stamina_capacity',
	  MAX_DASH_ANGLE: 'max_dash_angle',
	  MIN_DASH_ANGLE: 'min_dash_angle',
	  DASH_ANGLE_STEP: 'dash_angle_step',
	  SIDE_DASH_RATE: 'side_dash_rate',
	  BACK_DASH_RATE: 'back_dash_rate',
	  MAX_DASH_POWER: 'max_dash_power',
	  MIN_DASH_POWER: 'min_dash_power',
	  TACKLE_RAND_FACTOR: 'tackle_rand_factor',
	  FOUL_DETECT_PROBABILITY: 'foul_detect_probability',
	  FOUL_EXPONENT: 'foul_exponent',
	  FOUL_CYCLES: 'foul_cycles',
	  GOLDEN_GOAL: 'golden_goal',
	  RED_CARD_PROBABILITY: 'red_card_probability'
	};

	/**
	 * An enum providing meaning the indices for the different elements in the player parameter array for 2D games.
	 * @enum {string}
	 */
	const Player2DParams = {
	  PLAYER_TYPES: 'player_types',
	  SUBS_MAX: 'subs_max',
	  PT_MAX: 'pt_max',
	  ALLOW_MULT_DEFAULT_TYPE: 'allow_mult_default_type',
	  PLAYER_SPEED_MAX_DELTA_MIN: 'player_speed_max_delta_min',
	  PLAYER_SPEED_MAX_DELTA_MAX: 'player_speed_max_delta_max',
	  STAMINA_INC_MAX_DELTA_FACTOR: 'stamina_inc_max_delta_factor',
	  PLAYER_DECAY_DELTA_MIN: 'player_decay_delta_min',
	  PLAYER_DECAY_DELTA_MAX: 'player_decay_delta_max',
	  INERTIA_MOMENT_DELTA_FACTOR: 'inertia_moment_delta_factor',
	  DASH_POWER_RATE_DELTA_MIN: 'dash_power_rate_delta_min',
	  DASH_POWER_RATE_DELTA_MAX: 'dash_power_rate_delta_max',
	  PLAYER_SIZE_DELTA_FACTOR: 'player_size_delta_factor',
	  KICKABLE_MARGIN_DELTA_MIN: 'kickable_margin_delta_min',
	  KICKABLE_MARGIN_DELTA_MAX: 'kickable_margin_delta_max',
	  KICK_RAND_DELTA_FACTOR: 'kick_rand_delta_factor',
	  EXTRA_STAMINA_DELTA_MIN: 'extra_stamina_delta_min',
	  EXTRA_STAMINA_DELTA_MAX: 'extra_stamina_delta_max',
	  EFFORT_MAX_DELTA_FACTOR: 'effort_max_delta_factor',
	  EFFORT_MIN_DELTA_FACTOR: 'effort_min_delta_factor',
	  NEW_DASH_POWER_RATE_DELTA_MIN: 'new_dash_power_rate_delta_min',
	  NEW_DASH_POWER_RATE_DELTA_MAX: 'new_dash_power_rate_delta_max',
	  NEW_STAMINA_INC_MAX_DELTA_FACTOR: 'new_stamina_inc_max_delta_factor',
	  RANDOM_SEED: 'random_seed',
	  KICK_POWER_RATE_DELTA_MIN: 'kick_power_rate_delta_min',
	  KICK_POWER_RATE_DELTA_MAX: 'kick_power_rate_delta_max',
	  FOUL_DETECT_PROBABILITY_DELTA_FACTOR: 'foul_detect_probability_delta_factor',
	  CATCHABLE_AREA_L_STRETCH_MIN: 'catchable_area_l_stretch_min',
	  CATCHABLE_AREA_L_STRETCH_MAX: 'catchable_area_l_stretch_max'
	};

	/**
	 * An enum providing meaning the indices for the different elements in the player type arrays for 2D games.
	 * @enum {string}
	 */
	const PlayerType2DParams = {
	  ID: 'id',
	  PLAYER_SPEED_MAX: 'player_speed_max',
	  STAMINA_INC_MAX: 'stamina_inc_max',
	  PLAYER_DECAY: 'player_decay',
	  INERTIA_MOMENT: 'inertia_moment',
	  DASH_POWER_RATE: 'dash_power_rate',
	  PLAYER_SIZE: 'player_size',
	  KICKABLE_MARGIN: 'kickable_margin',
	  KICK_RAND: 'kick_rand',
	  EXTRA_STAMINA: 'extra_stamina',
	  EFFORT_MAX: 'effort_max',
	  EFFORT_MIN: 'effort_min',
	  KICK_POWER_RATE: 'kick_power_rate',
	  FOUL_DETECT_PROBABILITY: 'foul_detect_probability',
	  CATCHABLE_AREA_L_STRETCH: 'catchable_area_l_stretch'
	};

	/**
	 * @enum {string}
	 */
	const GameLogChangeEvents = {
	  TEAMS: 'teams',
	  STATES: 'states'
	};

	/**
	 * The GameLog class definition.
	 *
	 * The GameLog is the central class holding a game log.
	 *
	 * @author Stefan Glaser
	 */
	class GameLog
	{
	  /**
	   * GameLog Constructor
	   * Create a new game log.
	   * 
	   * @param {!GameType} type the game type
	   */
	  constructor (type)
	  {
	    /**
	     * The log file url.
	     * @type {?string}
	     */
	    this.url = null;

	    /**
	     * The game type (2D or 3D).
	     * @type {!GameType}
	     */
	    this.type = type;

	    /**
	     * The state update frequency of the game log.
	     * @type {number}
	     */
	    this.frequency = 1;

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
	     * The list of player type parameters.
	     * @type {!Array<!ParameterMap>}
	     */
	    this.playerTypes = [];

	    /**
	     * The description of the left team.
	     * @type {!TeamDescription}
	     */
	    this.leftTeam = new TeamDescription('Left Team', new THREE.Color(0xffff00), TeamSide.LEFT);

	    /**
	     * The description of the right team.
	     * @type {!TeamDescription}
	     */
	    this.rightTeam = new TeamDescription('Right Team', new THREE.Color(0xff0000), TeamSide.RIGHT);

	    /**
	     * The list of all world states.
	     * @type {!Array<!WorldState>}
	     */
	    this.states = [];

	    /**
	     * The time value of the first state.
	     * @type {number}
	     */
	    this.startTime = 0;

	    /**
	     * The time value of the last state.
	     * @type {number}
	     */
	    this.endTime = 0;

	    /**
	     * The duration of the game log.
	     * @type {number}
	     */
	    this.duration = 0;

	    /**
	     * A list of game states over time.
	     * @type {!Array<!GameState>}
	     */
	    this.gameStateList = [];

	    /**
	     * A list of game scores over time.
	     * @type {!Array<!GameScore>}
	     */
	    this.gameScoreList = [];

	    /**
	     * Indicator if the game log is fully loaded.
	     * @type {boolean}
	     */
	    this.fullyLoaded = false;

	    /**
	     * The callback function to call when this game log instance is refreshed
	     * @type {!Function | undefined}
	     */
	    this.onChange = undefined;

	    // Create defaults
	    if (type === GameType.TWOD) {
	      this.environmentParams = SServerUtil.createDefaultEnvironmentParams();
	      this.playerParams = SServerUtil.createDefaultPlayerParams();
	      this.playerTypes = SServerUtil.createDefaultPlayerTypeParams();
	    } else {
	      this.environmentParams = SparkUtil.createDefaultEnvironmentParams();
	      this.playerParams = SparkUtil.createDefaultPlayerParams();
	      this.playerTypes = SparkUtil.createDefaultPlayerTypeParams();
	    }

	    this.updateFrequency();
	  }

	  /**
	   * Update the frequency value from environment parameter list.
	   *
	   * @return {void}
	   */
	  updateFrequency ()
	  {
	    let step = null;

	    if (this.type === GameType.TWOD) {
	      step = this.environmentParams.getNumber(Environment2DParams.SIMULATOR_STEP);
	    } else {
	      step = this.environmentParams.getNumber(Environment3DParams.LOG_STEP);
	    }

	    if (step) {
	      this.frequency = 1000 / step;
	    }
	  }

	  /**
	   * Fetch the index of the world state that corresponds to the given time.
	   *
	   * @param  {number} time the global time
	   * @return {number} the world state index corresponding to the specified time
	   */
	  getIndexForTime (time)
	  {
	    const idx = Math.floor(time * this.frequency);

	    if (idx < 0) {
	      return 0;
	    } else if (idx >= this.states.length) {
	      return this.states.length - 1;
	    }

	    return idx;
	  }

	  /**
	   * Retrieve the world state for the given time.
	   *
	   * @param  {number} time the global time
	   * @return {!WorldState | undefined} the world state closest to the specified time
	   */
	  getStateForTime (time)
	  {
	    return this.states[this.getIndexForTime(time)];
	  }

	  /**
	   * Called to indicate that the team descriptions of the game log were updated.
	   *
	   * @return {void}
	   */
	  onTeamsUpdated ()
	  {
	    if (this.onChange !== undefined) {
	      this.onChange(GameLogChangeEvents.TEAMS);
	    }
	  }

	  /**
	   * Called to indicate that the game log data was changed/extended.
	   *
	   * @return {void}
	   */
	  onStatesUpdated ()
	  {
	    // Update times
	    if (this.states.length > 0) {
	      this.startTime = this.states[0].time;
	      this.endTime = this.states[this.states.length - 1].time;
	      this.duration = this.endTime - this.startTime;

	      // Extract game states and scores from state array
	      this.gameStateList = [];
	      this.gameScoreList = [];

	      let previousGameState = this.states[0].gameState;
	      let previousScore = this.states[0].score;
	      this.gameStateList.push(previousGameState);
	      this.gameScoreList.push(previousScore);

	      for (let i = 1; i < this.states.length; i++) {
	        if (previousGameState !== this.states[i].gameState) {
	          previousGameState = this.states[i].gameState;
	          this.gameStateList.push(previousGameState);
	        }

	        if (previousScore !== this.states[i].score) {
	          previousScore = this.states[i].score;
	          this.gameScoreList.push(previousScore);
	        }
	      }
	    }

	    if (this.onChange !== undefined) {
	      this.onChange(GameLogChangeEvents.STATES);
	    }
	  }

	  /**
	   * Called to indicate that the game log file is fully loaded and parsed and no further states, etc. will be appended.
	   *
	   * @return {void}
	   */
	  finalize ()
	  {
	    this.fullyLoaded = true;

	    // Refresh the game log information a last time and publish change to finished
	    this.onStatesUpdated();

	    // Clear onChange listener
	    this.onChange = undefined;
	  }
	}

	/**
	 * The DataIterator class definition.
	 *
	 * @author Stefan Glaser
	 */
	class DataIterator
	{
	  /**
	   * DataIterator Constructor
	   * Create a new data interator.
	   *
	   * @param {string} data the data string
	   * @param {!DataExtent} extent the data extent
	   */
	  constructor (data, extent)
	  {
	    /**
	     * The data to iterate.
	     * @type {string}
	     */
	    this.data = data;

	    /**
	     * The regular expression used to split the data into line tokens.
	     * @type {!RegExp}
	     */
	    this.regExp = new RegExp('[^\r\n]+', 'g');

	    /**
	     * The current data line.
	     * @type {?string}
	     */
	    this.line = null;

	    /**
	     * The data extent (complete, partial, incremental).
	     * @type {!DataExtent}
	     */
	    this.extent = extent;


	    // Update initial data
	    this.update(data, extent);

	    // console.log('New data iterator instance created!');
	  }

	  /**
	   * @return {void}
	   */
	  dispose ()
	  {
	    // console.log('Dispose data iterator instance!');

	    // Clear RegExp instance and buffers
	    // I feel kind of strange to add this code, but apparently it readuces memory usage
	    this.regExp.lastIndex = 0;
	    let i = 10;
	    while (--i) {
	      this.regExp.exec('TRY\nTO\nEMPTY\nCACHE\n!!!');
	    }

	    this.data = '';
	    this.regExp.lastIndex = 0;
	    this.line = null;
	    this.extent = DataExtent.COMPLETE;
	  }

	  /**
	   * Update the iterator data.
	   *
	   * @param {string} data updated data
	   * @param {!DataExtent} extent the data extent
	   * @return {boolean} true, if iterator reached end of data before update, false otherwise
	   */
	  update (data, extent)
	  {
	    switch (this.extent) {
	      case DataExtent.INCREMENTAL:
	        this.data = this.data.slice(this.regExp.lastIndex) + data;
	        this.regExp.lastIndex = 0;
	        break;
	      case DataExtent.PARTIAL:
	      case DataExtent.COMPLETE:
	      default:
	        this.data = data;
	        break;
	    }

	    this.extent = extent;

	    return this.line === null;
	  }

	  /**
	   * Check if the exists a next line.
	   *
	   * @return {boolean}
	   */
	  hasNext ()
	  {
	    const idx = this.regExp.lastIndex;
	    let result = this.regExp.test(this.data);

	    if (this.extent !== DataExtent.COMPLETE && this.regExp.lastIndex === this.data.length) {
	      result = false;
	    }

	    // Reset running index in regular expression
	    this.regExp.lastIndex = idx;

	    return result;
	  }

	  /**
	   * Progress the iterator to the next position (if possible)
	   * and return the line array at the new position.
	   *
	   * @return {?string} the current line array
	   */
	  next ()
	  {
	    const idx = this.regExp.lastIndex;
	    let tokens = this.regExp.exec(this.data);

	    if (this.extent !== DataExtent.COMPLETE && this.regExp.lastIndex === this.data.length) {
	      // Reached end of partial data, but no terminating line ending found, thus reset tokens
	      tokens = null;
	    }

	    // Reached end of data, thus reset regex index
	    if (tokens === null || tokens.length === 0) {
	      this.regExp.lastIndex = idx;
	      this.line = null;
	    } else {
	      this.line = tokens[0];
	    }

	    return this.line;
	  }
	}

	/**
	 * An enum for possible data extents.
	 * @enum {number}
	 */
	const DataExtent = {
	  COMPLETE: 0,
	  PARTIAL: 1,
	  INCREMENTAL: 2
	};

	/**
	 * The GameLogParser interface definition.
	 *
	 * @author Stefan Glaser
	 */
	class GameLogParser
	{
	  /**
	   * Parse the given data into a game log data structure.
	   *
	   * @param {string} data the game log file data
	   * @param {!DataExtent=} extent the data extent: complete, partial or incremental data (default: complete)
	   * @return {boolean} true, if a new game log file instance was created, false otherwise
	   */
	  parse (data, extent = DataExtent.COMPLETE) {}

	  /**
	   * Retrieve the currently parsed game log.
	   *
	   * @return {?GameLog} the (maybe partially) parsed game log
	   */
	  getGameLog () {}

	  /**
	   * Dispose all resources referenced in this parser instance.
	   *
	   * @param {boolean=} keepIteratorAlive indicator if iterator should not be disposed
	   * @return {void}
	   */
	  dispose (keepIteratorAlive) {}
	}

	/**
	 *
	 * @author Stefan Glaser
	 */
	class MonitorUtil
	{
	  /**
	   * The copyString funcion presents a workaround for deep copying partial strings.
	   *
	   * Modern browsers only provide partial strings when using string.substring() / .slice() / etc.
	   * while keeping a reference to the original string. While this usually improves the overall
	   * performance and memory consumption, it also prevents the garbage collector from collecting
	   * the original string. This function provides a workaround for really copying a string value
	   * (obtained via .substring() / .slice() / etc.).
	   * Use this function when storing partial strings in your result objects.
	   *
	   * @param  {string} partialString
	   * @return {string} a "deep" copy of the above partial string
	   */
	  static copyString (partialString)
	  {
	    if (partialString) {
	      return /** @type {string} */ (JSON.parse(JSON.stringify(partialString)));
	    }

	    return partialString;
	  }
	}

	/**
	 * The PartialWorldState class definition.
	 *
	 * The PartialWorldState provides information about the state of the game, the ball and all agents on the field.
	 *
	 * @author Stefan Glaser / http://chaosscripting.net
	 */
	class PartialWorldState
	{
	  /**
	   * PartialWorldState Constructor
	   * Create a new PartialWorldState holding the given information.
	   *
	   * @param {number} time the global time
	   * @param {number} timeStep the global time step
	   * @param {number} gameTime the game time
	   */
	  constructor (time, timeStep, gameTime)
	  {
	    /**
	     * The global time.
	     * @type {number}
	     */
	    this.time = time;

	    /**
	     * The global time step.
	     * @type {number}
	     */
	    this.timeStep = timeStep;

	    /**
	     * The game time.
	     * @type {number}
	     */
	    this.gameTime = gameTime;

	    /**
	     * The state of the game.
	     * @type {!GameState}
	     */
	    this.gameState = new GameState(time, 'unknown');

	    /**
	     * The left team score.
	     * @type {!GameScore}
	     */
	    this.score = new GameScore(time, 0, 0);

	    /**
	     * The state of the ball.
	     * @type {!ObjectState}
	     */
	    this.ballState = new ObjectState();

	    /**
	     * The states of all left agents.
	     * @type {!Array<!AgentState | undefined>}
	     */
	    this.leftAgentStates = [];

	    /**
	     * The states of all right agents.
	     * @type {!Array<!AgentState | undefined>}
	     */
	    this.rightAgentStates = [];
	  }

	  /**
	   * Reinitialize the gameTime attribute.
	   *
	   * @param {number} gameTime the game time
	   */
	  setGameTime (gameTime)
	  {
	    this.gameTime = Math.round(gameTime * 1000) / 1000;
	  }

	  /**
	   * Reinitialize the gameState and gameTime attributes.
	   *
	   * @param {string} playMode the play mode string (will create a copy if needed)
	   */
	  setPlaymode (playMode)
	  {
	    if (this.gameState.playMode !== playMode) {
	      this.gameState = new GameState(this.time, MonitorUtil.copyString(playMode));
	    }
	  }

	  /**
	   * Reinitialize the gameScore and gameTime attributes.
	   *
	   * @param {number} goalsLeft the left team score
	   * @param {number} goalsRight the right team score
	   * @param {number=} penScoreLeft the left team penalty score
	   * @param {number=} penMissLeft the left team penalty misses
	   * @param {number=} penScoreRight the right team penalty score
	   * @param {number=} penMissRight the right team penalty misses
	   */
	  setScore (goalsLeft, goalsRight, penScoreLeft, penMissLeft, penScoreRight, penMissRight)
	  {
	    if (penScoreLeft === undefined) {
	      penScoreLeft = 0;
	    }
	    if (penMissLeft === undefined) {
	      penMissLeft = 0;
	    }
	    if (penScoreRight === undefined) {
	      penScoreRight = 0;
	    }
	    if (penMissRight === undefined) {
	      penMissRight = 0;
	    }

	    if (this.score.goalsLeft !== goalsLeft ||
	        this.score.goalsRight !== goalsRight ||
	        this.score.penaltyScoreLeft !== penScoreLeft ||
	        this.score.penaltyMissLeft !== penMissLeft ||
	        this.score.penaltyScoreRight !== penScoreRight ||
	        this.score.penaltyMissRight !== penMissRight) {
	      this.score = new GameScore(this.time, goalsLeft, goalsRight, penScoreLeft, penMissLeft, penScoreRight, penMissRight);
	    }
	  }

	  /**
	   * Create a new world state instance from this partial world state and append it to the list.
	   * A new world state is only created if more then one agent state is present.
	   *
	   * @param  {!Array<!WorldState>} states the world state list
	   * @return {boolean} true, if a new world state was appended, false otherwise
	   */
	  appendTo (states)
	  {
	    if (this.leftAgentStates.length + this.rightAgentStates.length > 0) {
	      states.push(new WorldState(
	          this.time,
	          this.gameTime,
	          this.gameState,
	          this.score,
	          this.ballState.state,
	          WorldState.unwrapAgentStatesArray(this.leftAgentStates),
	          WorldState.unwrapAgentStatesArray(this.rightAgentStates))
	        );

	      // Progress time
	      this.time = Math.round((this.time + this.timeStep) * 1000) / 1000;

	      // Reset agent states
	      this.leftAgentStates = [];
	      this.rightAgentStates = [];

	      return true;
	    }

	    return false;
	  }
	}

	/**
	 * The LogParserStorage class definition.
	 *
	 * @author Stefan Glaser
	 */
	class LogParserStorage
	{
	  /**
	   * LogParserStorage Constructor
	   */
	  constructor ()
	  {
	    /**
	     * The partial state used during parsing.
	     * @type {?PartialWorldState}
	     */
	    this.partialState = null;

	    /**
	     * The maximum states to parse per run.
	     * @type {number}
	     */
	    this.maxStates = 500;

	    /**
	     * The index list for the recent player types of the individual agents of the left team.
	     * @type {!Array<number>}
	     */
	    this.leftIndexList = [];

	    /**
	     * The index list for the recent player types of the individual agents of the right team.
	     * @type {!Array<number>}
	     */
	    this.rightIndexList = [];
	  }

	  /**
	   * Check if a partial state instance exists.
	   *
	   * @return {boolean} true, if the partial state exists, false otherwise
	   */
	  hasPartialState ()
	  {
	    return this.partialState !== null;
	  }
	}

	/**
	 * The ParserException class definition.
	 *
	 * @author Stefan Glaser
	 */
	class ParserException
	{
	  /**
	   * ParserException Constructor
	   *
	   * @param {string=} msg the exception message
	   */
	  constructor (msg)
	  {
	    /**
	     * The name of the exception.
	     * @type {string}
	     */
	    this.name = 'ParserException';

	    /**
	     * The exception message.
	     * @type {string}
	     */
	    this.message = msg !== undefined ? msg : this.name;
	  }

	  /**
	   * @override
	   * @return {string}
	   */
	  toString ()
	  {
	    return this.message;
	  }
	}

	/**
	 * The Replay class definition.
	 *
	 * The Replay is the central class holding a replay file
	 *
	 * @author Stefan Glaser
	 */
	class Replay extends GameLog
	{
	  /**
	   * Replay Constructor
	   * Create a new replay.
	   * 
	   * @param {!GameType} type the game-log type
	   * @param {number} version the replay version
	   */
	  constructor (type, version)
	  {
	    super(type);

	    /**
	     * The replay version.
	     * @type {number}
	     */
	    this.version = version;
	  }
	}

	/**
	 * Simple THREE.js helpers.
	 * 
	 * @author Stefan Glaser
	 */
	class ThreeJsUtil
	{
	  /** @return {!THREE.Vector3} 3D Zero vector. */
	  static Vector3_Zero()
	  {
	    return Vector3_zero;
	  }

	  /** @return {!THREE.Vector3} 3D Unit X vector. */
	  static Vector3_UnitX()
	  {
	    return Vector3_unitX;
	  }

	  /** @return {!THREE.Vector3} 3D Unit Y vector. */
	  static Vector3_UnitY()
	  {
	    return Vector3_unitY;
	  }

	  /** @return {!THREE.Vector3} 3D Unit Z vector. */
	  static Vector3_UnitZ()
	  {
	    return Vector3_unitZ;
	  }


	  /** @return {!THREE.Color} White color. */
	  static Color_White()
	  {
	    return Color_white;
	  }

	  /** @return {!THREE.Color} Black color. */
	  static Color_Black()
	  {
	    return Color_black;
	  }

	  /** @return {!THREE.Color} #eee color. */
	  static Color_LightGrey()
	  {
	    return Color_eee;
	  }

	  /** @return {!THREE.Color} #333 color. */
	  static Color_DarkGrey()
	  {
	    return Color_333;
	  }


	  /**
	   * Make Matrtix 4x4.
	   *
	   * @param  {number} n11
	   * @param  {number} n12
	   * @param  {number} n13
	   * @param  {number} n14
	   * @param  {number} n21
	   * @param  {number} n22
	   * @param  {number} n23
	   * @param  {number} n24
	   * @param  {number} n31
	   * @param  {number} n32
	   * @param  {number} n33
	   * @param  {number} n34
	   * @return {!THREE.Matrix4} a 4x4 matrix
	   */
	  static mM4 (n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34) {
	    return new THREE.Matrix4().set(n11, n12, n13, n14,
	                                   n21, n22, n23, n24,
	                                   n31, n32, n33, n34,
	                                   0, 0, 0, 1);
	  }
	}

	/**
	 * A THREE.Vector3 instance representing the zero vector (0, 0, 0).
	 * @const {!THREE.Vector3}
	 */
	const Vector3_zero = new THREE.Vector3(0, 0, 0);

	/**
	 * A THREE.Vector3 instance representing the X unit vector (1, 0, 0).
	 * @const {!THREE.Vector3}
	 */
	const Vector3_unitX = new THREE.Vector3(1, 0, 0);

	/**
	 * A THREE.Vector3 instance representing the Y unit vector (0, 1, 0).
	 * @const {!THREE.Vector3}
	 */
	const Vector3_unitY = new THREE.Vector3(0, 1, 0);

	/**
	 * A THREE.Vector3 instance representing the Z unit vector (0, 0, 1).
	 * @const {!THREE.Vector3}
	 */
	const Vector3_unitZ = new THREE.Vector3(0, 0, 1);



	/**
	 * A white threejs color.
	 * @type {!THREE.Color}
	 */
	const Color_white = new THREE.Color(0xffffff);

	/**
	 * A black threejs color.
	 * @type {!THREE.Color}
	 */
	const Color_black = new THREE.Color(0x000000);

	/**
	 * A threejs color with color value #eeeeee.
	 * @type {!THREE.Color}
	 */
	const Color_eee = new THREE.Color(0xeeeeee);

	/**
	 * A threejs color with color value #333333.
	 * @type {!THREE.Color}
	 */
	const Color_333 = new THREE.Color(0x333333);

	/**
	 * Simple math helpers.
	 * 
	 * @author Stefan Glaser
	 */
	class JsMath
	{
	  /**
	   * Transform degrees to radians.
	   * @param {number} deg
	   * @return {number}
	   */
	  static toRad (deg)
	  {
	    return deg * Math.PI / 180;
	  };

	  /**
	   * Transform radians to degrees.
	   * @param {number} rad
	   * @return {number}
	   */
	  static toDeg (rad)
	  {
	    return rad * 180 / Math.PI;
	  };
	}

	/**
	 * @type {number}
	 */
	const PIby180 = Math.PI / 180.0;

	/**
	 * @type {number}
	 */
	const NegPIby180 = -Math.PI / 180.0;

	/**
	 * The SymbolNode class definition.
	 *
	 * The SymbolNode represents a symbolic node in a symbol tree, holding values and child nodes.
	 *
	 * @author Stefan Glaser
	 */
	class SymbolNode
	{
	  /**
	   * SymbolNode Constructor - create a new SymbolNode.
	   */
	  constructor ()
	  {
	    /**
	     * The symbol node values.
	     * @type {!Array<string>}
	     */
	    this.values = [];

	    /**
	     * The symbol node children.
	     * @type {!Array<!SymbolNode>}
	     */
	    this.children = [];
	  }
	}

	/**
	 * The SymbolTreeParser class definition.
	 *
	 * The SymbolTreeParser allows parsing a symbol tree string into a tree representation.
	 *
	 * @author Stefan Glaser
	 */
	class SymbolTreeParser
	{
	  /**
	   * Parse the given string into a symbol tree representation.
	   *
	   * @param {string} input the string to parse
	   * @return {!SymbolNode} [description]
	   */
	  static parse (input)
	  {
	    const rootNode = new SymbolNode();

	    if (input.charAt(0) !== '(' || input.charAt(input.length - 1) !== ')') {
	      throw new Error('Input not embedded in braces: ' + input);
	    }


	    const pos = SymbolTreeParser.parseNode(input, 1, rootNode);
	    if (pos !== input.length) {
	      throw new Error('Multiple root nodes in input: ' + input);
	    }

	    return rootNode.children[0];
	  }

	  /**
	   * Parse the given string into a symbol tree representation.
	   *
	   * @param {string} input the string to parse
	   * @param {number} startIdx the index to start
	   * @param {!SymbolNode} parentNode the parent node
	   * @return {number} the index after parsing the node
	   */
	  static parseNode (input, startIdx, parentNode)
	  {
	    // Create a new node
	    const newNode = new SymbolNode();
	    parentNode.children.push(newNode);

	    let idx = startIdx;

	    while (idx < input.length) {
	      if (input.charAt(idx) === '(') {
	        // Found a new subnode
	        if (idx > startIdx) {
	          // Add value to node
	          newNode.values.push(input.slice(startIdx, idx));
	        }
	        startIdx = idx = SymbolTreeParser.parseNode(input, idx + 1, newNode);
	      } else if (input.charAt(idx) === ')') {
	        // Found node terminator for this node
	        if (idx > startIdx) {
	          // Add value to node
	          newNode.values.push(input.slice(startIdx, idx));
	        }
	        return idx + 1;
	      } else if (input.charAt(idx) === ' ') {
	        // Found new value terminator
	        if (idx > startIdx) {
	          // Add value to node
	          newNode.values.push(input.slice(startIdx, idx));
	        }
	        idx++;
	        startIdx = idx;
	      } else {
	        idx++;
	      }
	    }

	    throw new Error('Invalid tree structure in input: ' + input);
	  }
	}

	/**
	 * The ReplayParser class definition.
	 *
	 * The ReplayParser provides
	 *
	 * @author Stefan Glaser
	 */
	class ReplayParser extends GameLogParser
	{
	  /**
	   * ReplayParser Constructor
	   * Create a new replay parser instance.
	   */
	  constructor ()
	  {
	    super();

	    /**
	     * The replay data iterator.
	     * @type {?DataIterator}
	     */
	    this.iterator = null;

	    /**
	     * The replay.
	     * @type {?Replay}
	     */
	    this.replay = null;

	    /**
	     * The storage instance used during parsing.
	     * @type {?LogParserStorage}
	     */
	    this.storage = null;

	    // console.log('New Replay parser instance created!');
	  }

	  /**
	   * Try or continue parsing a game log.
	   *
	   * @override
	   * @param  {string} data the current data
	   * @param  {!DataExtent=} extent the data extent (complete, partial, incremental)
	   * @return {boolean}
	   */
	  parse (data, extent = DataExtent.COMPLETE)
	  {
	    extent = extent !== undefined ? extent : DataExtent.COMPLETE;

	    if (this.iterator === null || this.replay === null || this.storage === null) {
	      // Start parsing
	      this.iterator = new DataIterator(data, extent);

	      // ==================== Parse Replay Header ====================
	      let line = this.iterator.next();
	      if (line === null) {
	        throw new ParserException('Replay corrupt!');
	      }
	      let splitLine = line.split(' ');

	      if (line.charAt(0) === 'R' &&
	          line.charAt(1) === 'P' &&
	          line.charAt(2) === 'L') {
	        // Found replay header
	        if (splitLine.length < 3) {
	          throw new ParserException('Malformated Replay Header!');
	        }

	        const type = splitLine[1] === '2D' ? GameType.TWOD : GameType.THREED;
	        this.replay = new Replay(type, parseInt(splitLine[2], 10));

	        this.iterator.next();
	      } else {
	        // No replay header found, try fallback...
	        if (line.charAt(0) === 'T') {
	          // Initial 2D replay format, use fallback parser
	          console.log('ReplayParser: Detected old 2D replay file format!');

	          // Parse teams line
	          if (splitLine.length < 3) {
	            throw new ParserException('Invalid team line!');
	          }

	          this.replay = new Replay(GameType.TWOD, 0);
	          this.replay.leftTeam.setName(MonitorUtil.copyString(splitLine[1].slice(1, -1)));
	          this.replay.rightTeam.setName(MonitorUtil.copyString(splitLine[2].slice(1, -1)));

	          // Progress to next line
	          this.iterator.next();

	          // Create default agents with numbers 1 to 11 for both sides
	          for (let i = 1; i < 12; i++) {
	            this.replay.leftTeam.addAgent(i, this.replay.playerTypes[0]);
	            this.replay.rightTeam.addAgent(i, this.replay.playerTypes[0]);
	          }
	        } else if (line.charAt(0) === 'V') {
	          // Initial 3D replay format, use fallback parser
	          console.log('ReplayParser: Detected old 3D replay file format!');

	          if (splitLine.length < 4) {
	            throw new ParserException('Malformated Replay Header!');
	          }

	          this.replay = new Replay(GameType.THREED, 0);
	          this.replay.frequency = parseInt(splitLine[3], 10);

	          // Parse teams line
	          line = this.iterator.next();
	          if (line === null) {
	            throw new ParserException('Replay corrupt!');
	          }
	          splitLine = line.split(' ');
	          if (splitLine.length < 5 || splitLine[0] != 'T') {
	            throw new ParserException('Invalid teams line!');
	          }

	          this.replay.leftTeam.setName(MonitorUtil.copyString(splitLine[1].slice(1, -1)));
	          this.replay.rightTeam.setName(MonitorUtil.copyString(splitLine[3].slice(1, -1)));
	          try {
	            this.replay.leftTeam.color = new THREE.Color(splitLine[2]);
	            this.replay.rightTeam.color = new THREE.Color(splitLine[4]);
	          } catch (ex) {
	            console.log(ex);
	          }

	          // Parse world line
	          line = this.iterator.next();
	          if (line === null) {
	            throw new ParserException('Replay corrupt!');
	          }
	          splitLine = line.split(' ');
	          if (splitLine.length < 2 || splitLine[0] != 'F') {
	            throw new ParserException('Invalid world line!');
	          }

	          // Extract field parameters based on server version
	          switch (parseInt(splitLine[1], 10)) {
	            case 62:
	              this.replay.environmentParams = SparkUtil.createEnvironmentParamsV62();
	              break;
	            case 63:
	              this.replay.environmentParams = SparkUtil.createEnvironmentParamsV63();
	              break;
	            case 64:
	              this.replay.environmentParams = SparkUtil.createEnvironmentParamsV64();
	              break;
	            case 66:
	              this.replay.environmentParams = SparkUtil.createEnvironmentParamsV66();
	              break;
	          }

	          // Progress to next line
	          this.iterator.next();
	        } else {
	          throw new ParserException('Failed parsing replay file - no Replay header found (and none of the fallback options applies)!');
	        }
	      }

	      this.storage = new LogParserStorage();
	      this.storage.maxStates = this.replay.type === GameType.TWOD ? 300 : 50;

	      parseReplayBody(this.iterator, this.replay, this.storage);

	      if (extent === DataExtent.COMPLETE && this.replay.states.length === 0) {
	        throw new ParserException('Empty replay file!');
	      }

	      return this.replay.states.length > 0;
	    } else {
	      // Progress parsing
	      const wasEmpty = this.replay.states.length === 0;

	      if (this.iterator.update(data, extent)) {
	        // console.log('Restarting replay parser...');
	        parseReplayBody(this.iterator, this.replay, this.storage);
	      }

	      if (extent === DataExtent.COMPLETE && this.replay.states.length === 0) {
	        throw new ParserException('Empty replay file!');
	      }

	      return wasEmpty && this.replay.states.length > 0;
	    }
	  }

	  /**
	   * Retrieve the currently parsed game log.
	   *
	   * @override
	   * @return {?GameLog} the (maybe partially) parsed game log
	   */
	  getGameLog ()
	  {
	    return this.replay;
	  }

	  /**
	   * Dispose all resources referenced in this parser instance.
	   *
	   * @override
	   * @param {boolean=} keepIteratorAlive indicator if iterator should not be disposed
	   * @return {void}
	   */
	  dispose (keepIteratorAlive)
	  {
	    // console.log('Dispose Replay parser instance (keep iterator: ' + keepIteratorAlive + ')');

	    if (this.iterator !== null && !keepIteratorAlive) {
	      this.iterator.dispose();
	    }

	    this.iterator = null;
	    this.replay = null;
	    this.storage = null;
	  }
	}






	// ============================================================================
	// ======================== PRIVATE PARSING FUNCTIONS =========================
	// ============================================================================

	/**
	 * [parseReplayBody description]
	 *
	 * @param  {!DataIterator} iterator the replay data iterator
	 * @param  {!Replay} replay the replay to store the parsed states
	 * @param  {!LogParserStorage} storage the parser storage instance
	 * @return {void}
	 */
	function parseReplayBody (iterator, replay, storage)
	{
	  let dataLine = iterator.line;
	  if (dataLine === null) {
	    // Try to restart the iterator
	    dataLine = iterator.next();
	  }

	  let newStatesCnt = 0;

	  // Parsing functions
	  let parseBallFcn = parseBallState_2D;
	  let parseAgentFcn = parseAgentState_V0_2D;
	  if (replay.type === GameType.THREED) {
	    if (replay.version === 0) {
	      parseBallFcn = parseBallState_V0_3D;
	      parseAgentFcn = parseAgentState_V0_3D;
	    } else {
	      parseBallFcn = parseBallState_V1_3D;
	      parseAgentFcn = parseAgentState_V1;
	    }
	  } else if (replay.version > 0) {
	    parseAgentFcn = parseAgentState_V1;
	  }

	  while (dataLine !== null && newStatesCnt < storage.maxStates) {
	    try {
	      switch (dataLine.charAt(0)) {
	        case 'E': // Environment parameter line
	          if (dataLine.charAt(1) === 'P') {
	            parseEnvironmentParams(dataLine, replay, storage);
	          }
	          break;
	        case 'P':
	          if (dataLine.charAt(1) === 'P') {
	            // Player parameter line
	            parsePlayerParams(dataLine, replay);
	          } else if (dataLine.charAt(1) === 'T') {
	            // Player type line
	            parsePlayerTypeParams(dataLine, replay);
	          }
	          break;
	        case 'T': // Team info line
	          parseTeamLine(dataLine, replay);
	          break;
	        case 'S': // State dataL line
	          if (parseStateLine(dataLine, replay, storage)) {
	            newStatesCnt++;
	          }
	          break;

	        case 'b': // Ball data line
	          parseBallFcn(dataLine, storage.partialState);
	          break;

	        case 'l': // Left agent data line
	        case 'L':
	          if (storage.hasPartialState()) {
	            parseAgentFcn(dataLine, replay, storage, true);
	          }
	          break;

	        case 'r': // Right agent data line
	        case 'R':
	          if (storage.hasPartialState()) {
	            parseAgentFcn(dataLine, replay, storage, false);
	          }
	          break;
	      }
	    } catch (ex) {
	    }

	    dataLine = iterator.next();
	  }

	  // Refresh replay
	  if (newStatesCnt > 0) {
	    replay.onStatesUpdated();
	  }

	  // Start parsing job, parsing $maxStates world states per run
	  if (dataLine !== null) {
	    setTimeout(parseReplayBody, 1, iterator, replay, storage);
	  } else if (iterator.extent === DataExtent.COMPLETE) {
	    iterator.dispose();

	    if (storage.hasPartialState()) {
	      // Push final state
	      storage.partialState.appendTo(replay.states);
	    }

	    replay.finalize();
	  }
	}











	// ----------------------------------------------------------------------------
	// --------------------------------- GENERAL ----------------------------------
	// ----------------------------------------------------------------------------

	/**
	 * Parse a environment parameter line.
	 *
	 * @param  {string} dataLine the environment params line
	 * @param  {!Replay} replay the replay instance
	 * @param  {!LogParserStorage} storage the parser storage instance
	 * @return {void}
	 */
	function parseEnvironmentParams (dataLine, replay, storage)
	{
	  // Environment-Parameter Line-Format:
	  // EP <single-line-json>
	  try {
	    const newParams = /** @type {!Object} */ (JSON.parse(dataLine.slice(3)));
	    replay.environmentParams.clear();
	    replay.environmentParams.paramObj = newParams;
	  } catch (ex) {
	    console.log('Exception while parsing environment parameters:');
	    console.log(ex);
	  }

	  // Update replay frequency and partial state time step
	  replay.updateFrequency();
	  if (storage.partialState !== null) {
	    storage.partialState.timeStep = 1 / replay.frequency;
	  }
	}

	/**
	 * Parse a player parameter line.
	 *
	 * @param  {string} dataLine the player params line
	 * @param  {!Replay} replay the replay instance
	 * @return {void}
	 */
	function parsePlayerParams (dataLine, replay)
	{
	  // Player-Parameter Line-Format:
	  // PP <single-line-json>
	  try {
	    const newParams = /** @type {!Object} */ (JSON.parse(dataLine.slice(3)));
	    replay.playerParams.clear();
	    replay.playerParams.paramObj = newParams;
	  } catch (ex) {
	    console.log('Exception while parsing player parameters:');
	    console.log(ex);
	  }
	}

	/**
	 * Parse a player type parameter line.
	 *
	 * @param  {string} dataLine the player params line
	 * @param  {!Replay} replay the replay instance
	 * @return {void}
	 */
	function parsePlayerTypeParams (dataLine, replay)
	{
	  // Player-Type-Parameter Line-Format:
	  // PT <id> <single-line-json>
	  const idx = dataLine.indexOf(' ', 4);

	  if (idx > 3 && idx < 10) {
	    const typeIdx = parseInt(dataLine.slice(3, idx), 10);

	    try {
	      replay.playerTypes[typeIdx] = new ParameterMap(/** @type {!Object} */ (JSON.parse(dataLine.slice(idx + 1))));
	    } catch (ex) {
	      console.log('Exception while parsing player type parameters:');
	      console.log(ex);
	    }
	  }
	}

	/**
	 * Parse a team info line.
	 *
	 * @param  {string} dataLine the team info line
	 * @param  {!Replay} replay the replay to store the parsed states
	 * @return {void}
	 */
	function parseTeamLine (dataLine, replay)
	{
	  // Teams-Line-Format:
	  // T <left-team> <right-team>[ <left-color <right-color>]
	  const line = dataLine.split(' ');
	  if (line.length < 3) {
	    // Not enough data!
	    return;
	  }

	  let updated = replay.leftTeam.setName(MonitorUtil.copyString(line[1]));
	  updated = replay.rightTeam.setName(MonitorUtil.copyString(line[2])) || updated;

	  if (line.length > 4) {
	    try {
	      updated = replay.leftTeam.setColor(new THREE.Color(line[3])) || updated;
	      updated = replay.rightTeam.setColor(new THREE.Color(line[4])) || updated;
	    } catch (ex) {
	      console.log(ex);
	    }
	  }

	  if (updated) {
	    // Publish update of team information
	    replay.onTeamsUpdated();
	  }
	}

	/**
	 * Parse a state info line.
	 *
	 * @param  {string} dataLine the team info line
	 * @param  {!Replay} replay the replay to store the parsed states
	 * @param  {!LogParserStorage} storage the parser storage instance
	 * @return {boolean} true, if a new world state was created, false otherwise
	 */
	function parseStateLine (dataLine, replay, storage)
	{
	  // State-Line-Format:
	  // S <game-time> <playmode> <score-left> <score-right>[ <penalty-score-left> <penalty-miss-left> <penalty-miss-right> <penalty-miss-right>]
	  const line = dataLine.split(' ');
	  if (line.length < 5) {
	    // Not enough data!
	    return false;
	  }

	  let newStateCreated = false;
	  if (storage.partialState !== null) {
	    newStateCreated = storage.partialState.appendTo(replay.states);
	  } else {
	    storage.partialState = new PartialWorldState(0, 1 / replay.frequency, 0);
	  }

	  let gameTime = parseFloat(line[1]);
	  if (replay.version === 0) {
	    gameTime /= 10;
	  }

	  storage.partialState.setGameTime(gameTime);
	  storage.partialState.setPlaymode(line[2]);

	  if (line.length > 8) {
	    storage.partialState.setScore(
	        parseInt(line[3], 10),
	        parseInt(line[4], 10),
	        parseInt(line[5], 10),
	        parseInt(line[6], 10),
	        parseInt(line[7], 10),
	        parseInt(line[8], 10)
	      );
	  } else {
	    storage.partialState.setScore(parseInt(line[3], 10), parseInt(line[4], 10));
	  }

	  return newStateCreated;
	}

	/**
	 * [parseBallState description]
	 *
	 * @param {string} dataLine
	 * @param {?PartialWorldState} partialState
	 * @return {void}
	 */
	function parseBallState_2D (dataLine, partialState)
	{
	  // Ball-Line-Format:
	  // b <x> <y>
	  const line = dataLine.split(' ');
	  if (partialState === null || line.length < 3) {
	    // Not enough data!
	    return;
	  }

	  partialState.ballState = new ObjectState({
	      x: parseFloat(line[1]),
	      y: 0.2,
	      z: parseFloat(line[2]),
	      qx: 0,
	      qy: 0,
	      qz: 0,
	      qw: 1
	    });
	}











	// ----------------------------------------------------------------------------
	// --------------------------------- VERSION 0 --------------------------------
	// ----------------------------------------------------------------------------



	/**
	 * [parseBallState description]
	 *
	 * @param  {string} dataLine
	 * @param  {?PartialWorldState} partialState
	 * @return {void}
	 */
	function parseBallState_V0_3D (dataLine, partialState)
	{
	  // Ball-Line-Format:
	  // b <x> <y> <z> <qx> <qy> <qz> <qw>
	  const line = dataLine.split(' ');
	  if (partialState === null || line.length < 8) {
	    // Not enough data!
	    return;
	  }

	  partialState.ballState = new ObjectState({
	      x: parseInt(line[1], 10) / 1000,
	      y: parseInt(line[3], 10) / 1000,
	      z: -parseInt(line[2], 10) / 1000,
	      qx: parseInt(line[5], 10) / 1000,
	      qy: parseInt(line[7], 10) / 1000,
	      qz: -parseInt(line[6], 10) / 1000,
	      qw: parseInt(line[4], 10) / 1000
	    });
	}

	/**
	 * [parseAgentState description]
	 *
	 * @param  {string} dataLine the agent line
	 * @param  {!Replay} replay the replay to store the parsed states
	 * @param  {!LogParserStorage} storage the parser storage instance
	 * @param  {boolean} leftSide side indicator
	 * @return {void}
	 */
	function parseAgentState_V0_2D (dataLine, replay, storage, leftSide)
	{
	  // Agent-Line-Format:
	  // {l|L|r|R} <unum> <x> <y> <heading-angle>[ <neck-angle> <stamina>]
	  const line = dataLine.split(' ');
	  if (line.length < 5) {
	    // Not enough data!
	    return;
	  }

	  const playerNo = parseInt(line[1], 10);
	  let flags = Agent2DFlags.STAND;

	  // Check for goalie
	  if (line[0] === 'L' || line[0] === 'R') {
	    flags |= Agent2DFlags.GOALIE;
	  }

	  // Parse player state data
	  const position = new THREE.Vector3(parseFloat(line[2]), 0, parseFloat(line[3]));
	  let angle = parseFloat(line[4]);
	  const quat = new THREE.Quaternion();
	  quat.setFromAxisAngle(ThreeJsUtil.Vector3_UnitY(), JsMath.toRad(-angle));
	  const jointData = [];
	  const agentData = [];

	  if (line.length > 6) {
	    angle = parseFloat(line[5]) - angle;
	    if (angle > 180) {
	      angle -= 360;
	    } else if (angle < -180) {
	      angle += 360;
	    }

	    jointData[0] = JsMath.toRad(-angle);
	    agentData[Agent2DData.STAMINA] = parseFloat(line[6].slice(1));
	  }

	  const newState = new AgentState({
	      modelIdx: 0,
	      flags: flags,
	      x: position.x,
	      y: position.y,
	      z: position.z,
	      qx: quat.x,
	      qy: quat.y,
	      qz: quat.z,
	      qw: quat.w,
	      jointAngles: jointData,
	      data: agentData
	    });

	  if (leftSide) {
	    storage.partialState.leftAgentStates[playerNo] = newState;
	  } else {
	    storage.partialState.rightAgentStates[playerNo] = newState;
	  }
	}

	/**
	 * [parseAgentState description]
	 *
	 * @param  {string} dataLine the agent line
	 * @param  {!Replay} replay the replay to store the parsed states
	 * @param  {!LogParserStorage} storage the parser storage instance
	 * @param  {boolean} leftSide side indicator
	 * @return {void}
	 */
	function parseAgentState_V0_3D (dataLine, replay, storage, leftSide)
	{
	  // Agent-Line-Format:
	  // {l|L|r|R} <unum>[ model] <x> <y> <z> <qx> <qy> <qz> <qr> [ <joint-angle>]*
	  const line = dataLine.split(' ');
	  if (line.length < 9) {
	    // Not enough data!
	    return;
	  }

	  const playerNo = parseInt(line[1], 10);
	  let dataIdx = 2;
	  let modelIdx = 0;
	  let team;
	  let indexList;
	  let agentStates;

	  if (leftSide) {
	    team = replay.leftTeam;
	    indexList = storage.leftIndexList;
	    agentStates = storage.partialState.leftAgentStates;
	  } else {
	    team = replay.rightTeam;
	    indexList = storage.rightIndexList;
	    agentStates = storage.partialState.rightAgentStates;
	  }

	  // Check for model definition
	  if (line[0] === 'L' || line[0] === 'R') {
	    if (line.length < 10) {
	      // Not enough data!
	      return;
	    }

	    dataIdx++;

	    let modelType = 0;
	    try {
	      modelType = parseInt(line[2].slice(-1), 10);
	    } catch (err) {
	    }

	    team.addAgent(playerNo, replay.playerTypes[modelType]);
	    indexList[playerNo] = team.getRecentTypeIdx(playerNo);
	  }

	  if (indexList[playerNo] !== undefined) {
	    modelIdx = indexList[playerNo];
	  }

	  // Parse player state data
	  const position = new THREE.Vector3(
	        parseInt(line[dataIdx], 10) / 1000,
	        parseInt(line[dataIdx + 2], 10) / 1000,
	        -parseInt(line[dataIdx + 1], 10) / 1000);
	  const quat = new THREE.Quaternion(
	        parseInt(line[dataIdx + 4], 10) / 1000,
	        parseInt(line[dataIdx + 6], 10) / 1000,
	        -parseInt(line[dataIdx + 5], 10) / 1000,
	        parseInt(line[dataIdx + 3], 10) / 1000);
	  const jointData = [];
	  dataIdx += 7;

	  // Shuffle joint data
	  // Old joint order: <head> <l-arm> <l-leg> <r-arm> <r-leg>
	  // New joint order: <head> <r-arm> <l-arm> <r-leg> <l-leg>
	  let i;
	  const numLegJoints = line.length - dataIdx > 22 ? 7 : 6;
	  const lArmData = [];
	  const lLegData = [];

	  for (i = 0; i < 2 && dataIdx < line.length; i++, dataIdx++) {
	    jointData.push(JsMath.toRad(parseFloat(line[dataIdx]) / 100));
	  }
	  for (i = 0; i < 4 && dataIdx < line.length; i++, dataIdx++) {
	    lArmData.push(JsMath.toRad(parseFloat(line[dataIdx]) / 100));
	  }
	  for (i = 0; i < numLegJoints && dataIdx < line.length; i++, dataIdx++) {
	    lLegData.push(JsMath.toRad(parseFloat(line[dataIdx]) / 100));
	  }
	  for (i = 0; i < 4 && dataIdx < line.length; i++, dataIdx++) {
	    jointData.push(JsMath.toRad(parseFloat(line[dataIdx]) / 100));
	  }
	  for (i = 0; i < lArmData.length; i++) {
	    jointData.push(lArmData[i]);
	  }
	  for (i = 0; i < numLegJoints && dataIdx < line.length; i++, dataIdx++) {
	    jointData.push(JsMath.toRad(parseFloat(line[dataIdx]) / 100));
	  }
	  for (i = 0; i < lLegData.length; i++) {
	    jointData.push(lLegData[i]);
	  }


	  agentStates[playerNo] = new AgentState({
	      modelIdx: modelIdx,
	      flags: 0x00,
	      x: position.x,
	      y: position.y,
	      z: position.z,
	      qx: quat.x,
	      qy: quat.y,
	      qz: quat.z,
	      qw: quat.w,
	      jointAngles: jointData,
	      data: []
	    });
	}











	// ----------------------------------------------------------------------------
	// --------------------------------- VERSION 1 --------------------------------
	// ----------------------------------------------------------------------------

	/**
	 * [parseBallState description]
	 *
	 * @param  {string} dataLine
	 * @param  {?PartialWorldState} partialState
	 * @return {void}
	 */
	function parseBallState_V1_3D (dataLine, partialState)
	{
	  // Ball-Line-Format:
	  // b <x> <y> <z> <qx> <qy> <qz> <qw>
	  const line = dataLine.split(' ');
	  if (partialState === null || line.length < 8) {
	    // Not enough data!
	    return;
	  }

	  partialState.ballState = new ObjectState({
	      x: parseFloat(line[1]),
	      y: parseFloat(line[3]),
	      z: -parseFloat(line[2]),
	      qx: parseFloat(line[5]),
	      qy: parseFloat(line[7]),
	      qz: -parseFloat(line[6]),
	      qw: parseFloat(line[4])
	    });
	}

	/**
	 * [parseAgentState description]
	 *
	 * @param  {string} dataLine the agent line
	 * @param  {!Replay} replay the replay to store the parsed states
	 * @param  {!LogParserStorage} storage the parser storage instance
	 * @param  {boolean} leftSide side indicator
	 * @return {void}
	 */
	function parseAgentState_V1 (dataLine, replay, storage, leftSide)
	{
	  // Agent-Line-Format:
	  // 2D:
	  // {l|L|r|R} <unum>[ typeIdx] <flags> <x> <y> <heading-angle>[(j[ <joint-angle>]+)][(s <stamina>)]
	  // 3D:
	  // {l|L|r|R} <unum>[ typeIdx] <flags> <x> <y> <z> <qx> <qy> <qz> <qr>[(j[ <joint-angle>]+)][(s <stamina>)]
	  const rootNode = SymbolTreeParser.parse('(' + dataLine + ')');
	  if (rootNode.values.length < 6) {
	    // Not enough data!
	    return;
	  }

	  const playerNo = parseInt(rootNode.values[1], 10);
	  let dataIdx = 2;
	  let modelIdx = 0;
	  let team;
	  let indexList;
	  let agentStates;

	  if (leftSide) {
	    team = replay.leftTeam;
	    indexList = storage.leftIndexList;
	    agentStates = storage.partialState.leftAgentStates;
	  } else {
	    team = replay.rightTeam;
	    indexList = storage.rightIndexList;
	    agentStates = storage.partialState.rightAgentStates;
	  }

	  // Check for model definition
	  if (rootNode.values[0] === 'L' || rootNode.values[0] === 'R') {
	    team.addAgent(playerNo, replay.playerTypes[parseInt(rootNode.values[dataIdx], 10)]);
	    indexList[playerNo] = team.getRecentTypeIdx(playerNo);
	    dataIdx++;
	  }

	  if (indexList[playerNo] !== undefined) {
	    modelIdx = indexList[playerNo];
	  }

	  const flags = parseInt(rootNode.values[dataIdx], 16);
	  dataIdx++;

	  // Parse player state data
	  const position = new THREE.Vector3();
	  const quat = new THREE.Quaternion();
	  const jointData = [];
	  const agentData = [];
	  const is2D = replay.type === GameType.TWOD;

	  if (is2D) {
	    position.set(parseFloat(rootNode.values[dataIdx]), 0, parseFloat(rootNode.values[dataIdx + 1]));
	    quat.setFromAxisAngle(ThreeJsUtil.Vector3_UnitY(), JsMath.toRad(-1 * parseFloat(rootNode.values[dataIdx + 2])));
	  } else {
	    position.set(parseFloat(rootNode.values[dataIdx]),
	                 parseFloat(rootNode.values[dataIdx + 2]),
	                 -parseFloat(rootNode.values[dataIdx + 1]));
	    quat.set(parseFloat(rootNode.values[dataIdx + 4]),
	             parseFloat(rootNode.values[dataIdx + 6]),
	             -parseFloat(rootNode.values[dataIdx + 5]),
	             parseFloat(rootNode.values[dataIdx + 3]));
	  }

	  for (let i = 0; i < rootNode.children.length; i++) {
	    switch (rootNode.children[i].values[0]) {
	      case 'j':
	        parseJointNode(rootNode.children[i], jointData, is2D);
	        break;
	      case 's':
	        agentData[Agent2DData.STAMINA] = parseFloat(rootNode.children[i].values[1]);
	        break;
	    }
	  }

	  agentStates[playerNo] = new AgentState({
	      modelIdx: modelIdx,
	      flags: flags,
	      x: position.x,
	      y: position.y,
	      z: position.z,
	      qx: quat.x,
	      qy: quat.y,
	      qz: quat.z,
	      qw: quat.w,
	      jointAngles: jointData,
	      data: agentData
	    });
	}

	/**
	 * Parse a joint-angles symbol node into a joint-data array.
	 *
	 * @param  {!SymbolNode} node the joint-angles symbol node
	 * @param  {!Array<number>} jointData the joint data list
	 * @param  {boolean=} convert indicator if joint angles sign should be negated
	 * @return {void}
	 */
	function parseJointNode (node, jointData, convert)
	{
	  const factor = convert === true ? NegPIby180 : PIby180;

	  for (let i = 1; i < node.values.length; i++) {
	    jointData.push(parseFloat(node.values[i]) * factor);
	  }
	}

	/**
	 * The SServerLog class definition.
	 *
	 * The SServerLog is the central class holding a soccer-server 2D game log file.
	 *
	 * @author Stefan Glaser
	 */
	class SServerLog extends GameLog
	{
	  /**
	   * SServerLog Constructor
	   * Create a new sserver game log file.
	   *
	   * @param {number} version the ulg log version
	   */
	  constructor (version)
	  {
	    super(GameType.TWOD);

	    /**
	     * The ulg log version.
	     * @type {number}
	     */
	    this.version = version;
	  }
	}

	/**
	 * The ULGParser class definition.
	 *
	 * The ULGParser provides
	 *
	 * @author Stefan Glaser / http://chaosscripting.net
	 */
	class ULGParser extends GameLogParser
	{
	  /**
	   * ULGParser Constructor
	   * Create a new ULG parser instance.
	   */
	  constructor()
	  {
	    super();

	    /**
	     * The ulg log data iterator.
	     * @type {?DataIterator}
	     */
	    this.iterator = null;

	    /**
	     * The sserver log.
	     * @type {?SServerLog}
	     */
	    this.sserverLog = null;

	    /**
	     * The storage instance used during parsing.
	     * @type {?LogParserStorage}
	     */
	    this.storage = null;

	    // console.log('New USG parser instance created!');
	  }

	  /**
	   * Try or continue parsing a game log.
	   *
	   * @override
	   * @param  {string} data the current data
	   * @param  {!DataExtent=} extent the data extent (complete, partial, incremental)
	   * @return {boolean}
	   */
	  parse (data, extent = DataExtent.COMPLETE)
	  {
	    extent = extent !== undefined ? extent : DataExtent.COMPLETE;

	    if (this.iterator === null || this.sserverLog === null || this.storage === null) {
	      // Start parsing
	      this.iterator = new DataIterator(data, extent);

	      // ==================== Check ULG Header ====================
	      const line = this.iterator.next();
	      if (line === null || (line.charAt(0) !== 'U' && line.charAt(1) !== 'L' && line.charAt(2) !== 'G')) {
	        throw new ParserException('Failed parsing ULG log file - no ULG header found!');
	      }
	      const ulgVersion = parseInt(line.slice(3), 10);
	      this.sserverLog = new SServerLog(ulgVersion);
	      this.storage = new LogParserStorage();
	      this.storage.partialState = new PartialWorldState(0, 0.1, 0);
	      this.storage.maxStates = 100;

	      // Start parsing the ulg log body
	      this.iterator.next();
	      ULGParser.parseULGBody(this.iterator, this.sserverLog, this.storage);

	      if (extent === DataExtent.COMPLETE && this.sserverLog.states.length === 0) {
	        throw new ParserException('Empty SServer log file!');
	      }

	      return this.sserverLog.states.length > 0;
	    } else if (this.sserverLog !== null) {
	      const wasEmpty = this.sserverLog.states.length === 0;

	      // Progress parsing
	      if (this.iterator.update(data, extent)) {
	        // console.log('Restarting ULG parser...');
	        ULGParser.parseULGBody(this.iterator, this.sserverLog, this.storage);
	      }

	      if (extent === DataExtent.COMPLETE && this.sserverLog.states.length === 0) {
	        throw new ParserException('Empty SServer log file!');
	      }

	      return wasEmpty && this.sserverLog.states.length > 0;
	    }

	    return false;
	  }

	  /**
	   * Retrieve the currently parsed game log.
	   *
	   * @override
	   * @return {?GameLog} the (maybe partially) parsed game log
	   */
	  getGameLog ()
	  {
	    return this.sserverLog;
	  }

	  /**
	   * Dispose all resources referenced in this parser instance.
	   *
	   * @override
	   * @param {boolean=} keepIteratorAlive indicator if iterator should not be disposed
	   * @return {void}
	   */
	  dispose (keepIteratorAlive)
	  {
	    // console.log('Dispose USG parser instance (keep iterator: ' + keepIteratorAlive + ')');

	    if (this.iterator !== null && !keepIteratorAlive) {
	      this.iterator.dispose();
	    }

	    this.iterator = null;
	    this.sserverLog = null;
	    this.storage = null;
	  }








	  // ============================================================================
	  // ============================== STATIC MEMBERS ==============================
	  // ============================================================================

	  /**
	   * [parseULGBody description]
	   *
	   * @param  {!DataIterator} iterator the ulg log data iterator
	   * @param  {!SServerLog} sserverLog the sserver log to store the parsed states
	   * @param  {!LogParserStorage} storage the parser storage instance
	   * @return {void}
	   */
	  static parseULGBody (iterator, sserverLog, storage) {
	    // console.log('Parsing ulg log body...');

	    let line = iterator.line;
	    if (line === null) {
	      // Try to restart the iterator
	      line = iterator.next();
	    }

	    let newStatesCnt = 0;

	    // Parse
	    while (line !== null && newStatesCnt < storage.maxStates) {
	      try {
	        if (line.slice(0, 14) === '(server_param ') {
	          ULGParser.parseServerParamLine(line, sserverLog, storage);
	        } else if (line.slice(0, 14) === '(player_param ') {
	          ULGParser.parsePlayerParamLine(line, sserverLog);
	        } else if (line.slice(0, 13) === '(player_type ') {
	          ULGParser.parsePlayerTypeLine(line, sserverLog);
	        } else if (line.slice(0, 6) === '(team ') {
	          ULGParser.parseTeamLine(line, sserverLog, storage);
	        } else if (line.slice(0, 10) === '(playmode ') {
	          ULGParser.parsePlaymodeLine(line, sserverLog, storage);
	        } else if (line.slice(0, 5) === '(msg ') {
	          ULGParser.parseMessageLine(line, sserverLog);
	        } else if (line.slice(0, 6) === '(draw ') {
	          ULGParser.parseDrawLine(line, sserverLog);
	        } else if (line.slice(0, 6) === '(show ') {
	          ULGParser.parseShowLine(line, sserverLog, storage);
	          newStatesCnt++;
	        } else {
	          console.log('Unknown ulg log line: ' + line);
	        }
	      } catch (ex) {
	      }

	      line = iterator.next();
	    }

	    // Refresh sserver log
	    if (newStatesCnt > 0) {
	      sserverLog.onStatesUpdated();
	    }

	    // Start parsing job, parsing 100 show lines per run
	    if (line !== null) {
	      setTimeout(ULGParser.parseULGBody, 1, iterator, sserverLog, storage);
	    } else if (iterator.extent === DataExtent.COMPLETE) {
	      iterator.dispose();

	      if (storage.hasPartialState()) {
	        // Push final state
	        storage.partialState.appendTo(sserverLog.states);
	      }

	      sserverLog.finalize();
	    }
	  }

	  /**
	   * @param  {string} line the playmode line
	   * @param  {!SServerLog} sserverLog the ssserver log
	   * @param  {!LogParserStorage} storage the parser storage instance
	   * @return {void}
	   */
	  static parsePlaymodeLine (line, sserverLog, storage)
	  {
	    // (playmode <gameTime> <playmode>)
	    const rootNode = SymbolTreeParser.parse(line);

	    if (rootNode.values.length > 2) {
	      const gameTime = parseInt(rootNode.values[1], 10) / 10;

	      // Add partial state if valid
	      storage.partialState.appendTo(sserverLog.states);

	      // Update partial word state
	      storage.partialState.setGameTime(gameTime);
	      storage.partialState.setPlaymode(rootNode.values[2]);
	    } else {
	      console.log('Invalid playmode line: ' + line);
	    }
	  }

	  /**
	   * @param  {string} line the team line
	   * @param  {!SServerLog} sserverLog the ssserver log
	   * @param  {!LogParserStorage} storage the parser storage instance
	   * @return {void}
	   */
	  static parseTeamLine (line, sserverLog, storage)
	  {
	    // (team <time> <left-team-name> <right-team-name> <goals-left> <goals-right> [<pen-score-left> <pen-miss-left> <pen-score-right> <pen-miss-right>])
	    const rootNode = SymbolTreeParser.parse(line);

	    if (rootNode.values.length > 5) {
	      const gameTime = parseInt(rootNode.values[1], 10) / 10;
	      const goalsLeft = parseInt(rootNode.values[4], 10);
	      const goalsRight = parseInt(rootNode.values[5], 10);
	      let penScoreLeft = 0;
	      let penMissLeft = 0;
	      let penScoreRight = 0;
	      let penMissRight = 0;

	      if (rootNode.values.length > 9) {
	        penScoreLeft = parseInt(rootNode.values[6], 10);
	        penMissLeft = parseInt(rootNode.values[7], 10);
	        penScoreRight = parseInt(rootNode.values[8], 10);
	        penMissRight = parseInt(rootNode.values[9], 10);
	      }

	      // Update left team name
	      const leftUpdated = sserverLog.leftTeam.setName(MonitorUtil.copyString(rootNode.values[2]));
	      const rightUpdated = sserverLog.rightTeam.setName(MonitorUtil.copyString(rootNode.values[3]));
	      if (leftUpdated || rightUpdated) {
	        sserverLog.onTeamsUpdated();
	      }

	      // Add partial state if valid
	      storage.partialState.appendTo(sserverLog.states);

	      // Update partial word state
	      storage.partialState.setGameTime(gameTime);
	      storage.partialState.setScore(goalsLeft, goalsRight, penScoreLeft, penMissLeft, penScoreRight, penMissRight);
	    } else {
	      console.log('Invalid team line: ' + line);
	    }
	  }

	  /**
	   * @param  {string} line the show line
	   * @param  {!SServerLog} sserverLog the ssserver log
	   * @param  {!LogParserStorage} storage the parser storage instance
	   * @return {void}
	   */
	  static parseShowLine (line, sserverLog, storage)
	  {
	    // (show <time>
	    //    [(pm <playmode-no>)]
	    //    [(tm <left-team-name> <right-team-name> <goals-left> <goals-right> [<pen-score-left> <pen-miss-left> <pen-score-right> <pen-miss-right>])]
	    //    ((b) <x> <y> <vx> <vy>)
	    //    [((<side> <unum>) <player_type> <flags> <x> <y> <vx> <vy> <body> <neck> [<point-x> <point-y>]
	    //        (v <view-quality> <view-width>)
	    //        (s <stamina> <effort> <recovery> [<capacity>])
	    //        [(f <side> <unum>)]
	    //        (c <kick> <dash> <turn> <catch> <move> <tneck> <view> <say> <tackle> <pointto> <attention>)
	    //    )]*
	    // )
	    const rootNode = SymbolTreeParser.parse(line);

	    if (rootNode.values.length > 1) {

	      // Add partial state if valid
	      storage.partialState.appendTo(sserverLog.states);
	      storage.partialState.setGameTime(parseInt(rootNode.values[1], 10) / 10);

	      let childNode;

	      // Parse symbol tree into partial world state of sserver log
	      for (let i = 0; i < rootNode.children.length; i++) {
	        childNode = rootNode.children[i];

	        if (childNode.children.length > 0) {
	          // Either a ball or player info
	          if (childNode.children[0].values[0] === 'b') {
	            // Found ball info
	            ULGParser.parseBallState(childNode, storage.partialState);
	          } else if (childNode.children[0].values[0] === 'l') {
	            // Found left team player
	            ULGParser.parseAgentState(childNode, sserverLog, sserverLog.leftTeam, storage.partialState.leftAgentStates);
	          } else if (childNode.children[0].values[0] === 'r') {
	            // Found right team player
	            ULGParser.parseAgentState(childNode, sserverLog, sserverLog.rightTeam, storage.partialState.rightAgentStates);
	          } else {
	            console.log('Found unexpected node in show line: ' + line.slice(0, 20));
	          }
	        } else if (childNode.values.length > 0) {
	          // Either a playmode or team info
	          if (childNode.values[0] === 'pm') {
	            // parse the playmode number
	            console.log('Found pm info in show line...');
	          } else if (childNode.values[0] === 'tm') {
	            // parse the team and scoring information
	            console.log('Found tm info in show line...');
	          } else {
	            console.log('Found unexpected node in show line: ' + line.slice(0, 20));
	          }
	        } else {
	          console.log('Found empty node in show line: ' + line.slice(0, 20));
	        }
	      }
	    } else {
	      console.log('Invalid show line: ' + line.slice(0, 20));
	    }
	  }

	  /**
	   * [parseBallState description]
	   *
	   * @param  {!SymbolNode} node the ball symbol node
	   * @param  {?PartialWorldState} partialState the partial world state
	   * @return {void}
	   */
	  static parseBallState (node, partialState)
	  {
	    // ((b) <x> <y> <vx> <vy>)

	    if (partialState === null || node.values.length < 2) {
	      // Not enough data!
	      return;
	    }

	    partialState.ballState = new ObjectState({
	        x: parseFloat(node.values[0]),
	        y: 0.2,
	        z: parseFloat(node.values[1]),
	        qx: 0,
	        qy: 0,
	        qz: 0,
	        qw: 1
	      });
	  }

	  /**
	   * [parseAgentState description]
	   *
	   * @param  {!SymbolNode} node the ball symbol node
	   * @param  {!SServerLog} sserverLog the ssserver log
	   * @param  {!TeamDescription} teamDescription the team description
	   * @param  {!Array<!AgentState>} teamStates the team agent states list
	   * @return {void}
	   */
	  static parseAgentState (node, sserverLog, teamDescription, teamStates)
	  {
	    // ((<side> <unum>) <player_type> <flags> <x> <y> <vx> <vy> <body> <neck> [<point-x> <point-y>]
	    //   (v <view-quality> <view-width>)
	    //   (s <stamina> <effort> <recovery> [<capacity>])
	    //   [(f <side> <unum>)]
	    //   (c <kick> <dash> <turn> <catch> <move> <tneck> <view> <say> <tackle> <pointto> <attention>)
	    // )

	    if (node.values.length < 7) {
	      // Invalid agent node
	      console.log('Expected more values in agent node: ' + node.values);
	      return;
	    }

	    const playerNo = parseInt(node.children[0].values[1], 10);
	    const typeIdx = parseInt(node.values[0], 10);
	    const flags = parseInt(node.values[1], 16);

	    teamDescription.addAgent(playerNo, sserverLog.playerTypes[typeIdx]);

	    // Parse player state data
	    let position = null;
	    let quat = null;
	    const jointData = [];
	    const agentData = [];

	    let angle = 0;
	    let values;

	    position = new THREE.Vector3(parseFloat(node.values[2]), 0, parseFloat(node.values[3]));
	    angle = parseFloat(node.values[6]);
	    quat = new THREE.Quaternion();
	    quat.setFromAxisAngle(ThreeJsUtil.Vector3_UnitY(), JsMath.toRad(-angle));

	    if (node.values.length > 7) {
	      angle = parseFloat(node.values[7]);
	      jointData[0] = JsMath.toRad(-angle);
	    }

	    // TODO: Parse stamina, focus and count information
	    for (let i = 1; i < node.children.length; i++) {
	      values = node.children[i].values;

	      if (values.length > 0) {
	        if (values[0] === 'v') {
	          // Parse view info
	          // (v <view-quality> <view-width>)
	          continue;
	        } else if (values[0] === 's') {
	          // Parse stamina info
	          // (s <stamina> <effort> <recovery> [<capacity>])
	          if (values.length > 1) {
	            agentData[Agent2DData.STAMINA] = parseFloat(values[1]);
	          }
	          if (values.length > 2) {
	            agentData[Agent2DData.STAMINA_EFFORT] = parseFloat(values[2]);
	          }
	          if (values.length > 3) {
	            agentData[Agent2DData.STAMINA_RECOVERY] = parseFloat(values[3]);
	          }
	          if (values.length > 4) {
	            agentData[Agent2DData.STAMINA_CAPACITY] = parseFloat(values[4]);
	          }
	        } else if (values[0] === 'f') {
	          // Parse focus info
	          // (f <side> <unum>)
	          if (values.length > 2) {
	            agentData[Agent2DData.FOCUS_SIDE] = values[1] === 'l' ? 'l' : 'r';
	            agentData[Agent2DData.FOCUS_UNUM] = parseInt(values[2], 10);
	          } else {
	            console.log('Found unexpected focus node in agent node!');
	          }
	        } else if (values[0] === 'c') {
	          // Parse count info
	          // (c <kick> <dash> <turn> <catch> <move> <tneck> <view> <say> <tackle> <pointto> <attention>)
	          if (values.length > 1) {
	            agentData[Agent2DData.KICK_COUNT] = parseInt(values[1], 10);
	          }
	          if (values.length > 2) {
	            agentData[Agent2DData.DASH_COUNT] = parseInt(values[2], 10);
	          }
	          if (values.length > 3) {
	            agentData[Agent2DData.TURN_COUNT] = parseInt(values[3], 10);
	          }
	          if (values.length > 4) {
	            agentData[Agent2DData.CATCH_COUNT] = parseInt(values[4], 10);
	          }
	          if (values.length > 5) {
	            agentData[Agent2DData.MOVE_COUNT] = parseInt(values[5], 10);
	          }
	          if (values.length > 6) {
	            agentData[Agent2DData.TURN_NECK_COUNT] = parseInt(values[6], 10);
	          }
	          if (values.length > 7) {
	            agentData[Agent2DData.VIEW_COUNT] = parseInt(values[7], 10);
	          }
	          if (values.length > 8) {
	            agentData[Agent2DData.SAY_COUNT] = parseInt(values[8], 10);
	          }
	          if (values.length > 9) {
	            agentData[Agent2DData.TACKLE_COUNT] = parseInt(values[9], 10);
	          }
	          if (values.length > 10) {
	            agentData[Agent2DData.POINT_TO_COUNT] = parseInt(values[10], 10);
	          }
	          if (values.length > 11) {
	            agentData[Agent2DData.ATTENTION_COUNT] = parseInt(values[11], 10);
	          }
	        } else {
	          // Unknown subnode
	          console.log('Found unexpected child node in agent node!');
	        }
	      } else {
	        console.log('Found unexpected child node in agent node!');
	      }
	    }

	    teamStates[playerNo] = new AgentState({
	        modelIdx: teamDescription.getRecentTypeIdx(playerNo),
	        flags: flags,
	        x: position.x,
	        y: position.y,
	        z: position.z,
	        qx: quat.x,
	        qy: quat.y,
	        qz: quat.z,
	        qw: quat.w,
	        jointAngles: jointData,
	        data: agentData
	      });
	  }

	  /**
	   * @param  {string} line the server params line
	   * @param  {!SServerLog} sserverLog the ssserver log
	   * @param  {!LogParserStorage} storage the parser storage instance
	   * @return {void}
	   */
	  static parseServerParamLine (line, sserverLog, storage)
	  {
	    // (server_param (<name> <value>)*)
	    sserverLog.environmentParams.clear();
	    ULGParser.parseParameters(line, sserverLog.environmentParams.paramObj, 'server parameter');

	    // Update sserver log frequency and partial state time step
	    sserverLog.updateFrequency();
	    if (storage.partialState !== null) {
	      storage.partialState.timeStep = 1 / sserverLog.frequency;
	    }
	  }

	  /**
	   * @param  {string} line the player params line
	   * @param  {!SServerLog} sserverLog the ssserver log
	   * @return {void}
	   */
	  static parsePlayerParamLine (line, sserverLog)
	  {
	    // (player_param (<name> <value>)*)
	    sserverLog.playerParams.clear();
	    ULGParser.parseParameters(line, sserverLog.playerParams.paramObj, 'player parameter');
	  }

	  /**
	   * @param  {string} line the player type line
	   * @param  {!SServerLog} sserverLog the ssserver log
	   * @return {void}
	   */
	  static parsePlayerTypeLine (line, sserverLog)
	  {
	    // (player_type (<name> <value>)*)
	    const playerType = {};
	    ULGParser.parseParameters(line, playerType, 'player type');

	    const typeIdx = /** @type {number}*/ (playerType[PlayerType2DParams.ID]);
	    if (typeIdx !== undefined) {
	      sserverLog.playerTypes[typeIdx] = new ParameterMap(playerType);
	    }
	  }

	  /**
	   * Parse a parameter line.
	   *
	   * @param  {string} line the data line
	   * @param  {!Object} params the target parameter object
	   * @param  {string} context the parameter context (for logging)
	   * @return {void}
	   */
	  static parseParameters (line, params, context)
	  {
	    const rootNode = SymbolTreeParser.parse(line);
	    let values;

	    // Iterate over all param-value child nodes
	    for (let i = 0; i < rootNode.children.length; i++) {
	      values = rootNode.children[i].values;

	      if (values.length < 2) {
	        console.log('Malformated name-value pair in ' + context + ' line: ' + rootNode.children[i]);
	        continue;
	      }

	      if (values[1] === 'true') {
	        // Parse as boolean value
	        params[values[0]] = true;
	      } else if (values[1] === 'false') {
	        // Parse as boolean value
	        params[values[0]] = false;
	      } else if (values[1].charAt(0) === '"') {
	        // Parse as string value
	        params[values[0]] = MonitorUtil.copyString(values[1].slice(1, -1));
	      } else {
	        // Try parse as numerical value
	        try {
	          params[values[0]] = parseFloat(values[1]);
	        } catch (ex) {
	          // If parsing as numerical values fails, simply copy the whole string value
	          params[values[0]] = MonitorUtil.copyString(values[1]);
	        }
	      }
	    }
	  }

	  /**
	   * @param  {string} line the message line
	   * @param  {!SServerLog} sserverLog the ssserver log
	   * @return {void}
	   */
	  static parseMessageLine (line, sserverLog) {}

	  /**
	   * @param  {string} line the draw line
	   * @param  {!SServerLog} sserverLog the ssserver log
	   * @return {void}
	   */
	  static parseDrawLine (line, sserverLog) {}
	}

	/**
	 * Simple file helpers.
	 * 
	 * @author Stefan Glaser
	 */
	class FileUtil
	{
	  /**
	   * Extract the file name from an url string.
	   *
	   * @param  {string} url the url to extract the file name from
	   * @return {string} the file name or the given url if the url doesn't contain any subfolders
	   */
	  static getFileName (url)
	  {
	    let endIdx = url.indexOf('?');
	    if (endIdx === -1) {
	      // No parameter indication character found
	      endIdx = url.length;
	    }

	    const startIdx = url.slice(0, endIdx).lastIndexOf('/');

	    return url.slice(startIdx + 1, endIdx);
	  }

	  /**
	   * Extract the file type from an url string.
	   *
	   * @param  {string} url the url to extract the file type from
	   * @return {?string} the file type or null if the path doesn't refer a file
	   */
	  static getFileType (url)
	  {
	    // TODO: Find a proper solution...
	    const lastDotIdx = url.lastIndexOf('.');

	    if (lastDotIdx !== -1) {
	      return url.slice(lastDotIdx + 1);
	    } else {
	      return null;
	    }
	  }

	  /**
	   * Filter a list of files according to their name suffixes.
	   *
	   * @param  {!Array<!File>} files a list of files
	   * @param  {!Array<string>} suffixes the list of suffixes to filter for
	   * @return {!Array<!File>} a list of files with the given suffixes
	   */
	  static filterFiles (files, suffixes) {
	    const filteredFiles = [];

	    for (let i = 0; i < files.length; i++) {
	      for (let j = 0; j < suffixes.length; j++) {
	        if (files[i].name.slice(-suffixes[j].length) === suffixes[j]) {
	          filteredFiles.push(files[i]);
	          break;
	        }
	      }
	    }

	    return filteredFiles;
	  }

	  /**
	   * Check if the given url/path/file references a known replay file ending.
	   *
	   * @param  {string} url the url to check
	   * @param  {boolean=} gzipAllowed indicator if gzipped versions are accepted
	   * @return {boolean} true, if the given url references a known replay file ending, false otherwise
	   */
	  static isReplayFile (url, gzipAllowed) {
	    const fileName = FileUtil.getFileName(url);
	    const suffix9 = fileName.slice(-9);
	    const suffix6 = fileName.slice(-6);

	    if (suffix6 === '.rpl3d' || suffix6 === '.rpl2d' || fileName.slice(-7) === '.replay') {
	      return true;
	    } else if (gzipAllowed && (suffix9 === '.rpl3d.gz' || suffix9 === '.rpl2d.gz' || fileName.slice(-10) === '.replay.gz')) {
	      return true;
	    }

	    return false;
	  }

	  /**
	   * Check if the given url/path/file references a known sserver log file ending.
	   *
	   * @param  {string} url the url to check
	   * @param  {boolean=} gzipAllowed indicator if gzipped file versions are accepted
	   * @return {boolean} true, if the given url references a known sserver log file ending, false otherwise
	   */
	  static isSServerLogFile (url, gzipAllowed) {
	    const fileName = FileUtil.getFileName(url);

	    return fileName.slice(-4) === '.rcg' || (gzipAllowed !== undefined && fileName.slice(-7) === '.rcg.gz');
	  }
	}

	/**
	 * @enum {string}
	 */
	const GameLogLoaderEvents = {
	  START: 'start',
	  NEW_GAME_LOG: 'new-game-log',
	  PROGRESS: 'progress',
	  FINISHED: 'finished',
	  ERROR: 'error'
	};

	/**
	 * The GameLogLoader class definition.
	 *
	 * @author Stefan Glaser
	 */
	class GameLogLoader extends EventDispatcher
	{
	  /**
	   * ::implements {IPublisher}
	   * ::implements {IEventDispatcher}
	   */
	  constructor ()
	  {
	    super();

	    /**
	     * The game log parser instance.
	     * @type {?GameLogParser}
	     */
	    this.parser = null;

	    /**
	     * The XMLHttpRequest object used to load remote game log files.
	     * @type {?XMLHttpRequest}
	     */
	    this.xhr = null;

	    /**
	     * The FileReader object used to load the local game log files.
	     * @type {?FileReader}
	     */
	    this.fileReader = null;



	    /** @type {!Function} */
	    this.xhrOnLoadListener = this.xhrOnLoad.bind(this);
	    /** @type {!Function} */
	    this.xhrOnProgressListener = this.xhrOnProgress.bind(this);
	    /** @type {!Function} */
	    this.xhrOnErrorListener = this.xhrOnError.bind(this);

	    /** @type {!Function} */
	    this.fileReaderOnLoadEndListener = this.fileReaderOnLoadEnd.bind(this);
	  }

	  /**
	   * Load a game log from the specified url.
	   *
	   * @param  {string} url the URL to the game log file
	   * @return {void}
	   */
	  load (url)
	  {
	    // Clear loader instance
	    this.clear();

	    // Create a parser instance
	    if (!this.createParserFor(url, true)) {
	      return;
	    }

	    // Publish start event
	    this.dispatchEvent({
	      type: GameLogLoaderEvents.START,
	      url: url
	    });

	    // Create Request
	    this.xhr = new XMLHttpRequest();
	    this.xhr.open('GET', url, true);

	    // Add event listeners
	    this.xhr.addEventListener('load', this.xhrOnLoadListener, false);
	    this.xhr.addEventListener('progress', this.xhrOnProgressListener, false);
	    this.xhr.addEventListener('error', this.xhrOnErrorListener, false);

	    // Set mime type
	    if (this.xhr.overrideMimeType) {
	      this.xhr.overrideMimeType('text/plain');
	    }

	    // Send request
	    this.xhr.send(null);
	  }

	  /**
	   * Load a game log file from the local file system.
	   *
	   * @param  {!File} file the file to load
	   * @return {void}
	   */
	  loadFile (file)
	  {
	    // Clear loader instance
	    this.clear();

	    // Create a parser instance
	    if (!this.createParserFor(file.name)) {
	      return;
	    }

	    if (this.fileReader === null) {
	      this.fileReader = new FileReader();
	      this.fileReader.addEventListener('loadend', this.fileReaderOnLoadEndListener, false);
	    }

	    // Publish start event
	    this.dispatchEvent({
	      type: GameLogLoaderEvents.START,
	      url: file.name
	    });

	    // Read file
	    // this.fileReader.readAsBinaryString(file);
	    this.fileReader.readAsText(file);
	  }

	  /**
	   * Load a game log file from the local file system.
	   *
	   * @param  {string} name the file name / url / etc.
	   * @param  {boolean=} gzipAllowed indicator if gzipped file versions are accepted
	   * @return {boolean}
	   */
	  createParserFor (name, gzipAllowed)
	  {
	    if (FileUtil.isSServerLogFile(name, gzipAllowed)) {
	      // Try ulg parser
	      this.parser = new ULGParser();
	    } else if (FileUtil.isReplayFile(name, gzipAllowed)) {
	      // Use replay parser
	      this.parser = new ReplayParser();
	    } else {
	      this.dispatchEvent({
	          type: GameLogLoaderEvents.ERROR,
	          msg: 'Error while loading file! Failed to create game log parser!'
	        });
	    }

	    return this.parser !== null;
	  }

	  /**
	   * Clear the loader instance.
	   *
	   * @param {boolean=} keepIteratorAlive indicator if iterator should not be disposed
	   * @return {void}
	   */
	  clear (keepIteratorAlive)
	  {
	    if (this.xhr !== null) {
	      // Remove event listeners
	      this.xhr.removeEventListener('load', this.xhrOnLoadListener);
	      this.xhr.removeEventListener('progress', this.xhrOnProgressListener);
	      this.xhr.removeEventListener('error', this.xhrOnErrorListener);

	      // Abort active request
	      this.xhr.abort();
	      this.xhr = null;
	    }

	    // TODO: Clear file loader instance

	    if (this.parser !== null) {
	      this.parser.dispose(keepIteratorAlive);
	    }

	    this.parser = null;
	  }

	  /**
	   * The XHR onLoad callback.
	   *
	   * @param  {!Event} event the xhr event
	   * @return {void}
	   */
	  xhrOnLoad (event)
	  {
	    if (event.target.status === 200 || event.target.status === 0) {
	      // Parse remaining response
	      this.parse(event.target.response, DataExtent.COMPLETE);

	      // Dispatch finished event
	      this.dispatchEvent({
	          type: GameLogLoaderEvents.FINISHED
	        });
	    } else {
	      // Error during loading
	      this.dispatchEvent({
	          type: GameLogLoaderEvents.ERROR,
	          msg: this.getXHRErrorMessage()
	        });
	    }
	  }

	  /**
	   * The FileReader onLoadEnd callback.
	   *
	   * @param  {!Event} event the FileReader event
	   * @return {void}
	   */
	  fileReaderOnLoadEnd (event)
	  {
	    if (event.target.readyState == FileReader.DONE) { // DONE == 2
	      // Parse file content
	      this.parse(event.target.result, DataExtent.COMPLETE);

	      // Dispatch finished event
	      this.dispatchEvent({
	          type: GameLogLoaderEvents.FINISHED
	        });
	    } else {
	      // Clear loader instance
	      this.clear();

	      // Error during loading
	      this.dispatchEvent({
	          type: GameLogLoaderEvents.ERROR,
	          msg: 'Loading file failed!'
	        });
	    }
	  }

	  /**
	   * The XHR onProgress callback.
	   *
	   * @param  {!Event} event the xhr event
	   * @return {void}
	   */
	  xhrOnProgress (event)
	  {
	    // Dispatch progress event
	    this.dispatchEvent({
	        type: GameLogLoaderEvents.PROGRESS,
	        total: event.total,
	        loaded: event.loaded
	      });

	    if (event.target.status === 200 || event.target.status === 0) {
	      this.parse(event.target.response, DataExtent.PARTIAL);
	    }
	  }

	  /**
	   * The XHR onError callback.
	   *
	   * @param  {!Event} event the xhr event
	   * @return {void}
	   */
	  xhrOnError (event)
	  {
	    // Dispatch errer event
	    this.dispatchEvent({
	        type: GameLogLoaderEvents.ERROR,
	        msg: this.getXHRErrorMessage()
	      });
	  }

	  /**
	   * Try or continue parsing a game log.
	   *
	   * @param  {?string} data the current data
	   * @param  {!DataExtent} extent the data extent (complete, partial, incremental)
	   * @return {void}
	   */
	  parse (data, extent)
	  {
	    if (!data || this.parser === null) {
	      // Nothing to parse
	      return;
	    }

	    try {
	      if (this.parser.parse(data, extent)) {
	        // A new game log instance was successfully created
	        this.dispatchEvent({
	            type: GameLogLoaderEvents.NEW_GAME_LOG,
	            gameLog: this.parser.getGameLog()
	          });
	      }

	      if (extent === DataExtent.COMPLETE) {
	        // Clear loader instance
	        this.clear(true);
	      }
	    } catch (ex) {
	      // Clear loader instance
	      this.clear();

	      // Dispatch errer event
	      this.dispatchEvent({
	          type: GameLogLoaderEvents.ERROR,
	          msg: ex.toString()
	        });
	    }
	  }

	  /**
	   * Retrieve the error message of the active XHR object, or create some default message if there is no error message available.
	   *
	   * @return {string} the error/status message
	   */
	  getXHRErrorMessage ()
	  {
	    let message = 'No active XMLHttpRequest to check for an error!';

	    if (this.xhr !== null) {
	      message = this.xhr.statusText;

	      if (!message || message === '') {
	        message = 'Unknown reason!';
	      }
	    }

	    // Clear loader instance
	    this.clear();

	    return message;
	  }
	}

	/**
	 * Base class for all configuration models.
	 *
	 * @author Stefan Glaser
	 */
	class ConfigurationModel extends EventDispatcher
	{
	  constructor ()
	  {
	    super();
	  }

	  /**
	   * Retrieve the configuration id.
	   *
	   * @return {string} the configuration id
	   */
	  getID ()
	  {
	    return '';
	  }

	  /**
	   * Retrieve a stringified version of this configuration for persistance.
	   *
	   * @return {string} the stringified version of this configuration
	   */
	  toJSONString ()
	  {
	    return '';
	  }

	  /**
	   * Restore this configuration from persistance string.
	   *
	   * @param  {string} jsonString a stringified version of this configuration
	   * @return {void}
	   */
	  fromJSONString (jsonString) {}
	}

	/**
	 * The monitor configuration event type enum.
	 * @enum {string}
	 */
	const MonitorConfigurationEvents = {
	  CHANGE: 'change'
	};

	/**
	 * The monitor configuration property enum.
	 * @enum {string}
	 */
	const MonitorConfigurationProperties = {
	  TEAM_COLORS_ENABLED: 'teamColorsEnabled',
	  TEAM_COLOR_LEFT: 'teamColorLeft',
	  TEAM_COLOR_RIGHT: 'teamColorRight',
	  INTERPOLATE_STATES: 'interpolateStates',
	  SHADOWS_ENABLED: 'shadowsEnabled',
	  GL_INFO_ENABLED: 'glInfoEnabled'
	};

	/**
	 * The MonitorConfiguration class definition.
	 *
	 * The MonitorConfiguration provides
	 *
	 * @author Stefan Glaser
	 */
	class MonitorConfiguration extends ConfigurationModel
	{
	  /**
	   * MonitorConfiguration Constructor
	   *
	   * ::implements {IPublisher}
	   * ::implements {IEventDispatcher}
	   * ::implements {IConfiguration}
	   */
	  constructor()
	  {
	    super();

	    /**
	     * Use user defined team colors?
	     * @type {boolean}
	     */
	    this.teamColorsEnabled = false;

	    /**
	     * User defined color for the left team.
	     * @type {!THREE.Color}
	     */
	    this.leftTeamColor = new THREE.Color('#cccc00');

	    /**
	     * User defined color for the right team.
	     * @type {!THREE.Color}
	     */
	    this.rightTeamColor = new THREE.Color('#008fff');

	    /**
	     * Interpolate world states?
	     * @type {boolean}
	     */
	    this.interpolateStates = true;

	    /**
	     * Are shadows enabled?
	     * @type {boolean}
	     */
	    this.shadowsEnabled = false;

	    /**
	     * Show gl panel info?
	     * @type {boolean}
	     */
	    this.glInfoEnabled = false;
	  }

	  /**
	   * @override
	   * @return {string}
	   */
	  getID ()
	  {
	    return 'monitorConfig';
	  }

	  /**
	   * @override
	   * @return {string}
	   */
	  toJSONString ()
	  {
	    const obj = {};

	    // Store properties
	    obj[MonitorConfigurationProperties.TEAM_COLORS_ENABLED] = this.teamColorsEnabled;
	    obj[MonitorConfigurationProperties.TEAM_COLOR_LEFT] = this.leftTeamColor.getHex();
	    obj[MonitorConfigurationProperties.TEAM_COLOR_RIGHT] = this.rightTeamColor.getHex();
	    obj[MonitorConfigurationProperties.INTERPOLATE_STATES] = this.interpolateStates;
	    obj[MonitorConfigurationProperties.SHADOWS_ENABLED] = this.shadowsEnabled;
	    obj[MonitorConfigurationProperties.GL_INFO_ENABLED] = this.glInfoEnabled;

	    return JSON.stringify(obj);
	  }

	  /**
	   * Restore this configuration from persistance string.
	   *
	   * @override
	   * @param  {string} jsonString a stringified version of this configuration
	   * @return {void}
	   */
	  fromJSONString (jsonString)
	  {
	    try {
	      const obj = JSON.parse(jsonString);

	      // Read values
	      let value = obj[MonitorConfigurationProperties.TEAM_COLORS_ENABLED];
	      if (value !== undefined) {
	        this.teamColorsEnabled = value;
	      }

	      value = obj[MonitorConfigurationProperties.TEAM_COLOR_LEFT];
	      if (value !== undefined) {
	        this.leftTeamColor = new THREE.Color(value);
	      }

	      value = obj[MonitorConfigurationProperties.TEAM_COLOR_RIGHT];
	      if (value !== undefined) {
	        this.rightTeamColor = new THREE.Color(value);
	      }

	      value = obj[MonitorConfigurationProperties.INTERPOLATE_STATES];
	      if (value !== undefined) {
	        this.interpolateStates = value;
	      }

	      value = obj[MonitorConfigurationProperties.SHADOWS_ENABLED];
	      if (value !== undefined) {
	        this.shadowsEnabled = value;
	      }

	      value = obj[MonitorConfigurationProperties.GL_INFO_ENABLED];
	      if (value !== undefined) {
	        this.glInfoEnabled = value;
	      }
	    } catch (ex) {
	      console.log(ex);
	    }
	  }

	  /**
	   * Enable/Disable usage of user defined team colors.
	   *
	   * @param {boolean} value true for enabled, false for disabled
	   * @return {void}
	   */
	  setTeamColorsEnabled (value)
	  {
	    if (this.teamColorsEnabled !== value) {
	      this.teamColorsEnabled = value;

	      // Publish change event
	      this.dispatchEvent({
	        type: MonitorConfigurationEvents.CHANGE,
	        property: MonitorConfigurationProperties.TEAM_COLORS_ENABLED,
	        newValue: value
	      });
	    }
	  }

	  /**
	   * Store the given color as the user defined color for the left team.
	   *
	   * @param {string} color the user defined team color
	   * @param {boolean} leftSide true if the color is for the left team, false for the right team
	   * @return {void}
	   */
	  setTeamColor (color, leftSide)
	  {
	    if (leftSide) {
	      this.leftTeamColor = new THREE.Color(color);

	      // Publish change event
	      this.dispatchEvent({
	        type: MonitorConfigurationEvents.CHANGE,
	        property: MonitorConfigurationProperties.TEAM_COLOR_LEFT,
	        newValue: this.leftTeamColor
	      });
	    } else {
	      this.rightTeamColor = new THREE.Color(color);

	      // Publish change event
	      this.dispatchEvent({
	        type: MonitorConfigurationEvents.CHANGE,
	        property: MonitorConfigurationProperties.TEAM_COLOR_RIGHT,
	        newValue: this.rightTeamColor
	      });
	    }
	  }

	  /**
	   * Read the user defined color for a team.
	   *
	   * @param  {boolean} leftSide true for left side, false for right side
	   * @return {!THREE.Color} the user defined team color
	   */
	  getTeamColor (leftSide)
	  {
	    return leftSide ? this.leftTeamColor : this.rightTeamColor;
	  }

	  /**
	   * @param {boolean} value
	   */
	  setInterpolateStates (value)
	  {
	    if (this.interpolateStates !== value) {
	      this.interpolateStates = value;

	      // Publish change event
	      this.dispatchEvent({
	        type: MonitorConfigurationEvents.CHANGE,
	        property: MonitorConfigurationProperties.INTERPOLATE_STATES,
	        newValue: value
	      });
	    }
	  }

	  /**
	   * @param {boolean} value
	   */
	  setShadowsEnabled (value)
	  {
	    if (this.shadowsEnabled !== value) {
	      this.shadowsEnabled = value;

	      // Publish change event
	      this.dispatchEvent({
	        type: MonitorConfigurationEvents.CHANGE,
	        property: MonitorConfigurationProperties.SHADOWS_ENABLED,
	        newValue: value
	      });
	    }
	  }

	  /**
	   * @param {boolean} value
	   */
	  setGLInfoEnabled (value)
	  {
	    if (this.glInfoEnabled !== value) {
	      this.glInfoEnabled = value;

	      // Publish change event
	      this.dispatchEvent({
	        type: MonitorConfigurationEvents.CHANGE,
	        property: MonitorConfigurationProperties.GL_INFO_ENABLED,
	        newValue: value
	      });
	    }
	  }
	}

	/**
	 * The GameLogInfo class definition.
	 *
	 * @author Stefan Glaser
	 */
	class GameLogInfo
	{
	  /**
	   * GameLogInfo Constructor
	   *
	   * @param {number} year the year of recording
	   * @param {number} month the month of recording
	   * @param {number} day the day of recording
	   * @param {number} hour the of recording
	   * @param {number} minute the minutor of recording
	   * @param {string} leftTeamName the name of the left team
	   * @param {number} leftScore the score of the left team
	   * @param {string} rightTeamName the name of the right team
	   * @param {number} rightScore the score of the right team
	   */
	  constructor (year, month, day, hour, minute, leftTeamName, leftScore, rightTeamName, rightScore)
	  {
	    /**
	     * The year in which the game was played.
	     * @type {number}
	     */
	    this.year = year;

	    /**
	     * The month in which the game was played.
	     * @type {number}
	     */
	    this.month = month;

	    /**
	     * The day in which the game was played.
	     * @type {number}
	     */
	    this.day = day;

	    /**
	     * The hour of the day in which the game was played.
	     * @type {number}
	     */
	    this.hour = hour;

	    /**
	     * The minute within the hour of the day in which the game was played.
	     * @type {number}
	     */
	    this.minute = minute;

	    /**
	     * The name of the left team.
	     * @type {string}
	     */
	    this.leftTeamName = leftTeamName;

	    /**
	     * The score of the left team.
	     * @type {number}
	     */
	    this.leftScore = leftScore;

	    /**
	     * The name of the right team.
	     * @type {string}
	     */
	    this.rightTeamName = rightTeamName;

	    /**
	     * The score of the right team.
	     * @type {number}
	     */
	    this.rightScore = rightScore;
	  }

	  /**
	   * Parse a new game log info instance from the given file url.
	   *
	   * @param {string} url the url to extract the game log from
	   * @return {?GameLogInfo} the new game log info instance, or null if parsing failed
	   */
	  static fromURL (url)
	  {
	    return GameLogInfo.fromFileName(FileUtil.getFileName(url));
	  }

	  /**
	   * Parse a new game log info instance from the given file name.
	   *
	   * @param {string} name the game log file name to extract the game log info from
	   * @return {?GameLogInfo} the new game log info instance, or null if parsing failed
	   */
	  static fromFileName (name)
	  {
	    // Typical log format (which we are looking for):
	    // YYYYMMDDhhmm{_|-}<left-team>_<left-score>{_|-}vs{_|-}<right-team>_<right-score>.<suffix>
	    const regex = /^([\d]{4})([\d]{2})([\d]{2})([\d]{2})([\d]{2})[-_](.+)_([\d]+)[-_]vs[-_](.+)_([\d]+)\..*/g;
	    const tokens = regex.exec(name);

	    if (tokens) {
	      // Found matching pattern
	      return new GameLogInfo(
	          parseInt(tokens[1], 10), // Year
	          parseInt(tokens[2], 10), // Month
	          parseInt(tokens[3], 10), // Day
	          parseInt(tokens[4], 10), // Hour
	          parseInt(tokens[5], 10), // Minute
	          tokens[6],               // Left team
	          parseInt(tokens[7], 10), // Left score
	          tokens[8],               // Right team
	          parseInt(tokens[9], 10)  // Right score
	        );
	    }

	    return null;
	  }
	}

	/**
	 * @enum {string}
	 */
	const PlaylistEvents = {
	  CHANGE: 'change',
	  UPDATE: 'update',
	  ACTIVE_CHANGE: 'active-change',
	  AUTOPLAY_CHANGE: 'autoplay-change'
	};

	/**
	 * The GameLogEntry class definition.
	 *
	 * @author Stefan Glaser
	 */
	class GameLogEntry
	{
	  /**
	   * GameLogEntry Constructor
	   *
	   * @param {string} title the entry title
	   * @param {string | !File} resource the game log resource url or file
	   */
	  constructor (title, resource)
	  {
	    /**
	     * The playlist entry title.
	     * @type {string}
	     */
	    this.title = title;

	    /**
	     * The playlist entry resource.
	     * @type {(string | !File)}
	     */
	    this.resource = resource;

	    /**
	     * The error message for this entry (null -> no error).
	     * @type {?string}
	     */
	    this.errorMsg = null;

	    /**
	     * The game log info instance to this entry.
	     * @type {?GameLogInfo}
	     */
	    this.info = null;

	    // Try to extract the game log info from the resource name
	    if (resource instanceof File) {
	      this.info = GameLogInfo.fromFileName(resource.name);
	    } else {
	      this.info = GameLogInfo.fromURL(resource);
	    }
	  }
	}


	/**
	 * The Playlist class definition.
	 *
	 * The Playlist is the central class representing the player logic, canvas handling, etc.
	 *
	 * @author Stefan Glaser
	 */
	class Playlist extends EventDispatcher
	{
	  /**
	   * Playlist Constructor
	   *
	   * ::implements {IPublisher}
	   * ::implements {IEventDispatcher}
	   * @param {string} title the title of the playlist
	   */
	  constructor (title)
	  {
	    super();

	    /**
	     * The playlist title.
	     * @type {string}
	     */
	    this.title = title;

	    /**
	     * The playlist entries.
	     * @type {!Array<!GameLogEntry>}
	     */
	    this.entries = [];

	    /**
	     * The index of the active playlist entry.
	     * @type {number}
	     */
	    this.activeIndex = -1;

	    /**
	     * Indicator if this list is in autoplay mode.
	     * @type {boolean}
	     */
	    this.autoplay = false;
	  }

	  /**
	   * Set the autoplay property of this playlist.
	   *
	   * @param {boolean=} autoplay true or undefined to enable autoplay, false to disable
	   * @return {void}
	   */
	  setAutoplay (autoplay)
	  {
	    const newValue = autoplay === undefined ? true : autoplay;

	    if (this.autoplay !== newValue) {
	      this.autoplay = newValue;

	      // Publish autoplay change event
	      this.dispatchEvent({
	        type: PlaylistEvents.AUTOPLAY_CHANGE
	      });
	    }
	  }

	  /**
	   * Retrieve the active entry.
	   *
	   * @return {?GameLogEntry} the active entry, or null if currently no entry is active
	   */
	  getActiveEntry ()
	  {
	    return this.activeIndex < 0 ? null : this.entries[this.activeIndex];
	  }

	  /**
	   * Add a new entry to this playlist.
	   *
	   * @param {string} title the title of the new entry
	   * @param {(string | !File)} resource the game log resource url or file
	   * @return {boolean} true, if a new entry was created, false otherwise
	   */
	  addEntry (title, resource)
	  {
	    // Check if entry for the given resource already exists
	    for (let i = 0; i < this.entries.length; i++) {
	      if (this.entries[i].resource === resource) {
	        return false;
	      }
	    }

	    // TODO: Think about enforcing a hard upper limit of allowed entries, as we do not have any influence on the loaded playlist definition

	    // Add new resource entry
	    this.entries.push(new GameLogEntry(title, resource));


	    // Publish change event
	    this.dispatchEvent({
	      type: PlaylistEvents.CHANGE,
	      index: this.entries.length - 1
	    });

	    return true;
	  }

	  /**
	   * Add the given list of game log files as entries to this playlist.
	   *
	   * @param {!Array<!File>} files a list of files to add
	   */
	  addFiles (files)
	  {
	    for (let i = 0; i < files.length; i++) {
	      this.addEntry(files[i].name, files[i]);
	    }
	  }

	  /**
	   * Mark the entry at the given index as invalid.
	   * Invalid entries can occur during processing of the entry resource.
	   *
	   * @param {string} msg the error message
	   */
	  markAsInvalid (msg)
	  {
	    if (this.activeIndex < 0) {
	      return;
	    }

	    const entry = this.entries[this.activeIndex];

	    if (entry !== undefined && entry.errorMsg === null) {
	      entry.errorMsg = msg;

	      // Publish update event
	      this.dispatchEvent({
	        type: PlaylistEvents.UPDATE,
	        entry: entry,
	        index: this.activeIndex
	      });
	    }
	  }



	  // ============================== PLAYLIST CONTROL FUNCTIONS ==============================
	  /**
	   * Try to select the next element in the playlist.
	   *
	   * @param {number} idx the index to select
	   * @param {boolean=} ascending the direction to proceed if the specified index is invalid
	   * @return {void}
	   */
	  setActiveIndex (idx, ascending)
	  {
	    // Check is the new index is actually new and within the range of the entries list
	    if (this.activeIndex === idx || idx < 0 || idx >= this.entries.length) {
	      return;
	    }

	    // Set default direction if not specified
	    if (ascending === undefined) {
	      ascending = true;
	    }

	    // Check if entry is valid
	    if (this.entries[idx].errorMsg === null) {
	      this.activeIndex = idx;

	      // Publish active change event
	      this.dispatchEvent({
	        type: PlaylistEvents.ACTIVE_CHANGE
	      });
	    } else {
	      // Try forward to the previous/next entry...
	      this.setActiveIndex(idx + (ascending ? 1 : -1));
	    }
	  }

	  /**
	   * Try to select the next element in the playlist.
	   *
	   * @return {void}
	   */
	  nextEntry ()
	  {
	    this.setActiveIndex(this.activeIndex + 1, true);
	  }

	  /**
	   * Try to select the previous element in the playlist.
	   *
	   * @return {void}
	   */
	  previousEntry ()
	  {
	    this.setActiveIndex(this.activeIndex - 1, false);
	  }



	  // ============================== STATIC PARSING FUNCTION ==============================
	  /**
	   * Create a new playlist based on a playlist JSON string.
	   *
	   * @param {string} jsonString the source json string
	   * @return {?Playlist} the new playlist
	   */
	  static fromJSONString (jsonString)
	  {
	    let list = null;

	    try {
	      const source = JSON.parse(jsonString);

	      if (source['type'] === 'playlist') {
	        list = new Playlist(source['title'] !== undefined ? source['title'] : 'My Playlist');
	        const logs = source['gamelogs'];

	        for (let i = 0; i < logs.length; i++) {
	          if (logs[i]['title'] && logs[i]['url']) {
	            list.addEntry(logs[i]['title'], logs[i]['url']);
	          } else {
	            console.log('Invalid playlist entry format.');
	          }
	        }
	      } else {
	        console.log('Invalid playlist format.');
	      }
	    } catch (ex) {
	      console.log('ERROR: Parsing playlist json failed!');
	    }

	    return list;
	  }
	}

	/**
	 * @enum {string}
	 */
	const PlaylistLoaderEvents = {
	  START: 'start',
	  PROGRESS: 'progress',
	  FINISHED: 'finished',
	  ERROR: 'error'
	};

	/**
	 * The PlaylistLoader class definition.
	 *
	 * The PlaylistLoader provides
	 *
	 * @author Stefan Glaser / http://chaosscripting.net
	 */
	class PlaylistLoader extends EventDispatcher
	{
	  /**
	   * [PlaylistLoader description]
	   *
	   * ::implements {IPublisher}
	   * ::implements {IEventDispatcher}
	   */
	  constructor ()
	  {
	    super();

	    /**
	     * The XMLHttpRequest object used to load remote playlists.
	     * @type {?XMLHttpRequest}
	     */
	    this.xhr = null;

	    /**
	     * The FileReader object used to load the local playlist files.
	     * @type {?FileReader}
	     */
	    this.fileReader = null;



	    /** @type {!Function} */
	    this.xhrOnLoadListener = this.xhrOnLoad.bind(this);
	    /** @type {!Function} */
	    this.xhrOnProgressListener = this.xhrOnProgress.bind(this);
	    /** @type {!Function} */
	    this.xhrOnErrorListener = this.xhrOnError.bind(this);

	    /** @type {!Function} */
	    this.fileReaderOnLoadEndListener = this.fileReaderOnLoadEnd.bind(this);
	  }

	  /**
	   * Load a game log from the specified url.
	   *
	   * @param  {string} url the URL to the game log file
	   * @return {void}
	   */
	  load (url)
	  {
	    // Clear loader instance
	    this.clear();

	    // Publish start event
	    this.dispatchEvent({
	      type: PlaylistLoaderEvents.START,
	      url: url
	    });

	    // Create Request
	    this.xhr = new XMLHttpRequest();
	    this.xhr.open('GET', url, true);

	    // Add event listeners
	    this.xhr.addEventListener('load', this.xhrOnLoadListener, false);
	    this.xhr.addEventListener('progress', this.xhrOnProgressListener, false);
	    this.xhr.addEventListener('error', this.xhrOnErrorListener, false);

	    // Set mime type
	    if (this.xhr.overrideMimeType) {
	      this.xhr.overrideMimeType('text/plain');
	    }

	    // Send request
	    this.xhr.send(null);
	  }

	  /**
	   * Load a game log file from the local file system.
	   *
	   * @param  {!File} file the file to load
	   * @return {void}
	   */
	  loadFile (file)
	  {
	    // Clear loader instance
	    this.clear();

	    if (this.fileReader === null) {
	      this.fileReader = new FileReader();
	      this.fileReader.addEventListener('loadend', this.fileReaderOnLoadEndListener, false);
	    }

	    // Publish start event
	    this.dispatchEvent({
	      type: PlaylistLoaderEvents.START,
	      url: file.name
	    });

	    // Read file
	    // this.fileReader.readAsBinaryString(file);
	    this.fileReader.readAsText(file);
	  }

	  /**
	   * Clear the loader instance.
	   *
	   * @return {void}
	   */
	  clear ()
	  {
	    if (this.xhr !== null) {
	      // Remove event listeners
	      this.xhr.removeEventListener('load', this.xhrOnLoadListener);
	      this.xhr.removeEventListener('progress', this.xhrOnProgressListener);
	      this.xhr.removeEventListener('error', this.xhrOnErrorListener);

	      // Abort active request
	      this.xhr.abort();
	      this.xhr = null;
	    }
	  }

	  /**
	   * The XHR onLoad callback.
	   *
	   * @param  {!Event} event the xhr event
	   * @return {void}
	   */
	  xhrOnLoad (event)
	  {
	    if (event.target.status === 200 || event.target.status === 0) {

	      // Parse response
	      this.createPlaylist(event.target.response);
	    } else {
	      // Error during loading
	      this.dispatchEvent({
	          type: PlaylistLoaderEvents.ERROR,
	          msg: this.getXHRErrorMessage()
	        });
	    }
	  }

	  /**
	   * The FileReader onLoadEnd callback.
	   *
	   * @param  {!Event} event the FileReader event
	   * @return {void}
	   */
	  fileReaderOnLoadEnd (event)
	  {
	    if (event.target.readyState == FileReader.DONE) { // DONE == 2
	      // Parse file content
	      this.createPlaylist(event.target.result);
	    } else {
	      // Clear loader instance
	      this.clear();

	      // Error during loading
	      this.dispatchEvent({
	          type: PlaylistLoaderEvents.ERROR,
	          msg: 'ERROR: Loading file failed!'
	        });
	    }
	  }

	  /**
	   * The XHR onProgress callback.
	   *
	   * @param  {!Event} event the xhr event
	   * @return {void}
	   */
	  xhrOnProgress (event)
	  {
	    // Dispatch progress event
	    this.dispatchEvent({
	        type: PlaylistLoaderEvents.PROGRESS,
	        total: event.total,
	        loaded: event.loaded
	      });
	  }

	  /**
	   * The XHR onError callback.
	   *
	   * @param  {!Event} event the xhr event
	   * @return {void}
	   */
	  xhrOnError (event)
	  {
	    // Dispatch errer event
	    this.dispatchEvent({
	        type: PlaylistLoaderEvents.ERROR,
	        msg: this.getXHRErrorMessage()
	      });
	  }

	  /**
	   * Create a playlist instance from the given data.
	   *
	   * @param  {string} data the current data
	   * @return {void}
	   */
	  createPlaylist (data)
	  {
	    const playlist = Playlist.fromJSONString(data);

	    // Clear loader instance
	    this.clear();

	    if (playlist !== null) {
	      this.dispatchEvent({
	          type: PlaylistLoaderEvents.FINISHED,
	          list: playlist
	        });
	    } else {
	      this.dispatchEvent({
	          type: PlaylistLoaderEvents.ERROR,
	          msg: 'ERROR while parsing Playlist data!'
	        });
	    }
	  }

	  /**
	   * Retrieve the error message of the active XHR object, or create some default message if there is no error message available.
	   *
	   * @return {string} the error/status message
	   */
	  getXHRErrorMessage ()
	  {
	    let message = 'No active XMLHttpRequest to check for an error!';

	    if (this.xhr !== null) {
	      message = this.xhr.statusText;

	      if (!message || message === '') {
	        message = 'Unknown reason!';
	      }
	    }

	    // Clear loader instance
	    this.clear();

	    return message;
	  }
	}

	/**
	 * Simple Three.js scene helpers.
	 * 
	 * @author Stefan Glaser
	 */
	class SceneUtil
	{
	  /**
	   * Create a geometry representing the field lines.
	   *
	   * @param  {number} lineWidth the field line width
	   * @param  {!THREE.Vector2} fieldDimensions the dimensions of the field
	   * @param  {number} centerRadius the radius of the center circle
	   * @param  {!THREE.Vector2} goalAreaDimensions the dimensions of the goal area
	   * @param  {?THREE.Vector3} penaltyAreaDimensions the dimensions of the penalty area + penalty kick spot
	   * @return {!THREE.BufferGeometry}
	   */
	  static createFieldLinesGeometry (lineWidth,
	                                   fieldDimensions,
	                                   centerRadius,
	                                   goalAreaDimensions,
	                                   penaltyAreaDimensions)
	  {
	    const halfLength = fieldDimensions.x / 2;
	    const halfWidth = fieldDimensions.y / 2;
	    const halfLineWidth = lineWidth / 2;
	    const halfGoalAreaWidth = goalAreaDimensions.y / 2;
	    let tempX = 0;
	    const mat = new THREE.Matrix4();

	    /**
	     * Helper function for simple merging of geometries.
	     *
	     * @param {number} x the x position value
	     * @param {number} y the y position value
	     * @param {number=} rotZ the z rotation (if not zero)
	     */
	     const mergeAt = function (x, y, rotZ) {
	      // Set matrix rotation
	      if (rotZ) {
	        mat.makeRotationZ(rotZ);
	      } else {
	        mat.identity();
	      }

	      // Set matrix position
	      mat.elements[12] = x;
	      mat.elements[13] = y;

	      // Merge geometry
	      totalGeometry.merge(tempGeometry, mat);
	    };


	    // ---------- Center circle geometry
	    let radius = centerRadius;
	    const totalGeometry = new THREE.RingGeometry(radius - halfLineWidth, radius + halfLineWidth, 64, 1);


	    // ---------- Vertical field line geometry
	    let tempGeometry = new THREE.PlaneGeometry(lineWidth, fieldDimensions.y);

	    // Left/Right border line
	    mergeAt(-halfLength, 0);
	    mergeAt(halfLength, 0);

	    // Center line
	    mergeAt(0, 0);


	    // ---------- Horizontal field line geometry
	    tempGeometry = new THREE.PlaneGeometry(fieldDimensions.x + lineWidth, lineWidth);

	    // Top/Bottom border line
	    mergeAt(0, -halfWidth);
	    mergeAt(0, halfWidth);


	    // ---------- Corner circle geometry
	    radius = fieldDimensions.x / 105.0;
	    tempGeometry = new THREE.RingGeometry(radius - halfLineWidth, radius + halfLineWidth, 8, 1, 0, Math.PI / 2);

	    // Top left corner circle
	    mergeAt(-halfLength, -halfWidth);

	    // Top right corner circle
	    mergeAt(halfLength, -halfWidth, Math.PI / 2);

	    // Bottom right corner circle
	    mergeAt(halfLength, halfWidth, Math.PI);

	    // Bottom left corner circle
	    mergeAt(-halfLength, halfWidth, -Math.PI / 2);


	    // ---------- Center spot geometry
	    tempGeometry = new THREE.CircleGeometry(lineWidth * 1.2, 16);
	    mergeAt(0, 0);


	    // Penalty area
	    if (penaltyAreaDimensions !== null) {
	      const halfPenaltyWidth = penaltyAreaDimensions.y / 2;
	      tempX = halfLength - penaltyAreaDimensions.z;

	      // Left/Right penalty kick spot
	      mergeAt(-tempX, 0);
	      mergeAt(tempX, 0);


	      // ---------- Vertical penalty area line geometry
	      tempGeometry = new THREE.PlaneGeometry(lineWidth, penaltyAreaDimensions.y + lineWidth);
	      tempX = halfLength - penaltyAreaDimensions.x;

	      // Left/Right penalty area front line
	      mergeAt(-tempX, 0);
	      mergeAt(tempX, 0);


	      // ---------- Horizontal penalty area line geometry
	      tempGeometry = new THREE.PlaneGeometry(penaltyAreaDimensions.x, lineWidth);
	      tempX = halfLength - penaltyAreaDimensions.x / 2;

	      // Left/Right penalty area top line
	      mergeAt(-tempX, -halfPenaltyWidth);
	      mergeAt(tempX, -halfPenaltyWidth);

	      // Left/Right penalty area bottom line
	      mergeAt(-tempX, halfPenaltyWidth);
	      mergeAt(tempX, halfPenaltyWidth);


	      // ---------- Penalty area arcs geometry
	      const diffAngle = Math.acos((penaltyAreaDimensions.x - penaltyAreaDimensions.z) / centerRadius);
	      tempGeometry = new THREE.RingGeometry(centerRadius - halfLineWidth, centerRadius + halfLineWidth, 32, 1, diffAngle, -2 * diffAngle);
	      tempX = halfLength - penaltyAreaDimensions.z;

	      // Left/Right penalty area arc
	      mergeAt(-tempX, 0);
	      mergeAt(tempX, 0, Math.PI);
	    }


	    // ---------- Vertical goal area lines geometry
	    tempGeometry = new THREE.PlaneGeometry(lineWidth, goalAreaDimensions.y + lineWidth);
	    tempX = halfLength - goalAreaDimensions.x;

	    // Left/Right goal area front line
	    mergeAt(-tempX, 0);
	    mergeAt(tempX, 0);


	    // ---------- Horizontal goal area lines geometry
	    tempGeometry = new THREE.PlaneGeometry(goalAreaDimensions.x, lineWidth);
	    tempX = halfLength - goalAreaDimensions.x / 2;

	    // Left/Right goal area top line
	    mergeAt(-tempX, -halfGoalAreaWidth);
	    mergeAt(tempX, -halfGoalAreaWidth);

	    // Left/Right goal area bottom line
	    mergeAt(-tempX, halfGoalAreaWidth);
	    mergeAt(tempX, halfGoalAreaWidth);


	    // Create final buffer geometry from total geometry
	    const geometry = new THREE.BufferGeometry();
	    geometry.name = 'fieldLinesGeo';
	    geometry.fromGeometry(totalGeometry);

	    return geometry;
	  }

	  /**
	   * Create a geometry representing a hockey goal.
	   *
	   * @param  {number} postRadius the goal post radius
	   * @param  {!THREE.Vector3} dimensions the dimensions of the goal
	   * @return {!THREE.BufferGeometry}
	   */
	  static createHockeyGoalGeometry (postRadius, dimensions)
	  {
	    const mat = new THREE.Matrix4();

	    /**
	     * Helper function for simple merging of geometries.
	     *
	     * @param {number} x the x position value
	     * @param {number} y the y position value
	     * @param {number} z the z position value
	     * @param {number=} rot the x/y rotation (if not zero)
	     * @param {boolean=} yRot indicator if rot is about y
	     */
	     const mergeAt = function (x, y, z, rot, yRot) {
	      // Set matrix rotation
	      if (rot) {
	        if (yRot) {
	          mat.makeRotationY(rot);
	        } else {
	          mat.makeRotationX(rot);
	        }
	      } else {
	        mat.identity();
	      }

	      // Set matrix position
	      mat.elements[12] = x;
	      mat.elements[13] = y;
	      mat.elements[14] = z;

	      // Merge geometry
	      totalGeometry.merge(tempGeometry, mat);
	    };


	    const goalBarRadius = postRadius / 2;
	    const halfGoalWidth = postRadius + dimensions.y / 2;
	    const halfGoalHeight = (goalBarRadius + dimensions.z) / 2;

	    const totalGeometry = new THREE.Geometry();


	    // ---------- Goal post geometry
	    let tempGeometry = new THREE.CylinderGeometry(postRadius, postRadius, dimensions.z + goalBarRadius, 16);

	    // Left/Right goal posts
	    mergeAt(postRadius, halfGoalWidth, halfGoalHeight, -Math.PI / 2);
	    mergeAt(postRadius, -halfGoalWidth, halfGoalHeight, -Math.PI / 2);


	    // ---------- Upper goal bar geometry
	    tempGeometry = new THREE.CylinderGeometry(goalBarRadius, goalBarRadius, halfGoalWidth * 2, 8);

	    // Upper goal bar
	    mergeAt(postRadius, 0, dimensions.z);


	    // ---------- Bottom goal bar cylinder geometry
	    const angle = Math.atan(0.5 * dimensions.z / dimensions.x);
	    tempGeometry = new THREE.CylinderGeometry(goalBarRadius, goalBarRadius, halfGoalWidth * 2, 8, 1, false, -0.5 * Math.PI, angle);

	    // Bottom goal bar cylinder
	    mergeAt(dimensions.x, 0, 0);


	    // ---------- Bottom goal bar plane geometry
	    tempGeometry = new THREE.PlaneGeometry(goalBarRadius, halfGoalWidth * 2);

	    // Bottom goal bar bottom plane
	    mergeAt(dimensions.x - goalBarRadius / 2, 0, 0);

	    // Bottom goal bar upper plane
	    mergeAt(dimensions.x - Math.cos(angle) * goalBarRadius / 2, 0, Math.sin(angle) * goalBarRadius / 2, angle, true);


	    // ---------- Goal stand geometry
	    const triShape = new THREE.Shape();
	    triShape.moveTo(0, 0);
	    triShape.lineTo(dimensions.x, 0);
	    triShape.lineTo(0, dimensions.z / 2);
	    triShape.lineTo(0, 0);
	    tempGeometry = new THREE.ShapeGeometry(triShape);

	    // Left/Right goal stands
	    mergeAt(0, halfGoalWidth, 0, Math.PI / 2);
	    mergeAt(0, -halfGoalWidth, 0, Math.PI / 2);


	    // Create final buffer geometry from total geometry
	    const geometry = new THREE.BufferGeometry();
	    geometry.name = 'goalGeo';
	    geometry.fromGeometry(totalGeometry);

	    return geometry;
	  }

	  /**
	   * Create a geometry representing the side nets of a hockey goal.
	   *
	   * @return {!THREE.BufferGeometry}
	   */
	  static createHockeyGoalSideNetGeometry () {
	    const totalGeometry = new THREE.Geometry();

	    const triShape = new THREE.Shape();
	    triShape.moveTo(0, 0);
	    triShape.lineTo(1, 0);
	    triShape.lineTo(0, 1);
	    triShape.lineTo(0, 0);
	    const tempGeometry = new THREE.ShapeGeometry(triShape);

	    const mat = new THREE.Matrix4();
	    mat.makeRotationX(Math.PI / 2);
	    mat.elements[13] = 0.5;
	    totalGeometry.merge(tempGeometry, mat);
	    mat.elements[13] = -0.5;
	    totalGeometry.merge(tempGeometry, mat);


	    // Create final buffer geometry from total geometry
	    const geometry = new THREE.BufferGeometry();
	    geometry.name = 'goalNetSidesGeo';
	    geometry.fromGeometry(totalGeometry);

	    return geometry;
	  }



	  /**
	   * Create a new texture from the given path.
	   *
	   * @param  {string} path the texture path
	   * @return {!THREE.Texture} a new texture object
	   */
	  static loadTexture (path)
	  {
	    if (TextureLoader === null) {
	      TextureLoader = new THREE.TextureLoader();
	    }

	    return TextureLoader.load(TexturePath + path);
	  }

	  /**
	   * Load an object from the given path.
	   *
	   * @param  {string} path the object file path
	   * @param  {!Function} onLoad the on load callback
	   * @param  {!Function=} onProgress the on progress callback
	   * @param  {!Function=} onError the on error callback
	   * @return {void}
	   */
	  static loadObject (path, onLoad, onProgress, onError)
	  {
	    if (ObjectLoader === null) {
	      ObjectLoader = new THREE.ObjectLoader();
	    }

	    ObjectLoader.load(ModelPath + path,
	      onLoad,
	      onProgress,
	      function(xhr) {
	        console.error('Error loading object "' + path + '": ' + xhr.statusText);

	        if (onError !== undefined) {
	          onError(xhr);
	        }
	      });
	  }

	  /**
	   * Create a MeshPhongMaterial.
	   * The texture argument can be a texture path or an actual texture object.
	   * In case of a texture path, a new texture is loaded from the given path.
	   * This material has by default:
	   *   specular: 0x7f7f7f
	   *   emissive: 0x000000
	   *   shininess: 49
	   *
	   * @param {string} name the name of the material
	   * @param {number} color the material color
	   * @param {(!THREE.Texture | string)=} texture the material texture
	   * @return {!THREE.MeshPhongMaterial} the new material
	   */
	  static createStdPhongMat (name, color, texture)
	  {
	    let myTexture = null;

	    if (texture !== undefined) {
	      if (typeof texture === 'string') {
	        // Load texture file
	        myTexture = SceneUtil.loadTexture(texture);
	      } else {
	        // Directly use given texture
	        myTexture = texture;
	      }
	    }


	    return new THREE.MeshPhongMaterial({
	          name: name,
	          color: color,
	          specular: 0x7f7f7f,
	          emissive: 0x000000,
	          shininess: 49,
	          map: myTexture
	        });
	  }

	  /**
	   * Create a new number material.
	   *
	   * @param  {string} name the name of the material
	   * @param  {number} matColor the material color
	   * @param  {number} number the number to print on the texture
	   * @param  {number=} numColor the color of the number texture
	   * @return {!THREE.Material} the number material
	   */
	  static createStdNumberMat (name, matColor, number, numColor)
	  {

	    // Create number texture
	    return SceneUtil.createStdPhongMat(name, matColor);

	    // const text = '' + number;
	    // const canvas1 = document.createElement('canvas');

	    // const context1 = canvas1.getContext('2d');
	    // context1.clearRect(0, 0, 64, 64);

	    // canvas1.width = 64;
	    // canvas1.height = 64;

	    // context1.fillStyle = 'white';
	    // context1.fillRect(0, 0, 64, 64);

	    // context1.font = '44px Arial Black';
	    // context1.fillStyle = 'black';
	    // let textWidth = context1.measureText(text).width;

	    // if (number < 10) {
	    //   context1.fillText(text, 32 - textWidth / 2, 52);
	    // } else {
	    //   const firstChar = text.slice(0, 1);
	    //   const secondChar = text.slice(1, 2);
	    //   const firstWidth = textWidth - context1.measureText(secondChar).width - 2;
	    //   const secondWidth = textWidth - context1.measureText(firstChar).width - 2;
	    //   textWidth = firstWidth + secondWidth;

	    //   context1.fillText(firstChar, 30 - (textWidth / 2), 48);
	    //   context1.fillText(secondChar, 30 - (textWidth / 2) + firstWidth, 48);
	    // }



	    // // const context1 = canvas1.getContext('2d');
	    // // context1.clearRect(0, 0, 32, 32);

	    // // canvas1.width = 32;
	    // // canvas1.height = 32;

	    // // context1.fillStyle = 'white';
	    // // context1.fillRect(0, 0, 32, 32);

	    // // context1.font = '900 22px Arial';
	    // // context1.fillStyle = 'black';
	    // // const halfTextWidth = context1.measureText(text).width / 2;
	    // // context1.fillText(text, 16 - halfTextWidth, 28);


	    // const texture1 = new THREE.Texture(canvas1);
	    // texture1.needsUpdate = true;

	    // const mat = SceneUtil.createStdPhongMat(name, matColor, texture1);
	    // // mat.transparent = true;

	    // return mat;
	  }

	  /**
	   * Offset the given material to avoid z-fighting.
	   *
	   * @param  {!THREE.Material} material the material to offset
	   * @param  {number=} factor the offset factor
	   * @param  {number=} units the offset units
	   * @return {void}
	   */
	  static offsetMaterial (material, factor, units)
	  {
	    material.depthTest = true;
	    material.polygonOffset = true;
	    material.polygonOffsetFactor = factor || -1;
	    material.polygonOffsetUnits = units || -0.1;
	  }

	  /**
	   * Create a mesh with the given parameter.
	   * By default, the mesh will cast and receive shadows.
	   *
	   * @param  {string} name the name of the mesh
	   * @param  {(!THREE.Geometry | !THREE.BufferGeometry)} geometry the mesh geometry
	   * @param  {(!THREE.Material | !Array<!THREE.Material>)} material the mesh material
	   * @param  {boolean=} rotXNeg90 true if the mesh should be rotated around x about -90 degrees, false for no rotation
	   * @return {!THREE.Mesh} a new mesh with the specified properties
	   */
	  static createMesh (name, geometry, material, rotXNeg90)
	  {
	    const mesh = new THREE.Mesh(geometry, material);
	    mesh.name = name;
	    mesh.receiveShadow = true;
	    mesh.castShadow = true;

	    if (rotXNeg90) {
	      mesh.rotation.x = -Math.PI / 2;
	    }

	    return mesh;
	  }

	  /**
	   * Create a mesh with the given parameter.
	   *
	   * @param  {string} name the name of the mesh
	   * @param  {(!THREE.Geometry | !THREE.BufferGeometry)} geometry the mesh geometry
	   * @param  {(!THREE.Material | !Array<!THREE.Material>)} material the mesh material
	   * @param  {number} x the x-coordinate of the mesh
	   * @param  {number} y the y-coordinate of the mesh
	   * @param  {number} z the z-coordinate of the mesh
	   * @param  {boolean=} rotXNeg90 true if the mesh should be rotated around x about -90 degrees, false for no rotation
	   * @return {!THREE.Mesh} a new mesh with the specified properties
	   */
	  static createMeshAt (name, geometry, material, x, y, z, rotXNeg90)
	  {
	    const mesh = SceneUtil.createMesh(name, geometry, material, rotXNeg90);

	    mesh.position.set(x, y, z);

	    return mesh;
	  }

	  /**
	   * Create a simple circle for representing a selected object.
	   *
	   * @param {number} radius the circle radius
	   * @param {number} halfLineWidth the half circle line width
	   * @return {!THREE.Mesh} the selection mesh
	   */
	  static createSelectionMesh (radius, halfLineWidth)
	  {
	    const mesh = new THREE.Mesh(new THREE.RingBufferGeometry(radius - halfLineWidth, radius + halfLineWidth, 16, 1), SelectionMaterial);
	    mesh.name = 'selectionCircle';
	    mesh.visible = false;
	    mesh.receiveShadow = false;
	    mesh.castShadow = false;
	    mesh.rotation.x = -Math.PI / 2;

	    return mesh;
	  }

	  /**
	   * Create a dummy mesh used as placehoder for loading/failing body parts.
	   * @return {!THREE.Mesh} a dummy mesh
	   */
	  static createDummyMesh ()
	  {
	    const mesh = new THREE.Mesh(DummyGeometry, DummyMaterial);
	    mesh.name = 'placeholder';
	    mesh.receiveShadow = false;
	    mesh.castShadow = false;

	    return mesh;
	  }

	  /**
	   * Create a sky box material.
	   *
	   * @return {!Array<!THREE.Material>} the sky box material
	   */
	  static createSkyBoxMaterial ()
	  {
	    const texPosx = SceneUtil.loadTexture('sky_posx.jpg');
	    const texNegx = SceneUtil.loadTexture('sky_negy.jpg');
	    const texPosy = SceneUtil.loadTexture('sky_posy.jpg');
	    const texNegy = SceneUtil.loadTexture('sky_negz.jpg');
	    const texPosz = SceneUtil.loadTexture('sky_posz.jpg');
	    const texNegz = SceneUtil.loadTexture('sky_negx.jpg');

	    return [
	            new THREE.MeshBasicMaterial({ map: texPosx, side: THREE.BackSide }),
	            new THREE.MeshBasicMaterial({ map: texNegx, side: THREE.BackSide }),
	            new THREE.MeshBasicMaterial({ map: texPosy, side: THREE.BackSide }),
	            new THREE.MeshBasicMaterial({ map: texNegy, side: THREE.BackSide }),
	            new THREE.MeshBasicMaterial({ map: texPosz, side: THREE.BackSide }),
	            new THREE.MeshBasicMaterial({ map: texNegz, side: THREE.BackSide }),
	       ];
	  }

	  /**
	   * Create a sky box of the given size.
	   *
	   * @param  {number} size the size of the box
	   * @return {!THREE.Mesh} the sky box mesh
	   */
	  static createSkyBox (size)
	  {
	    const boxMaterial = SceneUtil.createSkyBoxMaterial();
	    const boxGeometry = new THREE.BoxBufferGeometry(size, size, size);

	    const mesh = new THREE.Mesh(boxGeometry, boxMaterial);
	    mesh.name = 'skyBox';

	    return mesh;
	  }

	  /**
	   * Create a simple, white, spherical ball mesh.
	   *
	   * @param  {number} radius the ball radius
	   * @return {!THREE.Mesh} the ball mesh
	   */
	  static createSimpleBall (radius)
	  {
	    const geometry = new THREE.SphereBufferGeometry(radius, 16, 16);
	    geometry.name = 'ballGeo';

	    const material = SceneUtil.createStdPhongMat('ballMat', 0xffffff);

	    return SceneUtil.createMesh('ballSphere', geometry, material);
	  }

	  /**
	   * Add a soccer field (grass) plane to the given object group.
	   *
	   * @param  {!THREE.Object3D} group the object group to add the field plane
	   * @param  {number} fieldLength the length of the field
	   * @param  {number} fieldWidth the width of the field
	   * @param  {?number} textureRepeat the number of texture repeats
	   * @return {void}
	   */
	  static addFieldPlane (group, fieldLength, fieldWidth, textureRepeat)
	  {
	    let mesh;

	    /**
	     * Helper method for adding meshes.
	     * @param {string} name
	     * @param {number} x
	     * @param {number} y
	     * @param {number} z
	     * @return {void}
	     */
	    const addMesh = function(name, x, y, z) {
	      mesh = new THREE.Mesh(geometry, material);
	      mesh.name = name;
	      mesh.position.set(x, y, z);
	      mesh.rotation.x = -Math.PI / 2;
	      mesh.receiveShadow = true;
	      mesh.castShadow = false;

	      group.add(mesh);
	    };


	    // Create field plane
	    let halfLength = Math.floor((fieldLength + 1.99) / 2);
	    let geometry = new THREE.PlaneBufferGeometry(halfLength * 2, fieldWidth);
	    let texture = SceneUtil.loadTexture('field.png');
	    texture.wrapS = THREE.RepeatWrapping;
	    texture.wrapT = THREE.RepeatWrapping;
	    if (textureRepeat !== null) {
	      texture.repeat.set(textureRepeat, fieldWidth * textureRepeat / fieldLength);
	    } else {
	      texture.repeat.set(halfLength, fieldWidth);
	    }
	    let material = new THREE.MeshPhongMaterial({name: 'fieldMat', color: 0xcccccc, map: texture});
	    addMesh('fieldPlane', 0, 0, 0);

	    // Create field border
	    halfLength = fieldLength / 2;
	    const halfWidth = fieldWidth / 2;
	    const borderSize = fieldLength / 12;
	    geometry = new THREE.PlaneBufferGeometry(fieldLength + borderSize * 2, borderSize);
	    texture = SceneUtil.loadTexture('field_border.png');
	    texture.wrapS = THREE.RepeatWrapping;
	    texture.wrapT = THREE.RepeatWrapping;
	    texture.repeat.set((fieldLength + borderSize * 2), borderSize);
	    material = new THREE.MeshPhongMaterial({name: 'tbBorderMat', color: 0xaa99aa, map: texture});
	    addMesh('topBorder', 0, 0, -halfWidth - borderSize / 2);
	    addMesh('bottomBorder', 0, 0, halfWidth + borderSize / 2);

	    texture = SceneUtil.loadTexture('field_border.png');
	    texture.wrapS = THREE.RepeatWrapping;
	    texture.wrapT = THREE.RepeatWrapping;
	    texture.repeat.set(borderSize, fieldWidth);
	    material = new THREE.MeshPhongMaterial({name: 'lrBorderMat', color: 0xaa99aa, map: texture});
	    SceneUtil.offsetMaterial(material, -0.5, -0.05);
	    geometry = new THREE.PlaneBufferGeometry(borderSize, fieldWidth);
	    addMesh('leftBorder', -halfLength - borderSize / 2, 0, 0);
	    addMesh('rightBorder', halfLength + borderSize / 2, 0, 0);
	  }

	  /**
	   * Add standard field lines to the given object group.
	   *
	   * @param  {!THREE.Object3D} group the object group to add the field plane
	   * @param  {number} lineWidth the field line width
	   * @param  {!THREE.Vector2} fieldDimensions the dimensions of the field
	   * @param  {number} centerRadius the radius of the center circle
	   * @param  {!THREE.Vector2} goalAreaDimensions the dimensions of the goal area
	   * @param  {?THREE.Vector3} penaltyAreaDimensions the dimensions of the penalty area + penalty kick spot
	   * @return {void}
	   */
	  static addFieldLines (group,
	                        lineWidth,
	                        fieldDimensions,
	                        centerRadius,
	                        goalAreaDimensions,
	                        penaltyAreaDimensions)
	  {
	    let mesh;
	    let tempX = 0;
	    const lineMaterial = new THREE.MeshBasicMaterial({ color: 0xeeeeee, side: THREE.DoubleSide });
	    SceneUtil.offsetMaterial(lineMaterial, -1, -0.1);

	    /**
	     * Helper method for adding meshes.
	     * @param {string} name
	     * @param {number} x
	     * @param {number} y
	     * @param {number} z
	     * @param {number=} rotZ
	     * @return {void}
	     */
	     const addMesh = function(name, x, y, z, rotZ) {
	      mesh = new THREE.Mesh(geometry, lineMaterial);
	      mesh.name = name;
	      mesh.position.set(x, y, z);
	      mesh.rotation.x = -Math.PI / 2;
	      mesh.rotation.z = rotZ ? rotZ : 0;
	      mesh.receiveShadow = true;
	      mesh.castShadow = false;

	      group.add(mesh);
	    };

	    const halfLength = fieldDimensions.x / 2;
	    const halfWidth = fieldDimensions.y / 2;
	    const halfLineWidth = lineWidth / 2;

	    // Circle
	    let radius = centerRadius;
	    let geometry = new THREE.RingBufferGeometry(radius - halfLineWidth, radius + halfLineWidth, 64, 1);
	    addMesh('centerCircle', 0, 0, 0);

	    // General field lines (l, r, t, b, c)
	    geometry = new THREE.PlaneBufferGeometry(fieldDimensions.x + lineWidth, lineWidth);
	    addMesh('topBorderLine', 0, 0, -halfWidth);
	    addMesh('btmBorderLine', 0, 0, halfWidth);

	    geometry = new THREE.PlaneBufferGeometry(lineWidth, fieldDimensions.y);
	    addMesh('leftBorderLine', -halfLength, 0, 0);
	    addMesh('rightBorderLine', halfLength, 0, 0);

	    addMesh('centerLine', 0, 0, 0);

	    // Corner circles
	    radius = fieldDimensions.x / 105.0;
	    geometry = new THREE.RingBufferGeometry(radius - halfLineWidth, radius + halfLineWidth, 8, 1, 0, Math.PI / 2);
	    addMesh('btmLeftCircle', -halfLength, 0, halfWidth);
	    addMesh('btmRightCircle', halfLength, 0, halfWidth, Math.PI / 2);
	    addMesh('topRightCircle', halfLength, 0, -halfWidth, Math.PI);
	    addMesh('topLeftCircle', -halfLength, 0, -halfWidth, -Math.PI / 2);

	    // Center spot
	    geometry = new THREE.CircleBufferGeometry(lineWidth * 1.2, 16);
	    addMesh('centerSpot', 0, 0, 0);

	    // Penalty area
	    if (penaltyAreaDimensions !== null) {
	      // Penalty kick spots
	      tempX = halfLength - penaltyAreaDimensions.z;
	      addMesh('leftPenaltySpot', -tempX, 0, 0);
	      addMesh('rightPenaltySpot', tempX, 0, 0);

	      // Penalty area front lines
	      const halfPenaltyWidth = penaltyAreaDimensions.y / 2;
	      tempX = halfLength - penaltyAreaDimensions.x;
	      geometry = new THREE.PlaneBufferGeometry(lineWidth, penaltyAreaDimensions.y + lineWidth);
	      addMesh('leftPAFrontLine', -tempX, 0, 0);
	      addMesh('rightPAFrontLine', tempX, 0, 0);

	      // Penalty area top and bottom lines
	      tempX = halfLength - penaltyAreaDimensions.x / 2;
	      geometry = new THREE.PlaneBufferGeometry(penaltyAreaDimensions.x, lineWidth);
	      addMesh('leftPATopLine', -tempX, 0, -halfPenaltyWidth);
	      addMesh('leftPABtmLine', -tempX, 0, halfPenaltyWidth);

	      addMesh('rightPABtmLine', tempX, 0, -halfPenaltyWidth);
	      addMesh('rightPATopLine', tempX, 0, halfPenaltyWidth);

	      // Penalty area arcs
	      tempX = halfLength - penaltyAreaDimensions.z;
	      const diffAngle = Math.acos((penaltyAreaDimensions.x - penaltyAreaDimensions.z) / centerRadius);
	      geometry = new THREE.RingBufferGeometry(centerRadius - halfLineWidth, centerRadius + halfLineWidth, 32, 1, diffAngle, -2 * diffAngle);
	      addMesh('leftPAArc', -tempX, 0, 0);
	      addMesh('rightPAArc', tempX, 0, 0, Math.PI);
	    }

	    // Goal area
	    const halfGoalAreaWidth = goalAreaDimensions.y / 2;
	    tempX = halfLength - goalAreaDimensions.x;
	    geometry = new THREE.PlaneBufferGeometry(lineWidth, goalAreaDimensions.y + lineWidth);
	    addMesh('leftGAFrontLine', -tempX, 0, 0);
	    addMesh('rightGAFrontLine', tempX, 0, 0);

	    tempX = halfLength - goalAreaDimensions.x / 2;
	    geometry = new THREE.PlaneBufferGeometry(goalAreaDimensions.x, lineWidth);
	    addMesh('leftGATopLine', -tempX, 0, -halfGoalAreaWidth);
	    addMesh('leftGABtmLine', -tempX, 0, halfGoalAreaWidth);

	    addMesh('rightGATopLine', tempX, 0, -halfGoalAreaWidth);
	    addMesh('rightGABtmLine', tempX, 0, halfGoalAreaWidth);
	  }

	  /**
	   * Create a hockey (triangular) goal. The created goal is for the right side.
	   *
	   * @param  {string} name the name of the goal object group
	   * @param  {number} postRadius the line width
	   * @param  {!THREE.Vector3} dimensions the goal dimensions
	   * @param  {number} color the goal color
	   * @return {!THREE.Object3D} the ball object
	   */
	  static createHockeyGoal (name, postRadius, dimensions, color)
	  {
	    let mesh;
	    let shadows = true;
	    const objGroup = new THREE.Object3D();
	    objGroup.name = name;

	    /**
	     * Helper method for adding meshes.
	     * @param {string} name
	     * @param {!THREE.Material} material
	     * @param {number} x
	     * @param {number} y
	     * @param {number} z
	     * @param {boolean=} keepRot
	     * @return {!THREE.Mesh}
	     */
	     const addMesh = function(name, material, x, y, z, keepRot) {
	      mesh = new THREE.Mesh(geometry, material);
	      mesh.name = name;
	      mesh.position.set(x, y, z);
	      mesh.rotation.x = keepRot ? 0 : -Math.PI / 2;
	      mesh.receiveShadow = shadows;
	      mesh.castShadow = shadows;
	      objGroup.add(mesh);

	      return mesh;
	    };


	    const goalBarRadius = postRadius / 2;
	    const halfGoalWidth = postRadius + dimensions.y / 2;
	    const halfGoalHeight = (goalBarRadius + dimensions.z) / 2;

	    const goalMat = SceneUtil.createStdPhongMat('goalMat', color);
	    goalMat.side = THREE.DoubleSide;

	    const goalOffsetMat = goalMat.clone();
	    SceneUtil.offsetMaterial(goalOffsetMat, -1, -0.1);


	    // Goal posts
	    let geometry = new THREE.CylinderBufferGeometry(postRadius, postRadius, dimensions.z + goalBarRadius, 16);
	    addMesh('leftPost', goalOffsetMat, postRadius, halfGoalHeight, halfGoalWidth, true);
	    addMesh('rightPost', goalOffsetMat, postRadius, halfGoalHeight, -halfGoalWidth, true);


	    // Upper goal bar
	    geometry = new THREE.CylinderBufferGeometry(goalBarRadius, goalBarRadius, halfGoalWidth * 2, 8);
	    addMesh('upperBar', goalMat, postRadius, dimensions.z, 0);


	    // Goal bottom bar
	    const angle = Math.atan(0.5 * dimensions.z / dimensions.x);
	    const tempGeometry = new THREE.CylinderGeometry(goalBarRadius, goalBarRadius, halfGoalWidth * 2, 8, 1, false, -0.5 * Math.PI, angle);
	    const mat = new THREE.Matrix4();
	    mat.identity();
	    mat.elements[12] = -goalBarRadius / 2;
	    tempGeometry.merge(new THREE.PlaneGeometry(goalBarRadius, halfGoalWidth * 2), mat);
	    mat.makeRotationY(angle);
	    mat.elements[12] = -Math.cos(angle) * goalBarRadius / 2;
	    mat.elements[14] = Math.sin(angle) * goalBarRadius / 2;
	    tempGeometry.merge(new THREE.PlaneGeometry(goalBarRadius, halfGoalWidth * 2), mat);

	    geometry = new THREE.BufferGeometry();
	    geometry.fromGeometry(tempGeometry);
	    addMesh('bottomBar', goalOffsetMat, dimensions.x, 0, 0);


	    // Goal stand
	    let triShape = new THREE.Shape();
	    triShape.moveTo(0, 0);
	    triShape.lineTo(dimensions.x, 0);
	    triShape.lineTo(0, dimensions.z / 2);
	    triShape.lineTo(0, 0);
	    geometry = new THREE.BufferGeometry();
	    geometry.fromGeometry(new THREE.ShapeGeometry(triShape));
	    addMesh('leftStand', goalMat, 0, 0, halfGoalWidth, true);
	    addMesh('rightStand', goalMat, 0, 0, -halfGoalWidth, true);


	    // Goal net
	    shadows = false;
	    const netWidth = dimensions.y + postRadius * 2 - 0.02;
	    const netDepth = dimensions.x - postRadius - 0.01;
	    const netHeight = Math.sqrt(netDepth * netDepth + dimensions.z * dimensions.z);

	    const netSideTexture = SceneUtil.loadTexture('goalnet.png');
	    netSideTexture.wrapS = THREE.RepeatWrapping;
	    netSideTexture.wrapT = THREE.RepeatWrapping;
	    netSideTexture.repeat.set(netDepth, dimensions.z);
	    const goalNetMatSides = SceneUtil.createStdPhongMat('netSideMat', 0xffffff, netSideTexture);
	    goalNetMatSides.side = THREE.DoubleSide;
	    goalNetMatSides.transparent = true;

	    const netBackTexture = SceneUtil.loadTexture('goalnet.png');
	    netBackTexture.wrapS = THREE.RepeatWrapping;
	    netBackTexture.wrapT = THREE.RepeatWrapping;
	    netBackTexture.repeat.set(netWidth, netHeight);
	    const goalNetMatBack = SceneUtil.createStdPhongMat('netBackMat', 0xffffff, netBackTexture);
	    goalNetMatBack.side = THREE.DoubleSide;
	    goalNetMatBack.transparent = true;

	    triShape = new THREE.Shape();
	    triShape.moveTo(0, 0);
	    triShape.lineTo(netDepth, 0);
	    triShape.lineTo(0, dimensions.z);
	    triShape.lineTo(0, 0);
	    geometry = new THREE.BufferGeometry();
	    geometry.fromGeometry(new THREE.ShapeGeometry(triShape));
	    addMesh('leftNet', goalNetMatSides, postRadius, 0, netWidth / 2, true);
	    addMesh('rightNet', goalNetMatSides, postRadius, 0, -netWidth / 2, true);

	    geometry = new THREE.PlaneBufferGeometry(netWidth, netHeight);
	    addMesh('backNet', goalNetMatBack, postRadius + netDepth / 2, dimensions.z / 2, 0, true);
	    mesh.rotation.order = 'ZYX';
	    mesh.rotation.y = -Math.PI / 2;
	    mesh.rotation.x = (Math.PI / 2) - Math.atan(dimensions.z / netDepth);

	    return objGroup;
	  }

	  /**
	   * Create a hockey (triangular) goal. The created goal is for the right side.
	   *
	   * @param  {!THREE.Object3D} scene the scene/group to add lighting
	   * @param  {number} fieldLength the length of the field
	   * @param  {number} fieldWidth the width of the field
	   * @return {void}
	   */
	  static addStdLighting (scene, fieldLength, fieldWidth)
	  {
	    // Ambient lighting
	    scene.add(new THREE.AmbientLight(0xeeeeee));


	    // sun lighting
	    const vertical = Math.ceil(fieldWidth * 0.8);
	    const horizontal = Math.ceil(fieldLength * 0.7);
	    const depth = fieldWidth;

	    const directionalLight = new THREE.DirectionalLight(0xeeeeee, 0.4);
	    directionalLight.position.set(300, 300, 500);
	    directionalLight.castShadow = true;
	    directionalLight.shadow.mapSize.width = 2048;
	    directionalLight.shadow.mapSize.height = 2048;

	    directionalLight.shadow.camera.left = -horizontal;
	    directionalLight.shadow.camera.right = horizontal;
	    directionalLight.shadow.camera.top = vertical;
	    directionalLight.shadow.camera.bottom = -vertical;
	    directionalLight.shadow.camera.near = 655 - depth;
	    directionalLight.shadow.camera.far = 655 + depth;

	    scene.add(directionalLight);
	  }
	}


	/**
	 * The threejs texture loader.
	 * @type {?THREE.TextureLoader}
	 */
	let TextureLoader = null;

	/**
	 * The texture path.
	 * @const {string}
	 */
	const TexturePath = 'textures/';


	/**
	 * The threejs object loader.
	 * @type {?THREE.ObjectLoader}
	 */
	let ObjectLoader = null;

	/**
	 * The object/model path.
	 * @const {string}
	 */
	const ModelPath = 'models/';


	/**
	 * The selection material.
	 * @type {!THREE.MeshPhongMaterial}
	 */
	const SelectionMaterial = new THREE.MeshPhongMaterial({name: 'selectionMat', color: 0xeeeeee, side: THREE.DoubleSide});
	SceneUtil.offsetMaterial(SelectionMaterial, -1.5, -0.15);

	/**
	 * The Dummy geometry.
	 * @type {!THREE.BoxBufferGeometry}
	 */
	const DummyGeometry = new THREE.BoxBufferGeometry(0.1, 0.1, 0.1);

	/**
	 * The dummy material.
	 * @type {!THREE.MeshPhongMaterial}
	 */
	const DummyMaterial = new THREE.MeshPhongMaterial({name: 'dummyMat', color: 0x000000});

	/**
	 * The MovableObject class definition.
	 *
	 * The MovableObject provides
	 *
	 * @author Stefan Glaser / http://chaosscripting.net
	 */
	class MovableObject
	{
	  /**
	   * MovableObject Constructor
	   *
	   * @param {string} name the name of the movable object
	   */
	  constructor (name)
	  {
	    /**
	     * The movable object group.
	     * @type {!THREE.Object3D}
	     */
	    this.objGroup = new THREE.Object3D();
	    this.objGroup.name = name;

	    /**
	     * The movable ground 2D object group.
	     * @type {!THREE.Object3D}
	     */
	    this.objTwoDGroup = new THREE.Object3D();
	    this.objTwoDGroup.name = name + '_2D';

	    /**
	     * The object representing that this object is selected.
	     * @type {!THREE.Mesh}
	     */
	    this.selectionObj = SceneUtil.createSelectionMesh(0.15, 0.02);
	    this.objTwoDGroup.add(this.selectionObj);
	  }

	  /**
	   * Highlight or normalize object representation.
	   *
	   * @param {boolean} selected true for selected, false for deseleced
	   */
	  setSelected (selected)
	  {
	    this.selectionObj.visible = selected;
	  }

	  /**
	   * [updateBodyPose description]
	   *
	   * @param  {!ObjectState} state the current object state
	   * @param  {!ObjectState=} nextState the next object state
	   * @param  {number=} t the interpolated time between the current and next state
	   * @return {void}
	   */
	  updateBodyPose (state, nextState = undefined, t = 0)
	  {
	    // Update position and orientation of this root object group
	    if (nextState !== undefined && nextState.isValid() && t > 0) {
	      if (t >= 1) {
	        this.objGroup.position.set(nextState.x, nextState.y, nextState.z);
	        this.objGroup.quaternion.set(nextState.qx, nextState.qy, nextState.qz, nextState.qw);
	      } else {
	        this.objGroup.position.lerpVectors(state.position, nextState.position, t);
	        THREE.Quaternion.slerp(state.orientation, nextState.orientation, this.objGroup.quaternion, t);
	      }
	    } else {
	      this.objGroup.position.set(state.x, state.y, state.z);
	      this.objGroup.quaternion.set(state.qx, state.qy, state.qz, state.qw);
	    }

	    // Copy 2D position and orientation to 2D object group
	    this.objTwoDGroup.position.x = this.objGroup.position.x;
	    this.objTwoDGroup.position.z = this.objGroup.position.z;
	    // DOTO: extract heading angle

	    // Trigger update of object matrices
	    this.objGroup.updateMatrix();
	    this.objTwoDGroup.updateMatrix();
	  }
	}

	/**
	 * The Ball class definition.
	 *
	 * @author Stefan Glaser
	 */
	class Ball extends MovableObject
	{
	  /**
	   * Ball Constructor
	   *
	   * @param {number=} radius the ball radius
	   */
	  constructor (radius)
	  {
	    super('ball');

	    /**
	     * The radius of the ball.
	     * @type {number}
	     */
	    this.radius = radius !== undefined ? radius : 0.2;

	    this.objGroup.scale.setScalar(this.radius);
	  }

	  /**
	   * Set the ball radius.
	   *
	   * @param  {number} radius the new ball radius
	   * @return {void}
	   */
	  setRadius (radius)
	  {
	    if (this.radius !== radius) {
	      this.radius = radius;
	      this.objGroup.scale.setScalar(this.radius);
	    }
	  }

	  /**
	   * Update movable object
	   *
	   * @param  {!ObjectState} state the current object state
	   * @param  {!ObjectState=} nextState the next object state
	   * @param  {number=} t the interpolated time between the current and next state
	   * @return {void}
	   */
	  update (state, nextState, t)
	  {
	    this.updateBodyPose(state, nextState, t);
	  }
	}

	/**
	 * The Field class definition.
	 *
	 * @author Stefan Glaser
	 */
	class Field
	{
	  /**
	   * Field Constructor
	   *
	   * @param {!THREE.Vector2=} fieldDimensions the dimensions of the soccer pitch
	   * @param {number=} centerRadius the center circle raduis
	   * @param {!THREE.Vector3=} goalDimensions the dimensions of the goals
	   * @param {!THREE.Vector2=} goalAreaDimensions the dimensions of the goal areas
	   * @param {?THREE.Vector3=} penaltyAreaDimensions the dimensions of the penalty area + penalty kick spot
	   */
	  constructor (fieldDimensions, centerRadius, goalDimensions, goalAreaDimensions, penaltyAreaDimensions)
	  {
	    /**
	     * The field object group
	     * @type {!THREE.Object3D}
	     */
	    this.objGroup = new THREE.Object3D();
	    this.objGroup.name = 'field';

	    /**
	     * The dimensions of the field
	     * @type {!THREE.Vector2}
	     */
	    this.fieldDimensions = fieldDimensions !== undefined ? fieldDimensions : new THREE.Vector2(105, 68);

	    /**
	     * The radius of the center circle
	     * @type {number}
	     */
	    this.centerRadius = centerRadius !== undefined ? centerRadius : 9.15;

	    /**
	     * The dimensions of the goals
	     * @type {!THREE.Vector3}
	     */
	    this.goalDimensions = goalDimensions !== undefined ? goalDimensions : new THREE.Vector3(1.2, 14.64, 1.5);

	    /**
	     * The dimensions of the goal area
	     * @type {!THREE.Vector2}
	     */
	    this.goalAreaDimensions = goalAreaDimensions !== undefined ? goalAreaDimensions : new THREE.Vector2(5.5, 18.32);

	    /**
	     * The dimensions of the penalty area + penalty kick spot
	     * @type {?THREE.Vector3}
	     */
	    this.penaltyAreaDimensions = penaltyAreaDimensions !== undefined ? penaltyAreaDimensions : new THREE.Vector3(16.5, 40.3, 11);

	    /**
	     * The field texture repeat.
	     * @type {?number}
	     */
	    this.textureRepeat = 10;

	    /**
	     * The width of the field lines.
	     * @type {number}
	     */
	    this.lineWidth = 0.15;
	  }

	  /**
	   * Set the field properties based on the given environement parameter map.
	   *
	   * @param {!GameType} type the game type (2D or 3D)
	   * @param {!ParameterMap} environmentParams the environment parameter map
	   */
	  set (type, environmentParams)
	  {
	    if (type === GameType.TWOD) {
	      this.fieldDimensions = new THREE.Vector2(105, 68);
	      this.centerRadius = 9.15;
	      this.goalDimensions = new THREE.Vector3(1.2, 14.64, 1.5);
	      this.goalAreaDimensions = new THREE.Vector2(5.5, 18.32);
	      this.penaltyAreaDimensions = new THREE.Vector3(16.5, 40.3, 11);
	      this.lineWidth = 0.15;
	    } else {
	      // Read field dimensions
	      const fieldLength = environmentParams.getNumber(Environment3DParams.FIELD_LENGTH);
	      const fieldWidth = environmentParams.getNumber(Environment3DParams.FIELD_WIDTH);
	      // const fieldHeight = environmentParams.getNumber(Environment3DParams.FIELD_HEIGHT);
	      if (fieldLength !== null && fieldWidth !== null) {
	        this.fieldDimensions.set(fieldLength, fieldWidth);
	      } else {
	        this.fieldDimensions.set(30, 20);
	      }

	      // Read free kick distance (used for center circle radius)
	      const freeKickDistance = environmentParams.getNumber(Environment3DParams.FREE_KICK_DISTANCE);
	      if (freeKickDistance !== null) {
	        this.centerRadius = freeKickDistance;
	      } else {
	        this.centerRadius = 2;
	      }

	      // Read goal dimensions
	      const goalWidth = environmentParams.getNumber(Environment3DParams.GOAL_WIDTH);
	      const goalDepth = environmentParams.getNumber(Environment3DParams.GOAL_DEPTH);
	      const goalHeight = environmentParams.getNumber(Environment3DParams.GOAL_HEIGHT);
	      if (goalDepth !== null && goalWidth !== null && goalHeight !== null) {
	        this.goalDimensions.set(goalDepth, goalWidth, goalHeight);
	      } else {
	        this.goalDimensions.set(0.6, 2.1, 0.8);
	      }

	      // Clear penalty area and set goal area and line width based on field size
	      this.penaltyAreaDimensions = null;

	      if (this.fieldDimensions.x < 15) {
	        this.goalAreaDimensions.set(1.2, 4);
	        this.lineWidth = 0.03;
	      } else {
	        this.goalAreaDimensions.set(1.8, 6);
	        this.lineWidth = 0.04;
	      }
	    }

	    this.textureRepeat = this.fieldDimensions.x > 50 ? 10 : null;
	  }

	  /**
	   * Check if this world parameters define a penalty area.
	   *
	   * @return {boolean} true, if there exists a definition for the penalty area, false otherwise
	   */
	  hasPenaltyArea ()
	  {
	    return this.penaltyAreaDimensions !== null;
	  }
	}

	/**
	 * The RobotModel class definition.
	 *
	 * @author Stefan Glaser
	 */
	class RobotModel
	{
	  /**
	   * RobotModel Constructor
	   *
	   * @param {string} name the name of the agent model
	   */
	  constructor (name)
	  {
	    /**
	     * The name of the robot model
	     * @type {string}
	     */
	    this.name = name;

	    /**
	     * The robot object group
	     * @type {!THREE.Object3D}
	     */
	    this.objGroup = new THREE.Object3D();
	    this.objGroup.name = name;
	    this.objGroup.visible = false;

	    /**
	     * A list of Object3D objects representing the joints
	     * @type {!Array<!THREE.Object3D>}
	     */
	    this.jointGroups = [];

	    /**
	     * The list of team materials of this robot model
	     * @type {!Array<!THREE.Material>}
	     */
	    this.teamMatList = [];
	  }

	  /**
	   * Check if this robot model is valid
	   * @return {boolean} true if the robot model is valid, false otherwise
	   */
	  isValid ()
	  {
	    return this.objGroup.children.length > 0;
	  }

	  /**
	   * Set visibility of this robot models' objects.
	   * @param {boolean} active true for visible, false for invisible
	   * @return {void}
	   */
	  setActive (active)
	  {
	    if (this.objGroup.visible !== active) {
	      this.objGroup.visible = active;
	    }
	  }

	  /**
	   * Check visibility of this robot models' objects.
	   * @return {boolean} true for visible, false otherwise
	   */
	  isActive ()
	  {
	    return this.objGroup.visible;
	  }

	  /**
	   * Update the joint objects and object settings according to the given angles and agent data.
	   *
	   * @param  {!Array<number> | !Float32Array} angles the angles of the current state
	   * @param  {!Array<number> | !Float32Array} data the agent data of the current state
	   * @param  {!Array<number> | !Float32Array=} nextAngles the angles of the next state
	   * @param  {!Array<number> | !Float32Array=} nextData the agent data of the next state
	   * @param  {number=} t the interpolation time
	   * @return {void}
	   */
	  update (angles, data, nextAngles = undefined, nextData = undefined, t = 0)
	  {
	    let jointData = angles;
	    let i;

	    // Check if we need to interpolate
	    if (nextAngles !== undefined && t > 0) {
	      if (t >= 1) {
	        jointData = nextAngles;
	      } else {
	        // Interpolate state variables
	        jointData = [];
	        i = Math.min(angles.length, nextAngles.length);

	        while (i--) {
	          jointData[i] = t * (nextAngles[i] - angles[i]) + angles[i];
	        }
	      }
	    }

	    // Apply joint angles to model
	    i = Math.min(jointData.length, this.jointGroups.length);

	    while (i--) {
	      // Calculate quaternion from axis and angle
	      this.jointGroups[i].setRotationFromAxisAngle(this.jointGroups[i].jointAxis, jointData[i]);
	      this.jointGroups[i].updateMatrix();
	    }

	    // Call model data update
	    this.updateData(data, nextData, t);
	  }

	  /**
	   * Update agent specific settings based on agent data.
	   *
	   * @param  {!Array<number> | !Float32Array} data the agent data of the current state
	   * @param  {!Array<number> | !Float32Array | undefined} nextData the agent data of the next state
	   * @param  {number=} t the interpolation time
	   * @return {void}
	   */
	  updateData (data, nextData, t)
	  {
	    // Does intentionally nothing...
	  }

	  /**
	   * Set the team color of this robot model
	   *
	   * @param {!THREE.Color} color the new team color
	   */
	  setTeamColor (color)
	  {
	    let i = this.teamMatList.length;

	    while (i--) {
	      const mat = this.teamMatList[i];
	      mat.color.copy(color);
	      mat.needsUpdate = true;
	    }
	  }
	}

	/**
	 * The Agent class definition.
	 *
	 * @author Stefan Glaser
	 */
	class Agent extends MovableObject
	{
	  /**
	   * Agent Constructor
	   *
	   * @param {!AgentDescription} description the agent description
	   */
	  constructor (description)
	  {
	    super('agent_' + description.getSideLetter() + description.playerNo);

	    /**
	     * The agent description.
	     * @type {!AgentDescription}
	     */
	    this.description = description;

	    /**
	     * The list of robot models
	     * @type {!Array<!RobotModel>}
	     */
	    this.models = [];
	  }

	  /**
	   * Update this agent's state.
	   *
	   * @param  {!AgentState=} state the current state
	   * @param  {!AgentState=} nextState the next state
	   * @param  {number=} t the interpolation step
	   * @return {void}
	   */
	  update (state, nextState, t)
	  {
	    if (state === undefined || state.isValid() === false) {
	      // Invalid data, thus kill agent
	      this.objGroup.visible = false;
	      return;
	    } else if (this.objGroup.visible === false) {
	      // Valid data, thus revive agent
	      this.objGroup.visible = true;
	    }

	    // Update position and rotation of agent root object group
	    this.updateBodyPose(state, nextState, t);

	    // Activate agent model to current state
	    this.setActiveModel(state.modelIndex);

	    if (this.models[state.modelIndex] !== undefined) {
	      const nextAngles = nextState !== undefined ? nextState.jointAngles : undefined;
	      const nextData = nextState !== undefined ? nextState.data : undefined;

	      this.models[state.modelIndex].update(state.jointAngles, state.data, nextAngles, nextData, t);
	    }
	  }

	  /**
	   * Set the active robot model to the current state
	   * @param {number} modelIdx the index of the model
	   */
	  setActiveModel (modelIdx)
	  {
	    if (this.models[modelIdx] !== undefined && !this.models[modelIdx].isActive()) {
	      let i = this.models.length;

	      while (i--) {
	        this.models[i].setActive(i === modelIdx);
	      }
	    }
	  }

	  /**
	   * Set agent team color
	   *
	   * @param {!THREE.Color} color the new team color
	   */
	  setTeamColor (color)
	  {
	    let i = this.models.length;

	    while (i--) {
	      this.models[i].setTeamColor(color);
	    }
	  }
	}

	/**
	 * The Team class definition.
	 *
	 * @author Stefan Glaser
	 */
	class Team
	{
	  /**
	   * Team Constructor
	   *
	   * @param {!TeamDescription} description
	   * @param {!Array<!Agent>=} agents
	   */
	  constructor (description, agents = undefined)
	  {
	    /**
	     * The team description
	     * @type {!TeamDescription}
	     */
	    this.description = description;

	    /**
	     * The team object group.
	     * @type {!THREE.Object3D}
	     */
	    this.objGroup = new THREE.Object3D();
	    this.objGroup.name = description.side === TeamSide.LEFT ? 'leftTeam' : 'rightTeam';

	    /**
	     * The (dynamic) team color.
	     * @type {!THREE.Color}
	     */
	    this.color = description.color;

	    /**
	     * The agents belonging to this team
	     * @type {!Array<!Agent>}
	     */
	    this.agents = agents !== undefined ? agents : [];

	    // Add all initial agents
	    let i = this.agents.length;
	    while (i--) {
	      this.objGroup.add(this.agents[i].objGroup);
	    }
	  }

	  /**
	   * Set this team's description.
	   *
	   * @param {!TeamDescription} description
	   * @return {void}
	   */
	  set (description)
	  {
	    this.description = description;
	    this.color = description.color;
	    this.agents = [];

	    // Remove all child objects from team group
	    let child = this.objGroup.children[0];
	    while (child) {
	      this.objGroup.remove(child);

	      child = this.objGroup.children[0];
	    }
	  }

	  /**
	   * Update all agent objects of this team.
	   *
	   * @param  {!Array<!AgentState | undefined>} states the current Agent states
	   * @param  {!Array<!AgentState | undefined>} nextStates the next Agent states
	   * @param  {number} t the interpolation time
	   * @return {void}
	   */
	  update (states, nextStates, t)
	  {
	    let i = this.agents.length;

	    while (i--) {
	      const no = this.agents[i].description.playerNo;

	      this.agents[i].update(states[no], nextStates[no], t);
	    }
	  }

	  /**
	   * (Re)Set team color of all agents in this team.
	   *
	   * @param {!THREE.Color=} color the new team color (if undefined, the default team color from the description is used)
	   */
	  setColor (color)
	  {
	    const newColor = color === undefined ? this.description.color : color;

	    if (!this.color.equals(newColor)) {
	      this.color = newColor;

	      let i = this.agents.length;

	      while (i--) {
	        this.agents[i].setTeamColor(this.color);
	      }
	    }
	  }
	}

	/**
	 * RobotModelFactory Interface.
	 */
	class RobotModelFactory
	{
	  constructor () {}

	  /**
	   * Create a robot model to the given player type.
	   *
	   * @param  {!ParameterMap} playerType the player type
	   * @param  {!TeamSide} side the team side
	   * @param  {number} playerNo the player number
	   * @param  {!ParameterMap} environmentParams the environment paraméter
	   * @param  {!ParameterMap} playerParams the player paraméter
	   * @return {?RobotModel} a new robot model
	   */
	  createModel (playerType, side, playerNo, environmentParams, playerParams) {}


	  /**
	   * Dispose all resources allocated within this factory.
	   *
	   * @return {void}
	   */
	  dispose () {}
	}

	/**
	 * Geometry factory interface.
	 * 
	 * @author Stefan Glaser
	 */
	class GeometryFactory
	{
	  /**
	   * Create the geometry with the given name.
	   *
	   * @param  {string} name the unique name of the geometry
	   * @param  {!Function} onLoad the callback function to call on successfull creation
	   * @param  {!Function=} onError the callback function to call when creating the geometry failed
	   * @return {void}
	   */
	  createGeometry (name, onLoad, onError) {}
	}

	/**
	 * Material factory interface.
	 * 
	 * @author Stefan Glaser
	 */
	class MaterialFactory
	{
		/**
		 * Create the material with the given name.
		 *
		 * @param  {string} name the unique name of the material
		 * @return {(!THREE.Material | !Array<!THREE.Material>)} the requested (multi-)material
		 *                             or a default material if the requested material definition was not found
		 */
		createMaterial (name) {}
	}

	/** 
	 * 
	 * @author Stefan Glaser
	 */
	class MeshFactory
	{
	  /**
	   * MeshFactory Constructor
	   *
	   * @param {!GeometryFactory} geometryFactory the geometry factory to use
	   * @param {!MaterialFactory} materialFactory the material factory to use
	   */
	  constructor (geometryFactory, materialFactory)
	  {
	    /**
	     * The geometry factory.
	     * @type {!GeometryFactory}
	     */
	    this.geometryFactory = geometryFactory;

	    /**
	     * The material factory.
	     * @type {!MaterialFactory}
	     */
	    this.materialFactory = materialFactory;

	    /**
	     * Geometry cache.
	     * @type {!Object}
	     */
	    this.geometryCache = {};

	    /**
	     * Material cache.
	     * @type {!Object}
	     */
	    this.materialCache = {};

	    /**
	     * Let created meshes cast shadow.
	     * @type {boolean}
	     */
	    this.castShadow = true;

	    /**
	     * Let created meshes receive shadow.
	     * @type {boolean}
	     */
	    this.receiveShadow = true;
	  }

	  /**
	   * Clear the internal cache.
	   *
	   * @return {void}
	   */
	  clearCache ()
	  {
	    this.geometryCache = {};
	    this.materialCache = {};
	  }

	  /**
	   * Create a mesh with the given name.
	   * This method will call the GeometryFactory for a geometry with the given mesh name appended with 'Geo'.
	   * If such a geometry exists, it creates a new mesh with the requested geometry and material.
	   *
	   * @param  {string} name the unique name of the geometry
	   * @param  {string} materialName the unique name of the the material to use
	   * @param  {!THREE.Matrix4} matrix the mesh matrix
	   * @param  {!Function} onLoad the callback function to call on successfull creation
	   * @param  {!Function=} onError the callback function to call when creating the mesh failed
	   * @return {void}
	   */
	  createMesh (name, materialName, matrix, onLoad, onError)
	  {
	    const geometryName = name + 'Geo';

	    // Fetch material
	    const material = this.fetchMaterial(materialName);

	    // Check if geometry is already cached
	    if (this.geometryCache[geometryName] !== undefined) {
	      // Directly create the requested mesh object with cached geometry
	      const mesh = new THREE.Mesh(this.geometryCache[geometryName], material);
	      mesh.name = name;
	      mesh.castShadow = this.castShadow;
	      mesh.receiveShadow = this.receiveShadow;
	      mesh.applyMatrix(matrix);

	      onLoad(mesh);
	    } else {
	      const scope = this;

	      // Try to create the requested geometry
	      this.geometryFactory.createGeometry(geometryName,
	        function(newGeometry) { // onLoad
	          scope.geometryCache[geometryName] = newGeometry;

	          // Create the mesh object
	          const mesh = new THREE.Mesh(newGeometry, material);
	          mesh.name = name;
	          mesh.castShadow = scope.castShadow;
	          mesh.receiveShadow = scope.receiveShadow;
	          mesh.applyMatrix(matrix);

	          onLoad(mesh);
	        },
	        onError);
	    }
	  }

	  /**
	   * Fetch the material with the given name.
	   *
	   * @return {!THREE.Mesh} the dummy mesh
	   */
	  createDummyMesh ()
	  {
	    return SceneUtil.createDummyMesh();
	  }

	  /**
	   * Fetch the material with the given name.
	   *
	   * @param  {string} name the unique name of the material
	   * @return {(!THREE.Material | !Array<!THREE.Material>)} the requested material
	   */
	  fetchMaterial (name)
	  {
	    // Try fetching material from cache
	    let material = this.materialCache[name];

	    if (material === undefined) {
	      // Create the requested material if not yet present
	      material = this.materialFactory.createMaterial(name);
	      this.materialCache[name] = material;
	    }

	    return material;
	  }
	}

	/**
	 *
	 * @author Stefan Glaser
	 */
	class MeshSpecification
	{
	  /**
	   * MeshSpecification Constructor
	   *
	   * @param {string} name the name of the mesh
	   * @param {string} material the name of the material
	   * @param {!THREE.Matrix4=} matrix the mesh transformation matrix
	   */
	  constructor (name, material, matrix)
	  {
	    /**
	     * The name of the mesh.
	     * @type {string}
	     */
	    this.name = name;

	    /**
	     * The name of the material.
	     * @type {string}
	     */
	    this.material = material;

	    /**
	     * The name of the material.
	     * @type {!THREE.Matrix4}
	     */
	    this.matrix = matrix !== undefined ? matrix : new THREE.Matrix4();
	  }
	}


	/**
	 *
	 * @author Stefan Glaser
	 */
	class BodyPartSpecification
	{
	  /**
	   * BodyPartSpecification Constructor
	   *
	   * @param {string} name the name of the body part
	   * @param {!Array<!MeshSpecification>} meshes the list of mesh specifications representing this body part
	   * @param {!THREE.Vector3} translation the translation from the parent body part to this body part
	   * @param {!THREE.Vector3} jointAxis the rotation axis of the joint attached to this body part
	   * @param {!Array<!BodyPartSpecification>} children the child body parts
	   */
	  constructor (name, meshes, translation, jointAxis, children)
	  {
	    /**
	     * The name of the body part.
	     * @type {string}
	     */
	    this.name = name;

	    /**
	     * The Array of mesh specifications representing this body part.
	     * @type {!Array<!MeshSpecification>}
	     */
	    this.meshes = meshes;

	    /**
	     * The translation from the parent body part to this body part.
	     * @type {!THREE.Vector3}
	     */
	    this.translation = translation;

	    /**
	     * The Array of body part object names.
	     * @type {!THREE.Vector3}
	     */
	    this.jointAxis = jointAxis;

	    /**
	     * The Array of child body parts.
	     * @type {!Array<!BodyPartSpecification>}
	     */
	    this.children = children;
	  }
	}


	/**
	 *
	 * @author Stefan Glaser
	 */
	class RobotSpecification
	{
	  /**
	   * RobotSpecification Constructor
	   *
	   * @param {string} name the name of the root body part
	   * @param {!Array<string>=} teamMaterialNames the names of the team materials
	   * @param {!Array<!MeshSpecification>=} meshes the list of mesh specifications representing this body part
	   * @param {!Array<!BodyPartSpecification>=} children the child body parts
	   */
	  constructor (name, teamMaterialNames, meshes, children)
	  {
	    /**
	     * The name of the root body part.
	     * @type {string}
	     */
	    this.name = name;

	    /**
	     * The names of the team materials.
	     * @type {!Array<string>}
	     */
	    this.teamMaterialNames = teamMaterialNames !== undefined ? teamMaterialNames : [];

	    /**
	     * The Array of mesh specifications representing the root body part.
	     * @type {!Array<!MeshSpecification>}
	     */
	    this.meshes = meshes !== undefined ? meshes : [];

	    /**
	     * The Array of child body parts.
	     * @type {!Array<!BodyPartSpecification>}
	     */
	    this.children = children !== undefined ? children : [];
	  }
	}

	/**
	 * The DynamicRobotModel class definition.
	 *
	 * @author Stefan Glaser
	 */
	class DynamicRobotModel extends RobotModel
	{
	  /**
	   * DynamicRobotModel Constructor
	   *
	   * @param {string} name the name of the agent model
	   * @param {!RobotSpecification} specification the dynamic model specification
	   * @param {!MeshFactory} meshFactory the mesh factory
	   */
	  constructor (name, specification, meshFactory)
	  {
	    super(name);

	    // Create model gl representation based on model specification
	    this.createModel(specification, meshFactory);
	  }

	  /**
	   * Create a robot model to the given name.
	   *
	   * @param {!RobotSpecification} spec the robot specification
	   * @param {!MeshFactory} meshFactory the mesh factory
	   * @return {void}
	   */
	  createModel (spec, meshFactory)
	  {
	    let i = 0;

	    // Create root body
	    const rootBody = new THREE.Object3D();
	    rootBody.name = spec.name;
	    this.objGroup.add(rootBody);

	    if (spec.meshes.length > 0) {
	      // Create placeholder
	      const placeholder = meshFactory.createDummyMesh();
	      rootBody.add(placeholder);

	      const onLoaded = function() {
	        const body = rootBody;
	        const ph = placeholder;

	        return function(mesh) {
	          body.remove(ph);
	          body.add(mesh);
	        };
	      }();

	      // Create meshes
	      i = spec.meshes.length;
	      while (i--) {
	        meshFactory.createMesh(spec.meshes[i].name, spec.meshes[i].material, spec.meshes[i].matrix, onLoaded);
	      }
	    }

	    // Create child body parts
	    for (i = 0; i < spec.children.length; ++i) {
	      rootBody.add(this.createBodyParts(spec.children[i], meshFactory));
	    }

	    // Extract team materials
	    i = spec.teamMaterialNames.length;
	    while (i--) {
	      const mat = meshFactory.materialCache[spec.teamMaterialNames[i]];
	      if (mat !== undefined) {
	        this.teamMatList.push(mat);
	      }
	    }
	  }

	  /**
	   * Create a body part hierarchy according to the given specification.
	   *
	   * @param {!BodyPartSpecification} specification the body part specification
	   * @param {!MeshFactory} meshFactory the mesh factory
	   * @return {!THREE.Object3D} an object representing this body part
	   */
	  createBodyParts (specification, meshFactory)
	  {
	    let i = 0;
	    const bodyGroup = new THREE.Object3D();
	    bodyGroup.name = specification.name;
	    this.jointGroups.push(bodyGroup);

	    // Set body part data
	    bodyGroup.position.copy(specification.translation);
	    bodyGroup.jointAxis = specification.jointAxis;

	    if (specification.meshes.length > 0) {
	      // Create placeholder
	      const placeholder = SceneUtil.createDummyMesh();
	      bodyGroup.add(placeholder);

	      const onLoaded = function() {
	        const body = bodyGroup;
	        const ph = placeholder;

	        return function(mesh) {
	          body.remove(ph);
	          body.add(mesh);
	        };
	      }();

	      // Create meshes
	      i = specification.meshes.length;
	      while (i--) {
	        meshFactory.createMesh(specification.meshes[i].name, specification.meshes[i].material, specification.meshes[i].matrix, onLoaded);
	      }
	    }

	    // Create child body parts
	    for (i = 0; i < specification.children.length; ++i) {
	      bodyGroup.add(this.createBodyParts(specification.children[i], meshFactory));
	    }

	    return bodyGroup;
	  }
	}

	class JSONGeometryFactoryRequest
	{
	  /**
	   * Helper class for storing geometry requests while the resource file is still loading.
	   *
	   * @param {string} name the name of the requested geometry
	   * @param {!Function} onLoad the onLoad callback
	   * @param {!Function=} onError the onError callback
	   */
	  constructor (name, onLoad, onError)
	  {
	    /**
	     * The name of the requested geometry.
	     * @type {string}
	     */
	    this.name = name;

	    /**
	     * The onLoad callback.
	     * @type {!Function}
	     */
	    this.onLoad = onLoad;

	    /**
	     * The onError callback.
	     * @type {(!Function | undefined)}
	     */
	    this.onError = onError;
	  }
	}



	class JSONGeometryFactory extends GeometryFactory
	{
	  /**
	   * @param {string} resourceFile the json resource file containing a geometry array
	   */
	  constructor (resourceFile)
	  {
	    super();
	    
	    /**
	     * The json resource file.
	     * @type {string}
	     */
	    this.resourceFile = resourceFile;

	    /**
	     * The list of loaded geometries.
	     * @type {!Array<!THREE.BufferGeometry>}
	     */
	    this.geometries = [];

	    /**
	     * An array holding the create requests while the factory is still loading.
	     * @type {!Array<!JSONGeometryFactoryRequest>}
	     */
	    this.requestCache = [];

	    /**
	     * Flag for indicating if the factory is currently loading the resource file.
	     * @type {boolean}
	     */
	    this.loading = false;

	    /**
	     * Flag for indicating if the factory resource file was loaded.
	     * @type {boolean}
	     */
	    this.loaded = false;
	  }

	  /**
	   * Load the json resource file.
	   *
	   * @return {void}
	   */
	  loadJSON ()
	  {
	    if (this.loaded || this.loading) {
	      return;
	    }

	    this.loading = true;

	    const scope = this;
	    const fileLoader = new THREE.FileLoader();

	    fileLoader.load(this.resourceFile,
	      function(json) {
	        const objectLoader = new THREE.ObjectLoader();
	        const loadedGeometries = objectLoader.parseGeometries(JSON.parse(json));

	        for (const key in loadedGeometries) {
	          const geometry = loadedGeometries[key];

	          if (geometry.isGeometry !== undefined && geometry.isGeometry === true) {
	            const bufferGeo = new THREE.BufferGeometry();
	            bufferGeo.fromGeometry(/** @type {!THREE.Geometry} */ (geometry));
	            bufferGeo.name = geometry.name;
	            scope.geometries.push(bufferGeo);

	            // Dispose source geometry after copy
	            geometry.dispose();
	          } else if (geometry.isBufferGeometry !== undefined && geometry.isBufferGeometry === true) {
	            scope.geometries.push(/** @type {!THREE.BufferGeometry} */ (geometry));
	          }
	        }

	        // Set flags
	        scope.loaded = true;
	        scope.loading = false;

	        // Serve cached geometry requests
	        scope.serveCachedRequests();
	      },
	      undefined,
	      function(xhr) {
	        // Set flags
	        scope.loaded = true;
	        scope.loading = false;

	        // Notify cached geometry requests about failure
	        scope.serveCachedRequests();

	        console.error('Failed to load GeometryFactory resource file: "' + scope.resourceFile + '"!');
	      });
	  }

	  /**
	   * Serve all cached requests.
	   *
	   * @return {void}
	   */
	  serveCachedRequests ()
	  {
	    let i = this.requestCache.length;
	    let request;
	    while (i--) {
	      request = this.requestCache[i];
	      this.createGeometry(request.name, request.onLoad, request.onError);
	    }

	    // Clear cached requests
	    this.requestCache.length = 0;
	  }

	  /**
	   * Create the geometry with the given name.
	   *
	   * @override
	   * @param  {string} name the unique name of the geometry
	   * @param  {!Function} onLoad the callback function to call on successfull creation
	   * @param  {!Function=} onError the callback function to call when creating the geometry failed
	   * @return {void}
	   */
	  createGeometry (name, onLoad, onError)
	  {
	    // Check if the resource file was loaded before
	    if (this.loaded) {
	      // The resource file is already loaded, so directly call onLoad/onError
	      let i = this.geometries.length;
	      while (i--) {
	        if (this.geometries[i].name === name) {
	          onLoad(this.geometries[i]);
	          return;
	        }
	      }

	      // Log error
	      console.log('Geometry "' + name + '" not found!');

	      // The requested geometry is not part of the resource file, report error
	      if (onError) {
	        onError('Geometry "' + name + '" not found!');
	      }
	    } else {
	      // The resource file is not loaded yet, so check if we need to trigger loading it
	      if (!this.loading) {
	        this.loadJSON();
	      }

	      // While the resource file is loading, we need to remember the request and serve it later
	      this.requestCache.push(new JSONGeometryFactoryRequest(name, onLoad, onError));
	    }
	  }
	}

	/**
	 * The NaoSpecification interface definition.
	 *
	 * The NaoSpecification describes the API of an agent bundle.
	 *
	 * @author Stefan Glaser
	 */
	class NaoSpecification extends RobotSpecification
	{
	  /**
	   * NaoSpecification Constructor
	   * 
	   * @param {!TeamSide} side the team side
	   * @param {number} type the nao hetero model type
	   * @param {number} playerNo the player number
	   */
	  constructor(side, type, playerNo)
	  {
	    super('torso');

	    const matNum = 'num' + playerNo;
	    const matWhite = NaoMaterialNames.NAO_WHITE;
	    const matBlack = NaoMaterialNames.NAO_BLACK;
	    const matGrey = NaoMaterialNames.NAO_GREY;
	    const matTeam = side === TeamSide.LEFT ? NaoMaterialNames.NAO_TEAM_LEFT : NaoMaterialNames.NAO_TEAM_RIGHT;
	    this.teamMaterialNames.push(matTeam);

	    const m4Torso = ThreeJsUtil.mM4(0, 0, 0.1, 0, 0, 0.1, 0, 0, -0.1, 0, 0, 0);
	    const m4lUpperArm = ThreeJsUtil.mM4(0, 0.07, 0, 0.02, 0, 0, 0.07, 0, 0.07, 0, 0, -0.01);
	    const m4rUpperArm = ThreeJsUtil.mM4(0, 0.07, 0, 0.02, 0, 0, 0.07, 0, 0.07, 0, 0, 0.01);
	    const m4LowerArm = ThreeJsUtil.mM4(0, 0.05, 0, 0.05, 0, 0, 0.05, 0, 0.05, 0, 0, 0);
	    const m4Thigh = ThreeJsUtil.mM4(0, 0.07, 0, 0.01, 0, 0, 0.07, -0.04, 0.07, 0, 0, 0);
	    const m4Shank = ThreeJsUtil.mM4(0, 0.08, 0, -0.005, 0, 0, 0.08, -0.055, 0.08, 0, 0, 0);
	    const m4Foot = ThreeJsUtil.mM4(0, 0.08, 0, 0.03, 0, 0, 0.08, -0.04, 0.08, 0, 0, 0);

	    // torso meshes
	    this.meshes.push(new MeshSpecification('nao_torso_coreBody', matWhite, m4Torso));
	    this.meshes.push(new MeshSpecification('nao_torso_coreInner', matBlack, m4Torso));
	    this.meshes.push(new MeshSpecification('nao_torso_chestButton', matTeam, m4Torso));
	    this.meshes.push(new MeshSpecification('nao_torso_chestBow', matTeam, m4Torso));
	    this.meshes.push(new MeshSpecification('nao_torso_numberBatch', matNum, m4Torso));
	    this.meshes.push(new MeshSpecification('nao_torso_lCollar', matWhite, ThreeJsUtil.mM4(0, 0, -0.1, 0, 0, 0.1, 0, 0, 0.1, 0, 0, 0)));
	    this.meshes.push(new MeshSpecification('nao_torso_rCollar', matWhite, m4Torso));

	    // Head
	    this.children.push(
	        new BodyPartSpecification('neck',
	          [], // neck meshes
	          new THREE.Vector3(0, 0.09, 0),
	          ThreeJsUtil.Vector3_UnitY(),
	          [ // neck children
	            new BodyPartSpecification('head',
	              [ // head meshes
	                new MeshSpecification('nao_head_core', matWhite, m4Torso),
	                new MeshSpecification('nao_head_ears', matGrey, m4Torso),
	                new MeshSpecification('nao_head_teamMarker', matTeam, m4Torso),
	                new MeshSpecification('nao_head_camera', matBlack, m4Torso)
	              ],
	              new THREE.Vector3(0, 0.06, 0),
	              ThreeJsUtil.Vector3_UnitZ(),
	              []) // No further children here
	          ]));

	    // Right arm
	    this.children.push(
	        new BodyPartSpecification('rShoulder',
	          [], // rShoulder meshes
	          new THREE.Vector3(0, 0.075, 0.098),
	          ThreeJsUtil.Vector3_UnitZ(),
	          [ // rShoulder children
	            new BodyPartSpecification('rUpperArm',
	              [ // rUpperArm meshes
	                new MeshSpecification('nao_rUpperArm_cylinder', matBlack, m4rUpperArm),
	                new MeshSpecification('nao_rUpperArm_protector', matWhite, m4rUpperArm),
	                new MeshSpecification('nao_rUpperArm_teamMarker', matTeam, m4rUpperArm)
	              ],
	              ThreeJsUtil.Vector3_Zero(),
	              ThreeJsUtil.Vector3_UnitY(),
	              [ // rUpperArm children
	                new BodyPartSpecification('rElbow',
	                  [], // rElbow meshes
	                  new THREE.Vector3(0.09, 0.009, 0),
	                  ThreeJsUtil.Vector3_UnitX(),
	                  [ // rElbow children
	                    new BodyPartSpecification('rLowerArm',
	                      [ // rLowerArm meshes
	                        new MeshSpecification('nao_rLowerArm_core', matWhite, m4LowerArm),
	                        new MeshSpecification('nao_rLowerArm_teamMarker', matTeam, m4LowerArm)
	                      ],
	                      ThreeJsUtil.Vector3_Zero(),
	                      ThreeJsUtil.Vector3_UnitY(),
	                      []) // No further children here
	                  ])
	              ])
	          ]));

	    // Left arm
	    this.children.push(
	        new BodyPartSpecification('lShoulder',
	          [], // lShoulder meshes
	          new THREE.Vector3(0, 0.075, -0.098),
	          ThreeJsUtil.Vector3_UnitZ(),
	          [ // lShoulder children
	            new BodyPartSpecification('lUpperArm',
	              [ // lUpperArm meshes
	                new MeshSpecification('nao_lUpperArm_cylinder', matBlack, m4lUpperArm),
	                new MeshSpecification('nao_lUpperArm_protector', matWhite, m4lUpperArm),
	                new MeshSpecification('nao_lUpperArm_teamMarker', matTeam, m4lUpperArm)
	              ],
	              ThreeJsUtil.Vector3_Zero(),
	              ThreeJsUtil.Vector3_UnitY(),
	              [ // lUpperArm children
	                new BodyPartSpecification('lElbow',
	                  [], // lElbow meshes
	                  new THREE.Vector3(0.09, 0.009, 0),
	                  ThreeJsUtil.Vector3_UnitX(),
	                  [ // lElbow children
	                    new BodyPartSpecification('lLowerArm',
	                      [ // lLowerArm meshes
	                        new MeshSpecification('nao_lLowerArm_core', matWhite, m4LowerArm),
	                        new MeshSpecification('nao_lLowerArm_teamMarker', matTeam, m4LowerArm)
	                      ],
	                      ThreeJsUtil.Vector3_Zero(),
	                      ThreeJsUtil.Vector3_UnitY(),
	                      []) // No further children here
	                  ])
	              ])
	          ]));

	    // Right leg
	    this.children.push(
	        new BodyPartSpecification('rHip1',
	          [], // rHip1 meshes
	          new THREE.Vector3(-0.01, -0.115, 0.055),
	          new THREE.Vector3(0, 0.7071, -0.7071),
	          [ // rHip1 children
	            new BodyPartSpecification('rHip2',
	              [], // rHip2 meshes
	              ThreeJsUtil.Vector3_Zero(),
	              ThreeJsUtil.Vector3_UnitX(),
	              [ // rHip2 children
	                new BodyPartSpecification('rThigh',
	                  [ // rThigh meshes
	                    new MeshSpecification('nao_rThigh_core', matWhite, m4Thigh),
	                    new MeshSpecification('nao_rThigh_teamMarker', matTeam, m4Thigh),
	                    new MeshSpecification('nao_rThigh_noMarker', matNum, m4Thigh)
	                  ],
	                  ThreeJsUtil.Vector3_Zero(),
	                  ThreeJsUtil.Vector3_UnitZ(),
	                  [ // rThigh children
	                    new BodyPartSpecification('rShank',
	                      [ // rShank meshes
	                        new MeshSpecification('nao_rShank_coreInner', matBlack, m4Shank),
	                        new MeshSpecification('nao_rShank_coreBody', matWhite, m4Shank),
	                        new MeshSpecification('nao_rShank_teamMarker', matTeam, m4Shank)
	                      ],
	                      new THREE.Vector3(0.005, -0.12, 0),
	                      ThreeJsUtil.Vector3_UnitZ(),
	                      [ // rShank children
	                        new BodyPartSpecification('rAnkle',
	                          [], // rAnkle meshes
	                          new THREE.Vector3(0, -0.1, 0),
	                          ThreeJsUtil.Vector3_UnitZ(),
	                          [ // rAnkle children
	                            new BodyPartSpecification('rFoot',
	                              [ // rFoot meshes
	                                new MeshSpecification('nao_rFoot_core', matWhite, m4Foot),
	                                new MeshSpecification('nao_rFoot_teamMarker', matTeam, m4Foot)
	                              ],
	                              ThreeJsUtil.Vector3_Zero(),
	                              ThreeJsUtil.Vector3_UnitX(),
	                              []) // No further children here
	                          ])
	                      ])
	                  ])
	              ])
	          ]));

	    // Left leg
	    this.children.push(
	        new BodyPartSpecification('lHip1',
	          [], // lHip1 meshes
	          new THREE.Vector3(-0.01, -0.115, -0.055),
	          new THREE.Vector3(0, -0.7071, -0.7071),
	          [ // lHip1 children
	            new BodyPartSpecification('lHip2',
	              [], // lHip2 meshes
	              ThreeJsUtil.Vector3_Zero(),
	              ThreeJsUtil.Vector3_UnitX(),
	              [ // lHip2 children
	                new BodyPartSpecification('lThigh',
	                  [ // lThigh meshes
	                    new MeshSpecification('nao_lThigh_core', matWhite, m4Thigh),
	                    new MeshSpecification('nao_lThigh_teamMarker', matTeam, m4Thigh)
	                  ],
	                  ThreeJsUtil.Vector3_Zero(),
	                  ThreeJsUtil.Vector3_UnitZ(),
	                  [ // lThigh children
	                    new BodyPartSpecification('lShank',
	                      [ // lShank meshes
	                        new MeshSpecification('nao_lShank_coreInner', matBlack, m4Shank),
	                        new MeshSpecification('nao_lShank_coreBody', matWhite, m4Shank),
	                        new MeshSpecification('nao_lShank_teamMarker', matTeam, m4Shank)
	                      ],
	                      new THREE.Vector3(0.005, -0.12, 0),
	                      ThreeJsUtil.Vector3_UnitZ(),
	                      [ // lShank children
	                        new BodyPartSpecification('lAnkle',
	                          [], // lAnkle meshes
	                          new THREE.Vector3(0, -0.1, 0),
	                          ThreeJsUtil.Vector3_UnitZ(),
	                          [ // lAnkle children
	                            new BodyPartSpecification('lFoot',
	                              [ // lFoot meshes
	                                new MeshSpecification('nao_lFoot_core', matWhite, m4Foot),
	                                new MeshSpecification('nao_lFoot_teamMarker', matTeam, m4Foot)
	                              ],
	                              ThreeJsUtil.Vector3_Zero(),
	                              ThreeJsUtil.Vector3_UnitX(),
	                              []) // No further children here
	                          ])
	                      ])
	                  ])
	              ])
	          ]));

	    /**
	     * The nao hetero model type.
	     * @type {number}
	     */
	    this.type = type !== undefined ? type : 0;

	    // Apply type specific modifications
	    switch (this.type) {
	      case 4:
	        this.applyType4Modifications();
	        break;
	      case 3:
	        this.applyType3Modifications();
	        break;
	      case 1:
	        this.applyType1Modifications();
	        break;
	    }
	  }

	  /**
	   * Change the default model to a type 1 model.
	   *
	   * @return {void}
	   */
	  applyType1Modifications ()
	  {
	    const rElbow = this.children[1].children[0].children[0];
	    const lElbow = this.children[2].children[0].children[0];

	    rElbow.translation.x = 0.12664;
	    lElbow.translation.x = 0.12664;

	    const rShank = this.children[3].children[0].children[0].children[0];
	    const lShank = this.children[4].children[0].children[0].children[0];

	    rShank.translation.y = -0.13832;
	    lShank.translation.y = -0.13832;

	    const rAnkle = rShank.children[0];
	    const lAnkle = lShank.children[0];

	    rAnkle.translation.y = -0.11832;
	    lAnkle.translation.y = -0.11832;
	  }

	  /**
	   * Change the default model to a type 3 model.
	   *
	   * @return {void}
	   */
	  applyType3Modifications ()
	  {
	    const rElbow = this.children[1].children[0].children[0];
	    const lElbow = this.children[2].children[0].children[0];

	    rElbow.translation.x = 0.145736848;
	    lElbow.translation.x = 0.145736848;

	    const rHip1 = this.children[3];
	    const lHip1 = this.children[4];

	    rHip1.translation.z = 0.072954143;
	    lHip1.translation.z = -0.072954143;

	    const rShank = lHip1.children[0].children[0].children[0];
	    const lShank = rHip1.children[0].children[0].children[0];

	    rShank.translation.y = -0.147868424;
	    lShank.translation.y = -0.147868424;

	    const rAnkle = rShank.children[0];
	    const lAnkle = lShank.children[0];

	    rAnkle.translation.y = -0.127868424;
	    lAnkle.translation.y = -0.127868424;
	  }

	  /**
	   * Change the default model to a type 4 model.
	   *
	   * @return {void}
	   */
	  applyType4Modifications ()
	  {
	    const rFoot = this.children[3].children[0].children[0].children[0].children[0].children[0];
	    const lFoot = this.children[4].children[0].children[0].children[0].children[0].children[0];

	    rFoot.children.push(
	      new BodyPartSpecification('rToe',
	        [ // lToe meshes
	        ],
	        new THREE.Vector3(0.06, -0.04, 0),
	        ThreeJsUtil.Vector3_UnitZ(),
	        []) // No further children here);
	      );

	    lFoot.children.push(
	      new BodyPartSpecification('lToe',
	        [ // lToe meshes
	        ],
	        new THREE.Vector3(0.06, -0.04, 0),
	        ThreeJsUtil.Vector3_UnitZ(),
	        []) // No further children here);
	      );
	  }
	}















	/**
	 * An enum providing the available materials.
	 * @enum {string}
	 */
	const NaoMaterialNames = {
	  NAO_WHITE: 'naoWhite',
	  NAO_BLACK: 'naoBlack',
	  NAO_GREY: 'naoGrey',
	  NAO_TEAM_LEFT: 'teamLeft',
	  NAO_TEAM_RIGHT: 'teamRight'
	};




	/**
	 * The material factory for the nao robot models.
	 *
	 * @author Stefan Glaser
	 */
	class NaoMaterialFactory extends MaterialFactory
	{
	  /**
	   * Create the material with the given name.
	   *
	   * @override
	   * @param  {string} name the unique name of the material
	   * @return {(!THREE.Material | !Array<!THREE.Material>)} the requested (multi-)material
	   *                             or a default material if the requested material definition was not found
	   */
	  createMaterial (name)
	  {
	    if (name.startsWith('num')) {
	      let number = 0;
	      try {
	        number = parseInt(name.slice(3), 10);
	      } catch (err) {
	      }

	      return SceneUtil.createStdNumberMat(name, 0xcccccc, number);
	    }

	    switch (name) {
	      case NaoMaterialNames.NAO_BLACK:
	        return SceneUtil.createStdPhongMat(name, 0x000000);
	      case NaoMaterialNames.NAO_GREY:
	        return SceneUtil.createStdPhongMat(name, 0x3d3d3d);
	      case NaoMaterialNames.NAO_WHITE:
	        return SceneUtil.createStdPhongMat(name, 0xcccccc);
	      default:
	        // By default create a clone of nao white materail
	        return SceneUtil.createStdPhongMat(name, 0x3d3d3d);
	    }
	  }
	}

	/**
	 *
	 * @author Stefan Glaser
	 */
	class NaoModelFactory extends RobotModelFactory
	{
	  /**
	   * NaoModelFactory Constructor
	   */
	  constructor()
	  {
	    super();

	    /**
	     * The mesh factory.
	     * @type {!MeshFactory}
	     */
	    this.meshFactory = new MeshFactory(new JSONGeometryFactory('models/nao_bundle.json'), new NaoMaterialFactory());
	  }

	  /**
	   * Create a robot model to the given player type.
	   *
	   * @override
	   * @param  {!ParameterMap} playerType the player type
	   * @param  {!TeamSide} side the team side
	   * @param  {number} playerNo the player number
	   * @param  {!ParameterMap} environmentParams the environment paraméter
	   * @param  {!ParameterMap} playerParams the player paraméter
	   * @return {?RobotModel} a new robot model
	   */
	  createModel (playerType, side, playerNo, environmentParams, playerParams)
	  {
	    const modelName = playerType.getString(PlayerType3DParams.MODEL_NAME);

	    if (modelName !== null && modelName.slice(0, 3) === 'nao') {
	      let modelType = playerType.getNumber(PlayerType3DParams.MODEL_TYPE);

	      if (modelType === null) {
	        modelType = 0;
	      }

	      const specification = new NaoSpecification(side, modelType, playerNo);
	      return new DynamicRobotModel('nao_hetero', specification, this.meshFactory);
	    }

	    return null;
	  }

	  /**
	   * @override
	   */
	  dispose () {}
	}

	/**
	 * The SoccerBot2DSpecification definition.
	 *
	 * @author Stefan Glaser
	 */
	class SoccerBot2DSpecification extends RobotSpecification
	{
	  /**
	   * SoccerBot2DSpecification Constructor
	   *
	   * @param {!TeamSide} side the team side
	   * @param {number} playerNo the player number
	   */
	  constructor (side, playerNo)
	  {
	    super('torso');

	    const sideLetter = GameUtil.getSideLetter(side);
	    const matStamina = 'stamina_' + sideLetter + playerNo;
	    const matBlack = 'sbBlack';
	    const matBlue = 'sbBlue';
	    const matTeam = side === TeamSide.LEFT ? 'teamLeft' : 'teamRight';
	    this.teamMaterialNames.push(matTeam);

	    const m4Body = ThreeJsUtil.mM4(1, 0, 0, 0, 0, 1, 0, 0.3, 0, 0, 1, 0);
	    const m4Team = ThreeJsUtil.mM4(1, 0, 0, 0, 0, 0.2, 0, 0.6, 0, 0, 1, 0);
	    const m4Stamina = ThreeJsUtil.mM4(-1, 0, 0, 0, 0, 0.2, 0, 0.6, 0, 0, -1, 0);
	    const m4Nose = ThreeJsUtil.mM4(1, 0, 0, 0.25, 0, 1, 0, 0, 0, 0, 1, 0);

	    /**
	     * The list of stamina material names.
	     * @type {!Array<string>}
	     */
	    this.staminaMaterialNames = [matStamina];

	    // torso meshes
	    this.meshes.push(new MeshSpecification('bodyCylinder', matBlack, m4Body));
	    this.meshes.push(new MeshSpecification('bodyTeamSphere', matTeam, m4Team));
	    this.meshes.push(new MeshSpecification('bodyStaminaSphere', matStamina, m4Stamina));

	    // Head
	    this.children.push(
	        new BodyPartSpecification('head',
	          [ // head meshes
	            new MeshSpecification('headCylinder', matBlue),
	            new MeshSpecification('headNoseBox', matBlue, m4Nose)
	          ],
	          new THREE.Vector3(0, 0.651, 0),
	          ThreeJsUtil.Vector3_UnitY(),
	          [])); // No further children here
	  }
	}



	/**
	 * The material factory for the soccer bot 2D robot models.
	 *
	 * @author Stefan Glaser
	 */
	class SoccerBot2DMaterialFactory extends MaterialFactory
	{
	  /**
	   * Create the material with the given name.
	   *
	   * @override
	   * @param  {string} name the unique name of the material
	   * @return {(!THREE.Material | !Array<!THREE.Material>)} the requested (multi-)material
	   *                             or a default material if the requested material definition was not found
	   */
	  createMaterial (name)
	  {
	    switch (name) {
	      case 'sbBlue':
	        return SceneUtil.createStdPhongMat(name, 0x001166);
	      case 'sbBlack':
	        return SceneUtil.createStdPhongMat(name, 0x000000);
	      default:
	        // By default create a very dark grey material
	        return SceneUtil.createStdPhongMat(name, 0x111111);
	    }
	  }
	}



	/**
	 * The geometry factory for the soccer bot 2D robot models.
	 *
	 * @author Stefan Glaser
	 */
	class SoccerBot2DGeometryFactory extends GeometryFactory
	{
	  /**
	   * Create the geometry with the given name.
	   *
	   * @override
	   * @param  {string} name the unique name of the geometry
	   * @param  {!Function} onLoad the callback function to call on successfull creation
	   * @param  {!Function=} onError the callback function to call when creating the geometry failed
	   * @return {void}
	   */
	  createGeometry (name, onLoad, onError)
	  {
	      switch (name) {
	      case 'bodyCylinderGeo':
	        onLoad(new THREE.CylinderBufferGeometry(0.5, 0.5, 0.6, 32));
	        break;
	      case 'bodyTeamSphereGeo':
	        onLoad(new THREE.SphereBufferGeometry(0.44, 16, 4, Math.PI / 2, Math.PI, 0, Math.PI / 2));
	        break;
	      case 'bodyStaminaSphereGeo':
	        onLoad(new THREE.SphereBufferGeometry(0.44, 16, 4, Math.PI / 2, Math.PI, 0, Math.PI / 2));
	        break;
	      case 'headCylinderGeo':
	        onLoad(new THREE.CylinderBufferGeometry(0.1, 0.1, 0.1, 16));
	        break;
	      case 'headNoseBoxGeo':
	        onLoad(new THREE.BoxBufferGeometry(0.5, 0.1, 0.1));
	        break;
	      default:
	        // Log error
	        console.log('Geometry "' + name + '" not found!');

	        if (onError) {
	          onError('Geometry "' + name + '" not found!');
	        }
	        break;
	      }
	  }
	}

	/**
	 * The SoccerBot2D class definition.
	 *
	 * @author Stefan Glaser
	 */
	class SoccerBot2D extends DynamicRobotModel
	{
	  /**
	   * SoccerBot2D Constructor
	   * 
	   * @param {string} name the name of the agent model
	   * @param {!SoccerBot2DSpecification} specification the soccer bot 2d specification
	   * @param {!MeshFactory} meshFactory the mesh factory
	   * @param {!ParameterMap} environmentParams the environment paraméter
	   */
	  constructor(name, specification, meshFactory, environmentParams)
	  {
	    super(name, specification, meshFactory);

	    /**
	     * The list of stamina materials.
	     * @type {!Array<!THREE.Material>}
	     */
	    this.staminaMatList = [];

	    /**
	     * The maximum stamina value.
	     * @type {number}
	     */
	    this.maxStamina = 8000;
	    const maxStaminaParam = environmentParams.getNumber(Environment2DParams.STAMINA_MAX);
	    if (maxStaminaParam !== null) {
	      this.maxStamina = maxStaminaParam;
	    }

	    // Extract stamina materials
	    let i = specification.staminaMaterialNames.length;
	    while (i--) {
	      const mat = meshFactory.materialCache[specification.staminaMaterialNames[i]];
	      if (mat !== undefined) {
	        this.staminaMatList.push(mat);
	      }
	    }
	  }

	  /**
	   * Update the joint objects according to the given angles.
	   *
	   * @override
	   * @param  {!Array<number> | !Float32Array} data the agent data of the current state
	   * @param  {!Array<number> | !Float32Array=} nextData the agent data of the next state
	   * @param  {number=} t the interpolation time
	   * @return {void}
	   */
	  updateData (data, nextData = undefined, t = 0)
	  {
	    if (data[Agent2DData.STAMINA] === undefined) {
	      return;
	    }

	    let stamina = nextData === undefined ?
	          data[Agent2DData.STAMINA] :
	          data[Agent2DData.STAMINA] + (nextData[Agent2DData.STAMINA] - data[Agent2DData.STAMINA]) * t;
	    stamina = THREE.Math.clamp(stamina, 0, this.maxStamina);
	    stamina = (this.maxStamina - stamina) / this.maxStamina;

	    // Apply stamina color
	    let i = this.staminaMatList.length;
	    while (i--) {
	      const mat = this.staminaMatList[i];
	      if (mat.color.r === stamina) {
	        // Prevent material updates if stamina value hasn't changed (e.g. on pausing)
	        break;
	      }
	      mat.color.setScalar(stamina);
	      mat.needsUpdate = true;
	    }
	  }
	}

	/**
	 *
	 * @author Stefan Glaser
	 */
	class SoccerBot2DModelFactory extends RobotModelFactory
	{
	  /**
	   * SoccerBot2DModelFactory Constructor
	   */
	  constructor ()
	  {
	    super();
	    
	    /**
	     * The mesh factory.
	     * @type {!MeshFactory}
	     */
	    this.meshFactory = new MeshFactory(new SoccerBot2DGeometryFactory(), new SoccerBot2DMaterialFactory());
	  }

	  /**
	   * Create a robot model to the given player type.
	   *
	   * @override
	   * @param  {!ParameterMap} playerType the player type
	   * @param  {!TeamSide} side the team side
	   * @param  {number} playerNo the player number
	   * @param  {!ParameterMap} environmentParams the environment paraméter
	   * @param  {!ParameterMap} playerParams the player paraméter
	   * @return {?RobotModel} a new robot model
	   */
	  createModel (playerType, side, playerNo, environmentParams, playerParams)
	  {
	    const robotSpec = new SoccerBot2DSpecification(side, playerNo);
	    return new SoccerBot2D('SoccerBot2D', robotSpec, this.meshFactory, environmentParams);
	  }

	  /**
	   * @override
	   */
	  dispose () {}
	}

	/**
	 *
	 * @author Stefan Glaser
	 */
	class WorldModelFactory
	{
	  /**
	   * WorldModelFactory Constructor
	   */
	  constructor()
	  {
	    /**
	     * Geometry cache.
	     * @type {!Object}
	     */
	    this.geometryCache = {};

	    /**
	     * Material cache.
	     * @type {!Object}
	     */
	    this.materialCache = {};
	  }

	  /**
	   * Dispose all resources allocated within this factory.
	   *
	   * @return {void}
	   */
	  dispose () {}

	  /**
	   * Create a default world representation (sky box and lighting).
	   *
	   * @param  {!THREE.Scene} scene the world scene
	   * @return {void}
	   */
	  createScene (scene)
	  {
	    // Create sky box
	    const geometry = this.fetchGeometry('skyBoxGeo');
	    const material = this.fetchMaterial('skyBoxMat');

	    const mesh = new THREE.Mesh(geometry, material);
	    mesh.name = 'skyBox';
	    scene.add(mesh);


	    // Ambient lighting
	    let light = new THREE.AmbientLight(0xeeeeee);
	    light.name = 'ambient';
	    scene.add(light);

	    // Directional lighting
	    light = new THREE.DirectionalLight(0xeeeeee, 0.4);
	    light.name = 'sun';
	    light.position.set(300, 300, 500);
	    light.castShadow = true;
	    light.shadow.mapSize.width = 2048;
	    light.shadow.mapSize.height = 2048;

	    scene.add(light);
	  }

	  /**
	   * Update the scene representation (adjust shadow camera to field size).
	   *
	   * @param  {!THREE.Scene} scene the scene instance
	   * @param  {!THREE.Vector2} fieldDimensions the field dimensions
	   * @return {void}
	   */
	  updateScene (scene, fieldDimensions)
	  {
	    // Update shadow camera of "sun" DirectionalLight
	    const light = scene.getObjectByName('sun');
	    if (light instanceof THREE.DirectionalLight) {
	      const vertical = Math.ceil(fieldDimensions.y * 0.8);
	      const horizontal = Math.ceil(fieldDimensions.x * 0.7);
	      const depth = fieldDimensions.y;

	      light.shadow.camera.left = -horizontal;
	      light.shadow.camera.right = horizontal;
	      light.shadow.camera.top = vertical;
	      light.shadow.camera.bottom = -vertical;
	      light.shadow.camera.near = 655 - depth;
	      light.shadow.camera.far = 655 + depth;
	      light.shadow.camera.updateProjectionMatrix();
	    }
	  }

	  /**
	   * Update the field representation for the given field instance.
	   * This function repositions and rescales all objects on the field (field plane, border, field lines and goals)
	   * to match their specification.
	   *
	   * @param  {!Field} field the field instance
	   * @return {void}
	   */
	  updateField (field)
	  {
	    const size = field.fieldDimensions;
	    let geometry;
	    let mesh;
	    const scope = this;

	    /**
	     * Helper function...
	     * @param {string} name the name of the new mesh
	     * @param {string} matName the name of the material to use
	     * @param {string=} geoName the name of the geometry to use
	     */
	    const addMesh = function (name, matName, geoName) {
	      const material = scope.fetchMaterial(matName);
	      if (geoName) {
	        geometry = scope.fetchGeometry(geoName);
	      }

	      mesh = new THREE.Mesh(geometry, material);
	      mesh.name = name;
	      mesh.rotation.x = -Math.PI / 2;
	      mesh.receiveShadow = true;
	      mesh.castShadow = false;
	      field.objGroup.add(mesh);
	    };


	    let halfLength = Math.floor((size.x + 1.99) / 2);

	    // ---------- Update field plane
	    mesh = field.objGroup.getObjectByName('fieldPlane');
	    if (!mesh) {
	      // No fieldPlane found, thus create new one
	      addMesh('fieldPlane', 'grassMat', 'planeGeo');
	    }

	    // Resize field plane
	    mesh.scale.set(halfLength * 2, size.y, 1);
	    if (field.textureRepeat !== null) {
	      mesh.material.map.repeat.set(field.textureRepeat, field.textureRepeat * size.y / size.x);
	    } else {
	      mesh.material.map.repeat.set(halfLength, size.y);
	    }
	    mesh.material.needsUpdate = true;



	    halfLength = size.x / 2;
	    const halfWidth = size.y / 2;
	    const borderSize = size.x / 12;

	    // ---------- Update field top border
	    mesh = field.objGroup.getObjectByName('fieldBorderTop');
	    if (!mesh) {
	      // No top border found, thus create new one
	      addMesh('fieldBorderTop', 'tbBorderMat', 'planeGeo');
	    }

	    // Adjust top border
	    mesh.scale.set(size.x + borderSize * 2, borderSize, 1);
	    mesh.position.set(0, 0, -halfWidth - borderSize / 2);
	    mesh.material.map.repeat.set((size.x + borderSize * 2), borderSize);
	    mesh.material.needsUpdate = true;


	    // ---------- Update field bottom border
	    mesh = field.objGroup.getObjectByName('fieldBorderBottom');
	    if (!mesh) {
	      // No bottom border found, thus create new one
	      addMesh('fieldBorderBottom', 'tbBorderMat', 'planeGeo');
	    }

	    // Adjust bottom border
	    mesh.scale.set(size.x + borderSize * 2, borderSize, 1);
	    mesh.position.set(0, 0, halfWidth + borderSize / 2);
	    mesh.material.map.repeat.set((size.x + borderSize * 2), borderSize);
	    mesh.material.needsUpdate = true;


	    // ---------- Update field left border
	    mesh = field.objGroup.getObjectByName('fieldBorderLeft');
	    if (!mesh) {
	      // No left border found, thus create new one
	      addMesh('fieldBorderLeft', 'lrBorderMat', 'planeGeo');
	    }

	    // Adjust left border
	    mesh.scale.set(borderSize, size.y, 1);
	    mesh.position.set(-halfLength - borderSize / 2, 0, 0);
	    mesh.material.map.repeat.set(borderSize, size.y);
	    mesh.material.needsUpdate = true;


	    // ---------- Update field right border
	    mesh = field.objGroup.getObjectByName('fieldBorderRight');
	    if (!mesh) {
	      // No right border found, thus create new one
	      addMesh('fieldBorderRight', 'lrBorderMat', 'planeGeo');
	    }

	    // Adjust right border
	    mesh.scale.set(borderSize, size.y, 1);
	    mesh.position.set(halfLength + borderSize / 2, 0, 0);
	    mesh.material.map.repeat.set(borderSize, size.y);
	    mesh.material.needsUpdate = true;


	    // ---------- Update field lines
	    mesh = field.objGroup.getObjectByName('fieldLines');
	    if (mesh) {
	      field.objGroup.remove(mesh);
	      mesh.geometry.dispose();
	    }
	    geometry = SceneUtil.createFieldLinesGeometry(field.lineWidth,
	                                                   field.fieldDimensions,
	                                                   field.centerRadius,
	                                                   field.goalAreaDimensions,
	                                                   field.penaltyAreaDimensions);
	    addMesh('fieldLines', 'lineMat');


	    // ---------- Update goals
	    this.updateGoals(field);
	  }

	  /**
	   * Update the goal representations for the given field instance.
	   * This function repositions and rescales the goal objects in the given field instance to match their specification.
	   *
	   * @param  {!Field} field the field instance
	   * @return {void}
	   */
	  updateGoals (field)
	  {
	    const dimensions = field.goalDimensions;
	    let geometry;
	    let material;
	    let group;
	    let mesh;
	    const netWidth = dimensions.y + field.lineWidth * 2 - 0.02;
	    const netDepth = dimensions.x - field.lineWidth - 0.01;
	    const netHeight = Math.sqrt(netDepth * netDepth + dimensions.z * dimensions.z);

	    /**
	     * Helper function...
	     * @param {string} name the name of the new mesh
	     * @param {boolean} shadow
	     */
	    const addMesh = function (name, shadow) {
	      mesh = new THREE.Mesh(geometry, material);
	      mesh.name = name;
	      mesh.rotation.x = -Math.PI / 2;
	      mesh.receiveShadow = shadow;
	      mesh.castShadow = shadow;
	      group.add(mesh);
	    };

	    const goalGeometry = SceneUtil.createHockeyGoalGeometry(field.lineWidth, field.goalDimensions);


	    // ---------- Update left goal group
	    group = field.objGroup.getObjectByName('leftGoal');
	    if (!group) {
	      // No left goal group found, thus create new one
	      group = new THREE.Object3D();
	      group.name = 'leftGoal';
	      group.rotation.y = Math.PI;
	      field.objGroup.add(group);
	    }
	    group.position.x = -field.fieldDimensions.x / 2;


	    // ---------- Update left goal skeleton
	    mesh = group.getObjectByName('goalSkeleton');
	    if (mesh) {
	      group.remove(mesh);
	      mesh.geometry.dispose();
	    }
	    geometry = goalGeometry;
	    material = this.fetchMaterial('leftGoalMat');
	    addMesh('goalSkeleton', true);


	    // ---------- Update left goal side nets
	    mesh = group.getObjectByName('goalNetSides');
	    if (!mesh) {
	      // Create left/right side goal nets
	      geometry = this.fetchGeometry('goalNetSidesGeo');
	      material = this.fetchMaterial('goalNetSidesMat');
	      addMesh('goalNetSides', false);
	    }
	    mesh.position.set(dimensions.x - netDepth, 0, 0);
	    mesh.scale.set(netDepth, netWidth, dimensions.z);
	    mesh.material.map.repeat.set(netDepth, dimensions.z);
	    mesh.material.needsUpdate = true;


	    // ---------- Update left goal back net
	    mesh = group.getObjectByName('goalNetBack');
	    if (!mesh) {
	      // Create back goal net
	      geometry = this.fetchGeometry('planeGeo');
	      material = this.fetchMaterial('goalNetBackMat');
	      addMesh('goalNetBack', false);
	    }
	    mesh.position.set(field.lineWidth + netDepth / 2, dimensions.z / 2, 0);
	    mesh.scale.set(netWidth, netHeight, 1);
	    mesh.rotation.order = 'ZYX';
	    mesh.rotation.y = -Math.PI / 2;
	    mesh.rotation.x = (Math.PI / 2) - Math.atan(dimensions.z / netDepth);
	    mesh.material.map.repeat.set(netWidth, netHeight);
	    mesh.material.needsUpdate = true;



	    // ---------- Update right goal group
	    group = field.objGroup.getObjectByName('rightGoal');
	    if (!group) {
	      // No right goal group found, thus create new one
	      group = new THREE.Object3D();
	      group.name = 'rightGoal';
	      field.objGroup.add(group);
	    }
	    group.position.x = field.fieldDimensions.x / 2;


	    // ---------- Update right goal skeleton
	    mesh = group.getObjectByName('goalSkeleton');
	    if (mesh) {
	      group.remove(mesh);
	      mesh.geometry.dispose();
	    }
	    geometry = goalGeometry;
	    material = this.fetchMaterial('rightGoalMat');
	    addMesh('goalSkeleton', true);


	    // ---------- Update right goal side nets
	    mesh = group.getObjectByName('goalNetSides');
	    if (!mesh) {
	      // Create left/right side goal nets
	      geometry = this.fetchGeometry('goalNetSidesGeo');
	      material = this.fetchMaterial('goalNetSidesMat');
	      addMesh('goalNetSides', false);
	    }
	    mesh.position.set(dimensions.x - netDepth, 0, 0);
	    mesh.scale.set(netDepth, netWidth, dimensions.z);
	    mesh.material.map.repeat.set(netDepth, dimensions.z);
	    mesh.material.needsUpdate = true;


	    // ---------- Update left goal back net
	    mesh = group.getObjectByName('goalNetBack');
	    if (!mesh) {
	      // Create back goal net
	      geometry = this.fetchGeometry('planeGeo');
	      material = this.fetchMaterial('goalNetBackMat');
	      addMesh('goalNetBack', false);
	    }
	    mesh.position.set(field.lineWidth + netDepth / 2, dimensions.z / 2, 0);
	    mesh.scale.set(netWidth, netHeight, 1);
	    mesh.rotation.order = 'ZYX';
	    mesh.rotation.y = -Math.PI / 2;
	    mesh.rotation.x = (Math.PI / 2) - Math.atan(dimensions.z / netDepth);
	    mesh.material.map.repeat.set(netWidth, netHeight);
	    mesh.material.needsUpdate = true;
	  }

	  /**
	   * Create a ball representation.
	   *
	   * @param  {!Ball} ball the ball instance
	   * @return {void}
	   */
	  createBall (ball)
	  {
	    // Create simple ball placeholder
	    const placeholder = SceneUtil.createSimpleBall(ball.radius);
	    ball.objGroup.add(placeholder);

	    // Load nice looking ball object
	    SceneUtil.loadObject('soccer_ball.json',
	      /**
	       * @param  {!THREE.Scene} scene the loaded scene
	       * @return {void}
	       */
	      function(scene) { // onLoad
	        const geometry = new THREE.BufferGeometry();
	        geometry.fromGeometry(/**@type {!THREE.Geometry}*/(/**@type {!THREE.Mesh}*/(scene.getObjectByName('soccerball')).geometry));
	        geometry.name = 'ballGeo';

	        const material = SceneUtil.createStdPhongMat('ballMat', 0xffffff, 'rcs-soccerball.png');

	        const mesh = new THREE.Mesh(geometry, material);
	        mesh.name = 'ballSphere';
	        mesh.castShadow = true;
	        mesh.receiveShadow = true;

	        // Exchange placeholder with nice looking ball mesh
	        ball.objGroup.remove(placeholder);
	        ball.objGroup.add(mesh);
	      });
	  }

	  /**
	   * Fetch the material with the given name from the internal cache (or create it if not existent).
	   *
	   * @param  {string} name the unique name of the material
	   * @return {(!THREE.Material | !Array<!THREE.Material>)} the requested (multi-)material
	   *                             or a default material if the requested material definition was not found
	   */
	  fetchMaterial (name)
	  {
	    let material = this.materialCache[name];
	    let texture;

	    if (material === undefined) {
	      switch (name) {
	        case 'skyBoxMat':
	          material = SceneUtil.createSkyBoxMaterial();
	          break;
	        case 'grassMat':
	          texture = SceneUtil.loadTexture('field.png');
	          texture.wrapS = THREE.RepeatWrapping;
	          texture.wrapT = THREE.RepeatWrapping;
	          material = new THREE.MeshPhongMaterial({name: 'fieldMat', color: 0xcccccc, map: texture});
	          break;
	        case 'tbBorderMat':
	          texture = SceneUtil.loadTexture('field_border.png');
	          texture.wrapS = THREE.RepeatWrapping;
	          texture.wrapT = THREE.RepeatWrapping;
	          material = new THREE.MeshPhongMaterial({name: 'tbBorderMat', color: 0xaa99aa, map: texture});
	          break;
	        case 'lrBorderMat':
	          texture = SceneUtil.loadTexture('field_border.png');
	          texture.wrapS = THREE.RepeatWrapping;
	          texture.wrapT = THREE.RepeatWrapping;
	          material = new THREE.MeshPhongMaterial({name: 'lrBorderMat', color: 0xaa99aa, map: texture});
	          SceneUtil.offsetMaterial(material, -0.5, -0.05);
	          break;
	        case 'lineMat':
	          material = new THREE.MeshBasicMaterial({name: 'lineMat', color: 0xeeeeee, side: THREE.DoubleSide});
	          SceneUtil.offsetMaterial(material, -1, -1);
	          break;
	        case 'goalNetSidesMat':
	          texture = SceneUtil.loadTexture('goalnet.png');
	          texture.wrapS = THREE.RepeatWrapping;
	          texture.wrapT = THREE.RepeatWrapping;
	          material = SceneUtil.createStdPhongMat('goalNetSidesMat', 0xffffff, texture);
	          material.side = THREE.DoubleSide;
	          material.transparent = true;
	          break;
	        case 'goalNetBackMat':
	          texture = SceneUtil.loadTexture('goalnet.png');
	          texture.wrapS = THREE.RepeatWrapping;
	          texture.wrapT = THREE.RepeatWrapping;
	          material = SceneUtil.createStdPhongMat('goalNetBackMat', 0xffffff, texture);
	          material.side = THREE.DoubleSide;
	          material.transparent = true;
	          break;
	        case 'leftGoalMat':
	          material = SceneUtil.createStdPhongMat(name, 0xcccc00);
	          material.side = THREE.DoubleSide;
	          SceneUtil.offsetMaterial(material, -1, -0.1);
	          break;
	        case 'rightGoalMat':
	          material = SceneUtil.createStdPhongMat(name, 0x0088bb);
	          material.side = THREE.DoubleSide;
	          SceneUtil.offsetMaterial(material, -1, -0.1);
	          break;
	        default:
	          // By default create a quite white material
	          material = SceneUtil.createStdPhongMat(name, 0xeeeeee);
	          break;
	      }

	      this.materialCache[name] = material;
	    }

	    return material;
	  }

	  /**
	   * Fetch the geometry with the given name from the internal cache (or create it if not existent).
	   *
	   * @param  {string} name the unique name of the geometry
	   * @return {!THREE.Geometry} the requested geometry
	   */
	  fetchGeometry (name)
	  {
	    let geometry = this.geometryCache[name];

	    if (geometry === undefined) {
	      switch (name) {
	      case 'skyBoxGeo':
	        geometry = new THREE.BoxBufferGeometry(1024, 1024, 1024);
	        break;
	      case 'planeGeo':
	        geometry = new THREE.PlaneBufferGeometry(1, 1);
	        break;
	      case 'goalNetSidesGeo':
	        geometry = SceneUtil.createHockeyGoalSideNetGeometry();
	        break;
	      default:
	        // Log error
	        console.log('Geometry "' + name + '" not found!');
	        geometry = new THREE.BoxBufferGeometry(0.5, 0.5, 0.5);
	        break;
	      }

	      this.geometryCache[name] = geometry;
	    }

	    return geometry;
	  }
	}

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

	/**
	 * the world events enum.
	 * @enum {string}
	 */
	const WorldEvents = {
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

	/**
	 * The game log player states enum.
	 * @enum {number}
	 */
	const LogPlayerStates = {
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
	const LogPlayerEvents = {
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

	/**
	 * The monitor settings event type enum.
	 * @enum {string}
	 */
	 const MonitorSettingsEvents = {
	  CHANGE: 'change'
	};



	/**
	 * The MonitorSettings class definition.
	 *
	 * The MonitorSettings provides access to all configuration objects.
	 *
	 * @author Stefan Glaser
	 */
	class MonitorSettings extends EventDispatcher
	{
	  /**
	   * MonitorSettings Constructor
	   *
	   * ::implements {IPublisher}
	   * ::implements {IEventDispatcher}
	   */
	  constructor ()
	  {
	    super();

	    /**
	     * The remember configurations settings list.
	     * @type {!Object<boolean>}
	     */
	    this.rememberMap = {};

	    /**
	     * The remember all configurations indicator.
	     * @type {boolean}
	     */
	    this.rememberAll = false;

	    /**
	     * The general monitor configuration.
	     * @type {!MonitorConfiguration}
	     */
	    this.monitorConfig = new MonitorConfiguration();


	    // Restore user configuration from local storage
	    this.restore();
	  }

	  /**
	   * Restore the user configurations from local storage.
	   *
	   * @return {void}
	   */
	  restore ()
	  {
	    // console.log('Restoring settings...');

	    // Restore remember all setting
	    let value = localStorage.getItem('rememberAll');
	    if (value) {
	      // console.log('Found rememberAll value: ' + value);
	      this.rememberAll = value === 'true';
	    }

	    // Restore remember map
	    value = localStorage.getItem('rememberMap');
	    if (value) {
	      // console.log('Found rememberMap value: ' + value);
	      try {
	        this.rememberMap = /** @type {!Object<boolean>} */ (JSON.parse(value));
	      } catch (ex) {
	        console.log('Exception parsing remember map!');
	        console.log(ex);
	      }
	    }

	    // restore individual configs
	    this.restoreConfig(this.monitorConfig);
	  }

	  /**
	   * Restore the specified user configuration from local storage.
	   *
	   * @param {!ConfigurationModel} config the config to restore
	   * @return {void}
	   */
	  restoreConfig (config)
	  {
	    const value = localStorage.getItem(config.getID());

	    if (value) {
	      // Found valid configuration value
	       config.fromJSONString(value);
	    }
	  }

	  /**
	   * Save/Store the user configurations to the local storage.
	   *
	   * @return {void}
	   */
	  save ()
	  {
	    // console.log('Saving settings...');

	    // Save configuration remembering settings
	    localStorage.setItem('rememberAll', this.rememberAll);
	    localStorage.setItem('rememberMap', JSON.stringify(this.rememberMap));

	    // Save individual configs
	    this.saveConfig(this.monitorConfig);
	  }

	  /**
	   * Save/Store the specified user configuration to the local storage.
	   *
	   * @param {!ConfigurationModel} config the config to save/store
	   * @return {void}
	   */
	  saveConfig (config)
	  {
	    const id = config.getID();
	    if (this.rememberAll || this.rememberMap[id]) {
	      localStorage.setItem(id, config.toJSONString());
	    } else {
	      localStorage.removeItem(id);
	    }
	  }

	  /**
	   * Enable/Disable remember setting for a specific configuration.
	   *
	   * @param {!ConfigurationModel} config the configuration in question
	   * @param {boolean} remember true if the specified config should be stored in the local storage, false otherwise
	   * @return {void}
	   */
	  setRememberConfig (config, remember)
	  {
	    this.rememberMap[config.getID()] = remember;

	    // Publish change event
	    this.dispatchEvent({
	        type: MonitorSettingsEvents.CHANGE
	      });
	  }

	  /**
	   * Enable/Disable remember setting for a all configurations.
	   *
	   * @param {boolean} remember true if all configurations should be stored in the local storage, false otherwise
	   * @return {void}
	   */
	  setRememberAll (remember)
	  {
	    this.rememberAll = remember;

	    // Publish change event
	    this.dispatchEvent({
	        type: MonitorSettingsEvents.CHANGE
	      });
	  }
	}

	/**
	 * The monitor model event type enum.
	 * @enum {string}
	 */
	const MonitorModelEvents = {
	  STATE_CHANGE: 'state-change',
	};

	/**
	 * The monitor model state/mode enum.
	 * @enum {string}
	 */
	const MonitorStates = {
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

	/**
	 * Class for parsing and holding monitor parameters.
	 *
	 * @author Stefan Glaser
	 */
	class MonitorParameters
	{
	  /**
	   * MonitorParameter Constructor
	   *
	   * @param {?Object=} params the external monitor parameter object
	   */
	  constructor (params)
	  {
	    /**
	     * The monitor parameter object.
	     * @type {!Object}
	     */
	    this.monitorParams = (params !== undefined && params !== null) ? params : {};

	    /**
	     * The query parameter object.
	     * @type {!Object}
	     */
	    this.queryParams = MonitorParameters.parseQueryParams();
	  }

	  /**
	   * Retrieve a query parameter.
	   *
	   * @param  {string} key the parameter key
	   * @return {?string} the query parameter if specified, or null otherwise
	   */
	  getQueryParam (key)
	  {
	    if (this.queryParams[key]) {
	      return this.queryParams[key];
	    }

	    return null;
	  }

	  /**
	   * Check for embedded parameter.
	   *
	   * @return {boolean} true, if embedded mode is set and true, false otherwise
	   */
	  isEmbedded ()
	  {
	    return this.monitorParams['embedded'] === true;
	  }

	  /**
	   * Retrieve archives parameter.
	   *
	   * @return {!Array<{url: string, name: string}>} the list of predefined archive locations
	   */
	  getArchives ()
	  {
	    if (this.monitorParams['archives']) {
	      return this.monitorParams['archives'];
	    }

	    return [];
	  }

	  /**
	   * Retrieve the game log / replay url parameter.
	   *
	   * @return {?string} the game log url if specified, or null otherwise
	   */
	  getGameLogURL ()
	  {
	    let url = this.getQueryParam('gamelog');

	    if (url === null) {
	      // Alternatively check for "replay" parameter
	      url = this.getQueryParam('replay');
	    }

	    return url;
	  }

	  /**
	   * Retrieve the playlist url parameter.
	   *
	   * @return {?string} the playlist url if specified, or null otherwise
	   */
	  getPlaylistURL ()
	  {
	    return this.getQueryParam('list');
	  }

	  /**
	   * Extract the query parameters from a query string or the current location.
	   *
	   * @param  {string=} query the query string to parse or undefined for window.location.search
	   * @return {!Object<string,string>} the query parameter map
	   */
	  static parseQueryParams (query)
	  {
	    if (query === undefined) {
	      query = window.location.search;
	    }

	    const regex = /[?&]?([^=]+)=([^&]*)/g;
	    const params = {};
	    let tokens;

	    query = query.split('+').join(' ');

	    while (tokens = regex.exec(query)) {
	      params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
	    }

	    return params;
	  }
	}

	/**
	 * Application revision.
	 * @type {string}
	 */
	const REVISION = '0.3';

	/**
	 * Key code enum.
	 * @enum {number}
	 */
	const KeyCodes = {
	  ENTER: 13,
	  SPACE: 32,

	  PAGE_UP: 33,
	  PAGE_DOWN: 34,
	  LEFT: 37,
	  UP: 38,
	  RIGHT: 39,
	  DOWN: 40,

	  ZERO: 48,
	  ONE: 49,
	  TWO: 50,
	  THREE: 51,
	  FOUR: 52,
	  FIVE: 53,
	  SIX: 54,
	  SEVEN: 55,
	  EIGHT: 56,
	  NINE: 57,

	  A: 65,
	  B: 66,
	  C: 67,
	  D: 68,
	  E: 69,
	  F: 70,
	  G: 71,
	  H: 72,
	  I: 73,
	  J: 74,
	  K: 75,
	  L: 76,
	  M: 77,
	  N: 78,
	  O: 79,
	  P: 80,
	  Q: 81,
	  R: 82,
	  S: 83,
	  T: 84,
	  U: 85,
	  V: 86,
	  W: 87,
	  X: 88,
	  Y: 89,
	  Z: 90
	};

	/**
	 * Character code enum.
	 * @enum {number}
	 */
	const CharCodes = {
	  BACKSPACE: 8,
	  TAB: 9,
	  ENTER: 13,
	  ESC: 27,
	  SPACE: 32,

	  LP: 40,
	  RP: 41,
	  ASTERISK: 42,
	  PLUS: 43,
	  COMMA: 44,
	  MINUS: 45,
	  DOT: 46,
	  SLASH: 47,

	  ZERO: 48,
	  ONE: 49,
	  TWO: 50,
	  THREE: 51,
	  FOUR: 52,
	  FIVE: 53,
	  SIX: 54,
	  SEVEN: 55,
	  EIGHT: 56,
	  NINE: 57,

	  COLON: 58,
	  SEMICOLON: 59,
	  LT: 60,
	  EQ: 61,
	  GT: 62,
	  QESTIONMARK: 63,
	  AT: 64,

	  A: 65,
	  B: 66,
	  C: 67,
	  D: 68,
	  E: 69,
	  F: 70,
	  G: 71,
	  H: 72,
	  I: 73,
	  J: 74,
	  K: 75,
	  L: 76,
	  M: 77,
	  N: 78,
	  O: 79,
	  P: 80,
	  Q: 81,
	  R: 82,
	  S: 83,
	  T: 84,
	  U: 85,
	  V: 86,
	  W: 87,
	  X: 88,
	  Y: 89,
	  Z: 90,

	  LSB: 91,
	  BACKSLASH: 92,
	  RSB: 93,
	  CIRCUMFLEX: 94,
	  LOWLINE: 95,
	  GRAVEACCENT: 96,

	  a: 97,
	  b: 98,
	  c: 99,
	  d: 100,
	  e: 101,
	  f: 102,
	  g: 103,
	  h: 104,
	  i: 105,
	  j: 106,
	  k: 107,
	  l: 108,
	  m: 109,
	  n: 110,
	  o: 111,
	  p: 112,
	  q: 113,
	  r: 114,
	  s: 115,
	  t: 116,
	  u: 117,
	  v: 118,
	  w: 119,
	  x: 120,
	  y: 121,
	  z: 122,

	  LCB: 123,
	  VBAR: 124,
	  RCB: 125,
	  TILDE: 126,
	  DEL: 127
	};

	/**
	 * General user interface namespace, definitions, etc.
	 *
	 * @author Stefan Glaser
	 */
	class UIUtil {
	  /**
	   * Calculate the brightness value of a color.
	   *
	   * @param  {!THREE.Color} color the color to check
	   * @return {number} the brightness value between 0 and 255
	   */
	  static getBrightness (color)
	  {
	    return 255 * Math.sqrt(
	        color.r * color.r * 0.241 +
	        color.g * color.g * 0.691 +
	        color.b * color.b * 0.068);
	  }

	  /**
	   * Retrieve the default foreground color for a given background color.
	   *
	   * @param  {!THREE.Color} color the background color
	   * @return {!THREE.Color} the forground color
	   */
	  static getForegroundColor (color)
	  {
	    return UIUtil.getBrightness(color) < 130 ? ThreeJsUtil.Color_LightGrey() : ThreeJsUtil.Color_DarkGrey();
	  }

	  /**
	   * Make the given element visible or invisible.
	   *
	   * @param {!Element} element the DOM element
	   * @param {boolean=} visible true for visible, false for invisible
	   */
	  static setVisibility (element, visible)
	  {
	    if (visible === undefined || visible) {
	      element.style.display = '';
	    } else {
	      element.style.display = 'none';
	    }
	  }

	  /**
	   * Check if the given component is visible.
	   *
	   * @param {!Element} element the DOM element
	   * @return {boolean} true for visible, false for invisible
	   */
	  static isVisible (element)
	  {
	    return element.style.display != 'none';
	  }

	  /**
	   * Toggle the visibility of the given component.
	   *
	   * @param {!Element} element the DOM element
	   * @return {boolean} true, if the element is now visible, false otherwise
	   */
	  static toggleVisibility (element)
	  {
	    if(element.style.display != 'none') {
	      element.style.display = 'none';
	      return false;
	    } else {
	      element.style.display = '';
	      return true;
	    }
	  }

	  /**
	   * Create a new DOM Element.
	   *
	   * @param  {string} element the tag name
	   * @param  {string=} content the content of the new element
	   * @param  {string=} className the css class string
	   * @return {!Element}
	   */
	  static createElement (element, content, className)
	  {
	    const newElement = document.createElement(element);

	    if (content !== undefined) {
	      newElement.innerHTML = content;
	    }

	    if (className !== undefined) {
	      newElement.className = className;
	    }

	    return newElement;
	  }

	  /**
	   * Create a new div element.
	   *
	   * @param  {string=} className the css class string
	   * @return {!Element} the new div element
	   */
	  static createDiv (className)
	  {
	    return UIUtil.createElement('div', undefined, className);
	  }

	  /**
	   * Create a new span element.
	   *
	   * @param  {string=} text the content of the span
	   * @param  {string=} className the css class string
	   * @return {!Element} the new span element
	   */
	  static createSpan (text, className)
	  {
	    return UIUtil.createElement('span', text, className);
	  }

	  /**
	   * Create a new player button input element.
	   *
	   * @param  {string=} text the button text
	   * @param  {string=} className the button css class string
	   * @param  {string=} toolTip the button tool tip
	   * @param  {!Function=} action the button action
	   * @param  {boolean=} preventDefault prevent the default mouse action
	   * @return {!Element} the new button input element
	   */
	  static createPlayerButton (text, className, toolTip, action, preventDefault)
	  {
	    const btn = UIUtil.createElement('button', text, className);

	    if (toolTip !== undefined) {
	      btn.title = toolTip;
	    }

	    if (action !== undefined) {
	      const keyListener = function () {
	        const actionCB = action;

	        return function (evt) {
	          if (evt.keyCode == KeyCodes.ENTER ||
	              evt.keyCode == KeyCodes.SPACE) {
	            actionCB(evt);
	          }
	        };
	      }();

	      if (preventDefault) {
	        const mouseListener = function () {
	          const actionCB = action;

	          return function (evt) {
	            evt.preventDefault();
	            evt.stopPropagation();
	            actionCB(evt);
	          };
	        }();

	        btn.addEventListener('mousedown', mouseListener);
	      } else {
	        btn.addEventListener('mousedown', action);
	      }

	      btn.addEventListener('keydown', keyListener);
	    }

	    return btn;
	  }

	  /**
	   * Create a new button input element.
	   *
	   * @param  {string=} text the button text
	   * @param  {string=} className the button css class string
	   * @param  {string=} toolTip the button tool tip
	   * @param  {!Function=} action the button action
	   * @return {!Element} the new button input element
	   */
	  static createButton (text, className, toolTip, action)
	  {
	    const btn = UIUtil.createElement('button', text, className);

	    if (toolTip !== undefined) {
	      btn.title = toolTip;
	    }

	    if (action !== undefined) {
	      const keyListener = function () {
	        const actionCB = action;

	        return function (evt) {
	          if (evt.keyCode == KeyCodes.ENTER ||
	              evt.keyCode == KeyCodes.SPACE) {
	            actionCB(evt);
	          }
	        };
	      }();

	      btn.addEventListener('click', action);
	      btn.addEventListener('keydown', keyListener);
	    }

	    return btn;
	  }

	  /**
	   * Check if the given event relates to a button action.
	   *
	   * @param  {!Event} evt the event instance
	   * @return {boolean}
	   */
	  static isButtonAction (evt)
	  {
	    // Check for key-code in event
	    if (evt !== undefined) {
	      if (evt.keyCode !== undefined) {
	        // Key evnet
	        return evt.keyCode == KeyCodes.ENTER || evt.keyCode == KeyCodes.SPACE;
	      } else if (evt.button !== undefined) {
	        // Mouse event
	        return evt.button === 0;
	      }
	    }

	    return false;
	  }

	  /**
	   * Create a new ul element.
	   *
	   * @param  {string=} className the css class string
	   * @return {!Element} the new ul element
	   */
	  static createUL (className)
	  {
	    return UIUtil.createElement('ul', undefined, className);
	  }

	  /**
	   * Create a new li element.
	   *
	   * @param  {string=} className the css class string
	   * @return {!Element} the new li element
	   */
	  static createLI (className)
	  {
	    return UIUtil.createElement('li', undefined, className);
	  }

	  /**
	   * Create a new button input element.
	   *
	   * @param  {string=} text the link text
	   * @param  {string=} href the link href attribute
	   * @param  {string=} className the link css class string
	   * @param  {string=} toolTip the link tool tip
	   * @return {!Element} the new anchor (a) element
	   */
	  static createHref (text, href, className, toolTip)
	  {
	    const link = UIUtil.createElement('a', text, className);

	    if (href !== undefined) {
	      link.href = href;
	    }

	    if (toolTip !== undefined) {
	      link.title = toolTip;
	    }

	    return link;
	  }

	  /**
	   * Create a new single choice form element.
	   *
	   * @param  {!Array<string>} options the options to display
	   * @param  {number=} preSelected the index of the preselected entry
	   * @return {!Element} the new single choice form
	   */
	  static createSingleChoiceForm (options, preSelected)
	  {
	    if (preSelected === undefined) {
	      preSelected = 0;
	    }

	    const form = UIUtil.createElement('form', undefined, 'jsm-s-choice');

	    for (let i = 0; i < options.length; ++i) {
	      const btnID = THREE.Math.generateUUID();

	      const label = UIUtil.createElement('label');
	      label.innerHTML = options[i];
	      label.htmlFor = btnID;

	      const btn = UIUtil.createElement('input');
	      btn.id = btnID;
	      btn.type = 'radio';
	      btn.name = 'userOptions';
	      btn.value = options[i];

	      if (i === preSelected) {
	        btn.checked = true;
	      }

	      form.appendChild(btn);
	      form.appendChild(label);
	    }

	    form.onclick = function(event) { event.stopPropagation(); };

	    return form;
	  }

	  /**
	   * Create a new color chooser element.
	   *
	   * @param  {string} value the initial value
	   * @param  {string=} title the tool tip text
	   * @param  {string=} className the css class string
	   * @return {!Element} the new li element
	   */
	  static createColorChooser (value, title, className)
	  {
	    const chooser = UIUtil.createElement('input', undefined, className);
	    chooser.type = 'color';
	    chooser.value = value;

	    if (title) {
	      chooser.title = title;
	    }

	    return chooser;
	  }

	  /**
	   * Set the icon of an element.
	   *
	   * @param {!Element} element the element to set the icon class on
	   * @param {string} iconClass the new icon class
	   */
	  static setIcon (element, iconClass)
	  {
	    const iconClassIdx = element.className.indexOf('icon-');

	    if (iconClassIdx === -1) {
	      element.className += ' ' + iconClass;
	    } else {
	      const spaceCharIdx = element.className.indexOf(' ', iconClassIdx);

	      //console.log('Classes: ' + element.className + ' || IconIdx: ' + iconClassIdx + ' || SpaceIdx: ' + spaceCharIdx);

	      if (spaceCharIdx !== -1) {
	        // Intermediate class
	        element.className = element.className.slice(0, iconClassIdx) + iconClass + element.className.slice(spaceCharIdx - 1);
	      } else {
	        // Last class
	        element.className = element.className.slice(0, iconClassIdx) + iconClass;
	      }

	      //console.log('Classes-after: ' + element.className);
	    }
	  }

	  /**
	   * Convert the given time into MM:SS.cs format. E.g. 02:14.84
	   *
	   * @param  {number} time the time to convert
	   * @param  {boolean=} fillZero fill leading zero minutes
	   * @return {string} the time string
	   */
	  static toMMSScs (time, fillZero)
	  {
	    const millsNum = Math.round(time * 100);
	    let minutes = Math.floor(millsNum / 6000);
	    let seconds = Math.floor((millsNum - (minutes * 6000)) / 100);
	    let mills = millsNum - (seconds * 100) - (minutes * 6000);

	    if (fillZero && minutes < 10) { minutes = '0' + minutes; }
	    if (seconds < 10) { seconds = '0' + seconds; }
	    if (mills < 10) { mills = '0' + mills; }

	    return minutes + ':' + seconds + '.<small>' + mills + '</small>';
	  }

	  /**
	   * Convert the given time into MM:SS format. E.g. 02:14
	   *
	   * @param  {number} time the time to convert
	   * @param  {boolean=} fillZero fill leading zero minutes
	   * @return {string} the time string
	   */
	  static toMMSS (time, fillZero)
	  {
	    const secNum = Math.floor(time);
	    let minutes = Math.floor(secNum / 60);
	    let seconds = secNum - (minutes * 60);

	    if (fillZero && minutes < 10) { minutes = '0' + minutes; }
	    if (seconds < 10) { seconds = '0' + seconds; }

	    return minutes + ':' + seconds;
	  }

	  /**
	   * Simple event listener function to prevent further event propagation.
	   *
	   * @param {!Event} event the event
	   * @return {void}
	   */
	  static StopEventPropagationListener (event)
	  {
	    event.stopPropagation();
	  }

	  /**
	   * Filter a given list of elements by their tag name.
	   *
	   * @param  {!Array<!Element>} elements the elements to filter
	   * @param  {string} tagName the tag name of the elements of interest
	   * @return {!Array<!Element>}
	   */
	  static filterElements (elements, tagName)
	  {
	    const result = [];

	    for (let i = 0; i < elements.length; i++) {
	      if (elements[i].nodeName === tagName) {
	        result.push(elements[i]);
	      }
	    }

	    return result;
	  }

	  /**
	   * Check if the browser supports a fullscreen mode.
	   *
	   * @return {boolean} true if the browser supports a fullscreen mode, false if not
	   */
	  static isFullscreenEnabled ()
	  {
	    return document.fullscreenEnabled === true ||
	           document.mozFullScreenEnabled === true ||
	           document.msFullscreenEnabled === true ||
	           document.webkitFullscreenEnabled === true;
	  }

	  /**
	   * Check if the browser is currently in fullscreen mode.
	   *
	   * @return {boolean} true if the browser is currently in fullscreen mode, false if not
	   */
	  static inFullscreen ()
	  {
	    const fullscreenElement = UIUtil.getFullscreenElement();

	    return fullscreenElement !== undefined && fullscreenElement !== null;
	  }

	  /**
	   * Check if the browser supports a fullscreen mode.
	   *
	   * @return {(?Element | undefined)} the fullscreen element or undefined if no such element exists
	   */
	  static getFullscreenElement ()
	  {
	    if (document.fullscreenElement !== undefined) {
	      return document.fullscreenElement;
	    } else if (document.mozFullScreenElement !== undefined) {
	      return document.mozFullScreenElement;
	    } else if (document.msFullscreenElement !== undefined) {
	      return document.msFullscreenElement;
	    } else if (document.webkitFullscreenElement !== undefined) {
	      return document.webkitFullscreenElement;
	    } else {
	      return undefined;
	    }
	  }

	  /**
	   * Request fullscreen mode for the given element.
	   *
	   * @param {!Element} element the element to request fullscreen for
	   * @return {void}
	   */
	  static requestFullscreenFor (element)
	  {
	    if (element.requestFullscreen !== undefined) {
	      element.requestFullscreen();
	    } else if (element.mozRequestFullScreen !== undefined) {
	      element.mozRequestFullScreen();
	    } else if (element.webkitRequestFullscreen !== undefined) {
	      element.webkitRequestFullscreen();
	    } else if (element.msRequestFullscreen !== undefined) {
	      element.msRequestFullscreen();
	    }
	  }

	  /**
	   * Cancel the fullscreen mode.
	   *
	   * @return {void}
	   */
	  static cancelFullscreen ()
	  {
	    if (document.fullscreen && document.exitFullscreen !== undefined) {
	      document.exitFullscreen();
	    } else if (document.mozFullScreen && document.mozCancelFullScreen !== undefined) {
	      document.mozCancelFullScreen();
	    } else if (document.webkitIsFullScreen && document.webkitCancelFullScreen !== undefined) {
	      document.webkitCancelFullScreen();
	    } else if (document.msFullscreenEnabled && document.msExitFullscreen !== undefined) {
	      document.msExitFullscreen();
	    }
	  }
	}

	/**
	 * The DnDHandler class definition.
	 *
	 * @author Stefan Glaser
	 */
	class DnDHandler
	{
	  /**
	   * DnDHandler Constructor
	   */
	  constructor ()
	  {
	    /**
	     * The callback for publishing dropped files.
	     * @type {!Function | undefined}
	     */
	    this.onNewFilesDropped = undefined;


	    // -------------------- Listeners -------------------- //
	    /** @type {!Function} */
	    this.handleDragEnterListener = this.handleDragEnter.bind(this);
	    /** @type {!Function} */
	    this.handleDragEndListener = this.handleDragEnd.bind(this);
	    /** @type {!Function} */
	    this.handleDragOverListener = this.handleDragOver.bind(this);
	    /** @type {!Function} */
	    this.handleDropListener = this.handleDrop.bind(this);
	  }

	  /**
	   * Add Drag and Drop event listeners to the given element.
	   *
	   * @param {!Element} element the element to observe for dnd-events
	   */
	  addListeners (element)
	  {
	    element.addEventListener('dragenter', this.handleDragEnterListener, false);
	    element.addEventListener('dragover', this.handleDragOverListener, false);
	    element.addEventListener('dragleave', this.handleDragEndListener, false);
	    element.addEventListener('dragend', this.handleDragEndListener, false);
	    element.addEventListener('drop', this.handleDropListener, false);
	  }

	  /**
	   * Remove Drag and Drop event listeners from the given element.
	   *
	   * @param {!Element} element the element to unobserve
	   */
	  removeListeners (element)
	  {
	    element.removeEventListener('dragenter', this.handleDragEnterListener, false);
	    element.removeEventListener('dragover', this.handleDragOverListener, false);
	    element.removeEventListener('dragleave', this.handleDragEndListener, false);
	    element.removeEventListener('dragend', this.handleDragEndListener, false);
	    element.removeEventListener('drop', this.handleDropListener, false);
	  }

	  /**
	   * Reset a target element.
	   *
	   * @param {?EventTarget | ?Element} target the target element to reset
	   */
	  resetTarget (target)
	  {
	    if (target !== null) {
	      target.className = target.className.replace('dragging-over', '');
	    }
	  }

	  /**
	   * Handle a file drop event.
	   *
	   * @param {!Event} evt the drop event
	   */
	  handleDrop (evt)
	  {
	    evt.stopPropagation();
	    evt.preventDefault();

	    // rest target
	    this.resetTarget(evt.target);

	    if (this.onNewFilesDropped && evt.dataTransfer.files.length > 0) {
	      this.onNewFilesDropped(evt.dataTransfer.files);
	    }
	  }

	  /**
	   * Handle dragging enter.
	   *
	   * @param {!Event} evt the drag over event
	   */
	  handleDragEnter (evt)
	  {
	    // console.log('Drag Enter');
	    // console.log(evt.dataTransfer);

	    const dtItem = evt.dataTransfer.items[0];

	    if (dtItem && dtItem.kind === 'file') {
	      evt.target.className += ' dragging-over';
	    }
	  }

	  /**
	   * Handle dragging end/exit.
	   *
	   * @param {!Event} evt the drag event
	   */
	  handleDragEnd (evt)
	  {
	    // console.log('Drag End');
	    // console.log(evt.dataTransfer);

	    // rest target
	    this.resetTarget(evt.target);
	  }

	  /**
	   * Handle dragging over.
	   *
	   * @param {!Event} evt the drag over event
	   */
	  handleDragOver (evt)
	  {
	    // console.log('Drag over');
	    // console.log(evt.dataTransfer);

	    const dtItem = evt.dataTransfer.items[0];

	    if (dtItem && dtItem.kind === 'file') {
	      evt.stopPropagation();
	      evt.preventDefault();
	      evt.dataTransfer.dropEffect = 'copy';
	    }
	  }
	}

	/**
	 * @enum {string}
	 */
	const FullscreenManagerEvents = {
	  CHANGE: 'change',
	};

	/**
	 * Helper class for managinf fullscreen modi.
	 *
	 * @author Stefan Glaser
	 */
	class FullscreenManager extends EventDispatcher
	{
	  /**
	   * FullscreenManager Constructor.
	   *
	   * ::implements {IPublisher}
	   * ::implements {IEventDispatcher}
	   * @param {!Element} container the container of interest
	   */
	  constructor (container)
	  {
	    super();

	    /**
	     * The container of interest.
	     * @type {!Element}
	     */
	    this.container = container;


	    /**
	     * The change event.
	     * @type {!Object}
	     */
	    this.changeEvent = { type: FullscreenManagerEvents.CHANGE };


	    /** @type {!Function} */
	    this.handleFullscreenChangeListener = this.handleFullscreenChange.bind(this);


	    // Add fullscreen change listeners
	    document.addEventListener('fullscreenchange', this.handleFullscreenChangeListener);
	    document.addEventListener('mozfullscreenchange', this.handleFullscreenChangeListener);
	    document.addEventListener('msfullscreenchange', this.handleFullscreenChangeListener);
	    document.addEventListener('webkitfullscreenchange', this.handleFullscreenChangeListener);
	  }

	  /**
	   * Toggle fullscreen mode of container.
	   * @return {void}
	   */
	  toggleFullscreen ()
	  {
	    if (this.container === UIUtil.getFullscreenElement()) {
	      UIUtil.cancelFullscreen();
	    } else {
	      UIUtil.requestFullscreenFor(this.container);
	    }

	    // Publish change event
	    this.dispatchEvent(this.changeEvent);
	  }

	  /**
	   * Request fullscreen mode for container.
	   * @return {void}
	   */
	  requestFullscreen ()
	  {
	    if (this.container !== UIUtil.getFullscreenElement()) {
	      UIUtil.requestFullscreenFor(this.container);

	      // Publish change event
	      this.dispatchEvent(this.changeEvent);
	    }
	  }

	  /**
	   * Cancel fullscreen mode for container.
	   * @return {void}
	   */
	  cancelFullscreen ()
	  {
	    if (this.container === UIUtil.getFullscreenElement()) {
	      UIUtil.cancelFullscreen();

	      // Publish change event
	      this.dispatchEvent(this.changeEvent);
	    }
	  }

	  /**
	   * Check if the container is currently in fullscreen mode.
	   * @return {boolean} true, if in fullscreen mode, false otherwise
	   */
	  isFullscreen ()
	  {
	    return this.container === UIUtil.getFullscreenElement();
	  }

	  /**
	   * The callback triggered when the window enters / leaves fullscreen.
	   *
	   * @param  {!Object} event the event
	   * @return {void}
	   */
	  handleFullscreenChange (event)
	  {
	    // Publish change event
	    this.dispatchEvent(this.changeEvent);
	  }
	}

	/**
	 * The FPSMeter class definition.
	 *
	 * @author Stefan Glaser
	 */
	class FPSMeter
	{
	  /**
	   * FPSMeter Constructor
	   *
	   * @param {number=} size the history buffer size
	   */
	  constructor (size)
	  {
	    if (size === undefined || size < 1) {
	      size = 1;
	    }

	    /**
	     * The list of previous fps.
	     * @type {!Array<number>}
	     */
	    this.fpsHistory = [];

	    let i = size;
	    while (i--) {
	      this.fpsHistory.push(0);
	    }

	    /**
	     * The current second.
	     * @type {number}
	     */
	    this.currentSecond = -1;

	    /**
	     * The fps counter to the current second.
	     * @type {number}
	     */
	    this.currentFPS = 0;

	    /**
	     * Callback function to call when a new second began.
	     * @type {(!Function | undefined)}
	     */
	    this.onNewSecond = undefined;
	  }

	  /**
	   * Proceed fps counter.
	   *
	   * @param  {number} time the current time
	   * @return {void}
	   */
	  update (time)
	  {
	    if (this.currentSecond < 0) {
	      this.currentSecond = Math.floor(time);
	    } else {
	      const newSecond = Math.floor(time);

	      if (newSecond > this.currentSecond) {
	        // New second started
	        // console.log("FPS: " + this.currentFPS);

	        // Shift history entries by one
	        let i = this.fpsHistory.length - 1;
	        while (i--) {
	          this.fpsHistory[i + 1] = this.fpsHistory[i];
	        }

	        this.fpsHistory[0] = this.currentFPS;
	        this.currentFPS = 0;

	        this.currentSecond = newSecond;

	        if (this.onNewSecond !== undefined) {
	          this.onNewSecond();
	        }
	      }
	    }

	    this.currentFPS++;
	  }

	  /**
	   * Retrieve the fps to the previous second.
	   *
	   * @return {number} the fps in the previous second
	   */
	  getMostRecentFPS ()
	  {
	    return this.fpsHistory[0];
	  }
	}

	class Panel
	{
	  /**
	   * Panel Constructor
	   *
	   * @param {string=} className the css class string
	   */
	  constructor (className)
	  {
	    /**
	     * The component root element.
	     * @type {!Element}
	     */
	    this.domElement = UIUtil.createDiv(className);

	    /**
	     * Visibility change listener
	     * @type {!Function | undefined}
	     */
	    this.onVisibilityChanged = undefined;
	  }

	  /**
	   * Add (append) the given element to the panel.
	   *
	   * @param {!Element} element the element to add/append
	   */
	  appendChild (element)
	  {
	    this.domElement.appendChild(element);
	  }

	  /**
	   * Set this component visible or invisible.
	   *
	   * @param {boolean=} visible true for visible, false for invisible
	   */
	  setVisible (visible)
	  {
	    if (visible === undefined) {
	      visible = true;
	    }

	    const isVisible = UIUtil.isVisible(this.domElement);

	    if (isVisible !== visible) {
	      UIUtil.setVisibility(this.domElement, visible);
	      if (this.onVisibilityChanged) {
	        this.onVisibilityChanged(this);
	      }
	    }
	  }

	  /**
	   * Toggle visibility of panel.
	   */
	  toggleVisibility ()
	  {
	    const newVal = !UIUtil.isVisible(this.domElement);

	    UIUtil.setVisibility(this.domElement, newVal);
	      if (this.onVisibilityChanged) {
	        this.onVisibilityChanged(this);
	      }
	  }

	  /**
	   * Check if this component is currently visible.
	   *
	   * @return {boolean} true for visible, false for invisible
	   */
	  isVisible ()
	  {
	    return UIUtil.isVisible(this.domElement);
	  }
	}

	class GLInfoBoard extends Panel
	{
	  /**
	   * GLInfoBoard Constructor
	   *
	   * @param {!FPSMeter} fpsMeter the fps meter used by the gl panel
	   */
	  constructor (fpsMeter)
	  {
	    super('jsm-gl-info no-text-select');

	    /**
	     * The FPS meter instance.
	     * @type {!FPSMeter}
	     */
	    this.fpsMeter = fpsMeter;
	    this.fpsMeter.onNewSecond = this.handleNewSecond.bind(this);


	    const list = document.createElement('ul');
	    this.domElement.appendChild(list);

	    /**
	     * The FPS label.
	     * @type {!Element}
	     */
	    this.fpsLbl = UIUtil.createSpan('0');

	    const item = document.createElement('li');
	    item.appendChild(UIUtil.createSpan('FPS:', 'label'));
	    item.appendChild(this.fpsLbl);
	    list.appendChild(item);

	    /**
	     * The reosultion label.
	     * @type {!Element}
	     */
	    this.resolutionLbl = UIUtil.createSpan('0 x 0px');

	    // item = document.createElement('li');
	    // item.appendChild(UIUtil.createSpan('Resolution:', 'label'));
	    // item.appendChild(this.resolutionLbl);
	    // list.appendChild(item);
	  }

	  /**
	   * Set the fps label.
	   *
	   * @param {number} fps the current fps
	   */
	  setFPS (fps)
	  {
	    this.fpsLbl.innerHTML = fps;
	  }

	  /**
	   * Set the fps label.
	   *
	   * @param {number} width the monitor width
	   * @param {number} height the monitor height
	   */
	  setResolution (width, height)
	  {
	    this.resolutionLbl.innerHTML = '' + width + ' x ' + height + 'px';
	  }

	  /**
	   * FPSMeter->"onNewSecond" event listener.
	   */
	  handleNewSecond ()
	  {
	    this.fpsLbl.innerHTML = this.fpsMeter.fpsHistory[0];
	  }
	}

	/**
	 * The ICameraController interface definition.
	 *
	 * @author Stefan Glaser
	 */
	class ICameraController
	{
	  /**
	   * Enable/Disable the camera controller.
	   *
	   * @param {boolean} enabled true to enable the camera controller, false for disabling
	   */
	  setEnabled (enabled) {}

	  /**
	   * Set the bounds of the camera controller.
	   *
	   * @param  {!THREE.Vector3} bounds the new world bounds
	   * @return {void}
	   */
	  setBounds (bounds) {}

	  /**
	   * Set the area of interest (+/- dimensions around the origin).
	   *
	   * @param  {!THREE.Vector2} areaOfInterest the area of interest
	   * @return {void}
	   */
	  setAreaOfInterest (areaOfInterest) {}

	  /**
	   * Update the camera controller.
	   * The update is needed for keyboard movements, as well for tracking objects.
	   *
	   * @param  {number} deltaT the time since the last render call
	   * @return {void}
	   */
	  update (deltaT) {}
	}

	/**
	 * The GLPanel class definition.
	 *
	 * @author Stefan Glaser
	 */
	class GLPanel
	{
	  /**
	   * GLPanel Constructor
	   *
	   * @param {!Element} container the gl panel root dom element
	   */
	  constructor (container)
	  {
	    // Fetch initial container dimensions
	    const width = container.clientWidth;
	    const height = container.clientHeight;

	    /**
	     * The render interval.
	     * 1 --> the scene is rendered every cycle
	     * 2 --> the scene is rendered every second cycle
	     * 3 --> the scene is rendered every third cycle
	     * etc.
	     *
	     * @type {number}
	     */
	    this.renderInterval = 1;

	    /**
	     * The number of render cycles befor the next scene rendering.
	     * @type {number}
	     */
	    this.renderTTL = 1;

	    /**
	     * The time passed since the last render call.
	     * @type {number}
	     */
	    this.timeSinceLastRenderCall = 0;

	    /**
	     * The Camera instance.
	     * @type {!THREE.PerspectiveCamera}
	     */
	    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 2000);
	    this.camera.position.set(20, 15, 15);
	    this.camera.lookAt(new THREE.Vector3());
	    this.camera.updateMatrix();

	    /**
	     * The WebGLRenderer instance from threejs.
	     * @type {!THREE.WebGLRenderer}
	     */
	    this.renderer = new THREE.WebGLRenderer({ antialias: true });
	    this.renderer.setSize(width, height);
	    container.appendChild(this.renderer.domElement);

	    /**
	     * The Scene instance to render.
	     * @type {?THREE.Scene}
	     */
	    this.scene = null;

	    /**
	     * The camera controller.
	     * @type {?ICameraController}
	     */
	    this.cameraController = null;

	    /**
	     * The clock used to measure render times.
	     * @type {!THREE.Clock}
	     */
	    this.clock = new THREE.Clock(true);

	    /**
	     * A helper util for monitoring the fps of the monitor.
	     * @type {!FPSMeter}
	     */
	    this.fpsMeter = new FPSMeter(10);

	    /**
	     * The gl info board.
	     * @type {!GLInfoBoard}
	     */
	    this.glInfoBoard = new GLInfoBoard(this.fpsMeter);
	    this.glInfoBoard.setVisible(false);
	    container.appendChild(this.glInfoBoard.domElement);

	    /**
	     * A listener to notify when a render cycle was triggered.
	     * @type {(!Function | undefined)}
	     */
	    this.onNewRenderCycle = undefined;

	    /**
	     * The render function bound to this monitor instance.
	     * @type {!Function}
	     */
	    this.renderFunction = this.render.bind(this);


	    // Start animation
	    requestAnimationFrame(this.renderFunction);
	  }

	  /**
	   * The central gl render function.
	   *
	   * @return {void}
	   */
	  render ()
	  {
	    // Kepp render look alive
	    requestAnimationFrame(this.renderFunction);

	    // Fetch delta time sine last render call
	    this.timeSinceLastRenderCall = this.clock.getDelta();

	    // Print poor FPS info
	    if (this.timeSinceLastRenderCall > 0.5) {
	      console.log('LAAAAG: ' + this.timeSinceLastRenderCall);
	    }

	    // Update fps-meter
	    this.fpsMeter.update(this.clock.elapsedTime);

	    // Check for render interval
	    if (--this.renderTTL > 0) {
	      return;
	    } else {
	      this.renderTTL = this.renderInterval;
	    }

	    // Notify camera controller and render listener if present
	    if (this.onNewRenderCycle !== undefined) {
	      this.onNewRenderCycle(this.timeSinceLastRenderCall);
	    }
	    if (this.cameraController !== null) {
	      this.cameraController.update(this.timeSinceLastRenderCall);
	    }

	    // Render scene is present
	    if (this.scene !== null) {
	      this.renderer.render(this.scene, this.camera);
	    }
	  }

	  /**
	   * Automatically resize the gl canvas to fit its container.
	   *
	   * @return {void}
	   */
	  autoResize ()
	  {
	    const container = this.renderer.domElement.parentNode;

	    this.setDimensions(container.clientWidth, container.clientHeight);
	  }

	  /**
	   * Set the gl canvas dimensions.
	   *
	   * @param {number} width the canvas width
	   * @param {number} height the canvas height
	   */
	  setDimensions (width, height)
	  {
	    // Directly return if size hasn't changed
	    const size = this.renderer.getSize();
	    if (size.width === width && size.height === height) {
	      return;
	    }

	    // Update renderer size
	    this.renderer.setSize(width, height);

	    // Update camera parameters
	    this.camera.aspect = width / height;
	    this.camera.updateProjectionMatrix();

	    // Render as soon as possible
	    this.renderTTL = 0;
	  }
	}

	/**
	 * The UniversalCameraController class definition.
	 *
	 * @author Stefan Glaser
	 */
	class UniversalCameraController extends ICameraController
	{
	  /**
	   * Universal camera controller constructor
	   *
	   * @param {!THREE.PerspectiveCamera} camera the camera object
	   * @param {!Element} canvas the monitor canvas
	   */
	  constructor (camera, canvas)
	  {
	    super();

	    /**
	     * The camera object.
	     * @type {!THREE.PerspectiveCamera}
	     */
	    this.camera = camera;

	    /**
	     * The webgl renderer canvas object.
	     * @type {!Element}
	     */
	    this.canvas = canvas;

	    const scope = this;

	    /**
	     * The camera target position.
	     * @type {!THREE.Vector3}
	     */
	    this.targetPos = new THREE.Vector3(0, 105, 0);

	    /**
	     * The camera target rotation.
	     * @type {!THREE.Euler}
	     */
	    this.targetRot = new THREE.Euler(-Math.PI / 2, 0, 0, 'YXZ');
	    this.targetRot.onChange(function() {
	      scope.targetMatrix.makeRotationFromEuler(scope.targetRot);
	    });

	    /**
	     * The camera target rotation as matrix.
	     * A 3x3 Matrix would be enough, but the Matrix3 from threejs has only limited functionality.
	     * @type {!THREE.Matrix4}
	     */
	    this.targetMatrix = new THREE.Matrix4();
	    this.targetMatrix.makeRotationX(-Math.PI / 2);

	    /**
	     * The screen position where a rotation action was started, or null if no rotation action is active.
	     * @type {?THREE.Vector2}
	     */
	    this.rotateStart = null;

	    /**
	     * The screen position where a pan action was started, or null if no pan action is active.
	     * @type {?THREE.Vector2}
	     */
	    this.panStart = null;

	    /**
	     * The pan speed.
	     * @type {number}
	     */
	    this.panSpeed = 1;

	    /**
	     * The screen position where a zoom action was started, or null if no zoom action is active.
	     * @type {?THREE.Vector2}
	     */
	    this.zoomStart = null;

	    /**
	     * The current pan speed vector resulting from keyboard actions.
	     * @type {!THREE.Vector3}
	     */
	    this.currentSpeed = new THREE.Vector3();

	    /**
	     * The intended pan speed vector resulting from keyboard actions.
	     * @type {!THREE.Vector3}
	     */
	    this.intendedSpeed = new THREE.Vector3();

	    // Klick indicator sphere
	    const geometry = new THREE.SphereGeometry(0.05, 16, 16);
	    const material = new THREE.MeshPhongMaterial({ color: 0xaaaa00 });

	    /**
	     * The click indicator sphere.
	     * @type {!THREE.Mesh}
	     */
	    this.indicatorSphere = new THREE.Mesh(geometry, material);
	    this.indicatorSphere.name = 'camControlIndicatorSphere';
	    this.indicatorSphere.visible = false;

	    /**
	     * The click indicator sphere time to live.
	     * @type {number}
	     */
	    this.indicatorTTL = 0;

	    /**
	     * The area of interest.
	     * @type {!THREE.Vector2}
	     */
	    this.areaOfInterest = new THREE.Vector2(105, 68);

	    /**
	     * The camera controller bounds.
	     * @type {!THREE.Vector3}
	     */
	    this.bounds = new THREE.Vector3(500, 500, 500);

	    /**
	     * Enable/Disable camera controller.
	     * @type {boolean}
	     */
	    this.enabled = true;

	    /**
	     * The object to track or null if no object is currently tracked.
	     * @type {?THREE.Object3D}
	     */
	    this.trackingObject = null;
	  }

	  /**
	   * @override
	   * @param {boolean} enabled
	   */
	  setEnabled (enabled)
	  {
	    if (this.enabled !== enabled) {
	      this.enabled = enabled;

	      if (!enabled) {
	        this.rotateStart = null;
	        this.panStart = null;
	        this.zoomStart = null;
	        this.intendedSpeed.setScalar(0);
	      }
	    }
	  }

	  /**
	   * @override
	   * @param {!THREE.Vector3} bounds
	   */
	  setBounds (bounds)
	  {
	    this.bounds.copy(bounds);

	    // TODO: Clamp current camera position
	  }

	  /**
	   * @override
	   * @param {!THREE.Vector2} areaOfInterest
	   */
	  setAreaOfInterest (areaOfInterest)
	  {
	    this.areaOfInterest.copy(areaOfInterest);
	  }

	  /**
	   * @override
	   * @param  {number} deltaT
	   */
	  update (deltaT)
	  {
	    // Move camera according to speedVector
	    this.currentSpeed.lerp(this.intendedSpeed, 0.1);

	    if (this.currentSpeed.length() < 0.01) {
	      this.currentSpeed.setScalar(0);
	    } else {
	      this.move(this.currentSpeed.x, this.currentSpeed.z, this.currentSpeed.y);
	    }

	    this.camera.position.copy(this.targetPos);

	    if (this.trackingObject !== null) {
	      this.camera.lookAt(this.trackingObject.position);
	      this.targetRot.copy(this.camera.rotation);
	    } else {
	      this.camera.rotation.copy(this.targetRot);
	    }

	    if (this.indicatorSphere.visible && this.indicatorTTL-- < 0) {
	      this.indicatorSphere.visible = false;
	    }
	  }

	  /**
	   * Track the given object.
	   *
	   * @param  {?THREE.Object3D} obj the object to track with the camera
	   * @return {void}
	   */
	  trackObject (obj)
	  {
	    this.trackingObject = obj;
	  }

	  /**
	   * Set the indicator sphere to a certain position and give it 10 cycles TTL.
	   *
	   * @param {!THREE.Vector3} pos the target position
	   */
	  setIndicator (pos)
	  {
	    this.indicatorSphere.position.copy(pos);
	    this.indicatorSphere.visible = true;
	    this.indicatorTTL = 10;
	  }

	  /**
	   * [getCenterIntersectionPoint description]
	   *
	   * @param  {number} min the minimum distance
	   * @param  {number} max the maximum distance
	   * @return {{point: !THREE.Vector3, distance: number}}
	   */
	  getCenterIntersectionPoint (min, max)
	  {
	    let length = 0;
	    const dirVec = new THREE.Vector3();
	    dirVec.setFromMatrixColumn(this.targetMatrix, 2);
	    dirVec.negate();

	    if (dirVec.y < -0.01 || dirVec.y > 0.01) {
	      dirVec.multiplyScalar(Math.abs(this.targetPos.y / dirVec.y));
	      dirVec.clampLength(-max, max);
	      length = dirVec.length();
	    } else {
	      // Calculate a point maxLength or 100 meter away from the view direction
	      length = max;
	      dirVec.multiplyScalar(max / dirVec.length());
	    }

	    dirVec.add(this.targetPos);

	    this.setIndicator(dirVec);

	  //    console.log('At Point: ' + dirVec.x + ' ' + dirVec.y + ' ' + dirVec.z);
	    return { point: dirVec, distance: length };
	  }

	  /**
	   * [getIntersectionPoint description]
	   *
	   * @param  {!THREE.Vector2} clickPos
	   * @param  {number} min
	   * @param  {number} max
	   * @return {{point: !THREE.Vector3, distance: number}}
	   */
	  getIntersectionPoint (clickPos, min, max)
	  {
	    let length = 0;
	    const fovMax = Math.tan((this.camera.fov / 2) * Math.PI / 180.0) * 2;

	    const x = fovMax * clickPos.x / this.canvas.clientHeight;
	    const y = fovMax * clickPos.y / this.canvas.clientHeight;

	    const dirVec = new THREE.Vector3(x, y, -1);
	    dirVec.applyMatrix4(this.targetMatrix);

	    if (dirVec.y < -0.01 || dirVec.y > 0.01) {
	      dirVec.multiplyScalar(-this.targetPos.y / dirVec.y);
	      dirVec.clampLength(min, max);
	      length = dirVec.length();
	    } else {
	      // Calculate a point max length meter away from the view direction
	      length = max;
	      dirVec.multiplyScalar(max / dirVec.length());
	    }

	    dirVec.add(this.targetPos);

	    this.setIndicator(dirVec);

	  //    console.log('At Point: ' + dirVec.x + ' ' + dirVec.y + ' ' + dirVec.z);
	    return { point: dirVec, distance: length };
	  }

	  /**
	   * Set the traget rotation in degrees.
	   *
	   * @param {number} horizontalAngle
	   * @param {number} verticalAngle
	   */
	  setTargetRotDeg (horizontalAngle, verticalAngle)
	  {
	    this.setTargetRot(JsMath.toRad(horizontalAngle), JsMath.toRad(verticalAngle));
	  }

	  /**
	   * Set the target rotation in radians.
	   *
	   * @param {number} horizontalAngle
	   * @param {number} verticalAngle
	   */
	  setTargetRot (horizontalAngle, verticalAngle)
	  {
	    if (horizontalAngle > Math.PI) {
	      horizontalAngle -= Math.PI * 2;
	    } else if (horizontalAngle < -Math.PI) {
	      horizontalAngle += Math.PI * 2;
	    }

	    this.targetRot.set(THREE.Math.clamp(verticalAngle, -Math.PI / 2, Math.PI / 2), horizontalAngle, 0);
	  }

	  /**
	   * [shiftTargetRot description]
	   *
	   * @param  {number} horizontalShift
	   * @param  {number} verticalshift
	   * @return {void}
	   */
	  shiftTargetRot (horizontalShift, verticalshift)
	  {
	    this.setTargetRot(this.targetRot.y + horizontalShift, this.targetRot.x + verticalshift);
	  }

	  /**
	   * Set the target position of the camera.
	   *
	   * @param {number} x
	   * @param {number} y
	   * @param {number} z
	   */
	  setTargetPos (x, y, z)
	  {
	    this.targetPos.x = x;
	    this.targetPos.y = y;
	    this.targetPos.z = z;
	  }

	  /**
	   * Shift the target position of the camera.
	   *
	   * @param  {number} x
	   * @param  {number} y
	   * @param  {number} z
	   * @return {void}
	   */
	  shiftTargetPos (x, y, z)
	  {
	    this.targetPos.x += x;
	    this.targetPos.y += y;
	    this.targetPos.z += z;
	  }

	  /**
	   * Handle start rotation.
	   *
	   * @param  {!THREE.Vector2} pos
	   * @return {void}
	   */
	  handleStartRotate (pos)
	  {
	    if (this.enabled) {
	      this.rotateStart = new THREE.Vector2();
	      this.rotateStart.copy(pos);
	    }
	  }

	  /**
	   * Handle start pan.
	   *
	   * @param {!THREE.Vector2} pos
	   * @return {void}
	   */
	  handleStartPan (pos)
	  {
	    if (this.enabled) {
	      this.panStart = new THREE.Vector2();
	      this.panStart.copy(pos);

	      const dist = this.getIntersectionPoint(pos, 0.5, 100).distance;
	      this.panSpeed = dist * Math.tan((this.camera.fov / 2) * Math.PI / 180.0) * 2;
	    }
	  }

	  /**
	   * Handle start zoom.
	   *
	   * @param  {!THREE.Vector2} pos
	   * @return {void}
	   */
	  handleStartZoom (pos)
	  {
	    if (this.enabled) {
	      this.zoomStart = new THREE.Vector2();
	      this.zoomStart.copy(pos);
	    }
	  }

	  /**
	   * Handle end rotate.
	   *
	   * @return {void}
	   */
	  handleEndRotate ()
	  {
	    this.rotateStart = null;
	  }

	  /**
	   * Handle pan end.
	   *
	   * @return {void}
	   */
	  handleEndPan ()
	  {
	    this.panStart = null;
	  }

	  /**
	   * Handle zoom end.
	   *
	   * @return {void}
	   */
	  handleEndZoom ()
	  {
	    this.zoomStart = null;
	  }

	  /**
	   * Handle zoom end.
	   *
	   * @return {boolean}
	   */
	  isWaitingForMouseEvents ()
	  {
	    return this.rotateStart !== null || this.panStart !== null || this.zoomStart !== null;
	  }

	  /**
	   * Handle rotation.
	   *
	   * @param  {!THREE.Vector2} pos
	   * @return {void}
	   */
	  handleRotate (pos)
	  {
	    if (this.rotateStart === null) { return; }

	    const deltaX = this.rotateStart.x - pos.x;
	    const deltaY = pos.y - this.rotateStart.y;

	    this.shiftTargetRot(Math.PI * deltaX / this.canvas.clientHeight,
	                        Math.PI * deltaY / this.canvas.clientHeight);

	    this.rotateStart.set(pos.x, pos.y);
	  }

	  /**
	   * Handle pan.
	   *
	   * @param  {!THREE.Vector2} pos
	   * @return {void}
	   */
	  handlePan (pos)
	  {
	    if (this.panStart === null) { return; }

	    const deltaX = this.panStart.x - pos.x;
	    const deltaY = this.panStart.y - pos.y;

	    this.pan(this.panSpeed * deltaX / this.canvas.clientHeight,
	             this.panSpeed * deltaY / this.canvas.clientHeight,
	             0);

	    this.panStart.set(pos.x, pos.y);
	  }

	  /**
	   * Handle mouse zoom.
	   *
	   * @param  {!THREE.Vector2} pos
	   * @return {void}
	   */
	  handleMouseZoom (pos)
	  {
	    if (this.zoomStart === null) { return; }

	    // const deltaX = this.zoomStart.x - pos.x;
	    const deltaY = this.zoomStart.y - pos.y;

	    const dist = this.getCenterIntersectionPoint(1, 25).distance;
	    const zoomSpeed = dist * Math.tan((this.camera.fov / 2) * Math.PI / 180.0) * 2;

	    this.pan(0, 0, -5 * zoomSpeed * deltaY / this.canvas.clientHeight);

	    this.zoomStart.set(pos.x, pos.y);
	  }

	  /**
	   * Handle mouse wheel zoom.
	   *
	   * @param  {!THREE.Vector2} pos
	   * @param  {number} amount
	   * @return {void}
	   */
	  handleWheelZoom (pos, amount)
	  {
	    if (!this.enabled) { return; }

	    let distance = 0.02 * amount * Math.abs(this.targetPos.y) / 30;

	    if (distance < 0 && distance > -0.8) {
	      distance = -0.8;
	    } else if (distance > 0 && distance < 0.8) {
	      distance = 0.8;
	    }

	    this.pan(0, 0, distance);
	  }

	  /**
	   * Set a predefined cmaera pose.
	   *
	   * @param  {number=} id
	   * @return {void}
	   */
	  setPredefinedPose (id)
	  {
	    if (!this.enabled) { return; }

	    const length = this.areaOfInterest.x;
	    const width = this.areaOfInterest.y;

	    switch (id) {
	      case 1:
	        this.setTargetPos(-length * 0.8, length * 0.4, 0);
	        this.setTargetRotDeg(-90, -35);
	        break;
	      case 2:
	        this.setTargetPos(-length * 0.8, length * 0.4, width);
	        this.setTargetRotDeg(-50, -30);
	        break;
	      case 3:
	        this.setTargetPos(0, length * 0.4, width);
	        this.setTargetRotDeg(35, -40);
	        break;
	      case 4:
	        this.setTargetPos(0, length * 0.6, width * 1.1);
	        this.setTargetRotDeg(0, -45);
	        break;
	      case 5:
	        this.setTargetPos(0, length * 0.4, width);
	        this.setTargetRotDeg(-35, -40);
	        break;
	      case 6:
	        this.setTargetPos(length * 0.8, length * 0.4, width);
	        this.setTargetRotDeg(50, -30);
	        break;
	      case 7:
	        this.setTargetPos(length * 0.8, length * 0.4, 0);
	        this.setTargetRotDeg(90, -35);
	        break;
	      case 0:
	      default:
	        this.setTargetPos(0, length, 0);
	        this.setTargetRotDeg(0, -90);
	        break;
	    }
	  }

	  /**
	   * Set a predefined cmaera pose.
	   *
	   * @return {void}
	   */
	  moveLeft ()
	  {
	    if (!this.enabled) { return; }

	    const speed = this.areaOfInterest.x / 300;

	    this.intendedSpeed.x = -speed;
	    this.currentSpeed.x = -speed;
	  }

	  /**
	   * Set a predefined cmaera pose.
	   *
	   * @return {void}
	   */
	  moveRight ()
	  {
	    if (!this.enabled) { return; }

	    const speed = this.areaOfInterest.x / 300;

	    this.intendedSpeed.x = speed;
	    this.currentSpeed.x = speed;
	  }

	  /**
	   * Set a predefined cmaera pose.
	   *
	   * @return {void}
	   */
	  moveForward ()
	  {
	    if (!this.enabled) { return; }

	    const speed = this.areaOfInterest.x / 300;

	    this.intendedSpeed.z = -speed;
	    this.currentSpeed.z = -speed;
	  }

	  /**
	   * Set a predefined cmaera pose.
	   *
	   * @return {void}
	   */
	  moveBack ()
	  {
	    if (!this.enabled) { return; }

	    const speed = this.areaOfInterest.x / 300;

	    this.intendedSpeed.z = speed;
	    this.currentSpeed.z = speed;
	  }

	  /**
	   * Set a predefined cmaera pose.
	   *
	   * @return {void}
	   */
	  moveUp ()
	  {
	    if (!this.enabled) { return; }

	    const speed = this.areaOfInterest.x / 300;

	    this.intendedSpeed.y = speed;
	    this.currentSpeed.y = speed;
	  }

	  /**
	   * Set a predefined cmaera pose.
	   *
	   * @return {void}
	   */
	  moveDown ()
	  {
	    if (!this.enabled) { return; }

	    const speed = this.areaOfInterest.x / 300;

	    this.intendedSpeed.y = -speed;
	    this.currentSpeed.y = -speed;
	  }

	  /**
	   * Set a predefined cmaera pose.
	   *
	   * @return {void}
	   */
	  stopMoveLeftRight ()
	  {
	    this.intendedSpeed.x = 0;
	  }

	  /**
	   * Set a predefined cmaera pose.
	   *
	   * @return {void}
	   */
	  stopMoveForwardBack ()
	  {
	    this.intendedSpeed.z = 0;
	  }

	  /**
	   * Set a predefined cmaera pose.
	   *
	   * @return {void}
	   */
	  stopMoveUpDown ()
	  {
	    this.intendedSpeed.y = 0;
	  }

	  /**
	   * Perform pan.
	   *
	   * @param {number} panRight
	   * @param {number} panUp
	   * @param {number} panIn
	   * @return {void}
	   */
	  pan (panRight, panUp, panIn)
	  {
	    const v = new THREE.Vector3();
	    const t = new THREE.Vector3();

	    v.setFromMatrixColumn(this.targetMatrix, 0);
	    v.multiplyScalar(panRight);
	    t.setFromMatrixColumn(this.targetMatrix, 1);
	    t.multiplyScalar(panUp);
	    v.add(t);
	    t.setFromMatrixColumn(this.targetMatrix, 2);
	    t.multiplyScalar(panIn);
	    v.sub(t);

	    this.shiftTargetPos(v.x, v.y, v.z);
	  }

	  /**
	   * Perform move.
	   *
	   * @param {number} moveRight
	   * @param {number} moveIn
	   * @param {number} moveUp
	   * @return {void}
	   */
	  move (moveRight, moveIn, moveUp)
	  {
	    const v = new THREE.Vector3();
	    const t = new THREE.Vector3();

	    v.setFromMatrixColumn(this.targetMatrix, 0);
	    v.multiplyScalar(moveRight);
	    t.setFromMatrixColumn(this.targetMatrix, 2);
	    if (t.y < -0.99 || t.y > 0.99) {
	      t.setFromMatrixColumn(this.targetMatrix, 1);
	      t.negate();
	    }
	    t.y = 0;
	    t.normalize();
	    t.multiplyScalar(moveIn);
	    v.add(t);

	    this.shiftTargetPos(v.x, moveUp, v.z);
	  }
	}

	/**
	 * The InputController class definition.
	 *
	 * @author Stefan Glaser
	 */
	class InputController
	{
	  /**
	   * The monitor input controller.
	   *
	   * @param {!MonitorModel} model the monitor model instance
	   * @param {!GLPanel} glPanel the GL panel
	   * @param {!FullscreenManager} fullscreenManager the fullscreen manager
	   * @param {!DnDHandler} dndHandler the dnd-handler
	   */
	  constructor (model, glPanel, fullscreenManager, dndHandler)
	  {
	    /**
	     * The input controller element.
	     * @type {!Element}
	     */
	    this.domElement = document.createElement('div');
	    this.domElement.tabIndex = 0;
	    this.domElement.className = 'jsm-input-pane full-size';

	    // Create a drop indicator box
	    const dropBox = UIUtil.createDiv('dnd-box');
	    dropBox.innerHTML = '<span>Drop Replays or SServer Logs to Play</span>';
	    this.domElement.appendChild(dropBox);

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
	     * The dnd-handler instance.
	     * @type {!DnDHandler}
	     */
	    this.dndHandler = dndHandler;

	    /**
	     * The camera controller.
	     * @type {!UniversalCameraController}
	     */
	    this.camCon = new UniversalCameraController(glPanel.camera, glPanel.renderer.domElement);


	    /**
	     * Enable/Disable camera controller.
	     * @type {boolean}
	     */
	    this.enabled = true;

	    /**
	     * The selected object.
	     * @type {?MovableObject}
	     */
	    this.selectedObject = null;

	    /**
	     * Indicator if the current mouse event series indicates a select action.
	     * @type {boolean}
	     */
	    this.selectAction = false;

	    /**
	     * Indicator if the current mouse event series indicates a play/pause action.
	     * @type {boolean}
	     */
	    this.playPauseAction = false;

	    /**
	     * Indicator if document mouse listeners are active.
	     * @type {boolean}
	     */
	    this.docMouseEnabled = false;


	    this.onContextMenuListener = this.onContextMenu.bind(this);
	    this.onMouseDownListener = this.onMouseDown.bind(this);
	    this.onMouseUpListener = this.onMouseUp.bind(this);
	    this.onMouseMoveListener = this.onMouseMove.bind(this);
	    this.onMouseWheelListener = this.onMouseWheel.bind(this);
	    this.onMouseInListener = this.onMouseIn.bind(this);

	    this.onTouchStartListener = this.onTouchStart.bind(this);
	    this.onTouchEndListener = this.onTouchEnd.bind(this);
	    this.onTouchMoveListener = this.onTouchMove.bind(this);

	    this.onKeyDownListener = this.onKeyDown.bind(this);
	    this.onKeyPressedListener = this.onKeyPressed.bind(this);
	    this.onKeyUpListener = this.onKeyUp.bind(this);


	    // Add Drag and Drop listeners
	    this.dndHandler.addListeners(this.domElement);

	    this.domElement.addEventListener('contextmenu', this.onContextMenuListener);
	    this.domElement.addEventListener('mousedown', this.onMouseDownListener);
	    this.domElement.addEventListener('mousewheel', this.onMouseWheelListener);
	    this.domElement.addEventListener('MozMousePixelScroll', this.onMouseWheelListener); // firefox

	    // this.domElement.addEventListener('touchstart', this.onTouchStartListener);
	    // this.domElement.addEventListener('touchend', onTouchEnd);
	    // this.domElement.addEventListener('touchmove', onTouchMove);

	    this.domElement.addEventListener('keydown', this.onKeyDownListener);
	    this.domElement.addEventListener('keypress', this.onKeyPressedListener);
	    this.domElement.addEventListener('keyup', this.onKeyUpListener);

	    // Set camera controller on GL panel
	    glPanel.cameraController = this.camCon;
	  }

	  /**
	   * Enable/Disable the camera controller.
	   *
	   * @param {boolean} enabled true to enable the camera controller, false for disabling
	   */
	  setEnabled (enabled)
	  {
	    if (this.enabled !== enabled) {
	      this.enabled = enabled;
	    }
	  }

	  /**
	   * Select the given object.
	   *
	   * @param {?MovableObject} obj the object to select or null to clear the selection
	   */
	  selectObject (obj)
	  {
	    if (this.selectedObject !== null) {
	      this.selectedObject.setSelected(false);
	    }

	    this.selectedObject = obj;

	    if (this.selectedObject !== null) {
	      this.selectedObject.setSelected(true);
	    }
	  }

	  /**
	   * The on context menu event listener.
	   *
	   * @param  {!Event} event the event object
	   * @return {void}
	   */
	  onContextMenu (event)
	  {
	    if (!this.enabled) { return; }

	    event.preventDefault();
	  }

	  /**
	   * The on mouse down event listener.
	   *
	   * @param  {!Event} event the mouse event
	   * @return {void}
	   */
	  onMouseDown (event)
	  {
	    if (!this.enabled) { return; }

	    // console.log('InputCon: onMouseDown');

	    if (!this.docMouseEnabled) {
	      this.docMouseEnabled = true;
	      // console.log('InputCon: enable doc listeners');
	      document.addEventListener('mouseup', this.onMouseUpListener);
	      document.addEventListener('mousemove', this.onMouseMoveListener);
	      document.addEventListener('mouseover', this.onMouseInListener);
	    }

	    const clickPos = InputController.eventToLocalCenterPos(this.domElement, event);

	    switch (event.button) {
	      case THREE.MOUSE.LEFT:
	        this.camCon.handleStartRotate(clickPos);
	        this.selectAction = true;
	        break;
	      case THREE.MOUSE.MIDDLE:
	        this.camCon.handleStartZoom(clickPos);
	        this.playPauseAction = true;
	        break;
	      case THREE.MOUSE.RIGHT:
	        this.camCon.handleStartPan(clickPos);
	        break;
	    }
	  }

	  /**
	   * The on mouse up event listener.
	   *
	   * @param  {!Event} event the mouse event
	   * @return {void}
	   */
	  onMouseUp (event)
	  {
	    if (!this.enabled) { return; }

	    // console.log('InputCon: onMouseUp');

	    InputController.eventToLocalCenterPos(this.domElement, event);

	    switch (event.button) {
	      case THREE.MOUSE.LEFT:
	        this.camCon.handleEndRotate();

	        if (this.selectAction) {
	          // TODO: Try to select the actual object below the cursor
	          this.selectObject(null);
	        }
	        break;
	      case THREE.MOUSE.MIDDLE:
	        this.camCon.handleEndZoom();

	        if (this.playPauseAction) {
	          this.model.logPlayer.playPause();
	        }
	        break;
	      case THREE.MOUSE.RIGHT:
	        this.camCon.handleEndPan();
	        break;
	    }

	    if (!this.camCon.isWaitingForMouseEvents()) {
	      this.docMouseEnabled = false;
	      // console.log('InputCon: disable doc listeners');
	      document.removeEventListener('mouseup', this.onMouseUpListener);
	      document.removeEventListener('mousemove', this.onMouseMoveListener);
	      document.removeEventListener('mouseover', this.onMouseInListener);
	    }
	  }

	  /**
	   * The on mouse move event listener.
	   *
	   * @param  {!Event} event the mouse event
	   * @return {void}
	   */
	  onMouseMove (event)
	  {
	    if (!this.enabled) { return; }

	    // Prevent browser from selecting any text, drag/drop the element, etc.
	    event.preventDefault();
	    event.stopPropagation();

	    this.selectAction = false;
	    this.playPauseAction = false;

	    // console.log('InputCon: onMouseMove');

	    const clickPos = InputController.eventToLocalCenterPos(this.domElement, event);

	    this.camCon.handleRotate(clickPos);
	    this.camCon.handleMouseZoom(clickPos);
	    this.camCon.handlePan(clickPos);
	  }

	  /**
	   * The on mouse wheel event listener.
	   *
	   * @param  {!Event} event the mouse event
	   * @return {void}
	   */
	  onMouseWheel (event)
	  {
	    if (!this.enabled) { return; }

	    // Prevent browser from scrolling and other stuff
	    event.preventDefault();
	    event.stopPropagation();

	    // console.log('InputCon: onMouseWheel');

	    let scrollAmount = 0;

	    if (event.wheelDelta !== undefined) {
	      // WebKit / Opera / Explorer 9
	      scrollAmount = event.wheelDelta;
	    } else if (event.detail !== undefined) {
	      // Firefox
	      scrollAmount = -event.detail;
	    }

	    if (scrollAmount !== 0) {
	      const clickPos = InputController.eventToLocalCenterPos(this.domElement, event);

	      this.camCon.handleWheelZoom(clickPos, scrollAmount);
	    }
	  }

	  /**
	   * The on mouse in event listener.
	   *
	   * @param  {!Event} event the mouse event
	   * @return {void}
	   */
	  onMouseIn (event)
	  {
	    if (!this.enabled) { return; }

	    // console.log('InputCon: onMouseIn');

	    if ((0x01 & event.buttons) === 0) {
	      this.camCon.handleEndRotate();
	    }

	    if ((0x02 & event.buttons) === 0) {
	      this.camCon.handleEndPan();
	    }

	    if ((0x04 & event.buttons) === 0) {
	      this.camCon.handleEndZoom();
	    }

	    if (!this.camCon.isWaitingForMouseEvents()) {
	      this.docMouseEnabled = false;
	      // console.log('InputCon: disable doc listeners');
	      document.removeEventListener('mouseup', this.onMouseUpListener);
	      document.removeEventListener('mousemove', this.onMouseMoveListener);
	      document.removeEventListener('mouseover', this.onMouseInListener);
	    }
	  }

	  /**
	   * The on touch start event listener.
	   *
	   * @param  {!Event} event te touch event
	   * @return {void}
	   */
	  onTouchStart (event)
	  {
	    if (!this.enabled) { return; }

	    // console.log('InputCon: onTouchStart');
	  }

	  /**
	   * The on touch end event listener.
	   *
	   * @param  {!Event} event te touch event
	   * @return {void}
	   */
	  onTouchEnd (event)
	  {
	    if (!this.enabled) { return; }

	    // console.log('InputCon: onTouchEnd');
	  }

	  /**
	   * The on touch move event listener.
	   *
	   * @param  {!Event} event te touch event
	   * @return {void}
	   */
	  onTouchMove (event)
	  {
	    if (!this.enabled) { return; }

	    // console.log('InputCon: onTouchMove');
	  }

	  /**
	   * The on key down event listener.
	   *
	   * @param  {!Event} event the key event
	   * @return {void}
	   */
	  onKeyDown (event)
	  {
	    if (!this.enabled) { return; }

	    // console.log('InputCon: onKeyDown');
	    // console.log(event);

	    switch (event.keyCode) {
	      case KeyCodes.LEFT:
	      case KeyCodes.A:
	        this.camCon.moveLeft();
	        break;
	      case KeyCodes.UP:
	      case KeyCodes.W:
	        this.camCon.moveForward();
	        break;
	      case KeyCodes.RIGHT:
	      case KeyCodes.D:
	        this.camCon.moveRight();
	        break;
	      case KeyCodes.DOWN:
	      case KeyCodes.S:
	        this.camCon.moveBack();
	        break;
	      case KeyCodes.PAGE_UP:
	      case KeyCodes.Q:
	        this.camCon.moveUp();
	        break;
	      case KeyCodes.PAGE_DOWN:
	      case KeyCodes.E:
	        this.camCon.moveDown();
	        break;
	    }
	  }

	  /**
	   * The on key down event listener.
	   *
	   * @param  {!Event} event the key event
	   * @return {void}
	   */
	  onKeyPressed (event)
	  {
	    if (!this.enabled) { return; }

	    let preventDefault = false;

	    // console.log('InputCon: onKeyDown ' + event.key);
	    // console.log(event);

	    switch (event.charCode) {
	      case CharCodes.ZERO:
	        // Select the ball object
	        this.selectObject(this.model.world.ball);
	        break;
	      case CharCodes.ONE:
	        this.camCon.setPredefinedPose(0);
	        break;
	      case CharCodes.TWO:
	        this.camCon.setPredefinedPose(1);
	        break;
	      case CharCodes.THREE:
	        this.camCon.setPredefinedPose(2);
	        break;
	      case CharCodes.FOUR:
	        this.camCon.setPredefinedPose(3);
	        break;
	      case CharCodes.FIVE:
	        this.camCon.setPredefinedPose(4);
	        break;
	      case CharCodes.SIX:
	        this.camCon.setPredefinedPose(5);
	        break;
	      case CharCodes.SEVEN:
	        this.camCon.setPredefinedPose(6);
	        break;
	      case CharCodes.EIGHT:
	        this.camCon.setPredefinedPose(7);
	        break;
	      case CharCodes.NINE:
	        break;
	      case CharCodes.p:
	        this.model.logPlayer.playPause();
	        break;
	      case CharCodes.PLUS:
	        if (!event.ctrlKey) {
	          this.model.logPlayer.step();
	        }
	        break;
	      case CharCodes.MINUS:
	        if (!event.ctrlKey) {
	          this.model.logPlayer.step(true);
	        }
	        break;
	      case CharCodes.SPACE:
	        // Prevent browser from scrolling
	        preventDefault = true;

	        // Toggle tracking of ball
	        if (this.camCon.trackingObject === null) {
	          this.camCon.trackObject(this.model.world.ball.objGroup);
	        } else {
	          this.camCon.trackObject(null);
	        }
	        break;
	      case CharCodes.ENTER:
	        if (event.ctrlKey) {
	          this.fullscreenManager.toggleFullscreen();
	        }
	        break;
	    }


	    if (event.charCode === 0) {
	      // Some keys don't provide char codes
	      switch (event.keyCode) {
	        case KeyCodes.ENTER:
	          if (event.ctrlKey) {
	            this.fullscreenManager.toggleFullscreen();
	          }
	          break;
	      }
	    }


	    if (preventDefault) {
	      event.preventDefault();
	      event.stopPropagation();
	    }
	  }

	  /**
	   * The on key up event listener.
	   *
	   * @param  {!Event} event the key event
	   * @return {void}
	   */
	  onKeyUp (event)
	  {
	    if (!this.enabled) { return; }

	    // console.log('InputCon: onUp');
	    // console.log(event);

	    switch (event.keyCode) {
	      case KeyCodes.LEFT:
	      case KeyCodes.A:
	      case KeyCodes.RIGHT:
	      case KeyCodes.D:
	        this.camCon.stopMoveLeftRight();
	        break;
	      case KeyCodes.UP:
	      case KeyCodes.W:
	      case KeyCodes.DOWN:
	      case KeyCodes.S:
	        this.camCon.stopMoveForwardBack();
	        break;
	      case KeyCodes.PAGE_UP:
	      case KeyCodes.Q:
	      case KeyCodes.PAGE_DOWN:
	      case KeyCodes.E:
	        this.camCon.stopMoveUpDown();
	        break;
	    }
	  }



	  /**
	   * Extract the event position relative to the given element.
	   *
	   * @param  {!Element} element the parent element
	   * @param  {!Event} event the event
	   * @return {!THREE.Vector2}
	   */
	  static eventToLocalPos (element, event)
	  {
	    const rect = element.getBoundingClientRect();

	    return new THREE.Vector2(event.clientX - rect.left, event.clientY - rect.top);
	  }

	  /**
	   * Extract the event position relative to the center of the given element.
	   *
	   * @param  {!Element} element the parent element
	   * @param  {!Event} event the event
	   * @return {!THREE.Vector2}
	   */
	  static eventToLocalCenterPos (element, event)
	  {
	    const halfWidth = element.clientWidth / 2;
	    const halfHeight = element.clientHeight / 2;
	    const rect = element.getBoundingClientRect();

	    return new THREE.Vector2(event.clientX - rect.left - halfWidth, halfHeight - event.clientY + rect.top);
	  }
	}

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

	/**
	 * The Overlay class definition.
	 *
	 * The Overlay abstracts
	 *
	 * @author Stefan Glaser / http://chaosscripting.net
	 */
	class Overlay extends Panel
	{
	  /**
	   * Overlay Constructor
	   *
	   * @param {string=} className the css class string of the inner panel
	   * @param {boolean=} hideOnClick true if clicking on inner panel should cause the overlay to close, false if not (default: false)
	   */
	  constructor (className, hideOnClick)
	  {
	    super('overlay full-size');

	    /**
	     * The inner overlay panel.
	     * @type {!Element}
	     */
	    this.innerElement = UIUtil.createDiv(className);
	    this.domElement.appendChild(this.innerElement);

	    const scope = this;

	    /** @param {!Event} event */
	    const hideOverlay = function(event) {
	      scope.setVisible(false);
	      event.stopPropagation();
	    };

	    // Add mouse and touch listener
	    this.domElement.addEventListener('mousedown', hideOverlay);
	    this.domElement.addEventListener('ontouchstart', hideOverlay);

	    if (!hideOnClick) {
	      this.innerElement.addEventListener('mousedown', UIUtil.StopEventPropagationListener);
	      this.innerElement.addEventListener('ontouchstart', UIUtil.StopEventPropagationListener);
	    }

	    this.setVisible(false);
	  }
	}

	/**
	 * The InfoOverlay class definition.
	 *
	 * @author Stefan Glaser
	 */
	class InfoOverlay extends Overlay
	{
	  /**
	   * InfoOverlay Constructor
	   */
	  constructor ()
	  {
	    super('info-pane centered');

	    this.innerElement.innerHTML = '<h1>JaSMIn</h1>' +
	        '<h4>Javascript Soccer Monitor Interface</h4>' +
	        '<h5>v' + REVISION + '</h5>' +
	        '<a href="https://gitlab.com/robocup-sim/JaSMIn" target="_blank">JaSMIn on GitLab</a>' +
	        '<h6>Author</h6>' +
	        '<span class="author">Stefan Glaser</span>' +
	        '<h6>Acknowledgements</h6>' +
	        '<span class="acknowledgement">JaSMIn is using <a href="https://www.threejs.org">threejs</a> for webgl rendering.</span>' +
	        '<span class="acknowledgement">The 3D models and textures are partially taken from ' +
	          '<a href="https://github.com/magmaOffenburg/RoboViz">RoboViz</a>' +
	          ', respectively <a href="https://sourceforge.net/projects/simspark/">SimSpark</a>.' +
	        '</span>';
	  }
	}

	class PanelGroup
	{
	  /**
	   * PanelGroup Constructor
	   */
	  constructor ()
	  {
	    /**
	     * The list of panels in this group.
	     * @type {!Array<!Panel>}
	     */
	    this.panels = [];


	    /**
	     * The currently active panel.
	     * @type {?Panel}
	     */
	    this.activePanel = null;



	    // -------------------- Listeners -------------------- //
	    /** @type {!Function} */
	    this.visibilityListener = this.onVisibilityChanged.bind(this);
	  }

	  /**
	   * Add the given panel to the group.
	   *
	   * @param  {!Panel} panel the panel to add
	   */
	  add (panel)
	  {
	    // Check if panel is already in the list of panels
	    if (this.panels.indexOf(panel) !== -1) {
	      return;
	    }

	    // Hide new panel
	    UIUtil.setVisibility(panel.domElement, false);

	    // Add new panel to group list
	    this.panels.push(panel);

	    // Add visibility change listener
	    panel.onVisibilityChanged = this.visibilityListener;
	  };



	  /**
	   * Check if this group has an active (visible) panel.
	   *
	   * @return {boolean} true if an panel in this group is active (visible), false otherwise
	   */
	  hasActivePanel ()
	  {
	    return this.activePanel !== null;
	  };



	  /**
	   * Hide all (the currently active) panel.
	   */
	  hideAll ()
	  {
	    if (this.activePanel !== null) {
	      UIUtil.setVisibility(this.activePanel.domElement, false);
	      this.activePanel = null;
	    }
	  };



	  /**
	   * Panel visibility change listener.
	   *
	   * @param  {!Panel} panel the panel which visibility changed
	   */
	  onVisibilityChanged (panel)
	  {
	    if (panel.isVisible()) {
	      for (let i = 0; i < this.panels.length; i++) {
	        if (this.panels[i] !== panel) {
	          UIUtil.setVisibility(this.panels[i].domElement, false);
	        }
	      }

	      this.activePanel = panel;
	    } else if (this.activePanel === panel) {
	      this.activePanel = null;
	    }
	  }
	}

	class SingleChoiceItem
	{
	  /**
	   * SingleChoiceItem Constructor
	   *
	   * @param {string} name the name to display
	   * @param {!Array<string>} options the options to display
	   * @param {number=} preSelected the index of the preselected entry
	   * @param {string=} itemClass the css class string
	   */
	  constructor (name, options, preSelected, itemClass)
	  {
	    /**
	     * The form element.
	     * @type {!Element}
	     */
	    this.domElement = UIUtil.createLI(itemClass);

	    // Add a label
	    this.domElement.appendChild(UIUtil.createSpan(name));

	    // Add a spacer
	    this.domElement.appendChild(UIUtil.createDiv('spcaer'));

	    /**
	     * The single choice form element.
	     * @type {!Element}
	     */
	    this.form = UIUtil.createSingleChoiceForm(options, preSelected);
	    this.domElement.appendChild(this.form);


	    // Add form change listener
	    this.form.onchange = this.onFormChangeListener.bind(this);


	    /**
	     * The callback funtion when the selection of this item changed.
	     * @type {!Function | undefined}
	     */
	    this.onChanged = undefined;
	  }

	  /**
	   * Change listener callback function for single choice form element.
	   *
	   * @return {void}
	   */
	  onFormChangeListener ()
	  {
	    const options = this.form.elements['userOptions'];
	    let i = options.length;

	    while (i--) {
	      if (options[i].checked) {
	        if (this.onChanged) {
	          this.onChanged(i, options[i].value);
	        }
	        return;
	      }
	    }

	    if (this.onChanged) {
	      this.onChanged();
	    }
	  }

	  /**
	   * Select the option with the given index.
	   *
	   * @param  {number} idx the index to select
	   * @return {void}
	   */
	  selectIndex (idx)
	  {
	    const option = this.form.elements['userOptions'][idx];

	    if (option !== undefined) {
	      option.checked = true;
	    }
	  }

	  /**
	   * Select the option with the given value.
	   *
	   * @param  {string} value the value of the checkbox to select
	   * @return {void}
	   */
	  selectOption (value)
	  {
	    const options = this.form.elements['userOptions'];
	    let i = options.length;

	    while (i--) {
	      if (options[i].value == value) {
	        if (options[i].checked != true) {
	          options[i].checked = true;
	        }
	        return;
	      }
	    }
	  }
	}

	class ToggleItem extends SingleChoiceItem
	{
	  /**
	   * ToggleItem Constructor
	   *
	   * @param {string} name the name to display
	   * @param {string} on the label title on the on choice
	   * @param {string} off the label title on the off choice
	   * @param {boolean=} state the initial state of the item (true: on, false: off (default))
	   * @param {string=} itemClass the css class string
	   */
	  constructor (name, on, off, state, itemClass)
	  {
	    super(name, [on, off], state ? 0 : 1, 'toggle-item' + (itemClass === undefined ? '' : ' ' + itemClass));


	    // Add item onclick listener
	    this.domElement.onclick = this.toggle.bind(this);
	  }

	  /**
	   * @override
	   */
	  onFormChangeListener ()
	  {
	    if (this.onChanged) {
	      this.onChanged(this.form.elements['userOptions'][0].checked == true);
	    }
	  }

	  /**
	   * Toggle the state of this item.
	   *
	   * @return {void}
	   */
	  toggle ()
	  {
	    const wasOn = this.form.elements['userOptions'][0].checked == true;
	    if (wasOn) {
	      this.form.elements['userOptions'][1].checked = true;
	    } else {
	      this.form.elements['userOptions'][0].checked = true;
	    }

	    if (this.onChanged) {
	      this.onChanged(!wasOn);
	    }
	  }

	  /**
	   * Toggle the state of this item.
	   *
	   * @param {boolean} on true if the toggle item is on, false if off
	   * @return {void}
	   */
	  setState (on)
	  {
	    if (on) {
	      this.form.elements['userOptions'][0].checked = true;
	    } else {
	      this.form.elements['userOptions'][1].checked = true;
	    }
	  }
	}

	/**
	 * The PlaylistOverlay class definition.
	 *
	 * @author Stefan Glaser
	 */
	class PlaylistOverlay extends Overlay
	{
	  /**
	   * PlaylistOverlay Constructor
	   *
	   * @param {!LogPlayer} logPlayer the log player model instance
	   */
	  constructor (logPlayer)
	  {
	    super('jsm-playlist');

	    /**
	     * The log player model instance.
	     * @type {!LogPlayer}
	     */
	    this.logPlayer = logPlayer;

	    /**
	     * The playlist instance.
	     * @type {?Playlist}
	     */
	    this.playlist = logPlayer.playlist;


	    const titleBar = UIUtil.createDiv('title-bar');
	    this.innerElement.appendChild(titleBar);

	    /**
	     * The playlist title label.
	     * @type {!Element}
	     */
	    this.titleLbl = UIUtil.createSpan('My Playlist', 'title');
	    titleBar.appendChild(this.titleLbl);


	    const settingsBar = UIUtil.createDiv('settings-bar');
	    this.innerElement.appendChild(settingsBar);

	    const autoplayLbl = UIUtil.createSpan('Autoplay', 'label');
	    autoplayLbl.title = 'Toggle Autoplay';
	    autoplayLbl.onclick = this.toggleAutoplay.bind(this);
	    settingsBar.appendChild(autoplayLbl);

	    /**
	     * The single choice form element.
	     * @type {!Element}
	     */
	    this.autoplayForm = UIUtil.createSingleChoiceForm(['On', 'Off']);
	    settingsBar.appendChild(this.autoplayForm);
	    this.autoplayForm.onchange = this.handleAutoplayFormChange.bind(this);


	    const contentBox = UIUtil.createDiv('content-box');
	    this.innerElement.appendChild(contentBox);

	    /**
	     * The playlist entry list.
	     * @type {!Element}
	     */
	    this.entryList = UIUtil.createUL('playlist');
	    contentBox.appendChild(this.entryList);


	    // -------------------- Listeners -------------------- //
	    /** @type {!Function} */
	    this.handlePlaylistChangeListener = this.handlePlaylistChange.bind(this);

	    /** @type {!Function} */
	    this.handlePlaylistUpdateListener = this.handlePlaylistUpdate.bind(this);
	    /** @type {!Function} */
	    this.handleAutoplayChangeListener = this.refreshAutoplay.bind(this);
	    /** @type {!Function} */
	    this.refreshSelectionsListener = this.refreshSelections.bind(this);
	    /** @type {!Function} */
	    this.refreshListingListener = this.refreshListing.bind(this);

	    /** @type {!Function} */
	    this.playEntryListener = this.playEntry.bind(this);


	    // Add log player change listeners
	    this.logPlayer.addEventListener(LogPlayerEvents.PLAYLIST_CHANGE, this.handlePlaylistChangeListener);
	    this.logPlayer.addEventListener(LogPlayerEvents.GAME_LOG_CHANGE, this.refreshSelectionsListener);

	    if (this.playlist !== null) {
	      this.refreshListing();
	      this.refreshAutoplay();

	      this.playlist.addEventListener(PlaylistEvents.UPDATE, this.handlePlaylistUpdateListener);
	      this.playlist.addEventListener(PlaylistEvents.CHANGE, this.refreshListingListener);
	      this.playlist.addEventListener(PlaylistEvents.ACTIVE_CHANGE, this.refreshSelectionsListener);
	      this.playlist.addEventListener(PlaylistEvents.AUTOPLAY_CHANGE, this.handleAutoplayChangeListener);
	    }
	  }

	  /**
	   * Refresh the playlist items.
	   *
	   * @return {void}
	   */
	  refreshListing ()
	  {
	    let entryIndex = 0;
	    let child;
	    let entry;
	    let newEntries = [];
	    const playingIdx = this.logPlayer.playlistIndex;
	    let selectedIdx = -1;

	    if (this.playlist !== null) {
	      selectedIdx = this.playlist.activeIndex;
	      newEntries = this.playlist.entries;

	      this.titleLbl.innerHTML = this.playlist.title;
	    } else {
	      this.titleLbl.innerHTML = 'n/a';
	    }

	    // Update all entry item nodes in entry list
	    for (let i = 0; i < this.entryList.children.length; i++) {
	      child = this.entryList.children[i];

	      if (child.nodeName === 'LI') {
	        entry = newEntries[entryIndex];

	        // Refresh item entry
	        this.refreshEntry(child, entry, entryIndex);
	        this.refreshEntryClass(child, playingIdx, selectedIdx);

	        entryIndex++;
	      }
	    }

	    // Check if we need to add further item nodes
	    while (entryIndex < newEntries.length) {
	      entry = newEntries[entryIndex];
	      child = UIUtil.createLI('entry');
	      child.tabIndex = 0;

	      this.refreshEntry(child, entry, entryIndex);
	      this.refreshEntryClass(child, playingIdx, selectedIdx);

	      child.addEventListener('click', this.playEntryListener, false);
	      child.addEventListener('keydown', this.playEntryListener, false);

	      this.entryList.appendChild(child);

	      entryIndex++;
	    }

	    // TODO: Think about removing dead entries again, as switching from a very long to a rather short playlist may cause a lot of them...
	  }

	  /**
	   * Refresh the css class of the given item entry.
	   *
	   * @param {!Element} item the list item element
	   * @param {number} playingIdx the index of the currently played game log
	   * @param {number} selectedIdx the index of the currently selected game log
	   * @return {void}
	   */
	  refreshEntryClass (item, playingIdx, selectedIdx)
	  {
	    const entryIdx = parseInt(item.dataset.entryIdx, 10);

	    item.className = 'entry';
	    if (entryIdx === playingIdx) {
	      item.className += ' playing';
	    } else if (entryIdx === selectedIdx) {
	      item.className += ' selected';
	    }

	    if (item.dataset.valid !== 'true') {
	      item.className += ' error';
	    }
	  }

	  /**
	   * Refresh the given item entry.
	   *
	   * @param {!Element} item the list item element
	   * @param {!GameLogEntry=} entry the game log entry instance
	   * @param {number=} index the entry index
	   * @return {void}
	   */
	  refreshEntry (item, entry, index)
	  {
	    if (index === undefined || entry === undefined) {
	      // Clear item...
	      item.dataset.entryIdx = -1;
	      item.dataset.valid = 'false';
	      item.title = '';
	      item.innerHTML = '';

	      // ... and hide it
	      UIUtil.setVisibility(item, false);
	    } else {
	      // Update item data...
	      item.dataset.entryIdx = index;
	      item.dataset.valid = entry.errorMsg === null;
	      item.title = entry.errorMsg !== null ? entry.errorMsg : '';

	      // if (entry.info) {
	      //   item.innerHTML = entry.info.leftTeamName + ' vs ' + entry.info.rightTeamName;
	      // } else {
	        item.innerHTML = entry.title;
	      // }


	      // ... and ensure it's visible
	      UIUtil.setVisibility(item, true);
	    }
	  }

	  /**
	   * Refresh the autoplay toggle button.
	   *
	   * @return {void}
	   */
	  refreshAutoplay ()
	  {
	    if (this.playlist !== null) {
	      this.autoplayForm.elements['userOptions'][this.playlist.autoplay ? 0 : 1].checked = true;
	    }
	  }

	  /**
	   * Refresh the selection status of the playlist items.
	   *
	   * @return {void}
	   */
	  refreshSelections ()
	  {
	    if (this.playlist !== null) {
	      const playingIdx = this.logPlayer.playlistIndex;
	      const selectedIdx = this.playlist.activeIndex;
	      let child;

	      // Update all entry item nodes in entry list
	      for (let i = 0; i < this.entryList.children.length; i++) {
	        child = this.entryList.children[i];

	        if (child.nodeName === 'LI') {
	          this.refreshEntryClass(child, playingIdx, selectedIdx);
	        }
	      }
	    }
	  }

	  /**
	   * Action handler for playing en entry of the playlist.
	   *
	   * @param {!Event} evt the click event
	   * @return {void}
	   */
	  playEntry (evt)
	  {
	    if (!UIUtil.isButtonAction(evt)) {
	      return;
	    }

	    if (this.playlist !== null) {
	      const idx = evt.target.dataset.entryIdx;

	      if (idx !== undefined && evt.target.dataset.valid === 'true') {
	        this.playlist.setActiveIndex(parseInt(idx, 10));
	      }
	    }
	  }

	  /**
	   * Change listener callback function for the autoplay single choice form element.
	   *
	   * @return {void}
	   */
	  handleAutoplayFormChange ()
	  {
	    if (this.playlist === null) {
	      return;
	    }

	    if (this.autoplayForm.elements['userOptions'][0].checked) {
	      // Autoplay is on
	      this.playlist.setAutoplay(true);
	    } else {
	      // Autoplay is off
	      this.playlist.setAutoplay(false);
	    }
	  }

	  /**
	   * Toggle autoplay of the playlist.
	   *
	   * @return {void}
	   */
	  toggleAutoplay ()
	  {
	    if (this.playlist !== null) {
	      this.playlist.setAutoplay(!this.playlist.autoplay);
	    }
	  }

	  /**
	   * Handle playlist updated event.
	   *
	   * @param {!Object} evt the event object
	   * @return {void}
	   */
	  handlePlaylistUpdate (evt)
	  {
	    const entryIdx = evt.index;
	    const entry = evt.entry;

	    // Update all entry item nodes in entry list
	    for (let i = 0; i < this.entryList.children.length; i++) {
	      const child = this.entryList.children[i];

	      if (child.nodeName === 'LI') {
	        if (entryIdx === parseInt(child.dataset.entryIdx, 10)) {
	          if (entry.errorMsg !== null) {
	            child.dataset.valid = false;
	            child.title = entry.errorMsg;
	          } else {
	            child.dataset.valid = true;
	            child.title = '';
	          }

	          this.refreshEntryClass(child, this.logPlayer.playlistIndex, this.playlist.activeIndex);
	          break;
	        }
	      }
	    }
	  }

	  /**
	   * Handle playlist change.
	   *
	   * @param {!Object} evt the change event
	   * @return {void}
	   */
	  handlePlaylistChange (evt)
	  {
	    if (this.playlist !== null) {
	      this.playlist.removeEventListener(PlaylistEvents.UPDATE, this.handlePlaylistUpdateListener);
	      this.playlist.removeEventListener(PlaylistEvents.CHANGE, this.refreshListingListener);
	      this.playlist.removeEventListener(PlaylistEvents.ACTIVE_CHANGE, this.refreshSelectionsListener);
	      this.playlist.removeEventListener(PlaylistEvents.AUTOPLAY_CHANGE, this.handleAutoplayChangeListener);
	    }

	    this.playlist = this.logPlayer.playlist;
	    this.refreshListing();
	    this.refreshAutoplay();

	    if (this.playlist !== null) {
	      this.playlist.addEventListener(PlaylistEvents.UPDATE, this.handlePlaylistUpdateListener);
	      this.playlist.addEventListener(PlaylistEvents.CHANGE, this.refreshListingListener);
	      this.playlist.addEventListener(PlaylistEvents.ACTIVE_CHANGE, this.refreshSelectionsListener);
	      this.playlist.addEventListener(PlaylistEvents.AUTOPLAY_CHANGE, this.handleAutoplayChangeListener);
	    } else {
	      // Hide playlist overlay if no playlist available
	      this.setVisible(false);
	    }
	  }
	}

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
	      function() { scope.playlistOverlay.toggleVisibility(); },
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
	      function() { scope.infoOverlay.toggleVisibility(); },
	      true);
	    this.rightPane.appendChild(this.infoBtn);

	    /**
	     * The toggle settings button
	     * @type {!Element}
	     */
	    this.settingsBtn = UIUtil.createPlayerButton('',
	      'player-btn icon-settings',
	      'Settings',
	      function() { scope.settingsOverlay.toggleVisibility(); },
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

	/**
	 *
	 * @author Stefan Glaser
	 */
	class Tab
	{
	  /**
	   * Tab Constructor
	   *
	   * @param {!Panel} head the tab header panel
	   * @param {!Panel} content the tab content panel
	   */
	  constructor (head, content)
	  {
	    /**
	     * The tab header panel.
	     * @type {!Panel}
	     */
	    this.head = head;

	    /**
	     * The tab content panel.
	     * @type {!Panel}
	     */
	    this.content = content;
	  }
	}



	/**
	 * The TabPane class definition.
	 *
	 * The TabPane abstracts
	 *
	 * @author Stefan Glaser
	 */
	class TabPane extends Panel
	{
	  /**
	   * TabPane Constructor
	   *
	   * @param {string=} className the css class string
	   */
	  constructor (className)
	  {
	    super('jsm-tab-pane' + (className === undefined ? '' : ' ' + className));

	    // Create header row
	    let row = UIUtil.createDiv('t-row');
	    this.domElement.appendChild(row);

	    const cell = UIUtil.createDiv('tab-header');
	    row.appendChild(cell);


	    /**
	     * The tab header container.
	     * @type {!Element}
	     */
	    this.tabHeaderList = UIUtil.createUL();
	    cell.appendChild(this.tabHeaderList);

	    // Create content row
	    row = UIUtil.createDiv('t-row');
	    this.domElement.appendChild(row);

	    /**
	     * The tab header container.
	     * @type {!Element}
	     */
	    this.tabContent = UIUtil.createDiv('tab-content');
	    row.appendChild(this.tabContent);

	    /**
	     * The tabs of this tab pane.
	     * @type {!Array<!Tab>}
	     */
	    this.tabs = [];

	    /**
	     * The tab group, managing visibility of content panels.
	     * @type {!PanelGroup}
	     */
	    this.tabGroup = new PanelGroup();
	  }

	  /**
	   * Add the given tab to the tab-pane.
	   *
	   * @param  {!Tab} tab the new tab to add
	   */
	  add (tab)
	  {
	    // Store new tab
	    this.tabs.push(tab);

	    // Add content to tab panel group
	    this.tabGroup.add(tab.content);

	    // Add new tab to containers
	    const li = UIUtil.createLI();
	    li.onclick = function (evt) {
	      tab.content.setVisible();

	      // Deactivate all header items
	      const tabHeaders = li.parentNode.childNodes;
	      for (let i = 0; i < tabHeaders.length; ++i) {
	        if (tabHeaders[i].nodeName === 'LI') {
	          tabHeaders[i].className = tabHeaders[i].className.replace('active', '');
	        }
	      }

	      // Reactivate selected item
	      li.className += ' active';
	    };

	    li.appendChild(tab.head.domElement);
	    this.tabHeaderList.appendChild(li);
	    this.tabContent.appendChild(tab.content.domElement);

	    // Activate first tab
	    if (this.tabs.length === 1) {
	      // By default show first tab
	      tab.content.setVisible();
	      li.className = 'active';
	    }
	  }

	  /**
	   * Add the given panels as tab to the tab-pane.
	   *
	   * @param  {!Panel} head the tab header panel
	   * @param  {!Panel} content the tab content panel
	   * @return {!Tab} the newly created and added tab
	   */
	  addPanels (head, content)
	  {
	    const newTab = new Tab(head, content);

	    this.add(newTab);

	    return newTab;
	  }

	  /**
	   * Wrap the given elements in panels and add them as tab to the tab-pane.
	   *
	   * @param  {!Element} head the tab header element
	   * @param  {!Element} content the tab content element
	   * @return {!Tab} the newly created and added tab
	   */
	  addElements (head, content)
	  {
	    const headPanel = new Panel();
	    headPanel.appendChild(head);

	    const contentPanel = new Panel();
	    contentPanel.appendChild(content);

	    return this.addPanels(headPanel, contentPanel);
	  }
	}

	/**
	 * The Archive class definition.
	 *
	 * The Archive provides browsing capabilities to one remote archive.
	 *
	 * @author Stefan Glaser
	 */
	class Archive
	{
	  /**
	   * Archive Constructor
	   *
	   * @param {string} url the archive url
	   * @param {string} label the archive label
	   */
	  constructor (url, label)
	  {
	    /**
	     * The archive url.
	     * @type {string}
	     */
	    this.archiveURL = url;


	    /**
	     * The game log selection callback.
	     * @type {!Function | undefined}
	     */
	    this.gameLogSelectionCallback = undefined;

	    /**
	     * The playlist selection callback.
	     * @type {!Function | undefined}
	     */
	    this.playlistSelectionCallback = undefined;


	    /** @type {!Function} */
	    this.loadFolderListener = this.loadFolder.bind(this);
	    /** @type {!Function} */
	    this.loadGameLogListener = this.loadGameLog.bind(this);
	    /** @type {!Function} */
	    this.loadPlaylistListener = this.loadPlaylist.bind(this);


	    /**
	     * The component root element.
	     * @type {!Element}
	     */
	    this.domElement = this.createFolderItem(label, '/', 'archive-root');
	  }

	  /**
	   * Create a folder item.
	   *
	   * @param {string} label the folder label
	   * @param {string} path the folder path
	   * @param {string=} className the item css class string
	   * @return {!Element} the new folder item
	   */
	  createFolderItem (label, path, className)
	  {
	    let liClassName = 'folder new';
	    if (className !== undefined) {
	      liClassName += ' ' + className;
	    }

	    const newItem = UIUtil.createLI(liClassName);
	    newItem.dataset.path = path;

	    // Add folder label
	    const titleLbl = UIUtil.createSpan(label, 'title no-text-select');
	    titleLbl.tabIndex = 0;
	    titleLbl.addEventListener('click', this.loadFolderListener, false);
	    titleLbl.addEventListener('keydown', this.loadFolderListener, false);
	    newItem.appendChild(titleLbl);

	    // Check for top-level folder
	    if (path === '/') {
	      // Set tool tip
	      titleLbl.title = this.archiveURL;

	      // Create remove archive button
	      const btn = UIUtil.createButton('Del', 'remove-btn', 'Remove "' + this.archiveURL + '" from list of archives.');
	      btn.addEventListener('click', Archive.removeArchive, false);
	      btn.addEventListener('keydown', Archive.removeArchive, false);
	      titleLbl.appendChild(btn);
	    }

	    return newItem;
	  }

	  /**
	   * Create a game log item.
	   *
	   * @param {string} label the game log label
	   * @param {string} path the game log path
	   * @param {string} className the additional game log item class
	   * @return {!Element} the new game log item
	   */
	  createGameLogItem (label, path, className)
	  {
	    const newItem = UIUtil.createLI('game-log' + ' ' + className);
	    newItem.dataset.path = path;

	    // Add game log label
	    const titleLbl = UIUtil.createSpan(label, 'title no-text-select');
	    titleLbl.tabIndex = 0;
	    titleLbl.title = label;
	    titleLbl.addEventListener('click', this.loadGameLogListener, false);
	    titleLbl.addEventListener('keydown', this.loadGameLogListener, false);
	    newItem.appendChild(titleLbl);

	    return newItem;
	  }

	  /**
	   * Create a playlist item.
	   *
	   * @param {string} label the playlist label
	   * @param {string} path the playlist path
	   * @return {!Element} the new playlist item
	   */
	  createPlaylistItem (label, path)
	  {
	    const newItem = UIUtil.createLI('playlist');
	    newItem.dataset.path = path;

	    // Add game log label
	    const titleLbl = UIUtil.createSpan(label, 'title no-text-select');
	    titleLbl.tabIndex = 0;
	    titleLbl.title = label;
	    titleLbl.addEventListener('click', this.loadPlaylistListener, false);
	    titleLbl.addEventListener('keydown', this.loadPlaylistListener, false);
	    newItem.appendChild(titleLbl);

	    return newItem;
	  }

	  /**
	   * Action handler for loading a folder.
	   *
	   * @param {!Event} evt the click event
	   * @return {void}
	   */
	  loadFolder (evt)
	  {
	    if (!UIUtil.isButtonAction(evt)) {
	      return;
	    }

	    const item = evt.target.parentNode;
	    const path = item.dataset.path;
	    const scope = this;

	    const handleLoad = function() {
	      const archive = scope;
	      const folderItem = item;

	      return function (evt) {
	        let newClass = '';

	        if (evt.target.status === 200 || evt.target.status === 0) {
	          // Successfully loaded
	          /** @type {!Object} */
	          let listing = {};

	          try {
	            listing = /** @type {!Object} */ (JSON.parse(evt.target.response));
	          } catch(e) {
	            // Parsing error
	            console.log(e);
	          }

	          if (listing['type'] === 'archive') {
	            const sublist = UIUtil.createUL('folder-listing');
	            const folders = listing['folders'];
	            const replays = listing['replays'];
	            const sserverLogs = listing['sserverlogs'];
	            const playlists = listing['playlists'];

	            if (folders !== undefined) {
	              for (let i = 0; i < folders.length; ++i) {
	                sublist.appendChild(archive.createFolderItem(folders[i]['label'], folders[i]['path']));
	              }
	            }

	            if (replays !== undefined) {
	              for (let i = 0; i < replays.length; ++i) {
	                sublist.appendChild(archive.createGameLogItem(replays[i]['label'], replays[i]['path'], 'replay'));
	              }
	            }

	            if (sserverLogs !== undefined) {
	              for (let i = 0; i < sserverLogs.length; ++i) {
	                sublist.appendChild(archive.createGameLogItem(sserverLogs[i]['label'], sserverLogs[i]['path'], 'sserver-log'));
	              }
	            }

	            if (playlists !== undefined) {
	              for (let i = 0; i < playlists.length; ++i) {
	                sublist.appendChild(archive.createPlaylistItem(playlists[i]['label'], playlists[i]['path']));
	              }
	            }

	            if (sublist.children.length > 0) {
	              folderItem.appendChild(sublist);
	              newClass = 'expanded';

	              const titleLbl = UIUtil.filterElements(folderItem.childNodes, 'SPAN')[0];
	              titleLbl.addEventListener('click', Archive.toggleExpand, false);
	              titleLbl.addEventListener('keydown', Archive.toggleExpand, false);
	            } else {
	              newClass = 'empty';

	              UIUtil.filterElements(folderItem.childNodes, 'SPAN')[0].tabIndex = -1;
	            }
	          }
	        } else if (evt.target.status === 404) {
	          // Archive not found
	          newClass = 'not-found';

	          UIUtil.filterElements(folderItem.childNodes, 'SPAN')[0].tabIndex = -1;
	        } else {
	          // Error during loading
	          console.log('Error ajax resonse for "' + folderItem.dataset.path + '"!');
	          newClass = 'error';

	          // Add load listener again
	          const titleLbl = UIUtil.filterElements(folderItem.childNodes, 'SPAN')[0];
	          titleLbl.addEventListener('click', archive.loadFolderListener, false);
	          titleLbl.addEventListener('keydown', archive.loadFolderListener, false);
	        }

	        folderItem.className = folderItem.className.replace('loading', newClass);
	      };
	    }();

	    const handleError = function() {
	      const archive = scope;
	      const folderItem = item;

	      return function (evt) {
	        console.log('Error ajax resonse for "' + folderItem.dataset.path + '"!');
	        folderItem.className = folderItem.className.replace('loading', 'error');

	        // Add load listener again
	        const titleLbl = UIUtil.filterElements(folderItem.childNodes, 'SPAN')[0];
	        titleLbl.addEventListener('click', archive.loadFolderListener, false);
	        titleLbl.addEventListener('keydown', archive.loadFolderListener, false);
	      };
	    }();

	    const xhr = new XMLHttpRequest();
	    xhr.open('GET', this.archiveURL + '?path=' + encodeURIComponent(path), true);

	    // Add event listeners
	    xhr.addEventListener('load', handleLoad, false);
	    xhr.addEventListener('error', handleError, false);

	    // Set mime type
	    if (xhr.overrideMimeType) {
	      xhr.overrideMimeType('text/plain');
	    }

	    // Send request
	    xhr.send(null);

	    // Indicate loading of item
	    item.className = item.className.replace('new', 'loading').replace('error', 'loading');

	    // Remove load listener
	    evt.target.removeEventListener('click', this.loadFolderListener, false);
	    evt.target.removeEventListener('keydown', this.loadFolderListener, false);
	  }

	  /**
	   * Action handler for loading a game log file.
	   *
	   * @param {!Event} evt the click event
	   * @return {void}
	   */
	  loadGameLog (evt)
	  {
	    if (!UIUtil.isButtonAction(evt)) {
	      return;
	    }

	    if (this.gameLogSelectionCallback) {
	      const path = evt.target.parentNode.dataset.path;
	      const idx = this.archiveURL.lastIndexOf('/');

	      this.gameLogSelectionCallback(this.archiveURL.slice(0, idx + 1) + path);
	    }
	  }

	  /**
	   * Action handler for loading a playlist file.
	   *
	   * @param {!Event} evt the click event
	   * @return {void}
	   */
	  loadPlaylist (evt)
	  {
	    if (!UIUtil.isButtonAction(evt)) {
	      return;
	    }

	    if (this.playlistSelectionCallback) {
	      const path = evt.target.parentNode.dataset.path;
	      const idx = this.archiveURL.lastIndexOf('/');

	      this.playlistSelectionCallback(this.archiveURL.slice(0, idx + 1) + path);
	    }
	  }

	  /**
	   * Toggle expanded state of the clicked item.
	   *
	   * @param {!Event} evt the click event
	   * @return {void}
	   */
	  static toggleExpand (evt)
	  {
	    if (!UIUtil.isButtonAction(evt)) {
	      return;
	    }

	    const item = evt.target.parentNode;

	    if (UIUtil.toggleVisibility(item.getElementsByTagName('ul')[0])) {
	      item.className = item.className.replace('expandable', 'expanded');
	    } else {
	      item.className = item.className.replace('expanded', 'expandable');
	    }
	  }

	  /**
	   * Toggle expanded state of the clicked item.
	   *
	   * @param {!Event} evt the click event
	   * @return {void}
	   */
	  static removeArchive (evt)
	  {
	    if (!UIUtil.isButtonAction(evt)) {
	      return;
	    }

	    // Remove dom node
	    const item = evt.target.parentNode.parentNode;
	    item.parentNode.removeChild(item);
	  }
	}

	/**
	 * The ArchiveExplorer class definition.
	 *
	 * The ArchiveExplorer provides browsing capabilities to multiple remote archives.
	 *
	 * @author Stefan Glaser
	 */
	class ArchiveExplorer extends Panel
	{
	  /**
	   * ArchiveExplorer Constructor
	   *
	   * @param {!LogPlayer} logPlayer the log player model
	   */
	  constructor (logPlayer)
	  {
	    super('jsm-archive-explorer');

	    /**
	     * The log player model instance.
	     * @type {!LogPlayer}
	     */
	    this.logPlayer = logPlayer;


	    /**
	     * The archive list.
	     * @type {!Element}
	     */
	    this.archiveList = UIUtil.createUL('archive-list');
	    this.domElement.appendChild(this.archiveList);


	    /**
	     * The add archive list item.
	     * @type {!Element}
	     */
	    this.addArchiveItem = UIUtil.createLI('add-archive expandable');
	    this.archiveList.appendChild(this.addArchiveItem);

	    let label = UIUtil.createSpan('Add new Archive',  'no-text-select');
	    label.addEventListener('click', ArchiveExplorer.toggleExpand, false);
	    this.addArchiveItem.appendChild(label);


	    /**
	     * The add archive list item.
	     * @type {!Element}
	     */
	    this.addArchiveBox = UIUtil.createDiv('add-box');
	    UIUtil.setVisibility(this.addArchiveBox, false);
	    this.addArchiveItem.appendChild(this.addArchiveBox);


	    /**
	     * The new archive location input field.
	     * @type {!Element}
	     */
	    this.archiveLocationInput = UIUtil.createElement('input');
	    this.archiveLocationInput.name = 'location';
	    this.archiveLocationInput.type = 'url';
	    this.archiveLocationInput.value = 'https://';

	    label = UIUtil.createElement('label');
	    label.appendChild(UIUtil.createSpan('URL:'));
	    label.appendChild(this.archiveLocationInput);
	    this.addArchiveBox.appendChild(label);


	    /**
	     * The new archive name input field.
	     * @type {!Element}
	     */
	    this.archiveNameInput = UIUtil.createElement('input');
	    this.archiveNameInput.name = 'name';
	    this.archiveNameInput.type = 'text';

	    label = UIUtil.createElement('label');
	    label.appendChild(UIUtil.createSpan('Name:'));
	    label.appendChild(this.archiveNameInput);
	    this.addArchiveBox.appendChild(label);

	    /** @type {!Function} */
	    this.onAddNewLocationListener = this.onAddNewLocation.bind(this);


	    /**
	     * The add new archive button.
	     * @type {!Element}
	     */
	    this.addArchiveBtn = UIUtil.createButton('Add', 'add-archive', 'Add new archive location to list of archives', this.onAddNewLocationListener);
	    this.addArchiveBox.appendChild(this.addArchiveBtn);


	    /** @type {!Function} */
	    this.handleGameLogSelectedListener = this.handleGameLogSelected.bind(this);
	    /** @type {!Function} */
	    this.handlePlaylistSelectedListener = this.handlePlaylistSelected.bind(this);
	  }

	  /**
	   * Add location action listener.
	   *
	   * @param {!Event} evt the button event
	   * @return {void}
	   */
	  onAddNewLocation (evt)
	  {
	    const url = this.archiveLocationInput.value;
	    let label = this.archiveNameInput.value;

	    if (!url || url === 'https://' || url === 'http://') {
	      return;
	    }

	    if (!label) {
	      label = url;
	    }

	    // Add location
	    this.addLocation(url, label);

	    // Reset input elements
	    this.archiveLocationInput.value = 'https://';
	    this.archiveNameInput.value = '';

	    // Hide input elements
	    UIUtil.setVisibility(this.addArchiveBox, false);
	    this.addArchiveItem.className = this.addArchiveItem.className.replace(' expanded', '');
	  }

	  /**
	   * Add new location to list of archives.
	   *
	   * @param {string} url the url to the new archive location
	   * @param {string} label the label text to display
	   * @return {void}
	   */
	  addLocation (url, label)
	  {
	    const newArchive = new Archive(url, label);
	    newArchive.gameLogSelectionCallback = this.handleGameLogSelectedListener;
	    newArchive.playlistSelectionCallback = this.handlePlaylistSelectedListener;
	    this.archiveList.appendChild(newArchive.domElement);
	  }

	  /**
	   * Handle selection of a game log within one of the archives.
	   *
	   * @param {string} logURL the selected game log url
	   * @return {void}
	   */
	  handleGameLogSelected (logURL)
	  {
	    this.logPlayer.loadGameLog(logURL);
	  }

	  /**
	   * Handle selection of a playlist within one of the archives.
	   *
	   * @param {string} listURL the selected playlist url
	   * @return {void}
	   */
	  handlePlaylistSelected (listURL)
	  {
	    this.logPlayer.loadPlaylist(listURL);
	  }

	  /**
	   * Toggle expanded state of the clicked item.
	   *
	   * @param {!Event} evt the click event
	   * @return {void}
	   */
	  static toggleExpand (evt)
	  {
	    const item = evt.target.parentNode;

	    if (UIUtil.toggleVisibility(item.getElementsByTagName('div')[0])) {
	      item.className = item.className.replace('expandable', 'expanded');
	    } else {
	      item.className = item.className.replace('expanded', 'expandable');
	    }
	  }
	}

	/**
	 * The ResourceExplorer class definition.
	 *
	 * The ResourceExplorer provides browsing capabilities to various sources.
	 *
	 * @author Stefan Glaser
	 */
	class ResourceExplorer extends TabPane
	{
	  /**
	   * ResourceExplorer Constructor
	   *
	   * @param {!MonitorModel} model the monitor model instance
	   */
	  constructor (model)
	  {
	    super('jsm-explorer');

	    /**
	     * The monitor model instance.
	     * @type {!MonitorModel}
	     */
	    this.model = model;

	    /**
	     * The archive explorer instance.
	     * @type {!ArchiveExplorer}
	     */
	    this.archiveExplorer = new ArchiveExplorer(this.model.logPlayer);
	    /*this.archiveExplorer.onGameLogSelected = function () {
	      const mm = model;

	      return function (url) {
	        mm.loadGameLog(url);
	      }
	    }();*/
	    // this.archiveExplorer.addLocation('http://archive.robocup.info/app/JaSMIn/archive.php', 'archive.robocup.info');
	    // this.archiveExplorer.addLocation('http://localhost:8080/build/archive.php');
	    // this.archiveExplorer.addLocation('archive.php', 'Archive');


	    // Create Archive tab
	    const headerPanel = new Panel();
	    let label = UIUtil.createSpan('Archives');
	    label.title = 'Browse Replay Archives';
	    headerPanel.appendChild(label);

	    this.addPanels(headerPanel, this.archiveExplorer);

	    // Create Simulators tab
	    // this.addElements(UIUtil.createSpan('Simulators'), UIUtil.createSpan('Simulator Browser'));

	    // Create Streams tab
	    // this.addElements(UIUtil.createSpan('Streams'), UIUtil.createSpan('Stream Browser'));


	    /**
	     * The file chooser input line, for selecting local files.
	     * @type {!Element}
	     */
	    this.fileInput = UIUtil.createElement('input');
	    this.fileInput.type = 'file';
	    this.fileInput.accept = '.rpl3d, .rpl2d, .replay, .rcg, .json';
	    this.fileInput.multiple = true;
	    this.fileInput.onchange = function () {
	      const mm = model;

	      return function (evt) {
	        const files = evt.target.files;

	        if (files && files.length > 0) {
	          mm.loadFiles(files);
	        }
	      };
	    }();

	    /**
	     * The binded listener method for showing the file chooser dialog.
	     * @type {!Function}
	     */
	    this.showFileChooserListener = this.showFileChooser.bind(this);


	    /**
	     * The open local resource button.
	     * @type {!Element}
	     */
	    this.openResourceItem = UIUtil.createLI('open-resource');
	    this.openResourceItem.onclick = this.showFileChooserListener;
	    label = UIUtil.createSpan('Open');
	    label.title = 'Open local resource...';
	    this.openResourceItem.appendChild(label);
	    this.openResourceItem.appendChild(this.fileInput);
	    this.tabHeaderList.appendChild(this.openResourceItem);
	  }

	  /**
	   * Show file chooser.
	   *
	   * @return {void}
	   */
	  showFileChooser ()
	  {
	    this.fileInput.click();
	  }
	}

	/**
	 * The WelcomeOverlay class definition.
	 *
	 * @author Stefan Glaser
	 */
	class WelcomeOverlay extends Panel
	{
	  /**
	   * WelcomeOverlay Constructor
	   *
	   * @param {!DnDHandler} dndHandler the dnd-handler
	   */
	  constructor (dndHandler)
	  {
	    super('jsm-welcome-pane full-size');

	    /**
	     * The dnd handler instance.
	     * @type {!DnDHandler}
	     */
	    this.dndHandler = dndHandler;


	    /**
	     * The Drag & Drop box for local files.
	     * @type {!Element}
	     */
	    this.dndBox = UIUtil.createDiv('dnd-box');
	    this.dndBox.innerHTML = '<span>Drag &amp; Drop Replays or SServer Logs to Play</span>';
	    this.appendChild(this.dndBox);

	    this.dndHandler.addListeners(this.dndBox);
	  }
	}

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

	exports.CharCodes = CharCodes;
	exports.KeyCodes = KeyCodes;
	exports.Monitor = Monitor;
	exports.MonitorParameters = MonitorParameters;
	exports.REVISION = REVISION;

	Object.defineProperty(exports, '__esModule', { value: true });

}));
