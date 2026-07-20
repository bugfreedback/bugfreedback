export type BugfreedbackButtonLayout = 'horizontal' | 'vertical'

export type BugfreedbackEdge = 'left' | 'right' | 'top' | 'bottom'

export type BugfreedbackAuthMode = 'required' | 'optional' | 'none'

export type BugfreedbackStorageProvider = 'gcs' | 's3' | 'none'

export type BugfreedbackExportProvider
  = | 'github'
    | 'linear'
    | 'jira'
    | 'notion'
    | 'slack'
    | 'asana'
    | 'trello'
    | 'webhook'
    | 'ifttt'

export type BugfreedbackPositionOptions = {
  edge: BugfreedbackEdge
  offsetX: number
  offsetY: number
}

export type BugfreedbackGcsStorageOptions = {
  provider: 'gcs'
  bucket: string
  objectPrefix?: string
}

export type BugfreedbackS3StorageOptions = {
  provider: 's3'
  bucket: string
  region?: string
  endpoint?: string
  forcePathStyle?: boolean
  publicBaseUrl?: string
  objectPrefix?: string
  accessKeyId?: string
  secretAccessKey?: string
}

export type BugfreedbackNoneStorageOptions = {
  provider: 'none'
}

export type BugfreedbackStorageOptions
  = | BugfreedbackGcsStorageOptions
    | BugfreedbackS3StorageOptions
    | BugfreedbackNoneStorageOptions

export type BugfreedbackGithubExportOptions = {
  provider: 'github'
  token: string
  owner: string
  repo: string
  labels?: string[]
}

export type BugfreedbackWebhookExportOptions = {
  provider: 'webhook'
  url: string
  headers?: Record<string, string>
}

export type BugfreedbackLinearExportOptions = {
  provider: 'linear'
  apiKey: string
  teamId: string
  labelIds?: string[]
}

export type BugfreedbackJiraExportOptions = {
  provider: 'jira'
  baseUrl: string
  email: string
  apiToken: string
  projectKey: string
  issueType?: string
}

export type BugfreedbackNotionExportOptions = {
  provider: 'notion'
  token: string
  databaseId: string
}

export type BugfreedbackSlackExportOptions = {
  provider: 'slack'
  webhookUrl: string
  channel?: string
}

export type BugfreedbackAsanaExportOptions = {
  provider: 'asana'
  token: string
  projectGid: string
  workspaceGid?: string
}

export type BugfreedbackTrelloExportOptions = {
  provider: 'trello'
  apiKey: string
  token: string
  listId: string
}

export type BugfreedbackIftttExportOptions = {
  provider: 'ifttt'
  eventName: string
  webhookKey: string
}

export type BugfreedbackExportOptions
  = | BugfreedbackGithubExportOptions
    | BugfreedbackWebhookExportOptions
    | BugfreedbackLinearExportOptions
    | BugfreedbackJiraExportOptions
    | BugfreedbackNotionExportOptions
    | BugfreedbackSlackExportOptions
    | BugfreedbackAsanaExportOptions
    | BugfreedbackTrelloExportOptions
    | BugfreedbackIftttExportOptions

export interface ModuleOptions {
  /** When false, widget and API are disabled. */
  enabled: boolean
  primaryColor: string
  secondaryColor: string
  primaryTextColor: string
  buttonLayout: BugfreedbackButtonLayout
  position: BugfreedbackPositionOptions
  auth: BugfreedbackAuthMode
  /** Launcher button label. */
  label: string
  /** Submit endpoint path (module registers under /api/_bugfreedback/submit by default). */
  submitPath: string
  storage: BugfreedbackStorageOptions
  export: BugfreedbackExportOptions
}
