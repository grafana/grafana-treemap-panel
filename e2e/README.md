# Treemap end-to-end (E2E) tests

Currently, this test suite consists of visual regression tests only.


### Prerequisites

> [!IMPORTANT]
> Prerequisites
>
> - [Yarn](https://yarnpkg.com)
> - [Docker](https://www.docker.com)


## Running the E2E test suite

> [!NOTE]
> To reduce complexity and keep rendering consistent, all E2E tests run in Docker on Linux.

### In CI workflows (default)

**Command:**

```bash
yarn run e2e
```

**Primarily this runs in a GitHub Actions (GHA) workflow on each push to a branch with a pull request.**

When there are failures in CI:

1. Open the GHA workflow, and navigate to the `Upload Artifacts` step in the CI workflow's test job 
2. Click the `Artifact download URL` in the job output to download the test report
3. Extract the test report from `.zip`
4. Open the extracted `index.html` file in a web browser to view the test report


**Additionally, you can run run this locally.**

When there are failures locally:

1. Open [http://localhost:9323](http://localhost:9323) in a web browser to view the test report


### To update screenshots

**Command:**

Screenshots will need to be updated after adding new test cases, or changing the panel in a way that will change its appearance.

```bash
yarn run e2e:update-screenshots
```

> [!WARNING]
> Screenshots guard against visual regression of the Treemap visualizations.
> Please verify screenshot pixel diffs manually _before_ updating.

Commit the changed screenshots using `git`.