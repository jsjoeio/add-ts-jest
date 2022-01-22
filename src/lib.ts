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
  const missingDependencies: DependencyDetails["missingDependencies"] = [];

  const dependencyDetails: DependencyDetails = {
    missingDependencies,
    hasDependencies: false,
  };

  if (dependencies) {
    const dependencyKeys = Object.keys(dependencies);
    // https://stackoverflow.com/a/53606357/3015595
    // TODO@jsjoeio finish this. need to add a statement inside every
    // if doesn't include, add to missingDependencies array

    TS_JEST_REQUIRED_DEPENDENCIES.every((d) => dependencyKeys.includes(d));
    dependencyKeys.forEach((dependency) => {
      if (TS_JEST_REQUIRED_DEPENDENCIES.includes(dependency)) {
      }
      /*
       lets say i have this ["jest", "typescript"] 
        what we want to do is loop over that array and check
        "does this array have these"


        */
      // Assume we're missing all of them
      // then loop through
      // if the one we have right now is included in required, then remove it from the array
      // if it has it, continue
      // we have these ["jest"]
      // we loop through. if
      // if not, add to array of msising
    });
  }

  return dependencyDetails;
}
