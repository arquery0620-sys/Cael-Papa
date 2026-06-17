export default function SettingsPage() {
  return (
    <main
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "40px 20px",
      }}
    >
      <h1 style={{ fontSize: "32px", marginBottom: "30px" }}>
        ⚙️ Settings
      </h1>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "12px",
          padding: "20px",
          marginBottom: "20px",
        }}
      >
        <h2>Persona</h2>

        <textarea
          placeholder="输入你的 AI 人设..."
          style={{
            width: "100%",
            minHeight: "150px",
            marginTop: "10px",
            padding: "10px",
          }}
        />
      </div>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "12px",
          padding: "20px",
          marginBottom: "20px",
        }}
      >
        <h2>Model</h2>

        <select
          style={{
            padding: "10px",
            marginTop: "10px",
          }}
        >
          <option>GPT-5.5</option>
          <option>Claude</option>
          <option>Gemini</option>
        </select>
      </div>

      <button
        style={{
          padding: "12px 24px",
          borderRadius: "10px",
          cursor: "pointer",
        }}
      >
        Save
      </button>
    </main>
  );
}
