import { FC, useRef, useState, useEffect } from 'react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import React from 'react';
import { FlexBox } from '../../primitives';
// Import required Monaco editor features
import 'monaco-editor/esm/vs/basic-languages/typescript/typescript.contribution';
import 'monaco-editor/esm/vs/language/typescript/monaco.contribution';

export const Scripting: FC = () => {
    const [__, setEditor] = useState<monaco.editor.IStandaloneCodeEditor | null>(null);
    const monacoEl = useRef(null);

    useEffect(() => {
        if (monacoEl.current) {
            // Create the editor
            const newEditor = monaco.editor.create(monacoEl.current, {
                value: '// Type some code with errors to see highlighting\nlet x: string = 5;',
                language: 'typescript',
                minimap: { enabled: false },
                automaticLayout: true,
                formatOnPaste: true,
                formatOnType: true,
                renderValidationDecorations: 'on',
                quickSuggestions: true,
                suggestOnTriggerCharacters: true,
            });
            
            // Get the model
            const model = newEditor.getModel();
            
            // Add markers to show errors
            if (model) {
                monaco.editor.setModelMarkers(model, 'typescript', [{
                    startLineNumber: 2,
                    startColumn: 1,
                    endLineNumber: 2,
                    endColumn: 20,
                    message: 'Type number is not assignable to type string',
                    severity: monaco.MarkerSeverity.Error
                }]);
            }

            setEditor(newEditor);

            return () => newEditor.dispose();
        }

        return;
    }, []);

    return <FlexBox $fill={true} ref={monacoEl} />
};