import {buildSchema} from "graphql";

export default buildSchema(`
    type TestData {
        text: String!
        views: Int!
    }
    type RootQuery {
        hello: String
    }
    schema {
        query: RootQuery
    }    
`);