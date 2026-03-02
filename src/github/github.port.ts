import { Result } from '../lib/result';

export interface CommitInfo {
  sha: string;
  message: string;
  author: string;
  date: string;
  repo: string;
}

export interface RepoListItem {
  name: string;
  defaultBranch: string;
  archived: boolean;
}

export interface GitHubPort {
  listOrgRepos(org: string): Promise<Result<RepoListItem[]>>;
  fileExists(owner: string, repo: string, path: string): Promise<Result<boolean>>;
  readFile(owner: string, repo: string, path: string): Promise<Result<string>>;
  listCommitsSince(owner: string, repo: string, since: string): Promise<Result<CommitInfo[]>>;
}
