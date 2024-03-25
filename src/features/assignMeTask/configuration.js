export default {
    id: 'assignMeTask',
    display_name: 'Assign Me Task',
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
        assignMeTaskEnabled: false,
        assignMeTaskWhitelistMode: false,
    },
};
