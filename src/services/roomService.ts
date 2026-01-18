import {apiClient} from "@/services/api";

export interface ICreateRoomResponse {
    message: string;
    data: {
        roomCode: string;
    }
}

export interface IRoomStatus {
    roomId: string;
    roomCode: string;
    players: string[];
    user: string;
}

export interface IRoomStatusResponse {
    data: IRoomStatus;
}

export interface IRoomJoinResponse {
    success: boolean;
    message: string;
}

export const roomService = {
    // create a new room
    createRoom : async (): Promise<ICreateRoomResponse> => {
        return apiClient.post<ICreateRoomResponse>('/api/room/create',);
    },

    // get room status
    getRoomStatus : async () => {
        return apiClient.get<IRoomStatusResponse>(`/api/room/status`);
    },

    // join a room
    joinRoom : async (roomCode: string) => {
        return apiClient.post<IRoomJoinResponse>(`/api/room/join`, {roomCode});
    }
}