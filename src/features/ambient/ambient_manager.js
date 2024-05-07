import confetti from 'canvas-confetti';
import {
    birthdayLoader,
    defaultLoader,
    fallSeasonLoader,
    halloweenLoader,
    newYearLoader,
    rainWeatherLoader,
    snowWeatherLoader,
    springSeasonLoader,
    summerSeasonLoader,
    textLoader,
    winterSeasonLoader,
} from './ambient_loader';

const ambientPeriods = {
    season: {
        1: 'winter',
        2: 'winter',
        3: 'spring',
        4: 'spring',
        5: 'spring',
        6: 'summer',
        7: 'summer',
        8: 'summer',
        9: 'fall',
        10: 'fall',
        11: 'fall',
        12: 'winter',
    },
    '01-01': 'newyear',
    '02-14': 'valentine',
    '03-17': 'patrick',
    '04-01': 'aprilfool',
    '10-31': 'halloween',
    '12-24': 'christmas_eve',
    '12-25': 'christmas',
    '12-31': 'newyear_eve',
};

let joorneyConfetti = undefined;

export default class AmbientManager {
    constructor() {
        console.log('CONSTRUCT');
        const canvas = document.createElement('canvas');
        canvas.style.position = 'absolute';
        canvas.style.height = '100%';
        document.body.appendChild(canvas);
        joorneyConfetti = confetti.create(canvas, {
            resize: true,
            useWorker: false,
            disableForReducedMotion: true,
        });
        this.loader = new AmbientLoader(joorneyConfetti);
    }

    getTodayAmbient() {
        const today = new Date();
        const mm = today.getMonth() + 1; // Months start at 0!
        const dd = today.getDate();

        let ambient = ambientPeriods[`${mm}-${dd}`];

        if (!ambient) {
            // TODO[AMBIENT] Computed
        }

        if (!ambient) {
            // TODO[AMBIENT] WITH WEATHER CHECKBOX
        }

        if (!ambient) {
            // TODO[AMBIENT] WITH SEASON CHECKBOX
            ambient = ambientPeriods.season[mm];
        }

        return ambient;
    }

    loadAmbient(ambient) {
        switch (ambient) {
            case 'birthday': {
                this.loader.loadOneTimeAmbient(birthdayLoader);
                break;
            }
            case 'valentine': {
                this.loader.loadAmbient(defaultLoader(true, '🌹'), 30000);
                break;
            }
            case 'patrick': {
                this.loader.loadAmbient(defaultLoader(true, '☘️', '🍺'), 30000);
                break;
            }
            case 'easter': {
                this.loader.loadAmbient(defaultLoader(true, '🐰', '🐣'), 30000);
                break;
            }
            case 'aprilfool': {
                this.loader.loadAmbient(defaultLoader(true, '🐟'), 30000);
                break;
            }
            case 'halloween': {
                this.loader.loadAmbientCount(halloweenLoader, 30, 1000);
                break;
            }
            case 'christmas_eve': {
                this.loader.loadAmbient(defaultLoader(true, '🎄'), 30000);
                break;
            }
            case 'christmas': {
                this.loader.loadAmbient(defaultLoader(true, '🎁'), 30000);
                break;
            }
            case 'newyear_eve': {
                this.loader.loadAmbient(defaultLoader(false, '🥂'), 30000);
                break;
            }
            case 'newyear': {
                this.loader.loadAmbient(newYearLoader, 10000);
                this.loader.loadAmbientCount(textLoader(`${new Date().getFullYear()}`), 10, 1000);
                break;
            }
            case 'spring': {
                this.loader.loadAmbient(springSeasonLoader, 30000);
                break;
            }
            case 'summer': {
                this.loader.loadAmbient(summerSeasonLoader, 30000);
                break;
            }
            case 'fall': {
                this.loader.loadAmbient(fallSeasonLoader, 30000);
                break;
            }
            case 'winter': {
                this.loader.loadAmbient(winterSeasonLoader, 30000);
                break;
            }
            case 'rain': {
                this.loader.loadAmbient(rainWeatherLoader, 30000);
                this.loader.loadAmbient(rainWeatherLoader, 30000);
                break;
            }
            case 'snow': {
                this.loader.loadAmbient(snowWeatherLoader, 30000);
                this.loader.loadAmbient(snowWeatherLoader, 30000);
                break;
            }
        }
    }
}

class AmbientLoader {
    constructor(confetti) {
        this.loaderConfetti = confetti;
    }

    loadAmbientCount(ambientLoader, count, delay) {
        this.loadAmbient(ambientLoader, count * delay, count);
    }

    loadOneTimeAmbient(ambientLoader) {
        const ambients = ambientLoader();
        this.playAmbients(ambients);
    }

    loadAmbient(
        ambientLoader,
        duration,
        countArg = undefined,
        animationStartArg = Date.now(),
        animationEnd = animationStartArg + duration,
        delay = duration / Number.parseFloat(countArg) ?? 1
    ) {
        const now = Date.now();
        const timeLeft = animationEnd - now;
        const ticks = Math.max(200, 500 * (timeLeft / duration));
        const ambients = ambientLoader(ticks);

        let count = countArg;
        let animationStart = animationStartArg;

        if (count) {
            const ellapsed = now - animationStart;

            if (ellapsed >= delay) {
                this.playAmbients(ambients);
                count--;
                animationStart = now;
            }
        } else if (count === undefined) {
            this.playAmbients(ambients);
        }

        if (timeLeft > 0) {
            requestAnimationFrame(() =>
                this.loadAmbient(ambientLoader, duration, count, animationStart, animationEnd, delay)
            );
        }
    }

    playAmbients(ambientsArg) {
        const ambients = Array.isArray(ambientsArg) ? ambientsArg : [ambientsArg];
        for (const ambient of ambients) {
            ambient.disableForReducedMotion = true;
            joorneyConfetti(ambient);
        }
    }
}
