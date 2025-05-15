import Resolver from '@forge/resolver';
import api, {route} from '@forge/api';

const resolver = new Resolver();
const url = "https://5173-59-94-176-126.ngrok-free.app"

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
    console.log(error);
        return { error: error.message || "Failed to fetch clients" };
    }
});

resolver.define("getMappings", async () => {
    try {
      const res = await api.fetch(`${url}/api/v1/crm-integration/jira-mappings`);
      const response = await res.json();
      return response;
    } catch (error) {
        console.log(error)
        return  {error: error.message || "Failed to fetch mappings" };
    }
})
resolver.define("syncData", async (req) => {
  try {
    const { mappings } = req.payload;
    console.log(mappings)
    return;
      const res = await api.fetch(`${url}/api/v1/crm-integration/sync?clientId=${crmClientId}`);
      const bugs = await res.json();
      for (const job of bugs) {
        const payload = {
          fields: {
            project: {
              key: jiraProjectKey,  
            },
            summary: job.subjectMatter,
            description: {
              type: "doc",
              version: 1,
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      text: job.jobDetails, 
                    },
                  ],
                },
              ],
            },
            issuetype: {
              name: "Bug", 
            },
          },
        };
        
        const response = await api.asApp().requestJira(route`/rest/api/3/issue`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
  
        const data = await response.json();
        console.log('Jira Issue Created:', data); 
        if (!response.ok) {
          console.error('Error creating Jira issue:', data);
          return { error: 'Failed to create Jira issues' };
        }
      }
      return { success: true };
  
    } catch (error) {
      console.log("Error creating issue:", error);
      return { error: error.message || "Failed to sync mappings" };
    }
  });
  
resolver.define("MapClientToProject", async (req) => {
    try {
      const { crmClientId, jiraProjectKey } = req.payload;
      const userResponse = await api.asUser().requestJira(route`/rest/api/3/myself`);
      const userdata = await userResponse.json();
      const res = await api.fetch(`${url}/api/v1/crm-integration/map`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ crmClientId, jiraProjectKey , Mapped_by : userdata.displayName }),
    });
    const data  = await res.json()
    return data;       
    } catch (error) {
        console.log(error);
    }
})
resolver.define("UnmapClientFromProject", async (req) => {
  const { crmClientId, jiraProjectKey } = req.payload;
  try {
    const res = await api.fetch(`${url}/api/v1/crm-integration/unmap`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ crmClientId , jiraProjectKey  }),
    });
    return {status : true};       
    } catch (error) {
        console.log(error);
    }
})

resolver.define("getCrmBugs" , async (req)=>{
    const { crmClientId } = req.payload;
    try{
    const res = await api.fetch(`${url}/api/v1/crm-integration/sync?clientId=${crmClientId}`);
    return await res.json();
    }catch (error){
        console.log(error);
    }
})
async function getClients() {
  const res = await api.fetch(`${url}/api/v1/crm-integration/clients`);
  const response = await res.json();
  return response;
}

async function getJiraProjects() {
    const res = await api.asUser().requestJira(route`/rest/api/3/project`);
  const data = await res.json();
    return data;
}



export const handler = resolver.getDefinitions();
