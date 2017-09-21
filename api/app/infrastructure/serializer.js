module.exports = {

    serializeError(err) {
        if (!('errors' in err)) {
            return {
                code: 500,
                data: { error: err }
            };
        }

        const getErrorsInfo = Object.values(err.errors).reduce((formatedErrors, error) => {
            formatedErrors.push({
                'status': '400',
                'type': error.name,
                'detail': error.message,
                'meta': {
                    'field': error.path
                }
            });

            return formatedErrors;
        }, []);

        const code = (getErrorsInfo[0].type === 'Not Found Error') ? 404 : 422;
        return { code, data: { 'errors': getErrorsInfo } };
    }
};