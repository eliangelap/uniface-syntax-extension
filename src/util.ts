export const getCurrentDate = () => {
    const date = new Date();
    return date.toISOString().split('T')[0];
};

export const getFormattedCurrentDate = () => {
    const [year, month, day] = getCurrentDate().split('-');
    return `${day}/${month}/${year}`;
};