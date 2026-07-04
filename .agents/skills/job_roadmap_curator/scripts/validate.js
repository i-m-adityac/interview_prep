const fs = require('fs');
const path = require('path');

// Helper to evaluate javascript files and extract constants
function loadJS(filePath) {
  const code = fs.readFileSync(filePath, 'utf8');
  // Strip const/let/var declarations to evaluate in a global context
  const cleanCode = code
    .replace(/(const|let|var)\s+DATA_DSA\s*=/g, 'global.DATA_DSA =')
    .replace(/(const|let|var)\s+DATA_SYSTEM\s*=/g, 'global.DATA_SYSTEM =')
    .replace(/(const|let|var)\s+DATA_LLD\s*=/g, 'global.DATA_LLD =')
    .replace(/(const|let|var)\s+DATA_CUSTOM\s*=/g, 'global.DATA_CUSTOM =')
    .replace(/(const|let|var)\s+DATA_PROBLEMS\s*=/g, 'global.DATA_PROBLEMS =')
    .replace(/(const|let|var)\s+DATA_MISC\s*=/g, 'global.DATA_MISC =')
    .replace(/(const|let|var)\s+DATA\s*=/g, 'global.DATA =');
  eval(cleanCode);
}

try {
  const webappDir = path.join(__dirname, '..', '..', '..', '..', 'webapp');
  console.log('Loading webapp data from:', webappDir);

  loadJS(path.join(webappDir, 'data_misc.js'));
  loadJS(path.join(webappDir, 'data_dsa.js'));
  loadJS(path.join(webappDir, 'data_system.js'));
  loadJS(path.join(webappDir, 'data_lld.js'));
  loadJS(path.join(webappDir, 'data_problems.js'));
  loadJS(path.join(webappDir, 'data_custom.js'));
  loadJS(path.join(webappDir, 'data.js'));

  console.log('All files loaded successfully.');

  // Validate references in DATA_CUSTOM
  let errors = 0;
  
  const dsaIds = new Set(global.DATA_DSA.patterns.map(p => p.id));
  const sysIds = new Set([
    ...global.DATA_SYSTEM.sdFundamentals.map(f => f.id),
    ...global.DATA_SYSTEM.sdCases.map(c => c.id)
  ]);
  const lldIds = new Set([
    ...global.DATA_LLD.lldFundamentals.map(f => f.id),
    ...global.DATA_LLD.lldCases.map(c => c.id)
  ]);
  const problemIds = new Set(Object.keys(global.DATA_PROBLEMS));

  console.log(`Loaded counts:
  - DSA Patterns: ${dsaIds.size}
  - System Design Topics: ${sysIds.size}
  - LLD Topics: ${lldIds.size}
  - Global Problems: ${problemIds.size}`);

  Object.entries(global.DATA_CUSTOM.paths).forEach(([pathId, pathInfo]) => {
    console.log(`Validating path: ${pathInfo.jobTitle}`);
    pathInfo.weeks.forEach((w, weekIdx) => {
      w.items.forEach((it, itemIdx) => {
        const ref = it.refId;
        const type = it.type;
        if (type === 'dsa') {
          if (!dsaIds.has(ref)) {
            console.error(`Error: Week ${weekIdx + 1} item "${it.text}" has invalid DSA refId: "${ref}"`);
            errors++;
          }
        } else if (type === 'system') {
          if (!sysIds.has(ref)) {
            console.error(`Error: Week ${weekIdx + 1} item "${it.text}" has invalid System Design refId: "${ref}"`);
            errors++;
          }
        } else if (type === 'lld') {
          if (!lldIds.has(ref)) {
            console.error(`Error: Week ${weekIdx + 1} item "${it.text}" has invalid LLD refId: "${ref}"`);
            errors++;
          }
        } else if (type === 'problem') {
          if (!problemIds.has(ref)) {
            console.error(`Error: Week ${weekIdx + 1} item "${it.text}" has invalid problem refId: "${ref}"`);
            errors++;
          }
        }
      });
    });
  });

  if (errors === 0) {
    console.log('SUCCESS: All custom path references are valid!');
    process.exit(0);
  } else {
    console.error(`FAILED: Found ${errors} invalid references.`);
    process.exit(1);
  }
} catch (err) {
  console.error('Error running validation:', err);
  process.exit(1);
}
