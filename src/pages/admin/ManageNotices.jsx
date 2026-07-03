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

const emptyForm = {
  title: "",
  message: "",
  audience: "All",
  priority: "Normal",
  image: "",
};

export default function ManageNotices() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  const fetchNotices = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/notices");
      setNotices(data.notices);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load notices.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));

    try {
      const formData = new FormData();
      formData.append("image", file);

      const { data } = await api.post("/ai/generate-description", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setForm((prev) => ({
        ...prev,
        message: data.description,
      }));
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message || "Failed to generate AI description.",
      );
    }
  };

  const generateDescription = async (file) => {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const { data } = await api.post(
      "/ai/generate-description",
      formData
    );

    setForm((prev) => ({
      ...prev,
      message: data.description,
    }));
  } catch (err) {
    console.log(err.response?.data || err.message);
  }
};
  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const noticeData = { ...form };

      // Upload image to Cloudinary
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);

        const { data } = await api.post("/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        noticeData.image = data.url;
      }

      // Save notice in database
      await api.post("/notices", noticeData);

      setForm(emptyForm);
      setImageFile(null);
      setImagePreview("");
      setShowForm(false);

      fetchNotices();
    } catch (err) {
      setError(err.response?.data?.message || "Could not create notice.");
    } finally {
      setSubmitting(false);
    }
  };
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this notice? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await api.delete(`/notices/${id}`);
      setNotices((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete this notice.");
    } finally {
      setDeletingId(null);
    }
  };

  const navItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      onClick: () => navigate("/admin/dashboard"),
    },
    {
      icon: Newspaper,
      label: "News Management",
      onClick: () => navigate("/admin/news"),
    },
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
    { icon: Megaphone, label: "Notices", active: true },
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

  const priorityBadge = {
    Urgent: "bg-red-50 text-red-600",
    Important: "bg-amber-50 text-amber-600",
    Normal: "bg-blue-50 text-blue-600",
  };

  return (
    <DashboardLayout
      navItems={navItems}
      userName={user?.name || "Admin User"}
      userRole="Administrator"
      pageTitle="Notices"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {notices.length} notice(s) total
        </p>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? "Cancel" : "Add Notice"}
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
            placeholder="Notice Title"
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            required
            rows={3}
            placeholder="Notice message"
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          <div className="grid sm:grid-cols-2 gap-4">
            <select
              name="audience"
              value={form.audience}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All (everyone)</option>
              <option value="Student">Students only</option>
              <option value="Teacher">Teachers only</option>
            </select>
            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Normal">Normal</option>
              <option value="Important">Important</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Image (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm"
            />
          </div>
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Notice preview"
              className="w-full h-44 object-cover rounded-lg"
            />
          )}
          {aiLoading && (
            <p className="text-blue-600 text-sm">
              🤖 AI is generating description...
            </p>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            {submitting ? "Posting..." : "Post Notice"}
          </button>
        </form>
      )}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-100">
                <th className="px-5 py-3 font-medium">Title</th>
                <th className="px-5 py-3 font-medium">Audience</th>
                <th className="px-5 py-3 font-medium">Priority</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-6 text-center text-gray-400"
                  >
                    Loading...
                  </td>
                </tr>
              )}
              {!loading && notices.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-6 text-center text-gray-400"
                  >
                    No notices yet.
                  </td>
                </tr>
              )}
              {!loading &&
                notices.map((n) => (
                  <tr
                    key={n._id}
                    className="border-b border-gray-50 last:border-0"
                  >
                    <td className="px-5 py-3 text-gray-900">{n.title}</td>
                    <td className="px-5 py-3 text-gray-500">{n.audience}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                          priorityBadge[n.priority] || priorityBadge.Normal
                        }`}
                      >
                        {n.priority}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-500">
                      {new Date(n.createdAt).toLocaleDateString()}
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
