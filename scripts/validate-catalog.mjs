import fs from 'node:fs';
import path from 'node:path';

const catalogRootDirectory = process.cwd();
const catalogEntriesDirectory = path.join(catalogRootDirectory, 'agents');
const requiredFieldNames = ["slug", "name", "category", "description", "homepage_url", "agent_card_url", "license", "status"];
const seenSlugs = new Set();
const validationErrors = [];

function listJsonEntryFiles(directoryPath) {
  const collectedFilePaths = [];
  if (!fs.existsSync(directoryPath)) {
    return collectedFilePaths;
  }
  const directoryEntries = fs.readdirSync(directoryPath, { withFileTypes: true });
  for (const directoryEntry of directoryEntries) {
    const fullPath = path.join(directoryPath, directoryEntry.name);
    if (directoryEntry.isDirectory()) {
      const nestedFilePaths = listJsonEntryFiles(fullPath);
      for (const nestedFilePath of nestedFilePaths) {
        collectedFilePaths.push(nestedFilePath);
      }
    } else if (directoryEntry.isFile() && directoryEntry.name === 'agent.json') {
      collectedFilePaths.push(fullPath);
    }
  }
  return collectedFilePaths.sort();
}

function readJsonFile(jsonFilePath) {
  const rawFileContents = fs.readFileSync(jsonFilePath, 'utf8');
  try {
    return JSON.parse(rawFileContents);
  } catch (parseError) {
    validationErrors.push(`${jsonFilePath} is not valid JSON: ${parseError.message}`);
    return null;
  }
}

function validateUrlValue(jsonFilePath, fieldName, fieldValue) {
  if (typeof fieldValue !== 'string') {
    return;
  }
  if (fieldValue.length === 0) {
    return;
  }
  if (!fieldValue.startsWith('https://')) {
    validationErrors.push(`${jsonFilePath} field ${fieldName} must use https://`);
  }
}

const entryFilePaths = listJsonEntryFiles(catalogEntriesDirectory);
for (const entryFilePath of entryFilePaths) {
  const entryData = readJsonFile(entryFilePath);
  if (!entryData) {
    continue;
  }
  const relativeEntryPath = path.relative(catalogEntriesDirectory, entryFilePath);
  const pathParts = relativeEntryPath.split(path.sep);
  const folderCategory = pathParts[0];
  const folderSlug = pathParts[1];
  for (const requiredFieldName of requiredFieldNames) {
    const requiredFieldValue = entryData[requiredFieldName];
    if (typeof requiredFieldValue !== 'string' || requiredFieldValue.trim().length === 0) {
      validationErrors.push(`${entryFilePath} missing required string field: ${requiredFieldName}`);
    }
  }
  if (entryData.category !== folderCategory) {
    validationErrors.push(`${entryFilePath} category must match folder name ${folderCategory}`);
  }
  if (entryData.slug !== folderSlug) {
    validationErrors.push(`${entryFilePath} slug must match folder name ${folderSlug}`);
  }
  if (seenSlugs.has(entryData.slug)) {
    validationErrors.push(`${entryFilePath} duplicates slug ${entryData.slug}`);
  }
  seenSlugs.add(entryData.slug);
  for (const [fieldName, fieldValue] of Object.entries(entryData)) {
    if (fieldName.endsWith('_url') || fieldName === 'githubUrl' || fieldName === 'skillsShUrl' || fieldName === 'homepage_url' || fieldName === 'agent_card_url' || fieldName === 'agent_json_url' || fieldName === 'a2a_endpoint_url') {
      validateUrlValue(entryFilePath, fieldName, fieldValue);
    }
  }
}

if (entryFilePaths.length === 0) {
  console.log('No agent entries found yet. Empty catalog is valid.');
}

if (validationErrors.length > 0) {
  console.error(validationErrors.join('\n'));
  process.exit(1);
}

console.log(`Validated ${entryFilePaths.length} agent entries.`);
