import * as path from "path";
import { promises as fs } from "fs";
import { exec } from "child_process";
import { IDependencyMap, IPackageJson } from "package-json-type";
import util from "util";

// https://stackoverflow.com/a/70742322/3015595
// promisify exec
const execPromise = util.promisify(exec);

export async function readPackageJson(path: string): Promise<IPackageJson> {
  try {
    const data = await fs.readFile(path, "utf-8");
    const dataAsObj = JSON.parse(data);

    return dataAsObj;
  } catch (error) {
    console.error("something went wrong reading the package json");
  }
  return {};
}

interface DependencyDetails {
  /** Whether or not all the required dependencies are present */
  hasDependencies: boolean;
  /** An array of strings of missing dependencies (names) */
  missingDependencies: string[];
}

export const TS_JEST_REQUIRED_DEPENDENCIES = [
  "typescript",
  "jest",
  "ts-jest",
  "@types/jest",
];

export function checkForDependencies(
  dependencies: IDependencyMap | undefined
): DependencyDetails {
  const dependencyDetails: DependencyDetails = {
    missingDependencies: TS_JEST_REQUIRED_DEPENDENCIES,
    hasDependencies: false,
  };

  if (dependencies && Object.keys(dependencies).length > 0) {
    const updatedMissingDependencies: string[] = [];
    const dependencyKeys = Object.keys(dependencies);
    // Source:
    // https://stackoverflow.com/a/53606357/3015595

    const hasDependencies = TS_JEST_REQUIRED_DEPENDENCIES.every((d) => {
      const hasDependency = dependencyKeys.includes(d);

      // If it doesn't have the dependency
      // then we want to add it to our missingDependencies
      if (!hasDependency) {
        updatedMissingDependencies.push(d);
      }
      return hasDependency;
    });

    dependencyDetails.missingDependencies = updatedMissingDependencies;
    dependencyDetails.hasDependencies = hasDependencies;
  }

  return dependencyDetails;
}

// Source: https://futurestud.io/tutorials/node-js-check-if-a-file-exists
export async function fileExists(path: string) {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
}

export async function installDependencies(
  currentDir: string,
  missingDependencies: string[]
): Promise<void> {
  const packageLockPath = path.join(currentDir, "package-lock.json");
  const hasPackageLock = await fileExists(packageLockPath);
  const depsAsString = missingDependencies.join(" ");

  // Check if they're using npm
  if (hasPackageLock) {
    await execPromise(`npm install --save-dev ${depsAsString}`, {
      cwd: currentDir,
    });
  } else {
    await execPromise(`yarn add --dev ${depsAsString}`, {
      cwd: currentDir,
    });
  }
}

export async function main(currentDir = process.cwd()): Promise<void> {
  console.log("🔨 Running `npx add-ts-jest`");
  const pathToPackageJson = path.join(currentDir, "package.json");
  const packageJson = await readPackageJson(pathToPackageJson);

  const { hasDependencies, missingDependencies } = checkForDependencies(
    packageJson.devDependencies
  );

  if (!hasDependencies) {
    console.log("🚧 Installing missing dependencies...");
    await installDependencies(currentDir, missingDependencies);
  }

  console.log("🚧 creating jest.config.js ...");
  await createJestConfig(currentDir);
  console.log("🚧 Adding test script to package.json... ");
  await addTestScript(pathToPackageJson);
  console.log("✅ Done!");
}

export async function createJestConfig(currentDir: string) {
  await execPromise(`npx ts-jest config:init`, {
    cwd: currentDir,
  });
}

export async function addTestScript(pathToPackageJson: string) {
  const packageJson = await readPackageJson(pathToPackageJson);
  const scripts = packageJson.scripts;

  if (typeof scripts !== "undefined" && Object.keys(scripts).length > 0) {
    scripts.test = "jest";

    try {
      await fs.writeFile(
        pathToPackageJson,
        JSON.stringify(packageJson, null, 4)
      );
      return;
    } catch (error) {
      console.error("something went wrong writing the package.json");
    }
  }

  console.warn(
    `Couldn't add "test": "jest" to your package.json. Please add yourself.`
  );
}
