/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CompanyDetailsClient;
var react_1 = require("react");
var image_1 = require("next/image");
var companyService_1 = require("@/services/companyService");
var lucide_react_1 = require("lucide-react");
var link_1 = require("next/link");
var recharts_1 = require("recharts");
function CompanyDetailsClient(_a) {
    var _this = this;
    var _b, _c, _d, _e;
    var id = _a.id;
    var _f = (0, react_1.useState)(null), company = _f[0], setCompany = _f[1];
    var _g = (0, react_1.useState)([]), suggestedCompanies = _g[0], setSuggestedCompanies = _g[1];
    var _h = (0, react_1.useState)(true), isLoading = _h[0], setIsLoading = _h[1];
    var _j = (0, react_1.useState)(false), showFullAbout = _j[0], setShowFullAbout = _j[1];
    var _k = (0, react_1.useState)(null), selectedJobCategory = _k[0], setSelectedJobCategory = _k[1];
    var jobs = (0, react_1.useMemo)(function () { var _a; return (_a = company === null || company === void 0 ? void 0 : company.jobs) !== null && _a !== void 0 ? _a : []; }, [company === null || company === void 0 ? void 0 : company.jobs]);
    var jobCategories = (0, react_1.useMemo)(function () {
        var counts = jobs.reduce(function (acc, job) {
            var category = job.jobType || 'Other';
            acc[category] = (acc[category] || 0) + 1;
            return acc;
        }, {});
        return Object.entries(counts)
            .map(function (_a) {
            var type = _a[0], count = _a[1];
            return ({ type: type, count: count });
        })
            .sort(function (a, b) { return b.count - a.count; });
    }, [jobs]);
    var totalJobs = jobCategories.reduce(function (sum, item) { return sum + item.count; }, 0);
    var pieData = (0, react_1.useMemo)(function () { return jobCategories.map(function (item) { return ({ name: item.type, value: item.count }); }); }, [jobCategories]);
    var selectedCategory = selectedJobCategory || ((_b = jobCategories[0]) === null || _b === void 0 ? void 0 : _b.type) || null;
    var selectedJobs = selectedCategory ? jobs.filter(function (job) { return (job.jobType || 'Other') === selectedCategory; }) : jobs;
    var pieColors = ['#2563EB', '#2562E0', '#1D4ED8', '#3B82F6', '#60A5FA', '#93C5FD'];
    (0, react_1.useEffect)(function () {
        var fetchCompanyData = function () { return __awaiter(_this, void 0, void 0, function () {
            var data, allCompanies, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, 4, 5]);
                        return [4 /*yield*/, companyService_1.companyService.getCompanyById(id)];
                    case 1:
                        data = _a.sent();
                        setCompany(data);
                        return [4 /*yield*/, companyService_1.companyService.getAllCompanies()];
                    case 2:
                        allCompanies = _a.sent();
                        setSuggestedCompanies(allCompanies.filter(function (c) { return c.id !== id; }).slice(0, 4));
                        return [3 /*break*/, 5];
                    case 3:
                        error_1 = _a.sent();
                        console.error("Failed to fetch company details:", error_1);
                        return [3 /*break*/, 5];
                    case 4:
                        setIsLoading(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        fetchCompanyData();
    }, [id]);
    if (isLoading) {
        return (<div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center text-blue-600">
        <lucide_react_1.Loader2 className="w-12 h-12 animate-spin mb-4"/>
        <p className="font-medium text-gray-500">Loading company profile...</p>
      </div>);
    }
    if (!company) {
        return (<div className="min-h-screen pt-24 flex items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-900">Company not found</h2>
      </div>);
    }
    var names = company.name.split(' ');
    var logoText = names.length > 1
        ? "".concat(names[0][0]).concat(names[1][0]).toUpperCase()
        : company.name.substring(0, 2).toUpperCase();
    var coverImage = company.coverImage || "https://source.unsplash.com/1600x400/?".concat(encodeURIComponent(company.industry || 'office'));
    var rawAboutText = company.description || "Welcome to ".concat(company.name, ". We are a leading force in the ").concat(company.industry, " industry, driven by innovation and excellence. Our dedicated team works tirelessly to create solutions that meet the evolving needs of our customers. Join us as we continue to shape the future of ").concat(company.industry, ".");
    var trimmedAboutText = rawAboutText.length > 360 ? "".concat(rawAboutText.slice(0, 360).trim(), "...") : rawAboutText;
    var aboutText = showFullAbout ? rawAboutText : trimmedAboutText;
    return (<main className="min-h-screen bg-gray-50 pb-24">
      {/* Cover Image Banner */}
      <div className="h-64 md:h-80 w-full bg-cover bg-center" style={{ backgroundImage: "url(\"".concat(coverImage, "\")"), backgroundColor: '#e2e8f0' }}>
        <div className="w-full h-full bg-black/20"/>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        {/* Main Info Card */}
        <div className="bg-white rounded-2xl shadow-md p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start justify-between border border-gray-100">
          <div className="flex gap-6 items-center w-full md:w-auto">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-900 rounded-2xl shrink-0 flex items-center justify-center text-white text-4xl font-bold shadow-lg border-4 border-white overflow-hidden relative">
              {company.logo ? (<image_1.default src={company.logo} alt={company.name} fill className="object-cover" unoptimized/>) : logoText}
            </div>

            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{company.name}</h1>
              <p className="text-gray-600 text-lg mb-4">{company.tagline || "Innovating ".concat(company.industry)}</p>

              <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-gray-600">
                <div className="flex flex-col">
                  <span className="text-gray-400 text-xs uppercase tracking-wider mb-1">Website</span>
                  <a href={company.website || '#'} className="text-blue-600 hover:underline flex items-center gap-1">
                    <lucide_react_1.Globe className="w-4 h-4"/>
                    {((_c = company.website) === null || _c === void 0 ? void 0 : _c.replace(/^https?:\/\//, '')) || 'Website Unavailable'}
                  </a>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-400 text-xs uppercase tracking-wider mb-1">Location</span>
                  <span className="flex items-center gap-1"><lucide_react_1.MapPin className="w-4 h-4"/> {company.location || 'Remote'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-400 text-xs uppercase tracking-wider mb-1">Company Size</span>
                  <span className="flex items-center gap-1"><lucide_react_1.Users className="w-4 h-4"/> {company.size || 'Not Specified'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-400 text-xs uppercase tracking-wider mb-1">Industry</span>
                  <span className="flex items-center gap-1"><lucide_react_1.Building2 className="w-4 h-4"/> {company.industry}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 w-full md:w-auto mt-4 md:mt-0">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors">
              <lucide_react_1.Share2 className="w-4 h-4"/> Share
            </button>
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-sm transition-all hover:shadow-md">
              + Follow
            </button>
          </div>
        </div>

        {/* 2 Column Layout */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">

            {/* About Section */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">About {company.name}</h2>
                  <p className="text-gray-500 mt-2">A polished company profile designed for professionals and talent.</p>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <span className="font-semibold text-gray-700">{(_e = (_d = company._count) === null || _d === void 0 ? void 0 : _d.jobs) !== null && _e !== void 0 ? _e : jobs.length} open roles</span>
                  <span className="h-1 w-1 rounded-full bg-slate-300"/>
                  <span>{company.industry || 'Industry not specified'}</span>
                </div>
              </div>
              <div className="text-gray-600 leading-relaxed space-y-4 mt-6">
                <p>{aboutText}</p>
                {rawAboutText.length > 360 && (<button onClick={function () { return setShowFullAbout(!showFullAbout); }} className="text-blue-600 font-semibold hover:underline">
                    {showFullAbout ? 'Show less' : 'Read more'}
                  </button>)}
              </div>
            </section>

            {/* Job Snapshot Graph Section */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-5 gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Job Snapshot</h2>
                  <p className="text-sm text-gray-500 mt-1">Interactive pie chart of open roles by category.</p>
                </div>
                <span className="text-sm font-semibold text-slate-600">{totalJobs} roles</span>
              </div>

              {totalJobs > 0 ? (<div className="grid grid-cols-1 xl:grid-cols-[320px,1fr] gap-6 items-center">
                  <div className="h-80 w-full">
                    <recharts_1.ResponsiveContainer width="100%" height="100%">
                      <recharts_1.PieChart>
                        <recharts_1.Pie data={pieData} dataKey="value" nameKey="name" innerRadius={70} outerRadius={110} paddingAngle={4} onClick={function (data) { var _a; return setSelectedJobCategory((_a = data === null || data === void 0 ? void 0 : data.name) !== null && _a !== void 0 ? _a : null); }} activeIndex={pieData.findIndex(function (item) { return item.name === selectedCategory; })} activeShape={function (props) { return (<g>
                              <text x={props.cx} y={props.cy} dy={8} textAnchor="middle" fill="#1F2937" fontSize={16} fontWeight={700}>
                                {props.name}
                              </text>
                              <text x={props.cx} y={props.cy} dy={28} textAnchor="middle" fill="#475569" fontSize={12}>
                                {props.value} roles
                              </text>
                            </g>); }}>
                          {pieData.map(function (entry, index) { return (<recharts_1.Cell key={"cell-".concat(entry.name)} fill={pieColors[index % pieColors.length]} cursor="pointer"/>); })}
                        </recharts_1.Pie>
                        <recharts_1.Tooltip formatter={function (value) { return ["".concat(value, " role").concat(value !== 1 ? 's' : ''), 'Openings']; }} contentStyle={{ borderRadius: '1rem', border: '1px solid #E2E8F0', boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)' }}/>
                        <recharts_1.Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ paddingLeft: 10 }} formatter={function (value, entry) {
                var _a;
                var item = pieData.find(function (data) { return data.name === value; });
                var count = (_a = item === null || item === void 0 ? void 0 : item.value) !== null && _a !== void 0 ? _a : 0;
                return <span className="text-sm text-slate-700">{value} • {count}</span>;
            }}/>
                      </recharts_1.PieChart>
                    </recharts_1.ResponsiveContainer>
                  </div>

                  <div className="space-y-4">
                    {jobCategories.map(function (category, index) {
                var percentage = totalJobs ? Math.round((category.count / totalJobs) * 100) : 0;
                var active = selectedCategory === category.type;
                return (<button key={category.type} type="button" onClick={function () { return setSelectedJobCategory(category.type); }} className={"w-full rounded-3xl border px-4 py-4 text-left transition ".concat(active ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white hover:border-blue-400 hover:bg-slate-50')}>
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-slate-900">{category.type}</p>
                              <p className="text-xs text-gray-500">{category.count} opening{category.count !== 1 ? 's' : ''}</p>
                            </div>
                            <span className="text-sm font-semibold text-slate-700">{percentage}%</span>
                          </div>
                          <div className="mt-3 h-2 rounded-full bg-slate-200 overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: "".concat(percentage, "%"), backgroundColor: pieColors[index % pieColors.length] }}/>
                          </div>
                        </button>);
            })}

                    {selectedCategory && (<div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                        <div className="flex items-center justify-between mb-4 text-sm text-slate-600">
                          <span>Selected category</span>
                          <span>{selectedJobs.length} role{selectedJobs.length !== 1 ? 's' : ''}</span>
                        </div>
                        <div className="space-y-3">
                          {selectedJobs.slice(0, 5).map(function (job) { return (<div key={job.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <h3 className="font-semibold text-slate-900">{job.title}</h3>
                                  <p className="text-xs text-gray-500 mt-1">{job.location || 'Remote'} • {job.experienceLevel || 'Mid Level'}</p>
                                </div>
                                <span className="text-xs font-bold text-blue-600">{job.jobType || 'Other'}</span>
                              </div>
                            </div>); })}
                          {selectedJobs.length > 5 && (<p className="text-xs text-gray-500">{selectedJobs.length - 5} more roles available in this category.</p>)}
                        </div>
                      </div>)}
                  </div>
                </div>) : (<div className="text-center py-8 text-gray-500">No job categories available yet.</div>)}
            </section>

            {/* Jobs Section */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Jobs From {company.name}</h2>
                <link_1.default href={"/companies/".concat(company.id, "/jobs")} className="text-blue-600 font-semibold hover:underline text-sm">
                  View All Jobs
                </link_1.default>
              </div>

              <div className="space-y-4">
                {jobs.length > 0 ? (jobs.map(function (job) { return (<div key={job.id} className="border border-gray-100 rounded-xl p-6 hover:shadow-md transition-shadow group flex items-start gap-4 cursor-pointer">
                      <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center text-white text-lg font-bold shrink-0">
                        {logoText}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{job.title}</h3>
                            <p className="text-sm text-gray-500 mb-3">{company.name} • {job.location || 'Remote'}</p>
                          </div>
                          <button className="text-gray-400 hover:text-blue-600 transition-colors">
                            <lucide_react_1.Bookmark className="w-5 h-5"/>
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2 text-xs font-semibold text-gray-600">
                          <span className="bg-gray-100 px-3 py-1 rounded-full">{job.jobType || 'Full Time'}</span>
                          <span className="bg-gray-100 px-3 py-1 rounded-full">{job.experienceLevel || 'Mid Level'}</span>
                        </div>
                      </div>
                    </div>); })) : (<div className="text-center py-8 text-gray-500">
                    No open positions at this time. Check back later!
                  </div>)}
              </div>
            </section>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">

            {/* People Section */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">People at {company.name}</h2>
              <div className="space-y-5">
                {company.recruiters && company.recruiters.length > 0 ? (company.recruiters.slice(0, 4).map(function (recruiter) {
            var _a, _b, _c, _d;
            return (<div key={recruiter.id} className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-blue-100 overflow-hidden relative">
                        {((_a = recruiter.user) === null || _a === void 0 ? void 0 : _a.image) ? (<image_1.default src={recruiter.user.image} alt={recruiter.user.name} fill className="object-cover" unoptimized/>) : (<div className="w-full h-full flex items-center justify-center text-blue-700 font-bold">
                            {((_c = (_b = recruiter.user) === null || _b === void 0 ? void 0 : _b.name) === null || _c === void 0 ? void 0 : _c.charAt(0)) || 'U'}
                          </div>)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-gray-900 truncate">{((_d = recruiter.user) === null || _d === void 0 ? void 0 : _d.name) || 'Recruiter'}</h4>
                        <p className="text-xs text-gray-500 truncate">{recruiter.position || 'Talent Acquisition'}</p>
                      </div>
                    </div>);
        })) : (<div className="text-sm text-gray-500 text-center py-4">
                    No team members listed yet.
                  </div>)}
              </div>
              {company.recruiters && company.recruiters.length > 4 && (<button className="w-full mt-6 py-2.5 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-sm">
                  Show All
                </button>)}
            </section>

            {/* People Also View Section */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">People Also View</h2>
              <div className="space-y-5">
                {suggestedCompanies.map(function (sc) {
            var scNames = sc.name.split(' ');
            var scLogo = scNames.length > 1
                ? "".concat(scNames[0][0]).concat(scNames[1][0]).toUpperCase()
                : sc.name.substring(0, 2).toUpperCase();
            return (<link_1.default href={"/companies/".concat(sc.id)} key={sc.id} className="flex items-center gap-4 group cursor-pointer">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">{sc.name}</h4>
                        <p className="text-xs text-gray-500 truncate">{sc.location || 'Remote'}</p>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-gray-900 text-white flex items-center justify-center font-bold text-sm shrink-0">
                        {scLogo}
                      </div>
                    </link_1.default>);
        })}
              </div>
            </section>

          </div>
        </div>
      </div>
    </main>);
}
