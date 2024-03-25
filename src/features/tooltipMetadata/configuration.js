export default {
    id: 'tooltipMetadata',
    display_name: 'Tooltip Metadata',
    icon: ["<i class='fa-regular fa-circle-question'></i>"],
    trigger: {
        content: {
            load: false,
            navigate: false,
        },
        option: true,
        popup: true,
        background: false,
    },
    defaultSettings: {
        tooltipMetadataEnabled: false,
        tooltipMetadataWhitelistMode: false,
    },
};
