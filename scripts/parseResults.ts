import fs from 'fs';

const reportPath = 'test-results/results.json';
const summaryPath = 'test-results/release-summary.json';

if (!fs.existsSync(reportPath)) {
  console.error(`Report not found: ${reportPath}`);
  process.exit(1);
}

const report = JSON.parse(
  fs.readFileSync(reportPath, 'utf-8')
);

let total = 0;
let passed = 0;
let failed = 0;
let skipped = 0;

const failures: any[] = [];

function processSuite(suite: any) {

  // Process specs inside this suite
  for (const spec of suite.specs ?? []) {

    for (const test of spec.tests ?? []) {

      total++;

      const results = test.results ?? [];

      const lastResult =
        results.length > 0
          ? results[results.length - 1]
          : undefined;

      const status = lastResult?.status ?? 'unknown';

      if (status === 'passed') {

        passed++;

      } else if (status === 'skipped') {

        skipped++;

      } else {

        failed++;

        failures.push({
          title: spec.title,
          file: spec.file,
          project: test.projectName,
          status,
          duration: lastResult?.duration ?? 0,
          error:
            lastResult?.error?.message ??
            lastResult?.errors?.[0]?.message ??
            'No error message available'
        });
      }
    }
  }

  // Important: Playwright suites can contain more suites
  for (const childSuite of suite.suites ?? []) {
    processSuite(childSuite);
  }
}

for (const suite of report.suites ?? []) {
  processSuite(suite);
}
const buildNumber = process.env.BUILD_NUMBER ?? 'local-001';
const branch = process.env.BRANCH_NAME ?? 'local';
const commitSha = process.env.COMMIT_SHA ?? 'local';
const releaseVersion = process.env.RELEASE_VERSION ?? 'v1.0.0';

let riskScore = 0;
let riskLevel = 'LOW';

if (failed === 1) {
  riskScore = 30;
  riskLevel = 'MEDIUM';
} else if (failed >= 2 && failed <= 3) {
  riskScore = 60;
  riskLevel = 'HIGH';
} else if (failed >= 4) {
  riskScore = 90;
  riskLevel = 'CRITICAL';
}

let recommendation = 'READY';

if (riskLevel === 'MEDIUM') {
  recommendation = 'REVIEW REQUIRED';
} else if (
  riskLevel === 'HIGH' ||
  riskLevel === 'CRITICAL'
) {
  recommendation = 'BLOCK RELEASE';
}

const summary = {
  generatedAt: new Date().toISOString(),

  build: {
    buildNumber,
    branch,
    commitSha,
    releaseVersion,
  },

  totalTests: total,
  passed,
  failed,
  skipped,

  passRate:
    total === 0
      ? 0
      : Number(
          ((passed / total) * 100).toFixed(2)
        ),

  risk: {
    score: riskScore,
    level: riskLevel,
  },

  recommendation,

  failures
};

fs.writeFileSync(
  summaryPath,
  JSON.stringify(summary, null, 2)
);

console.log('\nRelease Test Summary\n');

console.log(
  JSON.stringify(summary, null, 2)
);