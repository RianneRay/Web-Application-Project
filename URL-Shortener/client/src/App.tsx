import { useState } from "react";
import axios from "axios";
import { Copy, CheckCircle, Loader2 } from "lucide-react";

function App() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setCopied(false);
    setError("");
    setShortUrl("");

    try {
      const response = await axios.post("http://localhost:5000/api/shorten", {
        originalUrl,
      });
      setShortUrl(response.data.shortUrl);
    } catch {
      setError("Invalid URL or server error.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-slate-100 to-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-3xl p-8 space-y-6 transition-all">
        <h1 className="text-center text-3xl font-semibold text-gray-800">
          🔗 Shorten Your URL
        </h1>

        <form onSubmit={handleShorten} className="flex flex-col gap-4">
          <input
            type="url"
            required
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            placeholder="Paste your long URL"
            className="px-4 py-3 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition flex justify-center items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Shortening...
              </>
            ) : (
              "Shorten URL"
            )}
          </button>
        </form>

        {error && (
          <p className="text-sm text-red-600 text-center animate-pulse">
            {error}
          </p>
        )}

        {shortUrl && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-3 text-center shadow-inner">
            <p className="text-gray-500 text-sm">Shortened Link</p>
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 break-words hover:underline text-base font-medium"
            >
              {shortUrl}
            </a>
            <button
              onClick={handleCopy}
              className="mt-2 inline-flex items-center gap-2 text-sm bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
            >
              {copied ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Link
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;