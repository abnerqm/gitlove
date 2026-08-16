import {
  useEffect,
  useState,
} from "react";

import {
  checkBackend,
  getGitHubRepositories,
  getGitHubUser,
  getGitHubBranches,
  createGitHubBranch,
  analyzeRepositoryChange,
  downloadPreviewProject,
  detectPreviewProject,
  startPreviewProject,
} from "../services/api";

import "../styles/dashboard.css";

type NavItem =
  | "dashboard"
  | "project"
  | "github"
  | "history"
  | "settings";

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
};

type Branch = {
  name: string;
  protected: boolean;
};

type AnalysisFile = {
  path: string;
  score: number;
  reasons: string[];
};

type AnalysisResult = {
  success: boolean;
  message: string;
  repository: string;
  branch: string;
  instruction: string;
  filesAnalyzed: number;
  filesToModify: AnalysisFile[];
  filesToReview: AnalysisFile[];
  why: string[];
  candidateFiles: string[];
  plan: string[];
  validations: string[];
  notice?: string;
};

type DetectedProject = {
  framework: string;
  packageManager: string;
  devCommand: string;
  hasPackageJson: boolean;
  hasViteConfig: boolean;
  hasReact: boolean;
  status:
    | "ready"
    | "unsupported";
};

type DashboardProps = {
  onGitHub: () => void;
};

