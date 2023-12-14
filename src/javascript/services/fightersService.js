import callApi from '../helpers/apiHelper';

class FighterService {
    #endpoint = 'fighters.json';

    async getFighters() {
        try {
            const apiResult = await callApi(this.#endpoint);
            return apiResult;
        } catch (error) {
            throw error;
        }
    }

    /* eslint-disable class-methods-use-this */
    async getFighterDetails(id) {
        // todo: implement this method
        // endpoint - `details/fighter/${id}.json`;
        const fighterEndpoint = `details/fighter/${id}.json`;

        try {
            const fighterDetails = await callApi(fighterEndpoint);
            return fighterDetails;
        } catch (error) {
            throw error;
        }
    }
    /* eslint-enable class-methods-use-this */
}

const fighterService = new FighterService();

export default fighterService;
