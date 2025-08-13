import { useState, useEffect } from 'react';

export default function App() {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [adminData, setAdminData] = useState([]);

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await fetch('http://localhost:5001/api/shorten', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: longUrl })
    });
    const data = await res.json();
    setShortUrl(data.shortUrl);
    setLongUrl('');
    fetchAdminData();
  };

  const fetchAdminData = async () => {
    const res = await fetch('http://localhost:5001/api/admin');
    const data = await res.json();
    setAdminData(data);
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl);
    alert('Copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">URL Shortener</h1>
        
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="url"
            value={longUrl}
            onChange={e => setLongUrl(e.target.value)}
            placeholder="Enter long URL"
            required
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-5 py-2"
          >
            Shorten
          </button>
        </form>

        {shortUrl && (
          <div className="mt-4 p-3 bg-green-50 border border-green-300 rounded-lg flex items-center justify-between">
            <a href={shortUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">{shortUrl}</a>
            <button onClick={copyToClipboard} className="text-sm text-gray-500 hover:text-gray-700">📋 Copy</button>
          </div>
        )}
      </div>

      {/* Admin Table */}
      <div className="mt-10 bg-white shadow-lg rounded-xl p-6 w-full max-w-4xl">
        <h2 className="text-xl font-semibold mb-4">Admin Panel</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">Short Code</th>
                <th className="px-4 py-2 border">Original URL</th>
                <th className="px-4 py-2 border">Visits</th>
              </tr>
            </thead>
            <tbody>
              {adminData.map(url => (
                <tr key={url._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{url.shortCode}</td>
                  <td className="px-4 py-2 border text-blue-600 break-all">{url.originalUrl}</td>
                  <td className="px-4 py-2 border text-center">{url.visits}</td>
                </tr>
              ))}
              {adminData.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center text-gray-500 py-4">No URLs shortened yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
