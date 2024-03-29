import { Runtime, StorageSync, Tabs, WebNavigation } from '../utils/browser.js';
import { QOL_DEFAULT_CONFIGURATION } from '../utils/feature_default_configuration.js';
import { checkVersion } from './src/check_version.js';
import { switchThemeIfNeeded } from './src/theme_switch.js';
import { getFinalRunbotURL } from './src/runbot_smart_login.js';
import { checkCommandShortcuts, handleCommands, updateTabState } from './src/keyboard_shortcut.js';

// On page # path change
WebNavigation.onReferenceFragmentUpdated.addListener((e) => {
    if (e.url.startsWith('http')) {
        Tabs.sendMessage(e.tabId, { url: e.url });
    }
});

Tabs.onUpdated.addListener((_1, _2, tabInfo) => {
    if (tabInfo.url.startsWith('http')) {
        switchThemeIfNeeded(tabInfo);
    }
});

Runtime.onInstalled.addListener(async (details) => {
    if (details.reason === Runtime.OnInstalledReason.INSTALL) {
        const configurationOrDefault = await StorageSync.get(QOL_DEFAULT_CONFIGURATION);
        await StorageSync.set(configurationOrDefault);
        checkCommandShortcuts();
    }
});

const AVAILABLE_ACTION_MESSAGES_HANDLERS = {
    GET_FINAL_RUNBOT_URL: getFinalRunbotURL,
    UPDATE_EXT_STATUS: updateTabState,
};

// Triggers when a message is received (from the content script)
Runtime.onMessage.addListener((request, _, sendResponse) => {
    AVAILABLE_ACTION_MESSAGES_HANDLERS[request.action]?.(request)
        .then(sendResponse)
        .catch((ex) => {
            console.log(ex);
            sendResponse();
        });
    return true; // Needed for asynchronous
});

checkVersion();
handleCommands();
