import { ChatType } from "@/interfaces";
import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: "chat",
    initialState: {
       chats: [],
    },
    reducers: {
        SetChats: (state, action) => {
            state.chats = action.payload;
        },
    },
    });

    export const { SetChats } = chatSlice.actions;
    export default chatSlice;


    export interface ChatState {chats:ChatType[]}