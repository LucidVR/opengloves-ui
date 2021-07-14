export const deepOverwrite = (obj1, obj2) => {
    Object.keys(obj1).forEach(k => {
        if(typeof obj1[k] === 'object') return deepOverwrite(obj1[k], obj2[k]);
        obj1[k] = obj2[k] ?? obj1[k];
    });
    return obj1;
}