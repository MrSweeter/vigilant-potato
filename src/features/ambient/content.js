import ContentFeature from '../../generic/content.js';
import { isStillSameWebsite } from '../../utils/authorize.js';
import AmbientManager from './ambient_manager.js';
import configuration from './configuration.js';

import confetti from 'canvas-confetti';

export default class AmbientContentFeature extends ContentFeature {
    constructor() {
        super(configuration);
        this.manager = new AmbientManager();
    }

    async loadFeature(url) {
        if (!(await isStillSameWebsite(2000, url))) return;
        if (!this.isOdooHome()) return;

        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
        });

        console.log(confetti);
        console.log(typeof confetti);

        const ambient = this.manager.getTodayAmbient();
        this.manager.loadAmbient(ambient);
    }

    isOdooHome() {
        const container = document.getElementsByClassName('o_apps');
        return container.length > 0;
    }
}
