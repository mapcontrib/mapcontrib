import { h, Component } from 'preact';
import osmAuth from 'osm-auth';
import OsmEditHelper from 'helper/osmEdit';

export default class TagForm extends Component {
  constructor(props) {
    super(props);

    const state = {};

    Object.keys(props.diffObject.tags).forEach(
      key => (state[key] = props.diffObject.tags[key].modified)
    );

    this.state = state;

    this._osmEdit = new OsmEditHelper(
      osmAuth({
        url: this.props.oauthEndPoint,
        oauth_consumer_key: this.props.oauthConsumerKey,
        oauth_secret: this.props.oauthSecret,
        oauth_token: this.props.user.get('token'),
        oauth_token_secret: this.props.user.get('tokenSecret')
      })
    );

    this._osmEdit.setType(this.props.feature.properties.type);
    this._osmEdit.setId(this.props.feature.properties.id);
  }

  render() {
    const { l10n, layer, osmId, diffObject, feature } = this.props;
    const layerName = layer.get('name');
    const Empty = <em>{l10n.getSync('empty')}</em>;

    return (
      <form>
        <div class="container-fluid content sticky">
          <div class="row sticky-header">
            <div class="col-xs-12">
              <button type="button" class="btn btn-primary btn-block zoom_btn">
                {l10n.getSync('overPassCacheModifications_zoomOnElement')}
              </button>
            </div>
          </div>

          <div class="row sticky-inner">
            <div class="col-xs-12">
              <h4>{l10n.getSync('layer')}</h4>
              <p class="append-xs-2">{layerName}</p>

              <h4>{l10n.getSync('osmId')}</h4>
              <p>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`https://www.openstreetmap.org/${osmId}`}
                >
                  {osmId}
                </a>{' '}
                (
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`http://osmlab.github.io/osm-deep-history/#/${osmId}`}
                >
                  OSM Deep History
                </a>
                )
              </p>
              <p class="append-xs-2">
                {l10n.getSync('version').ucfirst()}{' '}
                {feature.properties.meta.version} {l10n.getSync('by')}{' '}
                {feature.properties.meta.user}
              </p>

              <h4>{l10n.getSync('overPassCacheModifications_dates')}</h4>
              <p>
                {l10n.getSync('overPassCacheModifications_cacheDate')}:{' '}
                {diffObject.timestamp.cached}
              </p>
              <p class="append-xs-2">
                {l10n.getSync('overPassCacheModifications_modificationDate')}:{' '}
                {diffObject.timestamp.modified}
              </p>

              <h4>{l10n.getSync('tags')}</h4>
              {Object.keys(diffObject.tags).map(key => {
                const { cached, modified } = diffObject.tags[key];

                if (cached === modified) {
                  return (
                    <div class="append-xs-2">
                      <h5>{key}</h5>
                      <p>{cached}</p>
                    </div>
                  );
                }

                const cachedRadioId = `${key}_cached`;
                const modifiedRadioId = `${key}_modified`;
                return (
                  <div class="append-xs-2">
                    <h5>{key}</h5>
                    <div class="radio">
                      <input
                        type="radio"
                        id={cachedRadioId}
                        name={key}
                        value="cached"
                        onChange={() => this.onChangeRadio(key, cached)}
                        checked={this.state[key] === cached}
                      />
                      <label for={cachedRadioId}>{cached || Empty}</label>
                    </div>
                    <div class="radio">
                      <input
                        type="radio"
                        id={modifiedRadioId}
                        name={key}
                        value="modified"
                        onChange={() => this.onChangeRadio(key, modified)}
                        checked={this.state[key] === modified}
                      />
                      <label for={modifiedRadioId}>{modified || Empty}</label>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div class="row sticky-footer">
            <div class="col-xs-12">
              <button
                type="button"
                class="btn btn-block btn-primary"
                onClick={this.onClickValidate}
              >
                {l10n.getSync('validateAndCache')}
              </button>
              <button
                type="button"
                class="btn btn-block btn-default"
                onClick={this.onClickRefuse}
              >
                {l10n.getSync('refuseAndArchive')}
              </button>
              <button
                type="button"
                class="btn btn-block btn-default"
                onClick={() => this.onClickSend(this.state)}
              >
                {l10n.getSync('sendNewVersionToOsm')}
              </button>
            </div>
          </div>
        </div>
      </form>
    );
  }

  onChangeRadio(key, value) {
    this.setState({
      [key]: value
    });
  }

  onClickValidate = () => {
    this.props.layer.mergeModifiedFeature(
      this.props.fragment,
      this.props.feature,
      true
    );
    this.props.close();
  };

  onClickRefuse = () => {
    this.props.layer.archiveFeatureFromModifiedCache(
      this.props.fragment,
      this.props.feature
    );
    this.props.close();
  };

  onClickSend = tags => {
    const cleanedTags = {};

    Object.keys(tags).forEach(key => {
      if (typeof tags[key] !== 'undefined') {
        cleanedTags[key] = tags[key];
      }
    });

    this._osmEdit.setChangesetCreatedBy(this.props.createdBy);
    this._osmEdit.setChangesetComment(this.props.changesetComment);
    this._osmEdit.setTimestamp();
    this._osmEdit.setTags(cleanedTags);
    this._osmEdit.setUid(this.props.user.get('osmId'));
    this._osmEdit.setDisplayName(this.props.user.get('displayName'));

    this._osmEdit.send().then(() => {
      this.props.layer.mergeModifiedFeature(
        this.props.fragment,
        this.props.feature,
        true
      );
    });

    this.props.close();
  };
}
