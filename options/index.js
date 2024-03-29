import { load as loadThemeSwitch } from './src/theme_switch.js';
import { load as loadAwesomeLoading } from './src/awesome_loading.js';
import { load as loadTaskSetup } from './src/task_setup.js';
import { load as loadKnowledge } from './src/save_knowledge.js';
import { load as loadOriginsFilter } from './src/origins_filter.js';
import { load as loadAwesomeStyle } from './src/awesome_style.js';
import { load as loadUnfocusApp } from './src/unfocus_app.js';
import { load as loadSmartLogin } from './src/runbot_smart_login.js';
import { load as loadNewServerActionCode } from './src/new_server_action_code.js';
import { load as loadTooltipMetadata } from './src/tooltip_metadata.js';
import { load as loadKeyboardShortcut } from './src/keyboard_shortcut.js';
import { setupDragAndDrop } from './src/features.js';
import { initImportExport } from './import_export.js';
import { StorageSync } from '../utils/browser.js';
import { QOL_DEFAULT_CONFIGURATION } from '../utils/feature_default_configuration.js';

async function onDOMContentLoaded() {
    document.getElementById('copyright-year').innerText = new Date().getFullYear();
    //document.getElementById('copyright-link').href = Runtime.getManifest().homepage_url; Not public API

    setupDragAndDrop();

    await loadOriginsFilter();

    loadThemeSwitch();
    loadAwesomeLoading();
    loadTaskSetup();
    loadKnowledge();
    loadAwesomeStyle();
    loadUnfocusApp();
    loadSmartLogin();
    loadNewServerActionCode();
    loadTooltipMetadata();
    loadKeyboardShortcut();
    initImportExport();

    const searchParams = new URLSearchParams(window.location.search);
    let htmlDebug = 1;
    if (searchParams.get('debug') == 1) {
        htmlDebug = 0;
        const debug = document.getElementById('qol-debug-configuration');
        const config = await StorageSync.get(QOL_DEFAULT_CONFIGURATION);
        debug.innerHTML = JSON.stringify(config, null, 4);
    }
    document.getElementById('qol-brand-debug').href = `?debug=${htmlDebug}`;
}

document.removeEventListener('DOMContentLoaded', onDOMContentLoaded);
document.addEventListener('DOMContentLoaded', onDOMContentLoaded);
