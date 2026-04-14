import { publicClient } from "./axios";

class AvailabilityApi {
  getAvailability = (date: string) => {
    return publicClient.get(`/availability`, {
      params: { date },
    });
  };
}

const availabilityApi = new AvailabilityApi();
export default availabilityApi;
