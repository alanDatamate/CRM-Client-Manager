import React, {useEffect, useState} from 'react';
import { Toaster } from 'react-hot-toast';
import Clients from "./pages/Clients";
import CrmBugList from "./components/List/BugLists";
import {invoke} from "@forge/bridge";

function App() {
    const [view, setView] = useState('clients');
    const [clients, setClients] = useState([]);
    const [jiraProjects, setJiraProjects] = useState([]);
    const [mappings, setMappings] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const loadData = async () => {
        setLoading(true);
        const [clientRes, projectRes , mappedRes] = await Promise.all([
            invoke('getClients'),
            invoke('getJiraProjects'),
            invoke("getMappings")
        ]);
        setClients(clientRes);
        setJiraProjects(projectRes);
        setMappings(mappedRes)
        setLoading(false);
    };
    
    useEffect(() => {
        loadData();
    }, []);

    return (
        <>
            <Toaster position="bottom-center" />

            <div className="p-4 flex gap-2">
                <button
                    className={`btn ${view === 'clients' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setView('clients')}
                >
                    👥 Clients
                </button>
                <button
                    className={`btn ${view === 'bugs' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setView('bugs')}
                >
                    🐞 CRM Bugs
                </button>
            </div>

            <div className="p-4">
                {view === 'clients' && <Clients loading={loading} jiraProjects={jiraProjects} clients={clients} mappings={mappings} setMappings={setMappings} />}
                {view === 'bugs' && <CrmBugList clients={clients}/>}
            </div>
        </>
    );
}

export default App;
