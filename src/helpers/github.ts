type GHAsset = {
  browser_download_url: string;
};

export interface GhRelease {
  tag_name: string;
  assets: GHAsset[];
}

export function fetchData(url: string) {
  const uri = new URL(url);

  return fetch(uri, {
    headers: {
      Accept: "application/vnd.github.v3+json",
    },
  });
}
