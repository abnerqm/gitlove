import { useEffect, useState } from "react";
import {
  getGitHubAuthorizationUrl,
  getGitHubRepositories,
  getGitHubUser,
} from "../services/api";
import "../styles/github.css";

type GitHubUser = {
  login: string;
  name: string | null;
  avatar_url: string;
};

type Repository = {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  default_branch: string;
  html_url: string;
};

function GitHub() {
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState("");

  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [selectedRepository, setSelectedRepository] =
    useState<Repository | null>(null);

  const [selectedBranch, setSelectedBranch] = useState("");
  const [projectSaved, setProjectSaved] = useState(false);

  useEffect(() => {
    const loadGitHubData = async () => {
      try {
        setLoadingData(true);
        setError("");

        const [userData, repoData] = await Promise.all([
          getGitHubUser(),
          getGitHubRepositories(),
        ]);

        setUser(userData.user);
        setRepositories(repoData.repositories);
      } catch (err) {
        console.error(err);
        setError("Unable to load GitHub information.");
      } finally {
        setLoadingData(false);
      }
    };

    loadGitHubData();
  }, []);

  const handleConnect = async () => {
    try {
      setLoading(true);
      setError("");

      const authorizationUrl = await getGitHubAuthorizationUrl();

      window.location.href = authorizationUrl;
    } catch (err) {
      console.error(err);
      setError("Unable to connect to GitHub.");
      setLoading(false);
    }
  };

  const handleUseProject = () => {
    if (!selectedRepository || !selectedBranch) {
      setError("Selecciona un repositorio y una rama.");
      return;
    }

    localStorage.setItem(
      "gitlove-project",
      JSON.stringify({
        repositoryId: selectedRepository.id,
        repository: selectedRepository.full_name,
        branch: selectedBranch,
      }),
    );

    setProjectSaved(true);
    setError("");
  };

  if (loadingData) {
    return (
      <div className="github-page">
        <div className="github-header">
          <p className="section-label">INTEGRATION</p>
          <h1>GitHub</h1>
          <p className="github-description">
            Loading your GitHub account...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="github-page">
        <div className="github-header">
          <p className="section-label">INTEGRATION</p>
          <h1>GitHub</h1>
          <p className="github-description">
            Connect your GitHub account to continue.
          </p>
        </div>

        <div className="github-card">
          <div className="github-logo">◆</div>

          <div className="github-content">
            <div className="github-status">
              <span className="status-dot" />
              Not connected
            </div>

            <h2>Connect your GitHub account</h2>

            <p>
              GITLOVE uses GitHub's official authorization flow to connect your
              repositories securely.
            </p>

            <button
              className="github-connect-button"
              onClick={handleConnect}
              disabled={loading}
            >
              {loading ? "Connecting..." : "Connect GitHub"}
              {!loading && <span>→</span>}
            </button>

            {error && <div className="github-error">{error}</div>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="github-page">
      <div className="github-header">
        <div>
          <p className="section-label">INTEGRATION</p>
          <h1>GitHub</h1>

          <p className="github-description">
            Your GitHub account is connected to GITLOVE.
          </p>
        </div>
      </div>

      <div className="github-profile-card">
        <img
          className="github-avatar"
          src={user.avatar_url}
          alt={user.login}
        />

        <div>
          <div className="github-connected">
            <span className="connected-dot" />
            GitHub connected
          </div>

          <h2>@{user.login}</h2>

          <p>Authorized account</p>
        </div>
      </div>

      <div className="github-repository-section">
        <div className="repository-heading">
          <div>
            <p className="section-label">PROJECT</p>
            <h2>Select a repository</h2>
          </div>

          <span className="repository-count">
            {repositories.length} repositories
          </span>
        </div>

        <select
          className="repository-select"
          value={selectedRepository?.id ?? ""}
          onChange={(event) => {
            const repository = repositories.find(
              (repo) => repo.id === Number(event.target.value),
            );

            setSelectedRepository(repository ?? null);
            setSelectedBranch(
              repository?.default_branch ?? "",
            );
            setProjectSaved(false);
            setError("");
          }}
        >
          <option value="">Choose a repository</option>

          {repositories.map((repo) => (
            <option key={repo.id} value={repo.id}>
              {repo.full_name}
              {repo.private ? " • Private" : " • Public"}
            </option>
          ))}
        </select>

        {selectedRepository && (
          <>
            <div className="selected-repository">
              <div>
                <span className="repository-label">
                  SELECTED REPOSITORY
                </span>

                <strong>{selectedRepository.full_name}</strong>
              </div>

              <div>
                <span className="repository-label">
                  DEFAULT BRANCH
                </span>

                <strong>{selectedRepository.default_branch}</strong>
              </div>
            </div>

            <div className="branch-section">
              <div className="repository-heading">
                <div>
                  <p className="section-label">BRANCH</p>
                  <h2>Select a branch</h2>
                </div>
              </div>

              <select
                className="repository-select"
                value={selectedBranch}
                onChange={(event) => {
                  setSelectedBranch(event.target.value);
                  setProjectSaved(false);
                  setError("");
                }}
              >
                <option value="">Choose a branch</option>
                <option value={selectedRepository.default_branch}>
                  {selectedRepository.default_branch}
                </option>
              </select>

              <button
                className="use-project-button"
                onClick={handleUseProject}
              >
                Use this project
                <span>→</span>
              </button>

              {projectSaved && (
                <div className="project-saved">
                  ✓ Project selected successfully
                </div>
              )}
            </div>
          </>
        )}

        {error && (
          <div className="github-error">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

export default GitHub;