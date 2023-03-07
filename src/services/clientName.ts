export const setClientAccountName = (accountName: string) => {
    localStorage.setItem('account-name', accountName);
}

export const getClientAccountName = () => {
    return localStorage.getItem('account-name') || '';
}

export const clearClientAccountName = () => {
    return localStorage.removeItem('account-name');
}