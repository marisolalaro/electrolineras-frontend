import { environment } from 'src/app/core/environments/environment';

// const API_BASE;
const endPoints = {
    API_BASE: environment.apiUrl,

    ADMINISTRATION_UPDATE: `/clientUser/update`,
};

export default endPoints;