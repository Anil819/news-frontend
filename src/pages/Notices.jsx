import { useEffect, useState } from "react";
import { Megaphone, AlertTriangle, Info } from "lucide-react";
import Breadcrumb from "../components/Breadcrumb";
import api from "../api/axios";

const priorityStyle = {
  Urgent: { badge: "bg-red-50 text-red-600", icon: AlertTriangle },
  Important: { badge: "bg-amber-50 text-amber-600", icon: Megaphone },
  Normal: { badge: "bg-blue-50 text-blue-600", icon: Info },
};

export default function Notices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
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
    fetchNotices();
  }, []);

  return (
    <div>
      <Breadcrumb
        title="Notices & Announcements"
        trail={[{ label: "Notices" }]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-4">
        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {loading && (
          <div className="text-center text-gray-400 text-sm py-12">
            Loading notices...
          </div>
        )}

        {!loading && notices.length === 0 && !error && (
          <div className="text-center text-gray-400 text-sm py-12">
            No notices right now.
          </div>
        )}

        {!loading &&
          notices.map((n) => {
            const style = priorityStyle[n.priority] || priorityStyle.Normal;
            const Icon = style.icon;
            return (
              <div
                key={n._id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4"
              >
                {n.image && (
                  <div className="space-y-3">
                    <div className="relative overflow-hidden rounded-lg">
                      <img
                        src={n.image}
                        alt={n.title}
                        className="w-full h-44 object-cover rounded-lg filter blur-sm scale-105"
                      />
                      <div className="absolute inset-0 bg-black/25 flex items-center justify-center text-xs font-semibold text-white uppercase tracking-[0.2em]">
                        Preview blurred — download to view full image
                      </div>
                    </div>
                    <a
                      href={n.image}
                      download
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      Download image
                    </a>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <div
                    className={`rounded-lg w-10 h-10 flex items-center justify-center flex-shrink-0 ${style.badge}`}
                  >
                    <Icon size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-3 mb-1">
                      <h3 className="font-semibold text-gray-900">{n.title}</h3>
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${style.badge}`}
                      >
                        {n.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">{n.message}</p>
                    <div className="text-xs text-gray-400 flex items-center gap-2">
                      <span>{n.audience} audience</span>
                      <span>•</span>
                      <span>
                        {new Date(n.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
