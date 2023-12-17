import React, { useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import ACTIONS from '../services/Actions';

const CodePlayground = ({ socketRef, roomId, onCodeChange }) => {
    const playgroundRef = useRef(`console.log('Hello World');`);

    const handleCodeChange = (newCode) => {

        // Update the playgroundRef value
        playgroundRef.current = newCode;

        // Emit the updated code to all clients
        socketRef.current.emit(ACTIONS.CODE_CHANGE, {
            roomId,
            code: newCode,
        });
    };

    useEffect(() => {
        if (socketRef.current) {
            // Listen for code changes from the server
            socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
                if (code !== null) {
                    playgroundRef.current = code
                }
            });
        }

        return () => {
            socketRef.current.off(ACTIONS.CODE_CHANGE);
        }
    }, [socketRef.current]);


    const handleEditorDidMount = (editor, monaco) => {
        // Listen for various editor events
        editor.onDidChangeModelContent((event) => {
            const newCode = editor.getValue();

            // sync code for new user on first load
            onCodeChange(newCode);

            handleCodeChange(newCode);
        });
    };

    return (
        <div>
            {/* Code Editor */}
            <Editor
                height="100vh"
                defaultLanguage="javascript"
                value={playgroundRef.current}
                theme="vs-dark"
                options={{
                    fontSize: 18,
                    minimap: {
                        enabled: false,
                    },
                    wordWrap: 'on',
                    contextmenu: false,
                }}
                onMount={handleEditorDidMount}
            />
        </div>
    );
};

export default CodePlayground;
