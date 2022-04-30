import { Overlay } from '../../components/Overlay.js';
import { REVISION } from '../../../Constants.js';

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

export { InfoOverlay };
