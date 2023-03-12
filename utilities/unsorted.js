import { useEffect, useRef } from "react";

export const randomID = () => {
    let s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    //return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
    return 'id-' + s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

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

export const checkProductImage = (item_number) => {
    return fetch(`https://cdn.media.amplience.net/i/mrpricegroup/11_${item_number}_SI_00.json?metadata=true`);
}

export const productImageUrl = (item_number) => {
    return `https://cdn.media.amplience.net/i/mrpricegroup/11_${item_number}_SI_00`
}

export const getProductErrors = (product) => {
    let errors = [];

    if(!product.has_image) errors.push('missing_image');
    if(!product.name) errors.push('missing_name');
    if((product.otd_qty > 0 && product.magento_qty <= 0)) errors.push('magento_0_stock');
    if((!product.on_efocus)) errors.push('not_on_efocus');
    if((!product.on_magento)) errors.push('not_on_magento');
    if((!product.has_magento_stock_value)) errors.push('no_magento_stock_value');
    if((!product.web_qa_date)) errors.push('not_web_qad');
    if((!product.sku)) errors.push('missing_sku');

    return errors;
}

export function usePreviousState(value) {
    // The ref object is a generic container whose current property is mutable ...
    // ... and can hold any value, similar to an instance property on a class
    const ref = useRef();
    // Store current value in ref
    useEffect(() => {
      ref.current = value;
    }, [value]); // Only re-run if value changes
    // Return previous value (happens before update in useEffect above)
    return ref.current;
}

export const getUrlParams = () => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    return Object.fromEntries(urlSearchParams.entries());
}

export const mergeUrlParams = (newParamsObject) => {
    const existing = getUrlParams();
    return {...existing, ...newParamsObject }
}

export const hasActiveFilter = (field) => {
    const current = getUrlParams();
    if(current[field] && current[field] !== null && current[field].trim() !== "") return true;
    return false;
}

export const removeEmptyObjectProps = (obj) => {
    return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null && v !== ''));
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

export const getProductBrands = () => {
    return [
        {
            label: "Samsung",
            value: "samsung",
        },
        {
            label: "Nokia",
            value: "nokia",
        },
        {
            label: "Huawei",
            value: "huawei",
        },
    ]
}

export const getPhoneNetworks = () => {
    return [
        {
            label: "Vodacom",
            value: "vodacom",
        },
        {
            label: "Mr Price Mobile",
            value: "mrpmobile",
        },
        {
            label: "MTN",
            value: "mtn",
        },
        {
            label: "Telkom",
            value: "telkom",
        },
    ]
}

const exportProducts = (e) => {
    const csvHeaders = [...displayedColumns];

    let csvRowsArray = [];
    csvRowsArray.push(csvHeaders.join(','));
    
    props.products.forEach( product => {
        let rowArray = csvHeaders.map( (field) => {
            if(product[field]) return product[field];
        })

        csvRowsArray.push(rowArray.join(','));

    })

    const csvRows = csvRowsArray.join("\n");
    let csvFile = new Blob([csvRows], { type: "text/csv" });

    const url = URL.createObjectURL(csvFile);
    const el = document.createElement('a');
    el.href = url;
    el.setAttribute('download', `products-export-${Date.now()}`);
    el.click();
    el.remove();
}