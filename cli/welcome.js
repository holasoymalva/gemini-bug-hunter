import figlet from 'figlet';
import gradient from 'gradient-string';
import chalk from 'chalk';

const sleep = (ms = 1000) => new Promise((r) => setTimeout(r, ms));

async function displayWelcome() {
    console.clear();

    // 1. Efecto inicial de "booting"
    const loadingChars = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    let i = 0;

    // Pequeña simulación de carga de sistema
    const steps = [
        'Initializing Core Systems...',
        'Loading Neural Modules...',
        'Connecting to Gemini Grid...',
        'Calibrating Scanners...',
        'System Ready.'
    ];

    for (const step of steps) {
        process.stdout.write(`\r${chalk.cyan(loadingChars[i++ % loadingChars.length])} ${chalk.gray(step)}`);
        await sleep(200);
    }
    process.stdout.write('\r\x1b[K'); // Limpiar línea

    // 2. Mostrar Logo Grande con Gradiente Estilo Gemini
    const msg = 'GEMINI BUG\nHUNTER';

    const fontOptions = {
        font: 'Slant',
        horizontalLayout: 'default',
        verticalLayout: 'default',
        width: 80,
        whitespaceBreak: true
    };

    return new Promise((resolve) => {
        figlet(msg, fontOptions, async (err, data) => {
            if (err) {
                console.log('Something went wrong...');
                console.dir(err);
                resolve();
                return;
            }

            // Definir gradiente personalizado (Azul Gemini -> Cyan -> Blanco)
            const geminiGradient = gradient([
                '#1a73e8', // Gemini Blue
                '#00e5ff', // Cyan
                '#ffffff'  // White
            ]);

            console.log(geminiGradient.multiline(data));

            // 3. Subtítulo con efecto de tipeo
            const subtitle = "AI-POWERED SECURITY INTELLIGENCE v1.2";
            await typeEffect(subtitle);

            console.log('\n');
            console.log(chalk.gray('Type ') + chalk.cyan('gbh --help') + chalk.gray(' to see available commands.'));
            console.log(chalk.gray('─'.repeat(50)) + '\n');

            resolve();
        });
    });
}

function typeEffect(text, speed = 30) {
    return new Promise((resolve) => {
        let i = 0;
        const interval = setInterval(() => {
            process.stdout.write(chalk.cyan(text.charAt(i)));
            i++;
            if (i >= text.length) {
                clearInterval(interval);
                process.stdout.write('\n');
                resolve();
            }
        }, speed);
    });
}

export default displayWelcome;
