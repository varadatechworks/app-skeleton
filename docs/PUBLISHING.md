# Publishing this starter kit to GitHub

**Target:** https://github.com/varadatechworks/app-skeleton (empty at review time).

At the time of the build, the GitHub connector's Varada installation (`179017356`) had selected access to `ssv-decors` and `play-nexa`, **not** `app-skeleton`. Reading the public repository reported administrative permissions, but writes failed with `403 Resource not accessible by integration`. Consequently, no remote commit/branch/PR was created; this ZIP is the complete local deliverable.

To enable direct GitHub operations later: open [GitHub App installation settings](https://github.com/settings/installations/179017356), choose **Configure**, then allow the `app-skeleton` repository under **Repository access**. The installation owner must authorize the change. Do not paste access tokens here.

Manual one-time publish from Windows PowerShell (after extracting the ZIP; use your existing Git credentials):

```powershell
cd C:\Projects
# This is an empty repository; cloning creates a destination directory.
git clone https://github.com/varadatechworks/app-skeleton.git
# Copy the CONTENTS of the extracted app-skeleton folder into this cloned directory.
cd app-skeleton
npm test
git add .
git commit -m "feat: add reusable modular app starter kit"
git push -u origin main
```

If you prefer PR review, create a `feat/modular-starter-kit` branch in that clone before the commit, push it and open a PR. The code here has not changed any other repository or deployed infrastructure. GitHub Actions are intentionally absent to conserve CI minutes; establish targeted manual/PR checks when the source has been reviewed.
