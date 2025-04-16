const mockClients = [
    {
        cid: "CL001",
        clientName: "Acme Corporation",
        address1: "123 Innovation Dr",
        address2: "Suite 400, NY",
        jobs: [
          {
            keyfield: "J1001",
            issuedate: "2024-11-10",
            modulename: "Billing",
            severity: "High",
            postedby: "Client",
            openClosed: "Open",
            subjectmatter: "Invoice not generated",
            jobdetails: "Invoice fails to generate for new contracts.",
            reportedby: "john.doe",
            comment: "Check new contract module."
          }
        ]
      },
  ];
  
  export default mockClients;
  