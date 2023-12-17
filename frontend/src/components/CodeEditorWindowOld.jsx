import Editor from '@monaco-editor/react';
import { useRef, useState } from 'react';
import { LiveProvider, LiveError, LivePreview } from "react-live";


const CodeEditorWindow = ({ code }) => {

    function handleEditorChange(value, event) {
        console.log('here is the current model value:', value);
    }

    return (
        <div className="grid grid-cols-2">
            <Editor
                defaultLanguage="javascript"
                defaultValue={code.trim()}
                theme='vs-dark'
                options={{
                    fontSize: 18,
                    minimap: {
                        enabled: false,
                    },
                    wordWrap: 'on',
                    contextmenu: false,
                }}
                onChange={handleEditorChange}
            />
            <div className='h-screen w-full bg-green px-2 py-10'>
                <LiveProvider code={code}>
                    {/* <LiveError /> */}
                    <LivePreview />
                </LiveProvider>;
            </div>
        </div>
    )
}

export default CodeEditorWindow