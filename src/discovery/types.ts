export interface RepoInfo {
  name: string;
  fullName: string;
  defaultBranch: string;
  hasProjectYaml: boolean;
  projectConfig?: Record<string, unknown>;
}
