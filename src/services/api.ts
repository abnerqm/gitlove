const API_URL = "http://localhost:3000";

export async function checkBackend() {
  const response = await fetch(`${API_URL}/api/health`);

  if (!response.ok) {
    throw new Error("GITLOVE Backend is not responding");
  }

  return response.json();
}

export async function getGitHubAuthorizationUrl() {
  const response = await fetch(`${API_URL}/api/github/connect`);

  if (!response.ok) {
    throw new Error("Unable to start GitHub authorization");
  }

  const data = await response.json();

  if (!data.success || !data.authorizationUrl) {
    throw new Error("GitHub authorization URL was not returned");
  }

  return data.authorizationUrl as string;
}

export async function getGitHubUser() {
  const response = await fetch(`${API_URL}/api/github/me`);

  if (!response.ok) {
    throw new Error("Unable to get GitHub user");
  }

  return response.json();
}

export async function getGitHubRepositories() {
  const response = await fetch(`${API_URL}/api/github/repos`);

  if (!response.ok) {
    throw new Error("Unable to get GitHub repositories");
  }

  return response.json();
}