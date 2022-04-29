import { Overlay } from '../../components/Overlay.js';
import { ToggleItem } from '../../components/ToggleItem.js';
import { UIUtil } from '../../../utils/UIUtil.js';
import { LogPlayer, LogPlayerEvents } from '../../../model/logplayer/LogPlayer.js';
import { Playlist, GameLogEntry, PlaylistEvents } from '../../../model/logplayer/Playlist.js';

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

export { PlaylistOverlay };
