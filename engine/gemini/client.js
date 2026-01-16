/**
 * Gemini API Client
 * Core intelligence engine for vulnerability analysis
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { DEFAULT_CONFIG } from '../../config/default.js';

dotenv.config();

class GeminiClient {
    constructor() {
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            throw new Error(
                '❌ GEMINI_API_KEY not found. Please set it in your .env file.\n' +
                'Get your API key from: https://aistudio.google.com/app/apikey'
            );
        }

        this.genAI = new GoogleGenerativeAI(apiKey);
        this.config = DEFAULT_CONFIG.gemini;
        this.model = null;
    }

    /**
     * Initialize the Gemini model
     */
    async initialize() {
        try {
            this.model = this.genAI.getGenerativeModel({
                model: this.config.model,
                generationConfig: {
                    temperature: this.config.temperature,
                    topP: this.config.topP,
                    topK: this.config.topK,
                    maxOutputTokens: this.config.maxTokens,
                },
                safetySettings: [
                    {
                        category: 'HARM_CATEGORY_HARASSMENT',
                        threshold: 'BLOCK_NONE',
                    },
                    {
                        category: 'HARM_CATEGORY_HATE_SPEECH',
                        threshold: 'BLOCK_NONE',
                    },
                    {
                        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                        threshold: 'BLOCK_NONE',
                    },
                    {
                        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
                        threshold: 'BLOCK_NONE',
                    },
                ],
            });

            return true;
        } catch (error) {
            throw new Error(`Failed to initialize Gemini: ${error.message}`);
        }
    }

    /**
     * Analyze code for vulnerabilities
     * @param {string} code - Source code to analyze
     * @param {object} context - Additional context (language, file path, etc.)
     * @returns {Promise<object>} - Structured vulnerability report
     */
    async analyzeCode(code, context = {}) {
        if (!this.model) {
            await this.initialize();
        }

        const prompt = this._buildAnalysisPrompt(code, context);

        try {
            const result = await this.model.generateContent(prompt);
            const response = result.response;
            const text = response.text();

            // Parse JSON response
            return this._parseResponse(text);
        } catch (error) {
            throw new Error(`Gemini analysis failed: ${error.message}`);
        }
    }

    /**
     * Generate secure fix for a vulnerability
     * @param {object} vulnerability - Vulnerability object
     * @param {string} originalCode - Original vulnerable code
     * @returns {Promise<string>} - Fixed code
     */
    async generateFix(vulnerability, originalCode) {
        if (!this.model) {
            await this.initialize();
        }

        const prompt = this._buildFixPrompt(vulnerability, originalCode);

        try {
            const result = await this.model.generateContent(prompt);
            const response = result.response;
            return response.text().trim();
        } catch (error) {
            throw new Error(`Fix generation failed: ${error.message}`);
        }
    }

    /**
     * Build analysis prompt for Gemini
     * @private
     */
    _buildAnalysisPrompt(code, context) {
        const systemPrompt = `You are Gemini Bug Hunter, a professional ethical hacker and application security expert.

Your job is to analyze source code and identify real security vulnerabilities.
You must think like an attacker and explain like a senior security engineer.

Rules:
- Focus on OWASP Top 10 and real-world vulnerabilities
- Avoid false positives
- Be precise and actionable
- Explain risks in plain English
- Always propose secure fixes
- Rate severity accurately (LOW, MEDIUM, HIGH, CRITICAL)
- Never hallucinate vulnerabilities

Output format MUST be valid JSON and strictly follow this schema:

{
  "projectRiskScore": number (0-100),
  "riskLevel": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  "summary": string,
  "vulnerabilities": [
    {
      "id": string,
      "title": string,
      "severity": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
      "confidence": number (0-1),
      "category": string,
      "file": string,
      "line": number,
      "description": string,
      "impact": string,
      "exploitationScenario": string,
      "recommendation": string,
      "secureCodeExample": string,
      "autoFixSafe": boolean
    }
  ]
}`;

        const userPrompt = `Analyze the following source code for security vulnerabilities.

Project Context:
- Language: ${context.language || 'JavaScript'}
- File: ${context.file || 'unknown'}
- Environment: ${context.environment || 'Production'}

Code:
\`\`\`
${code}
\`\`\`

Instructions:
- Identify ONLY real vulnerabilities
- Do not speculate
- Reference exact files and lines
- Be concise but thorough
- Use OWASP terminology
- Return ONLY valid JSON, no markdown formatting`;

        return `${systemPrompt}\n\n${userPrompt}`;
    }

    /**
     * Build fix generation prompt
     * @private
     */
    _buildFixPrompt(vulnerability, originalCode) {
        return `You are fixing a confirmed security vulnerability.

Vulnerability:
${JSON.stringify(vulnerability, null, 2)}

Original Code:
\`\`\`
${originalCode}
\`\`\`

Instructions:
- Produce a secure refactor
- Preserve original behavior
- Follow best security practices
- Output ONLY the fixed code, no explanations
- Do not include markdown code blocks`;
    }

    /**
     * Parse Gemini response
     * @private
     */
    _parseResponse(text) {
        try {
            // Remove markdown code blocks if present
            let cleaned = text.trim();
            if (cleaned.startsWith('```json')) {
                cleaned = cleaned.replace(/```json\n?/g, '').replace(/```\n?/g, '');
            } else if (cleaned.startsWith('```')) {
                cleaned = cleaned.replace(/```\n?/g, '');
            }

            const parsed = JSON.parse(cleaned);

            // Validate structure
            if (!parsed.vulnerabilities || !Array.isArray(parsed.vulnerabilities)) {
                throw new Error('Invalid response structure');
            }

            return parsed;
        } catch (error) {
            throw new Error(`Failed to parse Gemini response: ${error.message}\n\nRaw response:\n${text}`);
        }
    }

    /**
     * Test connection to Gemini API
     */
    async testConnection() {
        try {
            await this.initialize();
            const result = await this.model.generateContent('Hello, respond with "OK"');
            const text = result.response.text();
            return { success: true, message: text };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

export default GeminiClient;
