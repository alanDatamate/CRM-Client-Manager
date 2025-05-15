import React, { useState, useEffect } from 'react';
import { invoke } from '@forge/bridge';
import CustomSelectDropDown from '../CustomComponents/CustomSelectDropDown';
import toast from 'react-hot-toast';

const MappingTable = ({loading , clients , jiraProjects , mappings , setMappings}) => {
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
 
  const handleMap = async () => {
    if (!selectedClient || !selectedProject) return;
    try {
      const saveData = {
        crmClientId : selectedClient,
        jiraProjectKey: selectedProject,
      }
      const response = await invoke('MapClientToProject', saveData);
      setMappings((prev) => [...prev, response]);
      toast.success('✅ Mapping successfully added!');
      setSelectedClient('');
      setSelectedProject('');
    } catch (error) {
      console.error('Mapping failed:', error);
      toast.error('❌ Something went wrong!, try again later...');
    }
  };

  const handleUnmap = async (clientId, jiraProjectKey) => {
    try {
      const removeMappedData = {
        crmClientId : clientId,
        jiraProjectKey: jiraProjectKey,
      }
      await invoke('UnmapClientFromProject', removeMappedData);
      setMappings((prev) => prev.filter((m) => !(m.crmClientId === clientId && m.jiraProjectKey === jiraProjectKey)));
      toast.success('✅ Unmapping successful.');
    } catch (error) {
      toast.error('❌ Something went wrong!');
      console.error('unmapping failed:', error);
      }
  };
  
  const handleSyncClick = async (mappings) => {
    try {
      await invoke('syncData', { mappings });
      toast.success("CRM jobs added to the specified Jira project");
    } catch (error) {
      console.error("Error syncing data:", error);
      toast.error("Failed to sync CRM jobs to Jira");
    }
  }

  return (
    <div className="min-h-screen bg-base-200 py-5 px-6">
      <div className="max-w-6xl mx-auto ">
        <h1 className="text-4xl font-bold text-center text-primary">🔗 CRM ↔ Jira Mapping</h1>
        <div className="bg-white shadow-xl rounded-2xl px-8 py-6">
          <div className="flex justify-end mb-4">
            <button
              className="btn btn-outline btn-primary"
              onClick={()=> handleSyncClick(mappings)}
            >
              🔄 Sync Data
            </button>
            </div>
            <div className="flex flex-col lg:flex-row items-stretch lg:items-end gap-4">
            <CustomSelectDropDown
              options={clients}
              selected={selectedClient}
              setSelected={setSelectedClient}
              valueField="cid"
              labelField="clientName"
              placeholder='-- Choose Client --' />
            
            <CustomSelectDropDown
              options={jiraProjects}
              selected={selectedProject}
              setSelected={setSelectedProject}
              valueField="key"
              labelField="name"
              placeholder='-- Choose Project --'/>

              <div className="w-full lg:w-1/3">
                <button
                  className="w-full  h-12 text-white bg-green-600 hover:bg-green-500 rounded-xl cursor-pointer"
                  onClick={handleMap}
                  disabled={!selectedClient || !selectedProject}
                >
                  ➕ Map Now
                </button>
              </div>
            </div>
          </div>
          {/* Mapping Table */}
          <div className="overflow-x-auto bg-white rounded-xl shadow">
            <table className="table table-zebra w-full">
              <thead className="bg-neutral text-white">
                <tr>
                  <th>#</th>
                  <th>CRM Client</th>
                  <th>Jira Project</th>
                  <th>Mapped By</th>
                  <th>Created Date</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="text-center py-6 text-gray-400">Loading...</td>
                  </tr>
                ) : mappings && mappings.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-6 text-gray-400">No mappings found</td>
                  </tr>
                ) : (
                  mappings && mappings.map((map, index) => {
                    return (
                      <tr key={index + 1}>
                        <td>{map.id}</td>
                        <td>{map.crmClientId}</td>
                        <td>{map.jiraProjectKey}</td>
                        <td>{map.mapped_by}</td>
                        <td>{map.createdAt}</td>
                        <td className="text-center">
                          <button
                            className="btn btn-sm btn-error btn-outline"
                            onClick={() => handleUnmap(map.crmClientId, map.jiraProjectKey)}
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
