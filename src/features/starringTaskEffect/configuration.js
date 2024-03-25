export default {
    id: 'starringTaskEffect',
    display_name: 'Starring Task Effect',
    icon: ["<i class='fa-regular fa-circle-question'></i>"],
    trigger: {
        content: {
            load: true,
            navigate: true,
        },
        option: true,
        popup: true,
        background: false,
    },
    defaultSettings: {
        starringTaskEffectEnabled: false,
        starringTaskEffectWhitelistMode: false,
    },
};
