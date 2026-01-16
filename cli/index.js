#!/usr/bin/env node

/**
 * Gemini Bug Hunter CLI
 * Main entry point
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs/promises';
import path from 'path';
import GeminiClient from '../engine/gemini/client.js';
import Scanner from '../engine/scanner/scanner.js';
import RiskCalculator from '../engine/risk/calculator.js';
import ConsoleReporter from '../reporter/console.js';

import displayWelcome from './welcome.js';

const program = new Command();

program
    .name('gbh')
    .description('🛡️  Gemini Bug Hunter - AI-Powered Security Vulnerability Scanner')
    .version('1.0.0')
    .hook('preAction', async (thisCommand, actionCommand) => {
        // Solo mostrar animación si es el comando principal o 'doctor'
        if (thisCommand.args.length === 0 || actionCommand.name() === 'doctor') {
            // Podemos decidir si mostrarlo siempre o solo en ciertos casos
            // Para esta demo, lo mostraremos en comandos interactivos principales
        }
    });

// Custom help handler to show welcome screen
if (process.argv.length <= 2) {
    await displayWelcome();
}

/**
 * Scan Command
 */
program
    .command('scan')
    .description('Scan code for security vulnerabilities')
    .argument('[path]', 'Path to scan (file or directory)', '.')
    .option('-o, --output <file>', 'Output report to file')
    .option('--json', 'Output as JSON')
    .action(async (targetPath, options) => {
        const reporter = new ConsoleReporter();
        let spinner;

        try {
            // Initialize
            spinner = ora('Initializing Gemini Bug Hunter...').start();
            const gemini = new GeminiClient();
            const scanner = new Scanner();
            const riskCalc = new RiskCalculator();

            // Test connection
            spinner.text = 'Testing Gemini API connection...';
            const connectionResult = await gemini.testConnection();
            if (!connectionResult.success) {
                spinner.fail('Failed to connect to Gemini API');
                reporter.displayError(connectionResult.error || 'Connection failed');
                reporter.displayWarning('Check your GEMINI_API_KEY and model configuration in .env file');
                process.exit(1);
            }
            spinner.succeed('Connected to Gemini API');

            // Scan files
            spinner = ora('Scanning files...').start();
            const files = await scanner.scan(targetPath);
            const stats = scanner.getStatistics(files);
            spinner.succeed(`Found ${stats.totalFiles} files (${stats.totalLines} lines)`);

            // Analyze with Gemini
            spinner = ora('Analyzing code with Gemini 3...').start();
            const allVulnerabilities = [];

            for (const file of files) {
                try {
                    spinner.text = `Analyzing ${file.relativePath}...`;

                    const result = await gemini.analyzeCode(file.content, {
                        language: file.language,
                        file: file.relativePath,
                        environment: 'Production',
                    });

                    if (result.vulnerabilities && result.vulnerabilities.length > 0) {
                        allVulnerabilities.push(...result.vulnerabilities);
                    }
                } catch (error) {
                    console.warn(chalk.yellow(`\n⚠️  Failed to analyze ${file.relativePath}: ${error.message}`));
                }
            }

            spinner.succeed(`Analysis complete - Found ${allVulnerabilities.length} potential issues`);

            // Calculate risk
            const projectRisk = riskCalc.calculateProjectRisk(allVulnerabilities);
            const prioritized = riskCalc.prioritize(allVulnerabilities);

            // Build report
            const report = {
                timestamp: new Date().toISOString(),
                projectRisk,
                vulnerabilities: prioritized,
                scanStats: {
                    filesScanned: stats.totalFiles,
                    linesAnalyzed: stats.totalLines,
                    duration: 'N/A',
                },
            };

            // Display report
            if (options.json) {
                console.log(JSON.stringify(report, null, 2));
            } else {
                reporter.displayReport(report);
            }

            // Save to file
            if (options.output) {
                await fs.writeFile(options.output, JSON.stringify(report, null, 2));
                reporter.displaySuccess(`Report saved to ${options.output}`);
            }

            // Exit code based on risk
            if (projectRisk.level === 'CRITICAL' || projectRisk.level === 'HIGH') {
                process.exit(1);
            }

        } catch (error) {
            if (spinner) spinner.fail('Scan failed');
            reporter.displayError(error.message);
            console.error(chalk.gray(error.stack));
            process.exit(1);
        }
    });

/**
 * Doctor Command
 */
program
    .command('doctor')
    .description('Check system configuration')
    .action(async () => {
        const reporter = new ConsoleReporter();

        console.log(chalk.bold('\n🏥 Running diagnostics...\n'));

        // Check Node version
        const nodeVersion = process.version;
        console.log(`${chalk.green('✓')} Node.js: ${nodeVersion}`);

        // Check .env file
        try {
            await fs.access('.env');
            console.log(`${chalk.green('✓')} .env file found`);
        } catch {
            console.log(`${chalk.yellow('⚠️ ')} .env file not found (create from .env.example)`);
        }

        // Check API key
        if (process.env.GEMINI_API_KEY) {
            console.log(`${chalk.green('✓')} GEMINI_API_KEY is set`);

            // Test connection
            try {
                const gemini = new GeminiClient();
                const result = await gemini.testConnection();
                if (result.success) {
                    console.log(`${chalk.green('✓')} Gemini API connection successful`);
                    console.log(chalk.gray(`   Model: ${gemini.config.model}`));
                } else {
                    console.log(`${chalk.red('✗')} Gemini API connection failed`);
                    console.log(chalk.yellow(`   Error: ${result.error}`));
                    console.log(chalk.gray('   Troubleshooting:'));
                    console.log(chalk.gray('   - Verify your API key at: https://aistudio.google.com/app/apikey'));
                    console.log(chalk.gray('   - Check if the model exists (current: ' + gemini.config.model + ')'));
                    console.log(chalk.gray('   - Try changing GEMINI_MODEL in .env to: gemini-pro'));
                }
            } catch (error) {
                console.log(`${chalk.red('✗')} Gemini API error: ${error.message}`);
            }
        } else {
            console.log(`${chalk.red('✗')} GEMINI_API_KEY not set`);
            console.log(chalk.gray('   Get your key from: https://aistudio.google.com/app/apikey'));
        }

        console.log(chalk.bold('\n✨ Diagnostics complete\n'));
    });

/**
 * Config Command
 */
program
    .command('config')
    .description('Show current configuration')
    .action(async () => {
        const { DEFAULT_CONFIG } = await import('../config/default.js');
        console.log(chalk.bold('\n⚙️  Current Configuration\n'));
        console.log(JSON.stringify(DEFAULT_CONFIG, null, 2));
        console.log('');
    });

/**
 * Explain Command
 */
program
    .command('explain')
    .description('Explain a vulnerability category')
    .argument('<category>', 'Vulnerability category (e.g., "SQL Injection")')
    .action(async (category) => {
        const reporter = new ConsoleReporter();
        const spinner = ora('Asking Gemini...').start();

        try {
            const gemini = new GeminiClient();
            await gemini.initialize();

            const prompt = `Explain the "${category}" security vulnerability in simple terms.
      
Include:
1. What it is
2. How it works
3. Real-world example
4. How to prevent it

Keep it concise and practical.`;

            const result = await gemini.model.generateContent(prompt);
            const explanation = result.response.text();

            spinner.succeed('Explanation ready');

            console.log(chalk.bold(`\n📚 ${category}\n`));
            console.log(explanation);
            console.log('');

        } catch (error) {
            spinner.fail('Failed to get explanation');
            reporter.displayError(error.message);
        }
    });

// Parse arguments
program.parse();
