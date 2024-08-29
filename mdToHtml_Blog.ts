const fs = require('fs');
const path = require('path');
const marked = require('marked');

function leggiFileMarkdown(directory) {
    const files = fs.readdirSync(directory);
    return files
        .filter(file => path.extname(file).toLowerCase() === '.md')
        .map(file => {
            const filePath = path.join(directory, file);
            const content = fs.readFileSync(filePath, 'utf-8');
            return { nome: path.basename(file, '.md'), contenuto: content };
        });
}

function convertiMarkdownInHTML(markdown) {
    return marked.parse(markdown);
}

function generaPaginaHTML(titolo, contenuto) {
    return `
        <!DOCTYPE html>
        <html lang="it">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${titolo}</title>
            <style>
                body {
                    background-color: #2b2b2b;
                    color: #33ff00;
                    font-family: 'Courier New', monospace;
                    line-height: 1.6;
                    padding: 20px;
                    max-width: 800px;
                    margin: 0 auto;
                }
                h1, h2, h3, h4, h5, h6 {
                    color: #33ff00;
                }
                a {
                    color: #00aaff;
                    text-decoration: none;
                }
                a:hover {
                    text-decoration: underline;
                }
                pre {
                    background-color: #1a1a1a;
                    padding: 10px;
                    border-radius: 5px;
                    overflow-x: auto;
                }
                code {
                    font-family: 'Courier New', monospace;
                }
                blockquote {
                    border-left: 3px solid #33ff00;
                    padding-left: 10px;
                    margin-left: 20px;
                    font-style: italic;
                }
                img {
                    max-width: 100%;
                    height: auto;
                }
                .prompt::before {
                    content: "$ ";
                    color: #ff6600;
                }
                .prompt {
                    margin-bottom: 20px;
                }
            </style>
        </head>
        <body>
            <div class="prompt">${titolo}</div>
            ${contenuto}
        </body>
        </html>
    `;
}

function generaIndice(posts) {
    const listaPost = posts.map(post => `<li><a href="${post.nome}.html">${post.nome}</a></li>`).join('');
    return `
        <h1>Indice dei Post</h1>
        <ul>${listaPost}</ul>
    `;
}

function generaGlog(directoryInput, directoryOutput) {
    const posts = leggiFileMarkdown(directoryInput);
    
    if (!fs.existsSync(directoryOutput)) {
        fs.mkdirSync(directoryOutput);
    }

    posts.forEach(post => {
        const htmlContent = convertiMarkdownInHTML(post.contenuto);
        const paginaHTML = generaPaginaHTML(post.nome, htmlContent);
        fs.writeFileSync(path.join(directoryOutput, `${post.nome}.html`), paginaHTML);
    });

    const indiceHTML = generaPaginaHTML('Indice', generaIndice(posts));
    fs.writeFileSync(path.join(directoryOutput, 'index.html'), indiceHTML);

    console.log(`Glog generato con successo in ${directoryOutput}`);
}

// Esempio di utilizzo
const directoryInput = './markdown-posts';
const directoryOutput = './glog-output';
generaGlog(directoryInput, directoryOutput);