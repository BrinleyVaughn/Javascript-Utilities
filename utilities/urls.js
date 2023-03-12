export const getUrlParams = () => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    return Object.fromEntries(urlSearchParams.entries());
}

export const mergeUrlParams = (newParamsObject) => {
    const existing = getUrlParams();
    return {...existing, ...newParamsObject }
}

export const urlHasQuery = (field) => {
    const current = getUrlParams();
    if(current[field] && current[field] !== null && current[field].trim() !== "") return true;
    return false;
}

export const createQueryStringFromObject = (obj, firstCharacter = "?") => {
    obj = removeEmptyObjectProps(obj);
    if(firstCharacter.length < 1) firstCharacter = "?";

    const keys = Object.keys(obj);
    let query = "";

    if(keys.length < 1) return query;

    keys.forEach((k, i) => {
        if(i!==0) query+= "&";
        query+= `${k}=${obj[k]}`;
    })

    return firstCharacter + query;

} 