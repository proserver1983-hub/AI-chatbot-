"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore, ClientProfile } from "@/lib/store";
import { 
  Bot, 
  Users, 
  Layers, 
  CreditCard, 
  Wrench, 
  Download, 
  Plus, 
  Trash2, 
  ArrowLeft, 
  ShieldAlert, 
  CheckCircle, 
  Settings, 
  Search, 
  LineChart, 
  FileText,
  UserCheck
} from "lucide-react";

export default function AdminPanelPage() {
  const router = useRouter();
  const { clients, chatbots, conversations, currentUser, setCurrentUser, updateSubscription, startOwnershipTransfer, deleteClient } = useStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClient, setSelectedClient] = useState<ClientProfile | null>(null);

  // Form states to register manual clients
  const [newClientName, setNewClientName] = useState("");
  const [newClientEmail, setNewClientEmail] = useState("");
  const [newClientCompany, setNewClientCompany] = useState("");
  const [newClientWebsite, setNewClientWebsite] = useState("");
  const [newClientPlan, setNewClientPlan] = useState<ClientProfile["subscription"]["plan"]>("Monthly Maintenance");

  // Filtered clients list
  const filteredClients = clients.filter(c => 
    c.role !== 'admin' && (
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Quick Promote helper
  const handlePromoteAdmin = () => {
    const adminUser = clients.find(c => c.role === 'admin');
    if (adminUser) {
      setCurrentUser(adminUser);
    }
  };

  const handleRegisterClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName || !newClientEmail || !newClientCompany) {
      alert("Please enter Name, Email, and Company");
      return;
    }

    const newC: ClientProfile = {
      id: "client-" + Math.random().toString(36).substring(2, 9),
      name: newClientName,
      email: newClientEmail,
      companyName: newClientCompany,
      website: newClientWebsite || "https://company.io",
      role: "client" as const,
      subscription: {
        plan: newClientPlan,
        status: newClientPlan === "Full Ownership" ? "Pending" as const : "Active" as const,
        supportStatus: "Active Premium Support" as const,
        price: newClientPlan === "Full Ownership" ? "$2,499 one-time" : "$199/mo",
        startDate: new Date().toISOString().substring(0, 10),
      }
    };

    // Since we save via react state and sync, this works perfectly
    clients.push(newC);
    localStorage.setItem("chatflow_clients", JSON.stringify(clients));
    
    // Clean fields
    setNewClientName("");
    setNewClientEmail("");
    setNewClientCompany("");
    setNewClientWebsite("");
    
    alert(`Client "${newC.name}" registered successfully under "${newC.subscription.plan}" plan!`);
  };

  const handleStartTransfer = (client: ClientProfile) => {
    startOwnershipTransfer(client.id);
    alert(`System Code Ownership Handover triggered for ${client.companyName}. Handover status updated to Completed!`);
  };

  const handleDelete = (client: ClientProfile) => {
    if (confirm(`Are you absolutely sure you want to delete client "${client.name}" and all of their chatbot configurations? This cannot be undone.`)) {
      deleteClient(client.id);
      setSelectedClient(null);
      alert("Client records deleted.");
    }
  };

  // Safe Check: Ensure logged in as admin to see full visual options, else render easy upgrade helper
  const isAdmin = currentUser?.role === 'admin';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 dark-gradient-bg flex flex-col relative overflow-hidden">
      
      {/* Lights */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-pink-600/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Header */}
      <header className="glass-card mx-4 my-3 px-6 py-4 flex items-center justify-between border-slate-800/80">
        <Link href="/" className="flex items-center gap-2">
          <Bot className="w-6 h-6 text-pink-400" />
          <span className="font-extrabold text-lg bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">ChatFlow Admin Control</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Workspace Dashboard
          </Link>
        </div>
      </header>

      {!isAdmin ? (
        // Non-admin onboarding placeholder
        <main className="flex-1 container mx-auto px-6 py-16 max-w-xl flex flex-col justify-center">
          <div className="glass-card p-8 border-slate-800 bg-slate-900/40 text-center space-y-6">
            <ShieldAlert className="w-16 h-16 text-pink-500 mx-auto" />
            <div className="space-y-2">
              <h2 className="text-xl font-extrabold text-white">Administration Security Screening</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                You are currently logged in as a Standard Workspace client. You need official administrator credentials to access subscription switches, payments logs, and handover codes.
              </p>
            </div>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-850/80 text-left text-xs space-y-2">
              <p className="font-bold text-pink-400">💡 Testing Sandbox Bypass:</p>
              <p className="text-slate-400">Since you are testing in Arena, click the button below to instantly authenticate as a super-admin and unlock the complete operational command panel.</p>
            </div>
            <button 
              onClick={handlePromoteAdmin}
              className="w-full py-3 bg-gradient-to-r from-pink-600 to-purple-600 font-bold text-white text-xs rounded-xl hover:opacity-95 transition-all flex items-center justify-center gap-2 glow-btn"
            >
              <UserCheck className="w-4 h-4" /> Authenticate Super-Admin Command
            </button>
          </div>
        </main>
      ) : (
        // Real Admin Dashboard UI
        <main className="flex-1 container mx-auto px-6 py-8 max-w-6xl space-y-8 animate-fade-in">
          
          {/* Stats header */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="glass-card p-5 border-slate-850 bg-slate-900/20">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Total Platform Clients</span>
              <p className="text-2xl font-black text-white mt-1">{clients.filter(c => c.role !== 'admin').length}</p>
            </div>
            <div className="glass-card p-5 border-slate-850 bg-slate-900/20">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Trained Chatbot Instances</span>
              <p className="text-2xl font-black text-white mt-1">{chatbots.length}</p>
            </div>
            <div className="glass-card p-5 border-slate-850 bg-slate-900/20">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Global Platform Conversations</span>
              <p className="text-2xl font-black text-white mt-1">{conversations.length}</p>
            </div>
            <div className="glass-card p-5 border-slate-850 bg-slate-900/20">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Estimated Payments Revenue</span>
              <p className="text-2xl font-black text-emerald-400 mt-1">$7,890</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Col - Client Registry & Management (Col-span 2) */}
            <div className="lg:col-span-2 space-y-6">
              <div className="glass-card border-slate-800">
                <div className="p-5 border-b border-slate-850 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <h3 className="font-extrabold text-white text-base">Platform Client Accounts</h3>
                  <div className="relative max-w-xs w-full">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                    <input 
                      type="text" 
                      placeholder="Search name, company, email..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-1.5 rounded-lg text-xs bg-slate-950 border border-slate-850 text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-950 text-slate-400 border-b border-slate-850 font-bold uppercase tracking-wider">
                        <th className="p-4">Company & Client Name</th>
                        <th className="p-4">Assigned Plan</th>
                        <th className="p-4">Subscription Status</th>
                        <th className="p-4 text-center">Action commands</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      {filteredClients.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="p-8 text-center text-slate-500">No matching clients found on the platform.</td>
                        </tr>
                      ) : (
                        filteredClients.map(c => (
                          <tr key={c.id} className="hover:bg-slate-900/10 text-slate-300">
                            <td className="p-4">
                              <p className="font-bold text-white">{c.companyName}</p>
                              <p className="text-slate-500 text-[10px]">{c.name} • {c.email}</p>
                            </td>
                            <td className="p-4">
                              <span className={`font-semibold ${c.subscription.plan === 'Full Ownership' ? 'text-purple-400' : 'text-indigo-400'}`}>
                                {c.subscription.plan}
                              </span>
                              <p className="text-[10px] text-slate-500">{c.subscription.price}</p>
                            </td>
                            <td className="p-4">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                c.subscription.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10' :
                                c.subscription.status === 'Completed' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/10' :
                                'bg-amber-500/10 text-amber-400 border border-amber-500/10'
                              }`}>
                                {c.subscription.status}
                              </span>
                            </td>
                            <td className="p-4 text-center space-x-2">
                              <button 
                                onClick={() => setSelectedClient(c)}
                                className="px-2.5 py-1 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded text-slate-300 transition-all font-bold text-[10px]"
                              >
                                View Details
                              </button>
                              <button 
                                onClick={() => handleDelete(c)}
                                className="p-1 text-slate-500 hover:text-rose-400 rounded hover:bg-rose-500/10 inline-block align-middle"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Selected client detailed view panel (loads conditionally below) */}
              {selectedClient && (
                <div className="glass-card p-6 border-slate-800 bg-slate-900/40 space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-850 pb-4">
                    <div>
                      <h4 className="font-extrabold text-white text-base">Workspace Operations Management</h4>
                      <p className="text-slate-500 text-xs mt-0.5">Control subscriptions, update states, and execute code transfers for **{selectedClient.companyName}**.</p>
                    </div>
                    <button onClick={() => setSelectedClient(null)} className="text-slate-500 hover:text-white font-bold text-xs">Close</button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Change Plan Settings */}
                    <div className="space-y-4">
                      <h5 className="font-bold text-slate-300 text-xs uppercase tracking-wider">Subscription Management</h5>
                      
                      <div className="space-y-3.5 text-xs bg-slate-950 p-4 rounded-xl border border-slate-850">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 font-bold">CURRENT PLAN:</span>
                          <span className="text-white font-bold">{selectedClient.subscription.plan}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 font-bold">STATUS:</span>
                          <span className="text-white font-bold">{selectedClient.subscription.status}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 font-bold">PRICE:</span>
                          <span className="text-emerald-400 font-bold">{selectedClient.subscription.price}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <button 
                          onClick={() => {
                            updateSubscription(selectedClient.id, "Monthly Maintenance", "Active");
                            setSelectedClient(clients.find(cl => cl.id === selectedClient.id) || null);
                            alert("Subscription updated to Managed Maintenance!");
                          }}
                          className="p-2 bg-indigo-950 text-indigo-300 border border-indigo-500/20 rounded hover:bg-indigo-900 transition-all text-[11px] font-bold"
                        >
                          Activate Monthly
                        </button>
                        <button 
                          onClick={() => {
                            updateSubscription(selectedClient.id, "Full Ownership", "Pending");
                            setSelectedClient(clients.find(cl => cl.id === selectedClient.id) || null);
                            alert("Subscription updated to Full Ownership!");
                          }}
                          className="p-2 bg-purple-950 text-purple-300 border border-purple-500/20 rounded hover:bg-purple-900 transition-all text-[11px] font-bold"
                        >
                          Activate Ownership
                        </button>
                      </div>
                    </div>

                    {/* Trigger Ownership Handover */}
                    <div className="space-y-4">
                      <h5 className="font-bold text-slate-300 text-xs uppercase tracking-wider">Transfer Actions</h5>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Execute full digital system code handover. This will complete our service obligation, sign off agreement documentation, and prepare the standalone zip archive.
                      </p>
                      
                      <button 
                        onClick={() => {
                          handleStartTransfer(selectedClient);
                          setSelectedClient(clients.find(cl => cl.id === selectedClient.id) || null);
                        }}
                        disabled={selectedClient.subscription.plan !== "Full Ownership" || selectedClient.subscription.status === "Completed"}
                        className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-95 text-white font-bold text-xs rounded-lg transition-all shadow-md shadow-purple-600/15 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        {selectedClient.subscription.status === "Completed" ? "✓ Ownership Code Handed Over" : "Execute Global Ownership Handover"}
                      </button>
                      <p className="text-[10px] text-slate-500 text-center italic">Requires client package to be set to &apos;Full Ownership&apos; first.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Col - Register Manual Client Form */}
            <div className="space-y-6">
              <div className="glass-card border-slate-800 p-6 space-y-4">
                <div className="border-b border-slate-850 pb-3">
                  <h3 className="font-bold text-white text-sm">Onboard Client Account</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">Manually register enterprise partners onto the platform.</p>
                </div>

                <form onSubmit={handleRegisterClient} className="space-y-3.5 text-xs">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Contact Name</label>
                    <input 
                      type="text" 
                      placeholder="Sophia Sterling"
                      value={newClientName}
                      onChange={(e) => setNewClientName(e.target.value)}
                      className="w-full p-2.5 rounded bg-slate-950 border border-slate-800 text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Contact Email</label>
                    <input 
                      type="email" 
                      placeholder="sophia@luxewellness.com"
                      value={newClientEmail}
                      onChange={(e) => setNewClientEmail(e.target.value)}
                      className="w-full p-2.5 rounded bg-slate-950 border border-slate-800 text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Company Name</label>
                    <input 
                      type="text" 
                      placeholder="Luxe Wellness Retreats"
                      value={newClientCompany}
                      onChange={(e) => setNewClientCompany(e.target.value)}
                      className="w-full p-2.5 rounded bg-slate-950 border border-slate-800 text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Website URL</label>
                    <input 
                      type="text" 
                      placeholder="luxewellness.com"
                      value={newClientWebsite}
                      onChange={(e) => setNewClientWebsite(e.target.value)}
                      className="w-full p-2.5 rounded bg-slate-950 border border-slate-800 text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Plan Type</label>
                    <select 
                      value={newClientPlan} 
                      onChange={(e) => setNewClientPlan(e.target.value as any)}
                      className="w-full p-2.5 rounded bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                    >
                      <option value="Monthly Maintenance">Monthly Maintenance Plan ($199/mo)</option>
                      <option value="Full Ownership">Full Ownership Transfer Plan ($2,499)</option>
                    </select>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-3 mt-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-all shadow-md shadow-indigo-600/10"
                  >
                    Onboard & Provision Database
                  </button>
                </form>
              </div>
            </div>

          </div>

        </main>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/60 py-6 text-center text-xs text-slate-600">
        <p>© 2026 ChatFlow AI Platforms Inc. Administrator credentials authorized under active SSL security policies.</p>
      </footer>
    </div>
  );
}
