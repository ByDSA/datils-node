import { execSync } from "child_process";
import { checkFileExists, checkFileNotExists, dockerExecSync, logGetLevel, logInfo, logInfoVerbose, logSuccessVerbose } from "..";
import { DBOptions } from "./opts";

export type PGDumpOptions = DBOptions & { outFile?: string };
export type PGRestoreOptions = DBOptions & { inFile?: string };

export function pgDump({dockerContainer, password, host, name, username, outFile = "./backup.db"}: PGDumpOptions) {
  logInfo(`Backup Postgres db "${name}" from "${host}" ...`);
  checkFileNotExists(outFile);
  
  let cmd = "";
  if (dockerContainer)
    cmd += `docker exec -e`;
   
  if (password)
    cmd += `PGPASSWORD=${password} `;
  
  if (dockerContainer)
    cmd += dockerContainer;

  cmd += `pg_dump -h ${host} -U ${username} -v -Fc ${name} > ${outFile}`;

  let options = {};
  if (logGetLevel() !== 'all')
    options = {...options, stdio: 'ignore'};
  execSync(cmd, options);

  checkFileExists(outFile);

  logSuccessVerbose(`Done! File: ${outFile}`);
}

// not tested
export function pgRestore({dockerContainer, password, host, name, username, inFile = "./backup.db"}: PGRestoreOptions) {
  logInfo(`Restore Postgres db "${name}" from file ${inFile} to "${host}" ...`);
  checkFileExists(inFile);
  
  let cmd = "";
  if (dockerContainer)
    cmd += `docker exec -e`;
   
  if (password)
    cmd += `PGPASSWORD=${password} `;
  
  if (dockerContainer)
    cmd += `-i ${dockerContainer}`;

  cmd += `pg_restore -h ${host} -U ${username} -c -d ${name} < ${inFile}`;

  let options = {};
  if (logGetLevel() !== 'all')
    options = {...options, stdio: 'ignore'};
  execSync(cmd, options);

  if (dockerContainer) {
    if (logGetLevel() !== 'all') {
      options = {...options, stdio: 'ignore'};
      logInfoVerbose("Flushing cache ...");
    }
    dockerExecSync({
      container: dockerContainer,
      cmd: "rm -rf data/cache"
    });
  }

  logSuccessVerbose(`Done!`);
}