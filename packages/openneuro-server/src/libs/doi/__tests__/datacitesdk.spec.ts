import config from "../../../config"
import datacite from '@api/datacite';

/*
  https://api.test.datacite.org
  Library defaults to test url.
  datacite.server(config.url)
  10.24397 <---- testing prefix
*/

describe("DOI minting utils", () => {
  it("imported", async () => {
    datacite.auth(config.doi.username, config.doi.password)

    await datacite.getClientsId({'id': 'sfl.openneuro'})
      .then(({ data }) => {
        console.log(data)
        console.log(data.data.relationships.prefixes)
      })
      .catch(err => {
        console.log(err)
      })
    /*
    await datacite.getClients({'provider-id': 'sfl'})
      .then(({ data }) => {
        console.log(data)
        console.log(data.data[3].relationships)
        console.log(data.data[3].attributes)
      })
      .catch(err => {
        console.log(err)
      })

    await datacite.getDois({'client-id': config.doi.username)
      .then(({ data }) => console.log(data))
      .catch(err => console.error(err));

    let attributes = {
      // "event": "publish",
      "doi": "10.24387/",
      "creators": [
        {
          "name": "DataCite Metadata Working Group"
        }
      ],
      "titles": [
        {
          "title": "DataCite Metadata Schema Documentation for the Publication and Citation of Research Data v4.0"
        }
      ],
      "publisher": "DataCite e.V.",
      "publicationYear": 2016,
      "types": {
        "resourceTypeGeneral": "text"
      },
      "url": "https://notadomain.org"
    }

    let draft = {"prefix": "10.24387"}

    // await datacite.postDois({data: {attributes: draft}})
    await datacite.postDois({data: {attributes}})
      .then(({ data }) => console.log(data))
      .catch((err) => {
        console.log(err)
        console.log(err.data.errors)
      });
    /*
    */

    expect(1).toEqual(1)
  })
})

