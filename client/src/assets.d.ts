/**
 * Declaração de tipos para importação de assets (imagens).
 * Isso permite que o TypeScript entenda `import logo from './logo.png';`
 */

declare module '*.png' {
    const value: string;
    export default value;
}
declare module '*.jpg' {
    const value: string;
    export default value;
}

declare module '*.svg' {
    const value: string;
    export default value;
}

declare module '*.gif' {
    const value: string;
    export default value;
}

declare module '*.webp' {
    const value: string;
    export default value;
}