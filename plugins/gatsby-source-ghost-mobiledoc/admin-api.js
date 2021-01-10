const GhostAdminAPI = require('@tryghost/admin-api');

module.exports.configure = ({apiUrl, adminApiKey, version = `v3`}) => {
    return new GhostAdminAPI({
        url: apiUrl,
        key: adminApiKey,
        version: version
    });
};
