export const formatDate = (date) => {
    if(!date) return "";
    const DateObj = new Date(date);
    const y = DateObj.getFullYear();
    let m = DateObj.getMonth();
    let d = DateObj.getDate();

    m = m + 1;

    if(m < 10) {  m = "0" + m };
    if(d < 10) {  d = "0" + d };

    return `${y}-${m}-${d}`
}