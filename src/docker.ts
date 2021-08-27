import { execSync, ExecSyncOptionsWithStringEncoding } from "child_process";
import dotenv from "dotenv";
import { existsSync } from "fs";

export type DockerExecOpts = {
  container: string;
  cmd: string;
  options?: ExecSyncOptionsWithStringEncoding;
}
export function dockerExecSync({container, cmd, options}: DockerExecOpts) {
  const finalCmd = `docker exec -i ${container} ${cmd}`;
  execSync(finalCmd, options);
}
type OptsPath = { path : string };
export type DockerRunOpts = OptsPath & {
  dettach: boolean;
}
export function dockerRunSync({path, dettach = false}: DockerRunOpts) {
  const dockerComposeFile = searchForDockerComposeFile(path);

  if (dockerComposeFile) {
    let args = "";
    if (dettach)
      args += "-d";
    execSync(`docker-compose -f ${dockerComposeFile} up ${args}`);
  }
}
export type DockerStopOpts = OptsPath;
export function dockerStopSync({path}: DockerStopOpts) {
  const dockerComposeFile = searchForDockerComposeFile(path);

  if (dockerComposeFile) {
    execSync(`docker-compose -f ${dockerComposeFile} stop`);
  }
}

function searchForDockerComposeFile(path: string): string | null {
  loadEnvIfExists(path);

  const fileName = process.env.YAML ?? "docker-compose.yml";
  const filePath = `./${fileName}`;

  if (existsSync(filePath))
    return filePath;
  else
    return null;
}

function loadEnvIfExists(path: string) {
  dotenv.config();
}