const createNodeHelpers = require('gatsby-node-helpers').default;

const {createNodeFactory} = createNodeHelpers({
    typePrefix: 'GhostMobiledoc'
});

const POST = 'Post';
const PAGE = 'Page';

const PostNode = createNodeFactory(POST);
const PageNode = createNodeFactory(PAGE);

module.exports = {
    PostNode,
    PageNode,
};
