import * as _nuxt_schema from '@nuxt/schema';

type BugfreedbackButtonLayout = 'horizontal' | 'vertical';
type BugfreedbackEdge = 'left' | 'right' | 'top' | 'bottom';
type BugfreedbackAuthMode = 'required' | 'optional' | 'none';
type BugfreedbackStorageProvider = 'gcs' | 's3' | 'none';
type BugfreedbackExportProvider = 'github' | 'linear' | 'jira' | 'notion' | 'slack' | 'asana' | 'trello' | 'webhook' | 'ifttt';
type BugfreedbackPositionOptions = {
    edge: BugfreedbackEdge;
    offsetX: number;
    offsetY: number;
};
type BugfreedbackGcsStorageOptions = {
    provider: 'gcs';
    bucket: string;
    objectPrefix?: string;
};
type BugfreedbackS3StorageOptions = {
    provider: 's3';
    bucket: string;
    region?: string;
    endpoint?: string;
    forcePathStyle?: boolean;
    publicBaseUrl?: string;
    objectPrefix?: string;
    accessKeyId?: string;
    secretAccessKey?: string;
};
type BugfreedbackNoneStorageOptions = {
    provider: 'none';
};
type BugfreedbackStorageOptions = BugfreedbackGcsStorageOptions | BugfreedbackS3StorageOptions | BugfreedbackNoneStorageOptions;
type BugfreedbackGithubExportOptions = {
    provider: 'github';
    token: string;
    owner: string;
    repo: string;
    labels?: string[];
};
type BugfreedbackWebhookExportOptions = {
    provider: 'webhook';
    url: string;
    headers?: Record<string, string>;
};
type BugfreedbackLinearExportOptions = {
    provider: 'linear';
    apiKey: string;
    teamId: string;
    labelIds?: string[];
};
type BugfreedbackJiraExportOptions = {
    provider: 'jira';
    baseUrl: string;
    email: string;
    apiToken: string;
    projectKey: string;
    issueType?: string;
};
type BugfreedbackNotionExportOptions = {
    provider: 'notion';
    token: string;
    databaseId: string;
};
type BugfreedbackSlackExportOptions = {
    provider: 'slack';
    webhookUrl: string;
    channel?: string;
};
type BugfreedbackAsanaExportOptions = {
    provider: 'asana';
    token: string;
    projectGid: string;
    workspaceGid?: string;
};
type BugfreedbackTrelloExportOptions = {
    provider: 'trello';
    apiKey: string;
    token: string;
    listId: string;
};
type BugfreedbackIftttExportOptions = {
    provider: 'ifttt';
    eventName: string;
    webhookKey: string;
};
type BugfreedbackExportOptions = BugfreedbackGithubExportOptions | BugfreedbackWebhookExportOptions | BugfreedbackLinearExportOptions | BugfreedbackJiraExportOptions | BugfreedbackNotionExportOptions | BugfreedbackSlackExportOptions | BugfreedbackAsanaExportOptions | BugfreedbackTrelloExportOptions | BugfreedbackIftttExportOptions;
interface ModuleOptions {
    /** When false, widget and API are disabled. */
    enabled: boolean;
    primaryColor: string;
    secondaryColor: string;
    primaryTextColor: string;
    buttonLayout: BugfreedbackButtonLayout;
    position: BugfreedbackPositionOptions;
    auth: BugfreedbackAuthMode;
    /** Launcher button label. */
    label: string;
    /** Submit endpoint path (module registers under /api/_bugfreedback/submit by default). */
    submitPath: string;
    storage: BugfreedbackStorageOptions;
    export: BugfreedbackExportOptions;
}

declare const _default: _nuxt_schema.NuxtModule<ModuleOptions, ModuleOptions, false>;

export { _default as default };
export type { BugfreedbackAuthMode, BugfreedbackButtonLayout, BugfreedbackEdge, BugfreedbackExportOptions, BugfreedbackExportProvider, BugfreedbackPositionOptions, BugfreedbackStorageOptions, BugfreedbackStorageProvider, ModuleOptions };