function Dashboard({
  onGitHub,
}: DashboardProps) {
  const [
    activeItem,
    setActiveItem,
  ] = useState<NavItem>(
    "dashboard",
  );

  const [
    backendStatus,
    setBackendStatus,
  ] = useState<
    "checking" |
      "online" |
      "offline"
  >("checking");

  const [
    githubConnected,
    setGithubConnected,
  ] = useState(false);

  const [user, setUser] =
    useState<GitHubUser | null>(
      null,
    );

  const [
    repositories,
    setRepositories,
  ] = useState<Repository[]>(
    [],
  );

  const [branches, setBranches] =
    useState<Branch[]>([]);

  const [
    selectedRepository,
    setSelectedRepository,
  ] = useState<Repository | null>(
    null,
  );

  const [
    selectedBranch,
    setSelectedBranch,
  ] = useState("");

  const [
    workBranch,
    setWorkBranch,
  ] = useState("");

  const [
    loadingGitHub,
    setLoadingGitHub,
  ] = useState(false);

  const [
    loadingBranches,
    setLoadingBranches,
  ] = useState(false);

  const [
    creatingBranch,
    setCreatingBranch,
  ] = useState(false);

  const [
    preparingPreview,
    setPreparingPreview,
  ] = useState(false);

  const [
    detectingProject,
    setDetectingProject,
  ] = useState(false);

  const [
    startingPreview,
    setStartingPreview,
  ] = useState(false);

  const [
    previewReady,
    setPreviewReady,
  ] = useState(false);

  const [
    previewDirectory,
    setPreviewDirectory,
  ] = useState("");

  const [
    detectedProject,
    setDetectedProject,
  ] =
    useState<DetectedProject | null>(
      null,
    );

  const [
    previewUrl,
    setPreviewUrl,
  ] = useState("");

  const [
    connectionMessage,
    setConnectionMessage,
  ] = useState("");

  const [
    instruction,
    setInstruction,
  ] = useState("");

  const [analysis, setAnalysis] =
    useState<AnalysisResult | null>(
      null,
    );

  const [
    showAnalysis,
    setShowAnalysis,
  ] = useState(false);

  const [analyzing, setAnalyzing] =
    useState(false);

  const licenseCode =
    localStorage.getItem(
      "gitlove-license-code",
    ) || "GL-DEMO-2026";

  useEffect(() => {
    checkBackend()
      .then(() =>
        setBackendStatus(
          "online",
        ),
      )
      .catch(() =>
        setBackendStatus(
          "offline",
        ),
      );
  }, []);

  useEffect(() => {
    const connected =
      localStorage.getItem(
        "gitlove-github-connected",
      ) === "true";

    setGithubConnected(
      connected,
    );

    if (connected) {
      loadGitHubData();
    }
  }, []);

  const loadGitHubData =
    async () => {
      try {
        setLoadingGitHub(true);
        setConnectionMessage("");

        const [
          userData,
          repositoryData,
        ] = await Promise.all([
          getGitHubUser(),
          getGitHubRepositories(),
        ]);

        setUser(
          userData.user,
        );

        setRepositories(
          repositoryData.repositories,
        );

        setGithubConnected(
          true,
        );

        const savedProject =
          localStorage.getItem(
            "gitlove-project",
          );

        if (savedProject) {
          try {
            const project =
              JSON.parse(
                savedProject,
              );

            const savedRepository =
              repositoryData.repositories.find(
                (repo: Repository) =>
                  repo.id ===
                  project.repositoryId,
              );

            if (savedRepository) {
              setSelectedRepository(
                savedRepository,
              );

              await loadBranches(
                savedRepository,
                project.branch,
              );
            }
          } catch {
            localStorage.removeItem(
              "gitlove-project",
            );
          }
        }
      } catch (error) {
        console.error(error);

        setGithubConnected(
          false,
        );

        setConnectionMessage(
          "Connect GitHub to load your project.",
        );
      } finally {
        setLoadingGitHub(
          false,
        );
      }
    };

  const loadBranches =
    async (
      repository: Repository,
      preferredBranch?: string,
    ) => {
      try {
        setLoadingBranches(
          true,
        );

        const [
          owner,
          repoName,
        ] =
          repository.full_name.split(
            "/",
          );

        const data =
          await getGitHubBranches(
            owner,
            repoName,
          );

        setBranches(
          data.branches,
        );

        const preferred =
          data.branches.find(
            (branch: Branch) =>
              branch.name ===
              preferredBranch,
          );

        const defaultBranch =
          data.branches.find(
            (branch: Branch) =>
              branch.name ===
              repository.default_branch,
          );

        const branch =
          preferred?.name ??
          defaultBranch?.name ??
          data.branches[0]?.name ??
          "";

        setSelectedBranch(
          branch,
        );

        if (
          preferredBranch &&
          preferredBranch.startsWith(
            "gitlove/",
          )
        ) {
          setWorkBranch(
            preferredBranch,
          );
        }
      } catch (error) {
        console.error(error);

        setBranches([]);
        setSelectedBranch("");
      } finally {
        setLoadingBranches(
          false,
        );
      }
    };

  const handleRepositoryChange =
    async (
      event: React.ChangeEvent<HTMLSelectElement>,
    ) => {
      const repository =
        repositories.find(
          (repo) =>
            repo.id ===
            Number(
              event.target.value,
            ),
        );

      setSelectedRepository(
        repository ?? null,
      );

      setSelectedBranch("");
      setWorkBranch("");
      setPreviewReady(false);
      setPreviewDirectory("");
      setDetectedProject(null);
      setPreviewUrl("");
      setConnectionMessage("");
      setAnalysis(null);
      setShowAnalysis(false);

      if (repository) {
        await loadBranches(
          repository,
        );
      }
    };

  const handleBranchChange =
    (
      event: React.ChangeEvent<HTMLSelectElement>,
    ) => {
      const branch =
        event.target.value;

      setSelectedBranch(
        branch,
      );

      if (
        branch.startsWith(
          "gitlove/",
        )
      ) {
        setWorkBranch(branch);
      } else {
        setWorkBranch("");
      }

      setPreviewReady(false);
      setPreviewDirectory("");
      setDetectedProject(null);
      setPreviewUrl("");
      setAnalysis(null);
      setShowAnalysis(false);
      setConnectionMessage("");
    };

  const saveProject = (
    repository: Repository,
    branch: string,
  ) => {
    localStorage.setItem(
      "gitlove-project",
      JSON.stringify({
        repositoryId:
          repository.id,
        repository:
          repository.full_name,
        branch,
      }),
    );
  };

  const handleCreateWorkBranch =
    async () => {
      if (
        !selectedRepository ||
        !selectedBranch
      ) {
        setConnectionMessage(
          "Select a repository and base branch first.",
        );

        return;
      }

      try {
        setCreatingBranch(true);
        setConnectionMessage("");
        setAnalysis(null);
        setShowAnalysis(false);

        const [
          owner,
          repoName,
        ] =
          selectedRepository.full_name.split(
            "/",
          );

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

        setSelectedBranch(
          result.branch.name,
        );

        setBranches(
          (current) => [
            ...current,
            {
              name:
                result.branch
                  .name,
              protected: false,
            },
          ],
        );

        saveProject(
          selectedRepository,
          result.branch.name,
        );

        setPreviewReady(false);
        setPreviewDirectory("");
        setDetectedProject(null);
        setPreviewUrl("");

        setConnectionMessage(
          `✓ Work branch created: ${result.branch.name}`,
        );
      } catch (error) {
        console.error(error);

        setConnectionMessage(
          error instanceof Error
            ? error.message
            : "Unable to create work branch.",
        );
      } finally {
        setCreatingBranch(
          false,
        );
      }
    };

  const handlePreparePreview =
    async () => {
      if (
        !selectedRepository
      ) {
        setConnectionMessage(
          "Select a repository first.",
        );
        return;
      }

      const branch =
        workBranch ||
        selectedBranch;

      if (!branch) {
        setConnectionMessage(
          "Select a branch first.",
        );
        return;
      }

      try {
        setPreparingPreview(true);
        setPreviewReady(false);
        setPreviewDirectory("");
        setDetectedProject(null);
        setPreviewUrl("");
        setConnectionMessage("");

        const [
          owner,
          repoName,
        ] =
          selectedRepository.full_name.split(
            "/",
          );

        const result =
          await downloadPreviewProject(
            owner,
            repoName,
            branch,
          );

        setPreviewDirectory(
          result.project.directory,
        );

        setPreviewReady(
          true,
        );

        setConnectionMessage(
          "✓ Project downloaded successfully. Now detect the project.",
        );
      } catch (error) {
        console.error(error);

        setConnectionMessage(
          error instanceof Error
            ? error.message
            : "Unable to prepare preview.",
        );
      } finally {
        setPreparingPreview(
          false,
        );
      }
    };

  const handleDetectProject =
    async () => {
      if (!previewDirectory) {
        setConnectionMessage(
          "Prepare the project first.",
        );
        return;
      }

      try {
        setDetectingProject(
          true,
        );

        setDetectedProject(
          null,
        );
        setPreviewUrl("");
        setConnectionMessage("");

        const result =
          await detectPreviewProject(
            previewDirectory,
          );

        setDetectedProject(
          result.project,
        );

        if (
          result.project.status ===
          "ready"
        ) {
          setConnectionMessage(
            "✓ Project detected. It is ready for local preview.",
          );
        } else {
          setConnectionMessage(
            "Project detected, but this framework is not supported by the current preview engine.",
          );
        }
      } catch (error) {
        console.error(error);

        setConnectionMessage(
          error instanceof Error
            ? error.message
            : "Unable to detect project.",
        );
      } finally {
        setDetectingProject(
          false,
        );
      }
    };

  const handleStartPreview =
    async () => {
      if (
        !previewDirectory
      ) {
        setConnectionMessage(
          "Prepare the project first.",
        );
        return;
      }

      if (
        !detectedProject ||
        detectedProject.status !==
          "ready"
      ) {
        setConnectionMessage(
          "Detect a supported project first.",
        );
        return;
      }

      try {
        setStartingPreview(
          true,
        );

        setPreviewUrl("");
        setConnectionMessage("");

        const result =
          await startPreviewProject(
            previewDirectory,
          );

        setPreviewUrl(
          result.preview.url,
        );

        setConnectionMessage(
          "✓ Preview is running.",
        );
      } catch (error) {
        console.error(error);

        setConnectionMessage(
          error instanceof Error
            ? error.message
            : "Unable to start preview.",
        );
      } finally {
        setStartingPreview(
          false,
        );
      }
    };

  const handleAnalyze =
    async () => {
      if (!instruction.trim()) {
        setConnectionMessage(
          "Write an instruction first.",
        );
        return;
      }

      if (
        !selectedRepository
      ) {
        setConnectionMessage(
          "Select a repository first.",
        );
        return;
      }

      const branch =
        workBranch ||
        selectedBranch;

      if (!branch) {
        setConnectionMessage(
          "Select a branch first.",
        );
        return;
      }

      try {
        setAnalyzing(true);
        setConnectionMessage("");
        setAnalysis(null);
        setShowAnalysis(false);

        const [
          owner,
          repoName,
        ] =
          selectedRepository.full_name.split(
            "/",
          );

        const result =
          await analyzeRepositoryChange(
            owner,
            repoName,
            branch,
            instruction,
          );

        setAnalysis(result);
        setShowAnalysis(
          true,
        );

        setConnectionMessage(
          "✓ Analysis completed.",
        );
      } catch (error) {
        console.error(error);

        setConnectionMessage(
          error instanceof Error
            ? error.message
            : "Unable to analyze repository.",
        );
      } finally {
        setAnalyzing(
          false,
        );
      }
    };

  return (
    <div className="dashboard">

      <aside className="sidebar">

        <div className="brand">
          <div className="brand-mark">
            G
          </div>

          <span>
            GITLOVE
          </span>
        </div>

        <nav className="navigation">

          <button
            className={
              activeItem ===
              "dashboard"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              setActiveItem(
                "dashboard",
              )
            }
            title="Dashboard"
          >
            <span>⌂</span>
          </button>

          <button
            className={
              activeItem ===
              "project"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              setActiveItem(
                "project",
              )
            }
            title="Project"
          >
            <span>◈</span>
          </button>

          <button
            className={
              activeItem ===
              "github"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() => {
              setActiveItem(
                "github",
              );
              onGitHub();
            }}
            title="GitHub"
          >
            <span>◉</span>
          </button>

          <button
            className={
              activeItem ===
              "history"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              setActiveItem(
                "history",
              )
            }
            title="History"
          >
            <span>↻</span>
          </button>

        </nav>

        <div className="sidebar-bottom">

          <button
            className={
              activeItem ===
              "settings"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              setActiveItem(
                "settings",
              )
            }
            title="Settings"
          >
            <span>⚙</span>
          </button>

          <div
            className="license-card"
            title={`License: ${licenseCode}`}
          >
            <div className="license-dot" />

            <div>
              <strong>
                PRO ACTIVE
              </strong>

              <span>
                Demo license
              </span>

              <small>
                {licenseCode}
              </small>
            </div>
          </div>

        </div>

      </aside>

      <main className="dashboard-main">

        <header className="topbar">

          <div>
            <p className="page-label">
              GITLOVE WORKSPACE
            </p>

            <h1>
              AI coding workspace
            </h1>
          </div>

          <div className="top-status">

            <span
              className={
                backendStatus ===
                "online"
                  ? "status-online"
                  : backendStatus ===
                      "offline"
                    ? "status-offline"
                    : "status-checking"
              }
            />

            {backendStatus ===
            "online"
              ? "Backend online"
              : backendStatus ===
                  "offline"
                ? "Backend offline"
                : "Checking..."}

          </div>

        </header>

        <section className="project-control">

          <div className="control-header">

            <div className="control-title">

              <div className="github-mini-icon">
                ◉
              </div>

              <div>

                <p className="section-label">
                  GITHUB PROJECT
                </p>

                <strong>
                  {user
                    ? `@${user.login}`
                    : "GitHub not connected"}
                </strong>

              </div>

            </div>

            {githubConnected ? (
              <div className="connected-badge">
                <span />
                Connected
              </div>
            ) : (
              <button
                className="control-action"
                onClick={onGitHub}
              >
                Connect GitHub
              </button>
            )}

          </div>

          {githubConnected && (
            <div className="project-controls">

              <div className="control-field">

                <label>
                  Repository
                </label>

                <select
                  value={
                    selectedRepository?.id ??
                    ""
                  }
                  onChange={
                    handleRepositoryChange
                  }
                  disabled={
                    loadingGitHub
                  }
                >

                  <option value="">
                    Select repository
                  </option>

                  {repositories.map(
                    (repo) => (
                      <option
                        key={
                          repo.id
                        }
                        value={
                          repo.id
                        }
                      >
                        {
                          repo.full_name
                        }
                      </option>
                    ),
                  )}

                </select>

              </div>

              <div className="control-field">

                <label>
                  Branch
                </label>

                <select
                  value={
                    selectedBranch
                  }
                  onChange={
                    handleBranchChange
                  }
                  disabled={
                    !selectedRepository ||
                    loadingBranches
                  }
                >

                  <option value="">
                    {loadingBranches
                      ? "Loading..."
                      : "Select branch"}
                  </option>

                  {branches.map(
                    (branch) => (
                      <option
                        key={
                          branch.name
                        }
                        value={
                          branch.name
                        }
                      >
                        {
                          branch.name
                        }

                        {branch.protected
                          ? " • protected"
                          : ""}

                      </option>
                    ),
                  )}

                </select>

              </div>

              <button
                className="create-branch-button"
                onClick={
                  handleCreateWorkBranch
                }
                disabled={
                  creatingBranch ||
                  !selectedRepository ||
                  !selectedBranch
                }
              >
                {creatingBranch
                  ? "Creating..."
                  : "Create work branch"}
              </button>

            </div>
          )}

          {workBranch && (
            <div className="active-work-branch">

              <span>✓</span>

              <div>

                <small>
                  ACTIVE WORK BRANCH
                </small>

                <strong>
                  {workBranch}
                </strong>

              </div>

            </div>
          )}

          {connectionMessage && (
            <div className="control-message">
              {connectionMessage}
            </div>
          )}

        </section>

        <section className="ai-section">

          <div className="ai-heading">

            <p className="section-label">
              AI CODING AGENT
            </p>

            <h2>
              What do you want to change?
            </h2>

            <p>
              Describe what you want and
              GITLOVE will analyze the
              project before modifying your
              code.
            </p>

          </div>

          <div className="prompt-box">

            <textarea
              value={instruction}
              onChange={(
                event,
              ) =>
                setInstruction(
                  event.target
                    .value,
                )
              }
              placeholder="Example: Add dark mode to the dashboard..."
            />

            <div className="prompt-footer">

              <span>
                {selectedRepository
                  ? `${selectedRepository.full_name} • ${
                      workBranch ||
                      selectedBranch ||
                      "No branch"
                    }`
                  : "Select a GitHub project first."}
              </span>

              <button
                onClick={
                  handleAnalyze
                }
                disabled={
                  analyzing
                }
              >
                {analyzing
                  ? "Analyzing..."
                  : "Analyze change →"}
              </button>

            </div>

          </div>

          {showAnalysis &&
            analysis && (
              <section className="analysis-panel">

                <div className="analysis-header">

                  <div>
                    <p className="section-label">
                      AI ANALYSIS
                    </p>

                    <h2>
                      Review the proposed changes
                    </h2>
                  </div>

                  <button
                    className="analysis-close"
                    onClick={() => {
                      setShowAnalysis(
                        false,
                      );
                      setAnalysis(
                        null,
                      );
                    }}
                  >
                    ×
                  </button>

                </div>

                <div className="analysis-scroll">

                  <div className="analysis-request">

                    <span>
                      REQUEST
                    </span>

                    <p>
                      {
                        analysis.instruction
                      }
                    </p>

                  </div>

                  <div className="analysis-summary">

                    <div>
                      <span>
                        FILES ANALYZED
                      </span>

                      <strong>
                        {
                          analysis.filesAnalyzed
                        }
                      </strong>
                    </div>

                    <div>
                      <span>
                        TO MODIFY
                      </span>

                      <strong>
                        {
                          analysis.filesToModify
                            ?.length ??
                          0
                        }
                      </strong>
                    </div>

                    <div>
                      <span>
                        TO REVIEW
                      </span>

                      <strong>
                        {
                          analysis.filesToReview
                            ?.length ??
                          0
                        }
                      </strong>
                    </div>

                  </div>

                  <div className="analysis-block">

                    <div className="analysis-block-title">
                      Files to modify
                    </div>

                    <div className="analysis-files">

                      {analysis.filesToModify?.length ? (
                        analysis.filesToModify.map(
                          (file) => (
                            <div
                              key={
                                file.path
                              }
                              className="analysis-file primary"
                            >
                              <span>
                                ✓
                              </span>

                              <div>
                                <strong>
                                  {
                                    file.path
                                  }
                                </strong>

                                {file.reasons?.[0] && (
                                  <small>
                                    {
                                      file
                                        .reasons[0]
                                    }
                                  </small>
                                )}

                              </div>

                            </div>
                          ),
                        )
                      ) : (
                        <div className="analysis-empty">
                          No high-confidence files found.
                        </div>
                      )}

                    </div>

                  </div>

                  <div className="analysis-block">

                    <div className="analysis-block-title">
                      Files to review
                    </div>

                    <div className="analysis-files">

                      {analysis.filesToReview?.length ? (
                        analysis.filesToReview.map(
                          (file) => (
                            <div
                              key={
                                file.path
                              }
                              className="analysis-file secondary"
                            >
                              <span>
                                ○
                              </span>

                              <div>
                                <strong>
                                  {
                                    file.path
                                  }
                                </strong>

                                {file.reasons?.[0] && (
                                  <small>
                                    {
                                      file
                                        .reasons[0]
                                    }
                                  </small>
                                )}
                              </div>

                            </div>
                          ),
                        )
                      ) : (
                        <div className="analysis-empty">
                          No secondary files identified.
                        </div>
                      )}

                    </div>

                  </div>

                  <div className="analysis-block">

                    <div className="analysis-block-title">
                      Why these files?
                    </div>

                    <div className="analysis-why">

                      {analysis.why?.map(
                        (
                          reason,
                        ) => (
                          <div
                            key={
                              reason
                            }
                          >
                            <span>
                              •
                            </span>

                            <p>
                              {
                                reason
                              }
                            </p>
                          </div>
                        ),
                      )}

                    </div>

                  </div>

                  <div className="analysis-block">

                    <div className="analysis-block-title">
                      Proposed plan
                    </div>

                    <div className="analysis-plan">

                      {analysis.plan?.map(
                        (
                          item,
                          index,
                        ) => (
                          <div
                            key={`${item}-${index}`}
                            className="analysis-plan-item"
                          >
                            <span>
                              {index + 1}
                            </span>

                            <p>
                              {
                                item
                              }
                            </p>
                          </div>
                        ),
                      )}

                    </div>

                  </div>

                  <div className="analysis-block">

                    <div className="analysis-block-title">
                      Validations
                    </div>

                    <div className="analysis-validations">

                      {analysis.validations?.map(
                        (
                          item,
                        ) => (
                          <span
                            key={
                              item
                            }
                          >
                            ✓{" "}
                            {item}
                          </span>
                        ),
                      )}

                    </div>

                  </div>

                  {analysis.notice && (
                    <div className="analysis-notice">
                      {
                        analysis.notice
                      }
                    </div>
                  )}

                </div>

                <div className="analysis-actions">

                  <button
                    className="reject-button"
                    onClick={() => {
                      setShowAnalysis(
                        false,
                      );
                      setAnalysis(
                        null,
                      );
                    }}
                  >
                    Reject
                  </button>

                  <button
                    className="approve-button"
                    onClick={() =>
                      setConnectionMessage(
                        "✓ Plan approved. Code modification will be the next step.",
                      )
                    }
                  >
                    Approve plan →
                  </button>

                </div>

              </section>
            )}

        </section>

        <section className="preview-section">

          <div className="preview-header">

            <div>
              <p className="section-label">
                LOCAL PREVIEW
              </p>

              <h2>
                Preview your project
              </h2>

              <p>
                Prepare, detect and run your
                selected GitHub branch locally.
              </p>
            </div>

            {!previewReady && (
              <button
                className="preview-button"
                onClick={
                  handlePreparePreview
                }
                disabled={
                  preparingPreview ||
                  !selectedRepository ||
                  !selectedBranch
                }
              >
                {preparingPreview
                  ? "Preparing..."
                  : "Prepare preview →"}
              </button>
            )}

          </div>

          {previewReady && (
            <div className="preview-ready">

              <div className="preview-status-icon">
                ✓
              </div>

              <div>

                <strong>
                  Project downloaded
                </strong>

                <span>
                  {
                    selectedRepository?.full_name
                  }{" "}
                  •{" "}
                  {
                    workBranch ||
                    selectedBranch
                  }
                </span>

                <small>
                  Temporary local copy ready for inspection.
                </small>

              </div>

            </div>
          )}

          {previewReady &&
            !detectedProject && (
              <button
                className="detect-project-button"
                onClick={
                  handleDetectProject
                }
                disabled={
                  detectingProject
                }
              >
                {detectingProject
                  ? "Detecting project..."
                  : "Detect project →"}
              </button>
            )}

          {detectedProject && (
            <div
              className={
                detectedProject.status ===
                "ready"
                  ? "detected-project ready"
                  : "detected-project unsupported"
              }
            >

              <div className="detected-project-header">

                <div>
                  <p className="section-label">
                    PROJECT DETECTED
                  </p>

                  <h3>
                    {
                      detectedProject.framework
                    }
                  </h3>
                </div>

                <span>
                  {detectedProject.status ===
                  "ready"
                    ? "✓ Ready"
                    : "Not supported"}
                </span>

              </div>

              <div className="detected-project-grid">

                <div>
                  <small>
                    FRAMEWORK
                  </small>

                  <strong>
                    {
                      detectedProject.framework
                    }
                  </strong>
                </div>

                <div>
                  <small>
                    PACKAGE MANAGER
                  </small>

                  <strong>
                    {
                      detectedProject.packageManager
                    }
                  </strong>
                </div>

                <div>
                  <small>
                    DEV COMMAND
                  </small>

                  <strong>
                    {
                      detectedProject.devCommand ||
                      "Not detected"
                    }
                  </strong>
                </div>

              </div>

              {detectedProject.status ===
                "ready" &&
                !previewUrl && (
                  <button
                    className="start-preview-button"
                    onClick={
                      handleStartPreview
                    }
                    disabled={
                      startingPreview
                    }
                  >
                    {startingPreview
                      ? "Starting preview..."
                      : "Start Preview →"}
                  </button>
                )}

              {previewUrl && (
                <div className="preview-running">

                  <div className="preview-running-dot" />

                  <div>
                    <strong>
                      Preview running
                    </strong>

                    <span>
                      {
                        previewUrl
                      }
                    </span>
                  </div>

                  <button
                    className="open-preview-button"
                    onClick={() =>
                      window.open(
                        previewUrl,
                        "_blank",
                        "noopener,noreferrer",
                      )
                    }
                  >
                    Open Preview ↗
                  </button>

                </div>
              )}

            </div>
          )}

        </section>

        <section className="quick-actions">

          <button className="quick-card">
            <span className="quick-icon">
              ✦
            </span>

            <div>
              <strong>
                Fix an error
              </strong>

              <p>
                Find and repair a
                problem.
              </p>
            </div>
          </button>

          <button className="quick-card">
            <span className="quick-icon">
              ◌
            </span>

            <div>
              <strong>
                Make responsive
              </strong>

              <p>
                Improve mobile
                behavior.
              </p>
            </div>
          </button>

          <button className="quick-card">
            <span className="quick-icon">
              +
            </span>

            <div>
              <strong>
                Add a feature
              </strong>

              <p>
                Describe a new
                functionality.
              </p>
            </div>
          </button>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;