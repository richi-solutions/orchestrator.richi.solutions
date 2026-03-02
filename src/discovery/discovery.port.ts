import { Result } from '../lib/result';
import { RepoInfo } from './types';

export interface DiscoveryPort {
  discoverRepos(): Promise<Result<RepoInfo[]>>;
  getRepoConfig(repoName: string): Promise<Result<Record<string, unknown> | null>>;
}
