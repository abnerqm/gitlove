import { useEffect, useState } from "react";
import {
  createGitHubBranch,
  getGitHubAuthorizationUrl,
  getGitHubBranches,
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

type Branch = {
  name: string;
  protected: boolean;
};

function GitHub() {
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [loadingBranches, setLoadingBranches] = useState(false);
  const [creatingBranch, setCreatingBranch] = useState(false);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [user, setUser] = useState<GitHubUser | null>(null);

  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [selectedRepository, setSelectedRepository] =
    useState<Repository | null>(null);

  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState("");

  const [projectSaved, setProjectSaved] = useState(false);
  const [workBranch, setWorkBranch] = useState("");

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

      const authorizationUrl =
        await getGitHubAuthorizationUrl();

      window.location.href = authorizationUrl;
    } catch (err) {
      console.error(err);
      setError("Unable to connect to GitHub.");
      setLoading(false);
    }
  };

  const loadBranches = async (repository: Repository) => {
    try {
      setLoadingBranches(true);
      setError("");
      setSuccessMessage("");

      const [owner, repoName] =
        repository.full_name.split("/");

      if (!owner || !repoName) {
        throw new Error("Invalid repository name.");
      }

      const data = await getGitHubBranches(
        owner,
        repoName,
      );

      setBranches(data.branches);

      const defaultBranch = data.branches.find(
        (branch: Branch) =>
          branch.name === repository.default_branch,
      );

      setSelectedBranch(
        defaultBranch?.name ??
          data.branches[0]?.name ??
          "",
      );
    } catch (err) {
      console.error(err);

      setBranches([]);
      setSelectedBranch("");
      setError(
        "Unable to load repository branches.",
      );
    } finally {
      setLoadingBranches(false);
    }
  };

  const handleRepositoryChange = async (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const repository = repositories.find(
      (repo) =>
        repo.id === Number(event.target.value),
    );

    setSelectedRepository(
      repository ?? null,
    );

    setBranches([]);
    setSelectedBranch("");
    setProjectSaved(false);
    setWorkBranch("");
    setSuccessMessage("");
    setError("");

    if (repository) {
      await loadBranches(repository);
    }
  };

  const handleUseProject = () => {
    if (
      !selectedRepository ||
      !selectedBranch
    ) {
      setError(
        "Selecciona un repositorio y una rama.",
      );
      return;
    }

    localStorage.setItem(
      "gitlove-project",
      JSON.stringify({
        repositoryId: selectedRepository.id,
        repository:
          selectedRepository.full_name,
        branch: selectedBranch,
      }),
    );

    setProjectSaved(true);
    setError("");
    setSuccessMessage(
      "Project selected successfully.",
    );
  };

  const handleCreateWorkBranch = async () => {
    if (
      !selectedRepository ||
      !selectedBranch
    ) {
      setError(
        "Selecciona un repositorio y una rama base.",
      );
      return;
    }

    try {
      setCreatingBranch(true);
      setError("");
      setSuccessMessage("");

      const [owner, repoName] =
        selectedRepository.full_name.split("/");

      const newBranch =
        `gitlove/task-${Date.now()}`;

      const result =
        await createGitHubBranch(
          owner,
          repoName,
          selectedBranch,
          newBranch,
        );

      setWorkBranch(
        result.branch.name,
      );

      setSuccessMessage(
        `Work branch created: ${result.branch.name}`,
      );

      setProjectSaved(true);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to create work branch.",
      );
    } finally {
      setCreatingBranch(false);
    }
  };

  if (loadingData) {
    return (
      <div className="github-page">
        <div className="github-header">
          <p className="section-label">
            INTEGRATION
          </p>

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
          <p className="section-label">
            INTEGRATION
          </p>

          <h1>GitHub</h1>

          <p className="github-description">
            Connect your GitHub account to
            continue.
          </p>
        </div>

        <div className="github-card">
          <div className="github-logo">
            ◆
          </div>

          <div className="github-content">
            <div className="github-status">
              <span className="status-dot" />
              Not connected
            </div>

            <h2>
              Connect your GitHub account
            </h2>

            <p>
              GITLOVE uses GitHub&apos;s official
              authorization flow to connect your
              repositories securely.
            </p>

            <button
              className="github-connect-button"
              onClick={handleConnect}
              disabled={loading}
            >
              {loading
                ? "Connecting..."
                : "Connect GitHub"}

              {!loading && <span>→</span>}
            </button>

            {error && (
              <div className="github-error">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="github-page">
      <div className="github-header">
        <p className="section-label">
          INTEGRATION
        </p>

        <h1>GitHub</h1>

        <p className="github-description">
          Your GitHub account is connected to
          GITLOVE.
        </p>
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

          <p>
            Authorized account
          </p>
        </div>
      </div>

      <div className="github-repository-section">
        <div className="repository-heading">
          <div>
            <p className="section-label">
              PROJECT
            </p>

            <h2>
              Select a repository
            </h2>
          </div>

          <span className="repository-count">
            {repositories.length} repositories
          </span>
        </div>

        <select
          className="repository-select"
          value={
            selectedRepository?.id ?? ""
          }
          onChange={
            handleRepositoryChange
          }
        >
          <option value="">
            Choose a repository
          </option>

          {repositories.map((repo) => (
            <option
              key={repo.id}
              value={repo.id}
            >
              {repo.full_name}
              {repo.private
                ? " • Private"
                : " • Public"}
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

                <strong>
                  {
                    selectedRepository.full_name
                  }
                </strong>
              </div>

              <div>
                <span className="repository-label">
                  DEFAULT BRANCH
                </span>

                <strong>
                  {
                    selectedRepository.default_branch
                  }
                </strong>
              </div>
            </div>

            <div className="branch-section">
              <div className="repository-heading">
                <div>
                  <p className="section-label">
                    BASE BRANCH
                  </p>

                  <h2>
                    Select a branch
                  </h2>
                </div>

                {loadingBranches && (
                  <span className="repository-count">
                    Loading...
                  </span>
                )}
              </div>

              <select
                className="repository-select"
                value={selectedBranch}
                onChange={(event) => {
                  setSelectedBranch(
                    event.target.value,
                  );

                  setProjectSaved(false);
                  setWorkBranch("");
                  setSuccessMessage("");
                  setError("");
                }}
                disabled={loadingBranches}
              >
                <option value="">
                  {loadingBranches
                    ? "Loading branches..."
                    : "Choose a branch"}
                </option>

                {branches.map((branch) => (
                  <option
                    key={branch.name}
                    value={branch.name}
                  >
                    {branch.name}
                    {branch.protected
                      ? " • Protected"
                      : ""}
                  </option>
                ))}
              </select>

              <button
                className="use-project-button"
                onClick={handleUseProject}
                disabled={
                  loadingBranches ||
                  !selectedRepository ||
                  !selectedBranch
                }
              >
                Use this project
                <span>→</span>
              </button>

              {projectSaved && (
                <div className="project-saved">
                  ✓ Project selected
                  successfully
                </div>
              )}

              <div className="work-branch-box">
                <div>
                  <p className="section-label">
                    SAFE DEVELOPMENT
                  </p>

                  <h2>
                    Create a work branch
                  </h2>

                  <p className="work-branch-description">
                    GITLOVE will create a separate
                    branch from your selected base
                    branch. Your main code remains
                    protected.
                  </p>
                </div>

                <button
                  className="use-project-button"
                  onClick={
                    handleCreateWorkBranch
                  }
                  disabled={
                    creatingBranch ||
                    loadingBranches ||
                    !selectedRepository ||
                    !selectedBranch
                  }
                >
                  {creatingBranch
                    ? "Creating branch..."
                    : "Create work branch"}

                  {!creatingBranch && (
                    <span>→</span>
                  )}
                </button>

                {workBranch && (
                  <div className="branch-created">
                    <span>✓</span>

                    <div>
                      <small>
                        WORK BRANCH CREATED
                      </small>

                      <strong>
                        {workBranch}
                      </strong>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {successMessage && (
          <div className="project-saved">
            ✓ {successMessage}
          </div>
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