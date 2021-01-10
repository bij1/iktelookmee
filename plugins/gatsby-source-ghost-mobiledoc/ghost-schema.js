/**
 * Custom schema with types based on the Ghost V3 API spec.
 *
 * Note that GhostPost and GhostPage are identical.
 *
 * Foreign Keys are linked by 'slug'.
 *
 * `GhostNavigation` and `GhostPostCount` are custom types which do not become nodes.
 * They instead represent the shape of objects returned by the Ghost API for navigation and post count.
 */

const types = `
type GhostMobiledocPost implements Node {
    slug: String!
    id: ID!
    uuid: String!
    title: String!
    mobiledoc: String
}

type GhostMobiledocPage implements Node {
    slug: String!
    id: ID!
    uuid: String!
    title: String!
    mobiledoc: String
}
`;

module.exports = types;
