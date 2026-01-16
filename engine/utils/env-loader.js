
import dotenv from 'dotenv';
import path from 'path';
import os from 'os';
import fs from 'fs';

/**
 * Load environment variables from local or global .env
 */
export function loadEnv() {
    // 1. Try loading from current directory
    dotenv.config();

    // 2. If GEMINI_API_KEY is missing, try global config
    if (!process.env.GEMINI_API_KEY) {
        const globalConfigPath = path.join(os.homedir(), '.gemini-bug-hunter', '.env');

        if (fs.existsSync(globalConfigPath)) {
            const globalConfig = dotenv.config({ path: globalConfigPath });
            if (globalConfig.parsed) {
                // Assign to process.env manually if dotenv didn't do it automatically due to overrides, 
                // though dotenv specific handling usually creates them.
                // But usually dotenv.config({path}) does the job.
            }
        }
    }
}

/**
 * Get path to global config file
 */
export function getGlobalConfigPath() {
    return path.join(os.homedir(), '.gemini-bug-hunter', '.env');
}
