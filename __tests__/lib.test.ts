import path from "path";
import os from "os";
import { promises as fs } from "fs";
import { readPackageJson } from "../src/lib";

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
