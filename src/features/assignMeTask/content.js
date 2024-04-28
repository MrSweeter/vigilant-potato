import ProjectTaskShareContentFeature from '../../shared/projectTaskShare/content.js';
import { getProjectTaskID_fromURL } from '../../utils/url_manager.js';
import { getCurrentUserID } from '../../utils/user.js';
import configuration from './configuration.js';

const ASSIGN_TYPE = Object.freeze({
    RELOAD: 'reload',
    REDIRECT: 'redirect',
});

export default class AssignMeTaskContentFeature extends ProjectTaskShareContentFeature {
    constructor() {
        super(configuration);
    }

    async loadFeatureWithTask(task) {
        const currentUser = await getCurrentUserID();
        if (currentUser === undefined) return;
        const userAssigned = task.user_ids.includes(currentUser);

        const exist = document.getElementsByName('qol_action_assign_to_me');
        // Avoid adding button if already added, remove it if user already assigned
        if (exist.length > 0) {
            if (userAssigned) exist.forEach((e) => e.remove());
            exist.forEach((e) => {
                this.updateAssignMeTaskEvent(e, task, currentUser);
                e.disabled = false;
            });
            return;
        }

        if (userAssigned) return;

        this.appendAssignMeTaskButtonToDom(task, currentUser);
    }

    preloadFeature() {
        const exist = document.getElementsByName('qol_action_assign_to_me');
        exist.forEach((e) => (e.disabled = true));
    }

    async addUserToTaskAssignees(task, userID, callback) {
        const taskID = await getProjectTaskID_fromURL(window.location.href);
        if (task.id != taskID)
            throw new Error(
                `Button context is not the same as the url context: '${task.id}' vs '${taskID}'`
            );

        const newUsers = task.user_ids.concat(userID);

        const writeResponse = await fetch(
            new Request(`/web/dataset/call_kw/project.task/write`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: 1,
                    method: 'call',
                    jsonrpc: '2.0',
                    params: {
                        args: [task.id, { user_ids: newUsers }],
                        kwargs: { context: {} },
                        model: 'project.task',
                        method: 'write',
                    },
                }),
            })
        );

        const data = await writeResponse.json();

        if (data?.error || data?.result === false) {
            // TODO[IMP] Display error to user
            throw new Error(data.error?.data?.message, "'Assign to me' call failed !");
        }
        if (data?.result === true) {
            switch (callback) {
                case ASSIGN_TYPE.RELOAD: {
                    window.location.reload();
                    return;
                }
                case ASSIGN_TYPE.REDIRECT: {
                    window.open(window.location.href);
                    return;
                }
            }
            return;
        }
        throw new Error(data?.result || "Unknown response from 'Assign to me' call...");
    }

    appendAssignMeTaskButtonToDom(task, currentUser) {
        const buttonTemplate = document.createElement('template');
        buttonTemplate.innerHTML = `
            <button class="btn btn-warning" name="qol_action_assign_to_me" type="object">
                <span>Assign to me</span>
            </button>
        `.trim();

        const assignButton = buttonTemplate.content.firstChild;
        this.updateAssignMeTaskEvent(assignButton, task, currentUser);

        const statusBarButtons = document.getElementsByClassName('o_statusbar_buttons')[0];
        if (statusBarButtons) statusBarButtons.appendChild(assignButton);
    }

    updateAssignMeTaskEvent(btn, task, currentUser) {
        btn.onclick = () => {
            this.addUserToTaskAssignees(task, currentUser, ASSIGN_TYPE.RELOAD);
        };

        btn.onauxclick = () => {
            this.addUserToTaskAssignees(task, currentUser, ASSIGN_TYPE.REDIRECT);
        };
    }
}