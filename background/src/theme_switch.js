import { Cookies, StorageLocal, StorageSync, Tabs } from '../../utils/browser.js';
import { defaultThemeSwitchSetting } from '../../utils/feature_default_configuration.js';
import { authorizeFeature } from './features.js';

export async function switchThemeIfNeeded(tab) {
    if (!tab.url) return;
    const origin = new URL(tab.url).origin;
    if (!origin || !origin.startsWith('http')) return;

    const {
        themeSwitchEnabled,
        themeSwitchMode /* "autoDark", "autoLight", "dynamicLocation", "dynamicTime" */,
        themeSwitchLocationLatitude,
        themeSwitchLocationLongitude,
        themeSwitchDarkStartTime,
        themeSwitchDarkStopTime,
    } = await StorageSync.get(defaultThemeSwitchSetting);

    if (!themeSwitchEnabled) return;
    const authorizedFeature = await authorizeFeature('themeSwitch', origin);
    if (!authorizedFeature) return;

    let expectedMode = false;
    let today = new Date();
    const time = today.getHours() * 60 + today.getMinutes();

    switch (themeSwitchMode) {
        case 'autoDark':
            expectedMode = 'dark';
            break;
        case 'autoLight':
            expectedMode = 'light';
            break;
        case 'dynamicLocation':
            const sunData = await getSunRiseSunSet(
                themeSwitchLocationLatitude,
                themeSwitchLocationLongitude
            );

            expectedMode =
                time > sunData.qol_sunrise && time < sunData.qol_sunset ? 'light' : 'dark';
            break;
        case 'dynamicTime':
            let start = themeSwitchDarkStartTime.split(':');
            start = parseInt(start[0]) * 60 + parseInt(start[1]);
            let stop = themeSwitchDarkStopTime.split(':');
            stop = parseInt(stop[0]) * 60 + parseInt(stop[1]);

            expectedMode = time > start && time < stop ? 'dark' : 'light';
    }

    if (!expectedMode) return;

    const currentMode = await getThemeModeCookie(origin);

    if (currentMode != expectedMode) {
        await setThemeModeCookie(expectedMode, origin);
        Tabs.reload(tab.id);
    }
}

async function getSunRiseSunSet(latitude, longitude) {
    let today = new Date();
    today = today.getMonth() + 1 + '-' + today.getDate() + '-' + today.getFullYear();
    const cached = await StorageLocal.get({
        qol_sunrise: 0,
        qol_sunset: 23 * 60 + 59,
        qol_date: '',
    });

    if (cached.qol_sunrise && cached.qol_sunset && cached.qol_date === today) {
        return cached;
    }

    const response = await fetch(
        `https://api.sunrisesunset.io/json?lat=${latitude}&lng=${longitude}`
    );

    const json = await response.json();

    let sunrise = json.results.sunrise.split(':');
    sunrise =
        parseInt(sunrise[0]) * 60 +
        parseInt(sunrise[1]) +
        (sunrise[2].endsWith('PM') ? 12 * 60 : 0);

    let sunset = json.results.sunset.split(':');
    sunset =
        parseInt(sunset[0]) * 60 + parseInt(sunset[1]) + (sunset[2].endsWith('PM') ? 12 * 60 : 0);

    const data = {
        qol_sunrise: sunrise,
        qol_sunset: sunset,
        qol_date: today,
    };

    await StorageLocal.set(data);
    return data;
}

async function setThemeModeCookie(expectedMode, origin) {
    if (!origin.startsWith('http')) return;
    await Cookies.set({
        name: 'color_scheme',
        value: expectedMode,
        url: origin,
    });
    await Cookies.set({
        name: 'configured_color_scheme',
        value: expectedMode,
        url: origin,
    });
}

async function getThemeModeCookie(origin) {
    if (!origin.startsWith('http')) return 'light';
    const cookies = await Promise.all([
        Cookies.get({
            name: 'configured_color_scheme',
            url: origin,
        }),
        Cookies.get({
            name: 'color_scheme',
            url: origin,
        }),
    ]);
    return cookies[0]?.value || cookies[1]?.value || 'light';
}
