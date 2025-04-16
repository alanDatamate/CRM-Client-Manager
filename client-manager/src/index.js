import Resolver from '@forge/resolver';
import api, { route } from '@forge/api';

const resolver = new Resolver();

resolver.define('getJiraProjects', async () => {
    try {
        const data = await getJiraProjects();
        return data;
    } catch (error) {
        return { error: error.message || "Failed to fetch projects" };
    }
});

resolver.define('getClients', async () => {
    try {
        const clients = await getClients();
        return clients;
    } catch (error) {
        return { error: error.message || "Failed to fetch clients" };
    }
});



async function getClients() {
    return [
        { id: 'CID-101', name: 'Client Alpha' },
        { id: 'CID-102', name: 'Client Beta' },
    ];
}

async function getJiraProjects() {
    const res = await api.asUser().requestJira(route`/rest/api/3/project`);
    const data = await res.json();
    return data;
}



export const handler = resolver.getDefinitions();
