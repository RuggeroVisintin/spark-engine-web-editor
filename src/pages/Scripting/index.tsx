import { FC, useRef, useState, useEffect } from 'react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import React from 'react';
import { FlexBox } from '../../primitives';
import { Linter } from "eslint-linter-browserify";
import eslint from "@eslint/js";
import globals from "globals/globals.json";
// Import only basic TypeScript syntax highlighting
import 'monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution';

const loadESLintConfig = async (editor: monaco.editor.IStandaloneCodeEditor) => {
    const linter = new Linter({
        configType: 'flat'
    });

    const results = linter.verify(editor.getValue(), [eslint.configs.recommended, {
        languageOptions: {
            globals: {
                ...globals.browser
            }
        },
        rules: {
            camelcase: "error",
            "default-case-last": "error",
            curly: ["error", "multi-line"],
            "default-param-last": "error",
            eqeqeq: "error",
            "no-eval": "error",
            "no-implied-eval": "error",
        },
    }]);
    const markers: monaco.editor.IMarkerData[] = results.map(result => ({
        severity: result.severity === 2 ? monaco.MarkerSeverity.Error : monaco.MarkerSeverity.Warning,
        startLineNumber: result.line,
        startColumn: result.column,
        endLineNumber: result.endLine || result.line,
        endColumn: result.endColumn || result.column,
        message: result.message,
        source: 'ESLint',
    }));

    console.log('ESLint results:', results);

    // Set markers for the current model
    const model = editor.getModel();
    if (model) {
        monaco.editor.setModelMarkers(model, 'eslint', markers);
    }
};

export const Scripting: FC = () => {
    const [__, setEditor] = useState<monaco.editor.IStandaloneCodeEditor | null>(null);
    const monacoEl = useRef(null);

    useEffect(() => {
        if (monacoEl.current) {
            const newEditor = monaco.editor.create(monacoEl.current, {
                value: '// Example code with various ESLint issues\nfunction greet(name) {\n  const greeting = "Hello" // Missing semicolon\n  return greeting + ", " + name + "!"\n}\n\nconst result = greet("World") // Double quotes and missing semicolon\nconsole.log(result) // Console statement and missing semicolon',
                language: 'javascript',
                minimap: { enabled: false },
                automaticLayout: true,
                theme: 'vs-dark',
                renderValidationDecorations: 'on',
            });

            // Load ESLint config and apply syntax highlighting
            loadESLintConfig(newEditor);

            // Update highlighting when content changes
            const model = newEditor.getModel();
            if (model) {
                model.onDidChangeContent(() => {
                    // Debounce the linting to avoid performance issues
                    setTimeout(() => {
                        loadESLintConfig(newEditor);
                    }, 500);
                });
            }

            setEditor(newEditor);

            return () => newEditor.dispose();
        }
        return undefined;
    }, []);

    return <FlexBox $fill={true} ref={monacoEl} data-testid="ScriptingPage" />
};