/**
 * Default Configuration for Gemini Bug Hunter
 */

export const DEFAULT_CONFIG = {
    // Gemini API Settings
    gemini: {
        model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
        temperature: parseFloat(process.env.GEMINI_TEMPERATURE) || 0.2,
        maxTokens: parseInt(process.env.GEMINI_MAX_TOKENS) || 8192,
        topP: 0.95,
        topK: 40,
    },

    // Scanning Configuration
    scan: {
        maxFileSizeKB: parseInt(process.env.MAX_FILE_SIZE_KB) || 500,
        timeoutMs: parseInt(process.env.SCAN_TIMEOUT_MS) || 30000,
        chunkSize: 4000, // characters per chunk
        excludePatterns: [
            '**/node_modules/**',
            '**/dist/**',
            '**/build/**',
            '**/.git/**',
            '**/coverage/**',
            '**/*.min.js',
            '**/*.bundle.js',
            '**/vendor/**',
        ],
        includeExtensions: [
            '.js',
            '.jsx',
            '.ts',
            '.tsx',
            '.py',
            '.java',
            '.go',
            '.rb',
            '.php',
            '.cs',
            '.cpp',
            '.c',
            '.h',
        ],
    },

    // Security Categories (OWASP Top 10 + Common)
    categories: [
        'SQL Injection',
        'XSS (Cross-Site Scripting)',
        'CSRF (Cross-Site Request Forgery)',
        'Authentication Issues',
        'Authorization Issues',
        'Sensitive Data Exposure',
        'Security Misconfiguration',
        'Insecure Deserialization',
        'Using Components with Known Vulnerabilities',
        'Insufficient Logging & Monitoring',
        'Command Injection',
        'Path Traversal',
        'Hardcoded Secrets',
        'Weak Cryptography',
        'Race Conditions',
    ],

    // Risk Scoring Weights
    riskWeights: {
        severity: 0.4,
        confidence: 0.3,
        exploitability: 0.2,
        impact: 0.1,
    },

    // Severity Thresholds
    severityThresholds: {
        critical: 90,
        high: 70,
        medium: 40,
        low: 0,
    },

    // Report Settings
    report: {
        outputDir: './reports',
        formats: ['json', 'console'],
        includeCodeSnippets: true,
        maxSnippetLines: 10,
    },

    // Auto-fix Settings
    autoFix: {
        enabled: true,
        requireConfirmation: true,
        createBackup: true,
        backupDir: './.gbh-backups',
    },

    // Privacy & Security
    privacy: {
        redactSecrets: true,
        requireConsent: true,
        offlineMode: false,
    },
};

export default DEFAULT_CONFIG;
