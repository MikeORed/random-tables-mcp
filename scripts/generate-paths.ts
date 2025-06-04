import * as fs from "fs";
import * as path from "path";

// Base directory for source code
const SRC_DIR = path.resolve(__dirname, "../src");
// Output file paths
const TSCONFIG_PATH = path.resolve(__dirname, "../tsconfig.json");
const JEST_CONFIG_PATH = path.resolve(__dirname, "../jest.config.js");

// Function to scan directories and generate path mappings
function generatePathMappings() {
  const paths: Record<string, string[]> = {};
  const moduleNameMapper: Record<string, string> = {};

  // Add base paths
  paths["@/*"] = ["src/*"];
  moduleNameMapper["^@/(.*)$"] = "<rootDir>/src/$1";

  // Scan top-level directories in src
  const topDirs = fs
    .readdirSync(SRC_DIR, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  // Add top-level directories
  topDirs.forEach((dir) => {
    const alias = `@${dir}/*`;
    paths[alias] = [`src/${dir}/*`];
    moduleNameMapper[
      `^${alias.replace("*", "(.*)$")}`
    ] = `<rootDir>/src/${dir}/$1`;

    // Check for subdirectories
    const subDirPath = path.join(SRC_DIR, dir);
    try {
      const subDirs = fs
        .readdirSync(subDirPath, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);

      // Add subdirectories
      subDirs.forEach((subDir) => {
        const subAlias = `@${dir}-${subDir}/*`;
        paths[subAlias] = [`src/${dir}/${subDir}/*`];
        moduleNameMapper[
          `^${subAlias.replace("*", "(.*)$")}`
        ] = `<rootDir>/src/${dir}/${subDir}/$1`;

        // For deeper nesting if needed
        const deepDirPath = path.join(subDirPath, subDir);
        try {
          const deepDirs = fs
            .readdirSync(deepDirPath, { withFileTypes: true })
            .filter((dirent) => dirent.isDirectory())
            .map((dirent) => dirent.name);

          deepDirs.forEach((deepDir) => {
            const deepAlias = `@${dir}-${subDir}-${deepDir}/*`;
            paths[deepAlias] = [`src/${dir}/${subDir}/${deepDir}/*`];
            moduleNameMapper[
              `^${deepAlias.replace("*", "(.*)$")}`
            ] = `<rootDir>/src/${dir}/${subDir}/${deepDir}/$1`;
          });
        } catch (e) {
          // Ignore errors for non-existent directories
        }
      });
    } catch (e) {
      // Ignore errors for non-existent directories
    }
  });

  // Add test directory
  paths["@test/*"] = ["test/*"];
  moduleNameMapper["^@test/(.*)$"] = "<rootDir>/test/$1";

  return { paths, moduleNameMapper };
}

// Update tsconfig.json
function updateTsConfig(paths: Record<string, string[]>) {
  const tsConfig = JSON.parse(fs.readFileSync(TSCONFIG_PATH, "utf8"));

  // Ensure compilerOptions exists
  if (!tsConfig.compilerOptions) {
    tsConfig.compilerOptions = {};
  }

  // Add baseUrl and paths
  tsConfig.compilerOptions.baseUrl = ".";
  tsConfig.compilerOptions.paths = paths;

  // Write updated config
  fs.writeFileSync(TSCONFIG_PATH, JSON.stringify(tsConfig, null, 2));
  console.log("Updated tsconfig.json with path mappings");
}

// Update jest.config.js
function updateJestConfig(moduleNameMapper: Record<string, string>) {
  // Read existing config
  let jestConfigContent = fs.readFileSync(JEST_CONFIG_PATH, "utf8");

  // Check if moduleNameMapper already exists
  if (jestConfigContent.includes("moduleNameMapper")) {
    // Replace existing moduleNameMapper - use a more robust regex pattern
    jestConfigContent = jestConfigContent.replace(
      /moduleNameMapper\s*:\s*{[\s\S]*?}(?=,|\s*})/,
      `moduleNameMapper: ${JSON.stringify(moduleNameMapper, null, 2)}`
    );
  } else {
    // Add moduleNameMapper before the closing brace
    jestConfigContent = jestConfigContent.replace(
      /};$/,
      `  moduleNameMapper: ${JSON.stringify(moduleNameMapper, null, 2)}\n};`
    );
  }

  // Write updated config
  fs.writeFileSync(JEST_CONFIG_PATH, jestConfigContent);
  console.log("Updated jest.config.js with moduleNameMapper");
}

// Main function
function main() {
  const { paths, moduleNameMapper } = generatePathMappings();
  updateTsConfig(paths);
  updateJestConfig(moduleNameMapper);
  console.log("Path generation complete!");
}

main();
