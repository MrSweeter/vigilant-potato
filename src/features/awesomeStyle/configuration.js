export default {
    id: 'awesomeStyle',
    display_name: 'Awesome Style',
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
        awesomeStyleEnabled: false,
        awesomeStyleWhitelistMode: false,
        awesomeStyleCSS: '',
    },
};
