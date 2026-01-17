import {apiClient} from "@/services/api";

export interface createRoomResponse {
    message: string;
    roomCode: string;
}

export interface roomStatusResponse {
    roomId: string;
    roomCode: string;
    players: string[];
}

export const roomService = {
    // create a new room
    createRoom : async (): Promise<createRoomResponse> => {
        return apiClient.post<createRoomResponse>('/api/room/create',);
    },

    // get room status
    getRoomStatus : async () => {
        return apiClient.get<roomStatusResponse>(`/api/room/status`);
    }
}