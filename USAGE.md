# 🚀 Complete Usage Guide

## Gemini Bug Hunter - From Zero to Hero

This guide will take you from installation to advanced usage.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Basic Usage](#basic-usage)
5. [Advanced Usage](#advanced-usage)
6. [Understanding Results](#understanding-results)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)
9. [Examples](#examples)

---

## Prerequisites

### Required
- **Node.js 18+** - [Download here](https://nodejs.org)
- **Gemini API Key** - [Get free key](https://aistudio.google.com/app/apikey)
- **Internet connection** - For Gemini API calls

### Optional
- **Git** - For cloning repository
- **Code editor** - For viewing/editing code

---

## Installation

### Method 1: Automated Setup (Recommended)

```bash
# Clone the repository
git clone https://github.com/holasoymalva/gemini-bug-hunter.git
cd gemini-bug-hunter

# Run automated setup
./setup.sh
```

The setup script will:
- ✅ Check Node.js version
- ✅ Install dependencies
- ✅ Create .env file
- ✅ Guide you through API key setup
- ✅ Run system diagnostics

### Method 2: Manual Setup

```bash
# Clone repository
git clone https://github.com/holasoymalva/gemini-bug-hunter.git
cd gemini-bug-hunter

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY

# Verify setup
npm start doctor
```

### Method 3: Global Installation

```bash
# Install globally
npm install -g gemini-bug-hunter

# Set your API Key globally (Run once)
gbh config set-key <YOUR_API_KEY>

# Verify setup
gbh doctor

# Scan any directory
gbh scan
```

---

## Configuration

### 1. Get Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the key

### 2. Configure Environment

Edit `.env` file:

```env
# Required
GEMINI_API_KEY=AIzaSyD...your-actual-key-here

# Optional (defaults shown)
GEMINI_MODEL=gemini-2.0-flash-exp
GEMINI_TEMPERATURE=0.2
GEMINI_MAX_TOKENS=8192
MAX_FILE_SIZE_KB=500
SCAN_TIMEOUT_MS=30000
```

### 3. Verify Configuration

```bash
npm start doctor
```

Expected output:
```
✓ Node.js: v18.x.x
✓ .env file found
✓ GEMINI_API_KEY is set
✓ Gemini API connection successful
```

---

## Basic Usage

### Scan Current Directory

```bash
npm start scan
```

### Scan Specific Path

```bash
# Scan a directory
npm start scan ./src

# Scan a single file
npm start scan ./src/users.js
```

### Save Report to File

```bash
npm start scan --output report.json
```

### Get JSON Output

```bash
npm start scan --json > results.json
```

### Check System Health

```bash
npm start doctor
```

### View Configuration

```bash
npm start config
```

### Learn About Vulnerabilities

```bash
npm start explain "SQL Injection"
npm start explain "XSS"
npm start explain "CSRF"
```

---

## Advanced Usage

### Scan Multiple Projects

```bash
# Scan project A
npm start scan ~/projects/app-a --output app-a-report.json

# Scan project B
npm start scan ~/projects/app-b --output app-b-report.json

# Compare results
diff app-a-report.json app-b-report.json
```

### Filter by Severity

```bash
# Get only critical issues
npm start scan --json | jq '.vulnerabilities[] | select(.severity=="CRITICAL")'

# Count by severity
npm start scan --json | jq '.projectRisk.severityCounts'
```

### CI/CD Integration

```bash
# Exit with error code if HIGH or CRITICAL found
npm start scan ./src
EXIT_CODE=$?

if [ $EXIT_CODE -ne 0 ]; then
    echo "Security issues found! Blocking deployment."
    exit 1
fi
```

### Batch Scanning

```bash
#!/bin/bash
# scan-all.sh

for dir in ./projects/*/; do
    echo "Scanning $dir..."
    npm start scan "$dir" --output "${dir}/security-report.json"
done
```

---

## Understanding Results

### Risk Score (0-100%)

- **0-39%** (LOW) - Minor issues, low priority
- **40-69%** (MEDIUM) - Should be addressed
- **70-89%** (HIGH) - Important, fix soon
- **90-100%** (CRITICAL) - Urgent, fix immediately

### Severity Levels

🔴 **CRITICAL**
- Immediate exploitation possible
- High business impact
- Fix immediately

🟡 **HIGH**
- Likely exploitable
- Significant impact
- Fix within days

🔵 **MEDIUM**
- Potentially exploitable
- Moderate impact
- Fix within weeks

⚪ **LOW**
- Difficult to exploit
- Low impact
- Fix when convenient

### Confidence Score

- **0.9-1.0** - Very confident, likely real
- **0.7-0.9** - Confident, probably real
- **0.5-0.7** - Moderate confidence, review
- **0.0-0.5** - Low confidence, may be false positive

### Report Sections

1. **Risk Assessment** - Overall project security score
2. **Severity Breakdown** - Count by severity level
3. **Vulnerabilities** - Detailed findings with:
   - Title and description
   - File location and line number
   - Impact and exploitation scenario
   - Recommended fix
   - Auto-fix availability

---

## Best Practices

### 1. Regular Scanning

```bash
# Scan before commits
git add .
npm start scan

# Scan before deployments
npm start scan --json > pre-deploy-scan.json
```

### 2. Focus on Critical Issues First

```bash
# Get critical issues only
npm start scan --json | jq '.vulnerabilities[] | select(.severity=="CRITICAL")'
```

### 3. Track Progress

```bash
# Initial scan
npm start scan --output baseline.json

# After fixes
npm start scan --output after-fixes.json

# Compare
diff baseline.json after-fixes.json
```

### 4. Learn from Findings

```bash
# Found SQL Injection? Learn about it
npm start explain "SQL Injection"

# Understand the fix
cat report.json | jq '.vulnerabilities[0].recommendation'
```

### 5. Integrate into Workflow

```bash
# Add to package.json
{
  "scripts": {
    "security": "node cli/index.js scan",
    "presecurity": "echo 'Running security scan...'",
    "postsecurity": "echo 'Scan complete!'"
  }
}

# Run with
npm run security
```

---

## Troubleshooting

### "GEMINI_API_KEY not found"

**Solution:**
```bash
# Check .env exists
ls -la .env

# Check key is set
cat .env | grep GEMINI_API_KEY

# If missing, add it
echo "GEMINI_API_KEY=your-key-here" >> .env
```

### "Failed to connect to Gemini API"

**Possible causes:**
1. Invalid API key
2. No internet connection
3. API quota exceeded
4. API service down

**Solution:**
```bash
# Test connection
npm start doctor

# Check API key validity at
# https://aistudio.google.com/app/apikey
```

### "No files found"

**Possible causes:**
1. Wrong path
2. Files excluded by patterns
3. Unsupported file types

**Solution:**
```bash
# Check path exists
ls -la ./src

# Check supported extensions in config
npm start config | grep includeExtensions

# Verify exclude patterns
npm start config | grep excludePatterns
```

### "File too large"

**Solution:**
```bash
# Increase limit in .env
echo "MAX_FILE_SIZE_KB=1000" >> .env

# Or split large files
```

### "Timeout error"

**Solution:**
```bash
# Increase timeout in .env
echo "SCAN_TIMEOUT_MS=60000" >> .env
```

---

## Examples

### Example 1: First Scan

```bash
$ npm start scan examples/

🛡️  GEMINI BUG HUNTER REPORT

📊 Risk Assessment
  Risk Score: 81% ████████████████████
  Risk Level: HIGH
  
🎯 Severity Breakdown
  ● CRITICAL: 1
  ● HIGH: 2
  ● MEDIUM: 3
  
🔍 Detected Vulnerabilities
🔴 [1] SQL Injection in User Query
    File: vulnerable-sample.js:21
    Fix: Use parameterized queries
```

### Example 2: JSON Output

```bash
$ npm start scan examples/ --json

{
  "timestamp": "2026-01-15T19:00:00.000Z",
  "projectRisk": {
    "score": 81,
    "level": "HIGH",
    "summary": "Found 6 vulnerabilities including 1 CRITICAL"
  },
  "vulnerabilities": [
    {
      "id": "vuln-001",
      "title": "SQL Injection",
      "severity": "CRITICAL",
      "confidence": 0.95,
      "file": "vulnerable-sample.js",
      "line": 21,
      "recommendation": "Use parameterized queries"
    }
  ]
}
```

### Example 3: Learning Mode

```bash
$ npm start explain "SQL Injection"

📚 SQL Injection

What it is:
SQL Injection is a code injection technique that exploits 
security vulnerabilities in database queries...

How it works:
Attackers insert malicious SQL code into input fields...

Prevention:
1. Use parameterized queries
2. Validate and sanitize input
3. Use ORMs with built-in protection
```

---

## Quick Reference

### Common Commands

```bash
# Scan
npm start scan [path]           # Scan code
npm start scan --output file    # Save report
npm start scan --json           # JSON output

# Info
npm start doctor                # Health check
npm start config                # View config
npm start explain <topic>       # Learn

# Setup
./setup.sh                      # Automated setup
npm install                     # Install deps
```

### File Locations

```
.env                    # Your API key
config/default.js       # Configuration
examples/               # Test files
reports/                # Generated reports
```

### Support Resources

- 📖 README.md - Main docs
- 🚀 QUICKSTART.md - Quick start
- 🏗️ ARCHITECTURE.md - Technical details
- ✅ CHECKLIST.md - Feature list
- 🐛 GitHub Issues - Bug reports

---

## Next Steps

1. ✅ Complete setup
2. ✅ Run first scan
3. ✅ Review findings
4. ✅ Learn about vulnerabilities
5. ✅ Fix critical issues
6. ✅ Re-scan to verify
7. ✅ Integrate into workflow
8. ✅ Share with team

---

**Happy hunting! 🛡️**

For more help, see [README.md](README.md) or [QUICKSTART.md](QUICKSTART.md)
