export default {
    id: 'saveKnowledge',
    display_name: 'Save Knowledge',
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
        saveKnowledgeEnabled: false,
        saveKnowledgeWhitelistMode: false,
    },
};
