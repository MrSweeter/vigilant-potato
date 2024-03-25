export default {
    id: 'themeSwitch',
    display_name: 'Theme Switch',
    icon: ["<i class='fa-regular fa-circle-question'></i>"],
    trigger: {
        content: {
            load: false,
            navigate: false,
        },
        option: true,
        popup: true,
        background: true,
    },
    __comment__: "themeSwitchMode: 'autoDark', 'autoLight', 'dynamicLocation', 'dynamicTime'",
    defaultSettings: {
        themeSwitchEnabled: false,
        themeSwitchWhitelistMode: false,
        themeSwitchMode: 'autoDark',
        themeSwitchLocationLatitude: '51.477928',
        themeSwitchLocationLongitude: '-0.001545',
        themeSwitchDarkStartTime: '20:30',
        themeSwitchDarkStopTime: '07:30',
    },
};
