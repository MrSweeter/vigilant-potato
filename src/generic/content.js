import { sanitizeURL } from '../utils/url_manager.js';
import { isAuthorizedFeature } from '../utils/authorize.js';
import { NotYetImplemented } from '../utils/error.js';

export default class ContentFeature {
    constructor(configuration) {
        this.configuration = configuration;
        this.defaultSettings = configuration.defaultSettings;
    }

    async load(urlArg) {
        const url = sanitizeURL(urlArg);

        if (!(await isAuthorizedFeature(this.configuration.id, url))) return;

        this.loadFeature(url);
    }

    async loadFeature(url) {
        throw NotYetImplemented;
    }
}
