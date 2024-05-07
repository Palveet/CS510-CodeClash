import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";

const CodeEditorWindow = ({ onChange, language, code, theme, model }) => {
  const [value, setValue] = useState(code || "");
  const [currentModel, setCurrentModel] = useState(model);

  useEffect(() => {
    setValue(code || "");
  }, [code]);

  const handleEditorChange = (value, event) => {
    setValue(value);
    onChange("code", value, currentModel); 
  };

  const handleModelChange = (model) => {
    setCurrentModel(model);
  };

  return (
    <div className="overlay rounded-md overflow-hidden w-full h-full shadow-4xl">
      <Editor
        height="85vh"
        width="100%"
        language={language || "javascript"}
        value={value}
        theme={theme}
        model={currentModel}
        onChange={handleEditorChange}
        onMount={() => handleModelChange(model)} 
      />
    </div>
  );
};

export default CodeEditorWindow;
