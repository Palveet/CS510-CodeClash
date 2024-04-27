import React, { useEffect, useState } from "react";
import CodeEditorWindow from "./CodeEditorWindow";
import axios from "axios";
import { classnames } from "../utils/general";
import { languageOptions } from "../constants/languageOptions";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { defineTheme } from "../lib/defineTheme";
import useKeyPress from "../hooks/useKeyPress";
import Footer from "./Footer";
import OutputWindow from "./OutputWindow";
import CustomInput from "./CustomInput";
import OutputDetails from "./OutputDetails";
import ThemeDropdown from "./ThemeDropdown";
import LanguagesDropdown from "./LanguagesDropdown";
import logo from "../code_clash_logo_navbar_resized.png"
const javascriptDefault = `
print('helloworld')
`;

const Landing = () => {
  const [codeGPT, setCodeGPT] = useState(javascriptDefault);
  const [codeGemini, setCodeGemini] = useState(javascriptDefault);
  const [customInput, setCustomInput] = useState("");
  const [outputDetailsGPT, setOutputDetailsGPT] = useState(null);
  const [outputDetailsGemini, setOutputDetailsGemini] = useState(null);
  const [processing, setProcessing] = useState(null);
  const [theme, setTheme] = useState("cobalt");
  const [language, setLanguage] = useState(languageOptions[0]);

  const enterPress = useKeyPress("Enter");
  const ctrlPress = useKeyPress("Control");

  const onSelectChange = (sl) => {
    console.log("selected Option...", sl);
    setLanguage(sl);
  };

  useEffect(() => {
    if (enterPress && ctrlPress) {
      console.log("enterPress", enterPress);
      console.log("ctrlPress", ctrlPress);
      //handleCompile();
      //handleCompileGemini();
    }
  }, [ctrlPress, enterPress]);
  const onChange = (action, data, model) => {
    switch (action) {
      case "code": {
        if (model === 'GPT') {
          setCodeGPT(data);
        }
        else if (model === 'Gemini') {
          setCodeGemini(data)
        }
        break;
      }
      default: {
        console.warn("case not handled!", action, data);
      }
    }
  };
  const handleCompile = () => {
    setProcessing(true);
    const formData = {
      language_id: language.id,
      // encode source code in base64
      source_code: btoa(codeGPT),
      stdin: btoa(customInput),
    };
    const options = {
      method: "POST",
      url: process.env.REACT_APP_RAPID_API_URL,
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "content-type": "application/json",
        "Content-Type": "application/json",
        "X-RapidAPI-Host": process.env.REACT_APP_RAPID_API_HOST,
        "X-RapidAPI-Key": process.env.REACT_APP_RAPID_API_KEY,
      },
      data: formData,
    };

    axios
      .request(options)
      .then(function (response) {
        console.log("res.data", response.data);
        const token = response.data.token;
        checkStatus(token, 'GPT');
      })
      .catch((err) => {
        let error = err.response ? err.response.data : err;
        // get error status
        let status = err.response.status;
        console.log("status", status);
        if (status === 429) {
          console.log("too many requests", status);

          showErrorToast(
            `Quota of 100 requests exceeded for the Day! Please read the blog on freeCodeCamp to learn how to setup your own RAPID API Judge0!`,
            10000
          );
        }
        setProcessing(false);
        console.log("catch block...", error);
      });
  };

  const handleCompileGemini = () => {
    // setProcessing(true);
    const formData = {
      language_id: language.id,
      // encode source code in base64
      source_code: btoa(codeGemini),
      stdin: btoa(customInput),
    };
    const options = {
      method: "POST",
      url: process.env.REACT_APP_RAPID_API_URL,
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "content-type": "application/json",
        "Content-Type": "application/json",
        "X-RapidAPI-Host": process.env.REACT_APP_RAPID_API_HOST,
        "X-RapidAPI-Key": process.env.REACT_APP_RAPID_API_KEY,
      },
      data: formData,
    };

    axios
      .request(options)
      .then(function (response) {
        console.log("res.data", response.data);
        const token = response.data.token;
        checkStatus(token, 'Gemini');
      })
      .catch((err) => {
        let error = err.response ? err.response.data : err;
        // get error status
        let status = err.response.status;
        console.log("status", status);
        if (status === 429) {
          console.log("too many requests", status);

          showErrorToast(
            `Quota of 100 requests exceeded for the Day! Please read the blog on freeCodeCamp to learn how to setup your own RAPID API Judge0!`,
            10000
          );
        }
        // setProcessing(false);
        console.log("catch block...", error);
      });
  };

  const checkStatus = async (token, model) => {
    const options = {
      method: "GET",
      url: process.env.REACT_APP_RAPID_API_URL + "/" + token,
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "X-RapidAPI-Host": process.env.REACT_APP_RAPID_API_HOST,
        "X-RapidAPI-Key": process.env.REACT_APP_RAPID_API_KEY,
      },
    };
    try {
      let response = await axios.request(options);
      let statusId = response.data.status?.id;

      // Processed - we have a result
      if (statusId === 1 || statusId === 2) {
        // still processing
        setTimeout(() => {
          checkStatus(token, model);
        }, 2000);
        return;
      } else {
        setProcessing(false);
        if (model === 'GPT') {
          setOutputDetailsGPT(response.data);
          console.log('setting gpt output');
          
        }
        if (model === 'Gemini') {
          setOutputDetailsGemini(response.data);
        }
        showSuccessToast(`Compiled Successfully!`);
        console.log(outputDetailsGPT);
        return;
      }
    } catch (err) {
      console.log("err", err);
      setProcessing(false);
      showErrorToast();
    }
  };

  function handleThemeChange(th) {
    const theme = th;
    console.log("theme...", theme);

    if (["light", "vs-dark"].includes(theme.value)) {
      setTheme(theme);
    } else {
      defineTheme(theme.value).then((_) => setTheme(theme));
    }
  }
  useEffect(() => {
    defineTheme("oceanic-next").then((_) =>
      setTheme({ value: "oceanic-next", label: "Oceanic Next" })
    );
  }, []);

  const showSuccessToast = (msg) => {
    toast.success(msg || `Compiled Successfully!`, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
  const showErrorToast = (msg, timer) => {
    toast.error(msg || `Something went wrong! Please try again.`, {
      position: "top-right",
      autoClose: timer ? timer : 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
  const [text, setText] = useState("");

  const handleChange = (event) => {
    setText(event.target.value);
  };
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className="h-15 w-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500">
      <img src={logo} alt="Brand" />
      </div>
      <div className="flex flex-row justify-center">
      <div>
      <textarea
        value={text}
        onChange={handleChange}
        placeholder="Enter your text here..."
        rows="4" // Number of rows
        cols="50" // Number of columns
      />
    </div>
      </div>
      <div className="flex flex-row justify-center">
        <div className="px-4 py-2">
          <LanguagesDropdown onSelectChange={onSelectChange} />
        </div>
        <div className="px-4 py-2">
          <ThemeDropdown handleThemeChange={handleThemeChange} theme={theme} />
        </div>
      </div>
      <div className="flex flex-row space-x-4 items-start px-4 py-4">
        <div className="flex flex-col w-full h-full">
          <CodeEditorWindow
            code={codeGPT}
            onChange={onChange}
            language={language?.value}
            theme={theme.value}
            model={'GPT'}
          />
          <div className="right-container flex flex-shrink-0 w-full flex-col">
            <OutputWindow outputDetails={outputDetailsGPT} />
            <div className="flex flex-col items-end">
              <CustomInput
                customInput={customInput}
                setCustomInput={setCustomInput}
              />
              <button
                onClick={handleCompile}
                disabled={!codeGPT}
                className={classnames(
                  "mt-4 border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 hover:shadow transition duration-200 bg-white flex-shrink-0",
                  !codeGPT ? "opacity-50" : ""
                )}
              >
                {processing ? "Processing..." : "Compile and Execute"}
              </button>
            </div>
            {outputDetailsGPT && <OutputDetails outputDetails={outputDetailsGPT} />}
          </div>
        </div>
        <div className="flex flex-col w-full h-full ">
          <CodeEditorWindow
            code={codeGemini}
            onChange={onChange}
            language={language?.value}
            theme={theme.value}
            model={'Gemini'}
          />
          <div className="right-container flex flex-shrink-0 w-full flex-col">
            <OutputWindow outputDetails={outputDetailsGemini} />
            <div className="flex flex-col items-end">
              <CustomInput
                customInput={customInput}
                setCustomInput={setCustomInput}
              />
              <button
                onClick={handleCompileGemini}
                disabled={!codeGemini}
                className={classnames(
                  "mt-4 border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 hover:shadow transition duration-200 bg-white flex-shrink-0",
                  !codeGemini ? "opacity-50" : ""
                )}
              >
                {processing ? "Processing..." : "Compile and Execute"}
              </button>
            </div>
            {outputDetailsGemini && <OutputDetails outputDetails={outputDetailsGemini} />}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
export default Landing;
