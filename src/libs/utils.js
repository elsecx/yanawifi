export const getCurrentDate = () => {
    const now = new Date();
    const options = { day: "numeric", month: "long", year: "numeric" };
    return now.toLocaleDateString("id-ID", options);
};

export const formatRupiah = (number) => {
    return `Rp. ${number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
};

export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = date.toLocaleString("id-ID", { month: "long" });
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
};

export function formatPhoneNumber(phoneNumber) {
    const cleaned = ("" + phoneNumber).replace(/\D/g, "");

    const match = cleaned.match(/^(\d{2})(\d{3})(\d{3})(\d{3,})$/);

    if (match) {
        return `+${match[1]} ${match[2]}-${match[3]}-${match[4]}`;
    }

    return phoneNumber;
}

export const cleanData = (data) => {
    return Object.entries(data).reduce((acc, [key, value]) => {
        if (value) acc[key] = value;
        return acc;
    }, {});
};
