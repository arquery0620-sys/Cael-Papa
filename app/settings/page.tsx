"use client";

import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [persona, setPersona] = useState("");
  const [model, setModel] = useState("gpt-5.5-Free");
  const [replyLength, setReplyLength] = useState("normal");
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    const savedPersona =
      localStorage.getItem("persona") || "";

    const savedModel =
      localStorage.getItem("model") ||
      "gpt-5.5-Free";

    const savedReplyLength =
      localStorage.getItem("replyLength") ||
      "normal";

    const savedApiKey =
      localStorage.getItem("apiKey") || "";

    setPersona(savedPersona);
    setModel(savedModel);
    setReplyLength(savedReplyLength);
    setApiKey(savedApiKey);
  }, []);

  const saveSettings = () => {
    localStorage.setItem("persona", persona);
    localStorage.setItem("model", model);
    localStorage.setItem(
      "replyLength",
      replyLength
    );
    localStorage.setItem("apiKey", apiKey);

    alert("保存成功 ✨");
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] p-6">
      <div className="max-w-2xl mx-auto">
        <a
          href="/"
          className="text-sm text-[#c4a882]"
        >
          ← 返回首页
        </a>

        <h1 className="text-3xl mt-4 mb-8">
          ⚙️ Settings
        </h1>

        <div className="bg-white rounded-2xl p-5 border border-[#eee] mb-4">
          <h2 className="mb-3 font-medium">
            Persona
          </h2>

          <textarea
            value={persona}
            onChange={(e) =>
              setPersona(e.target.value)
            }
            placeholder="输入你的 AI 人设..."
            className="w-full border rounded-xl p-3 min-h-[180px]"
          />
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#eee] mb-4">
          <h2 className="mb-3 font-medium">
            Model
          </h2>

          <select
            value={model}
            onChange={(e) =>
              setModel(e.target.value)
            }
            className="w-full border rounded-xl p-3"
          >
            <option value="gpt-5.5-Free">
              GPT-5.5
            </option>

            <option value="claude">
              Claude
            </option>

            <option value="gemini">
              Gemini
            </option>
          </select>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#eee] mb-4">
          <h2 className="mb-3 font-medium">
            Reply Length
          </h2>

          <select
            value={replyLength}
            onChange={(e) =>
              setReplyLength(
                e.target.value
              )
            }
            className="w-full border rounded-xl p-3"
          >
            <option value="short">
              简短
            </option>

            <option value="normal">
              普通
            </option>

            <option value="long">
              详细
            </option>
          </select>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#eee] mb-6">
          <h2 className="mb-3 font-medium">
            API Key
          </h2>

          <input
            type="password"
            value={apiKey}
            onChange={(e) =>
              setApiKey(e.target.value)
            }
            placeholder="sk-..."
            className="w-full border rounded-xl p-3"
          />
        </div>

        <button
          onClick={saveSettings}
          className="w-full bg-[#c4a882] text-white py-3 rounded-2xl"
        >
          保存设置
        </button>
      </div>
    </div>
  );
}
