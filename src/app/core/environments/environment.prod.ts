export const environment = {
    production: true,
    // apiUrl: 'http://localhost:8050/electrolinerasbackend', // server localhost
    // apiUrl: 'http://10.241.74.31:8050/electrolinerasbackend', // server ende ip
    // apiUrl: 'https://test-dlpelectrolineras.et.bo/electrolinerasbackend', // server test
    apiUrl: 'https://dlpelectrolineras.et.bo/electrolinerasbackend', // server test

    // apiUrlOcpp: 'http://localhost:8051', // server localhost
    // apiUrlOcpp: 'http://10.241.74.31:8051', // server ende ip
    //apiUrlOcpp: 'https://testocpp.et.bo',
    apiUrlOcpp: 'https://dlpocpp.et.bo', // server test
    
    apiEnv: 'production',
    formatDate: 'DD/MM/YYYY',
    formatDateDB: 'YYYY-MM-DD',
    VITE_OAUTH_USER: "epagos",
    VITE_OAUTH_PASSWORD: "12345",
};
