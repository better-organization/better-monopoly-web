import {apiClient} from "@/services/api";

export interface ICreateRoomResponse {
    message: string;
    data: {
        roomCode: string;
    }
}

export enum RoomState {
    WAITING = 'WAITING',
    IN_GAME = 'IN_GAME',
    FINISHED = 'FINISHED',
}

export interface IRoomStatus {
    roomId: string;
    roomCode: string;
    players: string[];
    maxPlayers: number;
    roomState: string;
    user: string;
}

export interface IRoomStatusResponse {
    data: IRoomStatus;
}

export interface ISuccessResponse {
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
        return apiClient.post<ISuccessResponse>(`/api/room/join`, {roomCode});
    },

    startGame : async () => {
        return apiClient.post<ISuccessResponse>('/api/room/start');
    }
}