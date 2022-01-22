import { promises as fs } from "fs";
import { IPackageJson } from "package-json-type";

export async function readPackageJson(path: string): Promise<IPackageJson> {
  try {
    const data = await fs.readFile(path, "utf-8");
    const dataAsObj = JSON.parse(data);

    // TODO@jsjoeio implement by reading packageJson from path
    // https://attacomsian.com/blog/nodejs-read-write-json-files
    return dataAsObj;
  } catch (error) {
      console.error("something went wrong reading the package json")
  }
  return {};
}
