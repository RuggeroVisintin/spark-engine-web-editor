import { FC, useRef, useState, useEffect } from 'react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import React from 'react';
import { FlexBox } from '../../primitives';

export const Scripting: FC = () => {
    const [__, setEditor] = useState<monaco.editor.IStandaloneCodeEditor | null>(null);
    const monacoEl = useRef(null);

    useEffect(() => {
        if (monacoEl.current) {
            const newEditor = monaco.editor.create(monacoEl.current, {
                value: '',
                language: 'typescript',
                minimap: { enabled: false },
                automaticLayout: true,
                renderValidationDecorations: 'on',
            });

            setEditor(newEditor);

            return () => newEditor.dispose();
        }
        return undefined;
    }, []);

    return <FlexBox $fill={true} ref={monacoEl} />
};