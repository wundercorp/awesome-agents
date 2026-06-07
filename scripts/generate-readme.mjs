import fs from 'node:fs';
import path from 'node:path';

const catalogRootDirectory = process.cwd();
const catalogEntriesDirectory = path.join(catalogRootDirectory, 'agents');
const categoryDisplayNames = {
  "accessibility": "Accessibility",
  "architecture": "Architecture",
  "deployment": "Deployment",
  "design": "Design",
  "development": "Development",
  "documentation": "Documentation",
  "localization": "Localization",
  "maintenance": "Maintenance",
  "media": "Media",
  "orchestration": "Orchestration",
  "security": "Security",
  "browser-automation": "Browser Automation",
  "code-hosting": "Code Hosting",
  "communication": "Communication",
  "data": "Data",
  "developer-tools": "Developer Tools",
  "files": "Files",
  "knowledge": "Knowledge",
  "observability": "Observability"
};

function listEntryFiles(directoryPath) {
  const collectedFilePaths = [];
  if (!fs.existsSync(directoryPath)) {
    return collectedFilePaths;
  }
  const directoryEntries = fs.readdirSync(directoryPath, { withFileTypes: true });
  for (const directoryEntry of directoryEntries) {
    const fullPath = path.join(directoryPath, directoryEntry.name);
    if (directoryEntry.isDirectory()) {
      const nestedFilePaths = listEntryFiles(fullPath);
      for (const nestedFilePath of nestedFilePaths) {
        collectedFilePaths.push(nestedFilePath);
      }
    } else if (directoryEntry.isFile() && directoryEntry.name === 'agent.json') {
      collectedFilePaths.push(fullPath);
    }
  }
  return collectedFilePaths.sort();
}

function readEntry(entryFilePath) {
  const rawFileContents = fs.readFileSync(entryFilePath, 'utf8');
  return JSON.parse(rawFileContents);
}

function escapeMarkdown(value) {
  const textValue = String(value || '');
  return textValue.replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

const entriesByCategory = new Map();
for (const entryFilePath of listEntryFiles(catalogEntriesDirectory)) {
  const entry = readEntry(entryFilePath);
  if (!entriesByCategory.has(entry.category)) {
    entriesByCategory.set(entry.category, []);
  }
  entriesByCategory.get(entry.category).push(entry);
}

for (const categoryEntries of entriesByCategory.values()) {
  categoryEntries.sort((leftEntry, rightEntry) => String(leftEntry.name || leftEntry.displayName).localeCompare(String(rightEntry.name || rightEntry.displayName)));
}

const orderedCategoryNames = Array.from(entriesByCategory.keys()).sort((leftCategory, rightCategory) => {
  const leftDisplayName = categoryDisplayNames[leftCategory] || leftCategory;
  const rightDisplayName = categoryDisplayNames[rightCategory] || rightCategory;
  return leftDisplayName.localeCompare(rightDisplayName);
});

const readmeLines = [];
readmeLines.push('# Awesome Agents');
readmeLines.push('');
readmeLines.push('A curated, PR-friendly directory maintained by WunderCorp. Entries live as JSON files under `agents/<category>/<slug>/agent.json`. The README is generated from those files.');
readmeLines.push('');
readmeLines.push('## Contributing');
readmeLines.push('');
readmeLines.push('Add one entry per pull request, run the validator, regenerate this README, and keep the entry in the correct category folder.');
readmeLines.push('');
readmeLines.push('```bash');
readmeLines.push('node scripts/validate-catalog.mjs');
readmeLines.push('node scripts/generate-readme.mjs');
readmeLines.push('```');
readmeLines.push('');
readmeLines.push('## Directory');
readmeLines.push('');

if (orderedCategoryNames.length === 0) {
  readmeLines.push('No agents have been submitted yet.');
  readmeLines.push('');
}

for (const categoryName of orderedCategoryNames) {
  const categoryEntries = entriesByCategory.get(categoryName);
  readmeLines.push(`### ${categoryDisplayNames[categoryName] || categoryName}`);
  readmeLines.push('');
  if ('agents' === 'agents') {
    readmeLines.push('| Agent | Description | Protocols | Links |');
    readmeLines.push('|---|---|---|---|');
    for (const entry of categoryEntries) {
      const protocols = Array.isArray(entry.protocols) ? entry.protocols.join(', ') : '';
      const links = [`[Homepage](${entry.homepage_url})`, `[AgentCard](${entry.agent_card_url})`];
      if (entry.a2a_endpoint_url) {
        links.push(`[A2A](${entry.a2a_endpoint_url})`);
      }
      if (entry.docker_image) {
        links.push(`\`${entry.docker_image}\``);
      }
      readmeLines.push(`| ${escapeMarkdown(entry.name)} | ${escapeMarkdown(entry.description)} | ${escapeMarkdown(protocols)} | ${links.join('<br>')} |`);
    }
  } else if ('agents' === 'skills') {
    readmeLines.push('| Skill | Description | Install | Links |');
    readmeLines.push('|---|---|---|---|');
    for (const entry of categoryEntries) {
      const installCommand = entry.install && entry.install.npx ? `\`${entry.install.npx}\`` : '';
      const links = [`[GitHub](${entry.githubUrl})`];
      if (entry.skillsShUrl) {
        links.push(`[skills.sh](${entry.skillsShUrl})`);
      }
      readmeLines.push(`| ${escapeMarkdown(entry.displayName)} | ${escapeMarkdown(entry.description)} | ${installCommand} | ${links.join('<br>')} |`);
    }
  } else {
    readmeLines.push('| Server | Description | Transport | Links |');
    readmeLines.push('|---|---|---|---|');
    for (const entry of categoryEntries) {
      const transportList = Array.isArray(entry.transports) ? entry.transports.join(', ') : '';
      const links = [];
      if (entry.homepage_url) {
        links.push(`[Homepage](${entry.homepage_url})`);
      }
      if (entry.repository_url) {
        links.push(`[GitHub](${entry.repository_url})`);
      }
      if (entry.package_url) {
        links.push(`[Package](${entry.package_url})`);
      }
      readmeLines.push(`| ${escapeMarkdown(entry.name)} | ${escapeMarkdown(entry.description)} | ${escapeMarkdown(transportList)} | ${links.join('<br>')} |`);
    }
  }
  readmeLines.push('');
}

readmeLines.push('## Repository format');
readmeLines.push('');
readmeLines.push('- `CONTRIBUTING.md` explains the review policy.');
readmeLines.push('- `.github/pull_request_template.md` keeps submissions consistent.');
readmeLines.push('- `.github/workflows/validate.yml` validates JSON and README generation.');
readmeLines.push('- `schema/` documents the expected metadata shape.');
readmeLines.push('');
readmeLines.push('## License');
readmeLines.push('');
readmeLines.push('Directory metadata is MIT licensed unless an entry says otherwise. Each listed project keeps its own license.');
readmeLines.push('');

fs.writeFileSync(path.join(catalogRootDirectory, 'README.md'), readmeLines.join('\n'), 'utf8');
console.log(`Generated README.md with ${orderedCategoryNames.length} populated categories.`);
