import { FC, useRef, useState, useEffect } from 'react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import React from 'react';
import { FlexBox } from '../../primitives';
// Import syntax highlighting for TypeScript
import 'monaco-editor/esm/vs/basic-languages/typescript/typescript.contribution';

export const Scripting: FC = () => {
    const [__, setEditor] = useState<monaco.editor.IStandaloneCodeEditor | null>(null);
    const monacoEl = useRef(null);

    useEffect(() => {
        if (monacoEl.current) {
            const newEditor = monaco.editor.create(monacoEl.current, {
                value: '// Example TypeScript code with syntax highlighting\nfunction greet(name: string): string {\n  return `Hello, ${name}!`;\n}\n\nconst result = greet("World");\nconsole.log(result);',
                language: 'typescript',
                minimap: { enabled: false },
                automaticLayout: true,
                theme: 'vs-dark', // Use dark theme for better syntax highlighting
                renderValidationDecorations: 'on'
            });

            setEditor(newEditor);

            return () => newEditor.dispose();
        }
        return undefined;
    }, []);

    return <FlexBox $fill={true} ref={monacoEl} />
};