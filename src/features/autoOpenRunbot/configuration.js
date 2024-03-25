export default {
    id: 'autoOpenRunbot',
    display_name: 'Auto Open Runbot',
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
        autoOpenRunbotEnabled: false,
        autoOpenRunbotLimitedOrigins: ['https://runbot.odoo.com'],
    },
    limited: true,
};
