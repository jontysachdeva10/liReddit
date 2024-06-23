export const toErrorMap = (errors: { code: string; field: string; message: string; }) => {
    const errorMap = {};
    errorMap[errors.field] = errors.message
    return errorMap;

}