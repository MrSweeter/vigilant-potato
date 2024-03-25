export default {
    id: 'impersonateLoginRunbot',
    display_name: 'Impersonate Login Runbot',
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
        impersonateLoginRunbotEnabled: false,
        impersonateLoginRunbotLimitedOrigins: ['regex://.*\\.runbot\\d{3}\\.odoo\\.com'],
    },
    limited: true,
};
