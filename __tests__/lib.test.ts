import path from "path";
import os from "os";
import { promises as fs } from "fs";
import { readPackageJson, checkForDependencies } from "../src/lib";

describe("readPackageJson", () => {
  let testPrefix = "readPackageJson";
  let pathToPackageJson = "";
  let tmpDirPath = path.join(os.tmpdir(), testPrefix);

  const packageJsonData = {
    name: "test-package-json",
  };

  beforeEach(async () => {
    await fs.mkdir(tmpDirPath);
    pathToPackageJson = `${tmpDirPath}/package.json`;
    await fs.writeFile(pathToPackageJson, JSON.stringify(packageJsonData));
  });

  afterEach(async () => {
    await fs.rm(tmpDirPath, { recursive: true, force: true });
  });

  it("should return the packageJson as an object", async () => {
    const packageJson = await readPackageJson(pathToPackageJson);
    expect(packageJson.name).toBe("test-package-json");
  });
});

describe("checkForDependencies", () => {
  describe("with no dependencies", () => {
    let testPrefix = "checkForDependencies";
    let pathToPackageJson = "";
    let tmpDirPath = path.join(os.tmpdir(), testPrefix);

    const packageJsonData = {
      name: "test-package-json",
    };

    beforeEach(async () => {
      await fs.mkdir(tmpDirPath);
      pathToPackageJson = `${tmpDirPath}/package.json`;
      await fs.writeFile(pathToPackageJson, JSON.stringify(packageJsonData));
    });

    afterEach(async () => {
      await fs.rm(tmpDirPath, { recursive: true, force: true });
    });
    it("should return false and the missingDependencies", async () => {
      const packageJson = await readPackageJson(pathToPackageJson);
      const dependencies = packageJson.devDependencies;

      const actual = checkForDependencies(dependencies);
      expect(actual.hasDependencies).toBe(false);
      expect(actual.missingDependencies).toHaveLength(4);
    });
  });
  describe("with dependencies", () => {
    let testPrefix = "checkForDependencies";
    let pathToPackageJson = "";
    let tmpDirPath = path.join(os.tmpdir(), testPrefix);

    const packageJsonData = {
      devDependencies: {
        "@types/jest": "^27.4.0",
        jest: "^27.4.7",
        "ts-jest": "^27.1.3",
        typescript: "^4.5.5",
      },
    };

    beforeEach(async () => {
      await fs.mkdir(tmpDirPath);
      pathToPackageJson = `${tmpDirPath}/package.json`;
      await fs.writeFile(pathToPackageJson, JSON.stringify(packageJsonData));
    });

    afterEach(async () => {
      await fs.rm(tmpDirPath, { recursive: true, force: true });
    });
    it("should return object with dependency details", async () => {
      const packageJson = await readPackageJson(pathToPackageJson);
      const dependencies = packageJson.devDependencies;

      const actual = checkForDependencies(dependencies);
      expect(actual.hasDependencies).toBe(true);
      expect(actual.missingDependencies).toHaveLength(0);
    });
  });
});
