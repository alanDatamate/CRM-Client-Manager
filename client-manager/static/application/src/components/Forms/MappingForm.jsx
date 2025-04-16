import React, { useState, useEffect } from 'react';
import { invoke } from '@forge/bridge';

const MappingTable = () => {
  const [clients, setClients] = useState([]);
  const [jiraProjects, setJiraProjects] = useState([]);
  const [mappings, setMappings] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [clientRes, projectRes] = await Promise.all([
      invoke('getClients'),
      invoke('getJiraProjects'),
    ]);
    setClients(clientRes);
    setJiraProjects(projectRes);
    setLoading(false);
  };

  const handleMap = async () => {
    if (!selectedClient || !selectedProject) return;
    setSelectedClient('');
    setSelectedProject('');
    setStatus('success');
    loadData();
    setTimeout(() => setStatus(null), 3000);
  };

  const handleUnmap = async (clientId, jiraProjectKey) => {
    loadData();
  };

  return (
    <div className="min-h-screen bg-base-200 py-10 px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center text-primary">🔗 CRM ↔ Jira Mapping</h1>
        <div className="bg-white shadow-xl rounded-2xl px-8 py-6">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-end gap-4">
            <div className="w-full lg:w-1/3">
              <select
                className="select select-bordered w-full"
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
              >
                <option value="">-- Choose Client --</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>{client.name}</option>
                ))}
              </select>
            </div>

            <div className="w-full lg:w-1/3">
              <select
                className="select select-bordered w-full"
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
              >
                <option value="">-- Choose Project --</option>
                {jiraProjects.map(project => (
                  <option key={project.key} value={project.key}>{project.name}</option>
                ))}
              </select>
            </div>

            <div className="w-full lg:w-auto">
              <button
                className="px-10 py-2 hover:bg-green-500 bg-green-600 w-full text-white rounded-xl lg:w-auto h-full cursor-pointer"
                onClick={handleMap}
                disabled={!selectedClient || !selectedProject}
              >
                ➕ Map Now
              </button>
            </div>
          </div>
        </div>

        {status === 'success' && (
          <div className="alert alert-success shadow-lg">
            <span>✅ Mapping successfully added!</span>
          </div>
        )}

        {/* Mapping Table */}
        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="table table-zebra w-full">
            <thead className="bg-neutral text-white">
              <tr>
                <th>#</th>
                <th>CRM Client</th>
                <th>Jira Project</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-400">Loading...</td>
                </tr>
              ) : mappings.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-400">No mappings found</td>
                </tr>
              ) : (
                mappings.map((map, index) => {
                  const client = clients.find(c => c.id === map.clientId);
                  const project = jiraProjects.find(p => p.key === map.jiraProjectKey);
                  return (
                    <tr key={`${map.clientId}-${map.jiraProjectKey}`}>
                      <td>{index + 1}</td>
                      <td>{client?.name || map.clientId}</td>
                      <td>{project?.name || map.jiraProjectKey}</td>
                      <td className="text-center">
                        <button
                          className="btn btn-sm btn-error btn-outline"
                          onClick={() => handleUnmap(map.clientId, map.jiraProjectKey)}
                        >
                          ❌ Unmap
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MappingTable;
