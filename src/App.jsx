import React, { useState, useEffect } from "react";
import { Search, Star, ChevronDown, BookMarked, Smile } from "lucide-react";

const LANGUAGE_COLORS = {
  JavaScript: "#f1e05a",
  CSS: "#563d7c",
  HTML: "#e34c26",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  Dart: "#00B4AB",
};

export default function GithubProfile() {
  const username = "RozimboyYakubov"; // Sening GitHub username'ing

  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState([]);
  const [orgs, setOrgs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLang, setSelectedLang] = useState("All");
  const [sortBy, setSortBy] = useState("updated");
  const [starredIds, setStarredIds] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGithubData = async () => {
      try {
        const [userRes, reposRes, orgsRes] = await Promise.all([
          fetch(`https://api.github.com/users/${username}`),
          fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`),
          fetch(`https://api.github.com/users/${username}/orgs`),
        ]);

        const userData = await userRes.json();
        const reposData = await reposRes.json();
        const orgsData = await orgsRes.json();

        setProfile(userData);
        setRepos(Array.isArray(reposData) ? reposData : []);
        setOrgs(Array.isArray(orgsData) ? orgsData : []);
      } catch (error) {
        console.error("GitHub ma'lumotlarini yuklashda xatolik:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGithubData();
  }, [username]);

  // Vaqtni "Updated 2 days ago" formatiga o'tkazish
  const formatTimeAgo = (dateString) => {
    const diff = Math.floor((new Date() - new Date(dateString)) / 1000);
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    const days = Math.floor(diff / 86400);
    if (days === 1) return "yesterday";
    if (days < 7) return `${days} days ago`;
    const weeks = Math.floor(days / 7);
    if (weeks === 1) return "last week";
    if (weeks < 5) return `${weeks} weeks ago`;
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const toggleStar = (id) => {
    setStarredIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Qidiruv va filterlash
  const filteredRepos = repos
    .filter((repo) =>
      repo.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((repo) =>
      selectedLang === "All" ? true : repo.language === selectedLang
    )
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return new Date(b.updated_at) - new Date(a.updated_at);
    });

  const languages = [
    "All",
    ...new Set(repos.map((r) => r.language).filter(Boolean)),
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] flex items-center justify-center">
        <div className="animate-pulse text-lg font-medium">
          GitHub ma'lumotlari yuklanmoqda...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] font-sans py-8 px-4 sm:px-8">
      <div className="max-w-[1216px] mx-auto flex flex-col md:flex-row gap-8">
        
        {/* CHAP TOMON: Profil paneli */}
        <aside className="w-full md:w-[296px] flex-shrink-0">
          <div className="relative w-[260px] h-[260px] md:w-[296px] md:h-[296px] mx-auto md:mx-0">
            <img
              src={profile?.avatar_url}
              alt={profile?.login}
              className="w-full h-full rounded-full border border-[#30363d] object-cover bg-[#161b22]"
            />
            <button
              title="Set status"
              className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-[#161b22] border border-[#30363d] flex items-center justify-center text-[#8b949e] hover:text-[#58a6ff] shadow-md transition"
            >
              <Smile size={18} />
            </button>
          </div>

          <div className="py-4">
            <h1 className="text-[24px] font-bold text-[#f0f6fc] leading-tight">
              {profile?.name || "yakubov"}
            </h1>
            <p className="text-[20px] font-light text-[#8b949e] leading-snug">
              {profile?.login || username}
            </p>
          </div>

          {profile?.bio && (
            <p className="text-[14px] text-[#c9d1d9] mb-4">{profile.bio}</p>
          )}

          <a
            href={profile?.html_url}
            target="_blank"
            rel="noreferrer"
            className="block w-full text-center py-[5px] px-4 text-[14px] font-medium text-[#c9d1d9] bg-[#21262d] hover:bg-[#30363d] border border-[#363b42] hover:border-[#8b949e] rounded-md transition"
          >
            Edit profile
          </a>

          {/* Organizations qismi */}
          <div className="mt-6 pt-4 border-t border-[#21262d]">
            <h2 className="text-[16px] font-semibold text-[#f0f6fc] mb-2">
              Organizations
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {orgs.length > 0 ? (
                orgs.map((org) => (
                  <a
                    key={org.id}
                    href={`https://github.com/${org.login}`}
                    target="_blank"
                    rel="noreferrer"
                    title={org.login}
                  >
                    <img
                      src={org.avatar_url}
                      alt={org.login}
                      className="w-8 h-8 rounded-md border border-[#30363d]"
                    />
                  </a>
                ))
              ) : (
                // Agar API orqali orgs yopiq bo'lsa, rasmdagidek namuna iconlar
                ["#3fb950", "#56d364", "#d29922", "#e3b341", "#f778ba"].map(
                  (color, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-md border border-[#30363d] bg-[#161b22] flex items-center justify-center"
                    >
                      <div
                        className="w-5 h-5 rounded-sm"
                        style={{ backgroundColor: color }}
                      />
                    </div>
                  )
                )
              )}
            </div>
          </div>
        </aside>

        {/* O'NG TOMON: Repository'lar ro'yxati */}
        <main className="flex-1 min-w-0">
          {/* Qidiruv va Filter paneli */}
          <div className="pb-4 border-b border-[#21262d] flex flex-col lg:flex-row gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Find a repository..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0d1117] border border-[#30363d] focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] rounded-md py-[5px] px-3 text-[14px] text-[#c9d1d9] placeholder-[#8b949e] outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Type tugmasi */}
              <button className="flex items-center gap-1.5 px-3 py-[5px] text-[14px] font-medium bg-[#21262d] hover:bg-[#30363d] border border-[#363b42] rounded-md text-[#c9d1d9] transition">
                <span>Type</span>
                <ChevronDown size={14} className="text-[#8b949e]" />
              </button>

              {/* Language select */}
              <div className="relative">
                <select
                  value={selectedLang}
                  onChange={(e) => setSelectedLang(e.target.value)}
                  className="appearance-none bg-[#21262d] hover:bg-[#30363d] border border-[#363b42] rounded-md py-[5px] pl-3 pr-8 text-[14px] font-medium text-[#c9d1d9] cursor-pointer outline-none"
                >
                  {languages.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang === "All" ? "Language" : lang}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="text-[#8b949e] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                />
              </div>

              {/* Sort select */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-[#21262d] hover:bg-[#30363d] border border-[#363b42] rounded-md py-[5px] pl-3 pr-8 text-[14px] font-medium text-[#c9d1d9] cursor-pointer outline-none"
                >
                  <option value="updated">Sort: Last updated</option>
                  <option value="name">Sort: Name</option>
                </select>
                <ChevronDown
                  size={14}
                  className="text-[#8b949e] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                />
              </div>

              {/* Yashil New tugmasi */}
              <a
                href="https://github.com/new"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-[5px] text-[14px] font-medium bg-[#238636] hover:bg-[#2ea043] border border-[#2ea043] rounded-md text-white transition"
              >
                <BookMarked size={16} />
                <span>New</span>
              </a>
            </div>
          </div>

          {/* Repository ro'yxati */}
          <div className="divide-y divide-[#21262d]">
            {filteredRepos.length === 0 ? (
              <div className="py-12 text-center text-[#8b949e]">
                Hech qanday repository topilmadi.
              </div>
            ) : (
              filteredRepos.map((repo) => {
                const isStarred = !!starredIds[repo.id];
                const langColor = LANGUAGE_COLORS[repo.language] || "#8b949e";

                return (
                  <div
                    key={repo.id}
                    className="py-6 flex items-center justify-between gap-4"
                  >
                    {/* Chap qism: Nomi, Public badge, Til va vaqt */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <a
                          href={repo.html_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[20px] font-semibold text-[#58a6ff] hover:underline break-all"
                        >
                          {repo.name}
                        </a>
                        <span className="px-2 py-[1px] text-[12px] font-medium text-[#8b949e] border border-[#30363d] rounded-full">
                          {repo.private ? "Private" : "Public"}
                        </span>
                      </div>

                      {repo.description && (
                        <p className="text-[14px] text-[#8b949e] mt-1 max-w-2xl">
                          {repo.description}
                        </p>
                      )}

                      <div className="flex items-center gap-4 mt-3 text-[12px] text-[#8b949e]">
                        {repo.language && (
                          <span className="flex items-center gap-1.5">
                            <span
                              className="w-3 h-3 rounded-full inline-block"
                              style={{ backgroundColor: langColor }}
                            />
                            {repo.language}
                          </span>
                        )}
                        <span>Updated {formatTimeAgo(repo.updated_at)}</span>
                      </div>
                    </div>

                    {/* O'ng qism: Star tugmasi va yashil aktivlik chizig'i */}
                    <div className="flex flex-col items-end gap-4 flex-shrink-0">
                      <div className="inline-flex rounded-md shadow-sm">
                        <button
                          onClick={() => toggleStar(repo.id)}
                          className="flex items-center gap-1.5 px-3 py-[3px] text-[12px] font-medium bg-[#21262d] hover:bg-[#30363d] border border-[#363b42] rounded-l-md text-[#c9d1d9] transition"
                        >
                          <Star
                            size={14}
                            className={
                              isStarred
                                ? "fill-[#e3b341] text-[#e3b341]"
                                : "text-[#8b949e]"
                            }
                          />
                          <span>{isStarred ? "Starred" : "Star"}</span>
                        </button>
                        <button className="px-2 py-[3px] bg-[#21262d] hover:bg-[#30363d] border-y border-r border-[#363b42] rounded-r-md text-[#8b949e] transition">
                          <ChevronDown size={12} />
                        </button>
                      </div>

                      {/* O'ng pastdagi yashil commit grafik chizig'i */}
                      <svg
                        width="155"
                        height="20"
                        viewBox="0 0 155 20"
                        className="hidden sm:block opacity-80"
                      >
                        <path
                          d="M0 17 L65 17 L72 13 L80 17 L110 17 L118 11 L126 17 L155 17"
                          fill="none"
                          stroke="#2ea043"
                          strokeWidth="1.5"
                        />
                      </svg>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </main>
      </div>
    </div>
  );
}