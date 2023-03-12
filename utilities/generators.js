export const generateUuid = () => {
    let block = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    //return id of format 'xxxxxxxx'-'xxxx'-'xxxx'-'xxxx'-'xxxxxxxxxxxx'
    return `id-${block()}-${block()}-${block()}-${block()}-${block()}-${block()}${block()}${block()}`;
}