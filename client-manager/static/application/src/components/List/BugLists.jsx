import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {invoke} from "@forge/bridge";
import CustomSelectDropDown from "../CustomComponents/CustomSelectDropDown";

const CrmBugList = ({clients}) => {
    const [bugs, setBugs] = useState([]);
    const [selectedClient, setSelectedClient] = useState('');
    
   
        const handleFilterCrmBugs = async () => {
            try {
                const response = await invoke("getCrmBugs", {crmClientId:selectedClient});
                setBugs(response);
            } catch (error) {
                console.error("Error fetching CRM bugs:", error);
            }
        };



    const closeBug = async (id) => {
        
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">🪲 Open CRM Bugs</h2>
            <div className="flex w-[400px] gap-3">
                <CustomSelectDropDown
                    options={clients}
                    selected={selectedClient}
                    setSelected={setSelectedClient}
                    valueField="cid"
                    labelField="clientName"
                    placeholder='-- Choose Client --' />
                <button className="btn btn-accent" onClick={()=> handleFilterCrmBugs(selectedClient)}>Filter..</button>
            </div>
            <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                    <thead className="bg-base-200 text-base font-medium">
                    <tr>
                        <th>#</th>
                        <th>Client ID</th>
                        <th>Module</th>
                        <th>Severity</th>
                        <th>Subject</th>
                        <th>Reported By</th>
                        <th>Issued</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {bugs && bugs.length === 0 ? (
                        <tr>
                            <td colSpan="9" className="text-center text-gray-500">
                                No open bugs found.
                            </td>
                        </tr>
                    ) : (
                        bugs && bugs.length >  0 && bugs.map((bug, index) => (
                            <tr key={bug.jobId}>
                                <td>{index + 1}</td>
                                <td>{bug.cid}</td>
                                <td>{bug.moduleName}</td>
                                <td>
                    <span className="badge badge-outline badge-error">
                      {bug.severity}
                    </span>
                                </td>
                                <td>{bug.subjectMatter}</td>
                                <td>{bug.reportedBy}</td>
                                <td>{new Date(bug.issueDate).toLocaleDateString()}</td>
                                <td>
                                    <span className="badge badge-success">{bug.openClosed}</span>
                                </td>
                                <td>
                                    <button
                                        onClick={() => closeBug(bug.jobId)}
                                        className="btn btn-xs btn-outline btn-error"
                                    >
                                        Close
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default CrmBugList;
