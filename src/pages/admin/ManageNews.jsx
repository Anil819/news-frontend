import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Newspaper,
  CalendarDays,
  Image,
  Megaphone,
  Users,
  MessageSquare,
  Settings,
  LogOut,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";

const categories = [
  "Academics",
  "Events",
  "Placements",
  "Campus",
  "Announcements",
  "Sports",
];

const emptyForm = {
  title: "",
  excerpt: "",
  content: "",
  category: "Campus",
  image: "",
  status: "Published",
};

export default function ManageNews() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchNews = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/news", {
        params: { limit: 50, includeUnpublished: true },
      });
      setNews(data.news);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load news.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  
  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await api.post("/news", form);
      setForm(emptyForm);
      setShowForm(false);
      fetchNews();
    } catch (err) {
      setError(err.response?.data?.message || "Could not create news article.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this news article? This cannot be undone."))
      return;
    setDeletingId(id);
    try {
      await api.delete(`/news/${id}`);
      setNews((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete this article.");
    } finally {
      setDeletingId(null);
    }
  };
  const handleImageUpload = async (file) => {
    const formData = new FormData();

    formData.append("image", file);

    const { data } = await api.post("/ai/generate-description", formData);

    setForm({
      ...form,
      excerpt: data.description,
    });
  };

  const navItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      onClick: () => navigate("/admin/dashboard"),
    },
    { icon: Newspaper, label: "News Management", active: true },
    {
      icon: CalendarDays,
      label: "Events Management",
      onClick: () => navigate("/admin/events"),
    },
    {
      icon: Image,
      label: "Gallery Management",
      onClick: () => navigate("/admin/gallery"),
    },
    {
      icon: Megaphone,
      label: "Notices",
      onClick: () => navigate("/admin/notices"),
    },
    {
      icon: Users,
      label: "User Management",
      onClick: () => navigate("/admin/users"),
    },
    {
      icon: MessageSquare,
      label: "Messages",
      onClick: () => navigate("/admin/messages"),
    },
    { icon: Settings, label: "Settings" },
    { icon: LogOut, label: "Logout", onClick: handleLogout },
  ];

  return (
    <DashboardLayout
      navItems={navItems}
      userName={user?.name || "Admin User"}
      userRole="Administrator"
      pageTitle="News Management"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{news.length} article(s) total</p>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? "Cancel" : "Add News"}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4"
        >
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            placeholder="Title"
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="excerpt"
            value={form.excerpt}
            onChange={handleChange}
            required
            placeholder="Short excerpt (shown in listings)"
            maxLength={300}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            required
            rows={4}
            placeholder="Full article content"
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e.target.files[0])}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm"
          />
          <div className="grid sm:grid-cols-2 gap-4">
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            {submitting ? "Saving..." : "Publish Article"}
          </button>
        </form>
      )}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-100">
                <th className="px-5 py-3 font-medium">Title</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Author</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-6 text-center text-gray-400"
                  >
                    Loading...
                  </td>
                </tr>
              )}
              {!loading && news.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-6 text-center text-gray-400"
                  >
                    No news articles yet.
                  </td>
                </tr>
              )}
              {!loading &&
                news.map((n) => (
                  <tr
                    key={n._id}
                    className="border-b border-gray-50 last:border-0"
                  >
                    <td className="px-5 py-3 text-gray-900">{n.title}</td>
                    <td className="px-5 py-3 text-gray-500">{n.category}</td>
                    <td className="px-5 py-3 text-gray-500">
                      {n.author?.name || "—"}
                    </td>
                    <td className="px-5 py-3 text-gray-500">
                      {new Date(n.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                          n.status === "Published"
                            ? "bg-green-50 text-green-600"
                            : "bg-amber-50 text-amber-600"
                        }`}
                      >
                        {n.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => handleDelete(n._id)}
                        disabled={deletingId === n._id}
                        className="text-red-500 hover:text-red-700 disabled:opacity-50 inline-flex items-center gap-1"
                      >
                        <Trash2 size={14} />
                        {deletingId === n._id ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
