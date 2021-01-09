import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'

import { Layout, PostCard, Pagination } from '../components/common'
import { MetaData } from '../components/common/meta'

import Wings from '@wingscms/sdk';
import { Campaign } from '@wingscms/react'
import { IntlProvider } from 'react-intl'
import { WingsProvider } from '@wingscms/react';

/**
* Main index page (home page)
*
* Loads all posts from Ghost and uses pagination to navigate through them.
* The number of posts that should appear per page can be setup
* in /utils/siteConfig.js under `postsPerPage`.
*
*/
const messages = {
  "wings.CampaignForm.signupSubmit.text": "Verstuur",
  "wings.CampaignForm.emailField.label": "E-mailadres",
  "wings.CampaignForm.eventSubmit.text": "Neem deel",
  "wings.CampaignForm.firstNameField.label": "Voornaam",
  "wings.CampaignForm.lastNameField.label": "Achternaam",
  "wings.CampaignForm.addressField.label": "Adres",
  "wings.CampaignForm.zipcodeField.label": "Postcode",
  "wings.CampaignForm.cityField.label": "Stad",
  "wings.CampaignForm.countryField.label": "Land",
  "wings.CampaignForm.phoneField.label": "Telefoonnummer",
  "wings.CampaignForm.amountField.label": "Bedrag",
  "wings.Campaign.loading.text": "aan het laden",
  "wings.CampaignForm.newsletterField.label": "Blijf op de hoogte",
  "wings.CampaignForm.petitionSubmit.text": "Onderteken",
  "wings.CampaignForm.fundraiserSubmit.text": "Doneer",
  "wings.CampaignForm.privacyConsentField.label": "Ik ga akkoord met het <a>privacybeleid</a>",
  "wings.CampaignForm.termsField.label": "Ik ga akkoord met de <a href=\"{url}\" target=\"_blank\">algemene voorwaarden</a>",
}

const Index = ({ data, location, pageContext }) => {
    const posts = data.allGhostPost.edges
    const petition = data.wings.petition
    const wings = new Wings({
        project: process.env.GATSBY_WINGS_PROJECT,
        appKey: process.env.GATSBY_WINGS_APP_KEY,
        endpoint: process.env.GATSBY_WINGS_ENDPOINT,
    })
    const url = () => "https://bij1.org/iktelookmee"
    return (
        <>
            <MetaData location={location} />
            <Layout isHome={true}>
                    <WingsProvider client={wings}>
                    <IntlProvider locale="nl" messages={messages}>
                        <Campaign id={petition.id} resourceType={petition.resourceType} node={petition} redirectUrlForNode={url} />
                    </IntlProvider>
                    </WingsProvider>
                <div className="container">
                    <section className="post-feed">
                        {posts.map(({ node }) => (
                            // The tag below includes the markup for each post - components/common/PostCard.js
                            <PostCard key={node.id} post={node} />
                        ))}
                    </section>
                    <Pagination pageContext={pageContext} />
                </div>
            </Layout>
        </>
    )
}

Index.propTypes = {
    data: PropTypes.shape({
        allGhostPost: PropTypes.object.isRequired,
    }).isRequired,
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired,
    }).isRequired,
    pageContext: PropTypes.object,
}

export default Index

// This page query loads all posts sorted descending by published date
// The `limit` and `skip` values are used for pagination
export const pageQuery = graphql`
fragment NodeFields on Wings_Node {
  id
  title
  resourceType
  slug
  featured {
    title
    description
    image {
      url
    }
  }
  locale {
    id
    name
    primary
  }
  image {
    id
    name
    caption
    alt
    key
    url
  }
  meta {
    key
    value
  }
  data {
    key
    data
  }
  menu {
    id
    name
    items {
      text
      url
      items {
        text
        url
      }
    }
  }
  status
  nodeType
  platforms {
    search {
      title
      description
    }
    facebook {
      title
      description
      image {
        url
      }
    }
    twitter {
      title
      description
      image {
        url
      }
    }
    whatsapp {
      text
    }
    meta {
      tag
      attributes {
        key
        value
      }
    }
  }
}
fragment CampaignFields on Wings_Campaign {
  intro
  description
  submissionSchema
  settings {
    legal {
      terms {
        url
      }
      privacyPolicy {
        url
      }
    }
  }
}

  query GhostPostQuery($limit: Int!, $skip: Int!) {
    allGhostPost(
        sort: { order: DESC, fields: [published_at] },
        limit: $limit,
        skip: $skip
    ) {
      edges {
        node {
          ...GhostPostFields
        }
      }
    }
    wings {
      petition(selector: {id: {eq: "wzqVzXxGRZsE9P3w0KjJ"}}) {
      id
      title
      submissionSchema
      settings {
        legal {
          terms {
            url
          }
          privacyPolicy {
            url
          }
        }
      }
      signatureCount
      signatureGoal
      ...NodeFields
      ...CampaignFields
      }
    }
  }
`
