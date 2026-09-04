import {spawn} from 'node:child_process';
const child=spawn(process.execPath,['node_modules/vinext/dist/cli.js','build'],{stdio:'inherit',env:{...process.env,WRANGLER_WRITE_LOGS:'false',WRANGLER_LOG_PATH:'.wrangler/logs'}});
const timer=setTimeout(()=>{child.kill();process.exitCode=1},180000);
child.on('exit',code=>{clearTimeout(timer);process.exitCode=code??1});
