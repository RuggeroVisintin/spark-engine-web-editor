import { FC, useRef, useState, useEffect } from 'react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import React from 'react';
import { BackgroundColor, Box, FlexBox, TextColor } from '../../primitives';
import { Linter } from "eslint-linter-browserify";
import eslint from "@eslint/js";
import globals from "globals/globals.json";
// Import only basic TypeScript syntax highlighting
import 'monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution';
import { PopupMenu } from '../../components/PopupMenu';
import { ScriptEditorService } from '../../core/scripting/application';
import { EventBusWithBrowserBroadcast } from '../../core/scripting/infrastructure';
import { useOnInit } from '../../hooks';

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
    const bc = new BroadcastChannel("scripting");

    useOnInit(() => {
        const scriptingEditorService = new ScriptEditorService(
            new EventBusWithBrowserBroadcast("scripting"),
            'test-entity-uuid'
        );
    });


    // TODO -- introduce application state based to set the current value of the script
    useEffect(() => {
        if (monacoEl.current) {
            const defaultValue = '// Write your code here';

            const newEditor = monaco.editor.create(monacoEl.current, {
                value: defaultValue,
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
                    }, 300);
                });
            }

            setEditor(newEditor);

            return () => newEditor.dispose();
        }
        return undefined;
    }, []);

    return <FlexBox $fill={true} data-testid="ScriptingPage">
        <FlexBox style={{ height: '40px', background: BackgroundColor.Primary, borderBottom: `1px solid ${TextColor.Primary}` }}
            $direction='row'>
            <PopupMenu
                data-testid="action-menu.file"
                label="Save"
                action={() => {
                    console.log('Send Message to BroadcastChannel');
                    bc.postMessage('test-message');
                }}
            />
        </FlexBox>
        <FlexBox $fill={true} ref={monacoEl} />
    </FlexBox>;
};