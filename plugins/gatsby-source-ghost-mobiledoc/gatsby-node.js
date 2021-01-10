/****
 * gatsby-node.js
 *
 * Generate Gatsby nodes based on a custom schema derived from the Ghost V3 API spec.
 *
 * This source plugin will source and generate Posts, Pages, Tags, Authors and Settings.
 *
 * https://ghost.org/docs/api/v3/
 */

const Promise = require('bluebird');
const AdminAPI = require('./admin-api');
const {
    PostNode,
    PageNode,
} = require('./ghost-nodes');
const _ = require(`lodash`);
const cheerio = require(`cheerio`);

/**
 * Import all custom ghost types.
 */
const ghostTypes = require('./ghost-schema');

/**
 * Create Live Ghost Nodes
 * Uses the Ghost Admin API to fetch all posts, pages, tags, authors and settings
 * Creates nodes for each record, so that they are all available to Gatsby
 */
exports.sourceNodes = ({actions}, configOptions) => {
    const {createNode} = actions;

    const api = AdminAPI.configure(configOptions);

    const ignoreNotFoundElseRethrow = (err) => {
        if (err && err.response && err.response.status !== 404) {
            throw err;
        }
    };

    const postAndPageFetchOptions = {
        limit: 'all',
    };

    const fetchPosts = api.posts
        .browse(postAndPageFetchOptions)
        .then((posts) => {
            posts.forEach(post => createNode(PostNode(post)));
        }).catch(ignoreNotFoundElseRethrow);

    const fetchPages = api.pages
        .browse(postAndPageFetchOptions)
        .then((pages) => {
            pages.forEach(page => createNode(PageNode(page)));
        }).catch(ignoreNotFoundElseRethrow);

    return Promise.all([
        fetchPosts,
        fetchPages
    ]);
};

/**
 * Creates custom types based on the Ghost V3 API.
 *
 * This creates a fully custom schema, removing the need for dummy content or fake nodes.
 */
exports.createSchemaCustomization = ({actions}) => {
    const {createTypes} = actions;
    createTypes(ghostTypes);
};
