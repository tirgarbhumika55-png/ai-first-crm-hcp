import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MoreVertical, Mic, Save, Search, Calendar, Clock } from "lucide-react";
import PageLayout from "../components/layout/PageLayout";
import AIAssistant from "../components/AIAssistant";
import { updateField, loadInteractions, saveInteraction, resetForm } from "../store/interactionSlice";

export default function LogInteraction() {
  const dispatch = useDispatch();
  const form = useSelector((state) => state.interaction.form);
  const interactions = useSelector((state) => state.interaction.interactions);

  const handleChange = (e) => {
    dispatch(updateField({ name: e.target.name, value: e.target.value }));
  };

  const handleSave = async () => {
    if (!form.hcpName || !form.notes) {
      alert("Please fill in HCP Name and Notes");
      return;
    }

    const payload = {
      hcp_name: form.hcpName,
      date: form.date || new Date().toISOString().split('T')[0],
      type: form.type || "Meeting",
      notes: form.notes,
      sentiment: form.sentiment || "Neutral",
      status: "Logged"
    };

    await dispatch(saveInteraction(payload)).unwrap();
    dispatch(resetForm());
    dispatch(loadInteractions());
    alert("Interaction Saved!");
  };

  useEffect(() => {
    dispatch(loadInteractions());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans p-6 text-gray-800">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Log HCP Interaction</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT COLUMN: Interaction Details Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">Interaction Details</h2>
            </div>

            <div className="p-6 space-y-6">
              {/* Row 1: HCP Name & Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">HCP Name</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <input
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      placeholder="Search or select HCP..."
                      name="hcpName"
                      value={form.hcpName || ""}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Interaction Type</label>
                  <div className="relative">
                    <select
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-white"
                      name="type"
                      value={form.type || "Meeting"}
                      onChange={handleChange}
                    >
                      <option>Meeting</option>
                      <option>Call</option>
                      <option>Email</option>
                    </select>
                    <MoreVertical className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Row 2: Date & Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                      name="date"
                      value={form.date || ""}
                      onChange={handleChange}
                    />
                    <Calendar className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Time</label>
                  <div className="relative">
                    <input
                      type="time"
                      className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                      name="time"
                      value={form.time || ""}
                      onChange={handleChange}
                    />
                    <Clock className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Row 3: Attendees */}
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Attendees</label>
                <input
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Enter names or search..."
                  name="attendees"
                  onChange={handleChange}
                />
              </div>

              {/* Row 4: Topics Discussed */}
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Topics Discussed</label>
                <div className="relative">
                  <textarea
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px]"
                    placeholder="Enter key discussion points..."
                    name="notes"
                    value={form.notes || ""}
                    onChange={handleChange}
                  />
                  <Mic className="absolute right-3 bottom-3 w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* Voice Note Button */}
              <button className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm font-medium flex items-center justify-center gap-2 border border-gray-200 transition-colors">
                <span className="text-lg">✨</span> Summarize from Voice Note (Requires Consent)
              </button>

              {/* Materials Section */}
              <div className="space-y-4 pt-2">
                <h3 className="text-sm font-semibold text-gray-800">Materials Shared / Samples Distributed</h3>

                {/* Material 1 */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center border border-gray-200 rounded-md p-3 bg-white">
                    <span className="text-sm text-gray-700 font-medium">Materials Shared</span>
                    <button className="text-sm text-gray-600 border border-gray-300 px-3 py-1 rounded-md hover:bg-gray-50 flex items-center gap-1">
                      <Search className="w-3 h-3" /> Search/Add
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 italic px-1">No materials added.</p>
                </div>

                {/* Material 2 */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center border border-gray-200 rounded-md p-3 bg-white">
                    <span className="text-sm text-gray-700 font-medium">Samples Distributed</span>
                    <button className="text-sm text-gray-600 border border-gray-300 px-3 py-1 rounded-md hover:bg-gray-50 flex items-center gap-1">
                      <span>+</span> Add Sample
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 italic px-1">No samples added.</p>
                </div>
              </div>

              {/* Sentiment */}
              <div className="space-y-2 pt-2">
                <h3 className="text-sm font-semibold text-gray-800">Observed/Inferred HCP Sentiment</h3>
                <div className="flex items-center gap-6">
                  {["Positive", "Neutral", "Negative"].map((s) => (
                    <label key={s} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="sentiment"
                        value={s}
                        checked={form.sentiment === s}
                        onChange={handleChange}
                        className="text-blue-600 focus:ring-blue-500 h-4 w-4"
                      />
                      <span className="text-sm text-gray-700 flex items-center gap-1">
                        {s === "Positive" ? "😊" : s === "Neutral" ? "😐" : "🙁"} {s}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* AI Suggested Follow-ups */}
              <div className="text-sm space-y-2 pt-2">
                <p className="text-blue-600 font-medium">AI Suggested Follow-ups:</p>
                <div className="space-y-1">
                  <p className="text-blue-500 cursor-pointer hover:underline flex items-center gap-1">
                    + Schedule follow-up meeting in 2 weeks
                  </p>
                  <p className="text-blue-500 cursor-pointer hover:underline flex items-center gap-1">
                    + Send OncoBoost Phase III PDF
                  </p>
                  <p className="text-blue-500 cursor-pointer hover:underline flex items-center gap-1">
                    + Add Dr. Sharma to advisory board invite list
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition"
                >
                  <Save className="w-4 h-4" /> Save Log
                </button>
              </div>

            </div>
          </div>

          {/* Recent Logs Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">Recent Interaction Logs</h2>
            </div>
            <div className="p-6">
              {interactions && interactions.length > 0 ? (
                <div className="space-y-4">
                  {interactions.map((log, idx) => (
                    <div key={log.id || idx} className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors bg-white">
                      <div className="flex justify-between items-start mb-2">
                        <div className="space-y-0.5">
                          <h3 className="font-semibold text-gray-900">{log.hcp_name}</h3>
                          <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
                            <span className="capitalize">{log.type}</span>
                            <span>•</span>
                            <span>{log.date}</span>
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${log.sentiment === 'Positive' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                          log.sentiment === 'Negative' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                            'bg-gray-50 text-gray-700 border-gray-100'
                          }`}>
                          {log.sentiment || 'Neutral'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                        {log.notes}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400 text-sm">No recent interactions found.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: AI Assistant */}
        <div className="lg:col-span-1">
          <AIAssistant onRefresh={() => dispatch(loadInteractions())} />
        </div>
      </div>
    </div>
  );
}
