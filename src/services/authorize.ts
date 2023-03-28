import { removeValue } from "./storage"

export const clearAuthorize = () => {
    removeValue('user');
    removeValue('userId');
}