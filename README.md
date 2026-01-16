<div align="center">  
  # 🛡️ Gemini Bug Hunter

  ### AI-Powered Security Vulnerability Hunter (CLI)
</div>

> **Gemini Bug Hunter** is an AI-first CLI tool that helps developers **find, understand, and fix security vulnerabilities** in their codebases using **Gemini 2.5 Flash (Next Gen) as the core intelligence engine**.

Inspired by tools like **Gemini-CLI** and **Claude-Code**, Gemini Bug Hunter brings **ethical hacking and AppSec workflows** directly into the developer terminal.

---

## 🚀 Vision

Security tools are often:

* Too noisy
* Too complex
* Too disconnected from developer workflows

**Gemini Bug Hunter** solves this by using **Gemini 2.5 (Next Gen) as the main reasoning engine** to:

* Understand code context
* Detect vulnerabilities
* Explain real-world risks
* Propose secure fixes
* Apply safe auto-remediations

---

## 🧠 Core Principle

> **Gemini 3 is not an assistant — it is the brain of the system.**

All vulnerability analysis, risk reasoning, and fix generation are driven by Gemini 3.

---

## 🛠️ Tech Stack

* **Node.js** (v18+)
* **JavaScript (ES2022+)**
* **Gemini 2.5 Flash** (Next Gen Analysis Engine)
* **Premium CLI Experience** (ASCII Art, Animations, Gradients)
* CLI Framework: `commander`
* Output Styling: `chalk`, `cli-table3`, `boxen`
* File traversal: `glob`
* Config: `.env` + `default.js`

---

## 📦 Installation

### Prerequisites

- Node.js 18 or higher
- Gemini API Key ([Get one here](https://aistudio.google.com/app/apikey))
- **Gemini Model**: Uses `gemini-2.5-flash` by default (configurable)

### Setup

```bash
# Clone the repository
git clone https://github.com/holasoymalva/gemini-bug-hunter.git
cd gemini-bug-hunter

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY

# Test installation
npm start doctor
```

### Global Installation (Optional)

```bash
npm link
# Now you can use 'gbh' from anywhere
```

---

## 🧪 CLI Commands

### Scan for Vulnerabilities

```bash
# Scan current directory
gbh scan

# Scan specific file or directory
gbh scan ./src

# Output to JSON file
gbh scan --output report.json

# JSON output to stdout
gbh scan --json
```

### Check System Health

```bash
gbh doctor
```

### View Configuration

```bash
gbh config
```

### Explain Vulnerability

```bash
gbh explain "SQL Injection"
gbh explain "XSS"
```

---

## 🔍 How It Works

1. **Collect** - Scans project files based on configured patterns
2. **Sanitize** - Redacts secrets and sensitive data
3. **Analyze** - Sends code to Gemini 3 with structured prompts
4. **Parse** - Extracts structured vulnerability data
5. **Score** - Calculates risk scores using weighted algorithms
6. **Report** - Displays beautiful, actionable reports

---

## 🤖 Gemini 2.5 Integration

### System Prompt

Gemini receives a carefully crafted system prompt that instructs it to:

- Act as a professional ethical hacker
- Focus on OWASP Top 10 vulnerabilities
- Avoid false positives
- Return structured JSON responses
- Provide actionable recommendations

### Response Schema

```json
{
  "projectRiskScore": 0-100,
  "riskLevel": "LOW|MEDIUM|HIGH|CRITICAL",
  "summary": "string",
  "vulnerabilities": [
    {
      "id": "string",
      "title": "string",
      "severity": "LOW|MEDIUM|HIGH|CRITICAL",
      "confidence": 0-1,
      "category": "string",
      "file": "string",
      "line": number,
      "description": "string",
      "impact": "string",
      "exploitationScenario": "string",
      "recommendation": "string",
      "secureCodeExample": "string",
      "autoFixSafe": boolean
    }
  ]
}
```

---

## 📊 Risk Scoring

The tool calculates risk scores using:

- **Severity** (40% weight) - CRITICAL, HIGH, MEDIUM, LOW
- **Confidence** (30% weight) - How certain is the detection
- **Exploitability** (20% weight) - How easy to exploit
- **Impact** (10% weight) - Business impact

Final score: **0-100%**

---

## 🔐 Security & Privacy

✅ **Explicit consent** before sending code to Gemini  
✅ **Automatic secret redaction** (API keys, passwords, tokens)  
✅ **No remote storage** of source code  
✅ **Configurable privacy settings**  

---

## 🗂️ Project Structure

```
gemini-bug-hunter/
├── cli/
│   └── index.js              # Main CLI entry point
├── engine/
│   ├── gemini/
│   │   └── client.js         # Gemini API client
│   ├── scanner/
│   │   └── scanner.js        # Code scanner
│   └── risk/
│       └── calculator.js     # Risk scoring
├── reporter/
│   └── console.js            # CLI reporter
├── config/
│   └── default.js            # Default configuration
├── .env.example              # Environment template
├── package.json
└── README.md
```

---

## 🎯 Supported Vulnerability Categories

- SQL Injection
- XSS (Cross-Site Scripting)
- CSRF (Cross-Site Request Forgery)
- Authentication Issues
- Authorization Issues
- Sensitive Data Exposure
- Security Misconfiguration
- Insecure Deserialization
- Using Components with Known Vulnerabilities
- Insufficient Logging & Monitoring
- Command Injection
- Path Traversal
- Hardcoded Secrets
- Weak Cryptography
- Race Conditions

---

## 📈 Example Output

```
🛡️  GEMINI BUG HUNTER REPORT

📊 Risk Assessment

  Risk Score: 81% ████████████████████
  Risk Level: HIGH
  Summary: Found 3 vulnerabilities including 1 CRITICAL issues requiring immediate attention

🎯 Severity Breakdown

  ● CRITICAL: 1
  ● HIGH: 1
  ● MEDIUM: 1

🔍 Detected Vulnerabilities

🔴 [1] SQL Injection in User Query
    File: src/users.js:42
    Category: SQL Injection
    Severity: CRITICAL | Confidence: 95%

    User input is directly concatenated into SQL query without sanitization.

    ⚠️  Impact: Attackers can extract or manipulate database data.

    ✓ Fix: Use parameterized queries and input validation.

    ✨ Auto-fix available
```

---

## 🔮 Future Roadmap

- [ ] Auto-fix implementation
- [ ] GitHub Actions integration
- [ ] CI/CD security gates
- [ ] PR comment integration
- [ ] Historical risk tracking
- [ ] Multi-language support (Python, Java, Go)
- [ ] Enterprise mode with team features
- [ ] Custom rule definitions
- [ ] Integration with SAST tools

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

---

## 🙏 Acknowledgments

- Powered by **Google Gemini 2.5 Flash**
- Inspired by **OWASP Top 10**
- Built for the developer community

---

## 🆘 Support

- 📧 Issues: [GitHub Issues](https://github.com/holasoymalva/gemini-bug-hunter/issues)
- 📖 Documentation: This README
- 🔑 API Key: [Get Gemini API Key](https://aistudio.google.com/app/apikey)

---

**Made with ❤️ by [@holasoymalva](https://github.com/holasoymalva)**
