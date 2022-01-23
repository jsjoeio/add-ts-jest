import { promises as fs } from "fs";
import { IDependencyMap, IPackageJson } from "package-json-type";

export async function readPackageJson(path: string): Promise<IPackageJson> {
  try {
    const data = await fs.readFile(path, "utf-8");
    const dataAsObj = JSON.parse(data);

    // TODO@jsjoeio implement by reading packageJson from path
    // https://attacomsian.com/blog/nodejs-read-write-json-files
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

const TS_JEST_REQUIRED_DEPENDENCIES = [
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

  if (dependencies) {
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
