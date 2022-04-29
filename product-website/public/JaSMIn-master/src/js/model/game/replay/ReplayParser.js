import { GameLogParser } from '../parser/GameLogParser.js';
import { AgentDescription } from '../AgentDescription.js';
import { AgentState } from '../AgentState.js';
import { DataIterator, DataExtent } from '../../../utils/DataIterator.js';
import { LogParserStorage } from '../parser/LogParserStorage.js';
import { ObjectState } from '../ObjectState.js';
import { GameLog } from '../GameLog.js';
import { ParserException } from '../../../utils/exceptions/ParserException.js';
import { PartialWorldState } from '../parser/PartialWorldState.js';
import { Replay } from './Replay.js';
import { TeamDescription } from '../TeamDescription.js';
import { WorldState } from '../WorldState.js';
import { GameType } from '../utils/GameUtil.js';
import { ThreeJsUtil } from '../../../utils/ThreeJsUtil.js';
import { MonitorUtil } from '../../../utils/MonitorUtil.js';
import { SparkUtil } from '../utils/SparkUtil.js';
import { ParameterMap } from '../utils/ParameterMap.js';
import { JsMath, PIby180, NegPIby180 } from '../../../utils/JsMath.js';
import { SymbolNode } from '../../../utils/symboltree/SymbolNode.js';
import { SymbolTreeParser } from '../../../utils/symboltree/SymbolTreeParser.js';
import { Agent2DFlags, Agent2DData } from '../utils/SServerUtil.js';

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
            default:
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

export { ReplayParser };






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
      default:
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
