import { GameLogParser } from '../parser/GameLogParser.js';
import { AgentDescription } from '../AgentDescription.js';
import { AgentState } from '../AgentState.js';
import { DataIterator, DataExtent } from '../../../utils/DataIterator.js';
import { LogParserStorage } from '../parser/LogParserStorage.js';
import { ObjectState } from '../ObjectState.js';
import { GameLog } from '../GameLog.js';
import { ParserException } from '../../../utils/exceptions/ParserException.js';
import { SServerLog } from './SServerLog.js';
import { SymbolNode } from '../../../utils/symboltree/SymbolNode.js';
import { SymbolTreeParser } from '../../../utils/symboltree/SymbolTreeParser.js';
import { TeamDescription } from '../TeamDescription.js';
import { WorldState } from '../WorldState.js';
import { MonitorUtil } from '../../../utils/MonitorUtil.js';
import { ThreeJsUtil } from '../../../utils/ThreeJsUtil.js';
import { ParameterMap } from '../utils/ParameterMap.js';
import { JsMath } from '../../../utils/JsMath.js';
import { PartialWorldState } from '../parser/PartialWorldState.js';
import { Agent2DData, PlayerType2DParams } from '../utils/SServerUtil.js';

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

export { ULGParser };