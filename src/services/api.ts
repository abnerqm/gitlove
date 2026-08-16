const API_URL =
  "http://localhost:3000";

export async function checkBackend() {
  const response =
    await fetch(
      `${API_URL}/api/health`,
    );

  if (!response.ok) {
    throw new Error(
      "GITLOVE Backend is not responding",
    );
  }

  return response.json();
}

export async function getGitHubAuthorizationUrl() {
  const response =
    await fetch(
      `${API_URL}/api/github/connect`,
    );

  if (!response.ok) {
    throw new Error(
      "Unable to start GitHub authorization",
    );
  }

  const data =
    await response.json();

  if (
    !data.success ||
    !data.authorizationUrl
  ) {
    throw new Error(
      "GitHub authorization URL was not returned",
    );
  }

  return data.authorizationUrl as string;
}

export async function getGitHubUser() {
  const response =
    await fetch(
      `${API_URL}/api/github/me`,
    );

  if (!response.ok) {
    throw new Error(
      "Unable to get GitHub user",
    );
  }

  return response.json();
}

export async function getGitHubRepositories() {
  const response =
    await fetch(
      `${API_URL}/api/github/repos`,
    );

  if (!response.ok) {
    throw new Error(
      "Unable to get GitHub repositories",
    );
  }

  return response.json();
}

export async function getGitHubBranches(
  owner: string,
  repository: string,
) {
  const response =
    await fetch(
      `${API_URL}/api/github/repos/${encodeURIComponent(
        owner,
      )}/${encodeURIComponent(
        repository,
      )}/branches`,
    );

  if (!response.ok) {
    throw new Error(
      "Unable to get GitHub branches",
    );
  }

  return response.json();
}

export async function createGitHubBranch(
  owner: string,
  repository: string,
  baseBranch: string,
  newBranch: string,
) {
  const response =
    await fetch(
      `${API_URL}/api/github/repos/${encodeURIComponent(
        owner,
      )}/${encodeURIComponent(
        repository,
      )}/branches`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          baseBranch,
          newBranch,
        }),
      },
    );

  const data =
    await response.json();

  if (
    !response.ok ||
    !data.success
  ) {
    throw new Error(
      data.message ||
        "Unable to create GitHub branch",
    );
  }

  return data;
}

export async function analyzeRepositoryChange(
  owner: string,
  repository: string,
  branch: string,
  instruction: string,
) {
  const response =
    await fetch(
      `${API_URL}/api/analysis/repos/${encodeURIComponent(
        owner,
      )}/${encodeURIComponent(
        repository,
      )}/analyze`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          branch,
          instruction,
        }),
      },
    );

  const responseText =
    await response.text();

  let data: any;

  try {
    data =
      JSON.parse(
        responseText,
      );
  } catch {
    throw new Error(
      `Backend returned non-JSON response (${response.status}).`,
    );
  }

  if (
    !response.ok ||
    !data.success
  ) {
    throw new Error(
      data.message ||
        "Unable to analyze repository",
    );
  }

  return data;
}

export async function downloadPreviewProject(
  owner: string,
  repository: string,
  branch: string,
) {
  const response =
    await fetch(
      `${API_URL}/api/preview/download`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          owner,
          repository,
          branch,
        }),
      },
    );

  const responseText =
    await response.text();

  let data: any;

  try {
    data =
      JSON.parse(
        responseText,
      );
  } catch {
    throw new Error(
      `Preview backend returned non-JSON response (${response.status}).`,
    );
  }

  if (
    !response.ok ||
    !data.success
  ) {
    throw new Error(
      data.message ||
        "Unable to prepare preview",
    );
  }

  return data;
}

export async function detectPreviewProject(
  directory: string,
) {
  const response =
    await fetch(
      `${API_URL}/api/preview/detect`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          directory,
        }),
      },
    );

  const responseText =
    await response.text();

  let data: any;

  try {
    data =
      JSON.parse(
        responseText,
      );
  } catch {
    throw new Error(
      `Preview detection returned non-JSON response (${response.status}).`,
    );
  }

  if (
    !response.ok ||
    !data.success
  ) {
    throw new Error(
      data.message ||
        "Unable to detect project",
    );
  }

  return data;
}

export async function startPreviewProject(
  directory: string,
) {
  const response =
    await fetch(
      `${API_URL}/api/preview/start`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          directory,
        }),
      },
    );

  const responseText =
    await response.text();

  let data: any;

  try {
    data =
      JSON.parse(
        responseText,
      );
  } catch {
    throw new Error(
      `Preview start returned non-JSON response (${response.status}).`,
    );
  }

  if (
    !response.ok ||
    !data.success
  ) {
    throw new Error(
      data.message ||
        "Unable to start preview",
    );
  }

  return data;
}