import { execSync } from "child_process";
import { existsSync } from "fs";
import { logError, logGetLevel, logInfo, logSuccessVerbose } from "./log";

export type PGDumpOptions = {
  name: string;
  host: string;
  password?: string;
  username: string;
  outFile?: string;
}

export function pgDump({password, host, name, username, outFile = "./backup.db"}: PGDumpOptions) {
  logInfo(`Backup Postgres db "${name}" from "${host}" ...`);
  checkFileNotExists(outFile);
  
  let cmd = "";
  if (password)
    cmd += `PGPASSWORD=${password} `;
  
  cmd += `pg_dump -h ${host} -U ${username} -v -Fc ${name} > ${outFile}`;

  let options = {};
  if (logGetLevel() !== 'all')
    options = {...options, stdio: 'ignore'};
  execSync(cmd, options);

  checkFileCreated(outFile);

  logSuccessVerbose(`Done! File: ${outFile}`);
}

function checkFileCreated(outFile: string) {
  if (!existsSync(outFile)) {
    const errorMsg = `Output file not created: ${outFile}`;
    logError(errorMsg);
    throw new Error(errorMsg);
  }
}

function checkFileNotExists(outFile: string) {
  if (existsSync(outFile)) {
    const errorMsg = `Output file already exists: ${outFile}`;
    logError(errorMsg);
    throw new Error(errorMsg);
  }
} 