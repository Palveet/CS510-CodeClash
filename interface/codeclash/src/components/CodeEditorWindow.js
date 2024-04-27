import React, { useState } from "react";

import Editor from "@monaco-editor/react";

const CodeEditorWindow = ({ onChange, language, code, theme,model }) => {
  const [value, setValue] = useState(code || "");
  const [llm, setModel] = useState(model);

  const handleEditorChange = (value) => {
    setValue(value);
    setModel(model);
    onChange('code',value, llm);
  };

  return (
    <div className="overlay rounded-md overflow-hidden w-full h-full shadow-4xl">
      <Editor
        height="85vh"
        width={`100%`}
        language={language || "javascript"}
        value={value}
        theme={theme}
        model = {llm}
        defaultValue="// some comment"
        onChange={handleEditorChange}
      />
    </div>
  );
};
export default CodeEditorWindow;
