// ----------------------------------------------------------------------------
// This code is released into the public domain.
// Alexander Hübert, 22nd of March 2025
// ----------------------------------------------------------------------------
//

function highlightSyntax() {
    const codeBlocks = document.querySelectorAll('pre code')

    if (!codeBlocks.length) return

    // colors ------------------------------------------------------------------
    const green = '#7ea'
    const blue = '#6bf'
    const pink = '#f69'
    const grey = '#777'
    const foreground = '#dde'
    const background = '#222'

    // search patterns ---------------------------------------------------------
    const _keywords = [
        'function', 'func', 'fn', 'def',
        'class', 'constructor', 'extends', 'super',
        'const', 'let', 'var',
        'if', 'else', 'for', 'while',
        'int', 'float', 'string',
        'import', 'export', 'from', 'in',
        'undefined'
    ].join('|')
    const keywords = new RegExp(`\\b(?:${_keywords})\\b`)

    const numbers = /\d+(?:\.\d+)?/
    const functions = /\b\w+\s*(?=\()/
    const xmlTags = /(?<=&lt;\/?)\w+/
    const comments = /(?:\/\/|#).*?(?=\n|$)/
    const blockComments = /\/\*[\s\S]*?\*\//
    const regx = /\/.+\//
    const strings = /'.*?'|".*?"|`.*?`|true|false|return|this|new|async|await/

    const templVars = /\${(.*?)}/g

    const combinedPattern = new RegExp(
        `(${keywords.source})|` +
        `(${numbers.source})|` +
        `(${functions.source})|` +
        `(${xmlTags.source})|` +
        `(${comments.source})|` +
        `(${blockComments.source})|` +
        `(${regx.source})|` +
        `(${strings.source})`, 'gi'
    )

    // matching and applying styles and colors ---------------------------------
    codeBlocks.forEach((codeBlock) => {
        const preElement = codeBlock.parentElement

        if (preElement.tagName === 'PRE') {
            preElement.style.backgroundColor = background
            preElement.style.color = foreground
            preElement.style.padding = '1rem'
            preElement.style.borderRadius = '5px'
            preElement.style.whiteSpace = 'pre-wrap'
            preElement.style.overflowWrap = 'break-word'
        }

        let content = codeBlock.innerHTML
        content = content.replace(templVars, (_match, innerContent) => {
            return `\${<span style="color: ${blue}">${innerContent}</span>}`
        })

        content = content.replace(combinedPattern, (match, keywords, numbers, functions, xmlTags, comments, blockComments, regx, strings) => {
            if (keywords) return `<span style="color: ${blue};">${keywords}</span>`
            if (numbers) return `<span style="color: ${green}">${numbers}</span>`
            if (functions) return `<span style="color: ${blue};">${functions}</span>`
            if (xmlTags) return `<span style="color: ${blue};">${xmlTags}</span>`
            if (comments) return `<span style="color: ${grey};">${comments}</span>`
            if (blockComments) return `<span style="color: ${grey};">${blockComments}</span>`
            if (regx) return `<span style="color: ${grey};">${regx}</span>`
            if (strings) return `<span style="color: ${pink}">${strings}</span>`
            return match
        })

        codeBlock.innerHTML = content
    })
}

document.addEventListener('DOMContentLoaded', () => {
    highlightSyntax()
}, { once: true })
