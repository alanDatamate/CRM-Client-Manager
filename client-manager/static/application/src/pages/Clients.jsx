import React, { useEffect, useState } from "react";
import mockClients from "../data/MockClientData";
import MappingForm from "../components/Forms/MappingForm";

const Clients = ({loading , clients , jiraProjects , mappings , setMappings}) => {

    return (
      <main>
      <MappingForm loading={loading} jiraProjects={jiraProjects} clients={clients} mappings={mappings} setMappings={setMappings}/>
      </main>
  );
};

export default Clients;
